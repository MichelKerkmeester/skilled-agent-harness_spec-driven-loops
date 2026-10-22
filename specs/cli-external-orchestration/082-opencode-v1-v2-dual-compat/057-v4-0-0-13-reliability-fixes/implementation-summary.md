---
title: "Implementation Summary"
description: "v4.0.0.13 shipped a run of reliability fixes that its changelog never named, so an upgrading reader could not tell what the release repaired. The release notes now carry a Reliability Fixes section with five items, from the advisor queue to worktree provisioning, a widened glance bullet that keeps the list at 12, and an upgrade note for the goal session workspace argument."
trigger_phrases:
  - "v4 0 0 13 reliability fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/057-v4-0-0-13-reliability-fixes"
    last_updated_at: "2026-10-22T23:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Pushed and CI green"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "057-v4-0-0-13-reliability-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which commit is left out: ecd8873efa, because the live-proof paragraph already covers that handoff-note fault among its four"
      - "Does the glance list grow: no, the existing bullet is widened and the list stays at 12"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 057-v4-0-0-13-reliability-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The v4.0.0.13 release notes now say what the release repaired. Between tag v4.0.0.12 and the release, 25 commits fixed things a reader would notice: an advisor that started a child per prompt, a hand-off count two hooks could overwrite at once, a corrupt goal record that brought back a stale goal, worktrees missing the package trees their suites need, and a tail of smaller repairs. The changelog had one glance bullet for all of it. It now has a section.

### Phase 57: v4-0-0-13-reliability-fixes

One file changed: `.skilled/changelog/skilled/v4.0.0.13.md`. A new `## Reliability Fixes` section sits between the last existing release section and Upgrade Notes, and it carries five H4 items.

- **Advisor lookups queue instead of piling up.** At most two advisor children run at once and the rest queue in order. A queued lookup gives up after the normal timeout counted from when it queued, on a clock that ignores changes to the system time, then skips the advisor rather than running late. A file's digest is reused while the file is unchanged, which takes that file check from about 2.2 ms to 0.24 ms on repeat lookups, and on Pi the advisor no longer prints its JSON diagnostic over the input line.
- **Hand-off counts stop racing.** The count updates under a lock that records its owner, and when the lock cannot be had the count is left alone and reported as not saved. A lock is taken over only when its owner process is dead or its unreadable owner record has outlived the stale window, and only under a separate break lock. An iteration config is accepted only from inside the project.
- **A corrupt goal record reads empty.** An unreadable current goal record reads as no goal instead of reviving an older one, an archive file holding something other than a goal record is skipped, and a packet `goal.md` that symlinks outside the workspace is no longer read as the session goal.
- **Fresh worktrees build what they need.** Provisioning installs the two Pi extension suites and the DESIGN.md backend suite and says why a run failed. The Code Mode server and an empty placeholder package stay out on purpose. Staleness now compares a fingerprint of the inputs as they are on disk, so an unstaged edit or a deleted input triggers a rebuild while a build that writes nothing new does not.
- **Smaller fixes across the stack.** The git pre-commit installer installs where git looks for hooks, the shared stdin reader stops at 64 MiB, the OpenCode session-cleanup guards run in parallel without blocking, Pi's `--fast` flag registers in the main checkout, and sk-vision on OpenCode 2 releases all of its parts on shutdown.

The work is named before a reader reaches the section. The existing glance bullet now reads "State, locks and CI are sturdier." and names the advisor lookups, the hand-off count lock, the goal record, worktree provisioning, the git pre-commit installer and the OpenCode session-cleanup guards. It was widened rather than added, so the glance list stays at the template's 12 bullets and no other topic loses its line.

Upgrade Notes gains one entry: "Pass a workspace to goal session actions." Scripts that call the goal session actions must now pass `--workspace` with the repo root, and a reader who only skims the section body would otherwise miss it.

One commit since v4.0.0.12 is left out. `ecd8873efa` names handoff notes by the full session id, and the live-proof paragraph already covers that fault among its four. Repeating it would describe one fix twice and make the section longer than the release needs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | Added the Reliability Fixes section with five items, widened the glance bullet and added the goal-session workspace upgrade note |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 057 and the 056 to 057 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash with high thinking wrote the changes over three one-change briefs: add the section with its five items, widen the glance bullet while holding the list at 12, and add the upgrade note. One brief per kind of change kept each edit reviewable on its own rather than as a rewrite.

