---
title: "Plan: Skill-Scoped Worktree and Branch Naming"
description: "Phased plan to codify the owner-first sk-git branch grammar, add a locked name allocator/validator, harden the wrapper/reaper, enforce on push, and safely clean up the accumulated local tree."
trigger_phrases:
  - "skill scoped worktree plan"
  - "owner first branch plan"
  - "sk-git cleanup plan"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/002-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-14T12:20:00Z"
    last_updated_by: "claude"
    recent_action: "Marked Phases 1-4 shipped and verified"
    next_safe_action: "Run operator-gated cleanup from a clean worktree"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Plan: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Grammar** | `<skill>/{NNNN}-{slug}` (skill-scoped) or `skilled/{NNNN}-{slug}` / `skilled/vA.B.C.D` (cross-skill/release) |
| **Directory** | `.worktrees/{NNNN}-{owner}-{slug}` |
| **Counter** | One clone-wide, locked, high-water mark |
| **Wrapper** | `work/{runtime}/{slug}` — exempt, local-only, hardened |
| **Method** | Phases 1-4 shipped + verified; first cleanup slice executed; cleanup remainder gated |

### Overview

Codify an owner-first branch grammar in sk-git, back it with a locked allocator/validator, correct and harden the wrapper/reaper, enforce the grammar at push time, and clean up the accumulated local tree in evidence-gated phases. The codification, allocator/validator, wrapper/reaper hardening, push enforcement, and the lowest-risk cleanup slice are complete and verified; only the remaining evidence-gated cleanup awaits per-item operator gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Grammar validity | Every example branch is a legal ref | `git check-ref-format --branch` |
| Counter correctness | No number reuse across owners/worktrees/refs | Allocator harness (duplicate + concurrent cases) |
| Cleanup safety | Only merged, not-checked-out refs deleted; unmerged gated | Live re-check + recovery record / bundle |
| Reaper safety | Live base + activity marker; no active-worktree removal | `--dry-run` on the hardened reaper |
| Structure | Spec docs valid | `validate.sh --recursive --strict` |
| No regression | Continuous-integration workflow intact | sk-git parent checks |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Grammar

```text
OWNER        := <skill-id> | "skilled"
TASK_BRANCH  := OWNER "/" NNNN "-" SLUG          (NNNN = 0001..9999; SLUG = lowercase kebab)
TASK_DIR     := ".worktrees/" NNNN "-" OWNER "-" SLUG
RELEASE      := "skilled/v" A "." B "." C "." D
RESERVED     := "main"
WRAPPER      := "work/" RUNTIME "/" TIMESTAMP "-" PID     (exempt, local-only)
```

`<skill>` resolves to the most specific canonical first-party `name:` from a version-controlled `.opencode/skills/**/SKILL.md`; use the leaf when one leaf owns the work, the parent when it changes the parent contract, and `skilled` for cross-skill/system/release/publisher work. Detached worktrees keep the numbered directory but no branch.

### Components

| Component | Role |
|-----------|------|
| sk-git SKILL.md + references | Normative grammar, rules, examples, advisor surfaces |
| `worktree-naming.sh` | Locked allocator + branch/pair validators |
| `worktree-session.sh` | Wrapper (unchanged names) + input validation + session marker |
| `worktree-reaper.sh` | Live merge base + activity check + human/active protection |
| `pre-push` hook | Reject non-conformant new remote branches (migration-tolerant) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Codify the contract (shipped — `2eb1bf2974`)

Rewrite sk-git ALWAYS #4 to the owner-first grammar; tighten cleanup ordering (worktree remove before branch delete); add rules for the allocator, migration, and active-worktree protection; update references, advisor keywords/`Owns:`, `graph-metadata.json`, manual-testing playbook, and a `v1.2.0.0` changelog.

### Phase 2 — Allocator + validator (shipped — `bdb31a31db`, 31/31)

