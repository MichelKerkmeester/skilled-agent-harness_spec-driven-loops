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
const RESEARCH_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-research-contract.ts');
const RESEARCH_DELTAS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-research-deltas-contract.ts');
const RESEARCH_PROJECTIONS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-research-projections-contract.ts');
const REVIEW_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-review-state-contract.ts');
const REVIEW_DELTAS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-review-deltas-contract.ts');
const REVIEW_PROJECTIONS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-review-projections-contract.ts');
const ALIGNMENT_STATE_DELTAS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-alignment-state-deltas-contract.ts');
const IMPROVEMENT_LEDGERS_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-improvement-ledgers-contract.ts');
const COUNCIL_CONFIG_STATE_CONTRACT_REL = path.join('lib', 'legacy-projections', 'deep-ai-council-config-state-contract.ts');

// Each projection contract factory that exists in the library today.
// Declared here so the guard can prove the factory is actually exported by
// reading its own module, not just named. If the export disappears, that is a
// violation, not a pass. A covered entry points at the module that owns its
// factory so the export check reads the right file per surface.
const COVERED = Object.freeze({
  'research-state': {
    module: RESEARCH_CONTRACT_REL,
    factory: 'createDeepResearchProjectionContract',
  },
  'research-deltas': {
    module: RESEARCH_DELTAS_CONTRACT_REL,
    factory: 'createDeepResearchDeltasProjectionContract',
  },
  'research-projections': {
    module: RESEARCH_PROJECTIONS_CONTRACT_REL,
    factory: 'createDeepResearchProjectionsProjectionContract',
  },
  'review-state': {
    module: REVIEW_CONTRACT_REL,
    factory: 'createDeepReviewStateProjectionContract',
  },
  'review-deltas': {
    module: REVIEW_DELTAS_CONTRACT_REL,
    factory: 'createDeepReviewDeltasProjectionContract',
  },
  'review-projections': {
    module: REVIEW_PROJECTIONS_CONTRACT_REL,
    factory: 'createDeepReviewProjectionsProjectionContract',
  },
  'alignment-state-deltas': {
    module: ALIGNMENT_STATE_DELTAS_CONTRACT_REL,
    factory: 'createDeepAlignmentStateDeltasProjectionContract',
  },
  'improvement-ledgers': {
    module: IMPROVEMENT_LEDGERS_CONTRACT_REL,
    factory: 'createDeepImprovementLedgersProjectionContract',
  },
  'council-config-state': {
    module: COUNCIL_CONFIG_STATE_CONTRACT_REL,
    factory: 'createDeepAiCouncilConfigStateProjectionContract',
  },
});

