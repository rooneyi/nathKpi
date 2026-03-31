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
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
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
    {
        title: 'Paramètres',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
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
                {/* Succursale section */}
                <NavMain items={succursaleNavItems} label="Succursale" />

                {/* Siège Central section */}
                <NavMain items={siegeNavItems} label="Siège Central" />

                {/* Administration section */}
                <NavMain
                    items={[
                        {
                            title: 'Supervision système',
                            href: '/admin/supervision',
                            icon: ShieldCheck,
                        },
                    ]}
                    label="Administration"
                />
            </SidebarContent>

            {/* ── Footer ─────────────────────────────────────── */}
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
