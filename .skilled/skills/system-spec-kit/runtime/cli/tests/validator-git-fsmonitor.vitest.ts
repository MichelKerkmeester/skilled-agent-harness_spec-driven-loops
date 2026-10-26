// ───────────────────────────────────────────────────────────────────
// MODULE: Validator Git Fsmonitor Test
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// A file-system monitor daemon that never answers its IPC leaves git waiting
// forever, and validate.sh with it. Every git call the validator reaches, in
// validate.sh, the orchestrator, each registry rule and the helpers they load,
// must turn the monitor off. The file set is traced from the code rather than
// listed, so a new helper joins the scan without anyone remembering to add it.
const CLI_ROOT = path.resolve(__dirname, '..');
const RUNTIME_ROOT = path.resolve(CLI_ROOT, '..');
const SKILL_ROOT = path.resolve(RUNTIME_ROOT, '..');
const SHARED_ROOT = path.join(SKILL_ROOT, 'shared');
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const REGISTRY = path.join(CLI_ROOT, 'lib', 'validator-registry.json');

const CODE_EXTENSIONS = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'];
const FSMONITOR_OFF = /core\.fsmonitor=false|FSMONITOR|GIT_CONFIG_/u;

function isFile(candidate: string): boolean {
  return existsSync(candidate) && statSync(candidate).isFile();
}

// Built output is scanned through its source, because the source is what a
// fix edits and the build reproduces.
function toSource(target: string): string | null {
  const sourced = target.includes(`${path.sep}dist${path.sep}`)
    ? target.replace(`${path.sep}dist${path.sep}`, path.sep)
    : target;
  const ext = path.extname(sourced);
  const stem = CODE_EXTENSIONS.includes(ext) ? sourced.slice(0, -ext.length) : sourced;
  const candidates = ext === '.js' || ext === '.mjs' || ext === '.cjs'
    ? [`${stem}.ts`, `${stem}.mts`, `${stem}.cts`, sourced]
    : ext === '' ? [`${stem}.ts`, `${stem}.js`, path.join(stem, 'index.ts'), path.join(stem, 'index.js')] : [sourced];
  for (const candidate of candidates) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

function resolveSpecifier(fromFile: string, specifier: string): string | null {
  if (specifier.startsWith('.')) return toSource(path.resolve(path.dirname(fromFile), specifier));
  if (specifier.startsWith('@spec-kit/shared/')) return toSource(path.join(SHARED_ROOT, specifier.slice('@spec-kit/shared/'.length)));
  if (specifier.startsWith('@spec-kit/runtime/')) return toSource(path.join(RUNTIME_ROOT, specifier.slice('@spec-kit/runtime/'.length)));
  return null;
}

function codeReferences(file: string, text: string): string[] {
  const specifiers = [
    ...text.matchAll(/\bfrom\s+['"]([^'"]+)['"]/gu),
    ...text.matchAll(/\bimport\s+['"]([^'"]+)['"]/gu),
    ...text.matchAll(/\b(?:require|import)\(\s*['"]([^'"]+)['"]\s*\)/gu),
  ].map((match) => match[1]);
  return specifiers.map((specifier) => resolveSpecifier(file, specifier)).filter((hit): hit is string => hit !== null);
}

// Shell rules name their helpers as "$SCRIPT_DIR/relative/path.ext", with the
// variable holding the script's own directory.
function shellReferences(file: string, text: string): string[] {
  const tails = [
    ...text.matchAll(/\$\{?[A-Za-z_][A-Za-z0-9_]*\}?((?:\/[\w.-]+)+\.(?:sh|mjs|cjs|js|ts))/gu),
  ].map((match) => match[1].slice(1));
  return tails
    .map((tail) => path.resolve(path.dirname(file), tail))
    .filter((target) => !target.includes(`${path.sep}node_modules${path.sep}`))
    .map((target) => (target.endsWith('.sh') ? (isFile(target) ? target : null) : toSource(target)))
    .filter((hit): hit is string => hit !== null);
}

function validatorFileSet(): string[] {
  const registry = JSON.parse(readFileSync(REGISTRY, 'utf8')) as Array<{ script_path: string }>;
  const roots = [
    path.join(CLI_ROOT, 'spec', 'validate.sh'),
    path.join(RUNTIME_ROOT, 'lib', 'validation', 'orchestrator.ts'),
    ...registry
      .map((row) => row.script_path)
      .filter((scriptPath) => scriptPath.endsWith('.sh') || scriptPath.endsWith('.ts'))
      .map((scriptPath) => path.join(CLI_ROOT, scriptPath)),
  ];
  const seen = new Set<string>();
  const queue = roots.filter(isFile);
  while (queue.length > 0) {
    const file = queue.shift() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = readFileSync(file, 'utf8');
    const next = file.endsWith('.sh') ? shellReferences(file, text) : codeReferences(file, text);
    queue.push(...next.filter((target) => !seen.has(target)));
  }
  return [...seen].sort();
}

function lineOf(text: string, offset: number): number {
  return text.slice(0, offset).split('\n').length;
}

// The call's full text, from its opening parenthesis to the matching close,
// so a spread constant or an env option anywhere in it counts.
function callText(text: string, openParen: number): string {
  let depth = 0;
  for (let index = openParen; index < text.length; index += 1) {
    if (text[index] === '(') depth += 1;
    if (text[index] === ')') {
      depth -= 1;
      if (depth === 0) return text.slice(openParen, index + 1);
    }
  }
  return text.slice(openParen);
}

function codeGitCallsWithoutFsmonitorOff(file: string, text: string): string[] {
  const misses: string[] = [];
  const pattern = /\b(?:execFileSync|spawnSync|execFile|spawn|execSync|exec)\s*\(\s*(?:['"`]git['"`]|['"`]git\s)/gu;
  for (const match of text.matchAll(pattern)) {
    const openParen = (match.index ?? 0) + match[0].indexOf('(');
    if (!FSMONITOR_OFF.test(callText(text, openParen))) misses.push(`${file}:${lineOf(text, match.index ?? 0)}`);
  }
  return misses;
}

function shellGitCallsWithoutFsmonitorOff(file: string, text: string): string[] {
  const misses: string[] = [];
  text.split('\n').forEach((line, index) => {
    if (/^\s*#/u.test(line)) return;
    // git counts as a command after a separator, a control keyword, or one or more
    // VAR=value assignments that prefix it, as in "if GIT_DIR=x git status".
    const command = /(?:^|[;&|(`!]|\b(?:if|elif|then|do|else|while|until|command|exec)\b)\s*(?:[A-Za-z_][A-Za-z0-9_]*=(?:"[^"]*"|'[^']*'|[^\s"';&|])*\s+)*git\s/u;
    if (command.test(line) && !/core\.fsmonitor=false/u.test(line)) misses.push(`${file}:${index + 1}`);
  });
  return misses;
}

describe('validator git calls turn the file-system monitor off', () => {
  const files = validatorFileSet();

  it('traces validate.sh through the orchestrator, every registry rule and their helpers', () => {
    const relative = files.map((file) => path.relative(REPO_ROOT, file));
    expect(relative).toContain('.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh');
    expect(relative).toContain('.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts');
    expect(relative).toContain('.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs');
  });

  it('passes -c core.fsmonitor=false on every git call in that set', () => {
    const misses = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      const found = file.endsWith('.sh')
        ? shellGitCallsWithoutFsmonitorOff(file, text)
        : codeGitCallsWithoutFsmonitorOff(file, text);
      return found.map((entry) => path.relative(REPO_ROOT, entry));
    });
    expect(misses).toEqual([]);
  });
});
