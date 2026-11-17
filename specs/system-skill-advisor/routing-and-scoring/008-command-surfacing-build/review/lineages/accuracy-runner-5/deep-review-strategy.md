# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the pass-five `accuracy-runner-5` review lineage. The lineage reviews the routing-accuracy capture and scoring surfaces only: the transcript scorer, the behaviour runner, the arena builder and the docs/tests that describe them. Every finding is P0/P1/P2 with file:line and a concrete input.

### Usage

- Init wrote the topic, dimensions, known context and boundaries below.
- Each iteration reads Next Focus, reviews one dimension, updates the running counts and sets the next focus.
- Mutability: mutable, updated by each iteration. Machine-owned blocks are between explicit markers.

---

## 2. TOPIC

Pass-five code review of the command-surfacing measurement harness: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `run-command-behaviour.mjs`, `prepare-behaviour-arena.mjs`, the two folder READMEs and the two vitest files the pass-five scope lists for this area. Review target is the spec folder `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The `kill-switch-cli`, `vibe-hooks-doctor` and `docs-metadata` areas other lineages own in pass five.
- The advisor's scoring quality itself (routing accuracy, fusion thresholds); this lineage reviews the harness that measures behaviour.
- Any code change. The lineage reports findings only.
- Holdout prompt text: never read, printed or quoted, at any point.

---

## 5. STOP CONDITIONS

- Convergence at `convergenceThreshold` 0.1 or `maxIterations` 4, whichever comes first.
- A P0 finding halts the PASS claim but not the iteration loop.
- Any write outside `review/lineages/accuracy-runner-5/` stops the lineage.

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
- P1 (Required): 3
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Direct import of the scorer's exported facts and a one-shot `node --input-type=module -e` probe turned two suspected counting gaps into observed evidence instead of inference (iteration 1).
- Comparing the write-event producers (`redirectTargets`, `APPLY_PATCH`, `writePaths`) against every shell action that changes a file isolated the invisible-write class in one read (iteration 1).
- Tracing each stated holdout guard to the one lookup every path shares (`findRow`) showed the boundary is fail-closed rather than scattered (iteration 2).
- Reading the arena builder's header promises against its walk (`holdsDotenv`, `copyPath`, `runCp`) isolated three guards that cover only regular files (iteration 2).
- Reading the guard's call site with its `isFirst` flag, then the restore's path basis, showed the no-remote invariant is an arm-opening check rather than a per-turn one (iteration 3).
- Comparing the builder's two halves (`headOf` for tracked files, `copyPlan` for the build) found the provenance claim unenforced in one read (iteration 3).
- Reading the guards test's two arena cases showed the copy path never runs, which ties the whole pass's builder findings to one missing test (iteration 4).

---

## 9. WHAT FAILED

- Treating `firstWritePosition(stream)` and `firstWritePosition(stream, checkoutDir)` as interchangeable: the missing checkout argument narrowed to a scratch-path edge and was ruled out, while the real gap was the absent write event (iteration 1).
- Expecting `workflow.unscored` to be a workflow-path count: it reads the run-level unscored count and only names it again (iteration 1).
- Expecting the chat probe bucket to filter by `split`: every must-not-start row is split `none`, so a `tune` filter would empty the bucket and no holdout row carries that row type (iteration 2).
- Looking for a Vibe multi-turn miscount: the runner mints a fresh session id per row, so a scored session holds one turn (iteration 2).
- Expecting a mid-arm dirty-worktree refusal: the dirty check sits inside the `isFirst` branch, so the README's "before or during its first prompt" is accurate (iteration 3).
- Expecting `command-bridges/README.md` policy or inventory drift: `derivePolicy` and `identityViolations` match the README step for step (iteration 3).
- Expecting `workflow.unscored` to be a dead field: it renames the run-level unscored count inside the workflow block rather than dropping a count (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--set chat` probe bucket and holdout rows: recorded in iteration 2; no holdout row carries that row type. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `--set chat` probe bucket and holdout rows: recorded in iteration 2; no holdout row carries that row type.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--set chat` probe bucket and holdout rows: recorded in iteration 2; no holdout row carries that row type.

### `--set chat` probe bucket missing a `split` filter: no holdout row carries `row_type: must-not-start`, and `lookupPrompt` refuses a holdout id before the turn starts (evidence: counts-only corpus query, `findRow` guard). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `--set chat` probe bucket missing a `split` filter: no holdout row carries `row_type: must-not-start`, and `lookupPrompt` refuses a holdout id before the turn starts (evidence: counts-only corpus query, `findRow` guard).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--set chat` probe bucket missing a `split` filter: no holdout row carries `row_type: must-not-start`, and `lookupPrompt` refuses a holdout id before the turn starts (evidence: counts-only corpus query, `findRow` guard).

