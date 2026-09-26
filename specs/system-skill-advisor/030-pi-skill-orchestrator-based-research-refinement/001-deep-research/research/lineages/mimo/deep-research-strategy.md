# Deep Research Strategy — lineage mimo

## Charter

Compare the pi-skill-orchestrator Pi extension (`context/pi-skill-orchestrator-main/`) with
system-skill-advisor (`.skilled/skills/system-skill-advisor/`, hooks, and
`.skilled/plugins/system-skill-advisor.js`) and decide, per orchestrator mechanism, whether the
advisor should ADOPT, ADAPT or REJECT it — for routing precision, prompt cost and robustness.

Answer shape (per phase spec.md): each finding names the orchestrator mechanism at `file:line`,
the advisor counterpart at `file:line` or states none exists, the proposed change, expected
benefit, cost, risk, then a verdict plus one sentence of reason. Every claim is labelled
CONFIRMED (read in code) or INFERRED (with what would confirm it).

## Non-Goals

- No edits to the orchestrator source or the advisor. Research artifacts only, inside this lineage.
- No running of advisor tests, validate.sh, generate-context.js, or git writes.
- Token Saver only where it bears on advisor output size, brief format, or lazy discovery.

## Stop Conditions

- stopPolicy is max-iterations: run all 10 iterations. Convergence below 0.05 is telemetry only;
  broaden review angles instead of synthesizing early.
- Terminal synthesis record carries stopReason "maxIterationsReached".

## Known Context

- Reading list (orchestrator): docs/architecture.md, docs/usage.md, docs/groups-and-profiles.md,
  docs/dependencies.md, docs/token-saver.md; src/index.ts, catalog.ts, search.ts, scope.ts,
  profiles.ts, dependencies.ts, skill-io.ts, token-saver.ts; tests/ especially
  pi-compatibility.test.mjs, scope.test.mjs, dependencies.test.mjs.
- Reading list (advisor): ARCHITECTURE.md, references/scoring/advisor-scorer.md,
  references/runtime/cli-front-door-contract.md, hooks/skill-advisor-hook.md;
  runtime/handlers/advisor-recommend.ts, runtime/lib/scorer/fusion.ts, runtime/lib/scorer/lanes/,
  runtime/lib/scorer/ambiguity.ts; runtime/lib/skill-advisor-brief.ts, render.ts,
  prompt-policy.ts, prompt-cache.ts, runtime/lib/routing/; runtime/lib/skill-graph/,
  runtime/lib/cross-skill-edges/; hooks/pi/prompt-advisor.ts,
  hooks/claude/user-prompt-submit.ts, hooks/lib/skill-advisor-cli-fallback.ts,
  .skilled/plugins/system-skill-advisor.js.
- Observed data point (RQ2): a Pi dispatch on 2026-09-26 logged the advisor hook as fail_open with
  "CLI fallback timed out".
- resource-map: present (the phase spec reading list is the inventory).

## Iteration Plan (one focus per iteration)

1. RQ1a — Orchestrator lazy catalog + scope stub mechanics (index.ts prompt rewrite, catalog.ts).
2. RQ1b — Advisor-side prompt cost: eager catalog vs brief, quantification across runtimes.
3. RQ2 — Push vs pull: skill_search tool vs hook brief; fail_open/timeout failure modes.
4. RQ3 — Scope model: profiles/groups/authorization set vs advisor hubs, compiled routes, modes.
5. RQ4 — Dependencies: recursive loading vs advisor skill-graph/cross-skill-edges handling.
6. RQ5 — Ranking signals: orchestrator search ranking vs advisor lanes/fusion/ambiguity gaps.
7. RQ6 — Output bounds: 5/8 result caps, description truncation vs advisor brief bounds.
8. RQ7 — Robustness: catalog removal warnings, atomic writes, disable-model-invocation, version tests.
9. Cross-cutting sweep: negative knowledge, gaps left by iters 1-8, re-check weak claims.
10. Consolidation: final ranking of verdicts, citation spot-check, lineage synthesis prep.

## What Worked

- Pairing each orchestrator mechanism with the exact advisor counterpart line before writing a
  verdict (iter 1). Keeps confirmed/inferred labels honest.
- Measuring byte counts on disk instead of estimating (iter 2): the cost claim is now evidence,
  not taste.
- Mechanical citation verification before synthesis (iter 10): 34 paths, 12 content spot-checks,
  zero failures.

## What Failed

(none yet)

## Exhausted

(none yet)

## Next Focus

Loop complete: 10/10 iterations, synthesis written to research.md, terminal stopReason
maxIterationsReached recorded. No further iteration work.
