---
title: "Feature Specification: Phase 7: test-and-ci-bloat-research"
description: "The repository carries about 1,270 test files and 32 CI workflows, and the operator waits minutes on every commit, push and CI run. Earlier phases made the same tests run faster. This phase researches which tests and workflows should not exist or should not run where they run."
trigger_phrases:
  - "test and ci bloat research"
  - "phase 7 test and ci bloat research"
  - "reduce test and workflow run time"
  - "overengineered tests and workflows"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: test-and-ci-bloat-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-overlay-replaced-subtree-repin |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` exists and ranks the cuts by minutes saved, each with its evidence and its risk |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Test Cycle Speed specification.

**Scope Boundary**: Research only. This phase reads tests, workflows and hooks and writes findings under `research/`. It changes no test, workflow, hook or source file.

**Dependencies**:
- Phases 1 to 5 of this packet, which hold the per-file timing profile and the CI runner timing.
- `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`, which already settled caching, trigger hygiene and a workflow consolidation decision.

**Deliverables**:
- `research/research.md`, a ranked list of cuts with evidence.
- Two independent research lineages under `research/`, ten iterations each.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator waits minutes on automated tests and CI workflows after most changes. The repository tracks about 1,270 test files with about 428,000 lines and 32 CI workflows, and several workflows take five to ten minutes each. The earlier phases of this packet kept every test and made the suites run faster, so nobody has yet asked which tests and workflows earn their run time.

### Purpose
Produce a ranked, evidence-backed list of tests, workflows and hook checks to delete, merge, narrow or move off the commit and push path, with the minutes each cut saves and the regression it stops catching.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files | grep -Ev 'node_modules|z_archive' | grep -E '\.(test|spec|vitest)\.(ts|js|mjs|cjs|tsx)$|_test\.py$|test_.*\.py$|\.bats$|\.test\.sh$' | sed -E 's/.*\.((test|spec|vitest)\.[a-z]+|bats|py|sh)$/\1/' | sort | uniq -c | sort -rn
 777 vitest.ts
 217 test.cjs
 102 test.mjs
  71 py
  66 test.ts
  37 sh
(the same file list piped to wc -l)
  427643 total

$ wc -l .github/workflows/*.yml | tail -1
    3867 total   (32 workflow files; 3987 with README.md)

$ gh run list --limit 60 --json workflowName,createdAt,updatedAt   (workflow | runs | mean seconds | max seconds)
Spec-Kit Check | 3 | 595 | 899
Deep-Loop Runtime Tests | 1 | 472 | 472
Skill Advisor Stress Tests | 2 | 457 | 460
CodeQL | 7 | 319 | 396
sk-doc Script Tests | 3 | 279 | 301
OpenCode Plugin Tests | 3 | 255 | 266
Gate Inputs | 4 | 199 | 239
Trigger Index Rebuild | 3 | 185 | 203
OpenCode Dual-Version Battery | 1 | 161 | 161
Routing Registry Drift Guard | 3 | 160 | 206
Naming Standard Guard | 3 | 148 | 201
Message Contract | 3 | 135 | 169
Dispatch Enforcement Guard | 3 | 125 | 127
Changed Packet Validation | 3 | 119 | 133
Command Tree Parity | 3 | 108 | 115
Playbook Operator Contract | 4 | 108 | 136
Advisory Checks | 3 | 87 | 124
Markdown Link Integrity | 3 | 75 | 96
Skill Doc Frontmatter | 1 | 66 | 66
Runtime No-Spec-Import Guard | 1 | 66 | 66
Rule Canary Sync | 3 | 10 | 11

Test files by directory (count, path):
 353 .skilled/skills/system-spec-kit/runtime
 186 .skilled/skills/system-skill-advisor/runtime
 174 .skilled/skills/system-deep-loop/runtime
  56 .skilled/commands/doctor/scripts
  54 .skilled/skills/sk-doc/scripts
  36 .skilled/skills/sk-design/sk-design-md-generator
 about 110 under specs/ (most in specs/cli-classifier/003-cli-jev-workflow-integration)
```
The run times are wall-clock from run creation to last update, so they include queue time. Local hook time (`.skilled/scripts/git-hooks/pre-commit` and `pre-push`) is not measured yet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every CI workflow by trigger, path filter, run time and what it has caught, and name the ones that duplicate another workflow or a local hook.
- Find tests that are redundant, mirror the implementation, re-assert the framework, test retired code or live in closed spec packets.
- Time the local pre-commit and pre-push hooks and name the checks that could run only in CI, or only on changed paths.
- Find overengineered test infrastructure: custom harnesses, serial lists, fixtures and helper layers that cost run time or maintenance for little coverage.
- Rank every proposed cut by minutes saved per commit, push or CI run, with the regression it would stop catching.

### Out of Scope
- Changing any test, workflow, hook or source file - a later phase builds the cuts the operator approves.
- Repeating settled work - caching, trigger hygiene, the consolidation decision and the per-file splits are closed in the packets named under Dependencies.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` in this folder | Create | Lineage state, iteration files and `research.md` |
| `spec.md` in this folder | Modify | The generated findings block after synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two lineages run ten iterations each: cli-opencode on `opencode-go/deepseek-v4.1-flash` at max, and cli-pi on `deepseek-v4.1-flash-1017` at max | `ls research/lineages/*/iterations/iteration-*.md` lists 20 files |
| REQ-002 | The synthesis ranks the cuts and cites a file path for each | `research/research.md` exists and every recommendation names a path and an estimated saving |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The synthesis separates cuts that delete coverage from cuts that only move or narrow when a check runs | `research.md` labels each recommendation delete, merge, narrow or move |
| REQ-004 | The orchestrator checks the top recommendations against the repository before reporting them | The completion message states which findings were confirmed by a command and which stay inferred |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` names at least the five largest run-time costs on the commit, push and CI paths, each with a measured or cited duration.
- **SC-002**: Every recommendation states what regression it stops catching, so the operator can approve or refuse it without rereading the tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode Go and LLM Gateway quota for DeepSeek V4.1 Flash | A lineage stalls or fails mid-run | The fan-out runner retries and reports the failed lineage. A quota stop is reported to the operator and the model is not swapped |
| Risk | The parent spec lists deleting or weakening tests as out of scope | Medium: a build phase that follows this research contradicts the parent | This phase only recommends. The operator widens the parent scope before any deletion is built |
| Risk | A weak model calls a test redundant without reading what it guards | High: a real guard gets deleted later | Each recommendation names the regression it stops catching, and the orchestrator verifies the top ones |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which automated tests, CI workflows and git hook checks are bloat or overengineered, and what should be cut, merged, narrowed or moved to shorten test and workflow run time?
- Does the operator widen the parent scope, which excludes deleting tests, once the research names deletions worth making?

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings from `research/research.md`, which stays the canonical source:
- The wait after a push equals the slowest workflow it triggers: 220 to 441 s when `Spec-Kit Check` does not run and 843 to 1,015 s when it does.
- Three changes shorten that wait: run the three sequential `Spec-Kit Check` suites as parallel jobs, path-filter most of `sk-doc Script Tests`, and roll out the sparse checkout already used by `rule-canary-sync.yml`.
- The git hooks cost one to three seconds and need no cut.
- Test files under `specs/` never run, and the same-named test pairs are not duplicates.
- Deleting the workflows that repeat a local hook saves runner minutes and no waiting time.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
