---
title: "Implementation Summary: Agent Dispatch Hardening"
description: "The DEEP primary router and Claude mirror are now present, and both orchestrators expose a first-class Deep Route dispatch field. Registry-backed route identity is explicit before deep work reaches a loaded leaf agent."
trigger_phrases:
  - "implementation"
  - "summary"
  - "agent dispatch hardening"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/003-agent-dispatch-hardening"
    last_updated_at: "2026-06-30T20:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Agent dispatch hardening implemented"
    next_safe_action: "Proceed to phase 003-command-pre-route-headers"
    blockers: []
    key_files:
      - ".opencode/agents/deep.md"
      - ".claude/agents/deep.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-002-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-agent-dispatch-hardening |
| **Completed** | 2026-06-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The DEEP primary router now gives GPT-backed OpenCode an explicit, registry-backed first dispatch target for `/deep:*` work. Instead of negotiating from long prose, the router resolves the mode, loads the selected agent definition, emits a compact `Deep Route:` package, and dispatches exactly once.

### Deep Router Mirrors

`.opencode/agents/deep.md` implements the OpenCode primary router with `mode: primary` and `subagent_type: "general"` dispatch guidance. `.claude/agents/deep.md` mirrors the behavior with Claude `tools: Read, Agent` and `.claude/agents/*.md` path conventions.

### Orchestrator Route Field

Both orchestrator task formats now include `Deep Route:` before `Subagent Type`, so deep routes can carry `mode`, `target_agent`, `execution`, and registry source in a stable field.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/deep.md` | Created | OpenCode DEEP primary router |
| `.claude/agents/deep.md` | Created | Claude mirror router |
| `.opencode/agents/orchestrate.md` | Modified | Add `Deep Route:` dispatch field |
| `.claude/agents/orchestrate.md` | Modified | Mirror `Deep Route:` dispatch field |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation follows the concrete draft from iteration 004 and validates it against the live `mode-registry.json`. The Claude-flex preservation claim is carried from iteration 006: the `deep.md` router and `Deep Route:` field narrow mis-invocation while preserving dynamic planning, evidence-responsive leaf execution, advisory metadata, and depth-aware council behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep registry as source of truth | Prevents the router prose from becoming an independent stale route map. |
| Keep `subagent_type: "general"` in OpenCode | Current custom-agent dispatch still uses the general wrapper; hard identity is parked for phase 005. |
| Mirror Claude with runtime conventions | Claude needs `.claude/agents/*.md` paths and `tools`, while the behavior stays aligned. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Route table vs `mode-registry.json` | PASS |
| `.opencode/agents` alignment drift | PASS |
| `.claude/agents` alignment drift | PASS |
| Comment hygiene for both orchestrators | PASS |
| Claude-flex preservation table | PASS for `deep.md` and `Deep Route:` field per iteration 006 |
| `validate.sh --strict` | PASS, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No hard runtime identity.** This phase improves prompt identity, not host-enforced custom-agent identity. Phase 005 remains parked unless GPT smoke testing triggers it.
2. **Codex mirror remains out of scope.** The spec records a TOML-location contradiction, so this phase creates only OpenCode and Claude mirrors.
<!-- /ANCHOR:limitations -->

---
