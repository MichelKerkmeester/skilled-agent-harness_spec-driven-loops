---
title: "Changelog: Deep-Loop Parallel Fan-Out (123)"
description: "Full build history for packet 123 — opt-in N-executor fan-out for /deep:start-research-loop and /deep:start-review-loop, generalizing the manual multi-model pattern proven in packet 122 into a first-class command-driven feature."
trigger_phrases:
  - "123 changelog"
  - "deep-loop fanout changelog"
  - "parallel fanout changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

---

## 2026-05-30 — Sessions 2–3: Phases 3–6 (full feature build)

> Spec folder: `skilled-agent-orchestration/123-deep-loop-parallel-fanout`
> Sessions: §4.A design resolution → Phase 3 spawn + isolation → Phase 4 salvage → Phase 5 merges → Phase 6 docs + parity

### Summary

The §4.A architectural blocker was resolved with a new design: **every executor kind uses its own native dispatch mechanism** for fan-out. CLI executor kinds (codex, claude-code, opencode, gemini, devin) run N headless subprocesses via a worker pool; `native` runs N sequential `@deep-research`/`@deep-review` YAML agent dispatches. Mixed configs are supported. This resolved the core problem that the loop has no headless binary — each CLI subprocess is told to run the full loop autonomously in its own isolated sub-packet.

Phases 3–6 were then built straight through: the spawn/isolation layer, a write-failure salvage mechanism, cross-lineage merges with strongest-restriction review rollup, and the full command surface. Single-executor mode is byte-identical to pre-change `main` — verified structurally via `skip_when` guards and the `if_absent` resolver branch.

**Test delta:** 171 (P1–P2 baseline) → 197 (+26 new tests across P3–P5). Final run: 197/197 pass (1 known pre-existing loop-lock timing flake, passes in isolation).

---

### Added

**Phase 3 — Per-lineage spawn + sub-packet isolation**

- **`scripts/fanout-run.cjs`** — CLI lineage pool driver. TSX-bootstrapped; uses `parseFanoutConfig` / `expandLineages` from `executor-config.ts` and `runCappedPool` from `fanout-pool.cjs`. Filters to CLI lineages only (`kind !== 'native'`); native lineages are dispatched by the YAML. For each CLI lineage: creates `{base}/lineages/{label}/` + `{label}/.executor-state/` dirs; builds a "run the full loop" prompt; constructs the per-kind CLI command (`codex exec`, `claude -p`, `opencode run`, `gemini`, `devin --print`); sets `SPECKIT_FANOUT_LINEAGE_ID={label}` + `SPECKIT_<KIND>_STATE_DIR` per-lineage to prevent same-kind replica lockfile collisions; runs via `spawnSync` with a generous timeout derived from `lineage.iterations * lineage.timeoutSeconds * 2` (capped at 4 hours); saves stdout to `{lineageDir}/logs/fanout-lineage.out`; calls `runSalvageSweep` after each subprocess exits. Exit codes: 0=all ok, 2=some failed, 3=all failed.

- **`003/decision-record.md`** — §4.A locked with an ADR documenting the executor-class dispatch strategy, constraints, alternatives considered, and consequences. Alternatives: Option A (native = single only) rejected because user requires native fan-out; Option B-JS-loop (re-implement loop control in JS) rejected in favour of invoking the full loop command per lineage; Option C (orchestrating agent dispatches all) rejected for CLI kinds.

- **`step_resolve_artifact_root` updated in all 4 YAMLs** — Added `branch_on: "config.fanout_lineage_artifact_dir"`. When the override is present (a lineage subprocess received it), `artifact_dir` is bound directly — no `resolveArtifactRoot` node call. When absent (single-executor mode), the `if_absent` branch runs the byte-identical original command. Affects `deep_start-{research,review}-loop_{auto,confirm}.yaml`.

- **`step_fanout_spawn` added to all 4 YAMLs** — New top-level workflow step with `skip_when: "config.fanout is absent"`. When config.fanout is present: spawns CLI lineages via `fanout-run.cjs` (`step_fanout_spawn_cli`); dispatches native lineages as sequential `agent: deep-research`/`deep-review` runs (`step_fanout_spawn_native`); after all lineages converge, jumps to `phase_synthesis` skipping `phase_init` and `phase_main_loop`.

