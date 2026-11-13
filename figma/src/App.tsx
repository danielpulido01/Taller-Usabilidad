import { useEffect, useRef, useState } from 'react'
import { Shell, type NavKey } from './components/Shell'
import { Toast } from './components/Toast'
import { ACCOUNTS, CONTACTS, MOVEMENTS, PROFILE, colones, type Account, type Contact } from './data'
import { Accounts } from './screens/Accounts'
import { Dashboard } from './screens/Dashboard'
import { Settings, type Prefs } from './screens/Settings'
import { Login } from './screens/Login'
import { StepAmount, StepConfirm, StepRecipient, Success, type Draft, type Receipt } from './screens/Transfer'

type Screen = 'login' | 'dashboard' | 'cuentas' | 'ajustes' | 'recipient' | 'amount' | 'confirm' | 'success'

const emptyDraft = (): Draft => ({ accountId: ACCOUNTS[0].id, contact: null, amount: 0, description: '' })

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [accounts, setAccounts] = useState(ACCOUNTS)
  const [contacts, setContacts] = useState(CONTACTS)
  const [movements, setMovements] = useState(MOVEMENTS)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [profile, setProfile] = useState(PROFILE)
  const [prefs, setPrefs] = useState<Prefs>({
    hideBalance: false,
    dynamicKey: true,
    notifyMovements: true,
    notifyEmail: true,
    notifyPromos: false,
  })
  const timer = useRef<number>(undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Banco Aurora · Banca en línea'
  }, [screen])

  const notify = (msg: string) => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 2800)
  }
  const soon = (label: string) => notify(`${label}: disponible próximamente en este prototipo.`)

  const startTransfer = (accountId = ACCOUNTS[0].id) => {
    setDraft({ ...emptyDraft(), accountId })
    setScreen('recipient')
  }

  const downloadStatement = (a: Account) => {
    const lines = [
      'BANCO AURORA — Estado de cuenta',
      `Titular: ${profile.name}`,
      `${a.name} · ${a.number}`,
      `Saldo disponible: ${colones(a.balance)}`,
      `Generado: ${new Date().toLocaleString('es-CR')}`,
    ]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `estado-de-cuenta-${a.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
    notify('Descargamos tu estado de cuenta.')
  }

  const nav = (k: NavKey) => {
    if (k === 'inicio') setScreen('dashboard')
    else if (k === 'transferir') startTransfer()
    else if (k === 'cuentas' || k === 'ajustes') setScreen(k)
    else soon({ pagos: 'Pagar servicios', tarjetas: 'Tarjetas' }[k])
  }

  const confirm = () => {
    const account = accounts.find((a) => a.id === draft.accountId)!
    const c = draft.contact!
    const reference = `AUR-${new Date().getFullYear()}-${String(Math.floor(10000000 + Math.random() * 89999999))}`
    setAccounts((list) => list.map((a) => (a.id === account.id ? { ...a, balance: a.balance - draft.amount - c.fee } : a)))
    setMovements((m) => [
      {
        id: reference,
        title: `Transferencia a ${c.name.split(' ').slice(0, 2).join(' ')}`,
        detail: draft.description || (c.fee ? 'Transferencia SINPE' : 'Transferencia interna'),
        date: 'Hoy',
        amount: -(draft.amount + c.fee),
        category: 'transfer',
      },
      ...m,
    ])
    setReceipt({ reference, date: new Date(), draft, account })
    setScreen('success')
  }

  if (screen === 'login') return <Login onLogin={() => setScreen('dashboard')} />

  const account = accounts.find((a) => a.id === draft.accountId)!
  const active: NavKey =
    screen === 'dashboard' ? 'inicio' : screen === 'cuentas' || screen === 'ajustes' ? screen : 'transferir'

  return (
    <>
      <Shell active={active} userName={profile.name} onNav={nav} onLogout={() => setScreen('login')}>
        {screen === 'dashboard' && (
          <Dashboard
            accounts={accounts}
            movements={movements}
            userName={profile.name}
            hideByDefault={prefs.hideBalance}
            onTransfer={() => startTransfer()}
            onStatement={() => setScreen('cuentas')}
            onSoon={soon}
          />
        )}
        {screen === 'cuentas' && (
          <Accounts accounts={accounts} movements={movements} onTransfer={startTransfer} onStatement={downloadStatement} />
        )}
        {screen === 'ajustes' && (
          <Settings
            profile={profile}
            onSaveProfile={(p) => {
              setProfile(p)
              notify('Guardamos los cambios de tu perfil.')
            }}
            prefs={prefs}
            setPrefs={setPrefs}
            notify={notify}
          />
        )}
        {screen === 'recipient' && (
          <StepRecipient
            accounts={accounts}
            contacts={contacts}
            draft={draft}
            setDraft={setDraft}
            onAddContact={(c: Contact) => setContacts((l) => [c, ...l])}
            onBack={() => setScreen('dashboard')}
            onNext={() => setScreen('amount')}
          />
        )}
        {screen === 'amount' && (
          <StepAmount
            account={account}
            draft={draft}
            setDraft={setDraft}
            onBack={() => setScreen('recipient')}
            onNext={() => setScreen('confirm')}
          />
        )}
        {screen === 'confirm' && (
          <StepConfirm account={account} draft={draft} onBack={() => setScreen('amount')} onConfirm={confirm} />
        )}
        {screen === 'success' && receipt && <Success receipt={receipt} onHome={() => setScreen('dashboard')} />}
      </Shell>
      <Toast message={toast} />
    </>
  )
}
