---
description: Rebuild spec-kit runtime databases in dependency-safe order through the interactive confirm workflow.
argument-hint: "[--force] [--no-snapshot] [--cleanup-legacy] [--migrate] [--keep-snapshots]"
allowed-tools: Read, Bash, Grep, Glob, mcp__cocoindex_code__search, mcp__spec_kit_memory__code_graph_status, mcp__spec_kit_memory__code_graph_query, mcp__spec_kit_memory__code_graph_context, mcp__spec_kit_memory__code_graph_scan, mcp__spec_kit_memory__code_graph_apply, mcp__spec_kit_memory__detect_changes, mcp__spec_kit_memory__memory_context, mcp__spec_kit_memory__memory_search, mcp__spec_kit_memory__memory_health, mcp__spec_kit_memory__memory_index_scan, mcp__spec_kit_memory__memory_drift_why, mcp__spec_kit_memory__memory_stats, mcp__spec_kit_memory__memory_causal_stats, mcp__spec_kit_memory__memory_causal_link, mcp__spec_kit_memory__deep_loop_graph_status, mcp__spec_kit_memory__deep_loop_graph_query, mcp__spec_kit_memory__deep_loop_graph_upsert, mcp__spec_kit_memory__deep_loop_graph_convergence, mcp__spec_kit_memory__ccc_status, mcp__spec_kit_memory__ccc_reindex, mcp__spec_kit_memory__ccc_feedback, mcp__spec_kit_memory__advisor_recommend, mcp__spec_kit_memory__advisor_status, mcp__spec_kit_memory__advisor_validate, mcp__spec_kit_memory__advisor_rebuild, mcp__spec_kit_memory__skill_graph_scan, mcp__spec_kit_memory__skill_graph_query, mcp__spec_kit_memory__skill_graph_status, mcp__spec_kit_memory__eval_run_ablation, mcp__spec_kit_memory__session_health
---

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
- **NO NEW MCP TOOLS**: use only existing `code_graph_*`, `memory_*`, `skill_graph_*`, `advisor_*`, `deep_loop_graph_*`, `ccc_*`, `eval_run_ablation`, and `session_health` surfaces.
- **SNAPSHOT DEFAULT**: snapshot every SQLite database before mutation unless `--no-snapshot` was explicitly passed.
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

**FIRST MESSAGE PROTOCOL:** if no suffix is present, ask Q0 before executing any mutating phase. Lightweight read-only status probes are allowed only after flag parsing.

```
1. CHECK mode suffix:
   - default -> execution_mode = "INTERACTIVE", yaml = "doctor_update.yaml"
   - No suffix -> execution_mode = "INTERACTIVE", yaml = "doctor_update.yaml" (confirm is the only supported mode)

2. PARSE flags from $ARGUMENTS:
   - --force           -> force = true; warn on active MCP clients, then proceed without additional override prompt
   - --no-snapshot     -> no_snapshot = true; advanced opt-out, rollback unavailable for unsnapshotted DBs
   - --cleanup-legacy  -> cleanup_legacy = true; detect known legacy files from migration-manifest and prompt-delete each
   - --migrate         -> migrate = true; run migration-manifest Phase 0 before snapshots, refuse on manifest gap
   - --keep-snapshots  -> keep_snapshots = true; skip cleanup of snapshots older than 30 days
   - Defaults: force=false, no_snapshot=false, cleanup_legacy=false, migrate=false, keep_snapshots=false

3. TIER-AWARE PROMPTING (interactive):
   - Short steps run with brief acknowledgement: skill-graph init, deep-loop graph init.
   - Medium steps share one combined prompt: code-graph scan, speckit eval ablation.
   - Long-pole step gets explicit ETA prompt: context-index memory_index_scan (5-15 min).

4. ASK Q0 when the user invoked the command and operator confirmation is needed:
   A) Proceed with tier-aware run (recommended): short ack, medium combined prompt, long-pole ETA prompt
   B) Cancel

5. STORE:
   execution_mode, intent, yaml, force, no_snapshot, cleanup_legacy, migrate, keep_snapshots, skip_status_check
```

