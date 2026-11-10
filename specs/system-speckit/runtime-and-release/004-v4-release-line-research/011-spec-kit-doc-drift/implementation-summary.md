---
title: "Implementation Summary"
description: "Four spec-kit documents and three command docs now describe the code as it is: no scope-adherence check, no tiered save router, a kill switch that takes `1`, a phase-parent anchor exemption and a strict SOURCE_TAGS exception."
trigger_phrases:
  - "spec kit doc drift implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/011-spec-kit-doc-drift"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
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
| **Spec Folder** | 011-spec-kit-doc-drift |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Release notes and references stopped promising checks and routers the code never had.

### Phase 11: spec-kit-doc-drift

The v4.0.0.0 note now says acceptance coverage is the one new check and that scope adherence did not ship. The v4.0.0.5 note says a phase parent stays exempt from the stricter `ANCHORS_VALID`. The save-workflow reference keeps the eight content categories as the vocabulary validation uses and says plainly that the writer does not classify chunks and ignores `routeAs` and `mergeModeHint`. Both ENV-REFERENCE rows for `SYSTEM_SPEC_GATE_DISABLED` name `1` and explain why the other truthy words are unreliable. The plan, implement and complete commands name the strict SOURCE_TAGS exception phase 010 introduced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.0.md` | Modified | Scope-adherence paragraph |
| `.skilled/changelog/skilled/v4.0.0.5.md` | Modified | Phase-parent exemption |
| `SK/references/memory/save-workflow.md` | Modified | Content Categories section |
| `SK/runtime/ENV-REFERENCE.md` | Modified | Two kill-switch rows |
| `.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modified | Strict exception sentence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. Four short DeepSeek V4.1 Flash max briefs (cli-pi) made the edits with literal replacement text. cli-codex `gpt-6-luna` high-fast reviewed the diff read-only against the code and returned PASS with no rows. The orchestrator checked the save writer's real scope against its help text before the last brief.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document the kill switch as `1` rather than widen the parser | A kill switch's grammar is behaviour; one reliable value is enough |
| Rewrite the router section rather than delete it | The category names are still the validation vocabulary |
| Edit released notes in place | The sentences were false when published; the rest of each note is unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on seven docs | Before 6 clean plus ENV-REFERENCE exit 0 with a type-fallback note. After the same |
| `env-reference-drift.vitest.ts` | Before 5/0. After 5/0 |
| REQ-001 rg probe | After: no output, exit 1 |
| Cross-family review | Luna PASS, no rows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate core and the hooks hub still read the kill switch with two grammars.** The docs now name the value both accept; unifying the parsers is a behaviour change for a later phase.
<!-- /ANCHOR:limitations -->

---
