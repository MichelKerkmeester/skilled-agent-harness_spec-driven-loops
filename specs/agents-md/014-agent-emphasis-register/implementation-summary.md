---
title: "Implementation Summary"
description: "Planned, not started. The packet will replace the CRITICAL, IMPORTANT and (MANDATORY) labels in the agent template and nine agents with plain statements of the same boundaries."
trigger_phrases:
  - "agent emphasis register summary"
  - "agent label rewrite status"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/014-agent-emphasis-register"
    last_updated_at: "2026-09-24T13:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the packet"
    next_safe_action: "Answer the orchestrate.md bare MANDATORY question, then start T001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-agent-emphasis-register"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do the seven bare MANDATORY uses in orchestrate.md join the rewrite?"
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
| **Spec Folder** | 014-agent-emphasis-register |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is planned and holds the scope, the requirements and the task list.

### Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries

Packet `013-prompting-guide-alignment` found that the agent template prescribes `**CRITICAL**:`, `**IMPORTANT**:` and `(MANDATORY)` labels, a register current Claude models over-trigger on. You chose to handle it here, as one change across the template and every agent, because rewriting a single agent would break its conformance with the rest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | `spec.md` §3 lists the files this packet will change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The starting counts, taken on 2026-09-24 with `rg` over the three label forms, are 10 sites in `agent-template.md` and 36 in each of `.skilled/agents/` and `.claude/agents/`, spread across nine agents.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One packet for the template and all agents | The template's `:814` check requires the labels, so the template and the agents have to change together |
| `HARD BLOCK` stays | It names the hard-gate class `AGENTS.md` defines, which packet 013 chose to keep |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on the planned packet | Recorded at commit time |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The orchestrate.md question is open.** `spec.md` §7 asks whether its seven bare `MANDATORY` uses join the rewrite.
<!-- /ANCHOR:limitations -->

---
