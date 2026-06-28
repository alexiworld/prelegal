'use client';

import type { NdaFormData, PartyDetails } from '@/lib/nda';

interface Props {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

interface PartyFormProps {
  label: string;
  party: PartyDetails;
  onChange: (party: PartyDetails) => void;
}

function PartyForm({ label, party, onChange }: PartyFormProps) {
  const set = (field: keyof PartyDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...party, [field]: e.target.value });

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{label}</legend>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Company Name *</label>
        <input
          type="text"
          value={party.name}
          onChange={set('name')}
          placeholder="Acme Corp."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
        <input
          type="text"
          value={party.address}
          onChange={set('address')}
          placeholder="123 Main St, San Francisco, CA 94105"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
        <input
          type="email"
          value={party.email}
          onChange={set('email')}
          placeholder="legal@acme.com"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Signatory Name</label>
          <input
            type="text"
            value={party.signatoryName}
            onChange={set('signatoryName')}
            placeholder="Jane Smith"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
          <input
            type="text"
            value={party.signatoryTitle}
            onChange={set('signatoryTitle')}
            placeholder="CEO"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </fieldset>
  );
}

export function NdaForm({ data, onChange }: Props) {
  const set = <K extends keyof NdaFormData>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-6">
      <PartyForm
        label="Party A"
        party={data.partyA}
        onChange={(partyA) => onChange({ ...data, partyA })}
      />

      <div className="border-t border-slate-200 pt-6">
        <PartyForm
          label="Party B"
          party={data.partyB}
          onChange={(partyB) => onChange({ ...data, partyB })}
        />
      </div>

      <div className="border-t border-slate-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Agreement Terms</h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Purpose *</label>
          <textarea
            value={data.purpose}
            onChange={set('purpose')}
            rows={3}
            placeholder="e.g. evaluating a potential business relationship between the parties"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Effective Date *</label>
            <input
              type="date"
              value={data.effectiveDate}
              onChange={set('effectiveDate')}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">MNDA Term *</label>
            <input
              type="text"
              value={data.mndaTerm}
              onChange={set('mndaTerm')}
              placeholder="e.g. 1 year"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Term of Confidentiality *</label>
          <input
            type="text"
            value={data.termOfConfidentiality}
            onChange={set('termOfConfidentiality')}
            placeholder="e.g. 2 years following termination"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Governing Law (State) *</label>
            <input
              type="text"
              value={data.governingLaw}
              onChange={set('governingLaw')}
              placeholder="e.g. California"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Jurisdiction *</label>
            <input
              type="text"
              value={data.jurisdiction}
              onChange={set('jurisdiction')}
              placeholder="e.g. Santa Clara County, CA"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
