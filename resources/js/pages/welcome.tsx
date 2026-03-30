import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3, Building2, CheckCircle2, FileBarChart2, Shield, TrendingUp } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const features = [
    {
        icon: BarChart3,
        title: 'Indicateurs KPI en temps réel',
        description: 'Suivez les performances financières de chaque succursale avec des métriques précises et actualisées.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Building2,
        title: 'Gestion multi-succursales',
        description: 'Centralisez et comparez les données de toutes vos succursales depuis un tableau de bord unifié.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: FileBarChart2,
        title: 'Rapports automatisés',
        description: 'Générez des rapports financiers conformes, envoyez-les au siège et archivez-les en quelques clics.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        icon: TrendingUp,
        title: 'Analyse de performance',
        description: 'Identifiez les écarts, comparez les succursales et visualisez les tendances avec des graphiques avancés.',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        icon: Shield,
        title: 'Sécurité & conformité',
        description: 'Contrôle d\'accès par rôle (Succursale, Siège, Administrateur) et audit complet des actions.',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
    {
        icon: CheckCircle2,
        title: 'Validation centralisée',
        description: 'Le siège central valide, analyse et présente les résultats en réunion directement depuis la plateforme.',
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
    },
];

const stats = [
    { value: '5', label: 'Succursales connectées' },
    { value: '98%', label: 'Taux de conformité' },
    { value: '3 rôles', label: 'Niveaux d\'accès' },
    { value: '24/7', label: 'Disponibilité' },
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="KPIbank — Plateforme de suivi des indicateurs bancaires">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans">

                {/* ── Navigation ─────────────────────────────── */}
                <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <BarChart3 className="size-4" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">KPIbank</span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                    Tableau de bord
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Se connecter
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                        >
                                            Créer un compte
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* ── Hero ───────────────────────────────────── */}
                <section className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-36">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Plateforme bancaire de suivi des KPI — Kinshasa, RDC
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            Pilotez vos{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                indicateurs bancaires
                            </span>
                            <br />
                            depuis un seul endroit
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            KPIbank connecte vos succursales au siège central pour un suivi
                            en temps réel des performances financières, une génération de rapports
                            automatisée et une analyse comparative avancée.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105"
                                >
                                    Accéder au tableau de bord
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105"
                                        >
                                            Commencer gratuitement
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
                                    >
                                        Se connecter
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {stats.map((s) => (
                                <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                                    <div className="text-3xl font-bold">{s.value}</div>
                                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features ───────────────────────────────── */}
                <section className="border-t border-border/40 bg-muted/20 py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Tout ce dont votre banque a besoin
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                De la saisie des données en succursale à l'analyse stratégique au siège central.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={f.title}
                                        className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${f.bg}`}>
                                            <Icon className={`size-5 ${f.color}`} />
                                        </div>
                                        <h3 className="mb-2 font-semibold">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── CTA Footer ─────────────────────────────── */}
                <section className="border-t border-border/40 py-24">
                    <div className="mx-auto max-w-3xl px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Prêt à digitaliser votre reporting bancaire ?
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Rejoignez KPIbank et transformez vos processus de reporting financier
                            en un système centralisé, efficace et conforme.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            {canRegister && !auth.user && (
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
                                >
                                    Créer mon compte
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                            {auth.user && (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
                                >
                                    Mon tableau de bord
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────── */}
                <footer className="border-t border-border/40 py-8">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <BarChart3 className="size-3.5" />
                            </div>
                            <span className="font-semibold text-sm">KPIbank</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © 2026 KPIbank — Plateforme de gestion des indicateurs de performance bancaire
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}
