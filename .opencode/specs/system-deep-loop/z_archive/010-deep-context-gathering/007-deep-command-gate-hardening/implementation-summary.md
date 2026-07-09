---
title: "Implementation Summary: Deep-command @general + setup hard-blocker gates"
description: "Every deep command now opens with two un-skippable HARD-BLOCK gates: Phase 0 @general-agent verification, then the BLOCKED unified setup phase."
trigger_phrases:
  - "deep command gate summary"
  - "phase 0 gate done"
  - "unskippable setup done"
  - "deep command hard blocker summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/007-deep-command-gate-hardening"
    last_updated_at: "2026-06-07T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped Phase 0 + BLOCKED setup gates on all 7 deep commands"
    next_safe_action: "Optional: a runtime hook for hard enforcement (deferred by user)"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-context-loop.md"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/ask-ai-council.md"
      - ".opencode/commands/deep/start-skill-benchmark-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-007-deep-command-gate-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Enforcement? -> markdown hard-blocker (no hook)."
      - "Gates? -> both (@general Phase 0 + un-skippable setup)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-deep-command-gate-hardening |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every deep command now opens with the same two un-skippable gates, so an AI cannot start a deep loop without first confirming it is the orchestrator and completing setup. Before this, only two of the seven commands had the @general-agent check, and the setup-phase blocker varied in strength.

### Gate 1: Phase 0 @general-agent verification

The five commands that lacked it — `start-context-loop`, `start-research-loop`, `start-review-loop`, `ask-ai-council`, and `start-skill-benchmark-loop` — now carry the canonical Phase 0 self-check (`STATUS: ☐ BLOCKED`) adapted to each command's skill and restart line. Each command's EXECUTION PROTOCOL now lists "Run Phase 0" as the first action.

### Gate 2: un-skippable unified setup phase

Every command's setup phase is a `STATUS: ☐ BLOCKED` gate: in `:confirm`/no-suffix it must present the consolidated prompt and wait (do not proceed until answered); in `:auto` it must resolve confidently or fail fast naming the missing inputs. The thin `start-skill-benchmark-loop` gained a full EXECUTION PROTOCOL plus a BLOCKED Setup section; the others already had strong setup phases, normalized here to the `☐ BLOCKED` marker.

### Standardization

The broken display box in `start-model-benchmark-loop` was realigned, and the setup `STATUS` markers across the four consolidated-prompt commands were normalized to `☐ BLOCKED` so all seven read consistently. `start-agent-improvement-loop` was already conformant and left unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `start-context-loop.md` | Modified | Phase 0 + first-action order + setup marker |
| `start-research-loop.md` | Modified | Phase 0 + first-action order + setup marker |
| `start-review-loop.md` | Modified | Phase 0 + first-action order + setup marker |
| `ask-ai-council.md` | Modified | Phase 0 + first-action order + setup marker |
| `start-skill-benchmark-loop.md` | Modified | EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup |
| `start-model-benchmark-loop.md` | Modified | Fixed broken display box |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The model-benchmark Phase 0 block was the template; it was copied into each missing command with three substitutions (indicator skill, box skill, restart line). A grep sweep confirmed all seven commands carry Phase 0, each first-action list names "Run Phase 0" as step 1, each command shows two `☐ BLOCKED` markers (Phase 0 + setup), and each restart line matches its command. The packet passed `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Markdown gate, no runtime hook | Slash commands only run in the orchestrator, so a prompt-level STATUS:☐ BLOCKED gate is the practical enforcement layer; the user chose markdown |
| Both gates, ordered Phase 0 → setup | The user wanted the @general check and the setup prompt both un-skippable |
| Copy the model-benchmark canonical block | It is the established pattern; adapting it keeps all seven identical |
| Leave agent-improvement unchanged | It was already conformant; no edit needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 0 on all 7 commands | PASS (grep matched 7/7) |
| EXECUTION PROTOCOL first action = Run Phase 0 | PASS (7/7) |
| Two `☐ BLOCKED` markers per command (Phase 0 + setup) | PASS (7/7) |
| Per-command restart line + skill name correct | PASS (no model-benchmark leftovers) |
| model-benchmark display box aligned | PASS |
| `validate.sh --strict` (this packet) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Enforcement is prompt-level, not runtime.** The gates are markdown HARD BLOCKS the AI is told not to skip; there is no hook that blocks execution. This is acceptable because `/deep:*` slash commands only ever run in the main orchestrator agent. A `UserPromptSubmit` hook that injects the gate on `/deep:*` is a possible follow-up if hard runtime enforcement is later wanted.
2. **`ask-ai-council` carries a dual command name.** Its body references `/speckit:deep-council` in places while the registered command is `/deep:ask-ai-council`; the Phase 0 restart line uses the registered `/deep:ask-ai-council`. Reconciling the dual naming is out of scope here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
