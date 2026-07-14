---
title: "Decision Record: Skill-Scoped Worktree and Branch Naming"
description: "Resolves the wt/-vs-<skill>/ contradiction in favor of an owner-first branch grammar, exempts the launch-wrapper lane, and fixes the conservative evidence-gated cleanup posture for the accumulated local tree."
trigger_phrases:
  - "owner first branch decision"
  - "skill scoped worktree adr"
  - "wrapper exemption decision"
importance_tier: "critical"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/002-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-14T07:40:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the naming, exemption, and cleanup decisions"
    next_safe_action: "Implement the sk-git codification after operator review"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Decision Record: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Provenance: refines REQ-010 / ADR-006 of `skilled-agent-orchestration/137-parallel-session-git-autosync` (frozen). The design was checked, refined, and planned by GPT-5.6-SOL (max/fast), whose load-bearing claims the orchestrator independently verified.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Owner-first branch grammar

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (grammar choice); GPT-5.6-SOL (analysis); orchestrator (verification) |

<!-- ANCHOR:adr-001-context -->
### Context

The operator's rule — "a branch is always based on the related skill name, or on `skilled/`" — cannot be applied literally alongside the existing sk-git rule that names worktree branches `wt/{NNNN}-{name}`: a Git branch has exactly one first path component and cannot begin with both `wt/` and `<skill>/`. The frozen source decision (packet 137 ADR-006) recorded both in one sentence and is therefore not directly implementable. The numbered counter also carries real value (global uniqueness, Git-UI grouping) that must not be lost.

### Constraints

