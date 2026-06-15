---
template: handover
scope: "deep-loop native fan-out parallel multi-executor (packet 123)"
status: "in-progress — Phases 1-2 of 6 complete & green; Phases 3-6 remain"
updated: "2026-05-30T00:00:00Z"
---

# Handover: deep-loop native fan-out parallel multi-executor (packet 123)

<!-- AI-FIRST HANDOFF: Optimized for an AI agent (or fresh session) continuing this work. -->

## 0. TL;DR (read this first)

We are adding an **opt-in "fan-out" layer** so `/deep:start-research-loop` and `/deep:start-review-loop`
can run **N executor "lineages" concurrently (capped)**, each running the loop in its own isolated
sub-packet, then a cross-lineage merge — generalizing the manual pattern proven in packet 122.
**Single-executor stays the default and must stay byte-identical** (hard parity gate).

- **DONE (verified green, full suite 171/171):** Phase 1 (fan-out config schema) + Phase 2 (capped worker pool + status ledger).
- **REMAINING:** Phase 3 (per-lineage spawn + `--artifact-dir-override` in 4 YAMLs), Phase 4 (salvage + coverage-graph per-sessionId), Phase 5 (consumer merges + synthesis hooks), Phase 6 (command flags + docs + final parity).
- **⚠️ BLOCKER-CLASS OPEN DECISION before Phase 3 — see §4.A.** "Run the existing loop per lineage" does not map cleanly onto this codebase because the loop is **agent/YAML-orchestrated, not a headless binary**. Resolve this first.
- **Approved plan:** `~/.claude/plans/synthesize-findings-if-you-joyful-hejlsberg.md`.
- **Sibling research (the "why" + design detail):** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md`.

---

## 1. Current State

Packet `123-deep-loop-parallel-fanout` is scaffolded (parent `spec.md` validates strict-clean; 6 phase children).
**Phases 1 & 2 are implemented and verified** — full `deep-loop-runtime` unit suite **171/171 pass, 0 failures**.
Single-executor path is untouched (parity holds). Phases 3-6 are not started. There is one architectural
question (§4.A) that must be answered before Phase 3 code is written.

### What is DONE (with exact, grep-verified facts)

**Phase 1 — fan-out config schema** (`001-schema-config-plumbing/`, summary in that folder):
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` (+118 lines). Added, WITHOUT touching the existing `executorConfigSchema` / `parseExecutorConfig` / `resolveExecutorConfig`:
  - `lineageExecutorSchema` = `executorConfigSchema.extend({ label (dir-safe /^[a-z0-9][a-z0-9-]*$/), count (int≥1, default 1), iterations (int≥1|null, default null) })`
  - `fanoutConfigSchema` = `{ executors: lineageExecutorSchema[] (min 1), concurrency: int≥1 (default 2) }`
  - `parseFanoutConfig(raw)` — routes each entry through the EXISTING `parseExecutorConfig` (reuses all kind/model/flag rules), enforces unique + non-colliding-expanded labels.
  - `expandLineages(config)` — count→labels (count 1 keeps base; count N → `label-1…label-N`, each single-replica).
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` — optional `lineageId?: string` on `RunAuditedExecutorCommandInput` (the type ~L95-106) and `buildExecutorAuditRecord(executor, lineageId?)` (~L490), spread CONDITIONALLY so records are byte-identical when absent. **Defined but not yet consumed** — first consumer is Phase 3/5.
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` — 36 tests (27 original + 9 fan-out).

**Phase 2 — capped worker pool + status ledger** (`002-capped-pool-status-ledger/`):
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` (NEW). Exports: `runCappedPool`, `settleItem`, `buildPoolSummary`, `appendStatusLedger`, `writeOrchestrationSummary`.
  - `runCappedPool({ items, concurrency, worker, now?, onEvent? })` — ≤concurrency in flight (clamped ≥1), never-throws per-item settlement, **ordered results**, `{ results, summary:{total,succeeded,failed,all_failed} }`. This is the concurrency-capped generalization of `lib/council/multi-seat-dispatch.cjs` (which lacks a cap). **`worker` is INJECTED** — the real per-lineage worker is Phase 3.
  - Ledger helpers generalize packet-122's `orchestration-status.log` (JSONL events) + `orchestration-summary.json`.
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` (NEW, 10 tests).

