# Iteration 007 — Security (final pass)

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: security (iteration 7 of 7, the configured cap)
- Operator focus (every phase's shipped work against its goal criteria): 004's goal put Bladebro's real-browser lane behind R-SEC-1, and 005's goal shipped the aliases that reach it. This pass checked whether an out-of-domain prompt can be routed to the Bladebro mode, and whether the packet still gates the real-browser lane once it gets there.
- Sources: no `steer.md` present.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mode-registry.json:116-117` (Bladebro aliases)
- `.skilled/skills/mcp-browser-use/hub-router.json:153-154`
- `.skilled/skills/mcp-browser-use/graph-metadata.json:57-58,131`
- `.skilled/skills/mcp-browser-use/ROUTER.md:34,51-54,111-112`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:112` (R-SEC-1)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The `rb status` and `rb attach` aliases route unrelated "rb" prompts to the Bladebro mode** -- `.skilled/skills/mcp-browser-use/mode-registry.json:116` -- The two-letter aliases `rb attach` and `rb status` sit in the registry, in `hub-router.json:153-154` and in the advisor vocabulary (`graph-metadata.json:57-58`). Live replays: "rb status of the ruby build" returns `mcp-browser-use` at 0.8229 with a compiled `route` to `mcp-bladebro`, and "check rb attach logs in the deploy" returns 0.8452 to `mcp-bladebro`. This narrows R6-P2-001 to the mode with the highest-impact lane. The impact is bounded: the router only selects the packet, and R-SEC-1 inside it (`mcp-bladebro/SKILL.md:112`) still requires an explicit operator request and an operator-chosen profile before any real-browser (`rb`) lane runs. So a mis-route loads browser instructions but cannot reach a signed-in browser on its own. That keeps this at P2.
   Finding class: alias-overreach.
   Scope proof: 4 Bladebro-targeted probes. 3 hit, including the deliberate "use the stealth browser" at 0.95. 1 miss ("attach the stealth pdf to the email").
   Affected surface hints: `mode-registry.json` and `hub-router.json` Bladebro aliases, `graph-metadata.json` vocabulary, `ROUTER.md` BLADEBRO keyword row (line 54).
   Case: a Ruby developer asks "rb status of the ruby build". The advisor clears its 0.8 floor for `mcp-browser-use` and the compiled route selects `mcp-bladebro`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | pass | R-SEC-1 still gates the real-browser lane after routing (`mcp-bladebro/SKILL.md:112`). The `ROUTER.md:111-112` disambiguation asks for the browser outcome and the signed-in need when a request is generic. |

## Integration Evidence

- `.skilled/bin/skill-advisor.cjs advisor_recommend` compiled-route replays listed above.

## Edge Cases

- This is the final iteration under `maxIterations=7`. `checklist_evidence` stays partial on recorded findings, so the run stops on the iteration cap, not on convergence.

## Confirmed-Clean Surfaces

- The real-browser lane stays operator-gated after routing (R-SEC-1).
- The disambiguation prompt covers the signed-in decision.

## Ruled Out

- A route-to-real-browser escalation: routing selects a packet, and the packet's R-SEC-1 gate is independent of how the request arrived.

## Next Focus

- Dimension: none (iteration cap reached). Synthesis follows.
- Focus area: synthesis. Carry R1-P1-001 and R2-P1-001 as the release blockers for CONDITIONAL.
- Reason: max iterations.
- Rotation status: all four dimensions covered; correctness and traceability twice, security twice.
- Required evidence: none.

## Verdict

No new P0/P1. R1-P1-001 and R2-P1-001 remain active, so the verdict over active findings is CONDITIONAL.

Review verdict: CONDITIONAL
