---
title: "Deep Research Strategy: Tree-sitter parser resilience"
description: "Persistent brain for the parser-resilience research session. Tracks key questions, hypotheses, evidence, and next focus across 7 iterations."
trigger_phrases:
  - "tree-sitter parser strategy"
  - "parser resilience research"
  - "memory access out of bounds"
importance_tier: "important"
contextType: "research"
---

# Deep Research Strategy: Tree-sitter parser resilience

Persistent brain for the parser-resilience research session. The reducer rewrites machine-owned sections after each iteration. analyst-owned sections (Topic, Key Questions, Non-Goals, Stop Conditions, Known Context) remain stable.

---

## 1. OVERVIEW

### Purpose
Discriminate among three hypotheses for the tree-sitter parser memory-access-out-of-bounds crash cohort surfaced during live testing of the post-F-002/F-003/F-018/F-019 code graph. Live `code_graph_scan({ scope: agents+commands+specs+plugins=all })` crashed the parser on ~1,640 of 9,349 candidate files (~17.5%). Skills-only scope is parser-clean.

### Usage
- Each iteration's `@deep-research` agent reads Section 16 (Next Focus), writes evidence to `research/iterations/iteration-NNN.md`, and the reducer refreshes machine-owned sections.

---

## 2. TOPIC
Tree-sitter parser resilience: discriminate among native-version-mismatch, WASM-grammar-bug, and content-specific-syntax hypotheses for the ~17.5% crash rate at full active scope. produce remediation backlog and skip-list parameter recommendations.

---

## 3. KEY QUESTIONS (remaining)
- [ ] **Q1 (Hypothesis A: version):** Does pinning tree-sitter native binding to N-1 / N-2 versions change the crash cohort? Specifically: which version pair (binding × grammar) is in the current install, and what is the version skew vs upstream stable?
- [ ] **Q2 (Hypothesis B: WASM):** Does the same fixture cohort behave differently under web-tree-sitter WASM vs the native binding? Is there a WASM path in the current build at all?
- [ ] **Q3 (Hypothesis C: content):** Is there a syntactic pattern shared by ≥80% of failing files but ≤5% of clean files? Candidates: decorator stacking, generics depth ≥4, template-literal nesting, mapped/conditional types, large unions.
- [ ] **Q4 (cohort enumeration):** What is the EXACT list of failing file paths from the live SQLite parse_diagnostics? Build a reproducer corpus.
- [ ] **Q5 (minimum failing fixtures):** Can we reduce 5-10 failing files to standalone <50-line `.ts` files that still crash? (Required for upstream bug report if Hypothesis A or B lands.)
- [ ] **Q6 (skip-list parameters):** What eviction threshold (LRU at N entries), self-heal N (consecutive successes before re-attempt), and persistence target (SQLite `parser_skip_list` table vs JSON sidecar) make sense given the observed crash distribution?
- [ ] **Q7 (remediation backlog):** Concrete file:line citations for the parser wrapper site, the schema migration target, and the status/scan response surfaces that need new fields.

---

