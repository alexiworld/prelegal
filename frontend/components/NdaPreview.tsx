'use client';

import { renderForPreview } from '@/lib/nda';
import type { NdaFormData } from '@/lib/nda';

function val(v: string, placeholder: string) {
  return v
    ? <span className="nda-value-filled">{v}</span>
    : <span className="nda-value-missing">[{placeholder}]</span>;
}

function PartyBlock({ label, party }: { label: string; party: NdaFormData['partyA'] }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-sm space-y-0.5">
        <div className="font-semibold">{val(party.name, 'Company Name')}</div>
        <div className="text-slate-600">{val(party.address, 'Address')}</div>
        <div className="text-slate-600">{val(party.email, 'Email')}</div>
        <div className="text-slate-600 mt-1">
          {party.signatoryName || party.signatoryTitle ? (
            <>Signatory: {val(party.signatoryName, 'Name')}{party.signatoryTitle && <>, {val(party.signatoryTitle, 'Title')}</>}</>
          ) : (
            <span className="nda-value-missing">Signatory: [Name, Title]</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  data: NdaFormData;
}

export function NdaPreview({ data }: Props) {
  const standardTermsHtml = renderForPreview(data);

  const formattedDate = data.effectiveDate
    ? new Date(data.effectiveDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="nda-document bg-white p-8 md:p-12 text-slate-900 font-serif text-[13px] leading-relaxed">
      {/* Document header */}
      <div className="text-center mb-8">
        <h1 className="text-lg font-bold tracking-wide uppercase mb-1">
          Mutual Non-Disclosure Agreement
        </h1>
        <p className="text-xs text-slate-500">Common Paper | Version 1.0</p>
      </div>

      {/* Cover page: parties */}
      <div className="flex gap-8 mb-6 pb-6 border-b border-slate-200">
        <PartyBlock label="Party A" party={data.partyA} />
        <div className="w-px bg-slate-200 shrink-0" />
        <PartyBlock label="Party B" party={data.partyB} />
      </div>

      {/* Cover page: agreement terms */}
      <table className="w-full text-sm mb-8 border-collapse">
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-1.5 pr-4 font-semibold text-slate-600 w-48 align-top">Purpose</td>
            <td className="py-1.5">{val(data.purpose, 'Purpose')}</td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-1.5 pr-4 font-semibold text-slate-600 align-top">Effective Date</td>
            <td className="py-1.5">{val(formattedDate, 'Effective Date')}</td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-1.5 pr-4 font-semibold text-slate-600 align-top">MNDA Term</td>
            <td className="py-1.5">{val(data.mndaTerm, 'MNDA Term')}</td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-1.5 pr-4 font-semibold text-slate-600 align-top">Term of Confidentiality</td>
            <td className="py-1.5">{val(data.termOfConfidentiality, 'Term of Confidentiality')}</td>
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-1.5 pr-4 font-semibold text-slate-600 align-top">Governing Law</td>
            <td className="py-1.5">
              {data.governingLaw
                ? <span className="nda-value-filled">State of {data.governingLaw}</span>
                : <span className="nda-value-missing">[Governing Law]</span>}
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 font-semibold text-slate-600 align-top">Jurisdiction</td>
            <td className="py-1.5">{val(data.jurisdiction, 'Jurisdiction')}</td>
          </tr>
        </tbody>
      </table>

      {/* Standard terms */}
      <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-6 border-t border-slate-300 pt-6">
        Standard Terms
      </h2>

      <div
        className="nda-body space-y-4"
        dangerouslySetInnerHTML={{ __html: standardTermsHtml }}
      />

      {/* Attribution */}
      <p className="text-xs text-slate-400 text-center mt-8 pt-6 border-t border-slate-100">
        Common Paper Mutual Non-Disclosure Agreement{' '}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          Version 1.0
        </a>{' '}
        — free to use under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          CC BY 4.0
        </a>
      </p>
    </div>
  );
}
