import { NavLink } from "react-router";
import { HandCoins, LayoutDashboard, WalletCards, Settings } from "lucide-react";

export default function DesktopNav() {

    return (
        <nav className="bg-norway-200 px-4 py-3 flex flex-col justify-between min-h-screen">
            <div>
                
            </div>

            <div className="">
                <NavLink 
                    to="/transactions" 
                    className={({ isActive }) =>
                        `flex items-center justify-center size-12 rounded-full ${
                            isActive ? "bg-norway-600 text-norway-50" : "bg-norway-50 text-norway-600"
                        }`
                    }
                >
                    <WalletCards className="size-6" />
                </NavLink>

                <NavLink 
                    to="/" 
                    className={({ isActive }) =>
                        `flex items-center justify-center size-12 rounded-full ${
                            isActive ? "bg-norway-600 text-norway-50" : "bg-norway-50 text-norway-600"
                        }`
                    }
                >
                    <LayoutDashboard className="size-6" />
                </NavLink>
            </div>

            <div>
                <NavLink 
                    to="/settings" 
                    className={({ isActive }) =>
                        `flex items-center justify-center size-12 rounded-full ${
                            isActive ? "bg-norway-600 text-norway-50" : "bg-norway-50 text-norway-600"
                        }`
                    }
                >
                    <Settings className="size-6" />
                </NavLink>
            </div>

        </nav>
    )
}