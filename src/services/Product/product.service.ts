import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/dtos/Product/createProduct.dto';
import { UpdateProductDto } from 'src/dtos/Product/updateProduct.dto';
import { Product } from 'src/schemas/product';


@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

  async createProduct(createProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async getAllProducts({ page = 1, limit = 10, sortOrder, orderByPrice, orderByName }): Promise<Product[]> {
    try {
      let query = this.productModel.find();

      if (sortOrder === 'asc' && orderByPrice) {
        query = query.sort({ price: 1 });
      } else if (sortOrder === 'desc' && orderByPrice) {
        query = query.sort({ price: -1 });
      } else if (sortOrder === 'asc' && orderByName) {
        query = query.sort({ nombre: 1 });
      } else if (sortOrder === 'desc' && orderByName) {
        query = query.sort({ nombre: -1 });
      }

      const skip = (page - 1) * limit;
      const products = await query.skip(skip).limit(limit).exec();
      return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw new UnauthorizedException('Error al obtener los productos');
    }
  }



  async getAllProductsCount(): Promise<number> {
    try {
      const count = await this.productModel.countDocuments();
      return count;
    } catch (error) {
      console.error('Error al obtener el número total de productos:', error);
      throw new UnauthorizedException('Error al obtener el número total de productos');
    }
  }


  async getProductsCountSearch(searchTerm: string): Promise<number> {
    try {
      const count = await this.productModel.countDocuments({ nombre: { $regex: searchTerm, $options: 'i' } });
      return count;
    } catch (error) {
      console.error('Error al obtener el número total de productos con búsqueda:', error);
      throw new UnauthorizedException('Error al obtener el número total de productos con búsqueda');
    }
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId }).exec();
  }


  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }


  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!existingProduct) {
      throw new UnauthorizedException('Producto no encontrado');
    }
    return existingProduct;
  }

  async deleteProduct(id: string) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new UnauthorizedException('Producto no encontrado');
    }
    return deletedProduct;
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const products = await this.productModel.find({ nombre: { $regex: searchTerm, $options: 'i' } }).exec();
      return products;
    } catch (error) {
      console.error('Error al buscar productos por nombre:', error);
      throw new UnauthorizedException('Error al buscar productos por nombre');
    }
  }
}
