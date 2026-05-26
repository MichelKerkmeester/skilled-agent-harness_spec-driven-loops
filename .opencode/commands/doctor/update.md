---
description: Rebuild spec-kit runtime databases in dependency-safe order through the interactive confirm workflow.
argument-hint: "[--force] [--no-snapshot] [--cleanup-legacy] [--migrate] [--keep-snapshots] [--resume-bootstrap]"
allowed-tools: Read, Bash, Grep, Glob, mcp__mk_code_index__code_graph_status, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__code_graph_scan, mcp__mk_code_index__code_graph_apply, mcp__mk_code_index__detect_changes, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_link, mcp__mk_skill_advisor__advisor_recommend, mcp__mk_skill_advisor__advisor_status, mcp__mk_skill_advisor__advisor_validate, mcp__mk_skill_advisor__advisor_rebuild, mcp__mk_skill_advisor__skill_graph_scan, mcp__mk_skill_advisor__skill_graph_query, mcp__mk_skill_advisor__skill_graph_status, mcp__mk_spec_memory__eval_run_ablation, mcp__mk_spec_memory__session_health
---
<!-- skill_agent: system-spec-kit -->

> **Code Graph ownership:** The code-graph tier now uses `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` by default, with `SPECKIT_CODE_GRAPH_DB_DIR` as the DB-dir override.

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup. YAML owns execution. Setup values resolved here are passed to the YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Run the Unified Setup Phase and resolve: `execution_mode`, `intent`, `force`, `no_snapshot`, `cleanup_legacy`, `migrate`, `keep_snapshots`, `skip_status_check`.
> 2. Load the matching YAML only after setup values are bound:
>    - -> `doctor_update.yaml` (per-phase prompt)
> 3. Execute that YAML phase by phase. All content below is reference context for the YAML workflow.

## CONSTRAINTS

- **ONLY MODE ()**: this doctor command is always interactive by design; deleted mode suffixes are invalid.
- **DO NOT** dispatch any agent from this command.
- **ALL** execution happens through the YAML asset selected during setup.
- **YAML START CONDITION**: do not load YAML until every setup value is bound.
- **MCP STARTUP BOOTSTRAP**: `mk-spec-memory` config points to `.opencode/bin/mk-spec-memory-launcher.cjs`, not directly to `dist/context-server.js`. The launcher may build missing TypeScript output before OpenCode registers MCP tools.
- **RESTART CONTRACT**: if runtime bootstrap changes layout or build artifacts during `/doctor:update`, stop with `STATUS=RESTART_REQUIRED`; start a fresh OpenCode process and rerun with `--resume-bootstrap`.
- **SNAPSHOT DEFAULT**: snapshot every SQLite database before mutation unless `--no-snapshot` was explicitly passed.
- **TEST FAILURE INJECTION**: disposable-workspace tests may set `SPECKIT_FAIL_STEP=<dependency-step>`; production operators leave it unset.
- **MIGRATION SCOPE**: `--migrate` reads `migration-manifest.json` and refuses on gaps. This command does not create or edit that manifest.
- **LEGACY CLEANUP SCOPE**: `--cleanup-legacy` prompts per manifest-listed legacy file. No silent deletion.
- **LOCK SCOPE**: acquire `mcp_server/database/.doctor-update.flock` before probing or mutating any database.
- **STATE LOG REQUIRED**: every terminal path writes `mcp_server/database/.doctor-update.last-run.json`.

> **Format:** `/doctor:update` [flags]
> Example: `/doctor:update`

## GATE 3 STATUS: EXEMPT

| Aspect      | Value                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Location    | Runtime databases under `mcp_server/database/` plus `.doctor-update.*` lock/state files                   |
| Reason      | This command mutates generated runtime database state, not authored spec packet docs                      |
| Alternative | Canonical-path mutation boundaries, `VACUUM INTO` snapshots, post-run validation, rollback, and state log |

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL:** ASK Q0 before executing any mutating phase. Lightweight read-only status probes are allowed only after flag parsing. If `--force` is present, Q0 is auto-answered `A` and the tier-aware mid-run prompts (Q-MED, Q-LONG, Q-PROBE, Q-LEGACY, Q-FAIL) are suppressed unless they hit a hard safety gate (active-MCP detection still warns).

