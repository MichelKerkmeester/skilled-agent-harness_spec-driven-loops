---
title: "Tasks: Phase 1: Production Database Isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "production db isolation tasks"
  - "ProductionDatabaseResolutionError refusal"
  - "fail closed isTestContext refusal"
  - "config setupFiles reconciled"
  - "production-db-isolation.vitest.ts suite"
  - "negative control named error"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Production Database Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Answer the resolver-wide vs test-scoped question — chose test-scoped: the refusal is gated on `isTestContext()` (VITEST / NODE_ENV=test / SPECKIT_TEST), so production callers are unaffected
- [x] T002 Grep for callers depending on the root config globs — callers exist, so the config was repaired rather than deleted
- [x] T003 Pre-fix negative control captured — a `scripts/`-rooted run resolved `mcp-server/database`, the production directory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Configs reconciled — the root config now shares the same `setupFiles` as the mcp-server config
- [x] T005 Fail-closed refusal added — `ProductionDatabaseResolutionError`, thrown on a realpath match against the production dir in a test context
- [x] T006 [P] Config-drift check added — proven non-vacuous: reverting the config fix makes it fail and names the unguarded config; restoring makes it pass
- [x] T007 [P] Negative-control test added — `tests/production-db-isolation.vitest.ts`, 3 tests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Negative control re-run — now fails closed with the named error instead of resolving production
- [x] T009 All three working directories resolve a throwaway dir under the system temp root
- [ ] T010 [B] Full-suite baseline — DEFERRED by decision: the suite has ~56 unrelated failures and has hung repeatedly; bounding it is phase 003's scope, so a suite delta is not an acceptance criterion here
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` except the deliberately deferred T010
- [x] The one `[B]` task is a recorded scope deferral, not a blocker
- [x] Negative control reproduced before the fix and failing closed after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
