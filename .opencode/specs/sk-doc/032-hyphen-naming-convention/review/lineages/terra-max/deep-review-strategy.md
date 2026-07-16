---
title: "Deep Review Strategy: 032 hyphen naming convention (terra-max lineage)"
description: "Bounded five-pass governance and execution-readiness audit for the 032 phase-parent packet."
---

# Deep Review Strategy

## 1. REVIEW CHARTER

- Target: `.opencode/specs/sk-doc/032-hyphen-naming-convention` (spec folder).
- Scope: parent spec and metadata plus bootstrap, policy, final-gate, and closeout children named in `deep-review-config.json`.
- Non-goals: implementation changes, target-document edits, and execution of planned migration commands.
- Stop policy: run exactly five passes; convergence signals are telemetry until the cap.

## 2. TOPIC

Review the 032 repo-wide hyphen naming program for executable plan correctness, safety controls, traceability, and maintainability.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: parent `spec.md`, `graph-metadata.json`, `manifest/phase-tree.json`, and phase 000/010/011 artifacts.
- Behavior claims: the parent must resolve to an executable phase topology; phase 000 must be runnable before later dependencies; final gate and closeout must name the current topology.
- Reuse and conventions: phased packets use a phase tree and child specs; new worktrees use the repository allocation workflow.
- Risks and gaps: this is a planning packet with no migration implementation yet; the review is bounded to high-risk orchestration and document consistency.
- Resource Map Coverage: `resource-map.md` not present; coverage gate skipped.

## 7. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | pending | Compare executable plan claims to current packet topology and repository workflow. |
| `checklist_evidence` | core | pending | Check bootstrap and final-gate checklist claims against their owning specs. |
| `feature_catalog_code` | overlay | pending | Inspect only where the naming program makes catalog-root claims. |
| `playbook_capability` | overlay | pending | Inspect only documented executable workflows relevant to the migration. |

## 8. FILES UNDER REVIEW

| File | Purpose |
|---|---|
| `spec.md` | Parent requirements, phase map, sequencing. |
| `graph-metadata.json` | Current top-level child graph. |
| `manifest/phase-tree.json` | Authoritative re-decomposition topology. |
| `000-worktree-baseline-and-census/{spec,plan,checklist}.md` | First-run bootstrap contract. |
| `001-convention-policy-and-scope/decision-record.md` | Program decisions and phase count claim. |
| `010-whole-repo-gate/spec.md` | Final verification dependency contract. |
| `011-integrate-and-closeout/spec.md` | Final closeout dependency contract. |

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

## 10. WHAT WORKED

- Start with source-of-truth topology and first-phase bootstrap requirements.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Implementation correctness is not reviewable because the migration remains planned and no owned implementation artifacts exist.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->

## 12. REVIEW BOUNDARIES

- Max iterations: 5.
- Convergence threshold: 0.10 (telemetry only before the fifth iteration).
- Session: `fanout-terra-max-1784064061456-29xqh9`; lineage mode: new; generation: 1.
- Executor metadata: cli-codex / gpt-5.6-terra / max / fast.
- Writable boundary: this lineage directory only. The reviewed target is read-only.
