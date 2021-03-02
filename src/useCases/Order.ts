import { Order } from '../entities/Order'
import { User } from '../entities/User'

import { getManager} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

interface ICreateOrder {
  product: string;
  user: string;
}


interface IGetAllOrders {
  id?: string;
}

const orderUseCase = {
  create: async (data: ICreateOrder): Promise<string> => {
    const manager = getManager()

    const order = new Order()

    order.id = uuidv4()
    order.product = data.product
    order.createdDate = new Date().toDateString()

    await manager.save(order)

    const user = new User()

    user.id = data.user
    user.orders = [order]

    await manager.save(user)

    return user.id
  },
  getAll: async (data: IGetAllOrders): Promise<Order[]> => {
    const manager = getManager()

    const orderRepo = manager.getRepository(Order)

    const where = data.id 
      ? {
        id: data.id
      }
      : undefined

    const orders = await orderRepo.find({ 
      ...where,
      relations: ['user'] 
    })

    console.log(orders)

    return orders
  },
}

export default orderUseCase