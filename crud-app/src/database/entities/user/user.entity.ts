import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'users', name: 'user' })
export class User {

  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "now()" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt: Date;
}