import { Routes } from '@angular/router';
import { ContentComponent } from './shared/component/layout/content/content.component';
import { dashData } from './shared/routes/routes'
import { LoginComponent } from './auth/login/login.component';
import { AdminGuard } from './shared/guard/admin.guard';

export const routes: Routes = [
    {
        path: '',
        // redirectTo: 'auth/login',
        component: LoginComponent,
        pathMatch: 'full'
    },
    // {
    //     path: '',
    //     redirectTo: '/pages/sample-page1',
    //     pathMatch: 'full'
    // },
    {
        path: '',
        component: ContentComponent,
        children: dashData,
        canActivate: [AdminGuard],
    },

];
