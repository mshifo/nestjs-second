import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Seeder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}