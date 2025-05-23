import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../../../enviroments/enviroment.prod';

/*
export interface Product {
  nombre: String;
  descripcion: String;
  precio: number;
  imagen: String;
}
 */

export interface Product {
  id: number;
  buyPrice: number;
  color: string;
  expirationDate: string;
  inventory: {
    id: number;
    nameProduct: string;
    entryDate: string;
    totalQuantity: number;
  };
  avibleQuantity: number;
  salePrice: number;
  supplier: {
    id: number;
    name: string;
    address: string;
    typeEggs: { id: number, type: string }[];
  };
  type: {
    id: number;
    type: string;
  };
  imagen: string;
  nombre: string;
}



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/eggs/getAll`);
  }
}
