import { AuthenticationService } from './../services/auth.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { take } from 'rxjs';
import { UserServiceService } from '../services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  loading = false;
  userForm: FormGroup;
  users: any[];
  currentUser : any = {}
  modalRef?: BsModalRef;
  constructor(
    private userService: UserServiceService,
    private authService: AuthenticationService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?!.*(.)\1{1}).*$/)
      ]],      
      email: ['', [Validators.required, Validators.email]],
      isNew: [1, Validators.required],
      isAdmin: [0, Validators.required],
      isActive: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getcurrentUser()
  }
  getcurrentUser(){
    this.authService.loadCurrentUser()
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // Create user method
  createUser() {
    console.log(this.userForm.controls['username']);
    
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = this.userForm.value;

    this.userService.createUser(formData).subscribe(
      (message) => {
        this.loading = false;
        this.getAllUsers()
        // Reset the form
        this.modalRef?.hide(); // Close the modal
        this.userForm.reset();
      },
      (error) => {
        this.loading = false;
      }
    );
  }


  

 
}
