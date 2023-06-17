import { AuthenticationService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  myForm:any

  constructor(private formBuilder : FormBuilder, private authService:AuthenticationService,private router: Router,) {
    this.myForm = this.formBuilder.group({
      username : ['',[Validators.required,Validators.minLength(12)]],
      password : [''],
    })
  }
  ngOnInit(): void {};  
  
  
  onSubmit() {
    const username = this.myForm.get('username').value;
    const password = this.myForm.get('password').value;
  
    this.authService.login(username, password).subscribe(
      () => {
        console.log("welcome ");
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error.error);
      }
    );
  }
}
