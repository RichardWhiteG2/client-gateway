import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productsClient: ClientProxy
  ) {}


  @Post()
  createProduct() {
    return 'This action adds a new product';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto)
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {

    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err)})
      )
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;
      
    // } catch (error) {
    //   throw new RpcException(error);
    // }
    // return 'This action returns the product ' + id;

  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'This action deletes the product ' + id;
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return 'This action updates the product ' + id;
  }
  
}