## 4. NON-GOALS
- Replacing tree-sitter with Babel, swc, or the native TypeScript compiler API
- Rewriting the indexer or persistence layer beyond the schema bump for the skip-list table
- Adding non-TypeScript language support
- Modifying the F-002/F-003/F-018/F-019 contracts that already shipped
- Implementing the actual fix (this packet's research feeds Phase 2 implementation. iterations are READ-ONLY)

---

## 5. STOP CONDITIONS
- Discriminating evidence for one of A/B/C lands with ≥0.80 confidence (P-value style)
- 7 iterations completed
- Convergence delta drops below 0.10 for 2 consecutive iterations
- 3 consecutive iterations produce zero new findings

---

## 6. KNOWN CONTEXT (seeded at init)

### From live testing (this session)
- Live `code_graph_scan` over `agents+commands+specs+plugins=all` produced 9,349 candidate files. ~1,640 crashed with `memory access out of bounds`. Skills-only scope was parser-clean.
- F-003 parse-error preservation kept the index intact. the crash signal is observable but non-blocking.
- The crash error string `memory access out of bounds` strongly suggests a native code (C/C++/WASM linear memory) violation, not a JS-level exception. This biases toward Hypothesis A (native binding) or Hypothesis B (WASM linear memory).

### From the wider 026/007 track
- 003-deep-research-issues surfaced this as one of four primary findings (alongside default-scope-excludes, drift detector, zero-node persistence).
- 004-006 remediation packets closed F-002/F-003/F-008/F-011/F-018/F-019 via Path 3 native Opus subagents.
- 026/007/012/006 cluster A-E shipped end-to-end live verification.

### Adjacent state
- Schema is currently v4 (post 012/006 work). The skip-list lands at v5.
- Parser call site lives somewhere under `mcp_server/code_graph/lib/`: first iteration must locate it.

---

## 7. WHAT WORKED
- **Iter 1:** Direct SQLite query on `parse_diagnostics` immediately surfaced the cohort shape (121 unique files, two-error-class split correlated with file extension). Crosstab of `error_message × ext` produced a P0-grade discriminating signal in one shot.
- **Iter 1:** Reading `mcp_server/package.json` and `mcp_server/node_modules/web-tree-sitter/package.json` simultaneously ruled out Hypothesis A (no native `tree-sitter` Node binding installed): empirical, deterministic check.
- **Iter 1:** `rg 'resolved is not a function'` across the repo plus a targeted grep into `node_modules/web-tree-sitter/tree-sitter.js` located the upstream throw site at line 1163 (WASM dynamic-linker proxy stub). Direct evidence for Hypothesis B-class fault.
- **Iter 2:** `strings -n 8` on the four target WASM grammars produced a clean exported-symbol crosstab without `wabt`/`wasm-objdump` being installed. Cheap fallback that still discriminated B1 in one pass.
- **Iter 2:** Single-pass `wc -lc` over the B2 cohort (3 sh + 3 ts + size-matched controls) eliminated the size-driven sub-hypothesis the moment a 20-line / 634-byte vitest config showed up in the OOB list. Disprove-by-counterexample beat any correlation analysis.
- **Iter 2:** Targeted `sed -n '1120,1145p'` and `grep -n` into `web-tree-sitter/tree-sitter.js` recovered the `resolveSymbol` body and the `allowUndefined: true` flag (line 1429) that masks the load-time check: closes the B1 mechanism end-to-end.
- **Iter 3:** Lifecycle audit (`grep` + line-by-line read of `tree-sitter-parser.ts:42, :87, :713-714` plus the for-of caller at `structural-indexer.ts:2131-2147`) surfaced the singleton architecture in two reads. Letting the architecture question be answered BEFORE the behavioral question prevented conflating "shared instance exists" with "shared instance causes B2".
- **Iter 3:** 5-probe isolation harness (`scratch/fixtures/iter-003-isolation-test.mjs`) running each probe as a fresh `node` process gave a clean truth table in ~5 seconds wall-clock total. Fresh-process design eliminates cross-probe contamination and lets each probe be cited individually. The harness is reusable for iter 4's cohort-replay reproducer (just extend the file list and remove the per-probe selector).
- **Iter 3:** Single `curl + python3 -c json` query against `registry.npmjs.org` resolved the upstream-version sweep without the noise of GitHub issue scraping. Two HTTP calls produced the latest-version pair (0.26.8 vs 0.24.7. 0.1.13 vs 0.1.13) deterministically.
- **Iter 3:** Marker-search (`findRepoRoot()` walking up looking for `.opencode/skills/system-spec-kit/mcp_server/package.json`) replaced relative-path counting in the harness: robust against future moves of the script. Worth carrying into iter 4 fixtures.
- **Iter 4:** `CONTINUE_ON_ERROR` flag in cohort replay let the loop traverse the full 51-file cohort and surface zero B2 reproductions instead of stopping at the first B1 throw. Critical methodological choice: without it, F-4.1's "no B2 reproduces in-process" finding would be invisible.
- **Iter 4:** Probing the 0.26.8 module-export shape FIRST (before running the cohort) caught the dylink-section incompatibility immediately and turned the "swap probe" into a major finding (F-4.2) rather than a slow debug session.
- **Iter 4:** Hypothesis C surface scan via single-pass `grep -c` crosstab (10 OOB × 5 clean files, count `.ts`-suffix imports + template literals + `import.meta`) beat reading-each-file. Two `bash` calls produced the discriminating signal.
- **Iter 5:** Long-loop stress harness extending iter-4's cohort-replay to 100× = 5,000 parses with per-loop heap/RSS/B1/B2 telemetry. Hit decisive evidence in 1.7 seconds wall-clock. Critical methodological win: keeping the harness self-contained (single `node` script, no MCP coupling) made the in-process corruption visible without runtime-context confounders.
- **Iter 5:** Forward+backward call-chain trace for `parse_diagnostics` write-surface (scan loop → `parseFile` → `parseTreeSitter` → `attachFilePath` → `persistIndexedFileResult` → `recordParseDiagnostic`) closed the mis-attribution hypothesis in one read pass per file (3 files: `structural-indexer.ts`, `tree-sitter-parser.ts`, `ensure-ready.ts`, `code-graph-db.ts`). Audit-by-trace beat audit-by-suspicion.
- **Iter 5:** First-loop sanity check (loop 1 = 41 OK / 9 B1 / 0 B2) replicated iter-4's baseline EXACTLY, validating the harness is fully equivalent to the prior single-pass run before extending to 100×. Without that anchor, F-5.1 would be an unprovable claim.

---

## 8. WHAT FAILED
- (Iter 1: none.) All planned tasks succeeded within budget.
- **Iter 2: WebFetch deferred.** Upstream npm/issue-tracker queries (web-tree-sitter, tree-sitter-wasms, tree-sitter-bash) skipped to stay inside the 12-call budget after the symbol-table audit + B2 fixture sampling consumed most calls. Captured as deferred external-citation gap, not a finding regression. Iter 3 reclaims it.
- **Iter 3: initial harness path-resolver bug.** First two harness runs failed with `Cannot find module 'web-tree-sitter'` because the relative-path REPO computation was off by `..` segments. Fixed mid-iter by switching to a marker-search (`findRepoRoot()`). Cost ~2 retries / ~30s. no information loss. Captured as a "what worked" lesson (marker-search > relative-counting) in §7.
- **Iter 3: `gh search issues` exact-phrase queries.** Both queries returned 0 hits. Not a true failure (negative results are evidence: they constrain the hypothesis space) but means iter 4 cannot rely on upstream issue tracker for fix attribution. the 0.26.x release-notes scrub is the next signal source.
- **Iter 4: initial harness assumed `Parser.Language` was a class static.** First two replay attempts threw `TypeError: Cannot read properties of undefined (reading 'load')` because `Language` only attaches to the Parser class AFTER `Parser.init()` resolves in 0.24.7. Fixed by reading `tree-sitter-parser.ts:84-106` (production usage). Cost ~2 retries / ~1 minute. Lesson: read the production parser-call code BEFORE writing a probe harness. the API shape clue was already in-tree.
- **Iter 5: none.** All planned tasks completed within 9 of 12 tool calls. Stress harness returned in 1.7 seconds wall-clock, well under the 120 s budget. mis-attribution audit cleanly traced in 3 reads + 1 grep. Housekeeping moved 4 fixtures + deleted the iter-004-026-probe install dir in one Bash command. Decision-record-quality evidence captured for both priorities.

---

## 9. EXHAUSTED APPROACHES (do not retry)
- **2-file isolation testing for B2.** Iter-3 P4 (clean-ts → vitest) and P5 (bash-throw → vitest) both PASS. The production B2 sequence is not a 2-file pattern. further 2-file probing won't discriminate. Iter 4 must go straight to N-file cohort replay or skip the empirical reproducer entirely and ship the skip-list defense.
- **"Find a single toxic file" search.** P1 (vitest config alone), P2 (runners/common.ts alone), P3 (bash file alone: B1 not B2), P4, P5 collectively prove no single sampled OOB victim crashes deterministically in a fresh process. Stop looking for one cursed file. the cohort behavior is order-/history-dependent.
- **`tree-sitter-wasms` version-bump as a fix.** Vendored `0.1.13` IS the latest published. No upstream wasm-grammar bump available. This branch of the dependency-bisect is now closed.
- **Cumulative-history-in-process at 51-file horizon.** Iter-4 F-4.1 replayed the full ordered OOB cohort through one shared singleton in 0.24.7. Result: 41 OK / 9 B1 / **0 B2**. Cumulative history at this scope does NOT reproduce B2. Iter 5+ should not retry the same scope. if cumulative-history survives at all it requires the full ~9,349-file production scope or a different runtime context.
- **`web-tree-sitter@0.26.8` as a single-line dependency upgrade.** Iter-4 F-4.2: 0.26.8 hard-rejects all 4 vendored wasms with `failIf(name2 !== "dylink.0")` at `web-tree-sitter.js:1944`. The vendored wasms predate 0.26.x's `dylink.0` custom-section requirement. Bumping web-tree-sitter alone is non-viable. the path requires co-bumping + grammar rebuilds. Treat 0.26.x bump as Phase-3 infrastructure work, not a Phase-2 quick win.
- **Hypothesis C as a primary cause of B2.** Iter-4 F-4.4 + F-4.5: content-syntax patterns (`.ts`-suffix imports, template literals, `import.meta`) correlate weakly (6/10 OOB carry `.ts`-suffix imports vs 0/5 clean) but ALL 10 OOB .ts files parse cleanly under singleton replay. Content-AND-state interaction also fails to reproduce in-process. Hypothesis C is downgraded to "possible secondary stressor, unproven": do not retry as a primary lead.
- **`parse_diagnostics` mis-attribution hypothesis.** Iter-5 F-5.2 traced the full write-surface call-chain (`structural-indexer.ts:2131-2147` → `parseFile:1219-1257` → `parseTreeSitter:680-756` → `attachFilePath:1246` → `persistIndexedFileResult:547-572` → `recordParseDiagnostic:561-593`). Strict for-of+await, closure-bound `filePath` parameter, synchronous per-file DB upsert. No async race, no batching, no shared mutable variable. Mis-attribution is impossible by construction. The 51-file B2 cohort is real per-file evidence. Stop searching for ghost rows.
- **B2 = "memory pressure / GC fragmentation" sub-hypothesis.** Iter-5 F-5.5: across 5,000 parses, heapUsedMb stayed in 5.6–9.3 MB and rssMb was sticky at the Node startup floor (3,488.3 MB) the entire run. B2 reproduces in flat-memory conditions. corruption is in WASM linear memory, not V8 heap. Do not investigate GC pressure or fragmentation as B2 root cause.
- **B2 = "MCP-server runtime-context-only" sub-hypothesis.** Iter-5 F-5.1 reproduced B2 in clean Node at parse 433 / loop 9. Runtime-context (long-lived process, signal handlers, OS interaction) is no longer required to explain reproduction. The MCP server may amplify (more parses before scan ends ⇒ more chance to hit threshold) but is NOT the root mechanism. Do not run live MCP A/B comparisons. root cause is the singleton + grammar interaction.

---

## 10. RULED OUT DIRECTIONS
- **Hypothesis A (native binding version mismatch): RULED OUT (iter 1, F-1.1).** No native `tree-sitter` Node addon is installed. only `web-tree-sitter@0.24.7` (WASM) and `tree-sitter-wasms@0.1.13` are present. Native-binding bisect cannot produce a discriminating signal because there is no native binding to bisect. Hypothesis A is **reframed**, not deleted: the version-pin question pivots to web-tree-sitter × tree-sitter-wasms × prebuilt-grammar version matrix.
- **`.tsx`-grammar mis-routing (latent issue, not load-bearing): DEFERRED.** `tree-sitter-tsx.wasm` exists alongside `tree-sitter-typescript.wasm` but the parser site only loads the typescript variant for both `.ts` and `.tsx`. Zero `.tsx` rows in `parse_diagnostics`. not the cohort cause.
- **B2-size-driven (large-file OOB): RULED OUT (iter 2, F-2.2).** `vitest.phase-k.config.ts` (20 lines, 634 bytes) reproducibly OOB-crashes while `cli.ts` (597 lines, 23 389 bytes) parses cleanly. WASM-linear-memory-exhaustion-on-large-inputs is not the B2 mechanism. Remaining B2 sub-hypotheses (parser-instance reuse, byte-sequence triggers, build defect) survive into iter 3.
- **B2 = "bash-B1 throw poisons the next parse via shared parserInstance": RULED OUT (iter 3, F-3.3).** Iter-3 isolation probe P5 (bash-throw → vitest config, same shared instance) PASSES. The simplest 2-file state-corruption model does not reproduce production B2.
- **B2 = "single toxic file deterministically OOBs in a fresh process": RULED OUT (iter 3, F-3.4).** Probes P1, P2, P3 (with P3 throwing B1, not OOB) confirm no sampled OOB victim crashes alone. Reproduction requires N-file history or a non-content trigger.
- **B2-build-defect via `tree-sitter-wasms` staleness: DOWNGRADED (iter 3, F-3.5).** Vendored `0.1.13` matches upstream latest. there is no newer pre-built grammar to swap in. Build-defect remains a residual possibility (the artifact itself could be corrupt) but the staleness vector is dead.
- **C-content-syntax-alone: RULED OUT (iter 3, F-3.4).** At least 3 different OOB victims (vitest config, runners/common.ts, structural-indexer.ts) parse cleanly in isolation. Content alone cannot trigger B2. if content matters at all, it interacts with parser state. Reframed as "C+state interaction" in iter 4 priorities.
- **C+state-interaction-in-process: RULED OUT (iter 4, F-4.5).** All 10 OOB-class `.ts` files parse cleanly when replayed sequentially through one shared singleton, regardless of `.ts`-suffix-import presence (F-4.4). Content + state interaction within a single Node process does not reproduce B2 at the 51-file horizon. Hypothesis C is now a confirmed dead end as a primary cause. survives only as an unproven "possible secondary stressor".
- **B2 = "cumulative parse-history fragmentation in-process at 51-file horizon": RULED OUT (iter 4, F-4.1).** Full singleton-replay of the ordered OOB cohort (51 files) produces zero B2. Top remaining sub-hypothesis: B2 requires the MCP-server runtime (different Node binding/version, longer-lived process, GC pressure under live MCP, signal handlers, OS interaction) OR a much larger history (~9,349-file production scope).
- **`web-tree-sitter@0.26.8` single-line bump: REFRAMED (iter 4, F-4.2).** 0.26.8 cannot load existing vendored wasms (`Error: need dylink section`). The "version-bump fixes B1" remediation requires co-bumping `web-tree-sitter` + rebuilding all 4 grammars from upstream `tree-sitter` CLI: significant new infrastructure. Becomes a Phase-3 defense-in-depth path, NOT the Phase-2 primary remediation.
- **B2 = `parse_diagnostics` mis-attribution / propagated-tag: RULED OUT (iter 5, F-5.2).** Forward+backward audit of the diagnostics write-surface confirms attribution is closure-bound + sequential + synchronous + single-row. No race, no batching, no propagation. The 51-file B2 cohort is genuinely 51 per-file OOB throws. This sub-hypothesis is closed permanently. iter 6 must NOT revisit it.
- **B2 = runtime-context-only (MCP server async layer / GC pressure / signal-handlers / OS interaction) as root cause: DOWNGRADED (iter 5, F-5.1+F-5.5).** B2 reproduces in clean `node` script at parse 433 with flat heap (~7 MB) and sticky RSS. Runtime-context may AMPLIFY (longer-lived process surfaces threshold faster across more parses) but is not the root mechanism. Active hypothesis is now "B1 stub-throw side-effect on bash WASM scanner state" (F-5.3).
- **B2 = cumulative-history-in-process at >51-file horizon: CONFIRMED (iter 5, F-5.1).** Long-loop singleton stress (100× cohort = 5,000 parses) surfaces first B2 at parse 433 / loop 9 / cohort idx 32 (a `.sh` file). Cumulative grows linearly to 4,217 over the run while heap stays flat. Iter-4's "REJECTED at 51-file horizon" status is now corrected: cumulative-history IS the root mechanism, just needs ≥9 cohort traversals (~400 parses with bash B1 throws) before it surfaces. Strategy §10 entry from iter 4 is superseded.

---

## 11. ANSWERED QUESTIONS

| Q | Status (post-iter-7 final) | Final answer |
|---|----------------------------|--------------|
| **Q1 (Hypothesis A: version)** | RULED OUT FINAL | No native `tree-sitter` Node addon installed (F-1.1). Reframed: web-tree-sitter@0.24.7 + tree-sitter-wasms@0.1.13 version skew matters only for R-2 Phase-3 epic (F-3.5, F-4.2). |
| **Q2 (Hypothesis B: WASM)** | ANSWERED FINAL | B2 root cause: cumulative WASM module-level corruption from bash B1 stub-throws via missing `external_scanner_reset` export (F-5.1 + F-5.3 + F-6.1 + F-6.2 + F-6.3). Confidence 0.95. R-1 per-instance reset REJECTED. module-level corruption persists across `new Parser()` boundary (F-6.1). Bash is necessary AND sufficient (F-6.2 sh-excluded clean / F-6.3 sh-only reproduces). Iso-corruption budget = ~80 B1 throws (F-6.3). |
| **Q3 (Hypothesis C: content)** | EFFECTIVELY ANSWERED FINAL | Content matters only as a bash-B1 fingerprint (the .sh files that hit the external-scanner code path). No general syntactic pattern across non-bash files (F-4.4, F-4.5, F-6.2). Iter-7 verification probe (F-7.1): fresh-bash-only mode shows ~29 of 33 .sh throw B1, broader than the iter-005 mixed-cohort 9-of-33 steady state. |
| **Q4 (cohort enumeration)** | ANSWERED FINAL | 121 unique files. B1 = 70× on .sh. B2 = 51× across .sh/.ts/.py/.js (F-1.5, iter-2 crosstab). |
| **Q5 (minimum failing fixtures)** | PARTIAL (deferred post-research) | The `run-all.sh` family is a reliable B1+B2 progenitor (variant A iter 6). Standalone <50-LOC bash extraction deferred to post-research repro work: not blocking Phase-2 since the seed file paths (70 production B1) suffice for skip-list defaults. |
| **Q6 (skip-list parameters)** | ANSWERED FINAL | SQLite `parser_skip_list` table at v5 (`code-graph-db.ts:209-216`). columns `(file_path PK, error_class, last_seen_at, attempt_count, last_success_at)`. LRU cap 100 (over-provisioned vs known 70). self-heal DISABLED by default (manual review only: under web-tree-sitter@0.24.7 no retry pattern can heal a B1 file). env flag `SPECKIT_PARSER_SKIP_LIST_ENABLED` default true. default seed = 70 production B1 paths backfilled from `parse_diagnostics` at migration time. Self-heal becomes a Phase-3 unlock when R-2 lands. |
| **Q7 (remediation backlog file:line)** | ANSWERED FINAL | Parse-site try block `tree-sitter-parser.ts:697-756`. pre-check insertion at `:712`. catch-block hook + R-1' quarantine sentinel at `:741-756`. Schema migration target `code-graph-db.ts:209-216`. Diagnostics write pattern `code-graph-db.ts:561-593`. Singleton declared `tree-sitter-parser.ts:42`. allocated at `:78-94`. Caller scan loop `structural-indexer.ts:2131-2147`. Upstream throw context `web-tree-sitter/tree-sitter.js:1163-1180` (proxy stub) + `:1429` (allowUndefined). |

---

## 12. EVIDENCE LOG (iteration-by-iteration)
- **Iter 1 (2026-05-06T13:55Z):** 6 findings (3× P0, 3× P1). Cohort = 121 unique files, two error classes (70× resolved-not-fn on .sh, 51× OOB across .sh/.ts/.py/.js). Hypothesis A ruled out (pure WASM stack, no native binding). Parser site at `tree-sitter-parser.ts:714`, upstream WASM throw at `web-tree-sitter@0.24.7:tree-sitter.js:1163`. Versions pinned. Qualitative sample of 5 files surfaces three distinct sub-patterns. Recommended hypothesis ranking: B > C > A. See `iterations/iteration-001.md`, `deltas/iter-001.jsonl`.
- **Iter 2 (2026-05-06T14:08Z):** 6 findings (2× P0, 2× P1, 2× P2). **B1 confirmed end-to-end:** bash WASM missing `external_scanner_reset`. `allowUndefined: true` (tree-sitter.js:1429) masks the load-time check. proxy stub at :1163-1180 throws on first parse-time call. **B2-size-driven rejected** by counterexample (20-line vitest config OOB-crashes. 597-line cli.ts is clean). B2 sub-hypotheses surviving: parser-instance reuse, byte-sequence trigger, build defect. WebFetch deferred to iter 3 due to budget. Updated ranking: B1 (mechanism confirmed) > B2-shared-state > B2-build-defect > B2-byte-pattern > C-content-syntax. See `iterations/iteration-002.md`, `deltas/iter-002.jsonl`.
- **Iter 3 (2026-05-06T14:25Z):** 6 findings (2× P0, 3× P1, 1× P2). **Parser-instance lifecycle architecture confirmed as singleton** (F-3.1, F-3.2): module-level `parserInstance` allocated once in `ensureInit()` at `tree-sitter-parser.ts:87`, reused across every parse, no reset. caller is strict for-of + await at `structural-indexer.ts:2131-2147`. **Behavioral state-corruption REJECTED** at the 2-file granularity (F-3.3, F-3.4): isolation probes P1/P2/P4/P5 all PASS. only P3 (B1 via bash) throws. Production B2 must come from longer history or a different mechanism. **Upstream gap quantified** (F-3.5): vendored `web-tree-sitter@0.24.7` lags upstream `0.26.8` by 2 minors / 8 patches. `tree-sitter-wasms@0.1.13` matches upstream. **Upstream tracker has no exact-phrase hit** for our crash (F-3.6). adjacent OOB fix `tree-sitter#5573` is CLI-only and unrelated. Updated ranking: B1 (CONFIRMED, ready for remediation) > B2-cumulative-history > B2-content+state-interaction > B2-runtime-context (MCP async layer) > B2-build-defect (downgraded) > C-content-alone (rejected) > A (RULED OUT). See `iterations/iteration-003.md`, `deltas/iter-003.jsonl`, `scratch/fixtures/iter-003-isolation-test.mjs`, `scratch/fixtures/iter-003-isolation-output.txt`.
- **Iter 4 (2026-05-06T14:42Z):** 6 findings (3× P0, 2× P1, 1× P2). **Cohort replay (51-file singleton run): 41 OK / 9 B1 / 0 B2** (F-4.1): cumulative-history-in-process at 51-file horizon REJECTED. **0.26.8 swap probe FAILS at `Language.load`** with `Error: need dylink section` (F-4.2): version-bump remediation reframed: needs co-bumped wasms, not single-line npm install. **B1 is content-conditional**: 9 of 33 cohort .sh files throw, the other 24 parse cleanly (F-4.3): strategy §11 Q5's "every bash file" framing corrected. **All 10 OOB .ts files parse cleanly** under singleton replay (F-4.5): strong support for `parse_diagnostics` mis-attribution hypothesis. **Hypothesis C surface scan**: `.ts`-suffix imports correlate 6/10 OOB vs 0/5 clean but don't reproduce OOB anyway (F-4.4): closed as "possible secondary stressor, unproven". **`parse_diagnostics` lacks insertion-order column** (F-4.6): methodology caveat + plan-input note for schema migration. Updated ranking: **B1 (CONFIRMED, content-conditional bash, ready for remediation) > B2-runtime-context (MCP async layer: top remaining) > B2-mis-attribution (plausible per F-4.5) > B2-cumulative-history-in-process (REJECTED at 51-file horizon) > C-content+state (downgraded) > C-content-alone (rejected) > A (RULED OUT)**. See `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `scratch/fixtures/iter-004-cohort-replay.mjs`, `scratch/fixtures/iter-004-cohort-replay-output.txt`, `scratch/fixtures/iter-004-026-probe-output.txt`, `scratch/fixtures/iter-004-oob-cohort.txt`.
- **Iter 5 (2026-05-06T15:05Z):** 6 findings (3× P0, 2× P1, 1× P2). **Long-loop stress harness (100× cohort = 5,000 parses, single shared singleton in 0.24.7): loop 1 = 41 OK / 9 B1 / 0 B2. first B2 at loop 9 / parse 433 / cohort idx 32 (.sh file `run-all.sh`). loop 100 cumulative = 354 OK / 78 B1 / 4,217 B2 / 351 OTHER. heap stayed 5.6–9.3 MB throughout** (F-5.1, F-5.4, F-5.5). Cumulative-history-in-process at >51-file horizon CONFIRMED: iter-4 "REJECTED at 51-file horizon" was just a threshold artifact. **`parse_diagnostics` mis-attribution REJECTED** via full call-chain trace `structural-indexer.ts:2131-2147` → `parseFile:1219-1257` → `parseTreeSitter:680-756` → `attachFilePath:1246` → `persistIndexedFileResult:547-572` → `recordParseDiagnostic:561-593`: closure-bound + sequential + synchronous + single-row, no race possible (F-5.2). The 51-file B2 cohort is real per-file evidence. **B2 mechanism narrowed:** WASM linear-memory state corruption accumulated via the bash B1 stub-throw side-effect (mechanism: missing `external_scanner_reset` ⇒ scanner state escapes unhandled): first B2 victim is itself a .sh file, ~9 cohort traversals' worth of B1 throws precede the OOB transition (F-5.3, medium confidence on bash isolation. iter 6 to validate). **Memory-pressure / GC-fragmentation sub-hypothesis ruled out**: flat heap during reproduction (F-5.5). **Runtime-context-only DOWNGRADED**: clean Node reproduces. MCP runtime amplifies but is not the mechanism. Updated ranking: **B2-cumulative-WASM-corruption-via-bash-B1-stub-throw (CONFIRMED) > B1-content-conditional-bash (CONFIRMED, defense-in-depth) > B2-runtime-context (DOWNGRADED) > B2-mis-attribution (REJECTED) > C (downgraded) > A (RULED OUT)**. See `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `scratch/fixtures/iter-005-stress-loop.mjs`, `scratch/fixtures/iter-005-stress-output.txt`. Iter-004 fixtures consolidated to packet-local scratch (F-5.6).

---

## 13. CITATIONS POOL
[Empty: file:line and external citations accumulate here]

---

## 14. TENSIONS / CONTRADICTIONS
[Empty: reducer surfaces inter-iteration disagreements]

---

## 15. CONVERGENCE METRICS

| Iteration | Findings | Novelty | Delta | Stop reason |
|-----------|----------|---------|-------|-------------|
| 1 | 6 (3× P0, 3× P1) | 1.00 | 1.00 | continue |
| 2 | 6 (2× P0, 2× P1, 2× P2) | 0.83 | 0.67 | continue (B1 confirmed. B2 sub-mechanisms still split) |
| 3 | 6 (2× P0, 3× P1, 1× P2) | 1.00 | 0.83 | continue (parser-instance architecture confirmed singleton. simplest 2-file state-corruption model REJECTED. B2 root-cause requires N-file replay or different mechanism) |
| 4 | 6 (3× P0, 2× P1, 1× P2) | 0.83 | 0.50 | continue (51-file cohort-replay singleton run REJECTS cumulative-history-in-process and Hypothesis C. 0.26.8 dependency-bump path REFRAMED as Phase-3 infra. B1 corrected to content-conditional within bash. only 2 B2 sub-hypotheses remain: runtime-context vs `parse_diagnostics` mis-attribution. Iter 5 will discriminate via long-loop stress + diagnostics-write audit) |
| 5 | 6 (3× P0, 2× P1, 1× P2) | 1.00 | 0.83 | continue (B2 root mechanism CONFIRMED: cumulative WASM linear-memory corruption inside the singleton, surfaces at parse 433 / loop 9 / cohort idx 32 in clean Node, sticky thereafter at ~50 B2/loop. mis-attribution REJECTED by full call-chain trace. Runtime-context DOWNGRADED. Memory-pressure RULED OUT. Iter 6 validates the cheap fix candidate R-1 parser-instance reset-on-throw + .sh-only / .sh-excluded variants to isolate bash B1 stub as the unique trigger.) |
| 6 | 6 (3× P0, 2× P1, 1× P2) | 0.85 | 0.83 | continue (R-1 per-instance reset DECISIVELY REJECTED: module-level corruption persists across `new Parser()` boundary. the next constructor itself traps. Variant B sh-excluded = 900 parses, 0 B1, 0 B2 → bash is necessary AND sufficient. Variant A sh-only = first B2 at parse 271 / 80th B1 throw → iso-corruption budget = ~80 B1 throws regardless of language interleaving. Phase-2 hierarchy locked: R-3 skip-list primary, R-1' process quarantine defense-in-depth, R-2 web-tree-sitter@0.26.x co-bump deferred to Phase-3. Iter 7 produces final synthesis.) |
| **7** | **0 + 1 verification probe (F-7.1 P2)** | **0.05** | **0.20** | **CONVERGED: `max_iterations_reached_with_full_convergence`. All key questions answered (Q1 ruled out. Q2 confirmed at 0.95. Q3 effectively answered. Q4 enumerated. Q5 partial / deferred fixture extraction. Q6 narrowed. Q7 locked). Mechanism story closed. Phase-2 plan-input locked (R-3 + R-1'). Phase-3 backlog item identified (R-2). See `research/research.md` for the 17-section synthesis.** |

---

## 16. NEXT FOCUS

**CONVERGED: see `research/research.md`.** Loop terminated at max_iterations cap with full convergence. Mechanism story locked. Phase-2 plan-input locked (R-3 skip-list primary, R-1' process quarantine defense-in-depth). Phase-3 backlog item identified (R-2 web-tree-sitter@0.26.x co-bump + grammar rebuild epic).

**Recommended next command:** `/spec_kit:plan` against this packet to refine `plan.md` and `tasks.md` per `research/research.md` §10 (T009 default seed change to 70 production B1 paths. T011 self-heal posture change to manual-review-only. T016 + T017 new tasks for R-1' quarantine sentinel).

**DO NOT** initiate iter 8: loop is at max_iterations cap with full convergence, not a stuck/timeout/error state.

---

### Superseded iter 6 priorities (kept for audit trail, all addressed):

1. **R-1 reset-on-throw validation (highest priority: confirms or invalidates the cheap Phase-2 fix).** Create `scratch/fixtures/iter-006-reset-test.mjs` cloned from `iter-005-stress-loop.mjs` with one change: in the `catch` block, recreate the parser (`parser = new Parser(). parser.setLanguage(lang)`) before continuing. Run 100× cohort = 5,000 parses with the same shared instance otherwise. Three outcomes:
   - **B2 count = 0 (or ≤ baseline noise)** → R-1 is the silver bullet. Phase-2 remediation simplifies to ~2 LOC in `tree-sitter-parser.ts:741-756` (insert reset in catch). Skip-list moves to defense-in-depth role.
   - **B2 count drops sharply but is non-zero** → R-1 is necessary but insufficient. combine with R-2 per-language instances. Document residual.
   - **B2 count unchanged** → corruption is not via the catch path. the WASM linear-memory state grows monotonically per parse independent of throws. R-1 abandoned. need R-2 or R-4 (0.26.x bump).
2. **Bash-isolation variants (validates F-5.3 mechanism inference).** Two quick runs of the existing iter-005 stress harness with cohort filter:
   - **Variant A (.sh only):** filter cohort to the 33 .sh files. expected: B2 surfaces in similar window (~loop 9-15) since the bash-throw mechanism is preserved.
   - **Variant B (.sh excluded: only the 18 ts/py/js files):** expected: zero B2 across 100× = ~1,800 parses. If zero B2: confirms F-5.3's "bash B1 throw is the unique trigger". If B2 still surfaces: there is at least one additional corruption vector (likely .ts-grammar-side. investigate next).
   - Both runs reuse the existing harness with a 1-line filter. ~10s wall-clock each.
3. **Iter 7 synthesis prep (decision-record skeleton, plan-input lock).**
   - Decision-record draft (in `research/research.md` or staged for iter 7): title "Tree-sitter parser singleton reset on caught throw + skip-list defense-in-depth + Phase-3 grammar rebuild path", citing F-1.1, F-1.5, F-3.1/3.2, F-4.1/4.3, F-5.1/5.2/5.3.
   - Lock Phase-2 plan-input: **R-1 reset-on-throw** (primary, ~2 LOC at `tree-sitter-parser.ts:741-756`) + **R-3 skip-list** (defense-in-depth, parameters from iter-3 §11 Q6 with self-heal-at-5 caveat from F-5.4).
   - Lock Phase-3 plan-input: **R-4 web-tree-sitter 0.26.x + grammar-rebuild infrastructure** as separate followup packet (already scoped by F-4.2).
   - Schema migration: `parse_diagnostics.scan_seq INTEGER NOT NULL DEFAULT 0` (from F-4.6) + `parser_skip_list` table at v5 schema target `code-graph-db.ts:209-216`.

**DO NOT touch:**
- 2-file isolation tests (exhausted §9).
- "Single toxic file" searches (exhausted §9).
- `tree-sitter-wasms` version bumps (no upstream available, §9).
- 51-file singleton replay at unchanged horizon (iter 4 produced rejection at 51 files. iter 5 produced confirmation at 5,000: settled).
- 0.26.8 swap with vendored wasms (rejected by `dylink.0` requirement, F-4.2).
- Hypothesis C as a primary lead (downgraded F-4.4 + F-4.5).
- `parse_diagnostics` mis-attribution rework (REJECTED by F-5.2 call-chain trace. do not revisit).
- Memory-pressure / GC-fragmentation experiments (RULED OUT by F-5.5 flat-heap data).
- MCP-server runtime A/B comparisons (DOWNGRADED: clean Node reproduces, runtime amplifies only).

Recommended hypothesis ranking entering iter 6: **B2-cumulative-WASM-corruption-via-bash-B1-stub-throw (CONFIRMED, F-5.1+F-5.3, R-1 candidate fix to validate) > B1-content-conditional-bash (CONFIRMED since iter 4, defense-in-depth via R-3 skip-list) > B2-runtime-context (DOWNGRADED) > B2-mis-attribution (REJECTED) > C (downgraded) > A (RULED OUT)**.

---

### Superseded iter 5 priorities (kept for audit trail, all addressed):

1. ✅ **Long-loop singleton-replay stress test.** F-5.1: 100× = 5,000 parses. first B2 at parse 433 / loop 9. loop 100 = 4,217 B2. flat heap. Cumulative-history-in-process at >51-file horizon CONFIRMED.
2. ✅ **`parse_diagnostics` write-surface audit.** F-5.2: full call-chain trace from scan loop to DB write proves attribution is closure-bound + sequential + synchronous + single-row. Mis-attribution REJECTED.
3. ✅ **Plan-input lock for iter 6 synthesis.** Restated above with iter-5 corrections (R-1 promoted to primary fix. skip-list demoted to defense-in-depth. self-heal threshold needs revision per F-5.4).

### Superseded iter 4 priorities (kept for audit trail, all addressed):

1. ✅ **Cohort-replay reproducer.** F-4.1: 51-file singleton replay produced 41 OK / 9 B1 / 0 B2. Cumulative-history-in-process REJECTED at 51-file horizon. promoted to §9 exhausted. Harness reusable for iter 5 long-loop extension.
2. ✅ **Web-tree-sitter 0.26.8 swap probe.** F-4.2: 0.26.8 hard-rejects vendored wasms with `Error: need dylink section`. Version-bump path reframed as Phase-3 (needs co-bumped grammars), promoted to §9 exhausted.
3. ✅ **Hypothesis C surface scan.** F-4.4 + F-4.5: `.ts`-suffix imports correlate 6/10 OOB vs 0/5 clean but all 10 OOB .ts parse cleanly anyway. C closed as "possible secondary stressor, unproven". promoted to §9 exhausted.
4. ✅ **Skip-list parameter finalization.** Already locked in iter-3 §11 Q6. restated in iter-5 priority 3 above.

(Original iter-4 priority text superseded.)

1. **Cohort-replay reproducer (highest priority).** Build `scratch/fixtures/iter-004-cohort-replay.mjs` that reads the production traversal order (either from a fresh in-memory `code_graph_scan` driver or by sorting `parse_diagnostics` rows by their `created_at`/insert order) and parses each file through ONE shared `parserInstance` until the first OOB throw. Capture: the minimum-prefix length to first OOB, the (file_path, language) sequence preceding the crash, and whether the same prefix reproduces across multiple Node-process runs. Three outcomes:
   - **Prefix < 10 files** → cumulative-history hypothesis. 1-2 prior parses interact directly. Investigate which file types/sizes appear most often in the prefix.
   - **Prefix > 100 files** → fragmentation/pressure hypothesis. B2 is a slow-leak phenomenon. Skip-list is the right primary remediation.
   - **No reproduction in a single Node process even with the full ordered cohort** → B2 requires the MCP-server async runtime context (GC pressure, signal handlers, OS interaction). Drop in-process reproduction. rely on integration-level scan testing.
2. **Web-tree-sitter 0.26.8 swap probe (run inside the same harness).** `npm install --no-save web-tree-sitter@0.26.8` into a temp dir, dynamic-import it instead of the vendored 0.24.7, replay the same sequence. If 0.26.8 silently fixes both B1 and B2, the remediation collapses to a one-line dependency bump and the skip-list becomes defense-in-depth. If only B1 is fixed, scope the bump as a Phase 2 deliverable independent of the skip-list. If nothing changes, the skip-list is the primary fix.
3. **Hypothesis C surface scan (deferred since iter 1).** Read 5 of the 51 OOB victims (vitest config + 4 representative ts/sh/py/js files). Look for: deep generics, mapped/conditional types, template-literal nesting, decorator stacks, multi-megabyte heredocs. Even though "content alone" is ruled out (F-3.4), a content-AND-state interaction may explain why specific files appear in the cohort while size-matched neighbors don't. One-iteration time-box: 4 reads, no follow-up if nothing distinctive surfaces.
4. **Skip-list parameter finalization → plan-input.** Lock in the design from §11 Q6: N=2048 entries. LRU keyed by `(file_path, content_hash)`. self-heal at 5 consecutive scan-survivals post version-bump. SQLite `parser_skip_list` table at schema v5. status/scan response surfaces include skip-count, evict-count, heal-count fields. Document as a plan-input note in iteration-004.md, not a research finding.
5. **DO NOT touch:** further 2-file isolation tests (exhausted, §9). chasing tree-sitter-wasms version bumps (no upstream available, §9). single-toxic-file searches (rejected, §9). Stay focused on (1) and (2).

Recommended hypothesis ranking entering iter 4: **B1 (CONFIRMED, implementation-ready) > B2-cumulative-history > B2-content+state-interaction > B2-runtime-context (MCP async layer) > B2-build-defect (downgraded: wasms current) > C-content-alone (RULED OUT) > A (RULED OUT)**.

---

### Superseded iter 3 priorities (kept for audit trail, all addressed):

1. ✅ **Confirm parser-instance reuse hypothesis for B2.** F-3.1 + F-3.2: confirmed singleton + sequential caller. F-3.3 + F-3.4: 2-file state-corruption model REJECTED.
2. ✅ **Reclaim deferred upstream state check.** F-3.5: 0.24.7 vs 0.26.8 gap quantified. tree-sitter-wasms current at 0.1.13. F-3.6: no exact-phrase upstream issue.
3. ✅ **Minimal B2 reproduction sketch.** `scratch/fixtures/iter-003-isolation-test.mjs` produced. result is "no 2-file deterministic reproducer", which is itself the sketch that motivates iter 4's cohort-replay design.
4. ✅ **Skip-list-parameter calibration.** Locked in §11 Q6.
5. **Hypothesis C touch deferred.** Promoted to iter 4 priority (3) since (1) and (2) closed cleanly without ruling out content-AND-state interaction.

---

### Superseded iter 2 priorities (kept for audit trail, all addressed):

1. **Web-tree-sitter & tree-sitter-wasms upstream bisect.** Use `WebFetch` for `https://registry.npmjs.org/web-tree-sitter` and `https://registry.npmjs.org/tree-sitter-wasms`: capture latest stable, every version released between 2025-12 and 2026-05, and any changelog entries mentioning bash-grammar fixes, WASM dynamic-linker fixes, or memory-OOB fixes. The vendored `web-tree-sitter@0.24.7` line `tree-sitter.js:1163` (`return resolved(...args)`) is the specific surface to look for in upstream commit history.
2. **Upstream `tree-sitter-bash` issue audit.** Search `https://github.com/tree-sitter/tree-sitter-bash/issues` and `https://github.com/tree-sitter/tree-sitter/issues` for keywords: "resolved is not a function", "memory access out of bounds", "WASM symbol", "dynamic linker", "bash grammar". Capture issue numbers, status (open/closed), and any fix versions.
3. **Discriminate B1 (bash-grammar dynamic-linker) vs B2 (cross-grammar OOB).** Read 3 of the OOB-class .sh files (NOT the resolved-not-fn class) and 3 OOB-class .ts files. compare file sizes and content shape. If size > 10 KB correlates with OOB while < 5 KB correlates with resolved-not-fn, B2 is likely "WASM linear memory exhaustion on large inputs" (a runtime configuration issue, not a grammar bug). If no size correlation, B2 is content-syntactic and C-aligned.
4. **Spot-check the bash WASM symbol export table.** Without rebuilding: dump exported-symbol names from `mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-bash.wasm` (use `xxd | grep` for printable strings, or `wabt`'s `wasm-objdump -x` if available). Compare against known web-tree-sitter@0.24.7 expected exports. This is the discriminating evidence for B1.
5. **Pre-work for skip-list parameters (Q6).** Given 121 stable failures across ~9k+ candidates, a skip-list at N=2048 entries (≈17× cohort headroom) and self-heal at 5 consecutive successes after a version bump is a reasonable starting tradeoff. Iter 2 evidence will calibrate.

Recommended hypothesis ranking entering iter 2: **B (WASM grammar / runtime) > C (content-stresses-grammar) > A (RULED OUT: reframed as version bisect inside the WASM stack)**.

---

## 17. RESOURCE MAP HINTS
- `mcp_server/code_graph/lib/*.ts`: likely parser wrapper site
- `mcp_server/code_graph/lib/code-graph-db.ts`: schema location for v5 bump
- `mcp_server/database/code-graph.sqlite`: live `parse_diagnostics` table
- `mcp_server/package.json`: tree-sitter dependency pins
- `mcp_server/node_modules/tree-sitter*`: vendored binding artifacts
