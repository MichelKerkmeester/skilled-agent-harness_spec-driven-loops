---
title: "Feature Specification: Parent-skill native invocability"
description: "Decision packet for parent-skill native invocability. ADR-001 is Accepted: Option E invokable-hub routing reaches nested mode packets through the invocable parent hub while preserving one graph-metadata identity. This packet has no source build; NFR-S01 is carried to phase 002 for the hub union-grant decision."
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
    recent_action: "ADR-001 accepted; no 001 source build"
    next_safe_action: "Carry NFR-S01 into 002's hub union-grant documentation and remaining deep-loop validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "NFR-S01 is unresolved in 001 and carried to 002's union-grant decision."
    answered_questions:
      - "ADR-001 Accepted Option E: Skill(parent) loads the hub, and the hub routes to the nested mode packet."
      - "No runtime enhancement or 001 source build is required; options A/B remain fallback complementary surfaces."
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

Parent skills route an operator request to self-contained nested mode packets over a shared backend. Direct mode invocation still fails: `Skill(ai-council)` returns `Error: Unknown skill: ai-council` because nested packets carry no `graph-metadata.json` and stay advisor-invisible by construction. ADR-001 resolves the mechanism by using the invocable parent hub instead: `Skill(deep-loop-workflows)` loads the hub, and the hub router loads the matching nested mode packet. This preserves the one-hub invariant and avoids a runtime change. This 001 packet records the decision only; no source build occurs here.

**Key Decisions**: ADR-001 is Accepted. Option E, invokable-hub routing, is the chosen mechanism. Options A and B remain fallback complementary surfaces; options C and D are not needed for the accepted path.

**Critical Dependencies**: The accepted mechanism depends on the top-level parent hub remaining invocable and on the hub router loading nested packets from `mode-registry.json`. NFR-S01 is not proven in this packet; phase 002 documents the hub union-grant pattern.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Decision complete; NFR-S01 carried to 002 |
| **Created** | 2026-06-26 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Parent skills route to nested mode packets, but those packets are not invocable through the runtime `Skill` tool. Confirmed in-session: `Skill(ai-council)` returns `Error: Unknown skill: ai-council`, because the mode is a nested packet and the parent-skill invariant requires zero `graph-metadata.json` below the hub. The accepted path is not `Skill(mode)`. It is `Skill(parent)`: `Skill(deep-loop-workflows)` reaches the top-level hub, and the hub's registry-driven router loads the nested mode packet internally. That is the Option E mechanism ADR-001 accepted.

### Purpose
Make a parent skill's modes natively reachable by the operator without regressing the one-`graph-metadata.json` single-identity invariant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A decision record framing all five mechanism options: A per-mode commands, B per-mode agents, C thin shim skills, D runtime enhancement, and E invokable-hub routing.
- The accepted mechanism: Option E, where `Skill(<parent>)` invokes the top-level hub and the hub routes to a nested mode packet.
- A fallback statement for Option E: keep commands and agents (A/B) as supported complementary surfaces if hub invocation is insufficient for an operator flow.
- Carrying NFR-S01 forward to phase 002 because this packet does not prove per-mode tool-permission narrowing.

### Out of Scope
- Any implementation of skills, agents, commands, runtime code, or configuration in this packet. This packet is decision-only; no source build occurs in 001.
- Changing the one-`graph-metadata.json` single-identity invariant or any per-mode convergence, state, artifact, or tool-permission contract. The invariant is the constraint this work must respect, not a thing to relax.
- The `sk-design` Model-A conversion itself (tracked separately). This packet is a prerequisite for it, not a substitute.

