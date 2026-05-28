# Deep-Research Iteration 2 — K1.1 deep-dive: memoization + dependency-DAG transfer

You are operating as the `@deep-research` LEAF agent via cli-codex (model=gpt-5.5, reasoning=high, service_tier=fast).

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 10
Questions: 1/11 answered (K2.4) | Last focus: ground-truth-baseline
Last 2 ratios: N/A -> 0.86 | Stuck count: 0
Resource map: not present; skipping coverage gate.
Next focus: K1.1 deep-dive — yes/no/maybe transfer assessment for canonical fingerprints + dependency-DAG invalidation on TypeScript+SQLite.

Research Topic: cocoindex-main → spec_kit_memory MCP port + MCP tool-namespace shortening.

Iteration: 2 of 10
Focus Area: **K1.1 — Memoization + dependency-DAG indexing transfer**. Decide: does cocoindex's `(input fingerprint, code hash) → memoized result` + stable-path delta propagation transfer cleanly to our TypeScript+SQLite stack, or does it require a Rust-equivalent runtime / heed-style KV store?

Remaining Key Questions (open):
- **K1.1** (THIS ITERATION FOCUS)
- K1.2 (next iter), K1.3, K1.4, K1.5, K1.6
- K2.1, K2.2, K2.3, K2.5

Last 3 Iterations Summary: run 1: ground-truth-baseline (0.86 — high info; K2.4 answered with 166 callsites).

## STATE FILES

- Config: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/findings-registry.json`
- Iteration narrative: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/iterations/iteration-002.md`
- Delta file: `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/009-cocoindex-memory-port-research/research/deltas/iter-002.jsonl`

## PRIOR EVIDENCE (iteration 1)

- Upstream README: CocoIndex is delta-oriented; `@coco.fn(memo=True)` cached by `hash(input) + hash(code)`.
- `memo_fingerprint.py`: Python canonicalization (dataclasses, pydantic, containers, hooks) + Rust fingerprint. Public API: `memo_fingerprint`, `fingerprint_call`.
- Our `handlers/memory-index.ts`: file-list scanning + incremental categorization via `incrementalIndex`; calls `embeddings`, `vectorIndex`, `runPostMutationHooks`. NOT a dependency DAG.

## INVESTIGATION TARGETS (this iteration)

**Cocoindex side — memoization + dependency tracking:**
1. `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/external/cocoindex-main/rust/core/src/state/db_schema.rs` — read the full state schema. What are the keys/values stored? Memoization records? Component existence tracking?
2. `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/external/cocoindex-main/rust/core/src/engine/execution.rs` — read the execution engine. How are memoized calls cached and looked up? How is dependency invalidation propagated?
3. Look for `fingerprint_simple_object` or similar Rust-side fingerprint function — Python calls into Rust for the actual hash; find the Rust entry point.

**Our side — incremental indexing details:**
4. `.opencode/skills/system-spec-kit/mcp_server/lib/search/incremental-index.ts` — read in full. How does change detection work? What's the skip-vs-reindex decision? Where is the content hash computed?
5. `.opencode/skills/system-spec-kit/mcp_server/lib/parsers/memory-parser.ts` (if exists) — how do we parse spec docs into indexable units?
6. Search for `indexSingleFile` or `indexMemory` in `lib/search/vector-index-mutations.ts` — what's the transaction boundary? Atomic per file?
7. `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` — what's the schema for `memory_index` table? Are content hashes / fingerprints stored alongside embeddings?

## ANALYSIS DELIVERABLE

Produce a **transfer assessment** with 3 buckets:

**Transfers cleanly (port these directly, principles map 1:1)**:
- Which cocoindex concepts (canonical input hashing, code-hash invalidation, value-level diff detection) work on TS+SQLite as-is?

**Transfers with adaptation (port the principle, redesign for our stack)**:
- Which concepts need adaptation? (e.g., heed KV store → SQLite tables; Rust async runtime → Node async; Python canonicalization → TS-equivalent.)
- Sketch the adapted shape.

**Does not transfer (skip, runtime-bound)**:
- Which concepts are inseparable from Rust async / PyO3 bindings / tree-sitter ops?
- What's our equivalent (or accept the gap)?

**Verdict on K1.1**: YES / YES-WITH-ADAPTATION / NO with one-paragraph justification.

If YES or YES-WITH-ADAPTATION, sketch:
- What SQLite schema additions are needed? (e.g., `memoization_records(component_path TEXT, input_fingerprint BLOB, code_hash BLOB, output_blob BLOB, computed_at INTEGER)`)
- What API surface needs to change? (e.g., `memory_index_scan` becomes DAG-aware: walks dependents on change.)
- What's the migration story for existing indexed data?

## CONSTRAINTS

- LEAF agent. No sub-agents.
- Max 12 tool calls. Target 5-7.
- Cite verbatim file:line.
- Do NOT use `$` characters in the JSONL `focus` field or any field the reducer will pipe into a string replacement — it corrupts the strategy file. Use words instead (e.g. "regex" not `^[a-z]+$`).
- Write ALL findings to files. Reducer owns strategy machine-owned sections.

## OUTPUT CONTRACT

Three artifacts (REQUIRED):

1. **`research/iterations/iteration-002.md`** — narrative with sections: Focus, Actions Taken, Findings (per the 3-bucket analysis), Verdict on K1.1, Questions Answered, Questions Remaining, Next Focus (recommend K1.2 or another axis).

2. **JSONL appended to `research/deep-research-state.jsonl`**: 
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0.4-0.8>,"status":"insight","focus":"k1-1-memoization-dag-transfer-assessment","keyQuestions":["K1.1","K1.2","K1.3","K1.4","K1.5","K1.6","K2.1","K2.2","K2.3","K2.5"],"answeredQuestions":["K1.1"|...],"durationMs":<actual>,"timestamp":"<iso>","sessionId":"027-013-cocoindex-port-2026-05-13","generation":1,"graphEvents":[...]}
```

3. **`research/deltas/iter-002.jsonl`** — iteration record + per-finding/edge records.

## STOP CONDITIONS (this iteration)

- Time: ≤ 10 min wall.
- Tool calls: ≤ 12.
- Tokens: target ≤ 35K output.

Go.
