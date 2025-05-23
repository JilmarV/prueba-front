import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {DatePipe, DecimalPipe, NgClass} from '@angular/common';
import {Bill, SalesService} from './services/sales.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [MatTableModule, DatePipe, NgClass, DecimalPipe],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  bills: Bill[] = [];
  totalVentas = 0;
  ventasTotales = 0;
  clienteTop = 'Sin registros';
  displayedColumns: string[] = [
    'cliente',
    'fechaOrden',
    'estado',
    'total',
    'fechaFactura',
    'pagado'
  ];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.salesService.getBills().subscribe(data => {
      this.bills = data;
    });

    this.salesService.getSalesTotal().subscribe(data => {
      this.totalVentas = data;
    });

    this.salesService.getBestCustomer().subscribe(response => {
      this.clienteTop = response;
    });

    this.salesService.getNumberOfBills().subscribe(data => {
      this.ventasTotales = data;
    });
  }


}
