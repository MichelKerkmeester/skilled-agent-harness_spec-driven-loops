#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Projection Contract Coverage                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--dir).                                                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=clean, 1=script error, 2=conformance violation.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// A projectable census surface with no projection contract is a silent gap:
// an append for that mode reports projectionRefreshed=false with a missing
// contract error while the legacy file is never refreshed, and nothing in the
// tree fails. This checker turns that gap into a coverage gate by parsing the
// manifest, selecting every disposition:'project' row, and verifying each one
// is either backed by a real exported contract factory or explicitly declared
// as uncovered. A clean result means the covered and uncovered sets are
// accounted for — NOT that the uncovered surfaces have been cut over.

// The manifest is a TypeScript module, but a plain .cjs cannot require a .ts
// module in this toolchain (only fs and path are available, exactly like the
// sibling append-site checker that scans YAML as text rather than loading a
// YAML parser). So the manifest is read as text and its entry blocks are
// scanned line by line. Parsing defensively — a block that yields no
// surfaceId or no disposition is a script error, never a silently skipped
// row: a parser that quietly drops rows would under-report the very gap this
// guard exists to find.

const fs = require('fs');
const path = require('path');

const MANIFEST_REL = path.join('lib', 'legacy-projections', 'legacy-projection-manifest.ts');
const CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-research-contract.ts');

// The single projection contract factory that exists in the library today.
// Declared here so the guard can prove the factory is actually exported by
// reading its module, not just named. If the export disappears, that is a
// violation, not a pass.
const COVERED = Object.freeze({
  'research-state': {
    module: CONTRACT_REL,
    factory: 'createDeepResearchProjectionContract',
  },
});

// Every projectable surface that has NO contract today, declared explicitly.
// A newly added projectable surface cannot slip in unnamed: it would be
// projectable, not covered, and absent from this list, so it surfaces as
// UNDECLARED_UNCOVERED_SURFACE rather than passing quietly.
const UNCOVERED_DECLARED = Object.freeze([
  'research-deltas',
  'research-projections',
  'research-strategy-inbox',
  'review-state',
  'review-deltas',
  'review-projections',
  'alignment-state-deltas',
  'alignment-projections',
  'council-config-state',
  'council-round-ledgers',
  'improvement-ledgers',
  'improvement-derived-state',
  'model-grader-cache',
  'runtime-observability',
  'fanout-ledger',
  'fanout-checkpoints',
  'behavior-benchmark-output',
  'divergent-pivot-transactions',
  'loop-guard-session-state',
  'loop-guard-archive',
  'compiled-command-manifest',
]);

// Cross-check for the list above. A list alone cannot catch a silent drop: if
// a row is removed from the manifest, the list still matches its survivors and
// looks consistent. The count is stated independently and checked against the
// derived uncovered total, so a dropped or added surface surfaces as a
// mismatch rather than passing quietly.
const UNCOVERED_DECLARED_COUNT = 21;

function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function fail(err) {
  emit({ error: String(err && err.message ? err.message : err) });
  process.exit(1);
}

// scripts -> runtime root (the directory containing lib/, scripts/, tests/).
function defaultDir() {
  return path.resolve(__dirname, '..');
}

function parseArgs(argv) {
  const out = { dir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') {
      out.dir = argv[++i];
    } else if (a.startsWith('--dir=')) {
      out.dir = a.slice('--dir='.length);
    }
  }
  return out;
}

// Locate the manifest seed array and extract one { surfaceId, disposition }
// pair per entry block. Entry blocks are delimited by a line that is just `{`
// and a line that is just `}` (optionally trailing comma), so braces inside
// string literals (path templates like '{spec_folder}/...') cannot start or
// end a block. A block missing either field is a parser error.
function parseManifest(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^const\s+manifestSeeds\s*:\s*LegacyProjectionManifestSeed\[\]\s*=\s*\[/.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    throw new Error('manifest seed array declaration not found');
  }

  let end = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\];\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (end === -1) {
    throw new Error('manifest seed array terminator not found');
  }

  const entries = [];
  let inBlock = false;
  let buffer = [];

  const openRe = /^\s*\{\s*$/;
  const closeRe = /^\s*\}\s*,?\s*$/;

  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    if (!inBlock) {
      if (openRe.test(line)) {
        inBlock = true;
        buffer = [];
      }
      continue;
    }
    if (closeRe.test(line)) {
      inBlock = false;
      const body = buffer.join('\n');
      const sid = body.match(/surfaceId\s*:\s*['"]([^'"]+)['"]/);
      const dis = body.match(/disposition\s*:\s*['"]([^'"]+)['"]/);
      if (!sid) {
        throw new Error(`manifest entry block at line ${i} has no surfaceId`);
      }
      if (!dis) {
        throw new Error(`manifest entry block for '${sid[1]}' has no disposition`);
      }
      entries.push({ surfaceId: sid[1], disposition: dis[1] });
      continue;
    }
    buffer.push(line);
  }

  if (inBlock) {
    throw new Error('manifest seed array has an unterminated entry block');
  }
  if (entries.length === 0) {
    throw new Error('manifest seed array contains no entry blocks');
  }
  return entries;
}

