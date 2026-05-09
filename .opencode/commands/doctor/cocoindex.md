---
description: Diagnose CocoIndex semantic-search health with an interactive read-only status workflow.
argument-hint: "[--no-snapshot] [--dry-run]"
allowed-tools: Read, Bash, Grep, Glob, mcp__spec_kit_memory__ccc_status, mcp__spec_kit_memory__ccc_reindex, mcp__spec_kit_memory__ccc_feedback
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup (resolves all inputs). YAML owns execution. Setup values resolved here are passed to the YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve: `execution_mode`, `intent`, `no_snapshot`, `dry_run`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - -> `doctor_cocoindex.yaml` (interactive status + drift)
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **ONLY MODE ()**: this doctor command is always interactive by design; deleted mode suffixes are invalid.
- **DO NOT** dispatch any agent from this document
- **ALL** workflow execution happens through the YAML - this document is setup + reference only
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound: `execution_mode`, `intent`, `no_snapshot`, `dry_run`
- **CONFIRM WORKFLOW IS READ-ONLY**: zero index mutations; report goes to packet-local scratch only
- **confirm workflow ()**: daemon health probe first, snapshot CocoIndex DBs, perform idempotent daemon restart, run `ccc_reindex({full: true})`, post-verify gold battery, rollback on regression
- **DAEMON SAFETY**: refuses to start if `ccc_status()` or the daemon probe reports an unhealthy daemon state
- **NO MUTATIONS** in `--dry-run` mode - propose only, never snapshot or reindex

> **Format:** `/doctor:cocoindex` [flags]
> Example: `/doctor:cocoindex`

## GATE 3 STATUS: EXEMPT

| Aspect      | Value                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| Location    | `.opencode/skills/mcp-coco-index/mcp_server/database/`                                                  |
| Reason      | Mutations target stable CocoIndex runtime SQLite/vector stores, not spec folder packet docs             |
| Alternative | Mutation boundaries validated by Phase 2/3 canonical-path validator; rollback via pre-reindex snapshots |

---

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Only the suffix is supported; doctor commands are interactive by design.

---

## 1. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response when no mode suffix is given. No mutating tool calls before asking. Lightweight read-only discovery is allowed (`ccc_status`), then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```text
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   - default -> execution_mode = "INTERACTIVE", yaml = "doctor_cocoindex.yaml"
   - No suffix -> execution_mode = "INTERACTIVE", yaml = "doctor_cocoindex.yaml" (confirm is the only supported mode)

2. PARSE flags from $ARGUMENTS:
   |- --no-snapshot -> no_snapshot = TRUE (advanced opt-out; only honored in interactive workflow)
   |- --dry-run     -> dry_run = TRUE (propose only, no writes; only honored in interactive workflow)
   `- Defaults: no_snapshot=FALSE, dry_run=FALSE

3. Lightweight discovery (read-only):
   - Run: ccc_status({})
   - Store: available, binaryPath, indexExists, indexSize, recommendation, readiness, trustState
   - If ccc_status reports an error, keep execution read-only and report STATUS=FAIL unless the chosen mode is diagnostic and can recommend install/reindex.

4. ASK with a single prompt only for unresolved flags:

   Q1. Long-pole confirmation (always ask if not already confirmed by suffix policy):
     "Full CocoIndex reindex can take 1-15 min depending on codebase size and embedding model.
      A snapshot of CocoIndex SQLite/vector stores under .opencode/skills/mcp-coco-index/mcp_server/database/
      will be taken first unless --no-snapshot was supplied. Proceed?"
     A) Yes, proceed
     B) No, cancel

   Q2. Snapshot opt-out (always ask if --no-snapshot not flagged):
     A) Take snapshot before reindex (default; recommended)
     B) Skip snapshot (advanced; rollback unavailable on failure)

   Reply format: answer only unresolved flag questions, or confirm defaults.

5. WAIT only when an unresolved flag question was asked

6. Parse and store:
   - execution_mode | intent | no_snapshot | dry_run

7. SET STATUS: PASSED

DO NOT proceed until any required flag prompt is answered.
NEVER mutate CocoIndex DBs without snapshot unless --no-snapshot was explicitly set.
NEVER split questions into multiple prompts.
```

