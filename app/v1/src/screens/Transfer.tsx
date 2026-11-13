import { useState, type ReactNode } from 'react'
import { ArrowLeft, Check, CircleCheck, Download, Ellipsis, House, Plus, Search, ShieldCheck, UserPlus, X } from 'lucide-react'
import { Alert, Button, Card, Label, inputCls } from '../components/ui'
import { colones, type Account, type Contact } from '../data'

export type Draft = {
  accountId: string
  contact: Contact | null
  amount: number
  description: string
}

function Frame({
  step,
  title,
  onBack,
  backLabel = 'Atrás',
  aside,
  children,
}: {
  step: 1 | 2 | 3
  title: string
  onBack: () => void
  backLabel?: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-[1056px]">
      <button
        onClick={onBack}
        className="-ml-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-base font-semibold text-ink hover:bg-white"
      >
        <ArrowLeft className="size-5" aria-hidden />
        {backLabel}
      </button>
      <h1 className="mt-4 text-[32px] leading-tight font-bold">{title}</h1>
      {/* Defecto D-07: no se muestra en qué paso del proceso está el usuario. */}
      <div className="mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-8">{children}</div>
        {aside && <aside className="col-span-4">{aside}</aside>}
      </div>
    </div>
  )
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'md' | 'lg' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-section font-semibold text-ink ${
        size === 'lg' ? 'size-16 text-xl' : 'size-11 text-sm'
      }`}
      aria-hidden
    >
      {initials}
    </span>
  )
}

function SummaryAside({ account, draft }: { account: Account; draft: Draft }) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Resumen</h2>
      <dl className="mt-4 flex flex-col gap-4 text-sm">
        <div>
          <dt className="text-muted">Desde</dt>
          <dd className="mt-1 font-semibold">{account.name}</dd>
          <dd className="text-muted">{colones(account.balance)} disponibles</dd>
        </div>
        <div className="border-t border-line pt-4">
          <dt className="text-muted">Para</dt>
          <dd className="mt-1 font-semibold">{draft.contact?.name ?? 'Sin seleccionar'}</dd>
          {draft.contact && <dd className="text-muted">{draft.contact.bank}</dd>}
        </div>
        {draft.amount > 0 && (
          <div className="border-t border-line pt-4">
            <dt className="text-muted">Monto</dt>
            <dd className="mt-1 font-semibold tabular-nums">{colones(draft.amount)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-6 flex gap-2 rounded-xl bg-section p-4 text-sm text-muted">
        <ShieldCheck className="size-5 shrink-0 text-ink" aria-hidden />
        Las transferencias entre cuentas de Banco Aurora se acreditan al instante.
      </div>
    </Card>
  )
}

/* ---------- Paso 1 ---------- */
export function StepRecipient({
  accounts,
  contacts,
  draft,
  setDraft,
  onAddContact,
  onBack,
  onNext,
}: {
  accounts: Account[]
  contacts: Contact[]
  draft: Draft
  setDraft: (d: Draft) => void
  onAddContact: (c: Contact) => void
  onBack: () => void
  onNext: () => void
}) {
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [iban, setIban] = useState('')
  const [touched, setTouched] = useState(false)
  const ibanOk = /^CR\d{20}$/.test(iban.replace(/\s/g, '').toUpperCase())
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  const account = accounts.find((a) => a.id === draft.accountId)!

  function saveContact() {
    setTouched(true)
    if (!name.trim() || !ibanOk) return
    const clean = iban.replace(/\s/g, '').toUpperCase()
    const c: Contact = {
      id: `n${Date.now()}`,
      name: name.trim(),
      bank: clean.slice(4, 7) === '015' ? 'Banco Aurora' : 'Otro banco (SINPE)',
      iban: clean.replace(/(.{4})/g, '$1 ').trim(),
      initials: name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join(''),
      fee: clean.slice(4, 7) === '015' ? 0 : 150,
    }
    onAddContact(c)
    setDraft({ ...draft, contact: c })
    setAdding(false)
    setName('')
    setIban('')
    setTouched(false)
  }

  return (
    <Frame step={1} title="¿A quién le transfieres?" onBack={onBack} backLabel="Volver al inicio" aside={<SummaryAside account={account} draft={draft} />}>
      <Card className="p-8">
        <fieldset>
          <legend className="text-xl font-semibold">Cuenta de origen</legend>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {accounts.map((a) => {
              const on = a.id === draft.accountId
              return (
                <label
                  key={a.id}
                  className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
                    on ? 'border-brand bg-brand-soft/50 ring-1 ring-brand' : 'border-line hover:border-[#9A9AA2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="origin"
                    className="sr-only"
                    checked={on}
                    onChange={() => setDraft({ ...draft, accountId: a.id })}
                  />
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-brand' : 'border-[#8E8E96]'}`}
                    aria-hidden
                  >
                    {on && <span className="size-2.5 rounded-full bg-brand" />}
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{a.name}</span>
                    <span className="block text-sm text-muted">•••• {a.number.slice(-7)}</span>
                    <span className="mt-2 block text-base font-semibold tabular-nums">{colones(a.balance)}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <div className="flex items-center justify-between">
            <legend className="text-xl font-semibold">Contactos frecuentes</legend>
            {!adding && (
              <Button variant="ghost" onClick={() => setAdding(true)} icon={<UserPlus className="size-5" aria-hidden />}>
                Agregar contacto
              </Button>
            )}
          </div>

          {adding && (
            <div className="mt-4 rounded-xl border border-line bg-section p-6">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold">Nuevo contacto</p>
                <button
                  onClick={() => setAdding(false)}
                  aria-label="Cerrar formulario de nuevo contacto"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-xl hover:bg-white"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nc-name">Nombre completo</Label>
                  <input
                    id="nc-name"
                    className={inputCls}
                    value={name}
                    aria-invalid={touched && !name.trim()}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej.: Carlos Méndez"
                  />
                </div>
                <div>
                  <Label htmlFor="nc-iban">Cuenta IBAN</Label>
                  <input
                    id="nc-iban"
                    className={inputCls}
                    value={iban}
                    aria-invalid={touched && !ibanOk}
                    aria-describedby="nc-iban-help"
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="CR00 0000 0000 0000 0000 00"
                  />
                  <p id="nc-iban-help" className={`mt-2 text-sm ${touched && !ibanOk ? 'text-error' : 'text-muted'}`}>
                    {touched && !ibanOk ? 'Revisa el IBAN: debe iniciar con CR y tener 22 caracteres.' : 'CR seguido de 20 dígitos.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={saveContact} icon={<Plus className="size-5" aria-hidden />}>
                  Guardar contacto
                </Button>
              </div>
            </div>
          )}

          <div className="relative mt-4">
            <label htmlFor="search" className="sr-only">
              Buscar contacto
            </label>
            <Search className="pointer-events-none absolute top-3.5 left-4 size-5 text-muted" aria-hidden />
            <input id="search" className={`${inputCls} pl-12`} placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {filtered.map((c) => {
              const on = draft.contact?.id === c.id
              return (
                <li key={c.id}>
                  <label
                    className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
                      on ? 'border-brand bg-brand-soft/50 ring-1 ring-brand' : 'border-line hover:border-[#9A9AA2] hover:bg-section'
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact"
                      className="sr-only"
                      checked={on}
                      onChange={() => setDraft({ ...draft, contact: c })}
                    />
                    <Avatar initials={c.initials} />
                    <span className="flex-1">
                      <span className="block text-base font-semibold">{c.name}</span>
                      <span className="block text-sm text-muted">
                        {c.bank} · {c.iban.slice(-7)}
                      </span>
                    </span>
                    {on && (
                      <span className="flex size-7 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="size-4" aria-hidden />
                      </span>
                    )}
                  </label>
                </li>
              )
            })}
            {filtered.length === 0 && <p className="py-4 text-sm text-muted">No encontramos contactos con ese nombre.</p>}
          </ul>
        </fieldset>

        <div className="mt-8 flex justify-end gap-3 border-t border-line pt-6">
          {/* Defecto D-02: la acción principal parece un enlace gris pequeño y "Cancelar" es el botón destacado. */}
          <button
            onClick={onNext}
            disabled={!draft.contact}
            className="mr-auto cursor-pointer px-1 text-xs text-[#b4b4bb] disabled:cursor-not-allowed"
          >
            Continuar
          </button>
          <Button onClick={onBack}>Cancelar</Button>
        </div>
      </Card>
    </Frame>
  )
}

