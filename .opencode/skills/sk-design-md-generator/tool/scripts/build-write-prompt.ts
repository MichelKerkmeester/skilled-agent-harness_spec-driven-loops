// ────────────────────────────────────────────────────────────────
// WRITE-phase prompt builder (doc-as-view integration)
//
// Pre-renders the deterministic value sections (§2 Color, §3 Typography, §6 Depth) from
// tokens.json and emits a PRESENT/ABSENT manifest for the data-gated sections, so the
// WRITE phase receives the value tables already filled (no AI on the value surface) and
// is told exactly which conditional sections have backing data versus must be stamped
// ABSENT. This operationalizes the data-driven section contract: the AI can no longer
// invent a value table or fill an empty section, because the builder decided both.
// ────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import { formatColorTable, formatTypographyTable, formatDepthSection } from './formatters';
import type { DesignTokens } from './types';

interface SectionStatus {
  section: string;
  status: 'PRESENT' | 'ABSENT';
  note: string;
}

function conditionalStatus(tokens: DesignTokens): SectionStatus[] {
  const t = tokens as unknown as {
    darkMode?: { supported?: boolean; detectionMethod?: string };
    motionSystem?: { durationScale?: unknown[] } | null;
    a11yTokens?: { focusIndicator?: { captured?: boolean; consistent?: boolean }; contrastPairs?: unknown[] };
    iconSystem?: { totalCount?: number } | null;
  };
  const motionN = t.motionSystem?.durationScale?.length ?? 0;
  const focusCaptured = t.a11yTokens?.focusIndicator?.captured === true;
  const contrastN = t.a11yTokens?.contrastPairs?.length ?? 0;
  const iconN = t.iconSystem?.totalCount ?? 0;
  return [
    {
      section: '2.5 Dark Mode',
      status: t.darkMode?.supported ? 'PRESENT' : 'ABSENT',
      note: t.darkMode?.supported ? `detected via ${t.darkMode.detectionMethod}` : 'no dark palette detected — OMIT the section entirely',
    },
    {
      section: '6.5 Motion',
      status: motionN > 0 ? 'PRESENT' : 'ABSENT',
      note: motionN > 0 ? `${motionN} measured durations` : 'no transitions/animations — OBSERVED: instant; any timing is RECOMMENDED [INFERRED]',
    },
    {
      section: '9 Accessibility',
      status: focusCaptured || contrastN > 0 ? 'PRESENT' : 'ABSENT',
      note: focusCaptured ? `focus captured (consistent=${t.a11yTokens?.focusIndicator?.consistent})` : 'focus NOT captured — do not assert focus consistency',
    },
    {
      section: '12 Iconography',
      status: iconN > 0 ? 'PRESENT' : 'ABSENT',
      note: iconN > 0 ? `${iconN} icons` : 'no icon system extracted — stamp ABSENT',
    },
  ];
}

export function buildWritePrompt(tokens: DesignTokens): string {
  const rendered = [formatColorTable(tokens), formatTypographyTable(tokens), formatDepthSection(tokens)].join('\n\n');
  const status = conditionalStatus(tokens);
  const statusTable =
    '| Section | Status | Note |\n|---------|--------|------|\n' +
    status.map((s) => `| ${s.section} | ${s.status} | ${s.note} |`).join('\n');

  return [
    '# WRITE phase — DESIGN.md',
    '',
    'CARDINAL RULES: copy every value verbatim from tokens.json; never estimate or invent. The',
    'PRE-RENDERED sections below are generated deterministically — paste them UNCHANGED. For the',
    'data-gated sections, obey the PRESENT/ABSENT manifest: PRESENT → write from tokens; ABSENT →',
    'stamp `_No <X> data was extracted._`, never invent. Never assert an interpretive claim (a',
    'relationship, cause, consistency, or named principle) not backed by a token; label any',
    'genuine inference `[INFERRED]` and cite the token it rests on.',
    '',
    '## PRE-RENDERED sections (paste unchanged — do NOT rewrite these value tables)',
    '',
    rendered,
    '',
    '## Data-gated section manifest',
    '',
    statusTable,
    '',
    '## Remaining sections',
    '',
    'Write the prose/annotation sections (§0 Brand, §1 Visual Theme, §4 Components, §5 Layout,',
    '§7 Voice, §8 Do/Don\'t, §10 Responsive, §11 State Matrix, §13 Agent Guide) from tokens.json,',
    'applying the cardinal rules and the format spec. Then run `scripts/validate.ts <DESIGN.md>',
    '<tokens.json>` and resolve every failure before reporting completion.',
    '',
  ].join('\n');
}

if (require.main === module) {
  const tokensPath = process.argv[2];
  if (!tokensPath) {
    console.error('Usage: build-write-prompt.ts <tokens.json>');
    process.exit(1);
  }
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8')) as DesignTokens;
  process.stdout.write(buildWritePrompt(tokens));
}
