---
title: "Research Phase: GPT Deep-Agent Routing Fidelity in OpenCode"
description: "Deep research into why GPT-backed deep skills in OpenCode mis-route to the general agent, run slowly, and drift from workflow contracts relative to Claude."
trigger_phrases:
  - "gpt deep agent routing"
  - "opencode deep skill misroute"
  - "deep agent workflow fidelity"
  - "010 gpt deep agent routing"
importance_tier: important
contextType: research
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing"
    last_updated_at: "2026-06-30T10:05:30Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Synthesized 10-iteration research and created follow-on phase 011"
    next_safe_action: "Implement validator-first hardening in 011-gpt-routing-fixes"
    blockers: []
    key_files:
      - "research/research.md"
      - "../011-gpt-routing-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-010-gpt-routing-1782801010"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether narrative file hash linkage belongs in first implementation patch"
    answered_questions:
      - "GPT mis-routing root cause and validator-first implementation scope identified."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: GPT Deep-Agent Routing Fidelity in OpenCode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration/156-agent-loops-improved` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When deep skills (`/deep:research`, `/deep:review`, `/deep:context`, `/deep:ai-council`, and `/deep:*improvement`) run under a GPT-backed model in OpenCode, they can route to the general/build agent instead of dedicated deep LEAF agents. They also run slower than Claude-backed loops and drift from workflow YAML contracts for state, prompt-pack, reducer, convergence, and lock lifecycle.

### Purpose

Identify evidence-backed root causes and produce a concrete follow-on implementation scope that closes the highest-value repo-resident fidelity gap first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause research into GPT deep-skill mis-routing, slowness, and workflow drift in OpenCode.
- Both reproduction surfaces: `@orchestrate` dispatch and build-primary/general execution.
- Deep-loop command YAML contracts, agent files, prompt-pack rendering, reducer/state files, and validator behavior.
- Follow-on implementation recommendation selection.

### Out of Scope
- Runtime code implementation in this phase; implementation belongs in `../011-gpt-routing-fixes`.
- Non-deep skills and non-loop commands.
- Model providers beyond the GPT-backed and Claude baselines used in OpenCode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Canonical synthesis from 10 iterations. |
| `research/resource-map.md` | Create | Reducer-generated resource map. |
| `../011-gpt-routing-fixes/` | Create | Follow-on implementation planning packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Investigate why GPT-backed deep skills mis-route | Synthesis names root cause and reproduction surfaces. |
| REQ-002 | Investigate workflow-contract drift | Synthesis classifies drift modes and observed state failures. |
| REQ-003 | Produce implementation recommendation | Follow-on phase scope is concrete and evidence-backed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Compare GPT vs Claude fidelity | Synthesis explains bounded Claude baseline evidence and gaps. |
| REQ-005 | Preserve research artifacts | Iteration files, JSONL, dashboard, and synthesis remain under `research/`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists and summarizes root cause, drift taxonomy, fix ranking, and phase 011 recommendation.
- **SC-002**: Research includes iterations 9 and 10 after resume, matching the user-approved cap of 10 total iterations.
- **SC-003**: A new implementation phase `011-gpt-routing-fixes` exists and is scoped to validator-first hardening.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reducer question-resolution drift | Dashboard can show 0/6 resolved despite answered iteration records | Treat iteration records and synthesis as source-of-truth; record drift as finding. |
| Risk | Host-runtime source unavailable | Cannot implement structural role enforcement in this phase | Recommend repo-resident validator hardening first. |
| Dependency | Deep-research workflow | Owns iteration artifacts and synthesis | Use workflow-owned artifacts under `research/`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should narrative file hash linkage be included in phase 011, or deferred until a broader integrity sidecar design exists?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Synthesis**: `research/research.md`
- **Resource Map**: `research/resource-map.md`
- **Follow-on Plan**: `../011-gpt-routing-fixes/plan.md`
