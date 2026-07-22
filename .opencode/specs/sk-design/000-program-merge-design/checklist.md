---
title: "Checklist: sk-design 012 Program Merge"
description: "Acceptance gates for the sk-design 012–018 → one multi-phased 012 merge: preconditions, history-preserving moves, metadata regeneration, reference integrity, content-preservation, retrospective, and the recursive-strict validation gate. Every item cites its evidence."
trigger_phrases:
  - "sk-design 012 merge checklist"
  - "program merge acceptance gates"
  - "sk-design consolidation validation checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/000-program-merge-design"
    last_updated_at: "2026-07-22T15:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Aligned checklist to Level 3 template"
    next_safe_action: "Operator signs off the packet"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/000-program-merge-design/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-000-merge-design-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: sk-design 012 Program Merge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Tree clean at v4 (`HEAD == origin/skilled/v4.0.0.0`, 0 dirty) — evidence: `git status`
- [ ] CHK-002 [P0] Memory daemon stopped, 0 `context-server` writers (it corrupts source docs — see `031`) — evidence: `pgrep`
- [ ] CHK-003 [P0] Isolated worktree created from `origin/skilled/v4.0.0.0` — evidence: `git worktree list`
- [ ] CHK-004 [P1] `baseline-tree.txt` + pre-merge blobs captured for the content-diff gate — evidence: file present
- [ ] CHK-005 [P0] Operator signed off D1/D2/D3 — evidence: `decision-record.md` + operator confirmation
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All moves executed via `git mv` (renames, not add/delete) — evidence: `git status`
- [ ] CHK-011 [P0] No content mutation during moves (moves only) — evidence: content-diff harness
- [ ] CHK-012 [P1] Metadata regenerated children-before-parents; `children_ids` correct — evidence: JSON valid + validate check
- [ ] CHK-013 [P1] Follows spec-kit canon (lean-trio parents, level markers) — evidence: `validate.sh`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `validate.sh --recursive --strict` Errors:0 on merged `012` — evidence: exit output
- [ ] CHK-021 [P0] Content-diff: every moved doc identical prose vs pre-merge v4 blob — evidence: diff harness
- [ ] CHK-022 [P1] `git log --follow` intact on sampled moved files — evidence: command output
- [ ] CHK-023 [P1] Grep sweep: 0 stale pointers, 0 broken cross-refs, bare `016` gone — evidence: grep output
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every source packet in the map (M01–M29) has a target and is accounted for (29/29). — evidence: map reconciliation
- [ ] CHK-FIX-002 [P0] Duplicate `016` resolved; no folder keeps the bare `016` number. — evidence: tree listing
- [ ] CHK-FIX-003 [P0] Dissolve-vs-nest rule applied correctly (014/015/016-adoption dissolve; 012/007 + 015/009 stay nested). — evidence: tree listing
- [ ] CHK-FIX-004 [P1] No orphaned artifact dirs left at the old top level (`alignment/`, `review/` re-homed). — evidence: tree listing
- [ ] CHK-FIX-005 [P1] No content loss: content-diff = zero prose delta across all moved docs. — evidence: diff harness
- [ ] CHK-FIX-006 [P1] No scope creep: only paths/metadata/cross-refs/narrative changed; shipped-work content untouched. — evidence: diff restricted to spec-folder tree
- [ ] CHK-FIX-007 [P1] Evidence pinned to the merge commit SHA, not a moving range. — evidence: commit hash
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/credentials touched (spec-folder reorg only) — evidence: diff review
- [ ] CHK-031 [P0] Push targets only the allowlisted `skilled/v*` branch, operator-approved — evidence: push command + approval
- [ ] CHK-032 [P1] Primary tree never force-synced while dirty (ALWAYS #15) — evidence: reconcile procedure
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `012` root rewritten as program narrative (root purpose + 5-phase map only) — evidence: file review
- [ ] CHK-041 [P1] `retrospective.md` authored with per-packet citations — evidence: file + spot-check
- [ ] CHK-042 [P2] Moved packets' internal docs still cross-reference correctly — evidence: grep
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All work on the throwaway worktree; primary tree untouched until reconcile — evidence: `git worktree list`
- [ ] CHK-051 [P1] `000-program-merge-design` deleted as the final step (D2) — evidence: folder gone
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 14 | [ ]/14 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: (at execution)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Merge design decisions documented in `decision-record.md` (D1/D2/D3) — evidence: file
- [ ] CHK-101 [P1] All ADRs have status (Accepted) — evidence: file
- [ ] CHK-102 [P1] Alternatives documented (append-only, chronological) with rejection rationale — evidence: file
- [ ] CHK-103 [P2] 3-level cap + dissolve-vs-nest rule honored — evidence: tree listing
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] N/A — no runtime perf surface (spec-folder reorg) — evidence: scope review
- [ ] CHK-111 [P2] Validation completes within local `validate.sh` timeout — evidence: exit
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure = abandon worktree; documented and trivially reversible — evidence: `plan.md` rollback
- [ ] CHK-121 [P1] Push gated on orchestrator sign-off + operator approval — evidence: approval
- [ ] CHK-122 [P2] Primary checkout reconcile recipe ready (ALWAYS #15) — evidence: `tasks.md` T3.7
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Change restricted to `sk-design/012/**` spec-folder tree (scope lock) — evidence: diff scope
- [ ] CHK-131 [P2] No bundle DATA or runtime touched — evidence: diff review
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents in moved packets validate under the new paths — evidence: `--recursive --strict`
- [ ] CHK-141 [P2] Retrospective claims each trace to a source packet's status — evidence: spot-check
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Orchestrator | Phase verification | Pending | |
| Operator | Final merge + push approval | Pending | |
<!-- /ANCHOR:sign-off -->
