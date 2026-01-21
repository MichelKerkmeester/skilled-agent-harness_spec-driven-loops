# Implementation Plan: [YOUR_VALUE_HERE: feature-name]

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-level3plus-verbose | v2.0-verbose -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | [YOUR_VALUE_HERE: Primary language and version] |
| **Framework** | [YOUR_VALUE_HERE: Framework being used] |
| **Storage** | [YOUR_VALUE_HERE: Storage approach] |
| **Testing** | [YOUR_VALUE_HERE: Testing framework] |

### Overview

[YOUR_VALUE_HERE: 2-3 sentences describing what this implements and the high-level technical approach.]

---

## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented in spec.md
- [ ] Success criteria measurable and agreed upon
- [ ] Dependencies identified and status confirmed
- [ ] Architecture decisions documented in decision-record.md
- [ ] Approval workflow checkpoints passed (spec review, design review)

### Definition of Done

- [ ] All acceptance criteria from spec.md met and verified
- [ ] Tests passing (unit, integration as applicable)
- [ ] Documentation updated (all spec folder files)
- [ ] checklist.md all P0 items verified
- [ ] decision-record.md ADRs have status "Accepted"
- [ ] All approval workflow checkpoints complete
- [ ] Compliance checkpoints verified

---

## 3. ARCHITECTURE

### Pattern

[YOUR_VALUE_HERE: Architectural pattern - MVC, MVVM, Clean Architecture, etc.]

### Key Components

- **[YOUR_VALUE_HERE: Component 1]**: [YOUR_VALUE_HERE: Responsibility]
- **[YOUR_VALUE_HERE: Component 2]**: [YOUR_VALUE_HERE: Responsibility]

### Data Flow

[YOUR_VALUE_HERE: Describe how data moves through the system]

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Development environment ready
- [ ] decision-record.md created with initial ADRs

### Phase 2: Core Implementation

- [ ] [YOUR_VALUE_HERE: Core feature 1]
- [ ] [YOUR_VALUE_HERE: Core feature 2]
- [ ] Add error handling

### Phase 3: Verification

- [ ] Manual testing complete
- [ ] Edge cases handled
- [ ] checklist.md verification complete
- [ ] decision-record.md ADRs finalized
- [ ] Documentation updated

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |
| Integration | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |
| Manual | [YOUR_VALUE_HERE] | Browser |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [YOUR_VALUE_HERE] | [Internal/External] | [Green/Yellow/Red] | [YOUR_VALUE_HERE] |

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Core | Setup | Verify |
| Verify | Core | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [YOUR_VALUE_HERE] |
| Core Implementation | [Low/Med/High] | [YOUR_VALUE_HERE] |
| Verification | [Low/Med/High] | [YOUR_VALUE_HERE] |
| **Total** | | **[YOUR_VALUE_HERE]** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure

1. [YOUR_VALUE_HERE: Immediate action]
2. [YOUR_VALUE_HERE: Code revert]
3. [YOUR_VALUE_HERE: Verification]
4. [YOUR_VALUE_HERE: Communication]

### Data Reversal

- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [YOUR_VALUE_HERE or "N/A"]

---

## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |

---

## L3: CRITICAL PATH

1. **[YOUR_VALUE_HERE: Task 1]** - [Duration] - CRITICAL
2. **[YOUR_VALUE_HERE: Task 2]** - [Duration] - CRITICAL
3. **[YOUR_VALUE_HERE: Task 3]** - [Duration] - CRITICAL

**Total Critical Path**: [YOUR_VALUE_HERE]

**Parallel Opportunities**:
- [YOUR_VALUE_HERE: Parallel task 1]
- [YOUR_VALUE_HERE: Parallel task 2]

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |
| M2 | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |
| M3 | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |

---

## L3: ARCHITECTURE DECISION RECORD SUMMARY

### ADR-001: [YOUR_VALUE_HERE: Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [YOUR_VALUE_HERE: Problem]

**Decision**: [YOUR_VALUE_HERE: What we decided]

**Consequences**:
- [YOUR_VALUE_HERE: Positive]
- [YOUR_VALUE_HERE: Negative + mitigation]

---

## L3+: AI EXECUTION FRAMEWORK

[YOUR_VALUE_HERE: Level 3+ features may involve multi-agent or AI-assisted execution. Define the execution strategy.]

### Tier 1: Sequential Foundation

**Files**: [YOUR_VALUE_HERE: Which files must be created sequentially first]
**Duration**: [YOUR_VALUE_HERE: Estimated time, e.g., ~60s]
**Agent**: Primary

