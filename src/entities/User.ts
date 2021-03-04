import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Order } from './Order'

@Entity()
export class User {
	@PrimaryColumn({ nullable: false })
	id: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false })
	from: string;

	@Column({ nullable: false })
	age: number;

	@Column({ nullable: false })
	createdDate: string;

	@OneToMany(() => Order, order => order.user)
	orders: Order[];
}
