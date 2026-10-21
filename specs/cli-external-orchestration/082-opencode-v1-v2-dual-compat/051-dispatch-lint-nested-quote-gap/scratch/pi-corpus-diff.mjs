// Compares the Pi authorization verdict before and after this phase on one user-text corpus.
// Usage: node --preserve-symlinks pi-corpus-diff.mjs <base-commit>
// Run from the worktree root. The corpus is every quoted string in the dispatch suites that names
// an executor, each read as the operator's text for one devin and one codex dispatch, so a verdict
// that moves is either a row the phase's deny table names or a regression.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const base = process.argv[2];
const root = process.cwd();
const LINT = '.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts';
const SUITES = [
  '.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs',
  '.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs',
  '.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts',
  '.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs',
];
const EXECUTOR = /\b(?:cli-[\w-]+|opencode\d*|claude|codex|devin|cursor-agent|pi|hermes|jev)\b/;

// Each engine is loaded from a `.pi/extensions` copy whose `.skilled` link points at this
// worktree, the same layout the extension's relative imports expect.
function stage(label, source) {
  const dir = join(root, 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/051-dispatch-lint-nested-quote-gap/scratch/engines', label);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, '.pi/extensions'), { recursive: true });
  symlinkSync(join(root, '.skilled'), join(dir, '.skilled'));
  const file = join(dir, '.pi/extensions/lint.ts');
  writeFileSync(file, source);
  return import(pathToFileURL(file).href);
}

const before = await stage('before', execFileSync('git', ['show', `${base}:${LINT}`], { encoding: 'utf8' }));
const after = await stage('after', readFileSync(join(root, LINT), 'utf8'));
const { inspectDispatch } = await import(pathToFileURL(join(root, '.skilled/hooks/dispatch/lib/dispatch-audit.mjs')).href);

const corpus = new Set();
for (const suite of SUITES) {
  const text = execFileSync('git', ['show', `${base}:${suite}`], { encoding: 'utf8' });
  for (const m of text.matchAll(/'((?:\\.|[^'\\\n])*)'|"((?:\\.|[^"\\\n])*)"|`((?:\\.|[^`\\])*)`/g)) {
    const raw = m[1] ?? m[2] ?? m[3];
    if (!raw || raw.length < 6 || raw.includes('${') || !EXECUTOR.test(raw)) continue;
    corpus.add(raw.replace(/\\n/g, '\n').replace(/\\(["'`\\])/g, '$1'));
  }
}

function denied(engine, command, userText) {
  const inspection = inspectDispatch(command);
  return engine.shouldDenyPiDispatch({
    runtime: 'pi',
    toolName: 'bash',
    command,
    dispatchSkill: inspection.kind === 'direct' ? inspection.executor : null,
    inspectedExecutor: inspection.kind === 'direct' ? inspection.executor : null,
    inspectionKind: inspection.kind,
    userText,
  });
}

let diffs = 0;
const COMMANDS = ['devin -p "task"', 'codex exec "task"'];
for (const userText of corpus) {
  for (const command of COMMANDS) {
    const a = denied(before, command, userText);
    const b = denied(after, command, userText);
    if (a === b) continue;
    diffs += 1;
    console.log(`DIFF ${JSON.stringify(userText)} [${command}]: ${a ? 'deny' : 'allow'} -> ${b ? 'deny' : 'allow'}`);
  }
}
console.log(`corpus ${corpus.size} user texts x ${COMMANDS.length} commands, ${diffs} with a changed verdict`);
