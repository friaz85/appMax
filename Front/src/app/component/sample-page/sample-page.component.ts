import { Component } from '@angular/core';
import { SamplePage1Component } from '../pages/sample-page1/sample-page1.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule,SamplePage1Component],
  templateUrl: './sample-page.component.html',
  styleUrl: './sample-page.component.scss'
})
export class SamplePageComponent {

}
