---
title: "Tasks: Document the owning runner for the dispatch adapter vitest suites"
description: "Reproduce both recorded failures, write the right runner into the two dispatch READMEs, and verify every suite and command from the final state."
trigger_phrases:
  - "dispatch adapter test repair tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Document the owning runner for the dispatch adapter vitest suites

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

- [x] T001 Reproduce both failures under the runners that produced them (`scratch/baseline/wrong-runner-codex.txt`, `wrong-runner-pi.txt`)
- [x] T002 Run both suites under `.skilled/hooks/vitest.config.ts`: Pi 38 and codex 5 passed (`scratch/baseline/pi-preflight.txt`, `codex-shell.txt`)
- [x] T003 Trace the Pi import through git history: commit 79dc898562 added the link-relative `hook-flags.mjs` import, commit c7b71c996e moved it to `.skilled`, and `.pi/extensions/README.md:16` documents the link base as the contract
- [x] T004 Capture the baseline for the adapter, guard and shared hook suites (`scratch/suites-before.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the adapter suite command and the reason the plain runners fail to section 8 (`.skilled/hooks/dispatch/README.md`)
- [x] T006 Name the Pi import exception in section 7 and the test files in the section 4 tree (`.skilled/hooks/dispatch/README.md`)
- [x] T007 Widen the hub validation command to all three adapter suites (`.skilled/hooks/README.md`)
- [x] T008 Call the pinned `.skilled/node_modules/.bin/vitest` in every vitest command in both READMEs, after Luna found that root-level `npx` runs a different copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every suite from the final state (`scratch/suites-after.txt`)
- [x] T010 Run each command in both README validation sections as written from the worktree root
- [x] T011 Luna review to PASS (`scratch/review/luna-1.txt` to `luna-4.txt`)
- [x] T012 `validate.sh --strict` on this packet
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 1 and 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `.skilled/node_modules/.bin/vitest --version` reports 5.0.3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: no code changed. Luna ran `git diff --check -- .skilled/hooks/`, exit 0.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: every target suite exits 0 (`scratch/suites-after.txt`).
- [x] CHK-012 [P1] Error handling implemented. Evidence: not applicable, docs only.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the commands follow the existing validation blocks' form.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, 4 of 4 Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: T010, every README vitest and `node --test` command exits 0.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a vitest run without `--config` passes the codex and directive-dedup files and fails only the Pi preflight file, as the README says.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: both wrong-runner failures are reproduced in `scratch/after/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: both failures are `matrix/evidence` (wrong runner), and Luna's npx finding is `class-of-bug` (every root-level `npx vitest` line).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `grep -n "npx vitest"` over both READMEs returns 0 lines.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: no code or test symbol changed, so the READMEs are the only consumers.
- [x] CHK-FIX-004 [P0] Adversarial table tests. Evidence: not applicable. No parser, path or security code changed.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: runner (`node --test`, vitest without config, vitest with the hooks config) by suite (codex, Pi preflight, directive-dedup), each cell observed.
- [x] CHK-FIX-006 [P1] Hostile env variant. Evidence: not applicable, no process-wide state read by changed code.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA. Evidence: the commit that lands this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a secret-pattern grep over the packet returns nothing.
- [x] CHK-031 [P0] Input validation implemented. Evidence: not applicable, docs only.
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: the guard adapters are unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same two README files and the same root cause.
- [x] CHK-041 [P1] Code comments adequate. Evidence: no code changed.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `git diff .skilled/hooks/`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the suite outputs, briefs and reviews live in `scratch/`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch keeps only the cited evidence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
