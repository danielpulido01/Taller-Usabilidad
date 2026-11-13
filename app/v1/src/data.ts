export type Account = {
  id: string
  name: string
  number: string
  balance: number
}

export type Contact = {
  id: string
  name: string
  bank: string
  iban: string
  initials: string
  fee: number
}

export type Movement = {
  id: string
  title: string
  detail: string
  date: string
  amount: number
  category: 'transfer' | 'shop' | 'service' | 'income' | 'food'
}

export const USER = { first: 'María', full: 'María Fernanda Vargas Solís', username: 'mvargas' }

export type Profile = { name: string; email: string; phone: string }

export const PROFILE: Profile = { name: 'Usuario Test', email: 'usuario.test@correo.cr', phone: '8812 4570' }

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || 'U'
  )
}

export const ACCOUNT_INFO: Record<string, { client: string; opened: string; rate: string; held: number; type: string }> = {
  ahorro: { client: '15202001026284066', opened: '03 feb 2019', rate: '2,75 % anual', held: 12500, type: 'Ahorro a la vista' },
  corriente: { client: '15201004410093712', opened: '18 ago 2021', rate: 'No aplica', held: 0, type: 'Cuenta corriente' },
}

export const CORRIENTE_MOVEMENTS: Movement[] = [
  { id: 'c1', title: 'Kolbi Hogar', detail: 'Domiciliación de servicio', date: '11 may 2025', amount: -32900, category: 'service' },
  { id: 'c2', title: 'Transferencia desde ahorros', detail: 'Transferencia interna', date: '08 may 2025', amount: 150000, category: 'income' },
  { id: 'c3', title: 'Farmacia Fischel', detail: 'Compra con tarjeta débito', date: '06 may 2025', amount: -14750, category: 'shop' },
  { id: 'c4', title: 'AyA Agua', detail: 'Pago de servicio', date: '04 may 2025', amount: -11320, category: 'service' },
]

export const ACCOUNTS: Account[] = [
  { id: 'ahorro', name: 'Cuenta de ahorros', number: 'CR05 0152 0200 1026 2840 66', balance: 1284560.75 },
  { id: 'corriente', name: 'Cuenta corriente', number: 'CR21 0152 0100 4410 0937 12', balance: 342180 },
]

export const CONTACTS: Contact[] = [
  { id: 'ana', name: 'Ana Rodríguez Mora', bank: 'Banco Aurora', iban: 'CR44 0152 0200 3381 7720 05', initials: 'AR', fee: 0 },
  { id: 'jose', name: 'José Pablo Jiménez', bank: 'Banco Cordillera', iban: 'CR73 0815 0120 5521 0043 88', initials: 'JJ', fee: 150 },
  { id: 'laura', name: 'Laura Chaves Quesada', bank: 'Banco Aurora', iban: 'CR10 0152 0200 7719 3305 41', initials: 'LC', fee: 0 },
  { id: 'diego', name: 'Diego Alfaro Brenes', bank: 'Banco del Valle', iban: 'CR92 0904 0100 2290 6615 07', initials: 'DA', fee: 150 },
]

export const MOVEMENTS: Movement[] = [
  { id: 'm1', title: 'Automercado Escazú', detail: 'Compra con tarjeta débito', date: '14 may 2025', amount: -38450, category: 'shop' },
  { id: 'm2', title: 'Salario mayo', detail: 'Depósito de planilla', date: '13 may 2025', amount: 865000, category: 'income' },
  { id: 'm3', title: 'ICE Electricidad', detail: 'Pago de servicio', date: '12 may 2025', amount: -27980, category: 'service' },
  { id: 'm4', title: 'Transferencia a Laura Chaves', detail: 'SINPE Móvil', date: '10 may 2025', amount: -15000, category: 'transfer' },
  { id: 'm5', title: 'Soda La Esquina', detail: 'Compra con tarjeta débito', date: '09 may 2025', amount: -6200, category: 'food' },
]

/** Formato de Costa Rica: ₡25 000,00 */
export function colones(value: number, decimals = true) {
  const abs = Math.abs(value)
  const [int, dec] = abs.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
  const sign = value < 0 ? '−' : ''
  return `${sign}₡${grouped}${decimals ? `,${dec}` : ''}`
}
