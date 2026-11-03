import { FOOTER, SITE } from '../data'
import { Logo, SmartLink } from './ui'
import { NewsletterForm } from './forms'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const Col = ({ title, links }) => (
  <div>
    <p className="meta text-muted">{title}</p>
    <ul className="mt-4 space-y-2.5">{links.map(([l, to]) => <li key={l}><SmartLink to={to} className="u-link text-ink-2 hover:text-navy">{l}</SmartLink></li>)}</ul>
  </div>
)

/* Footer with the same columns as klh.edu.in: About Us · Important · Social Media · Newsletter. */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#f5f6f8] text-[14.5px] text-ink">
      <div className="wrap">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_1.6fr] lg:gap-8">
          <div>
            <Logo height={52} />
            <p className="mt-6 max-w-xs leading-relaxed text-ink-2">K L H Deemed to be University — {SITE.foundation}, Hyderabad.</p>
            <p className="mt-4 text-ink-2">Admissions <a href={tel(SITE.phone)} className="u-link font-semibold text-navy">{SITE.phone}</a></p>
          </div>
          <Col title="About Us" links={FOOTER.about} />
          <Col title="Important" links={FOOTER.important} />
          <Col title="Social Media" links={FOOTER.social} />
          <div>
            <p className="meta text-muted">Newsletter</p>
            <p className="mb-4 mt-4 text-ink-2">Get the latest KLH news delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-line py-6 text-[13px] text-muted md:flex-row md:justify-between">
          <p>© Copyright 2026 by K L H Deemed to be University. All Rights Reserved.</p>
          <p>Content and images: <a href="https://klh.edu.in/" className="u-link hover:text-navy">klh.edu.in</a></p>
        </div>
      </div>
    </footer>
  )
}
