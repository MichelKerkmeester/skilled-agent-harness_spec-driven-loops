DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 1 Prompt Pack

STATE SUMMARY: Iteration 1 of 10. Focus: correctness / topology coherence. Prior findings: P0=0 P1=0 P2=0. Coverage: 0/4. Stop policy is max-iterations, so convergence is telemetry only before iteration 10.

- Review target: `.opencode/specs/sk-doc/017-hyphen-naming-convention`
- Scope: root phase-parent contract, phase-tree generator/manifest, filesystem topology, root graph metadata.
- State files: lineage-local config, JSONL, registry, strategy.
- Output: `iterations/iteration-001.md` and `deltas/iter-001.jsonl`.
- Constraint: LEAF-only; target is read-only; writes stay inside this lineage.
- Shared doctrine: `.opencode/skills/sk-code/code-review/references/review_core.md` loaded.
- Graph mode: graphless fallback because shared graph writes are outside the user-authorized artifact root.
