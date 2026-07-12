#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: validate-command-references                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Referential-integrity checker for command-asset references.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Command-reference referential-integrity checker.
//
// WHY: the create / deep / design slash-command assets (_auto.yaml, _confirm.yaml)
// hard-code three kinds of live references — runtime-agent filenames
// ([runtime_agent_path]/<name>.md), literal skill-asset paths (.opencode/skills/**),
// and runtime-agent directory names — that command tooling validates for STRUCTURE
// but never for EXISTENCE. Retired agents, reorganized template paths, and phantom
// runtime directories therefore survive silently in the assets until a user hits a
// dead lookup at command runtime. This checker resolves every CONCRETE reference
// against disk and exits non-zero on the first unresolved one, so a broken reference
// fails fast in pre-flight / CI instead of mid-command.
//
// It deliberately skips anything parameterized: template placeholders ({...}, globs,
// $vars, and every reference other than the [runtime_agent_path] token that carries
// bracket/brace syntax), bare directory references (only file-shaped paths are
// resolved), and the legitimate .codex runtime-mirror tokens. Resolving those would
// false-positive on correct, intentionally-templated values.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

// Command families whose assets declare live agent/skill/runtime references.
const FAMILIES = ['create', 'deep', 'design'];

// Real runtime-agent directories. An agent reference resolves if the file exists
// in ANY of these; a runtime-directory reference is valid only if it names one.
const AGENT_DIRS = ['.opencode/agents', '.claude/agents', '.codex/agents'];
const RUNTIME_DIR_ALLOWLIST = new Set(['.opencode', '.claude', '.codex']);

// Path token stops at YAML/prose delimiters and at any template metacharacter, so an
// interpolated reference (e.g. skills/{skill_name}/SKILL.md) truncates to a bare dir
// and is then dropped by the file-shaped filter below.
const SKILL_TOKEN = /\.opencode\/skills\/[^\s"'`,()\[\]{}<>$*|]+/g;
const AGENT_REF = /\[runtime_agent_path\]\/([A-Za-z0-9][A-Za-z0-9._-]*\.md)/g;
const BARE_PHANTOM_AGENTS_DIR = /\.agents\//g;
const SCOPED_AGENTS_DIR = /(\.[a-z][a-z0-9_-]*)\/agents\//g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function agentExists(fileName) {
  return AGENT_DIRS.some((d) => fs.existsSync(path.join(REPO_ROOT, d, fileName)));
}

// A concrete skill-asset reference is file-shaped (last segment carries an extension)
// and free of the template/anchor noise that would make on-disk resolution meaningless.
function normalizeSkillToken(raw) {
  let t = raw.split('#')[0]; // drop code anchors: foo.ts#symbol -> foo.ts
  t = t.replace(/[.,;:]+$/, ''); // drop trailing sentence punctuation
  const last = t.slice(t.lastIndexOf('/') + 1);
  if (!last.includes('.')) return null; // bare directory reference -> not resolved
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────
function extractViolations(file) {
  const rel = path.relative(REPO_ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const seen = new Set();
  const out = [];
  const add = (line, kind, ref, detail) => {
    const key = `${kind} ${ref}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ file: rel, line, kind, ref, detail });
  };

  lines.forEach((text, i) => {
    const lineNo = i + 1;
    let m;

    AGENT_REF.lastIndex = 0;
    while ((m = AGENT_REF.exec(text)) !== null) {
      const name = m[1];
      if (!agentExists(name)) {
        add(lineNo, 'agent', `[runtime_agent_path]/${name}`, `no ${name} in ${AGENT_DIRS.join(', ')}`);
      }
    }

    SKILL_TOKEN.lastIndex = 0;
    while ((m = SKILL_TOKEN.exec(text)) !== null) {
      const token = normalizeSkillToken(m[0]);
      if (!token) continue;
      if (!fs.existsSync(path.join(REPO_ROOT, token))) {
        add(lineNo, 'skill-asset', token, 'path does not exist on disk');
      }
    }

    BARE_PHANTOM_AGENTS_DIR.lastIndex = 0;
    if (BARE_PHANTOM_AGENTS_DIR.test(text)) {
      add(lineNo, 'runtime-dir', '.agents/', 'phantom runtime directory (not a real agent dir)');
    }

    SCOPED_AGENTS_DIR.lastIndex = 0;
    while ((m = SCOPED_AGENTS_DIR.exec(text)) !== null) {
      if (!RUNTIME_DIR_ALLOWLIST.has(m[1])) {
        add(lineNo, 'runtime-dir', `${m[1]}/agents/`, `not an allowlisted runtime dir (${[...RUNTIME_DIR_ALLOWLIST].join(', ')})`);
      }
    }
  });

  return out;
}

function expandTargets(inputs) {
  const files = [];
  for (const raw of inputs) {
    const abs = path.resolve(process.cwd(), raw);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isDirectory()) {
      for (const f of fs.readdirSync(abs)) {
        if (f.endsWith('.yaml')) files.push(path.join(abs, f));
      }
    } else {
      files.push(abs);
    }
  }
  return files;
}

function defaultTargets() {
  const files = [];
  for (const fam of FAMILIES) {
    const dir = path.join(REPO_ROOT, '.opencode', 'commands', fam, 'assets');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.yaml')) files.push(path.join(dir, f));
    }
  }
  return files;
}

function scan(targets) {
  return targets.flatMap(extractViolations);
}

function report(violations, targets, asJson) {
  if (asJson) {
    console.log(JSON.stringify({ scanned: targets.length, violations }, null, 2));
    return;
  }
  if (violations.length === 0) {
    console.log(`OK  command references resolve across ${targets.length} asset file(s) [${FAMILIES.join(', ')}].`);
    return;
  }
  console.error(`FAIL  ${violations.length} unresolved command reference(s):`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.kind}]  ${v.ref}  — ${v.detail}`);
  }
}

// Self-test proves BOTH exit paths: the committed broken fixture must produce at least
// one violation, and the real create/deep/design tree must produce none.
function selfTest(asJson) {
  const fixture = path.join(__dirname, 'fixtures', 'broken-command-refs.yaml');
  const brokenViol = fs.existsSync(fixture) ? scan([fixture]) : [];
  const realViol = scan(defaultTargets());
  const brokenPass = brokenViol.length > 0;
  const realPass = realViol.length === 0;

  if (asJson) {
    console.log(JSON.stringify({ brokenPass, realPass, brokenViolations: brokenViol, realViolations: realViol }, null, 2));
  } else {
    console.log(`[self-test] broken fixture flags a violation: ${brokenPass ? 'PASS' : 'FAIL'} (${brokenViol.length} found)`);
    console.log(`[self-test] real tree resolves clean:         ${realPass ? 'PASS' : 'FAIL'} (${realViol.length} unresolved)`);
    if (!realPass) {
      for (const v of realViol) console.error(`    ${v.file}:${v.line}  [${v.kind}]  ${v.ref}  — ${v.detail}`);
    }
    if (!brokenPass) console.error('    fixture produced no violation — the checker is not detecting broken references.');
  }
  process.exit(brokenPass && realPass ? 0 : 1);
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  if (args.includes('--self-test')) return selfTest(asJson);

  const pathArgs = args.filter((a) => !a.startsWith('--'));
  const targets = pathArgs.length ? expandTargets(pathArgs) : defaultTargets();
  const violations = scan(targets);
  report(violations, targets, asJson);
  process.exit(violations.length ? 1 : 0);
}

main();