```
1. RESOLVE execution_mode + yaml asset:
   - Always: execution_mode = "INTERACTIVE", yaml = "doctor_update.yaml"
   - The router does not honor mode suffixes; mid-run prompts are gated by the --force flag below.

2. PARSE flags from $ARGUMENTS:
   - --force           -> force = true; warn on active MCP clients, then proceed without additional override prompt
   - --no-snapshot     -> no_snapshot = true; advanced opt-out, rollback unavailable for unsnapshotted DBs
   - --cleanup-legacy  -> cleanup_legacy = true; detect known legacy files from migration-manifest and prompt-delete each
   - --migrate         -> migrate = true; run migration-manifest Phase 0 before snapshots, refuse on manifest gap
   - --keep-snapshots  -> keep_snapshots = true; skip cleanup of snapshots older than 30 days
   - --resume-bootstrap -> resume_bootstrap = true; verify previous bootstrap state and continue after MCP restart
   - Defaults: force=false, no_snapshot=false, cleanup_legacy=false, migrate=false, keep_snapshots=false, resume_bootstrap=false

3. ASK Q0 — INITIAL CONFIRMATION (skip if --force=true):

   Print EXACTLY this prompt text and WAIT for an answer:

   ```
   /doctor:update rebuilds ALL spec-kit databases in dependency order with
   snapshots + auto-rollback on regression. ETA 8-25 min.

   Mid-run prompts:
      SHORT  steps    → auto (no prompt)
      MEDIUM steps    → 1 combined prompt   (Q-MED)
      LONG-POLE step  → ETA prompt + skip   (Q-LONG, 5-15 min)

      1) Proceed
      X) Cancel
   ```

   Accept: 1/A/Y/Proceed/Enter → proceed; X/N/Cancel → STATUS=CANCELLED, exit.
   Default if input is empty: ask again once; on second empty input STATUS=CANCELLED.

4. STORE:
   execution_mode, intent, yaml, force, no_snapshot, cleanup_legacy, migrate, keep_snapshots, resume_bootstrap, skip_status_check
```

**Phase Output:** `execution_mode` | `intent` | `yaml` | `force` | `no_snapshot` | `cleanup_legacy` | `migrate` | `keep_snapshots` | `resume_bootstrap` | `skip_status_check`

## MID-RUN PROMPT CATALOG (canonical question texts)

The YAML workflow fires these prompts at specific phases. Each prompt has a fixed ID, exact text, accepted answers, and default behavior. The AI MUST use these verbatim — do NOT paraphrase, summarize, or split into multiple messages.

### Q-MED — Combined medium-tier prompt (fires before Phase 5 medium steps)

When: about to run `code_graph_scan` and/or `eval_run_ablation`. Suppressed if `--force=true`.

Prompt text:
```
Medium-tier steps next:
   code_graph_scan      ~1-3 min   (mutates code-graph.sqlite + config.json)
   eval_run_ablation    ~2-4 min   (mutates speckit-eval.db)

Phase 3 snapshots in place → auto-rollback on gold-battery regression.

   1) Run both
   2) Run code_graph_scan only (skip eval)
   X) Cancel + rollback
```

Accept: 1/A/Y/Proceed → both; 2/Skip → code_graph_scan only; X/N/Cancel → rollback + STATUS=CANCELLED.
Default if empty: re-ask once; second empty → STATUS=CANCELLED.

### Q-LONG — Long-pole ETA prompt (fires before Phase 5 memory_index_scan)

When: about to run `memory_index_scan` on context-index + vector-index. Suppressed if `--force=true`.

