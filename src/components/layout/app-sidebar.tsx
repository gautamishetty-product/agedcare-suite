import { Home, Users, FileText, Activity, AlertTriangle, ClipboardList, Calendar, Settings, Shield, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    group: 'Main'
  },
  {
    title: 'Residents',
    url: '/residents',
    icon: Users,
    group: 'Main'
  },
  {
    title: 'Clinical Documentation',
    items: [
      { title: 'Progress Notes', url: '/clinical/notes', icon: FileText },
      { title: 'Vital Signs', url: '/clinical/vitals', icon: Activity },
      { title: 'Medications', url: '/clinical/medications', icon: Shield },
      { title: 'Care Plans', url: '/clinical/care-plans', icon: ClipboardList }
    ]
  },
  {
    title: 'Health & Safety',
    items: [
      { title: 'Incidents', url: '/incidents', icon: AlertTriangle },
      { title: 'Wounds', url: '/wounds', icon: TrendingUp }
    ]
  },
  {
    title: 'Operations',
    items: [
      { title: 'Tasks & Handovers', url: '/tasks', icon: ClipboardList },
      { title: 'Activities', url: '/activities', icon: Calendar }
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg text-sidebar-primary ${collapsed ? 'hidden' : 'block'}`}>
            CareConnect
          </h2>
          {collapsed && (
            <div className="text-sidebar-primary font-bold text-xl text-center">CC</div>
          )}
        </div>

        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            {section.group && !collapsed && (
              <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {section.url ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to={section.url} className={getNavClassName}>
                        <section.icon className="h-4 w-4" />
                        {!collapsed && <span>{section.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <>
                    {!collapsed && (
                      <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 mb-2">
                        {section.title}
                      </SidebarGroupLabel>
                    )}
                    {section.items?.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavClassName}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}