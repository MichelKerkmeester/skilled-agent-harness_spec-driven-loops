---
title: "Phase 006: Command surface + docs + final parity"
description: "Command flag parsing (--executor repeatable, --executors json, --concurrency) + default policy (single-executor default) in both deep command entrypoints; SKILL/convergence/runtime doc updates permitting command-driven fan-out (wave stays deferred); final byte-identical single-executor parity gate."
trigger_phrases:
  - "123 phase 006 command docs parity"
  - "fan-out command flags"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/006-command-surface-docs-parity"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 6 complete — fan-out flags + policy in both command docs; deep-loop-runtime/SKILL.md script table; deep-research + deep-review SKILL.md carve-outs; parity gate confirmed structural (skip_when guards + if_absent resolver branch)"
    next_safe_action: "Packet 123 complete — all 6 phases done; run git status + commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 006 — Command surface + docs + final parity

## Purpose
Expose fan-out via the command entrypoints (opt-in), document it for both consumers, and prove single-executor parity.

## Scope
- `commands/deep/start-research-loop.md` + `start-review-loop.md` §0: repeatable `--executor` (groups trailing `--model/--reasoning-effort/--service-tier/--executor-timeout/--iters/--label/--count`), `--executors <json>` escape hatch, `--concurrency N`; Default Resolution Table + PRE-BOUND SETUP ANSWERS additions; fan-out EXAMPLES.
- Default policy: 0–1 executor & no `--executors` ⇒ `config.executor` (single, recommended default, unchanged); 2+ / `--executors` / `count>1` ⇒ `config.fanout`.
- Docs: `deep-research/SKILL.md` (§4 NEVER #9 + EXPERIMENTAL) + `deep-review/SKILL.md` (FORBIDDEN INVOCATION PATTERNS) carve-out permitting command-driven fan-out (ad-hoc shell + intra-lineage wave stay forbidden/deferred); "Fan-Out Convergence" in both `references/convergence/convergence.md`; `deep-loop-runtime/SKILL.md` script table adds `fanout-pool.cjs`/`fanout-merge.cjs`.

## Success
- **Final parity gate (non-negotiable):** single-executor run byte-identical to pre-change `main` (config, state.jsonl modulo timestamps, iteration md, research.md/review-report.md).
- Docs accurate; full vitest green; `validate.sh --strict` green for parent + children.

## Out of scope
Wave-within-lineage (deferred).