### Files to Change
This packet authors documentation only. No source, runtime, or configuration files change.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/spec.md` | Update | This specification |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/plan.md` | Update | Decision-aligned plan/status |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/tasks.md` | Update | Decision and carry-forward task breakdown |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` | Update | ADR-001 Accepted mechanism decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec records the confirmed invocability gap and its root cause with evidence | spec.md cites the `Skill(ai-council)` failure and the one-`graph-metadata.json` invariant from the parent-skill reference |
| REQ-002 | The decision record frames all five mechanism options with explicit tradeoffs and an accepted status | decision-record.md lists options A through E, records Option E as chosen, and explains why A/B remain fallback surfaces while C/D are not required |
| REQ-003 | 001 is scoped as decision-only, with no source build in this packet | plan.md and implementation-summary.md state that the accepted mechanism is documented here and source alignment belongs to downstream packets |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The packet records its dependency and relationship edges | spec.md and graph-metadata.json state that spec 154 depends on this packet and that this packet relates to 150 and 147 |
| REQ-005 | The success criterion is stated as native reachability without identity regression | spec.md success criteria require operator-reachable modes through the hub and a preserved single-identity invariant |
| REQ-006 | NFR-S01 is not falsely marked satisfied in 001 | spec.md, decision-record.md, checklist.md, and implementation-summary.md carry NFR-S01 to 002's hub union-grant decision |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A parent skill's modes are reachable through the invokable parent hub without regressing the one-`graph-metadata.json` single-identity invariant.
- **SC-002**: ADR-001 selects Option E with cited tradeoffs and records A/B commands and agents as the explicit fallback if hub invocation is insufficient for an operator flow.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime skill-discovery surface in the OpenCode / Claude-Code binary | Low for the accepted path. A true native `Skill(mode)` resolution remains out-of-repo, but Option E avoids needing it | Use the already-invocable parent hub; keep A/B commands and agents as fallback surfaces |
| Risk | A thin shim skill per mode re-introduces N skill identities | High. It directly conflicts with the one-hub invariant and the advisor's single-identity routing | Treat option C as a last resort and record the identity cost explicitly in the decision record |
| Risk | Hub-level tool grants may be broader than a nested mode packet's own `allowed-tools` declaration | Medium. Option E uses the parent hub as the invocable contract, so per-mode permission language must not imply runtime narrowing that has not been proven | Carry NFR-S01 to 002 and document the union-grant pattern honestly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Any chosen mechanism must not add runtime cross-skill import coupling to the advisor hot path. The existing pattern keeps projection maps in code and guards them with a test rather than loading the registry at runtime.

### Security
- **NFR-S01**: UNRESOLVED in 001 and carried to 002. Option E preserves the one-hub identity, but the hub's `allowed-tools` are the union the modes need; this packet does not prove runtime narrowing to each nested packet's own declaration.

### Reliability
- **NFR-R01**: The chosen mechanism must keep exactly one advisor identity per parent skill so routing-parity fixtures that assert a single skill-to-mode mapping stay valid.

---

## 8. EDGE CASES

### Data Boundaries
- Legacy public surfaces can diverge from packet folder/name identity. Phase 002 resolves the packet folder to `deep-ai-council` while preserving `/deep:ai-council` and the `ai-council` agent surface.
- A packet that hosts several modes (the canonical `deep-improvement` hosts four) keeps one packet skill name. An invocation mechanism keyed per mode must not assume one mode per packet.

### Error Scenarios
- Adding a `graph-metadata.json` to a packet to force discovery either throws at build when `skill_id` does not equal the folder, or registers a second skill identity. Both outcomes break the single-identity contract and are out of scope as solutions.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Decision-only in 001; downstream alignment touches hub, command, and agent surfaces |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y for invariant or permission-contract docs if done wrong |
| Research | 12/20 | Runtime extensibility is no longer gating Option E, but NFR-S01 semantics need downstream documentation |
| Multi-Agent | 6/15 | Single research-and-design workstream in Phase 1 |
| Coordination | 10/15 | Dependency from spec 154; relationship to 150 and 147 |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runtime enhancement (option D) is not achievable in-repo | M | H | Option E avoids the runtime change; commands and agents (A/B) remain fallback surfaces |
| R-002 | A chosen mechanism quietly creates a second skill identity | H | M | Phase 1 verifies the mechanism against the one-hub invariant before implementation |
| R-003 | Tool-permission language overpromises per-mode narrowing | M | M | 002 documents the hub union-grant contract and keeps mode contracts as mode-owned guidance, not runtime-enforced grants |

---

## 11. USER STORIES

### US-001: Operator invokes a parent-skill mode (Priority: P0)

**As an** operator, **I want** to reach a parent skill's mode natively, **so that** a nested parent does not lose the direct invocation a flat skill had.

**Acceptance Criteria**:
1. Given a parent skill with nested mode packets, When the operator invokes `Skill(<parent>)` with a mode hint or domain request, Then the hub routes to the matching nested mode packet.

### US-002: Maintainer converts a flat family without regression (Priority: P1)

**As a** maintainer, **I want** native mode invocability defined before the `sk-design` Model-A conversion, **so that** the conversion does not regress direct invocation.

**Acceptance Criteria**:
1. Given a nested parent-skill conversion, When this packet's mechanism is adopted, Then the conversion can keep one top-level advisor identity and route internally through the hub.

---

## 12. OPEN QUESTIONS

- NFR-S01 is unresolved in 001: Option E uses the parent hub's union `allowed-tools`. Phase 002 owns the explicit union-grant decision and any follow-up validation.
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