- Every branch must be a legal ref (`git check-ref-format --branch`).
- One repository-wide number must remain, collision-free.
- NEVER create branches directly; only via `git worktree add -b` (sk-git NEVER #2).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt an **owner-first** grammar: `<skill>/{NNNN}-{slug}` for skill-scoped work and `skilled/{NNNN}-{slug}` (plus the release form `skilled/vA.B.C.D`) for cross-skill/system/release work, with directory `.worktrees/{NNNN}-{owner}-{slug}`. The operator chose the **simpler form without a `wt/` lane segment** (i.e. `sk-git/0040-...`, not `sk-git/wt/0040-...`); GitKraken groups by owner. `<skill>` is the most specific canonical first-party `name:` from a version-controlled `.opencode/skills/**/SKILL.md`; `skilled` covers inseparable cross-skill, repository-wide, release, publisher, or orchestration work. `main` is reserved. Detached worktrees keep the numbered directory but no branch. Migration: enforce for new worktrees; delete merged legacy refs; rename (never history-rewrite) retained refs; preserve backups until audited; never delete unmerged without an explicit per-branch decision and a verified bundle.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **`<skill>/wt/{NNNN}-{slug}`** (SOL's recommendation) — keeps a `wt` lane sub-group in GitKraken under each owner. Rejected by the operator in favor of the shorter owner-first form; both satisfy the rule and keep the counter.
- **Literal `wt/` + `<skill>/`** — impossible (single first component). Rejected.
- **Skill-scoped counters** — Git cannot enforce cross-owner uniqueness per prefix; a global counter with a central allocator is simpler and safer. Rejected.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **Positive**: every managed branch is owner-legible; the global counter survives; the grammar is a legal ref.
- **Negative**: ~20 existing branches become non-conformant and need migration; Git cannot enforce cross-owner number uniqueness, so a locked allocator is required.
- **Neutral**: packet 137 ADR-006 stays frozen as provenance; this decision supersedes its literal wording.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

- **Simplicity**: owner-first without a lane segment is the shortest form that still satisfies the rule and keeps the counter.
- **Systems**: touches sk-git docs, the allocator, the wrapper/reaper, and push enforcement — blast radius is why this is L3.
- **Bias**: solves the actual legibility problem, not a symptom; grounded in a verified snapshot.
- **Sustainability**: a locked allocator + validator makes the convention enforceable, not aspirational.
- **Value**: an owner-legible tree the operator can actually read.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Codify in sk-git SKILL.md ALWAYS #4 + references; back with `worktree-naming.sh`; enforce with a migration-tolerant `pre-push`. Deferred for operator review.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Launch-wrapper lane is exempt

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | GPT-5.6-SOL; orchestrator |

### Context

The wrapper (`.opencode/bin/worktree-session.sh`) creates machine-generated `work/{runtime}/{slug}` worktrees at session start; sk-git ALWAYS #4 already defines this as a separate, unnumbered, auto-reaped lane.

### Decision

The owner-first rule **exempts** the wrapper lane. Renaming wrapper sessions into `skilled/` would mix process identities with human branches and add global-counter allocation into concurrent startup. The exemption is narrow: only the wrapper may create it; it is local-only (never pushed as a feature branch); it carries an active-session marker; it is auto-reaped only after clean+merged+inactive are all proven; a wrapper session needing a durable PR branch is promoted to a normal `<skill>/{NNNN}-{slug}` worktree.

### Consequences

Preserves the two-lane design and avoids a startup-time counter dependency; the reaper must gain a session-activity marker and use the live integration base (ADR-003).

### Five Checks Evaluation

- **Scope**: keeps the machine lane machine-owned rather than forcing it through a human convention.

---

## ADR-003: Conservative, evidence-gated cleanup

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted; Phase-1 executed, remainder deferred |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (authorized the slice); GPT-5.6-SOL (plan) |

### Context

The local tree holds ~20 branches and ~40 worktrees. The primary checkout is dirty (150+ files) and on a concurrent session's branch; the auto-reaper checks a stale local `main` (~1400 behind v4) with no activity marker.

### Decision

Cleanup runs **from a separate clean control worktree, never the dirty/concurrent primary** (sk-git ALWAYS #15). Only merged, not-checked-out refs are deleted with `git branch -d` after a live re-check; stale worktrees are removed non-force only after clean+merged+owner-confirmed-inactive; detached worktrees are adjudicated individually (non-contained commits preserved into a conforming branch first); every unmerged branch is a per-item operator decision (KEEP/RENAME/ARCHIVE/DISCARD) with a verified `git bundle` before any `-D`. The reaper is hardened to use the live integration base and an activity marker before it may auto-reap.

**Executed (Phase-1 slice):** six merged, not-checked-out branches deleted (`system-speckit/023|024|026`, `wt/0030|0031|0032`), each verified an ancestor of `origin/skilled/v4.0.0.0` with tip and checkout re-checked immediately before deletion; OIDs recorded for recovery. No working tree was touched.

### Consequences

The tidy-up is safe and reversible; the bulk (worktree removals, unmerged decisions) is explicitly deferred to operator-gated steps.

### Five Checks Evaluation

- **Bias**: refuses the tempting bulk-clean; every destructive step earns its way through a live proof.

---

## ADR-004: New Level-3 packet under the sk-git track

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator; GPT-5.6-SOL |

### Context

Packet 137 explicitly deferred the sk-git codification and cleanup; this change owns a cross-cutting Git policy, an executable allocator, wrapper/reaper safety, push enforcement, a migration decision, and destructive cleanup evidence.

### Decision

Create a standard, non-phased **Level 3** packet at `.opencode/specs/sk-git/002-skill-scoped-worktree-naming` (sibling of `001-continuous-integration-workflow`), not a child of 137. Level 3 is warranted by the architecture decision and shared-repository blast radius even though the net code footprint is moderate. The recommended branch for the implementation work obeys the new grammar: `sk-git/{NNNN}-skill-scoped-worktree-naming` (number from the live allocator).

### Consequences

137 stays frozen as provenance; this packet is the working home.

### Five Checks Evaluation

- **Sustainability**: a dedicated packet keeps the policy, tooling, and cleanup evidence together.

---

## RELATED DOCUMENTS

- Charter: `spec.md`
- Plan: `plan.md`
- External analysis: `sol-worktree-plan.md`
- Provenance (frozen): `../../skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements/decision-record.md`
