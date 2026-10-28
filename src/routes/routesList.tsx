import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';

import Layout from '@/layouts/layout';

import { routes } from './routes';

function NotFound() {
  return <h1>Page not found</h1>;
}

function toRoute(route: (typeof routes)[number]): RouteObject {
  const Page = route.page;
  if (route.path === '/') {
    return { index: true, element: <Page /> };
  }
  return { path: route.path.replace(/^\//, ''), element: <Page /> };
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [...routes.map(toRoute), { path: '*', element: <NotFound /> }],
  },
]);

export function RoutesList() {
  return <RouterProvider router={router} />;
}
