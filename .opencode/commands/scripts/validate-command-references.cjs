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
const os = require('os');
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
const COMMAND_INVENTORY_EXCLUDES = new Set(['assets', 'scripts', 'fixtures']);

// Path token stops at YAML/prose delimiters and at any template metacharacter, so an
// interpolated reference (e.g. skills/{skill_name}/SKILL.md) truncates to a bare dir
// and is then dropped by the file-shaped filter below.
const SKILL_TOKEN = /\.opencode\/skills\/[^\s"'`,()\[\]{}<>$*|]+/g;
const AGENT_REF = /\[runtime_agent_path\]\/([A-Za-z0-9][A-Za-z0-9._-]*\.md)/g;
const BARE_PHANTOM_AGENTS_DIR = /\.agents\//g;
const SCOPED_AGENTS_DIR = /(\.[a-z][a-z0-9_-]*)\/agents\//g;
const COMMAND_TARGET = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function agentExists(fileName, rootDir = REPO_ROOT) {
  return AGENT_DIRS.some((d) => fs.existsSync(path.join(rootDir, d, fileName)));
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
function extractViolations(file, rootDir = REPO_ROOT) {
  const rel = path.relative(rootDir, file);
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
      if (!agentExists(name, rootDir)) {
        add(lineNo, 'agent', `[runtime_agent_path]/${name}`, `no ${name} in ${AGENT_DIRS.join(', ')}`);
      }
    }

    SKILL_TOKEN.lastIndex = 0;
    while ((m = SKILL_TOKEN.exec(text)) !== null) {
      const token = normalizeSkillToken(m[0]);
      if (!token) continue;
      if (!fs.existsSync(path.join(rootDir, token))) {
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
  return targets.flatMap((target) => extractViolations(target));
}

// The prompt-sync source contract excludes non-command support directories and
// non-invocable Markdown. Keeping that inventory here gives adapters one shared
// source for discovery while the sync CLI remains the exact live parity gate.
function commandSourceInventory(rootDir = REPO_ROOT) {
  const commandsRoot = path.join(rootDir, '.opencode', 'commands');
  if (!fs.existsSync(commandsRoot)) return [];
  const sources = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!COMMAND_INVENTORY_EXCLUDES.has(entry.name)) walk(absolute);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (entry.name === 'README.md' || entry.name.endsWith('.contract.md')) continue;
      sources.push(path.relative(rootDir, absolute).split(path.sep).join('/'));
    }
  };
  walk(commandsRoot);
  return sources.sort();
}

