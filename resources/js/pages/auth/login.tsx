import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { LogIn } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="flex flex-col gap-6">
            <Head title="Connexion — KPIbank" />

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Accès au tableau de bord</h1>
                <p className="text-sm text-muted-foreground">Entrez vos identifiants pour accéder aux indicateurs du réseau.</p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Adresse email matricule</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="matricule@kpibank.com"
                                    className="bg-muted/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Mot de passe oublié ?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="bg-muted/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Se souvenir de moi
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full h-11 bg-primary hover:bg-primary/90 transition-all font-semibold gap-2"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? <Spinner className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                                Se connecter
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                Vous n'avez pas de compte ?{' '}
                                <TextLink href={register()} tabIndex={5} className="font-semibold text-primary underline-offset-4 hover:underline">
                                    Demander un accès
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-500/10 py-3 rounded-lg border border-green-500/20">
                    {status}
                </div>
            )}
        </div>
    );
}

Login.layout = {
    title: 'Se connecter à KPIbank',
    description: 'Plateforme unifiée de suivi des indicateurs financiers.',
};