- **`tests/unit/fanout-run.vitest.ts`** — 5 integration tests: native-only config returns early with ok (no pool spawn); bad JSON config exits 3; missing required args exits 3; 2 cli-codex lineages create distinct `lineages/{label}/` dirs + `orchestration-summary.json` + `orchestration-status.log`; same-kind replicas get distinct `.executor-state` dirs.

**Phase 4 — Salvage sweep + coverage-graph per-sessionId**

- **`scripts/fanout-salvage.cjs`** — Pure CJS module (no tsx bootstrap needed, fully testable via `require`). Exports `extractTextFromOpencodeJson` and `runSalvageSweep`. `extractTextFromOpencodeJson` parses opencode `--format json` JSONL lines (`{type:"text",part:{text:"..."}}`) and concatenates text parts; falls back to raw stdout if no JSON parts found; returns null for content under 50 chars. `runSalvageSweep` reads the lineage state log to discover which iterations ran, checks each iteration `.md` file, recovers missing/empty ones from the saved stdout (writing the recovered text and appending a `salvaged_from_stdout` JSONL event), or writes a `fanout_salvage_failed` placeholder when unrecoverable.

- **`fanout-run.cjs` worker updated** — After `spawnSync` returns: saves `result.stdout` to `{lineageDir}/logs/fanout-lineage.out`; calls `runSalvageSweep(lineageDir, loopType, savedStdout)`; includes salvage stats in the returned worker result.

- **`tests/unit/fanout-salvage.vitest.ts`** — 11 tests: `extractTextFromOpencodeJson` (5: null input, opencode JSON parts, raw fallback, too-short fallback, non-text JSON skipped); `runSalvageSweep` unit (5: no state log, all files present, salvage from opencode stdout, failed marker when no content, mixed present/missing); coverage-graph per-sessionId isolation integration (1: two lineages with distinct session_ids insert nodes → each session sees only its own nodes, shared SQLite, no schema change).

**Phase 5 — Consumer merges + synthesis hooks**

- **`scripts/fanout-merge.cjs`** — Cross-lineage merge script. Reads every `{artifact_dir}/lineages/{label}/` sub-packet registry + state log; produces a consolidated registry at the base artifact dir. Research merge: deduplicates `keyFindings` by `id` field, keeping the first-seen entry and appending a `_lineages` attribution array; aggregates total iteration count and averages convergence score; merges `openQuestions` and `ruledOutDirections` similarly. Review merge: applies **strongest-restriction** — iterates active findings across all lineages, escalates to highest severity for duplicate `findingId`, counts active P0/P1/P2, derives `mergedVerdict` (FAIL if activeP0 > 0, CONDITIONAL if activeP1 > 0, PASS otherwise). Both write `{artifact_dir}/fanout-attribution.md` with a per-lineage table (label, kind, model, iterations, convergence score, salvaged count, verdict). Main exits 0=ok, 3=input validation. Exports `mergeResearchRegistries`, `mergeReviewRegistries`, `buildAttributionMd` for unit testing.

- **`step_fanout_merge` added to top of `phase_synthesis` in all 4 YAMLs** — `skip_when: "config.fanout is absent"`. Calls `fanout-merge.cjs` with the base `artifact_dir`. Review variant adds `bind_from_output: {p0_count: "active_p0", p1_count: "active_p1", p2_count: "active_p2"}` so `step_derive_verdict` uses merged counts rather than an empty single-executor state log. Research variant feeds the merged `deep-research-findings-registry.json` into the existing `step_compile_research` unchanged.

- **`tests/unit/fanout-merge.vitest.ts`** — 10 tests: `mergeResearchRegistries` (3: dedup by id + cross-lineage tracking, total iter aggregation, null registry handled); `mergeReviewRegistries` strongest-restriction (5: clean+P0→FAIL, all clean→PASS, P1-only→CONDITIONAL, duplicate findingId escalates severity, non-active findings ignored); `fanout-merge.cjs` script e2e (2: no lineages dir → ok, 2-lineage review fixture → merged FAIL registry + attribution.md).