/* ---------- Paso 2 ---------- */
function formatInput(raw: string) {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10)
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function StepAmount({
  account,
  draft,
  setDraft,
  onBack,
  onNext,
}: {
  account: Account
  draft: Draft
  setDraft: (d: Draft) => void
  onBack: () => void
  onNext: () => void
}) {
  const [text, setText] = useState(draft.amount ? formatInput(String(draft.amount)) : '')
  const amount = Number(text.replace(/\D/g, '')) || 0
  const fee = draft.contact?.fee ?? 0
  const over = amount + fee > account.balance
  const large = !over && amount > 500000
  const canContinue = amount > 0 && !over

  function update(v: string) {
    const t = formatInput(v)
    setText(t)
    setDraft({ ...draft, amount: Number(t.replace(/\D/g, '')) || 0 })
  }

  return (
    <Frame step={2} title="¿Cuánto quieres transferir?" onBack={onBack} aside={<SummaryAside account={account} draft={draft} />}>
      <Card className="p-8">
        <div className="flex items-center gap-4 rounded-xl bg-section p-4">
          <Avatar initials={draft.contact!.initials} />
          <div>
            <p className="text-sm text-muted">Transfieres a</p>
            <p className="text-base font-semibold">{draft.contact!.name}</p>
          </div>
        </div>

        <div className="mt-8">
          {/* Defecto D-08: el texto "Monto" no está asociado al campo, que queda sin nombre accesible. */}
          <p className="mb-2 text-sm font-semibold text-ink">Monto</p>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-2xl font-semibold text-muted" aria-hidden>
              ₡
            </span>
            <input
              id="amount"
              inputMode="numeric"
              autoFocus
              className={`${inputCls} h-16 pl-12 text-2xl font-semibold tabular-nums`}
              value={text}
              aria-invalid={over}
              aria-describedby="amount-msg"
              onChange={(e) => update(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canContinue && onNext()}
            />
          </div>
          <div id="amount-msg" className="mt-3" aria-live="polite">
            {over ? (
              // Defecto D-04: el error no dice qué pasó ni cómo corregirlo.
              <Alert tone="error">Error: monto inválido.</Alert>
            ) : large ? (
              <Alert tone="warning" title="Verificación adicional">
                Por tu seguridad, los montos mayores a ₡500 000 se confirman con tu clave dinámica.
              </Alert>
            ) : (
              <p className="text-sm text-muted">
                {fee > 0 ? `Comisión SINPE: ${colones(fee)}.` : 'Sin comisión entre cuentas de Banco Aurora.'}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2" role="group" aria-label="Montos sugeridos">
            {[10000, 25000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => update(String(v))}
                aria-pressed={amount === v}
                className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors ${
                  amount === v ? 'border-ink bg-ink text-white' : 'border-[#C9C9CF] text-ink hover:border-ink'
                }`}
              >
                {colones(v, false)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Label htmlFor="desc" hint={`${draft.description.length}/40 · Opcional`}>
            Descripción
          </Label>
          <input
            id="desc"
            maxLength={40}
            className={inputCls}
            placeholder="Ej.: Almuerzo del viernes"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-line pt-6">
          {!canContinue && !over && <p className="mr-auto text-sm text-muted">Ingresa un monto para continuar.</p>}
          <Button variant="secondary" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onNext} disabled={!canContinue}>
            Continuar
          </Button>
        </div>
      </Card>
    </Frame>
  )
}

/* ---------- Paso 3 ---------- */
export function StepConfirm({
  account,
  draft,
  onBack,
  onConfirm,
}: {
  account: Account
  draft: Draft
  onBack: () => void
  onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)
  const c = draft.contact!
  const total = draft.amount + c.fee
  const rows: [string, ReactNode][] = [
    ['Cuenta de origen', <><span className="block font-semibold">{account.name}</span><span className="text-sm text-muted">{account.number}</span></>],
    ['Destinatario', <><span className="block font-semibold">{c.name}</span><span className="text-sm text-muted">{c.bank} · {c.iban}</span></>],
    ['Descripción', draft.description || <span className="text-muted">Sin descripción</span>],
    ['Monto', <span className="font-semibold tabular-nums">{colones(draft.amount)}</span>],
    ['Comisión', <span className="tabular-nums">{c.fee ? colones(c.fee) : '₡0,00 · Sin costo'}</span>],
  ]
  return (
    <Frame step={3} title="Confirma tu transferencia" onBack={onBack}>
      <Card className="p-8">
        <p className="text-base text-muted">Revisa los datos antes de confirmar. Una vez enviada, la transferencia no se puede revertir.</p>
        <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-6 px-6 py-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="col-span-2 text-right text-base">{v}</dd>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-6 bg-section px-6 py-5">
            <dt className="text-base font-semibold">Total a debitar</dt>
            <dd className="col-span-2 text-right text-2xl font-bold tabular-nums">{colones(total)}</dd>
          </div>
        </dl>
        <div className="mt-8 flex justify-end gap-3 border-t border-line pt-6">
          <Button variant="secondary" onClick={onBack} disabled={loading}>
            Editar
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true)
              setTimeout(onConfirm, 900)
            }}
          >
            {loading ? 'Procesando…' : 'Confirmar transferencia'}
          </Button>
        </div>
      </Card>
    </Frame>
  )
}

/* ---------- Comprobante ---------- */
export type Receipt = { reference: string; date: Date; draft: Draft; account: Account }

export function Success({ receipt, onHome }: { receipt: Receipt; onHome: () => void }) {
  const { draft, account, reference, date } = receipt
  const [menu, setMenu] = useState(false)
  const c = draft.contact!
  const fecha = date.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' })
  const hora = date.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })

  function download() {
    const lines = [
      'BANCO AURORA — Comprobante de transferencia',
      '',
      `Referencia: ${reference}`,
      `Fecha y hora: ${fecha}, ${hora}`,
      `Origen: ${account.name} ${account.number}`,
      `Destinatario: ${c.name} (${c.bank}) ${c.iban}`,
      `Monto: ${colones(draft.amount)}`,
      `Comisión: ${colones(c.fee)}`,
      `Descripción: ${draft.description || '—'}`,
    ]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `comprobante-${reference}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[592px] py-4">
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center px-10 pt-12 pb-8 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-success-soft">
            <CircleCheck className="size-11 text-success" strokeWidth={1.75} aria-hidden />
          </span>
          <h1 className="mt-6 text-2xl font-bold">Transferencia exitosa</h1>
          <p className="mt-2 text-base text-muted">El dinero ya está en camino a {c.name.split(' ')[0]}.</p>
          <p className="mt-6 text-[40px] leading-tight font-bold tabular-nums">{colones(draft.amount)}</p>
        </div>
        <dl className="mx-10 divide-y divide-line border-t border-dashed border-[#C9C9CF] text-base">
          {[
            ['Destinatario', `${c.name}`],
            ['Banco', c.bank],
            ['Desde', `${account.name} •••• ${account.number.slice(-7)}`],
            ['Comisión', c.fee ? colones(c.fee) : '₡0,00'],
            ['Número de referencia', reference],
            ['Fecha y hora', `${fecha}, ${hora}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-right font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {/* Defecto D-05: "Descargar comprobante" queda escondido en un menú secundario "⋯". */}
        <div className="relative mt-8 flex gap-3 bg-section px-10 py-6">
          <Button className="flex-1" onClick={onHome} icon={<House className="size-5" aria-hidden />}>
            Volver al inicio
          </Button>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Más opciones"
            aria-expanded={menu}
            className="flex size-12 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-white"
          >
            <Ellipsis className="size-5" aria-hidden />
          </button>
          {menu && (
            <div className="absolute right-10 bottom-20 rounded-xl border border-line bg-white p-1 shadow-card">
              <button
                onClick={download}
                className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-4 text-sm hover:bg-section"
              >
                <Download className="size-4" aria-hidden />
                Descargar comprobante
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
