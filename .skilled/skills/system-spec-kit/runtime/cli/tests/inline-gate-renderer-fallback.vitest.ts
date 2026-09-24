// ───────────────────────────────────────────────────────────────────
// TEST: Inline Gate Renderer Fallback
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const LEVELS: RenderLevel[] = ['1', '2', '3', '3+', 'phase', 'review', 'research'];
const WRAPPER_SOURCE = path.resolve(__dirname, '../templates/inline-gate-renderer.sh');
const TEMPLATES_ROOT = path.resolve(__dirname, '../../../templates');

function listTemplates(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listTemplates(entryPath);
    return entry.name.endsWith('.tmpl') ? [entryPath] : [];
  });
}

function expectedError(template: string, level: RenderLevel): string {
  try {
    renderInlineGates(template, level);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  throw new Error('expected the TypeScript renderer to reject this template');
}

// The wrapper is copied into a skill tree with no node_modules and no .ts
// renderer beside it, so the only way it can succeed is the plain-Node fallback.
let workRoot: string;
let wrapper: string;

function runWrapper(args: string[], input?: string) {
  return spawnSync('bash', [wrapper, ...args], { encoding: 'utf8', input });
}

beforeAll(() => {
  workRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'inline-gate-fallback-')));
  const templatesDir = path.join(workRoot, 'skill', 'runtime', 'cli', 'templates');
  fs.mkdirSync(templatesDir, { recursive: true });
  wrapper = path.join(templatesDir, 'inline-gate-renderer.sh');
  fs.copyFileSync(WRAPPER_SOURCE, wrapper);
});

afterAll(() => {
  fs.rmSync(workRoot, { recursive: true, force: true });
});

describe('inline gate renderer fallback', () => {
  it('runs without tsx or the TypeScript renderer', () => {
    expect(fs.existsSync(path.join(workRoot, 'skill', 'node_modules'))).toBe(false);
    expect(fs.existsSync(path.join(path.dirname(wrapper), 'inline-gate-renderer.ts'))).toBe(false);
  });

  it('renders every shipped template at every level exactly as the TypeScript renderer does', () => {
    const templates = listTemplates(TEMPLATES_ROOT);
    expect(templates.length).toBeGreaterThan(0);

    // Parity would hold vacuously if the templates had no gates to render.
    const gatedTemplates = templates.filter((file) => {
      const source = fs.readFileSync(file, 'utf8');
      return new Set(LEVELS.map((level) => renderInlineGates(source, level))).size > 1;
    });
    expect(gatedTemplates.length).toBeGreaterThan(0);

    for (const level of LEVELS) {
      const outDir = path.join(workRoot, `out-${level}`);
      const result = runWrapper(['--level', level, '--out-dir', outDir, ...templates]);
      expect(result.status, `level ${level}: ${result.stderr}`).toBe(0);

      for (const file of templates) {
        const outputPath = path.join(outDir, path.basename(file).replace(/\.tmpl$/u, ''));
        expect(fs.existsSync(outputPath), `level ${level}: ${outputPath} missing`).toBe(true);
        expect(fs.readFileSync(outputPath, 'utf8'), `level ${level}: ${path.relative(TEMPLATES_ROOT, file)}`)
          .toBe(renderInlineGates(fs.readFileSync(file, 'utf8'), level));
      }
    }
  });

  const syntheticTemplate = [
    'intro',
    '<!-- IF level:1 -->',
    'level one only',
    '<!-- /IF -->',
    '',
    '<!-- IF level:2, 3, 3+, -->',
    'outer',
    '<!-- IF level:3 AND NOT level:1 -->',
    'inner',
    '<!-- /IF -->',
    '<!-- /IF -->',
    '<!-- IF (level:1 OR level:phase) AND NOT level:3+ -->',
    'grouped',
    '<!-- /IF -->',
    'A <!-- IF level:1 --><!-- /IF -->',
    '<!-- IF level:review --><!-- /IF -->',
    '```md',
    '<!-- IF level:1 -->',
    '```',
    '  <!--  IF   level:research  -->\r',
    'windows line\r',
    '<!--/IF-->\r',
    'outro',
    '',
  ].join('\n');

  it('matches the TypeScript renderer on nesting, expressions, empty gates and fences', () => {
    const tmp = path.join(workRoot, 'synthetic.md');
    fs.writeFileSync(tmp, syntheticTemplate, 'utf8');
    for (const level of LEVELS) {
      const result = runWrapper(['--level', level, tmp]);
      expect(result.status, `level ${level}: ${result.stderr}`).toBe(0);
      expect(result.stdout, `level ${level}`).toBe(renderInlineGates(syntheticTemplate, level));
    }
  });

  it('reads the template from stdin when no file is given', () => {
    const result = runWrapper(['--level', '3'], syntheticTemplate);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toBe(renderInlineGates(syntheticTemplate, '3'));
  });

  it('reads a template path given before --level instead of waiting on stdin', () => {
    const input = path.join(workRoot, 'first-arg.md');
    fs.writeFileSync(input, 'A\n<!-- IF level:1 -->\nB\n<!-- /IF -->\n', 'utf8');
    const result = runWrapper([input, '--level', '1'], '');
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toBe('A\nB\n');
  });

  it('keeps the basename of an --out-dir input without a .tmpl suffix', () => {
    const input = path.join(workRoot, 'plain.md');
    const outDir = path.join(workRoot, 'plain-out');
    fs.writeFileSync(input, '<!-- IF level:2 -->\nno\n<!-- /IF -->\nyes\n', 'utf8');
    const result = runWrapper(['--level', '1', '--out-dir', outDir, input]);
    expect(result.status, result.stderr).toBe(0);
    expect(fs.readFileSync(path.join(outDir, 'plain.md'), 'utf8')).toBe('yes\n');
  });

  it.each([
    ['an unclosed gate', '<!-- IF level:1 -->\nA\n'],
    ['an unmatched close', 'A\n<!-- /IF -->\n'],
    ['an unknown level', '<!-- IF level:bogus -->\nA\n<!-- /IF -->\n'],
    ['an unsupported axis', '<!-- IF kind:1 -->\nA\n<!-- /IF -->\n'],
    ['an unclosed group', '<!-- IF (level:1 -->\nA\n<!-- /IF -->\n'],
    ['a dangling operator', '<!-- IF level:1 AND -->\nA\n<!-- /IF -->\n'],
  ])('fails with the TypeScript renderer message on %s', (_name, template) => {
    const result = runWrapper(['--level', '1'], template);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(expectedError(template, '1'));
  });

  it('exits 2 with usage when --level or --out-dir files are missing', () => {
    expect(runWrapper([], '').status).toBe(2);
    expect(runWrapper(['--level'], '').status).toBe(2);
    expect(runWrapper(['--level', '1', '--out-dir', path.join(workRoot, 'empty-out')]).status).toBe(2);
  });
});
