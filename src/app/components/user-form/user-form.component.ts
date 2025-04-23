import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  name = '';
  email = '';
  role: UserRole = 'Admin';

  errors: any = {
    name: '',
    email: '',
    role: ''
  };
  submitted: boolean = false;
  showForm = true;

  constructor(private userService: UserService) { }

  onSubmit() {
    this.submitted = true;
    if (this.validateForm()) {
      this.userService.addUser({ name: this.name, email: this.email, role: this.role });
    }
  }
  onCancel() {
    this.name = '';
    this.email = '';
    this.role = 'Admin';
    this.errors = { name: '', email: '', role: '' };
    this.submitted = false;
    this.showForm = false;
  }

  nameValidator(value: string): string {
    if (!value) return 'Name is required.';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters and spaces.';
    return '';
  }

  emailValidator(value: string): string {
    if (!value) return 'Email is required.';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(value)) return 'Please enter a valid email address.';
    return '';
  }

  roleValidator(value: string): string {
    const validRoles = ['Admin', 'Editor', 'Viewer'];
    if (!value) return 'Role is required.';
    if (!validRoles.includes(value)) return 'Role must be either Admin, Editor, or Viewer.';
    return '';
  }

  validateForm() {
    this.submitted = true;

    this.errors.name = this.nameValidator(this.name);
    this.errors.email = this.emailValidator(this.email);
    this.errors.role = this.roleValidator(this.role);

    return !this.errors.name && !this.errors.email && !this.errors.role;
  }
}
