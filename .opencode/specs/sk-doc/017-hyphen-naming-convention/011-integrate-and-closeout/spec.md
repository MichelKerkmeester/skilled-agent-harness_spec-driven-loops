---
title: "Feature Specification: integrate and close out (017 phase 011)"
description: "The migration candidate may have passed the whole-repo gate against an earlier base while the integration target continues to move. This phase rebases the migration branch onto the latest base, reruns the exact phase 010 gate on the resulting commit, fast-forwards the integration target only after a green result, and closes the packet with a consistent parent rollup."
trigger_phrases:
  - "integrate and close out migration"
  - "hyphen naming phase 011"
  - "rebase rerun fast forward closeout"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/011-integrate-and-closeout"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the final integration, gate rerun, and parent-rollup contract"
    next_safe_action: "Execute after phase 010 has a green candidate report"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/010-whole-repo-gate/decision-record.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The final gate must run after rebasing onto the latest base, not only on the pre-rebase migration head."
      - "Integration is fast-forward-only after the post-rebase gate passes."
      - "Closeout reconciles phase and parent metadata; it does not rewrite frozen history or weaken the gate."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Integrate and close out

> Phase adjacency under the 017 parent: predecessor `010-whole-repo-gate`; no successor. Integration and closeout are allowed only after the post-rebase gate passes.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/011-integrate-and-closeout |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 011 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase 010 report proves a particular migration candidate, but the integration base can advance before that candidate is merged. Integrating without rebasing and rerunning the gate would leave the final commit unverified against current base changes; closing the packet without a rollup would also leave phase status, parent status, and evidence inconsistent.

This phase rebases the migration branch onto the latest base, reruns the unchanged phase 010 gate on the exact post-rebase candidate, fast-forwards the integration target only after it passes, and records the final phase and parent closeout state.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fetch and record the latest integration base, then rebase the migration branch onto it with conflicts resolved against the approved 017 policy and frozen rename map.
- Rerun the complete phase 010 gate on the rebased candidate without substituting a smaller suite or a different baseline.
- Fast-forward the integration target only after the post-rebase gate is green and the worktree is clean.
- Reconcile phase summaries, checklists, handoff evidence, parent phase status, and the final closeout/rollup so no document claims a conflicting state.

### Out of Scope
- Performing additional filesystem renames, reference rewrites, alias changes, or policy redesign; any regression returns to its owning phase.
- Merging with a non-fast-forward commit, bypassing the post-rebase gate, or accepting unresolved conflicts.
- Rewriting frozen history or changing the declared exemption set to make the final gate pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The migration branch is based on the latest integration base | The latest base SHA is recorded, the migration branch is rebased onto it, conflicts are resolved and reviewed, and the resulting candidate SHA is recorded. |
| REQ-002 | The final candidate passes the whole-repo gate | The unchanged phase 010 checklist and decision record are rerun against the post-rebase candidate; all P0 domains pass with evidence tied to that exact SHA. |
| REQ-003 | Integration preserves a linear history | The target advances with a fast-forward-only operation after the gate; no merge commit, forced overwrite, or unreviewed side branch is accepted. |
| REQ-004 | Closeout and parent rollup are consistent | Phase 009, phase 010, and phase 011 evidence, checklist state, implementation status, and the parent phase map/rollup agree on the final result and next state. |
| REQ-005 | The final worktree is clean and reproducible | The post-gate tracked-state check is clean, the final commit identity is recorded, and all commands/logs needed to reproduce the final verdict are linked. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The final integrated commit is the exact candidate that passed the complete phase 010 gate after rebasing onto the latest base.
- **SC-002**: Integration is fast-forward-only and leaves no unresolved conflict or unexpected tracked mutation.
- **SC-003**: The 017 parent rollup and closeout documents describe one consistent final state.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Base drift can reintroduce path references, change test discovery, or alter rename similarity after phase 010. The mitigation is to treat the pre-rebase report as historical evidence and require a complete rerun on the post-rebase candidate. Conflict resolution is high risk around renamed paths; the frozen map, policy, and phase checklists are the source of truth, and unresolved ambiguity stops integration. A failed fast-forward or dirty worktree leaves the target unchanged and returns the branch for repair.

This phase depends on a green phase 010 report, access to the latest base, the isolated integration worktree, and the parent packet's closeout metadata. It does not authorize any change outside the 017 packet's integration and documentation scope.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Execution must record the exact latest-base ref and final integrated commit before the parent rollup is marked complete.
<!-- /ANCHOR:questions -->
