---
title: "Checklist: Skill-Scoped Worktree and Branch Naming"
description: "QA checklist for the sk-git owner-first naming packet: verifies the design is sound, the first cleanup slice was safe, and gates the deferred codification/hardening/enforcement work."
trigger_phrases:
  - "skill scoped worktree checklist"
  - "owner first branch checklist"
  - "sk-git cleanup checklist"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/002-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-14T07:40:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off design + cleanup-slice QA items with evidence"
    next_safe_action: "Implement the sk-git codification after operator review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

> Mark each item `[x]` only with evidence. Deferred implementation items remain `[ ]` and are gated on operator review.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before the phase it guards is called complete |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later pass |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Operator rule reconciled with the numbered counter; grammar chosen. Evidence: `decision-record.md` ADR-001.
- [x] CHK-002 [P0] Independent check/refine/plan obtained and its load-bearing claims verified. Evidence: `sol-worktree-plan.md` + reaper/skill-id/delete-candidate checks.
- [x] CHK-003 [P0] Design frozen. Evidence: `spec.md` + `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] sk-git ALWAYS #4 rewritten to the owner-first grammar (`.opencode/skills/sk-git/SKILL.md`).
- [ ] CHK-011 [P0] Allocator/validator added with a passing harness (`.opencode/skills/sk-git/scripts/worktree-naming.sh`).
- [ ] CHK-012 [P0] Code comments carry the durable WHY only — no packet/requirement identifiers.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] SOL's reaper-base claim verified against source. Evidence: `.opencode/bin/worktree-reaper.sh` line 86 tests `merge-base --is-ancestor "$branch" main`.
- [x] CHK-021 [P0] The six deletion candidates verified merged + not-checked-out before deletion. Evidence: `deleted-branches-recovery.txt`.
- [ ] CHK-022 [P0] `bash -n` clean on all new/changed shell (deferred).
- [ ] CHK-023 [P0] Naming test harness green (deferred).
- [ ] CHK-024 [P0] `validate.sh --recursive --strict` on this packet exits Errors 0. (Run at close.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-001 grammar defined and legal. Evidence: `spec.md` §4 + `plan.md` §3 (`git check-ref-format` gate).
- [ ] CHK-031 [P0] REQ-002 locked clone-wide allocator (deferred).
- [x] CHK-032 [P0] REQ-003 cleanup slice never touched the dirty primary and orphaned nothing. Evidence: `deleted-branches-recovery.txt` (ref-only deletes, ancestors of v4).
- [ ] CHK-033 [P0] REQ-004 reaper uses live base + activity marker (deferred).
- [ ] CHK-034 [P1] REQ-005 pre-push enforcement (deferred).
- [x] CHK-035 [P1] REQ-006 migration rule defined. Evidence: `decision-record.md` ADR-001 + `plan.md` Phase 5.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] The cleanup slice cannot lose data. Evidence: every deleted ref proven ancestor of `origin/skilled/v4.0.0.0` in `deleted-branches-recovery.txt`.
- [ ] CHK-041 [P0] Unmerged-branch cleanup requires a verified bundle before any `-D` (deferred gate).
- [ ] CHK-042 [P1] Allocator/validator/hooks run credential-free with no untrusted-code execution (deferred).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Decision record resolves the `wt/`-vs-`<skill>/` contradiction. Evidence: `decision-record.md` ADR-001.
- [ ] CHK-051 [P1] sk-git README + manual-testing playbook updated to the new grammar (deferred).
- [ ] CHK-052 [P1] `v1.2.0.0` sk-git changelog added (deferred).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] `description.json` and `graph-metadata.json` present and current. (Regenerated at close.)
- [x] CHK-061 [P1] Packet lives under the existing `sk-git` track as `002-skill-scoped-worktree-naming`. Evidence: sibling of `001-continuous-integration-workflow`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Total | P0 Passed | Status |
|----------|----------|-----------|--------|
| Pre-Implementation | 3 | 3 | Pass |
| Code Quality | 2 | 0 | Deferred (implementation) |
| Testing | 3 | 2 | Closing gate on CHK-024 |
| Fix Completeness | 3 | 2 | Design P0s pass; impl deferred |
| Security | 1 | 1 | Pass (slice) |
| Documentation | 1 | 1 | Pass (decision record) |

Overall: design + first cleanup slice complete and evidenced; codification/hardening/enforcement/remaining-cleanup deferred for operator review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-070 [P0] Grammar is a legal, owner-first Git ref reconciling the operator rule with the counter. Evidence: `spec.md` §1, `plan.md` §3.
- [x] CHK-071 [P1] Launch-wrapper lane exemption justified against sk-git ALWAYS #4. Evidence: `decision-record.md` ADR-002.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [ ] CHK-080 [P2] Allocation holds the common-dir lock only for the scan+write window; `next`-preview is lock-free (deferred to implementation).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [ ] CHK-090 [P1] pre-push hook installs via the existing installer and is migration-tolerant before becoming blocking (deferred).
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-100 [P1] Cleanup honors sk-git ALWAYS #15 (no stash/rebase/reset/force on the dirty/concurrent primary). Evidence: `deleted-branches-recovery.txt` — ref-only deletes; no working-tree mutation.
- [ ] CHK-101 [P1] sk-git parent canon check stays clean after codification (deferred).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [ ] CHK-110 [P1] `validate_document.py` clean on the updated sk-git README + playbook (deferred).
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] CHK-120 [P0] Operator selected the simpler grammar and authorized the cleanup slice. Evidence: recorded operator decision (grammar `<skill>/{NNNN}-{slug}`; "packet + run the 6 safe deletions").
- [ ] CHK-121 [P0] Operator approves the deferred implementation scope (Phases 2-4) before it lands.
<!-- /ANCHOR:sign-off -->
