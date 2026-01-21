# Implementation Plan: [YOUR_VALUE_HERE: feature-name]

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-level3-verbose | v2.0-verbose -->

---

## 1. SUMMARY

### Technical Context

[YOUR_VALUE_HERE: Fill in the technical stack details. Be specific - this helps reviewers understand constraints and enables better architectural decisions.]

| Aspect | Value |
|--------|-------|
| **Language/Stack** | [YOUR_VALUE_HERE: Primary language and version, e.g., TypeScript 5.0, Python 3.11, Swift 5.9] |
| **Framework** | [YOUR_VALUE_HERE: Framework being used, e.g., React 18, FastAPI, SwiftUI] |
| **Storage** | [NEEDS CLARIFICATION: What storage approach is needed? (a) PostgreSQL - relational, ACID compliant (b) MongoDB - document store, flexible schema (c) Redis - caching, sessions (d) None - stateless / in-memory (e) Existing database - specify which] |
| **Testing** | [YOUR_VALUE_HERE: Testing framework, e.g., Jest, pytest, XCTest] |

### Overview

[YOUR_VALUE_HERE: 2-3 sentences describing what this implements and the high-level technical approach. Reference the spec.md for full requirements.]

[example: This plan implements the metrics dashboard feature specified in spec.md. The approach uses React components with TanStack Query for data fetching, connecting to existing REST APIs. The dashboard will be progressively enhanced with caching to ensure sub-second load times.]

---

## 2. QUALITY GATES

### Definition of Ready

[YOUR_VALUE_HERE: Checklist of items that must be true before implementation starts. Mark items that are already complete.]

- [ ] Problem statement clear and scope documented in spec.md
- [ ] Success criteria measurable and agreed upon
- [ ] Dependencies identified and status confirmed (see spec.md Section 6)
- [ ] Architecture decisions documented in decision-record.md
- [ ] [NEEDS CLARIFICATION: What additional readiness criteria apply? (a) Design mockups approved (b) API contracts finalized (c) Test environment available (d) None additional]

### Definition of Done

[YOUR_VALUE_HERE: Checklist of items that must be true before claiming completion. All items must pass.]

- [ ] All acceptance criteria from spec.md met and verified
- [ ] Tests passing (unit, integration as applicable)
- [ ] Documentation updated (spec.md, plan.md, tasks.md, decision-record.md)
- [ ] checklist.md all P0 items verified
- [ ] decision-record.md ADRs have status "Accepted"
- [ ] [NEEDS CLARIFICATION: What verification is required? (a) Code review approved (b) QA sign-off (c) Browser testing on target browsers (d) All of the above]

---

## 3. ARCHITECTURE

### Pattern

[NEEDS CLARIFICATION: What architectural pattern best fits this feature?
  (a) MVC - Model-View-Controller, traditional separation
  (b) MVVM - Model-View-ViewModel, good for reactive UIs
  (c) Clean Architecture - layered with dependency inversion
  (d) Serverless - function-based, event-driven
  (e) Monolith - single deployable unit
  (f) Microservice - independent service boundary
  (g) Other - specify]

### Key Components

[YOUR_VALUE_HERE: List the main components/modules and their responsibilities. Each component should have a single clear purpose.]

- **[YOUR_VALUE_HERE: Component 1 name]**: [YOUR_VALUE_HERE: What this component is responsible for]
- **[YOUR_VALUE_HERE: Component 2 name]**: [YOUR_VALUE_HERE: What this component is responsible for]
- **[YOUR_VALUE_HERE: Component 3 name]**: [YOUR_VALUE_HERE: What this component is responsible for]

[example:
- **MetricsDashboard**: Main container component, orchestrates data fetching and child components
- **MetricsChart**: Reusable chart component for visualizing time-series data
- **MetricsExporter**: Handles CSV generation and download functionality
- **useMetricsQuery**: Custom hook wrapping TanStack Query for metrics data fetching
- **metricsApi**: API client module with typed endpoints for metrics service]

### Data Flow

[YOUR_VALUE_HERE: Describe how data moves through the system. Include key data transformations, caching points, and state management.]

[example:
User action -> React component -> useMetricsQuery hook -> metricsApi client -> REST API
Response -> TanStack Query cache -> React component state -> UI render
Export flow: Component state -> MetricsExporter -> CSV Blob -> Browser download]

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

[YOUR_VALUE_HERE: Initial setup tasks. These must complete before implementation can begin.]

- [ ] Project structure created per plan architecture
- [ ] Dependencies installed
- [ ] Development environment ready
- [ ] decision-record.md created with initial ADRs

### Phase 2: Core Implementation

[YOUR_VALUE_HERE: Main implementation work. Break into logical chunks that can be verified independently.]

- [ ] [YOUR_VALUE_HERE: Core feature 1 - be specific about what is implemented]
- [ ] [YOUR_VALUE_HERE: Core feature 2 - include file paths where relevant]
- [ ] [YOUR_VALUE_HERE: Core feature 3]
- [ ] Add error handling

