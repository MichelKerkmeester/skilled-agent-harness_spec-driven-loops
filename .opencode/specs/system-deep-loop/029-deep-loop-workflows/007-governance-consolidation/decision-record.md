---
title: "Decision Record: supersede R1 consolidated-root governance; per-mode trees are intentional"
description: "ADR superseding phase-007 requirement R1 (one consolidated feature_catalog + manual_testing_playbook root). The shipped five per-mode governance trees are intentional because the merged skill's mode packets are self-contained, which makes the CP- ID-collision concern R1 targeted moot under per-mode partitioning."
trigger_phrases:
  - "supersede r1 consolidated governance root"
  - "per-mode feature catalog playbook intentional"
  - "cp- id collision moot per-mode partitioning"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/007-governance-consolidation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR superseding R1; per-mode trees intentional"
    next_safe_action: "Orchestrator reconciles parent Phase Map for phase 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-007-decision-record"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: supersede R1 consolidated-root governance

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Supersede R1; the five per-mode governance trees are intentional

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | Operator (approved) + orchestrator |
| **Phase** | 007 (governance consolidation) |

### Context

Phase 007's R1 required "one feature_catalog root + one manual_testing_playbook root, partitioned by mode (context/research/review/improvement/council)." R1 existed to solve a specific risk: the five source skills reused `CP-` feature-ID prefixes across research, review, and improvement at different bands, so a naive consolidation would have produced `CP-` ID collisions inside a single shared index. R1 proposed to resolve those collisions by mode-qualifying them at one merged index.

The merge shipped differently. The merged skill keeps five self-contained mode packets, and each packet carries its own governance under `.opencode/skills/deep-loop-workflows/{deep-context,deep-research,deep-review,deep-improvement,ai-council}/{feature_catalog,manual_testing_playbook}/`. All five per-mode `feature_catalog` and `manual_testing_playbook` trees are present; no consolidated `deep-loop-workflows/feature_catalog` or `deep-loop-workflows/manual_testing_playbook` root exists. This is the divergence between R1's MUST and the shipped reality that this ADR resolves.

### Constraints

- The shipped five per-mode trees are the operator-approved intentional layout; this ADR records that decision, it does not authorize building or consolidating anything.
- Scope is the phase-007 child only; the parent `152/spec.md` Phase Map is reconciled centrally by the orchestrator, not here.
- No file renumbering and no `CP-` ID changes are performed.

### Decision

**We chose**: supersede R1. The five per-mode governance trees are the intentional, correct layout; the consolidated-root requirement is withdrawn.

**How it works**: because the merged skill's mode packets are self-contained, governance is owned per packet rather than at a shared root. Per-mode partitioning gives each mode its own `feature_catalog` and `manual_testing_playbook` namespace, so the `CP-` ID-collision concern R1 was built to solve cannot occur: identical `CP-` IDs in different mode trees never share an index, so they never collide. The reason R1 wanted a single root (collision-safe IDs) is satisfied for free by the per-mode boundary, which makes the single root unnecessary.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Build the R1 consolidated root now (merge five trees into one, mode-qualify `CP-` IDs at the index) | Reintroduces the collision risk per-mode partitioning already removes, churns ~198 files plus their bidirectional catalog/playbook cross-references, and contradicts the self-contained mode-packet architecture the merge shipped. |
| Leave R1 open as an unmet MUST | Leaves the phase blocked on a requirement the shipped design intentionally does not satisfy, and leaves the governance divergence unresolved in the record. |

**Why this one**: per-mode partitioning already delivers R1's underlying goal (no `CP-` collisions) without a single root, so the cheapest correct move is to record that R1 is superseded rather than rebuild against it.

### Consequences

- Positive: the governance divergence is resolved in the record; the self-contained mode-packet architecture stays intact; no ~198-file churn and no `CP-` cross-reference breakage.
- Trade-off: governance is per-packet, so there is no single consolidated index across modes. A future cross-mode rollup, if ever wanted, must aggregate the five per-mode trees rather than read one root.
- Follow-up: the parent `152/spec.md` Phase Map reflects 007 as complete via central orchestrator reconciliation (out of scope here).

### Implementation

No build or consolidation work is performed. This ADR records the operator-approved decision and is paired with the phase-007 reconciliation: `spec.md` R1 is annotated as superseded (pointing here) with Status set to complete, and `graph-metadata.json` status moves to `complete` with this file added to `key_files`. The shipped five per-mode trees are verified present at `.opencode/skills/deep-loop-workflows/<mode>/{feature_catalog,manual_testing_playbook}/`, with no consolidated root.

<!-- /ANCHOR:adr-001 -->
