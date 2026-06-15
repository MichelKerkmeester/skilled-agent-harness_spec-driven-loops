# Context Report: deep-improvement README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the three lanes, the five scoring dimensions and the promotion gate. SKILL.md is v1.13.0.0.

---

## 1. PURPOSE

`deep-improvement` is a proposal-first evaluator skill. It tests whether a bounded agent `.md` file, a model or prompt framework, or a skill can be improved by writing packet-local candidates, scoring them deterministically and promoting only after both score evidence and operator approval pass. It never touches the canonical file before the gates clear.

## 2. PROBLEM

Editing an agent prompt is normally guesswork: you reword a rule, the prompt reads better, you ship it, and you never learn whether the agent got stronger or only different. Integration drift across runtime mirrors goes unnoticed because nothing checks every surface the agent touches. Promotion risk is hard to audit because no paper trail links score evidence to the mutation decision, and rollback is neither systematic nor comparable to the pre-promotion state.

## 3. THREE LANES

- Lane A, Agent-Improvement (`/deep:start-agent-improvement-loop`): evaluator-first bounded agent improvement with an integration scan, a dynamic profile, five-dimension scoring, packet-local candidates, guarded promotion and rollback, Pareto trade-off detection and a mutation-coverage graph.
- Lane B, Model-Benchmark (`/deep:start-model-benchmark-loop`): benchmark a model or a prompt framework against repeatable fixtures, reusing the same candidate, dispatcher and scorer seams, and promote from a benchmark report.
- Lane C, Skill-Benchmark (`/deep:start-skill-benchmark-loop`): benchmark a skill's real-world routing, discovery, efficiency and usefulness, and emit a ranked, remediable report.

## 4. INVOCATION (verified)

Lane A: `/deep:start-agent-improvement-loop ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}`. Lanes B and C: `/deep:start-model-benchmark-loop` and `/deep:start-skill-benchmark-loop`, both entering through `scripts/shared/loop-host.cjs`. Standalone scripts exist for `scan-integration.cjs`, `generate-profile.cjs` and `score-candidate.cjs`. Lane A writes packet-local candidates under `{spec_folder}/improvement/candidates/`, appends to `agent-improvement-state.jsonl`, `improvement-journal.jsonl` and `mutation-coverage.json`, and refreshes the dashboard and `experiment-registry.json` through `reduce-state.cjs`. Lane B writes to `sk-prompt-small-model/benchmarks/{run_label}/`. All lanes write packet-local evidence only; the canonical mutation requires explicit guarded promotion. Allowed tools include Write and Edit, so unlike the read-only deep loops this one can mutate, but only behind the promotion gate.

## 5. FIVE SCORING DIMENSIONS (Lane A)

| Dimension | Weight | Measures |
|---|---|---|
| Structural Integrity | 0.20 | Agent template compliance (required sections present) |
| Rule Coherence | 0.25 | ALWAYS / NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands and skills reference the agent |
| Output Quality | 0.15 | Output-verification items present, no placeholder content |
| System Fitness | 0.15 | Permission alignment, valid resource references, complete frontmatter |

Promotion is gated: a candidate is promoted only when its scored evidence clears the bar and the operator approves, with a legal-stop bundle and rollback to the recorded pre-promotion state.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions and the smart router for the three lanes |
| `references/shared/quick_reference.md` | Operator cheat sheet for commands and scripts |
| `references/` | Lane references, scoring rubric and integration-scan rules |
| `scripts/shared/loop-host.cjs` | Shared loop host entry for Lanes B and C |
| `scripts/agent-improvement/` | scan-integration, generate-profile, score-candidate and reduce-state |
| `feature_catalog/` | Feature inventory across its five categories |
| `manual_testing_playbook/` | Validation scenarios |

## 7. BOUNDARIES

Proposal-first: it never mutates a canonical file before the score and approval gates pass. Sibling deep loops: `deep-research`, `deep-review`, `deep-context`, `deep-ai-council`; all ride the shared `deep-loop-runtime`. `system-spec-kit` owns the spec folder the candidates live in. The model-benchmark lane writes into the `sk-prompt-small-model` benchmarks tree.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Candidate not promoted: the score did not clear the bar or the operator declined; read the journal and the dashboard.
- Integration scan flags drift: a runtime mirror is out of sync; the scan lists each surface.
- FAQ: proposal-first versus editing directly; what the five dimensions measure; the three lanes; how rollback works.

## 9. STALE FACTS (must fix on rewrite)

1. The current README says the feature catalog has 4 categories; it has 5 (evaluation-loop, integration-scanning, scoring-system, model-benchmark-mode, skill-benchmark). The rewrite names the lanes and avoids a brittle count.
2. The current README cites a specific playbook scenario and category count that drifted; the rewrite describes the package without hard counts.
3. The skill was renamed from `deep-agent-improvement` to `deep-improvement`; the rewrite uses only the current name. The new template carries no version line.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered the lanes, purpose and capabilities; iteration 2 verified invocation, the five dimensions, the promotion gate and stale facts, each cited to a file and line. Converged before the 3-iteration ceiling.
