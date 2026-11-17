---
title: Deep Review Strategy - scorer-attach lineage
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across iterations for the scorer-attach fan-out lineage.
version: 1.11.14.0
---

# Deep Review Strategy - scorer-attach lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human
commentary and operator overrides live outside those markers.

---

## 2. TOPIC

Review: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (scorer-attach).
Scope: the 67 `scorer-attach` paths in `review/review-scope.txt` plus the 29 `shared` docs that
describe them — the advisor's command-surfacing surface: `lib/command-attach.ts`, the generated
command tables, `derive-command-bridges.cjs`, the recommend/status handlers, the scorer modules
that gate command rows (`fusion.ts`, `ambiguity.ts`, `doctor-helper-handoff.ts`, `projection.ts`),
the schemas, the generated projection JSON, and their tests and docs.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The doctor command implementations and route manifest content (`doctor-install` lineage owns them);
  this lineage reads them only as context evidence for the derived policy table.
- The hook renderers and session readers (`render-hooks-plugin` lineage owns them); this lineage reads
  `lib/render.ts` only to confirm how a surfaced `policy` reaches a reader.
- The accuracy runner, holdout builder and command transcript scorer (`accuracy-runner` lineage owns
  them); holdout hygiene here means proving this lineage's surface never reads or prints holdout rows.
- The compiled-routing engine internals (`.skilled/bin/lib/compiled-routing/**`); this lineage treats a
  route decision as an input contract.
- No code changes: review is observation-only.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below `convergenceThreshold` 0.10 with no active P0/P1.
- Cap: `maxIterations` 5.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

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
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Executing the shipped module with `node --experimental-strip-types` turned two boundary questions into executed evidence instead of a reading: the `/deep:` bypass and the `/create:skill.md` match both reproduced exactly (iteration 1).
- Diffing the generated tables against their authored sources (`mode-registry.json`, `_routes.yaml`, `command-metadata.json`) proved three "missing row" hypotheses false before they became findings (iteration 1).
- Executing a whole-table invariant instead of reading rows one at a time settled the mutating-command question in one check: 56 rows, 0 `run` with a writing class, 0 policy mismatches between the two generated maps (iteration 2).

---

## 9. WHAT FAILED

- Parsing `command-bridges.generated.json` `commandPolicies` as a runnable-keyed map failed: doctor routes are keyed by bare command (`/doctor:git`) while the derived rows key by runnable (`/doctor:git setup`). Discarded that comparison as a methodology error rather than reporting a false drift (iteration 1).
- Importing `lib/scorer/projection.ts` under `--experimental-strip-types` failed on its `.js` specifier (`ERR_MODULE_NOT_FOUND`), so the bridge-owner completeness check was answered by counting declarations in the file instead of executing it (iteration 2).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories. No review approach was retried after failing; the hypotheses that were eliminated are single-pass ruled-out directions, listed under "Ruled Out Directions" below and enumerated with evidence in `deep-review-dashboard.md` section 10 and the registry `ruledOutCandidates`.]
<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- `/create:skill-parent` reduced to `/create:skill`: ruled out — `-` is a continuation character, and `/create:skill-x` returns no command (iteration 1, evidence: executed `typedCommandIn`).
- Typed command overwritten by compiled enrichment: ruled out by call order at `handlers/advisor-recommend.ts:624-629,699-704` (iteration 1).
- Stale attached command served from cache: ruled out — only the pre-enrichment output is cached and enrichment reruns on a hit (iteration 1).
- `/doctor:install` mislabelled read-only: ruled out against `install.md:5` and the route's `gate3_location` n/a (iteration 2).
- A `mutates` doctor route offered by name through the helper hand-off: ruled out by the `policy === 'run'` filter in `runnableDoctorBridgeId` (iteration 2).
- `COMMAND_POLICIES` and `TRACKED_COMMANDS` disagreeing: ruled out by executed comparison, 0 mismatches (iteration 2).
- Holdout rows leaking through `advisor_status`: ruled out — the status surface reports vector counts, not prompts (iteration 2).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining
- Focus area: synthesis complete; report at `review-report.md`
- Reason: convergence reached at iteration 5 of 5 with no active P0 or P1
- Rotation status: complete
- Blocked/productive carry-forward: no blocked approaches; correctness and security were the productive dimensions
- Required evidence: the findings registry, the five iteration records, and the report
<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `lib/command-attach.ts` (generated `MODE_COMMANDS`, `COMMAND_ROWS`,
  `COMMAND_POLICIES`, `TRACKED_COMMANDS`; `attachCommand`, `typedCommandForTop`, `routeNeedsMode`),
  `handlers/advisor-recommend.ts` (`enrichCompiledRoutes`, `attachTypedCommand`, `publicRecommendation`),
  `lib/scorer/fusion.ts` (`requireCommandPhraseAnchor`, `commandMeaningEligible`, `readOnlyRouteAllowed`,
  `applyDoctorHelperHandoff`, `rankTypedCommandOwnerFirst`), `lib/scorer/ambiguity.ts`,
  `lib/scorer/doctor-helper-handoff.ts`, `schemas/advisor-tool-schemas.ts`,
  `runtime/scripts/command-bridges/*`, `feature-catalog/scorer-fusion/*.md`,
  shared `README.md` / `ARCHITECTURE.md` for the advisor.
- Behavior claims: a single-mode compiled route attaches the hub's slash command; a typed command
  travels through its owner only; policy is `run` only for a read-only or spec-folder-confined
  add-only command; a mutating command is never offered with `run`; a meaning-passed command row
  needs a real cosine of 0.72 and a 0.02 lead; a no-edit prompt rules out every command.
- Reuse and conventions: generated blocks are deriver output, never hand-edited; generated data is
  drift-guarded by `command-bridges-drift-guard.vitest.ts`; `review-core.md` severity/evidence rules.
- Review risks and gaps: `resource-map.md` absent (coverage gate skipped); holdout-bearing scripts
  live outside this lineage; the router's mode selection is an upstream input that was not executed
  (no write-safe way to probe it), so route-dependent findings state the reach condition.
- Out of scope: doctor implementations, hook renderers, accuracy runner, compiled-routing engine.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Route-derived command attachment matches the documented contract except the two P2 deviations recorded in iteration 1. |
| `checklist_evidence` | core | pending | - | No packet checklist claims were in iteration 1's focus. |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | no playbook path in this surface |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `lib/command-attach.ts` | correctness | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `handlers/advisor-recommend.ts` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `lib/scorer/fusion.ts` | correctness (typed-owner ordering) | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `tests/command-attach.vitest.ts` | correctness (case inventory) | 1 | 0 P0, 0 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-attach-1794550137809-1ecgc7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 13 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T06:27:27Z
<!-- MACHINE-OWNED: END -->