**Phase Output:**
- `execution_mode` | `intent` | `no_snapshot` | `dry_run` | `available` | `binaryPath` | `indexExists` | `indexSize` | `trustState`

---

# SpecKit Doctor - CocoIndex Semantic Search Index

Diagnose and rebuild the CocoIndex semantic search index used for concept/intent code discovery. The command wraps the existing `ccc_status`, `ccc_reindex`, and `ccc_feedback` MCP tools with the standard doctor safety pattern: status first, daemon-health refusal, snapshot, full reindex, gold-battery verification, and rollback.

```yaml
role: Expert Operator running CocoIndex semantic search diagnostics + rebuild
purpose: Detect semantic index drift and restore search readiness through ccc_reindex
action: Discovery -> daemon health probe -> analysis -> (run: snapshot -> idempotent daemon restart -> full reindex -> verify -> rollback)
```

## 2. PURPOSE

Restore the CocoIndex semantic search index to match the current codebase. CocoIndex drifts when code changes since the last reindex, when the embedding model changes, when daemon state becomes stale or zombie-like, or when broken-pipe accumulation makes the daemon spin instead of serving stable search requests.

This command exposes drift through and repairs it in . confirm workflow refuse to start if daemon health is unhealthy, then snapshot runtime DBs before a full reindex. interactive run rolls back on gold-battery regression. Interactive run prompts before rollback.

## SUBSYSTEM CONTRACT

| Aspect              | Value                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Command             | `/doctor:cocoindex`                                                                                 |
| Modes               | (status + drift), , (full reindex),                     |
| Targets             | CocoIndex SQLite + vector store under `.opencode/skills/mcp-coco-index/mcp_server/database/`        |
| Snapshot            | YES                                                                                                 |
| Daemon coordination | Refuses if daemon unhealthy; triggers idempotent restart per 3.4.1.0 daemon resilience fix |
| Status MCP tool     | `ccc_status({})`                                                                                    |
| Reindex MCP tool    | `ccc_reindex({full: true})`                                                                         |
| Feedback MCP tool   | `ccc_feedback({query, resultFile, rating, comment})`                                                |
| Gold-battery        | 3 representative semantic queries return >= 5 results post-rebuild                                  |

## STALENESS SIGNALS

The diagnostic phase detects:

1. **Code drift** - codebase changed since last CocoIndex reindex
2. **Embedding model change** - embedding settings or vector dimensions changed since the current store was built
3. **Daemon zombie state** - stale PID/socket/lock state or duplicate daemon symptoms from the 3.4.1.0 daemon-resilience packet
4. **Broken-pipe accumulation** - repeated disconnect errors or log growth suggesting CPU spinning
5. **Missing index** - `ccc_status` reports no index directory or empty index size
6. **Unavailable binary** - local `ccc` binary is missing or not executable

## WHEN TO RUN CONFIRM

| Symptom                                         | Recommended Mode   |
| ----------------------------------------------- | ------------------ |
| Routine semantic-search health check            |            |
| Reviewing status before a reindex               |         |
| After major code changes                        |           |
| After embedding model swap                      |           |
| First rebuild on a machine with daemon symptoms |   |
| You only want the proposed reindex plan         | `--dry-run` |

## MUTATION BOUNDARIES (Phase 2/3 enforced)

| Allowed Targets                                                   | Forbidden Targets                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.opencode/skills/mcp-coco-index/mcp_server/database/**`          | Any spec folder doc (`.opencode/specs/**/*.md`, `.opencode/specs/**/*.json`)          |
| `.opencode/skills/mcp-coco-index/mcp_server/database/**/*.sqlite` | System-spec-kit databases (`.opencode/skills/system-spec-kit/mcp_server/database/**`) |
| `.opencode/skills/mcp-coco-index/mcp_server/database/**/*.db`     | Any skill, agent, or command file outside exact allowed CocoIndex database targets    |
| `.opencode/skills/mcp-coco-index/mcp_server/database/**/*.bak`    | Any source file indexed by CocoIndex                                                  |

The validator runs canonical-path validation before snapshot, before `ccc_reindex`, and before rollback: resolve targets via `realpath`, reject `..`, reject symlinks escaping the repo root, match exact allowed CocoIndex database paths, and reject all forbidden targets except exact allowed CocoIndex DB/snapshot paths.

## WORKFLOW PHASES (delegated to YAML)

```text
Phase 1 - Daemon Health Probe
  Purpose: verify ccc binary, index presence, daemon health, and readiness
  Tools: ccc_status, Bash daemon status/log probes
  Halt-on: unhealthy daemon in interactive workflow
  Output: { available, indexExists, indexSize, daemon_health, readiness, recommendation }

