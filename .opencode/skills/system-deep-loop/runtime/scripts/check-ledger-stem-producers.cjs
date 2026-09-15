#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Ledger Stem Producer Census                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--repo-root).                                          ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=clean, 1=script error, 2=census violation.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// A registered ledger stem with no mechanical writer is a silent claim: the
// schema says the event exists, nothing ever emits it, and no gate notices.
// The census beside each stem list declares every stem spoken or reserved;
// this checker holds that declaration to the emitter surface on disk in both
// directions. Every emitted spelling must be registered and declared spoken,
// and every stem declared spoken must have a real emitter in the files it
// names. Prose mentions of a stem are not emitters, so the scan matches the
// structured `stem` key a producer writes, not the bare dotted token.

const fs = require('node:fs');
const path = require('node:path');

const RUNTIME_REL = path.join('.opencode', 'skills', 'system-deep-loop', 'runtime');
const REVIEW_TYPES_REL = path.join(
  RUNTIME_REL, 'lib', 'deep-review-ledger-schema', 'deep-review-ledger-types.ts',
);
const RESEARCH_TYPES_REL = path.join(
  RUNTIME_REL, 'lib', 'deep-research-ledger-schema', 'deep-research-ledger-types.ts',
);

const MODES = Object.freeze([
  {
    mode: 'deep-review',
    typesRel: REVIEW_TYPES_REL,
    stemsDeclaration: 'DeepReviewEventStems',
    censusDeclaration: 'DEEP_REVIEW_STEM_PRODUCERS',
  },
  {
    mode: 'deep-research',
    typesRel: RESEARCH_TYPES_REL,
    stemsDeclaration: 'DeepResearchEventStems',
    censusDeclaration: 'DEEP_RESEARCH_STEM_PRODUCERS',
  },
]);

// The measured producer surface for both deep modes: the four variant
// workflows, the append gateway, both reducers, the verifier, and the fan-out
// runner. A file renamed out of this list fails as a missing surface rather
// than passing unexamined.
const PRODUCER_SURFACE = Object.freeze([
  '.opencode/commands/deep/assets/deep-review-auto.yaml',
  '.opencode/commands/deep/assets/deep-review-confirm.yaml',
  '.opencode/commands/deep/assets/deep-research-auto.yaml',
  '.opencode/commands/deep/assets/deep-research-confirm.yaml',
  '.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs',
  '.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs',
  '.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs',
  '.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs',
  '.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs',
]);

// A `stem` key whose value is a dotted spelling. The escaped quotes are the
// form a YAML double-quoted command carries when the JSON record rides inside
// it; a bare prose mention has no key and never matches.
const EMITTED_STEM_PATTERN = /(?:^|[^A-Za-z0-9_])stem\\?['"]?\s*:\s*\\?['"]([A-Za-z0-9_]+\.[A-Za-z0-9_]+)\\?['"]/g;

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function fail(error) {
  emit({ error: error && error.message ? error.message : String(error) });
  process.exit(1);
}

function parseArgs(argv) {
  const out = { repoRoot: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--repo-root') {
      out.repoRoot = argv[index + 1];
      index += 1;
    } else if (token.startsWith('--repo-root=')) {
      out.repoRoot = token.slice('--repo-root='.length);
    } else if (token === '--help' || token === '-h') {
      out.help = true;
    } else {
      out.error = `unknown flag: ${token}`;
    }
  }
  return out;
}

function defaultRepoRoot() {
  return path.resolve(__dirname, '..', '..', '..', '..', '..');
}

// Parse the frozen stems array. One quoted stem per line is the declared
// format; anything else is a parser error, never a silently skipped stem.
function parseStemList(text, declaration) {
  const start = text.indexOf(`export const ${declaration} = Object.freeze([`);
  if (start === -1) {
    throw new Error(`${declaration} declaration not found`);
  }
  const end = text.indexOf('] as const);', start);
  if (end === -1) {
    throw new Error(`${declaration} declaration terminator not found`);
  }
  const stems = [];
  for (const line of text.slice(start, end).split('\n').slice(1)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^'([A-Za-z0-9_]+\.[A-Za-z0-9_]+)',?$/);
    if (!match) {
      throw new Error(`unparseable stem line in ${declaration}: ${trimmed}`);
    }
    stems.push(match[1]);
  }
  if (stems.length === 0) {
    throw new Error(`${declaration} declares no stems`);
  }
  return stems;
}

