import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Geometry, Point } from 'geojson';
import { User } from './User'

@Entity()
export class Order {
	@PrimaryColumn({ nullable: false })
	id: string;

	@Column({ nullable: false })
	product: string;

	@Column({ nullable: false })
	address: string;

	@Column({ nullable: false })
	createdDate: string;

	@Column({ type: "geometry" })
	location: Geometry;

	@Column({ type: 'decimal', nullable: false })
	latitude: number;

	@Column({ type: 'decimal', nullable: false })
	longitude: number;

	@ManyToOne(() => User, user => user.orders, { eager: true })
	user: User;
}
