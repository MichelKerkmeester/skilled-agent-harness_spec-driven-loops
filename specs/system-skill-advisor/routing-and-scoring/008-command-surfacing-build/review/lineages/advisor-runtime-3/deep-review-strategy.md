# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent review state for the advisor-runtime-3 fan-out lineage. Narrow pass three: review only the changed lines of the files whose area in `review-scope-3.txt` is `advisor-runtime`, plus their callers, and report only defects with a concrete input.

### Review Charter

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder), narrow changed-lines pass over the two remediation commits `ec1869dae8..1ca14a44`.
- Dimensions: correctness, security, traceability, maintainability, one focus per iteration.
- Stop conditions: convergence (weighted new-finding ratio under 0.10 after the second iteration) or `maxIterations=4`.
- Success criteria: every changed line and its callers read; every finding carries `file:line` and a concrete failing input; holdout hygiene proved by a numstat-only check of the sealed file.
- Write surface: this lineage directory only. No code changes, no repo tooling that writes outside it.

---

## 2. TOPIC

Command surfacing, review pass three, advisor-runtime area: the shared no-edit gate (`command-attach.ts`, `scorer/text.ts`, `scorer/fusion.ts`), the subprocess busy scan, the routing-accuracy runners (`command-offer.mjs`, `worktree-restore.mjs`, `run-command-behaviour.mjs`, `score-command-transcripts.mjs`, `capture-command-routing-baseline.mjs`), `measure-brief-cost.mjs`, `derive-command-bridges.cjs`, the OpenCode plugin and the tests the remediation commits changed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting a pass-one or pass-two finding whose fix holds.
- Re-reporting the four items listed under `Verifier follow-ups, coordinator` in `017-review-pass-two-remediation/tasks.md`.
- Duplicating the `doctor-docs` area files (another lineage owns them).
- Reading holdout prompt text. Only counts and a numstat line are permitted.
- Changing code, running builds, the full suite, a daemon or a model CLI.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` under 0.10 at iteration 3 or later with all dimensions covered.
- `maxIterations=4` reached.
- A hard gate failure in the append gateway (exit 2) or a containment breach. Both halt the lineage.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Diff first, then a direct probe of the current function: it showed the T042 narrowing still misses the `make no changes to X` wording class (iteration 1).
- Reading every resolve path in `runSpawnAttempt` before judging the new `sawBusy` flag: it ruled out a lost-retry defect without a test run (iteration 1).
- Comparing each changed export to its caller and its changed test: the three-site fixture chain and the nine-name environment restore were confirmed without widening the read (iteration 2).
- Checking the only two code-executing calls in a backfill against one trust gate: it anchored the security pass to concrete spawn sites rather than to prose (iteration 3).
- Mapping every task line to its changed files in one table, then running the plugin and handler suites: it closed traceability and maintainability without a new read of the whole area (iteration 4).

---

## 9. WHAT FAILED
- Trusting the task's three named scope-limiting cases as proof the class is fixed: the probe found a fourth wording the cases do not cover (iteration 1).
- Treating the catalog pages that name `metadata.compiledRouteSummary` as in scope: the task block marks them as one of the four left items, so they were not reported (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A circular-import defect from `text.ts` importing `command-attach.js`: ruled out because `command-attach.ts` imports nothing. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A circular-import defect from `text.ts` importing `command-attach.js`: ruled out because `command-attach.ts` imports nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A circular-import defect from `text.ts` importing `command-attach.js`: ruled out because `command-attach.ts` imports nothing.

### A comment-hygiene violation in the area: ruled out by the added-line scan. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A comment-hygiene violation in the area: ruled out by the added-line scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A comment-hygiene violation in the area: ruled out by the added-line scan.

### A generated-code injection through a derived string: ruled out by the escaping chain and the round-trip test at `derive-command-bridges-strings.vitest.ts:26-32`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A generated-code injection through a derived string: ruled out by the escaping chain and the round-trip test at `derive-command-bridges-strings.vitest.ts:26-32`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A generated-code injection through a derived string: ruled out by the escaping chain and the round-trip test at `derive-command-bridges-strings.vitest.ts:26-32`.

### A lost `fixture` on a backfilled g2 line: ruled out by the `job.fixture` to `line.fixture` to `lineFixture` chain at the three cited sites. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A lost `fixture` on a backfilled g2 line: ruled out by the `job.fixture` to `line.fixture` to `lineFixture` chain at the three cited sites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A lost `fixture` on a backfilled g2 line: ruled out by the `job.fixture` to `line.fixture` to `lineFixture` chain at the three cited sites.

### A lost-retry defect from the new `sawBusy` flag: ruled out by reading every `resolve` in `runSpawnAttempt` and the retry condition; both paths carry the flag. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A lost-retry defect from the new `sawBusy` flag: ruled out by reading every `resolve` in `runSpawnAttempt` and the retry condition; both paths carry the flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A lost-retry defect from the new `sawBusy` flag: ruled out by reading every `resolve` in `runSpawnAttempt` and the retry condition; both paths carry the flag.

### A missed environment name in the capture restore: ruled out by comparing all nine assignments with `PROJECTED_ENV_NAMES`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missed environment name in the capture restore: ruled out by comparing all nine assignments with `PROJECTED_ENV_NAMES`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missed environment name in the capture restore: ruled out by comparing all nine assignments with `PROJECTED_ENV_NAMES`.

### A plugin consumer broken by removing `compiledRouteSummary`: ruled out by grep and by reading the only metadata consumer (`freshness`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A plugin consumer broken by removing `compiledRouteSummary`: ruled out by grep and by reading the only metadata consumer (`freshness`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plugin consumer broken by removing `compiledRouteSummary`: ruled out by grep and by reading the only metadata consumer (`freshness`).

### A raw line break in a generated bridge literal: ruled out by the escaping chain and the new round-trip test. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A raw line break in a generated bridge literal: ruled out by the escaping chain and the new round-trip test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A raw line break in a generated bridge literal: ruled out by the escaping chain and the new round-trip test.

### A replay from an unmarked checkout: ruled out by reading `backfillRunLog`; the warm and replay calls are inside the `trusted` branch, and the new test proves both fake binaries stay untouched. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A replay from an unmarked checkout: ruled out by reading `backfillRunLog`; the warm and replay calls are inside the `trusted` branch, and the new test proves both fake binaries stay untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A replay from an unmarked checkout: ruled out by reading `backfillRunLog`; the warm and replay calls are inside the `trusted` branch, and the new test proves both fake binaries stay untouched.

### A spawn from an untrusted checkout through the brief path: ruled out by reading `briefDelivered`; it reads transcripts and runs the repo's own approval check, never the checkout's hook or CLI. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A spawn from an untrusted checkout through the brief path: ruled out by reading `briefDelivered`; it reads transcripts and runs the repo's own approval check, never the checkout's hook or CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spawn from an untrusted checkout through the brief path: ruled out by reading `briefDelivered`; it reads transcripts and runs the repo's own approval check, never the checkout's hook or CLI.

### A stderr-scan secrecy leak: ruled out by reading `runSpawnAttempt`; the carried text is local and not placed in the result. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A stderr-scan secrecy leak: ruled out by reading `runSpawnAttempt`; the carried text is local and not placed in the result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stderr-scan secrecy leak: ruled out by reading `runSpawnAttempt`; the carried text is local and not placed in the result.

### A test that cannot fail among the changed tests: ruled out for T006, T027, T028, T045 by naming the change each assertion would catch; the remaining changed tests assert concrete file or value outcomes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A test that cannot fail among the changed tests: ruled out for T006, T027, T028, T045 by naming the change each assertion would catch; the remaining changed tests assert concrete file or value outcomes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A test that cannot fail among the changed tests: ruled out for T006, T027, T028, T045 by naming the change each assertion would catch; the remaining changed tests assert concrete file or value outcomes.

### A wrongly-failing `attachCommand` on the T042 scope-limiting cases: ruled out by running the three test files; the three cases pass. Only the `make no changes` variant fails. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A wrongly-failing `attachCommand` on the T042 scope-limiting cases: ruled out by running the three test files; the three cases pass. Only the `make no changes` variant fails.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A wrongly-failing `attachCommand` on the T042 scope-limiting cases: ruled out by running the three test files; the three cases pass. Only the `make no changes` variant fails.

### An env-projection leak into the caller after scoring: ruled out by iteration 2's read of the `finally` restore and the nine-name comparison. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: An env-projection leak into the caller after scoring: ruled out by iteration 2's read of the `finally` restore and the nine-name comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An env-projection leak into the caller after scoring: ruled out by iteration 2's read of the `finally` restore and the nine-name comparison.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: all four dimensions have at least one pass and the changed-line coverage is complete. - Rotation status: complete. - Blocked/productive carry-forward: none blocked. - Required evidence: registry counts, iteration verdicts, and the synthesis report. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 27 `advisor-runtime` files listed in `review-scope-3.txt`; base commit `ec1869dae8`, HEAD `1ca14a44988d3812ef18d968aba304ed31481648`.
- Behavior claims: `017-review-pass-two-remediation/tasks.md` task lines T003, T004, T005, T010 to T015, T029, T034 to T035, T042 to T045; each fix's verify states its expected output.
- Reuse and conventions: `command-attach.ts` keeps no import so the scorer can import it without a cycle; the shared `isNoEditRequest` is the single pattern source; NUL porcelain keeps paths unquoted; a run log is untrusted input.
- Review risks and gaps: `steer.md` is absent at init, so no lead ruling was available; the coverage-graph seed step was skipped because `upsert.cjs` writes under the spec folder, outside this lineage's write surface, and iteration `graphEvents` carry the graph instead; `resource_map.md` is absent so its coverage gate is skipped.
- Holdout hygiene: `holdout-prompts.jsonl` was checked only by `git diff --numstat`, which printed `0 1`. No row text opened.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 4 | Every changed file maps to a task line; T042 intent partly met (AR3-P2-001). |
| `checklist_evidence` | core | pass | 4 | Six suites (114 tests), plugin suite (43 tests) and the handler/hook suites (36 tests) passed; no failed tests. |
| `skill_agent` | overlay | pass | 4 | Plugin field tests T027/T028/T045 assert command, policy and owner. |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent file in the advisor-runtime area. |
| `feature_catalog_code` | overlay | notApplicable | - | Catalog files belong to the doctor-docs area. |
| `playbook_capability` | overlay | notApplicable | - | Playbook files belong to the doctor-docs area. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/plugins/system-skill-advisor.js | D3, D4 | 4 | 0 | complete |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | D3, D4 | 4 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | D1 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts | D1 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | D1 | 2 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs | D1, D2 | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | D1 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts | D3, D4 | 4 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts | D1 | 1 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts | D1 | 2 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/derive-command-bridges-strings.vitest.ts | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts | D3, D4 | 4 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts | D3, D4 | 4 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts | D1 | 2 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/read-only-explainer.vitest.ts | D1 | 1 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts | D1 | 1 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/worktree-restore.vitest.ts | D1 | 2 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-advisor-runtime-3-1794593402980-zhrui5, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T18:12:09Z
<!-- MACHINE-OWNED: END -->
