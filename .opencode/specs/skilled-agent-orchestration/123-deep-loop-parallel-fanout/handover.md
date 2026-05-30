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

> **Re-anchor before editing.** Line numbers drift; the transport was flaky this session. ALWAYS
> `grep -n` the step/function NAME first, read the real region, then Edit against verified strings.
> After every Edit, `grep -c` to confirm it landed (an earlier edit in this packet silently failed
> on a wrong anchor string — see §4.D).

### Phase 3 — Per-lineage spawn + sub-packet isolation (`003-per-lineage-spawn-isolation/`)
**FIRST resolve §4.A.** Then:
- Add the spawn worker (and the CLI entry that wires `runCappedPool` + worker + ledger) — likely in `fanout-pool.cjs` or a sibling `scripts/fanout-run.cjs`. Use the script-entry contract from `scripts/convergence.cjs` (tsx bootstrap L33-63; argv parse; JSON-out; exit codes via `scripts/lib/cli-guards.cjs` → `classifyExitCode` 1=script/2=DB/3=input, `validateNamespaceValue`, `installSignalHandlers`).
- Sub-packets live at `{artifact_dir}/lineages/{label}/`. Pass each lineage `env SPECKIT_FANOUT_LINEAGE_ID={label}`.
- Add an `--artifact-dir-override` branch to the artifact-dir step in ALL 4 YAMLs (real anchors, grep-verified 2026-05-30):
  - step name in all four = **`step_resolve_artifact_root`**. research_auto **L126-133**; review_auto **L115-118**; plus the same step in `deep_start-research-loop_confirm.yaml` and `deep_start-review-loop_confirm.yaml`.
  - Today it runs `resolveArtifactRoot` INLINE via `node -e "...require('.opencode/skills/system-spec-kit/shared/review-research-paths.cjs')...resolveArtifactRoot('{spec_folder}', '<mode>')"` and binds `artifact_dir`. (`resolveArtifactRoot` is at `review-research-paths.cjs:200`.)
  - Override logic: if `--artifact-dir-override` / `config.fanout` sub-packet dir is present → bind `artifact_dir` to it; else run the existing inline resolver unchanged.
- Reuse per-iteration libs UNCHANGED: `renderPromptPack` (prompt-pack.ts), `runAuditedExecutorCommand`/`Async` (executor-audit.ts L584/L661), `writeFirstRecordExecutor` (L509), `validateIterationOutputs` (post-dispatch-validate.ts). Pass `lineageId` to the audited command now (the field added in Phase 1).
- **Test:** integration — pool spawns a stub twice into two `lineages/{label}/` trees; assert distinct trees + distinct sessionIds + no lock contention.

