import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    FileBarChart2,
    TrendingUp,
    Building2,
    Archive,
    Settings,
    BarChart3,
    ArrowUpDown,
    ShieldCheck,
    Bell,
    BookOpen,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// ── Navigation principale (Succursale) ─────────────────────────────────────────
const succursaleNavItems: NavItem[] = [
    {
        title: 'Saisie des données',
        href: '/succursale/saisie',
        icon: ArrowUpDown,
    },
    {
        title: 'Rapports financiers',
        href: '/succursale/rapports',
        icon: FileBarChart2,
    },
    {
        title: 'Historique',
        href: '/succursale/historique',
        icon: Archive,
    },
];

// ── Navigation Siège Central ───────────────────────────────────────────────────
const siegeNavItems: NavItem[] = [
    {
        title: 'Analyse KPIs',
        href: '/siege/analyse',
        icon: TrendingUp,
    },
    {
        title: 'Succursales',
        href: '/siege/succursales',
        icon: Building2,
    },
    {
        title: 'Comparatif',
        href: '/siege/comparatif',
        icon: BarChart3,
    },
    {
        title: 'Générer rapport',
        href: '/siege/rapports',
        icon: FileBarChart2,
    },
    {
        title: 'Validation des rapports',
        href: '/siege/validation',
        icon: ShieldCheck,
    },
];

// ── Navigation Admin ───────────────────────────────────────────────────────────
const adminNavItems: NavItem[] = [
    {
        title: 'Supervision système',
        href: '/admin/supervision',
        icon: ShieldCheck,
    },
    {
        title: 'Succursales & performances',
        href: '/siege/succursales',
        icon: Building2,
    },
    {
        title: 'Utilisateurs',
        href: '/admin/utilisateurs',
        icon: Users,
    },
    {
        title: 'Paramètres',
        href: '/admin/parametres',
        icon: Settings,
    },
];

// ── Footer nav ─────────────────────────────────────────────────────────────────
const footerNavItems: NavItem[] = [
    {
        title: 'Notifications',
        href: dashboard(),
        icon: Bell,
    },
    {
        title: 'Documentation',
        href: '/docs/DOCUMENTATION.md',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { role: string } } };
    const userRole = auth?.user?.role ?? 'succursale';

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* ── Logo / Header ──────────────────────────────── */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ── Main content ───────────────────────────────── */}
            <SidebarContent>
                {/* Dashboard commun à tous */}
                <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={dashboard()}>
                                    <LayoutGrid className="size-4" />
                                    <span>Tableau de bord</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Succursale section - visible uniquement pour les succursales */}
                {userRole === 'succursale' && (
                    <NavMain items={succursaleNavItems} label="Ma Succursale" />
                )}

                {/* Siège Central section - visible pour siège et admin */}
                {(userRole === 'siege' || userRole === 'admin') && (
                    <NavMain items={siegeNavItems} label="Siège Central" />
                )}

                {/* Administration section - visible uniquement pour admin */}
                {userRole === 'admin' && (
                    <NavMain items={adminNavItems} label="Administration" />
                )}
            </SidebarContent>

            {/* ── Footer ─────────────────────────────────────── */}
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
