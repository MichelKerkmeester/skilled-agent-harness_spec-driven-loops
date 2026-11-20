---
title: "Implementation Summary: Phase 2: engine-framework-root-source-layout"
description: "Every overlay consumer now gets the framework/ and root/ layout by default. Old-layout trees keep applying with a capped LAYOUT notice until one relayout moves them, and root/skilled is refused."
trigger_phrases:
  - "framework root source layout shipped"
  - "layout cap and relayout evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout"
    last_updated_at: "2026-11-20T12:19:40Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the framework/root layout"
    next_safe_action: "Start phase 003"
    packet_purpose: "Purpose: For every engine consumer, `adoptSource` maps a destination `.skilled/X` to `framework/X` and any other destination `X` to `root/` plus `X` with its leading dots dropped."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
    session_dedup:
      fingerprint: "sha256:91ccf6f80b39a1a3a2a763fe706fd9665f7f40168a3a464bd2f42db59f4b4db1"
      session_id: "impl-002-engine-framework-root-source-layout"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0bdae7d5-3bdf-4448-b239-f0e7616d298a"
      workspace: "/Users/michelkerkmeester/worktrees/public/481-overlay-framework-root-layout"
      savedAt: "2026-11-20T12:19:40Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-engine-framework-root-source-layout |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The engine now names every overlay copy under `framework/` for a `.skilled/` destination and under `root/` for any other, for every consumer and with no switch. A tree whose copies still sit at the older dot-dropped paths keeps applying and passing status. It shows a LAYOUT notice capped at 20 lines plus one overflow line until it runs `apply --relayout` once.

### The framework/root default

`adoptSource` holds the rule, and all six callers go through it. Sources are still read verbatim from the manifest, so the flip changes no destination. A `source`, `fragment` or `base` at or under `root/skilled/` is a blocked overlay. Adopt and relayout refuse to write there, and status points such an entry at the manifest instead of at a relayout that would refuse. For a path under `repin.exclude`, adopt also accepts a copy at the older path and prefers the `framework/` one when both exist.

This phase also closed phase 001's open P2. A sibling setting that is a dangling or looping link is now refused with the setting message instead of being accepted or failing raw.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `adoptSource` and `legacyAdoptSource`, the LAYOUT cap and the `root/skilled` remedy text in status, the `root/skilled` block in `assertSafeToPlan`, adopt and relayout, the excluded-path fallback, and the dangling-link refusal in `resolveOverlayDir` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Modified | Layout cap, old-layout and `root/skilled` relayout and status cases; old-rule layout constants swept to the new rule |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | `root/skilled` source, fragment, base and adopt cases, the excluded-copy case; adopt and hint expectations swept to the new rule |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modified | Dangling and looping sibling link refusals |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

1. Recorded the baseline at `87de7f0`: engine 238/238 and guard 20/20, each exit 0.
2. Wrote the new cases first, in parallel. The follow-up cases came from a Claude worker and the strict-writes cases from DeepSeek V4.1 Flash through cli-pi. The suite then ran 245 tests: 238 passed and 7 failed, all of them new.
3. Made the engine change in two sequential lanes. The first did the rule, the cap, the fallback and the old-rule test sweep. The second did the `root/skilled` refusals and the dangling-link fix.
4. The review approved with four P2s. Three were fixed with tests and negative controls: the misleading LAYOUT remedy, the raw ELOOP error, and the untested `fragment` and `base` keys.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Adopt of a destination starting `skilled/` stays refused with the `root/skilled` message, as the spec requires, though the review suggested the vendored-root message | Its source would land under `root/skilled/`, the one path the layout reserves. The refusal names that reason. |
| A `root/skilled` move keeps its `offLayout` item but its LAYOUT line names the manifest fix | Relayout still names and refuses it, while status no longer sends the operator to a run that would stop. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | PASS: tests 250, pass 250, fail 0, exit 0 (baseline 238/238) |
| `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | PASS: 20/20, exit 0 |
| Goal criteria runs (`old layout`, `layout cap`, `relayout moves every off-layout source`, `root/skilled`, `excluded copy`) | PASS: 1, 2, 1, 6 and 1 tests, each exit 0 (`scratch/evidence/after-per-criterion.txt`) |
| Fixture sources unchanged | PASS: `git diff --quiet` on `overlay-engine-fixtures.cjs` exits 0 |
| No switch | PASS: `rg -c 'sourceLayout'` prints nothing |
| Comment hygiene on added lines | PASS: the label `rg` printed nothing |
| Code review | APPROVED; three of four P2s fixed, the fourth declined per the spec |
| `validate.sh --strict` on this folder and the parent | PASS: `RESULT: PASSED` for both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A case variant such as `Root/Skilled` is not caught on a case-insensitive disk.** The review inferred this from the code. A manifest has to spell it that way on purpose, and the copy would still apply.
2. **The overflow line always names relayout,** even when an entry past the first 20 is a `root/skilled` move. `status --json` shows each item's real target.
<!-- /ANCHOR:limitations -->
