---
title: "Implementation Summary"
description: "The three P2 advisories from the epic deep review are fixed at their source, each pinned by its test suite."
trigger_phrases:
  - "epic review fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/031-epic-review-fixes"
    last_updated_at: "2026-10-14T18:04:51Z"
    last_updated_by: "epic-review-orchestrator"
    recent_action: "Fixed R2, R4 and R5 and reran the three suites"
    next_safe_action: "Operator decides on committing and on the scoped follow-up review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-031-epic-review-fixes"
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
| **Spec Folder** | 031-epic-review-fixes |
| **Completed** | 2026-10-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A lone `-` no longer slips into a new spec folder's title, a probe line from `/doctor:sk-code setup` now reruns the same prompt when pasted, and the hook trust comment says plainly that trust covers every branch of a trusted clone.

### Phase 31: epic-review-fixes

create.sh refuses `-` with the same unknown-option error as any other unmatched dash argument, through one `-|-?*)` branch. The setup report escapes `\`, `"`, `$` and backticks inside the double-quoted prompt, so a plain prompt prints exactly as before. The six global hooks carry the new trust sentence in their shared block, still byte-identical, and the git-hooks README says the same. The trust model itself is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Lone-dash refusal |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts` | Modified | Lone-dash case |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Modified | Shell-quoted probe line |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | Modified | Shell-character case |
| `.skilled/scripts/git-hooks/` six hooks and `README.md` | Modified | Trust wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three DeepSeek dispatches made the edits in parallel from literal briefs, and a fourth folded the duplicated create.sh branch into one pattern. Each suite ran before and after the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep double quotes and escape inside them | Plain prompts and the existing tests print unchanged |
| State the trust boundary instead of changing it | Pinning hook sources is a design change that needs its own decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| create-unknown-options.vitest.ts | 3 passed, from 2 |
| sk-code-setup-check.test.cjs | 13 passed, 0 failed, from 12 |
| source-root-selection.test.sh | 58 passed, 0 failed, unchanged |
| bash -n on create.sh and the six hooks | Clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Search debt.** The 030 review's 17 deferred or blocked items, including Commit-Id and Pi Fast Mode, still need a scoped follow-up review.
<!-- /ANCHOR:limitations -->

---


