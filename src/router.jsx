import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import DataManagement from "./pages/DataManagement";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "transactions", element: <Transactions /> },
            { path: "settings", element: <Settings /> },
            { path: "settings/data", element: <DataManagement /> },
        ]
    }
])