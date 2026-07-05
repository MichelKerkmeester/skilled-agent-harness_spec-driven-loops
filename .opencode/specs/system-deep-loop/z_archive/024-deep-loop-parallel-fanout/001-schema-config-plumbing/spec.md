---
title: "Phase 001: Fan-out schema + config plumbing"
description: "Add multi-executor fan-out config schema (lineageExecutorSchema, fanoutConfigSchema, parseFanoutConfig, expandLineages) to deep-loop-runtime executor-config.ts + optional lineageId in executor-audit; no behavior change; single-executor parity preserved."
trigger_phrases:
  - "123 phase 001 schema"
  - "fanout config schema"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/001-schema-config-plumbing"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 1 complete — lineageExecutorSchema + fanoutConfigSchema + parseFanoutConfig + expandLineages + optional lineageId in executor-audit; 36 tests green (27 original + 9 fan-out)"
    next_safe_action: "Phase 002 done; Phase 003 done; packet 123 fully shipped"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 001 — Fan-out schema + config plumbing

## Purpose
Add the opt-in multi-executor config representation without changing any behavior. Foundation for all later phases.

## Scope
- `deep-loop-runtime/lib/deep-loop/executor-config.ts`: add `lineageExecutorSchema` (= `executorConfigSchema` + dir-safe `label`, `count`, nullable `iterations`), `fanoutConfigSchema` (`executors[]`, `concurrency` default 2), `parseFanoutConfig` (delegates per-entry to existing `parseExecutorConfig`), `expandLineages` (count→labels). Do NOT modify `executorConfigSchema`/`parseExecutorConfig`.
- Backward-compat: config carries EITHER `config.executor` OR `config.fanout`, never both; both-present fails fast.
- `deep-loop-runtime/lib/deep-loop/executor-audit.ts`: optional `lineageId` on `buildExecutorAuditRecord` + `RunAuditedExecutorCommandInput` (absent ⇒ unchanged records).

## Success
- New unit tests cover fan-out parse / both-present conflict / count-expansion / per-entry kind validation reuse.
- **Parity gate:** existing single-executor `parseExecutorConfig` tests byte-identical; full vitest green.

## Out of scope
Pool, spawn, merge, YAML, docs (later phases).
