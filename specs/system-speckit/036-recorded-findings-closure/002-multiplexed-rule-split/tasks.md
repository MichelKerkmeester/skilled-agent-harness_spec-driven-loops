---
title: "Tasks: Phase 2: multiplexed-rule-split"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "canonical save split tasks"
  - "registry row verification checklist"
  - "orchestrator special case removal task"
  - "shared helper extraction steps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: multiplexed-rule-split

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

- [x] T001 Read `check-canonical-save-helper.cjs` fully and mark the exact line ranges of the shared section (1-117) and each of the five switch cases (118-226) (`cli/rules/check-canonical-save-helper.cjs`)
- [x] T002 Read `orchestrator.ts`'s `REGISTRY_SHELL_RULE_WRAPPER` and confirm the plain two-arg `run_check "$folder" "$level"` call shape every non-multiplexed row uses (`lib/validation/orchestrator.ts`)
- [x] T003 [P] Read `canonical-save-validation.vitest.ts` and confirm it only uses `SPECKIT_RULES`, never `SPECKIT_CANONICAL_SAVE_RULE`, so it needs no edit (`cli/tests/canonical-save-validation.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `check-canonical-save-shared.cjs` with the extracted helpers and constants (`cli/rules/check-canonical-save-shared.cjs`)
- [x] T005 [P] Create `check-canonical-save-root-spec.sh` and `.cjs` for `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` (`cli/rules/check-canonical-save-root-spec.sh`)
- [x] T006 [P] Create `check-canonical-save-source-docs.sh` and `.cjs` for `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED` (`cli/rules/check-canonical-save-source-docs.sh`)
- [x] T007 [P] Create `check-canonical-save-lineage.sh` and `.cjs` for `CANONICAL_SAVE_LINEAGE_REQUIRED`, carrying the grandfathering-cutoff constant (`cli/rules/check-canonical-save-lineage.sh`)
- [x] T008 [P] Create `check-canonical-save-packet-identity.sh` and `.cjs` for `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` (`cli/rules/check-canonical-save-packet-identity.sh`)
- [x] T009 [P] Create `check-canonical-save-description-graph-freshness.sh` and `.cjs` for `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`, carrying the freshness-slack constant (`cli/rules/check-canonical-save-description-graph-freshness.sh`)
- [x] T010 Update `validator-registry.json`'s five `CANONICAL_SAVE_*` rows to point at their own new script (`cli/lib/validator-registry.json`)
- [x] T011 Remove the `check-canonical-save.sh` basename special case from `orchestrator.ts` (`lib/validation/orchestrator.ts`)
- [x] T012 Delete `check-canonical-save.sh` and `check-canonical-save-helper.cjs` (`cli/rules/check-canonical-save.sh`, `cli/rules/check-canonical-save-helper.cjs`)
- [x] T013 Update `cli/rules/README.md`'s file tree and rule-description table (`cli/rules/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `validate-runs-every-registry-rule.vitest.ts` (`cli/tests/validate-runs-every-registry-rule.vitest.ts`)
- [x] T015 Run `canonical-save-validation.vitest.ts` and confirm every assertion still passes unmodified (`cli/tests/canonical-save-validation.vitest.ts`)
- [x] T016 Run `validate-help-lists-every-rule.vitest.ts` and `validator-registry-doc-count.vitest.ts` to confirm the rule count and help output are unchanged (`cli/tests/validate-help-lists-every-rule.vitest.ts`, `cli/tests/validator-registry-doc-count.vitest.ts`)
- [x] T017 Diff `validator-registry.json`'s five `script_path` values against each other to confirm no duplicate remains (`cli/lib/validator-registry.json`)
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
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists the requirements]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md names the shared module, the five rule modules and their wrappers]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: the registry, the orchestrator and the canonical-save suite resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `node --check` on six modules and `bash -n` on five wrappers exit 0; runtime and CLI builds exit 0; `npm run check` passes]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: dist freshness reports every output fresh]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: each wrapper fails closed with a named status when its module is missing or emits no message]]` fail path]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: each wrapper follows the Rule, Severity and Description header block and the two-argument run_check the orchestrator calls]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: `validate.sh --help` lists 41 rule lines and 5 canonical-save rows, unchanged]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: a missing module and an empty bridge output are handled by the wrappers; the not-applicable branches of each rule keep their pass messages]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: the validation lane passes 98, 31 and 83 checks with the split in place]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: class-of-bug: one script served five registry rows through a switch]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: grep for the old script and helper names returns only the registry, the orchestrator and the README before the change, all updated]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: the five rows, the orchestrator wrapper and the README are the consumers; canonical-save-validation.vitest.ts runs through SPECKIT_RULES and needed no edit]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: no parser or path fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: five rows by one script each]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the rules read only SPECKIT_CANONICAL_SAVE_CUTOFF and the slack variable through the shared module, as before]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md names the commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secret in the diff]?key|secret" cli/rules/check-canonical-save-*` returns nothing new]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: each module reads its folder from argv and fails closed on missing JSON as the helper did]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan and tasks name the same files]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the shared module and each rule module carry a header stating why the context is built once]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: rules/README.md tree and table list the five wrappers and the shared module]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray file in this packet]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
