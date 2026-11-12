import { Navigate, useParams } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { CLONED, PAGES, SITE } from '../data'
import { STANDALONE } from '../site'
import { PageHeader } from '../components/sectionpage'
import { ImportedBlocks } from '../components/content'
import { ReadingProgress } from '../components/motion'
import { CourseEnquiryForm } from '../components/forms'
import { useCallbackDialog } from '../components/Callback'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`

/* klh.edu.in pages that stay pages of their own (src/site.js STANDALONE), e.g. /students-placed. */
export default function KlhPage() {
  const { slug } = useParams()
  const page = PAGES[slug]
  const title = STANDALONE[slug] || CLONED[slug]?.title
  const callback = useCallbackDialog()
  if (!page || !title) return <Navigate to="/404" replace />
  // drop the page's own first heading when it only repeats the title
  const skip = page.blocks[0]?.type === 'h' && page.blocks[0].text.toLowerCase().replace(/\W/g, '') === title.toLowerCase().replace(/\W/g, '') ? 1 : 0
  return (<>
    <ReadingProgress />
    <PageHeader title={title} banner={page.banner} crumb={title} />
    <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
      <article className="min-w-0">
        <ImportedBlocks slug={slug} skip={skip} />
        {slug === 'transfer-of-admission' && <div className="mt-16 rounded-[12px] border border-line bg-surface p-6 md:p-8"><h2 className="display-3">Programme enquiry</h2><p className="mb-6 mt-1 text-sm text-muted">An admissions counsellor will contact you.</p><CourseEnquiryForm /></div>}
      </article>
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="surface-navy rounded-[14px] p-6 text-white">
          <p className="meta text-sun">Admissions 2026 open</p>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">Talk to an admissions counsellor</p>
          <button onClick={() => callback()} className="btn-primary btn-sm mt-5 w-full">Request a call back</button>
          <a href={tel(SITE.phone)} className="mt-4 flex items-center justify-center gap-2 text-[14px] text-white/75 hover:text-white"><Phone size={14} />{SITE.phone}</a>
        </div>
      </aside>
    </div>
  </>)
}
