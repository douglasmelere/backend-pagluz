import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CLIENT = 'client',
  INACTIVE = 'inactive',
}

export enum InstallationType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RURAL = 'rural',
}

export enum CustomerType {
  GENERATOR = 'generator',
  CONSUMER = 'consumer',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informações pessoais
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  cpfCnpj: string;

  // Endereço
  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column({ nullable: true })
  complement: string;

  // Informações da instalação
  @Column({
    type: 'simple-enum',
    enum: InstallationType,
    default: InstallationType.RESIDENTIAL,
  })
  installationType: InstallationType;

  @Column({
    type: 'simple-enum',
    enum: CustomerType,
    default: CustomerType.CONSUMER,
  })
  customerType: CustomerType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyEnergyConsumption: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyEnergyBill: number;

  @Column({ nullable: true })
  roofType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  availableRoofArea: number;

  // Status e observações
  @Column({
    type: 'simple-enum',
    enum: CustomerStatus,
    default: CustomerStatus.LEAD,
  })
  status: CustomerStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Datas
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastContactDate: Date;
}