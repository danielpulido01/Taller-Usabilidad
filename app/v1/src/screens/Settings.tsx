import { useState, type FormEvent, type ReactNode } from 'react'
import { Bell, Eye, EyeOff, Lock, Monitor, Smartphone, SlidersHorizontal, UserRound } from 'lucide-react'
import { Alert, Button, Card, Label, Switch, inputCls } from '../components/ui'
import { initials, type Profile } from '../data'

export type Prefs = {
  hideBalance: boolean
  dynamicKey: boolean
  notifyMovements: boolean
  notifyEmail: boolean
  notifyPromos: boolean
}

type Section = 'perfil' | 'seguridad' | 'notificaciones' | 'preferencias'

const SECTIONS: { key: Section; label: string; Icon: typeof Bell }[] = [
  { key: 'perfil', label: 'Perfil', Icon: UserRound },
  { key: 'seguridad', label: 'Seguridad', Icon: Lock },
  { key: 'notificaciones', label: 'Notificaciones', Icon: Bell },
  { key: 'preferencias', label: 'Preferencias', Icon: SlidersHorizontal },
]

function Panel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </Card>
  )
}

export function Settings({
  profile,
  onSaveProfile,
  prefs,
  setPrefs,
  notify,
}: {
  profile: Profile
  onSaveProfile: (p: Profile) => void
  prefs: Prefs
  setPrefs: (p: Prefs) => void
  notify: (msg: string) => void
}) {
  const [section, setSection] = useState<Section>('perfil')

  return (
    <div className="mx-auto max-w-[1056px]">
      <h1 className="text-[32px] leading-tight font-bold">Configuración</h1>
      <p className="mt-2 text-base text-muted">Administra tus datos, la seguridad de tu cuenta y cómo te avisamos.</p>

      <div className="mt-8 grid grid-cols-12 gap-6">
        <nav aria-label="Secciones de configuración" className="col-span-3">
          <ul className="flex flex-col gap-1">
            {SECTIONS.map(({ key, label, Icon }) => {
              const on = key === section
              return (
                <li key={key}>
                  <button
                    onClick={() => setSection(key)}
                    aria-current={on ? 'true' : undefined}
                    className={`flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-4 text-left text-base transition-colors ${
                      on ? 'bg-white font-semibold text-ink shadow-card' : 'text-muted hover:bg-white hover:text-ink'
                    }`}
                  >
                    <Icon className={`size-5 ${on ? 'text-brand' : ''}`} aria-hidden />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="col-span-9">
          {section === 'perfil' && <ProfileForm profile={profile} onSave={onSaveProfile} />}
          {section === 'seguridad' && <Security prefs={prefs} setPrefs={setPrefs} notify={notify} />}
          {section === 'notificaciones' && (
            <Panel title="Notificaciones" description="Elige qué avisos quieres recibir.">
              <div className="divide-y divide-line">
                <Switch
                  label="Alertas de movimientos"
                  description="Notificación push por cada compra, depósito o transferencia."
                  checked={prefs.notifyMovements}
                  onChange={(v) => setPrefs({ ...prefs, notifyMovements: v })}
                />
                <Switch
                  label="Comprobantes por correo"
                  description={`Enviamos cada comprobante a ${profile.email}.`}
                  checked={prefs.notifyEmail}
                  onChange={(v) => setPrefs({ ...prefs, notifyEmail: v })}
                />
                <Switch
                  label="Ofertas y novedades"
                  description="Promociones de Banco Aurora y comercios afiliados."
                  checked={prefs.notifyPromos}
                  onChange={(v) => setPrefs({ ...prefs, notifyPromos: v })}
                />
              </div>
            </Panel>
          )}
          {section === 'preferencias' && (
            <Panel title="Preferencias" description="Personaliza cómo ves tu banca en línea.">
              <div className="divide-y divide-line">
                <Switch
                  label="Ocultar saldos al iniciar sesión"
                  description="Tus saldos aparecerán ocultos en el inicio hasta que elijas mostrarlos."
                  checked={prefs.hideBalance}
                  onChange={(v) => setPrefs({ ...prefs, hideBalance: v })}
                />
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileForm({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  const [form, setForm] = useState(profile)
  const [touched, setTouched] = useState(false)
  const dirty = form.name !== profile.name || form.email !== profile.email || form.phone !== profile.phone
  const errors = {
    name: !form.name.trim() ? 'Ingresa tu nombre.' : '',
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'Ingresa un correo válido, por ejemplo nombre@correo.cr.' : '',
    phone: !/^\d{4}\s?\d{4}$/.test(form.phone.trim()) ? 'El teléfono debe tener 8 dígitos.' : '',
  }
  const invalid = Object.values(errors).some(Boolean)

  function submit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (invalid) return
    onSave({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })
    setTouched(false)
  }

  const field = (key: keyof Profile, label: string, type = 'text') => (
    <div>
      <Label htmlFor={`p-${key}`}>{label}</Label>
      <input
        id={`p-${key}`}
        type={type}
        className={inputCls}
        value={form[key]}
        aria-invalid={touched && !!errors[key]}
        aria-describedby={touched && errors[key] ? `p-${key}-err` : undefined}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {touched && errors[key] && (
        <p id={`p-${key}-err`} className="mt-2 text-sm text-error">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <Panel title="Perfil" description="Estos datos aparecen en tu sesión y en tus comprobantes.">
      <div className="flex items-center gap-4 rounded-xl bg-section p-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand text-xl font-semibold text-white">
          {initials(form.name)}
        </span>
        <div>
          <p className="text-base font-semibold">{form.name || 'Sin nombre'}</p>
          <p className="text-sm text-muted">Cliente desde 2019 · Cédula 1-1234-0567</p>
        </div>
      </div>
      <form className="mt-6 grid grid-cols-2 gap-6" onSubmit={submit} noValidate>
        <div className="col-span-2">{field('name', 'Nombre para mostrar')}</div>
        {field('email', 'Correo electrónico', 'email')}
        {field('phone', 'Teléfono celular', 'tel')}
        <div className="col-span-2 flex justify-end gap-3 border-t border-line pt-6">
          <Button variant="secondary" type="button" disabled={!dirty} onClick={() => { setForm(profile); setTouched(false) }}>
            Descartar
          </Button>
          <Button type="submit" disabled={!dirty}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Panel>
  )
}

function Security({ prefs, setPrefs, notify }: { prefs: Prefs; setPrefs: (p: Prefs) => void; notify: (m: string) => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [devices, setDevices] = useState([
    { Icon: Monitor, t: 'Chrome en Windows · San José', d: 'Sesión actual', current: true },
    { Icon: Smartphone, t: 'App Banco Aurora · iPhone', d: 'Último uso: ayer, 7:15 p. m.', current: false },
  ])
  const rules = [
    { ok: next.length >= 8, t: 'Al menos 8 caracteres' },
    { ok: /[A-Z]/.test(next), t: 'Una letra mayúscula' },
    { ok: /\d/.test(next), t: 'Un número' },
  ]

  function submit(e: FormEvent) {
    e.preventDefault()
    setDone(false)
    if (!current) return setError('Ingresa tu contraseña actual.')
    if (!rules.every((r) => r.ok)) return setError('La nueva contraseña no cumple los requisitos.')
    if (next !== confirm) return setError('Las contraseñas nuevas no coinciden.')
    setError('')
    setCurrent('')
    setNext('')
    setConfirm('')
    setDone(true)
  }

  const pwType = show ? 'text' : 'password'

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Cambiar contraseña" description="Usa una contraseña que no utilices en otros sitios.">
        <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
          {error && <Alert tone="error">{error}</Alert>}
          {done && <Alert tone="success">Tu contraseña se actualizó correctamente.</Alert>}
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label htmlFor="pw-current">Contraseña actual</Label>
              <div className="relative">
                <input id="pw-current" type={pwType} className={`${inputCls} pr-14`} value={current} onChange={(e) => setCurrent(e.target.value)} />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                  aria-pressed={show}
                  className="absolute top-0.5 right-0.5 flex size-11 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-section hover:text-ink"
                >
                  {show ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="pw-new">Nueva contraseña</Label>
              <input id="pw-new" type={pwType} className={inputCls} value={next} aria-describedby="pw-rules" onChange={(e) => setNext(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pw-confirm">Confirma la nueva contraseña</Label>
              <input id="pw-confirm" type={pwType} className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>
          <ul id="pw-rules" className="flex gap-6 text-sm">
            {rules.map((r) => (
              <li key={r.t} className={`flex items-center gap-2 ${r.ok ? 'text-success' : 'text-muted'}`}>
                <span aria-hidden>{r.ok ? '✓' : '○'}</span>
                {r.t}
                <span className="sr-only">{r.ok ? '(cumplido)' : '(pendiente)'}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end border-t border-line pt-6">
            <Button type="submit">Actualizar contraseña</Button>
          </div>
        </form>
      </Panel>

      <Panel title="Verificación y dispositivos" description="Controla cómo confirmas tus operaciones.">
        <div className="divide-y divide-line">
          <Switch
            label="Clave dinámica por SMS"
            description="Pedimos un código al celular para transferencias mayores a ₡500 000."
            checked={prefs.dynamicKey}
            onChange={(v) => setPrefs({ ...prefs, dynamicKey: v })}
          />
          {devices.map(({ Icon, t, d, current: cur }) => (
            <div key={t} className="flex items-center gap-4 py-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-section">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="text-base font-medium">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </div>
              {!cur && (
                <Button variant="ghost" onClick={() => {
                    setDevices((l) => l.filter((x) => x.t !== t))
                    notify(`Cerraste la sesión en ${t}.`)
                  }}>
                  Cerrar sesión
                </Button>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
