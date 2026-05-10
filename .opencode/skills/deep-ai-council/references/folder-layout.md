---
title: "Multi-AI Council Folder Layout"
description: "Packet-local artifact layout for Multi-AI Council runs."
trigger_phrases:
  - "multi-ai-council folder layout"
  - "ai-council artifacts"
  - "council artifact tree"
  - "council report path"
importance_tier: "normal"
contextType: "reference"
---

# Multi-AI Council Folder Layout

> **Persistence is mandatory for every council run.** The target packet path is resolved by the agent at §1 Step 0 RESOLVE in `multi-ai-council.md` (across all 4 runtime mirrors). When invocation cannot resolve a packet path, the agent HALT-and-ASKs the user for one and does NOT dispatch council seats — the layout below is therefore guaranteed to apply to every completed deliberation. See packet `skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement` for the enforcement contract.

The `ai-council/` folder is the packet-local artifact home for `@multi-ai-council` runs. It mirrors the familiar shape of `research/` and `review/`: configuration, strategy, append-only state, per-round evidence, and a final synthesized report.

---

```text
specs/<track>/<NNN-name>/ai-council/
|-- ai-council-config.json
|-- ai-council-strategy.md
|-- ai-council-state.jsonl
|-- seats/
|   |-- round-001/
|   |   |-- seat-001-cli-codex.md
|   |   |-- seat-002-cli-gemini.md
|   |   |-- seat-003-cli-claude-code.md
|-- deliberations/
|   |-- round-001.md
|-- critiques/
|   |-- round-002-critique.md
|-- failed/
|   |-- round-002-2026-05-08T22-31-00-000Z/
|-- council-report.md
```

---

## 1. OVERVIEW

`ai-council-config.json` is one mutable packet config. It tracks the active `spec_folder`, `current_round`, `max_rounds`, `seats_per_round`, `convergence_signal`, timestamps, and status.

`ai-council-strategy.md` is the first-run charter. It records task framing, selected lenses, executor/vantage targets, input evidence, constraints, and the convergence rule.

`ai-council-state.jsonl` is the append-only state log. It records `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded` events for resume and audit.

`seats/round-NNN/seat-MMM-<executor>.md` stores one seat output per executor and lens. Each file has frontmatter for `round`, `seat`, `executor`, `lens`, `status`, `timestamp`, and optional `simulated`.

`deliberations/round-NNN.md` stores the synthesis for one round: composition, comparison table, agreements, disagreements, cross-seat critique, recommended synthesis, and convergence decision.

`critiques/round-NNN-critique.md` is used for rounds after the first. It captures critique prompts, new findings, severity, and whether those findings block convergence.

`failed/round-NNN-<timestamp>/` preserves a rolled-back round for forensic inspection. Rollback moves failed round artifacts here and marks the corresponding state-log writes with `artifact_superseded` events.

`council-report.md` is the final synthesized plan. It includes council composition, comparison, roadmap, rejected alternatives, risks, confidence, and convergence status.

**Canonical writer:** the council writes these artifacts directly with `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js` named exports. Each writer is scoped to `ai-council/**` and appends an `artifact_written` audit event. `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` remains a helper fallback for non-council callers.

**Schema authority:** the §8 OUTPUT FORMAT shape this layout is derived from is documented at `references/multi-ai-council/output-schema.md`.

Cross-references:
- Agent body: `.opencode/agents/multi-ai-council.md` §12 OUTPUT PROTOCOL (this layout) + §13 INVOCATION CONTRACT + §14 STATE SCHEMA + §16 COUNCIL PERSISTENCE PROTOCOL + §18 ROLLBACK FOR OPERATORS
- Council writer library: `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js`
- Helper fallback: `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`
- Schema: `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`
- State format: `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`
- Command wiring: `.opencode/skills/system-spec-kit/references/multi-ai-council/command-wiring.md`
- Decision records: packet 080 ADR-002 (folder layout), ADR-004 (validator policy); packet 089 ADR-001..004 (helper/schema/§17/parity); packet 092 ADR-001..004 (v1.1 metadata + payload routing + advisor + command wiring)
