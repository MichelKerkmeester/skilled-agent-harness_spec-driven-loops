---
title: "Verification Checklist: codex Write-Containment Guard"
description: "Verification evidence for the codex post-dispatch write-containment guard."
trigger_phrases:
  - "verification"
  - "checklist"
  - "codex write containment"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: codex Write-Containment Guard

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

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
  - **Evidence**: spec.md §4 lists REQ-001..REQ-009 with acceptance criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md §3 documents helper API, integration, safety invariants
- [x] CHK-003 [P0] Part B (sandbox scoping) viability probed
  - **Evidence**: Live codex probe (spec.md §6) showed `-C <artifactDir>` does NOT contain writes; Part B not applied

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Modified worker passes syntax check
  - **Evidence**: `node --check runtime/scripts/fanout-run.cjs` exits 0
- [x] CHK-011 [P0] Comment hygiene: no spec paths / packet ids / task ids in code comments
  - **Evidence**: Helper and integrations carry durable WHY only
- [x] CHK-012 [P1] Helper fails open (never blocks the loop when it cannot reason about git)
  - **Evidence**: snapshot returns [] on git error / non-worktree artifact dir

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Case (a): in-artifact write passes (no false violation)
  - **Evidence**: `write-containment.vitest.ts` "in-artifact write" → 0 violations
- [x] CHK-021 [P0] Case (b): out-of-artifact tracked modification detected, reverted, fails
  - **Evidence**: `write-containment.vitest.ts` "out-of-artifact tracked modification" → 1 violation, file restored to HEAD content
- [x] CHK-022 [P0] Case (c): pre-existing out-of-scope dirty file NOT touched
  - **Evidence**: `write-containment.vitest.ts` "pre-existing dirty excluded" → only the new path is a violation; pre-existing dirty file content preserved
- [x] CHK-023 [P1] Existing fanout cli-codex adapter tests still pass (guard auto-skips)
  - **Evidence**: fanout-run.vitest.ts 72/72 pass; helper no-ops when artifact dir is outside the git worktree

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Root cause addressed structurally, not just by prompt
  - **Evidence**: codex `workspace-write` has no write sub-scoping (probe §6); the post-dispatch git diff + revert is the structural fix
- [x] CHK-031 [P0] Regression that originally failed (out-of-scope deletion) is now caught + reverted
  - **Evidence**: detect → revert (checkout HEAD) restores deleted tracked file to ORIGINAL content (case b "deletion")

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Revert is scoped, never blanket
  - **Evidence**: tracked → `git checkout HEAD -- <path>`; untracked → scoped removal of the specific path; no `git clean`
- [x] CHK-041 [P0] `containment_violation` event appended to the loop state log
  - **Evidence**: helper emits JSONL `{type:'event', event:'containment_violation', severity:'error', ...}`

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the implemented design
- [x] CHK-051 [P1] Part B non-application documented with evidence
  - **Evidence**: spec.md §6 + implementation-summary.md

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All changes within the allowed write paths
  - **Evidence**: helper under `lib/deep-loop/`; tests under `tests/unit/`; the 4 dispatch sites only
- [x] CHK-061 [P1] No files created or modified outside the allowed set
  - **Evidence**: spec folder + 4 dispatch sites + helper + test only

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 4 | 4/4 |

**Verification Date**: 2026-07-22

<!-- /ANCHOR:summary -->
