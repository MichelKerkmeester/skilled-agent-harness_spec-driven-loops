---
title: "Implementation Summary: Phase 23: deep-review-remediation"
description: "Every finding of the 2026-10-27 deep review of packet 054 is fixed: a quoted fence no longer hides a token, --path checks where a link points, and the records match the repository."
trigger_phrases:
  - "deep review remediation implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/023-deep-review-remediation"
    last_updated_at: "2026-10-27T08:20:00Z"
    last_updated_by: "conductor"
    recent_action: "Fixed every deep review finding and closed the phase"
    next_safe_action: "Push on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-023-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-deep-review-remediation |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An unfilled value token can no longer hide behind a quoted code fence in a v2.3 doc, and `create.sh --path` can no longer write a packet outside the repository through an existing symlink. The other nine findings of the deep review are fixed too, so the packet's records say what the repository holds.

### Phase 23: deep-review-remediation

The placeholder gate now reads fences the way Markdown does. A fence closes only on its own marker character, at least as long as the opener, with only spaces or tabs after it, and the validator and the shell rule agree on CRLF docs. Pre-v2.3 docs keep the old toggle, so no existing verdict moves. `create.sh --path` resolves an existing target before it checks containment, keeps the name you typed, and refuses the repository root.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | Fence matching, digest snapshot, dead branch removed |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Modified | Same fence matching, CRLF strip, true header, dead branch removed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Judge an existing `--path` by its real target, refuse the root |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts` | Modified | Seven fence rows across both stamps and statuses |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-path-containment.vitest.ts` | Created | Outside link, broken link, file, root, inside link, new folder |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | A recursive run repairs each Draft child |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Modified | Warn-only rules without changelog tense |
| `.skilled/skills/system-spec-kit/SKILL.md`, `changelog/v2.12.5.0.md`, Hermes copy | Modified, Created | Release 2.12.5.0 |
| `../goal.md`, `../spec.md`, `../010-*/spec.md`, `../021-*/` | Modified | Phase set, push record, REQ-001, commit state |
| `../020-alignment-audit-fixes/scratch/audit/findings.json` | Modified | 46 dispositions, all fixed, each with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three Opus medium lanes ran in parallel on files they did not share: the two scanners, `create.sh`, and the audit dispositions. The conductor corrected the docs and records. Each code fix landed with a test run first on the old code. A fresh Opus medium reviewer then read the diff and found one more P1, the CRLF disagreement, and seven P2s, all fixed with tests. The build, the full spec-kit suite and recursive strict validation ran last on the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Narrow phase 010 REQ-001 instead of refusing symlinked tracks | The track pass-through is deliberate and tested, and the `..` escape the requirement targeted is closed. The operator chose this on 2026-10-27 |
| Keep the pre-v2.3 fence toggle | Changing it would move verdicts of existing packets, which the parent's D2 forbids |
| Record the recursive auto-repair rather than block it | Running the validator directly is when the repair is meant to run, and every write is printed |
| Return the `--path` as named after checking its real target | The packet's number and name come from the path the user gave, not from where a link points |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fence rows on the old code | `Tests 8 failed \| 56 passed (64)`; pass after |
| `--path` escape case on the old code | Failed with `expected +0 not to be +0`; passes after |
| CRLF rows without the awk strip | `2 failed`; pass with it |
| Runtime build | `npm run build` exit 0 |
| Full spec-kit suite | `Test Files 301 passed \| 6 skipped (307)`, `Tests 3600 passed \| 33 skipped (3633)`, rc 0 |
| `test-validation-extended.sh` | PLACEHOLDER_FILLED 8/8, `RESULT: PASSED` |
| Verdict blast radius | Two v2.3-or-later docs in `specs/` hold a token and a fence, both in packet 054 |
| Hermes copies | `PASS: 67 Hermes skill copies in sync` |
| Packet validation | `validate.sh --strict --recursive` on packet 054: 24 of 24 `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`--track` still follows a symlink.** A track that exists as a link to another tree receives the packet there, by design. Remove the link first when that is not wanted.
2. **The deep review's DeepSeek lineage did not exit.** Its `pi` process stayed idle after writing its report and was stopped by hand; the fan-out runner's stall watchdog warns but does not end a lineage whose work is done.
<!-- /ANCHOR:limitations -->
