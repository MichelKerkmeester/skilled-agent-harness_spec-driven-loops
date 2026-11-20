---
title: "Feature Specification: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout"
description: "The extended deep review of this packet found that apply --relayout leaves a half-moved overlay folder when a rename fails, that a sibling overlay folder outside the git repository is refused only by pre-commit, and that three engine remedies and two phase records say something the code does not. This phase fixes every Skilled-side finding in the overlay engine, its tests, its docs and the packet record."
trigger_phrases:
  - "review remediation"
  - "phase 6 review remediation"
  - "relayout rollback on a failed rename"
  - "sibling overlay folder outside the git repository refused"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/481-overlay-framework-root-layout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-barter-move-overlays-out-of-tree |
| **Successor** | None |
| **Handoff Criteria** | The engine suite, the guard suite, the presentation contract test and `route-validate` pass on Skilled main after the merge, and this phase, phases 002 and 005 and the parent validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the overlay framework/root layout packet. It runs after the extended deep review in `../review/review-report.md`.

**Scope Boundary**: Skilled only. The ai-speckit findings (`R2-P1-001`, `R2-P2-001--e1e7b8a500f3`, `R14-P2-001`, `R12-P2-001`, `R3-P2-001`, `R3-P2-002`) belong to a parallel ai-speckit session and are not touched here.

**Dependencies**:
- The review report and the two lineage reports under `../review/lineages/`.
- The worktree branch `worktrees/481-overlay-framework-root-layout`, brought current with Skilled main before the merge.

**Deliverables**:
- An engine fix for each confirmed Skilled finding, with a test where behaviour changes.
- Docs that state both LAYOUT remedies.
- Corrected records in phases 002, 004 and 005.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`apply --relayout` guards only the manifest plan. When a rename or the manifest write fails after the first move, the overlay folder is left half moved behind a manifest that names the old paths, and the run exits 2 with a raw error. A sibling overlay folder that resolves outside the git repository, or names `../.git`, is accepted by every command except pre-commit, although phase 001's spec and decision D2 state the refusal generally. Three engine remedies and the presentation contract tell the operator to run a step that cannot work for the case at hand, and phases 002 and 005 carry evidence that no longer matches the code or the bar actually measured.

