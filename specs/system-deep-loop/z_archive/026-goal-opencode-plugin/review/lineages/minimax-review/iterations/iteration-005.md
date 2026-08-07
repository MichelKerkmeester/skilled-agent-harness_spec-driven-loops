# Iteration 005: Maintainability — test architecture and helpers

## Focus

- Dimension: maintainability
- Goal: audit the test suite architecture (8 cjs test files under
  `.opencode/plugins/tests/`) for helper duplication, naming
  consistency, and the planned `node:test` conversion scope (phase 018).

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 8 goal test files + helpers/ + 1 source export
- New findings: P0=0 P1=2 P2=2
- Refined findings: 0
- New findings ratio: 1.0 (4/4 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F017 — `loadPluginModule` and `withState` helpers are duplicated
  across 7 of 8 goal test files** —
  Grep at `iterations/iteration-005.md:18-40` shows
  `loadPluginModule` defined in 8 files (capabilities,
  continuation, export-contract, lifecycle, state, supervisor,
  tool-path, speckit-goal-offer-contract) and `withState` defined
  in 7 files (capabilities, continuation, lifecycle, state,
  supervisor, tool-path — supervisor uses a different `withSupervisor`
  variant but still duplicates `loadPluginModule`).
  Each file's `loadPluginModule` is functionally identical:
  `async function loadPluginModule() { return import(pluginUrl); }`
  with `pluginUrl` derived from `dirname(__filename)`. Phase 018
  (Test Architecture Restructure, currently Planned) is the
  planned remediation; this iteration confirms the duplication
  is exactly the scope the phase 018 spec describes.
  - Category: maintainability
  - Source evidence: `iterations/iteration-005.md:18-40` grep, plus
    the file content read at
    `iterations/iteration-005.md:78-130` showing
    `mk-goal-continuation.test.cjs:19-37` is byte-for-byte
    equivalent to `mk-goal-state.test.cjs:19-37`.
  - Affected surface hints: `["tests/helpers/", "8 goal test files",
    "phase 018 spec"]`

- **F018 — Phase 018's "16-seam pin" narrative is stale; current
  `__test` export has 17 seams** —
  `.opencode/plugins/mk-goal.js:2637-2655` defines
  `__test = Object.freeze({...})` with 17 entries: GoalError,
  accountUsage, buildEnhancedGoalPrompt, clearGoal,
  ensureGoalStateDir, executeGoalAction, executeGoalStatus,
  fsyncDirectory, goalPathForSession, markGoalStatus,
  maybeContinueGoal, maybeVerifyGoal, readGoal, renderGoalInjection,
  sessionKeyForSession, setGoal, writeGoalAtomic.
  `.opencode/plugins/tests/mk-goal-export-contract.test.cjs:30-48`
  asserts exactly these 17. Phase 018's spec
  (`spec.md:189`) and parent's phase-map
  (`spec.md:224`) reference "16-seam pin"; phase 015's
  documentation fix-ups don't list this. The narrative is one
  behind reality (phase 016 added 1, possibly more; phase 018
  needs to update the count, not reconcile to 16).
  - Category: maintainability (with traceability impact)
  - Source evidence: mk-goal.js:2637-2655, export-contract test
    30-48, phase 018 spec.md.
  - Affected surface hints: `["mk-goal.js __test",
    "export-contract test", "phase 018 spec.md", "parent spec.md:224"]`

### P2 Findings

- **F019 — `mk-goal-export-contract.test.cjs` uses a different
  `node:test` import style than the other 7 goal test files** —
  7 files use `const { test } = require('node:test');` (destructured).
  `mk-goal-export-contract.test.cjs:9` uses
  `const test = require('node:test');` (single, non-destructured).
  Both work, but the inconsistency is exactly the kind of minor
  drift that phase 018's node:test conversion should normalize.
  - Category: maintainability
  - Source evidence: grep at `iterations/iteration-005.md:130-138`.
  - Affected surface hints: `["mk-goal-export-contract.test.cjs:9",
    "phase 018 node:test conversion"]`

- **F020 — `tests/helpers/` directory has only one file
  (`continuation-log.cjs`); helper-extraction progress is
  partial** — the directory was created (per its mtime 2026-07-03
  17:24) but the planned `loadPluginModule`, `withState`, and
  `importFreshPlugin` extractions have not landed. Phase 018
  will extract them; this is an advisory recording the current
  state of the partial refactor.
  - Category: maintainability
  - Source evidence: `ls tests/helpers/` output at
    `iterations/iteration-005.md:5-9`.
  - Affected surface hints: `["tests/helpers/continuation-log.cjs",
    "phase 018 helper extraction"]`

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | phase 018 spec.md vs current test files        | 1 stale count (F018); helper extraction pending (F017) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer to iteration 005 in next pass |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer to iteration 009 |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer to iteration 007 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (4/4 novel)
- dimensionsAddressed: maintainability
- noveltyJustification: helper duplication count is novel (audit dossier
  did not enumerate); export-contract seam-count narrative drift is
  novel; helper-extraction progress is partial; test-file import-style
  inconsistency is novel.

## Ruled Out

- The `mk-deep-loop-guard.test.cjs` and `mk-dist-freshness-guard.test.cjs`
  are unrelated to the goal plugin (they test other plugins); they don't
  use `node:test` but are out of phase 018's scope.
- The 7-file `node:test` adoption is consistent across goal-plugin tests;
  not a finding (this is the correct conversion path).

## Dead Ends

- Trying to derive test counts from `node --test` output — the tests
  are run as `node <file>.test.cjs` (not `node --test <file>`) per
  the test patterns at
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/010-security-and-correctness-fixes/implementation-summary.md`
  and other impl-summaries. So per-file `test()` count is the right
  metric, not the `node --test` reporter count.

## Recommended Next Focus

Iteration 006: skill_agent overlay protocol — compare the deep-review
SKILL.md's stated contract (LEAF-only, no sub-dispatch, no WebFetch)
against the deep-review agent's actual definition
(`.opencode/agents/deep-review.md` and any sibling
`.claude/agents/deep-review.md` if present). This is the overlay
protocol the iteration 005/002 deferred.

## Claim Adjudication

```json
{"findingId":"F017","claim":"loadPluginModule and withState helpers are duplicated across 7 of 8 goal test files; phase 018 plans to extract them but the refactor has not landed.","evidenceRefs":[".opencode/plugins/tests/mk-goal-capabilities.test.cjs:20,24",".opencode/plugins/tests/mk-goal-continuation.test.cjs:19,23",".opencode/plugins/tests/mk-goal-export-contract.test.cjs:13",".opencode/plugins/tests/mk-goal-lifecycle.test.cjs:19,23,27",".opencode/plugins/tests/mk-goal-state.test.cjs:19,23",".opencode/plugins/tests/mk-goal-supervisor.test.cjs:19",".opencode/plugins/tests/mk-goal-tool-path.test.cjs",".opencode/plugins/tests/speckit-goal-offer-contract.test.cjs"],"counterevidenceSought":"Re-grepped all 8 goal test files for the helper definitions; confirmed presence in 7 of 8 (supervisor uses withSupervisor instead of withState but still duplicates loadPluginModule).","alternativeExplanation":"Could be intentional pre-refactor state captured in a single PR pre-phase-018; the phase 018 spec describes the exact extraction scope. No contradiction.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the operator considers pre-refactor duplication acceptable until phase 018 runs, downgrade to P2."}
{"findingId":"F018","claim":"Phase 018's '16-seam pin' narrative is stale; current __test export has 17 seams, asserted by the export-contract test.","evidenceRefs":[".opencode/plugins/mk-goal.js:2637-2655",".opencode/plugins/tests/mk-goal-export-contract.test.cjs:30-48",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:224"],"counterevidenceSought":"Re-counted the entries in __test freeze; 17 names listed. Re-read export-contract assertion; exact 17-element array.","alternativeExplanation":"Could be that the '16-seam pin' is a goal, not a current-state claim; the export-contract test currently asserts 17 because phase 016 added 1 without updating the narrative. Phase 018 is supposed to either reduce to 16 (e-2.10 refactor) or update the narrative to 17.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the operator intentionally treats the '16-seam pin' as a forward-looking target, downgrade to P2."}
```

Review verdict: CONDITIONAL