A separate read-only DeepSeek v4.1 flash session with thinking max fact-checked the new text against the commits after each brief. Round 1 failed. Its P1 was a lock takeover rule that omitted the case of an unreadable owner record past the stale window, so the rule as written would have read as if only a dead process could be taken over. Its two P2s were the 2.2 ms figure, which measures one source file's signature check on a repeat lookup but read as a whole-lookup cost, and the heading, which claimed counts never lose a write that the lock cannot promise.

Round 2 failed as well. Its P1 was provisioning: the item undercounted the missing package trees and omitted the two that stay out on purpose, which described the fix as larger and less deliberate than it is. Its P2 named the wrong trigger in the archive paragraph: a malformed file is not the case, a valid file holding something other than a goal record is.

Every finding was fixed in a brief before the next round began, and round 3 returned PASS with no findings. The finished file then went through `validate_document.py`, which reported VALID with 0 issues, and `hvr_scan.py`, which reported 0 hard blockers. Luna was not used: the operator moved review to DeepSeek on 2026-10-21, and every round above ran there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a section instead of extending the glance bullet alone | Five groups of fixes cannot fit one bullet a reader can act on; the bullet now points at the section rather than carrying it |
| Widen the existing glance bullet instead of adding a sixth | The template caps the list at 12, and the existing bullet already claimed the sturdier-state ground, so the fixes belong in the sentence it already had |
| Keep the section between the last release section and Upgrade Notes | Release sections describe what changed and Upgrade Notes tell a reader what to do; the goal-session change needs both, and this order lets the reader meet the fix before its instruction |
| Drop `ecd8873efa` rather than give it a line | The live-proof paragraph already covers that fault among its four, and a second mention would describe one fix twice |
| Fix each review finding in its own brief rather than at the end | Three rounds found different errors, and fixing between rounds let the next round judge the corrected sentence instead of a batch of edits |
| Record the two FAIL rounds rather than only the PASS | The rounds are what caught the missing unreadable-record case and the undercounted provisioning, and a reader checking the section's claims can see what was tested |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` over the changelog | PASS: VALID, 0 issues |
| `hvr_scan.py` over the changelog | PASS: 0 hard blockers, 6 mechanical deductions, 94/100 ceiling |
| Read-only review, round 1 | FAIL: 1 P1 and 2 P2s. The lock takeover rule omitted the unreadable-record case; the 2.2 ms figure was per signature, not per lookup; the heading overstated what the lock promises. All three fixed |
| Read-only review, round 2 | FAIL: 1 P1 and 1 P2. Provisioning undercounted the missing trees and omitted the two exclusions; the archive paragraph named malformed JSON where the wrong record shape is the trigger. Both fixed |
| Read-only review, round 3 | PASS: no findings |
| Reliability Fixes section | PASS: sits between the last release section and Upgrade Notes with five H4 items, one per commit group |
| Glance bullet and list length | PASS: the bullet reads "State, locks and CI are sturdier." and names all six areas, and `What's New at a Glance` still lists 12 bullets |
| Upgrade note | PASS: "Pass a workspace to goal session actions." is in Upgrade Notes and names `--workspace` and the repo root |
| Commit coverage | PASS: 25 of the 26 commits since tag v4.0.0.12 are described, with `ecd8873efa` dropped for the live-proof paragraph's existing mention |
| Push and CI | PASS: on main as `11a5d9b0e4`; CI green on `11a5d9b0e4` (12 of 12 workflows, sk-doc Script Tests 39836751312, Changed Packet Validation 39836751565) and on the index rebuild `e5f2a95488` (13 passed, Trigger Index Rebuild skipped, Spec-Kit Check 39837140597); recursive strict validation of 082 printed RESULT: PASSED for all 58 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The section describes commits, not a run.** Each sentence was checked against its commits in three read-only rounds, but nothing in the changelog executes the fixes, so a later regression would not show up here.
2. **The dropped commit depends on the live-proof paragraph staying.** `ecd8873efa` has no line of its own because that paragraph covers the same handoff-note fault. If a later edit removes those four faults, the release notes lose the fix.
3. **The glance bullet carries six areas in one sentence.** It reads longer than the bullet it replaced, and that length is the price of holding the list at 12 while naming every group.
4. **The CI record is a snapshot of two commits.** The green runs cover `11a5d9b0e4` and the index rebuild `e5f2a95488`; later commits on main are not part of this record.

### P2s Left as Written

No review finding was left open. All three P2s from rounds 1 and 2 were fixed in their round, and round 3 raised none.
<!-- /ANCHOR:limitations -->

---
