---
title: "Tasks: Template seams and sentinel repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "seams repair tasks"
  - "sentinel tasks"
  - "runtime suite repair tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Template seams and sentinel repair

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

- [x] T001 Census every round-two row in the main checkout and trace the sentinel finding to three of the runtime failures (../004-template-system-and-acceptance-criteria/research/confirmed-findings.md)
- [x] T002 Read the sentinel's gate, both continuity sets, the sharded block, the helper's callers and every document line the rows cite (.opencode/skills/system-spec-kit)
- [x] T003 [P] Read each failing runtime suite's fixture builder and the code it exercises (.opencode/skills/system-spec-kit/runtime/tests)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Gate the sentinel on the tasks verification section (.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs)
- [x] T005 Export one continuity set, collect optional add-ons, enforce goal anchors, fix the freeform comment (.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts)
- [x] T006 Remove the sharded flag; resolve templates by basename; widen the upgrade set; require a path in evidence; add the closure document to the ToC rule; give the template-source rule its own document list (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T007 Remove the taxonomy and the stress-test templates; qualify the closure trigger; correct the extension guide, templates README, three reference guides, both READMEs, SKILL.md and the playbook (.opencode/skills/system-spec-kit/templates)
- [x] T008 Add the goal golden and scaffold case and the packet-type parity pin (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T009 Retro-cite child 010's criteria (../010-template-contract-alignment/acceptance-criteria.md)
- [x] T010 Repair the seven runtime suites at their own faults and add the runtime project to the CI workflow (.opencode/skills/system-spec-kit/runtime/tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rebuild the runtime and the CLI, run the check gate and dist freshness (.opencode/skills/system-spec-kit)
- [x] T012 Run the full runtime and CLI projects and the legacy and validation lanes (.opencode/skills/system-spec-kit/runtime)
- [x] T013 Validate the program recursively and three older packets; run the sk-doc validator on touched documents; regenerate metadata (../spec.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` on five scripts, `node --check` on two modules, both builds exit 0, `npm run check` exit 0
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every output fresh
- [x] CHK-012 [P1] Error handling implemented - the sentinel falls back to the summary stat on any read failure
- [x] CHK-013 [P1] Code follows project patterns - the helper gains a second command instead of changing the first's meaning
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The runtime and CLI projects, the legacy and validation lanes pass
- [x] CHK-022 [P1] Edge cases tested - a tasks document without the section, an unreadable tasks document, a sibling packet that exists but is not a child
- [x] CHK-023 [P1] Error scenarios validated - widening the required-document list failed three older packets and was reversed into a separate list
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - the council suite keeps its out-of-scope rejection case
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - the council suite sets and restores the authorized-roots variable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - the evidence pattern now requires a path-like token
- [x] CHK-032 [P1] Auth/authz working correctly - the council writers still refuse unauthorized roots
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
