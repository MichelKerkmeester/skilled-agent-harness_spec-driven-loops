# Context Report: deep-ai-council README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the council model, invocation and artifacts.

---

## 1. PURPOSE

`deep-ai-council` is a planning-only deep loop that runs a multi-seat AI council: two or three distinct reasoning lenses propose a plan independently, adversarially critique each other, converge on a recommendation and persist auditable packet-local `ai-council/**` artifacts. It recommends plans and never implements them.

## 2. PROBLEM

When a plan carries real trade-offs (an architecture decision, a multi-path refactor, a high-risk change), a single AI answer is one confident guess with no record of what it ruled out. Hand-running "ask three models" gives diversity but no convergence rule, no persistence and no audit trail. A planner needs structured disagreement and a replayable state log so the team can see why a plan won, not just what won.

## 3. MODES & CAPABILITIES

- In-CLI mode (primary): every seat in a round uses the active runtime's own model bench (for example Opus, Sonnet and Haiku on Claude Code), so no external dispatch is needed.
- External-CLI mode (secondary): a different AI vantage dispatched through `cli-claude-code`, `cli-codex` or `cli-opencode`, one CLI per round, never mixing executors in a round.
- Depth 0 (parallel) dispatches 2 to 3 seats at once via the Task tool; Depth 1 (LEAF) runs inline with `sequential_thinking` and dispatches no sub-agents.
- Deep mode: a multi-topic session driven by `/deep:ask-ai-council:auto` and `:confirm`, iterating session then topic then round with cost guards and adjudicator-verdict stability.

## 4. INVOCATION (verified)

Two surfaces. The single-round planner is the `@ai-council` LEAF agent (`.opencode/agents/ai-council.md`), which hands recommendations, risk analysis and packet-local artifacts back to the caller. The iterative multi-topic deep mode is the `/deep:ask-ai-council:auto` or `:confirm` command (`references/convergence/depth_dispatch.md`), which loads `deep_ask-ai-council_{auto,confirm}.yaml`. It writes a packet-local tree under `specs/<track>/<NNN-name>/ai-council/`: `ai-council-config.json`, `ai-council-strategy.md`, the append-only `ai-council-state.jsonl`, `seats/round-NNN/`, `deliberations/`, `critiques/`, `failed/` and `council-report.md`. Persistence runs through `scripts/persist-artifacts.cjs` and `scripts/advise-council-completion.cjs`.

## 5. COUNCIL MODEL

Six strategy lenses give seats distinct mandates (Analytical, Creative, Critical, Pragmatic, Holistic, Research, each with a temperature in `references/patterns/seat_diversity_patterns.md`); a round runs 2 or 3 seats and never more. Three critique roles test the leading plan before convergence: Hunter (attacks for missed edge cases and weak evidence), Skeptic (defends, separating real flaws from intended trade-offs) and Referee (adjusts scores). Convergence is two-of-three seats agreeing on the material plan with no new high-severity blocker from critique; hitting `max_rounds` emits `non-converged` rather than a fake consensus.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, smart router, the council protocol |
| `references/convergence/` | Convergence signals and depth-dispatch rules |
| `references/patterns/` | Seat-diversity patterns (the six lenses) |
| `references/scoring/` | The scoring rubric and the Hunter / Skeptic / Referee roles |
| `references/structure/` | The `ai-council/**` artifact folder layout |
| `references/integration/` | How the council hands off to implementation |
| `scripts/persist-artifacts.cjs` | Writes the packet-local artifact tree |
| `scripts/advise-council-completion.cjs` | Verifies the final completion event |

## 7. BOUNDARIES

Planning only: it recommends and never implements. It is not a single-model planner (that loses the disagreement record) and not an implementation agent. Sibling deep loops: `deep-research` (investigation), `deep-review` (code audit), `deep-context` (codebase context); all four ride the shared `deep-loop-runtime`. Implementation is handed to `@code` or the caller; `system-spec-kit` owns the spec folder the artifacts live in.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Council emits `non-converged`: it hit `max_rounds` without two-of-three agreement; read the failed-round forensics rather than forcing a pick.
- Seats look too similar: raise seat diversity by assigning distinct lenses, or add a round.
- FAQ: planning versus implementing (it never implements); when to use a council over a single plan; what the two-of-three rule means; where the audit trail lives.

## 9. STALE FACTS

The current README's claims about modes and counts must be checked against SKILL.md and the references on rewrite; the deep mode `/deep:ask-ai-council:auto` and `:confirm` are real (documented in `references/convergence/depth_dispatch.md`). The new template carries no version line, so a stale version drops automatically.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, modes and the council model; iteration 2 verified the lenses, critique roles, convergence rule and artifact layout, each cited to a file and line. Converged before the 3-iteration ceiling.
