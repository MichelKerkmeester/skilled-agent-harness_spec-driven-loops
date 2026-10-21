---
title: "Feature Specification: Code Mode fresh install fix"
description: "A fresh npm ci of the mcp-code-mode server builds a server that crashes at start-up, because the global js-yaml ^4.3.2 override forces @apidevtools/json-schema-ref-parser 15.5.1, which needs js-yaml 5, onto 4.3.2. Scope the js-yaml override so a clean install of the Code Mode server starts and serves its tools."
trigger_phrases:
  - "code mode js yaml override"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/024-code-mode-js-yaml-override"
    last_updated_at: "2026-10-21T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Opened the phase"
    next_safe_action: "Start the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Mode fresh install fix

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `main` |
| **Parent Spec** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh npm ci of the mcp-code-mode server builds a server that crashes at start-up, because the global js-yaml ^4.3.2 override forces @apidevtools/json-schema-ref-parser 15.5.1, which needs js-yaml 5, onto 4.3.2.

### Purpose
Scope the js-yaml override so a clean install of the Code Mode server starts and serves its tools.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- mcp-code-mode/mcp-server/package.json overrides
- mcp-code-mode/mcp-server/package-lock.json, regenerated
- The packet version and its changelog entry

### Out of Scope
- Reinstalling the live node_modules other sessions run
- Commits and pushes beyond the one the operator approved

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/mcp-code-mode/mcp-server/package.json | Modify | Scoped js-yaml override |
| .skilled/skills/mcp-code-mode/mcp-server/package-lock.json | Modify | Regenerated with --package-lock-only |
| .skilled/skills/mcp-code-mode/SKILL.md | Modify | Version 1.0.11.0 |
| .skilled/skills/mcp-code-mode/changelog/v1.0.11.0.md | Modify | Release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Give json-schema-ref-parser the js-yaml 5 it declares while the other dependents keep js-yaml 4 |
| REQ-002 | Regenerate the lockfile without touching the live node_modules |
| REQ-003 | Prove a clean install starts and lists the Code Mode tools |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every requirement in scope is met or recorded with the reason it was not.
- **SC-002**: The gates that own the changed files pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | Order of work | Follow tasks.md |
| Risk | A change alters behaviour a gate or mirror relies on | Med | Rerun the owning gates after each batch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No secrets, board URLs or Barter flows in any changed file.

### Reliability
- **NFR-R01**: Each change is a working-tree edit to a tracked file, reverted with `git checkout -- <path>`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- A requirement turns out not to fit when its site is opened: it is recorded as not met, with the reason.

### State Transitions
- Partial batch: tasks.md shows which tasks are done.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four files in one packet |
| Risk | 8/25 | Docs and scripts, reversible |
| Research | 4/20 | Reproduced and proven before the packet opened |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
