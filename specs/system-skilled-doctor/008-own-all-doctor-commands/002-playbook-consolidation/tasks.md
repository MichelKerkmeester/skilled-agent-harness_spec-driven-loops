---
title: "Tasks: Phase 2: playbook-consolidation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "playbook consolidation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: playbook-consolidation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every literal and relative reference to the old folder (repository-wide). Verify: the resolver printed 12 inbound links and the literal grep named every pinned path.
- [x] T002 Draft the merged root (`scratch/merged-root.md`). Verify: `grep -n "^## " scratch/merged-root.md` prints sections 1 to 12.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the category folder (`.skilled/manual-testing-playbook/doctor-commands/`). Verify: `ls .skilled/skills/system-skilled-doctor/manual-testing-playbook/doctor-commands | wc -l` prints 67.
- [x] T004 Replace the skill root and delete the central root (`manual-testing-playbook.md`). Verify: `test -e .skilled/manual-testing-playbook` fails.
- [x] T005 Rewrite the relative links (moved files and inbound links). Verify: the resolver prints `links into old folder: 0; broken links in skill playbook: 0`.
- [x] T006 Swap the allowlist line (`playbook-failclosed-allowlist.txt`). Verify: `git diff -U0` shows one line removed and one added.
- [x] T007 Update the path pins (`playbook-provenance-paths.vitest.ts`, `workflow-invariance.vitest.ts`, the two code-folder manifests). Verify: spec-kit vitest prints `1365 passed | 11 skipped`.
- [x] T008 Reword the central-playbook prose (seven playbook roots, three catalogs, the category README). Verify: `rg -i "central manual testing playbook"` over live docs prints nothing.
- [x] T009 Regenerate the leaf manifests (`system-skilled-doctor/{leaf-manifest,leaf-aliases}.json`). Verify: `ci-skill-root-metadata.cjs --skill system-skilled-doctor` prints `passed=1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the playbook validator (`validate-playbook-package.cjs`). Verify: prints `PASS package=system-skilled-doctor ... scenarios=79 ... violations=0`.
- [x] T011 Run the README tests (`test_readme_verdict_parity.py`, `test_readme_manifest.py`). Verify: parity prints `PARITY PASS`; the manifest test fails only on the three sk-code report folders the primary checkout also lacks.
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

A blocked task is marked `[B]` with the blocker named on its line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the deriver and the advisor build
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The playbook validator reports `violations=0` for the moved package
- [x] CHK-011 [P0] The spec-kit vitest and README parity test pass
- [x] CHK-012 [P1] The resolver reports a link it cannot resolve instead of guessing; it reported none
- [x] CHK-013 [P1] The merged root follows the package contract: one root, category summaries, cross-reference
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Every scenario is indexed once in the merged root
- [x] CHK-022 [P1] Edge case: links that stayed inside the folder were left unchanged
- [x] CHK-023 [P1] Error scenario: the allowlist keeps the moved package fail-closed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, one moved folder with link, test and list consumers.
- [x] CHK-FIX-002 [P0] Same-class inventory: literal grep plus a link resolver over every tracked Markdown file.
- [x] CHK-FIX-003 [P0] Consumer inventory: listed in `plan.md` affected surfaces.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix: 67 moved files by inbound and outbound links, all resolved.
- [x] CHK-FIX-006 [P1] N/A: no test reads new process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree diff on `worktrees/541-own-all-doctor-commands`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] N/A: no input surface changed
- [x] CHK-032 [P1] N/A: no auth surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated: the category README names its new home
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the gate evidence the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 19 | 19/19 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path: `git mv` keeps file history at the new path
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] N/A (NFR-P01): no runtime path changed
- [x] CHK-111 [P1] N/A: no throughput target
- [x] CHK-112 [P2] N/A: no load path
- [x] CHK-113 [P2] N/A: no benchmark applies
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md`
- [x] CHK-121 [P1] The leaf manifests are regenerated for the new files
- [x] CHK-123 [P1] N/A: no runbook
- [x] CHK-124 [P2] N/A: no deployment
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Independent review dispatched to a second model family, read-only
- [x] CHK-131 [P1] N/A: no dependency added
- [x] CHK-132 [P2] N/A: no web surface
- [x] CHK-133 [P2] N/A: no data handling
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] N/A: no API documentation
- [x] CHK-142 [P2] User-facing documentation updated: the other skills' playbook roots point at the new home
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the change | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
