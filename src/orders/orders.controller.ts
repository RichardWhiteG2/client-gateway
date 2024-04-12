import { Controller, Get, Post, Body,  Param,  Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto, OrderPaginationDto, StatusOrderDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll( @Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      );
      return order;
      
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Get(':status')
  async findallByStatus(
    @Param() statusOrderDto: StatusOrderDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.ordersClient.send('findAllOrders', {
       ...paginationDto,
        status: statusOrderDto.status, 
      });
      
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Patch(':id')
  changesStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusOrderDto: StatusOrderDto,
  ) {
    try {
      return this.ordersClient.send('changeOrderStatus', {
        id,
        status: statusOrderDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }
  

}
