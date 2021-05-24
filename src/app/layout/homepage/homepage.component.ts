import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html'
})
export class HomepageComponent implements OnInit {

  constructor(private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("Home | ABC Retail Bank");
  }

}
