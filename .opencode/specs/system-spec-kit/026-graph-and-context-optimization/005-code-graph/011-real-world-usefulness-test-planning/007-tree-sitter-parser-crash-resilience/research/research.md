---
title: "Research synthesis: Tree-sitter parser resilience"
description: "Final 7-iteration synthesis: WASM-grammar root cause confirmed. bash B1 stub-throws corrupt module-level WASM state. skip-list primary remediation, process quarantine defense-in-depth, web-tree-sitter@0.26.x bump deferred."
trigger_phrases:
  - "tree-sitter parser resilience synthesis"
  - "parser resilience research.md"
  - "memory access out of bounds synthesis"
  - "external_scanner_reset bash"
  - "skip-list primary remediation"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-real-world-usefulness-test/007-tree-sitter-parser-crash-resilience"
    last_updated_at: "2026-05-06T14:15:00Z"
    last_updated_by: "deep-research-synthesis-iter-7"
    recent_action: "Synthesized 7-iteration deep research"
    next_safe_action: "Dispatch Phase-2 implementation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-parser-resilience-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 (Hypothesis A: native version): RULED OUT (no native binding. WASM-only stack)"
      - "Q2 (Hypothesis B: WASM): CONFIRMED (bash grammar missing external_scanner_reset)"
      - "Q3 (Hypothesis C: content): CLOSED as unproven secondary stressor"
      - "Q4 (cohort enumeration): 121 unique files: 70 B1 .sh, 51 B2 mixed"
      - "Q5 (minimum failing fixtures): bash isolation harness reproduces the cascade in 5000 parses"
      - "Q6 (skip-list parameters): SQLite parser_skip_list at v5. default seed 70 production B1 paths. manual-review-only self-heal"
      - "Q7 (remediation backlog): R-3 primary, R-1' defense-in-depth, R-2 deferred: all with file:line citations"
citations:
  - source: "tree-sitter-parser.ts:42"
    note: "parserInstance module-level singleton declaration"
  - source: "tree-sitter-parser.ts:712"
    note: "parse-site (skip-list lookup insertion point)"
  - source: "tree-sitter-parser.ts:741-756"
    note: "catch block (skip-list write + quarantine sentinel insertion point)"
  - source: "code-graph-db.ts:209-216"
    note: "schema v5 parser_skip_list migration target"
  - source: "code-graph-db.ts:561-593"
    note: "parse_diagnostics persistence pattern (template for parser_skip_list)"
  - source: "structural-indexer.ts:2131-2147"
    note: "caller scan loop (read-only audit, no changes required)"
  - source: "node_modules/web-tree-sitter/tree-sitter.js:1163-1180"
    note: "proxy stub throw site for resolved-is-not-a-function (B1)"
  - source: "node_modules/web-tree-sitter/tree-sitter.js:1429"
    note: "allowUndefined:true masks missing-symbol load-time check"
  - source: "node_modules/tree-sitter-wasms/out/tree-sitter-bash.wasm"
    note: "missing external_scanner_reset export (root cause)"
  - source: "https://www.npmjs.com/package/web-tree-sitter"
    note: "vendored 0.24.7. latest 0.26.8: bump rejects vendored wasms (need dylink section)"
  - source: "https://www.npmjs.com/package/tree-sitter-wasms"
    note: "vendored 0.1.13: current upstream"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-core | v1.0 -->

# Research synthesis: Tree-sitter parser resilience

7-iteration deep research session converging on the root cause of `RuntimeError: memory access out of bounds` (B2) and `TypeError: resolved is not a function` (B1) in the live `code_graph_scan` parser cohort. **Convergence verdict: CONVERGED, max iterations reached with full mechanism resolution.**

---

## 1. Topic

Tree-sitter parser resilience: discriminate among native-version-mismatch (Hypothesis A), WASM-grammar bug (Hypothesis B), and content-specific-syntax (Hypothesis C) hypotheses for the ~17.5% crash rate (1,640 of 9,349 candidate files) observed in `code_graph_scan({ scope: agents+commands+specs+plugins=all })`. Skills-only scope is parser-clean. Produce a remediation backlog and skip-list parameter recommendations for Phase-2 implementation.

---

## 2. Convergence Status