### Phase 4 — Salvage sweep + coverage-graph per-sessionId (`004-salvage-coverage-graph/`)
- After each lineage sub-loop, sweep with `validateIterationOutputs`; on `iteration_file_missing` / `iteration_file_empty`, read `{sub-packet}/logs/iter-NNN.out`, parse the opencode `--format json` text parts (`{type:"text",part:{text}}`) else raw, write the missing `iterations/iteration-NNN.md`, append a `salvaged_from_stdout` event, re-validate; still-missing ⇒ failed marker (loop's stuck-recovery owns persistence).
- Confirm each lineage's own `session_id` scopes `convergence.cjs` (`--session-id`) + coverage writes. No schema change.
- **Test:** unit (missing-md+stdout ⇒ salvaged; still-missing ⇒ failed); integration (two lineages, distinct sessionIds, shared `deep-loop-graph.sqlite`, explicit no-collision assertion).

### Phase 5 — Consumer merges + synthesis hooks (`005-consumer-merges-synthesis/`)
- New `scripts/fanout-merge.cjs` (`--loop-type research|review`), reads every `{artifact_dir}/lineages/{label}/` registry + iterations + state log.
- New `step_fanout_merge` at the TOP of each `phase_synthesis`, gated on `config.fanout` present (absent ⇒ synthesis unchanged):
  - **research** (research YAML `phase_synthesis` L912; compile step `step_compile_research` L952): dedup findings (reuse reducer content-hash) + cross-model attribution → consolidated `deep-research-findings-registry.json` → existing compiler emits canonical `research.md` unchanged.
  - **review** (review YAML `phase_synthesis` L1124; `step_derive_verdict` L1150 → `step_build_finding_registry` L1172 → `step_compile_review_report` L1223): severity rollup with **strongest-restriction** (ANY lineage active P0 ⇒ merged FAIL) → consolidated `deep-review-findings-registry.json` → existing compiler emits `review-report.md` + verdict. NOTE the review verdict is derived in `step_derive_verdict` from `active_p0/p1/p2` counts — the merge must feed it the rolled-up counts.
  - Both write `{artifact_dir}/fanout-attribution.md` (per-lineage convergence, iters, salvage events, model attribution).
- **Test:** unit (research dedup/attribution; review rollup + strongest-restriction: A clean + B P0 ⇒ merged FAIL); integration (2-lineage fixture → merged registry → existing synthesis → canonical report unchanged in shape).

### Phase 6 — Command surface + docs + final parity (`006-command-surface-docs-parity/`)
- `commands/deep/start-research-loop.md` + `start-review-loop.md` §0: repeatable `--executor` (groups trailing `--model/--reasoning-effort/--service-tier/--executor-timeout/--iters/--label/--count`), `--executors <json>` escape hatch, `--concurrency N`; extend the Default Resolution Table + PRE-BOUND SETUP ANSWERS; add fan-out EXAMPLES. **Default policy: 0–1 executor & no `--executors` ⇒ write `config.executor` (single, unchanged, documented as the recommended default); 2+ / `--executors` / any `count>1` ⇒ write `config.fanout`.** Add the both-present fail-fast here.
- Docs: `deep-research/SKILL.md` (§4 NEVER #9 "Simulate loop dispatch" + the EXPERIMENTAL/reference-only wave section) and `deep-review/SKILL.md` (FORBIDDEN INVOCATION PATTERNS) — carve out that **command-driven fan-out is supported**; ad-hoc shell dispatch + intra-lineage wave stay forbidden/deferred. Add "Fan-Out Convergence" to both `references/convergence/convergence.md`. Add `fanout-pool.cjs`/`fanout-merge.cjs` rows to `deep-loop-runtime/SKILL.md` script table + reaffirm single-DB-owner + per-sessionId isolation.
- **Final parity gate (non-negotiable):** a single-executor run is byte-identical to pre-change `main` (config, state.jsonl modulo timestamps, iteration md, research.md/review-report.md). Snapshot-diff a real single-executor run.

---

## 4. Active Blockers & Risks

### 4.A — OPEN DESIGN DECISION (resolve before Phase 3) 🚩
"Run the existing loop per lineage" has **no headless entry point** in this codebase (grep-verified 2026-05-30).
The loop is agent/YAML-orchestrated — `step_dispatch_iteration` (research L535, review L651) runs the **native
path via `agent: deep-research`** (research L576) and the **CLI paths via `tool: bash` calling
`runAuditedExecutorCommand`** (research L585/598, branches for codex/gemini/claude-code/opencode/devin).
There is no "run the whole loop unattended" binary to `spawn` N times. The native/`@deep-research` lineage in
particular CANNOT be driven headlessly without the agent.
So a faithful fan-out needs one of:
- **(Option B-spawn, recommended):** add a thin **headless single-lineage loop driver** (`scripts/fanout-run.cjs` or a mode of `fanout-pool.cjs`) that, per lineage, runs the loop control-flow in JS by CALLING the existing runtime pieces as subprocesses/functions: `renderPromptPack` → `runAuditedExecutorCommand` (CLI) — note the **native/`@deep-research` path can't be driven headlessly without the agent**, so fan-out may need to require CLI executors per lineage (or treat `native` as "this agent runs it inline, others spawn"). It calls `convergence.cjs` each iteration so convergence is NOT re-implemented. This is "Option B" honestly realized; it re-implements only the loop's *control flow*, not its math.
- **(Option agent-orchestrated):** the agent running the fan-out command dispatches per-lineage sub-runs itself (Task sub-agents or sequential), with `fanout-pool.cjs` providing the cap/ledger for the CLI lineages only. Closer to what was done manually, but parallelism then depends on the agent, not an unattended process.

**Recommendation:** confirm with the user, then most likely Option B-spawn restricted to CLI executor lineages (native lineage, if any, runs inline in the orchestrating agent). Capture the decision in `003-…/decision-record.md` before coding. This is the single biggest risk to the plan's "native, unattended" promise.

### 4.B — Transport instability (this session) ⚠️
The Bash tool stalled repeatedly — long hangs, duplicated/dropped outputs, several forced backoffs.
This DIRECTLY caused a false claim (§4.D). Mitigations that worked: write test output to `/tmp/*.out` then
`grep` it; ONE guarded poll per turn (not stacked); `awk 'NR>=A&&NR<=B{print NR": "$0}'` to get authoritative
line content before an Edit. If it recurs badly, **stop and continue in a fresh session** — net-new file
authoring (Phases 3-5) is exactly where a dropped result corrupts the record.

### 4.C — Pre-existing flaky test (NOT ours)
`deep-loop-runtime/tests/unit/loop-lock.vitest.ts > "allows exactly one fresh cross-process acquire to win"`
is a cross-process timing test that flakes (passed 7/7 isolated once, failed 1/7 another run). `loop-lock.ts`
is NOT in this packet's diff. Treat a lone `loop-lock` failure as the known flake; everything else must be green.

### 4.D — Process lesson (do not repeat)
Earlier this session an implementation-summary was written claiming "163/163, +9 tests, lineageId 4 refs"
from edits that had **silently failed to apply** (wrong anchor strings, masked by the flaky shell). It was
caught via `git status` + grep and corrected. **Rule: never write a count/claim before reading a CLEAN
test/grep result; grep-verify every Edit landed.**

### 4.E — Spec-folder validation debt (non-blocking, cosmetic)
`validate.sh --strict` on the packet folder reports (verified 2026-05-30):
- **Parent:** 0 errors, **1 warning** `SPECDOC_FRONTMATTER_006` (session-lineage cross-check: `parent_session_id
  references missing sessionId`). Non-fatal; the parent's continuity content is correct. It surfaces because the
  lean children carry no `session_dedup` block. Strict mode reports any warning as RESULT: FAILED, but **Errors: 0**.
- **Children:** FAIL with real errors — missing `checklist.md` and lean hand-authored docs lacking full SPECKIT
  template anchors (same pattern as packet 122's children).
Decide before the packet completion claim: add `checklist.md` + template anchors (+ session_dedup) per child and
to the parent, OR formally accept lean docs. Do NOT let this block the code phases; reconcile in/after Phase 6.
Code correctness is independent of this — it is governed by the vitest suites in §6.

### 4.F — Comment hygiene gate (active pre-commit hook)
No spec-folder paths, packet/phase numbers, ADR/REQ/CHK/task/finding ids in CODE comments (keep the durable
WHY). The new `.cjs` files (fanout-pool/fanout-merge/fanout-run) must comply — the pre-commit + write-time
hook block violations. (Markdown spec docs are exempt.)

---

## 5. Key Files

| File | Purpose | Status |
|------|---------|--------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Fan-out schema (`parseFanoutConfig`/`expandLineages`) | **Modified (P1, done)** |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Optional `lineageId` in audit | **Modified (P1, done)** |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | +9 fan-out tests (36 total) | **Modified (P1, done)** |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Capped pool + ledger primitive | **New (P2, done)** |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` | 10 pool/ledger tests | **New (P2, done)** |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (or pool mode) | Per-lineage spawn/driver | **New — P3 (after §4.A)** |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Consumer merges (research/review) | **New — P5** |
| `.opencode/commands/deep/assets/deep_start-{research,review}-loop_{auto,confirm}.yaml` (×4) | `--artifact-dir-override` (P3) + `step_fanout_merge` (P5) | **Needs work — P3, P5** |
| `.opencode/commands/deep/start-{research,review}-loop.md` (×2) | Fan-out flag parsing + default policy | **Needs work — P6** |
| `deep-research/SKILL.md`, `deep-review/SKILL.md`, both `references/convergence/convergence.md`, `deep-loop-runtime/SKILL.md` | Docs: permit command-driven fan-out, keep wave deferred | **Needs work — P6** |

### Reusable building blocks (verified exports — reuse, don't rebuild)
- `lib/council/multi-seat-dispatch.cjs` — the parallel-dispatch template (generalized into `runCappedPool`).
- `lib/deep-loop/executor-audit.ts`: `runAuditedExecutorCommand` (L584), `runAuditedExecutorCommandAsync` (L661), `writeFirstRecordExecutor` (L509), `buildExecutorDispatchEnv` (L465), `validateExecutorDispatchAllowed` (L403), `getDefaultStatePaths` (L177, reads `SPECKIT_<KIND>_STATE_DIR`).
- `lib/deep-loop/prompt-pack.ts`: `renderPromptPack`. `lib/deep-loop/post-dispatch-validate.ts`: `validateIterationOutputs`.
- `lib/deep-loop/loop-lock.ts`: per-packet lock (reuse as-is).
- `scripts/lib/cli-guards.cjs`: `acquireWriterLock`, `classifyExitCode`, `installSignalHandlers`, `validateNamespaceValue`, `sleepSync`, `maybeThrowTestFault`.
- `scripts/convergence.cjs`: script-entry contract template (tsx bootstrap + JSON-out + exit codes) AND the per-lineage convergence call (`--spec-folder --loop-type --session-id --iteration`).
- `system-spec-kit/shared/review-research-paths.cjs:28`: `resolveArtifactRoot(specFolder, mode)`.

---

## 6. Verification

Run from `.opencode/skills/system-spec-kit/mcp_server` (that is where vitest + tsx resolve):

```bash
cd .opencode/skills/system-spec-kit/mcp_server
# Phase 1+2 reconfirm (current green baseline):
npx vitest run ../../deep-loop-runtime/tests/unit/                 # expect 171/171 (ignore lone loop-lock flake §4.C)
npx vitest run ../../deep-loop-runtime/tests/unit/executor-config.vitest.ts   # 36
npx vitest run ../../deep-loop-runtime/tests/unit/fanout-pool.vitest.ts       # 10
```

```bash
# Sanity that the new module loads + exports:
node -e "console.log(Object.keys(require('./.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs')))"
#   → runCappedPool,settleItem,buildPoolSummary,appendStatusLedger,writeOrchestrationSummary

# Scope check (Phase 1+2 should be exactly these 5 files under deep-loop-runtime):
git status --short .opencode/skills/deep-loop-runtime/
```

```bash
# Packet validation (parent passes; children currently fail on template debt §4.E):
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/skilled-agent-orchestration/123-deep-loop-parallel-fanout --strict
```

**Per-phase gates:** every phase ends green on `npx vitest run ../../deep-loop-runtime/tests/unit/` (no new
failures beyond the loop-lock flake). **Packet gate (Phase 6):** the byte-identical single-executor parity
snapshot-diff + a real 2-lineage × 2-iter integration dry run (one `native`-or-inline + one cheap CLI like
`cli-opencode`/`cli-codex`) producing two sub-packets and one merged canonical report + a populated
`orchestration-status.log`.

---

## 7. Reference Material

- **Approved plan:** `~/.claude/plans/synthesize-findings-if-you-joyful-hejlsberg.md`
- **Parent spec + per-phase specs:** `.opencode/specs/skilled-agent-orchestration/123-deep-loop-parallel-fanout/` (`spec.md` + `001…/`–`006…/spec.md`; `001/`, `002/` also have `implementation-summary.md` with the verified details + honesty notes).
- **Design research (decision-grade, 343 lines):** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md`.
- **Manual prototype to mine (capped parallel dispatch + salvage + ledger):** `…/122-…/001-skill-benchmark-deep-research/research/run_one.sh`.
- **Runtime skill:** `.opencode/skills/deep-loop-runtime/SKILL.md`. **Consumers:** `deep-research`/`deep-review` SKILLs + their `references/convergence/convergence.md`.
- **Resume tip:** `graph-metadata.json.derived.last_active_child_id` points at the active child; parent `spec.md` `_memory.continuity.next_safe_action` = "Phase 003: spawn worker + --artifact-dir-override YAML branch (4 YAMLs)".
