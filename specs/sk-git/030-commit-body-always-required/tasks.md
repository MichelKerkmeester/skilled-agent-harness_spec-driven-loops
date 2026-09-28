---
title: "Tasks: Require a commit body on every authored commit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Require a commit body on every authored commit

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

- [x] T001 Record baselines for the hook and sk-git suites (`scratchpad/base-*.test.sh.out`)
- [x] T002 Capture the negative control on real commits before the edit (`scratchpad/negctl-before.txt`)
- [x] T003 [P] Inventory every caller that commits subject-only under the global hooks
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the staged-file count and require a body on every authored commit (`.skilled/scripts/git-hooks/commit-msg`)
- [x] T005 Add commit-msg cases 18 to 20 and reword the case 4 header (`.skilled/scripts/git-hooks/tests/commit-msg.test.sh`)
- [x] T006 Give the both-hooks fixture commit a body (`.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh`)
- [x] T007 State the rule in `SKILL.md` section 6 and drop the four-path threshold (`.skilled/skills/sk-git/SKILL.md`)
- [x] T008 [P] Align the references, template, catalog page and playbook scenarios GIT-004 and GIT-044 (`.skilled/skills/sk-git/`)
- [x] T009 [P] Add a body to every doc example that commits (`references/`, `assets/`)
- [x] T010 [P] Fix the callers outside sk-git: deep-loop checkpoint YAMLs, installer, runbooks (`.skilled/`)
- [x] T011 Fix the Sync Loop expiry proof fixture (`AI Systems/z — Claude Project Sync Loop/prove_review_expiry.py`)
- [x] T012 Write the release entry and bump the skill to `1.7.0.0` (`.skilled/skills/sk-git/changelog/v1.7.0.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the hook and sk-git suites against the baselines and read the delta
- [x] T014 Capture the negative control after the edit and compare (`scratchpad/negctl-after.txt`)
- [x] T015 Run the changelog validator, the HVR scan and the frontmatter version gate
- [x] T016 Run `validate.sh --strict` on this packet and read `RESULT: PASSED`
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

- [x] CHK-010 [P0] Code passes lint/format checks. `bash -n` is clean on the hook and both edited tests.
- [x] CHK-011 [P0] No console errors or warnings. The three suites that run the hook print no unexpected output.
- [x] CHK-012 [P1] Error handling implemented. A refused commit prints one error that names the rule and the bypass.
- [x] CHK-013 [P1] Code follows project patterns. The check reuses the existing `HAS_EXPLANATORY_BODY` flag.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. See `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. Negative control on real commits: subject-only and trailer-only accepted before, refused after.
- [x] CHK-022 [P1] Edge cases tested. Blank-only and whitespace-only bodies are refused, a real body after blank lines passes.
- [x] CHK-023 [P1] Error scenarios validated. Git-generated subjects pass with no body.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` and `cross-consumer`. One rule was stated in the hook, the skill, five doc places and the callers.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Subject-only `git commit -m` commands were found by `rg` in sk-git and outside it, and each one was fixed or judged documented-not-executed.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the hook, the tests, the docs and the callers listed in `plan.md`.
- [x] CHK-FIX-004 [P0] Adversarial cases cover subject-only, trailer-only, blank-only, whitespace-only and Git-generated subjects.
- [x] CHK-FIX-005 [P1] Matrix axes: message shape (subject-only, trailer-only, blank-only, with body, Git-generated) by path count (one, four or more).
- [x] CHK-FIX-006 [P1] Hostile env variant executed. The bypass runs in a subshell so it cannot leak, and a direct run shows exit 0 with it and exit 1 without.
- [x] CHK-FIX-007 [P1] Evidence is pinned to this packet's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. A scan of the added lines found none.
- [x] CHK-031 [P0] Input validation implemented. The hook validates the message before Git accepts it.
- [x] CHK-032 [P1] Auth/authz working correctly. Not applicable, the change has no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The two edited test headers explain the rule and name no packet.
- [x] CHK-042 [P2] README updated. `scripts/git-hooks/tests/README.md` and the skill `README.md` version.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Session temp files live in the session scratchpad, outside the repo.
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-28
<!-- /ANCHOR:summary -->

---
