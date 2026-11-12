// Fee structure, transcribed from the fee images and tabs on https://klh.edu.in/fee-structure/
// (fee-1-e1776840155685.png: Aziz Nagar · fee.png: Bowrampet · MBA-1.png: non-engineering · HOSTEL.png: hostel; transport and refund are text there).
// Amounts in rupees. Figures are exactly as published, including Bowrampet B.Tech CS&IT's ₹1,16,500 first-trimester total.
// When KLH publishes new fees, update the numbers here.

const ENGG_COLS = ['Programme', 'Duration', 'Admission fee (one time)', 'Merit fee / trimester', 'Total for 1st trimester']
const SEM_COLS = ['Programme', 'Duration', 'Admission fee (one time)', 'Merit fee / semester', 'Total for 1st semester']

export const FEES = [
  {
    id: 'engineering', label: 'Engineering',
    groups: [
      { campus: 'Hyderabad, Aziz Nagar campus', tables: [
        { title: 'Engineering programmes (3 terms a year)', cols: ENGG_COLS, rows: [
          ['B.Tech · Computer Science and Engineering', '4 years', 16000, 110000, 126000],
          ['B.Tech · Artificial Intelligence & Data Science', '4 years', 16000, 110000, 126000],
          ['B.Tech · Electronics and Communication Engineering', '4 years', 16000, 95000, 111000],
        ] },
        { title: 'Semester programmes', cols: SEM_COLS, rows: [
          ['BCA', '3 years', 16000, 110000, 126000],
        ] },
        { title: 'Lateral entry engineering programmes (3 terms a year)', cols: ENGG_COLS, rows: [
          ['B.Tech · Computer Science and Engineering', '3 years', 16000, 100000, 116000],
          ['B.Tech · Artificial Intelligence & Data Science', '3 years', 16000, 97000, 113000],
          ['B.Tech · Electronics and Communication Engineering', '3 years', 16000, 90400, 106400],
        ] },
      ] },
      { campus: 'Hyderabad, Bowrampet campus', tables: [
        { title: 'Engineering programmes (3 terms a year)', cols: ENGG_COLS, rows: [
          ['B.Tech · Computer Science and Engineering', '4 years', 16000, 110000, 126000],
          ['B.Tech · Artificial Intelligence & Data Science', '4 years', 16000, 110000, 126000],
          ['B.Tech · Computer Science & Information Technology', '4 years', 16000, 100000, 116500],
          ['B.Tech · Electronics and Communication Engineering', '4 years', 16000, 95000, 111000],
        ] },
        { title: 'Semester programmes', cols: SEM_COLS, rows: [
          ['BCA', '3 years', 16000, 120000, 136000],
          ['BBA', '3 years', 16000, 120000, 136000],
          ['MCA', '2 years', 16000, 130000, 146000],
        ] },
        { title: 'Lateral entry undergraduate engineering programmes (3 terms a year)', cols: ENGG_COLS, rows: [
          ['B.Tech · Computer Science and Engineering', '3 years', 16000, 100000, 116000],
          ['B.Tech · Artificial Intelligence & Data Science', '3 years', 16000, 100000, 116000],
          ['B.Tech · Electronics and Communication Engineering', '3 years', 16000, 90000, 106000],
          ['B.Tech · Computer Science & Information Technology', '3 years', 16000, 95000, 111000],
        ] },
      ] },
    ],
  },
  {
    id: 'non-engineering', label: 'Non-engineering',
    groups: [{ tables: [{ title: 'Management, commerce and other programmes', cols: SEM_COLS, rows: [
      ['BBA** · Marketing / HR / Finance / Digital Marketing / Business Analytics', '3 years', 16000, 125000, 141000],
      ['BBA# · Global Finance (CMA# / ACCA#)', '3 years', 16000, 135000, 151000],
      ['BBA · Fintech / LSCM / Business Analytics', '3 years', 16000, 135000, 151000],
      ['B.Com (Hons) · ACCA# / CMA / EA#', '3 years', 16000, 105000, 121000],
      ['B.Sc · Animation & Gaming', '3 years', 16000, 105000, 121000],
      ['MBA** · Marketing / HR / Finance / Digital Marketing / Business Analytics', '2 years', 16000, 225000, 241000],
      ['MBA · Fintech', '2 years', 16000, 325000, 341000],
      ['MBA · Global Program***', '2 years', 16000, 300000, 316000],
    ] }] }],
    notes: [
      '# ACCA / CMA fee: ₹17,500 per semester.',
      '** The global certification fee in the respective specialisation is mandatory; it will be notified through circulars.',
      '*** The Global MBA includes one semester abroad. For that semester students pay tuition as per the foreign university’s norms, and bear travel, visa and living expenses as applicable.',
    ],
  },
  {
    id: 'hostel', label: 'Hostel',
    groups: [{ tables: [{ title: 'Hyderabad campus · boys’ and girls’ hostel fees, AY 2026–27', wide: true,
      cols: ['Room type', 'Mess fee', 'GST 5%', 'Room rent', 'Single instalment (at registration)', 'Each of 2 instalments (per semester)', 'Each of 3 instalments (per trimester)', 'Electricity deposit', 'Registration fee (one time, non-refundable, new students)'],
      rows: [
        ['Non-A/C attached · 4-bed', 92000, 4600, 44500, 141100, 72100, 48534, 4000, 5000],
        ['Non-A/C attached · 3-bed', 92000, 4600, 49500, 146100, 74600, 50200, 4000, 5000],
        ['Non-A/C attached · 2-bed', 92000, 4600, 54500, 151100, 77100, 51867, 4000, 5000],
        ['A/C attached · 4-bed', 92000, 4600, 54500, 151100, 77100, 51867, 12000, 5000],
        ['A/C attached · 3-bed', 92000, 4600, 59500, 156100, 79600, 53534, 12000, 5000],
        ['A/C attached · 2-bed', 92000, 4600, 64500, 161100, 82100, 55200, 15000, 5000],
      ] }] }],
    notes: [
      'Mess charges, GST and establishment charges are paid by DD or online in favour of “HAKASA INFRA LLP”, payable at Hyderabad.',
      'Hostel applications are available at the Help Desk.',
      'For all room types, electricity is charged extra through prepaid meters and adjusted from the electricity deposit.',
      'Rooms are allotted first come, first served, subject to availability.',
    ],
  },
  {
    id: 'transport', label: 'Transport',
    text: ['Bus fee for the academic year 2026–27: students boarding from any point in and around the GHMC region pay a transport fee of ₹50,000, through the University ERP only.'],
  },
  {
    id: 'refund', label: 'Refund policy',
    text: [
      'The cancellation and fee refund policy is strictly in accordance with government directions. The processing fee / admission fee paid by the student is not refundable under any circumstances.',
      'If the seat is cancelled 15 days before the notified last date of admission, only ₹15,000 is deducted. After that, until the notified last date of admission, ₹25,000 is deducted towards cancellation charges.',
      'Once the last date of admission is announced, fees are refunded to eligible students as per the table below, only when the student applies for a refund in writing; the date the written application is received is used for the calculation. The last date of admission is taken as the date classes (or the online induction programme) begin, whether or not the student attends.',
      'Irrespective of the fee actually paid (after any concession or scholarship), the full tuition fee is used to calculate the refund.',
    ],
    groups: [{ tables: [{ title: 'Refund of tuition fee', cols: ['Notice of withdrawal of admission', 'Refund of tuition fee*'], rows: [
      ['Up to 15 days after the formally notified last date of admission', '80%'],
      ['More than 15 days but less than 30 days after the formally notified last date of admission', '50%'],
      ['More than 30 days after the formally notified last date of admission', '0%'],
    ] }] }],
    notes: [
      '* In addition to the admission fee, which is not refunded.',
      'Any dispute about admission, eligibility, fees or refunds is subject to the legal jurisdiction of the Amravati region only.',
      'Queries: Director of Admissions, 0866-2577715 · director.admissions@kluniversity.in',
    ],
  },
]
