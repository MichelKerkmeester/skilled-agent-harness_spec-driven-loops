---
title: "Implementation Plan: Phase 16: cross-session-operator-items"
description: "Check every surface's git status before touching anything, act only on what is clean, re-verify the two items other sessions already fixed and escalate rather than force the one surface that is genuinely dirty."
trigger_phrases:
  - "cross session operator items"
  - "coordinate not overwrite"
  - "spec kit check mirror job"
  - "worktree 046 removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: cross-session-operator-items

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (`sync-prompts.cjs`, the baseline regenerator), Python (`test_readme_verdict_parity.py`, `validate_document.py`), Bash/git (worktree removal, status checks) |
| **Framework** | None. This phase runs existing generators and checkers, it does not build new ones |
| **Storage** | None beyond the checked-in files each item already owns |
| **Testing** | Each item's own owning gate (`spec-kit-check.yml`'s `mirrors` job, `routing-registry-drift.yml`'s `routing-drift` job, the parity test, the manifest checker) |

### Overview
This phase coordinates rather than overwrites. Every one of its five items sits on a surface another session may be actively editing, so the plan opens with one task that checks git status across all five surfaces before any other task runs, and every subsequent task re-checks its own surface immediately before acting rather than trusting the opening census. Two items (the sk-design invariants, the 036 manifest) are already fixed by other sessions and need only re-verification and a corrected report. Two items (the codex prompt mirrors, the README parity baseline) need an existing generator or checker re-run against current reality. One item (worktree 046) is genuinely dirty right now and this plan does not remove it while that holds. It escalates instead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `spec-kit-check.yml`'s `mirrors` job and `routing-registry-drift.yml`'s `routing-drift` job both pass on a push
- [x] Docs updated (spec/plan/tasks. The program report corrected if REQ-007's write-authority question resolves yes)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordinate, verify, then act. No new generator or checker is introduced. This phase runs existing ones (`sync-prompts.cjs`, `test_readme_verdict_parity.py`'s baseline, `parent-skill-check.cjs`, `check-goal-file-manifest.sh`, `git worktree remove`) against a freshly-confirmed-clean surface.

### Key Components
- **Cross-surface git-status gate**: one task, run first, that checks `git status --porcelain` scoped to each of the five surfaces (`.codex/prompts` plus `.opencode/commands/design`, `.opencode/skills/sk-design`, the README-parity baseline plus its affected paths, `specs/system-deep-loop/036-deep-loop-innovation` and a separate `git -C /Users/michelkerkmeester/worktrees/public/046-v4-gemini-research status --porcelain` for the worktree). A dirty result blocks only that surface's own downstream task.
- **Regeneration tasks**: `sync-prompts.cjs` for the codex mirrors, and the README-parity baseline regenerator, each re-checking its own surface's status immediately before writing, not relying on the opening census alone.
- **Re-verification tasks**: for the two already-fixed items, re-run the owning gate's own checks and record the passing result in this phase's implementation-summary.md, correcting the program report's stale claim where write authority allows.
- **Escalation task**: for worktree 046, a status check that, on finding it dirty, stops and reports the specific modified and untracked entries to the operator rather than proceeding.

### Data Flow
Each item's data flow is a single existing pipeline (source to mirror, source READMEs to baseline, git worktree state to `git worktree remove`), unchanged by this phase. The only new logic is the gating check that runs immediately before each pipeline is allowed to execute.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.codex/prompts/` and `.opencode/commands/design/` | Codex's generated prompt mirror and its canonical source | Update: regenerate via `sync-prompts.cjs`, gated on clean status | `.github/workflows/spec-kit-check.yml`'s `mirrors` job step for `sync-prompts.cjs --check` |
| `.opencode/skills/sk-design/` | Parent hub already fixed by commit `bd77c72630` | Verify only, no write | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` exits 0 |
| `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | README parity baseline, currently 113 mismatches against live validator output | Update: regenerate, gated on clean status and on each of the 26 verdict-shape mismatches being individually read first | `python3 .opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` reports `diff_entries=0` |
| `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/goal-file-manifest.txt` | Already reconciled 2026-09-07, another packet's live surface | Verify only, no write | `bash check-goal-file-manifest.sh` and the `recursive-child-manifest.vitest.ts` suite both pass |
| `/Users/michelkerkmeester/worktrees/public/046-v4-gemini-research` | A separate git worktree, currently dirty (2 modified, 7 untracked) | Remove, conditional on clean status. Escalate if dirty | `git worktree list` no longer names it, or an escalation note exists in implementation-summary.md |
| `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/spec.md` (or wherever the program states the 36-mismatch and six-invariant figures) | States now-stale figures | Update, conditional on write authority | The figures match this phase's re-verified counts |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Mirror parity | Codex prompt mirrors after regeneration | `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` |
| CI job replay | `spec-kit-check.yml`'s `mirrors` job and `routing-registry-drift.yml`'s `routing-drift` job | The same commands those jobs run, executed locally against the changed tree |
| Parity regression | README baseline | `python3 .opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py`, requiring `diff_entries=0` |
| Manifest regression | 036 packet | `bash specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` |
| Worktree state | Worktree 046 | `git -C /Users/michelkerkmeester/worktrees/public/046-v4-gemini-research status --porcelain`, immediately before any removal attempt |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Whichever session is restructuring `.opencode/skills/sk-design/` READMEs (the source of the 87 missing-file baseline entries) | External (another session) | Yellow | If still in flight at execution time, REQ-001's gate defers the README-baseline regeneration until that surface reads clean |
| Worktree 046's owning session or the operator's own prior work in it | External | Red | The worktree is confirmed dirty as of this spec's authoring. REQ-004 does not proceed past that state without operator input |
| Write authority over `specs/system-speckit/035-*/spec.md`'s report text | Internal, unconfirmed | Yellow | REQ-007 is conditional on this. If authority is absent, the corrected figures still land in this phase's own implementation-summary.md |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A regeneration (codex prompts or the README baseline) produces output that fails its own owning gate, or a git-status gate was satisfied at check time but the underlying surface changed before the write actually landed (a narrow race the plan accepts as a known limitation of a git-status-then-act sequence, not fully eliminable without a lock this phase does not introduce).
- **Procedure**: `git revert` the specific regeneration commit. Since every write in this phase is either a generator's reproducible output or a re-verification with no write at all, reverting restores the prior state exactly. Worktree removal, being the one truly irreversible action, never proceeds without the clean-status gate passing at the moment of removal, so there is no worktree-removal state to roll back from.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (the five-surface git-status gate) | Low | A handful of `git status --porcelain` calls |
| Core Implementation (regeneration and re-verification, five items) | Low-Medium | Mostly re-running existing tools. The README-baseline item's 26-row manual read is the largest single piece of judgment work |
| Verification | Low | Each item's owning gate already exists and is cheap to run |
| **Total** | | Small, concentrated in coordination discipline rather than new code |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No backup needed for the four regeneration/verification items. Every one is either reproducible or read-only
- [x] No feature flag needed. Every action here is a one-time regeneration or a `git worktree remove`
- [x] No monitoring alert needed. The owning CI jobs are the existing surface that would catch a regression

### Rollback Procedure
1. `git revert` the codex-prompt-mirror regeneration commit, if it needs reverting.
2. `git revert` the README-baseline regeneration commit, if it needs reverting.
3. No rollback exists for worktree removal beyond not having performed it. The clean-status gate is the safeguard, not an undo.
4. Re-run each item's owning gate to confirm the reverted state matches what existed before this phase.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
