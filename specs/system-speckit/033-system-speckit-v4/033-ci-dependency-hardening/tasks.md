---
title: "Tasks: Harden CI mirror parity at commit time and remediate Dependabot alerts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mirror gate tasks"
  - "dependabot tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Harden CI mirror parity at commit time and remediate Dependabot alerts

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
## Phase 1: Diagnose

- [x] T001 Read the fifteen red Spec-Kit Check runs and group them by failing step (`gh run list`, `gh run view --log-failed`)
- [x] T002 Compare the six checks CI runs against the one the hook ran (`.github/workflows/spec-kit-check.yml`, `.opencode/scripts/git-hooks/pre-commit`)
- [x] T003 [P] Group the open Dependabot alerts by manifest and confirm which manifests are installed (`gh api .../dependabot/alerts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the single prompt-mirror gate with the six-check gate and the unstaged-output scan (`.opencode/scripts/git-hooks/pre-commit`)
- [x] T005 Add mirror sources and outputs to both trigger blocks (`.github/workflows/spec-kit-check.yml`)
- [x] T006 Repair the command catalog and the design hub metadata for the moved chart and diagram commands (`.opencode/commands/README.txt`, `.opencode/skills/sk-design/command-metadata.json`)
- [x] T007 [P] Lockfile-only audit fix in the four installed packages (`package-lock.json`, `.opencode/package-lock.json`, two `mcp-server/package-lock.json`)
- [x] T008 [P] Dismiss the eighteen alerts on the retired `uv.lock` and the six on the vendored research snapshot, each with a reopening condition
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Four-shape hook harness with array-safe paths: clean passes, the other three block (`scratch/` residue cleaned)
- [x] T010 Reinstall each bumped package and run the advisor vitest suite, with the HEAD lockfile as negative control
- [x] T011 Push to both branches and confirm Spec-Kit Check green on each
- [x] T012 Author this packet and validate it strict
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

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` on the hook, YAML parsed with ten paths per block
- [x] CHK-011 [P0] No console errors or warnings - six checks exit 0 on a clean tree
- [x] CHK-012 [P1] Error handling implemented - a check that errors blocks, not only one that reports drift
- [x] CHK-013 [P1] Code follows project patterns - gate tag `[gate:mirror-parity]` matches the hook's other gates
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete - four-shape harness
- [x] CHK-022 [P1] Edge cases tested - flat Cursor mirror name, missing check script, partial staging
- [x] CHK-023 [P1] Error scenarios validated - catalog drift message matches CI's verbatim
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` - one of six checks gated, one of many trigger paths listed
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the workflow's mirror step names all six checks, all six now in the hook
- [x] CHK-FIX-003 [P0] Consumer inventory: no symbol changed; the hook is the only consumer of the check list
- [x] CHK-FIX-004 [P0] Adversarial table: not applicable, no path, parser, redaction or security logic
- [x] CHK-FIX-005 [P1] Matrix: 4 shapes × pass/block = 4 rows, all executed
- [x] CHK-FIX-006 [P1] Hostile env variant: harness run under zsh, hook under bash; array iteration agrees in both
- [x] CHK-FIX-007 [P1] Evidence pinned to `328accca03`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - check scripts skipped only when absent from the checkout
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate - hook and workflow comments carry the why, no artifact ids
- [x] CHK-042 [P2] README updated - `.opencode/commands/README.txt` catalog rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - harness output went to the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
