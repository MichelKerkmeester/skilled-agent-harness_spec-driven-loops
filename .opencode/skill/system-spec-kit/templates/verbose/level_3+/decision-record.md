# Decision Record: [YOUR_VALUE_HERE: Feature-Name]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-level3plus-verbose | v2.0-verbose -->

---

## Overview

This document captures Architecture Decision Records (ADRs) for the [YOUR_VALUE_HERE: feature-name] feature.

**ADR Status Definitions:**
| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision made and will be/has been implemented |
| **Rejected** | Considered but not chosen |
| **Deprecated** | Was accepted but no longer applies |
| **Superseded** | Replaced by another ADR |

---

## ADR-001: [YOUR_VALUE_HERE: Decision Title]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | [Proposed/Accepted/Deprecated/Superseded] |
| **Date** | [YYYY-MM-DD] |
| **Deciders** | [Names] |

---

### Context

[YOUR_VALUE_HERE: What problem requires this decision? 2-3 sentences.]

### Constraints

- [YOUR_VALUE_HERE: Technical constraint]
- [YOUR_VALUE_HERE: Business constraint]
- [YOUR_VALUE_HERE: Time/resource constraint]

---

### Decision

**Summary**: [YOUR_VALUE_HERE: One-sentence description]

**Details**: [YOUR_VALUE_HERE: Implementation details, 2-3 sentences]

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen]** | [Advantages] | [Disadvantages] | [X/10] |
| [Alternative A] | [Advantages] | [Disadvantages] | [Y/10] |
| [Alternative B] | [Advantages] | [Disadvantages] | [Z/10] |

**Why Chosen**: [YOUR_VALUE_HERE: Rationale]

---

### Consequences

**Positive**:
- [YOUR_VALUE_HERE: Benefit 1]
- [YOUR_VALUE_HERE: Benefit 2]

**Negative**:
- [YOUR_VALUE_HERE: Drawback 1] - Mitigation: [YOUR_VALUE_HERE]

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [H/M/L] | [Strategy] |

---

### Implementation

**Affected Systems**:
- [YOUR_VALUE_HERE: System 1]
- [YOUR_VALUE_HERE: System 2]

**Rollback**: [YOUR_VALUE_HERE: How to revert]

---

## ADR-002: [YOUR_VALUE_HERE: Second Decision Title]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | [Status] |
| **Date** | [Date] |
| **Deciders** | [Names] |

---

### Context

[YOUR_VALUE_HERE: Problem context]

### Constraints

- [YOUR_VALUE_HERE: Constraint 1]

---

### Decision

**Summary**: [YOUR_VALUE_HERE]

**Details**: [YOUR_VALUE_HERE]

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen]** | [Advantages] | [Disadvantages] | [X/10] |
| [Alternative] | [Advantages] | [Disadvantages] | [Y/10] |

**Why Chosen**: [YOUR_VALUE_HERE]

---

### Consequences

**Positive**:
- [YOUR_VALUE_HERE]

**Negative**:
- [YOUR_VALUE_HERE] - Mitigation: [YOUR_VALUE_HERE]

---

### Implementation

**Affected Systems**:
- [YOUR_VALUE_HERE]

**Rollback**: [YOUR_VALUE_HERE]

---

## ADR-003: [YOUR_VALUE_HERE: Third Decision]

[Copy structure from ADR-002]

---

## Decision Summary

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| ADR-001 | [Title] | [Status] | [One-line summary] |
| ADR-002 | [Title] | [Status] | [One-line summary] |
| ADR-003 | [Title] | [Status] | [One-line summary] |

---

## L3+: Governance Notes

[YOUR_VALUE_HERE: Level 3+ features may have additional governance requirements for decisions.]

### Decision Authority

[YOUR_VALUE_HERE: Who has authority to make which types of decisions?]

| Decision Type | Authority | Escalation |
|---------------|-----------|------------|
| Technical (ADRs) | [YOUR_VALUE_HERE: e.g., Tech Lead] | [YOUR_VALUE_HERE: e.g., Engineering Director] |
| Scope Changes | [YOUR_VALUE_HERE: e.g., Product Owner] | [YOUR_VALUE_HERE: e.g., VP Product] |
| Resource Allocation | [YOUR_VALUE_HERE: e.g., Project Manager] | [YOUR_VALUE_HERE: e.g., Department Head] |

[example:
| Decision Type | Authority | Escalation |
|---------------|-----------|------------|
| Technical (ADRs) | Tech Lead | Engineering Director |
| Scope Changes | Product Owner | VP Product |
| Resource Allocation | Project Manager | Department Head |]

### Review Requirements

[YOUR_VALUE_HERE: What review process applies to decisions?]

- ADRs affecting architecture: [YOUR_VALUE_HERE: e.g., "Requires tech lead review"]
- ADRs affecting security: [YOUR_VALUE_HERE: e.g., "Requires security team review"]
- ADRs affecting data: [YOUR_VALUE_HERE: e.g., "Requires DBA review"]

[example:
- ADRs affecting architecture: Requires tech lead review + 1 senior engineer
- ADRs affecting security: Requires security team sign-off
- ADRs affecting data: Requires DBA review for schema changes
- ADRs with cost implications: Requires finance approval >$10k]

### Decision History

[YOUR_VALUE_HERE: Track when decisions were made and by whom for audit purposes.]

| ADR | Initial | Reviewed | Approved | Notes |
|-----|---------|----------|----------|-------|
| ADR-001 | [Date by Name] | [Date by Name] | [Date by Name] | [Any notes] |
| ADR-002 | [Date by Name] | [Date by Name] | [Date by Name] | [Any notes] |

[example:
| ADR | Initial | Reviewed | Approved | Notes |
|-----|---------|----------|----------|-------|
| ADR-001 | 2024-01-05 by @dev | 2024-01-06 by @tech-lead | 2024-01-07 | Fast-tracked for timeline |
| ADR-002 | 2024-01-08 by @dev | 2024-01-09 by @tech-lead | 2024-01-10 | Security review added |]

---

## Related Documents

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Implementation Summary**: `implementation-summary.md`

---

<!--
VERBOSE LEVEL 3+ TEMPLATE - DECISION RECORD (~300 lines)
- Level 3+: Large features with governance
- Includes L3+ governance notes: Decision Authority, Review Requirements, Decision History
- For features requiring formal decision governance and audit trails
-->