**Phase Output:** `execution_mode` | `intent` | `yaml` | `force` | `no_snapshot` | `cleanup_legacy` | `migrate` | `keep_snapshots` | `skip_status_check`

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
| code-graph    | `mcp_server/database/code-graph.sqlite`                            | `code_graph_status`                  | `code_graph_scan` / `code_graph_apply` | code-graph query battery               |
| context-index | `mcp_server/database/context-index.sqlite`                         | `memory_health`, `memory_stats`      | `memory_index_scan`                    | `memory_search` representative queries |
| vector-index  | `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` | `memory_health`, `memory_stats`      | `memory_index_scan`                    | embedding-backed `memory_search`       |
| causal-edges  | `context-index.sqlite` table                                       | `memory_causal_stats`                | `memory_causal_link`                   | coverage and orphan checks             |
| skill-graph   | `mcp_server/database/skill-graph.sqlite`                           | `skill_graph_status`                 | `skill_graph_scan`                     | skill count/freshness + query          |
| advisor       | skill graph + advisor tables                                       | `advisor_status`, `advisor_validate` | `advisor_rebuild`                      | validation suite                       |
| deep-loop     | `mcp_server/database/deep-loop-graph.sqlite`                       | `deep_loop_graph_status`             | `deep_loop_graph_upsert`               | convergence signal                     |
| cocoindex     | CocoIndex semantic store                                           | `ccc_status`                         | `ccc_reindex`                          | semantic search sample                 |
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

| Tier      | Steps                                       | Prompt Policy                       | Rationale                                          |
| --------- | ------------------------------------------- | ----------------------------------- | -------------------------------------------------- |
| Short     | `skill_graph_scan`, deep-loop lazy init     | Auto in confirm workflow                | Fast idempotent initialization                     |
| Medium    | `code_graph_scan`, `eval_run_ablation`      | One combined prompt in confirm workflow | Meaningful runtime and index churn                 |
| Long-pole | `memory_index_scan` over context/vector DBs | Explicit ETA prompt in confirm workflow | 5-15 min runtime and largest rollback blast radius |

and bypass tier prompts. and prompt at every phase boundary. assumes all subsystems need rebuild and skips the Phase 4 status decision gate.

## MUTATION BOUNDARIES

| Allowed Targets                                                                                                                                                   | Notes                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `mcp_server/database/code-graph.sqlite` and `mcp_server/database/code-graph.sqlite.pre-doctor-update.*.bak`                                                       | structural graph DB + snapshots        |
| `mcp_server/database/context-index.sqlite` and `mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak`                                                 | memory records, FTS, causal edges      |
| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` and `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite.pre-doctor-update.*.bak` | vector DB                              |
| `mcp_server/database/skill-graph.sqlite` and `mcp_server/database/skill-graph.sqlite.pre-doctor-update.*.bak`                                                     | skill graph DB                         |
| `mcp_server/database/deep-loop-graph.sqlite` and `mcp_server/database/deep-loop-graph.sqlite.pre-doctor-update.*.bak`                                             | deep research/review graph DB          |
| `mcp_server/database/speckit-eval.db` and `mcp_server/database/speckit-eval.db.pre-doctor-update.*.bak`                                                           | eval DB                                |
| `mcp_server/database/.doctor-update.flock`                                                                                                                        | primary concurrent-dispatch lock       |
| `mcp_server/database/.doctor-update.lock`                                                                                                                         | PID-file fallback with stale detection |
| `mcp_server/database/.doctor-update.last-run.json`                                                                                                                | state log                              |

Forbidden targets include all spec folder docs, all skills, all agents, all commands, and `mcp_server/database/migration-manifest.json`. The migration manifest is read-only in Track C.

## WORKFLOW PHASES

| Phase | Council Line                                                                           | YAML Activity                                                   |
| ----- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1     | Acquire flock; refuse if held or PID stale-locked >2h                                  | `phase_1_flock_acquire`                                         |
| 1.5   | Verify mcp_server/dist/context-server.js exists; build via npm if missing; release flock on abort | `phase_1_5_mcp_server_bootability`        |
| 2     | Probe other MCP-client activity; warn and prompt unless `--force`                      | `phase_2_probe_mcp_activity`                                    |
| 3     | Snapshot every SQLite DB with `VACUUM INTO`; refuse if disk free <2x DB total          | `phase_3_snapshot_all_databases`                                |
| 4     | Execute in dependency order with tier prompts                                          | `phase_4_status_dashboard` + `phase_5_dependency_order_execute` |
| 5     | On step failure: one retry with 5-sec backoff, then rollback or prompt                 | `phase_5_dependency_order_execute.failure_policy`               |
| 5.5   | Optional post-dependency checkpoint for DBs created during Phase 5 (fresh-install rollback target) | `phase_5_5_post_dependency_checkpoint`        |
| 6     | On SIGINT: set cancel flag, settle current tx, restore in-flight DB, exit 130          | `phase_6_sigint_cancel_contract`                                |
| 7     | Post-run validation with gold battery per DB; rollback on regression                   | `phase_7_post_run_validation`                                   |
| 8     | Migration Phase 0: file-signal auto-detect, directory bridge, mcp_server build, cocoindex venv, spec metadata backfill (FIX-08), legacy memory.md report (FIX-09) | `phase_8_migration_phase_0`                                     |
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
      "snapshot_path": "mcp_server/database/context-index.sqlite.pre-doctor-update.3.4.1.0.20260509T130100Z.bak"
    }
  ],
  "final_status": "ok|failed|rolled_back|cancelled|unrollbackable"
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
| cocoindex     | OK     | UNHEALTHY    | STALE              | <age>     | reindex      | fix-daemon |
| eval          | OK     | STALE        | SKIPPED            | <age>     | run-ablation | skip       |

Final status: STATUS=<OK|FAIL|ROLLED_BACK|CANCELLED>
State log: mcp_server/database/.doctor-update.last-run.json
Snapshots: <kept|cleaned|skipped>
```

