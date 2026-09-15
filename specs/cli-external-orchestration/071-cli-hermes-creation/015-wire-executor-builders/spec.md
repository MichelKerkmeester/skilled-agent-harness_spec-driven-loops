---
title: "Feature Specification: Phase 3: wire-executor-builders"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: wire-executor-builders

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-15 |
| **Branch** | `scaffold/015-wire-executor-builders` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-extend-dispatch-coverage |
| **Successor** | 016-dispatch-enforcement-ci-guard |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Dispatch preflight parity implementation specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fan-out builder is the only caller that cannot get a flag wrong, so anything it fails to set is unreachable rather than merely risky. Two of the seven builder paths spawned without checking their binary resolves, turning an absent executor into a mid-lineage spawn failure instead of a refusal before the run. And Hermes personas were built but unreachable: the plugin's persona section and the mirrored agent skills both existed with nothing able to name one, because no lineage field reached either.

### Purpose
Every builder refuses before it spawns when its binary is missing, and a fan-out lineage can run as a named persona.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Binary availability probes for the Claude and OpenCode builder paths.
- A persona field on a Hermes lineage that sets the plugin's persona variable and preloads the mirrored agent skill.
- Validation refusing a persona name the repo plugin would itself reject.

### Out of Scope
- The three model-default divergences between builder and packet, which change cost and behaviour for every unpinned lineage and are an operator decision.
- The codex service-tier default, same class.
- The cross-registry CI guard - phase 016.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Two availability probes, persona flag and persona environment |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Admit the persona field on a Hermes lineage |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Persona regression covering set, unset and invalid |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Claude or OpenCode lineage refuses before spawning when its binary does not resolve |
| REQ-002 | A Hermes lineage naming a persona preloads the mirrored agent skill and carries the persona variable |
| REQ-003 | A persona name the repo plugin would reject is refused at build time |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A lineage that names no persona is byte-identical to before |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The persona regression asserts the set, unset and invalid cases and passes.
- **SC-002**: The runner suites stay green, with one test added and none removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The preload exemption fix | A persona dispatch would otherwise be sanctioned in the shape that bleeds prior context | Sequenced after that fix, so the preload and the flag now travel together |
| Risk | Model defaults diverge from their packets in three builders | Medium: an unpinned lineage runs a different model than the docs promise | Left unchanged and raised as an operator decision, since it changes cost and behaviour |
| Risk | A persona name could escape the agents directory | Low | Validated against the same grammar the repo plugin enforces, before the flag is built |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


