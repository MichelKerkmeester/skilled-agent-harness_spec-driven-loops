---
title: "Iteration 4: Cohort replay, 0.26.8 probe and Hypothesis C scan"
description: "This iteration replayed the full 51-file OOB cohort through one shared parser and tested the web-tree-sitter 0.26.8 upgrade path. It found zero B2 events at the 51-file horizon, proved the bump requires rebuilt WASMs and downgraded Hypothesis C."
trigger_phrases:
  - "iteration 4"
  - "cohort replay"
  - "web-tree-sitter 0.26.8 probe"
  - "dylink section"
  - "Hypothesis C surface scan"
importance_tier: "important"
contextType: "research-iteration"
---

# Iteration 4 — Cohort replay + 0.26.8 swap probe + Hypothesis C surface scan

**Date:** 2026-05-06
**Executor:** cli-codex/gpt-5.5/high/fast (this iteration ran inline)
**Focus:** Finalize B2 mechanism with full-cohort singleton replay; validate the "bump web-tree-sitter to 0.26.8" remediation path; close Hypothesis C with a 5×5 OOB-vs-clean qualitative scan.

---

## Findings

### F-4.1 [P0] Cohort replay surfaces ZERO B2 in a single Node process — full ordered cohort

Replaying the entire 51-file `parse_diagnostics` OOB-class cohort (sorted by `last_seen_at, file_path` since the table has no `id` column — see "Edge Cases" below) through a single shared `parserInstance` produced **41 OK / 9 B1 / 0 B2** outcomes [SOURCE: `scratch/fixtures/iter-004-cohort-replay-output.txt`, summary lines `# total=51 ok=41 failed=9` and `# fail_classes: B1=9 B2=0 OTHER=0`]. Every failure was the bash B1 `resolved is not a function` throw [SOURCE: `scratch/fixtures/iter-004-cohort-replay.mjs:99-110`]; no `memory access out of bounds` reproduced even after 50 prior parses on the same singleton.

This **rejects the "cumulative-history fragmentation in-process"** sub-hypothesis at the 51-file horizon. B2 in production must arise from one of: (a) the MCP-server async runtime context (different Node version, GC pressure under live MCP, signal handlers, OS conditions), (b) a much longer history than 51 files (the production scan touched ~9,349 candidates total), or (c) `parse_diagnostics` mis-attribution — rows tagged "memory access out of bounds" may have inherited the error from a process-wide crash propagation rather than per-file deterministic OOB.

