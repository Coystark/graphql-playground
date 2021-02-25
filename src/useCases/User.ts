import { User } from '../entities/User'
import { getManager} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

interface ICreateUser {
  name: string;
  age: number;
  from: string;
  latitude: number;
  longitude: number;
}

interface IUpdateUser {
  id: string;
  name?: string;
  age?: number;
  from?: string;
  latitude?: number;
  longitude?: number;
}

interface IDeleteUser {
  id: string;
}

const userUseCase = {
  create: async (data: ICreateUser): Promise<string> => {
    const manager = getManager()

    const user = new User()

    user.id = uuidv4()
    user.name = data.name
    user.age = data.age
    user.from = data.from
    user.createdDate = new Date().toDateString()
    user.latitude = data.latitude
    user.longitude = data.longitude

    await manager.save(user)

    return user.id
  },
  delete: async ({ id }: IDeleteUser): Promise<void> => {
    const manager = getManager()

    const userRepo = manager.getRepository(User)

    const user = await userRepo.findOne(id)

    if (!user) {
      throw new Error('not found')
    }

    await userRepo.delete(id)
  },
  update: async (data: IUpdateUser): Promise<void> => {
    const manager = getManager()

    const userRepo = manager.getRepository(User)
  
    const user = await userRepo.findOne(data.id)

    if (!user) {
      throw new Error('not found')
    }

    await userRepo.save({
      ...user,
      ...data,
    } as User)

  }
}

export default userUseCase