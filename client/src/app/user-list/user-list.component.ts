import { AuthenticationService } from './../services/auth.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { take } from 'rxjs';
import { UserServiceService } from '../services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  loading = false;
  errorMessage = '';
  userToEdit: any = {};
  userForm: FormGroup;
  editUserForm: FormGroup;
  users: any[];
  currentUser: any = {};
  modalRef?: BsModalRef;
  constructor(
    private userService: UserServiceService,
    private authService: AuthenticationService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?!.*(.)\1{1}).*$/
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      isNew: [1, Validators.required],
      isAdmin: [0, Validators.required],
      isActive: [1, Validators.required],
    });





    this.editUserForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [
        '',
        [
          this.customPasswordValidator,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?!.*(.)\\1{1}).*$/
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      isNew: [1, Validators.required],
      isAdmin: [0, Validators.required],
      isActive: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.loadCurrentUser();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }


  delete(id: any) {
    this.loading = true;
    this.userService
      .deleteUser(id)
      .pipe(take(1))
      .subscribe((res) => {
        this.loading = false;
        this.getAllUsers();
      });
  }

  getAllUsers() {
    this.loading = true;
    this.userService.listUsers().subscribe(
      (users) => {
        this.loading = false;
        this.users = users;
      },
      (error) => {
        console.error('Error retrieving users:', error);
      }
    );
  }

  openModal(template: TemplateRef<any>, data?: any) {
    this.errorMessage = '';
    if (data) {
      this.userToEdit = data;
      this.populateEditForm();
    }
    this.modalRef = this.modalService.show(template);
  }

  populateEditForm() {
    this.editUserForm.patchValue({
      username: this.userToEdit.username,
      firstName: this.userToEdit.firstName,
      lastName: this.userToEdit.lastName,
      password: '',
      email: this.userToEdit.email,
      isNew: this.userToEdit.isNew ? 1 : 0,
      isAdmin: this.userToEdit.isAdmin ? 1 : 0,
      isActive: this.userToEdit.isActive ? 1 : 0,
    });
  }
  // Create user method
  createUser() {
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    let formData = this.userForm.value;
    this.userService.createUser(formData).subscribe(
      (message) => {
        this.loading = false;
        this.getAllUsers();
        // Reset the form
        this.modalRef?.hide(); // Close the modal
        this.userForm.reset();
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }


  editUser(userId: any) {
    if (this.editUserForm.invalid) {
      return;
    }

    this.loading = true;
    let formData = this.editUserForm.value;
    formData.isNew = formData.isNew ? 1 : 0;
    this.userService.updateUser(userId, formData).subscribe(
      (message) => {
        this.loading = false;
        this.getAllUsers();
        // Reset the form
        this.modalRef?.hide(); // Close the modal
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }

  customPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    // Check if the password is empty or the length is between 12 and 20 characters
    if (password && (password.length < 12 || password.length > 20)) {
      return { passwordLength: true };
    }
    return null;
  }
}
