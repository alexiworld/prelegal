'use client';

import { useState, useCallback } from 'react';
import { NdaForm } from './NdaForm';
import { NdaPreview } from './NdaPreview';
import { EMPTY_FORM_DATA } from '@/lib/nda';
import type { NdaFormData } from '@/lib/nda';

export function NdaCreator() {
  const [formData, setFormData] = useState<NdaFormData>(EMPTY_FORM_DATA);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { downloadNdaPdf } = await import('@/lib/generatePdf');
      await downloadNdaPdf(formData);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try printing the page instead (Ctrl+P / Cmd+P).');
    } finally {
      setDownloading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* App header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Mutual NDA Creator</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Powered by CommonPaper Standard Terms
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Form panel */}
        <aside className="w-96 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Fill in the details</h2>
          <NdaForm data={formData} onChange={setFormData} />
          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? 'Generating PDF…' : 'Download PDF'}
            </button>
          </div>
        </aside>

        {/* Document preview panel */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400 font-medium">Mutual-NDA.pdf — Preview</span>
            </div>
            <NdaPreview data={formData} />
          </div>
        </main>
      </div>
    </div>
  );
}
