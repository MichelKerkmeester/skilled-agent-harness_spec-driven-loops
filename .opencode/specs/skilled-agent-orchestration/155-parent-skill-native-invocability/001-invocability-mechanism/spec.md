---
title: "Feature Specification: Parent-skill native invocability"
description: "Parent-skill nested mode packets are not reachable via the runtime Skill tool because the one-graph-metadata invariant keeps packets advisor-invisible by construction. Converting a flat Skill()-invocable skill family into a nested parent therefore regresses direct invocation, so closing this gap is a prerequisite for the planned sk-design Model-A conversion."
trigger_phrases:
  - "parent skill native invocability"
  - "skill tool nested packet"
  - "parent mode skill invocation"
  - "skill resolve parent mode"
  - "nested packet skill regression"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan-only Level 3 packet for parent-skill native invocability"
    next_safe_action: "Await user gate; then run Phase 1 runtime-extensibility probe"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the runtime skill-discovery extensible in-repo (hook, config, or manifest)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Parent skills (the nested-mode-packet pattern, canonical example `deep-loop-workflows`) route an operator request to one of several self-contained mode packets over a shared backend. Their nested mode packets are not invocable through the runtime `Skill` tool: a `Skill(ai-council)` call returns `Error: Unknown skill: ai-council` because `ai-council` is a nested packet with no `graph-metadata.json`, and the one-hub invariant requires zero `graph-metadata.json` in packets. This packet specifies the research and design needed to make parent-skill modes natively reachable without regressing that single-identity invariant. It is plan-only; execution is gated.

**Key Decisions**: The mechanism choice (per-mode commands, per-mode agents, thin shim skills, or a runtime enhancement) is framed as pending Phase 1 research, not pre-decided.

**Critical Dependencies**: The runtime skill-discovery surface lives in the OpenCode / Claude-Code binary, which is outside repository control.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-26 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Parent skills route to nested mode packets, but those packets are not invocable through the runtime `Skill` tool. Confirmed in-session: `Skill(ai-council)` returns `Error: Unknown skill: ai-council`, because `ai-council` is a nested packet under `deep-loop-workflows/` and the parent-skill one-hub invariant requires zero `graph-metadata.json` in packets, which makes packets advisor-invisible by construction. `deep-loop-workflows` reaches its modes through its `/deep:*` commands and agent types, never through `Skill()`. The consequence: converting a flat skill family into a nested parent regresses invocability, because today each flat skill (for example `sk-design-interface`) is directly `Skill()`-invocable, but as a nested packet it would not be.

### Purpose
Make a parent skill's modes natively reachable by the operator without regressing the one-`graph-metadata.json` single-identity invariant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Phase 1 research and design effort that confirms whether the runtime skill-discovery surface is extensible at all, prototypes the least-bad mechanism, and produces a decision record selecting among the mechanism options below.
- A decision-record framing of the mechanism options (per-mode commands, per-mode agents, thin shim skills, runtime enhancement) with explicit tradeoffs, marked pending Phase 1 research.
- A Phase 2+ outline that implements the chosen mechanism generically for parent skills, gated on the Phase 1 outcome.

### Out of Scope
- Any implementation of skills, agents, commands, runtime code, or configuration in this packet. This packet is plan-only; execution is gated by the user.
- Changing the one-`graph-metadata.json` single-identity invariant or any per-mode convergence, state, artifact, or tool-permission contract. The invariant is the constraint this work must respect, not a thing to relax.
- The `sk-design` Model-A conversion itself (tracked separately). This packet is a prerequisite for it, not a substitute.

### Files to Change
This packet authors documentation only. No source, runtime, or configuration files change.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/spec.md` | Create | This specification |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/plan.md` | Create | Phased research-and-design plan |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/tasks.md` | Create | Phase 1 task breakdown |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/decision-record.md` | Create | Mechanism decision, pending Phase 1 research |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec records the confirmed invocability gap and its root cause with evidence | spec.md cites the `Skill(ai-council)` failure and the one-`graph-metadata.json` invariant from the parent-skill reference |
| REQ-002 | The decision record frames all four mechanism options with explicit tradeoffs and a pending-research status | decision-record.md lists options A through D, each with pros, cons, and the invocability-vs-identity tension, and marks the choice deferred to Phase 1 |
| REQ-003 | Phase 1 is scoped as research and design only, with no implementation committed before the user gate | plan.md Phase 1 commits to a runtime-extensibility probe, a prototype, and a decision record, with Phase 2+ gated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The packet records its dependency and relationship edges | spec.md and graph-metadata.json state that spec 154 depends on this packet and that this packet relates to 150 and 147 |
| REQ-005 | The success criterion is stated as native reachability without invariant regression | spec.md success criteria require operator-reachable modes and a preserved single-identity invariant |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A parent skill's modes are natively reachable by the operator without regressing the one-`graph-metadata.json` single-identity invariant.
- **SC-002**: Phase 1 produces a decision record that selects one mechanism among the options with cited evidence, including an explicit fallback if a runtime enhancement is out of reach in-repo.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime skill-discovery surface in the OpenCode / Claude-Code binary | High. A true native `Skill()` resolution of parent modes may be impossible in-repo | Frame option D as possibly out of reach and pre-commit a fallback to options A or B, or C with its identity cost |
| Risk | A thin shim skill per mode re-introduces N skill identities | High. It directly conflicts with the one-hub invariant and the advisor's single-identity routing | Treat option C as a last resort and record the identity cost explicitly in the decision record |
| Risk | A second parent skill exercises deep-loop-specific advisor coupling | Medium. The advisor merged-identity projection and the `/doctor:parent-skill` drift-guard are currently deep-loop-scoped | Phase 1 verifies generality before any Phase 2 implementation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Any chosen mechanism must not add runtime cross-skill import coupling to the advisor hot path. The existing pattern keeps projection maps in code and guards them with a test rather than loading the registry at runtime.

