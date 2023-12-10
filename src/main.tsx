import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import AssignmentA from './pages/AssignmentA';
import AssignmentB from './pages/AssignmentB';

import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/assignmentA',
        element: <AssignmentA />,
    },
    {
        path: '/assignmentB',
        element: <AssignmentB />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
