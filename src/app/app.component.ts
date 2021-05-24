import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('myAnimation', [
      transition('*<=>*', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ]),
    ])
  ]
})
export class AppComponent {
  title = 'ABCRetail';
  errorMessage = "";
  successMessage = "";
  isLoading = false;
  isUrlValid = true;
  constructor(private authservice: AuthService, private router: Router, private messageService: MessageService) {
    this.messageService.ErrorMessageSubjective.subscribe(errorMessage => {
      this.SetErrorMessageTimeOutFor5(errorMessage);
    })

    this.messageService.IsLoadinginProgressSubjective.subscribe(isLoading => {
      this.isLoading = isLoading;
    })

    this.messageService.SuccessMessageSubjective.subscribe(successMessage => {
      this.SetSuccessMessageTimeOutFor5(successMessage);
    })

    this.messageService.IsLoadingUrlCorrect.subscribe(isurlCorrect => {
      this.isUrlValid = isurlCorrect;
      if (!isurlCorrect) {
        setTimeout(() => {
          this.RedirectToRoute();
        }, 5000);
      }
    })
  }

  ngOnInit(): void {
    if (this.authservice.GetLocalStorage(true) == null) {
      this.router.navigate(["home"]);
    }
  }

  ScrollTotop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  RedirectToRoute() {
    if (this.authservice.GetLocalStorage(false) == null) {
      this.router.navigate(["home"]);
    }
    else if (this.authservice.GetLocalStorage(false)?.isAdmin) {
      this.router.navigate(["admin/"]);
    }
    else {
      this.router.navigate(["user/"]);
    }
  }

  SetErrorMessageTimeOutFor5(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.ScrollTotop();
    setTimeout(() => {
      this.errorMessage = "";
    }, 3000);
  }

  SetSuccessMessageTimeOutFor5(successMessage: string) {
    this.successMessage = successMessage;
    this.ScrollTotop();
    setTimeout(() => {
      this.successMessage = "";
    }, 3000);
  }
}
