---
title: "Implementation Summary: Spec Mutation Gate (planning stub) [template:level_3/implementation-summary.md]"
description: "Planning stub for the runtime Gate-3 spec-mutation guard. The phase is planned and not yet implemented; this file lists intended deliverables and makes no completion claims."
trigger_phrases:
  - "spec mutation gate summary"
  - "mk-spec-gate planning stub"
  - "gate 3 guard planned"
  - "spec-gate deliverables"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Set implementation-summary as a planning stub for the not-yet-implemented phase"
    next_safe_action: "Rewrite after implementation with real verification evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec Mutation Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **Planning stub**: This phase is planned and not yet implemented. The sections below describe intended deliverables only. No work is complete and no verification has run.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-spec-mutation-gate |
| **Status** | Planned (not yet implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase will build a runtime Gate-3 spec-mutation guard once the plan is approved. Intended deliverables:

- A runtime-neutral ESM policy core exposing `classifyIntent()` and `evaluateMutation()`, reusing `classifyPrompt` and `validateSpecFolderBinding`.
- An OpenCode adapter plugin (`mk-spec-gate.js`) wiring classify, enforce, and state sweep.
- A Claude adapter: a `UserPromptSubmit` classify hook and a `PreToolUse` "Write|Edit" enforce hook, plus two `.claude/settings.json` entries.
- Session state under `.opencode/skills/.spec-gate-state/` and a golden-loop vitest with an `answerParse()` corpus.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout ships classify-only first (observe-only, deny env unset), measures the `answerParse()` false-positive rate against a corpus, then flips `MK_SPEC_GATE_ENFORCE` on for Write/Edit once that rate is accepted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Runtime-neutral ESM core plus two thin adapters | Reuse the ESM classifier once and keep classify and enforce policy in a single tested place (ADR-001) |
| Advisory default, deny opt-in, fail-open everywhere | The guard sits on the Write/Edit hot path, so a bug must never block correctly-scoped work (ADR-002) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Golden-loop vitest, fail-open matrix, `answerParse()` corpus | Not run (planning stage) |
| `validate.sh --strict` on this phase folder | To run during implementation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning stage only.** No code exists yet; every item in tasks.md and checklist.md is unchecked and no evidence has been produced.
<!-- /ANCHOR:limitations -->
