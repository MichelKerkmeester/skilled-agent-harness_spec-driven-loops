// ───────────────────────────────────────────────────────────────────
// MODULE: Template Fill Guidance Tests
// ───────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const SKILL_ROOT = path.resolve(__dirname, '../../..');
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
const LEVELS: RenderLevel[] = ['1', '2', '3', '3+'];
const DOCS = ['spec', 'plan', 'tasks', 'implementation-summary'] as const;

const ANCHOR_COUNTS: Record<string, number> = {
  '1/spec': 8,
  '1/plan': 7,
  '1/tasks': 6,
  '1/implementation-summary': 6,
  '2/spec': 11,
  '2/plan': 9,
  '2/tasks': 15,
  '2/implementation-summary': 6,
  '3/spec': 8,
  '3/plan': 12,
  '3/tasks': 21,
  '3/implementation-summary': 6,
  '3+/spec': 12,
  '3+/plan': 15,
  '3+/tasks': 21,
  '3+/implementation-summary': 6,
};

// An H3 that opens its own anchor is a section with its own fill note, so it splits from
// the H2 above it; an unanchored H3 stays part of its H2.
function sections(markdown: string): Array<{ heading: string; body: string }> {
  const out: Array<{ heading: string; body: string[] }> = [];
  let inFence = false;
  let previous = '';
  for (const line of markdown.split(/\r?\n/u)) {
    if (/^\s*(`{3}|~~~)/u.test(line)) {
      inFence = !inFence;
    }
    const anchoredSubsection = /^### /u.test(line) && /^<!-- ANCHOR:[\w-]+ -->$/u.test(previous.trim());
    if (line.trim()) {
      previous = line;
    }
    if (!inFence && (/^## /u.test(line) || anchoredSubsection)) {
      out.push({ heading: line, body: [] });
      continue;
    }
    const last = out.at(-1);
    if (last) {
      last.body.push(line);
    }
  }
  return out.map((section) => ({ heading: section.heading, body: section.body.join('\n') }));
}

// A model copies the GOOD example and avoids the WEAK one, so a note without both
// leaves the section's target to guesswork.
function fillNoteProblems(note: string): string[] {
  const inner = note.slice('<!-- FILL: '.length, -' -->'.length);
  const problems: string[] = [];
  if (inner.includes('[YOUR_VALUE_HERE:')) problems.push('holds a token');
  if (inner.includes('[NEEDS')) problems.push('holds a clarification marker');
  if (inner.includes('-->')) problems.push('holds a comment end');
  if (!inner.trim().endsWith('.')) problems.push('does not end with a period');
  if (!/GOOD: .+ WEAK: .+/u.test(inner)) problems.push('lacks a GOOD and then a WEAK example');
  return problems;
}

describe('template section fill guidance', () => {
  for (const level of LEVELS) {
    for (const doc of DOCS) {
      it(`gives every Level ${level} ${doc} section one fill line`, () => {
        const source = fs.readFileSync(path.join(TEMPLATE_ROOT, 'core', `${doc}.md.tmpl`), 'utf8');
        const rendered = renderInlineGates(source, level);
        const anchors = (rendered.match(/<!-- ANCHOR:/gu) ?? []).length;
        expect(anchors, 'anchor count changed').toBe(ANCHOR_COUNTS[`${level}/${doc}`]);
        const parts = sections(rendered);
        expect(parts.length).toBeGreaterThan(0);
        for (const part of parts) {
          const fill = part.body.match(/<!-- FILL: .* -->/gu) ?? [];
          expect(fill, `${part.heading} needs one FILL line`).toHaveLength(1);
          expect(fillNoteProblems(fill[0]), part.heading).toEqual([]);
        }
      });
    }
  }

  const addons = fs.readdirSync(path.join(TEMPLATE_ROOT, 'addons')).filter((name) => name.endsWith('.md.tmpl'));
  for (const addon of addons) {
    it(`keeps every fill note in the ${addon} add-on well formed`, () => {
      const source = fs.readFileSync(path.join(TEMPLATE_ROOT, 'addons', addon), 'utf8');
      const notes = source.match(/<!-- FILL: .* -->/gu) ?? [];
      expect(notes.length, 'no fill note found').toBeGreaterThan(0);
      expect(notes.length, 'a fill note spans more than one line').toBe((source.match(/<!-- FILL:/gu) ?? []).length);
      for (const note of notes) {
        expect(fillNoteProblems(note), note).toEqual([]);
      }
    });
  }

  it('rejects a fill note that has a GOOD example but no WEAK one', () => {
    expect(fillNoteProblems('<!-- FILL: Name the owner. GOOD: Ana owns the script. -->')).toEqual([
      'lacks a GOOD and then a WEAK example',
    ]);
  });
});