### `findRow` parsing a holdout row before refusing it: the parsed text reaches neither a child process nor the run log, and the refusal carries the id only, so no prompt escapes (evidence: `Refusal('holdout_row', ...)`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `findRow` parsing a holdout row before refusing it: the parsed text reaches neither a child process nor the run log, and the refusal carries the id only, so no prompt escapes (evidence: `Refusal('holdout_row', ...)`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `findRow` parsing a holdout row before refusing it: the parsed text reaches neither a child process nor the run log, and the refusal carries the id only, so no prompt escapes (evidence: `Refusal('holdout_row', ...)`).

### `latestLines` collapsing two same-arm captures into one sample: the key is the documented retry rule, and two files holding the same runtime/arm/row/run describe one retried sample rather than two, so no honest count is lost (evidence: `latestLines` key construction, score-command-transcripts.mjs:1509-1517). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `latestLines` collapsing two same-arm captures into one sample: the key is the documented retry rule, and two files holding the same runtime/arm/row/run describe one retried sample rather than two, so no honest count is lost (evidence: `latestLines` key construction, score-command-transcripts.mjs:1509-1517).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `latestLines` collapsing two same-arm captures into one sample: the key is the documented retry rule, and two files holding the same runtime/arm/row/run describe one retried sample rather than two, so no honest count is lost (evidence: `latestLines` key construction, score-command-transcripts.mjs:1509-1517).

### `latestLines` reuse of a same-arm capture: not a security surface; already ruled out in iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `latestLines` reuse of a same-arm capture: not a security surface; already ruled out in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `latestLines` reuse of a same-arm capture: not a security surface; already ruled out in iteration 1.

### `startState` calling `firstWritePosition` without the checkout folder while `workflowPath` passes it: the difference only shows for an absolute write outside the checkout and outside temp, which is a write into somebody else's tree, so counting it as unsafe is the defensible reading (evidence: `insideCheckout`, score-command-transcripts.mjs:670-704). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `startState` calling `firstWritePosition` without the checkout folder while `workflowPath` passes it: the difference only shows for an absolute write outside the checkout and outside temp, which is a write into somebody else's tree, so counting it as unsafe is the defensible reading (evidence: `insideCheckout`, score-command-transcripts.mjs:670-704).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `startState` calling `firstWritePosition` without the checkout folder while `workflowPath` passes it: the difference only shows for an absolute write outside the checkout and outside temp, which is a write into somebody else's tree, so counting it as unsafe is the defensible reading (evidence: `insideCheckout`, score-command-transcripts.mjs:670-704).

### `workflow.unscored` as a dead field: it carries the run-level unscored count and prints it in the workflow block, so it is a duplicate name rather than a dead count (recorded in iteration 1). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `workflow.unscored` as a dead field: it carries the run-level unscored count and prints it in the workflow block, so it is a duplicate name rather than a dead count (recorded in iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `workflow.unscored` as a dead field: it carries the run-level unscored count and prints it in the workflow block, so it is a duplicate name rather than a dead count (recorded in iteration 1).

### `workflow.unscored` printing the run-level unscored count inside the workflow line: the number is the same count named twice, not a miscount (evidence: `tallyBlock`, score-command-transcripts.mjs:1857). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `workflow.unscored` printing the run-level unscored count inside the workflow line: the number is the same count named twice, not a miscount (evidence: `tallyBlock`, score-command-transcripts.mjs:1857).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `workflow.unscored` printing the run-level unscored count inside the workflow line: the number is the same count named twice, not a miscount (evidence: `tallyBlock`, score-command-transcripts.mjs:1857).

### A broad test-only export surface in the scorer: every exported fact is asserted by the scoped test file, so the surface is used rather than speculative. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A broad test-only export surface in the scorer: every exported fact is asserted by the scoped test file, so the surface is used rather than speculative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broad test-only export surface in the scorer: every exported fact is asserted by the scoped test file, so the surface is used rather than speculative.

### A dirty-worktree refusal mid-arm: `runTurn` takes `isFirst` from `index === 0` and the dirty check sits inside that branch, so the README's "before or during its first prompt" is accurate (evidence: `run-command-behaviour.mjs:1266-1281`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A dirty-worktree refusal mid-arm: `runTurn` takes `isFirst` from `index === 0` and the dirty check sits inside that branch, so the README's "before or during its first prompt" is accurate (evidence: `run-command-behaviour.mjs:1266-1281`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dirty-worktree refusal mid-arm: `runTurn` takes `isFirst` from `index === 0` and the dirty check sits inside that branch, so the README's "before or during its first prompt" is accurate (evidence: `run-command-behaviour.mjs:1266-1281`).

