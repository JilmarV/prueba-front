import { Component, Inject, OnInit } from '@angular/core';
import {CurrencyPipe, NgClass, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Customer, CustomersService} from './services/customers.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [NgIf, FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule, MatPaginator,  MatInput, MatSuffix, MatProgressBar, MatFormField],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  filtro: string = '';
  currentPage = 0;
  itemsPerPage = 10;

  displayedColumns: string[] = ['username', 'email', 'telefono', 'acciones'];

  constructor(private customersService: CustomersService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customersService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Ocurrió un error al cargar los clientes.', 'error');
        console.error(err);
      }
    });
  }

  get filteredCustomers(): Customer[] {
    const filtroLower = this.filtro.toLowerCase();
    return this.customers.filter(c =>
      c.username?.toLowerCase().includes(filtroLower) ||
      c.email?.toLowerCase().includes(filtroLower) ||
      c.address?.toLowerCase().includes(filtroLower) ||
      c.phoneNumber?.toLowerCase().includes(filtroLower)
    );
  }

  get paginatedCustomers(): Customer[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.filteredCustomers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }

  onPageChange(event: PageEvent): void {
    this.itemsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  verDetalle(cliente: Customer): void {
    this.loading = true;
    import('rxjs').then(({ forkJoin }) => {
      forkJoin({
        orderCount: this.customersService.getOrderCountByCustomer(cliente.id),
        pays: this.customersService.getPaysByCustomer(cliente.id)
      }).subscribe({
        next: ({ orderCount, pays }) => {
          this.loading = false;
          this.dialog.open(CustomerDetailDialogComponent, {
            width: '600px',
            data: { cliente, orderCount, pays }
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', 'No se pudieron cargar los detalles del cliente.', 'error');
          console.error(err);
        }
      });
    });
  }

  deleteCustomer(id: number): void {
    Swal.fire({
      title: '¿Deshabilitar cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customersService.disableCustomer(id).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.id !== id);
            Swal.fire('Deshabilitado', 'El cliente ha sido deshabilitado.', 'success');
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo deshabilitar el cliente.', 'error');
            console.error(error);
          }
        });
      }
    });
  }
}


@Component({
  selector: 'app-customer-detail-dialog',
  standalone: true,
  imports: [
    NgIf,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    NgClass,
    CurrencyPipe,
    MatIconButton,
  ],
  template: `
    <h2 mat-dialog-title>
      🧾 Detalles del Cliente
      <button mat-icon-button (click)="dialogRef.close()" style="float: right;">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content class="mat-typography">

      <!-- Información del Cliente -->
      <section class="mb-4">
        <h3 class="mat-subheading-2">👤 Información del Usuario</h3>
        <mat-list>
          <mat-list-item><strong>Usuario:</strong> {{ data.cliente.username }}</mat-list-item>
          <mat-list-item><strong>Email:</strong> {{ data.cliente.email }}</mat-list-item>
          <mat-list-item><strong>Dirección:</strong> {{ data.cliente.address }}</mat-list-item>
          <mat-list-item><strong>Teléfono:</strong> {{ data.cliente.phoneNumber }}</mat-list-item>
        </mat-list>
      </section>

      <!-- Órdenes -->
      <section class="mb-4">
        <h3 class="mat-subheading-2">📦 Órdenes del Cliente</h3>
        <p *ngIf="data.orderCount > 0">
          Total de órdenes realizadas: <strong>{{ data.orderCount }}</strong>
        </p>
        <p *ngIf="data.orderCount === 0" class="empty-message">Sin órdenes registradas.</p>
      </section>

      <!-- Historial de Pagos -->
      <section>
        <h3 class="mat-subheading-2">💳 Historial de Pagos</h3>
        <table mat-table [dataSource]="data.pays" class="mat-elevation-z8 full-width-table" *ngIf="data.pays.length > 0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let pay">{{ pay.id }}</td>
          </ng-container>

          <ng-container matColumnDef="issueDate">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let pay">{{ pay.issueDate }}</td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let pay">{{ pay.totalPrice | currency:'COP ' }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let pay">
              <span [ngClass]="pay.paid ? 'paid' : 'unpaid'">
                {{ pay.paid ? 'Pagado' : 'Pendiente' }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['id', 'issueDate', 'total', 'estado']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['id', 'issueDate', 'total', 'estado']"></tr>
        </table>

        <p *ngIf="data.pays.length === 0" class="empty-message">Sin pagos registrados.</p>
      </section>
    </mat-dialog-content>
  `,
  styles: [`
    .paid { color: green; }
    .unpaid { color: red; }
    .full-width-table { width: 100%; }
    .empty-message { font-style: italic; color: #888; }
  `]
})
export class CustomerDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
