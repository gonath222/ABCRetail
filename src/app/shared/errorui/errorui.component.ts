import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-errorui',
  templateUrl: './errorui.component.html',
  styleUrls: ['./errorui.component.css']
})
export class ErroruiComponent implements OnInit {

  @Input() errorMessage: string = "";

  constructor(private message: MessageService) { }

  ngOnInit(): void {

  }
  CloseThis() {
    this.message.ErrorMessageSubjective.next("");
  }
}