### A multi-turn Vibe projection counted as one run: the runner mints a fresh session id per row, so a scored session holds one turn (evidence: `randomUUID()` in `runTurn`, `locatorFor`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A multi-turn Vibe projection counted as one run: the runner mints a fresh session id per row, so a scored session holds one turn (evidence: `randomUUID()` in `runTurn`, `locatorFor`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A multi-turn Vibe projection counted as one run: the runner mints a fresh session id per row, so a scored session holds one turn (evidence: `randomUUID()` in `runTurn`, `locatorFor`).

### Arena builder copying a tracked dotenv file in this repository: no dotenv file is tracked here, only `.env.example` files, so the input is a branch defect rather than the current state (evidence: `git ls-files` filter for dotenv names). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Arena builder copying a tracked dotenv file in this repository: no dotenv file is tracked here, only `.env.example` files, so the input is a branch defect rather than the current state (evidence: `git ls-files` filter for dotenv names).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Arena builder copying a tracked dotenv file in this repository: no dotenv file is tracked here, only `.env.example` files, so the input is a branch defect rather than the current state (evidence: `git ls-files` filter for dotenv names).

### The `--set chat` split filter: recorded in iteration 2. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The `--set chat` split filter: recorded in iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `--set chat` split filter: recorded in iteration 2.

### The README structure table's file count: already recorded, and the table is generated prose rather than a behavioural claim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The README structure table's file count: already recorded, and the table is generated prose rather than a behavioural claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README structure table's file count: already recorded, and the table is generated prose rather than a behavioural claim.

### The README's backfill field counts, `--brief-only` wording, `--row-id` scope and paired-block wording: already recorded by pass two and pass four in the packet registry, so not re-reported. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The README's backfill field counts, `--brief-only` wording, `--row-id` scope and paired-block wording: already recorded by pass two and pass four in the packet registry, so not re-reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README's backfill field counts, `--brief-only` wording, `--row-id` scope and paired-block wording: already recorded by pass two and pass four in the packet registry, so not re-reported.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- `latestLines` collapsing two same-arm captures into one sample: the key is the documented retry rule, and two files holding the same runtime/arm/row/run describe one retried sample rather than two, so no honest count is lost (iteration 1, evidence: `latestLines`, score-command-transcripts.mjs:1509-1517).
- `startState` calling `firstWritePosition` without the checkout folder while `workflowPath` passes it: the difference only shows for an absolute write outside the checkout and outside temp, which is a write into somebody else's tree, so counting it as unsafe is the defensible reading (iteration 1, evidence: `insideCheckout`, score-command-transcripts.mjs:670-704).
- `workflow.unscored` printing the run-level unscored count inside the workflow line: the same count is named twice, not miscounted (iteration 1, evidence: `tallyBlock`, score-command-transcripts.mjs:1857).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none -- all four dimensions are covered and this is the fourth of four permitted iterations - Focus area: synthesis - Reason: `maxIterations` is reached; the remaining findings are two P2 advisories - Rotation status: swept - Required evidence: none outstanding - Run verdict for this lineage: CONDITIONAL (3 active P1, 7 active P2, 0 P0)

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `score-command-transcripts.mjs` (2276 lines, scorer facts exported for tests), `run-command-behaviour.mjs` (1502 lines, live-turn runner), `prepare-behaviour-arena.mjs` (354 lines, arena builder), `routing-accuracy/README.md`, `command-bridges/README.md`, `runtime/tests/command-transcript-score.vitest.ts`, `runtime/tests/command-behaviour-guards.vitest.ts`.
- Behaviour claims to verify: the scorer reports offer/start/follow counts per arm; `unsafe` covers a write on an `ask` row or a must-not-start row and a self-chosen `:auto`; loop starts are checked against their init; holdout rows are never scored, printed or run; the arena carries no dotenv file and no git remote.
- Reuse and conventions: `TOOL_TABLES` is per runtime; `normalize` flattens records to `{seq,kind,path,command,text}`; `workflowPath`/`startState`/`loopInit` are exported and unit-tested; every refusal carries a stable `code`.
- Review risks and gaps: the packet holds four prior lineages' findings for the same files, so deduplication against `deep-review-findings-registry.json` is mandatory; holdout prompt text must never be read or printed; the loop's own state files are outside the write surface except this lineage directory.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1 | 1 | 0 P0, 1 P1, 2 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | D2, D3 | 3 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs` | D2, D3 | 3 | 0 P0, 1 P1, 3 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1, D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | D2, D4 | 4 | 0 P0, 0 P1, 1 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-5-1794760565927-i99t40, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T16:45:21Z
<!-- MACHINE-OWNED: END -->
