---
title: "Implementation Plan: Phase 1: index-root-and-docs"
description: "Derive the repository root by walking up, regenerate the trigger index, and pin the root and the README's rule count with tests."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "trigger index repo root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: index-root-and-docs

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), TypeScript tests |
| **Framework** | Vitest through the skill-root projects config |
| **Storage** | The tracked `runtime/data/trigger-index.json` and its fixture outputs |
| **Testing** | Two new vitest files plus the retrieval parity and trigger-index suites |

### Overview
Replace the hop-count constant with a walk-up that stops at the directory holding both `.opencode` and `specs`, regenerate the index twice to prove determinism, and add tests so neither the root nor the documented rule count can drift silently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchor-based root discovery instead of positional arithmetic.

### Key Components
- **`findRepoRoot()`** exported from the generator; `DEFAULT_REPO_ROOT` calls it.
- **Regression test** asserting the root equals the git root and that every corpus root yields files.
- **Count test** reading the README, the CLI README and SKILL.md for "<N>-rule registry".

### Data Flow
Generator start → walk up to the anchored root → corpus walk over three roots → index and fixtures → committed data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Root derivation and corpus coverage | `tests/retrieval-repo-root.vitest.ts` |
| Unit | README rule count against the registry | `tests/validator-registry-doc-count.vitest.ts` |
| Regression | Retrieval parity and trigger index | `tests/retrieval-coverage-parity.vitest.ts`, `tests/trigger-index.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The `.opencode/specs` symlink | Internal | Present | The walk uses `.opencode` and `specs` as anchors; the symlink no longer masks anything |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the regenerated index breaks a consumer.
- **Procedure**: revert the single commit; the previous index and generator return together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read the files this phase names before editing; confirm the failing behavior with the verification command first.
- Never run the whole deep-loop suite in this environment; run named files.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` order; verification tasks run after every implementation task |
| TASK-SCOPE | Touch only the files the phase names; report anything outside it |
| Comment hygiene | Code comments carry the durable why, never packet or task identifiers |

### Status Reporting Format
Per finding: root cause, files changed, the exact rerun command and its result line.

### Blocked Task Protocol
Mark the task `[B]`, state what blocks it and which file or decision would unblock it, and continue with unblocked tasks.
<!-- /ANCHOR:ai-protocol -->