Add `.opencode/skills/sk-git/scripts/worktree-naming.sh` (`load_skill_ids`, `validate_owner/slug/branch/pair`, `allocate_number` under a common-dir lock, `create_named_worktree`, `create_detached_worktree`) plus a shell test harness covering valid classes, invalid forms, duplicate/concurrent allocation, detached numbering, and the wrapper exemption.

### Phase 3 — Wrapper/reaper hardening (shipped — `925ca3c738`, 9/9)

`worktree-session.sh`: validate runtime input; write a session-activity marker before `exec`; disable auto-reap on marker-write failure. `worktree-reaper.sh`: only auto-reap exact wrapper pairs; keep on live/missing/ambiguous marker; resolve the merge target from the recorded live branch (not `main`); make human worktrees report-only; never `--force`.

### Phase 4 — Enforcement rollout (shipped — `6e6fdfb57d`, 8/8)

Versioned `pre-push` that validates only new remote-branch creation, accepts task/backup/release/reserved forms, rejects wrapper refs on push, permits legacy-branch updates with a warning, and never blocks `skilled/v*`. Wire the installer, hook README, and CI fixture matrix. PR head-name enforcement stays non-blocking until legacy PR branches are inventoried.

### Phase 5 — Cleanup (Phase 1 done; rest gated)

Executed: six merged, not-checked-out branches deleted with live re-checks and a recovery record. Remaining (deferred, gated): stale worktree removals, detached-worktree adjudication, and per-item operator decisions on unmerged branches with verified bundles — all from a clean control worktree, never the dirty primary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Syntax | New/changed shell | `bash -n` |
| Allocator | Valid/invalid/duplicate/concurrent/detached/wrapper | naming test harness |
| Wrapper/reaper | Dry-run behavior | `worktree-session.sh --dry-run`, `worktree-reaper.sh --dry-run` |
| Docs | sk-git README + playbook | `validate_document.py` |
| Structure | This packet | `validate.sh --recursive --strict` |
| Cleanup | Live re-check before each action; no dirty-primary touch | per-phase preflight |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `worktree-session.sh` / `worktree-reaper.sh` | Internal | Required | Governs concurrent sessions; edits must be additive + revertable |
| Live git state | Internal | Volatile | Cleanup must re-check before acting |
| sk-git parent checks | Internal | Required | Regression guard for the CI workflow |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Codify/allocator/enforcement**: revert the commit; fall back to documented `git worktree add -b`; uninstall the hook.
- **Wrapper/reaper**: single-commit revert; wrapper names never changed.
- **Cleanup**: recover deleted merged branches from the recovery record (`git branch <name> <oid>`); unmerged deletions are bundle-backed before removal; worktree removals are non-force and re-checked.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

```text
Phase 1 (contract) ──▶ Phase 2 (allocator/validator) ──▶ Phase 4 (enforcement)
        │                        │
        └────────────▶ Phase 3 (wrapper/reaper hardening)
Cleanup Phase 1 (done) is independent; Cleanup Phases 2-4 depend on Phase 3 (hardened reaper for wrapper worktrees).
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

Contract (Phase 1) → allocator (Phase 2) is the gating chain for any new conformant worktree; enforcement (Phase 4) must follow the allocator so pushes are validated against a real generator. Wrapper/reaper hardening (Phase 3) is the highest-risk item and gates the automated worktree-removal portion of cleanup. The executed cleanup slice sits off the critical path.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M0 — Design frozen (done) | Grammar + phased plan + decision record; six safe branch deletions executed |
| M1 — Contract + allocator (done) | Phases 1-2 landed; naming harness green (31/31) |
| M2 — Governance hardened (done) | Phase 3 landed; reaper harness green (9/9) |
| M3 — Enforcement (done) | Phase 4 hook installed; pre-push harness green (8/8) |
| M4 — Cleanup complete (open) | Worktree/unmerged cleanup finished per operator decisions |
<!-- /ANCHOR:milestones -->
