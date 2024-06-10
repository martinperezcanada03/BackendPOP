import { Controller, Post, Get, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { CreateProductDto } from 'src/dtos/Product/createProduct.dto';
import { UpdateProductDto } from 'src/dtos/Product/updateProduct.dto';
import { Product } from 'src/schemas/product';
import { ProductService } from 'src/services/Product/product.service';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getAllProducts(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('sortOrder') sortOrder: string, @Query('orderByPrice') orderByPrice: string, @Query('orderByName') orderByName: string): Promise<{ status: string; data: Product[] }> {
    try {
      const products = await this.productService.getAllProducts({ page, limit, sortOrder, orderByPrice, orderByName });
      return { status: 'Ok', data: products };
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  }

  @Get('count')
  async getAllProductsCount(): Promise<{ status: string; count: number }> {
    try {
      const count = await this.productService.getAllProductsCount();
      return { status: 'Ok', count };
    } catch (error) {
      console.error('Error in getAllProductsCount:', error);
      throw error;
    }
  }

  @Get('search/count')
  async getProductsCountSearch(@Query('q') searchTerm: string): Promise<{ status: string; count: number }> {
    try {
      const count = await this.productService.getProductsCountSearch(searchTerm);
      return { status: 'Ok', count };
    } catch (error) {
      console.error('Error in getProductsCountWithSearch:', error);
      throw error;
    }
  }
  @Get('search')
  async searchProducts(@Query('q') searchTerm: string): Promise<{ status: string; data: Product[] }> {
    try {
      const products = await this.productService.searchProducts(searchTerm);
      return { status: 'Ok', data: products };
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get(':userId/productos')
  async getUserProducts(@Param('userId') userId: string): Promise<Product[]> {
    return this.productService.getUserProducts(userId);
  }


  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
