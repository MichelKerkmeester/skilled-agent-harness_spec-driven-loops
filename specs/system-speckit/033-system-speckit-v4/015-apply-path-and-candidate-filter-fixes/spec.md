---
title: "Feature Specification: Review Remediation"
description: "Three P1 findings survived four deep-review iterations across three models: an apply path that treated an omitted enable decision as permission, a candidate filter that judged from a stale snapshot, and a permission-mode precondition contradicting its own audit."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Close the three P1 findings that survived four deep-review iterations: a fail-open kill switch, a plan-time parent gate that skips newly orphaned daemons, and a contradictory permission-mode precondition

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `scaffold/047-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A four-iteration deep review of the daemon-hardening packet, run across three independent models, closed at CONDITIONAL with three P1 findings that survived every pass.

The sweep's apply path read `opts.enabled === false` to mean "disabled". An omitted decision therefore meant execute. The in-tree caller always passed the flag, so nothing misbehaved in practice — but a process-killer whose default is to kill has its safety argument backwards, and the acceptance test passed precisely because it always supplied the flag.

The same path judged reapability from the inventory snapshot. A daemon whose parent died between the scan and the decision kept its plan-time classification and was filtered out before any fresh evidence was consulted, so the process the sweep exists to collect was the one it skipped.

Separately, the cli-devin playbook's global precondition instructed readers not to treat `smart` as a valid permission value, while the audit banner directly above it recorded `smart` as accepted on the installed binary.

### Purpose

Make the sweep's default safe and its judgement fresh, and stop a playbook from contradicting its own recorded evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fail closed when no enable decision is supplied, and distinguish that from an explicit disable
- Re-derive reapability from fresh parent evidence at decision time rather than from the snapshot
- Version-scope the permission-mode precondition so it agrees with its own audit
- A negative control per code finding, failing before the fix

### Out of Scope
- The P2 set from the review; each needs its own judgement and none blocks closure
- Re-running the review loop; these fixes postdate its terminal pass

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | Modify | Fail-closed default; fresh-evidence candidate selection |
| `.opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts` | Modify | Two negative controls; explicit decisions; tightened safety assertion |
| `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md` | Modify | Version-scoped precondition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | An omitted enable decision refuses to terminate, and is reported distinctly from an explicit disable |
| REQ-002 | A daemon orphaned after the snapshot is collected on the same pass |
| REQ-003 | The live-parent safety property still holds, and its refusal is recorded rather than silent |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The permission-mode precondition agrees with its own audit and names the version it was verified against |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
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



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
