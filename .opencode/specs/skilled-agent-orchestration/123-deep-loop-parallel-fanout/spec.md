---
title: "Feature Specification: deep-loop native fan-out parallel multi-executor"
description: "Phase parent: add an opt-in fan-out layer above the existing single-executor sequential loop so /deep:start-research-loop and /deep:start-review-loop can run N executor lineages concurrently (capped), each in an isolated sub-packet, then a consumer-specific cross-lineage merge. Single-executor stays the default and byte-identical. Generalizes the proven manual pattern from packet 122."
trigger_phrases:
  - "123-deep-loop-parallel-fanout"
  - "deep-loop fan-out parallel"
  - "parallel multi-executor deep-research deep-review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phases 001-002 done (171/171); wrote handover.md for Phases 003-006"
    next_safe_action: "Phase 003: resolve spawn-mechanism decision (handover 4.A), then spawn + YAML override"
    blockers: ["Phase 003 needs design decision 4.A resolved (no headless loop binary)"]
    completion_pct: 33
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase control + what needs done; heavy docs live in children. -->

# Spec 123 — deep-loop native fan-out parallel multi-executor

## 1. Purpose

Add an **opt-in fan-out layer ABOVE the existing single-executor sequential loop** for both `/deep:start-research-loop` and `/deep:start-review-loop` (which share the `deep-loop-runtime` peer skill). N executor "lineages" run concurrently with a concurrency cap; each lineage runs the **existing loop verbatim** in its own isolated sub-packet; a consumer-specific cross-lineage merge produces the canonical output (`research.md` / `review-report.md`).

This generalizes the pattern proven manually in packet `122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research` (a `xargs -P 2` worker pool ran 5×4 models into per-model sub-packets, with a salvage fallback and a status ledger, then a cross-model synthesis). The prototype to mine: `…/122-…/001-skill-benchmark-deep-research/research/run_one.sh`.

**Single-executor remains the recommended default and byte-identical to today** — fan-out is opt-in via `--executors`/`--concurrency`; when absent, the existing single-executor path runs unchanged.

## 2. Decisions (approved)

- Full native feature (not just docs/asset).
- Single-executor default; fan-out opt-in; default path byte-identical (hard parity gate).
- Per-lineage execution = **Option B**: orchestrator shells the existing command per lineage into an isolated sub-packet (`{artifact_dir}/lineages/{label}/`) via a new `--artifact-dir-override`, so the YAML loop runs verbatim. Option A (re-implement the loop in JS) rejected — divergence risk.
- Coverage-graph isolation = **per-lineage `session_id`** (collision-free on the shared SQLite, zero schema change; avoids the destructive `SCHEMA_VERSION` migration).
- Convergence stays per-lineage and unchanged (research 0.05 newInfoRatio; review 0.10 weighted P0/P1/P2 + 9 gates + P0-override). No cross-lineage convergence vote; only the merge is consumer-specific.

## 3. Non-goals

- Intra-lineage "wave" parallelism (parallelizing iterations within one lineage) — the loop is sequential within a lineage (iteration N depends on N-1 state). Stays reference-only/deferred.
- Changing single-executor behavior, convergence math, or the coverage-graph schema.

## 4. Key reuse (do not rebuild)

- `deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` — parallel `Promise.allSettled` dispatch + per-item status/error isolation; **generalize into a concurrency-capped pool** (the missing piece).
- `deep-loop-runtime/lib/deep-loop/loop-lock.ts` — per-packet lock; separate sub-packets ⇒ no contention; reuse unchanged.
- `deep-loop-runtime/lib/deep-loop/{executor-audit,prompt-pack,post-dispatch-validate}.ts` — per-iteration libs reused unchanged (add optional `lineageId` to audit only).
- `coverage-graph/coverage-graph-db.ts` — keys by `(spec_folder, loop_type, session_id, …)`; per-lineage session_id isolates.
- `system-spec-kit/shared/review-research-paths.cjs#resolveArtifactRoot` — artifact dir resolution.

## 5. Sub-phase control

| Phase | Folder | Purpose | Depends on |
| ----- | ------ | ------- | ---------- |
| **001** | `001-schema-config-plumbing/` | Multi-executor schema (`lineageExecutorSchema`, `fanoutConfigSchema`, `parseFanoutConfig`, `expandLineages`) + optional `lineageId` in executor-audit. No behavior change. Parity gate. | — |
| **002** | `002-capped-pool-status-ledger/` | New `scripts/fanout-pool.cjs`: `runCappedPool` (generalize council dispatch + cap) + status JSONL ledger + summary. | 001 |
| **003** | `003-per-lineage-spawn-isolation/` | Pool spawn path (Option B) + `--artifact-dir-override` branch in `step_resolve_artifact_root` across all 4 YAMLs; per-lineage sub-packets; recursion-guard check. | 002 |
| **004** | `004-salvage-coverage-graph/` | Salvage sweep (reuse post-dispatch-validate; recover stdout→md) + per-lineage session_id coverage-graph isolation (no-collision test). | 003 |
| **005** | `005-consumer-merges-synthesis/` | New `scripts/fanout-merge.cjs` (research: dedup+attribution; review: severity rollup + strongest-restriction) + `step_fanout_merge` atop both `phase_synthesis`; `fanout-attribution.md`. | 003, 004 |
| **006** | `006-command-surface-docs-parity/` | Command flag parsing (`--executor` repeatable, `--executors`, `--concurrency`) + default policy; SKILL/convergence/runtime doc updates (permit command-driven fan-out, keep wave deferred); final byte-identical parity gate. | 001–005 |

Resume policy: follow `graph-metadata.json.derived.last_active_child_id`; else list children with statuses.

## 6. Success criteria

- Fan-out runs N lineages concurrently (capped), each isolated, producing one merged canonical report; status ledger populated; shared SQLite shows no collision.
- Salvage recovers iterations when an executor doesn't write its file.
- **Single-executor run is byte-identical to pre-change `main`** (config, state.jsonl modulo timestamps, iteration md, research.md/review-report.md) — non-negotiable gate, run at Phase 001 and Phase 006.
- Both consumers (research + review) supported via shared runtime; docs updated; `validate.sh --strict` green per child.

## 7. Verification

- Unit: pool cap + allSettled isolation; fan-out schema (parse/conflict/expand); salvage; both merges.
- Integration: 2-lineage × 2-iter dry run on a throwaway packet (`native` + one cheap CLI).
- Parity: single-executor byte-identical to `main`.

## 8. References

- Approved plan: `~/.claude/plans/synthesize-findings-if-you-joyful-hejlsberg.md`.
- Prototype: `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/run_one.sh`.
- Runtime: `.opencode/skills/deep-loop-runtime/`. Commands: `.opencode/commands/deep/`. Consumers: `deep-research`, `deep-review` SKILLs.
