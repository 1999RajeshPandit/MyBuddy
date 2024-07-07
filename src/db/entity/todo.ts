import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

@Entity("to_dos")
export class TODO {
  @PrimaryGeneratedColumn({ name: "id", primaryKeyConstraintName: "pk_to_dos" })
  id: number;

  @Column({ name: "title", type: "varchar", length: 50, nullable: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ name: "description", type: "varchar", length: 255, nullable: true })
  description?: string;

  @Column({ name: "status", type: "varchar", nullable: false })
  status: string;

  @Column({ name: "assigned_to", type: "integer", nullable: true })
  assignedTo: number;
  
  @Column({ name: "created_at", type: "timestamp", nullable: false })
  createdAt: Date;
}

export enum TODOStatus {
  NOTASSIGNED = "NOT-ASSIGNED",
  ASSIGNED = "ASSIGNED",
  INPROGRESS = "IN-PROGRESS",
  COMPLETED = "COMPLETED",
}
