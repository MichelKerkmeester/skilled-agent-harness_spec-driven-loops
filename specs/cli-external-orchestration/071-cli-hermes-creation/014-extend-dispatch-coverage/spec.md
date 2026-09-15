---
title: "Feature Specification: Phase 2: extend-dispatch-coverage"
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
# Feature Specification: Phase 2: extend-dispatch-coverage

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
| **Branch** | `scaffold/014-extend-dispatch-coverage` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 16 |
| **Predecessor** | 013-close-silent-preflight-holes |
| **Successor** | 015-wire-executor-builders |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Dispatch preflight parity implementation specification.

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
Phase 1 made the preflight enforce, but two runtimes could not reach it and several predicates could be walked past. Cursor and OpenCode carried only after-the-fact recording, so a wrong dispatch typed in either session was logged once it had already run. Three OpenCode predicates matched one spelling of a flag and missed its equals form or its unquoted prompt, so the rules read as enforced while the other spelling passed. Pi's mandatory offline flag and its provider-qualified model selector were required by the fan-out builder and by the packet's own contract, but nothing checked a hand-written dispatch for either.

### Purpose
Every runtime that can host a dispatch refuses a violating one before it runs, and each predicate catches every spelling of the condition it names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Cursor pre-execution adapter translating the shared engine into Cursor's permission envelope.
- An OpenCode pre-execution hook on the existing dispatch plugin.
- The three predicate bypasses: the agent equals form, the share equals form, the unquoted slash prompt.
- Two new Pi checks covering the offline flag and the provider-qualified model.
- A registration assertion so a runtime cannot lose its adapter silently.

### Out of Scope
- Builder parity and persona wiring - phase 015 owns them.
- The cross-registry CI guard - phase 016.
- The quoted-payload false positive, recorded in phase 1 and still open.
- Devin's retired command surface, removed by operator directive.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | Create | Cursor translation shim over the Claude adapter |
| `.opencode/plugins/cli-dispatch-audit.js` | Modify | Pre-execution hook that denies by throwing |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Widen three predicates, add the two Pi checks |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Declare the two Pi rules |
| `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Register the Cursor binding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A violating dispatch in a Cursor session is refused before it runs |
| REQ-002 | A violating dispatch in an OpenCode session is refused before it runs |
| REQ-003 | Each widened predicate catches both spellings of its condition |
| REQ-004 | A Pi dispatch without the offline flag, or with an unqualified model, is refused |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Losing an adapter file or its registration fails a test rather than passing silently |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both new adapters deny a violating dispatch and approve a correct one when exercised directly.
- **SC-002**: Every widened or added predicate has a passing case, a violating case and a negative control.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the slash-prompt predicate could match a URL or a POSIX path | Medium: a false refusal on an ordinary prompt | Negative controls for both shapes are asserted in the suite |
| Risk | An OpenCode plugin sees only commands run inside an OpenCode session | Low: chained dispatches from another host are out of its reach by construction | Recorded as a scope limit rather than papered over; the other hosts carry their own adapters |
| Dependency | The shared check engine | A second copy would drift from the first | Both adapters call the same engine rather than reimplementing severity or rule parsing |
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


