import { Link, useLocation } from "wouter";
import { 
  Home, 
  DollarSign, 
  BarChart3, 
  Calendar, 
  HelpCircle, 
  Settings,
  User
} from "lucide-react";

const NavLink = ({ href, icon, isActive, children }: {
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href}>
      <div className={`cursor-pointer ${isActive 
        ? 'text-gray-900 bg-gray-100' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
        {icon}
        {children}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [location] = useLocation();
  
  return (
    <nav className="hidden lg:block w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 space-y-1">
            <NavLink 
              href="/dashboard" 
              icon={<Home className="mr-4 h-6 w-6 text-primary-500" />}
              isActive={location === '/dashboard'}
            >
              Dashboard
            </NavLink>
            
            <NavLink 
              href="/transactions" 
              icon={<DollarSign className="mr-4 h-6 w-6 text-gray-500" />}
              isActive={location === '/transactions'}
            >
              Transactions
            </NavLink>
            
            <NavLink 
              href="/investments" 
              icon={<BarChart3 className="mr-4 h-6 w-6 text-gray-500" />}
              isActive={location === '/investments'}
            >
              Investments
            </NavLink>
            
            <NavLink 
              href="/budget" 
              icon={<Calendar className="mr-4 h-6 w-6 text-gray-500" />}
              isActive={location === '/budget'}
            >
              Budget Planner
            </NavLink>
            
            <NavLink 
              href="/insights" 
              icon={<HelpCircle className="mr-4 h-6 w-6 text-gray-500" />}
              isActive={location === '/insights'}
            >
              Insights
            </NavLink>
            
            <NavLink 
              href="/profile" 
              icon={<User className="mr-4 h-6 w-6 text-gray-500" />}
              isActive={location === '/profile'}
            >
              Profile
            </NavLink>
          </div>
        </div>
        
        {/* Settings link */}
        <div className="px-4 pb-2">
          <NavLink 
            href="/settings" 
            icon={<Settings className="mr-4 h-6 w-6 text-gray-500" />}
            isActive={location === '/settings'}
          >
            Settings
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
