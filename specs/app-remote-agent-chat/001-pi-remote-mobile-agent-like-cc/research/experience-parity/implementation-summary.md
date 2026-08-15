---
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-pi-remote-experience-parity"
    last_updated_at: "2026-08-12T06:47:00Z"
    last_updated_by: "claude"
    recent_action: "Synthesized both research lineages into research/research.md and completed the packet"
    next_safe_action: "Review recommendations and amend the 041 packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    completion_pct: 60
---
# Implementation Summary: Pi Remote Experience Parity Research

## Status: Review

## Current State

The two-lineage deep-research run is **complete**. Both lineages finished all 20 iterations with no early convergence and reached `synthesis_complete`:

- **cli-codex · gpt-5.6-luna (max/fast)** — 20 iterations, 794-line per-model synthesis. Orchestration verdict: succeeded.
- **cli-pi · deepseek-v4-flash (opencode-go)** — 20 iterations, 177-line per-model synthesis. Orchestration verdict: `failed` via the runtime **containment guard** (out-of-scope-paths: null) — a false positive from concurrent daemon/other-session working-tree churn. The lineage's full 20-iteration output survived on disk and is included in the synthesis.

The **GPT-5.6 SOL HIGH (fast)** synthesis merged both lineages into `research/research.md` (1079 lines): executive summary, all eight experience axes, model convergence/divergence, ranked P0/P1/P2 recommendations for the 041 packet, and 20 open validation questions.

## Headline Finding

A best-in-class Pi remote experience is a **typed, redacted, replayable event ledger** with a separate authenticated command protocol — not a terminal mirror or chat clone. Both lineages independently converged on this shape, and it can exceed the Claude Code + mobile reference on transcript richness, replay determinism, approval integrity, notification privacy, authority legibility, session isolation, and local data control — while explicitly not claiming unrestricted cloud-agent autonomy.

## Verification Evidence

- Fan-out config validated against the real executor schema (parse + expand + capability preflight) before launch.
- Per-lineage `synthesis_complete` state and 20 iteration files on disk.
- Blast radius: no repo files outside `042/research/` attributable to the CLI children; out-of-window changes were daemon/MCP churn and unrelated concurrent sessions.

## Next Steps

1. Human review of `research/research.md`.
2. Amend the 041 packet with the P0 recommendations (typed relay envelope, IA, exact-action approval events, content-free attention contract, first-class pending states).
3. Validate the 20 open questions against the live Pi RPC surface and target device matrix before freezing any schema.
