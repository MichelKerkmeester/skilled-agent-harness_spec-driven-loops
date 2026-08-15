# Implementation Plan: Pi Remote Experience Parity Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## 1. APPROACH

A two-lineage deep-research fan-out through the shared deep-loop runtime (`fanout-run.cjs`), each lineage running the full research loop independently, followed by a single higher-tier synthesis.

- **Lineage 1**: `cli-codex` · gpt-5.6-luna · reasoning `max` · service tier `fast` · 20 iterations.
- **Lineage 2**: `cli-pi` · deepseek-v4-flash (opencode-go provider) · 20 iterations.
- **Stop policy**: `max-iterations` — convergence is telemetry only; the loop runs the full 20.
- **Synthesis**: `cli-codex` · gpt-5.6-sol · reasoning `high` · fast, read-only, merging both lineages into `research/research.md`.

## 2. STAGES

| Stage | Description | Verification |
|-------|-------------|--------------|
| Setup | Scaffold packet, validate fan-out config against the real schema | parse + expand + capability preflight pass |
| Fan-out | Run both lineages to 20 iterations | per-lineage `synthesis_complete`, 20 iteration files |
| Synthesis | SOL-high consolidation | research/research.md with all 8 axes + ranked recommendations |
| Persist | Metadata + strict validation | validate.sh --strict passes |

## 3. DEPENDENCIES

- Deep-loop runtime `fanout-run.cjs` (executor kinds `cli-codex`, `cli-pi`).
- Authenticated `codex` (ChatGPT OAuth) and `pi` binaries.
- The 041 packet as architecture grounding.

## 4. ROLLBACK

The packet is additive and research-only; removing the folder fully reverts it. No runtime code changes.
