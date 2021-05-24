import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-successui',
  templateUrl: './successui.component.html',
  styleUrls: ['./successui.component.css']
})
export class SuccessuiComponent implements OnInit {

  @Input() successMessage: string ="";
  
  constructor(private message:MessageService) { }

  ngOnInit(): void {
  }

  CloseThis()
  { 
    this.message.SuccessMessageSubjective.next("");
  }
}
