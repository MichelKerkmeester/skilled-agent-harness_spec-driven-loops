---
title: "Implementation Summary"
description: "The OpenCode advisor plugin now sends OPENCODE only for a workspace inside this hub's own .skilled folder; system-skill-advisor 0.15.2.0."
trigger_phrases:
  - "surface hint hub root implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/008-surface-hint-hub-root"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-016-008-surface-hint-hub-root"
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
| **Spec Folder** | 008-surface-hint-hub-root |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`detectWorkspaceSurface` compares the resolved workspace with the hub's own `.skilled` folder, which `resolveHubSkilledRoot` resolves once from the plugin's location. A `.skilled` folder elsewhere no longer gets the hint. The plugin test now runs the OPENCODE case from this repository's `.skilled/skills` and adds a case for a `.skilled` folder outside the hub.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-skill-advisor.js` | Modify | Hub-rooted OPENCODE predicate |
| `system-skill-advisor-plugin.vitest.ts` | Modify | Real hub folder and the outside case |
| `system-skill-advisor` SKILL.md, changelog v0.15.2.0, Hermes copy | Modify | Release |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A workspace at `/tmp/.../.skilled/skills` now sends no surface hint; the hub's own `.skilled/skills` still sends OPENCODE.

### Dispatches

| Brief | Route | Result |
|-------|-------|--------|
| Hub-rooted predicate | DevPass `llmgateway/deepseek-v4.1-flash` at max | Applied as briefed; the brief placed the helper under the surface comment |
| Move the helper above the surface comment | DevPass `llmgateway/deepseek-v4.1-flash` at max | Applied as briefed |
| Plugin test | DevPass `llmgateway/deepseek-v4.1-flash` at max | Applied as briefed, diff reviewed |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the hub directory once | The plugin already knows its own location |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New case on the pre-fix plugin | 1 failed, 71 passed |
| Plugin suite on the fixed plugin | 72 passed |
| `package_skill.py --check --strict` on the advisor | Result: PASS |
| Hermes sync | 1 of 68 copies written |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The changelog entry was written by the orchestrator, not a dispatch.
<!-- /ANCHOR:limitations -->

---
