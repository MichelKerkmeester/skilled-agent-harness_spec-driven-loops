# Tasks: [YOUR_VALUE_HERE: feature-name]

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-level3-verbose | v2.0-verbose -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending - not yet started |
| `[x]` | Completed - verified done |
| `[P]` | Parallelizable - can run alongside other [P] tasks |
| `[B]` | Blocked - waiting on dependency (add note explaining blocker) |

**Task Format**: `T### [P?] Description (file path if applicable)`

---

## Task Completion Criteria

[YOUR_VALUE_HERE: Define what "done" means for tasks in this feature. All criteria must be met before marking a task [x].]

**Mark a task `[x]` when:**
- [ ] Code implementation finished and working
- [ ] Code passes lint/format checks
- [ ] Tests written (if required for task type)
- [ ] Code review approved (if required)

---

## Working Files Location

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code, experiments | Temporary (git-ignored, delete when done) |
| `memory/` | Context to preserve for future sessions | Permanent (git-tracked) |
| Spec folder root | Final documentation (spec.md, plan.md, tasks.md, checklist.md, decision-record.md) | Permanent (git-tracked) |
| Source directories | Implementation code | Permanent (git-tracked) |

**MUST**: Place ALL temporary/debug files in `scratch/`
**NEVER**: Create temp files in spec folder root or project root

---

## Phase 1: Setup

**Purpose**: Project initialization, environment setup, and initial architecture decisions

- [ ] T001 Create project structure
  - [YOUR_VALUE_HERE: Specific directories to create]

- [ ] T002 Install dependencies
  - [NEEDS CLARIFICATION: What new dependencies are needed?
      (a) None - all dependencies already in project
      (b) Specify packages: [YOUR_VALUE_HERE: package names and versions]
      (c) TBD - will determine during implementation]

- [ ] T003 [P] Configure development tools
  - [YOUR_VALUE_HERE: What tooling setup is needed]

- [ ] T004 Create decision-record.md with initial ADRs
  - [YOUR_VALUE_HERE: Document key architectural decisions from planning phase]

**Checkpoint**: Setup complete when all T00x tasks are marked `[x]` and decision-record.md exists

---

## Phase 2: Implementation

**Purpose**: Build the core feature functionality

### Core Components

- [ ] T005 [YOUR_VALUE_HERE: First foundational component - typically data layer]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Depends on: [YOUR_VALUE_HERE: T### or "None"]

- [ ] T006 [YOUR_VALUE_HERE: Second component]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Depends on: [YOUR_VALUE_HERE: T###]

- [ ] T007 [P] [YOUR_VALUE_HERE: Component that can run in parallel]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]

### Integration

- [ ] T008 [YOUR_VALUE_HERE: Integration task - connecting components]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Depends on: [YOUR_VALUE_HERE: T###, T###]

- [ ] T009 [YOUR_VALUE_HERE: Error handling and edge cases]
  - [NEEDS CLARIFICATION: What error scenarios need handling?
      (a) Network failures - retry logic
      (b) API errors - user feedback
      (c) Validation errors - form feedback
      (d) All of the above]

### Polish

- [ ] T010 [P] [YOUR_VALUE_HERE: Polish task - UI refinement, loading states]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]

- [ ] T011 [P] [YOUR_VALUE_HERE: Polish task - accessibility, responsive]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]

[example:
### Core Components
- [ ] T005 Implement metricsApi client with typed endpoints (src/api/metrics.ts)
  - Depends on: None
- [ ] T006 Create useMetricsQuery hook with loading/error states (src/hooks/useMetricsQuery.ts)
  - Depends on: T005
- [ ] T007 [P] Create MetricsChart component with responsive sizing (src/components/metrics/MetricsChart.tsx)
  - Depends on: None (parallel with T006)

### Integration
- [ ] T008 Create MetricsDashboard container component (src/components/metrics/MetricsDashboard.tsx)
  - Depends on: T006, T007
- [ ] T009 Add error boundary and fallback UI (src/components/metrics/MetricsErrorBoundary.tsx)
  - Depends on: T008

### Polish
- [ ] T010 [P] Implement CSV export utility (src/utils/csvExport.ts)
- [ ] T011 [P] Add loading skeletons and transitions (src/components/metrics/MetricsSkeleton.tsx)]

