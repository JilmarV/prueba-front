import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../../../enviroments/enviroment.prod';

export interface Kpis {
  totalSales: number;
  totalOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  averageTicket: number;
  bestCustomer: string;
  mostSoldProduct: string;
  lastOrderDate: string;
  dayWithLeastSales: string;
  cancelledOrders: number;
  averageTimeOrderToBill: number;
}

export interface ChartData {
  name: string;  // swimlane charts esperan `name` no `label`
  value?: number;
  sales?: number;
  orders?: number;
}

export interface StatisticsResponse {
  kpis: Kpis;
  charts: {
    salesOverTime: ChartData[];
    ordersOverTime: ChartData[] | null;
    ordersByState: ChartData[];
    paidVsUnpaid: ChartData[];
    topCustomers: ChartData[];
    topProducts: ChartData[];
    salesByCategory: ChartData[] | null;
    revenueByProduct: ChartData[] | null;
    salesComparisonMonth: ChartData[] | null;
    customerComparison: ChartData[] | null;
  };
}


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl + '/statistics/general';

  constructor(private http: HttpClient) {}

  getGlobalStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(this.apiUrl);
  }
}