Prompt text:
```
LONG-POLE: memory_index_scan over the active profile DBs (Memory MCP + vector index if Voyage/OpenAI keyed).

   ETA      5-15 min  (depends on corpus size; Voyage/OpenAI add API throughput when keyed)
   Mutates  full re-index   (rollback available via Phase 3 snapshot)
   Network  Voyage/OpenAI API required only when keyed — confirm credentials

   1) Proceed
   2) Skip   (advisor → STALE; deep-loop init still runs)
   X) Cancel + rollback
```

Accept: 1/A/Y/Proceed → proceed; 2/Skip → step skipped, mark STALE; X/N/Cancel → rollback + STATUS=CANCELLED.
Default if empty: re-ask once; second empty → STATUS=CANCELLED.

### Q-PROBE — Active-MCP-client prompt (fires in Phase 2)

When: Phase 2 detects ≥1 other MCP client connected to the spec-kit memory server. ALWAYS fires (NOT suppressed by `--force`, but `--force` reduces it to a single confirmation rather than per-client).

Prompt text:
```
Active MCP client(s) detected:
   <comma-separated client_id list>

The rebuild will cancel their open transactions and stale their cache until reconnect.

   1) Proceed anyway
   X) Cancel  (rerun when clients are idle)
```

Accept: 1/A/Y/Proceed → proceed; X/N/Cancel → STATUS=CANCELLED.
Default if empty: re-ask once; second empty → STATUS=CANCELLED.

### Q-LEGACY — Per-file legacy cleanup prompt (fires in Phase 9 only when `--cleanup-legacy=true`)

When: each file listed in migration-manifest's `legacy_cleanup_targets` array. Loops per file.

Prompt text:
```
Legacy file: <absolute path>
   Reason:   <manifest reason string>
   Size:     <human-readable size>

   Y) Delete  (irreversible)
   N) Keep    (default if empty)
   A) Yes to ALL remaining
   Q) Quit cleanup  (keep the rest, continue to Phase 10)
```

Accept: Y/Delete → rm -f; N/Keep/Skip/empty → next; A/All → auto-delete remaining; Q/Quit → exit Phase 9 early.
Default if empty: `N` (safe default = keep).

### Q-FAIL — Step-failure recovery prompt (fires in Phase 5 after one retry)

When: a step fails its first run AND the 5-second-backoff retry. Suppressed if `--force=true` (auto-rollback in force mode).

Prompt text:
```
Step "<step_name>" failed after retry.
   Phase:    <N>
   Exit:     <code>
   Snapshot: <path>

Error (last 5 stderr lines):
<excerpt>

   1) Rollback + cancel       (default if empty after re-ask)
   2) Continue without rollback   (DANGEROUS — subsequent steps may regress)
   3) Retry once more
```

Accept: 1/A/Y/Rollback → rollback + STATUS=ROLLED_BACK; 2/Continue → log warning, skip step, continue; 3/Retry → third attempt.
Default if empty: re-ask once; second empty → 1 (safe default = rollback).

# SpecKit Doctor - Unified Update

```yaml
role: Expert Operator running the spec-kit database update orchestrator
purpose: Align every spec-kit database with the current codebase through dependency-safe rebuilds
action: lock -> probe -> migrate -> snapshot -> dashboard -> execute DAG -> validate -> rollback/finalize
```

## 1. PURPOSE

`/doctor:update` is the one-shot maintenance path for bringing the spec-kit runtime databases back into alignment with the repository. It coordinates the individual doctor surfaces, but adds cross-database safety that a single subsystem command cannot provide: one lock, one snapshot set, one dependency DAG, one rollback policy, and one state log.

Use it after upgrading spec-kit, after large packet moves, after a stale startup graph warning, or when multiple doctor commands would otherwise need to be run by hand. The command is intentionally conservative because a partial rebuild can leave memory, graph, advisor, and eval state disagreeing with each other.

