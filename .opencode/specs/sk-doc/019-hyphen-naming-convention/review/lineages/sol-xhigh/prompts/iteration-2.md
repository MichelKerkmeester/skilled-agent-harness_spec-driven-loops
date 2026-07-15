DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 2 Prompt Pack

STATE SUMMARY: Iteration 2 of 10. Focus: security / rename apply boundary. Prior findings: P0=0 P1=2 P2=0. Coverage: 1/4. Stop policy is max-iterations, so convergence is telemetry only before iteration 10.

- Review target: '.opencode/specs/sk-doc/019-hyphen-naming-convention'
- Scope: naming-policy hazard decision, rename-engine apply contract, and shared disposable-fixture harness.
- State files: lineage-local config, JSONL, registry, strategy.
- Output: 'iterations/iteration-002.md' and 'deltas/iter-002.jsonl'.
- Constraint: LEAF-only; target is read-only; writes stay inside this lineage.
- Shared doctrine: '.opencode/skills/sk-code/code-review/references/review_core.md' loaded.
- Graph mode: graphless fallback because shared graph writes are outside the user-authorized artifact root.
