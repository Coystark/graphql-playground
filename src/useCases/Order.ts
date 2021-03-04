import haversine from 'haversine'
import { Order } from '../entities/Order'
import { User } from '../entities/User'

import { getManager} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import userUseCase from './User';

interface ICreateOrder {
  product: string;
  address: string;
  user: string;
  latitude: number;
  longitude: number;
}
interface IGetAllOrdersRequest {
  id?: string;
  location?: { 
    latitude: number;
    longitude: number;
    radius: number;
  }
}

interface IOrder  extends Order {
  distance?: number;
}

type IGetOrdersResponse = IOrder[]

const orderUseCase = {
  create: async (data: ICreateOrder): Promise<string> => {

    const isValidUser = await userUseCase.isValidId(data.user)

    if (!isValidUser) {
      throw new Error('invalid-user')
    }

    const manager = getManager()

    const order = new Order()

    order.id = uuidv4()
    order.product = data.product
    order.address = data.address
    order.createdDate = new Date().toDateString()
    order.location = {
      type: "Point",
      coordinates: [data.latitude, data.longitude]
    }
    order.latitude = data.latitude
    order.longitude = data.longitude

    const user = new User()

    user.id = data.user
    order.user = user

    await manager.save(order)

    return order.id
  },
  getAll: async (data: IGetAllOrdersRequest): Promise<IGetOrdersResponse> => {
    const { id, location } = data

    const manager = getManager()

    const query = manager
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')

    if (id) {
      query.where('order.id = :id', { id })
    }

    if (location) {
      query.where(`ST_DWithin(order.location, ST_MakePoint(${location.latitude}, ${location.longitude})::geography, ${location.radius * 1000})`)
    }

    const ret = await query.getMany() 

    const ret2 = location 
      ? ret.map((order) => {
        const distance = haversine(
          {
            latitude: location.latitude,
            longitude: location.longitude
          },
          {
            latitude: order.latitude,
            longitude: order.longitude,
          }
        )

        return {
          ...order,
          distance: Math.round(distance)
        }})
      : null

    return ret2 ?? ret
  },
}

export default orderUseCase