### Security
- **NFR-S01**: No mechanism may widen a packet's tool-permission contract as a side effect of becoming invocable.

### Reliability
- **NFR-R01**: The chosen mechanism must keep exactly one advisor identity per parent skill so routing-parity fixtures that assert a single skill-to-mode mapping stay valid.

---

## 8. EDGE CASES

### Data Boundaries
- Grandfathered folder-vs-name mismatch: the `ai-council` packet has folder `ai-council` and packet name `deep-ai-council`. Any invocation mechanism must resolve this recorded mismatch rather than assume folder equals name.
- A packet that hosts several modes (the canonical `deep-improvement` hosts four) keeps one packet skill name. An invocation mechanism keyed per mode must not assume one mode per packet.

### Error Scenarios
- Adding a `graph-metadata.json` to a packet to force discovery either throws at build when `skill_id` does not equal the folder, or registers a second skill identity. Both outcomes break the single-identity contract and are out of scope as solutions.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Plan-only now; Phase 2+ touches advisor, command, and agent surfaces |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y for invariant if done wrong; runtime is out of repo control |
| Research | 18/20 | Runtime extensibility is unknown and must be probed before any mechanism is chosen |
| Multi-Agent | 6/15 | Single research-and-design workstream in Phase 1 |
| Coordination | 10/15 | Dependency from spec 154; relationship to 150 and 147 |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime enhancement (option D) is not achievable in-repo | H | H | Pre-commit fallback to commands and agents (A and B), or shims (C) with identity cost recorded |
| R-002 | A chosen mechanism quietly creates a second skill identity | H | M | Phase 1 verifies the mechanism against the one-hub invariant before implementation |
| R-003 | Deep-loop-specific advisor coupling blocks a generic solution | M | M | Phase 1 confirms generality and scopes any per-parent layer needed |

---

## 11. USER STORIES

### US-001: Operator invokes a parent-skill mode (Priority: P0)

**As an** operator, **I want** to reach a parent skill's mode natively, **so that** a nested parent does not lose the direct invocation a flat skill had.

**Acceptance Criteria**:
1. Given a parent skill with nested mode packets, When the operator invokes a named mode, Then the mode is reachable through the mechanism Phase 1 selects.

### US-002: Maintainer converts a flat family without regression (Priority: P1)

**As a** maintainer, **I want** native mode invocability defined before the `sk-design` Model-A conversion, **so that** the conversion does not regress direct invocation.

**Acceptance Criteria**:
1. Given the planned `sk-design` conversion, When this packet's mechanism is chosen, Then the conversion can adopt it without breaking the single-identity invariant.

---

## 12. OPEN QUESTIONS

- Is the runtime skill-discovery surface extensible in-repo through any hook, config entry, or manifest the binary honors? This is the gating question for option D and is assigned to Phase 1.
- If option D is out of reach, do commands and agents (A and B) count as the canonical native-invocation surface for parent-skill modes, or is the shim path (C) preferred despite its identity cost? Phase 1 records the tradeoff and recommends.
<!-- /ANCHOR:questions -->

---

## 13. DEPENDENCIES AND RELATED PACKETS

- **Dependent**: spec 154 (the `sk-design` Model-A conversion) depends on this packet. Native invocability of parent-skill modes must exist before that conversion, so it does not regress direct `Skill()` invocation.
- **Extends**: spec 150 (parent-nested-skill-pattern) established the pattern and the one-`graph-metadata.json` invariant but did not address mode invocability. This packet extends 150 by closing that gap.
- **Related**: spec 147 (deep-loop-workflows) is the implementation of the pattern and the canonical example whose `/deep:*` commands and agent types are the current non-`Skill()` invocation surface.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent-skill pattern reference**: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`
- **Canonical parent skill**: `.opencode/skills/deep-loop-workflows/SKILL.md`