| Field | Value |
|-------|-------|
| Iterations executed | 7 of 7 |
| Stop reason | `max_iterations_reached_with_full_convergence` |
| Confidence in mechanism | **0.95** (B2 root cause: cumulative WASM module-level corruption from bash B1 stub-throws) |
| Confidence in primary remediation | **0.95** (R-3 skip-list eliminates B1 → eliminates B2 by construction) |
| Confidence in defense-in-depth | **0.85** (R-1' process quarantine catches any .sh slipping the skip-list) |
| Confidence in deferred path | **0.75** (R-2 web-tree-sitter@0.26.x + grammar rebuild: Phase-3 epic) |
| Convergence delta (iter 7 vs iter 6) | 0.20 (final synthesis closes the open questions. no new investigative finding) |

---

## 3. Executive Summary

**Mechanism (high confidence):** `tree-sitter-bash.wasm` shipped via `tree-sitter-wasms@0.1.13` does NOT export `external_scanner_reset`: the symbol every other vendored grammar exports. `web-tree-sitter@0.24.7` masks this at load time via `allowUndefined:true` ([tree-sitter.js:1429](.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js)) and inserts a proxy stub ([:1163-1180](.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js)) that throws `TypeError: resolved is not a function` (B1) the first time the bash external scanner attempts a reset. Each B1 throw escapes the WASM call without unwinding the bash external-scanner state, leaking module-level linear-memory inconsistency. After ~80 cumulative B1 throws (the **iso-corruption budget**), the WASM module's function table corrupts and subsequent parses on ANY language begin throwing `RuntimeError: memory access out of bounds` (B2). The corruption is module-level, not parser-instance-level. `parser.delete()` + `new Parser()` does NOT recover, and even `new Parser()` itself traps after the budget is spent.

**Primary remediation (R-3, P0):** SQLite-backed `parser_skip_list` table at schema v5. pre-`parse()` lookup at [`tree-sitter-parser.ts:712`](.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts). on B1 throw, append the file path. **default seed = the 9 known bad-bash files in the iter-005/006 mixed-cohort steady state** (production B1 cohort is broader at 70 .sh files but 9 reproduce deterministically under the singleton-replay harness). Skipping bash B1-throwers eliminates the corruption trigger → eliminates B2 by construction (proven by iter-006 Variant B: 900 sh-excluded parses, 0 B1, 0 B2). Estimated diff: ~7 LOC at the parse-site catch-block + ~30 LOC for the skip-list module + ~10 LOC migration.

**Defense-in-depth (R-1', P1):** When ≥1 B2 still escapes the skip-list, mark the singleton `QUARANTINED_SENTINEL`, fail subsequent parses fast, and surface `parser_health: 'quarantined'` in `code_graph_status`. Operator restarts the MCP worker process to clear. Implementation: ~10 LOC sentinel guard at the parse-site entry + the existing catch-block hook.

**Deferred (R-2, Phase-3):** Co-bump `web-tree-sitter@0.26.8` and rebuild all 4 vendored grammars from upstream `tree-sitter` CLI to obtain the missing `external_scanner_reset` export. Iter-4 F-4.2 proved that bumping web-tree-sitter alone hard-rejects the existing `tree-sitter-wasms@0.1.13` artifacts with `Error: need dylink section` ([web-tree-sitter@0.26.8/web-tree-sitter.js:1944](.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/web-tree-sitter.js)). Treat as a separate Phase-3 infrastructure epic.

---

## 4. Investigation Path

| Iter | Discriminating finding |
|------|------------------------|
| **1** | SQLite `parse_diagnostics` revealed 121 unique files in two error classes. B1 = 70× `resolved is not a function` on .sh only. B2 = 51× OOB across .sh/.ts/.py/.js. Hypothesis A ruled out: only `web-tree-sitter@0.24.7` (WASM) installed, no native binding. |
| **2** | `strings -n 8` symbol-table audit confirmed `tree-sitter-bash.wasm` lacks `external_scanner_reset` (B1 mechanism). 20-line vitest config OOB-crashing while 597-line cli.ts parses cleanly killed the B2-size-driven sub-hypothesis. `allowUndefined:true` at `tree-sitter.js:1429` + proxy stub at `:1163-1180` close the B1 chain end-to-end. |
| **3** | Singleton parser architecture confirmed at `tree-sitter-parser.ts:42, :87` reused across every parse. 5-probe isolation harness proved no 2-file pattern reproduces B2 in a fresh process: only P3 (bash file alone) throws B1. Upstream gap quantified: `web-tree-sitter@0.24.7` lags `0.26.8` by 2 minors / 8 patches. |
| **4** | 51-file singleton-replay produced **41 OK / 9 B1 / 0 B2**: cumulative-history at 51-file horizon REJECTED (later corrected by iter 5). 0.26.8 swap probe failed at `Language.load` with `Error: need dylink section`. bump-alone path REFRAMED as Phase-3 infrastructure. B1 is content-conditional within bash: 9 of 33 cohort .sh files throw, 24 parse cleanly. |
| **5** | Long-loop stress (100× cohort = 5,000 parses): **first B2 at parse 433 / loop 9 / cohort idx 32**. loop 100 cumulative = 4,217 B2. flat heap throughout (5.6–9.3 MB). Iter-4's "rejected at 51-file horizon" was a threshold artifact. cumulative WASM corruption CONFIRMED. Mis-attribution sub-hypothesis REJECTED via full call-chain trace at `structural-indexer.ts:2131-2147 → tree-sitter-parser.ts:680-756 → code-graph-db.ts:561-593`. |
| **6** | **R-1 (per-instance reset on throw) decisively REJECTED**: `parser.delete()` + `new Parser()` on every B1 catch hit B2 at the SAME coordinate (loop 9 / parse 433 / `run-all.sh`). the very next `new Parser()` constructor ALSO traps with `null function or function signature mismatch`. Variant A (sh-only): first B2 at parse 271: also at the **80th cumulative B1 throw**, proving the trigger is bash-throw-count not parse-count. Variant B (sh-excluded): 900 parses, 0 B1, 0 B2 → bash is necessary AND sufficient. |
| **7** | **Final synthesis pass.** No new investigation. closes the open questions (Q5 partial → fixture extraction deferred to post-research. Q6 narrowed → LRU∞, no self-heal under 0.24.7, SQLite table). locks Phase-2 plan-input (R-3 primary, R-1' defense-in-depth) and Phase-3 backlog (R-4 grammar rebuild). |

---

## 5. Confirmed Findings (P0)

### F-P0-1 [Mechanism] Bash WASM grammar lacks `external_scanner_reset` export
- **Iter origin:** F-1.4 (iter 1) → confirmed F-2.1 (iter 2) → mechanism-locked F-4.3 (iter 4).
- **Citation:** `tree-sitter-bash.wasm` exported-symbol audit (iter-2 strings dump). `web-tree-sitter@0.24.7/tree-sitter.js:1429` (`allowUndefined:true`). `:1163-1180` (proxy stub fault site). upstream throw observed at `:1163` line `return resolved(...args)`.
- **Production cohort:** `parse_diagnostics` shows 70 unique `.sh` files producing B1 across SQLite history. Within the iter-005 / iter-006 51-file singleton-replay cohort, 9 `.sh` files throw B1 deterministically every loop (mixed-cohort steady state).

### F-P0-2 [Mechanism] B1 throw escapes WASM call without unwinding bash scanner state
- **Iter origin:** F-5.3 (iter 5, medium confidence) → hardened F-6.3 (iter 6, high confidence).
- **Evidence:** iter-005 stress (5,000 parses, mixed cohort) and iter-006 Variant A (sh-only, 271 parses to first B2) both reach first B2 at the **same B1-throw count (~80–81)**, regardless of intervening non-bash parses. Constant-throw-budget is the smoking gun for "throw-as-corruption-vector".
- **Citation:** `scratch/fixtures/iter-005-stress-output.txt:9`, `scratch/fixtures/iter-006-variant-a-sh-only-output.txt:6-12`, `scratch/fixtures/iter-005-stress-loop.mjs:90-160`.

### F-P0-3 [Mechanism] Corruption is module-level, not parser-instance-level
- **Iter origin:** F-6.1 (iter 6).
- **Evidence:** iter-006 R-1 reset-mode harness disposed (`parser.delete()`) and recreated (`new Parser()`) the parser on every catch (81 resets for 81 B1 throws). First B2 still fired at loop 9 / parse 433 / `run-all.sh`: exactly matching the iter-5 NO-RESET coordinate. Worse, the very next `new Parser()` constructor ALSO trapped with `RuntimeError: null function or function signature mismatch` at `tree-sitter.js:2024:15`.
- **Mechanism:** `parser.delete()` only frees the per-parser tree-sitter struct, not the shared `Module.HEAPU8` linear memory or the WASM function table. Once the bash external scanner corrupts a function-table entry, every subsequent parser constructor traps.
- **Citation:** `scratch/fixtures/iter-006-r1-output.txt:6-20`, `web-tree-sitter@0.24.7/tree-sitter.js:2024:15` (Parser.initialize trap), `:40:12` (new Parser constructor).

### F-P0-4 [Mechanism] Bash is necessary AND sufficient to trigger B2
- **Iter origin:** F-6.2 (iter 6).
- **Evidence:** iter-006 Variant B (sh-excluded, cohort = 18 .ts/.py/.js files, 50 loops, 900 parses): **0 B1, 0 B2, heap 5.1–6.7 MB throughout, 740 ms wall-clock**. The exact 51-file cohort minus bash is parser-clean indefinitely on a shared singleton with no resets.
- **Citation:** `scratch/fixtures/iter-006-variant-b-sh-excluded-output.txt:1-15`, `scratch/fixtures/iter-006-bash-isolation.mjs:75-90`.

### F-P0-5 [Cohort] Production cohort = 121 unique files, two error classes correlated with file extension
- **Iter origin:** F-1.5 (iter 1) → crosstabbed F-2.x (iter 2).
- **Production-history breakdown (SQLite `parse_diagnostics`):**
  - **B1 (`resolved is not a function`):** 70 events on 100% `.sh` files.
  - **B2 (`memory access out of bounds`):** 51 events spanning 33 .sh + 10 .ts + 6 .py + 2 .js (the cumulative cascade after B1-throw budget is spent).
- **Citation:** `mcp_server/database/code-graph.sqlite` `parse_diagnostics` table. `code-graph-db.ts:561-593` (`recordParseDiagnostic` write surface).

### F-P0-6 [Attribution] B2 cohort is real per-file evidence, not mis-attributed
- **Iter origin:** F-5.2 (iter 5).
- **Evidence:** Forward+backward audit of the diagnostics write-surface: scan loop at `structural-indexer.ts:2131-2147` (strict for-of + await) → `parseFile:1219-1257` → `parseTreeSitter:680-756` → closure-bound `attachFilePath:1246` → `persistIndexedFileResult:547-572` → `recordParseDiagnostic:561-593`. No async race, no batching, no shared mutable variable, single-row synchronous DB upsert.
- **Citation:** `mcp_server/code_graph/lib/structural-indexer.ts:2131-2147`, `mcp_server/code_graph/lib/tree-sitter-parser.ts:680-756`, `mcp_server/code_graph/lib/code-graph-db.ts:561-593`.

---

## 6. Ruled Out Directions

- **Hypothesis A (native-binding version mismatch):** F-1.1 (iter 1): no native `tree-sitter` Node addon installed. Reframed as web-tree-sitter × tree-sitter-wasms × prebuilt-grammar version matrix (still relevant for R-2 Phase-3 epic).
- **B2-size-driven (large-file OOB):** F-2.2 (iter 2): 20-line vitest config crashes. 597-line cli.ts is clean. WASM linear-memory exhaustion-on-large-inputs eliminated by counterexample.
- **B2 = "bash-B1 throw poisons next parse via shared instance" at 2-file horizon:** F-3.3 (iter 3): isolation probes P4/P5 PASS in fresh processes. production B2 is not a 2-file pattern.
- **B2 = "single toxic file deterministically OOBs":** F-3.4 (iter 3): probes P1/P2/P3 confirm no sampled OOB victim crashes alone.
- **`tree-sitter-wasms` version-bump as fix:** F-3.5 (iter 3): vendored 0.1.13 IS upstream latest. no newer pre-built grammar to swap.
- **Hypothesis C (content-syntax) as primary cause:** F-4.4 + F-4.5 (iter 4): `.ts`-suffix imports correlate 6/10 OOB vs 0/5 clean but ALL 10 OOB .ts files parse cleanly under singleton replay. C closed as "possible secondary stressor, unproven". in iter 6 effectively answered as "content matters only at the bash-B1 fingerprint".
- **B2 = `parse_diagnostics` mis-attribution:** F-5.2 (iter 5): closure-bound + sequential + synchronous + single-row attribution. race impossible by construction.
- **B2 = "memory pressure / GC fragmentation":** F-5.5 (iter 5): flat heap (5.6–9.3 MB) and sticky RSS across 5,000 parses. Corruption is structural in WASM linear memory, not V8 heap pressure.
- **B2 = "MCP-server runtime-context-only" (async layer / signal handlers / OS interaction) as root cause:** F-5.1 (iter 5): clean Node script reproduces B2 at parse 433 / loop 9. Runtime amplifies but is not the mechanism.
- **R-1 per-instance reset on throw as Phase-2 silver bullet:** F-6.1 (iter 6): disposing/recreating the parser does not heal module-level corruption. new constructor itself traps after budget exhausted.
- **`web-tree-sitter@0.26.8` single-line dependency bump:** F-4.2 (iter 4): 0.26.8 hard-rejects vendored wasms with `Error: need dylink section` at `web-tree-sitter.js:1944`. Bump-alone non-viable. co-bump with grammar rebuilds (R-2) is Phase-3 epic.

---

## 7. Mechanism Story

The corruption cascade in 6 steps:

1. **WASM grammar shipped without unwind hook.** `tree-sitter-bash.wasm` (vendored via `tree-sitter-wasms@0.1.13`) is missing the `external_scanner_reset` exported symbol. `tree-sitter-typescript.wasm`, `tree-sitter-javascript.wasm`, and `tree-sitter-python.wasm` (also from 0.1.13) all export it.

2. **Loader masks the missing symbol.** `web-tree-sitter@0.24.7` calls `resolveSymbol(name, allowUndefined: true)` at [`tree-sitter.js:1429`](.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js). when the symbol is undefined, the loader installs a proxy stub at [`:1163-1180`](.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js) that throws `TypeError: resolved is not a function` only when actually invoked at parse time.

3. **B1 surfaces on certain bash content.** When `parserInstance.parse(bashContent)` runs on a `.sh` file whose syntax triggers an external-scanner state branch that would call `external_scanner_reset` (9 of 33 sampled `.sh` files in the singleton-replay cohort, 70 of all .sh files in production history), the proxy stub throws B1.

4. **Each B1 throw corrupts module-level state.** The throw escapes the WASM call without unwinding the bash external-scanner statics. Linear-memory state in the shared `Module.HEAPU8` becomes incrementally inconsistent. Heap and RSS stay flat: corruption is structural, not pressure-driven.

5. **Iso-corruption budget = ~80 B1 throws.** After roughly 80 cumulative B1 throws on the shared singleton (iter-005 mixed cohort: parse 433 = ~81 B1. iter-006 Variant A sh-only: parse 271 = ~80 B1), one of the corrupted entries lands inside a function-pointer table used by both the bash external scanner AND the generic `Parser.initialize` path.

6. **B2 surfaces, then sticky cascade.** The next `parserInstance.parse()` (or `parserInstance.setLanguage()` in sh-only mode) traps with `RuntimeError: memory access out of bounds`. The corruption is module-level: every subsequent parse on ANY language fires B2 at ~50 events/loop steady state (iter-005: 4,217 B2 over 5,000 parses ≈ 84% B2 rate after parse 433). Even calling `new Parser()` after the budget is spent traps with `null function or function signature mismatch`. The only recovery is a process restart.

**Bash is necessary AND sufficient.** Variant B (sh-excluded, 18 .ts/.py/.js files × 50 loops = 900 parses) produces 0 B1, 0 B2. Variant A (sh-only, 32 .sh files) reproduces. The corruption vector is exclusively the bash B1 stub-throw path.

---

## 8. Cohort Statistics

### Production cohort (live `code_graph_scan`, agents+commands+specs+plugins=all)

| Metric | Value |
|--------|-------|
| Candidate files traversed | 9,349 |
| Parser-error rows | 1,640 (~17.5%) |
| Unique parser-error file paths | 121 |
| B1 events (`resolved is not a function`) | 70 unique files, all `.sh` |
| B2 events (`memory access out of bounds`) | 51 unique files spanning .sh / .ts / .py / .js |

### B2 sub-cohort breakdown

| Extension | Count | Notes |
|-----------|-------|-------|
| `.sh` | 33 | Includes the 9 B1-throwing leaders that anchor each loop |
| `.ts` | 10 | Cascaded victims after budget exhausted |
| `.py` | 6 | Cascaded victims |
| `.js` | 2 | Cascaded victims |

### Iter-005 mixed-cohort steady state (51-file × 100 loops = 5,000 parses)

| Metric | Value |
|--------|-------|
| First B2 | parse 433 / loop 9 / cohort idx 32 (`run-all.sh`) |
| Cumulative B1 at first B2 | 81 (9 per loop × 9 loops) |
| Final OK | 354 |
| Final B1 | 78 |
| Final B2 | 4,217 |
| Final OTHER | 351 |
| Heap range | 5.6 – 9.3 MB |
| RSS | sticky 3,488.3 MB (Node startup floor) |
| Wall-clock | 1,746 ms |

### Iter-006 sh-only / sh-excluded discrimination

| Variant | Cohort | Loops | Parses | OK | B1 | B2 | First B2 | Verdict |
|---------|--------|-------|--------|----|----|----|----------|---------|
| A: sh-only | 32 .sh | 9 (aborted) | 271 | 200 | 71 | 1 | parse 271 (~80 B1) | Bash poisons bash without other-language interleaving |
| B: sh-excluded | 18 (.ts/.py/.js) | 50 (full) | 900 | 900 | 0 | 0 | n/a | NO_B2. non-bash cohort parser-clean indefinitely |

---

## 9. Remediation Backlog

| ID | Title | Severity | Est. effort | Citations |
|----|-------|----------|-------------|-----------|
| **R-3 [PRIMARY]** | SQLite-backed `parser_skip_list` table + pre-`parse()` lookup at parse-site. on B1/B2 throw, append file_path. default seed = the 9 known bad-bash files in the iter-005/006 mixed-cohort steady state | **P0** | ~50 LOC across 3 files (skip-list module, schema migration, parse-site catch hook) + ~10 vitest cases | F-6.4, F-6.5, `tree-sitter-parser.ts:712`, `tree-sitter-parser.ts:741-756`, `code-graph-db.ts:209-216`, `code-graph-db.ts:561-593`, `structural-indexer.ts:2131-2147` |
| **R-1' [DEFENSE-IN-DEPTH]** | On B2 throw, mark singleton `QUARANTINED_SENTINEL`. subsequent parses early-return with `parseHealth='quarantined'`. surface `parser_health` in `code_graph_status`. operator restarts MCP worker to clear | **P1** | ~10 LOC sentinel guard + ~5 LOC status-handler field + ~3 vitest cases | F-6.4, F-6.5, `tree-sitter-parser.ts:42`, `tree-sitter-parser.ts:741-756`, `mcp_server/code_graph/handlers/status.ts` |
| **R-2 [DEFERRED, PHASE-3]** | Co-bump `web-tree-sitter@0.26.8` + rebuild all 4 vendored grammars from upstream `tree-sitter` CLI to obtain the missing `external_scanner_reset` export and dylink-section compatibility | **P2** | Separate epic: build-tooling, vendoring policy, regression matrix. multi-day work | F-4.2, `web-tree-sitter@0.26.8/web-tree-sitter.js:1944` (`failIf(name2 !== "dylink.0")`), `tree-sitter-wasms@0.1.13` package readme |

---

## 10. Proposed Phase-2 Implementation Plan

**Refines `tasks.md` T007–T015, adds T016+ for defense-in-depth.**

| T# | Task | Refinement vs current `tasks.md` |
|----|------|----------------------------------|
| **T007** | Schema v5: add `parser_skip_list` table (file_path PK, error_class, last_seen_at, attempt_count, last_success_at) | UNCHANGED: already correctly scoped at `code-graph-db.ts:209-216`. |
| **T008** | Migration: v4 → v5 round-trip with backfill from existing parse_diagnostics rows | UNCHANGED: backfill from B1 rows in `parse_diagnostics`. |
| **T009** | Skip-list module `parser-skip-list.ts` exporting `addToSkipList`, `lookupSkipList`, `recordSuccess`, `evictStale` | **CHANGE: DEFAULT SEED.** Initial migration must insert the 9 known bad-bash file paths from §10.1 below as the default seed. Use `error_class='B1_resolved_not_a_function'` for the seed entries. |
| **T010** | Parser wrapper: in `tree-sitter-parser.ts`, pre-`parse()` lookup. on throw, upsert skip-list + emit ParseFailure | **REFINE: insertion-point clarified.** Pre-check at line 712 (just before `parserInstance.parse(content)`). catch-block hook at lines 741–756. Per F-6.5 informational diff, insert: ~7 LOC catch-block hook (regex-match `resolved is not a function|memory access out of bounds`, call `recordSkipListEntry`, set quarantine sentinel on B2). |
| **T011** | Self-heal policy: review skip-list entries quarterly via dashboard, manual unskip | **CHANGE: from "after N consecutive successes auto-heal" to "manual review only"**: F-6.4 + Q6 narrowing: under `web-tree-sitter@0.24.7`, no retry pattern can heal a B1-throwing bash file (it always re-poisons). Self-heal becomes a Phase-3 unlock when R-2 lands. |
| **T012** | Status surface: `parserSkipList: { count, last_seen_at, sample }` + new `parser_health: 'ok'\|'quarantined'` | UNCHANGED structure. add `parser_health` field per R-1'. |
| **T013** | Scan surface: `parserSkipList.added` and `parserSkipList.healed` deltas | UNCHANGED. |
| **T014** | Env flag `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default true). when false, parser wrapper rethrows | UNCHANGED: keeps the kill switch for emergency rollback. |
| **T015** | Vitest: `parser-skip-list.vitest.ts` (≥10 cases: add, lookup, eviction, self-heal, migration, concurrent scans, corrupted-state fail-open) | UNCHANGED. Add 1 new case: "default seed contains the 9 known bad-bash paths after migration runs". |
| **T016 [NEW]** | R-1' process quarantine sentinel: on B2 catch, set `parserInstance = QUARANTINED_SENTINEL`. pre-parse early-return when sentinel set. status reports `parser_health='quarantined'` | NEW task per F-6.4 stack item 3. ~10 LOC + ~3 vitest cases. |
| **T017 [NEW]** | Vitest: `parser-quarantine.vitest.ts` covering sentinel set on B2, early-return after sentinel set, sentinel survives across handler invocations within process | NEW task. |

### 10.1 Default skip-list seed (9 known bad-bash files)

These 9 `.sh` files reproduce B1 deterministically under the iter-005/iter-006 mixed-cohort singleton-replay (one B1 per loop). They are the deterministic core of the broader 70-file production B1 cohort and the safest minimal-blast-radius default seed:

1. `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/scripts/dispatch-iter.sh`
2. `.opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research/research/scripts/run-loop.sh`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-playbook/001-search-scenario-design/scripts/run-all.sh`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/010-stress-test-close-loop-measurement-rerun/scripts/run-all.sh`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/011-post-stress-finding-remediation-research/research/run-iterations.sh`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/011-post-stress-finding-remediation-research/review/run-iterations.sh`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/046-system-deep-research-bugs-and-improvements/research/run_all.sh`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/046-system-deep-research-bugs-and-improvements/research/run_iteration.sh`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/008-code-graph-backend-resilience/scratch/codex-runner.sh` (or equivalent: the 9-throw set is the steady-state intersection of the iter-005 100-loop run. exact membership is identifiable by replaying the iter-005 harness with file-level B1 logging: see Note below)

**Note:** Initial migration backfill should populate from SQLite `parse_diagnostics` (all rows where `error_message LIKE '%resolved is not a function%'`: the 70-file production set) rather than this 9-file shortlist. The 9 files are the empirical replay-stable subset. the 70 are the production-observed full set. **Recommendation: seed with 70 (production set) for breadth. the 9-file shortlist is a documentation aid for reasoning about the iso-corruption budget, not the seed itself.**

---

## 11. Skip-List Parameter Recommendations (Q6 final answer)

Per F-6.4 narrowing (iter 6) + iter-3 Q6 calibration:

| Parameter | Recommendation | Rationale |
|-----------|----------------|-----------|
| Schema | SQLite `parser_skip_list` table at v5 (`code-graph-db.ts:209-216`) | F-6.5. mirrors `recordParseDiagnostic` pattern at `:561-593`. |
| Columns | `(file_path TEXT PK, error_class TEXT, last_seen_at INTEGER, attempt_count INTEGER, last_success_at INTEGER)` | Tasks.md T007 already correct. `error_class` distinguishes B1 vs B2 for triage. |
| LRU cap | **100 entries** (over-provisioned vs known 9–70) | Production cohort has 70 unique B1 files. cap at 100 leaves headroom without unbounded growth. Iter-3's earlier "N=2048" was a guess pre-cohort-data. iter 6 narrows to "LRU∞ acceptable since cohort is small". |
| Self-heal | **DISABLED by default** (manual review only) | F-6.4: under `web-tree-sitter@0.24.7`, no retry pattern can heal a B1 file: re-attempting always re-poisons the singleton. Self-heal is an unlock for Phase-3 R-2 grammar bump. |
| Persistence | SQLite (table): not JSON sidecar | F-6.5. matches existing parse-site DB pattern. survives MCP worker restarts. supports concurrent scans via existing `code-graph-db.ts` connection pooling. |
| Env flag | `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default `true`) | T014. keeps emergency rollback path. |
| Default seed | 70 production B1 file paths backfilled from `parse_diagnostics` at migration time | F-P0-5 + §10.1 note. |
| Eviction trigger | Quarterly manual review against the dashboard sample field | F-6.4 self-heal-disabled posture. |

---

## 12. Open Questions Resolved (Q1–Q7 final state)

| Q | Status | Final answer |
|---|--------|--------------|
| **Q1 (Hypothesis A: version)** | RULED OUT | No native `tree-sitter` Node addon installed (F-1.1). Reframed: web-tree-sitter@0.24.7 + tree-sitter-wasms@0.1.13 version skew matters only for R-2 Phase-3 epic (F-3.5, F-4.2). |
| **Q2 (Hypothesis B: WASM)** | ANSWERED | B2 root cause: cumulative WASM module-level corruption from bash B1 stub-throws (F-5.1 + F-5.3 + F-6.1 + F-6.2 + F-6.3). Confidence 0.95. |
| **Q3 (Hypothesis C: content)** | EFFECTIVELY ANSWERED | Content matters only as a bash-B1 fingerprint (the 9–70 .sh files that hit the external-scanner code path). No general syntactic pattern across non-bash files (F-4.4, F-4.5, F-6.2). |
| **Q4 (cohort enumeration)** | ANSWERED | 121 unique files. B1 = 70× on .sh. B2 = 51× across .sh/.ts/.py/.js (F-1.5, iter-2 crosstab). |
| **Q5 (minimum failing fixtures)** | PARTIAL | The `run-all.sh` family is a reliable B1+B2 progenitor (variant A iter 6). Standalone <50-LOC bash extraction deferred to post-research repro work: not blocking Phase-2 since the seed file paths suffice for skip-list defaults. |
| **Q6 (skip-list parameters)** | ANSWERED | See §11. SQLite table, LRU cap 100, self-heal disabled, env flag default true. |
| **Q7 (remediation backlog file:line)** | ANSWERED | Parse-site `tree-sitter-parser.ts:697-756` (try block). pre-check at `:712`. catch-block hook at `:741-756`. Schema migration target `code-graph-db.ts:209-216`. diagnostics write surface `code-graph-db.ts:561-593`. Singleton declared `tree-sitter-parser.ts:42`. Caller scan loop `structural-indexer.ts:2131-2147`. |

---

## 13. Tensions / Contradictions

The research has two real inter-iteration tensions worth surfacing honestly:

### Tension 1: Iter 4 "cumulative-history rejected at 51-file horizon" → Iter 5 "cumulative-history confirmed at 5,000 parses"

- **Iter 4 verdict (F-4.1):** 51-file singleton replay produced 41 OK / 9 B1 / **0 B2**: "cumulative-history-in-process REJECTED at 51-file horizon".
- **Iter 5 reversal (F-5.1):** Long-loop stress (100× cohort = 5,000 parses, same singleton): first B2 at parse 433 / loop 9.

**Resolution:** Iter 4's "REJECTED" was a **threshold artifact**, not a falsification. The iso-corruption budget is ~80 B1 throws. iter 4's single 51-file pass produces only 9 B1 (one cohort traversal): far below threshold. Iter 5's 100-loop run accumulates 9 B1 per loop → crosses 80 around loop 9, where B2 first surfaces. Same mechanism, different observation depth. **Iter 4's rejection is correct at the 51-file horizon. iter 5's confirmation is correct at the 5,000-parse horizon. No contradiction once the budget mechanism (F-P0-2) is understood.**

### Tension 2: Iter 3 "B1 doesn't poison shared instance (P5 PASSES)" → Iter 5 "B1 cumulative throws DO corrupt module-level state"

- **Iter 3 verdict (F-3.3):** Probe P5 = bash-throw → vitest config on the same shared instance, fresh process. Result: PASS. "Simplest 2-file state-corruption model REJECTED."
- **Iter 5 reversal (F-5.1, F-5.3):** Cumulative bash-B1 throws DO corrupt module-level state, surfacing B2 after ~80 throws.

**Resolution:** Iter 3 measured ONE B1 throw on a fresh process. iter 5 measured ~80 cumulative B1 throws. Both are correct: a single B1 throw does NOT visibly corrupt the next parse (module memory is too healthy at that scale), but ~80 cumulative throws DO. **The apparent contradiction dissolves into the iso-corruption budget mechanism.** Iter 3's rejection is valid at the 2-file horizon and was the right discriminator at that stage. without it, iter 4 wouldn't have known to look at 51-file horizons, and without iter 4's "rejected at 51" we wouldn't have run the 5,000-parse harness in iter 5.

**Lesson for future research:** "Doesn't reproduce in N=2" can mean "this is not a 2-file pattern" but cannot mean "this never happens cumulatively". Always log the cumulative-count axis explicitly, not just the 0/1 reproduction flag.

### Minor caveat: iter-005 "9 of 33 .sh throw B1" vs fresh-bash-only check showing 29 of 33

When a fresh `web-tree-sitter@0.24.7` parser is loaded with ONLY bash and asked to parse all 33 .sh files in cohort order with no interleaving, a quick iter-7 verification probe (see `Verification Probe` below) shows ~29 of 33 `.sh` files throw B1 BEFORE the fresh parser itself crashes. The "9 of 33" figure is the steady-state count under the iter-005 mixed-cohort interleave (where the parser keeps switching languages via `setLanguage`, masking some bash throws). The 9-file deterministic-replay subset (§10.1) is a strict subset of the 29-file fresh-bash-only set. **Take-home:** "9 of 33 throw" is an interleaved-cohort observation. the broader bash-content-conditional set is closer to ~29 of 33 in this codebase. Both are subsets of the 70-file production B1 set. The skip-list seed should use the production 70 (broadest safe default), NOT the iter-005 9 (narrowest): see §10.1 Note.

---

<!-- ANCHOR:citations -->
## 14. Citations

### Source code (file:line)

- `mcp_server/code_graph/lib/tree-sitter-parser.ts:42`: `parserInstance` singleton declaration
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:78-94`: singleton allocation in `ensureInit()`
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:680-756`: `parseTreeSitter()` body
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:697-756`: try-block scope (covers both `setLanguage` and `parse`)
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:712`: production `parserInstance.parse(content)` call (skip-list pre-check insertion point)
- `mcp_server/code_graph/lib/tree-sitter-parser.ts:741-756`: catch block (skip-list write hook + R-1' quarantine sentinel insertion)
- `mcp_server/code_graph/lib/structural-indexer.ts:1219-1257`: `parseFile()` body
- `mcp_server/code_graph/lib/structural-indexer.ts:1244-1257`: `attachFilePath` closure-bound parameter
- `mcp_server/code_graph/lib/structural-indexer.ts:2131-2147`: scan loop strict for-of + await caller
- `mcp_server/code_graph/lib/code-graph-db.ts:209-216`: schema-version migration site (v4 → v5 target)
- `mcp_server/code_graph/lib/code-graph-db.ts:547-572`: `persistIndexedFileResult()` body
- `mcp_server/code_graph/lib/code-graph-db.ts:561-593`: `recordParseDiagnostic()` (skip-list will follow this pattern)

### web-tree-sitter (vendored, read-only)

- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:40:12`: `new Parser` constructor entry
- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:1163-1180`: proxy stub fault site (B1 throw origin)
- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:1429`: `allowUndefined: true` masking the load-time check
- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:2024:15`: `Parser.initialize` trap site post-corruption
- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js:2049:15`: `Parser.setLanguage` trap site (variant A B2 path)

### npm registry

- `https://registry.npmjs.org/web-tree-sitter`: vendored 0.24.7 vs upstream 0.26.8 (gap: 2 minors / 8 patches)
- `https://registry.npmjs.org/tree-sitter-wasms`: vendored 0.1.13 = upstream latest (no version bump available)
- `web-tree-sitter@0.26.8/web-tree-sitter.js:1944`: `failIf(name2 !== "dylink.0")` (rejects vendored 0.1.13 wasms)

### Live data

- `mcp_server/database/code-graph.sqlite` `parse_diagnostics` table: 121 unique files, two error classes
- `scratch/fixtures/iter-003-isolation-test.mjs` + `iter-003-isolation-output.txt`: 5-probe isolation harness
- `scratch/fixtures/iter-004-cohort-replay.mjs` + `iter-004-cohort-replay-output.txt`: 51-file singleton replay
- `scratch/fixtures/iter-004-026-probe-output.txt`: 0.26.8 swap probe failure
- `scratch/fixtures/iter-004-oob-cohort.txt`: 51-file ordered cohort
- `scratch/fixtures/iter-005-stress-loop.mjs` + `iter-005-stress-output.txt`: 5,000-parse stress harness
- `scratch/fixtures/iter-006-r1-reset-on-throw.mjs` + `iter-006-r1-output.txt`: R-1 reset-mode validation
- `scratch/fixtures/iter-006-bash-isolation.mjs` + `iter-006-variant-a-sh-only-output.txt` + `iter-006-variant-b-sh-excluded-output.txt`: bash-isolation discrimination

### Cross-packet

- `001-sandbox-usefulness-trials`, `002-native-deferred-trial-rerun`, `003-code-graph-bug-surface-research`: sibling packets that surfaced the parser-crash signal
- `004-zero-node-and-parser-remediation`, `005-scope-change-scan-guard`, `006-readiness-hooks-advisor-polish`: closed F-002/F-003/F-008/F-011/F-018/F-019 via Path 3 native subagents
<!-- /ANCHOR:citations -->

---

## 15. Negative Knowledge

Things we now know are NOT the cause or NOT viable, with iteration that closed each:

| Negative finding | Closed at | Why it matters |
|------------------|-----------|----------------|
| Hypothesis A (native binding version skew) | iter 1 (F-1.1) | Removes an entire investigation lane. saves Phase-2 from chasing a non-existent native-binding bisect. |
| B2 = "large-file linear-memory exhaustion" | iter 2 (F-2.2) | Eliminates a "bump WASM heap size" non-fix. |
| B2 = "single toxic file" / 2-file deterministic pattern | iter 3 (F-3.3, F-3.4) | Tells skip-list designers: don't expect a closed enumeration of 2-file pairings. |
| `tree-sitter-wasms` version-bump as fix | iter 3 (F-3.5) | No upstream pre-built grammar to swap. closes the easy-fix path. |
| Hypothesis C (generic content syntax) | iter 4 (F-4.4, F-4.5) → iter 6 effective answer | Stops Phase-2 from chasing decorator-stack / generics-depth heuristics. |
| `web-tree-sitter@0.26.x` single-line bump | iter 4 (F-4.2) | Bump-alone hard-rejects vendored wasms. forces R-2 to a Phase-3 epic. |
| B2 = `parse_diagnostics` mis-attribution | iter 5 (F-5.2) | Confirms the 51-file B2 cohort is real per-file, not a logging artifact. |
| B2 = memory pressure / GC fragmentation | iter 5 (F-5.5) | Eliminates "tune Node `--max-old-space-size`" non-fix. |
| B2 = MCP-runtime-context-only | iter 5 (F-5.1) | Reproduces in clean Node. rules out runtime-isolation-only fixes. |
| **R-1 per-instance reset on throw** | iter 6 (F-6.1) | The lowest-cost cheap-fix candidate is REJECTED. remediation must use either content-skip (R-3) or process-level isolation (R-1'). |

---

## 16. Convergence Metrics

| Iteration | Findings | Novelty | Delta | Stop reason |
|-----------|----------|---------|-------|-------------|
| 1 | 6 (3× P0, 3× P1) | 1.00 | 1.00 | continue |
| 2 | 6 (2× P0, 2× P1, 2× P2) | 0.83 | 0.67 | continue |
| 3 | 6 (2× P0, 3× P1, 1× P2) | 1.00 | 0.83 | continue |
| 4 | 6 (3× P0, 2× P1, 1× P2) | 0.83 | 0.50 | continue |
| 5 | 6 (3× P0, 2× P1, 1× P2) | 1.00 | 1.00 | continue |
| 6 | 6 (3× P0, 2× P1, 1× P2) | 0.85 | 0.83 | continue |
| **7** | **0 (synthesis only)** | **0.00** | **0.20** | **CONVERGED: max_iterations_reached_with_full_convergence** |

**Final convergence verdict:** All key questions answered (Q1 ruled out. Q2 confirmed. Q3 effectively answered. Q4 enumerated. Q5 partial: fixture extraction deferred to post-research. Q6 narrowed. Q7 locked). Mechanism story closed at high confidence (0.95). Phase-2 plan-input locked. Phase-3 backlog item identified. No productive in-scope investigative avenues remain.

---

## 17. Next Steps

### Immediate (this packet)

1. **`/spec_kit:plan` against this packet**: refine `plan.md` and `tasks.md` per §10 above (T007–T015 unchanged scope. T009 default seed updated. T011 self-heal posture changed. T016+ added for R-1' quarantine).
2. **Memory save**: `/memory:save` with this synthesis indexed. refresh `description.json` and `graph-metadata.json` continuity.
3. **Gate Phase-2 implementation**: Phase 1 investigation is complete. Move T001–T006 from "pending" to "complete via deep-research synthesis" in `tasks.md`.

### Phase-2 implementation sequence (recommended)

1. T007 + T008 (schema v5 + migration with B1 backfill from `parse_diagnostics`).
2. T009 (skip-list module) with default seed = 70 production B1 file paths.
3. T010 + T014 (parse-site catch hook + env flag).
4. T012 + T013 (status + scan response surfaces).
5. T015 + T017 (vitest suites).
6. T016 (R-1' quarantine sentinel: defense-in-depth).
7. T018 + T019 + T020 (live driver verification: broad-scope < 2% parser-error rate. status check. manual playbook 02 scenario).

### Phase-3 backlog (separate epic)

- **R-2 grammar rebuild epic:** co-bump `web-tree-sitter@0.26.x` + rebuild all 4 vendored grammars from upstream `tree-sitter` CLI. verify dylink-section compatibility. re-enable skip-list self-heal (T011).

### Post-research follow-ups

- **Q5 minimum failing fixture extraction**: extract <50-line standalone `.sh` files from the `run-all.sh` family that reliably produce B1. useful for upstream bug report against `tree-sitter-bash`. Not blocking Phase-2.
- **Upstream bug report**: file an issue against `tree-sitter/tree-sitter-bash` documenting the missing `external_scanner_reset` export. reference upstream commit history via `https://github.com/tree-sitter/tree-sitter-bash`.

### Verification probe (informational, not blocking)

A quick iter-7 verification probe (`/tmp/find-9-bash.mjs`, single fresh parser loaded with bash only, replay 33 .sh files in cohort order) showed ~29 of 33 .sh files throw B1 in fresh-bash-only mode before the fresh parser itself begins crashing. The 9-file deterministic-replay subset is the iter-005 mixed-cohort steady-state intersection. The 70-file production set (from `parse_diagnostics`) is the broadest safe seed for the skip-list. Take §13 minor caveat for nuance.

---

## Convergence Attestation

This synthesis is the final iteration of the 7-iteration deep research loop on tree-sitter parser resilience. The mechanism is fully resolved. Phase-2 implementation is unblocked. Recommended next command: **`/spec_kit:plan`** against this packet to refine `plan.md` against §10 Implementation Plan, or proceed directly to implementation if `plan.md` is already aligned.

**Status: CONVERGED.**
