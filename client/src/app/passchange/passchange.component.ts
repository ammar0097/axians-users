import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-passchange',
  templateUrl: './passchange.component.html',
  styleUrls: ['./passchange.component.css']
})
export class PasschangeComponent {
  loading = false;
  myForm:any
  errorMessage=''
  constructor(private formBuilder : FormBuilder, private authService:AuthenticationService,private router: Router,) {
    this.myForm = this.formBuilder.group({
      password : [''],
    })
  }


  onSubmit() {
    const password = this.myForm.get('password').value;
  
    this.loading = true;
    this.authService.updatePassword(password).subscribe(
      () => {
  
  
          this.router.navigate(['/']);
          this.loading = false;

   
      },
      (error) => {
  
        this.errorMessage = error.error.message
        this.loading = false;
      }
    );
  }
}
