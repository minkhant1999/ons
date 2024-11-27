import { Routes, Route } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { StatisticComponent } from './pages/statistic/statistic.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ImportDataComponent } from './pages/import-data/import-data.component';
import { StatisticChildComponent } from './pages/statistic/components/statistic-child/statistic-child.component';
import { CustomerChildComponent } from './pages/customer/components/customer-child/customer-child.component';
import { ImportDataChildComponent } from './pages/import-data/components/import-data-child/import-data-child.component';
import { getCookie } from '../service/get-group-cookie';
import { GuidelineComponent } from './pages/statistic/components/guideline/guideline.component';

// Define CustomRoute without redeclaring pathMatch
interface CustomRoute extends Omit<Route, 'children'> {
  path: string;
  component?: any;
  redirectTo?: string;
  children?: CustomRoute[]; // Nested children use CustomRoute type
}

export function generateRoutes(): Routes {
  const role = getCookie('role');

  const routeRawArray: Routes = [
    {
      path: '',
      component: StatisticComponent,
      children: [
        {
          path: '',
          pathMatch: 'full' as const, // Ensuring TypeScript recognizes this as literal "full"
          redirectTo: 'app-statistic',
        },
        {
          path: 'app-statistic',
          component: StatisticChildComponent,
        },
        {
          path: 'guideline',
          component: GuidelineComponent,
        },
      ],
    },
    {
      path: '',
      component: CustomerComponent,
      children: [
        {
          path: '',
          pathMatch: 'full' as const,
          redirectTo: 'app-customer',
        },
        {
          path: 'app-customer',
          component: CustomerChildComponent,
        },
      ],
    },
    // Conditionally add 'Import Data' route based on role
    ...(role === 'HO'
      ? [
          {
            path: '',
            component: ImportDataComponent,
            children: [
              {
                path: '',
                pathMatch: 'full' as const,
                redirectTo: 'app-import-data',
              },
              {
                path: 'app-import-data',
                component: ImportDataChildComponent,
              },
            ],
          },
        ]
      : []),
  ];

  const finalResult: Routes = [
    ...routeRawArray,
    {
      path: '**',
      component: PageNotFoundComponent,
    },
  ];

  return finalResult;
}
