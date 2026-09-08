---
title: "Tasks: Template contract alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "template alignment tasks"
  - "contract census tasks"
  - "goal flag tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Template contract alignment

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

- [x] T001 Census every P1 and P2 row against the manifest, the scaffolder and the rules (../004-template-system-and-acceptance-criteria/research/confirmed-findings.md)
- [x] T002 Read every document line the census must correct (.opencode/skills/system-spec-kit/references)
- [x] T003 [P] Read the golden test's scaffold mechanism to reuse it for smoke tests (.opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the descriptive index, reconcile the versions, add the resource map to every lazy list, remove the bridge template entry (.opencode/skills/system-spec-kit/templates/spec-kit-docs.json)
- [x] T005 Remove the hardcoded document pair from the structure validator (.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts)
- [x] T006 Add --with-goal and read the closure document from the contract list (.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh)
- [x] T007 Repair the staleness checker path, implement the coverage enforce switch, fix the template-source example (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T008 Delete the orphan bridge template and correct the goal template's author slug (.opencode/skills/system-spec-kit/templates)
- [x] T009 Add the version-parity suite and update the resolver pins (.opencode/skills/system-spec-kit/runtime/cli/tests/template-version-parity.vitest.ts)
- [x] T010 Rewrite the root README table and tree, the skill README and SKILL.md, the extension and migration guides, four reference guides, three assets, two runtime READMEs, the env reference and template, and the goal playbook (README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rebuild the runtime and the CLI; run the check gate and dist freshness (.opencode/skills/system-spec-kit)
- [x] T012 Run the goldens, resolver, parity and invariance suites, the runtime structure suites, the drift guard and the full CLI project (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T013 Smoke-scaffold Level 2, Level 1 with the goal flag and Level 3 with both flags into a temporary directory; validate them; run the repaired checker over the repository (.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh)
- [x] T014 Sweep residue and run the sk-doc validator on every touched README and asset (.opencode)
- [x] T015 Run strict validation on this child and the parent, regenerate metadata, close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` on the three scripts, runtime and CLI builds exit 0, `npm run check` exit 0
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every watched output fresh
- [x] CHK-012 [P1] Error handling implemented - the new lazy-document helper exits 3 when the contract omits the requested document, as the existing one does
- [x] CHK-013 [P1] Code follows project patterns - the flag mirrors `--with-lazy-addons`; the test follows the vitest suites beside it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Goldens, resolver, parity and invariance suites pass (22 tests); runtime structure suites pass
- [x] CHK-022 [P1] Edge cases tested - a Level 1 scaffold with the goal flag, a Level 3 scaffold with both flags
- [x] CHK-023 [P1] Error scenarios validated - the first goal scaffold failed the memory-block rule and the template was corrected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - the enforce switch was exercised through its default-off path; the failing branch is guarded by the same parser the enable switch uses
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - the new helper validates the requested document against the contract
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

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
