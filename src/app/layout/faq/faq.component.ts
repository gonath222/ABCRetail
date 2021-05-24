import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

  constructor(private message: MessageService) { }

  ngOnInit(): void {
    this.message.SetTitle("FAQ | ABC Retail Bank");
  }

}
