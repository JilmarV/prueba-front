import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerVisit() {
    return this.http.post(`${this.api}/visits`, {}).subscribe();
  }

  getVisitCount() {
    return this.http.get<number>(`${this.api}/visits/count`);
  }

  getTotalIncomeCurrentMonth() {
    return this.http.get<number>(`${this.api}/payments/totalIncomeCurrentMonth`);
  }

  getTotalOrdersCurrentMonth() {
    return this.http.get<number>(`${this.api}/orders/countCurrentMonth`);
  }

  getTotalEggsInStock() {
    return this.http.get<number>(`${this.api}/eggs/totalQuantity`);
  }

  getTotalClients() {
    return this.http.get<number>(`${this.api}/users/count/clients`);
  }

  getTotalEmployees() {
    return this.http.get<number>(`${this.api}/users/count/employees`);
  }
}
