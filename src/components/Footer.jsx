import { FOOTER, SITE } from '../data'
import { Logo, SmartLink } from './ui'
import { NewsletterForm } from './forms'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const Col = ({ title, links }) => (
  <div>
    <p className="meta text-white/45">{title}</p>
    <ul className="mt-4 space-y-2.5">{links.map(([l, to]) => <li key={l}><SmartLink to={to} className="u-link text-white/70 transition-colors hover:text-white">{l}</SmartLink></li>)}</ul>
  </div>
)

/* Footer with the same columns as klh.edu.in: About Us · Important · Social Media · Newsletter. */
export default function Footer() {
  return (
    <footer className="surface-navy text-[14.5px] text-white">
      {/* thin brand line: red into yellow, the colours of the KLH logo */}
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-brand via-brand to-sun" />
      <div className="wrap">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_1.6fr] lg:gap-8">
          <div>
            <Logo onDark height={48} />
            <p className="mt-6 max-w-xs leading-relaxed text-white/65">K L H Deemed to be University — {SITE.foundation}, Hyderabad.</p>
            <p className="mt-4 text-white/65">Admissions <a href={tel(SITE.phone)} className="u-link font-semibold text-sun">{SITE.phone}</a></p>
          </div>
          <Col title="About Us" links={FOOTER.about} />
          <Col title="Important" links={FOOTER.important} />
          <Col title="Social Media" links={FOOTER.social} />
          <div>
            <p className="meta text-white/45">Newsletter</p>
            <p className="mb-4 mt-4 text-white/70">Get the latest KLH news delivered to your inbox.</p>
            <NewsletterForm dark />
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-[13px] text-white/50 md:flex-row md:justify-between">
          <p>© Copyright 2026 by K L H Deemed to be University. All Rights Reserved.</p>
          <p>Content and images: <a href="https://klh.edu.in/" className="u-link hover:text-white">klh.edu.in</a></p>
        </div>
      </div>
    </footer>
  )
}
