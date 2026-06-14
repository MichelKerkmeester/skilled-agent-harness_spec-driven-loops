#!/usr/bin/env node
'use strict';
// Host-side seat-prompt renderer for the deep-context sweep in this packet.
// One COSTAR prompt per seat (MiMo profile: lean, audience-framed, no preamble),
// carrying the four-part lineage contract: gather-subject, shared slice,
// known-context, and the seat output schema.

const fs = require('fs');
const path = require('path');

const GATHER_SUBJECT = 'SQLite usage surfaces across the system-spec-kit / system-code-graph / system-skill-advisor MCP servers (driver better-sqlite3 ^12.6.2, sqlite-vec ^0.1.7-alpha.2, FTS5, recursive CTEs, pragmas, WAL, daemon single-writer models), oriented at Turso/libSQL migration touchpoints. Turso (Rust SQLite rewrite) lacks FTS5, loadExtension, .pragma(), WITH RECURSIVE, and vector indexes — every construct touching those is migration-relevant.';

const PERSPECTIVES = {
  'mimo-a': { name: 'STRUCTURE', detail: 'Find every schema/table/index/virtual-table/migration construct in the slice: DDL shapes, schema-version handling, table layouts, triggers-as-schema, and the SQL statement shapes used by queries.' },
  'mimo-b': { name: 'WRITE PATHS', detail: 'Find every transactional/write construct in the slice: synchronous transaction wrappers, insert/upsert/delete flows, rebuild/sweep flows, error-recovery writes, and WAL/locking assumptions baked into write sequencing.' },
  'mimo-c': { name: 'MIGRATION RISK', detail: 'Find every better-sqlite3-specific API coupling point in the slice: .pragma() calls, loadExtension(), prepared-statement idioms (.raw(), .pluck(), .iterate()), synchronous Database constructor options, backup()/serialize(), user-defined functions, recursive CTEs, ATTACH/DETACH — and tag each with which Turso/libSQL gap it exposes.' },
};

function main() {
  const [, , contextDir, iterTag, specPath] = process.argv;
  if (!contextDir || !iterTag || !specPath) {
    console.error('usage: host-render-prompts.cjs <contextDir> <iter-NNN> <iterSpec.json>');
    process.exit(2);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const outDir = path.join(contextDir, 'prompts', iterTag);
  fs.mkdirSync(outDir, { recursive: true });
  const sliceList = spec.sliceFiles.map((f) => `- ${f}`).join('\n');
  const extra = spec.focusNote ? `\nFocus note: ${spec.focusNote}` : '';

  for (const label of Object.keys(PERSPECTIVES)) {
    const p = PERSPECTIVES[label];
    const body = `## Context
You are one read-only analysis seat in a multi-seat context sweep of the repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Gather-subject: ${GATHER_SUBJECT}
THIS ITERATION'S SHARED SLICE — analyze ONLY these files:
${sliceList}
Known context (do not re-find): ${spec.knownContext || 'none yet'}${extra}
Read-only analysis: do NOT write, edit, or create any files. Use read/grep tools on the slice files only.

## Objective
Your perspective: ${p.name}. ${p.detail} Return structured findings.
Regardless of perspective, ALWAYS also include the slice's top driver-coupling constructs — every .pragma() call site, transaction wrapper, virtual-table DDL, and extension load you encounter — using the construct's exact symbol name. These anchor cross-seat agreement.

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — output will be parsed directly; prose wrapping around code is harmful

## Response
Return ONLY a JSON object, no surrounding prose, exactly this shape:
{"findings":[{"path":"<repo-relative file path from the slice list>","symbol":"<exact identifier/table name at the evidence line>","kind":"reuse_candidate|integration_point|convention|dependency|gap","signature":"<one-line signature or DDL fragment>","reuse":"extend|compose|wrap|import","evidence":"<repo-relative path>:<line number>","relevance":0.0,"notes":"<one line: why this matters for Turso/libSQL migration>"}]}
Rules: path MUST be exactly one of the slice paths. symbol MUST be the exact identifier at the evidence line. 8-20 findings. relevance = migration impact (1.0 = blocks migration as-is).

---
Pre-plan (lean):
1. Read each slice file; locate ${p.name.toLowerCase()} constructs -> candidate list with exact line numbers.
2. For each candidate: classify kind, capture signature + evidence path:line, score relevance -> final findings array.
3. Verify: every finding has exact path + symbol + numeric relevance; output is one valid JSON object with no prose.
`;
    fs.writeFileSync(path.join(outDir, `${label}.md`), body);
  }
  console.log(JSON.stringify({ rendered: Object.keys(PERSPECTIVES), outDir }));
}

main();
