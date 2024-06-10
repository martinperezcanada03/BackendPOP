export class CreateProductDto {
  readonly nombre: string;
  readonly descripcion?: string;
  readonly precio: number;
  readonly imagen?: string;
  readonly userId?: string;
}
