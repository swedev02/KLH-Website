import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { SITE } from '../data'
import { CallbackForm } from './forms'

const Ctx = createContext(() => {})
// eslint-disable-next-line react-refresh/only-export-components
export const useCallbackDialog = () => useContext(Ctx)

/* "Request a call back" dialog, opened from the header, hero, programme cards and admissions band. */
export function CallbackProvider({ children }) {
  const [state, setState] = useState(null) // null = closed, else { programme }
  const dialog = useRef(null)
  useEffect(() => {
    const d = dialog.current
    if (state && !d.open) d.showModal()
    if (!state && d.open) d.close()
  }, [state])
  return (
    <Ctx.Provider value={(programme = '') => setState({ programme })}>
      {children}
      <dialog ref={dialog} onClose={() => setState(null)} onClick={e => e.target === dialog.current && setState(null)}
        className="m-auto w-[min(480px,calc(100vw-24px))] rounded-[12px] p-0 shadow-2xl backdrop:bg-navy/60 backdrop:backdrop-blur-[2px]" aria-labelledby="callback-title">
        {state && (
          <div>
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="meta text-blue">Admissions 2026–27</p>
                <h2 id="callback-title" className="mt-1.5 font-display text-xl font-semibold">Request a call back</h2>
                <p className="mt-1 text-sm text-muted">Or call the help desk on {SITE.phone}.</p>
              </div>
              <button onClick={() => setState(null)} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line hover:border-navy"><X size={18} /></button>
            </div>
            <div className="px-6 py-6"><CallbackForm programme={state.programme} /></div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  )
}