Phase 2 - Snapshot
  Purpose: snapshot CocoIndex SQLite/vector DBs before any reindex write
  Tools: Bash(find/stat/sqlite3 VACUUM INTO or cp fallback)
  Output: { snapshot_paths, snapshot_bytes }

Phase 3 - run
  Purpose: idempotent daemon restart and full semantic reindex
  Tools: Bash(ccc daemon restart), ccc_reindex({full: true})
  Output: { mode: full, duration_seconds, reindex_status }

Phase 4 - Post-verify
  Purpose: run 3 semantic search gold queries; each must return >= 5 results
  Tools: Bash(ccc search ... --limit 5), ccc_feedback for optional quality notes
  Output: { gold_battery_pass, query_counts, regressions }

Phase 5 - Rollback
  Purpose: restore snapshots on regression in interactive workflow, or prompt in interactive workflow
  Tools: Bash(cp -p)
  Output: { rolled_back, restored_at, rollback_reason }

Phase 6 - Report
  Purpose: emit final status + state log
  Output: { status, state_log_path, recommendation }
```

## 3. INSTRUCTIONS

The orchestrator (`assets/doctor_cocoindex.yaml`) executes the workflow phases above. As the operator running this command:

1. **Resolve mode + flags** via the Unified Setup Phase prompt above. Do not advance until ALL inputs are bound (`execution_mode`, `intent`, `no_snapshot`, `dry_run`).
2. **Load the matching YAML** from `assets/`. The surviving YAML file is `doctor_cocoindex.yaml`.
3. **Execute the YAML phases sequentially**. Diagnostic modes are read-only. confirm workflow run daemon health probe, snapshot, full reindex, post-verify, rollback if needed, then report.
4. **Refuse if daemon health is unhealthy**. Do not try to repair zombie/broken-pipe daemon state from this command; report the recovery checklist and stop.
5. **In modes, never skip the snapshot phase** unless the user passed `--no-snapshot` explicitly. The validator records the waiver and rollback becomes unavailable.
6. **Honor the gold-battery threshold**. After rebuild, each of the 3 representative queries must return at least 5 results.
7. **Always emit the state log** in Phase 6, regardless of success or failure. The log path is `<packet_scratch>/doctor-cocoindex-state.<timestamp>.json`.

Read the YAML file end-to-end before starting Phase 1. Do not paraphrase; the YAML defines exact tool sequences, parameters, halt conditions, and rollback behavior.

## OUTPUT CONTRACT

```markdown
## CocoIndex Semantic Search Health Report

### Status
[OK | STALE | DEGRADED | MISSING | APPLIED | ROLLED_BACK | FAIL]

### Index State
| Metric           | Value   |
| ---------------- | ------- |
| Binary Available | true    | false     |
| Binary Path      | <path>  |
| Index Exists     | true    | false     |
| Index Size       | <bytes> |
| Daemon Health    | healthy | unhealthy | unknown |

### Drift Signals
[N drift signals detected]
- code_drift: true|false
- embedding_model_change: true|false
- daemon_zombie_state: true|false
- broken_pipe_accumulation: true|false

### Action Taken
- Snapshot: <paths|skipped>
- Reindex: full=true, status=<ok|error>, duration=<seconds>
- Gold-battery: PASS|FAIL
- Rollback: not_needed|restored|prompted|unavailable

### State Log
`<packet_scratch>/doctor-cocoindex-state.<timestamp>.json`
```

## RELATED

- `.opencode/commands/doctor/assets/doctor_cocoindex.yaml`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-cocoindex-daemon-resilience/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/spec.md`
