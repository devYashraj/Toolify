import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root.jsx'
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Orders from './pages/Orders.jsx';
import SendOrder from './pages/SendOrder.jsx';
import AllOrders from './pages/AllOrders.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Admin from './routes/Admin.jsx';
import AdminDash from './pages/AdminDash.jsx';
import CreateQuotation from './pages/CreateQuotation.jsx';
import Customers from './pages/Customers.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: 'admin-portal',
    element: <SignIn admin={true} />,
    errorElement: <ErrorPage />
  },
  {
    path: 'admin-dash',
    element: <Admin />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDash/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'orders',
        element: <Orders/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'orders/sendquote/:id',
        element: <CreateQuotation/>,
        errorElement: <ErrorPage/>
      },
      { 
        path: 'customers',
        element: <Customers/>,
        errorElement: <ErrorPage />
      },
      {
        path: 'reports',
        element: <div>Reports</div>,
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signin',
    element: <SignIn />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <ErrorPage />
  },
  {
    path: '/orders',
    element: <Orders />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders/send",
    element: <SendOrder />,
    errorElement: <ErrorPage />
  },
  {
    path: "/orders/allorders",
    element: <AllOrders />,
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
