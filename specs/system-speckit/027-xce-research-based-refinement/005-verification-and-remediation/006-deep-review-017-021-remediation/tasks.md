---
title: "Tasks: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "Per-phase + cross-cutting remediation workstreams for the confirmed 017-021 deep-review findings. Each task names its target file, concrete change, severity, synthesis trace, and confidence (confirmed-by-code vs needs-in-task-verification)."
trigger_phrases:
  - "017-021 remediation tasks"
  - "deep review remediation tasks"
  - "search reindex maintenance remediation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored 35-task ledger across 8 workstreams from 017-021 syntheses"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    completion_pct: 0
---
# Tasks: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task format**: `T### [P?] Description (target file) [severity] {confidence} <trace: synthesis finding>`

**Severity tags**: `[P1]` confirmed P1 · `[P2-code]` code/maintainability · `[P2-doc]` doc/traceability · `[P2-test]` test coverage · `[P2-opt]` optional/cosmetic.

**Confidence tags**: `{confirmed-by-code}` = the synthesizer opened the cited code and the claim matched · `{needs-in-task-verification}` = must be confirmed in-task before acting (renderer behavior, callee signature, live line numbers).

**Severity-lock**: T001 is the gating verification for the only P1. It MUST run first; its outcome decides whether T002 is a code fix (raw renderer) or a doc-note (quoting renderer).
<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Workstream | Tasks |
|-----------|------------|-------|
| M1 | P1 severity-lock + fix (017 c006) | T001-T002 |
| M2 | 017 cross-cutting doc drift (all 7 children) | T003 |
| M3 | 017 code/maintainability P2s (c004/c003/c002/c001/c005) | T004-T011 |
| M4 | 018 cancellation accuracy + coverage | T012-T016 |
| M5 | 019 doc reconciliation + optional hardening | T017-T023 |
| M6 | 020 test hygiene + doc reconciliation | T024-T026 |
| M7 | 021 instrumentation + observability | T027-T031 |
| M8 | Verification + close-out | T032-T035 |
<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Workstream M1 — [P1] 017 c006 command-contract hardening

> Source: 017 synthesis §"c006 — command-contract-structural (the only P1)" and Remediation Outline #1.

- [ ] T001 **[SEVERITY-LOCK — DO FIRST]** Verify whether the OpenCode/Claude slash-command renderer substitutes `$ARGUMENTS` **raw** into the outer shell or **shell-quotes** it into a single token (`.opencode/commands/memory/search.md` §0, line ~17) [P1] {needs-in-task-verification} <trace: 017 c006 P1, R1 step T1; impl-summary:66 "expands one word per argument" suggests raw>. Evidence to capture: the renderer's argument-substitution rule (doc or source), plus a live probe of a query containing `*` and `$(echo x)`. Outcome decides T002.
- [ ] T002 Resolve the §0 `-- $ARGUMENTS` exposure at the severity T001 establishes (`.opencode/commands/memory/search.md:17`) [P1] {needs-in-task-verification} <trace: 017 c006 P1>.
  - **If raw**: disable globbing for the substitution (`set -f` / noglob) and/or restructure so user text is not subject to the outer shell's glob + command-substitution phase; then add verification cases for `*`, `?`, `$(…)`, backticks, `;`, `\|`, `&`, `>` (the shipped fix only handles word-splitting `"$*"` + `"`-escaping). Verify the arg-echo at `search.md:72` still matches.
  - **If shell-quoted**: record a one-line P2 doc-note in the §0 header with the renderer evidence; make NO code edit; mark the finding downgraded-to-P2.
<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workstream M2 — [P2-doc] 017 systemic scaffold-vs-shipped drift (DOMINANT P2)

> Source: 017 synthesis §"Cross-cutting (ALL 7 children) — systemic doc-drift" (7 lineages / 4 models) and Remediation Outline #2. This is the highest-volume finding.

