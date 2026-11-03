import { HomeSlider, AboutKlh, LatestNews, Gallery, WhyStudy, Counters, CenterOfExcellence, Testimonials, AwardsRankings, OurPartners, EnquiryBand } from '../components/home'

// Same sections, in the same order, as the klh.edu.in home page:
// slider → About KLH / Working Together → Latest News → gallery → Why study at KL University →
// placement counters → Center of Excellence → Testimonials → Recent Awards & Rankings → Our Partners.
export default function Home() {
  return (<>
    <h1 className="sr-only">KL University Hyderabad (KLH), Koneru Lakshmaiah Education Foundation</h1>
    <HomeSlider /><AboutKlh /><LatestNews /><Gallery /><WhyStudy /><Counters /><CenterOfExcellence /><Testimonials /><AwardsRankings /><OurPartners /><EnquiryBand />
  </>)
}
