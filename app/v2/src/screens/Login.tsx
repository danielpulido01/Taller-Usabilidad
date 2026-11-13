import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Fingerprint, Lock, ShieldCheck, Smartphone } from 'lucide-react'
import { Header } from '../components/Shell'
import { Alert, Button, Card, Label, inputCls } from '../components/ui'

export function Login({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!user.trim() || !pass) {
      setError('Ingresa tu usuario y contraseña para continuar.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(onLogin, 700)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <span className="text-sm text-white/90">Centro de ayuda: 800-AURORA (800-287672)</span>
      </Header>
      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 gap-8 px-8 py-16">
        <section className="col-span-6 col-start-1 flex flex-col justify-center rounded-xl bg-section p-16">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Banca en línea</p>
          <h1 className="mt-4 max-w-md text-[32px] leading-tight font-bold">Tu dinero, claro y seguro en todo momento.</h1>
          <p className="mt-4 max-w-md text-base text-muted">
            Consulta tus saldos, transfiere y paga tus servicios desde un solo lugar, sin filas ni horarios.
          </p>
          <ul className="mt-10 flex flex-col gap-6">
            {[
              { Icon: ShieldCheck, t: 'Conexión cifrada', d: 'Protegemos cada sesión con cifrado de extremo a extremo.' },
              { Icon: Smartphone, t: 'Clave dinámica', d: 'Confirmamos tus operaciones con un código en tu celular.' },
              { Icon: Fingerprint, t: 'Alertas al instante', d: 'Recibe una notificación por cada movimiento.' },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-card">
                  <Icon className="size-5 text-brand" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-4 col-start-8 flex flex-col justify-center">
          <Card className="p-10">
            <h2 className="text-2xl font-bold">Inicia sesión</h2>
            <p className="mt-2 text-base text-muted">Ingresa con tu usuario de Banco Aurora.</p>
            <form className="mt-8 flex flex-col gap-6" onSubmit={submit} noValidate>
              {error && <Alert tone="error">{error}</Alert>}
              <div>
                <Label htmlFor="user">Usuario</Label>
                <input
                  id="user"
                  className={inputCls}
                  value={user}
                  autoComplete="username"
                  placeholder="Escribe tu usuario"
                  aria-invalid={!!error && !user.trim()}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pass">Contraseña</Label>
                <div className="relative">
                  <input
                    id="pass"
                    type={show ? 'text' : 'password'}
                    className={`${inputCls} pr-14`}
                    value={pass}
                    autoComplete="current-password"
                    placeholder="Escribe tu contraseña"
                    aria-invalid={!!error && !pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={show}
                    className="absolute top-0.5 right-0.5 flex size-11 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-section hover:text-ink"
                  >
                    {show ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                  </button>
                </div>
                <div className="mt-2 flex">
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="-ml-1 min-h-11 cursor-pointer rounded px-1 text-sm font-semibold text-ink underline underline-offset-4 hover:text-brand-dark"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
              {forgot && (
                <Alert tone="info" title="Recupera tu acceso">
                  Te enviamos un enlace de recuperación al correo registrado m•••••s@correo.cr.
                </Alert>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Ingresar
              </Button>
            </form>
            <div className="mt-8 flex gap-3 border-t border-line pt-6 text-sm text-muted">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                Banco Aurora nunca te pedirá tu contraseña ni códigos por teléfono, correo o mensaje de texto.
              </p>
            </div>
          </Card>
          <p className="mt-6 text-center text-sm text-muted">Prototipo: escribe cualquier usuario y contraseña para ingresar.</p>
        </section>
      </div>
    </div>
  )
}
