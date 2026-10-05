// ───────────────────────────────────────────────────────────────────
// MODULE: Frontmatter Values Rule Tests
// ───────────────────────────────────────────────────────────────────
// Runs the FRONTMATTER_VALUES shell rule against throwaway packet folders. The
// accepted values come from the shipped shared list, so these cases break if
// the list drops a canonical value or an alias that packets already use.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const RULE = path.resolve(import.meta.dirname, '..', 'rules', 'check-frontmatter-values.sh');

const folders: string[] = [];

function packet(docs: Record<string, string>): string {
  const folder = mkdtempSync(path.join(tmpdir(), 'frontmatter-values-'));
  folders.push(folder);
  for (const [name, text] of Object.entries(docs)) writeFileSync(path.join(folder, name), text);
  return folder;
}

const doc = (contextType: string, tier: string, body = '# Doc\n') =>
  `---\ntitle: "Doc"\ncontextType: ${contextType}\nimportance_tier: ${tier}\n---\n${body}`;

function runRule(folder: string): string[] {
  return execFileSync('bash', ['-c',
    'source "$1"; run_check "$2" 2; printf "%s\\n%s\\n" "$RULE_STATUS" "$RULE_MESSAGE"; printf "%s\\n" ${RULE_DETAILS[@]+"${RULE_DETAILS[@]}"}',
    '_', RULE, folder], { encoding: 'utf8' }).split('\n').filter((line) => line !== '');
}

afterEach(() => {
  while (folders.length > 0) rmSync(folders.pop() as string, { recursive: true, force: true });
});

describe('FRONTMATTER_VALUES shell rule', () => {
  it('passes canonical values and listed aliases, quoted or not and in any case', () => {
    const folder = packet({
      'spec.md': doc('"planning"', '"important"'),
      'research.md': doc('Review', "'high'"),
    });
    expect(runRule(folder)).toEqual(['pass', 'Frontmatter values are in the shared list']);
  });

  it('reads a value that carries a YAML inline comment as the value alone', () => {
    const folder = packet({
      'spec.md': doc('planning # why this type', '"important" # pinned'),
    });
    expect(runRule(folder)).toEqual(['pass', 'Frontmatter values are in the shared list']);
  });

  it('warns, never fails, on a value outside the list and names the canonical values', () => {
    const folder = packet({
      'spec.md': doc('"planning"', '"normal"'),
      'plan.md': doc('"architecture"', '"normal"'),
    });
    const [status, message, detail, ...rest] = runRule(folder);
    expect(status).toBe('warn');
    expect(message).toBe('1 frontmatter value(s) outside the shared list');
    expect(detail).toBe('plan.md: contextType "architecture" is not in the shared list; use one of implementation, research, planning, general');
    expect(rest).toEqual([]);
  });

  it('reads only the leading frontmatter block, so a value in the body is ignored', () => {
    const folder = packet({ 'spec.md': doc('"general"', '"normal"', '# Doc\n\ncontextType: architecture\n') });
    expect(runRule(folder)[0]).toBe('pass');
  });
});
