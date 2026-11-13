import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({
  variant = 'primary',
  loading,
  icon,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean; icon?: ReactNode }) {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed'
  const styles: Record<Variant, string> = {
    primary:
      'bg-brand text-white hover:bg-brand-dark active:bg-[#8f0e23] disabled:bg-[#E4E4E8] disabled:text-[#6B6B6B]',
    secondary:
      'border border-[#C9C9CF] bg-white text-ink hover:bg-section hover:border-[#9A9AA2] disabled:text-[#6B6B6B] disabled:bg-white',
    ghost: 'text-ink hover:bg-section px-4',
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white shadow-card ${className}`}>{children}</div>
}

type Tone = 'success' | 'warning' | 'error' | 'info'

export function Alert({ tone, title, children }: { tone: Tone; title?: string; children: ReactNode }) {
  const map = {
    success: { cls: 'bg-success-soft text-success border-[#B7E4C7]', Icon: CircleCheck },
    warning: { cls: 'bg-warning-soft text-warning border-[#F5D9A8]', Icon: TriangleAlert },
    error: { cls: 'bg-error-soft text-error border-[#F6C2CD]', Icon: CircleAlert },
    info: { cls: 'bg-section text-ink border-line', Icon: Info },
  }[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border p-4 text-sm ${map.cls}`}>
      <map.Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-sm font-semibold text-ink">
      <span>{children}</span>
      {hint && <span className="font-normal text-muted">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'h-12 w-full rounded-xl border border-[#8E8E96] bg-white px-4 text-base text-ink placeholder:text-[#6B6B6B] transition-colors hover:border-ink focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-ink aria-invalid:border-error aria-invalid:focus-visible:outline-error'

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Destinatario', 'Monto', 'Confirmación']
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-muted">Paso {step} de 3</p>
      <ol className="flex items-center gap-2" aria-label="Progreso de la transferencia">
        {steps.map((label, i) => {
          const n = i + 1
          const done = n < step
          const current = n === step
          return (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? 'step' : undefined}>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-ink text-white' : current ? 'bg-brand text-white' : 'border border-[#C9C9CF] text-muted'
                }`}
              >
                {done ? <Check className="size-4" aria-hidden /> : n}
              </span>
              <span className={`text-sm ${current ? 'font-semibold text-ink' : 'text-muted'}`}>{label}</span>
              {n < 3 && <span className={`mx-2 h-px flex-1 ${done ? 'bg-ink' : 'bg-line'}`} aria-hidden />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p className="text-base font-medium">{label}</p>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="group flex size-11 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full"
      >
        <span
          className={`flex h-7 w-12 items-center rounded-full p-0.5 transition-colors ${
            checked ? 'bg-success' : 'bg-[#8E8E96] group-hover:bg-[#6B6B6B]'
          }`}
        >
          <span
            className={`size-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
          />
        </span>
      </button>
    </div>
  )
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="8" fill={light ? '#fff' : '#D3172E'} />
        <path d="M7 23 16 8l9 15" fill="none" stroke={light ? '#D3172E' : '#fff'} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M11.5 19h9" stroke={light ? '#D3172E' : '#fff'} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Banco Aurora
      </span>
    </div>
  )
}
