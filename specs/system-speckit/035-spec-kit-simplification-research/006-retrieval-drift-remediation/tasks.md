---
title: "Tasks: Retrieval drift remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval remediation tasks"
  - "exclusion record tasks"
  - "retrofit move tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retrieval drift remediation

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

- [x] T001 Reproduce every P1 and P2 row of the research synthesis in the main checkout (../001-ripgrep-search-system/research/confirmed-findings.md)
- [x] T002 Read the exact text of every site to edit and the manifest hash inputs (.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs)
- [x] T003 [P] Confirm the working vitest invocation from the CLI package (.opencode/skills/system-spec-kit/runtime/cli)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the lane description, availability note, ranking classes, single-token rule and coverage rows (.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md)
- [x] T005 Make the router recipe identical to section 2.1 and list five match classes (.opencode/commands/speckit/search.md, .opencode/commands/speckit/assets/search-presentation.txt)
- [x] T006 Add the committed-pair signal, its comparison activity and the optional latency activity (.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml)
- [x] T007 Record `dist` in the manifest exclusion list and state that the list is manifest identity (.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs)
- [x] T008 Declare `dist` as the index-only divergence and assert the exclusion record (.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts)
- [x] T009 Move the retrofit pipeline and repoint its imports and importers (.opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs)
- [x] T010 Correct both retrieval READMEs, the ops README, the grep-convention reference and the lookup header (.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md)
- [x] T011 Name the doctor as the verifier in the maintenance row (AGENTS.md)
- [x] T012 Regenerate the index, manifest, diagnostics and variants in one run (.opencode/skills/system-spec-kit/runtime/data/trigger-index.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the seven retrieval suites from the CLI package with the README invocation (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T014 Run `npm run check` and the dist freshness check (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T015 Search for the old retrofit path and for the removed prose outside specs and changelogs (.opencode)
- [x] T016 Run strict validation on this child and the parent, regenerate metadata, close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - `npm run check` exit 0, zero import-policy violations
- [x] CHK-011 [P0] No console errors or warnings - generator run reported zero malformed documents
- [x] CHK-012 [P1] Error handling implemented - the doctor classifies a split pair instead of a missing index
- [x] CHK-013 [P1] Code follows project patterns - the relocated module keeps its header and divider style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Seven retrieval suites pass, 221 tests
- [x] CHK-022 [P1] Edge cases tested - the parity suite fails when `dist` leaves either set
- [x] CHK-023 [P1] Error scenarios validated - a fresh build was diffed against the committed index before the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable; no such fix in scope
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - not applicable; nothing reads process state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - unchanged; the lookup keeps its exit-code contract
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
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

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
