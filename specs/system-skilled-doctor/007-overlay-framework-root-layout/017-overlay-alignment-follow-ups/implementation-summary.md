---
title: "Implementation Summary"
description: "The router-sync guard no longer reads a folder README as an orphan, and the overlay engine no longer ships, deletes or loses a Python bytecode cache. A three-round review of phases 014 to 017 ends APPROVED with no P0 or P1."
trigger_phrases:
  - "overlay alignment follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/017-overlay-alignment-follow-ups"
    last_updated_at: "2026-11-21T06:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Review round 3 approved; docs closed before the merge"
    next_safe_action: "Merge into local main and rerun the gates there"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-cache-skip.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "overlay-alignment-follow-ups"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-overlay-alignment-follow-ups |
| **Completed** | 2026-11-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A folder README under a sk-code mode no longer fails the router-sync guard, and Barter's overlay of that guard now matches upstream byte for byte. An overlay folder entry no longer ships a Python bytecode cache, deletes one a script wrote in the live tree, or loses one in a repin rollback.

### Phase 17: overlay alignment follow-ups

The router-sync guard's orphan walk now skips a file named `README.md` in any case, with the exact lines Barter's copy carries (`verify-router-sync.cjs:257-261`). A README a router does name still resolves through the dead-route check.

The overlay engine reads a `__pycache__` folder and any `*.pyc` or `*.pyo` file as a cache, through one predicate, `isPythonCacheName`. Every reader of a `directory` or `skill-root` entry skips it on both sides: the apply planners, the plan safety check, the guard's candidates, the capture lookup, adopt, the re-pin loss check and the README walk behind `status --audit`. A folder the entry stops shipping goes whole once nothing but caches is left in it, and a repin backs up every cache below a folder destination, so a rollback puts back what the prune removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | The orphan walk skips folder READMEs |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | Unrouted READMEs in a packet and the shared tier pass leg 1b |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `isPythonCacheName`, the readers that use it, the cache-aware prune, the docs-walk skip and the repin cache backup |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-cache-skip.test.cjs` | Created | Seven tests: apply, live caches, a stale state record, adopt, a dropped folder in each scope and the audit walk |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | A rollback restores the cache of a folder a directory entry stopped shipping |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | States the cache rule and adds `__pycache__` to the docs walk's skips |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each unit was red first, then committed on `worktrees/500-overlay-alignment-follow-ups`:
1. `251edb80d4c`: the README skip. Before the fix the new test printed two orphan lines.
2. `5485069871f`: the cache skip. All four new tests failed on the old engine.
3. `d8b2ef4e23e`: the dropped-folder prune and the docs-walk skip, from review round 1's P2s. Three new tests failed first.
4. `7332be12cd2`: the repin cache backup, from review round 2's P1. The new test failed with ENOENT on the cache read.

The review ran in three rounds, each by `@review`:
1. **Round 1, in two halves.**
   - Half B covered the upstream-aligned files in `bf6806ad4b3..7153a45a8b9` and phase 015's private alignment files. APPROVED with no findings.
   - Half A covered the engine, its tests and the doctor docs in that range, plus this branch's first two commits. APPROVED with three P2s.
2. **Round 2, the whole branch.** REQUESTED_CHANGES on one P1: a repin rollback did not restore a pruned cache.
3. **Round 3, the whole branch, after the fix.** APPROVED with no P0 or P1. It mutation-tested the new rollback test and compared a whole-tree digest before and after rollback, for both scopes.

**Final verdict: `Review status: APPROVED`, no P0, no P1.** The last code commit, `7332be12cd2`, is the one that round saw.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip caches by name, not by what git ignores | The engine keeps an overlay folder that sits in no repository, so a git rule would need a second fallback rule. It would also let an unpinned `.gitignore` decide what an entry ships and what drift reports |
| Apply the skip on both sides of every reader | A source-only skip would make apply delete every cache a running script writes in the live tree, and status would call it an edit |
| Back up every cache below a folder destination in a repin | Predicting which folders the prune takes could drift from the prune's own decision and lose a cache. A cache the prune keeps is rewritten with the same bytes |
| Leave review round 1's third P2 alone | `readmeShipTest` counting a `retained` README as shipping is phase 014's contract, which the ai-speckit session follows. Changing it is a contract amendment, not a follow-up fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router-sync guard vs Barter's overlay copy | `diff` exit 0 |
| Router-sync suite | 56 of 56, exit 0 (55 before) |
| Engine suite on the branch | 362 of 362, exit 0 (354 before) |
| Guard and contract suites | 20 of 20 and 9 of 9, exit 0 |
| Final `@review` round | `Review status: APPROVED`, no P0 or P1 |
| Gates on merged main | Recorded in the parent's merge commit and the phase report |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four P2s stay open.**
   - A folder named `*.pyc` or `*.pyo` counts as a cache, which is unrealistic input.
   - A cache folder that cannot be deleted, such as a root-owned one, makes apply exit 2 after its deletes. Fixing the permissions and running apply again recovers.
   - A repin backup copies every cache below a large skill-root destination.
   - `readmeShipTest` counts a README that `retained` keeps as shipping.
2. **Older failures are untouched.** Turning a folder into a file or a link within one apply still fails in `applyOnePlan` and `ensureSymlink`, as it did before this phase.
3. **The drift guards' one failure is not this phase's.** `run-all-drift-guards.sh` exits 1 on main and on the branch because of a research-archive `post.sh` another session committed in `17a9ddbcb68`.
<!-- /ANCHOR:limitations -->

---
