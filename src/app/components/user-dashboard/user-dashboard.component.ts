import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  chart: any;
  users$!: Observable<User[]>;
  @ViewChild('formContainer', { read: ViewContainerRef }) formContainer!: ViewContainerRef;
  roleData: any = { Admin: 0, Editor: 0, Viewer: 0 };
  formRef!: ComponentRef<any>;
  p: number = 1;

  constructor(private userService: UserService) { 
  }

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
    this.users$.subscribe(users => {
      this.updateRoleDistribution(users);
      this.loadChart();
    });
  }

  updateRoleDistribution(users: User[]) {
    const roleCounts: Record<User['role'], number> = {
      Admin: 0,
      Editor: 0,
      Viewer: 0,
    };

    users.forEach(user => {
      roleCounts[user.role]++;
    });

    this.roleData = roleCounts;
  }

  async openUserForm() {
    const { UserFormComponent } = await import('../user-form/user-form.component');

    this.formContainer.clear();

    this.formRef = this.formContainer.createComponent(UserFormComponent);
  }

  loadChart(): void {
    import('chart.js/auto').then((Chart) => {
      const ctx = document.getElementById('chartCanvas') as HTMLCanvasElement;

      if (this.chart) {
        this.chart.destroy(); 
      }

      this.chart = new Chart.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Admin', 'Editor', 'Viewer'],
          datasets: [
            {
              data: [
                this.roleData.Admin,
                this.roleData.Editor,
                this.roleData.Viewer
              ],
              backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }).catch((err) => {
      console.error('Error loading Chart.js:', err);
    });
  }

}
