import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	from: string;

	@Column()
	age: number;

	@Column({ type: 'decimal' })
	latitude: number;

	@Column({ type: 'decimal' })
	longitude: number;

	@Column()
	createdDate: string;
}
