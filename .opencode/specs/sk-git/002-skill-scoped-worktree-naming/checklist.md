---
title: "Checklist: Skill-Scoped Worktree and Branch Naming"
description: "QA checklist for the sk-git owner-first naming packet: verifies the design is sound, the codification/allocator/hardening/enforcement work shipped with test evidence, and the first cleanup slice was safe; the remaining evidence-gated cleanup stays open."
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
    last_updated_at: "2026-07-14T12:20:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off Phases 1-4 QA with evidence"
    next_safe_action: "Run operator-gated cleanup from a clean worktree"
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
    completion_pct: 85
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

- [x] CHK-010 [P0] sk-git ALWAYS #4 rewritten to the owner-first grammar. Evidence: `.opencode/skills/sk-git/SKILL.md` line 302 (ALWAYS #4) + line 315 (ALWAYS #17 reap contract); commit `2eb1bf2974`.
- [x] CHK-011 [P0] Allocator/validator added with a passing harness. Evidence: `.opencode/skills/sk-git/scripts/worktree-naming.sh`; `scripts/tests/worktree-naming.test.sh` 31/31 PASS; commit `bdb31a31db`.
- [x] CHK-012 [P0] Code comments carry the durable WHY only — no packet/requirement identifiers. Evidence: pre-commit comment-hygiene gate passed on all four shell files across commits `bdb31a31db`/`925ca3c738`/`6e6fdfb57d`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] SOL's reaper-base claim verified against source. Evidence: `.opencode/bin/worktree-reaper.sh` line 86 tests `merge-base --is-ancestor "$branch" main`.
- [x] CHK-021 [P0] The six deletion candidates verified merged + not-checked-out before deletion. Evidence: `deleted-branches-recovery.txt`.
- [x] CHK-022 [P0] `bash -n` clean on all new/changed shell. Evidence: `worktree-naming.sh`, `worktree-session.sh`, `worktree-reaper.sh`, `pre-push` all `bash -n` OK.
- [x] CHK-023 [P0] Test harnesses green. Evidence: `worktree-naming.test.sh` 31/31, `worktree-reaper.test.sh` 9/9, `pre-push.test.sh` 8/8.
- [x] CHK-024 [P0] `validate.sh --recursive --strict` on this packet exits Errors 0. Evidence: run at close — this packet Errors 0 (reorg-broken 137 provenance links repaired).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-001 grammar defined and legal. Evidence: `spec.md` §4 + `plan.md` §3 (`git check-ref-format` gate).
- [x] CHK-031 [P0] REQ-002 locked clone-wide allocator. Evidence: `worktree-naming.sh` `allocate_number` (common-dir lock, high-water seed from mark + worktrees + local/remote refs); `worktree-naming.test.sh` concurrent-8-distinct case; commit `bdb31a31db`.
- [x] CHK-032 [P0] REQ-003 cleanup slice never touched the dirty primary and orphaned nothing. Evidence: `deleted-branches-recovery.txt` (ref-only deletes, ancestors of v4).
- [x] CHK-033 [P0] REQ-004 reaper uses live base + activity marker. Evidence: `worktree-reaper.sh` (integration tip = primary `HEAD`; marker-dead gate; never `--force`); `worktree-reaper.test.sh` 9/9; commit `925ca3c738`.
- [x] CHK-034 [P1] REQ-005 pre-push enforcement. Evidence: `.opencode/scripts/git-hooks/pre-push` (new-remote-branch gate, migration-tolerant, never blocks `skilled/v*`); `pre-push.test.sh` 8/8; commit `6e6fdfb57d`.
- [x] CHK-035 [P1] REQ-006 migration rule defined. Evidence: `decision-record.md` ADR-001 + `plan.md` Phase 5.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] The cleanup slice cannot lose data. Evidence: every deleted ref proven ancestor of `origin/skilled/v4.0.0.0` in `deleted-branches-recovery.txt`.
- [ ] CHK-041 [P0] Unmerged-branch cleanup requires a verified bundle before any `-D` — deferred gate (Phase 5 remainder, open).
- [x] CHK-042 [P1] Allocator/validator/hooks run credential-free with no untrusted-code execution. Evidence: `worktree-naming.sh` / `pre-push` are pure local git+shell (no network, no repo-code exec); harnesses run hermetically with `core.hooksPath` neutralized.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Decision record resolves the `wt/`-vs-`<skill>/` contradiction. Evidence: `decision-record.md` ADR-001.
- [x] CHK-051 [P1] sk-git README + manual-testing playbook updated to the new grammar. Evidence: `references/worktree_workflows.md` owner-first examples (commit `2eb1bf2974`); `README.md` §3 worktree example + cleanup FAQ rewritten to owner-first + the allocator (removing the forbidden hand-computed counter).
- [x] CHK-052 [P1] `v1.2.0.0` sk-git changelog added. Evidence: `.opencode/skills/sk-git/changelog/v1.2.0.0.md` (commit `2eb1bf2974`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] `description.json` and `graph-metadata.json` present and current. Evidence: regenerated at close via `backfill-graph-metadata.ts`; packet validates Errors 0.
- [x] CHK-061 [P1] Packet lives under the existing `sk-git` track as `002-skill-scoped-worktree-naming`. Evidence: sibling of `001-continuous-integration-workflow`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Total | P0 Passed | Status |
|----------|----------|-----------|--------|
| Pre-Implementation | 3 | 3 | Pass |
| Code Quality | 3 | 3 | Pass (shipped + verified) |
| Testing | 3 | 3 | Pass (harnesses 31/9/8; validate Errors 0) |
| Fix Completeness | 4 | 3 | Impl P0s pass; CHK-041 unmerged-cleanup gate open |
| Security | 2 | 1 | Slice safe; CHK-041 bundle gate open |
| Documentation | 1 | 1 | Pass (decision record) |

