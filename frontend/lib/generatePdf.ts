import type { NdaFormData } from './nda';
import { getPlainTextSections } from './nda';

export async function downloadNdaPdf(data: NdaFormData): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxW = pageW - margin * 2;
  let y = margin;

  const newPageIfNeeded = (neededMm: number) => {
    if (y + neededMm > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addText = (
    text: string,
    sizePt: number,
    style: 'normal' | 'bold' = 'normal',
    align: 'left' | 'center' = 'left',
    gapAfter = 2,
  ) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(sizePt);
    const lineH = sizePt * 0.38;
    const lines: string[] = doc.splitTextToSize(text, maxW);
    newPageIfNeeded(lines.length * lineH + gapAfter);
    for (const line of lines) {
      if (align === 'center') {
        doc.text(line, pageW / 2, y, { align: 'center' });
      } else {
        doc.text(line, margin, y);
      }
      y += lineH;
    }
    y += gapAfter;
  };

  const addKeyValue = (label: string, value: string) => {
    doc.setFontSize(9);
    // Set font to bold BEFORE measuring so getStringUnitWidth uses bold glyph metrics
    doc.setFont('helvetica', 'bold');
    const labelW = doc.getStringUnitWidth(label) * 9 * 0.352778 + 3;
    newPageIfNeeded(6);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    const valLines: string[] = doc.splitTextToSize(value, maxW - labelW);
    doc.text(valLines[0] ?? '', margin + labelW, y);
    y += 5;
    for (let i = 1; i < valLines.length; i++) {
      newPageIfNeeded(5);
      doc.text(valLines[i], margin + labelW, y);
      y += 5;
    }
  };

  // ── Cover page ────────────────────────────────────────────────────────────
  addText('MUTUAL NON-DISCLOSURE AGREEMENT', 18, 'bold', 'center', 4);
  addText('Common Paper | Version 1.0', 9, 'normal', 'center', 12);

  addText('PARTIES', 11, 'bold', 'left', 3);

  addText('Party A', 10, 'bold', 'left', 1);
  addKeyValue('Company:', data.partyA.name || '[Party A Name]');
  addKeyValue('Address:', data.partyA.address || '[Party A Address]');
  addKeyValue('Email:', data.partyA.email || '[Party A Email]');
  addKeyValue(
    'Signatory:',
    [data.partyA.signatoryName, data.partyA.signatoryTitle].filter(Boolean).join(', ') || '[Signatory]',
  );
  y += 4;

  addText('Party B', 10, 'bold', 'left', 1);
  addKeyValue('Company:', data.partyB.name || '[Party B Name]');
  addKeyValue('Address:', data.partyB.address || '[Party B Address]');
  addKeyValue('Email:', data.partyB.email || '[Party B Email]');
  addKeyValue(
    'Signatory:',
    [data.partyB.signatoryName, data.partyB.signatoryTitle].filter(Boolean).join(', ') || '[Signatory]',
  );
  y += 8;

  addText('AGREEMENT TERMS', 11, 'bold', 'left', 3);
  addKeyValue('Purpose:', data.purpose || '[Purpose]');
  addKeyValue('Effective Date:', data.effectiveDate || '[Effective Date]');
  addKeyValue('MNDA Term:', data.mndaTerm || '[MNDA Term]');
  addKeyValue('Term of Confidentiality:', data.termOfConfidentiality || '[Term of Confidentiality]');
  addKeyValue('Governing Law:', data.governingLaw ? `State of ${data.governingLaw}` : '[Governing Law]');
  addKeyValue('Jurisdiction:', data.jurisdiction || '[Jurisdiction]');

  // ── Standard Terms ────────────────────────────────────────────────────────
  doc.addPage();
  y = margin;
  addText('STANDARD TERMS', 14, 'bold', 'center', 8);

  for (const section of getPlainTextSections(data)) {
    if (!section.title && !section.body) continue;
    if (section.title) {
      y += 2;
      addText(section.title, 10, 'bold', 'left', 1);
    }
    if (section.body) {
      addText(section.body, 9, 'normal', 'left', 4);
    }
  }

  y += 4;
  addText(
    'Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to use under CC BY 4.0',
    7,
    'normal',
    'center',
    0,
  );

  // ── Signature page ────────────────────────────────────────────────────────
  doc.addPage();
  y = margin;
  addText('SIGNATURES', 14, 'bold', 'center', 10);
  addText(
    'By signing below, each party agrees to the terms of this Mutual Non-Disclosure Agreement.',
    9,
    'normal',
    'center',
    12,
  );

  const sigStartY = y;
  const col2 = pageW / 2 + 10;
  const lineLen = 70;

  // Party A
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PARTY A', margin, sigStartY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.line(margin, sigStartY + 14, margin + lineLen, sigStartY + 14);
  doc.text('Signature', margin, sigStartY + 18);
  doc.text(data.partyA.signatoryName || '[Signatory Name]', margin, sigStartY + 24);
  doc.text(data.partyA.signatoryTitle || '[Title]', margin, sigStartY + 29);
  doc.text(data.partyA.name || '[Company Name]', margin, sigStartY + 34);
  doc.text('Date: ___________________', margin, sigStartY + 39);

  // Party B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PARTY B', col2, sigStartY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.line(col2, sigStartY + 14, col2 + lineLen, sigStartY + 14);
  doc.text('Signature', col2, sigStartY + 18);
  doc.text(data.partyB.signatoryName || '[Signatory Name]', col2, sigStartY + 24);
  doc.text(data.partyB.signatoryTitle || '[Title]', col2, sigStartY + 29);
  doc.text(data.partyB.name || '[Company Name]', col2, sigStartY + 34);
  doc.text('Date: ___________________', col2, sigStartY + 39);

  doc.save('Mutual-NDA.pdf');
}
