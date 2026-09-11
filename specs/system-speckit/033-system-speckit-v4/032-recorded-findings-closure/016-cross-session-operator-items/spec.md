---
title: "Feature Specification: Phase 16: cross-session-operator-items"
description: "Five items the simplification-research program's own report flagged as belonging to other sessions' live surfaces, two already resolved by those sessions, one worse than reported, one unchanged and one blocked by a genuinely dirty worktree right now."
trigger_phrases:
  - "cross session operator items"
  - "coordinate not overwrite"
  - "spec kit check mirror job"
  - "worktree 046 removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: cross-session-operator-items

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/016-cross-session-operator-items` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-criteria-file-line-enforcement |
| **Successor** | None |
| **Handoff Criteria** | Every surface this phase touches is confirmed clean immediately before its action. A dirty surface is escalated, not overwritten |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Recorded findings closure specification.

**Scope Boundary**: Only the five items the simplification-research program's own report attributed to other sessions' active surfaces. No new finding is introduced here, and no surface outside these five is touched.

**Dependencies**:
- `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/spec.md` and the children's implementation summaries, per the brief's own citation
- `.github/workflows/spec-kit-check.yml`'s `mirrors` job and `.github/workflows/routing-registry-drift.yml`'s `routing-drift` job, the two CI surfaces two of the five items report against
- `git worktree list` and the live state of `/Users/michelkerkmeester/worktrees/public/046-v4-gemini-research`

**Deliverables**:
- The codex prompt mirrors regenerated to match the design-command rename
- The sk-doc README parity baseline brought back to zero mismatches
- Worktree 046 removed, once and only once its own state is confirmed clean
- The six sk-design parent-skill invariants and the 036 goal-file manifest re-verified and their closure documented, since both already show as passing

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The simplification-research program's own report named five items that live on surfaces this program's children never had write authority over, because another session or another packet owns them. A fresh census taken while authoring this spec (2026-09-07) found the five in four different states, not one uniform "still broken" state the brief's wording alone would suggest. First, the codex prompt mirrors are still stale exactly as reported: `.codex/prompts/` carries `create-chart.md` and `create-diagram.md`, while `.opencode/commands/design/` (the renamed source, commit `e866336d2e`) has moved to `chart.md` and `diagram.md`, and `.cursor/commands/` already carries the correctly-renamed `design-chart.md` and `design-diagram.md` - only the codex mirror lags. Second, the routing-registry-drift lean job's six sk-design parent-skill invariants, reported failing, are now passing: commit `bd77c72630` ("fix(sk-design): close the six hub invariants, starting with the one that hid three checks"), landed the morning of the same day this spec was written, and a direct re-run of `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` and `routing-registry-drift-guard.vitest.ts` against `.opencode/skills/sk-design` confirmed zero failures. Third, the sk-doc README parity baseline, reported at 36 mismatches, is now at 113: running `test_readme_verdict_parity.py` directly found 87 entries where the baselined file no longer exists at its recorded path (a `return_code=2`, "File not found" result, concentrated in `.opencode/skills/sk-design/` paths that moved during the same rename) and 26 entries where the file exists but its validator verdict shape has drifted since the baseline was captured. Fourth, the `specs/system-deep-loop/036-*` goal-file manifest, reported stale, is also already reconciled: its own header states "Reconciled on 2026-09-07 against the current tree," and both `check-goal-file-manifest.sh` and the `recursive-child-manifest.vitest.ts` suite that exercises it pass cleanly. Fifth, the worktree at `/Users/michelkerkmeester/worktrees/public/046-v4-gemini-research` still exists and is genuinely dirty right now: `git -C <worktree> status --porcelain` reports two modified tracked files and seven untracked entries, including build output and research-lineage folders that may represent uncommitted work.

### Purpose
Each of the five items reaches the state its owning surface's own gate defines as correct, verified fresh rather than assumed from the program report and nothing is overwritten on a surface found dirty at the moment this phase acts on it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerating the codex prompt mirrors so `.codex/prompts/` matches the design-command rename, gated on a clean git status for `.codex/prompts/` and `.opencode/commands/design/` immediately before the run
- Regenerating the sk-doc README parity baseline to zero mismatches, gated on a clean git status for the baseline file and the affected README paths, coordinated with whoever is actively restructuring the 87 moved-or-removed files rather than silently overwriting their in-flight work
- Removing worktree 046 with `git worktree remove`, gated on the worktree's own git status being clean. If it is still dirty when this phase executes, the task stops and escalates to the operator instead of forcing removal
- Re-verifying and documenting the closure of the two items already fixed by other sessions (the six sk-design invariants, the 036 goal-file manifest), so the program's own report is corrected rather than left claiming a broken state that no longer exists

### Out of Scope
- Any new fix to sk-design's hub structure or the 036 packet's manifest content - both already pass their owning gate. This phase only re-verifies and documents that
- Any change to the research-lineage content inside worktree 046 - if the worktree is dirty, this phase's job is to stop and report, not to decide what to do with that content
- Regenerating any mirror or baseline outside the five named items, even if the same census surfaces an adjacent, unrelated drift

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/prompts/create-chart.md`, `.codex/prompts/create-diagram.md` | Delete (via regeneration) | Removed by `sync-prompts.cjs`, which deletes anything it did not generate for the current source tree |
| `.codex/prompts/design-chart.md`, `.codex/prompts/design-diagram.md` | Create (via regeneration) | Generated by `sync-prompts.cjs` from `.opencode/commands/design/chart.md` and `diagram.md` |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Regenerated so its 669 recorded verdicts match current reality: 0 mismatches, not 113 |
| `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/spec.md` (or wherever the program's report lives) | Modify, if within this program's own write authority | Correct the "36 mismatches" and "six invariants failing" claims to reflect the current, re-verified state |
| `/Users/michelkerkmeester/worktrees/public/046-v4-gemini-research` | Remove (conditional) | `git worktree remove`, only once its own status is confirmed clean |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A single task checks `git status --porcelain` for all five surfaces (the codex prompt/design-command paths, the sk-design skill directory, the README-parity baseline plus its affected paths, the 036 goal-file-manifest packet directory and the worktree 046 checkout) before any other task in this phase runs, and any dirty surface blocks only its own item, not the others |
| REQ-002 | `.codex/prompts/design-chart.md` and `design-diagram.md` exist, and `create-chart.md` and `create-diagram.md` do not, produced by running the existing `sync-prompts.cjs` generator, not a hand edit |
| REQ-003 | `baseline-readme-verdicts.json` is regenerated so `test_readme_verdict_parity.py` reports zero mismatches against the current repository |
| REQ-004 | Worktree 046 is removed with `git worktree remove` only when its own git status is confirmed clean at the moment of removal. A dirty worktree stops the task and escalates rather than being forced |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The routing-registry-drift lean job's six sk-design invariants are re-run and their passing state is documented, correcting the program report's stale "failing" claim |
| REQ-006 | The `specs/system-deep-loop/036-*` goal-file manifest check is re-run and its passing state is documented, correcting the program report's stale "stale" claim |
| REQ-007 | Wherever the simplification-research program's own report currently states the 36-mismatch and six-invariant-failing figures, and that report is within this program's own write authority to correct, the figures are updated to the re-verified current state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.github/workflows/spec-kit-check.yml`'s `mirrors` job passes on a push, with all five of its checks (including `sync-prompts.cjs --check`) green
- **SC-002**: `.github/workflows/routing-registry-drift.yml`'s `routing-drift` job passes, and `test_readme_verdict_parity.py` reports `diff_entries=0`
- **SC-003**: `git worktree list` no longer names `046-v4-gemini-research`, or, if it still does, this phase's implementation-summary.md names the specific dirty content that blocked removal and the escalation given to the operator
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Any of the five surfaces could go from clean to dirty between this spec being written and the phase being implemented, since each is explicitly under another session's potential active edit | A stale git-status read taken during planning could be wrongly trusted at execution time | REQ-001's check runs at execution time, not planning time, and this spec's own "current state" claims are dated 2026-09-07 and explicitly not treated as still valid by the time work begins |
| Risk | The README-parity baseline's 87 missing-file entries are concentrated in `.opencode/skills/sk-design/`, a directory another session very recently and heavily restructured | Regenerating the baseline while that restructuring is still in flight risks re-baselining against a half-moved tree | The git-status gate in REQ-001 covers the baseline's affected paths, and the task is written to re-check immediately before regenerating, not only once at phase start |
| Dependency | Worktree 046's dirty content (two modified tracked files, seven untracked entries including research-lineage folders) | If the content is real, unpushed work, forcing removal would destroy it irrecoverably | REQ-004 makes escalation the only path forward for a dirty worktree. This phase never proposes `git worktree remove --force` |
| Dependency | Whether this program has write authority over `specs/system-speckit/035-*/spec.md`'s own report text | If that packet is considered closed or another session's, correcting its stated figures (REQ-007) may itself need the same coordinate-not-overwrite treatment | REQ-007 is P1 and conditioned on write authority being confirmed. If it is not, the re-verified figures still land in this phase's own implementation-summary.md as the accurate record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The git-status census across five surfaces (REQ-001) completes in well under a minute. None of the checks require a build
- **NFR-P02**: The README-parity regeneration (`test_readme_verdict_parity.py` plus whatever regenerates the baseline) runs at the same cost the existing test already incurs today (one `validate_document.py` subprocess per baselined file, 669 files)

### Security
- **NFR-S01**: No credential, token or destructive flag is used anywhere in this phase. `git worktree remove` is never passed `--force` by this phase's own tasks
- **NFR-S02**: No content inside a dirty surface is read into this phase's own committed output beyond what is needed to report that it is dirty (for example, file names and counts, not full diffs of another session's uncommitted work)

### Reliability
- **NFR-R01**: A dirty surface blocks only that surface's own item. The other four items proceed independently, since they do not share a git-tracked location
- **NFR-R02**: The worktree-removal task fails closed: if `git worktree remove` (without `--force`) itself refuses due to untracked content, that refusal is treated as confirmation the surface was dirty, not retried with a stronger flag
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A surface that was clean during this spec's authoring (all four in the main checkout, per the 2026-09-07 census) turns dirty by execution time: REQ-001's re-check catches this, and the corresponding item is deferred rather than forced
- A surface that was dirty during authoring (worktree 046) becomes clean by execution time: REQ-004 proceeds with removal only once its own fresh check confirms this, not based on this spec's now-stale observation

### Error Scenarios
- `sync-prompts.cjs` run against a source tree that has drifted further since `e866336d2e` (for example a third design command renamed since): the generator's own existing logic handles this the same way it handles any source-to-mirror drift, unchanged by this phase
- The README-parity regeneration finds a genuine validator regression (not just a moved file) among the 26 verdict-shape mismatches: this phase's task list requires each of the 26 to be read individually before the baseline is regenerated over it, so a real regression is caught rather than silently baselined away

### State Transitions
- Worktree 046's removal is the only truly destructive, irreversible action in this phase. REQ-004's clean-status gate is the sole safeguard, and the plan names no automatic fallback beyond escalation
- The other four items are all either regeneration from a canonical source (recoverable by re-running the generator) or documentation of an already-passing state (no data at risk)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Five distinct surfaces, but three of the five are re-verification or a single generator run, not new authored content |
| Risk | 18/25 | The coordination risk (acting on another session's live surface) is the dominant factor, not code complexity. Worktree removal is genuinely destructive if mishandled |
| Research | 10/20 | The current state of all five items is already fully characterized in this spec's problem statement from a fresh 2026-09-07 census |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does this program hold write authority over `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/spec.md`'s own report text, or is that packet considered closed and out of bounds the same way its own children were when they recorded F12 and the 036 manifest issue as out of scope? REQ-007 is written P1 and conditional pending this answer.
- If worktree 046 is still dirty at execution time, does the operator want its uncommitted research-lineage content salvaged (committed or copied out) before any further action, or simply left in place indefinitely? This spec does not decide that. It only requires the task to stop and ask rather than guess.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
