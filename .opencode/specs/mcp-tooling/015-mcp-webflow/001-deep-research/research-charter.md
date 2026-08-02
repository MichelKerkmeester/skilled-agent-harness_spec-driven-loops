---
title: "Research Charter: Webflow MCP 2.0 - Phase 1 deep research"
description: "Bound topic, key questions, non-goals, and stop conditions for the two-lineage deep research run. The conductor copies these into the strategy template's RESEARCH BOUNDARIES and STOP CONDITIONS sections during initialization."
trigger_phrases: ["webflow research charter", "phase 1 charter", "research boundaries webflow"]
importance_tier: "important"
contextType: "planning"
---

# Research Charter: Webflow MCP 2.0

Source contract for the Phase 1 deep-research run. During initialization the conductor populates the workflow strategy template (`.opencode/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md`) — Topic/Key Questions from this charter's sections 1-2, §13 RESEARCH BOUNDARIES from section 3, §5 STOP CONDITIONS from section 4.

## 1. TOPIC

Research seed: [Webflow MCP 2.0 features](https://webflow.com/blog/mcp-2-features), followed by official Webflow MCP, developer, API, authentication, and changelog documentation. Synthesize Webflow MCP 2.0 capabilities, constraints, and recommendations from official and corroborating sources.

## 2. KEY QUESTIONS

| ID | Question | Consumed by |
|----|----------|-------------|
| Q1 | Which MCP 2.0 actions are read-only, draft-safe, destructive, publish-capable, or deployment-capable? | Phase 2 permission surface |
| Q2 | Does the official surface use remote OAuth, a local server, an API token, or a client-specific connection flow? | Phase 2/3 backend + auth |
| Q3 | Is `mcp-webflow` a `workflow` (managed Webflow operations) or a `transport` (mutations land outside this repository)? | Phase 2 classification |
| Q4 | What non-production Webflow workspace or site can support live smoke without risking existing content? | Phase 2 target + Phase 8 smoke |
| Q5 | Which Webflow operations require explicit operator confirmation, and which require a named rollback? | Phase 2 confirmation/rollback policy |
| Q6 | Which operations must pair with `sk-design` design judgment rather than transport-owned taste? | Phase 2 design pairing |

## 3. RESEARCH BOUNDARIES (non-goals)

1. **No replacement server.** Do not design a substitute Webflow MCP server unless research proves the official surface unusable — and even then, only flag it; scope amendment is an operator decision.
2. **No production mutation.** Never publish, delete, overwrite, deploy, or mutate a production Webflow site. Research is read-only; any live credential use is limited to non-production targets with a named rollback and operator confirmation.
3. **No design judgment in the transport.** `sk-design` remains the taste authority; research only records the pairing boundary.
4. **No scope expansion.** Do not research sibling integrations, the 014 packet, or generic MCP server internals beyond what Webflow's surface requires.
5. **Evidence over assertion.** Every capability claim needs an official-source citation or an explicit inference marker; unverifiable claims are recorded as unknown, not assumed.

## 4. STOP CONDITIONS

1. **Iteration cap reached.** Ten valid iterations total — five per lineage — with `max-iterations` stop policy and convergence off (telemetry only). Do not stop early on convergence signals.
2. **Lineage timeout.** A lineage exceeding its wall-clock ceiling is halted and reported; do not silently substitute an executor or hand-roll iterations.
3. **Contract rejection.** The workflow rejects the mixed-executor configuration or an executor preflight fails — halt and report the mismatch; never substitute another executor.
4. **Unsafe boundary.** Any path that would mutate a production Webflow site or require unapproved credentials halts immediately with the reason recorded.
5. **Synthesis complete.** All key questions answered (or explicitly marked unresolvable with evidence) and a cited synthesis written to the workflow-owned research output.

## 5. REQUIRED SYNTHESIS COVERAGE

Per the phase handoff criteria, the synthesis must cover: tool inventory and operation classes, authentication model, rate/permission limits, safety and confirmation requirements, non-production test target, and classification evidence for Q3.
