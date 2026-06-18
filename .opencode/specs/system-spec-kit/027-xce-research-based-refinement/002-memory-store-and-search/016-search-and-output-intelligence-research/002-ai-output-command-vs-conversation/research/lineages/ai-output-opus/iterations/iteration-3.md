The fan-out research lineage is complete. All artifacts written within the `ai-output-opus` lineage dir only (no paths outside it touched):

- `deep-research-config.json`, `deep-research-strategy.md` (with charter), `deep-research-state.jsonl` (init → 5 iterations → convergence → synthesis), `deep-research-findings-registry.json`, `deep-research-dashboard.md`
- `iterations/iteration-001..005.md` (one KQ per iteration)
- `research.md` (synthesis)

**Loop:** phase_init → phase_main_loop (5/5 iterations, converged on all-questions-answered + max_iterations) → phase_synthesis. newInfoRatio trend 0.90 → 0.70 → 0.62 → 0.50 → 0.28. Quality gates pass.

**Core result:** the command-adherence gap is a *salience-driven conditional misfire*, not broken `$ARGUMENTS` injection — DeepSeek negates the empty-guard; Kimi (always) and MiMo (intermittently) anchor on the salient ask-path the contract reads first. Fix is structural: a deterministic `ARGS_PRESENT`+`QUERY` shell-injected header, salience inversion (execute-first), an imperative no-ask guard, mandated similarity-0–1 fields on all surfaces, and writing contracts in the COSTAR register. Confirmed findings (F1/F2/F4) are multi-source cited; design findings (F3/F5) are marked inferred with named confirmation experiments. Live repro was treated as already-done per `grounding-evidence.md` (charter scoped out re-running external small-model dispatch from inside a research session).

FANOUT_LINEAGE_COMPLETE:ai-output-opus