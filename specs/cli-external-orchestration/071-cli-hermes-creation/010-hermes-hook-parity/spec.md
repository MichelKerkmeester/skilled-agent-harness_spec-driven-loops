---
title: "Feature Specification: Phase 1: hermes-hook-parity"
description: "Hermes hook parity: the repo-guards plugin bridges every repo hook core Hermes's plugin API can reach (prompt-time advisor and gate, tool-call guards, post-edit quality, goal core, session-start advisories, session cleanup, vision), implemented on cli-pi with DeepSeek V4.1 Flash and proven live."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: hermes-hook-parity

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The hooks library has 22 packages; the Hermes plugin bridged seven. This phase bridges every remaining core Hermes's plugin API can reach, one dispatch group at a time on cli-pi with DeepSeek V4.1 Flash at max through the LLM Gateway, with the conductor verifying each group live and feeding defects back. Four packages stay out by nature (OpenCode-, Claude- and Devin-only hooks, and the installer).

**Key Decisions**: one plugin, many hooks; every bridge shells out to the existing core; the prompt-time hooks ride `pre_llm_call`, whose context Hermes appends to the user message

**Critical Dependencies**: phases 005 and 006; the operator-level provider and plugin allowlist

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete — ten bridges landed and proven live 2026-09-15 |
| **Created** | 2026-09-15 |
| **Branch** | `scaffold/010-hermes-hook-parity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-docs-governance-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Bridge every applicable repo hook into the Hermes project plugin specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Hermes session ran seven of the repo's twenty-two hook packages. The advisor brief, the spec gate, the task-dispatch guard, the MCP route guard, post-edit quality, the shared goal core, the session-start guards, session cleanup and the vision evidence never reached it.

### Purpose
A Hermes session runs the same guards as the other six runtimes wherever Hermes's plugin API offers a seam.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten bridges in `.hermes/plugins/repo-guards/__init__.py` with harness tests and a live scenario each
- The `pre_llm_call` trial for the prompt-time hooks
- The pi session-start collector's interpreter defect, found while wiring the same guard

### Out of Scope
- `codex-watchdog`, `directive-lifecycle`, `permission-policy`, `hook-install` - runtime-specific by nature
- Re-implementing any core - every bridge shells out to the existing script

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.hermes/plugins/repo-guards/__init__.py`, `plugin.yaml` | Modify | ten bridges, six hooks, four sections |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Modify | 42 tests |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Modify | dist checker run with its real interpreter |
| `.hermes/SYNC.md`, `cli-hermes/references/hook-contract.md`, `cli-hermes/feature-catalog/runtime-surface/repo-guards-project-plugin.md` | Modify | full hook map |
| `cli-hermes/manual-testing-playbook/**` | Create (7) | scenarios `HERMES-024` to `HERMES-030` |
| `~/.hermes/config.yaml` (operator home, backed up) | Modify | `auxiliary.vision.provider` and `.model` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every bridge the directive lists is registered, harness-tested and proven in a live Hermes session |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The prompt-time trial has a recorded verdict |
| REQ-003 | The sync manifest, hook contract, catalog leaf and playbook describe every bridge and validate |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 .hermes/plugins/repo-guards/tests/test_repo_guards.py` → `Ran 42 tests ... OK`; `hermes plugins validate` passes
- **SC-002**: seven new scenarios executed live, all PASS; playbook validator `violations=0`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hermes hook API (bounded worker threads, 4000-char sections) | A bridge silently misses | Every bridge proven live, not only in the harness |
| Risk | A worker's in-process test hides a session-only defect | Med | Two defects found exactly this way and fixed by follow-up dispatches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Every core finishes well inside Hermes's 30-second hook timeout (post-edit 0.12 s, advisories 0.9 s)

### Security
- **NFR-S01**: No credential in any file; the vision provider is named by key_env only

### Reliability
- **NFR-R01**: Every hook fails open; a missing core contributes nothing

---

## 8. EDGE CASES

### Data Boundaries
- Orchestrated leaf: prompt-time bridges skip
- Section over 4000 characters: trimmed, never skipped

### Error Scenarios
- Advisor daemon unreachable: the CLI's local scorer answers
- Vision provider unresolved: the tool is absent and the bridge is idle

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~14, LOC: ~600, Systems: plugin, hooks |
| Risk | 10/25 | Live guard behavior |
| Research | 12/20 | Hermes hook internals |
| Multi-Agent | 10/15 | Six Pi dispatches |
| Coordination | 8/15 | Phases 005 and 006 |
| **Total** | **54/100** | **Level 3 (inherited from the packet)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Hook ordering differs between the harness and a session | H | M | Live proof per bridge; two ordering defects caught |

---

## 11. USER STORIES

### US-001: Same guards everywhere (Priority: P0)

**As an** operator, **I want** a Hermes session guarded like Claude, Pi and Devin, **so that** no runtime is the soft spot.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Prompt-time context (Priority: P1)

**As a** Hermes session, **I want** the advisor brief and the spec-folder question with my first message, **so that** I route and scope like the other runtimes.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


