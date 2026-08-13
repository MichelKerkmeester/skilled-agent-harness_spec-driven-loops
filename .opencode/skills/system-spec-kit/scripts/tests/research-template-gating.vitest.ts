// -------------------------------------------------------------------
// TEST: research.md.tmpl Level Gating
// -------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderInlineGates } from '../templates/inline-gate-renderer';

const tmpl = fs.readFileSync(path.resolve(__dirname, '../../templates/manifest/research.md.tmpl'), 'utf8');

type RenderLevel = '1' | '2' | '3' | '3+' | 'phase';

function render(level: RenderLevel): string {
  return renderInlineGates(tmpl, level);
}

function lines(s: string): number {
  return s.split('\n').length;
}

describe('research.md.tmpl level gating', () => {
  it('level 3, 3+, and phase render identically (full document)', () => {
    expect(render('3')).toBe(render('3+'));
    expect(render('3')).toBe(render('phase'));
    expect(render('3')).toContain('## 7. INTEGRATION PATTERNS');
    expect(render('3')).toContain('## 16. ACKNOWLEDGEMENTS');
    expect(render('3')).toContain('## APPENDIX');
  });

  it('level 1 renders a lean subset far smaller than the full document', () => {
    expect(lines(render('1'))).toBeLessThanOrEqual(lines(render('3')) - 300);
    expect(render('1')).toContain('## 3. EXECUTIVE OVERVIEW');
    expect(render('1')).toContain('## CHANGELOG & UPDATES');
    expect(render('1')).not.toContain('## 4. CORE ARCHITECTURE');
    expect(render('1')).not.toContain('## 7. INTEGRATION PATTERNS');
  });

  it('level 2 includes the mid tier but not the full tier', () => {
    expect(render('2')).toContain('## 4. CORE ARCHITECTURE');
    expect(render('2')).toContain('## 6. CONSTRAINTS');
    expect(render('2')).not.toContain('## 7. INTEGRATION PATTERNS');
    expect(lines(render('2'))).toBeGreaterThan(lines(render('1')));
    expect(lines(render('2'))).toBeLessThan(lines(render('3')));
  });

  it('no render leaks inline gate markers', () => {
    const levels: RenderLevel[] = ['1', '2', '3', '3+', 'phase'];
    for (const level of levels) {
      expect(render(level)).not.toContain('<!-- IF');
      expect(render(level)).not.toContain('<!-- /IF');
    }
  });
});
