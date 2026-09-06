---
title: "Implementation Plan: Phase 4: shared-parsers-and-post-run-refresh"
description: "Create the shared frontmatter parser and containment primitive, adopt them where an import edge exists, and add a flag-guarded post-run metadata refresh to the fan-out runner."
trigger_phrases:
  - "shared frontmatter parser plan"
  - "parse-frontmatter dependency"
  - "path containment primitive move"
  - "post run generators refresh"
  - "advisor local sqlite declaration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: shared-parsers-and-post-run-refresh

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the shared, runtime and CLI packages and the skill advisor; CommonJS runner |
| **Framework** | Vitest for adopters and the runner; script-style tests in the shared package |
| **Storage** | None |
| **Testing** | Shared parser script test, adopter suites, runner unit suite |

### Overview
The shared package gains two modules and exports them from its index. Adoption replaces each caller's fence-splitting with the shared call while keeping the caller's key mapping and fallbacks. The runner gains a post-run step that shells out to the CLI's two generators for the spec folder.
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
One home, many callers, honest edges: adopt where an import path exists, record where it does not.

### Key Components
- **`parseFrontmatter` / `stringifyFrontmatter`** in `shared/frontmatter`.
- **`canonicalizeExistingPrefix` / `isPathInsideRoot` / `assertPathInsideRoot`** in `shared/utils/path-containment.ts`, re-exported by the CLI.
- **Post-run refresh** in `fanout-run.cjs`: command list built from the runner's own repo-root resolution; ledger events `metadata_refresh_ok`, `metadata_refresh_failed`, `metadata_refresh_skipped`.

### Data Flow
Caller → shared parser → frontmatter object and body. Run ends → orchestration summary written → generators run for the spec folder → metadata current.
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
| Script | Parser edge cases and round-trip | `npx tsx shared/frontmatter/parse-frontmatter.test.ts` |
| Unit | Adopted callers | eleven CLI suites, three runtime suites, advisor harvest and scorer suites |
| Unit | Runner refresh commands and flag | `tests/unit/fanout-run.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `js-yaml`, already hoisted in the workspace | Internal | Present; lockfile up to date | The parser reuses it; no install |
| A dependency edge from deep-loop and sk-doc to `@spec-kit/shared` | Internal | Absent | Their adoption waits for a packet that adds the edge |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an adopted caller changes behavior on real documents.
- **Procedure**: revert the feature commit; callers return to their local parsers and the runner drops the post-run step.
<!-- /ANCHOR:rollback -->

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
