import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const SKILL_ROOT = path.resolve(__dirname, '../../..');
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
const LEVELS: RenderLevel[] = ['1', '2', '3', '3+'];
const DOCS = ['spec', 'plan', 'tasks', 'implementation-summary'] as const;

const ANCHOR_COUNTS: Record<string, number> = {
  '1/spec': 7,
  '1/plan': 7,
  '1/tasks': 6,
  '1/implementation-summary': 6,
  '2/spec': 10,
  '2/plan': 11,
  '2/tasks': 15,
  '2/implementation-summary': 6,
  '3/spec': 7,
  '3/plan': 14,
  '3/tasks': 21,
  '3/implementation-summary': 6,
  '3+/spec': 11,
  '3+/plan': 17,
  '3+/tasks': 21,
  '3+/implementation-summary': 6,
};

function sections(markdown: string): Array<{ heading: string; body: string }> {
  const out: Array<{ heading: string; body: string[] }> = [];
  let inFence = false;
  for (const line of markdown.split(/\r?\n/u)) {
    if (/^\s*(`{3}|~~~)/u.test(line)) {
      inFence = !inFence;
    }
    if (!inFence && /^## /u.test(line)) {
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
          const inner = fill[0].slice('<!-- FILL: '.length, -' -->'.length);
          expect(inner).not.toContain('[YOUR_VALUE_HERE:');
          expect(inner).not.toContain('[NEEDS');
          expect(inner).not.toContain('-->');
          expect(inner.trim().endsWith('.')).toBe(true);
        }
      });
    }
  }
});
