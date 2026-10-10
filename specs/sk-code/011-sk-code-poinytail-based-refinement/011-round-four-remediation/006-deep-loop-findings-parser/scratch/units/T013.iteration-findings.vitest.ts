// ───────────────────────────────────────────────────────────────────
// MODULE: Iteration Findings Markdown Parser
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { parseIterationMarkdownFindings } = require('../../lib/deep-loop/iteration-findings.cjs');

type ParsedFinding = { id: string; title: string; text: string; addedAtIteration: number; _iteration_source: string };

function parse(lines: string[]): ParsedFinding[] {
  return parseIterationMarkdownFindings(lines.join('\n'), 3, 'iterations/iteration-003.md');
}

describe('parseIterationMarkdownFindings', () => {
  it('counts only numbered lines at the left margin as findings', () => {
    const findings = parse([
      '# Iteration 3',
      '',
      '## Findings',
      '',
      '1. The guard compares paths lexically',
      '   1. resolve both paths',
      '   2. compare the resolved paths',
      '2. The stale comment names a removed flag',
      '',
      '## Next Focus',
      '',
      '1. Not a finding',
    ]);
    expect(findings.map((finding) => finding.title)).toEqual([
      'The guard compares paths lexically',
      'The stale comment names a removed flag',
    ]);
    expect(findings.map((finding) => finding.id)).toEqual(['iteration-3-finding-1', 'iteration-3-finding-2']);
  });

  it('prefers numbered subheadings over the numbered lines under them', () => {
    const findings = parse([
      '## Findings',
      '',
      '### 1. The guard compares paths lexically',
      '',
      '1. resolve both paths',
      '',
      '### 2. The stale comment names a removed flag',
    ]);
    expect(findings.map((finding) => finding.title)).toEqual([
      'The guard compares paths lexically',
      'The stale comment names a removed flag',
    ]);
  });

  it('reads F### bullets when the section has no numbered shape', () => {
    const findings = parse([
      '## Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12`',
      '  - **F009**: an indented bullet is evidence, not a finding',
      '- **F002**: Stale comment - `scripts/apply.cjs:40`',
    ]);
    expect(findings.map((finding) => finding.title)).toEqual([
      'Guard compares paths lexically - `scripts/apply.cjs:12`',
      'Stale comment - `scripts/apply.cjs:40`',
    ]);
  });

  it('counts a finding written in both shapes once, in its numbered form', () => {
    const findings = parse([
      '## Findings',
      '',
      '1. Guard compares paths lexically',
      '2. Stale comment',
      '',
      '- **F001**: Guard compares paths lexically',
      '- **F002**: Stale comment',
    ]);
    expect(findings.map((finding) => finding.title)).toEqual([
      'Guard compares paths lexically',
      'Stale comment',
    ]);
  });

  it('returns no findings when the narrative has no Findings section', () => {
    expect(parse(['# Iteration 3', '', '1. A numbered line outside any Findings section'])).toEqual([]);
  });
});