---

## 2. Critical Context (decisions, constraints, non-obvious facts)

### Decisions already locked (do not relitigate)
- **Scope:** full native feature; **single-executor remains the recommended default**; fan-out is opt-in; default path byte-identical (hard parity gate at Phase 1 + Phase 6).
- **Per-lineage execution = "Option B"** in spirit (reuse the existing loop per lineage in an isolated sub-packet, do NOT re-implement convergence in JS) — BUT see §4.A: the concrete mechanism is unresolved.
- **Coverage-graph isolation = per-lineage `session_id`.** `coverage-graph-db.ts` keys everything by `(spec_folder, loop_type, session_id, …)` (nodes/edges PK; snapshots `UNIQUE(…, iteration)`), `SCHEMA_VERSION=2` with a **destructive** drop-and-recreate migration, WAL mode. Giving each lineage its own `session_id` ⇒ collision-free on the shared SQLite **with zero schema change**. Do NOT add a `lineageId` column (triggers the destructive migration + the SKILL's ESCALATE-IF gate) and do NOT open per-lineage sub-DBs (violates the single-DB-owner invariant).
- **Convergence stays per-lineage and unchanged** (research 0.05 newInfoRatio; review 0.10 weighted P0/P1/P2 + 9 gates + P0-override). No cross-lineage convergence vote. Only the MERGE is consumer-specific.
- **Backward-compat rule:** config carries EITHER `config.executor` (single) OR `config.fanout` (multi), never both. The both-present guard is deferred to Phase 6 (command surface) — no call site writes `config.fanout` yet.

### Non-obvious facts an implementer MUST know
- **`kind` vs `type` — INCONSISTENT across the two YAMLs (grep-verified):** the dispatch step `step_dispatch_iteration` branches on **`config.executor.type`** in `deep_start-research-loop_auto.yaml` (L573) but on **`config.executor.kind`** in `deep_start-review-loop_auto.yaml` (L696). Both work because `normalizeExecutorConfigInput` (executor-config.ts) aliases `type`→`kind`, and the canonical schema field is `kind`. Phase 3/6 must tolerate BOTH spellings (and ideally normalize research to `kind` while there). Fan-out config entries use `kind`.
- **`loop-lock.ts` is PER-PACKET** (caller-supplied `lockPath`, `packetId` in the lock data). Separate sub-packets ⇒ zero lock contention. Reuse as-is; do not change it.
- **Per-kind state-dir env hooks exist** for same-kind-replica isolation: `getDefaultStatePaths` reads `process.env.SPECKIT_CODEX_STATE_DIR` (and siblings per kind), used by the recursion-guard lockfile check. Two lineages of the SAME cli kind may trip the lockfile guard; scope each via its own `SPECKIT_<KIND>_STATE_DIR`. **Verify this in the Phase 3 dry run** (distinct kinds are safe; same-kind replicas are the risk).
- **The packet-122 "prototype" is NOT a faithful per-lineage loop.** What was actually run there: `run_one.sh` + `xargs -P 2` dispatched **independent single-iteration** executor calls (`opencode run` / `codex exec` / `claude -p`) over a flat `for iter; for model` job list, with a salvage step + status ledger. There was **no convergence check, no reducer, no inter-iteration state read**. So "fan-out that reuses the existing loop verbatim" is a STRONGER claim than what was prototyped. Keep this honesty in mind when designing Phase 3 (see §4.A).
- **Salvage is mandatory (proven need):** weak CLI executors (e.g. MiniMax via opencode) intermittently DON'T write their output files, and codex/headless sandboxes sometimes block in-repo writes. Phase 4 must recover the executor's stdout reply → write the missing iteration md. In 122 this recovered every otherwise-lost iteration.

---

## 3. Next Steps (Phases 3-6, file-level)
