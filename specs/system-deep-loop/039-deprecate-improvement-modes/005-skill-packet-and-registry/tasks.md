---
title: "Tasks: Phase 5: skill-packet-and-registry"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill packet and registry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: skill-packet-and-registry

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Fix the file list (`scratch/files.txt`)
- [x] T002 Write the work-unit briefs (`scratch/brief-*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 WU1: Move the changelog out, delete the packet and `leaf-scopes.json` (`scratch/brief-wu1.md`)
- [x] T004 WU2: Registry, router, metadata and rollout JSON; regenerate the leaf manifest (`scratch/brief-wu2.md`)
- [x] T005 WU3: Compiled-routing compiler, canary router comment and canary cases (`scratch/brief-wu3.md`)
- [x] T006 WU4: Hub SKILL, README, ARCHITECTURE, ROUTER, sibling and shared READMEs (`scratch/brief-wu4.md`)
- [x] T007 WU5: Feature catalog and manual-testing playbook (`scratch/brief-wu5.md`)
- [x] T008a Orchestrator: refresh the `system-deep-loop` activation manifest with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub system-deep-loop --skill-root .skilled/skills/system-deep-loop`, after `freshness` reports it stale
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Leaf-manifest `--check` exits 0
- [x] T009 Compiled-route guard matches baseline
- [x] T010 Router-sync guard matches baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Checks match or beat the baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-003 in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §1
- [x] CHK-003 [P1] Dependencies identified and available — Leaf-manifest generator and compiled-route tools present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Compiler loads with `node -e require`; all JSON parses
- [x] CHK-011 [P0] No console errors or warnings — Guard and generators print no warnings
- [x] CHK-012 [P1] Error handling implemented — N/A: invariant removed, no new error path
- [x] CHK-013 [P1] Code follows project patterns — Generators used instead of hand edits for derived files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-003 Met
- [x] CHK-021 [P0] Manual testing complete — Orchestrator reran guard, bin vitest, router sync and supplementary checks
- [x] CHK-022 [P1] Edge cases tested — Leftover phrase and playbook line found and fixed
- [x] CHK-023 [P1] Error scenarios validated — Freshness `compile-error` traced to `ROUTER.md` and cleared by unit 4
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — cross-consumer: registry feeds router, compiler, advisor and docs
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Hub-wide search outside runtime and history
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Compiler, canaries, activation manifest, leaf manifest and docs updated
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Snapshot `87c38cc7f` to tree `6bfe76e9e`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets
- [x] CHK-031 [P0] Input validation implemented — N/A
- [x] CHK-032 [P1] Auth/authz working correctly — N/A
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — Canary-router comment reworded without the removed mode
- [x] CHK-042 [P2] README updated (if applicable) — Hub README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Briefs in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only briefs and the file list
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---



