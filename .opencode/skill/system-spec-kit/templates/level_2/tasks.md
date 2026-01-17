<!-- SPECKIT_LEVEL: 2 -->
# Tasks: [YOUR_VALUE_HERE: feature-name] - Implementation Breakdown

Task list template for feature implementation with user story organization and independent testing.

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

**Basic Format** (backward compatible):
```text
- [ ] T### [P?] [Story] Description
```

**Format Elements:**
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to [example: US1, US2]
- Include exact file paths in descriptions
- ID format: `T###` [example: T012]
- Avoid parallel edits to the same file in different tasks

### Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths below assume single project - adjust based on `plan.md` structure

### Example Task Lines

**Basic Format:**
```text
T012 [P] [US1] Implement service in src/services/[service].py (depends on T010, T011)
```

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

## 3. TASK GROUPS BY PHASE/STORY

### Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

### Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

**Examples of foundational tasks** (adjust based on your project):
- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

### Phase 3: User Story 1 - [YOUR_VALUE_HERE: title] (Priority: P1) MVP

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 1** (OPTIONAL - only if tests requested):
- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

**Implementation for User Story 1**:
- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

### Phase 4: User Story 2 - [YOUR_VALUE_HERE: title] (Priority: P2)

**Goal**: [YOUR_VALUE_HERE: brief description of what this story delivers]

**Independent Test**: [YOUR_VALUE_HERE: how to verify this story works on its own]

**Tests for User Story 2** (OPTIONAL - only if tests requested):
- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

**Implementation for User Story 2**:
- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

[Add more user story phases as needed, following the same pattern]

---

### Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/

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

---

## 5. OPTIONAL TESTS GUIDANCE

### Unit Tests
- **What**: [YOUR_VALUE_HERE: components/functions requiring unit tests - example: all service layer functions, validation logic]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/unit/]
- **Coverage Target**: [YOUR_VALUE_HERE: percentage - example: 70% line coverage]

### Integration Tests
- **What**: [YOUR_VALUE_HERE: integrations requiring testing - example: all API endpoints]
- **Where**: [YOUR_VALUE_HERE: test file locations - example: tests/integration/]
- **Coverage Target**: [YOUR_VALUE_HERE: description - example: all API endpoints]

### Test Data
- **Fixtures**: [YOUR_VALUE_HERE: location and description]
- **Factories**: [YOUR_VALUE_HERE: test data generation strategy]

### Execution
- **Local**: [YOUR_VALUE_HERE: command to run tests locally - example: npm test, pytest]
- **CI**: [YOUR_VALUE_HERE: when tests run - example: on every PR]

---

## WHEN TO USE THIS TEMPLATE

**Use tasks.md when:**
- Creating Level 2 spec folders (simple features)
- Feature requires breaking down into 5-15 discrete tasks
- User stories (1-2) need independent implementation tracking
- Team needs clear task assignments

**Level requirements:**
- tasks.md is REQUIRED for Level 2
- Level 2: Use a minimal task list (5-15 tasks, 2-3 phases)
- For complex features, use Level 2 or Level 3 templates

**Related templates:**
- Generate tasks.md AFTER completing plan.md
- Reference spec.md for user stories and priorities

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