// Every projectable surface that has NO contract today, declared explicitly.
// A newly added projectable surface cannot slip in unnamed: it would be
// projectable, not covered, and absent from this list, so it surfaces as
// UNDECLARED_UNCOVERED_SURFACE rather than passing quietly.
const UNCOVERED_DECLARED = Object.freeze([
  'alignment-projections',
  'council-round-ledgers',
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
const UNCOVERED_DECLARED_COUNT = 12;

// Legacy-writer retirement is scoped to mode-owned surfaces — those whose
// legacyWriter is owned by one of the deep-loop modes. Surfaces written by
// runtime infrastructure (fanout, dispatch guards, command renderers, etc.)
// are not part of that retirement at all, so a missing projection contract on
// an infrastructure surface is not a blocker for it. A raw uncovered total
// mixes those two populations and is therefore not actionable: it reports 12
// gaps when none of the 9 mode-owned projectable surfaces are uncovered — the
// one mode-owned surface that is not a ledger-fold projection (authored
// strategy prose plus the operator inbox) is reclassified as
// retain-legacy-input, so only the 12 infrastructure uncovered surfaces remain
// in the raw uncovered total. Ownership — derived from the legacyWriter prefix
// — is what decides whether a missing contract blocks retirement, so the
// breakdown below splits the uncovered set along that line. The prefixes are
// declared once here so a reclassification or a new mode surface cannot slip
// in through a scattered string literal.
const MODE_OWNER_PREFIXES = Object.freeze([
  'deep-research',
  'deep-review',
  'deep-alignment',
  'deep-ai-council',
  'deep-improvement',
]);

// Independent cross-check for the mode-owned population, mirroring
// UNCOVERED_DECLARED_COUNT. A surface silently changing owner (its
// legacyWriter rewritten to an infrastructure writer) or a new mode surface
// appearing would shift the derived mode-owned total off this declared
// constant, surfacing as MODE_OWNED_COUNT_MISMATCH rather than being absorbed
// into a single uncovered number that still happens to add up.
const MODE_OWNED_EXPECTED_COUNT = 9;

function isModeOwned(legacyWriter) {
  return MODE_OWNER_PREFIXES.some((prefix) => legacyWriter.startsWith(prefix));
}

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

// Locate the manifest seed array and extract one
// { surfaceId, disposition, legacyWriter } triple per entry block. Entry
// blocks are delimited by a line that is just `{` and a line that is just `}`
// (optionally trailing comma), so braces inside string literals (path
// templates like '{spec_folder}/...') cannot start or end a block. A block
// missing any of the three fields is a parser error: legacyWriter is the
// ownership signal that splits the uncovered set into mode-owned vs
// infrastructure, so a block that yields no legacyWriter is a script error,
// not a silently skipped row — the same defensive rule applied to surfaceId
// and disposition.
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
      const lw = body.match(/legacyWriter\s*:\s*['"]([^'"]+)['"]/);
      if (!sid) {
        throw new Error(`manifest entry block at line ${i} has no surfaceId`);
      }
      if (!dis) {
        throw new Error(`manifest entry block for '${sid[1]}' has no disposition`);
      }
      if (!lw) {
        throw new Error(`manifest entry block for '${sid[1]}' has no legacyWriter`);
      }
      entries.push({ surfaceId: sid[1], disposition: dis[1], legacyWriter: lw[1] });
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

function evaluate(entries, contractTexts) {
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

  // Split the projectable population by ownership. A surface is mode-owned
  // when its legacyWriter begins with one of the deep-loop mode prefixes;
  // everything else is infrastructure. Only mode-owned surfaces are in scope
  // for legacy-writer retirement, so only their uncovered entries are the
  // ones retirement is actually waiting on. The infrastructure uncovered
  // count is reported for completeness but is not a retirement blocker.
  const projectableById = new Map(projectable.map((e) => [e.surfaceId, e]));
  const modeOwnedIds = projectableIds.filter((id) =>
    isModeOwned(projectableById.get(id).legacyWriter));
  const modeOwnedSet = new Set(modeOwnedIds);
  const infrastructureIds = projectableIds.filter((id) => !modeOwnedSet.has(id));
  const modeOwnedUncoveredIds = uncoveredIds.filter((id) => modeOwnedSet.has(id));
  const infrastructureUncoveredIds = uncoveredIds.filter((id) => !modeOwnedSet.has(id));

  // R1: MISSING_CONTRACT_EXPORT — a factory named in the covered map is not
  // exported by its own module. Each covered entry points at the module that
  // owns its factory, so the export check reads the right file per surface.
  // A missing module file yields empty text and therefore fails the export
  // check, surfacing as MISSING_CONTRACT_EXPORT rather than a script error.
  for (const id of Object.keys(COVERED)) {
    const entry = COVERED[id];
    const text = contractTexts.get(entry.module) ?? '';
    if (!contractExportsFactory(text, entry.factory)) {
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

  // R5: MODE_OWNED_COUNT_MISMATCH — the declared mode-owned count must equal
  // the derived mode-owned projectable total. A surface silently changing
  // owner (legacyWriter rewritten to an infrastructure writer) or a new
  // mode-owned surface appearing would shift this total off the declared
  // constant. Without this cross-check the change would be absorbed into the
  // single uncovered number, which could still add up while the ownership
  // split that retirement depends on had drifted.
  if (MODE_OWNED_EXPECTED_COUNT !== modeOwnedIds.length) {
    violations.push({
      surfaceId: '*',
      rule: 'MODE_OWNED_COUNT_MISMATCH',
      detail: `declared mode-owned count ${MODE_OWNED_EXPECTED_COUNT} but actual mode-owned projectable total ${modeOwnedIds.length}`,
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
    breakdown: {
      modeOwned: {
        total: modeOwnedIds.length,
        uncovered: modeOwnedUncoveredIds.length,
        uncoveredSurfaceIds: modeOwnedUncoveredIds.slice().sort(),
      },
      infrastructure: {
        total: infrastructureIds.length,
        uncovered: infrastructureUncoveredIds.length,
      },
    },
  };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const dir = args.dir ? path.resolve(args.dir) : defaultDir();

    const manifestPath = path.join(dir, MANIFEST_REL);

    let manifestText;
    try {
      manifestText = fs.readFileSync(manifestPath, 'utf8');
    } catch (e) {
      fail(e);
      return;
    }

    // Read every covered contract module into a map keyed by its repo-relative
    // path so R1 can check each factory against the module that owns it. A
    // missing module is not a script error here: it yields empty text and R1
    // reports MISSING_CONTRACT_EXPORT for the surface that pointed at it.
    const contractTexts = new Map();
    for (const entry of Object.values(COVERED)) {
      if (contractTexts.has(entry.module)) continue;
      try {
        contractTexts.set(entry.module, fs.readFileSync(path.join(dir, entry.module), 'utf8'));
      } catch (e) {
        contractTexts.set(entry.module, '');
      }
    }

    let entries;
    try {
      entries = parseManifest(manifestText);
    } catch (e) {
      fail(e);
      return;
    }

    const result = evaluate(entries, contractTexts);
    const ok = result.violations.length === 0;
    emit({
      ok,
      projectable: result.projectable,
      covered: result.covered,
      uncovered: result.uncovered,
      violations: result.violations,
      info: result.info,
      breakdown: result.breakdown,
    });
    process.exit(ok ? 0 : 2);
  } catch (err) {
    fail(err);
  }
}

main();