**Checkpoint**: Implementation complete when all Phase 2 tasks are marked `[x]`

---

## Phase 3: Verification

**Purpose**: Validate implementation against acceptance criteria and checklist

### Testing

- [ ] T012 Test happy path manually
  - [YOUR_VALUE_HERE: List specific user flows to test]

- [ ] T013 Test edge cases
  - [YOUR_VALUE_HERE: List specific edge cases to verify]
  - [NEEDS CLARIFICATION: What edge cases are critical?
      (a) Empty data states
      (b) Error recovery
      (c) Large data sets / pagination
      (d) Network interruption mid-request
      (e) All of the above]

- [ ] T014 [P] Write unit tests
  - [YOUR_VALUE_HERE: Which components need unit tests]

- [ ] T015 [P] Write integration tests
  - [YOUR_VALUE_HERE: Which integrations need testing]

### Checklist Verification

- [ ] T016 Verify checklist.md P0 items
  - [ ] All P0 items verified with evidence
  - [ ] Evidence documented in checklist.md

- [ ] T017 Verify checklist.md P1 items
  - [ ] All P1 items verified OR deferred with documented approval
  - [ ] Deferred items logged with reason and approver

- [ ] T018 Review P2 items
  - [ ] Decide defer/complete for each
  - [ ] Document decisions

### Documentation

- [ ] T019 Update spec.md status to "Complete"

- [ ] T020 Finalize decision-record.md ADRs
  - [ ] All ADRs have status "Accepted" or "Rejected"
  - [ ] Consequences documented based on implementation experience

- [ ] T021 Create implementation-summary.md

- [ ] T022 [P] Update any external documentation
  - [YOUR_VALUE_HERE: README, API docs, user guides if applicable]

**Checkpoint**: Verification complete when all Phase 3 tasks pass AND checklist.md P0 items verified

---

## Completion Criteria

[YOUR_VALUE_HERE: Final checklist before claiming the feature is done. All items must be checked.]

- [ ] All tasks marked `[x]` - no pending items
- [ ] No `[B]` blocked tasks remaining - all blockers resolved
- [ ] Manual verification passed - all user flows tested
- [ ] checklist.md P0 items all verified with evidence
- [ ] checklist.md P1 items verified OR deferred with approval
- [ ] decision-record.md all ADRs finalized
- [ ] implementation-summary.md created
- [ ] [NEEDS CLARIFICATION: Additional completion criteria?
    (a) Code review approved
    (b) QA sign-off
    (c) Product owner acceptance
    (d) Performance benchmarks met
    (e) All of the above]

---

## Cross-References

[YOUR_VALUE_HERE: Links to related documentation for this feature.]

- **Specification**: See `spec.md` for requirements and acceptance criteria
- **Plan**: See `plan.md` for architecture, dependency graph, and milestones
- **Checklist**: See `checklist.md` for verification items
- **Decisions**: See `decision-record.md` for architectural decisions
- **[NEEDS CLARIFICATION: Additional references?
    (a) Design mockups - link to Figma/design tool
    (b) API documentation - link to API docs
    (c) Related specs - link to dependent/related spec folders
    (d) None additional]

---

## Notes

[YOUR_VALUE_HERE: Any additional notes, decisions made during implementation, or learnings to document. Delete this section if empty.]

[example:
- Decided to use TanStack Query v5 for better TypeScript support despite project using v4 elsewhere
- Dashboard performance acceptable up to 5000 data points; beyond that, consider server-side pagination
- Export functionality limited to 10,000 rows to prevent browser memory issues
- ADR-002 added during implementation: Chart library selection based on bundle size analysis]

---

<!--
VERBOSE LEVEL 3 TEMPLATE - TASKS (~250 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 3: Large features (500+ LOC), complex/architecture changes
- Includes decision-record.md tasks and enhanced verification
- Use for major features requiring comprehensive task tracking
- After completion, can be simplified to core format by removing guidance
-->