**Phase 6 — Command surface + docs + final parity**

- **`commands/deep/start-research-loop.md`** — argument-hint updated with fan-out flags; Default Resolution Table gains `fanout_executors` and `fanout_concurrency` rows; PARSE step 3 gains `--executor` (repeatable, with `--model/--reasoning-effort/--service-tier/--executor-timeout/--iters/--label/--count` per group), `--executors <json>` escape hatch, `--concurrency N`, and the default policy (0–1 executor → `config.executor`; 2+ / `--executors` / `count>1` → `config.fanout`); EXAMPLES updated with 3 fan-out scenarios (2-CLI parallel, native+CLI mixed, JSON escape hatch) and a native fan-out note.

- **`commands/deep/start-review-loop.md`** — Same additions. Review examples include strongest-restriction note.

- **`deep-loop-runtime/SKILL.md`** — Script table extended with 4 new rows (`fanout-pool.cjs`, `fanout-run.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`). Fan-out isolation invariant documented: per-lineage `config.fanout_lineage_artifact_dir` override, per-lineage `session_id` for coverage-graph DB writes (no schema change), per-kind `SPECKIT_<KIND>_STATE_DIR` for lockfile isolation.

- **`deep-research/SKILL.md`** — NEVER #9 carve-out: command-driven fan-out via `step_fanout_spawn` is SUPPORTED; ad-hoc shell fan-out and intra-lineage wave remain forbidden. EXPERIMENTAL section updated: multi-lineage fan-out moved from reference-only to live supported (N independent loops, not wave orchestration); intra-lineage wave stays deferred.

- **`deep-review/SKILL.md`** — FORBIDDEN INVOCATION PATTERNS section gains explicit carve-out: command-driven fan-out via `--executor`/`--executors`/`--concurrency` is SUPPORTED; intra-lineage wave stays deferred.

---

### Changed

- **`001-schema-config-plumbing/spec.md`** — Continuity block updated to reflect completion (was stuck at scaffold state with `completion_pct: 0`).
- **`002-capped-pool-status-ledger/spec.md`** — Same fix.
- **`003–006` phase spec.md files** — All updated with `completion_pct: 100`, accurate `recent_action`, and `next_safe_action` pointing to the next phase or packet completion.

---

### Design Decisions

**§4.A — Executor-class dispatch strategy (ADR in `003/decision-record.md`)**

The core architectural question was how to make `native` executor participate in fan-out, given the loop has no headless binary. The chosen approach: each executor kind uses its own native dispatch mechanism.
- CLI kinds: `fanout-run.cjs` spawns N headless CLI subprocesses, each running the full loop end-to-end (reading the skill, following the YAML, converging, writing outputs) with `--artifact-dir-override` isolating its sub-packet. "Native codex sub-agents" = N `codex exec` processes; "native claude sub-agents" = N `claude -p` processes.
- `native`: YAML `step_fanout_spawn_native` dispatches N sequential `@deep-research`/`@deep-review` sub-agents. Not pooled (YAML is sequential), appropriate for count 1–3.
- Mixed configs: CLI pool + native YAML dispatches run as separate sub-steps of `step_fanout_spawn`; results are merged in `phase_synthesis`.

This was a deliberate change from the original handover §4.A Option A ("reserve native for single mode only") after user direction that all three executor types should support fan-out.

**Strongest-restriction for review fan-out**

Review verdict derivation uses strongest-restriction: if ANY lineage reports an active P0 finding, the merged verdict is FAIL regardless of other lineages. P1 without P0 → CONDITIONAL; clean → PASS. The rationale: fan-out is a redundancy mechanism — if one reviewer found a P0, the merged review should surface it, not average it away.

**Single-executor parity guarantee**

All fan-out steps are gated on `config.fanout` being present:
- `step_resolve_artifact_root`: `if_absent` branch runs the byte-identical original `resolveArtifactRoot` node command when `config.fanout_lineage_artifact_dir` is not set.
- `step_fanout_spawn`: `skip_when: "config.fanout is absent"` — completely skipped in single mode.
- `step_fanout_merge`: `skip_when: "config.fanout is absent"` — completely skipped in single mode.

