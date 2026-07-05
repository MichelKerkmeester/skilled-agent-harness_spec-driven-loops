---
title: "Resource Map: Deep-loop fan-out remediation (009)"
description: "The implement-time edit set + reuse sources for the 14 fan-out fixes, grouped by surface (scripts, lib, command, tests, docs), each finding mapped to its file and reuse target."
trigger_phrases:
  - "123 phase 009 resource map"
  - "fanout remediation files"
  - "fanout fix edit set"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored resource map; edit set + reuse sources per finding"
    next_safe_action: "Use map to scope the Phase 1 implementation edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Resource Map: Deep-loop fan-out remediation (009)

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

Scope guard for the implement step. All paths relative to repo root.

## Surface 1 — fan-out scripts (`.opencode/skills/deep-loop-runtime/scripts/`)

| File | Findings | Notes |
|------|----------|-------|
| `fanout-run.cjs` | C-01 (:341), C-02 (:359-360), C-03 (:122-146,315), ENV-LEAK (:345), N-02 (:52-66) | Inner worker only for C-01; leave TSX self-respawn |
| `fanout-merge.cjs` | C-02 (:197-202), MERGE-DROP (:61-67), MERGE-DEDUP (:97,174), N-04 (:242) | Fail-closed verdict; content-hash dedup |
| `fanout-salvage.cjs` | C-04 (:106), N-01 (:103,120) | Zero-pad; per-iteration recovery |

## Surface 2 — runtime lib (`.opencode/skills/deep-loop-runtime/lib/`)

| File | Findings / Role | Notes |
|------|-----------------|-------|
| `deep-loop/executor-config.ts` | BOUNDS (:298,306), XOR (:304) | `.max()` caps + root both-present validator |
| `deep-loop/executor-audit.ts` | REUSE | `runAuditedExecutorCommandAsync:663` (C-01/TIMEOUT-ORPHANS), `buildExecutorDispatchEnv:466` (ENV-LEAK) |
| `council/session-state-hierarchy.cjs` | REUSE | `pad3:25` (C-04) — export it or inline `padStart(3,'0')` |

## Surface 3 — command surface (`.opencode/commands/deep/`)

| File | Findings | Notes |
|------|----------|-------|
| `assets/deep_start-review-loop_auto.yaml` | U-01 (:735,741,1009) | `.kind` predicate parity |
| `assets/deep_start-review-loop_confirm.yaml` | U-01 | `.kind` predicate parity |
| `assets/deep_start-research-loop_auto.yaml` | U-01 (:612,618,766) | already `.type`; align to `.kind` |
| `assets/deep_start-research-loop_confirm.yaml` | U-01 | align to `.kind` |
| `start-review-loop.md` | U-01 (:141,157,164) | doc writes `.kind` |
| `start-research-loop.md` | U-01 | doc writes `.kind` |

## Surface 4 — tests (`.opencode/skills/deep-loop-runtime/tests/unit/`)

| File | New/Changed test | Catches |
|------|------------------|---------|
| `fanout-pool.vitest.ts` | NEW real-spawn concurrency (contrast `makeGatedWorker:35`) | C-01 |
| `fanout-merge.vitest.ts` | NEW all-fail → non-PASS; dedup | C-02, MERGE-DEDUP |
| `fanout-run.vitest.ts` | NEW env-allowlist; verbatim invoke | ENV-LEAK, C-03 |
| `fanout-salvage.vitest.ts` | FIX padded name; per-iteration recovery | C-04, N-01 |
| `executor-config.vitest.ts` | NEW over-cap rejected; both-present rejected | BOUNDS, XOR |

Run: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/<file>.vitest.ts`

## Surface 5 — sibling docs (DOC-STALENESS)

| Target | Action |
|--------|--------|
| `123/00{3,4,5,6}/implementation-summary.md` | Add (currently absent) |
| `123/00{3,4,5,6}/graph-metadata.json` | Regen `status: planned`→actual |
| `123/spec.md` (parent) | Refresh continuity (stale `completion_pct:33`) |

## Reuse-first summary

- **Async spawn + group kill** → `executor-audit.ts:663` (do NOT hand-roll).
- **Env allowlist** → `executor-audit.ts:466` (do NOT write a denylist).
- **Filename padding** → `session-state-hierarchy.cjs:25` `pad3`.
- **Content-hash dedup** → reuse reducer `content_hash` if present; else a small `computeFindingHash`.
