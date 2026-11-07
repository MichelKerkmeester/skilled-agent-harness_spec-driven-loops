---
title: "Implementation Summary"
description: "The Gate 3 spec-folder question now tells the model on every runtime to recommend one option and give the reason, instead of offering a neutral four-option menu."
trigger_phrases:
  - "decisions rule delivery implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents-md/012-repo-rule-advisor-surfacing/011-decisions-rule-delivery"
    last_updated_at: "2026-11-07T10:33:37Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Gate 3 text fixed in AGENTS.md and the mutation notice; suite and manifest checks pass"
    next_safe_action: "Commit when the operator asks; watch for neutral menus outside Gate 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-decisions-rule-delivery"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 011-decisions-rule-delivery |
| **Completed** | 2026-11-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-folder question used to reach you as four equal options. Now both texts the model copies for it say to recommend one option and give the reason.

### Phase 11: decisions-rule-delivery

`communication-decisions.md` loads only when the model chooses to read it, and the Gate 3 texts showed it a neutral menu every time. The fix changes those texts at their single source, so every runtime that delivers the Gate 3 notice carries the new wording. No per-turn directive was added: commit `f4ead54766` retired disposition directives, and you kept that rule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Options label reads "stable labels, recommend one". The D line is shortened to fit the delivery prefix |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | Regenerated to match `AGENTS.md` |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Mutation notice: "Recommend one option first and say why, never a neutral menu." |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | Modified | Byte pin follows the notice |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The notice and its pin changed first, then the spec-gate suite ran. A first `AGENTS.md` edit added a full sentence and pushed the delivery prefix to 16,522 of 16,384 bytes. The check caught it, and the instruction was folded into the options label instead. The manifest was regenerated with `--write` and checked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the Gate 3 texts, not the Directives block | The neutral menu came from these texts. A per-turn disposition line is the kind `f4ead54766` retired |
| Leave `GATE_3_QUESTION` unchanged | A person reads that dialog text. The model never sees it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test tests/hooks/spec-gate-core.test.mjs` | PASS: tests 110, pass 107, fail 0, skipped 3 |
| `agents-md-manifest.cjs --check` | PASS: 44 sections, 30 pins, prefix 16,376 / 16,384 bytes |
| `agents-md-check.cjs --source` | PASS: `STATUS=OK rows=12 findings=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only Gate 3 is covered.** Other forks still depend on the model loading `communication-decisions.md`. If neutral menus keep appearing elsewhere, measure how often before revisiting the per-turn directive.
2. **The delivery prefix has 8 bytes left.** Any further addition before Blast-Radius Management needs a matching cut.
<!-- /ANCHOR:limitations -->

---
