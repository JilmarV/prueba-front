import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../enviroments/enviroment.prod';

export interface Bill {
  id: number;
  issueDate: string;
  totalPrice: number;
  paid: boolean;
  customerName: string;
  orderDate: string;
  orderState: string;
}


@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/getAll`);
  }

  getSalesTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/bills/monthlySalesTotal`);
  }

  getBestCustomer() {
    return this.http.get<string>(`${this.apiUrl}/bills/bestCustomer`, { responseType: 'text' as 'json' });
  }

  getNumberOfBills(): Observable<number>  {
    return this.http.get<number>(`${this.apiUrl}/bills/countThisMonth`);
  }


}
