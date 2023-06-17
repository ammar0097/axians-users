import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: any[];

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.userService.listUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error retrieving users:', error);
      }
    );
  }
}
