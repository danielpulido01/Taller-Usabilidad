import { useState } from 'react'
import { ArrowDownLeft, ArrowRightLeft, Check, Copy, Download, ShoppingBag, Utensils, Wallet, Zap } from 'lucide-react'
import { Button, Card } from '../components/ui'
import { ACCOUNT_INFO, CORRIENTE_MOVEMENTS, colones, type Account, type Movement } from '../data'

const CAT = { transfer: ArrowRightLeft, shop: ShoppingBag, service: Zap, income: ArrowDownLeft, food: Utensils }

export function Accounts({
  accounts,
  movements,
  onTransfer,
  onStatement,
}: {
  accounts: Account[]
  movements: Movement[]
  onTransfer: (accountId: string) => void
  onStatement: (account: Account) => void
}) {
  const [selected, setSelected] = useState(accounts[0].id)
  const [copied, setCopied] = useState(false)
  const account = accounts.find((a) => a.id === selected)!
  const info = ACCOUNT_INFO[account.id]
  const list = account.id === 'ahorro' ? movements : CORRIENTE_MOVEMENTS
  const total = accounts.reduce((s, a) => s + a.balance, 0)

  function copy() {
    navigator.clipboard?.writeText(account.number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-[1056px]">
      <h1 className="text-[32px] leading-tight font-bold">Cuentas</h1>
      <p className="mt-2 text-base text-muted">
        Saldo total en colones: <span className="font-semibold text-ink tabular-nums">{colones(total)}</span>
      </p>

      <div className="mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-4 flex flex-col gap-4" role="tablist" aria-label="Tus cuentas" aria-orientation="vertical">
          {accounts.map((a) => {
            const on = a.id === selected
            return (
              <button
                key={a.id}
                role="tab"
                aria-selected={on}
                onClick={() => setSelected(a.id)}
                className={`flex cursor-pointer flex-col rounded-xl border bg-white p-6 text-left shadow-card transition-colors ${
                  on ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-[#9A9AA2]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex size-11 items-center justify-center rounded-full ${on ? 'bg-brand-soft text-brand' : 'bg-section text-ink'}`}>
                    <Wallet className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{a.name}</span>
                    <span className="block text-sm text-muted">•••• {a.number.slice(-7)}</span>
                  </span>
                </span>
                <span className="mt-4 text-sm text-muted">Saldo disponible</span>
                <span className="text-2xl font-bold tabular-nums">{colones(a.balance)}</span>
              </button>
            )
          })}
        </div>

        <div className="col-span-8 flex flex-col gap-6" role="tabpanel" aria-label={account.name}>
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted">{info.type} · Colones</p>
                <h2 className="mt-1 text-2xl font-bold">{account.name}</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
                <Check className="size-4" aria-hidden />
                Activa
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 rounded-xl bg-section p-6">
              <div>
                <p className="text-sm text-muted">Saldo disponible</p>
                <p className="mt-1 text-[32px] leading-tight font-bold tabular-nums">{colones(account.balance)}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Saldo contable</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{colones(account.balance + info.held)}</p>
                <p className="text-sm text-muted">Fondos retenidos: {colones(info.held)}</p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-base">
              <div className="col-span-2">
                <dt className="text-sm text-muted">Cuenta IBAN</dt>
                <dd className="flex items-center gap-2 font-medium tabular-nums">
                  {account.number}
                  <button
                    onClick={copy}
                    className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-semibold hover:bg-section"
                  >
                    {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Cuenta cliente</dt>
                <dd className="font-medium tabular-nums">{info.client}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Tasa de interés</dt>
                <dd className="font-medium">{info.rate}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Fecha de apertura</dt>
                <dd className="font-medium">{info.opened}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Moneda</dt>
                <dd className="font-medium">Colones costarricenses (CRC)</dd>
              </div>
            </dl>

            <div className="mt-8 flex gap-3 border-t border-line pt-6">
              <Button onClick={() => onTransfer(account.id)} icon={<ArrowRightLeft className="size-5" aria-hidden />}>
                Transferir
              </Button>
              <Button variant="secondary" onClick={() => onStatement(account)} icon={<Download className="size-5" aria-hidden />}>
                Estado de cuenta
              </Button>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-semibold">Movimientos recientes</h2>
            <ul className="mt-4 divide-y divide-line">
              {list.map((m) => {
                const Icon = CAT[m.category]
                const income = m.amount > 0
                return (
                  <li key={m.id} className="flex items-center gap-4 py-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-section">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-medium">{m.title}</p>
                      <p className="text-sm text-muted">
                        {m.detail} · {m.date}
                      </p>
                    </div>
                    <p className={`text-base font-semibold tabular-nums ${income ? 'text-success' : ''}`}>
                      {income ? `+${colones(m.amount)}` : colones(m.amount)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