## SUBSYSTEM CONTRACT

| Subsystem     | Database                                                           | Status/Health                        | Mutating Tool                          | Gold Battery                           |
| ------------- | ------------------------------------------------------------------ | ------------------------------------ | -------------------------------------- | -------------------------------------- |
| code-graph    | `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` | `code_graph_status`                  | `code_graph_scan` / `code_graph_apply` | code-graph query battery               |
| context-index | `mcp_server/database/context-index__*.sqlite` active profile DB    | `memory_health`, `memory_stats`      | `memory_index_scan`                    | `memory_search` representative queries |
| vector-index  | `mcp_server/database/context-index__*.sqlite` active profile DB    | `memory_health`, `memory_stats`      | `memory_index_scan`                    | embedding-backed `memory_search`       |
| causal-edges  | active profile DB `causal_edges` table                             | `memory_causal_stats`                | `memory_causal_link`                   | coverage and orphan checks             |
| skill-graph   | `mk_skill_advisor` skill graph DB                               | `mk_skill_advisor.skill_graph_status` | `mk_skill_advisor.skill_graph_scan` | skill count/freshness + query          |
| advisor       | skill graph + advisor tables                                       | `advisor_status`, `advisor_validate` | `advisor_rebuild`                      | validation suite                       |
| deep-loop     | `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` | `node .opencode/skills/deep-loop-runtime/scripts/status.cjs --spec-folder "<spec-folder>" --loop-type "<research\|review>" --session-id "<session-id>"` | `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder "<spec-folder>" --loop-type "<research\|review>" --session-id "<session-id>" --nodes '<nodes-json>' --edges '<edges-json>'` | `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "<spec-folder>" --loop-type "<research\|review>" --session-id "<session-id>"` |
| eval          | `mcp_server/database/speckit-eval.db`                              | `session_health`, eval probes        | `eval_run_ablation`                    | ablation run completes                 |

## DEPENDENCY DAG

```
code-graph
   |
   v
context-index + vector-index
   |
   v
causal-edges init
   |
   v
skill-graph
   |
   v
advisor
   |
   v
deep-loop-graph
   |
   v
speckit-eval (optional measurement)
```

## TIER-AWARE PROMPT TIERS

Each tier maps to a specific question ID from the MID-RUN PROMPT CATALOG above.

| Tier      | Steps                                       | Prompt ID                                  | Suppressed by `--force`? | Rationale                                          |
| --------- | ------------------------------------------- | ------------------------------------------ | ------------------------ | -------------------------------------------------- |
| Short     | `mk_skill_advisor.skill_graph_scan`, deep-loop lazy init | none (auto-acknowledged via log line only) | n/a                      | Fast idempotent initialization                     |
| Medium    | `code_graph_scan`, `eval_run_ablation`      | **Q-MED**                                  | YES                      | Meaningful runtime and index churn                 |
| Long-pole | `memory_index_scan` over context/vector DBs | **Q-LONG**                                 | YES                      | 5-15 min runtime and largest rollback blast radius |

Additional non-tier prompts (always fire when their trigger condition is met):
- **Q-PROBE** — Phase 2 active-MCP-client detection (NOT suppressed by `--force`)
- **Q-LEGACY** — Phase 9 per-file cleanup (fires only when `--cleanup-legacy=true`)
- **Q-FAIL** — Phase 5 step-failure recovery (suppressed by `--force`; defaults to rollback)

`--force=true` collapses Q0, Q-MED, Q-LONG, and Q-FAIL to auto-`A` (proceed/rollback). Q-PROBE still fires once to warn on active clients. Q-LEGACY fires only if the operator opted into `--cleanup-legacy`.

## MUTATION BOUNDARIES