### Phase 3: Verification

[YOUR_VALUE_HERE: Testing and verification tasks. All must pass before claiming done.]

- [ ] Manual testing complete
- [ ] Edge cases handled
- [ ] checklist.md verification complete
- [ ] decision-record.md ADRs finalized
- [ ] Documentation updated

---

## 5. TESTING STRATEGY

[YOUR_VALUE_HERE: Define testing approach for each level of the test pyramid.]

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [YOUR_VALUE_HERE: What components/functions need unit tests] | [YOUR_VALUE_HERE: Testing framework, e.g., Jest, pytest] |
| Integration | [YOUR_VALUE_HERE: What integrations need testing] | [YOUR_VALUE_HERE: Tools for integration tests] |
| Manual | [YOUR_VALUE_HERE: What user journeys to test manually] | Browser |

### Test Priorities

[NEEDS CLARIFICATION: What testing level is required for this feature?
  (a) Minimal - manual testing only, no automated tests
  (b) Standard - unit tests for utilities, manual integration testing
  (c) Comprehensive - unit + integration + E2E tests
  (d) Follow existing project conventions - specify what those are]

---

## 6. DEPENDENCIES

[YOUR_VALUE_HERE: Track dependencies and their status. Update status as implementation progresses.]

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [YOUR_VALUE_HERE: System, API, library, or team this depends on] | [NEEDS CLARIFICATION: (a) Internal - within team/org (b) External - third party] | [YOUR_VALUE_HERE: Green = ready, Yellow = at risk, Red = blocked] | [YOUR_VALUE_HERE: What happens if this dependency is unavailable] |

---

## L2: PHASE DEPENDENCIES

