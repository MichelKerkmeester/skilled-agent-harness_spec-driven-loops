# Tasks: [YOUR_VALUE_HERE: feature-name] - Implementation Breakdown

Task list template for feature implementation with user story organization and independent testing.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

## IMPORTANT: REPLACE SAMPLE TASKS

**⚠️ THIS TEMPLATE CONTAINS SAMPLE TASKS FOR ILLUSTRATION ONLY**

The `/spec_kit:tasks` command MUST replace these with actual tasks based on:
- User stories from spec.md (with their priorities P0, P1, P2)
- Feature requirements from plan.md

Tasks MUST be organized by user story so each story can be:
- Implemented independently
- Tested independently
- Delivered as an MVP increment

**DO NOT keep these sample tasks in the generated tasks.md file.**

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Level**: 3
- **Tags**: [YOUR_VALUE_HERE: feature-name], [YOUR_VALUE_HERE: area]
- **Priority**: [NEEDS CLARIFICATION: What is the task priority? (a) P0-critical - HARD BLOCKER, must complete (b) P1-high - must complete OR user-approved deferral (c) P2-medium - can defer without approval]

### Input
Design documents from `/specs/[###-feature-name]/`

### Prerequisites
- **Required**: `plan.md`, `spec.md` (for user stories)
- **Optional**: `research.md`

### Organization
Tasks are grouped by user story to enable independent implementation and testing of each story.

### Tests
The examples below include test tasks. Tests are **OPTIONAL** - only include them if explicitly requested in the feature specification.

---

## 2. CONVENTIONS

### Task Format

**Tier 1 - Simple** (one-liner):
```text
- [ ] T### [P] [Story] Brief description
```

**Tier 2 - Standard** (with metadata):
```text
- [ ] T### [P] [Story] Description
  - Files: path/to/file.js
  - Depends: T###, T###
```

**Tier 3 - Full** (comprehensive):
```markdown
### T### [P?] - Task Title (Story: US#)

| Attribute | Value |
|-----------|-------|
| Priority | P0/P1/P2 |
| Complexity | Low/Med/High |
| Est. Effort | [points/hours] |
| Dependencies | T###, T### |
| Blocks | T###, T### |

**Files to Modify:**
- `path/to/file.js` - [change description]
- `path/to/other.js` - [change description]

**Implementation Steps:**
1. [ ] Step 1
2. [ ] Step 2
3. [ ] Step 3

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Verification:**
- [ ] Tests pass
- [ ] Code reviewed
```

**When to use each tier:**
- **Tier 1**: Quick changes, config updates, small fixes
- **Tier 2**: Standard features, moderate changes (RECOMMENDED for Level 3)
- **Tier 3**: Complex tasks, architectural changes, multi-file coordination

**Format Elements:**
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to [example: US1, US2, US3]
- Include exact file paths in descriptions
- ID format: `T###` [example: T012]
- Avoid parallel edits to the same file in different tasks

### Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths below assume single project - adjust based on `plan.md` structure

### Commit Message Hint
```text
tasks([SPEC_ID]): short action
```
[OPTIONAL: use if linking commits to spec]

---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

> **OpenCode Users:** Verify file placement manually. No automated validation to enforce.

---

### Task Completion Criteria
**Mark a task complete when:**
- [ ] Code implementation finished
- [ ] Code passes local tests (if tests exist)
- [ ] Code passes lint/format checks
- [ ] File paths match conventions
- [ ] Dependencies satisfied (if any)
- [ ] Peer review completed (if required)

---

## Task-Requirement Linking

Each task SHOULD reference its source requirement from spec.md for better traceability.

