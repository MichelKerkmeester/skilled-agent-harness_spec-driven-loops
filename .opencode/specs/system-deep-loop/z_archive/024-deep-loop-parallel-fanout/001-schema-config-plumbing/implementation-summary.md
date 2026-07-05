---
title: "Implementation Summary: Phase 001 — Fan-out schema + config plumbing"
description: "Added opt-in multi-executor fan-out config schema (lineageExecutorSchema, fanoutConfigSchema, parseFanoutConfig, expandLineages) to deep-loop-runtime executor-config.ts + optional lineageId in executor-audit (buildExecutorAuditRecord + input type + record type); single-executor path unchanged; deep-loop-runtime unit suite 161/161 green (1 pre-existing loop-lock cross-process flake, unrelated)."
trigger_phrases:
  - "123 phase 001 implementation summary"
  - "fanout schema done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/001-schema-config-plumbing"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 001 complete: fan-out schema + audit lineageId + 9 tests; suite 161/161 green"
    next_safe_action: "Phase 002: author scripts/fanout-pool.cjs runCappedPool + status ledger"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary — Phase 001: Fan-out schema + config plumbing

> Process honesty note: an earlier draft of this file claimed numbers ("163/163", "+9 tests",
> "lineageId 4 refs") from edits that had SILENTLY FAILED to apply (wrong anchor strings, masked by a
> flaky shell transport). The edits were then re-applied with verified anchors and the numbers below are
> grep/git/test-run verified.

## What changed (verified on disk + by test run)

1. **`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`** (git: +118 lines):
   - `lineageExecutorSchema` = `executorConfigSchema.extend({ label (dir-safe /^[a-z0-9][a-z0-9-]*$/), count (int≥1, default 1), iterations (int≥1|null, default null) })`.
   - `fanoutConfigSchema` = `{ executors: lineageExecutorSchema[] (min 1), concurrency: int≥1 (default 2) }`.
   - `parseFanoutConfig(raw)` — validates the array, routes each entry's executor subset through the EXISTING `parseExecutorConfig` (reuses all kind/model/flag rules), enforces unique labels + non-colliding expanded labels.
   - `expandLineages(config)` — count→labels (count 1 keeps base; count N → `label-1…label-N`, each single-replica, count reset to 1).
   - `executorConfigSchema` / `parseExecutorConfig` / `resolveExecutorConfig` **untouched**. (6 fan-out exports confirmed by grep.)

2. **`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`** (optional `lineageId`, 3 refs confirmed):
   - `lineageId?: string` added to `RunAuditedExecutorCommandInput`.
   - `buildExecutorAuditRecord(executor, lineageId?)` conditionally spreads `lineageId` only when provided ⇒ **records byte-identical when absent**.
   - NOTE: field DEFINED here, first CONSUMED in Phase 003 (spawn) / Phase 005 (merge attribution). No call site passes it yet.

3. **`.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`** (36 `it()` confirmed = 27 original + 9 new):
   - +7 `parseFanoutConfig` cases (parse+defaults; concurrency/count/iterations; cli-codex model reuse; cli-gemini flag reuse; empty-array reject; non-dir-safe-label reject; duplicate-label reject).
   - +2 `expandLineages` cases (count-1 base; count>1 numbered).

## Backward-compat rule
Config carries EITHER `config.executor` (single, default, unchanged) OR `config.fanout` (multi). No call site writes both yet; the both-present guard lands with the command surface in Phase 006.

## Verification (observed, clean runs)
- `executor-config.vitest.ts`: **36/36 pass** (isolated).
- `executor-config` + `executor-audit` together: **60/60 pass**.
- Full `deep-loop-runtime/tests/unit/`: **161/161 pass** (EXIT 0). Parity preserved — pre-existing single-executor tests unchanged and green.
- One UNRELATED flake observed in a later full-suite run: `loop-lock.vitest.ts > allows exactly one fresh cross-process acquire to win` (a cross-process timing test). Confirmed flaky — passed 7/7 in one isolated run, failed 1/7 in another; `loop-lock.ts` is NOT in this phase's diff (git-verified). Not caused by Phase 001.

## Scope (git)
Exactly 3 files changed under `deep-loop-runtime/`: `lib/deep-loop/executor-config.ts`, `lib/deep-loop/executor-audit.ts`, `tests/unit/executor-config.vitest.ts`.

## Spec-folder validation note
The 001 child still FAILS `validate.sh --strict` (missing `checklist.md`; lean hand-authored docs lack full SPECKIT template anchors — same pattern as packet 122 children). Template-scaffolding only, not code; to reconcile before the packet's overall completion claim.
