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
        href: dashboard(),
        icon: ArrowUpDown,
    },
    {
        title: 'Rapports financiers',
        href: dashboard(),
        icon: FileBarChart2,
    },
    {
        title: 'Historique',
        href: dashboard(),
        icon: Archive,
    },
];

// ── Navigation Siège Central ───────────────────────────────────────────────────
const siegeNavItems: NavItem[] = [
    {
        title: 'Analyse KPIs',
        href: dashboard(),
        icon: TrendingUp,
    },
    {
        title: 'Succursales',
        href: dashboard(),
        icon: Building2,
    },
    {
        title: 'Comparatif',
        href: dashboard(),
        icon: BarChart3,
    },
    {
        title: 'Générer rapport',
        href: dashboard(),
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
        href: dashboard(),
        icon: BookOpen,
    },
    {
        title: 'Paramètres',
        href: dashboard(),
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
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        Succursale
                    </SidebarGroupLabel>
                    <NavMain items={succursaleNavItems} />
                </SidebarGroup>

                {/* Siège Central section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        Siège Central
                    </SidebarGroupLabel>
                    <NavMain items={siegeNavItems} />
                </SidebarGroup>

                {/* Admin section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        Administration
                    </SidebarGroupLabel>
                    <NavMain
                        items={[
                            {
                                title: 'Supervision système',
                                href: dashboard(),
                                icon: ShieldCheck,
                            },
                        ]}
                    />
                </SidebarGroup>
            </SidebarContent>

            {/* ── Footer ─────────────────────────────────────── */}
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
