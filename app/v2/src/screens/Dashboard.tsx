import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  LayoutGrid,
  Receipt,
  ShoppingBag,
  Utensils,
  Zap,
  Copy,
} from 'lucide-react'
import { Button, Card } from '../components/ui'
import { colones, type Account, type Movement } from '../data'

const CAT = {
  transfer: ArrowRightLeft,
  shop: ShoppingBag,
  service: Zap,
  income: ArrowDownLeft,
  food: Utensils,
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
}

export function Dashboard({
  accounts,
  movements,
  userName,
  hideByDefault,
  onTransfer,
  onStatement,
  onSoon,
}: {
  accounts: Account[]
  movements: Movement[]
  userName: string
  hideByDefault: boolean
  onTransfer: () => void
  onStatement: () => void
  onSoon: (label: string) => void
}) {
  const [hidden, setHidden] = useState(hideByDefault)
  const main = accounts[0]
  const masked = '₡ ••• •••,••'

  const actions = [
    { label: 'Transferir', Icon: ArrowRightLeft, onClick: onTransfer },
    { label: 'Pagar servicios', Icon: Receipt, onClick: () => onSoon('Pagar servicios') },
    { label: 'Tarjetas', Icon: CreditCard, onClick: () => onSoon('Tarjetas') },
    { label: 'Más', Icon: LayoutGrid, onClick: () => onSoon('Más opciones') },
  ]

  return (
    <div className="mx-auto max-w-[1056px]">
      <p className="text-base text-muted">{greeting()},</p>
      <h1 className="text-[32px] leading-tight font-bold">{userName}</h1>

      <div className="mt-8 grid grid-cols-12 gap-6">
        <Card className="col-span-7 p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">{main.name} · Colones</p>
              <button
                onClick={() => navigator.clipboard?.writeText(main.number)}
                className="-ml-1 mt-1 flex min-h-11 cursor-pointer items-center gap-2 rounded px-1 text-sm text-muted hover:text-ink"
                aria-label={`Copiar número de cuenta ${main.number}`}
              >
                {main.number}
                <Copy className="size-4" aria-hidden />
              </button>
            </div>
            <button
              onClick={() => setHidden((h) => !h)}
              aria-pressed={hidden}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink hover:bg-section"
            >
              {hidden ? <Eye className="size-5" aria-hidden /> : <EyeOff className="size-5" aria-hidden />}
              {hidden ? 'Mostrar saldo' : 'Ocultar saldo'}
            </button>
          </div>
          <p className="mt-6 text-sm text-muted">Saldo disponible</p>
          <p className="mt-1 text-[40px] leading-tight font-bold tracking-tight tabular-nums" aria-live="polite">
            {hidden ? masked : colones(main.balance)}
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={onTransfer} icon={<ArrowRightLeft className="size-5" aria-hidden />}>
              Transferir
            </Button>
            <Button variant="secondary" onClick={onStatement}>
              Ver estado de cuenta
            </Button>
          </div>
        </Card>

        <div className="col-span-5 flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Accesos rápidos</h2>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {actions.map(({ label, Icon, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="group flex cursor-pointer flex-col items-center gap-2 rounded-xl px-1 py-3 text-center text-sm font-medium text-ink hover:bg-section"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </Card>
          <Card className="flex-1 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{accounts[1].name}</p>
              <span className="text-sm text-muted">{accounts[1].number.slice(-7)}</span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{hidden ? masked : colones(accounts[1].balance)}</p>
            <p className="mt-1 text-sm text-muted">Saldo disponible</p>
          </Card>
        </div>

        <Card className="col-span-12 p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Últimos movimientos</h2>
            <Button variant="ghost" onClick={() => onSoon('Todos los movimientos')} className="text-sm">
              Ver todos
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {movements.slice(0, 5).map((m) => {
              const Icon = CAT[m.category]
              const income = m.amount > 0
              return (
                <li key={m.id} className="grid grid-cols-12 items-center gap-6 py-4">
                  <div className="col-span-6 flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-section text-ink">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-base font-medium">{m.title}</p>
                      <p className="text-sm text-muted">{m.detail}</p>
                    </div>
                  </div>
                  <p className="col-span-3 text-sm text-muted">{m.date}</p>
                  <p
                    className={`col-span-3 text-right text-base font-semibold tabular-nums ${income ? 'text-success' : 'text-ink'}`}
                  >
                    {hidden ? '•••••' : income ? `+${colones(m.amount)}` : colones(m.amount)}
                  </p>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
