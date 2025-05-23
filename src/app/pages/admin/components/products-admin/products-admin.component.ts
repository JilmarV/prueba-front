import { Component, OnInit } from '@angular/core';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Product} from '../../../../components/product/services/product.service';
import {ProductAdminService, Supplier, TypeEgg} from './service/product-admin.service';
import {FormsModule, NgForm} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  imports: [
    FormsModule,
    DecimalPipe,
    NgClass,
    MatIcon,
    MatTableModule,
    NgForOf
  ],
  styleUrl: './products-admin.component.css'
})

export class ProductsAdminComponent implements OnInit{
  selectedTypeId?: number;
  selectedSupplierId?: number;
  types: TypeEgg[] = [];
  products: Product[] = [];
  suppliers: Supplier[] = [];
  product: Product = this.createEmptyProduct();

  allProducts: number = 0;
  productsInStock = 0;
  mostExpensiveProduct: string = 'N/A';

  displayColumns: string[] = ['nombre', 'color', 'buyPrice', 'salePrice', 'quantity', 'acciones'];

  constructor(private productService: ProductAdminService) {}

  ngOnInit(): void {
    this.uploadProducts();
    this.loadEggTypes();
    this.loadSupplier();

  }

  createEmptyProduct(): Product {
    return {
      id: 0,
      buyPrice: 0,
      color: '',
      expirationDate: '',
      inventory: {
        id: 0,
        nameProduct: '',
        entryDate: '',
        totalQuantity: 0,
      },
      avibleQuantity: 0,
      salePrice: 0,
      supplier: {
        id: 0,
        name: '',
        address: '',
        typeEggs: [{ id: 0, type: '' }],
      },
      type: {
        id: 0,
        type: '',
      },
      imagen: '',
      nombre: ''
    };
  }

  uploadProducts(): void{
    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.calculateSummary();
        console.log(data)
      },
      error => {
        console.log('Error al cargar los productos:', error);
      }
    );
  }

  loadEggTypes() {
    this.productService.getAllEggTypes().subscribe({
      next: (data) => {
        this.types = data;
        console.log(data);
      },
      error: (err) => console.error('Error al cargar tipos de huevo', err)
    });
  }

  loadSupplier(){
    this.productService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        console.log(data);
      },
      error: (err) => console.error('Error al cargar los suppliers', err)
    });
  }

  calculateSummary(): void{
    this.allProducts = this.products.length;
    this.productsInStock = this.products.filter(p => p.avibleQuantity > 0).length;

    if(this.products.length > 0){
      const expensiveProduct = this.products.reduce((prev, current) =>
        (prev.salePrice > current.salePrice) ? prev : current
      );
      this.mostExpensiveProduct = `${expensiveProduct.type.type} ($${expensiveProduct.salePrice})`;
    }else{
      this.mostExpensiveProduct = 'N/A';
    }
  }

  onSubmit(form: NgForm): void {
    const selectedType = this.types.find(t => t.id === this.selectedTypeId);
    if (selectedType) {
      this.product.type = selectedType;
    }
    const selectedSupplier = this.suppliers.find(s => s.id === this.selectedSupplierId);
    if(selectedSupplier){
      this.product.supplier = selectedSupplier;
    }

    if (form.valid) {
      if (this.product.id) {
        this.updateProduct(form);
      } else {
        this.createProduct(form);
      }
    }
  }

  updateProduct(form: NgForm):void{
    this.productService.saveProduct(this.product).subscribe(
      (updateProduct: Product) => {
        const index = this.products.findIndex(p => p.id === updateProduct.id);
        if(index !== -1){
          this.products[index] = updateProduct;
        }
        this.resetForm(form);
      },
      error => {
        console.error('Error al actualizar el producto', error);
      }
    );
  }

  createProduct(form: NgForm):void{
    this.productService.saveProduct(this.product).subscribe(
      (newProduct: Product) => {
        this.products.push(newProduct);
        this.resetForm();
        this.calculateSummary();
      },
      error => {
        console.error('Error al crear el producto', error);
        console.log(this.product);
      }
    )
  }

  deleteProduct(id: number): void{
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== id);
        this.calculateSummary();
      },
      error => {
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  resetForm(form?: NgForm): void{
    if(form){
      form.resetForm();
    }
    this.product = this.createEmptyProduct();
  }
}
