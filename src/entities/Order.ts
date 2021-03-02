import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { User } from './User'

@Entity()
export class Order {
	@PrimaryColumn()
	id: string;

	@Column()
	product: string;

	@Column()
	createdDate: string;

	@ManyToOne(() => User, user => user.orders)
	user: User;
}
