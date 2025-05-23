import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Bill} from '../../sales/services/sales.service';
import {environment} from '../../../../../../enviroments/enviroment.prod';

export interface Customer {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/users/getAllCustomers`);
  }

  getOrderCountByCustomer(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/orders/countByCustomer/${id}`);
  }

  getPaysByCustomer(id: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/byCustomer/${id}`);
  }

  disableCustomer(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/disable`, {});
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/users/register`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/users/update/${id}`, customer);
  }
}
