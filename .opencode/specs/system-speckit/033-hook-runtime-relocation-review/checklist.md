---
title: "Verification Checklist: Relocate fully-portable runtime-hook guard cores"
description: "Verification Date: 2026-07-28"
trigger_phrases:
  - "hook relocation checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Checklist authored retroactively with evidence from this session's verification work"
    next_safe_action: "Dispatch deep-review auto YAML"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Relocate fully-portable runtime-hook guard cores

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (`/deep:review` command contract, isolated worktree, `cli-opencode`/`gpt-5.6-sol` executor)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every relocated core imports only Node builtins or an unmoved checker via `spawnSync`. [evidence: manual import-graph trace, this session]
- [x] CHK-011 [P0] No stale path reference survives outside git history. [evidence: repo-wide grep sweep, this session]
- [x] CHK-012 [P1] Git history preserved on every relocated file (`git mv`, not delete+add). [evidence: commit `40d5f0d2b3` shows renames]
- [x] CHK-013 [P1] Code follows the existing per-runtime adapter pattern (lib/ + one folder per runtime needing a real file).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `dispatch-rule-checks.test.mjs`: 6/6 pass post-fix.
- [x] CHK-021 [P0] `mcp-route-guard.test.cjs`: 1/1 pass post-fix.
- [x] CHK-022 [P1] `mk-post-edit-quality.test.cjs` + `mk-deep-loop-guard.test.cjs` + `claude-task-dispatch-guard.test.cjs`: 40/40 combined pass.
- [x] CHK-023 [P1] `test-root-name-consumer-matrix.cjs`: 17/17 pass post-fix; `dispatch-audit.test.mjs`: 38/38 pass via its own documented `npx vitest run` (no code change needed, wrong-runner false alarm caught and corrected).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: this is a `cross-consumer` relocation (every consumer of a moved path needed a matching fix), not an instance-only change.
- [x] CHK-FIX-002 [P0] Consumer inventory completed via two independent grep passes: import-statement grep (found direct `require`/`import` consumers) and a dedicated hardcoded-path-string grep (found 5 additional cross-adapter `spawnSync` constants and a stale test path invisible to the first pass).
- [x] CHK-FIX-003 [P0] Consumer inventory covers configs (4 runtime JSON files), symlinks (~20), imports (Pi extensions, OpenCode plugins), hardcoded spawn constants, tests (5 files), and docs (~20 files).
- [x] CHK-FIX-004 [P1] Matrix axes: 4 concern folders x up to 5 runtimes each; row count documented in `plan.md` Effort Estimation.
- [x] CHK-FIX-005 [P1] Evidence pinned to fix commit `40d5f0d2b3`, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced (path-only changes).
- [x] CHK-031 [P0] No new external input handling introduced by this move.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the actual completed work.
- [x] CHK-041 [P1] ~20 live documentation files updated for the new paths; 2 files' relative-depth math manually recomputed via Python `os.path.normpath` after an initial wrong sed pass.
- [x] CHK-042 [P1] All touched/new README and playbook files report 0 issues via `validate_document.py`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files left in the worktree outside the scratchpad.
- [x] CHK-051 [P1] `/tmp/hook-relocation-sed.sh` was a scratch script, not committed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-28
<!-- /ANCHOR:summary -->