// Confirm a factory name is actually exported by its module text. Supports the
// `export function`, `export async function`, `export const ... =`, and
// re-export `export { ... }` forms. A covered declaration whose factory is not
// exported is MISSING_CONTRACT_EXPORT.
function contractExportsFactory(contractText, factoryName) {
  const esc = factoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const forms = [
    new RegExp(`export\\s+async\\s+function\\s+${esc}\\b`),
    new RegExp(`export\\s+function\\s+${esc}\\b`),
    new RegExp(`export\\s+const\\s+${esc}\\s*=`),
    new RegExp(`export\\s*\\{[^}]*\\b${esc}\\b[^}]*\\}`),
  ];
  return forms.some((re) => re.test(contractText));
}

function evaluate(entries, contractText) {
  const violations = [];
  const info = [];

  const projectable = entries.filter((e) => e.disposition === 'project');
  const projectableIds = projectable.map((e) => e.surfaceId);
  const projectableSet = new Set(projectableIds);

  // Covered = projectable AND named in the COVERED map.
  const coveredIds = projectableIds.filter((id) => Object.prototype.hasOwnProperty.call(COVERED, id));
  const coveredSet = new Set(coveredIds);

  // Uncovered = projectable AND NOT covered.
  const uncoveredIds = projectableIds.filter((id) => !coveredSet.has(id));
  const uncoveredSet = new Set(uncoveredIds);

  const uncoveredDeclaredSet = new Set(UNCOVERED_DECLARED);

  // R1: MISSING_CONTRACT_EXPORT — a factory named in the covered map is not
  // exported by its module. The covered declaration is only meaningful while
  // the factory it names actually exists.
  for (const id of Object.keys(COVERED)) {
    const entry = COVERED[id];
    if (!contractExportsFactory(contractText, entry.factory)) {
      violations.push({
        surfaceId: id,
        rule: 'MISSING_CONTRACT_EXPORT',
        detail: `factory '${entry.factory}' is not exported by ${entry.module}`,
      });
    }
  }

  // R2: UNDECLARED_UNCOVERED_SURFACE — projectable, not covered, and not in
  // the declared uncovered list. A new projectable surface must be either
  // given a contract or explicitly declared uncovered; passing unnamed is the
  // gap this guard exists to close.
  for (const id of uncoveredIds) {
    if (!uncoveredDeclaredSet.has(id)) {
      violations.push({
        surfaceId: id,
        rule: 'UNDECLARED_UNCOVERED_SURFACE',
        detail: `projectable surface '${id}' has no projection contract and is not declared in the uncovered list`,
      });
    }
  }

  // R3: UNCOVERED_COUNT_MISMATCH — the declared count must equal the derived
  // uncovered total. The count is the independent cross-check for the list: a
  // dropped row leaves the list internally consistent but the count wrong.
  if (UNCOVERED_DECLARED_COUNT !== uncoveredIds.length) {
    violations.push({
      surfaceId: '*',
      rule: 'UNCOVERED_COUNT_MISMATCH',
      detail: `declared uncovered count ${UNCOVERED_DECLARED_COUNT} but actual uncovered total ${uncoveredIds.length}`,
    });
  }

  // R4: STALE_UNCOVERED_DECLARATION — a surface declared uncovered that is now
  // covered (gained a contract) or no longer projectable (removed or
  // reclassified). Either way the declaration is stale and must be updated.
  for (const id of UNCOVERED_DECLARED) {
    if (coveredSet.has(id)) {
      violations.push({
        surfaceId: id,
        rule: 'STALE_UNCOVERED_DECLARATION',
        detail: `surface '${id}' is declared uncovered but is now covered by a contract`,
      });
    } else if (!projectableSet.has(id)) {
      violations.push({
        surfaceId: id,
        rule: 'STALE_UNCOVERED_DECLARATION',
        detail: `surface '${id}' is declared uncovered but is no longer projectable`,
      });
    }
  }

  // Stable sort: by surfaceId then rule.
  violations.sort((a, b) => {
    if (a.surfaceId !== b.surfaceId) return a.surfaceId < b.surfaceId ? -1 : 1;
    if (a.rule !== b.rule) return a.rule < b.rule ? -1 : 1;
    return 0;
  });

  return {
    projectable: projectableIds.length,
    covered: coveredIds.length,
    uncovered: uncoveredIds.length,
    violations,
    info,
  };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const dir = args.dir ? path.resolve(args.dir) : defaultDir();

    const manifestPath = path.join(dir, MANIFEST_REL);
    const contractPath = path.join(dir, CONTRACT_REL);

    let manifestText;
    try {
      manifestText = fs.readFileSync(manifestPath, 'utf8');
    } catch (e) {
      fail(e);
      return;
    }

    let contractText;
    try {
      contractText = fs.readFileSync(contractPath, 'utf8');
    } catch (e) {
      fail(e);
      return;
    }

    let entries;
    try {
      entries = parseManifest(manifestText);
    } catch (e) {
      fail(e);
      return;
    }

    const result = evaluate(entries, contractText);
    const ok = result.violations.length === 0;
    emit({
      ok,
      projectable: result.projectable,
      covered: result.covered,
      uncovered: result.uncovered,
      violations: result.violations,
      info: result.info,
    });
    process.exit(ok ? 0 : 2);
  } catch (err) {
    fail(err);
  }
}

main();
