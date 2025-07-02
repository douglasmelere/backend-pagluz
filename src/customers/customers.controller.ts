import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, FilterCustomersDto } from './customer.dto';
import { Customer } from './customer.entity';

@ApiTags('customers')
@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Cliente já existe' })
  create(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @ApiQuery({ name: 'status', required: false, enum: ['lead', 'prospect', 'client', 'inactive'] })
  @ApiQuery({ name: 'installationType', required: false, enum: ['residential', 'commercial', 'industrial', 'rural'] })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'customerType', required: false, enum: ['generator', 'consumer'] })
  findAll(@Query() filters: FilterCustomersDto): Promise<Customer[]> {
    return this.customersService.findAll(filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas dos clientes' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos clientes' })
  getStatistics(): Promise<any> {
    return this.customersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Get(':id/solar-potential')
  @ApiOperation({ summary: 'Calcular potencial solar do cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cálculo do potencial solar' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Cliente não possui dados suficientes' })
  calculateSolarPotential(@Param('id') id: string): Promise<any> {
    return this.customersService.calculateSolarPotential(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente excluído' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}