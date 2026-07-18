import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { emitQuickStart } from '../scripts/formatters-v3';
import { generateReport } from '../scripts/report-gen';
import { generatePreview } from '../scripts/preview-gen';
import type { DesignTokens } from '../scripts/types';

function tokens(over: Record<string, unknown> = {}): DesignTokens {
  return {
    colorTokens: [
      { hex: '#06458c', rgba: [6, 69, 140, 1], frequency: 100, usedAs: { textColor: 30, bgColor: 60, borderColor: 10, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } },
    ],
    typographyLevels: [
      { fontFamily: 'Silka', fontSize: '16px', fontWeight: '400', lineHeight: '23px', letterSpacing: '0px', textTransform: null, fontFeatureSettings: null, frequency: 100, typicalTags: ['p'], sampleTexts: [], confidence: 'high' },
    ],
    shadowTokens: [],
    radiusTokens: [],
    components: [],
    meta: { sourceUrls: ['https://example.com'], totalPages: 1, totalElements: 10 },
    ...over,
  } as unknown as DesignTokens;
}

describe('report-gen / preview-gen overwrite guard (P1-004 regression)', () => {
  let sandboxDir: string;
  let tokensPath: string;

  beforeEach(() => {
    sandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skd-report-preview-test-'));
    tokensPath = path.join(sandboxDir, 'tokens.json');
    fs.writeFileSync(tokensPath, JSON.stringify(tokens()));
  });

  afterEach(() => {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
  });

  it('generateReport writes report.html on first run', () => {
    generateReport(tokensPath, sandboxDir);
    expect(fs.existsSync(path.join(sandboxDir, 'report.html'))).toBe(true);
  });

  it('generateReport refuses to overwrite an existing report.html without --force', () => {
    generateReport(tokensPath, sandboxDir);
    expect(() => generateReport(tokensPath, sandboxDir)).toThrow(/refusing to overwrite/);
  });

  it('generateReport overwrites when force:true is passed', () => {
    generateReport(tokensPath, sandboxDir);
    expect(() => generateReport(tokensPath, sandboxDir, undefined, { force: true })).not.toThrow();
  });

  it('generatePreview writes preview.html on first run', () => {
    generatePreview(tokensPath, sandboxDir);
    expect(fs.existsSync(path.join(sandboxDir, 'preview.html'))).toBe(true);
  });

  it('generatePreview refuses to overwrite an existing preview.html without --force', () => {
    generatePreview(tokensPath, sandboxDir);
    expect(() => generatePreview(tokensPath, sandboxDir)).toThrow(/refusing to overwrite/);
  });

  it('generatePreview overwrites when force:true is passed', () => {
    generatePreview(tokensPath, sandboxDir);
    expect(() => generatePreview(tokensPath, sandboxDir, { force: true })).not.toThrow();
  });

  it('generateReport never emits a raw malicious color value inside a style attribute (P1-006/P1-008 integration check)', () => {
    const maliciousTokens = tokens({
      colorTokens: [
        { hex: 'red; } * { display:none } /*', rgba: [255, 0, 0, 1], frequency: 100, usedAs: { textColor: 0, bgColor: 60, borderColor: 0, shadowColor: 0, gradientColor: 0, iconColor: 0 }, cssVariableNames: [], pagesCoverage: 1, sourcePages: [], confidence: 'high', stability: { layer: 'system', confidence: 1, signals: [] } },
      ],
    });
    fs.writeFileSync(tokensPath, JSON.stringify(maliciousTokens));
    generateReport(tokensPath, sandboxDir);
    const html = fs.readFileSync(path.join(sandboxDir, 'report.html'), 'utf-8');
    expect(html).not.toContain('style="background:red; } * { display:none } /*');
  });

  it('surfaces hard validation separately from stratified corpus advisories', () => {
    const designPath = path.join(sandboxDir, 'DESIGN.md');
    const reportTokens = tokens({
      fontInfo: { fontFaces: [], loadedFonts: [], googleFontsLinks: [] },
    });
    fs.writeFileSync(tokensPath, JSON.stringify(reportTokens));
    fs.writeFileSync(designPath, `# Example — Style Reference

## Tokens — Colors

Measured colors.

## Tokens — Typography

Measured typography.

## Tokens — Spacing & Shapes

Measured spacing.

## Components

No components detected.

## Do's and Don'ts

Use measured values.

## Surfaces

Measured surfaces.

## Agent Prompt Guide

Use target facts.

${emitQuickStart(reportTokens)}
`);
    generateReport(tokensPath, sandboxDir, designPath);
    const html = fs.readFileSync(path.join(sandboxDir, 'report.html'), 'utf8');
    expect(html).toContain('Hard Validation');
    expect(html).toContain('No hard failures');
    expect(html).toContain('Corpus Advisory Warnings');
    expect(html).toContain('ADVISORY');
  });
});
