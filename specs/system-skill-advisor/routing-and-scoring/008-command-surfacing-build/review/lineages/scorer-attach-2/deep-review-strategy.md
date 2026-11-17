---
title: Deep Review Strategy - scorer-attach-2 lineage
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across iterations for the scorer-attach fan-out lineage, second pass.
version: 1.11.14.0
---

# Deep Review Strategy - scorer-attach-2 lineage

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

Review pass two of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
(scorer-attach area). Scope: the 71 `scorer-attach` paths and 27 `shared` docs listed in
`review/review-scope-2.txt` — the advisor's command-surfacing surface: `lib/command-attach.ts`,
the generated command tables, `derive-command-bridges.cjs`, the recommend/status handlers, the
scorer modules that gate command rows (`fusion.ts`, `ambiguity.ts`, `doctor-helper-handoff.ts`,
`projection.ts`), the schemas, the generated projection JSON, and their tests and docs.

Pass two has three jobs, in this order: (1) re-read the pass-one fixes in this area and say
whether each holds; (2) review every `yes` file line by line for a defect the fix introduced;
(3) look for new defects in the rest of the area. Pass-one report:
`review/review-report-pass-1.md` (section 3.1 table, section 8 deferred items).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The doctor command implementations and route manifest content (`doctor-install` lineage owns them);
  this lineage reads them only as context evidence for the derived policy table.
- The hook renderers and session readers (`render-hooks-plugin` lineage owns them); `lib/render.ts`
  is read only to confirm how a surfaced `policy` reaches a reader.
- The accuracy runner, holdout builder and command transcript scorer (`accuracy-runner` owns them).
  Holdout hygiene here means proving this lineage's own surface never reads, tunes on or prints
  holdout rows; prompt text is never read or printed, counts only.
- The compiled-routing engine internals (`.skilled/bin/lib/compiled-routing/**`); a route decision is
  an input contract.
- Pass-one findings outside this area, deferred items in the pass-one report section 8, `R4-P2-003`
  and the refuted finding are not re-reported.
- No code changes: review is observation-only.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below `convergenceThreshold` 0.10 with no active P0/P1.
- Cap: `maxIterations` 7.
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
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Locating each pass-one fix by content instead of by its cited line: deleting the `COMMAND_POLICIES` block shortened `command-attach.ts` by about 33 lines, so all three old line numbers were stale and a line-indexed re-read would have reported three phantom "fix missing" findings (iteration 1).
- Running the changed guard file instead of reasoning about it: `command-attach-guards.vitest.ts` + `command-attach.vitest.ts` ran 24 tests green in 1.09s, which is the difference between "the fix is present" and "the fix is pinned" (iteration 1).
- Reading the generator's row-emission function to check the deletion's blast radius: `renderCommandRows` throws on a duplicate or conflicting id, which is what makes the surviving generated table trustworthy after the deleted block (iteration 1).
- Executing the whole-table invariant over the live module instead of reading rows: 56 rows, 19 `run`, 0 `mutates`, and 0 policy/owner mismatches settled the mutating-command question in one probe (iteration 2).
- Comparing the current `NO_EDIT_REQUEST` with its base revision (`git show 35c3188681:…/fusion.ts`) separated a regression from a pre-existing vocabulary gap before writing the finding (iteration 2).
- Counting the generated data before reading the doc: 46 TypeScript-enabled entries and 46 `embeddingText` values settled the pass-one count fix in one probe instead of a paragraph-by-paragraph read (iteration 3).
- Reading the consumer (`render.ts:237-240`) before judging the README's field list: the row-shape omission became a finding only because a live module reads the omitted field (iteration 3).
- Reading the generated-code emitters side by side (`tsString` against `pythonString`) exposed an escape gap that a value-level scan proved latent rather than live (iteration 4).
- Comparing two registries as sets before reading either in prose: 116 leaves and 116 aliases matched both ways, so the leaf surface was cleared in one probe (iteration 5).

---

## 9. WHAT FAILED

