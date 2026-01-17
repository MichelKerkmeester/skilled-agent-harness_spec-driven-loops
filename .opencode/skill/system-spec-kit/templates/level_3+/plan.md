# Implementation Plan: [YOUR_VALUE_HERE: feature-name] - Technical Approach & Architecture

Implementation plan defining technical approach, project structure, and execution strategy.

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Level**: 3+
- **Tags**: [YOUR_VALUE_HERE: feature-name], [YOUR_VALUE_HERE: area]
- **Priority**: [NEEDS CLARIFICATION: What is the implementation priority? (a) P0-critical - HARD BLOCKER, must complete (b) P1-high - must complete OR user-approved deferral (c) P2-medium - can defer without approval]
- **Branch**: `[FORMAT: ###-feature-name]`
- **Date**: [FORMAT: YYYY-MM-DD]
- **Spec**: [OPTIONAL: link to spec.md if exists]

### Input
Feature specification from `/specs/[###-feature-name]/spec.md`

### Summary
[YOUR_VALUE_HERE: Extract primary requirement and technical approach from spec - 2-3 sentences]

### Technical Context

- **Language/Version**: [example: Python 3.11, Swift 5.9, Rust 1.75]
- **Primary Dependencies**: [example: FastAPI, UIKit, LLVM]
- **Storage**: [example: PostgreSQL, CoreData, files] [OPTIONAL: N/A if none]
- **Testing**: [example: pytest, XCTest, cargo test]
- **Target Platform**: [example: Linux server, iOS 15+, WASM]
- **Project Type**: [NEEDS CLARIFICATION: What project structure applies? (a) single-project - monolithic src/ (b) web-app - frontend/ + backend/ (c) mobile-app - api/ + ios/ or android/ (d) monorepo - packages/*]
- **Performance Goals**: [example: 1000 req/s, 10k lines/sec, 60 fps] [OPTIONAL: N/A if not performance-critical]
- **Constraints**: [example: <200ms p95, <100MB memory, offline-capable] [OPTIONAL: N/A if none]
- **Scale/Scope**: [example: 10k users, 1M LOC, 50 screens]

---

## 2. QUALITY GATES

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Definition of Ready (DoR)
- [ ] Problem statement clear; scope documented
- [ ] Stakeholders identified; decisions path agreed
- [ ] Constraints known; risks captured
- [ ] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/tasks/README)
- [ ] Performance/error budgets respected
- [ ] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: [YOUR_VALUE_HERE: conditions that trigger stop/rollback - example: error rate >5%, critical bug in production]
- **Recovery Procedure**: [YOUR_VALUE_HERE: reference to recovery steps or document]

### Constitution Check (Complexity Tracking)

**Fill ONLY if Constitution Check has violations that must be justified**:

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [example: 4th project] | [current need] | [why 3 projects insufficient] |
| [example: Repository pattern] | [specific problem] | [why direct DB access insufficient] |

---

## 3. PROJECT STRUCTURE

### Architecture Overview

[YOUR_VALUE_HERE: High-level architecture description - example: Event-driven microservices with API gateway, or Monolithic MVC with service layer]

**Key Architectural Decisions:**
- **Pattern**: [YOUR_VALUE_HERE: MVC | MVVM | Clean Architecture | Microservices | Monolith | Serverless]
- **Data Flow**: [YOUR_VALUE_HERE: Request-response | Event-driven | Streaming | Batch]
- **State Management**: [YOUR_VALUE_HERE: Stateless | Session-based | Distributed cache | Database-backed]

[OPTIONAL: Include ASCII diagram or link to architecture diagram]

### Documentation (This Feature)

```
specs/[###-feature]/
  spec.md              # Feature specification (see spec-template.md)
  plan.md              # This file (/spec_kit:plan command output)
  research.md          # Phase 0 output (/spec_kit:plan command)
  tasks.md             # Phase 2 output (/spec_kit:tasks command)
  checklist.md         # QA validation checklist (Level 3)
  decision-record.md   # Architecture decision records (Level 3)
  scratch/             # Drafts, prototypes, debug logs (git-ignored, delete when done)
  memory/              # Session context preservation (auto-created, git-tracked)
```

> **Tip:** Use `scratch/` for throwaway work (test queries, debug output, draft code).
> Move valuable findings to spec.md, plan.md, or memory/ before completing the task.

### Source Code (Repository Root)

[YOUR_VALUE_HERE: Select ONE option below and expand with real paths. Delete unused options.]

```
# Option 1: Single project (DEFAULT)
src/
  models/
  services/
  cli/
  lib/

tests/
  contract/
  integration/
  unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
  src/
    models/
    services/
    api/
  tests/

frontend/
  src/
    components/
    pages/
    services/
  tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
  [same as backend above]

ios/ or android/
  [platform-specific structure: feature modules, UI flows, platform tests]
```

### Structure Decision

[YOUR_VALUE_HERE: Document the selected structure and reference the real directories captured above - example: "Selected Option 1 (single project) because feature is backend-only CLI tool"]

---

## 4. IMPLEMENTATION PHASES

### Phase 0: Research & Discovery

- **Goal**: [YOUR_VALUE_HERE: research objectives - example: evaluate GraphQL vs REST for API design]
- **Deliverables**:
  - Research findings documented in research.md
  - Technical feasibility assessment
  - Architecture decision records
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 1: Design & Setup

- **Goal**: [YOUR_VALUE_HERE: design objectives - example: define component structure and interfaces]
- **Deliverables**:
  - Component structure defined
  - Interface contracts documented
  - Development environment setup
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 1 week]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 2: Core Implementation

- **Goal**: [YOUR_VALUE_HERE: core functionality - example: implement user authentication and authorization]
- **Deliverables**:
  - [YOUR_VALUE_HERE: key feature 1 - example: User registration endpoint]
  - [YOUR_VALUE_HERE: key feature 2 - example: JWT token generation]
  - Unit tests coverage ≥ [YOUR_VALUE_HERE: percentage - example: 80%]
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 2 weeks]
- **Parallel Tasks**: [OPTIONAL: list tasks marked with [P] if parallel work possible]

### Phase 3: Integration & Testing

- **Goal**: [YOUR_VALUE_HERE: integration objectives - example: integrate with external payment API and verify end-to-end flows]
- **Deliverables**:
  - Integration tests passing
  - E2E tests passing
  - Performance benchmarks met
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 1 week]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 4: Polish & Optimization

- **Goal**: [YOUR_VALUE_HERE: optimization objectives - example: performance tuning and UX refinement]
- **Deliverables**:
  - Performance targets met
  - Error handling comprehensive
  - Edge cases covered
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 5: Security & Compliance

- **Goal**: [YOUR_VALUE_HERE: security hardening - example: complete security review and address findings]
- **Deliverables**:
  - Security scan completed
  - Vulnerabilities addressed
  - Compliance requirements met
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 1 week]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 6: Documentation & Training

- **Goal**: [YOUR_VALUE_HERE: documentation objectives - example: complete user documentation and training materials]
- **Deliverables**:
  - User documentation complete
  - API documentation finalized
  - Training materials prepared
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 7: Staging Deployment

- **Goal**: [YOUR_VALUE_HERE: staging deployment - example: deploy to staging environment and validate]
- **Deliverables**:
  - Staging deployment completed
  - Smoke tests passing
  - Stakeholder validation complete
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 2 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

### Phase 8: Production Deployment

- **Goal**: [YOUR_VALUE_HERE: production deployment strategy - example: staged rollout to production with feature flags]
- **Deliverables**:
  - Production deployment completed
  - Monitoring/alerting configured
  - Rollback plan validated
- **Owner**: [YOUR_VALUE_HERE: team or individual]
- **Duration**: [YOUR_VALUE_HERE: time estimate - example: 3 days]
- **Parallel Tasks**: [OPTIONAL: None if sequential | list tasks marked with [P] if parallel work possible]

[OPTIONAL: Add Phases 9-12 if needed for enterprise-scale features with multiple workstreams]

**Parallelization Note**: Use [P] tag to denote tasks that can run in parallel

---

## 4.1 PHASE DEPENDENCIES

### Phase Dependency DAG

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FULL DEPENDENCY GRAPH                           │
│                        (Directed Acyclic Graph)                         │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   START      │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
            │ PH-0: Research│ │ PH-1: Design │ │ Setup [P]    │
            │               │ │              │ │              │
            │ Owner: [TBD]  │ │ Owner: [TBD] │ │ Owner: [TBD] │
            └──────┬────────┘ └──────┬───────┘ └──────┬───────┘
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
            │ PH-2: Core    │ │ Workstream A │ │ Workstream B │
            │ Implementation│ │    [P]       │ │    [P]       │
            └──────┬────────┘ └──────┬───────┘ └──────┬───────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                              ┌──────┴─────┐
                              ▼            │
                    ┌──────────────┐       │
                    │ Integration  │◄──────┘
                    │ Gate         │
                    └──────┬───────┘
                           │
              ┌────────────┼───────────────┐
              ▼            ▼               ▼
      ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
      │ PH-3: Testing │ │ PH-4: Polish │ │ PH-5: Security│
      │               │ │    [P]       │ │    [P]       │
      └──────┬────────┘ └──────┬───────┘ └──────┬───────┘
             │                │                 │
             └────────────────┼─────────────────┘
                              │
                        ┌─────┴─────┐
                        ▼           │
              ┌──────────────┐      │
              │ Quality Gate │◄─────┘
              └──────┬───────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ PH-6:    │ │ PH-7:    │ │ Monitoring│
   │ Docs [P] │ │ Staging  │ │ Setup [P]│
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     │
              ┌──────┴─────┐
              ▼            │
    ┌──────────────┐       │
    │ Release Gate │◄──────┘
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ PH-8: Deploy │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    END       │
    └──────────────┘

Legend:
  ───▶  Sequential (must complete before next)
  [P]   Can run in parallel
  ◄───  Sync point (all inputs must complete)
  Gate  Go/No-Go decision point
```

### Critical Path Analysis

| Path       | Phases             | Total Duration | Status     |
| ---------- | ------------------ | -------------- | ---------- |
| Main       | 0→1→2→3→7→8        | [TBD]          | CRITICAL   |
| Parallel A | 0→Setup→2          | [TBD]          | Supporting |
| Parallel B | 1→WS-A→Integration | [TBD]          | Supporting |
| Parallel C | 4→5→Quality Gate   | [TBD]          | Supporting |

### Milestones

| Milestone             | Phase            | Criteria               | Target Date |
| --------------------- | ---------------- | ---------------------- | ----------- |
| M1: Research Complete | End of PH-0      | Findings documented    | [TBD]       |
| M2: Design Approved   | End of PH-1      | Stakeholder sign-off   | [TBD]       |
| M3: Core Complete     | Integration Gate | All workstreams merged | [TBD]       |
| M4: Quality Verified  | Quality Gate     | All quality gates pass | [TBD]       |
| M5: Staging Ready     | End of PH-7      | Staging tests pass     | [TBD]       |
| M6: Production Ready  | Release Gate     | Release approval       | [TBD]       |
| M7: Deployed          | End of PH-8      | Production verified    | [TBD]       |

---

## 4.2 EFFORT ESTIMATION

### Estimation Methodology

**Approach**: [FORMAT: Story Points | T-Shirt Sizing | Hours | Ideal Days]

**Confidence Level**: [FORMAT: High (80%+) | Medium (50-80%) | Low (<50%)]

### Phase Effort Breakdown

| Phase | Est. Effort | Confidence | Notes |
|-------|-------------|------------|-------|
| Phase 0: Research | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 1: Design | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 2: Implementation | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 3: Testing | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 4: Polish | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 5: Security | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 6: Documentation | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 7: Staging | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| Phase 8: Deployment | [YOUR_VALUE_HERE] | [H/M/L] | [Risk factors] |
| **Total** | **[YOUR_VALUE_HERE]** | **[Overall]** | |

### Story Point Reference

| Points | Complexity | Example |
|--------|------------|---------|
| 1 | Trivial | Config change, typo fix |
| 2 | Simple | Single function, one file |
| 3 | Small | Few functions, 2-3 files |
| 5 | Medium | Feature component, several files |
| 8 | Large | Feature module, cross-cutting |
| 13 | Very Large | Major feature, architectural |
| 21+ | Epic | Should be broken down |

### Resource Requirements

| Resource | Allocation | Phase(s) | Notes |
|----------|------------|----------|-------|
| [YOUR_VALUE_HERE: Role/Skill] | [%/Hours] | [Phase(s)] | [Availability notes] |
| [YOUR_VALUE_HERE: Role/Skill] | [%/Hours] | [Phase(s)] | [Availability notes] |

### Estimation Assumptions

- [YOUR_VALUE_HERE: Key assumption 1 - e.g., "No major scope changes"]
- [YOUR_VALUE_HERE: Key assumption 2 - e.g., "Dependencies available on time"]
- [YOUR_VALUE_HERE: Key assumption 3 - e.g., "Standard review turnaround"]

### Risk Adjustments

| Risk | Probability | Impact | Adjustment |
|------|-------------|--------|------------|
| [YOUR_VALUE_HERE: Risk] | [H/M/L] | [H/M/L] | +[X]% buffer |
| [YOUR_VALUE_HERE: Risk] | [H/M/L] | [H/M/L] | +[X]% buffer |

**Total Risk Buffer**: [YOUR_VALUE_HERE]%

---

## 4.3 AI EXECUTION FRAMEWORK

**This section defines execution rules for AI agents working on this spec.**

### Pre-Task Checklist

Before starting ANY task, verify:

1. [ ] Task dependencies are complete (check tasks.md)
2. [ ] Required files exist and are accessible
3. [ ] No blocking issues in related tasks
4. [ ] Spec folder context loaded (spec.md, plan.md reviewed)
5. [ ] Understanding verified - can explain task goal in own words
6. [ ] Approach identified - know HOW to accomplish task
7. [ ] Success criteria clear - know what "done" looks like
8. [ ] Potential blockers identified
9. [ ] Estimated scope reasonable for single task

### Task Execution Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **TASK-SEQ** | Execute tasks in dependency order | HARD - Cannot skip dependencies |
| **TASK-SCOPE** | One logical change per task | SOFT - Can batch small related changes |
| **TASK-VERIFY** | Verify before marking complete | HARD - Must have evidence |
| **TASK-BLOCK** | Report blockers immediately | HARD - Do not proceed if blocked |
| **TASK-COMM** | Update status in real-time | SOFT - At minimum per-task |

### Status Reporting Format

When reporting task completion:

```markdown
## Task T### Status: [COMPLETE|IN_PROGRESS|BLOCKED]

**Evidence of Completion:**
- [x] [Specific verification 1]
- [x] [Specific verification 2]

**Files Modified:**
- path/to/file.js (lines X-Y)

**Next Steps:**
- T### is now unblocked
- Proceeding to T###
```

### Blocked Task Protocol

If a task is blocked:

1. **STOP** - Do not attempt workarounds without approval
2. **DOCUMENT** - Record the blocker clearly
3. **REPORT** - Include in status update
4. **ESCALATE** - If blocking critical path, notify immediately

```markdown
## Task T### Status: BLOCKED

**Blocker:** [Clear description of what's blocking]
**Impact:** [Which downstream tasks are affected]
**Options:**
- A) [Option with tradeoffs]
- B) [Option with tradeoffs]
**Recommendation:** [Which option and why]
```

### Workstream Coordination

When working in parallel workstreams:

- **ISOLATE** - Each workstream owns specific files
- **NO CONFLICTS** - Never modify files owned by another workstream
- **SYNC POINTS** - Coordinate at defined integration points
- **COMMUNICATE** - Report cross-workstream dependencies

---

## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Few, high-value end-to-end tests
      /------\
     /  INTEG \   <- More integration tests
    /----------\
   /   UNIT     \  <- Many unit tests (foundation)
  /--------------\
```

### Unit Tests

- **Scope**: [YOUR_VALUE_HERE: components/functions requiring unit tests - example: all service layer functions, validation logic]
- **Tools**: [example: pytest, jest, XCTest]
- **Coverage Target**: [example: ≥80% line coverage]
- **Execution**: [example: Local + CI on every commit]

### Integration Tests

- **Scope**: [YOUR_VALUE_HERE: integrations requiring testing - example: database operations, external API calls, message queue interactions]
- **Tools**: [example: pytest + docker-compose, Postman, integration test framework]
- **Coverage Target**: [example: All API endpoints, all database operations]
- **Execution**: [example: CI on PR, nightly]

### End-to-End Tests

- **Scope**: [YOUR_VALUE_HERE: critical user journeys - example: complete checkout flow, user onboarding, data export process]
- **Tools**: [example: Playwright, Cypress, Selenium]
- **Coverage Target**: [example: Top 5 user flows, happy paths]
- **Execution**: [example: CI on PR to main, pre-release]

### Test Data & Environments

- **Test Data**: [YOUR_VALUE_HERE: strategy - example: factory pattern for dynamic data, fixtures for static data, snapshots for UI]
- **Environments**: [example: Development | Staging | Production-like]
- **Database**: [YOUR_VALUE_HERE: strategy - example: containerized PostgreSQL per test run, in-memory SQLite, shared test database]

### CI Quality Gates

- [ ] All tests must pass
- [ ] Code coverage ≥ [YOUR_VALUE_HERE: X%]
- [ ] No critical security vulnerabilities
- [ ] Linting/formatting checks pass
- [ ] Performance benchmarks met
- [ ] No breaking changes (or documented + approved)

---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [YOUR_VALUE_HERE: metric name - example: Feature completion] | 100% | [Acceptance criteria checklist] |
| [YOUR_VALUE_HERE: metric name - example: Bug count] | P0/P1 = 0 | [Issue tracker] |

### Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [YOUR_VALUE_HERE: metric name - example: API response time] | < [X] ms p95 | [APM tool] |
| [YOUR_VALUE_HERE: metric name - example: Throughput] | > [Y] req/sec | [Load testing] |
| [YOUR_VALUE_HERE: metric name - example: Memory usage] | < [Z] MB | [Monitoring] |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Test coverage | ≥ [X]% | [Coverage tool] |
| Code review turnaround | < [Y] hours | [PR metrics] |
| Documentation completeness | 100% | [Checklist] |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | [YOUR_VALUE_HERE: risk description - example: Third-party API rate limits] | High/Med/Low | High/Med/Low | [Mitigation plan] | [Name] |
| R-002 | [YOUR_VALUE_HERE: risk description] | High/Med/Low | High/Med/Low | [Mitigation plan] | [Name] |
| R-003 | [YOUR_VALUE_HERE: risk description] | High/Med/Low | High/Med/Low | [Mitigation plan] | [Name] |

### Rollback Plan

- **Rollback Trigger**: [YOUR_VALUE_HERE: conditions - example: error rate > 5%, critical bug detected, performance degradation >50%]
- **Rollback Procedure**:
  1. [YOUR_VALUE_HERE: step 1]
  2. [YOUR_VALUE_HERE: step 2]
  3. [YOUR_VALUE_HERE: step 3]
- **Data Migration Reversal**: [OPTIONAL: N/A if no data changes | describe how to reverse data migrations]
- **Verification**: [YOUR_VALUE_HERE: how to verify successful rollback]

---

## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| [System/API] | Internal | [Team] | [Green/Yellow/Red] | [Date] | [Impact description] |
| [Library/Tool] | Internal | [Team] | [Green/Yellow/Red] | [Date] | [Impact description] |

### External Dependencies

| Dependency | Type | Vendor | Status | Timeline | Impact if Blocked |
|------------|------|--------|--------|----------|-------------------|
| [Service/API] | External | [Company] | [Green/Yellow/Red] | [Date] | [Impact description] |
| [Library/Tool] | External | [Source] | [Green/Yellow/Red] | [Date] | [Impact description] |

---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Product**: [Names]
- **Engineering**: [Names]
- **Design**: [Names]
- **QA**: [Names]
- **Operations**: [Names]

### Checkpoints

- **Standups**: [Cadence - example: Daily at 10am]
- **Sprint Planning**: [Cadence - example: Bi-weekly Monday]
- **Demo**: [Date/Cadence - example: Every sprint end]
- **Review Gates**: [Phase 0 review, Phase 1 review, Pre-launch review]

### Approvals

- **Technical Design**: [Name/Role]
- **Security Review**: [Name/Role]
- **Product Sign-off**: [Name/Role]
- **Launch Approval**: [Name/Role]

---

## 10. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Checklist**: See `checklist.md` for validation
- **Decision Records**: See `decision-record.md` for architectural decisions

### Additional References

- [Link additional docs]
- [Architecture diagrams]
- [API documentation]
- [Design mockups]

---

## WHEN TO USE THIS TEMPLATE

**Use plan.md when:**
- Creating Level 3+ spec folders (enterprise-scale features)
- Need to define technical approach and architecture before implementation
- Multiple phases of work requiring coordination
- Multi-workstream or multi-agent coordination needed
- Team needs shared understanding of implementation strategy
- Testing strategy and success metrics must be documented upfront
- AI execution protocol needed for agent coordination
- Complex dependency management required

**Level 3+ requirements:**
- plan.md is REQUIRED for Level 3+
- Extended plan with all advanced sections
- 8-12 implementation phases
- WITH AI Execution Framework (REQUIRED)
- WITH DAG dependency graph (full visualization)
- WITH Effort Estimation
- WITH Milestones and critical path analysis
- WITH Workstream coordination

**Related templates:**
- Start with `spec.md` for requirements and user stories
- Generate `tasks.md` after plan.md is complete
- Use `research.md` for deep technical investigation before planning
- Create `decision-record.md` for significant architectural decisions made during planning

---

<!--
  PLAN TEMPLATE - LEVEL 3+ (EXTENDED - ENTERPRISE)
  - Technical approach and architecture
  - 8-12 implementation phases
  - WITH AI Execution Framework (REQUIRED)
  - WITH DAG dependency graph (full)
  - WITH Effort Estimation
  - WITH Milestones and critical path
  - WITH Workstream coordination
-->