### Purpose
A failed relayout leaves the overlay folder as it found it, a sibling outside the repository is refused on every command, every remedy line names a step that works, and the packet record states what was actually measured.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Baseline on the worktree branch at `7ee80c87364`, before any change:
```text
$ node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs
ℹ tests 250 ℹ pass 250 ℹ fail 0      (exit 0)
$ node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
ℹ tests 20 ℹ pass 20 ℹ fail 0        (exit 0)
$ node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs
ℹ tests 9 ℹ pass 9 ℹ fail 0          (exit 0)
$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 32 routes validated, 11 warnings   (exit 0)
$ sed -n 6384,6391p .skilled/commands/doctor/scripts/overlay-engine.cjs
  for (const move of plan.moves) {
    fs.mkdirSync(path.dirname(move.to.absolute), { recursive: true });
    fs.renameSync(move.from.absolute, move.to.absolute);
    pruneEmptyParents(ctx.overlayRoot, move.from.absolute);
    console.log(`moved ${move.from.relative} -> ${move.to.relative}`);
  }

  writeRelayoutManifest(ctx, manifestText);
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Guard the relayout's renames, manifest write and link retargets, and restore the overlay folder and the live links on a mid-run failure (`R1-P1-001`).
- Refuse a sibling overlay folder that lands outside the tree's git repository, or in its `.git`, at `resolveOverlayDir`, on every command (`R1-P2-001--6d7230d0ece0`).
- Branch the LAYOUT overflow remedy and the strict-write remedy for a removed path, and document both LAYOUT remedies (`R1-P2-001--4f4ffdfd250a`, `R11-P2-001`, `R8-P2-001`).
- Restate the `layoutMoves` JSDoc, compute `overlayOutside` once on the context and split `writeBackup`'s overlay-area pass (`R2-P2-001--4e5c79954247`, `R13-P2-001`, `R13-P2-002`).
- Correct phase 002's evidence pointers and caller count, phase 005's AC-008 and AC-009, and phase 004's close-out (`R6-P2-001`, `R4-P2-001`, traceability §7).

### Out of Scope
- The six ai-speckit findings - a parallel ai-speckit session owns them.
- D-1, the deep-review fan-out leaving `reviewScopeFiles` empty - a deep-review workflow defect owned by another packet.
- The four search-debt rows - they ask for another review pass, not a fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Relayout rollback, the outside-repository refusal, both remedies, the JSDoc, `overlayOutside` on the context, the `writeBackup` split |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | Modify | Fault-injection relayout test, outside-repository tests, remedy tests |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | Both LAYOUT remedies |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | Both LAYOUT remedies, the relayout failure contract, the outside-repository refusal |
| `../002-engine-framework-root-source-layout/spec.md`, `../005-barter-move-overlays-out-of-tree/acceptance-criteria.md`, `../004-barter-repin-and-relayout/implementation-summary.md` | Modify | Record corrections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A relayout whose rename fails mid-loop restores every moved copy and the manifest, removes its own backup run, and exits 2 with a message naming the failure and the restore | A test that makes the second rename throw sees exit 2, the message, and an overlay folder identical in paths, types, modes, bytes and link targets to its state before the run |
| REQ-002 | With the tree inside a git repository, a sibling overlay folder that resolves outside the repository's top level, or into its `.git`, is refused when the context is built, so every command refuses it | Tests see `status` exit 2 with "outside the git repository" for a sibling link to a folder outside the repository and for `../.git` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | With the tree in no git repository, a sibling overlay folder resolves as before | A test with no repository sees `status` resolve the sibling and run |
| REQ-004 | The LAYOUT overflow line names relayout only for the hidden moves relayout can make, and the destination change for the hidden moves under `root/skilled` | A test with more than 20 off-layout moves, some under `root/skilled`, sees both counts on the overflow line |
| REQ-005 | The strict-write refusal for a new file under a path on a skill-root entry's `remove` list says to take that path off the remove list, not to create a copy | A test sees the remove-list remedy for a removed path and the unchanged create remedy for a replaced one |
| REQ-006 | The presentation contract and `references/overlays.md` state both LAYOUT remedies | The contract test passes and both files name `change the destination or remove the entry` |
| REQ-007 | `layoutMoves`, `overlayOutside` and `writeBackup` read as the code behaves, with no behaviour change | The engine suite passes with no expectation edited for these three |
| REQ-008 | Phase 002's line pointers and caller count, phase 005's AC-008 and AC-009, and phase 004's close-out state what the code and the run show | `rg` on the cited symbols prints the cited lines; AC-008 and AC-009 name the baseline-equal bar and the deviation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On Skilled main after the merge, the engine suite, the guard suite and the contract test pass with exit 0, at more tests than the 250, 20 and 9 baseline, and `route-validate` exits 0 with 32 routes.
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` for this phase, phases 002 and 005, and the parent run recursively.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git rev-parse --show-toplevel` at context build | A missing git binary or a failing call would refuse a valid tree | A failing or absent git result keeps today's behaviour; only a resolved top level can refuse |
| Risk | The rollback itself fails part way | The folder stays half moved | The backup run is kept, the message names it and the steps it could not undo, and the run exits 2 |
| Risk | The overlay guard builds a context through the engine | An outside-repository sibling now throws in the guard | The guard already allows with a note on any context error, so it fails open as it does for other setting errors; the guard suite covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator settled every decision up front: auto-fix all findings including P2, and refuse a sibling folder outside the git repository.
<!-- /ANCHOR:questions -->

---
