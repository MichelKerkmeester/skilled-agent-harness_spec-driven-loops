# Iteration 13: Should `mutation_boundaries:` become a cross-family workflow-YAML convention?

## Focus

Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter-10; adoption decision deferred to this iteration). The inventory established that the schema appears in exactly 10 doctor route YAMLs and 0 non-doctor YAMLs. This iteration makes the adoption decision.

## Actions Taken

1. Re-ran `grep -rn "mutation_boundaries:"` across `.opencode/commands/**/*.yaml` — confirmed 10 doctor asset files declare the block (memory, embeddings, causal-graph, code-graph, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, update). `doctor_fable-mode.yaml` still lacks it (P1-D2 confirmed still open — uses only a prose `read_only_invariant:` field at line 20-24).
2. Read the full `mutation_boundaries:` schema content in `doctor_memory.yaml:64-93` to characterize its structure: `allowed_targets` (glob patterns), `forbidden_targets` (glob patterns), `enforcement` (prose), `validator` (sub-block with name/runs/steps/on_pass/on_fail). The schema models filesystem-path-target validation with realpath resolution and glob matching before any write.
3. Read the two competing mutation-safety schemas outside `mutation_boundaries:`: (a) `deep_research_confirm.yaml:43-62` uses `forbidden_operations:`/`safe_operations:`/`event_policy:`/`halt_hook_rule:`/`boundary_labels:` — a **behavioral** dry-run constraint model (what operations must not occur), not a path-target model; (b) `doctor_code-graph.yaml:93-109` and `doctor_skill-advisor.yaml:99` use `approval_gates:` — a **human-checkpoint** model (when to prompt for confirmation). Note: code-graph and skill-advisor use BOTH `mutation_boundaries:` AND `approval_gates:` (orthogonal, not competing).
4. Cross-referenced the three schema families against other command families' mutation models: create/speckit create new paths dynamically (governed by AGENTS.md SCOPE LOCK), sk-git delegates to git's own safety model, deep uses behavioral dry-run boundaries. None of these have pre-enumerated allowed/forbidden target sets that `mutation_boundaries:` models.

## Findings

### Decision: `mutation_boundaries:` should NOT become a cross-family convention — it is correctly doctor-specific

**Severity: P2 (design decision, no defect)** — resolves the carried-forward open question (since iteration 6).

**Rationale:**

1. **Domain fit mismatch.** The `mutation_boundaries:` schema models filesystem-path-target validation (`allowed_targets`/`forbidden_targets` as glob patterns + `validator` with realpath resolution and glob matching). This is the doctor subsystem's unique mutation-safety concern: diagnosing and optionally repairing specific DB/file targets while guaranteeing no write escapes the allowed set. No other command family has this need.

2. **Other families use semantically different safety models.** The deep family's `forbidden_operations:` block (`deep_research_confirm.yaml:47-51`) models **behavioral** constraints — "executor dispatch must not occur", "state mutation must not occur" — not path-target constraints. Promoting `mutation_boundaries:` to deep would be a category error: behavioral constraints are about *what operations* are forbidden, path-target constraints are about *which files* may be touched.

3. **Create/speckit families create new paths dynamically.** They don't have a pre-enumerated set of allowed write-targets; spec-folder paths are determined at runtime from user input. `mutation_boundaries:` would require an empty or `<active-spec-folder>/**` `allowed_targets` list that provides no real validation value over AGENTS.md's SCOPE LOCK rule.

4. **Over-abstraction risk.** Per AGENTS.md §4 anti-pattern ("Wrong abstraction"): forcing a doctor-specific path-validation schema onto families with different mutation models would create coupling without shared semantics.

5. **Within-doctor standardization is the real priority.** The more valuable consistency fix is internal to doctor: `fable-mode` still lacks the block (P1-D2), and doctor already runs two orthogonal schemas (`mutation_boundaries:` for path-safety + `approval_gates:` for human checkpoints in code-graph/skill-advisor) that would benefit from a documented composition rule, not cross-family promotion.

**If a cross-family mutation-safety convention IS desired:** define a NEW lighter shared schema (e.g., `mutation_safety: { declared_class: read-only|add-only|mutates, forbidden_targets: [...] }`) rather than promoting the doctor-specific `mutation_boundaries:` block with its elaborate `validator` sub-structure.

### Confirmed still-open (re-verified, not new)
- **P1-D2** (`f-iter006-003`): `doctor_fable-mode.yaml` still lacks `mutation_boundaries:` — confirmed this iteration. The file has only a prose `read_only_invariant:` block (line 20-24) and no structured path-target validation. Fix unchanged: add a `mutation_boundaries:` block consistent with its 10 siblings' schema.

## Questions Answered

1. **Should `mutation_boundaries:` become a cross-family workflow-YAML convention?** (carried since iteration 6, deferred since iteration 10) — **RESOLVED: No.** The schema is correctly doctor-specific. It models filesystem-path-target validation unique to the doctor operating model. Other families have fundamentally different mutation-safety needs (behavioral constraints, dynamic-path creation, git-delegated safety). Cross-family promotion would be over-abstraction. The real consistency priority is within-doctor standardization (fable-mode still missing the block).

## Questions Remaining

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried since iteration 5)
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (carried since iteration 5)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried since iteration 6)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6 — P1-D1 resolved the "is the header wrong" sub-question; the "should it be wired" sub-question remains)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried since iteration 2)
- Should create-agent call the system-spec-kit command workflow directly? (carried since iteration 5 — answered in principle at iteration 7/10, implementation not yet applied)
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase? (carried since iteration 3)

## Next Focus

This iteration resolved its assigned focus question (mutation_boundaries adoption decision). The remaining carried-forward questions are either answered-in-principle-awaiting-implementation (create-agent/speckit.md) or broad-sweep questions that would each consume a full iteration budget. Recommended next focus for iteration 14: pick one unaddressed carried question and drive it to resolution — the highest-value candidate is the router-level allowed-tool overgrant audit (carried since iteration 5, never investigated), which would close P1-X1's adjacent finding and potentially surface new P1/P2 findings across the 62-YAML surface.