| Allowed Targets                                                                                                                                                                                                       | Notes                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` and `.opencode/.spec-kit/code-graph/database/code-graph.sqlite.pre-doctor-update.*.bak`                                                                     | structural graph DB + snapshots        |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite` and `.opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite.pre-doctor-update.*.bak`                               | memory records, FTS, causal edges, vectors |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` and `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite.pre-doctor-update.*.bak`                                         | skill graph DB                         |
| `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` and `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite.pre-doctor-update.*.bak`                                                               | deep research/review graph DB          |
| `.opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db` and `.opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db.pre-doctor-update.*.bak`                                               | eval DB                                |
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.flock`                                                                                                                                            | primary concurrent-dispatch lock       |
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.lock`                                                                                                                                             | PID-file fallback with stale detection |
| `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json`                                                                                                                                    | state log                              |

Forbidden targets include all spec folder docs, authored skill source, all agents, command docs/assets except the maintained bootstrap launcher/script in this packet, and `mcp_server/database/migration-manifest.json`. The migration manifest is read-only in Track C.

## WORKFLOW PHASES

| Phase | Council Line                                                                           | YAML Activity                                                   |
| ----- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 0     | Non-MCP runtime bootstrap; stop for fresh process when tool registration changed       | `phase_0_runtime_bootstrap`                                      |
| 1     | Acquire flock; refuse if held or PID stale-locked >2h                                  | `phase_1_flock_acquire`                                         |
| 1.5   | Verify mcp_server/dist/context-server.js exists; build via npm if missing; release flock on abort | `phase_1_5_mcp_server_bootability`        |
| 2     | Probe other MCP-client activity; warn and prompt unless `--force`                      | `phase_2_probe_mcp_activity`                                    |
| 3     | Snapshot every SQLite DB with `VACUUM INTO`; refuse if disk free <2x DB total          | `phase_3_snapshot_all_databases`                                |
| 4     | Execute in dependency order with tier prompts                                          | `phase_4_status_dashboard` + `phase_5_dependency_order_execute` |
| 5     | On step failure: one retry with 5-sec backoff, then rollback or prompt                 | `phase_5_dependency_order_execute.failure_policy`               |
| 5.5   | Optional post-dependency checkpoint for DBs created during Phase 5 (fresh-install rollback target) | `phase_5_5_post_dependency_checkpoint`        |
| 6     | On SIGINT: set cancel flag, settle current tx, restore in-flight DB, exit 130          | `phase_6_sigint_cancel_contract`                                |
| 7     | Post-run validation with gold battery per DB; rollback on regression                   | `phase_7_post_run_validation`                                   |
| 9     | Legacy cleanup only with `--cleanup-legacy`, prompt-delete each                        | `phase_9_legacy_cleanup`                                        |
| 10    | Write `.doctor-update.last-run.json`; release flock; cleanup old snapshots unless kept | `phase_10_state_log_unlock_cleanup`                             |

## STATE LOG SCHEMA

`mcp_server/database/.doctor-update.last-run.json` is written on success, failure, rollback, and cancellation.

```json
{
  "command": "/doctor:update",
  "mode": "default|auto|confirm|run|confirm",
  "start": "2026-05-09T13:00:00Z",
  "end": "2026-05-09T13:08:10Z",
  "duration_seconds": 490,
  "steps": [
    {
      "name": "context-index",
      "phase": 5,
      "start": "2026-05-09T13:02:00Z",
      "end": "2026-05-09T13:07:00Z",
      "duration_seconds": 300,
      "exit": 0,
      "snapshot_path": "mcp_server/database/context-index__hf-local__onnx-community-embeddinggemma-300m-onnx__768__q8.sqlite.pre-doctor-update.3.4.1.0.20260509T130100Z.bak"
    }
  ],
  "final_status": "ok|failed|rolled_back|cancelled|unrollbackable|restart_required"
}
```

## OUTPUT CONTRACT

```markdown
## Cross-Subsystem Health Dashboard