## RELATED COMMANDS

- `/doctor:memory` - isolated context-index/vector-index health and rebuild.
- `/doctor:causal-graph` - isolated causal edge coverage and add-only repair.
- `/doctor:deep-loop` - isolated research/review coverage graph rebuild.
- `/doctor:cocoindex` - isolated CocoIndex semantic reindex.
- `/doctor:code-graph` - isolated structural graph diagnosis and confirm workflow.
- `/doctor:skill-advisor` - advisor and skill-graph optimization pass.
- `/doctor:skill-budget` - advisor budget/status helper.

## 6. INSTRUCTIONS

1. Resolve mode and flags in the Unified Setup Phase. Do not load YAML before setup is complete.
2. Load the selected `assets/doctor_update.yaml` file and execute it as the source of truth.
3. Enforce Phase 1 flock before any status probe that could lead to mutation. If held, refuse with holding PID and start timestamp.
4. In Phase 2, probe active MCP clients. If active clients exist and `--force` is absent, ask for explicit proceed/cancel.
5. In Phase 8, when `--migrate` is set OR auto-detected via 4 file-system signals (≥2 positive), execute the migration sub-actions in order: directory_layout_bridge → mcp_server_build → cocoindex_venv_check → spec_metadata_backfill (FIX-08, invokes sanctioned scripts) → legacy_memory_md_detection (FIX-09, report-only). Read `migration-manifest.json` for migration definitions; refuse if missing or gapped; Track C does not author it.
6. In Phase 3, snapshot every allowed SQLite database with `VACUUM INTO` unless `--no-snapshot` is explicitly true. Disk free must be at least 2x DB total.
7. In Phase 4, render the cross-subsystem dashboard before deciding which dependency steps to run. skips this decision and runs the full chain.
8. In Phase 5, execute in dependency order: code-graph -> context-index -> causal-edges-init -> skill-graph -> advisor -> deep-loop-graph -> speckit-eval.
9. On failure, retry the failed step once after 5 seconds. If it fails again, restores failed DB plus downstream snapshots and exits 1; confirm workflow prompt retry/rollback/leave.
10. On SIGINT, set the cancel flag, wait about 5 seconds for the current SQLite transaction to settle per ADR-001, restore the in-flight DB snapshot, write the state log, and exit 130.
11. Run post-run gold-battery validation for every DB touched. Regression rolls back automatically in interactive workflows and prompts in confirm workflow.
12. Always write `.doctor-update.last-run.json`, release the flock, and remove snapshots older than 30 days unless `--keep-snapshots` is true.

Read the YAML file end-to-end before Phase 1. Do not paraphrase the YAML; it defines exact phase names, target boundaries, and halt behavior.
