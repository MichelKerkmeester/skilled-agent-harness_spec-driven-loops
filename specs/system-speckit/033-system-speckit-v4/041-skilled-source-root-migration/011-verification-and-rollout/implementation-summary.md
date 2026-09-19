---
title: "Implementation Summary"
description: "How the moved source root was proved and published: canary probes on seven runtimes, thirteen local gates, a residue scan with a planted control, and the push to both branches with its CI verdict."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/011-verification-and-rollout"
    last_updated_at: "2026-09-17T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified every runtime and published the moved tree"
    next_safe_action: "Retire worktree 055 once the operator approves"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-verification-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-verification-and-rollout |
| **Completed** | 2026-09-17 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tree had moved, the machine had followed, and every check so far had been run by the people who made the change. This phase asked the seven runtimes themselves. Each was handed a probe that only a file inside the moved tree could answer, and the answers decide whether the move is real rather than merely tidy. Then the result was published to both branches.

### Phase 11: verification-and-rollout

A token was planted in one skill, one command and one agent, each token naming its own surface. A runtime that echoes the skill token loaded the skill; one that echoes nothing loaded nothing. That distinction is the whole test, and it is why the control cells matter as much as the positive ones.

The push came last and only after the gates, because publishing is the step that stops being reversible: before it, an undo is a local reset; after it, it is a forward fix on every clone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | The remote-push allowlist resolves from either source root, so a checkout carrying only the legacy name still honours an operator's approvals |
| `specs/.../011-verification-and-rollout/*` | Modified | The evidence, the verdicts and the pins this phase produced |
| `specs/.../goal.md` | Modified | The rollback written before the push, the six criteria and their receipts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twenty-one canary cells ran across seven command-line runtimes, each capped and logged whole so that a cell answering nothing is still evidence. Codex, Hermes, opencode and Pi answered every cell including a clean control. Claude answered its skill and command cells; its agent control cannot be clean, because that runtime injects the agent roster into every session, which the log shows rather than hides. Devin answered its skill cell and its own listing reads the new root. Cursor ran out of account quota and answered nothing, so its evidence is the resolve census instead.

Thirteen local gates ran at the pinned commit, one log each. Where a gate failed, the same gate was run at the pre-move commit before anything was called a regression. That rule caught the one real defect this phase found, and it kept four comment-hygiene hits, three broken links, three frontmatter violations and a dispatch test from being reported as damage this migration did.

The residue scan enumerated every mention of the old name in every tracked file, including the binary ones an earlier pass had missed, and proved its own pattern by planting two mentions in a clone and catching both.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run every failing gate at the pre-move commit before calling it a regression | Four of the five failures this phase saw were already there. Without the baseline run, the migration would have been blamed for all of them |
| Fix the allowlist resolver rather than the test that caught it | The test wrote its fixture under the legacy root, which is what an older clone and a consumer actually have. The resolver was the thing that had silently stopped reading it |
| Publish only after the gates, and write the rollback first | After the push, undoing the move stops being a local reset |
| Report the blocked cells as blocked | Cursor's quota and Devin's confirmation prompt are not evidence that the move works, and recording them as passes would have made the matrix look complete while proving less |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canary cells | 18 of 21 answered with the right surface token; 3 blocked by runtime quota or permission mode, each recorded |
| Negative controls | Clean for Codex, Cursor, Devin, Hermes, opencode and Pi; Claude's cannot be clean, and why is recorded |
| G01 drift guards | PASS, `all 2 guards PASSED` |
| G02 skill-root metadata | PASS, `checked=13 passed=13 failed=0 fixed=0` |
| G03 naming guard | PASS on a clean detached checkout, 8 tests passed |
| G04 trigger index | PASS, all four fixtures byte-identical after regeneration |
| G05 retrieval suites | PASS, `Test Files 6 passed` |
| G06 spec-kit CLI | 1 failed, 1,423 passed — the same `hook-registration-sync` identity as the base |
| G07 spec-kit lanes | PASS, every lane |
| G08 deep-loop | PASS, 154 files and 2,684 tests against a 154 / 2,681 baseline |
| G09 mirror parity | PASS, all eleven checks, 68 Hermes copies in sync |
| G10 routing | PASS, guard, compiler and suites |
| G11 PR-only guards | 3 pass; markdown links, skill-doc frontmatter and comment hygiene fail identically at the base |
| G12 push guards | 3 pass; the dispatch suite fails identically at the base |
| G13 packet validation | PASS, 12 of 12 packets on their own strict runs |
| Residue scan | 37,739 files and 1,152,114 lines enumerated, 1,298 outside frozen history, pattern proved by a planted control |
| Push | `skilled/v4.0.0.0` and `main` both at `48e5740f3b`, no bypass variable, 23 deletions with 3 accounted for as retired links |
| CI | 11 of 12 green. `Playbook Operator Contract` fails 3 packages where the base fails 5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three canary cells are unproven.** Cursor's four cells hit an account quota, and Devin's subagent cell needs a permission mode this phase declined to widen. Their surfaces resolve correctly on disk, which is the part the move could have broken.
2. **One CI workflow is red, as it was before.** `Playbook Operator Contract` fails three packages. It failed five at the pre-move base, so it is older than this work and belongs to whoever owns those playbooks.
3. **Worktree 055 is still here.** Retiring it needs the operator's approval, so the branch and its directory remain.
4. **The residue resolve test is an over-approximation.** Most non-resolving path tokens are deliberate test fixtures. The classification of record is phase 009's rescan.
<!-- /ANCHOR:limitations -->

---
