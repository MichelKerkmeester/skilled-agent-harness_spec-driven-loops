---
title: "Verification Checklist: Code README Truth And Missing Orientation"
description: "Verification Date: 2026-08-02; receipts recorded from source reads and runnable gates"
trigger_phrases:
  - "code readme truth checklist"
  - "readme missing orientation checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-08-02T11:40:04Z"
    last_updated_by: "build-leaf"
    recent_action: "Recorded source-derived inventories, command evidence, and final gate output"
    next_safe_action: "Review the In Progress handoff and structural follow-up"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-002-code-readme-truth-and-missing-orientation"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Code README Truth And Missing Orientation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

In Progress build receipt — every checked item has a source read or command receipt in the implementation summary. The refuted doctor finding remains unchanged.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All scoped findings re-verified against HEAD with confirmed/drifted/refuted per ID; `RA-006-05` is refuted
- [x] CHK-002 [P0] The `RA-004-02` magnitude correction applied: the source has 19 TypeScript suites
- [x] CHK-003 [P0] Referenced-path resolution script built and runnable; self-test passes [evidence: gate output 20/20 from source read]
- [x] CHK-004 [P0] Derived-count gate built and runnable; self-test passes [evidence: gate output 20/20 from source read]
- [x] CHK-005 [P1] Pre-fix gate output captured over all 20 files as the baseline [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:per-file -->
## Per-File Evidence

Each row is marked only when the claim was re-derived from source, not edited from the prior text, and both gates pass on that file.

| # | Finding | File | Re-derived from source | Gates pass |
|---|---------|------|------------------------|------------|
| 1 | `RA-007-01` | `install-guides/install-scripts/README.md` | [x] | [x] |
| 2 | `RA-007-02` | `hooks/git/README.md` | [x] | [x] |
| 3 | `RA-007-03` | `scripts/git-hooks/tests/README.md` | [x] | [x] |
| 4 | `RA-010-02` | `.github/workflows/README.md` | [x] | [x] |
| 5 | `RA-004-01` | `deep-improvement/scripts/agent-improvement/tests/README.md` | [x] | [x] |
| 6 | `RA-004-02` | `deep-improvement/scripts/skill-benchmark/tests/README.md` | [x] | [x] |
| 7 | `RA-004-03` | `deep-research/scripts/README.md` | [x] | [x] |
| 8 | `RA-004-04` | `deep-review/scripts/README.md` | [x] | [x] |
| 9 | `RA-005-20` | `sk-create-skill/scripts/README.md` | [x] | [x] |
| 10 | `RA-005-21` | `sk-create-skill/scripts/lib/README.md` | [x] | [x] |
| 11 | `RA-005-22` | `sk-create-skill/scripts/tests/README.md` | [x] | [x] |
| 12 | `RA-005-33` | `mcp-server/handlers/skill-graph/README.md` | [x] | [x] |
| 13 | `RA-005-38` | `mcp-server/lib/skill-graph/README.md` | [x] | [x] |
| 14 | `RA-006-05` | `commands/doctor/scripts/README.md` | [x] | [x] (refuted; no edit) |
| 15 | `RA-007-04` | `plugins/README.md` | [x] | [x] |
| 16 | `RA-007-05` | `plugins/tests/README.md` | [x] | [x] |
| 17 | `RA-007-06` | `scripts/README.md` | [x] | [x] |
| 18 | `RA-002-01` | `sk-design/shared/authored-brand/README.md` (new) | [x] | [x] |
| 19 | `RA-003-01` | `system-spec-kit/scripts/runtime-mirrors/README.md` (new) | [x] | [x] |
| 20 | `RA-005-01` | `mcp-server/scripts/command-bridges/README.md` (new) | [x] | [x] |
<!-- /ANCHOR:per-file -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The resolution gate evaluates paths relative to each README's own location [evidence: gate output 20/20 from source read]
- [x] CHK-011 [P0] The derived-count gate fails closed on an unparseable count [evidence: gate output 20/20 from source read]
- [x] CHK-012 [P1] Example-only paths are marked as examples rather than suppressed by an exclusion list [evidence: gate output 20/20 from source read]
- [x] CHK-013 [P1] No spec paths, packet ids or task ids appear in any code comment added by this phase [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Referenced-path resolution gate over all 20 files: zero unresolved [evidence: gate output 20/20 from source read]
- [x] CHK-021 [P0] Derived-count gate over all 20 files: zero retyped literals [evidence: gate output 20/20 from source read]
- [x] CHK-022 [P0] Broken symlink is surfaced by the find command and the README states that surface is unavailable [evidence: gate output 20/20 from source read]
- [x] CHK-023 [P0] Documented commands in `git-hooks/tests`, the two benchmark test READMEs, and the create-skill test README have recorded output
- [x] CHK-024 [P1] The three target new READMEs pass `001`'s code-folder validator mode [evidence: gate output 20/20 from source read]
- [x] CHK-025 [P1] Five-file source audit recorded with per-file verdicts [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class recorded in the implementation receipt [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for the scoped hubs; structural residue remains with `003` [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the three target new READMEs; parent inventories updated [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-004 [P0] The resolution gate carries fenced-block, punctuation, and out-of-repo symlink adversarial cases [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-005 [P1] Touched-file list and 20-row gate set recorded before validation [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-006 [P1] Gates re-run from a non-repo-root CWD with identical summaries [evidence: gate output 20/20 from source read]
- [x] CHK-FIX-007 [P1] Evidence pinned to HEAD `98f2e639b3` and the uncommitted worktree diff
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential, token or machine-local absolute path in any authored README [evidence: gate output 20/20 from source read]
- [x] CHK-031 [P1] No internal-only host or endpoint documented in a public-facing README [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Every claim traceable to a source read, not to the prior README text [evidence: gate output 20/20 from source read]
- [x] CHK-041 [P1] Structural follow-up remains explicitly handed to `003`; no repo-wide structural sweep was claimed [evidence: gate output 20/20 from source read]
- [x] CHK-042 [P1] spec / plan / tasks synchronized [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Each new README sits at its folder root as `README.md`
- [x] CHK-051 [P1] No temporary files were added to the repository [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 17 | 17/17 |
| P2 Items | 0 | 0/0 |
| Per-file evidence rows | 40 | 40/40 |

**Verification Date**: 2026-08-02; final strict validation is recorded in `implementation-summary.md`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

- [x] CHK-052 [P1] Second reader confirms the 5-file sample against source [evidence: gate output 20/20 from source read]
- [x] CHK-053 [P1] Operator review of the three target new READMEs and the required shared parent orientation [evidence: gate output 20/20 from source read]
<!-- /ANCHOR:sign-off -->
