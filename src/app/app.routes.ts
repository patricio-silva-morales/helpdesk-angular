import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { Kanban } from './pages/kanban/kanban';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'tickets',
        component: Tickets
    },
    {
        path: 'kanban',
        component: Kanban
    },
    {
        path: 'reportes',
        component: Reportes
    },
    {
        path: '**',
        component: Dashboard        
    }
];

