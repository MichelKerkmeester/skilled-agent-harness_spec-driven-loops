# Multi-AI Council Folder Layout

The `ai-council/` folder is the packet-local artifact home for `@multi-ai-council` runs. It mirrors the familiar shape of `research/` and `review/`: configuration, strategy, append-only state, per-round evidence, and a final synthesized report.

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
|-- council-report.md
```

`ai-council-config.json` is one mutable packet config. It tracks the active `spec_folder`, `current_round`, `max_rounds`, `seats_per_round`, `convergence_signal`, timestamps, and status.

`ai-council-strategy.md` is the first-run charter. It records task framing, selected lenses, executor/vantage targets, input evidence, constraints, and the convergence rule.

`ai-council-state.jsonl` is the append-only state log. It records `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, and `council_complete` events for resume and audit.

`seats/round-NNN/seat-MMM-<executor>.md` stores one seat output per executor and lens. Each file has frontmatter for `round`, `seat`, `executor`, `lens`, `status`, `timestamp`, and optional `simulated`.

`deliberations/round-NNN.md` stores the synthesis for one round: composition, comparison table, agreements, disagreements, cross-seat critique, recommended synthesis, and convergence decision.

`critiques/round-NNN-critique.md` is used for rounds after the first. It captures critique prompts, new findings, severity, and whether those findings block convergence.

`council-report.md` is the final synthesized plan. It includes council composition, comparison, roadmap, rejected alternatives, risks, confidence, and convergence status.

**Canonical writer:** the dispatching parent runs `.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` after `@multi-ai-council` returns. The agent itself stays planning-only (write: deny). See agent body §16 CALLER PERSISTENCE PROTOCOL for the caller patterns and `references/multi-ai-council/command-wiring.md` for the canonical post-dispatch invocation.

**Schema authority:** the §8 OUTPUT FORMAT shape this layout is derived from is documented at `references/multi-ai-council/output-schema.md`.

Cross-references:
- Agent body: `.opencode/agent/multi-ai-council.md` §12 OUTPUT PROTOCOL (this layout) + §13 INVOCATION CONTRACT + §14 STATE SCHEMA + §16 CALLER PERSISTENCE PROTOCOL
- Helper: `.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`
- Schema: `.opencode/skill/system-spec-kit/references/multi-ai-council/output-schema.md`
- State format: `.opencode/skill/system-spec-kit/references/multi-ai-council/state-format.md`
- Command wiring: `.opencode/skill/system-spec-kit/references/multi-ai-council/command-wiring.md`
- Decision records: packet 080 ADR-002 (folder layout), ADR-004 (validator policy); packet 089 ADR-001..004 (helper/schema/§17/parity); packet 092 ADR-001..004 (v1.1 metadata + payload routing + advisor + command wiring)
