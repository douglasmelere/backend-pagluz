import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  IsDateString,
} from 'class-validator';
import {
  CustomerStatus,
  CustomerType,
  InstallationType,
} from './customer.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nome completo do cliente' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do cliente' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ description: 'Telefone do cliente' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'CPF ou CNPJ do cliente' })
  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: CustomerType,
    default: CustomerType.CONSUMER,
  })
  @IsEnum(CustomerType, { message: 'Tipo de cliente inválido' })
  customerType: CustomerType;

  @ApiProperty({ description: 'Endereço completo' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Cidade' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado (UF)' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  state: string;

  @ApiProperty({ description: 'CEP' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  zipCode: string;

  @ApiPropertyOptional({ description: 'Complemento do endereço' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    description: 'Tipo de instalação',
    enum: InstallationType,
  })
  @IsEnum(InstallationType, { message: 'Tipo de instalação inválido' })
  installationType: InstallationType;

  @ApiPropertyOptional({ description: 'Consumo mensal de energia (kWh)' })
  @IsOptional()
  @IsNumber()
  monthlyEnergyConsumption?: number;

  @ApiPropertyOptional({ description: 'Valor mensal da conta de energia (R$)' })
  @IsOptional()
  @IsNumber()
  monthlyEnergyBill?: number;

  @ApiPropertyOptional({ description: 'Tipo de telhado' })
  @IsOptional()
  @IsString()
  roofType?: string;

  @ApiPropertyOptional({ description: 'Área disponível no telhado (m²)' })
  @IsOptional()
  @IsNumber()
  availableRoofArea?: number;

  @ApiPropertyOptional({
    description: 'Status do cliente',
    enum: CustomerStatus,
  })
  @IsOptional()
  @IsEnum(CustomerStatus, { message: 'Status inválido' })
  status?: CustomerStatus;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Data do último contato' })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'lastContactDate deve ser uma string de data ISO 8601 válida' },
  )
  lastContactDate?: string; // MUDANÇA AQUI: de Date para string
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Nome completo do cliente' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Email do cliente' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Telefone do cliente' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Tipo de cliente',
    enum: CustomerType,
  })
  @IsOptional()
  @IsEnum(CustomerType, { message: 'Tipo de cliente inválido' })
  customerType?: CustomerType;

  @ApiPropertyOptional({ description: 'CPF ou CNPJ do cliente' })
  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @ApiPropertyOptional({ description: 'Endereço completo' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Estado (UF)' })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  state?: string;

  @ApiPropertyOptional({ description: 'CEP' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Complemento do endereço' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional({
    description: 'Tipo de instalação',
    enum: InstallationType,
  })
  @IsOptional()
  @IsEnum(InstallationType, { message: 'Tipo de instalação inválido' })
  installationType?: InstallationType;

  @ApiPropertyOptional({ description: 'Consumo mensal de energia (kWh)' })
  @IsOptional()
  @IsNumber()
  monthlyEnergyConsumption?: number;

  @ApiPropertyOptional({ description: 'Valor mensal da conta de energia (R$)' })
  @IsOptional()
  @IsNumber()
  monthlyEnergyBill?: number;

  @ApiPropertyOptional({ description: 'Tipo de telhado' })
  @IsOptional()
  @IsString()
  roofType?: string;

  @ApiPropertyOptional({ description: 'Área disponível no telhado (m²)' })
  @IsOptional()
  @IsNumber()
  availableRoofArea?: number;

  @ApiPropertyOptional({
    description: 'Status do cliente',
    enum: CustomerStatus,
  })
  @IsOptional()
  @IsEnum(CustomerStatus, { message: 'Status inválido' })
  status?: CustomerStatus;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Data do último contato' })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'lastContactDate deve ser uma string de data ISO 8601 válida' },
  )
  lastContactDate?: string; // MUDANÇA AQUI: de Date para string
}

export class FilterCustomersDto {
  @ApiPropertyOptional({ description: 'Filtrar por status' })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de instalação' })
  @IsOptional()
  @IsEnum(InstallationType)
  installationType?: InstallationType;

  @ApiPropertyOptional({ description: 'Filtrar por cidade' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Buscar por nome ou email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de cliente',
    enum: CustomerType,
  })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;
}
