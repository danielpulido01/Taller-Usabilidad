import { Info } from 'lucide-react'

export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      {message && (
        <div className="flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-sm text-white shadow-card">
          <Info className="size-5" aria-hidden />
          {message}
        </div>
      )}
    </div>
  )
}
