# Review Report - Command Surfacing, Pass Three (advisor-runtime lineage)

- Run: `fanout-advisor-runtime-3-1794593402980-zhrui5`
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Base / HEAD: `ec1869dae8..1ca14a44988d3812ef18d968aba304ed31481648`
- Lineage artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/advisor-runtime-3`
- Stop reason: `maxIterationsReached` (all four dimensions covered; the config ceiling is 4)

## Executive Summary

- Overall verdict: **PASS**
- hasAdvisories: **true** (one active P2)
- Active findings: P0 0, P1 0, P2 1
- Review scope: the 27 files whose `area` is `advisor-runtime` in `review-scope-3.txt`, reviewed as changed lines plus their callers, per the narrow pass-three instruction.
- Operator review focus: "Code review of command surfacing, PASS THREE (narrow). FIRST read the full instructions in /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3.txt and follow them exactly. Scope file: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-scope-3.txt (area TAB path). Review only the files whose area equals your lineage label without its -3 suffix, by reading git diff ec1869dae8..HEAD for each. Every finding is P0, P1 or P2 with file:line and a concrete input. Never open holdout-prompts.jsonl or read holdout prompt text. Change no code, write only inside your lineage folder."

## Planning Trigger

`/speckit:plan` is not required for this lineage: the verdict is PASS with one advisory. The advisory (`AR3-P2-001`) is a wording edge in the shared no-edit gate and may be scheduled as ordinary follow-up.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "AR3-P2-001",
      "severity": "P2",
      "title": "`make no changes` reads a scope-limiting change request as a no-edit request",
      "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289",
      "findingClass": "class-of-bug",
      "scopeProof": "changed line command-attach.ts:289; consumers text.ts:150, fusion.ts:677, fusion.ts:881",
      "affectedSurfaceHints": ["hub command attachment", "read-only explainer gate", "command-meaning eligibility"],
      "disposition": "advisory"
    }
  ],
  "remediationWorkstreams": [],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["class-of-bug"],
  "affectedSurfacesSeed": ["command attachment", "scorer read-only gate"],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|-----------|----------|--------|--------------------|-------------|---------------|-------------|------------------------|
| AR3-P2-001 | P2 | `make no changes` reads a scope-limiting change request as a no-edit request | correctness | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | `isNoEditRequest('create an agent that refactors the parser internals and make no changes to its public api')` returns `true` on the current source; `attachCommand` then returns `undefined` | A prompt that asks for the change but limits its scope loses the hub command; the same gate suppresses the read-only explainer and command eligibility | Narrow the `make no changes` alternative the way T042 narrowed bare `no changes`, for example require an end-of-prompt or a boundary that excludes `to <object>`, and add the variant to the scope-limiting test list | advisory | class-of-bug | changed line 289; consumers `text.ts:150`, `fusion.ts:677`, `fusion.ts:881` | hub command attachment, read-only explainer gate, command-meaning eligibility |

## Remediation Workstreams

No blocking workstream. Optional advisory:

1. **AR3-P2-001 (P2, optional)** -- add one negative case per scope-limiting `make no changes ...` form to `command-attach-guards.vitest.ts` and narrow the alternative. No other file needs a change because every consumer goes through `isNoEditRequest`.

## Spec Seed

- No spec change is required. If the advisory is taken, state in the no-edit gate contract that a change request may name what must not change, and that only a request to make no change at all suppresses the command.

## Plan Seed

- Optional single task: narrow `make no changes` in `command-attach.ts:289`, add the failing-then-passing scope-limiting cases, and rerun the three command-gate suites.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Every changed production file in the area maps to a task line in `017-review-pass-two-remediation/tasks.md`; the one partial intent, T042, is recorded as AR3-P2-001. |
| `checklist_evidence` | pass | Targeted runs: 56 tests (command gates), 114 tests (runner suites), 36 tests (handler and hook suites) and 43 plugin tests, all passing. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | Plugin field tests T027, T028 and T045 assert command, policy and owner on both the plugin and CLI-fallback paths. |
| `agent_cross_runtime` | notApplicable | No agent file in the `advisor-runtime` area. |
| `feature_catalog_code` | notApplicable | Catalog pages that name `metadata.compiledRouteSummary` belong to other skills and are one of the four items the task block excludes. |
| `playbook_capability` | notApplicable | Playbook files belong to the `doctor-docs` area. |

### AC_COVERAGE

`disabled` for this lineage: the acceptance-coverage signal is an advisory validation rule, and this dispatch forbids running `validate.sh`. No acceptance-coverage claim is made here; the cross-lineage merge and the operator's own validation run own that signal.

## Deferred Items

- AR3-P2-001 is deferred as an advisory.
- The four catalog pages naming `metadata.compiledRouteSummary` are explicitly left by "Verifier follow-ups, coordinator" and are not counted against this lineage.
- The trust marker is a documented file name rather than a secret; the gate stops unprepared checkouts, not a same-user attacker who controls both the log and the folder. This is the accepted T010 design.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: correctness of the shared gate, correctness of the runners, security boundaries, task-line traceability
- Pivot lineage: none (default convergence mode)
- Remaining frontier: none recorded

## Search Ledger

*No search-depth state captured (legacy v1 record).* This lineage used direct diff reads, exact greps, caller tracing and targeted test runs; no v2 search-depth schema was requested.

## Audit Appendix

### Convergence Summary

| Iteration | Dimension | Status | New findings | newFindingsRatio |
|-----------|-----------|--------|--------------|------------------|
| 1 | correctness (library and gates) | complete | 1 P2 | 1.00 |
| 2 | correctness (runners and bridge) | complete | 0 | 0.00 |
| 3 | security | complete | 0 | 0.00 |
| 4 | traceability and maintainability | complete | 0 | 0.00 |

- Dimension coverage: 4 of 4 (correctness, security, traceability, maintainability).
- Required traceability protocols covered: `spec_code`, `checklist_evidence`.
- Stop: `maxIterationsReached` at 4 iterations, with all dimensions covered and no P0 or P1 active.

### Coverage Summary

- 13 changed production files and 14 changed test files in the area were read as diffs; the plugin, handlers and tests were also re-read at their current line numbers.
- Callers checked: `attachCommand` (`handlers/advisor-recommend.ts:474`), `isNoEditRequest` (three scorer sites), `statusSnapshot`/`restoreTurn`, `trustedCheckout`/`replayOffer`/`warmCheckout`, `armFor` (`main`), `lineFixture` (`backfillLog`), `tsString` (generator sites), and the removed plugin metadata field (no runtime reader).

### Ruled-Out Claims

- Circular import from `text.ts` importing `command-attach.js`: `command-attach.ts` has no import.
- Lost retry from `sawBusy`: every resolve path carries the flag.
- Replay from an untrusted checkout: warm and replay are behind `trustedCheckout`.
- Lost g2 fixture: job to line to backfill chain verified.
- Missed capture environment name: all nine assignments match the saved list.
- Generated-code injection through a derived string: `tsString` escapes all four line terminators.
- Plugin consumer broken by the metadata removal: no runtime reader.
- Comment-hygiene violation in the area: the added-line scan found none.

### Holdout Hygiene

`git -c core.fsmonitor=false diff --numstat ec1869dae8..HEAD -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` printed `0 1` (zero added, one deleted). No holdout row text was read or printed, and no command in this lineage opened the sealed file.

### Sources Reviewed

`review-scope-3.txt`, `review-instructions-3.txt`, `017-review-pass-two-remediation/tasks.md` and `spec.md`, the `git diff ec1869dae8..HEAD` for all 27 area files, and the current code at every cited line.

Review verdict: PASS