function lineNumber(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function extractCommandTargets(text) {
  const targets = [];
  COMMAND_TARGET.lastIndex = 0;
  let match;
  while ((match = COMMAND_TARGET.exec(text)) !== null) {
    targets.push({ target: match[0], line: lineNumber(text, match.index) });
  }
  return targets;
}

/**
 * Classify execution ownership without treating a missing workflow reference as
 * a different topology. Explicit direct dispatch takes precedence over route
 * tables, then workflow ownership, then an affirmative inline-procedure marker.
 *
 * @param {string} text - Canonical command Markdown.
 * @returns {'workflow router'|'subaction router'|'direct-tool/plugin router'|'monolithic'|'UNCLASSIFIED'}
 */
function classifyCommandTopology(text) {
  const directToolSignal = new RegExp([
    'direct-tool/plugin router',
    'owns no workflow YAML',
    'state-free router',
    'dispatches? (?:straight |directly )?to .*plugin tools?',
  ].join('|'), 'i');
  if (directToolSignal.test(text)) {
    return 'direct-tool/plugin router';
  }
  if (/sub[- ]?action (?:router|routing)|route manifest|_routes\.yaml/i.test(text)) {
    return 'subaction router';
  }
  if (/workflow router/i.test(text) || extractCommandTargets(text).some((item) => /\.ya?ml$/.test(item.target))) {
    return 'workflow router';
  }
  const monolithicSignal = new RegExp([
    '\\bmonolithic\\b',
    'complete (?:procedure|workflow).*inline',
    'Direct identity adoption architecture',
    'This command runs a structured workflow',
  ].join('|'), 'i');
  if (monolithicSignal.test(text)) {
    return 'monolithic';
  }
  return 'UNCLASSIFIED';
}

function mirrorRelativeForSource(sourceRelative) {
  const commandRelative = sourceRelative.replace(/^\.opencode\/commands\//, '');
  const flatName = commandRelative.replace(/\.md$/, '').split('/').join('-');
  return `.codex/prompts/${flatName}.md`;
}

function expectedMirrorIdentity(sourceRelative) {
  const mirrorRelative = mirrorRelativeForSource(sourceRelative);
  const flatName = path.basename(mirrorRelative, '.md');
  return {
    mirrorRelative,
    lines: new Map([
      [1, `<!-- Generated by sync-prompts.cjs from ${sourceRelative} — do not edit by hand. -->`],
      [2, `# Codex entry: /${flatName}`],
      [6, `\`${sourceRelative}\``],
    ]),
  };
}

function makeSurfaceViolation(file, line, kind, ref, detail, source, topology) {
  return { file, line, kind, ref, detail, source, topology };
}

/**
 * Inspect canonical sources, generated mirrors and declared command assets for
 * every execution topology. The returned violation fields extend the existing
 * checker shape without changing its CLI report contract.
 *
 * @param {string} [rootDir] - Repository-shaped root to inspect.
 * @returns {{inventory:Array<Object>,topologyCounts:Object,violations:Array<Object>}}
 */
function inspectCommandSurface(rootDir = REPO_ROOT) {
  const sources = commandSourceInventory(rootDir);
  const expectedMirrors = new Map();
  const violations = [];
  const topologyCounts = {
    'workflow router': 0,
    'subaction router': 0,
    'direct-tool/plugin router': 0,
    monolithic: 0,
    UNCLASSIFIED: 0,
  };
  const inventory = [];

  for (const source of sources) {
    const sourcePath = path.join(rootDir, source);
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    const topology = classifyCommandTopology(sourceText);
    topologyCounts[topology] += 1;
    const identity = expectedMirrorIdentity(source);
    expectedMirrors.set(identity.mirrorRelative, source);
    inventory.push({ source, mirror: identity.mirrorRelative, topology });

    const seenTargets = new Set();
    for (const reference of extractCommandTargets(sourceText)) {
      if (seenTargets.has(reference.target)) continue;
      seenTargets.add(reference.target);
      if (!fs.existsSync(path.join(rootDir, reference.target))) {
        violations.push(makeSurfaceViolation(
          source,
          reference.line,
          'command-target',
          reference.target,
          'declared command target does not exist on disk',
          source,
          topology,
        ));
      }
    }

    const mirrorPath = path.join(rootDir, identity.mirrorRelative);
    if (!fs.existsSync(mirrorPath)) {
      violations.push(makeSurfaceViolation(
        identity.mirrorRelative,
        1,
        'mirror-missing',
        source,
        'canonical command has no generated runtime mirror',
        source,
        topology,
      ));
      continue;
    }
    const actualLines = fs.readFileSync(mirrorPath, 'utf8').split('\n');
    for (const [line, expected] of identity.lines) {
      if (actualLines[line - 1] === expected) continue;
      violations.push(makeSurfaceViolation(
        identity.mirrorRelative,
        line,
        'mirror-drift',
        source,
        'generated runtime mirror identity differs from the sync contract',
        source,
        topology,
      ));
      break;
    }
  }

  const mirrorRoot = path.join(rootDir, '.codex', 'prompts');
  if (fs.existsSync(mirrorRoot)) {
    for (const entry of fs.readdirSync(mirrorRoot, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const mirrorRelative = `.codex/prompts/${entry.name}`;
      if (expectedMirrors.has(mirrorRelative)) continue;
      const mirrorText = fs.readFileSync(path.join(mirrorRoot, entry.name), 'utf8');
      const pointer = mirrorText.match(/`(\.opencode\/commands\/[^`]+\.md)`/);
      const owner = sources[0] || null;
      violations.push(makeSurfaceViolation(
        mirrorRelative,
        pointer ? lineNumber(mirrorText, pointer.index) : 1,
        'orphan-mirror',
        pointer ? pointer[1] : mirrorRelative,
        'generated runtime mirror has no canonical command source',
        owner,
        owner ? inventory[0].topology : 'UNCLASSIFIED',
      ));
    }
  }

  return { inventory, topologyCounts, violations };
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
  const topologyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'command-reference-topologies-'));
  let topologyPass = false;
  let topologyCounts = {};
  let topologyViolations = [];
  try {
    const commandsDir = path.join(topologyRoot, '.opencode', 'commands');
    fs.mkdirSync(path.join(commandsDir, 'assets'), { recursive: true });
    fs.writeFileSync(
      path.join(commandsDir, 'workflow.md'),
      'This workflow router loads `.opencode/commands/assets/workflow.yaml`.\n',
    );
    fs.writeFileSync(
      path.join(commandsDir, 'subaction.md'),
      [
        'This subaction router maps:',
        '- `start` -> `.opencode/commands/assets/start.yaml`',
        '- `stop` -> `.opencode/commands/assets/stop.yaml`',
        '',
      ].join('\n'),
    );
    fs.writeFileSync(path.join(commandsDir, 'direct.md'), 'This direct-tool/plugin router owns no workflow YAML.\n');
    fs.writeFileSync(
      path.join(commandsDir, 'monolithic.md'),
      'This monolithic command owns its complete procedure inline.\n',
    );
    fs.writeFileSync(path.join(commandsDir, 'assets', 'workflow.yaml'), 'mode: workflow\n');
    fs.writeFileSync(path.join(commandsDir, 'assets', 'start.yaml'), 'subaction: start\n');
    fs.writeFileSync(path.join(commandsDir, 'assets', 'stop.yaml'), 'subaction: stop\n');

    const surface = inspectCommandSurface(topologyRoot);
    topologyCounts = surface.topologyCounts;
    topologyViolations = surface.violations.filter((item) => item.kind === 'command-target');
    topologyPass = topologyCounts['workflow router'] === 1
      && topologyCounts['subaction router'] === 1
      && topologyCounts['direct-tool/plugin router'] === 1
      && topologyCounts.monolithic === 1
      && topologyCounts.UNCLASSIFIED === 0
      && topologyViolations.length === 0;
  } finally {
    fs.rmSync(topologyRoot, { recursive: true, force: true });
  }

  if (asJson) {
    console.log(JSON.stringify({
      brokenPass,
      realPass,
      topologyPass,
      brokenViolations: brokenViol,
      realViolations: realViol,
      topologyCounts,
      topologyViolations,
    }, null, 2));
  } else {
    console.log(
      `[self-test] broken fixture flags a violation: ${brokenPass ? 'PASS' : 'FAIL'} (${brokenViol.length} found)`,
    );
    console.log(
      `[self-test] real tree resolves clean:         ${realPass ? 'PASS' : 'FAIL'} (${realViol.length} unresolved)`,
    );
    const topologyStatus = topologyPass ? 'PASS' : 'FAIL';
    console.log(`[self-test] four command topologies resolve: ${topologyStatus} (`
      + `${JSON.stringify(topologyCounts)})`);
    if (!realPass) {
      for (const v of realViol) console.error(`    ${v.file}:${v.line}  [${v.kind}]  ${v.ref}  — ${v.detail}`);
    }
    if (!brokenPass) console.error('    fixture produced no violation — the checker is not detecting broken references.');
  }
  process.exit(brokenPass && realPass && topologyPass ? 0 : 1);
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

if (require.main === module) {
  main();
}

module.exports = {
  commandSourceInventory,
  classifyCommandTopology,
  extractCommandTargets,
  inspectCommandSurface,
};