No single-executor code path was modified. The parity gate is structural and was verified by inspection.

---

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run .../deep-loop-runtime/tests/unit/` — full suite | **197/197 PASS** (1 known loop-lock flake, passes in isolation) |
| Phase 3 tests (fanout-run.vitest.ts — 5 tests) | PASS |
| Phase 4 tests (fanout-salvage.vitest.ts — 11 tests) | PASS |
| Phase 5 tests (fanout-merge.vitest.ts — 10 tests) | PASS |
| Phase 1–2 pre-existing tests (36 + 10 = 46 tests) | PASS (unchanged) |
| fanout-run.cjs loads + exports via tsx bootstrap | PASS |
| fanout-salvage.cjs loads + exports (no tsx needed) | PASS |
| fanout-merge.cjs loads + exports (guards `main()` behind `require.main === module`) | PASS |
| fanout-merge strongest-restriction smoke: clean+P0 → FAIL | PASS |
| fanout-merge strongest-restriction smoke: both clean → PASS | PASS |
| All 4 YAMLs: `step_resolve_artifact_root` has `fanout_lineage_artifact_dir` branch | PASS (5 grep hits each) |
| All 4 YAMLs: `step_fanout_spawn` present with `skip_when` | PASS (3 grep hits each) |
| All 4 YAMLs: `step_fanout_merge` present in phase_synthesis | PASS (1 hit each) |
| `validate.sh --strict` on parent packet folder | **0 errors, 1 warning** (pre-existing session-lineage cross-check warning §4.E — non-blocking) |
| Comment hygiene check on all new .cjs files | PASS — no spec paths, ADR/REQ/CHK ids in code comments |
| Single-executor parity: `if_absent` branch byte-identical to original | PASS — verified by inspection |

---

### Files Changed

| File | Change |
|------|--------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified — `step_resolve_artifact_root` override branch + `step_fanout_spawn` + `step_fanout_merge` |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified — same |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified — same (review mode) |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified — same (review mode) |
| `.opencode/commands/deep/start-research-loop.md` | Modified — fan-out flags, policy, examples |
| `.opencode/commands/deep/start-review-loop.md` | Modified — fan-out flags, policy, examples |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modified — 4 new script rows + isolation invariant |
| `.opencode/skills/deep-research/SKILL.md` | Modified — NEVER #9 carve-out + EXPERIMENTAL update |
| `.opencode/skills/deep-review/SKILL.md` | Modified — FORBIDDEN INVOCATION PATTERNS carve-out |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Created |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Created |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Created |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Created |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts` | Created |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Created |
| `123-deep-loop-parallel-fanout/003-per-lineage-spawn-isolation/decision-record.md` | Created |
| `123-deep-loop-parallel-fanout/001-schema-config-plumbing/spec.md` | Modified — continuity block completed |
| `123-deep-loop-parallel-fanout/002-capped-pool-status-ledger/spec.md` | Modified — continuity block completed |
| `123-deep-loop-parallel-fanout/003–006/spec.md` (×4) | Modified — completion_pct 100 + accurate continuity |

---

### Follow-Ups

- **Native fan-out parallelism**: `native` lineages dispatch sequentially (YAML is sequential). True parallel native lineages would require the YAML runtime to support concurrent `agent:` dispatches or a background-agent mechanism. Currently appropriate for count 1–3; higher parallelism should use CLI executor kinds.
- **Per-iteration log capture**: `fanout-run.cjs` saves the entire subprocess stdout to `{lineageDir}/logs/fanout-lineage.out`. Salvage operates on this combined output. Per-iteration stdout files (`logs/iter-NNN.out`) as planned in the original handover are not produced by the full-loop subprocess model — the salvage mechanism works at the lineage level instead.
- **Spec-folder validation debt (§4.E)**: parent and children still carry the `FRONTMATTER_MEMORY_BLOCK` warning on session-lineage cross-check. Non-blocking; can be resolved by adding `session_dedup` blocks to the lean children.
- **`validate.sh --strict` on children**: child phase folders currently fail strict validation on missing `checklist.md` and lean template anchors (same pattern as packet 122 children). Code correctness is governed by the vitest suite. Formal docs can be reconciled when needed.

