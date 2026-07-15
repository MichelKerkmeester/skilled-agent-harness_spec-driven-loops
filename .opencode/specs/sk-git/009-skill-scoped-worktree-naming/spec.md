---
title: "Feature Specification: Skill-Scoped Worktree and Branch Naming"
description: "Reconcile the sk-git worktree/branch convention so every managed branch is owner-first (<skill>/{NNNN}-{slug} or skilled/…), fix the counter/reaper defects that make the current tree a mess, and safely clean up the accumulated local branches and worktrees."
trigger_phrases:
  - "skill scoped worktree naming"
  - "owner first branch convention"
  - "sk-git worktree cleanup"
  - "skilled branch alias"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/009-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Reconciled spec to shipped Phases 1-4"
    next_safe_action: "Run operator-gated cleanup from a clean worktree"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Should the legacy wt/* PR branches on origin be inventoried and migrated, or left to age out?"
    answered_questions:
      - "Branch grammar is owner-first without a wt lane: <skill>/{NNNN}-{slug} or skilled/{NNNN}-{slug}."
      - "The launch wrapper's work/{runtime}/{slug} lane is exempt from the owner-first rule."
      - "Phases 1-4 (codify, allocator, wrapper/reaper hardening, pre-push enforcement) all landed together, verified by test harnesses, ahead of any cleanup beyond the six-branch slice."
---
# Feature Specification: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## EXECUTIVE SUMMARY

The sk-git worktree convention drifted: branches accumulate under a flat `wt/{NNNN}-{name}` namespace with no owner, the numbered counter only scans direct `.worktrees/` names (so it can reuse numbers), the auto-reaper checks a stale local `main` that is ~1400 commits behind the live branch, and the local tree has grown to dozens of branches and worktrees the operator calls "a mess." This packet adopts an **owner-first** branch grammar — `<skill>/{NNNN}-{slug}` for skill-scoped work and `skilled/{NNNN}-{slug}` (or the release form `skilled/vA.B.C.D`) for cross-skill/system work — keeping one repository-wide counter and exempting the launch wrapper's machine-generated `work/{runtime}/{slug}` lane. It codifies the rule in the sk-git skill, adds a locked name allocator/validator, hardens the wrapper/reaper safety boundaries, and defines a conservative, evidence-gated cleanup of the existing tree. The codification, allocator/validator, wrapper/reaper hardening, and push enforcement are shipped and verified (harnesses 31/9/8), and the first safe cleanup slice (six merged, not-checked-out branches) is done; only the remaining evidence-gated cleanup stays open behind per-item operator gates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (cross-cutting policy + executable tooling) |
| **Priority** | P1 |
| **Status** | In Progress (Phases 1-4 shipped + verified; only operator-gated cleanup remains) |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | `sk-git` |
| **Predecessor** | `001-continuous-integration-workflow` |
| **Successor** | Phase 5 cleanup (operator-gated) |
| **Provenance** | Refines `sk-git/137-parallel-session-git-autosync` REQ-010 / ADR-006 (frozen) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-git's numbered `wt/{NNNN}-{name}` branch namespace carries no owner, so a GitKraken tree of dozens of `wt/*`, `work/*`, `system-speckit/*`, `wip/*`, and `backup/*` branches gives no signal of who owns what. The operator's rule — "a branch is always based on the related skill name, or on `skilled/`" — cannot be applied as literally worded because a Git branch has exactly one first path component and cannot begin with both `wt/` and `<skill>/`. Three real defects compound the mess: the number allocator scans only direct `.worktrees/` names (missing external and `.claude/worktrees/**` worktrees and lingering refs, so it can reuse a number); the auto-reaper tests merge against a local `main` that is ~1400 commits behind `origin/skilled/v4.0.0.0` and has no session-activity marker (so it can both miss stale worktrees and reap a live one); and branch/worktree number pairs already drift.

### Purpose

Give every managed branch an unambiguous owner-first name, keep the numbered counter correct and collision-free, make the wrapper/reaper safe under concurrency, and clean up the accumulated tree without ever disturbing a dirty or concurrent-owned checkout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- An owner-first branch/worktree naming grammar and its migration rule.
- sk-git skill codification (SKILL.md rules, references, advisor surfaces, changelog).
- A locked name allocator + validator script, and a pre-push enforcement hook.
- Wrapper/reaper hardening (correct integration base, session-activity marker, active-worktree protection).
- A conservative, evidence-gated cleanup of the existing local branch/worktree tree.

### Out of Scope

- Rewriting shared history or force-pushing — never.
- Touching the operator's dirty/concurrent primary checkout (branch renames or worktree removals there) — deferred to the owner.
- Remote-branch deletion by default — each is its own confirmation gate.
- Changing the continuous-integration autosync design owned by `001-continuous-integration-workflow`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/SKILL.md` | Modify | Owner-first grammar; ALWAYS/NEVER rule updates; advisor keywords |
| `.opencode/skills/sk-git/references/*.md` | Modify | Normative examples + cleanup ordering (worktree remove before branch delete) |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Create | Locked allocator + name validator |
| `.opencode/bin/worktree-session.sh` | Modify | Runtime input validation + session-activity marker |
| `.opencode/bin/worktree-reaper.sh` | Modify | Correct merge base; activity check; protect human/active worktrees |
| `.opencode/scripts/git-hooks/pre-push` | Create | Reject non-conformant new remote branch names (migration-tolerant) |
| local branches/worktrees | Delete (gated) | Cleanup per the phased plan; six merged branches already removed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Adopt an owner-first branch grammar reconciling the operator's rule with the numbered counter. | Grammar defined as `<skill>/{NNNN}-{slug}` or `skilled/{NNNN}-{slug}`; every example passes `git check-ref-format --branch`; the contradiction in the source requirement is resolved in the decision record. |
| REQ-002 | The number allocator must be a correct, locked, clone-wide high-water mark. | Allocation holds a lock in the common Git dir and seeds its max from the stored mark, every registered worktree basename, and all local/remote legacy refs; numbers are never reused. |
| REQ-003 | Cleanup must never disturb a dirty or concurrent-owned checkout, and must not orphan un-integrated commits. | Cleanup runs from a clean control worktree; only merged, not-checked-out refs are deleted with `-d`; every unmerged ref needs a per-item operator decision plus a verified `git bundle`. |
| REQ-004 | The auto-reaper must use the live integration base and prove inactivity. | Reaper resolves the merge target from the session's recorded live branch, keeps any worktree without a valid active-session marker, and never force-removes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Enforce the grammar on new remote branch creation without stranding legacy branches. | A versioned `pre-push` hook rejects non-conformant new remote branches, permits updates to existing legacy branches with a warning, and never blocks `skilled/v*` operator pushes. |
| REQ-006 | Define and apply the migration rule for existing branches. | Merged legacy refs are deleted; retained refs are renamed (never history-rewritten); backups preserved until audited; wrapper refs left in their machine lane. |
| REQ-007 | Update sk-git advisor/routing surfaces so the owner-first grammar is discoverable. | New grammar keywords and `Owns:` entries appear in sk-git SKILL.md and `graph-metadata.json`; the advisor recommends sk-git for owner-first branch/worktree naming requests. |
| REQ-008 | Record the change and migration in a versioned changelog. | A `v1.2.0.0` sk-git changelog documents the grammar, the wrapper exemption, and the migration rule. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every newly allocated managed branch is owner-first and passes the validator; the launch-wrapper lane stays exempt and documented.
- **SC-002**: The allocator cannot reuse a number across owners, external worktrees, or lingering refs.
- **SC-003**: The reaper never removes an active or ownership-uncertain worktree and uses the live integration base.
- **SC-004**: The cleanup removes only proven-safe refs/worktrees; nothing un-integrated is lost; the dirty primary is untouched.
- **SC-005**: The decision record resolves the `wt/`-vs-`<skill>/` contradiction and records the wrapper exemption.
- **SC-006**: sk-git strict validation and the naming test harness pass; no regression to the continuous-integration workflow.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/bin/worktree-session.sh` + `worktree-reaper.sh` (concurrent-session governance) | High — a bad edit affects every launched session | Preserve wrapper names; add validation/markers additively; single-commit revertable |
| Dependency | Live git state (branches/worktrees move under concurrent sessions) | Cleanup targets can change between plan and act | Re-check every ref/worktree live immediately before acting; halt on any change |
| Risk | Deleting an unmerged branch orphans commits | High | Never auto-delete unmerged; per-item operator decision + verified bundle first |
| Risk | Renaming/removing an active worktree breaks a live session | High | Require owner confirmation; keep on missing/ambiguous marker; never `--force` |
| Risk | Blocking pre-push strands legacy PR branches | Medium | Only gate new-branch creation; permit legacy updates with a warning; inventory before making blocking |
| Risk | Counter reuse from an incomplete scan | Medium | Locked clone-wide high-water mark seeded from all ref/worktree sources |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Allocation must be O(refs+worktrees) under a short-held common-dir lock; a `next`-preview mode may show a non-binding candidate without holding the lock.

### Security

- The allocator/validator and hooks run local, credential-free; no network calls; no execution of untrusted repository code.

### Reliability

- No data loss: every commit reachable only from a deleted local ref must first be proven reachable from `origin/skilled/v4.0.0.0` or captured in a verified bundle.
- Concurrency-safe: allocation is atomic; cleanup halts on any live-state change; the dirty/concurrent primary is never mutated.

---

## 8. EDGE CASES

### Data Boundaries

- **Detached-HEAD worktrees** (projection/validation/experiment): branch grammar is inapplicable; the numbered directory identity still applies (`.worktrees/{NNNN}-{owner}-{slug}`).
- **Launch-wrapper worktrees** (`work/{runtime}/{slug}`): exempt from the owner-first rule; local-only; auto-reaped only when clean+merged+inactive.
- **External scratch worktrees** (`/private/tmp/**`, `.claude/worktrees/**`): path location never proves staleness; treat as active/uncertain until the owner confirms.

### Error Scenarios

- **Number reuse**: an incomplete scan removing the highest directory could reissue a live number — prevented by the persisted high-water mark.
- **Dirty primary**: never rename/switch/stash/reset/clean it during migration; preserve its committed tip via a new conforming worktree only after its owner makes it clean.
- **Checked-out branch delete**: Git refuses to delete a branch checked out in a linked worktree — always remove the worktree first, then `git branch -d`.

## 9. COMPLEXITY ASSESSMENT

Cross-cutting Git policy touching documentation, an executable allocator/validator, concurrent-session governance scripts, a push-time enforcement hook, a migration decision, and destructive cleanup evidence. Blast radius spans every future worktree/branch and every launched session, which is why it is Level 3 even though the net code footprint is moderate. Sequencing is strictly gated: contract → tooling → wrapper/reaper safety → enforcement, with cleanup phased lowest-risk first.

## 10. RISK MATRIX

| Phase | Change | Blast radius | Rollback |
|-------|--------|--------------|----------|
| Codify (docs/rules) | SKILL.md + references | Medium (routing/behavior) | Revert commit |
| Allocator/validator | New script + tests | Medium (new-worktree path) | Fall back to documented `git worktree add -b` |
| Wrapper/reaper | Session governance scripts | High (concurrent sessions) | Single-commit revert; wrapper names unchanged |
| Enforcement | pre-push hook | Medium (push path) | Uninstall hook |
| Cleanup P1 (done) | 6 merged branch deletes | Low (refs only, reachable from v4) | `git branch <name> <oid>` from recovery record |
| Cleanup P2-P4 | Worktree removals / renames / unmerged | Medium-High | Per-item gates + bundles; deferred |

## 11. USER STORIES

### US-001: Owner-legible branches (Priority: P0)

As an operator scanning the branch tree, I want every managed branch to start with the owning skill or `skilled/`, so I can see at a glance who owns each line of work instead of a flat `wt/*` pile.

### US-002: Safe automated worktrees (Priority: P1)

As a parallel AI session, I want the allocator to give me a collision-free numbered owner-first worktree and the reaper to never remove my worktree while I am live, so concurrent work stays isolated and nothing I own is lost.

## 12. OPEN QUESTIONS

- **Resolved:** Phases 1-4 (grammar + docs + allocator + wrapper/reaper hardening + pre-push enforcement) all landed together, verified by test harnesses, ahead of any cleanup beyond the six-branch slice.
- **Open:** Should the legacy `wt/*` PR branches on origin be inventoried and migrated, or left to age out? (Part of the deferred Phase 5 cleanup.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
- Provenance (frozen): `../137-parallel-session-git-autosync/001-research-and-requirements/decision-record.md`
