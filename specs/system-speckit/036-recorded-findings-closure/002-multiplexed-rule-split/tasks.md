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

- [ ] T001 Read `check-canonical-save-helper.cjs` fully and mark the exact line ranges of the shared section (1-117) and each of the five switch cases (118-226) (`cli/rules/check-canonical-save-helper.cjs`)
- [ ] T002 Read `orchestrator.ts`'s `REGISTRY_SHELL_RULE_WRAPPER` and confirm the plain two-arg `run_check "$folder" "$level"` call shape every non-multiplexed row uses (`lib/validation/orchestrator.ts`)
- [ ] T003 [P] Read `canonical-save-validation.vitest.ts` and confirm it only uses `SPECKIT_RULES`, never `SPECKIT_CANONICAL_SAVE_RULE`, so it needs no edit (`cli/tests/canonical-save-validation.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `check-canonical-save-shared.cjs` with the extracted helpers and constants (`cli/rules/check-canonical-save-shared.cjs`)
- [ ] T005 [P] Create `check-canonical-save-root-spec.sh` and `.cjs` for `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` (`cli/rules/check-canonical-save-root-spec.sh`)
- [ ] T006 [P] Create `check-canonical-save-source-docs.sh` and `.cjs` for `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED` (`cli/rules/check-canonical-save-source-docs.sh`)
- [ ] T007 [P] Create `check-canonical-save-lineage.sh` and `.cjs` for `CANONICAL_SAVE_LINEAGE_REQUIRED`, carrying the grandfathering-cutoff constant (`cli/rules/check-canonical-save-lineage.sh`)
- [ ] T008 [P] Create `check-canonical-save-packet-identity.sh` and `.cjs` for `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` (`cli/rules/check-canonical-save-packet-identity.sh`)
- [ ] T009 [P] Create `check-canonical-save-description-graph-freshness.sh` and `.cjs` for `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`, carrying the freshness-slack constant (`cli/rules/check-canonical-save-description-graph-freshness.sh`)
- [ ] T010 Update `validator-registry.json`'s five `CANONICAL_SAVE_*` rows to point at their own new script (`cli/lib/validator-registry.json`)
- [ ] T011 Remove the `check-canonical-save.sh` basename special case from `orchestrator.ts` (`lib/validation/orchestrator.ts`)
- [ ] T012 Delete `check-canonical-save.sh` and `check-canonical-save-helper.cjs` (`cli/rules/check-canonical-save.sh`, `cli/rules/check-canonical-save-helper.cjs`)
- [ ] T013 Update `cli/rules/README.md`'s file tree and rule-description table (`cli/rules/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run `validate-runs-every-registry-rule.vitest.ts` (`cli/tests/validate-runs-every-registry-rule.vitest.ts`)
- [ ] T015 Run `canonical-save-validation.vitest.ts` and confirm every assertion still passes unmodified (`cli/tests/canonical-save-validation.vitest.ts`)
- [ ] T016 Run `validate-help-lists-every-rule.vitest.ts` and `validator-registry-doc-count.vitest.ts` to confirm the rule count and help output are unchanged (`cli/tests/validate-help-lists-every-rule.vitest.ts`, `cli/tests/validator-registry-doc-count.vitest.ts`)
- [ ] T017 Diff `validator-registry.json`'s five `script_path` values against each other to confirm no duplicate remains (`cli/lib/validator-registry.json`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md sections 3-5 name the shared module, the 5 script pairs and the 4 test suites]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `ls cli/tests/validate-runs-every-registry-rule.vitest.ts cli/tests/canonical-save-validation.vitest.ts` both resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `bash -n` on each new `.sh` file and `node --check` on each new `.cjs` file]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: a dry run of each new script against a scaffolded fixture prints only the expected `rule/status/message` lines]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: each new script's missing-shared-module branch reproduces the old `[[ ! -f ... ]]` fail path]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: each new `.sh` matches the `run_check(folder, level)` shape of the 34 already-1:1 rows]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every AC row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: a manual `validate.sh --strict` run against a scaffolded packet shows all 5 CANONICAL_SAVE_* rows firing individually]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: the not-a-live-packet-root and missing-description.json cases from spec.md's Edge Cases section are exercised]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: a deliberately-missing shared module produces the expected fail status on all 5 new scripts]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: this is a `cross-consumer` change (registry + orchestrator + 5 new files), recorded in plan.md's affected-surfaces table]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: plan.md's `rg -n "CANONICAL_SAVE_"` inventory confirms exactly 5 rows in scope]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: plan.md's affected-surfaces table names every consumer, including the explicitly-unchanged `ts:spec-doc-structure` family]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: this phase moves dispatch logic, it does not touch a path/redaction/parser algorithm. N/A recorded here]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md states the 5 rule ids x 1 new script each matrix]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: `SPECKIT_CANONICAL_SAVE_CUTOFF` and `SPECKIT_CANONICAL_SAVE_FRESHNESS_SLACK_MS` overrides are exercised via the existing test fixtures in canonical-save-validation.vitest.ts]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table pins the commit SHA once implementation lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: `rg -n "sk-|api[_-]?key|secret" cli/rules/check-canonical-save-*` returns nothing new]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: `readJson`'s try/catch-to-null behavior is preserved verbatim in the shared module]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface in a read-only validator rule]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same 11-file scope and the same 4 test suites]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: each new script's header names its single rule id, matching the convention `check-toc-policy.sh` already uses]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `cli/rules/README.md`'s file tree and description table list the 5 new scripts]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray files outside `scratch/` for this packet]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` shows only `.gitkeep` at closure]
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
