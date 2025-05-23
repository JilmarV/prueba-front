import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { PieChartModule, LineChartModule, BarChartModule } from '@swimlane/ngx-charts';
import { StatisticsService, StatisticsResponse } from './services/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PieChartModule,
    LineChartModule,
    BarChartModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  loading = true;
  error: string | null = null;

  statistics: StatisticsResponse = {
    kpis: {
      totalSales: 0,
      totalOrders: 0,
      paidOrders: 0,
      unpaidOrders: 0,
      averageTicket: 0,
      bestCustomer: '',
      mostSoldProduct: '',
      lastOrderDate: '',
      dayWithLeastSales: '',
      cancelledOrders: 0,
      averageTimeOrderToBill: 0
    },
    charts: {
      paidVsUnpaid: [],
      ordersByState: [],
      ordersOverTime: [],
      topCustomers: [],
      topProducts: [],
      salesOverTime: [],
      salesByCategory: [],
      revenueByProduct: [],
      salesComparisonMonth: [],
      customerComparison: []
    }
  };

  viewPie: [number, number] = [500, 250];
  viewLine: [number, number] = [700, 300];
  viewBar: [number, number] = [700, 300];

  ordersOverTimeChartData: { name: string; series: { name: string; value: number }[] }[] = [];

  kpiStats: { label: string; value: string | number; icon: string }[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;

    this.statisticsService.getGlobalStatistics().subscribe({
      next: (data) => {
        this.statistics = data ?? this.statistics;
        this.updateOrdersOverTimeChartData();
        this.fillKpiStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar estadísticas';
        this.loading = false;
      }
    });
  }

  updateOrdersOverTimeChartData(): void {
    const ordersData = this.statistics?.charts?.ordersOverTime;
    this.ordersOverTimeChartData = [{
      name: 'Órdenes',
      series: ordersData?.map(item => ({
        name: item.name ?? '',
        value: item.value ?? 0
      })) || []
    }];
  }

  fillKpiStats(): void {
    const k = this.statistics.kpis;

    this.kpiStats = [
      { label: 'Total de ventas', value: k.totalSales?.toLocaleString(undefined, { minimumFractionDigits: 2 }), icon: '💰' },
      { label: 'Órdenes totales', value: k.totalOrders, icon: '🧾' },
      { label: 'Órdenes pagadas', value: k.paidOrders, icon: '✅' },
      { label: 'Órdenes no pagadas', value: k.unpaidOrders, icon: '❌' },
      { label: 'Ticket promedio', value: k.averageTicket?.toLocaleString(undefined, { minimumFractionDigits: 2 }), icon: '🧮' },
      { label: 'Mejor cliente', value: k.bestCustomer || 'N/A', icon: '🏆' },
      { label: 'Producto más vendido', value: k.mostSoldProduct || 'N/A', icon: '🥚' },
      { label: 'Última orden', value: k.lastOrderDate || 'N/A', icon: '🕒' },
      { label: 'Día con menos ventas', value: k.dayWithLeastSales || 'N/A', icon: '📉' },
      { label: 'Órdenes canceladas', value: k.cancelledOrders, icon: '🚫' },
      { label: 'Tiempo prom. orden a factura', value: k.averageTimeOrderToBill?.toLocaleString(undefined, { minimumFractionDigits: 2 }), icon: '⏱️' }
    ];
  }

  hasData(array: any[] | undefined | null): boolean {
    return Array.isArray(array) && array.length > 0;
  }
}