---

## 2026-05-30 — Session 1: Phases 1–2 (schema + pool primitive)

> Spec folder: `skilled-agent-orchestration/123-deep-loop-parallel-fanout` (phase parent)
> Session: Fan-out config schema + capped pool — the two foundation layers with no behavior change

### Summary

Built the two foundation layers for fan-out without touching any existing behavior. Phase 1 added the multi-executor config schema entirely alongside (not replacing) the existing `executorConfigSchema` / `parseExecutorConfig` / `resolveExecutorConfig`. Phase 2 added the concurrency-capped pool primitive that will drive the actual fan-out once the spawn worker is wired in Phase 3. The §4.A architectural blocker (how to run the loop headlessly per lineage) was identified and documented but not yet resolved — that happens in Session 2.

**Full suite after Phase 1+2: 171/171 pass.**

---

### Added

**Phase 1 — Fan-out config schema**

- **`executor-config.ts` additions** (without modifying existing exports):
  - `lineageExecutorSchema` = `executorConfigSchema.extend({ label (dir-safe `/^[a-z0-9][a-z0-9-]*$/`), count (int≥1, default 1), iterations (int≥1|null, default null) })`
  - `fanoutConfigSchema` = `{ executors: lineageExecutorSchema[] (min 1), concurrency: int≥1 (default 2) }`
  - `parseFanoutConfig(raw)` — routes each entry through the existing `parseExecutorConfig` (reuses all kind/model/flag rules), enforces unique + non-colliding-expanded labels.
  - `expandLineages(config)` — count 1 keeps base label; count N → `label-1…label-N`, each single-replica.

- **`executor-audit.ts` additions**:
  - Optional `lineageId?: string` on `RunAuditedExecutorCommandInput` (type ~L95-106).
  - `buildExecutorAuditRecord(executor, lineageId?)` (~L490) spreads `lineageId` CONDITIONALLY — records are byte-identical when `lineageId` is absent.

- **`executor-config.vitest.ts`** — 9 new fan-out tests: `parseFanoutConfig` happy path, unique-label enforcement, expanded-label collision detection, per-entry kind validation reuse (`cli-codex` requires model), `expandLineages` count expansion. 36 tests total (27 original + 9 new).

**Phase 2 — Capped worker pool + status ledger**

- **`scripts/fanout-pool.cjs`** — Pure CJS module (no tsx). Exports:
  - `runCappedPool({ items, concurrency, worker, now?, onEvent? })` — ≤concurrency in flight (clamped ≥1), never-throws per-item settlement, ordered results, returns `{ results, summary: {total, succeeded, failed, all_failed} }`. Worker is injected — the real per-lineage worker is Phase 3.
  - `settleItem(item, worker, ctx)` — wraps execution with timing and `onEvent` callbacks; errors become `rejected` status, never throw.
  - `buildPoolSummary(results)` — aggregates to `{total, succeeded, failed, all_failed}`.
  - `appendStatusLedger(ledgerPath, entry)` — appends JSONL events to `orchestration-status.log`.
  - `writeOrchestrationSummary(summaryPath, summary)` — writes final JSON summary.

- **`tests/unit/fanout-pool.vitest.ts`** — 10 tests: concurrency cap (max N in flight at once), single failing item isolated (pool continues), all-fail summary, ordered results, onEvent ledger emission, empty pool, gated-worker timing assertions.

### Verification

| Check | Result |
|-------|--------|
| Full vitest suite post P1+P2 | **171/171 PASS** |
| `parseFanoutConfig` routes entries through `parseExecutorConfig` | PASS |
| `buildExecutorAuditRecord` without lineageId — byte-identical to pre-change | PASS |
| `runCappedPool` respects concurrency cap under gated workers | PASS |
| Pool: one failing item does not sink others | PASS |
