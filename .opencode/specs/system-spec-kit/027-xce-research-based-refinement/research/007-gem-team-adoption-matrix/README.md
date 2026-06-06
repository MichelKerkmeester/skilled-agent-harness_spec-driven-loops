# 007 — Gem Team Adoption Matrix

Deep-research phase studying the external multi-agent framework **mubaidr/gem-team** (`../../external/gem-team-main/`) and triaging its mechanisms for adoption into this repo's spec-kit system.

- **Method:** orchestrator-driven loop — cli-opencode `openai/gpt-5.5-fast --variant high` dispatched READ-ONLY (Gate-3-safe), orchestrator writes all state. Parallel fan-out in batches of ~5.
- **Depth:** Exhaustive (operator-selected) — 13 analysis angles (iters 001-013) + adversarial-verify round + completeness critic + synthesis.
- **Iteration numbering:** packet-local **001-024** — this is a self-contained research packet; its iterations are not part of any global counter.
- **Verdict vocabulary:** ADOPT / ADAPT / REJECT, with `file:line` evidence on both the gem-team and spec-kit sides and an explicit "spec-kit already does this" dedup pass.

## Artifacts

| File | Purpose |
|---|---|
| `deep-research-config.json` | Run config (executor, iterations, lineage) |
| `deep-research-strategy.md` | Persistent brain — charter, 13 angles, known context (7-ANCHOR reducer-compatible) |
| `deep-research-state.jsonl` | Append-only state log (config + started + per-iteration records) |
| `findings-registry.json` | Findings + question-resolution metrics |
| `deep-research-dashboard.md` | Human-readable progress (regenerated each round) |
| `iterations/iteration-NNN.md` | Per-iteration findings (write-once) |
| `deltas/iter-NNN.jsonl` | Per-iteration JSONL delta record |
| `prompts/iteration-NNN.{prompt,out,err}` | Rendered prompt + raw model output |
| `research.md` | **Canonical synthesis — verdict matrix** |
| `sub-packet-proposals.md` | **Deliverable — candidate new 027 child phases** |

## Why phase 007

Operator-assigned number for the gem-team research packet; sibling packets `006-peck-source-deep-mining` and `008-caura-memclaw-fleet-memory-teachings` study other external frameworks. Each packet is independently numbered from iteration 001.
