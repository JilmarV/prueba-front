import { Injectable } from '@angular/core';
import {environment} from '../../../../../../enviroments/enviroment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../../../../components/product/services/product.service';

export interface TypeEgg{
  id: number;
  type: string;
}

export interface Supplier{
  id: number;
  name: string;
  address: string;
  typeEggs: TypeEgg[];
}
@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/eggs/getAll`);
  }

  saveProduct(product: Product){
    return this.http.post<Product>(`${this.apiUrl}/eggs/save`, product);
  }

  getProductById(id: number){
    return this.http.get<Product>(`${this.apiUrl}/eggs/${id}`);
  }

  deleteProduct(id: number){
    return this.http.delete<void>(`${this.apiUrl}/eggs/delete/${id}`);
  }

  getAllEggTypes(): Observable<TypeEgg[]>{
    return this.http.get<TypeEgg[]>(`${this.apiUrl}/egg-types/getAll`);
  }

  getAllSuppliers(): Observable<Supplier[]>{
    return this.http.get<Supplier[]>(`${this.apiUrl}/suppliers/getAll`);
  }
}