- [ ] T003 [P] Reconcile each of the 7 children under `027/002/017-search-and-output-intelligence-implementation/<c001-c007>/`: populate `spec.md`/`plan.md`/`tasks.md` with real requirements/scope/file-change tables (or explicitly mark superseded by `implementation-summary.md`), and refresh `graph-metadata.json` Status `planned → done`/`complete` + real Key Files; reconcile each `_memory.continuity` block [P2-doc] {confirmed-by-code} <trace: 017 systemic doc-drift; verified `spec.md:97-98 = [Deliverable 1]/[Deliverable 2]`, `:14 packet_pointer "scaffold/<name>"`, `graph-metadata Status: planned` vs impl-summary `completion_pct: 100`>. Mechanism: prefer per-child `generate-context.js`; **never overwrite real `implementation-summary.md` content**. May split into one sub-task per child if needed.
<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
### Workstream M3 — [P2-code] 017 calibration + search maintainability

> Source: 017 synthesis §c004 (densest code-nit child), §c003, §c002, §"c001/c005/c007 — minor", Remediation Outline #3-#6.

### c004 confidence-calibration cluster
- [ ] T004 [P] Add a module-load assertion that `WEIGHT_HEURISTIC + WEIGHT_SCORE_PRIOR === 1.0` (`lib/search/confidence-scoring.ts:54-56`) [P2-code] {confirmed-by-code} <trace: 017 c004 mimo; invariant is comment-only at :54>.
- [ ] T005 [P] Collapse adjacent equal-mean PAV blocks before emitting `points` (`lib/search/confidence-calibration.ts:166-174`) [P2-code] {confirmed-by-code} <trace: 017 c004 opus; `:168` `<=` exits merge, leaving equal-mean blocks separate — model-size only, no correctness impact>.
- [ ] T006 [P] Extract a shared PAV fit OR add a parity/drift test between `lib/search/confidence-calibration.ts:145-183` and `017-…/004-…/assets/fit-calibration.mjs:97-124` [P2-code] {confirmed-by-code} <trace: 017 c004 opus; near-identical PAV loops, no drift guard>.
- [ ] T007 [P] Add an mtime/content-hash check to the calibration-model cache OR keep the documented limitation note (`lib/search/confidence-scoring.ts:167-179`) [P2-code] {confirmed-by-code} <trace: 017 c004 opus+mimo, 2 models; `:173` keys cache on path only, no content invalidation; documented limitation #4>.

### c003 recovery-payload hygiene
- [ ] T008 [P] Build the SQL param array programmatically from the clause list (remove the 3× hand-spread of `seedIds`) (`lib/search/recovery-payload.ts:288-300`) [P2-code] {confirmed-by-code} <trace: 017 c003 mimo; parameterized/no-injection, fragility-only>.
- [ ] T009 [P] Make the `classifyStatus` final fallback explicit (sentinel/throw or a comment explaining the duplicate `low_confidence` label) (`lib/search/recovery-payload.ts:87`) [P2-code] {confirmed-by-code} <trace: 017 c003 mimo; benign dead-ish branch>.

### c002 request-quality defensiveness
- [ ] T010 [P] Add a `results.length === confidences.length` guard/assertion in `assessRequestQuality` (`lib/search/confidence-scoring.ts:355-375`) [P2-code] {confirmed-by-code} <trace: 017 c002 ds; parallel arrays unchecked; invariant holds at call site today, defensive only>.

### c001/c005 cosmetic (optional)
- [ ] T011 [P] (Optional) Move `s3meta.tokenBudget.adjustedBudget` assignment to after header-overhead computation (remove placeholder-then-patch) (`lib/search/hybrid-search.ts:1354`, mutated `:2003`); and, if runtime tuning is wanted, wire `COSINE_TOPN_REORDER_DEPTH` (`:2415`) to a `search-flags.ts` env flag, else accept the fixed constant [P2-opt] {confirmed-by-code} <trace: 017 c001 ds + c005 kimi; both intentional/documented, cosmetic>.
<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
### Workstream M4 — [P2] 018 cancellation accuracy + coverage

> Source: 018 synthesis Confirmed Findings + Remediation Outline #1-#5. Verdict PASS; all P2.

