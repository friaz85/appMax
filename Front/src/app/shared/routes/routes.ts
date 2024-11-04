import { OrdenesComponent } from '../../component/pages/ordenes/ordenes.component';
import { Routes } from '@angular/router';

export const dashData: Routes = [
    {
        path: 'pages',
        data: {
            title: "sample-page",
            breadcrumb: "",

        },
        loadChildren: () => import('../../../app/component/pages/pages.routes').then(r => r.pages)
    },
    {
        path: 'sample-page',
        data: {
            title: "sample-page",
            breadcrumb: "sample-page",

        },
        loadChildren: () => import('../../../app/component/sample-page/sample-pages.routes').then(r => r.samplePages)
    },
]