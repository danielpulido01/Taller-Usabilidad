import type { ReactNode } from 'react'
import { ArrowRightLeft, Bell, CreditCard, House, LogOut, Receipt, Settings, Wallet, CircleHelp } from 'lucide-react'
import { Logo } from './ui'
import { initials } from '../data'

export type NavKey = 'inicio' | 'cuentas' | 'transferir' | 'pagos' | 'tarjetas' | 'ajustes'

const NAV: { key: NavKey; label: string; Icon: typeof House }[] = [
  { key: 'inicio', label: 'Inicio', Icon: House },
  { key: 'cuentas', label: 'Cuentas', Icon: Wallet },
  { key: 'transferir', label: 'Transferir', Icon: ArrowRightLeft },
  { key: 'pagos', label: 'Pagar servicios', Icon: Receipt },
  { key: 'tarjetas', label: 'Tarjetas', Icon: CreditCard },
  { key: 'ajustes', label: 'Configuración', Icon: Settings },
]

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <Logo light />
        {children}
      </div>
    </header>
  )
}

export function Shell({
  active,
  userName,
  onNav,
  onLogout,
  children,
}: {
  active: NavKey
  userName: string
  onNav: (k: NavKey) => void
  onLogout: () => void
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header>
        <div className="flex items-center gap-2">
          <button
            className="relative flex size-11 cursor-pointer items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline-white"
            aria-label="Notificaciones, 2 sin leer"
            onClick={() => onNav('inicio')}
          >
            <Bell className="size-5" aria-hidden />
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-white" aria-hidden />
          </button>
          <div className="ml-2 flex items-center gap-3 border-l border-white/30 pl-4">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand">
              {initials(userName)}
            </span>
            <div className="text-sm leading-tight">
              <p className="font-semibold">{userName}</p>
              <p className="text-white/90">Último ingreso: hoy, 08:42 a. m.</p>
            </div>
          </div>
        </div>
      </Header>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <nav aria-label="Principal" className="flex w-64 shrink-0 flex-col border-r border-line px-4 py-8">
          <ul className="flex flex-col gap-1">
            {NAV.map(({ key, label, Icon }) => {
              const on = key === active
              return (
                <li key={key}>
                  <button
                    onClick={() => onNav(key)}
                    aria-current={on ? 'page' : undefined}
                    className={`relative flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-4 text-left text-base transition-colors ${
                      on ? 'bg-brand-soft font-semibold text-ink' : 'text-muted hover:bg-section hover:text-ink'
                    }`}
                  >
                    {on && <span className="absolute top-3 bottom-3 left-0 w-1 rounded-full bg-brand" aria-hidden />}
                    <Icon className={`size-5 ${on ? 'text-brand' : ''}`} aria-hidden />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
            <button className="flex h-12 cursor-pointer items-center gap-3 rounded-xl px-4 text-base text-muted hover:bg-section hover:text-ink">
              <CircleHelp className="size-5" aria-hidden />
              Ayuda
            </button>
            <button
              onClick={onLogout}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-xl px-4 text-base text-muted hover:bg-section hover:text-ink"
            >
              <LogOut className="size-5" aria-hidden />
              Cerrar sesión
            </button>
          </div>
        </nav>
        <main className="flex-1 bg-section px-12 py-10">{children}</main>
      </div>
    </div>
  )
}
