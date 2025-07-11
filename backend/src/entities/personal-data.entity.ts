import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('personal_data')
export class PersonalData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.personalDataRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fullName: string;

  @Column()
  businessName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  businessRegNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logo: string; // URL to logo image

  @Column({ type: 'text', nullable: true })
  bankDetails: string;

  @Column({ type: 'text', nullable: true })
  paymentInstructions: string;

  @Column({ type: 'text', nullable: true })
  defaultInvoiceTerms: string;

  @Column({ type: 'text', nullable: true })
  signature: string; // URL to signature image

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 