[YOUR_VALUE_HERE: Document how phases depend on each other.]

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [YOUR_VALUE_HERE: e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [YOUR_VALUE_HERE: e.g., 8-16 hours] |
| Verification | [Low/Med/High] | [YOUR_VALUE_HERE: e.g., 2-4 hours] |
| **Total** | | **[YOUR_VALUE_HERE: e.g., 12-24 hours]** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure

1. [YOUR_VALUE_HERE: Immediate action]
2. [YOUR_VALUE_HERE: Code revert if needed]
3. [YOUR_VALUE_HERE: Verification step]
4. [YOUR_VALUE_HERE: Communication]

### Data Reversal

- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [YOUR_VALUE_HERE: Steps or "N/A"]

---

## L3: DEPENDENCY GRAPH

[YOUR_VALUE_HERE: Level 3 features require visual dependency mapping due to complexity.]

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

[YOUR_VALUE_HERE: Customize the diagram above to show your actual dependency structure]

### Dependency Matrix

[YOUR_VALUE_HERE: Detail the dependencies between components/phases.]

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| [YOUR_VALUE_HERE: Component A] | [YOUR_VALUE_HERE: Prerequisites or "None"] | [YOUR_VALUE_HERE: What this produces] | [YOUR_VALUE_HERE: What depends on this] |
| [YOUR_VALUE_HERE: Component B] | [YOUR_VALUE_HERE: Prerequisites] | [YOUR_VALUE_HERE: Output] | [YOUR_VALUE_HERE: Dependents] |
| [YOUR_VALUE_HERE: Component C] | [YOUR_VALUE_HERE: Prerequisites] | [YOUR_VALUE_HERE: Output] | [YOUR_VALUE_HERE: Dependents] |
| [YOUR_VALUE_HERE: Component D] | [YOUR_VALUE_HERE: Prerequisites] | [YOUR_VALUE_HERE: Final output] | [YOUR_VALUE_HERE: "None" if final] |

[example:
| metricsApi | None | API client | useMetricsQuery, MetricsExporter |
| useMetricsQuery | metricsApi | Data hook | MetricsDashboard |
| MetricsChart | None | Chart component | MetricsDashboard |
| MetricsDashboard | useMetricsQuery, MetricsChart | Dashboard page | App routing |
| MetricsExporter | metricsApi | Export component | MetricsDashboard |]

---

## L3: CRITICAL PATH

[YOUR_VALUE_HERE: Identify the sequence of tasks that determines minimum project duration.]

1. **[YOUR_VALUE_HERE: Phase/Task 1]** - [YOUR_VALUE_HERE: Duration estimate] - CRITICAL
2. **[YOUR_VALUE_HERE: Phase/Task 2]** - [YOUR_VALUE_HERE: Duration estimate] - CRITICAL
3. **[YOUR_VALUE_HERE: Phase/Task 3]** - [YOUR_VALUE_HERE: Duration estimate] - CRITICAL

**Total Critical Path**: [YOUR_VALUE_HERE: Sum of critical task durations]

**Parallel Opportunities**:
- [YOUR_VALUE_HERE: Task A] and [YOUR_VALUE_HERE: Task B] can run simultaneously
- [YOUR_VALUE_HERE: Task C] and [YOUR_VALUE_HERE: Task D] can run after Phase 1

[example:
1. **API Client Implementation** - 4 hours - CRITICAL
2. **Dashboard Component** - 8 hours - CRITICAL
3. **Integration Testing** - 4 hours - CRITICAL

**Total Critical Path**: 16 hours

**Parallel Opportunities**:
- MetricsChart and MetricsExporter can run simultaneously after API client
- Unit tests and documentation can run parallel to integration testing]

---

## L3: MILESTONES

[YOUR_VALUE_HERE: Define checkpoints for tracking progress on large features.]

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [YOUR_VALUE_HERE: First major checkpoint] | [YOUR_VALUE_HERE: How to verify] | [YOUR_VALUE_HERE: Date or phase] |
| M2 | [YOUR_VALUE_HERE: Second checkpoint] | [YOUR_VALUE_HERE: How to verify] | [YOUR_VALUE_HERE: Date or phase] |
| M3 | [YOUR_VALUE_HERE: Final checkpoint] | [YOUR_VALUE_HERE: How to verify] | [YOUR_VALUE_HERE: Date or phase] |

[example:
| M1 | Setup Complete | All dependencies installed, project structure created | End of Day 1 |
| M2 | Core Features Working | Dashboard displays data, export works | End of Week 1 |
| M3 | Release Ready | All tests pass, checklist complete | End of Week 2 |]

---

## L3: ARCHITECTURE DECISION RECORD SUMMARY

[YOUR_VALUE_HERE: Reference key ADRs from decision-record.md. Full details in that file.]

### ADR-001: [YOUR_VALUE_HERE: Decision Title]

**Status**: [NEEDS CLARIFICATION: (a) Proposed - under discussion (b) Accepted - decided (c) Deprecated - no longer applies]

**Context**: [YOUR_VALUE_HERE: What problem we're solving, 1-2 sentences]

**Decision**: [YOUR_VALUE_HERE: What we decided, 1-2 sentences]

**Consequences**:
- [YOUR_VALUE_HERE: Positive outcome]
- [YOUR_VALUE_HERE: Negative outcome + mitigation]

**Alternatives Rejected**:
- [YOUR_VALUE_HERE: Option B]: [YOUR_VALUE_HERE: Why rejected]

[example:
### ADR-001: Use TanStack Query for Data Fetching

**Status**: Accepted

**Context**: Need to fetch and cache metrics data with loading states and error handling.

**Decision**: Use TanStack Query instead of raw fetch + useState for data management.

**Consequences**:
- Automatic caching reduces API calls and improves perceived performance
- Additional dependency (23KB gzipped); acceptable for value provided

**Alternatives Rejected**:
- SWR: Similar but less TypeScript support
- useState + useEffect: Too much boilerplate for caching, refetching]

---

## 7. ROLLBACK PLAN

[YOUR_VALUE_HERE: Define how to safely revert if issues are discovered in production.]

- **Trigger**: [YOUR_VALUE_HERE: Conditions that would require rollback]

- **Procedure**: [YOUR_VALUE_HERE: Step-by-step rollback process]

[example:
- **Trigger**: Error rate > 1% OR P0 bug reported OR performance > 3s load time
- **Procedure**:
  1. Toggle FEATURE_METRICS_DASHBOARD flag to false (immediate)
  2. If data corruption suspected: restore from backup snapshot
  3. Investigate and fix root cause
  4. Re-enable flag after fix deployed and verified]

---

## 8. COMPLEXITY JUSTIFICATION

[YOUR_VALUE_HERE: Only fill this section if the implementation introduces complexity beyond the simplest solution. Level 3 features often require this due to scale.]

### Complexity Trade-offs

| Decision | Why Not Simpler | Alternative Rejected Because |
|----------|-----------------|------------------------------|
| [YOUR_VALUE_HERE: Complex choice made] | [YOUR_VALUE_HERE: What problem does this solve] | [YOUR_VALUE_HERE: Why the simpler approach was insufficient] |

[example:
| TanStack Query instead of useState | Automatic caching, background refetch, optimistic updates | useState would require manual cache management and duplicate logic |
| Separate MetricsExporter component | Separation of concerns, testability | Inline export logic would bloat dashboard component |
| Multi-phase implementation | Manageable chunks, clear milestones | Monolithic implementation too risky for feature of this size |]

---

<!--
VERBOSE LEVEL 3 TEMPLATE - IMPLEMENTATION PLAN (~400 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 3: Large features (500+ LOC), complex/architecture changes
- Includes L2 + L3 addendum sections: Dependency Graph, Critical Path, Milestones, ADR Summary
- Use for major features requiring comprehensive planning
- After completion, can be simplified to core format by removing guidance
-->