- Reading `command-attach.vitest.ts:118-121` as a gate assertion: the line passes a table that does not hold the requested mode, so it never reaches the gate. The reading failed, and the mismatch became finding `SA2-P2-001` rather than a false clean pass (iteration 1).
- Reading the privacy test at `advisor-status.vitest.ts:493` as a leak guard failed: its fixture stores nothing private, so the assertion cannot fail. It became `SA2-P2-003` rather than a clean pass (iteration 2).
- Chasing the phase 002 rollup count (22 start / 15 ask vs today's 20 / 17) stalled: the phase already records an explained variance and no command could be named for the residual move, so it was ruled out rather than reported with weak evidence (iteration 3).
- Reading the changed shared `runtime/lib/README.md` as evidence about this area: its folder inventories are stale, but the gap predates the range and the folder documents itself, so it could not carry a scoped finding (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`advisor_status` leaking holdout prompt text.** No prompt source is read on this surface; the residual is that the privacy test cannot prove it (`SA2-P2-003`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`advisor_status` leaking holdout prompt text.** No prompt source is read on this surface; the residual is that the privacy test cannot prove it (`SA2-P2-003`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`advisor_status` leaking holdout prompt text.** No prompt source is read on this surface; the residual is that the privacy test cannot prove it (`SA2-P2-003`).

### **`commandPolicies` described as a live input.** Ruled out: the README says nothing scores on it, and no source file reads it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`commandPolicies` described as a live input.** Ruled out: the README says nothing scores on it, and no source file reads it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`commandPolicies` described as a live input.** Ruled out: the README says nothing scores on it, and no source file reads it.

### **`hookHealth` schema/emitter mismatch.** Ruled out: six fields on both sides. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`hookHealth` schema/emitter mismatch.** Ruled out: six fields on both sides.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`hookHealth` schema/emitter mismatch.** Ruled out: six fields on both sides.

### **46-row count drift.** Ruled out by executed count: 46 TypeScript-enabled entries, 46 with `embeddingText`, both docs say 46. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **46-row count drift.** Ruled out by executed count: 46 TypeScript-enabled entries, 46 with `embeddingText`, both docs say 46.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **46-row count drift.** Ruled out by executed count: 46 TypeScript-enabled entries, 46 with `embeddingText`, both docs say 46.

### **A `run` row that mutates.** Ruled out by executed enumeration: 19 run rows, 0 `mutates`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `run` row that mutates.** Ruled out by executed enumeration: 19 run rows, 0 `mutates`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `run` row that mutates.** Ruled out by executed enumeration: 19 run rows, 0 `mutates`.

### **A hub activated on a different manifest shape.** Ruled out by key comparison across the three manifests. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A hub activated on a different manifest shape.** Ruled out by key comparison across the three manifests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hub activated on a different manifest shape.** Ruled out by key comparison across the three manifests.

### **A leaf registered at a path that does not exist.** Ruled out by existence check over all 116. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A leaf registered at a path that does not exist.** Ruled out by existence check over all 116.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A leaf registered at a path that does not exist.** Ruled out by existence check over all 116.

### **An alias pointing at a non-leaf or a leaf with no alias.** Ruled out by set comparison both ways. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **An alias pointing at a non-leaf or a leaf with no alias.** Ruled out by set comparison both ways.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An alias pointing at a non-leaf or a leaf with no alias.** Ruled out by set comparison both ways.

### **Cache key missing `surfaceHint` / `compiledRouteTopOnly`.** Ruled out: the cached value is pre-enrichment and enrichment reruns on every read. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Cache key missing `surfaceHint` / `compiledRouteTopOnly`.** Ruled out: the cached value is pre-enrichment and enrichment reruns on every read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cache key missing `surfaceHint` / `compiledRouteTopOnly`.** Ruled out: the cached value is pre-enrichment and enrichment reruns on every read.

### **Deleting `COMMAND_POLICIES` stripped policy from commands only that table held.** Ruled out by the pass-one probe re-check: the live reader is `TRACKED_COMMANDS` (`advisor-recommend.ts:483`) and the generated `TRACKED_COMMANDS` block (`command-attach.ts:123-187`) holds all 62 runnables, including `/create:benchmark`, `/create:command`, `/deep:ai-council`, `/design:chart`, `/design:diagram` and `/design:extract`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Deleting `COMMAND_POLICIES` stripped policy from commands only that table held.** Ruled out by the pass-one probe re-check: the live reader is `TRACKED_COMMANDS` (`advisor-recommend.ts:483`) and the generated `TRACKED_COMMANDS` block (`command-attach.ts:123-187`) holds all 62 runnables, including `/create:benchmark`, `/create:command`, `/deep:ai-council`, `/design:chart`, `/design:diagram` and `/design:extract`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deleting `COMMAND_POLICIES` stripped policy from commands only that table held.** Ruled out by the pass-one probe re-check: the live reader is `TRACKED_COMMANDS` (`advisor-recommend.ts:483`) and the generated `TRACKED_COMMANDS` block (`command-attach.ts:123-187`) holds all 62 runnables, including `/create:benchmark`, `/create:command`, `/deep:ai-council`, `/design:chart`, `/design:diagram` and `/design:extract`.

### **Doc drift between `ARCHITECTURE.md` and the meaning-pass constants.** Ruled out against `fusion.ts:847-848`, `:881`, `:917-918`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Doc drift between `ARCHITECTURE.md` and the meaning-pass constants.** Ruled out against `fusion.ts:847-848`, `:881`, `:917-918`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doc drift between `ARCHITECTURE.md` and the meaning-pass constants.** Ruled out against `fusion.ts:847-848`, `:881`, `:917-918`.

### **Duplicate or conflicting generated row.** Ruled out: both maps throw on conflict. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Duplicate or conflicting generated row.** Ruled out: both maps throw on conflict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicate or conflicting generated row.** Ruled out: both maps throw on conflict.

### **Path traversal through `skill_nodes.source_path` in `readIndexStaleness`.** Read as not a leak: the file is read only to hash it, the hash is compared with a hash from the same database, and no content or path is returned to the caller. A writer of that row already controls the artifact. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Path traversal through `skill_nodes.source_path` in `readIndexStaleness`.** Read as not a leak: the file is read only to hash it, the hash is compared with a hash from the same database, and no content or path is returned to the caller. A writer of that row already controls the artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal through `skill_nodes.source_path` in `readIndexStaleness`.** Read as not a leak: the file is read only to hash it, the hash is compared with a hash from the same database, and no content or path is returned to the caller. A writer of that row already controls the artifact.

### **Phase 002 rollup as a reportable defect.** Not proven: AC-012 already records a variance and its explanation, the residual move has no named command yet, and the requirement allows explained differences. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase 002 rollup as a reportable defect.** Not proven: AC-012 already records a variance and its explanation, the residual move has no named command yet, and the requirement allows explained differences.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 002 rollup as a reportable defect.** Not proven: AC-012 already records a variance and its explanation, the residual move has no named command yet, and the requirement allows explained differences.

### **Policy-ladder doc drift.** Ruled out by direct comparison with `derivePolicy`; all five steps and the `write_scope` conjunct agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Policy-ladder doc drift.** Ruled out by direct comparison with `derivePolicy`; all five steps and the `write_scope` conjunct agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Policy-ladder doc drift.** Ruled out by direct comparison with `derivePolicy`; all five steps and the `write_scope` conjunct agree.

### **Schema stripping an emitted attach field.** Ruled out by field-by-field comparison with `publicRecommendation`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Schema stripping an emitted attach field.** Ruled out by field-by-field comparison with `publicRecommendation`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Schema stripping an emitted attach field.** Ruled out by field-by-field comparison with `publicRecommendation`.

### **Silent policy default in the deriver.** Ruled out: every branch either derives a policy or throws. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Silent policy default in the deriver.** Ruled out: every branch either derives a policy or throws.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Silent policy default in the deriver.** Ruled out: every branch either derives a policy or throws.

### **Stale `feature-catalog` count.** Ruled out: the doc's "17 cases" matches the 17 `it(` blocks in `command-meaning-anchor.vitest.ts`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Stale `feature-catalog` count.** Ruled out: the doc's "17 cases" matches the 17 `it(` blocks in `command-meaning-anchor.vitest.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale `feature-catalog` count.** Ruled out: the doc's "17 cases" matches the 17 `it(` blocks in `command-meaning-anchor.vitest.ts`.

### **The `COMMAND_POLICIES` deletion removing policy from row-less commands.** Ruled out: policy travels in `TRACKED_COMMANDS`, 0 mismatches against rows for the 52 commands that have both. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The `COMMAND_POLICIES` deletion removing policy from row-less commands.** Ruled out: policy travels in `TRACKED_COMMANDS`, 0 mismatches against rows for the 52 commands that have both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `COMMAND_POLICIES` deletion removing policy from row-less commands.** Ruled out: policy travels in `TRACKED_COMMANDS`, 0 mismatches against rows for the 52 commands that have both.

### **The deep-loop gate can be opened by a non-deep-loop hub.** Ruled out at `command-attach.ts:343`; only `skillId === 'system-deep-loop'` enters the branch, and the one test that asserts the general case is the vacuous line reported above (which is why the gap is a test finding, not a code finding). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The deep-loop gate can be opened by a non-deep-loop hub.** Ruled out at `command-attach.ts:343`; only `skillId === 'system-deep-loop'` enters the branch, and the one test that asserts the general case is the vacuous line reported above (which is why the gap is a test finding, not a code finding).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The deep-loop gate can be opened by a non-deep-loop hub.** Ruled out at `command-attach.ts:343`; only `skillId === 'system-deep-loop'` enters the branch, and the one test that asserts the general case is the vacuous line reported above (which is why the gap is a test finding, not a code finding).

### **The no-edit gate can create a false `needsMode` label.** Ruled out: `attachCommand` only reaches the gate after `route.action === 'route'` (`command-attach.ts:316`), while `routeNeedsMode` requires `defer` or `clarify` (`:364`), so the two cannot both fire for one route. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The no-edit gate can create a false `needsMode` label.** Ruled out: `attachCommand` only reaches the gate after `route.action === 'route'` (`command-attach.ts:316`), while `routeNeedsMode` requires `defer` or `clarify` (`:364`), so the two cannot both fire for one route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The no-edit gate can create a false `needsMode` label.** Ruled out: `attachCommand` only reaches the gate after `route.action === 'route'` (`command-attach.ts:316`), while `routeNeedsMode` requires `defer` or `clarify` (`:364`), so the two cannot both fire for one route.

### **The no-edit gate silently withholds a command the reader typed.** Ruled out by design: `typedCommandForTop` (`command-attach.ts:239`) does not consult `NO_EDIT_REQUEST`, so an explicitly typed command still travels; `AGENTS.md:68` states an explicit instruction outranks the policy. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The no-edit gate silently withholds a command the reader typed.** Ruled out by design: `typedCommandForTop` (`command-attach.ts:239`) does not consult `NO_EDIT_REQUEST`, so an explicitly typed command still travels; `AGENTS.md:68` states an explicit instruction outranks the policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The no-edit gate silently withholds a command the reader typed.** Ruled out by design: `typedCommandForTop` (`command-attach.ts:239`) does not consult `NO_EDIT_REQUEST`, so an explicitly typed command still travels; `AGENTS.md:68` states an explicit instruction outranks the policy.

### `agent_cross_runtime` — partial. The attach contract is runtime-agnostic (no runtime branch in `command-attach.ts` or `derive-command-bridges.cjs`); cross-runtime behaviour was exercised in pass one and is not re-scored here. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime` — partial. The attach contract is runtime-agnostic (no runtime branch in `command-attach.ts` or `derive-command-bridges.cjs`); cross-runtime behaviour was exercised in pass one and is not re-scored here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` — partial. The attach contract is runtime-agnostic (no runtime branch in `command-attach.ts` or `derive-command-bridges.cjs`); cross-runtime behaviour was exercised in pass one and is not re-scored here.

### `checklist_evidence` — pending. No checklist claim in focus. -- BLOCKED (iteration 4, 2 attempts)
- What was tried: `checklist_evidence` — pending. No checklist claim in focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — pending. No checklist claim in focus.

### `checklist_evidence` — pending. No packet checklist claim was in focus. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: `checklist_evidence` — pending. No packet checklist claim was in focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — pending. No packet checklist claim was in focus.

### `checklist_evidence` — pending. No packet checklist claim was in this iteration's focus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` — pending. No packet checklist claim was in this iteration's focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — pending. No packet checklist claim was in this iteration's focus.

### `feature_catalog_code` — partial (unchanged from iteration 3; the changed feature doc matches the code). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code` — partial (unchanged from iteration 3; the changed feature doc matches the code).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — partial (unchanged from iteration 3; the changed feature doc matches the code).

### `feature_catalog_code` — partial (unchanged from iteration 3). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code` — partial (unchanged from iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — partial (unchanged from iteration 3).

### `feature_catalog_code` — partial. `command-meaning-matching.md` matches the code on every checked claim: constants `COMMAND_MEANING_MIN_COSINE = 0.72` and `COMMAND_MEANING_MARGIN = 0.02` (`fusion.ts:847-848`), function names `requireCommandPhraseAnchor` (`:886`), `commandMeaningEligible` (`:876`), `rankMeaningPassedCommandFirst` (`:1061`), the `NO_EDIT_REQUEST` examples, the "17 cases" count in `command-meaning-anchor.vitest.ts`, and the `capture-command-routing-baseline.mjs --real-embedding` claims (`:89`, `:159`, `:682-683`). One row-shape drift sits in the sibling doc, reported as `SA2-P2-004`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` — partial. `command-meaning-matching.md` matches the code on every checked claim: constants `COMMAND_MEANING_MIN_COSINE = 0.72` and `COMMAND_MEANING_MARGIN = 0.02` (`fusion.ts:847-848`), function names `requireCommandPhraseAnchor` (`:886`), `commandMeaningEligible` (`:876`), `rankMeaningPassedCommandFirst` (`:1061`), the `NO_EDIT_REQUEST` examples, the "17 cases" count in `command-meaning-anchor.vitest.ts`, and the `capture-command-routing-baseline.mjs --real-embedding` claims (`:89`, `:159`, `:682-683`). One row-shape drift sits in the sibling doc, reported as `SA2-P2-004`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — partial. `command-meaning-matching.md` matches the code on every checked claim: constants `COMMAND_MEANING_MIN_COSINE = 0.72` and `COMMAND_MEANING_MARGIN = 0.02` (`fusion.ts:847-848`), function names `requireCommandPhraseAnchor` (`:886`), `commandMeaningEligible` (`:876`), `rankMeaningPassedCommandFirst` (`:1061`), the `NO_EDIT_REQUEST` examples, the "17 cases" count in `command-meaning-anchor.vitest.ts`, and the `capture-command-routing-baseline.mjs --real-embedding` claims (`:89`, `:159`, `:682-683`). One row-shape drift sits in the sibling doc, reported as `SA2-P2-004`.

### `feature_catalog_code` — pending for `feature-catalog/scorer-fusion/command-meaning-matching.md`, which is the changed doc in this area; scheduled for the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` — pending for `feature-catalog/scorer-fusion/command-meaning-matching.md`, which is the changed doc in this area; scheduled for the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — pending for `feature-catalog/scorer-fusion/command-meaning-matching.md`, which is the changed doc in this area; scheduled for the traceability iteration.

### `feature_catalog_code` — pending; `command-meaning-matching.md` and the command-bridges README are the traceability iteration's job. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` — pending; `command-meaning-matching.md` and the command-bridges README are the traceability iteration's job.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — pending; `command-meaning-matching.md` and the command-bridges README are the traceability iteration's job.

### `playbook_capability` — notApplicable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability` — notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — notApplicable.

### `skill_agent` — notApplicable for this surface (no agent definition is routed by command attachment). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent` — notApplicable for this surface (no agent definition is routed by command attachment).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — notApplicable for this surface (no agent definition is routed by command attachment).

### `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable (no playbook surface in a command-attach test). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable (no playbook surface in a command-attach test).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable (no playbook surface in a command-attach test).

### `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable. -- BLOCKED (iteration 4, 3 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable.

### `spec_code` — partial (unchanged from iteration 3; no new spec claim read this iteration). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` — partial (unchanged from iteration 3; no new spec claim read this iteration).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial (unchanged from iteration 3; no new spec claim read this iteration).

### `spec_code` — partial (unchanged; no new spec claim was read). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code` — partial (unchanged; no new spec claim was read).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial (unchanged; no new spec claim was read).

### `spec_code` — partial. Generated `commandPolicies` holds 69 records over 44 unique commands (SC-001's 44) and the strictest-route rollup is 7 `run` / 20 `start` / 17 `ask` against phase 002's recorded 7 / 22 / 15. The difference was already recorded at phase close (`002/acceptance-criteria.md:65` printed ask 16, run 7, start 21 and explained `/design:extract`), and the current table shows one further start→ask move whose cause was not proven in this iteration; recorded under Ruled Out rather than reported. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` — partial. Generated `commandPolicies` holds 69 records over 44 unique commands (SC-001's 44) and the strictest-route rollup is 7 `run` / 20 `start` / 17 `ask` against phase 002's recorded 7 / 22 / 15. The difference was already recorded at phase close (`002/acceptance-criteria.md:65` printed ask 16, run 7, start 21 and explained `/design:extract`), and the current table shows one further start→ask move whose cause was not proven in this iteration; recorded under Ruled Out rather than reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial. Generated `commandPolicies` holds 69 records over 44 unique commands (SC-001's 44) and the strictest-route rollup is 7 `run` / 20 `start` / 17 `ask` against phase 002's recorded 7 / 22 / 15. The difference was already recorded at phase close (`002/acceptance-criteria.md:65` printed ask 16, run 7, start 21 and explained `/design:extract`), and the current table shows one further start→ask move whose cause was not proven in this iteration; recorded under Ruled Out rather than reported.

### `spec_code` — partial. The `run` policy means "safe to start without asking" and the table honours it; the no-edit wording is narrower than the packet's stated intent, recorded as `SA2-P2-002`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` — partial. The `run` policy means "safe to start without asking" and the table honours it; the no-edit wording is narrower than the packet's stated intent, recorded as `SA2-P2-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial. The `run` policy means "safe to start without asking" and the table honours it; the no-edit wording is narrower than the packet's stated intent, recorded as `SA2-P2-002`.

### `spec_code` — partial. The no-edit rule (R2-P2-001) and the typed-command ownership rule (`typedCommandForTop`, `command-attach.ts:239-246`) are implemented as the pass-one decisions describe. Packet-level acceptance rows were not read this iteration; they are the traceability iteration's job. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` — partial. The no-edit rule (R2-P2-001) and the typed-command ownership rule (`typedCommandForTop`, `command-attach.ts:239-246`) are implemented as the pass-one decisions describe. Packet-level acceptance rows were not read this iteration; they are the traceability iteration's job.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial. The no-edit rule (R2-P2-001) and the typed-command ownership rule (`typedCommandForTop`, `command-attach.ts:239-246`) are implemented as the pass-one decisions describe. Packet-level acceptance rows were not read this iteration; they are the traceability iteration's job.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- No-edit gate creating a false `needsMode`: ruled out — `attachCommand` reaches the gate only on `action=route` while `routeNeedsMode` requires `defer`/`clarify` (`command-attach.ts:316`, `:364`) (iteration 1).
- No-edit gate withholding a typed command: ruled out by design — `typedCommandForTop` does not consult `NO_EDIT_REQUEST` (iteration 1).
- `COMMAND_POLICIES` deletion stripping policy from 11 commands: ruled out — the live reader is `TRACKED_COMMANDS`, which holds all 62 runnables (iteration 1).
- Empty `if` body still present in `fusion.ts`: ruled out by brace scan (iteration 1).
- A `run` row that mutates: ruled out by executed enumeration of `COMMAND_ROWS` (iteration 2).
- `COMMAND_POLICIES` deletion removing policy from row-less commands: ruled out — 63 tracked commands, 11 without a row, 0 policy/owner mismatches for the 52 with both (iteration 2).
- `advisor_status` leaking holdout prompt text: no prompt source is read on that surface (iteration 2).
- Path traversal through `skill_nodes.source_path`: ruled out as a leak — file content is hashed, never returned (iteration 2).
- 46-row count drift: ruled out by executed count in both docs (iteration 3).
- `commandPolicies` described as a live input: ruled out — no reader (iteration 3).
- Policy-ladder doc drift: ruled out against `derivePolicy` step for step (iteration 3).
- Phase 002 rollup drift: not proven, phase already records an explained variance (iteration 3).
- Cache key missing `surfaceHint`/`compiledRouteTopOnly`: ruled out — cached value is pre-enrichment (iteration 4).
- Schema stripping an emitted attach field: ruled out by field comparison (iteration 4).
- Silent policy default in the deriver: ruled out — every branch derives or throws (iteration 4).
- A leaf at a missing path or an orphan alias: ruled out by 116/116 set comparison (iteration 5).
- Divergent activation manifest shape across the three hubs: ruled out by key comparison (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis; the lineage report is `review-report.md` in this directory - Reason: four dimensions plus a cross-cutting sweep are covered, this iteration produced no new finding, and `newFindingsRatio` is 0.00 against the 0.10 threshold - Rotation status: complete - Blocked/productive carry-forward: no blocked approach; correctness and traceability were the productive dimensions - Required evidence: the five iteration records, the registry, and the strategy's running counts Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `lib/command-attach.ts` (generated `MODE_COMMANDS`, `COMMAND_ROWS`,
  `TRACKED_COMMANDS`; `attachCommand`, `typedCommandForTop`, `routeNeedsMode`),
  `handlers/advisor-recommend.ts` (`enrichCompiledRoutes`, `attachTypedCommand`,
  `publicRecommendation`), `lib/scorer/fusion.ts` (`requireCommandPhraseAnchor`,
  `commandMeaningEligible`, `readOnlyRouteAllowed`, `applyDoctorHelperHandoff`,
  `rankTypedCommandOwnerFirst`), `lib/scorer/ambiguity.ts`,
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
  live outside this lineage and are never opened for prompt text; the router's mode selection is an
  upstream input that is not executed here, so route-dependent findings state their reach condition.
- Out of scope: doctor implementations, hook renderers, accuracy runner, compiled-routing engine.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | no playbook path in this surface |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated as iterations complete]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `lib/command-attach.ts` | correctness | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `tests/command-attach-guards.vitest.ts` | correctness | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `tests/command-attach.vitest.ts` | correctness | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `scripts/command-bridges/derive-command-bridges.cjs:1100-1274` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `lib/scorer/fusion.ts:660-839` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `handlers/advisor-recommend.ts:420-539` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `handlers/advisor-status.ts` | security | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `tests/handlers/advisor-status.vitest.ts` | security | 2 | 0 P0, 0 P1, 1 P2 | complete |
| `feature-catalog/scorer-fusion/command-meaning-matching.md` | traceability | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `scripts/command-bridges/README.md` | traceability | 3 | 0 P0, 0 P1, 1 P2 | complete |
| `handlers/advisor-recommend.ts` | correctness, maintainability | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `schemas/advisor-tool-schemas.ts` | maintainability | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `scripts/command-bridges/derive-command-bridges.cjs` | correctness, traceability, maintainability | 4 | 0 P0, 0 P1, 1 P2 | complete |
| `lib/scorer/fusion.ts` | correctness, security | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `leaf-manifest.json` / `leaf-aliases.json` | cross-cutting | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `runtime/lib/README.md` (shared) | cross-cutting | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `ARCHITECTURE.md` (shared, command rows) | cross-cutting | 5 | 0 P0, 0 P1, 0 P2 | complete |
<!-- /MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-attach-2-1794570021136-noekp0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 13 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T12:45:00Z
<!-- /MACHINE-OWNED: END -->
