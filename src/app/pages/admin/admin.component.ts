import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NgForOf } from '@angular/common';
import {AdminService} from './services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) {}

  stats = [
    { label: 'Ingresos', value: '$0', icon: '💰'},
    { label: 'Egresos', value: '$0', icon: '📤'},
    { label: 'Ordenes', value: 0, icon: '🛒'},
    { label: 'Huevos en stock', value: 0, icon: '🥚'},
    { label: 'Clientes', value: 0, icon: '👥'},
    { label: 'Empleados', value: 0, icon: '🧑‍🍳'},
    { label: 'Visitas a la web', value: 0, icon: '🌐'}
  ];

  areas = [
    { nombre: 'Productos', ruta: '/admin/products', icon: '📦' },
    { nombre: 'Ventas', ruta: '/admin/sales', icon: '🧾' },
    { nombre: 'Estadísticas', ruta: '/admin/statistics', icon: '📈' },
    { nombre: 'Inventarios', ruta: '/admin/inventarios', icon: '📋' },
    { nombre: 'Clientes', ruta: '/admin/customers', icon: '👥' },
    { nombre: 'Recursos Humanos', ruta: '/admin/rrhh', icon: '🧑‍💼' },
    { nombre: 'Finanzas', ruta: '/admin/finanzas', icon: '💸' },
    { nombre: 'Configuración', ruta: '/admin/configuracion', icon: '⚙️' }
  ];

  irARuta(ruta: string): void {
    this.router.navigate([ruta]);
  }

  ngOnInit(): void {
    // Visitas
    this.adminService.getVisitCount().subscribe(count => {
      const visitasStat = this.stats.find(stat => stat.label === 'Visitas a la web');
      if (visitasStat) {
        visitasStat.value = count;
      }
    });

    // Ingresos
    this.adminService.getTotalIncomeCurrentMonth().subscribe(count => {
      const ingresosStat = this.stats.find(stat => stat.label === 'Ingresos');
      if (ingresosStat) {
        ingresosStat.value = `$${count.toLocaleString()}`;
      }
    });

    // Órdenes
    this.adminService.getTotalOrdersCurrentMonth().subscribe(count => {
      const ordenesStat = this.stats.find(stat => stat.label === 'Ordenes');
      if (ordenesStat) {
        ordenesStat.value = count;
      }
    });

    // Huevos en stock
    this.adminService.getTotalEggsInStock().subscribe(count => {
      const huevosStat = this.stats.find(stat => stat.label === 'Huevos en stock');
      if (huevosStat) {
        huevosStat.value = count;
      }
    });

    // Clientes
    this.adminService.getTotalClients().subscribe(count => {
      const clientesStat = this.stats.find(stat => stat.label === 'Clientes');
      if (clientesStat) {
        clientesStat.value = count;
      }
    });

    // Empleados
    this.adminService.getTotalEmployees().subscribe(count => {
      const empleadosStat = this.stats.find(stat => stat.label === 'Empleados');
      if (empleadosStat) {
        empleadosStat.value = count;
      }
    });
  }
}
