---
title: Deep Review Strategy
description: Review strategy for the sk-code 014 code-modes research packet, tracking dimension coverage, findings and next focus across the five-iteration lineage.
trigger_phrases:
  - "deep review strategy"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy

## 1. REVIEW CHARTER

- **Target**: `specs/sk-code/014-code-modes-research` (spec-folder, Level 2 phase parent with two Level 2 children)
- **Target type**: spec-folder. The reviewed artifact is documentation plus the research loop state each child carries; the implementation the packet claims to describe is `.skilled/skills/sk-code/sk-code-quality/` and `.skilled/sk-code-review/`, read as reference evidence only.
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop policy**: `max-iterations` with `maxIterations = 5`. Convergence is telemetry; every iteration is dispatched.
- **Success criteria**: every claim the packet makes about its own deliverable and closure state is checked against the tree; no P0/P1 left unadjudicated.
- **Constraints**: target is READ-ONLY. Writes are confined to the lineage artifact directory.

## 2. NON-GOALS

- Re-running `validate.sh` or `repair-derived.cjs` (they write derived artifacts outside the lineage write surface).
- Judging the substance of the research recommendations themselves (which recommendations are best); only their evidence labels, traceability and internal consistency are in scope.
- Attributing every `.skilled/` working-tree change to this packet; the packet records that concurrent CI wiring touched those paths.

## 3. STOP CONDITIONS

- Five dispatched iterations reached (`max-iterations`).
- Any active P0 keeps the verdict at FAIL regardless of convergence telemetry.

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
- P2 (Suggestions): 11
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 6. WHAT WORKED

- Counting every deliverable the child specs name against the tree before judging any prose claim. It turned a suspected missing-deliverable finding into a confirmed-clean item and kept the review from reporting a false P1 (iteration 1).
- Machine-matching every `[SOURCE: path:line]` tag against the quoted text at that line. 301 tags checked in one pass, with a per-file mismatch count that made post-close drift visible instead of arguable (iteration 2).
- Reading each acceptance row's published command and running the read-only ones. It separated "the row is wrong" from "the row is right and the criterion is stale" (iteration 3).
- Reading the executor and containment rows of the implementation summary side by side. The control gap only appears when the permission mode and the guard defect are read together (iteration 4).
- Comparing the parent's directive, change list and duplicated verification against the child records. Every parent-level defect found is a document that was not updated when a child recorded a decision (iteration 5).

## 7. WHAT FAILED

- Treating a `find -maxdepth 3` inventory as the packet's file list. It hid `research/iterations/` and `research/deltas/`, and an early read looked like a missing-deliverable P0 until the directory was listed directly. Depth must be checked before an absence is reported (iteration 1).
- Attempting `git diff --stat <baseline> -- <two paths>` piped into `tail`. The pipe returned an IPC error instead of output, and the command had to be re-run unpiped. Piped git output is not evidence until it prints (iteration 2).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 9. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 11. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: root `spec.md`, `goal.md`, `graph-metadata.json`, `description.json`; children `001-quality-mode-research/` and `002-review-mode-research/` with `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`, `goal.md`; each child's `research/` run state (`deep-research-state.jsonl`, `deep-research-config.json`, `research.md`, `synthesis-v1.md`, `resource-map.md`, `iterations/`, `deltas/`).
- **Behavior claims to verify**: fifteen iterations per child; stop reason `maxIterationsReached`; ranked recommendation counts; "no file under `.skilled/` changed"; strict validation passing; source-tag line numbers in the child specs resolving against `.skilled/skills/sk-code/sk-code-review/SKILL.md`.
- **Reuse and conventions**: Level 2 phase-parent layout (`system-spec-kit/references/structure/folder-structure.md`); acceptance-criteria closure gate convention (`Met`/`Waived`/`Superseded`, waiver must name an ADR); sibling closed packets in `specs/sk-code/` used as the comparison baseline for metadata status fields.
- **Review risks and gaps**: the packet was produced by two deep-research loops whose per-iteration narratives are large; only the aggregate state records and the synthesis are sampled. `validate.sh` claims cannot be re-run from this lineage because the validator writes derived artifacts outside the lineage write surface, so those claims are recorded as not re-verified rather than as pass or fail.

## 12. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending] | - | [details] |
| `checklist_evidence` | core | [pending] | - | [details] |
| `skill_agent` | overlay | [pending] | - | [details] |
| `agent_cross_runtime` | overlay | [pending] | - | [details] |
| `feature_catalog_code` | overlay | [pending] | - | [details] |
| `playbook_capability` | overlay | [pending] | - | [details] |
<!-- MACHINE-OWNED: END -->

## 13. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

## 14. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1792944728998-jpqv4b, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-25T16:23:26Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
