---
title: "Routing, Dispatch, and Identity Phase Parent"
description: "Phase parent for the core deep-loop routing, dispatch-hardening, and host/FIX-5 identity fixes that made GPT-backed OpenCode route and dispatch deep-loop work correctly."
trigger_phrases:
  - "deep-loop routing dispatch identity fixes"
  - "host hard identity fix5"
  - "orchestrate universal routing ai-council"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity"
    last_updated_at: "2026-07-04T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Regrouped 9 routing/dispatch/identity phases into one core-fixes track"
    next_safe_action: "Parent complete; enforcement lives in track 003"
    blockers: []
    key_files:
      - "spec.md"
      - "005-host-hard-identity-fix5/decision-record.md"
      - "009-fix5-checkpoint/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-031-002-routing-dispatch-and-identity-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Routing, route-proof, dispatch hardening, pre-route headers, host FIX-5 identity, Mode-D ai-council identity, orchestrate universal routing, ai-council subagent-only, and the FIX-5 checkpoint all landed and were verified."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Routing, Dispatch, and Identity Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | complete |
| **Created** | 2026-07-04 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-deep-loop/031-deep-loop-gpt-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GPT-backed OpenCode mis-routed and mis-dispatched deep-loop work and could not hold a hard host identity (the FIX-5 problem). This track groups the core fixes that made routing, dispatch, and identity behave correctly.

### Purpose
Hold the routing/dispatch/identity fix phases as one coherent core-fixes story. Detailed planning and evidence live in each child phase folder.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep-agent router and orchestration, route-proof validation, agent dispatch hardening, command pre-route headers.
- Host hard identity (FIX-5), Mode-D ai-council identity, orchestrate universal routing, ai-council subagent-only, and the FIX-5 checkpoint.

### Out of Scope
- Detection/enforcement plugins (track 003).
- Benchmarks and verification (track 004).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | parent | Root purpose and child map |
| `description.json` | Generator-owned | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Generator-owned | parent | Child identity and phase graph metadata |
| `001-deep-agent-router-and-orchestration/spec.md` | Regrouped | 001 | Deep-agent router and orchestration |
| `009-fix5-checkpoint/spec.md` | Regrouped | 009 | FIX-5 checkpoint against real benchmark results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-agent-router-and-orchestration/` | Deep-agent router and orchestration (formerly 031/001) | COMPLETE |
| 002 | `002-route-proof-validation/` | Route-proof validation (formerly 031/002) | COMPLETE |
| 003 | `003-agent-dispatch-hardening/` | Agent dispatch hardening (formerly 031/003) | COMPLETE |
| 004 | `004-command-pre-route-headers/` | Command pre-route headers (formerly 031/004) | COMPLETE |
| 005 | `005-host-hard-identity-fix5/` | Host hard identity FIX-5 (formerly 031/006) | COMPLETE |
| 006 | `006-mode-d-ai-council-identity-fix/` | Mode-D ai-council identity fix (formerly 031/008) | COMPLETE |
| 007 | `007-orchestrate-universal-routing/` | Orchestrate universal routing (formerly 031/009) | COMPLETE |
| 008 | `008-ai-council-subagent-only/` | ai-council subagent-only (formerly 031/010) | COMPLETE |
| 009 | `009-fix5-checkpoint/` | FIX-5 checkpoint (formerly 031/013) | COMPLETE |

### Phase Transition Rules

- Each child phase owns one routing, dispatch, or identity fix and its evidence.
- Parent state follows the completed child phases.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Inspect one routing/dispatch/identity fix | Child `spec.md` names scope and evidence |
| child | parent | Child fix landed and verified | Downstream enforcement (track 003) can rely on it |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Detailed evidence lives in each child phase folder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-deep-agent-router-and-orchestration/` through `009-fix5-checkpoint/`
