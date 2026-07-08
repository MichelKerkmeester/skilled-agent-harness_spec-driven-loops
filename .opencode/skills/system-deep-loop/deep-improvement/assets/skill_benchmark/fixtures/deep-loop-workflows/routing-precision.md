# system-deep-loop routing-precision probe (reproducible)

A re-inspectable advisor-probe scorecard for the parent-skill routing dogfood.
It scores per-mode routing for the three **lexical** modes via the advisor's
deep-skill-routing endpoint. NOTE: the skill-benchmark *harness* itself scores
skill-id only (not `workflowMode`); per-mode precision is enforced by
`system-skill-advisor/.../tests/routing-parity-deep-*.vitest.ts`. This probe is
the corpus's own quick routing check, not a harness score.

## Run

```bash
ADV=.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py
probe() { echo "{\"prompt\":\"$1\",\"packet_context\":{}}" | python3 "$ADV" --deep-skill-routing-json; }
probe "resume the autonomous research loop and check newinforatio convergence on the original investigation topic"
probe "continue the iterative review loop until the p0 and p1 findings stabilize"
probe "deliberate across multi-seat strategy options until the architecture decision converges"
```

## Expected (3 of 3 lexical modes)

| prompt | expected `{skill, mode}` |
|--------|--------------------------|
| research loop / convergence | `system-deep-loop`, `research` |
| review loop / p0-p1 stabilize | `system-deep-loop`, `review` |
| multi-seat deliberation | `system-deep-loop`, `ai-council` |

## Coverage note

The corpus ships 5 scenario pairs. Only the 3 **lexical** modes (research,
review, ai-council) are scored by this probe. `dlw-context-001` is now a
deprecated-route suppression fixture, and `dlw-agentimprove-001`
(agent-improvement = alias-fold) carries skill-level gold only. Their mode
routing is not exercised by the deep-skill-routing probe, so they are
intentionally not counted in the "3/3".
