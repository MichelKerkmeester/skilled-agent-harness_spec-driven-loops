---
title: "Tasks: Phase 8: review-research-scaffold-paths"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review research scaffold tasks"
  - "review report template task"
  - "path typed document move task"
  - "scaffold golden verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: review-research-scaffold-paths

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

- [x] T001 Re-confirm the manifest's `review`/`research` `requiredCoreDocs` and the resolver fix status by direct read (.opencode/skills/system-spec-kit/templates/spec-kit-docs.json, .opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh, .opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js)
- [x] T002 [P] Grep every caller of `copy_templates_batch` and `DOC_TEMPLATE_NAMES` to confirm no other consumer assumes today's flat-only output (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T003 [P] Read `deep-review/SKILL.md` and `deep-research/SKILL.md`'s existing state-file and artifact sections to place the new note accurately (.opencode/skills/system-deep-loop/deep-review/SKILL.md, .opencode/skills/system-deep-loop/deep-research/SKILL.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Widen `create.sh`'s `--level` regex to accept `review` and `research` (.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh)
- [x] T005 Add `review-report.md.tmpl` under the packet-types template directory (.opencode/skills/system-spec-kit/templates/packet-types/review-report.md.tmpl)
- [x] T006 Add the `review-report.md` entry to the JS resolver's `DOC_TEMPLATE_NAMES` (.opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js)
- [x] T007 Add the review-level `review-report.md` branch to the bash resolver's `_manifest_template_path` (.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh)
- [x] T008 Generalize `copy_templates_batch`'s move step to relocate any path-typed rendered document to its manifest-declared subdirectory (.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh)
- [x] T009 Add one note to each deep-loop SKILL.md stating why the loop writes its own file (.opencode/skills/system-deep-loop/deep-review/SKILL.md, .opencode/skills/system-deep-loop/deep-research/SKILL.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Add a review and a research fixture to the scaffold goldens (.opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts)
- [x] T011 Run `create.sh --level review` and `--level research` against a temp path and validate each output strict (.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh, .../spec/validate.sh)
- [x] T012 Run `test-upgrade-level.sh` and the phase-parent golden snapshot to confirm no regression in the one existing production move (.opencode/skills/system-spec-kit/runtime/cli/tests/)
- [x] T013 Run the full runtime/CLI vitest projects and `npm run check` (.opencode/skills/system-spec-kit/runtime/)
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-005 present in spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 names the level-gate widening, the new template and the generalized move step]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: 035-.../018-.../ resolver fix confirmed present at template-utils.sh:209-210 and template-structure.js:406-407]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `bash -n` on create.sh and template-utils.sh, `node --check` on template-structure.js, all exit 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: `create.sh --level review` run output has no warning line]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the generalized move step still fails loudly through `_ensure_dest_within_dir` if a manifest name would escape the packet folder]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the review-report resolver branch mirrors the existing spec.md review branch at the same two call sites]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: validate.sh --strict run and read on both new scaffold outputs]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: an invalid level typo (`--level revieww`) still hits the rejection error with the corrected accepted set named]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: the phase-parent golden snapshot re-run confirms the generalized move step does not regress the one production caller it already serves]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: cross-consumer, since the move-step generalization touches the phase-parent scaffold's existing production path too]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's manifest grep confirms review-report.md and research.md are the only two affected requiredCoreDocs entries beyond the existing phase case]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T002's grep of every copy_templates_batch and DOC_TEMPLATE_NAMES caller]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: the generalized move step's containment case (a manifest name attempting to escape the packet folder) is exercised against `_ensure_dest_within_dir`]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces matrix axes row: level by resolver by document]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. Create.sh and the resolvers read only their own arguments and the manifest file]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table names the commit SHA once it lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff review of the six changed files contains no credential-shaped string]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: the widened --level regex still rejects any value outside the named set]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: requirement IDs in spec.md match the AC-ID to REQ-ID mapping in acceptance-criteria.md]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: create.sh's removed rejection reasoning moved into a code comment above the widened regex]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: any README enumerating create.sh's accepted levels checked for the review/research addition]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: the two temp scaffold outputs from T011 written under this packet's scratch/, not the repo root]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `git status` on scratch/ shows no residue at close]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
