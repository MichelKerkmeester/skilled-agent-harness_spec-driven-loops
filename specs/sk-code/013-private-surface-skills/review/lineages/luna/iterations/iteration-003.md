# Deep Review Iteration 3

## Dispatcher

- Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Mode: review
- Executor: cli-codex, gpt-6-luna
- Dimension: traceability
- steer.md was checked and absent. State, registry, configuration, and strategy were read before this pass.

## Dimension

Traceability: checked whether the parent completion claims satisfy child acceptance closure rules and whether sampled phase 5 evidence references support their summaries.

## Files Reviewed

- specs/sk-code/013-private-surface-skills/spec.md — parent status and phase map, lines 50 and 133–137.
- specs/sk-code/013-private-surface-skills/goal.md — completion checklist and progress table, lines 89 and 111.
- specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md — closeability rule and AC-014, lines 33–35 and 70.
- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md — evidence-backed AC-012/AC-015 and closure statement, lines 68, 71, 375.
- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md — final-tip output excerpts, lines 41–52 and 91–102.
- specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md — positive and negative control excerpts, lines 83–94 and 131–137.
- .skilled/skills/sk-code/SKILL.md and .skilled/skills/sk-code/graph-metadata.json — focused exact search for removed surface identifiers.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Packet completion status contradicts active phase records** — specs/sk-code/013-private-surface-skills/spec.md:50 — Refined from iteration 1: phase 2 acceptance criteria explicitly say a phase is closeable only when every row is Met, Waived, or Superseded, yet AC-014 is Unmet. The root and goal completion claims therefore conflict with the child closure gate. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/goal.md:89] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:34] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:70]
   Finding ID: LUNA-R1-P1-001
   Finding class: phase_status_drift
   Scope proof: The conflicting completion records are in the target parent and phase 2 acceptance documents.
   Affected surface hints: packet-status, phase-transition, completion-gate
   Case: An operator relies on the root Complete mark while phase 2 still has a required Unmet acceptance row.

### P2 Findings

1. **Staged type-change paths bypass the local-skill guard** — .skilled/scripts/git-hooks/pre-commit:111 — Carried forward from iteration 2; no new counterevidence was found in this traceability pass. [SOURCE: .skilled/scripts/git-hooks/pre-commit:111]
   Finding ID: LUNA-R2-P2-001
   Finding class: commit_guard_diff_filter_gap
   Scope proof: The hook and its guard contract are in the declared scope.
   Affected surface hints: pre-commit-guard, private-skill-path, publication-boundary
   Case: A previously tracked local-* path changes file type and a private payload is staged under the same name.

## Traceability Checks

- spec_code: fail — the parent and goal claim completion while phase 2 AC-014 remains Unmet.
- checklist_evidence: fail — phase 2's own closeability contract says an Unmet row prevents closure.
- skill_agent: partial — the focused search found no removed surface identifiers in the sk-code skill guide or graph metadata; broader mapping checks remain.
- agent_cross_runtime, feature_catalog_code, and playbook_capability: pending for the final stabilization pass.

## Integration Evidence

Phase 5's final-tip and corpus-boundary evidence references exist. The final-tip output includes the reported path and blob counts, while the corpus-boundary record has both an indexed control and a private-marker negative result with a positive control that adds the ignore rule back. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md:44] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:83] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md:133]

## Edge Cases

- Phase 2 is not closeable under its own acceptance rule while AC-014 is Unmet, regardless of later phase records marked Complete.
- This pass directly read the sampled phase 5 evidence but did not re-run its commands or validators.

## Confirmed-Clean Surfaces

- The sampled phase 5 AC-012 and AC-015 evidence paths exist, and their cited output excerpts support the summarized result values.
- The focused exact search returned no removed surface identifier hits in the sk-code skill guide or graph metadata.

## Ruled Out

- A missing or mismatched evidence pointer in the sampled phase 5 final-tip and corpus-boundary rows was not found.

## Next Dimension

Maintainability. Review whether implementation and packet instructions preserve a manageable single source of truth across repeated scanners and phase handoffs.

## Next Focus

- Dimension: maintainability
- Focus area: inspect duplicated local-skill boundary rules, generated-artifact ownership, and handoff references for drift-prone maintenance paths.
- Reason: the packet spans multiple consumers and mirrors; repeated logic can diverge after the current phase work.
- Rotation status: first pass
- Blocked/productive carry-forward: direct acceptance-to-evidence reads were productive; graph traversal remains unavailable under lineage scope.
- Required evidence: named generator and scanner sources plus their owning phase requirements.

## SCOPE VIOLATIONS

- The YAML graph seed and per-iteration graph upsert target packet-root graph metadata outside the bound lineage path. Those writes remain skipped; this pass used graphless search coverage.
- The prior out-of-scope continuity write is recorded in iteration 1; no new outside-lineage write was made in this pass.

## Verdict

The active P1 is confirmed by the child closure gate. The P2 security finding remains open. No new finding was added.

Review verdict: CONDITIONAL
