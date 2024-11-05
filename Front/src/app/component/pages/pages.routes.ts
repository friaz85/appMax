import { Routes } from '@angular/router';
import { SamplePage1Component } from './sample-page1/sample-page1.component';

export const pages: Routes = [
    {
        path: '',
        children: [
          {
            path: 'sample-page1',
            component: SamplePage1Component,
            data: {
              title: "Sample-page1",
              breadcrumb: "Default",
            }
          },
        ]
      }
]
