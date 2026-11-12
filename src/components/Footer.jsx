import { FOOTER } from '../site'
import { SITE } from '../data'
import { Logo, SmartLink } from './ui'
import { NewsletterForm } from './forms'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`

/* Footer: newsletter strip, then the owners' four columns (Explore KLH · Campuses · Admissions · Institution). */
export default function Footer() {
  return (
    <footer className="surface-navy text-[14.5px] text-white max-md:pb-28">
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-brand via-brand to-sun" />
      <div className="wrap">
        <div className="grid gap-6 border-b border-white/10 py-10 lg:grid-cols-[1fr_minmax(0,440px)] lg:items-end">
          <div>
            <p className="meta text-white/45">Newsletter</p>
            <p className="mt-3 font-display text-xl font-semibold">Get the latest KLH news delivered to your inbox.</p>
          </div>
          <NewsletterForm dark />
        </div>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <div>
            <Logo onDark height={46} />
            <p className="mt-5 max-w-xs leading-relaxed text-white/65">K L H Deemed to be University — {SITE.foundation}, Hyderabad.</p>
            <p className="mt-4 text-white/65">Admissions <a href={tel(SITE.phone)} className="u-link font-semibold text-sun">{SITE.phone}</a></p>
          </div>
          <div className="-mt-4 md:hidden">
            {FOOTER.map(([h, links]) => (
              <details key={h} className="group border-b border-white/10">
                <summary className="flex h-14 cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">{h}<span aria-hidden className="text-xl leading-none text-white/50 transition-transform group-open:rotate-45">+</span></summary>
                <ul className="space-y-1 pb-4">{links.map(([l, to]) => <li key={l}><SmartLink to={to} className="block py-2 text-white/75">{l}</SmartLink></li>)}</ul>
              </details>
            ))}
          </div>
          {FOOTER.map(([h, links]) => (
            <div key={h} className="max-md:hidden">
              <p className="meta text-white/45">{h}</p>
              <ul className="mt-4 space-y-2.5">{links.map(([l, to]) => <li key={l}><SmartLink to={to} className="u-link text-white/70 transition-colors hover:text-white">{l}</SmartLink></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[13px] text-white/50 md:flex-row md:justify-between">
          <p>© 2026 K L H Deemed to be University. All rights reserved.</p>
          <p>Content and images: <a href="/" className="u-link hover:text-white">klh.edu.in</a></p>
        </div>
      </div>
    </footer>
  )
}
