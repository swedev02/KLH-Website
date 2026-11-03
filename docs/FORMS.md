# Forms & API

[← Back to README](../README.md)

All forms post JSON to the form backend in [server/api.js](../server/api.js). It's mounted at `/api` in two places:
- by `npm run dev` / `npm start` (via [server/index.js](../server/index.js)),
- by plain `vite` (via the plugin in [vite.config.js](../vite.config.js)).

The backend validates each submission, saves it, and returns a reference number. The form shows success **only** after a successful server response. Network or server errors show an error message with the help-desk number.

## The forms

| Form | Component | Where | Endpoint |
| --- | --- | --- | --- |
| Call back | `CallbackForm` | "Enquire" in the header, programme explorer, sidebars | `POST /api/forms/callback` |
| Programme enquiry | `CourseEnquiryForm` | Home enquiry band, campus pages, admissions pages | `POST /api/forms/course` |
| Contact | `ContactForm` | `/contact-us` | `POST /api/forms/contact` |
| Newsletter | `NewsletterForm` | Footer (as on klh.edu.in) | `POST /api/forms/newsletter` |
| Application | `ApplicationForm` | Available in `forms.jsx`; not placed on a page | `POST /api/forms/application` |

## Validation

Validation runs in the browser for inline feedback, and again on the server ([server/validate.js](../server/validate.js)), which is authoritative. Programme, campus and call-time options come from [src/formOptions.js](../src/formOptions.js).

| Field | Rule |
| --- | --- |
| `name` | 2–80 characters |
| `email` | Valid email |
| `phone` | Indian mobile: 10 digits starting 6–9, optional `+91` |
| `programme` | Must match a programme in `formOptions.js` (optional on call-back) |
| `campus` | Aziznagar or Bachupally |
| `slot` | Morning, afternoon or evening (call-back) |
| `topic`, `message` | Contact form: topic from a list; message of 10–2000 characters |
| `consent` | Must be ticked (call-back, enquiry, application) |

## Responses

| Status | Meaning |
| --- | --- |
| `201` `{ ok, reference }` | Saved |
| `200` `{ ok, reference, already: true }` | Newsletter address already subscribed (nothing new stored) |
| `422` `{ error, fields }` | Validation failed; fields are highlighted |
| `400` | Spam trap (hidden `website` field) was filled. Rejected, nothing stored, no fake success |
| `429` | More than 5 submissions a minute from one IP |
| `500` | Could not save |

## Where submissions go

- **Storage:** submissions are appended to `server/data/submissions.jsonl` (or `$DATA_DIR`). The folder is git-ignored because it holds personal data.
- **Webhook:** set `FORM_WEBHOOK_URL` to also POST each saved record to a CRM or mail service.
- **Reading them back:** set `ADMIN_TOKEN`, then call:

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" "http://localhost:3000/api/submissions?type=callback"
```
