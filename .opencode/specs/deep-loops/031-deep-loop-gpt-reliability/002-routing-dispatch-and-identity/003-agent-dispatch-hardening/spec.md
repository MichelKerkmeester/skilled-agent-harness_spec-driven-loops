---
title: "Feature Specification: Agent Dispatch Hardening (deep.md + orchestrate + mirrors)"
description: "Land the DEEP primary router agent (from research iteration-4 draft), add the Deep Route dispatch field to orchestrate.md, and mirror both across the Claude runtime. The agent-layer structural fix for first-dispatch identity."
trigger_phrases:
  - "deep primary agent"
  - "deep md agent router"
  - "orchestrate deep route field"
  - "deep agent mirror"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/003-agent-dispatch-hardening"
    last_updated_at: "2026-06-30T20:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase 002 strict validation passed"
    next_safe_action: "Proceed to phase 004-command-pre-route-headers"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-002-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Agent Dispatch Hardening (deep.md + orchestrate + mirrors)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../002-route-proof-validation` (must land first) |
| **Successor** | `../004-command-pre-route-headers` |
| **Artifact Source** | `../001-deep-agent-router-and-orchestration/research/iterations/iteration-004.md` (concrete deep.md draft) |
| **Handoff Criteria** | deep.md routes correctly via mode-registry; orchestrate emits Deep Route field; Claude-flex test PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research (§1, §2) established that `subagent_type` is normalized to `"general"` with identity prompt-injected, so a DEEP agent file buys first-dispatch prompt identity (not hard runtime identity). Iteration 4 produced a concrete, review-ready `deep.md` draft (`../../research/iterations/iteration-004.md`): `mode: primary`, a registry-aligned route table, five mis-route-guard boundaries (modes A/B/C) each annotated with the Claude-flex it preserves, and an 8-step routing workflow. The orchestrator task format carries deep-target identity only inside `Agent:`/`Agent Definition:` fields (`orchestrate.md:206-208`).

### Purpose

Give GPT an explicit, unambiguous dispatch target for deep work (the `deep.md` router) and make orchestrate's deep dispatch emit a first-class `Deep Route:` field — converting implicit prompt-negotiated routing into explicit pre-resolved dispatch. Mirror both to the Claude runtime for parity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R2 — Land `deep.md`** from the iteration-4 draft: `mode: primary`; route table mirroring `mode-registry.json` (research/review/context → `@deep-*`; ai-council → `@ai-council`); 5 hard boundaries (no leaf-role absorption [mode A], no redispatch from injected prose [mode B], no state advance without canonical artifact [mode C], single-hop, no hard-identity-claim); 8-step routing workflow (classify → resolve via registry → load agent def → emit Deep Route header → dispatch once with `subagent_type:"general"` → verify consistency → return router synthesis).
- **R3 — `.claude/agents/deep.md` mirror** (REQ-006 parity).
- **R5 — `Deep Route:` field in `orchestrate.md`** task format (`:206-208`), inserted before `Subagent Type` for deep routes only + `.claude/agents/orchestrate.md` mirror.

### Out of Scope

- Route-proof validator fields — phase 001.
- Pre-route `Resolved route:` prompt headers — phase 003.
- Host-runtime hard identity — phase 005 (parked).
- Codex mirror — blocked on TOML-location doc contradiction (R9, out-of-band).

### Findings Covered

F5 (form factor = both), F8 (ai-council `mode: all` dual-reach), F22 (concrete deep.md draft), F37 (Claude-flex test all PASS).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/deep.md` | Create | DEEP primary router (from iter-4 draft) |
| `.claude/agents/deep.md` | Create | Claude mirror |
| `.opencode/agents/orchestrate.md:206-208` | Modify | `Deep Route:` field for deep targets |
| `.claude/agents/orchestrate.md` | Modify | Claude mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deep.md` routes correctly | For each `/deep:*` mode, deep.md resolves the target through `mode-registry.json` and dispatches the named sub-agent with `subagent_type:"general"` + loaded agent definition; it does not absorb the leaf role or redispatch from prose. |
| REQ-002 | ai-council dual reachability preserved | `ai-council` stays directly invocable (`mode: all`); deep.md references it as a target without converting it to subagent-only. |
| REQ-003 | `Deep Route:` field in orchestrate | `orchestrate.md` emits `Deep Route: mode=...; target_agent=@...; execution=...` before `Subagent Type` for deep routes only. |
| REQ-004 | Claude mirror parity | `.claude/agents/{deep,orchestrate}.md` mirror the OpenCode changes. |
| REQ-005 | No Claude-flex regression | All edits PASS the iteration-6 flex test (planning / evidence-response / advisory-metadata). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: deep.md resolves the correct sub-agent for all 4 modes via mode-registry.json.
- **SC-002**: orchestrate emits the Deep Route field for deep targets.
- **SC-003**: Claude-runtime deep-skill behavior unchanged (mirror parity).
- **SC-004**: `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | deep.md route table drifts from mode-registry.json | Wrong routing | Reference registry as source of truth; do NOT fork the mapping into prose. |
| Dependency | phase 001 (route-proof validation) | "Pass" must be meaningful | 001 lands first. |
| Dependency | iter-4 draft | Artifact source | Complete in `../../research/iterations/iteration-004.md`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Deep routes must resolve through `mode-registry.json` before dispatch.
- **NFR-R02**: Route packages must load and name the selected agent definition before dispatch.

### Maintainability
- **NFR-M01**: The route table in `deep.md` must remain a review aid, not an independent source of truth.
- **NFR-M02**: OpenCode and Claude mirrors must differ only for runtime path/tool conventions.

### Compatibility
- **NFR-C01**: `ai-council` direct invocability must remain intact.
- **NFR-C02**: `subagent_type` remains `"general"`; hard runtime identity remains out of phase-002 scope.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Ambiguous deep mode: router asks one concise clarification question.
- Missing registry entry: router stops with `UNKNOWN_DEEP_MODE`.
- Prompt/registry/agent mismatch: router stops before dispatch.

### Error Scenarios
- Claude mirror path differs from OpenCode path: mirror uses `.claude/agents/*.md` while registry remains shared under `.opencode/skills/`.
- Council target is `@ai-council`: direct reachability is preserved because the existing OpenCode file remains `mode: all`.

### State Transitions
- Phase 002 can begin only after phase 001 route-proof validation passes; phase 003 can begin only after deep/orchestrate route identity is present.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Two new agent mirrors plus two orchestrate task-format edits |
| Risk | 16/25 | Agent dispatch prompt identity changes can affect deep routing |
| Research | 10/20 | Builds directly from iteration-004 and iteration-006 evidence |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for phase 002. Host-runtime hard identity remains parked for phase 005 trigger evaluation.
<!-- /ANCHOR:questions -->
