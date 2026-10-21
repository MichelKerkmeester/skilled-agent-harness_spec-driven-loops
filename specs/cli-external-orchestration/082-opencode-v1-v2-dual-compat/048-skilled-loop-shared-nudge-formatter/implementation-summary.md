---
title: "Implementation Summary"
description: "The relaunch seed's spec-folder suffix text had two owners, the shared core formatter and a hand-written copy in the skilled-loop wrapper. The wrapper now asks the core for the suffix, warns on stderr if that call fails, and a test proves the old function would no longer pass."
trigger_phrases:
  - "skilled loop shared nudge formatter implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/048-skilled-loop-shared-nudge-formatter"
    last_updated_at: "2026-10-21T17:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed phase 048 and marked b05-relaunch-lib-006 fixed in phase 039 and the parent"
    next_safe_action: "None; the last open P1 from phase 039 is fixed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-048-skilled-loop-shared-nudge-formatter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 048-skilled-loop-shared-nudge-formatter |
| **Status** | Complete |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relaunch seed's spec-folder suffix now has one owner. `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` already formatted the text for `nudge.cjs`, while `.skilled/bin/skilled-loop` printed its own copy. The wrapper now asks the core for the suffix, so a change to the printed text reaches both callers.

### Phase 48: skilled-loop-shared-nudge-formatter

You get a relaunch whose seed wording follows the core, and a failure that is visible instead of silent. `spec_folder_suffix()` calls node and prints `require(core).specFolderSuffix(folder)`, the same style the wrapper already uses for the manual command. If node fails, it writes one warning to stderr and appends an empty suffix, so the relaunch still happens.

The output is unchanged for every value that reaches the wrapper. The before compare had four inputs that already matched and four invalid inputs where the old shell copied the value and the core returns `''`; the CLI drops an invalid folder at prepare and consume, so those inputs never reach the wrapper. After the change all eight match.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | `spec_folder_suffix()` prints the core's formatter and warns on stderr when the call fails |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Ownership test over a copied core with a changed suffix, plus a test for a throwing formatter |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The wrapper changed first at `70c81b37c3`, with an ownership test that copies the wrapper, the relaunch core and the shared hooks into a temp root, changes the copied core's formatter, and requires the relaunch seed to carry the changed marker. That test fails on the old hand-written function (`scratch/mutation/old-function.tap`, exit 1).

A read-only DeepSeek v4.1 flash max review returned PASS with two P2s: the silent node failure and a brittle regex edit in the test. Both were fixed at `1159acb5c5`. The wrapper now warns on stderr, and the test builds its marker through a shim over the real core instead of editing copied source text. A second test makes the formatter throw and requires a bare seed plus the warning; it fails without the warning (`scratch/mutation/no-warning.tap`, exit 1).

Verification moved from 4 same and 4 DIFF to 8 same and 0 DIFF. The wrapper suite passed 111 of 111 against a 109 baseline, and Hook Node passed 872 of 872 over 29 files against 870 of 870. The live session-relaunch playbook ran on OpenCode 1 and 2 with `llmgateway`: each runner exited 0, the marker was present and a tool call completed, `bash` on v1 and `shell` on v2. The shared v2 service kept PID 46220.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the suffix to the core instead of sharing a constant | The core already exports `specFolderSuffix` and `nudge.cjs` already uses it, so the wrapper had the only second copy |
| Warn and continue when the node call fails | The caller appends with `seed+=$(...)` after the record was consumed, so a non-zero return would abort a relaunch that can still happen |
| Leave invalid-folder handling alone | The CLI drops an invalid folder at prepare and consume, and the core returns `''` for one anyway, so the wrapper needs no extra rule |
| Replace the copied-source regex with a shim | Editing a copy's source text was brittle; a shim over the real core overrides only `specFolderSuffix` and keeps the test's assertion |
| Fix both review P2s in this phase | One hid a real failure and the other was a test that could break on an unrelated wording change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suffix compare before | 4 same, 4 DIFF, all four the invalid inputs - `scratch/before/suffix-compare.txt` |
| Suffix compare after | 8 same, 0 DIFF - `scratch/after/suffix-compare.txt` |
| Ownership test on the old function | FAIL, exit 1 - `scratch/mutation/old-function.tap` |
| Throwing test without the warning | FAIL, exit 1 - `scratch/mutation/no-warning.tap` |
| Wrapper suite | PASS 111/111, 0 failed, against a 109 baseline - `scratch/after/skilled-loop.tap` |
| Hook Node before | PASS 870/870 over 29 files - `scratch/before/hook-node.tap` |
| Hook Node after | PASS 872/872 over 29 files - `scratch/after/hook-node.tap` |
| Live playbook, OpenCode 1 | Runner exit 0, marker present, `bash` completed - `scratch/after/live-session-relaunch.txt` |
| Live playbook, OpenCode 2 | Runner exit 0, marker present, `shell` completed - `scratch/after/live-session-relaunch.txt` |
| Shared v2 service | PID 46220, unchanged - `scratch/after/pid46220-before.txt` |
| DeepSeek v4.1 flash max read-only review | PASS, no P0 or P1, 2 P2; both fixed in `1159acb5c5` |
| Strict validation of this packet | PASSED - `validate.sh 048-skilled-loop-shared-nudge-formatter --strict` |

The review was a separate read-only DeepSeek v4.1 flash session run through `cli-pi` on `llmgateway`, and Luna was not used, because the operator moved review to DeepSeek on 2026-10-21 and kept Luna as a fallback only.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A missing node or a throwing formatter loses the suffix, not the relaunch.** The wrapper warns on stderr and continues with a bare seed, so a caller that ignores stderr sees a relaunch without the spec-folder hint. The throwing-formatter test covers the behaviour.
2. **The live proof is one playbook run per OpenCode version.** It shows both versions relaunch with the shared formatter, but it is not a CI job; a later change to the seed parser is covered by the wrapper and Hook Node suites.
<!-- /ANCHOR:limitations -->

---
