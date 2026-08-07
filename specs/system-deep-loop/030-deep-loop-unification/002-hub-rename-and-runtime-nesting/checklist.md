---
title: "Verification Checklist: Hub Rename + Runtime Nesting"
description: "Verification checklist for the irreversible structural merge. Not yet executed."
trigger_phrases:
  - "hub rename runtime nesting checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting"
    last_updated_at: "2026-07-08T06:40:24.201Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All items verified with evidence; 2 items have documented caveats"
    next_safe_action: "Commit scoped changes, then hand off to 003"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-002-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Hub Rename + Runtime Nesting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Recovery baseline established: git tag `pre-system-deep-loop-merge-002` at HEAD `ec4ce04325` (verified)
- [x] CHK-002 [P0] Zero in-flight `/deep:*` sessions, zero stale writer-lock files confirmed (verified)
- [x] CHK-003 [P1] Baseline captured: `npm test` 71/71 files ran (69 pass, 2 known pre-existing fail); `npm run test:council` 7/9 pass; SQLite checksums + 369-line jsonl count recorded (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Class A and Class B path repairs applied correctly; each site's hop-count verified computationally (`node -e` resolve + `existsSync`) before editing, not assumed from the table (verified)
- [x] CHK-011 [P0] `system-spec-kit` tooling-borrow repaired in this phase: `runtime/package.json`, `runtime/tsconfig.json`, `system-spec-kit/mcp_server/package.json`, `system-spec-kit/mcp_server/vitest.config.ts` all updated (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm test` in `runtime/`: 69/71 passing, exactly the 2 known pre-existing failures, zero new regressions (verified)
- [x] CHK-021 [P0] `npm run typecheck` succeeds in `runtime/` — clean, no output (verified)
- [x] CHK-022 [P0] `npm run test:council`: 7/9 passing, exactly the 2 known pre-existing failures (same test names as Stage-0 baseline), zero new regressions (verified)
- [x] CHK-023 [P1] Live-verified via direct invocation: `node runtime/scripts/render-command-contract.cjs --command deep/research -- 'test'` renders a real contract end-to-end at the new path (verified)
- [ ] CHK-024 [P1] Durable-state content confirmed intact (JSON-valid, no truncation); SQLite checksums diverged from the Stage-0 snapshot due to this phase's own verification test runs legitimately appending data (369→635 lines), not data loss; `git log --follow` not yet meaningful pre-commit — **partially met, documented caveat, not silently passed**
- [x] CHK-025 [P1] `dependency-seams.vitest.ts` passing confirmed via inspection: `skillsRoot` re-derivation verified computationally to resolve to `.opencode/skills/`, matching pre-move behavior, not just a green run (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] Every Class A/B site repaired; final sweep confirmed zero remaining `deep-loop-workflows`/`deep-loop-runtime` code-path hits outside documented historical/fixture-data mentions (verified)
- [x] CHK-P0-002 [P0] All `system-spec-kit` tooling-borrow sites repaired, including the newly-discovered `council-playbook-anchor-integrity.vitest.ts` (verified)
- [x] CHK-P0-003 [P0] `SKILL.md` content folded into the pre-existing `README.md` (new §9A "Operating Rules" + agent-mirror section); `README.md`'s original content confirmed intact before and after via direct read (verified)
- [x] CHK-P1-005 [P1] Stage 3c's 3 router `.md` files updated; live-verified end-to-end via direct script invocation (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No permission/tool-surface change introduced by this phase — pure path/identity edits plus 2 additive temporary compat symlinks (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Exactly one `graph-metadata.json` under `system-deep-loop/`, confirmed via `find` (verified)
- [x] CHK-041 [P1] Version `2.0.0.0` consistent across `SKILL.md`/`description.json`/`mode-registry.json`/`hub-router.json`, confirmed via grep (verified)
- [x] CHK-042 [P1] `changelog/v2.0.0.0.md` authored (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `package_skill.py --check`: hub PASS, all 4 mode packets PASS (pre-existing, unrelated warnings only) (verified)
- [x] CHK-051 [P1] `deep-loop-workflows/` and `deep-loop-runtime/` no longer exist as REAL top-level skill folders — **deliberately revised from the original wording**: both now exist as temporary compat symlinks (`deep-loop-workflows -> system-deep-loop`, `deep-loop-runtime -> system-deep-loop/runtime`), a decision made mid-execution after confirming `system-skill-advisor`'s drift-guard test breaks immediately without them; removed once child 003's residual grep is clean (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 7/8 (1 partial, documented — see CHK-024) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-08
<!-- /ANCHOR:summary -->