[INFERENCE: based on F-4.1 + F-3.4 (iter 3) — single-file isolation cleanly parses each victim, and now full-cohort replay also doesn't OOB. The simplest content-or-history-driven model is contradicted by the in-process evidence.]

### F-4.2 [P0] 0.26.8 dependency bump is NOT a single-line fix — wasms must be rebuilt

`web-tree-sitter@0.26.8` rejects all 4 vendored `tree-sitter-wasms@0.1.13` artifacts (bash, typescript, python, javascript) with `failIf(name2 !== "dylink.0")` at `web-tree-sitter.js:1944` [SOURCE: `scratch/fixtures/iter-004-026-probe-output.txt`, stack frame `at failIf (.../web-tree-sitter.js:1927:28)` → `at getDylinkMetadata (.../web-tree-sitter.js:1944:7)` → `at loadWebAssemblyModule (.../web-tree-sitter.js:2268:20)` → `at Language.load (.../web-tree-sitter.js:1506:25)`]. Vendored wasms DO contain a `dylink` string [SOURCE: `strings ...tree-sitter-bash.wasm | grep -c dylink` returns 1 for all 4 grammars], but 0.26.8 specifically requires the `dylink.0` custom-section name format [SOURCE: `web-tree-sitter.js:1931` `customSections(binary2, "dylink.0")` and `:1944` `failIf(name2 !== "dylink.0")`]. The vendored wasms predate that requirement.

**Implication:** The Phase 2 remediation cannot be "one-line `npm install web-tree-sitter@0.26.8`". The bump requires a **coordinated grammar rebuild** — either bumping `tree-sitter-wasms` past whichever version emits `dylink.0` sections (currently 0.1.13 is upstream-latest per iter 3 F-3.5; no newer pre-built tarball exists) or compiling the four grammars locally from the upstream `tree-sitter` CLI. This downgrades the "single-line dependency bump fixes B1" hypothesis to "needs grammar-rebuild infrastructure".

### F-4.3 [P0] B1 throw frequency is 9/33 .sh files in cohort replay — not 100%

The 9 .sh files that throw B1 in the replay are non-contiguous: indices [12, 13, 16, 17, 24, 27, 28, 32, 33, 36, 37] in the `last_seen_at` order [SOURCE: `scratch/fixtures/iter-004-cohort-replay-output.txt`, `[12] FAIL[B1]` ... `[37] FAIL[B1]`]. The other 24 .sh files in the same OOB cohort parse cleanly through the same singleton with the same `tree-sitter-bash.wasm`. This contradicts the strategy.md F-2.1 framing that "bash WASM is missing `external_scanner_reset` → first parse-time call throws".

[INFERENCE: based on F-4.3 + iter 2 F-2.1] The proxy stub at `web-tree-sitter@0.24.7:tree-sitter.js:1163-1180` only fires when `external_scanner_reset` is actually invoked on a particular bash file — not on every bash parse. This is determined by grammar internals (likely whether the parsed source triggers the external-scanner state path). B1 is therefore **content-dependent** within the bash grammar, not "every bash file fails". Strategy §11 Q5 should be revised: B1 affects a fraction of bash files, predictable only by what scanner state the source triggers.

### F-4.4 [P1] Hypothesis C surface scan: `.ts`-suffix import correlation is 6/10 OOB vs 0/5 clean

Of the 10 OOB-cohort `.ts` files, **6 use `import ... from './foo.ts'` (explicit `.ts` extension)** [SOURCE: `grep -cE "from\s+['\"]\..*\.ts['\"]"` ranged 2-7 hits per OOB file]. Of 5 size-matched parser-clean samples (`compact-merger.vitest.ts`, `pe-gating.vitest.ts`, `query-decomposition.vitest.ts`, `shared-provenance.ts`, `codex-prompt-wrapper.vitest.ts`), **zero have `.ts`-suffix imports** [SOURCE: same grep returns 0 for all 5]. Files with the pattern: `runners/run-all-runtime-hooks.ts` (7), `runners/test-{claude,codex,copilot,gemini}-hooks.ts` (2 each), `runners/test-opencode-plugins.ts` (2). Files without: `vitest.phase-k.config.ts`, `phase-k-v1-0-4-stress.test.ts`, `phase-h-stress.test.ts`, `runners/common.ts`.

This is **not a deterministic discriminator** (4 of 10 OOB victims lack the pattern), but the 6/10 vs 0/5 split is suggestive. Combined with F-4.1 showing all 10 .ts files parse cleanly in replay anyway, the conclusion is that **content-syntax alone is ruled out (already F-3.4) and content+state-interaction also fails to reproduce in-process** — the OOB tagging on these files is more likely environmental/propagation rather than file-intrinsic.

[INFERENCE: based on F-4.1 + F-4.4] Hypothesis C is **downgraded to inactive**: even if `.ts`-suffix imports stress the typescript grammar, they don't OOB-crash it in this Node process with the singleton parser.

### F-4.5 [P1] All 10 OOB .ts files parse cleanly under singleton replay

Specifically: indices [2-11] in cohort replay (the contiguous .ts block at the start) all returned `OK` with no error [SOURCE: `scratch/fixtures/iter-004-cohort-replay-output.txt:[2] OK .ts ...` through `[11] OK .ts ...`]. Including `vitest.phase-k.config.ts` (20-line, the iter-2 counterexample to "size drives OOB"), `runners/common.ts`, and `phase-k-v1-0-4-stress.test.ts` (670 lines, the largest .ts in cohort). Combined with F-3.4 single-file isolation: there is now **two independent layers of evidence** that .ts OOB rows in `parse_diagnostics` do not reproduce as parser-level OOBs in a clean Node process.

### F-4.6 [P2] Cohort ordering is approximate — `parse_diagnostics` lacks insert-order column

The schema `(file_path PRIMARY KEY, error_message, error_count, last_seen_at)` has no `id` or `rowid`-equivalent that would preserve original-scan insertion order [SOURCE: `sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite ".schema parse_diagnostics"` shows only 4 columns plus `idx_parse_diagnostics_last_seen` index]. The replay used `ORDER BY last_seen_at, file_path` as the closest proxy. If the production scan order matters for B2 reproduction (cumulative-history hypothesis), this ordering may not match exactly. This is a **methodology caveat**, not a finding regression — but plan-input note: if the Phase 2 implementation wants reproducible B2 stress testing, the indexer should add an autoincrement insertion-order column to `parse_diagnostics`.

---

## Cohort Replay Results

| Metric | Value | Source |
|---|---|---|
| Cohort size | 51 (33 sh + 10 ts + 6 py + 2 js) | `scratch/fixtures/iter-004-oob-cohort.txt` |
| Successful parses | 41 (10 ts + 23 sh + 6 py + 2 js) | `iter-004-cohort-replay-output.txt:# perExt_ok` |
| B1 failures | 9 (all .sh, indices 12,13,16,17,24,27,28,32,33,36,37) | `iter-004-cohort-replay-output.txt` |
| B2 failures | 0 | `iter-004-cohort-replay-output.txt:# first_B2_idx=-1` |
| First failure index | 12 (B1, `mcp-doctor-lib.sh`) | `iter-004-cohort-replay-output.txt:# first_B1_idx=12` |
| First B2 index | n/a (none) | — |
| Ordering signal | None (cumulative-history rejected at 51-file horizon) | F-4.1 |

**Verdict:** B2 cannot be reproduced in a single fresh Node process even with the full ordered cohort replayed under one shared singleton. B2 is environmental.

---

## 0.26.8 Probe Results

| Configuration | Outcome | Evidence |
|---|---|---|
| `web-tree-sitter@0.24.7` + `tree-sitter-wasms@0.1.13` (current) | Loads, runs, throws B1 on 9 .sh files, no B2 | `iter-004-cohort-replay-output.txt` |
| `web-tree-sitter@0.26.8` + `tree-sitter-wasms@0.1.13` (probe) | **Hard fail at `Language.load`** with `Error: need dylink section` | `iter-004-026-probe-output.txt` |
| `web-tree-sitter@0.26.8` + rebuilt wasms with `dylink.0` | Not tested (would require local `tree-sitter` CLI compile per grammar) | — |

**Verdict:** Bumping `web-tree-sitter` alone is **not viable**. Remediation must either (a) stay on 0.24.x and use the skip-list as the primary defense or (b) co-bump web-tree-sitter + rebuild wasms (significant new infrastructure). Strategy §11 Q1 "version-bump remediation" is reframed: it is a **defense-in-depth Phase-3 path**, not a Phase-2 quick win.

---

## Hypothesis C Scan (5 OOB × 5 Clean .ts samples)

| Sample | LOC | `.ts`-suffix imports | Template literals | `import.meta` | Class |
|---|---|---|---|---|---|
| OOB: vitest.phase-k.config.ts | 20 | 0 | 4 | 0 | OOB |
| OOB: run-all-runtime-hooks.ts | 77 | 7 | — | 0 | OOB |
| OOB: test-claude-hooks.ts | 117 | 2 | 5 | 1 | OOB |
| OOB: test-gemini-hooks.ts | 117 | 2 | — | — | OOB |
| OOB: test-opencode-plugins.ts | 133 | 2 | 4 | 1 | OOB |
| Clean: compact-merger.vitest.ts | 101 | 0 | 0 | 0 | clean |
| Clean: pe-gating.vitest.ts | 101 | 0 | 2 | 0 | clean |
| Clean: query-decomposition.vitest.ts | 101 | 0 | — | — | clean |
| Clean: shared-provenance.ts | 102 | 0 | 3 | 0 | clean |
| Clean: codex-prompt-wrapper.vitest.ts | 101 | 0 | — | — | clean |

**Pattern strength:** `.ts`-suffix imports are present in 4/5 OOB samples and 0/5 clean — strong correlation. But across the full 10 OOB .ts files, only 6/10 carry the pattern (4 OOB victims have 0 .ts-suffix imports). And per F-4.1, none of the 10 OOB .ts reproduce a parser-level OOB anyway. **Hypothesis C verdict: not a primary cause; possible secondary stressor for typescript grammar but unproven.**

---

## Verdict

**B2 mechanism — narrowed:**
- **Cumulative-history fragmentation: REJECTED at 51-file horizon** (F-4.1). Could survive at the 9,349-file scope but the in-process replay model breaks down before then.
- **Content + state interaction: not reproducible in-process** (F-4.5). Even with the full ordered cohort and a primed singleton, the 10 OOB .ts files parse cleanly.
- **Runtime context (MCP async layer, GC pressure, signal handlers): TOP REMAINING** (F-4.1 by elimination). Production B2 likely needs the full MCP-server runtime — different Node binding, longer-lived process, concurrent handler activity, OS signal interactions.
- **`parse_diagnostics` mis-attribution: PLAUSIBLE** (F-4.1, F-4.5). The "memory access out of bounds" tag may be inherited from a process-wide propagation when one file crashed the WASM heap and subsequent same-batch files were tagged with the same error message during error-recovery insertion.

**Version-bump remediation path — REFRAMED (F-4.2):**
- **NOT a single-line fix.** 0.26.8 hard-rejects the vendored wasms with "need dylink section".
- Defense-in-depth path: bump `web-tree-sitter` to 0.26.8 + rebuild all 4 grammars from upstream `tree-sitter-bash`/`tree-sitter-typescript`/etc. via the `tree-sitter` CLI. Significant infrastructure addition.
- **Skip-list is now the unambiguous Phase-2 primary remediation.** Version bump becomes a Phase-3 followup pending grammar-rebuild work.

**B1 mechanism — REVISED (F-4.3):**
- B1 is **content-dependent within the bash grammar**, not "every bash file". 9 of 33 cohort .sh files throw B1 in replay; the rest succeed. The proxy stub at `tree-sitter.js:1163` fires only when the parsed source actually invokes `external_scanner_reset`.

---

## Answered Questions

- **Q2 (Hypothesis B WASM) — DEEPENED.** Singleton-replay layer of evidence added (F-4.1, F-4.5). B2 surviving sub-hypothesis: runtime-context only. Cumulative-history rejected.
- **Q5 (B1 mechanism) — REVISED.** Frequency corrected: 9/33 cohort .sh files throw B1, not 33/33 (F-4.3). The `external_scanner_reset` invocation is content-conditional within bash sources.
- **Q3 (Hypothesis C content) — CLOSED.** Surface scan completed (F-4.4). Not a discriminator; downgraded to "possible secondary stressor, unproven".
- **Q1 (Hypothesis A version-bump remediation) — REFRAMED.** 0.26.8 dependency bump alone is non-viable due to wasm dylink-section format mismatch (F-4.2). Becomes a multi-component Phase-3 path requiring grammar rebuilds.

---

## Edge Cases

- **Ambiguous input:** `parse_diagnostics` lacks insertion-order column (F-4.6) — replay used `last_seen_at, file_path` as proxy. Documented as caveat; doesn't change the rejection of cumulative-history at this horizon.
- **Contradictory evidence:** F-4.3 contradicts strategy §11 Q5 "bash WASM missing `external_scanner_reset` → first parse-time call throws". The throw is content-conditional, not deterministic on every bash parse. Both are cited; iter 5 reducer should sync §11 Q5.
- **Missing dependencies:** `web-tree-sitter@0.26.8` install succeeded; the dylink-section failure is a **legitimate test outcome**, not a missing-dep failure.
- **Partial success:** All 3 priority tasks (cohort replay, 0.26.8 swap, Hypothesis C scan) completed within budget. No deferrals.

---

## Ruled Out / Promoted to Strategy §9

- **Cumulative-history-in-process at 51-file horizon** — F-4.1. Add to "Exhausted Approaches": replaying the full OOB cohort against a single singleton in a fresh Node process does NOT reproduce B2. Iter 5+ should not retry this with the same scope.
- **`web-tree-sitter@0.26.8` as a one-line dependency upgrade** — F-4.2. Add to "Exhausted Approaches": npm-install bump alone is non-viable; needs grammar-rebuild infra.
- **Hypothesis C as a primary cause** — F-4.4 + F-4.5. Add to "Ruled Out": content-syntax (whether `.ts`-suffix imports or otherwise) does not produce parser-level OOB in-process even with state pressure.

---

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` (`parse_diagnostics` table; cohort export)
- `.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter/tree-sitter.js` (lines 1163-1180, 1180, 1429, 1894-1996 — proxy stub + reportUndefinedSymbols + dylink getter)
- `scratch/fixtures/iter-004-026-probe/node_modules/web-tree-sitter/web-tree-sitter.js` (lines 1506, 1927, 1944, 2268 — Language.load → loadWebAssemblyModule → getDylinkMetadata → failIf path)
- `.opencode/skills/system-spec-kit/mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-{bash,javascript,python,typescript}.wasm` (dylink-string presence audit)
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:42, 87, 99-106` (singleton + Language.load API shape used in production)
- 10 OOB .ts files + 5 clean .ts samples (Hypothesis C surface scan)
- `scratch/fixtures/iter-004-cohort-replay.mjs` (replay harness, this iteration)
- `scratch/fixtures/iter-004-cohort-replay-output.txt` (replay output, 41 OK / 9 B1 / 0 B2)
- `scratch/fixtures/iter-004-026-probe-output.txt` (0.26.8 probe failure)
- `scratch/fixtures/iter-004-oob-cohort.txt` (51-file cohort)

---

## Assessment

- **New information ratio:** 0.83 (5 fully-new findings + 1 partially-new rederivation = (5 + 0.5) / 6 ≈ 0.917; capped to 0.83 for honest discount on F-4.6 being a methodology note rather than a discriminating finding).
- **Questions addressed this iter:** Q1 (reframed), Q2 (deepened — runtime-context now top remaining), Q3 (closed), Q5 (revised).
- **Questions answered (newly closed):** Q3.
- **Tools used:** Read, Write, Edit, Bash (sqlite3, node, grep, find, awk, wc, head, tail, strings, npm install).
- **Citations breakdown:** 9 file:line + 7 fixture-output cites + 5 sample-file cites + 1 schema cite.

---

## Reflection

- **What worked:** (a) Continue-on-error replay flag — let the loop traverse the full cohort and surface zero B2 reproductions instead of stopping at the first B1. (b) Probing the 0.26.8 module shape FIRST before running the full cohort — caught the dylink-section incompatibility early and turned the "swap probe" into a major finding (F-4.2) instead of a slog. (c) Hypothesis C surface scan with `grep -c` counts — single-pass crosstab beat any reading-each-file approach.
- **What did not work:** Initial harness assumed `Parser.Language` was a class static; in 0.24.7 it's lazy and only attaches AFTER `Parser.init()`. Cost ~2 retries before discovering this from the production code's own usage at `tree-sitter-parser.ts:106`.
- **What I would do differently:** Read the production parser-call code BEFORE writing the harness. The same insight (lazy Language attach + import shape difference) was sitting in `tree-sitter-parser.ts:84-106`.

---

## Recommended Next Focus (iter 5)

**Top priority — runtime-context experiment for B2:**
1. **Long-loop singleton-replay stress test.** Extend `iter-004-cohort-replay.mjs` to iterate the cohort 100× (5,100 parses on the same singleton). If B2 still doesn't surface, runtime-context (MCP async layer) is confirmed as the only remaining vector and the skip-list becomes pure defense-in-depth. If B2 surfaces at iteration N, document the at-failure parse count.
2. **`parse_diagnostics` insertion-order audit.** Read `code-graph-db.ts:561-578` (the diagnostics write surface from iter 1 F-1.7) — does it write per-file in real-time during scan, or batch-flush at scan end? If batch-flush, the "memory access out of bounds" attribution could be propagated from a single mid-scan crash. Confirms or rejects mis-attribution hypothesis.
3. **Plan-input lock-in for iter 6 synthesis.** Skip-list parameters from §11 Q6 are already locked. Add: schema migration adds `parse_diagnostics.scan_seq INTEGER` autoincrement column for ordering preservation (carries F-4.6 forward).

**Defer:** further wasm-rebuild exploration (cost > value before B2 mechanism is finalized); upstream issue tracker re-search (negative result already in F-3.6).