- [ ] T012 Clear the `cancelledJobIds` Set on every terminal `setJobState` (`lib/ops/job-store.ts`, after the successful UPDATE ~:260): add `if (isTerminalJobState(nextState)) cancelledJobIds.delete(jobId);` — closes the cancel-then-fail-while-running leak so the `:69-75` "cannot grow without bound" comment becomes literally true [P2-code] {confirmed-by-code} <trace: 018 P2 #1, 4 lin / 2 models; add at :319, deletes only at :369/:399, none in `setJobState`; failed path at memory-index.ts:1525/1532 routes through `setJobState('failed')`>.
- [ ] T013 Count cancelled files distinctly — add a `result.status === 'cancelled'` branch before `results.failed++` so a cancel does not inflate the failure count (`handlers/memory-index.ts:1051-1060`) [P2-code] {confirmed-by-code} <trace: 018 P2 #4 (deepseek-2); `'cancelled'` absent from `isSuccessfulStatus` allow-list → falls through to `results.failed++`>.
- [ ] T014 [P] Add a `processBatches` test asserting `shouldAbort: () => true` breaks the loop and skips remaining batches + inter-batch delays (`tests/batch-processor.vitest.ts` — currently zero `shouldAbort` hits) [P2-test] {confirmed-by-code} <trace: 018 P2 #2, 4 lin / 3 models; `grep shouldAbort tests/` returns only handler/launcher files>.
- [ ] T015 [P] Add a `job-store` test for the `isCancelRequestedFast` Set lifecycle: `requestCancel` populates → returns `true`; every terminal transition (`completeJob`, `resetRunningJobsForKind`, and `setJobState('failed')` after T012) clears it (`tests/job-store.vitest.ts`) [P2-test] {confirmed-by-code} <trace: 018 P2 #2; real Set semantics never asserted; handler test mocks the helper as a `vi.fn`>.
- [ ] T016 [P] (Optional) De-dup the causal-edges import — use the static `causalEdges.*` bound at `:32` and drop the dynamic `await import('../lib/storage/causal-edges.js')` (`handlers/memory-index.ts:1291`); and pass `{ isCancelled: () => ctx.isCancelled?.() ?? false }` to `runNearDuplicateRepairBackfill()` for parity with `:1257` (`:1261`) IF the callee accepts it, else document the bounded delay [P2-opt] {confirmed-by-code} <trace: 018 P2 #3 (deepseek-1) + #5 (deepseek-2); redundant module ref; cancel-hook asymmetry>.
<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
### Workstream M5 — [P2-doc] 019 doc reconciliation + optional hardening

> Source: 019 synthesis Confirmed Findings + Remediation Outline #1-#9. Verdict PASS; the P1-escalated cluster was downgraded to P2 (zero runtime impact — predicate reads only `childPid`/`activeUntilMs`).

- [ ] T017 [P] Fix stale file paths: rewrite `mcp_server/bin/lib/model-server-supervision.cjs` → `.opencode/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` → `.opencode/bin/mk-spec-memory-launcher.cjs` in `019-…/spec.md` (§3 ~L114-120), `plan.md` (~L64-65), `tasks.md` [P2-doc] {confirmed-by-code} <trace: 019 P2 high, 5 lin / 4 models; `ls mcp_server/bin` → no such dir; real exports at `.opencode/bin/...`>.
- [ ] T018 [P] Reconcile marker shape: `{…, jobId, …}` → `{…, labels, …}` in `019-…/spec.md:103,132`, and note `labels: string[]` supports reference-counted overlapping maintenance sources [P2-doc] {confirmed-by-code} <trace: 019 P2 high, 5 lin / 4 models; `maintenance-marker.ts:48` writes `labels: activeLabels`; no `jobId` in source or dist>.
- [ ] T019 [P] Reconcile TTL: `60s` → `180s` in `019-…/spec.md` (REQ-001 L132, SC-002 L149, §6 risk L159, In-Scope L103) and `plan.md:55`, citing the live ~79s blocking-tail observation [P2-doc] {confirmed-by-code} <trace: 019 P2 high, 7 lin / 4 models; `maintenance-marker.ts:25` `MAINTENANCE_MARKER_TTL_MS = 180_000`; rationale in impl-summary:56>.
- [ ] T020 [P] Correct the embedding-queue "Known Limitations" bullet 4 (`019-…/implementation-summary.md:104`): rewrite "busy-but-unprotected / follow-on" → "marker-protected per `runBackgroundJob` tick via `beginMaintenance('embedding-queue')`; residual gap is between ticks during a multi-batch drain" [P2-doc] {confirmed-by-code} <trace: 019 P2 high, 5 lin / 3 models; `retry-manager.ts:1038` calls `beginMaintenance('embedding-queue')`, released in `finally` :1055>.
- [ ] T021 [P] Track the extracted module + retry-manager: add `mcp_server/lib/storage/maintenance-marker.ts` (new shared ref-counted writer) and `mcp_server/lib/providers/retry-manager.ts` (new `beginMaintenance` call site) to `019-…/spec.md` §3 Files-to-Change + `plan.md`; update §3/plan prose "inline IIFE" → "shared reference-counted module" [P2-doc] {confirmed-by-code} <trace: 019 P2 high, opus 1/2/3; module is 92 lines, imported by memory-index.ts:13/1502 + retry-manager.ts:15/1038, listed nowhere in §3>.
- [ ] T022 [P] Align test fixtures to the real contract: replace `jobId: '…'` with `labels: ['index_scan']` in `tests/launcher-maintenance-guard.vitest.ts` (type L5-10, fixtures L28-33,127-137) and `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` (L366,430) [P2-test] {confirmed-by-code} <trace: 019 P2 high, opus-2 F004; tests pass either way — contract-documentation hygiene>.
- [ ] T023 [P] (Optional, low value) `maintenance-marker.ts` hardening: dedup `activeLabels` (count map / Set view); `console.warn` on `end()` underflow (`:75`); log when `atomicWriteFile` returns `false` in `writeMarker()` [P2-opt] {confirmed-by-code} <trace: 019 Remediation #7-#9; all cosmetic, none required>.
<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
### Workstream M6 — [P2] 020 test hygiene + doc reconciliation

