---
title: "Implementation Summary"
description: "A dropped json-entry set now returns the pin's value at the same array item or refuses before anything is written, and an entry set the engine cannot apply is reported as cannot-apply."
trigger_phrases:
  - "fix review findings in json entry set restore implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore"
    last_updated_at: "2026-11-16T22:10:51Z"
    last_updated_by: "generate-context"
    recent_action: "Round three built and approved by a third Opus review; doctor tests 1220 pass 0 fail"
    next_safe_action: "Commit, merge origin/main, push to main"
    packet_purpose: "Purpose: A dropped `set` either returns the value the pin holds at the same item, or the engine refuses before it writes anything, with advice that clears the refusal."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-fix-review-findings-in-json-entry-set-restore"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af0bf7d0-c4f7-46b6-b600-2487a77b5e4b"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T22:10:51Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-fix-review-findings-in-json-entry-set-restore |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A re-pin no longer writes one array item's value into another and calls it a pass. All seven findings of the fresh review of phase 11's set restore are fixed, and each fix has a test that fails on the engine at `35d49e8f638`.

### Phase 13: fix-review-findings-in-json-entry-set-restore

The restore now checks that the item at an array index is the pin's item, not only that the arrays hold as many items. A re-pin reads the new commit for a `json-entry` file its copy leaves in place, and plans such files before its backup. When one cannot be applied, the re-pin exits 2 with nothing written. Two nested sets dropped together both leave. `1` and `"1"` are one path. Without `pin.checkout`, the refusal names it and clears once the file holds the pinned bytes. The array refusal names the array whose restore clears it. An entry set that cannot be applied to an untouched file shows as the new `cannot-apply` state, with the reason in its fix text.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The restore checks, the readers, the check before the re-pin backup, the `cannot-apply` state |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Eight tests |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | Two re-pin tests |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The `sets` paragraph, the state table and the silent cases |
| `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-overlay-{apply,status,repin}.yaml`, `assets/doctor-overlay-presentation.txt` | Modified | Name `cannot-apply` among the blocking states |
| `handover-to-barter.md` | Created | What changes for the vendoring project |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fixes were prototyped first, and the prototype was saved. `.skilled` was then put back to HEAD. Seven literal briefs rebuilt the same change on GPT-6 Luna at max effort, fast tier, through `codex exec`, with the tests first. Each brief carried its exact text as OLD/NEW pair files under `scratch/dispatch`. After each run the edited files were compared byte for byte with the prototype, and all nine matched. Run records are in `scratch/codex-runs/01` to `13`: briefs 01 to 07 built round one, 08 to 10 the fixes for the first review, and 11 to 13 the fixes for the second. All sixteen file comparisons matched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore nested dropped sets outer first | Deepest first, as the handoff said, still refused probe p01 in both orders. See ADR-001 |
| Refuse before the re-pin backup | A late refusal left the tree on the new pin until someone ran the rollback. The operator chose this |
| A new `cannot-apply` state | `both-changed` said both copies moved when neither had. The operator chose the name |
| `cannot-apply` only for an untouched live file | Two existing tests showed that an entry set and a hand edit that both changed are rightly `both-changed` |
| Switch the executor from DeepSeek on Vibe to Luna on cli-codex | Operator instruction during the build |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests` | PASS: tests 1220, pass 1220, fail 0, exit 0. The baseline was 1204 |
| Fresh Opus review, round two | 3 P1 and 2 P2, all reproduced. Fixed in round three: a kept `set` above an item made the item refuse, several sets covering every key left the item check empty, and another first-write record order gave a false edit. The two P2s are documented |
| Fresh Opus review, round one | 2 P1 and 2 P2, all reproduced and fixed in round two: a whole-item `set` made the item check empty, other operation kinds inside an item caused false refusals, the re-pin advice left out `apply`, and older record order gave a false edit |
| New tests on the engine at `35d49e8f638` | Round one: 8 of 10 fail. Round two's three tests fail on the round-one engine. The 2 that pass are the guard pairs: a kept set in the same item still restores, and a hand edit inside still refuses |
| Review probes p01, p02, p03, p05b, p06 and the two-step route | Each shows the fixed behavior. p05b exits 2 and writes nothing |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9` |
| Byte comparison of the Luna build with the prototype | 9 of 9 files match |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two silent cases remain.** `setKeyOnItem` and `insertObjectKeys` keep no record. A kept indexed `set` moves to the next item when an `insertItems` on its array leaves. Both are in `overlays.md`.
2. **Another operation kind writing inside a dropped `set` still refuses it as edited.** Only a later `set` counts as part of the record.
3. **A kept inner `set` inside a dropped outer one needs the pin to hold its parent.** Otherwise the overlay is refused after the outer value returns. `overlays.md` says so.
4. **Called directly, the restore's edit check accepts more orders than the base engine did.** It also accepts the record value alone and the record value with every dropped inner value laid on, so a hand edit that happens to equal one of those passes the function. Through the CLI the hash guard sees any hand edit first and reports `both-changed`.
5. **The `cannot-apply` fix text repeats the reason the BLOCKED or MISS line also prints.** The fix text carries it so that a re-pin's own refusal, which prints no BLOCKED line, still says why.
<!-- /ANCHOR:limitations -->

---