### Enhanced Format (Level 3 - Recommended)
```markdown
- [ ] TASK-NNN: Task description
  - **Requirement:** REQ-XXX (spec.md#section-anchor)
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

### Example
```markdown
- [ ] TASK-001: Implement OAuth provider integration
  - **Requirement:** REQ-AUTH-010 (spec.md#authentication)
  - **Acceptance:** OAuth login flow works end-to-end
  - **Verification:** Integration test passes, manual QA sign-off

- [ ] TASK-002: Create user session management
  - **Requirement:** REQ-AUTH-020 (spec.md#session-management)
  - **Acceptance:** Sessions persist across page reloads, timeout after 30 min inactivity
  - **Verification:** Unit tests for session logic, E2E test for timeout behavior
```

### When to Use Enhanced Format
- **Level 3 specs:** Recommended for complex features requiring audit trail
- **Regulated domains:** Required for compliance (healthcare, finance, etc.)
- **Team collaboration:** Helpful when multiple developers work on same feature

---

## 3. TASK GROUPS BY PHASE/STORY

### Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
  - Files: Project root directory structure
  - Depends: None
- [ ] T002 Initialize [language] project with [framework] dependencies
  - Files: package.json, requirements.txt, Cargo.toml (as applicable)
  - Depends: T001
- [ ] T003 [P] Configure linting and formatting tools
  - Files: .eslintrc, .prettierrc, or language-specific config
  - Depends: T002

---

### Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

**Examples of foundational tasks** (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
  - Files: migrations/, schema.sql
  - Depends: T002
- [ ] T005 [P] Implement authentication/authorization framework
  - Files: src/auth/, tests/auth/
  - Depends: T004
- [ ] T006 [P] Setup API routing and middleware structure
  - Files: src/routes/, src/middleware/
  - Depends: T004
- [ ] T007 Create base models/entities that all stories depend on
  - Files: src/models/base.js
  - Depends: T004
- [ ] T008 Configure error handling and logging infrastructure
  - Files: src/lib/logger.js, src/middleware/error-handler.js
  - Depends: T006
- [ ] T009 Setup environment configuration management
  - Files: src/config/
  - Depends: T002

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

### Phase 3: User Story 1 - [YOUR_VALUE_HERE: title] (Priority: P0) MVP

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 1** (OPTIONAL - only if tests requested):

- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
  - Requirement: REQ-FUNC-001 (spec.md#functional-requirements)
  - Acceptance: API contract validated
  - Verification: Contract test passes
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py
  - Requirement: REQ-FUNC-001 (spec.md#functional-requirements)
  - Acceptance: User journey works end-to-end
  - Verification: Integration test passes

**Implementation for User Story 1**:

- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
  - Requirement: REQ-DATA-001 (spec.md#functional-requirements)
  - Files: src/models/[entity1].py
  - Depends: T007
  - Acceptance: Model defined with all required fields
  - Verification: Unit test for model validation

- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
  - Requirement: REQ-DATA-002 (spec.md#functional-requirements)
  - Files: src/models/[entity2].py
  - Depends: T007
  - Acceptance: Model defined with all required fields
  - Verification: Unit test for model validation

- [ ] T014 [US1] Implement [Service] in src/services/[service].py
  - Requirement: REQ-FUNC-002 (spec.md#functional-requirements)
  - Files: src/services/[service].py
  - Depends: T012, T013
  - Acceptance: Service implements business logic correctly
  - Verification: Unit tests for service methods

- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
  - Requirement: REQ-FUNC-003 (spec.md#functional-requirements)
  - Files: src/api/[endpoint].py, src/routes/[route].py
  - Depends: T014
  - Acceptance: Endpoint handles requests and returns correct responses
  - Verification: Integration test for endpoint

- [ ] T016 [US1] Add validation and error handling
  - Requirement: REQ-FUNC-004 (spec.md#functional-requirements)
  - Files: src/validation/[validator].py, src/middleware/error-handler.js
  - Depends: T015
  - Acceptance: All inputs validated, errors handled gracefully
  - Verification: Error case tests pass

- [ ] T017 [US1] Add logging for user story 1 operations
  - Requirement: NFR-O03 (spec.md#non-functional-requirements)
  - Files: src/services/[service].py (logging additions)
  - Depends: T015
  - Acceptance: All key operations logged with context
  - Verification: Log output review

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

### Phase 4: User Story 2 - [YOUR_VALUE_HERE: title] (Priority: P0)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 2** (OPTIONAL - only if tests requested):

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
  - Requirement: REQ-FUNC-005 (spec.md#functional-requirements)
  - Acceptance: API contract validated
  - Verification: Contract test passes

- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py
  - Requirement: REQ-FUNC-005 (spec.md#functional-requirements)
  - Acceptance: User journey works end-to-end
  - Verification: Integration test passes

**Implementation for User Story 2**:

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
  - Requirement: REQ-DATA-003 (spec.md#functional-requirements)
  - Files: src/models/[entity].py
  - Depends: T007
  - Acceptance: Model defined with all required fields
  - Verification: Unit test for model validation

- [ ] T021 [US2] Implement [Service] in src/services/[service].py
  - Requirement: REQ-FUNC-006 (spec.md#functional-requirements)
  - Files: src/services/[service].py
  - Depends: T020
  - Acceptance: Service implements business logic correctly
  - Verification: Unit tests for service methods

- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
  - Requirement: REQ-FUNC-007 (spec.md#functional-requirements)
  - Files: src/api/[endpoint].py
  - Depends: T021
  - Acceptance: Endpoint handles requests correctly
  - Verification: Integration test passes

- [ ] T023 [US2] Integrate with User Story 1 components (if needed)
  - Requirement: REQ-INTG-001 (spec.md#functional-requirements)
  - Files: src/services/[integration].py
  - Depends: T015, T022
  - Acceptance: Integration points work correctly
  - Verification: Integration test covering both stories

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

### Phase 5: User Story 3 - [YOUR_VALUE_HERE: title] (Priority: P1)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Implementation for User Story 3**:

- [ ] T024 [P] [US3] Create [Entity] model in src/models/[entity].py
  - Requirement: REQ-DATA-004 (spec.md#functional-requirements)
  - Files: src/models/[entity].py
  - Depends: T007

- [ ] T025 [US3] Implement [Service] in src/services/[service].py
  - Requirement: REQ-FUNC-008 (spec.md#functional-requirements)
  - Files: src/services/[service].py
  - Depends: T024

- [ ] T026 [US3] Implement [endpoint/feature] in src/[location]/[file].py
  - Requirement: REQ-FUNC-009 (spec.md#functional-requirements)
  - Files: src/api/[endpoint].py
  - Depends: T025

**Checkpoint**: User Stories 1, 2, and 3 all functional

---

### Phase 6: User Story 4 - [YOUR_VALUE_HERE: title] (Priority: P1)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Implementation for User Story 4**:

- [ ] T027 [P] [US4] Implementation tasks following same pattern
  - Requirement: REQ-FUNC-010 (spec.md#functional-requirements)

- [ ] T028 [US4] Additional implementation tasks
  - Requirement: REQ-FUNC-011 (spec.md#functional-requirements)

---

### Phase 7: User Story 5 - [YOUR_VALUE_HERE: title] (Priority: P2)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Implementation for User Story 5**:

- [ ] T029 [P] [US5] Implementation tasks
  - Requirement: REQ-FUNC-012 (spec.md#functional-requirements)

- [ ] T030 [US5] Additional tasks
  - Requirement: REQ-FUNC-013 (spec.md#functional-requirements)

---

### Phase 8: User Story 6 - [YOUR_VALUE_HERE: title] (Priority: P2)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Implementation for User Story 6**:

- [ ] T031 [P] [US6] Implementation tasks
  - Requirement: REQ-FUNC-014 (spec.md#functional-requirements)

---

[OPTIONAL: Add more user story phases if feature has 7-8 user stories]

---

### Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T050 [P] Documentation updates in docs/
  - Files: docs/api.md, docs/architecture.md, README.md
  - Depends: All user story implementations

- [ ] T051 Code cleanup and refactoring
  - Files: Various (list specific files to refactor)
  - Depends: All user story implementations

- [ ] T052 Performance optimization across all stories
  - Files: src/services/ (optimization changes)
  - Depends: All user story implementations
  - Acceptance: Performance targets met (see plan.md)
  - Verification: Performance tests pass

- [ ] T053 [P] Additional unit tests (if requested) in tests/unit/
  - Files: tests/unit/ (comprehensive coverage)
  - Depends: All implementations

- [ ] T054 Security hardening
  - Files: Various (security improvements)
  - Depends: All implementations
  - Acceptance: Security scan passes
  - Verification: Security review complete

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] Lint passes
- [ ] Format checks pass
- [ ] Tests pass (unit/integration as applicable)
- [ ] No console warnings or errors

### Documentation
- [ ] Docs updated (README/spec/plan/tasks)
- [ ] Code comments added where needed
- [ ] API documentation updated (if applicable)

### Review & Sign-off
- [ ] Owner review and sign-off
- [ ] Paths and naming follow conventions
- [ ] Commit messages clear and linked to spec where needed

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
- **Checklist**: See `checklist.md` for validation

---

## 5. OPTIONAL TESTS GUIDANCE

### Unit Tests
- **What**: [YOUR_VALUE_HERE: components/functions requiring unit tests - example: all service layer functions, validation logic]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/unit/]
- **Coverage Target**: [YOUR_VALUE_HERE: percentage - example: 70-80% line coverage]

### Integration Tests
- **What**: [YOUR_VALUE_HERE: integrations requiring testing - example: all API endpoints, all database operations]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/integration/]
- **Coverage Target**: [YOUR_VALUE_HERE: description - example: all API endpoints, all DB operations]

### Test Data
- **Fixtures**: [YOUR_VALUE_HERE: location and description]
- **Factories**: [YOUR_VALUE_HERE: test data generation strategy]
- **Snapshots**: [YOUR_VALUE_HERE: snapshot testing approach if applicable]

### Execution
- **Local**: [YOUR_VALUE_HERE: command to run tests locally - example: npm test, pytest]
- **CI**: [YOUR_VALUE_HERE: when tests run - example: on every PR, nightly builds]

---

## WHEN TO USE THIS TEMPLATE

**Use tasks.md when:**
- Creating Level 3 spec folders (complex features)
- Feature requires breaking down into discrete, trackable tasks
- Multiple user stories need independent implementation tracking
- Team needs clear task assignments and dependencies
- Tasks span multiple phases or team members
- Requirement traceability important

**Level 3 requirements:**
- tasks.md is REQUIRED for Level 3
- Full task breakdown with phases, user stories, and detailed tracking
- 50-100 tasks typical for Level 3 complexity
- Use Tier 2 (Standard) or Tier 3 (Full) task format
- Link tasks to requirements from spec.md

**Related templates:**
- Generate tasks.md AFTER completing plan.md
- Reference spec.md for user stories and priorities
- Use checklist.md for validation criteria (different from task tracking)

---

<!--
  TASKS TEMPLATE - LEVEL 3 (FULL - COMPLEX)
  - 50-100 tasks organized by user story
  - WITH 3-Tier task format
  - WITH requirement linking
  - WITH acceptance criteria
  - WITH verification steps
-->