// Parse the census block. Each entry is one line so the declaration stays
// greppable and the parser stays strict; an unparseable line is an error, not
// a skipped row, because a quietly dropped entry would under-report exactly
// the gap this guard exists to find.
function parseCensus(text, declaration) {
  const start = text.indexOf(`export const ${declaration} = Object.freeze({`);
  if (start === -1) {
    throw new Error(`${declaration} declaration not found`);
  }
  const end = text.indexOf('} as const satisfies', start);
  if (end === -1) {
    throw new Error(`${declaration} declaration terminator not found`);
  }
  const entries = new Map();
  for (const line of text.slice(start, end).split('\n').slice(1)) {
    if (!line.trim()) continue;
    const match = line.match(
      /^\s*'([A-Za-z0-9_]+\.[A-Za-z0-9_]+)':\s*\{\s*status:\s*'(spoken|reserved)',\s*(.*?)\s*\},?\s*$/,
    );
    if (!match) {
      throw new Error(`unparseable census line in ${declaration}: ${line.trim()}`);
    }
    const [, stem, status, body] = match;
    if (entries.has(stem)) {
      throw new Error(`duplicate census entry for ${stem}`);
    }
    if (status === 'spoken') {
      const list = body.match(/^producers:\s*\[(.*)\]$/);
      if (!list) {
        throw new Error(`spoken entry ${stem} has no producers list`);
      }
      const producers = [...list[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
      if (producers.length === 0) {
        throw new Error(`spoken entry ${stem} names no producer file`);
      }
      entries.set(stem, { status, producers });
    } else {
      const reason = body.match(/^reason:\s*'([^'\\]*)'$/);
      if (!reason || reason[1].trim() === '') {
        throw new Error(`reserved entry ${stem} has no reason`);
      }
      entries.set(stem, { status, reason: reason[1] });
    }
  }
  if (entries.size === 0) {
    throw new Error(`${declaration} declares no census entries`);
  }
  return entries;
}

function scanEmitters(repoRoot) {
  const emitters = [];
  const missingFiles = [];
  for (const relativePath of PRODUCER_SURFACE) {
    let text;
    try {
      text = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    } catch {
      missingFiles.push(relativePath);
      continue;
    }
    for (const match of text.matchAll(EMITTED_STEM_PATTERN)) {
      emitters.push({ file: relativePath, stem: match[1] });
    }
  }
  return { emitters, missingFiles };
}

function evaluateMode(spec, repoRoot, emitters, missingFiles) {
  const violations = [];
  const typesPath = path.join(repoRoot, spec.typesRel);
  let text;
  try {
    text = fs.readFileSync(typesPath, 'utf8');
  } catch {
    throw new Error(`ledger schema not found: ${spec.typesRel}`);
  }

  const stems = parseStemList(text, spec.stemsDeclaration);
  const census = parseCensus(text, spec.censusDeclaration);
  const registered = new Set(stems);
  const missing = new Set(missingFiles);
  const stemPrefix = `${spec.mode.replace('-', '_')}.`;
  const modeEmitters = emitters.filter((entry) => entry.stem.startsWith(stemPrefix));

  for (const relativePath of PRODUCER_SURFACE) {
    if (missing.has(relativePath)) {
      violations.push({
        rule: 'PRODUCER_SURFACE_MISSING',
        stem: null,
        file: relativePath,
        detail: `declared producer surface file is missing for ${spec.mode}`,
      });
    }
  }

  for (const stem of stems) {
    if (!census.has(stem)) {
      violations.push({
        rule: 'UNDECLARED_STEM',
        stem,
        file: spec.typesRel,
        detail: 'registered stem has neither a spoken nor a reserved census entry',
      });
    }
  }

  for (const [stem, entry] of census) {
    if (!registered.has(stem)) {
      violations.push({
        rule: 'CENSUS_STEM_UNREGISTERED',
        stem,
        file: spec.typesRel,
        detail: 'census entry names a stem the schema does not register',
      });
    }
    if (entry.status === 'spoken') {
      for (const producer of entry.producers) {
        if (!PRODUCER_SURFACE.includes(producer)) {
          violations.push({
            rule: 'DECLARED_PRODUCER_UNSCANNED',
            stem,
            file: producer,
            detail: 'declared producer is outside the scanned emitter surface',
          });
        } else if (missing.has(producer)) {
          violations.push({
            rule: 'DECLARED_PRODUCER_MISSING',
            stem,
            file: producer,
            detail: 'declared producer file does not exist',
          });
        } else if (!modeEmitters.some((candidate) => candidate.file === producer && candidate.stem === stem)) {
          violations.push({
            rule: 'SPOKEN_WITHOUT_EMITTER',
            stem,
            file: producer,
            detail: 'stem is declared spoken but the named producer does not emit it',
          });
        }
      }
    } else if (modeEmitters.some((candidate) => candidate.stem === stem)) {
      violations.push({
        rule: 'RESERVED_STEM_EMITTED',
        stem,
        file: modeEmitters.find((candidate) => candidate.stem === stem).file,
        detail: 'stem is declared reserved but a producer emits it',
      });
    }
  }

  for (const entry of modeEmitters) {
    if (!registered.has(entry.stem)) {
      violations.push({
        rule: 'UNREGISTERED_EMITTER',
        stem: entry.stem,
        file: entry.file,
        detail: 'producer emits a spelling the schema does not register',
      });
    }
  }

  const spoken = [...census.values()].filter((entry) => entry.status === 'spoken').length;

  return {
    mode: spec.mode,
    registered: stems.length,
    spoken,
    reserved: census.size - spoken,
    emitters: modeEmitters
      .map((entry) => ({ file: entry.file, stem: entry.stem }))
      .sort((left, right) => (
        left.stem === right.stem
          ? (left.file < right.file ? -1 : left.file > right.file ? 1 : 0)
          : (left.stem < right.stem ? -1 : 1)
      )),
    violations,
  };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(
      'Usage: check-ledger-stem-producers.cjs [--repo-root <path>]\n'
      + 'Exit 0 when every registered stem is declared and every spoken stem has an emitter.\n',
    );
    return 0;
  }
  if (args.error) {
    process.stdout.write(`${JSON.stringify({ error: args.error })}\n`);
    return 1;
  }

  let repoRoot;
  try {
    repoRoot = args.repoRoot ? path.resolve(args.repoRoot) : defaultRepoRoot();
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ error: error.message })}\n`);
    return 1;
  }

  const { emitters, missingFiles } = scanEmitters(repoRoot);
  const results = MODES.map((spec) => evaluateMode(spec, repoRoot, emitters, missingFiles));
  const violations = results
    .flatMap((result) => result.violations.map((violation) => ({ mode: result.mode, ...violation })))
    .sort((left, right) => {
      const leftKey = `${left.mode}|${left.stem ?? ''}|${left.file ?? ''}|${left.rule}`;
      const rightKey = `${right.mode}|${right.stem ?? ''}|${right.file ?? ''}|${right.rule}`;
      return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
    });
  const ok = violations.length === 0;

  emit({
    ok,
    repoRoot,
    registered: results.reduce((total, result) => total + result.registered, 0),
    spoken: results.reduce((total, result) => total + result.spoken, 0),
    reserved: results.reduce((total, result) => total + result.reserved, 0),
    emitters: results.flatMap((result) => result.emitters),
    violations,
  });
  return ok ? 0 : 2;
}

if (require.main === module) {
  let status;
  try {
    status = main();
  } catch (error) {
    fail(error);
  }
  process.exit(status);
}

module.exports = {
  PRODUCER_SURFACE,
  parseArgs,
  parseStemList,
  parseCensus,
  scanEmitters,
  main,
};