| Subsystem     | Status | Age          | Recommended Action |
| ------------- | ------ | ------------ | ------------------ |
| code-graph    | OK     | STALE        | MISSING            | REGRESSED | <age>        | scan       | skip     | rollback |
| context-index | OK     | STALE        | MISSING            | REGRESSED | <age>        | index-scan | skip     | rollback |
| causal-edges  | OK     | LOW-COVERAGE | REGRESSED          | <age>     | init-links   | skip       | rollback |
| skill-graph   | OK     | STALE        | MISSING            | <age>     | scan         | skip       |
| advisor       | OK     | INVALID      | STALE              | <age>     | rebuild      | validate   |
| deep-loop     | OK     | EMPTY        | STALE              | <age>     | upsert       | skip       |
| eval          | OK     | STALE        | SKIPPED            | <age>     | run-ablation | skip       |

Final status: STATUS=<OK|FAIL|ROLLED_BACK|CANCELLED|RESTART_REQUIRED>
State log: mcp_server/database/.doctor-update.last-run.json
Snapshots: <kept|cleaned|skipped>
```

### Status Outputs

- `STATUS=OK` — all phases completed; gold-battery passed; state log written
- `STATUS=ROLLED_BACK` — Q-FAIL chose rollback OR auto-rollback fired on gold-battery regression
- `STATUS=CANCELLED` — Q0 cancelled, Q-PROBE rejected, or Q-LONG/Q-MED cancelled mid-run
- `STATUS=RESTART_REQUIRED` — Phase 1.5 built mcp_server/dist; needs fresh OpenCode process + --resume-bootstrap
- `STATUS=FAIL ERROR="..."` — see state log `.doctor-update.last-run.json` for details

When `STATUS=RESTART_REQUIRED`, no database rebuild has started yet. Start a fresh OpenCode process so the MCP launcher can register the now-built `mk-spec-memory` surface, then rerun `/doctor:update --resume-bootstrap`.

## RELATED COMMANDS

- `/doctor memory` - isolated context-index/vector-index health and rebuild.
- `/doctor causal-graph` - isolated causal edge coverage and add-only repair.
- `/doctor deep-loop` - isolated research/review coverage graph rebuild.
- `/doctor code-graph` - isolated structural graph diagnosis and confirm workflow.
- `/doctor skill-advisor` - advisor and skill-graph optimization pass.
- `/doctor skill-budget` - advisor budget/status helper.

## 6. INSTRUCTIONS

1. Resolve mode and flags in the Unified Setup Phase. Do not load YAML before setup is complete.
2. Load the selected `assets/doctor_update.yaml` file and execute it as the source of truth.
3. Enforce Phase 1 flock before any status probe that could lead to mutation. If held, refuse with holding PID and start timestamp.
4. In Phase 2, probe active MCP clients. If active clients exist and `--force` is absent, ask for explicit proceed/cancel.
6. In Phase 3, snapshot every allowed SQLite database with `VACUUM INTO` unless `--no-snapshot` is explicitly true. Disk free must be at least 2x DB total.
7. In Phase 4, render the cross-subsystem dashboard before deciding which dependency steps to run. skips this decision and runs the full chain.
8. In Phase 5, execute in dependency order: code-graph -> context-index -> causal-edges-init -> skill-graph -> advisor -> deep-loop-graph -> speckit-eval.
9. On failure, retry the failed step once after 5 seconds. If it fails again, restores failed DB plus downstream snapshots and exits 1; confirm workflow prompt retry/rollback/leave.
10. On SIGINT, set the cancel flag, wait about 5 seconds for the current SQLite transaction to settle per ADR-001, restore the in-flight DB snapshot, write the state log, and exit 130.
11. Run post-run gold-battery validation for every DB touched. Regression rolls back automatically in interactive workflows and prompts in confirm workflow.
12. Always write `.doctor-update.last-run.json`, release the flock, and remove snapshots older than 30 days unless `--keep-snapshots` is true.

Read the YAML file end-to-end before Phase 1. Do not paraphrase the YAML; it defines exact phase names, target boundaries, and halt behavior.
