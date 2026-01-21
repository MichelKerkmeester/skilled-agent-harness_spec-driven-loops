# Tasks: [YOUR_VALUE_HERE: feature-name]

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-level2-verbose | v2.0-verbose -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending - not yet started |
| `[x]` | Completed - verified done |
| `[P]` | Parallelizable - can run alongside other [P] tasks |
| `[B]` | Blocked - waiting on dependency (add note explaining blocker) |

**Task Format**: `T### [P?] Description (file path if applicable)`

[example:
- [ ] T001 Create project structure
- [ ] T002 [P] Install dependencies (package.json)
- [x] T003 Configure linting (already done in previous PR)
- [B] T004 Implement API client - blocked on API contract finalization]

---

## Task Completion Criteria

[YOUR_VALUE_HERE: Define what "done" means for tasks in this feature. All criteria must be met before marking a task [x].]

**Mark a task `[x]` when:**
- [ ] Code implementation finished and working
- [ ] Code passes lint/format checks
- [ ] [NEEDS CLARIFICATION: What testing is required per task? (a) No testing required - manual verification only (b) Unit tests required for logic (c) Integration tests required for API calls (d) Follows project testing conventions - specify]
- [ ] [NEEDS CLARIFICATION: Is code review required? (a) Yes - PR approval needed (b) No - self-review acceptable (c) For certain tasks only - specify which]

---

## Working Files Location

[YOUR_VALUE_HERE: Document where different types of files should go during implementation. This prevents project root pollution.]

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code, experiments | Temporary (git-ignored, delete when done) |
| `memory/` | Context to preserve for future sessions | Permanent (git-tracked) |
| Spec folder root | Final documentation (spec.md, plan.md, tasks.md, checklist.md) | Permanent (git-tracked) |
| Source directories | Implementation code | Permanent (git-tracked) |

**MUST**: Place ALL temporary/debug files in `scratch/`
**NEVER**: Create temp files in spec folder root or project root

---

## Phase 1: Setup

[YOUR_VALUE_HERE: Initial setup tasks that must complete before implementation can begin. These establish the foundation.]

**Purpose**: Project initialization and development environment setup

- [ ] T001 Create project structure
  - [YOUR_VALUE_HERE: Specific directories to create, e.g., "Create src/components/metrics/, src/api/, src/types/"]

- [ ] T002 Install dependencies
  - [NEEDS CLARIFICATION: What new dependencies are needed?
      (a) None - all dependencies already in project
      (b) Specify packages: [YOUR_VALUE_HERE: package names and versions]
      (c) TBD - will determine during implementation]

- [ ] T003 [P] Configure development tools
  - [YOUR_VALUE_HERE: What tooling setup is needed, e.g., "Add path aliases to tsconfig.json"]

[example:
- [ ] T001 Create src/components/metrics/ directory with index.ts barrel export
- [ ] T002 Install @tanstack/react-query@5.x if not present
- [ ] T003 [P] Add METRICS_API_URL to .env.example with documentation comment
- [ ] T004 [P] Create src/types/metrics.ts with TypeScript interfaces from API contract]

**Checkpoint**: Setup complete when all T00x tasks are marked `[x]`

---

## Phase 2: Implementation

[YOUR_VALUE_HERE: Core implementation tasks. Break into logical chunks that can be verified independently. Order tasks by dependency - tasks that others depend on should come first.]

**Purpose**: Build the core feature functionality

- [ ] T004 [YOUR_VALUE_HERE: First implementation task - typically foundational, e.g., data models, API client]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - [example: Implement metricsApi.ts with fetchDailyMetrics(), fetchWeeklyMetrics() functions]