Overall: design, codification, allocator, wrapper/reaper hardening, and push enforcement complete and evidenced (commits `2eb1bf2974`/`bdb31a31db`/`925ca3c738`/`6e6fdfb57d`; harnesses 31/9/8; packet validate Errors 0). Only the remaining evidence-gated cleanup (Phase 5 remainder — worktree removals, detached adjudication, unmerged decisions) stays open behind per-item operator gates.
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

- [x] CHK-080 [P2] Allocation holds the common-dir lock only for the scan+write window; `next`-preview is lock-free. Evidence: `worktree-naming.sh` `allocate_number` (lock acquired around scan+write, released after) vs `next` (lock-free preview).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-090 [P1] pre-push hook installs via the existing installer and is migration-tolerant before becoming blocking. Evidence: `install-git-hooks.sh` wires `pre-push` (commit `6e6fdfb57d`); hook gates only new remote branches, warns-not-blocks on legacy updates, never blocks `skilled/v*`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-100 [P1] Cleanup honors sk-git ALWAYS #15 (no stash/rebase/reset/force on the dirty/concurrent primary). Evidence: `deleted-branches-recovery.txt` — ref-only deletes; no working-tree mutation.
- [x] CHK-101 [P1] Applicable sk-git canon stays clean after codification. Evidence: SKILL.md `version: 1.2.0.0` + `changelog/v1.2.0.0.md` present and consistent; `bash -n` clean on all touched shell; packet validate Errors 0. NOTE: `parent-skill-check.cjs` reports 3 missing hub files (`mode-registry.json`/`hub-router.json`/`description.json`) — these are **parent-hub** requirements; sk-git is a **leaf skill** (never a hub, `description.json` never tracked), so that check is not applicable to this packet and its failures pre-date and are unrelated to this codification.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [ ] CHK-110 [P1] `validate_document.py` clean on the updated sk-git README + playbook — NOT RUN. the tool cannot run in this environment (`template_rules.json` absent under `sk-doc/assets/`); compensating verification ran instead — manual owner-first grammar-consistency review (no residual `wt/{NNNN}` teaching), README version bumped `1.1.0.27`, and the packet strict validate is Errors 0. Re-run when the template config is restored.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] CHK-120 [P0] Operator selected the simpler grammar and authorized the cleanup slice. Evidence: recorded operator decision (grammar `<skill>/{NNNN}-{slug}`; "packet + run the 6 safe deletions").
- [x] CHK-121 [P0] Operator approved the implementation scope before it landed. Evidence: operator directive to implement all git phases; the approved Phases 1-4 shipped as commits `2eb1bf2974` / `bdb31a31db` / `925ca3c738` / `6e6fdfb57d`.
<!-- /ANCHOR:sign-off -->
