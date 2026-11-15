---
title: "AI Council Folder Layout"
description: "Packet-local artifact layout for AI Council runs."
trigger_phrases:
  - "deep-ai-council folder layout"
  - "ai-council artifacts"
  - "council artifact tree"
  - "council report path"
importance_tier: "important"
contextType: "implementation"
version: 1.7.3.0
---

# AI Council Folder Layout

Open this when you need to know where a council run writes each artifact, whether you are starting the run or auditing a finished one.

---

## 1. OVERVIEW

### Purpose

Make every file a completed council run leaves behind traceable to the record it holds and the writer that produced it.

### When to Use

- You are starting a council run and need to know what it will write.
- You are inspecting a completed run and need to find the record for a round, a seat, or a rollback.

**Persistence is mandatory for every council run.** The target packet path is resolved by the agent at §1 Step 0 RESOLVE in `deep-ai-council.md` across all 4 runtime mirrors. When invocation cannot resolve a packet path, the agent HALT-and-ASKs the user for one and does NOT dispatch council seats, so the layout below applies to every completed deliberation.

The `ai-council/` folder is the packet-local artifact home for `@deep-ai-council` runs. It mirrors the familiar shape of `research/` and `review/`: configuration, strategy, append-only state, per-round evidence, and a final synthesized report.

```text
specs/<track>/<NNN-name>/ai-council/
|-- ai-council-config.json
|-- ai-council-strategy.md
|-- ai-council-state.jsonl
|-- seats/
|   |-- round-001/                        # ONE CLI per round (e.g. all cli-opencode seats)
|   |   |-- seat-001-cli-opencode-gpt-5-5-high.md
|   |   |-- seat-002-cli-opencode-gpt-5-5-pro.md
|   |   |-- seat-003-cli-opencode-gpt-5-5-xhigh.md
|   |-- round-002/                        # additional CLI = additional dedicated round
|   |   |-- seat-001-cli-claude-code-opus.md
|   |   |-- seat-002-cli-claude-code-sonnet.md
|-- deliberations/
|   |-- round-001.md
|-- critiques/
|   |-- round-002-critique.md
|-- failed/
|   |-- round-002-2026-05-08T22-31-00-000Z/
|-- council-report.md
```

`ai-council-config.json` is one mutable packet config: `{spec_folder, current_round, max_rounds, seats_per_round, convergence_signal, created_at, updated_at, status}`. `max_rounds` defaults to 3. Mutate it across runs; do not write a second config.

`ai-council-strategy.md` is the first-run charter. It records task framing, selected lenses, executor/vantage targets, input evidence, constraints, and the convergence rule.

`ai-council-state.jsonl` is the append-only state log for `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded` events. The `persist-artifacts.cjs` helper writes it when a caller runs the helper. The append gateway records events in the mode ledger and does not touch this file, because `append-mode-event.ts` registers no projection for `ai-council`. The council agent never writes it.

`seats/round-NNN/seat-MMM-<executor>.md` stores one seat output per executor and lens. Each file has frontmatter for `round`, `seat`, `executor`, `lens`, `status`, `timestamp`, and optional `simulated`.

`deliberations/round-NNN.md` stores the synthesis for one round: composition, comparison table, agreements, disagreements, cross-seat critique, recommended synthesis, and convergence decision.

`critiques/round-NNN-critique.md` is used for rounds after the first. It captures critique prompts, new findings, severity, and whether those findings block convergence.

`failed/round-NNN-<timestamp>/` preserves a rolled-back round for forensic inspection. Rollback moves failed round artifacts here and marks the corresponding state-log writes with `artifact_superseded` events.

`council-report.md` is the final synthesized plan. It includes council composition, comparison, roadmap, rejected alternatives, risks, confidence, and convergence status.

**Canonical writer:** when a caller dispatches `@ai-council`, the agent writes these artifacts with Write and Edit, in the shapes the named exports of `.skilled/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` produce. Bash is denied to the agent, so it runs no script. `.skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs` remains a helper fallback for callers that capture a council report from another runtime. `/deep:ai-council` persists its own seats through that helper and does not dispatch the agent. See `patterns/command-wiring.md` for the single writer rule.

**Schema authority:** the §8 OUTPUT FORMAT shape this layout is derived from is documented at `references/structure/output-schema.md`.

---

## 2. CROSS-REFERENCES

- Agent body: `.skilled/agents/ai-council.md` §7 RULES (persistence rule and the pointer to these references)
- Council writer library: `.skilled/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`
- Helper fallback: `.skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs`
- Schema: `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md`
- State format: `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md`
- Command wiring: `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md`
- Decision records: ADR-002 (folder layout), ADR-004 (validator policy); the helper, schema, persistence-protocol placement and parity ADRs (the placement ADR put the protocol in the agent body; its details now live in `patterns/command-wiring.md` and the agent keeps the rule and a pointer); the v1.1 metadata + payload routing + advisor + command wiring ADRs
