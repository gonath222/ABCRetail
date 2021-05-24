import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class MessageService {

    public ErrorMessageSubjective = new Subject<string>();
    public SuccessMessageSubjective = new Subject<string>();
    public IsLoadinginProgressSubjective = new BehaviorSubject<boolean>(false);
    public IsLoadingUrlCorrect = new BehaviorSubject<boolean>(true);

    constructor(private title: Title) { }

    SetTitle(name: string){
        this.title.setTitle(name);
    }
}