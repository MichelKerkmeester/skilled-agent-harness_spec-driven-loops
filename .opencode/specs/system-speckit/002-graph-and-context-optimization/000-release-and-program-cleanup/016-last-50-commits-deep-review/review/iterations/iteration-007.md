# Iteration 007 — Test Integrity & Verification Honesty (dimension: maintainability, angle A6)

## Dispatcher
- **Run:** 7 of 20
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** maintainability
- **Angle:** A6 — test integrity & verification honesty (tests that pass WITHOUT asserting real behavior, reduced coverage, dishonest success accounting)
- **Budget profile:** verify (target 11-13 tool calls; evidence rereads + source cross-check of test assertions vs production defaults)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-007.md` + `deltas/iter-007.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, findings-registry, or config.

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` (498 lines, full read) — socketPath bridge test timing.
- `.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts` (667 lines, full read) — auto-fix default coverage.
- `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts` (225 lines, full read) — contradiction-cycle coverage depth.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (513 lines, full read) — non-zero-exit / timeout accounting.
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` (419 lines, full read) — failure-accounting test assertions.
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` (1298 lines, full read) — fixture realism.
- **Source cross-checks (read-only context):** `handlers/quality-loop.ts:55,590-591`; `lib/search/search-flags.ts:168-172`; `scripts/fanout-pool.cjs:65,94-217`.

## Findings — New

### P0 Findings
None.

### P1 Findings

1. **Auto-fix DEFAULT-ON path is effectively untested; every auto-fix test forces `mode:'full-auto'` or `SPECKIT_QUALITY_AUTO_FIX='false'`, never the production default** — `tests/quality-loop.vitest.ts:438,461,479,489,498,499,506,521,529,536,552` + `tests/memory-save-pipeline-enforcement.vitest.ts:488,1052` — Production resolves auto-fix as `autoFixEnabled = mode === 'full-auto' || isQualityAutoFixEnabled()` (`handlers/quality-loop.ts:591`), and `isQualityAutoFixEnabled()` is **default-TRUE** (`lib/search/search-flags.ts:168` "Default: TRUE (graduated)"). So in real saves with NO env set and the planner default `mode:'advisory'` (`quality-loop.ts:590`), auto-fix STILL runs. Yet every test that exercises auto-fix passes an explicit `mode:'full-auto'` (lines 479,489,506,529,536,552 in quality-loop; 521,536,553 in pipeline-enforcement), and every advisory test sets `SPECKIT_QUALITY_AUTO_FIX='false'` to "isolate the advisory (no-auto-fix) path" (quality-loop:461,498; pipeline:488,1052). No test runs the actual production configuration: `mode` unset/advisory AND `SPECKIT_QUALITY_AUTO_FIX` unset (default true). The branch `mode !== 'full-auto' && isQualityAutoFixEnabled() === true` — the one real users hit — has zero coverage. A regression making advisory mode silently swallow the env-driven auto-fix (or vice versa) would pass the entire suite green.

```json
{
  "id": "F-A6-01",
  "type": "test-coverage-gap",
  "claim": "The production-default auto-fix path (mode advisory + SPECKIT_QUALITY_AUTO_FIX unset=true) is never exercised; auto-fix tests force full-auto and advisory tests force the env to false, so the OR-branch real users hit is untested.",
  "evidenceRefs": [
    "handlers/quality-loop.ts:590 (mode = options?.mode ?? 'advisory')",
    "handlers/quality-loop.ts:591 (autoFixEnabled = mode === 'full-auto' || isQualityAutoFixEnabled())",
    "lib/search/search-flags.ts:168-172 (SPECKIT_QUALITY_AUTO_FIX Default: TRUE)",
    "tests/quality-loop.vitest.ts:461 + 498 (advisory tests set SPECKIT_QUALITY_AUTO_FIX='false')",
    "tests/quality-loop.vitest.ts:479,489,506,529,536,552 (auto-fix tests pass mode:'full-auto')",
    "tests/memory-save-pipeline-enforcement.vitest.ts:488,1052 (advisory tests force env false); 521,536,553 (force full-auto)"
  ],
  "counterevidenceSought": "Grepped both test files + pipeline-enforcement for any runQualityLoop call with neither mode:'full-auto' nor SPECKIT_QUALITY_AUTO_FIX set. The bare-default calls that exist (quality-loop:451 'passes immediately', 570 'includes all fix descriptions', pipeline:984,1130) all use HIGH-quality content that PASSES on attempt 1, so auto-fix never engages and the env-default branch is never observed doing work.",
  "alternativeExplanation": "If isQualityAutoFixEnabled() were default-FALSE, advisory+unset would correctly skip auto-fix and the coverage gap would be benign. REFUTED: search-flags.ts:168 documents default TRUE.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if a separate suite (search-flags or rollout-policy unit tests) asserts that the default-true env actually drives auto-fix through runQualityLoop end-to-end; not found in the A6 target set, so left at P1."
}
```
- **Finding class:** test-coverage-gap (reduced coverage of the shipped default config).
- **Scope proof:** Both test files are in the diff range (`git diff --name-only` hit). The OR-branch is the literal production code path (`quality-loop.ts:591`). Gap is the absence of a test, evidenced by exhaustive read of every `runQualityLoop` call site in both files.
- **Affected surface hints:** `handlers/quality-loop.ts` runQualityLoop; `lib/search/search-flags.ts` isQualityAutoFixEnabled; any save routed through the planner default with no env override.

### P2 Findings

1. **relation-backfill-conflict only tests the 2-node reciprocal pair; the charter's 3-node transitive contradiction cycle is NOT covered here** — `tests/relation-backfill-conflict.vitest.ts:87-101,128-148` — `seedReciprocalLineage` seeds exactly one directed pair (20→21) where lineage emits `caused` and supersession emits `contradicts` on the SAME pair (a 2-node reciprocal conflict). Cases (a),(b),(c),(d) all reuse this single 2-node fixture. There is no fixture creating a transitive cycle (A→B caused, B→C caused, A→C contradicts, i.e. a 3-node contradiction across an inferred path) that the strategy's A3 charter (`relation-backfill.ts ~670-709`, `contradiction-detection.ts`) calls out. The conflict guard is proven only for the directly-reciprocal case; multi-hop contradiction invalidation is unverified by THIS suite.

```json
{
  "id": "F-A6-02",
  "type": "test-coverage-gap",
  "claim": "relation-backfill-conflict.vitest.ts covers only the 2-node reciprocal conflict; the 3-node transitive contradiction cycle named in the A3 charter is not tested in this file.",
  "evidenceRefs": [
    "tests/relation-backfill-conflict.vitest.ts:84-101 (seedReciprocalLineage: single 20<->21 pair)",
    "tests/relation-backfill-conflict.vitest.ts:128,150,172,184 (all cases reuse the 2-node fixture)",
    "deep-review-strategy.md:17 (A3 charter names '3-node transitive contradiction cycles')"
  ],
  "counterevidenceSought": "Checked all 5 cases (a-e) in the file; none seed a 3-node chain. Did NOT exhaustively read the sibling relation-backfill-similarity.vitest.ts / relation-backfill-unit.vitest.ts (out of this iteration's named target set) — a 3-node cycle test MAY exist there. P2 not P1 because coverage may live in a sibling suite and the 2-node guard IS solid.",
  "alternativeExplanation": "Transitive 3-node contradiction may be impossible by the inference rules (lineage/supersession only ever emit single-pair edges), making the 3-node case non-applicable rather than a gap. Not confirmed; flagged for A3 follow-up.",
  "finalSeverity": "P2",
  "confidence": 0.6,
  "downgradeTrigger": "Drop entirely if relation-backfill-unit/similarity suites cover the 3-node cycle OR if the inference rules provably cannot produce a transitive contradiction."
}
```
- **Finding class:** test-coverage-gap (advisory; bounded by what this single file asserts).
- **Scope proof:** File in diff range; assertion gap shown by reading all 5 `it()` blocks and the only seed helper.
- **Affected surface hints:** `lib/causal/relation-backfill.ts` conflict guard; `lib/graph/contradiction-detection.ts`; sibling backfill suites for cross-check.

2. **memory-save-pipeline-enforcement keeps fixtures repo-relative (not os.tmpdir) and the comment admits the gate is too coarse to fix in-test — a documented test/product seam, not a false-pass** — `tests/memory-save-pipeline-enforcement.vitest.ts:33-46,287-291` — Fixture realism is GOOD overall: `buildValidPipelineMemory` produces full frontmatter + all mandatory sections/anchors, and gate-ordering proofs (lines 1079-1117) assert the REAL pipeline status (`rejected` + `rejectionCode`/`rejectionReason`), not just non-throwing. Two honesty caveats worth recording: (i) the fixture root must stay under `process.cwd()` because `ALLOWED_BASE_PATHS` rejects `os.tmpdir()` unless `MEMORY_BASE_PATH` is set (lines 36-46) — the test writes `tmp-test-fixtures-*` into the working tree, a leakage/realism compromise the comment honestly documents; (ii) several cross-gate assertions are guarded by `if (result.passed)` / `if (!result.warnOnly)` / `if (result.rejectionCode)` (lines 683,703,1021,1044,1073,1097,1114) so they become no-ops when the precondition does not hold — defensible for OR-logic boundary cases but means a silent behavior shift inside those branches would not fail the test.

```json
{
  "id": "F-A6-03",
  "type": "test-realism-caveat",
  "claim": "pipeline-enforcement fixtures are realistic and assert real pipeline status, but (i) fixtures write into the repo working tree due to ALLOWED_BASE_PATHS, and (ii) ~7 conditional-guarded assertions no-op when their precondition is false.",
  "evidenceRefs": [
    "tests/memory-save-pipeline-enforcement.vitest.ts:36-46 (mkdtemp under process.cwd(), comment explains ALLOWED_BASE_PATHS)",
    "tests/memory-save-pipeline-enforcement.vitest.ts:683,703,1021,1044,1073,1097,1114 (if-guarded assertions)",
    "tests/memory-save-pipeline-enforcement.vitest.ts:1079-1117 (strong gate-ordering proofs asserting real status)"
  ],
  "counterevidenceSought": "Read the golden-path + all 8 categories; the suite is NOT a rubber-stamp — Cat 6 gate-ordering proofs and Cat 1 parser rejections assert concrete statuses/codes. The conditional guards are confined to OR-logic boundary tests where the branch genuinely may not fire.",
  "alternativeExplanation": "The if-guards are correct defensive testing of nondeterministic-boundary OR-logic, not dishonesty. Repo-relative fixtures are an accepted, documented constraint, not a coverage hole.",
  "finalSeverity": "P2",
  "confidence": 0.7,
  "downgradeTrigger": "Informational; no action required if maintainers accept the documented ALLOWED_BASE_PATHS constraint and the OR-logic guards."
}
```
- **Finding class:** test-realism-caveat (advisory hygiene note).
- **Scope proof:** File in diff range; both caveats quoted from the file itself.
- **Affected surface hints:** `handlers/memory-save.ts` ALLOWED_BASE_PATHS; OR-logic in `memory-sufficiency` / `save-quality-gate`.

## Traceability Checks
- **Iteration number:** JSONL `deep-review-state.jsonl` had `type:"iteration"` lines for iters 1-2 (iter-001.md, iter-002.md present) but this is a PARALLEL dispatch writing only `deltas/iter-007.jsonl`; dispatch-assigned iteration = 7. Per parallel-safety contract I do NOT append to the shared state.jsonl, so the derive-from-JSONL rule is superseded by the explicit parallel dispatch number. Recorded as edge case 1.
- **A6 charter alignment:** All four charter A6 sub-claims addressed — un-skipped launcher-lease timing (ruled out, see Ruled Out #1), auto-fix-default coverage (F-A6-01 P1), contradiction-cycle gap (F-A6-02 P2), fan-out non-zero-exit accounting (ruled out, see Ruled Out #2). Strategy line 29 mapped 1:1.
- **Memory cross-check:** `deep-loop-fanout-spawnsync-serialization` memory ("non-zero-exit-counted-as-success") was the prior-state concern; current code at `fanout-run.cjs:463-480` THROWS on non-zero/timeout and `fanout-pool.cjs:209-210` counts only `fulfilled` as succeeded → the memory's concern is REFUTED for HEAD. Recorded under Ruled Out #2.

## Integration Evidence
- **Cross-file source verification (read-only):** Confirmed the test-honesty findings against actual production code, not just the tests: `handlers/quality-loop.ts:590-591` (mode/auto-fix resolution), `lib/search/search-flags.ts:168-172` (default-TRUE flag), `scripts/fanout-pool.cjs:94,108-112,209-217` (fulfilled-vs-rejected settlement → summary.succeeded/failed/all_failed → process exit code). These are the integration touchpoints that make the test assertions meaningful; named explicitly per the integration-naming gate.

## Edge Cases
1. **Parallel-dispatch iteration numbering:** This run writes `deltas/iter-007.jsonl` only and must NOT touch `deep-review-state.jsonl` (concurrent agents). The JSONL-derive rule (count `type:"iteration"` lines) would yield a different number under parallelism; the explicit dispatch number 7 governs. No mutation of shared state attempted. This is the safest in-scope interpretation.
2. **fanout-run.cjs current-state vs memory:** The flagged memory described a PRIOR defect. Reading HEAD shows the defect is fixed AND tested. I report the REFUTATION (not a finding) rather than parroting the memory — implementation evidence beats stale note.
3. **3-node contradiction cycle (F-A6-02) may live in a sibling suite** not in this iteration's named target set (`relation-backfill-unit/similarity.vitest.ts`). Kept at P2 with explicit downgradeTrigger rather than asserting a hard gap I could not fully disprove within budget.
4. **Conditional-guarded assertions** in pipeline-enforcement could mask in-branch regressions, but they guard genuine OR-logic boundaries; recorded as a realism caveat (P2), not inflated to a false-pass P1.

## Confirmed-Clean Surfaces
- **`tests/launcher-lease.vitest.ts` socketPath bridge test (lines 465-497):** the dispatch hypothesis of a "socket-listen timing race making the bridge test false-pass" is **DISPROVEN**. The test explicitly gates on the daemon actually listening before the secondary probes: `await waitFor(() => existsSync(ownerSocket) ...)` (line 477) AND `await waitFor(() => first.stderr.includes('STUB_DAEMON_LISTENING') ...)` (line 478), where the stub only emits `STUB_DAEMON_LISTENING` inside `server.listen(...)`'s callback (lines 69) — i.e. AFTER the socket is bound and listening. The secondary launcher is spawned (line 485) only after both waits resolve. There is no listen-timing race; the test correctly serializes bind→probe.
- **`fanout-run.cjs` exit/timeout accounting (lines 463-482) + its test (lines 233-313):** non-zero CLI exit and SIGTERM-timeout are BOTH classified as failure (throw → pool `rejected` → `summary.failed`), and the test asserts exit 3 / exit 2 / `all_failed` / `succeeded`/`failed` counts with real failing+sleeping stub binaries. Honest accounting confirmed; not a false-pass.

## Ruled Out
1. **launcher-lease socketPath bridge false-pass (listen-timing race)** — RULED OUT. Evidence: `launcher-lease.vitest.ts:69,477-478,485` (STUB_DAEMON_LISTENING emitted from inside listen callback; test waits for both socket existence and the listening log before spawning the secondary). No race; the bridge assertion (line 494) only runs after a confirmed-listening owner.
2. **fan-out non-zero-exit / exit-124 timeout counted as success** — RULED OUT for HEAD. Evidence: `fanout-run.cjs:464,471-480` (timedOut = SIGTERM; throw on `timedOut || exitCode !== 0`), `fanout-pool.cjs:108-112,209-210` (rejected workers excluded from succeeded), `fanout-run.vitest.ts:233-312` (asserts exit 3/2 + summary counts). The `deep-loop-fanout-spawnsync-serialization` memory's concern is no longer live.

## Next Focus
- **Dimension:** maintainability
- **Focus area:** A6 continuation — dead-code + advisory-honesty (strategy iter 13), OR adversarial re-verify of F-A6-01 against any search-flags/rollout-policy unit suite that may already cover the default-true auto-fix path end-to-end.
- **Reason:** F-A6-01 (P1) is the only actionable finding from A6; its severity hinges on whether the default-true env-driven auto-fix is tested anywhere outside the A6 target set. Verifying that closes the one open severity question.
- **Rotation status:** A6 test-integrity substantially covered (4/4 charter sub-claims resolved: 1 P1 gap, 1 P2 gap, 2 ruled out). Maintainability dimension remains for dead-code/advisory-honesty pass.
- **Blocked/productive carry-forward:** Productive — F-A6-01 feeds A2 (quality-loop is part of the memory-save pipeline, iter 3 territory); F-A6-02 feeds A3 (relation-backfill conflict guard, iter 4). Neither blocked.
- **Required evidence (next):** grep `search-flags`/`rollout-policy`/`quality-loop` test suites for a `runQualityLoop` call with neither `mode:'full-auto'` nor `SPECKIT_QUALITY_AUTO_FIX` set that observes auto-fix engaging; if found, downgrade F-A6-01 to P2.
- **Recovery note:** n/a (no recovery mode this iteration).
