import { Component, OnInit } from '@angular/core';
import { imageModel } from '../../models/ImageModel';

// export interface slider {
//   image: string,
//   thumbImage: string,
//   title: string
// };

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {

  
  imageObject: Array<imageModel> = [];

  constructor() {
    this.setImageObject();
   }

  ngOnInit(): void {
    
  }

  setImageObject() {
    this.imageObject =[
      {
        image :"/assets/images/1.jpg",
        thumbImage :"/assets/images/1.jpg",
      },
      {
        image :"/assets/images/2.jpg",
        thumbImage :"/assets/images/2.jpg",
      },
      {
        image :"/assets/images/3.jpg",
        thumbImage :"/assets/images/3.jpg",
      },
      {
        image :"/assets/images/4.jpg",
        thumbImage :"/assets/images/4.jpg",
      },
      {
        image :"/assets/images/5.jpg",
        thumbImage :"/assets/images/5.jpg",
      },
    ]
  }

  imageClickHandler(e: any) {
    console.log(e);
  }
}
