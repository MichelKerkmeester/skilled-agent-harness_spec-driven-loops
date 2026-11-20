---
title: "Implementation Summary: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout"
description: "A failed apply --relayout now puts the overlay folder back as it was, a sibling overlay folder outside the git repository is refused on every command, and every LAYOUT and strict-write remedy names a step that works. The engine suite grew from 250 to 262 tests and passes on Skilled main after merge f2a608297c9."
trigger_phrases:
  - "review remediation implementation summary"
  - "relayout rollback implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation"
    last_updated_at: "2026-11-20T16:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged the engine fixes into Skilled main and reran every gate there"
    next_safe_action: "None in Skilled; the ai-speckit findings belong to the parallel ai-speckit session"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-review-remediation |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relayout that fails part way no longer leaves a half-moved overlay folder: every copy, the manifest and the live links go back, and the run exits 2 with one line naming the step that failed. A sibling overlay folder that resolves outside the tree's git repository, or into its `.git`, is now refused when the setting is read, so every command refuses it, not only `pre-commit`.

### Phase 6: review-remediation

Each Skilled finding of `../review/review-report.md` was confirmed against the code before it was fixed. None was rejected.

- **`R1-P1-001`, relayout atomicity.** `relayoutUnderLock` guards every move, the manifest write and each relink. `rollbackRelayout` re-points relinked links, restores the manifest bytes read before any write, renames moves back in reverse order and removes the folders the run created. Emptied source folders are pruned only after success. Tests: `relayout that fails on a later move puts every copy back and keeps no backup`, `relayout that fails writing the manifest puts every moved copy back`, `relayout that fails while relinking puts the copies and the live link back` (`overlay-engine-follow-up.test.cjs`).
- **`R1-P2-001--6d7230d0ece0`, outside-repository refusal.** `resolveOverlayDir` asks `gitTopLevelOrNull` for the repository top level only for a sibling folder, and refuses one outside it or in its `.git`. A tree in no repository keeps it. The probe drops a hook-exported `GIT_DIR`. Tests in `overlay-engine-strict-writes.test.cjs`: `status refuses a sibling overlay folder outside the tree's git repository`, `status refuses the repository's own .git folder named as a sibling overlay folder`, `status refuses a sibling link inside the repository that points outside it`, `a tree in no git repository keeps its sibling overlay folder`, `a sibling overlay folder inside the repository is kept when GIT_DIR comes from a hook`, `pre-commit refuses a sibling overlay folder the repository boundary moved away from`.
- **`R1-P2-001--4f4ffdfd250a`, LAYOUT overflow remedy.** The overflow line splits hidden moves between relayout and `change the destination or remove the entry`. Tests: `layout cap: the overflow line splits the hidden moves between relayout and root/skilled`, `layout cap: the overflow line sends hidden moves all under root/skilled to the manifest`.
- **`R11-P2-001`, strict-write remedy.** A new file under a skill-root `remove` path is told to take that path off the remove list. Test: `the guard sends a new file under a skill-root removed path to the replace list`.
- **`R8-P2-001`, docs.** The presentation contract and `references/overlays.md` state both LAYOUT remedies and the three overflow forms. The reference also states the relayout failure contract and the outside-repository refusal.
- **`R2-P2-001--4e5c79954247`, `R13-P2-001`, `R13-P2-002`.** The `layoutMoves` JSDoc states the `framework/` and `root/` rule, `createContext` carries `overlayOutside` for the four command paths, and `writeBackup` runs its tree and overlay passes through one helper. No test expectation changed for these.
- **`R6-P2-001`, `R4-P2-001`, traceability §7.** Phase 002's spec pointers and caller count (eight call sites) are re-derived from main at `f2a608297c9`. Phase 005's AC-008 and AC-009 name the baseline-equal bar with the deviation. Phase 004's summary records the unloadable plugins until ai-speckit `a954fc956ce`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Relayout rollback, outside-repository refusal, both remedies, `overlayOutside`, `writeBackup` split, JSDoc |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modified | Three relayout fault tests, two overflow tests |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Six repository-boundary tests, the removed-path remedy test, three fixtures moved to a workspace repository |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | Both LAYOUT remedies and the overflow forms |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Both remedies, the relayout failure contract, the outside-repository refusal |
| `../002-engine-framework-root-source-layout/spec.md` | Modified | Re-derived pointers and call-site count |
| `../005-barter-move-overlays-out-of-tree/acceptance-criteria.md` | Modified | AC-008 and AC-009 reworded to the measured bar |
| `../004-barter-repin-and-relayout/implementation-summary.md` | Modified | The plugin regression it did not record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline was recorded on the worktree branch after it was fast-forwarded to main. Three engine workers then ran one after another on `overlay-engine.cjs`: the rollback, the refusal with `overlayOutside`, and the remedies with the readability items. The two docs were written alongside by DeepSeek workers. `@review` approved the diff with four P2 notes. Three of them were fixed before the commit, and the fourth is recorded under Key Decisions. The branch got commits `3aab896957e` (engine and tests) and `4ee628578ed` (docs), rebased onto main `24749648b24`, and was merged into Skilled main as `f2a608297c9` with `--no-ff`. Every gate was then rerun on main.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A successful rollback deletes its own `relayout-runs/<stamp>/` | Once every copy is back, the backup is redundant, and keeping it would leave the overlay folder different from before the run |
| A third failure line for a rollback that succeeded but could not delete its backup | The two planned lines would have claimed either a failed restore or a clean folder, and neither is true in that case. Recorded as a deviation from plan D1 and documented in `references/overlays.md` |
| The top-level probe removes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` | A git hook in a linked worktree exports `GIT_DIR`, and git then reports the tree as the top level. That would refuse Barter's valid `../overlays`. Added after review, beyond plan D2 |
| Three existing sibling-folder fixtures now keep their repository at the workspace | Each made the tree its own repository with the sibling outside it, which is the layout the operator decided to refuse. Their assertions are unchanged |
| AC-008 and AC-009 stay Met against a reworded bar | The operator's direction: name the bar actually measured and the deviation, rather than claim the original Then clause |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | PASS on main after `f2a608297c9`: tests 262, pass 262, fail 0, exit 0 (baseline 250/250) |
| `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | PASS on main: 20/20, exit 0 (baseline 20/20) |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | PASS on main: 9/9, exit 0 (baseline 9/9) |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS on main: exit 0, 32 routes, 11 warnings (baseline the same) |
| The same four gates on the branch before the merge | PASS: 262/262, 20/20, 9/9, exit 0 |
| `@review` on the branch diff | APPROVED, no P0 or P1, four P2 notes |
| Phase 002 pointers | `sed -n <line>p` on each cited line of `overlay-engine.cjs` on main prints the cited `adoptSource` call, `assertSafeToPlan` and the LAYOUT cap |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`pre-commit` keeps its own top-level probe.** `stagedUnownedChanges` still runs `git rev-parse --show-toplevel` with the hook's environment. Under a hook-exported `GIT_DIR` in a linked worktree it would likely report the tree and refuse with `the overlay folder must sit inside the same git repository as the tree`. That code predates this phase and is not one of the review's findings, so it was left alone. A follow-up can route it through `gitTopLevelOrNull`.
2. **A vendored tree that is its own git repository with the overlay folder beside it is now refused**, for example a tree kept as a submodule. This is the operator's decision. Move the overlay folder inside that repository.
3. **`managedPathTest` does not strip a trailing slash** from a skill-root `replace` or `remove` path, so `old/` is never managed. This predates this phase and was noted by the remedy worker.
4. **Phase 005 REQ-007 and REQ-008 in its `spec.md` still state the original bars.** The deviation is recorded on AC-008 and AC-009, which are the closure rows.
5. **Out of scope:** the six ai-speckit findings belong to the parallel ai-speckit session. D-1, the deep-review fan-out leaving `reviewScopeFiles` empty, belongs to the deep-review workflow's owners.
<!-- /ANCHOR:limitations -->

---
