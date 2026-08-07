---
title: "Verification Checklist: Code README Truth And Missing Orientation"
description: "Verification Date: not yet verified"
trigger_phrases:
  - "code readme truth checklist"
  - "readme missing orientation checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist across all gates"
    next_safe_action: "Verify pre-implementation items once findings are re-confirmed"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-002-code-readme-truth-and-missing-orientation"
      parent_session_id: null
    completion_pct: 0
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

Planned phase — all items open. Per-file evidence is the point of this checklist: mark `[x]` only with the source read and the gate output.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 20 findings re-verified against HEAD with confirmed/drifted/refuted per ID
- [ ] CHK-002 [P0] The `RA-004-02` magnitude correction applied (19 suites, not 20)
- [ ] CHK-003 [P0] Referenced-path resolution script built and runnable
- [ ] CHK-004 [P0] Derived-count gate built and runnable
- [ ] CHK-005 [P1] Pre-fix gate output captured over all 20 files as the baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:per-file -->
## Per-File Evidence

Each row is marked only when the claim was re-derived from source, not edited from the prior text, and both gates pass on that file.

| # | Finding | File | Re-derived from source | Gates pass |
|---|---------|------|------------------------|------------|
| 1 | `RA-007-01` | `install-guides/install-scripts/README.md` | [ ] | [ ] |
| 2 | `RA-007-02` | `hooks/git/README.md` | [ ] | [ ] |
| 3 | `RA-007-03` | `scripts/git-hooks/tests/README.md` | [ ] | [ ] |
| 4 | `RA-010-02` | `.github/workflows/README.md` | [ ] | [ ] |
| 5 | `RA-004-01` | `deep-improvement/scripts/agent-improvement/tests/README.md` | [ ] | [ ] |
| 6 | `RA-004-02` | `deep-improvement/scripts/skill-benchmark/tests/README.md` | [ ] | [ ] |
| 7 | `RA-004-03` | `deep-research/scripts/README.md` | [ ] | [ ] |
| 8 | `RA-004-04` | `deep-review/scripts/README.md` | [ ] | [ ] |
| 9 | `RA-005-20` | `sk-create-skill/scripts/README.md` | [ ] | [ ] |
| 10 | `RA-005-21` | `sk-create-skill/scripts/lib/README.md` | [ ] | [ ] |
| 11 | `RA-005-22` | `sk-create-skill/scripts/tests/README.md` | [ ] | [ ] |
| 12 | `RA-005-33` | `mcp-server/handlers/skill-graph/README.md` | [ ] | [ ] |
| 13 | `RA-005-38` | `mcp-server/lib/skill-graph/README.md` | [ ] | [ ] |
| 14 | `RA-006-05` | `commands/doctor/scripts/README.md` | [ ] | [ ] |
| 15 | `RA-007-04` | `plugins/README.md` | [ ] | [ ] |
| 16 | `RA-007-05` | `plugins/tests/README.md` | [ ] | [ ] |
| 17 | `RA-007-06` | `scripts/README.md` | [ ] | [ ] |
| 18 | `RA-002-01` | `sk-design/shared/authored-brand/README.md` (new) | [ ] | [ ] |
| 19 | `RA-003-01` | `system-spec-kit/scripts/runtime-mirrors/README.md` (new) | [ ] | [ ] |
| 20 | `RA-005-01` | `mcp-server/scripts/command-bridges/README.md` (new) | [ ] | [ ] |
<!-- /ANCHOR:per-file -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The resolution gate evaluates paths relative to each README's own location
- [ ] CHK-011 [P0] The derived-count gate fails closed on an unparseable count
- [ ] CHK-012 [P1] Example-only paths are marked as examples rather than suppressed by an exclusion list
- [ ] CHK-013 [P1] No spec paths, packet ids or task ids appear in any code comment added by this phase
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Referenced-path resolution gate over all 20 files: zero unresolved
- [ ] CHK-021 [P0] Derived-count gate over all 20 files: zero retyped literals
- [ ] CHK-022 [P0] `find .opencode/install-guides/install-scripts -type l ! -exec test -e {} \; -print` returns empty, or the README states the surface is unavailable
- [ ] CHK-023 [P0] Documented commands in `git-hooks/tests` and the three benchmark test READMEs actually executed, output recorded
- [ ] CHK-024 [P1] The three new READMEs pass `001`'s code-folder validator mode
- [ ] CHK-025 [P1] Second-reader sample audit of 5 of 20 recorded with per-file verdicts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class recorded: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: no other README in the touched hubs carries the same retyped-count pattern unfixed, or the residue is handed to `003`
- [ ] CHK-FIX-003 [P0] Consumer inventory done for the three new READMEs — their parent inventories updated
- [ ] CHK-FIX-004 [P0] The resolution gate carries adversarial cases: link inside a fenced block, path with trailing punctuation, symlink whose target exists but is outside the repo
- [ ] CHK-FIX-005 [P1] Touched-file list and gate row count stated before completion is claimed
- [ ] CHK-FIX-006 [P1] Gates re-run from a non-repo-root CWD produce the same verdicts
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential, token or machine-local absolute path in any authored README
- [ ] CHK-031 [P1] No internal-only host or endpoint documented in a public-facing README
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Every claim traceable to a source read, not to the prior README text
- [ ] CHK-041 [P1] Structural defects noticed while repairing were escalated to `003`, not fixed here
- [ ] CHK-042 [P1] spec / plan / tasks synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Each new README sits at its folder root as `README.md`
- [ ] CHK-051 [P1] Temp files in `scratch/` only; `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 15 | 0/15 |
| P2 Items | 0 | 0/0 |
| Per-file evidence rows | 40 | 0/40 |

**Verification Date**: not yet verified
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

- [ ] Second reader confirms the 5-file sample against source
- [ ] Operator review of the three new READMEs
<!-- /ANCHOR:sign-off -->