> Source: 020 synthesis Confirmed Findings + Remediation Outline. Verdict PASS; the four P1-raised items were all verified FALSE-POSITIVE (atomic-write-throw family). DO NOT carry those.

- [ ] T024 Fix the test-reset contract: add `try { rmSync(markerPath(), { force: true }); } catch {}` inside `__resetMaintenanceMarkerForTest()` before clearing in-memory state (`lib/storage/maintenance-marker.ts:87-91`) [P2-test] {confirmed-by-code} <trace: 020 D9, 2 lin; reset clears timer + in-memory state but leaves on-disk `.maintenance-active.json` — highest-value of the 020 code items>.
- [ ] T025 [P] Reconcile the inherited "marker schema unchanged" wording (`020-…/spec.md:108` + impl-summary): scope it to the launcher-read fields (`childPid`, `activeUntilMs`, file/TTL/dir unchanged) and note the auxiliary payload changed `jobId` → `labels[]`; add a one-line scope note that protection covers the background scan + embedding queue, NOT the synchronous foreground scan [P2-doc] {confirmed-by-code} <trace: 020 D5 + D13; inherited 019 drift — reconcile both phases together>.
- [ ] T026 [P] (Optional) 020 residual cosmetic: re-serialize marker on non-final `end()` OR comment `labels[]` is best-effort (`maintenance-marker.ts:72-81`); add a duplicate-label `maintenance-marker.vitest.ts` case + a `memory-index` test asserting the foreground branch writes no marker; one-line refresh-free comment at `retry-manager.ts:1038` [P2-opt] {confirmed-by-code} <trace: 020 D1/D3/D12; all advisory, none required>.
<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:phase-7 -->
### Workstream M7 — [P2] 021 cooperative-heavy-phases instrumentation

> Source: 021 synthesis Confirmed Findings (A1/A2/A4/A5) + Remediation Outline #1-#4. Verdict PASS; the flagship A1 was filed P1 by 3 lineages but DOWNGRADED to P2 (every phase on the branch is bounded or yields). Re-confirm exact line numbers against the live file (`372bb0f2cd` cited 788-790/802) before editing.

