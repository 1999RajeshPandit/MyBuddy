import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ name: "id", primaryKeyConstraintName: "pk_users" })
  id: number;

  @Column({ name: "first_name", type: "varchar", length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column({ name: "last_name", type: "varchar", length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({ name: "email", type: "varchar", length: 100, nullable: false })
  @IsEmail()
  email: string;

  @Column({ name: "password", type: "varchar", length: 255, nullable: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column({
    name: "profile_image",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  profileImage: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({ name: "is_manager", type: "boolean", default: false })
  isManager: boolean;

  @Column({
    name: "token",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  token?: string;
}