[NEEDS CLARIFICATION: What foundation work cannot be parallelized?
  (a) Spec.md sections 1-3 must be sequential
  (b) All setup tasks must complete first
  (c) decision-record.md must be created before implementation
  (d) Other - specify]

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| [YOUR_VALUE_HERE: Agent 1] | [YOUR_VALUE_HERE: Focus area] | [YOUR_VALUE_HERE: Files] |
| [YOUR_VALUE_HERE: Agent 2] | [YOUR_VALUE_HERE: Focus area] | [YOUR_VALUE_HERE: Files] |
| [YOUR_VALUE_HERE: Agent 3] | [YOUR_VALUE_HERE: Focus area] | [YOUR_VALUE_HERE: Files] |

**Duration**: [YOUR_VALUE_HERE: e.g., ~90s (parallel)]

[example:
| Agent | Focus | Files |
|-------|-------|-------|
| Plan Agent | plan.md | Technical approach |
| Checklist Agent | checklist.md | Verification items |
| Requirements Agent | spec.md (4-6) | Requirements detail |]

### Tier 3: Integration

**Agent**: Primary
**Task**: [YOUR_VALUE_HERE: What integration work is needed - merge outputs, resolve conflicts]
**Duration**: [YOUR_VALUE_HERE: e.g., ~60s]

---

## L3+: WORKSTREAM COORDINATION

[YOUR_VALUE_HERE: Level 3+ features often involve multiple workstreams. Define coordination strategy.]

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | [YOUR_VALUE_HERE: Workstream name] | [YOUR_VALUE_HERE: Owner] | [YOUR_VALUE_HERE: Files involved] | [NEEDS CLARIFICATION: (a) Active (b) Blocked (c) Complete] |
| W-B | [YOUR_VALUE_HERE: Workstream name] | [YOUR_VALUE_HERE: Owner] | [YOUR_VALUE_HERE: Files involved] | [Active/Blocked/Complete] |
| W-C | [YOUR_VALUE_HERE: Workstream name] | [YOUR_VALUE_HERE: Owner] | [YOUR_VALUE_HERE: Files involved] | [Active/Blocked/Complete] |

[example:
| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Core Logic | @backend-dev | metricsApi.ts, types.ts | Active |
| W-B | UI Components | @frontend-dev | Dashboard.tsx, Chart.tsx | Active |
| W-C | Tests | @qa-dev | *.test.ts | Blocked on W-A |]

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | [YOUR_VALUE_HERE: What triggers this sync] | [YOUR_VALUE_HERE: Who participates] | [YOUR_VALUE_HERE: Expected output] |
| SYNC-002 | [YOUR_VALUE_HERE: Trigger] | [YOUR_VALUE_HERE: Participants] | [YOUR_VALUE_HERE: Output] |

[example:
| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A, W-B complete | All agents | Integration test |
| SYNC-002 | All workstreams | All agents | Final verification |]

### File Ownership Rules

[YOUR_VALUE_HERE: Define rules for file ownership to prevent conflicts.]

- [YOUR_VALUE_HERE: Rule 1, e.g., "Each file owned by ONE workstream"]
- [YOUR_VALUE_HERE: Rule 2, e.g., "Cross-workstream changes require SYNC"]
- [YOUR_VALUE_HERE: Rule 3, e.g., "Conflicts resolved at sync points"]

[example:
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points
- Types and interfaces are shared - coordinate changes]

---

## L3+: COMMUNICATION PLAN

[YOUR_VALUE_HERE: Level 3+ features require explicit communication planning.]

### Checkpoints

- **Daily**: [YOUR_VALUE_HERE: What daily communication is expected]
  [example: Status update in tasks.md, Slack standup message]
- **Per Phase**: [YOUR_VALUE_HERE: What happens at phase boundaries]
  [example: Review meeting, milestone sign-off]
- **Blockers**: [YOUR_VALUE_HERE: How are blockers escalated]
  [example: Immediate escalation via Slack + spec folder blocker note]

### Escalation Path

1. [YOUR_VALUE_HERE: First level escalation - who and for what issues]
2. [YOUR_VALUE_HERE: Second level escalation]
3. [YOUR_VALUE_HERE: Third level escalation]

[example:
1. Technical blockers → Engineering Lead (@tech-lead)
2. Scope changes → Product Owner (@product-owner)
3. Resource issues → Project Manager (@pm)]

---

## 7. ROLLBACK PLAN

- **Trigger**: [YOUR_VALUE_HERE: Conditions requiring rollback]
- **Procedure**: [YOUR_VALUE_HERE: Rollback steps]

---

## 8. COMPLEXITY JUSTIFICATION

### Complexity Trade-offs

| Decision | Why Not Simpler | Alternative Rejected Because |
|----------|-----------------|------------------------------|
| [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] | [YOUR_VALUE_HERE] |

---

<!--
VERBOSE LEVEL 3+ TEMPLATE - IMPLEMENTATION PLAN (~450 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 3+: Large features with governance (500+ LOC, formal approval, compliance)
- Includes L2 + L3 + L3+ addendum sections: AI Execution Framework, Workstream Coordination, Communication Plan
- Use for major initiatives requiring formal governance and multi-agent coordination
- After completion, can be simplified to core format by removing guidance
-->