- [ ] T027 **[FLAGSHIP]** Hoist `timedPhase` (defined `:1226-1237`) above the `if (files.length === 0)` branch (`:785`) and wrap all four empty-files tail-phase calls — `runGlobalOrphanSweep` (:788), `runPostInsertEnrichmentRepairBackfill` (:789), `runNearDuplicateRepairBackfill` (:790), `runTriggerEmbeddingBackfill` (:802) — in `timedPhase('<phase>', …)` mirroring `:1239/1246/1256/1261` (`handlers/memory-index.ts:785-790,802`) [P2-code] {confirmed-by-code} {needs-in-task-verification: live line numbers} <trace: 021 A1, 4 lin / 2 models; empty-files branch lacks per-phase `phase=… ms=` log (REQ-001) + per-phase `maintenance.refresh()` (REQ-003)>. Effect: restores instrumentation symmetry; makes REQ-003's AC literally true on all reachable paths.
- [ ] T028 [P] Reconcile the doc claim (`021-…/implementation-summary.md:60`, `spec.md:106`, `plan.md`): either ship T027 (which makes the unqualified "each un-yielded tail phase" claim true everywhere — preferred) or qualify to "each un-yielded tail phase **on the main scan path**"; optionally soften "byte-identical" → "behavior-identical" (A3) [P2-doc] {confirmed-by-code} <trace: 021 A2, 2 lin / 2 models; claim is unqualified but holds only on `files.length > 0`>.
- [ ] T029 [P] Capture the near-dup-repair count: assign the `timedPhase('near-dup-repair', …)` return into a new `ScanResults` field (e.g. `nearDuplicateRepaired`) + surface as a scan-response hint, mirroring `postInsertEnrichmentRepaired` (`handlers/memory-index.ts:1261`; apply to both paths if T027 wraps the empty-files near-dup call too) [P2-code] {confirmed-by-code} <trace: 021 A4, 2 lin / 2 models; `:1261` discards the returned repaired-row count, unlike the other 4 `timedPhase` sites>.
- [ ] T030 [P] Resolve the cancel-path counter under-report (`lib/search/trigger-embedding-backfill.ts:248-252,275-279`): lowest-effort = comment at both cancel returns that `pendingRemaining`/`pendingRows` stay 0 by design (next scan reconciles); higher-fidelity = recompute pending counts (`countPendingRows`, :106) before each cancel `return result` [P2-code] {confirmed-by-code} <trace: 021 A5, 3 lin / 2 models; `result` defaults to `emptyResult` 0s at :146, populated only at :271/:336 AFTER the cancel returns>.
- [ ] T031 [P] (Optional cleanup backlog, bundle only if opened) 021 singletons: extract shared `isCancelled` thunk (memory-index.ts :803/:1257, B9); guard trailing `setImmediate` after final chunk (trigger-embedding-backfill.ts :253-258, B10); consolidate `releaseScanLease` to finally-only (B1); TTL-exceeded WARN in `timedPhase` (B5); cancel re-check at cache-hit yield (B6) [P2-opt] {confirmed-by-code} <trace: 021 Remediation #5; all single-model, none gating>.
<!-- /ANCHOR:phase-7 -->
---

<!-- ANCHOR:phase-8 -->
## Phase 3: Verification

### Workstream M8 — Verification & close-out

- [ ] T032 For each code fix: capture the baseline (run the affected vitest suite + record exit code), apply the change, re-run the WHOLE suite, report the delta `baseline N failing {…} → now M: {…}` [verify] {needs-in-task-verification} <trace: regression-baseline-and-delta constitutional rule>.
- [ ] T033 For each doc/metadata reconciliation: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <touched-folder> --strict` and confirm exit 0 [verify] {needs-in-task-verification}.
- [ ] T034 Confirm no rejected/refuted/already-resolved finding was implemented (018 mimo-1 post-restart; 019/020 D6/D7/D8 atomic-write-throw family + foreground-scan marker; 021 B8 deploy-lag, A3 microtask) [verify] {confirmed-by-code} <trace: §3 Out of Scope; each synthesis' Rejected table>.
- [ ] T035 Mark `checklist.md` items `[x]` with evidence; reconcile this packet's completion metadata (spec status, continuity, impl-summary) [verify] {needs-in-task-verification}.
<!-- /ANCHOR:phase-8 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T001 severity-lock resolved and T002 closed at the verified severity (the only P1)
- [ ] Every confirmed synthesis finding mapped to exactly one task (no orphan, no fabrication)
- [ ] All code fixes test-gated with baseline→delta reported
- [ ] All doc/metadata reconciliations validate.sh --strict clean
- [ ] No rejected/refuted finding implemented
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