- [ ] T005 [YOUR_VALUE_HERE: Second implementation task]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]
  - Depends on: [YOUR_VALUE_HERE: T### if this task has dependencies, or "None"]

- [ ] T006 [P] [YOUR_VALUE_HERE: Task that can run in parallel with T005]
  - File: [YOUR_VALUE_HERE: path/to/file.ts]

- [ ] T007 [YOUR_VALUE_HERE: Add error handling]
  - [NEEDS CLARIFICATION: What error scenarios need handling?
      (a) Network failures only - retry with exponential backoff
      (b) API errors - display user-friendly messages
      (c) Validation errors - form-level error display
      (d) All of the above with specific handling per type]

[example:
- [ ] T004 Implement metricsApi client with typed endpoints (src/api/metrics.ts)
- [ ] T005 Create useMetricsQuery hook with loading/error states (src/hooks/useMetricsQuery.ts)
  - Depends on: T004
- [ ] T006 [P] Create MetricsChart component with responsive sizing (src/components/metrics/MetricsChart.tsx)
- [ ] T007 Create MetricsDashboard container component (src/components/metrics/MetricsDashboard.tsx)
  - Depends on: T005, T006
- [ ] T008 [P] Implement CSV export utility (src/utils/csvExport.ts)
- [ ] T009 Create MetricsExporter component with download button (src/components/metrics/MetricsExporter.tsx)
  - Depends on: T008
- [ ] T010 Add error boundary and fallback UI (src/components/metrics/MetricsErrorBoundary.tsx)
- [ ] T011 Integrate dashboard into main application routing (src/App.tsx or src/routes/)]

**Checkpoint**: Implementation complete when all T0xx implementation tasks are marked `[x]`

---

## Phase 3: Verification

[YOUR_VALUE_HERE: Testing and verification tasks. These validate that the implementation meets acceptance criteria from spec.md.]

**Purpose**: Validate implementation against acceptance criteria

- [ ] T012 Test happy path manually
  - [YOUR_VALUE_HERE: List specific user flows to test]
  - [example: Load dashboard, verify metrics display, change date range, verify update]

- [ ] T013 Test edge cases
  - [YOUR_VALUE_HERE: List specific edge cases to verify]
  - [NEEDS CLARIFICATION: What edge cases are critical?
      (a) Empty data states
      (b) Error recovery
      (c) Large data sets / pagination
      (d) Network interruption mid-request
      (e) All of the above]

- [ ] T014 Verify checklist.md items
  - [ ] All P0 items verified with evidence
  - [ ] All P1 items verified OR deferred with documented approval
  - [ ] P2 items reviewed and documented

- [ ] T015 Update documentation
  - [ ] Update spec.md status to "Complete"
  - [ ] Create implementation-summary.md
  - [ ] [YOUR_VALUE_HERE: Any other docs to update, e.g., README, API docs]

[example:
- [ ] T012 Manual test: Dashboard loads with current month data in < 2 seconds
- [ ] T013 Manual test: Date range selector works for 1d, 7d, 30d, 90d presets
- [ ] T014 Manual test: CSV export downloads file with correct data
- [ ] T015 Edge case: Empty data shows helpful "No data for this period" message
- [ ] T016 Edge case: API timeout shows retry button and error message
- [ ] T017 Edge case: Large dataset (1000+ rows) renders without performance issues
- [ ] T018 Cross-browser: Test in Chrome, Firefox, Safari (latest versions)
- [ ] T019 Verify all P0 checklist items with evidence
- [ ] T020 Update spec.md status to "Complete"
- [ ] T021 Create implementation-summary.md with final details]

**Checkpoint**: Verification complete when all verification tasks pass AND checklist.md P0 items verified

---

## Completion Criteria

[YOUR_VALUE_HERE: Final checklist before claiming the feature is done. All items must be checked.]

- [ ] All tasks marked `[x]` - no pending items
- [ ] No `[B]` blocked tasks remaining - all blockers resolved
- [ ] Manual verification passed - all user flows tested
- [ ] checklist.md P0 items all verified with evidence
- [ ] checklist.md P1 items verified OR deferred with approval
- [ ] [NEEDS CLARIFICATION: Additional completion criteria?
    (a) Code review approved
    (b) QA sign-off
    (c) Product owner acceptance
    (d) None additional]

---

## Cross-References

[YOUR_VALUE_HERE: Links to related documentation for this feature.]

- **Specification**: See `spec.md` for requirements and acceptance criteria
- **Plan**: See `plan.md` for architecture and technical approach
- **Checklist**: See `checklist.md` for verification items
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
- Export functionality limited to 10,000 rows to prevent browser memory issues]

---

<!--
VERBOSE LEVEL 2 TEMPLATE - TASKS (~220 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 2: Medium features (100-499 LOC), requires QA validation
- Includes checklist.md verification tasks
- Use for features requiring verification rigor
- After completion, can be simplified to core format by removing guidance
-->
