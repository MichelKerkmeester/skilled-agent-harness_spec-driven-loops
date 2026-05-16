---
description: Router for /doctor <target>; dispatches per-subsystem diagnostic to the right YAML via the _routes.yaml manifest.
argument-hint: "<target> [flags] | list | ?"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write, mcp__cocoindex_code__search, mcp__mk_code_index__code_graph_status, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__code_graph_scan, mcp__mk_code_index__code_graph_apply, mcp__mk_code_index__detect_changes, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_link, mcp__mk_spec_memory__deep_loop_graph_status, mcp__mk_spec_memory__deep_loop_graph_query, mcp__mk_spec_memory__deep_loop_graph_upsert, mcp__mk_spec_memory__deep_loop_graph_convergence, mcp__mk_code_index__ccc_status, mcp__mk_code_index__ccc_reindex, mcp__mk_code_index__ccc_feedback, mcp__mk_skill_advisor__advisor_recommend, mcp__mk_skill_advisor__advisor_status, mcp__mk_skill_advisor__advisor_validate, mcp__mk_skill_advisor__advisor_rebuild, mcp__mk_skill_advisor__skill_graph_scan, mcp__mk_skill_advisor__skill_graph_query, mcp__mk_skill_advisor__skill_graph_status
---
<!-- skill_agent: system-spec-kit -->

> **Code Graph ownership:** `/doctor code-graph` still uses stable `code_graph_*`, `ccc_*`, and `detect_changes` MCP tools. The implementation and package docs now live under `.opencode/skills/system-code-graph/`; router ownership stays here.

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command is a ROUTER. It resolves a positional target from `$ARGUMENTS`, parses the target-specific flag schema, and hands off to the matching YAML workflow asset.
>
> **Ownership:** Markdown owns target resolution + per-target setup. YAML owns execution. Setup values resolved here are passed to the target-specific YAML.
>
> **YOUR FIRST ACTION:**
> 1. Parse the FIRST positional argument from `$ARGUMENTS` as `target`. If missing or empty → run Tier 1 interactive menu and wait. If `list` / `?` / `--list` → print SUBSYSTEM MANIFEST and exit. If unknown → reject with the valid list.
> 2. Look `target` up in `.opencode/commands/doctor/_routes.yaml`. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `mcp_tools`.
> 3. Run the per-target flag parser (Tier 2) using ONLY that target's `allowed_flags`. Any unknown or cross-target flag MUST raise a clear error pointing to the correct command (e.g. "`--confidence-threshold` is not a flag for `memory`; did you mean `/doctor causal-graph --confidence-threshold=0.8`?").
> 4. Bind all `setup_vars` to resolved values (defaults if no flag given). `execution_mode` is always `INTERACTIVE`.
> 5. Load `assets/<yaml>` and execute its phased workflow.
>
> All reference content below is context for the per-target YAML. Do NOT treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **ONLY MODE (INTERACTIVE)**: every routed target is interactive by design; no mode suffixes are supported.
- **TARGET-FIRST PARSING**: parse the positional target BEFORE any `--flag`. Global flag pre-parse is forbidden (cross-target schemas collide).
- **DO NOT** dispatch any agent from this document.
- **ALL** workflow execution happens through the target YAML — this document is target resolution + setup only.
- **MARKDOWN OWNS SETUP**: resolve `execution_mode` + per-target `setup_vars` here first, then hand off to YAML.
- **YAML START CONDITION**: do not load the target YAML until `target` is bound AND every `setup_var` for that target is resolved.
- **NO YAML MODIFICATIONS**: the 7 YAML assets under `assets/doctor_*.yaml` are stable and untouched by this router.
- **MANIFEST IS CANONICAL**: per-target metadata (yaml asset, setup vars, allowed flags, mutation class, mcp tools, trigger phrases) lives in `_routes.yaml`. The SUBSYSTEM MANIFEST table below is a human-readable mirror, not the source of truth.

> **Format:** `/doctor <target> [flags]` | `/doctor list` | `/doctor ?`
> Examples: `/doctor memory --dry-run`, `/doctor causal-graph --confidence-threshold=0.8`

## GATE 3 STATUS

This router never modifies authored spec packet docs. Each routed target has its own mutation boundary (see table below). All target mutations are validated by per-YAML Phase 3 canonical-path validators and rolled back via per-target snapshots.

| Target          | Location                                                                                  | Mutation class | Reason                                                            | Alternative                                                  |
| --------------- | ----------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `memory`        | `mcp_server/database/context-index__*.sqlite` active profile DB                           | **mutates**    | Runtime database files, not spec folder packets                   | Phase 3 canonical-path validator + `VACUUM INTO` snapshot    |
| `causal-graph`  | `mcp_server/database/context-index__*.sqlite` causal_edges table                          | **add-only**   | Edges are evidence; existing rows never deleted or updated        | Phase 3 validator + snapshot; halts if upsert detected       |
| `code-graph`    | `.opencode/code-graph.config.json` + `.opencode/skills/system-code-graph/database/code-graph.sqlite` | **mutates**    | Runtime config + index; not packet docs                           | Phase 3 validator + gold-battery + auto-rollback             |
| `deep-loop`     | `mcp_server/database/deep-loop-graph.sqlite`                                              | **mutates**    | Coverage graph DB; not packet docs                                | Phase 3 validator + `VACUUM INTO` snapshot                   |
| `cocoindex`     | `.opencode/skills/mcp-coco-index/mcp_server/database/`                                    | **mutates**    | CocoIndex runtime stores; not packet docs                         | Phase 2/3 validator + pre-reindex snapshots                  |
| `skill-advisor` | `lib/scorer/lanes/*.ts` + `.opencode/skills/*/graph-metadata.json`                        | **mutates**    | Runtime scorer config + graph metadata; not packet docs           | Phase 3 validator + per-run rollback script                  |
| `skill-budget`  | n/a (read-only audit)                                                                     | **read-only**  | No mutations; report-only                                         | Diagnostic output only                                       |

---

## SUBSYSTEM MANIFEST (narrative mirror of `_routes.yaml`)

| Target          | YAML asset                      | Setup vars                                                              | Mutation class | One-line purpose                                                          |
| --------------- | ------------------------------- | ----------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------- |
| `memory`        | `doctor_memory.yaml`            | execution_mode, intent, incremental, no_snapshot, dry_run               | mutates        | Diagnose the memory continuity index; rebuild on demand                   |
| `causal-graph`  | `doctor_causal-graph.yaml`      | execution_mode, intent, confidence_threshold, no_snapshot, dry_run      | add-only       | Diagnose causal-edge integrity; add new high-confidence edges only        |
| `code-graph`    | `doctor_code-graph.yaml`        | execution_mode, scope                                                   | mutates        | Diagnose / rescan code-graph index; prune stale excludes                  |
| `deep-loop`     | `doctor_deep-loop.yaml`         | execution_mode, intent, scope, no_snapshot, dry_run                     | mutates        | Diagnose deep-loop coverage graphs (research / review)                    |
| `cocoindex`     | `doctor_cocoindex.yaml`         | execution_mode, intent, no_snapshot, dry_run                            | mutates        | Diagnose CocoIndex semantic-search daemon health; reindex on demand       |
| `skill-advisor` | `doctor_skill-advisor.yaml`     | execution_mode, scope, skip_tests, dry_run                              | mutates        | Audit & re-tune skill advisor scoring lanes                               |
| `skill-budget`  | `doctor_skill-budget.yaml`      | execution_mode, json_output, top_n, fail_over, project_ceiling          | read-only      | Audit skill/command/agent description budgets                             |

**Canonical data:** `.opencode/commands/doctor/_routes.yaml`. Use that file to add or remove targets.

**Companion commands** (NOT routed through `/doctor`):
- `/doctor:update` — multi-subsystem orchestrator (lock + DAG + snapshot + rollback). Use for "rebuild everything in dependency-safe order."
- `/doctor:mcp install|debug` — MCP server install / repair. Use when MCP infrastructure (not subsystem databases) is broken.

---

## 0. UNIFIED SETUP PHASE (TWO TIERS)

**FIRST MESSAGE PROTOCOL:** this prompt MUST be your FIRST response when `$ARGUMENTS` lacks a recognized positional target. Lightweight read-only discovery is allowed (read `_routes.yaml`); then ask Tier 1 and wait. The happy path (`/doctor <target> [flags]`) skips Tier 1 entirely and proceeds straight to Tier 2.

```
EXECUTE THIS TWO-TIER PROMPT:

──────────────────────────────────────────────────────────────────
TIER 1 — TARGET RESOLUTION
──────────────────────────────────────────────────────────────────

1. PARSE $ARGUMENTS:
   - Extract the FIRST positional token (everything before the first --flag).
   - If empty / whitespace → unresolved; go to step 2.
   - If "list" / "?" / "--list" → PRINT the SUBSYSTEM MANIFEST table above and EXIT with STATUS=OK.
   - If "--target=<name>" (compatibility alias) → treat <name> as the positional token.
   - Otherwise → bind `target` to the token.

2. IF target IS UNRESOLVED:
   - ASK Tier 1 question (print VERBATIM — do not paraphrase or split into multiple messages):

```
What do you want to do?

   1) Update everything to match latest spec-kit release   (e.g. 3.3.0.0 → 3.4.x)
   2) Debug Memory database              (search index, spec-doc indexing)
   3) Debug Causal-Graph                 (spec lineage, drift_why)
   4) Debug Code-Graph                   (structural index, stale/missed/bloat)
   5) Debug Deep-Loop history            (research/review iteration graphs)
   6) Debug CocoIndex                    (semantic search daemon)
   7) Re-tune Skill Advisor              (which skill gets recommended)
   8) Audit Skill Description budget     (char counts, CI-friendly)
   9) Install/repair MCP servers         (mk-spec-memory, cocoindex-code, etc.)
   0) Full sweep — rebuild everything    (no migration, current schema)
   H) Help me decide
   X) Cancel
```

   - WAIT for selection. Map answers as follows:
     - 1 → ABORT this command, EMIT: "Switch to `/doctor:update --migrate` for upgrade migration. Exiting /doctor."
     - 2 → target = "memory"
     - 3 → target = "causal-graph"
     - 4 → target = "code-graph"
     - 5 → target = "deep-loop"
     - 6 → target = "cocoindex"
     - 7 → target = "skill-advisor"
     - 8 → target = "skill-budget"
     - 9 → ABORT, EMIT: "Switch to `/doctor:mcp debug --fix` (or `/doctor:mcp install`). Exiting /doctor."
     - 0 → ABORT, EMIT: "Switch to `/doctor:update` for full sweep. Exiting /doctor."
     - H → print the HELP block below, then re-ask Tier 1 question.
     - X / empty / "cancel" → STATUS=CANCEL, exit.
     - Anything else → re-emit the menu once; on second invalid input → STATUS=FAIL ERROR=unknown_selection.

   HELP block (printed when user picks [H]):

```
Pick by symptom:

   Search returns stale or empty results              → 2  Memory
   "context-index__*.sqlite missing" warning          → 2  Memory
   memory_drift_why returns nothing                   → 3  Causal-Graph
   "causal coverage <60%" warning                     → 3  Causal-Graph
   cocoindex search returns 0 hits for known code     → 4  Code-Graph (structural)
   "code-graph stale/missed/bloat" warning            → 4  Code-Graph
   Semantic search slow or wrong                      → 6  CocoIndex (semantic)
   "CocoIndex daemon died" or "ccc_status: unhealthy" → 6  CocoIndex
   deep-research/deep-review iteration graph empty    → 5  Deep-Loop
   Convergence not detected between iterations        → 5  Deep-Loop
   Skill Advisor recommends the wrong skill           → 7  Skill Advisor
   New skill not appearing in advisor results         → 7  Skill Advisor
   Description char-count over hard cap (1536)        → 8  Skill Budget

Quick reference for confusable pairs:
   Code-Graph (4) is STRUCTURAL — functions, files, dirs, AST
   CocoIndex (6) is SEMANTIC — vector embeddings, intent search
   Skill Advisor (7) tunes ROUTING quality (which skill gets picked)
   Skill Budget (8) audits CHAR COUNTS (frontmatter description size)

Press 1-9, 0, or X.
```

   - After printing HELP, RE-EMIT the Tier 1 question above and WAIT again.

3. VALIDATE target against the canonical list in _routes.yaml:
   - If target is NOT one of: memory | causal-graph | code-graph | deep-loop | cocoindex | skill-advisor | skill-budget
   - THEN EMIT:
     "Unknown target '<target>'. Valid targets: memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget. Try `/doctor list` for descriptions."
   - EXIT with STATUS=FAIL ERROR=unknown_target.

4. LOOK UP the resolved target in `.opencode/commands/doctor/_routes.yaml`:
   - BIND: yaml_asset, setup_vars, allowed_flags, mutating, mcp_tools, gate3_location.

──────────────────────────────────────────────────────────────────
TIER 2 — PER-TARGET FLAG PARSING (case block)
──────────────────────────────────────────────────────────────────

5. SET execution_mode = "INTERACTIVE" (always).

6. PARSE the REMAINING $ARGUMENTS (everything AFTER the positional target)
   USING ONLY the target's `allowed_flags` schema. Per-target logic:

   case "$target" in
     memory)
       # allowed: --incremental=true|false, --no-snapshot, --dry-run
       --incremental=true|false → incremental = <value>  (default: prompt)
       --no-snapshot            → no_snapshot = true      (default: false)
       --dry-run                → dry_run = true          (default: false)
       intent = "DIAGNOSE"  (default; YAML may override after Phase 0)
       SET yaml_asset = "doctor_memory.yaml"
       ;;
     causal-graph)
       # allowed: --confidence-threshold=N, --no-snapshot, --dry-run
       --confidence-threshold=N → confidence_threshold = N (default: 0.7)
       --no-snapshot            → no_snapshot = true       (default: false)
       --dry-run                → dry_run = true           (default: false)
       intent = "DIAGNOSE"
       SET yaml_asset = "doctor_causal-graph.yaml"
       ;;
     code-graph)
       # allowed: --scope=stale|missed|bloat|all|excludes, --operation=..., --dry-run, --confirm
       --scope=<value>          → scope = <value>          (default: prompt)
       --operation=<value>      → operation = <value>      (default: rescan)
       --dry-run                → dry_run = true           (default: false)
       --confirm                → confirm = true           (default: false; required for mutating ops)
       SET yaml_asset = "doctor_code-graph.yaml"
       ;;
     deep-loop)
       # allowed: --scope=research|review|both, --no-snapshot, --dry-run
       --scope=<value>          → scope = <value>          (default: both)
       --no-snapshot            → no_snapshot = true       (default: false)
       --dry-run                → dry_run = true           (default: false)
       intent = "DIAGNOSE"
       SET yaml_asset = "doctor_deep-loop.yaml"
       ;;
     cocoindex)
       # allowed: --no-snapshot, --dry-run
       --no-snapshot            → no_snapshot = true       (default: false)
       --dry-run                → dry_run = true           (default: false)
       intent = "DIAGNOSE"
       SET yaml_asset = "doctor_cocoindex.yaml"
       ;;
     skill-advisor)
       # allowed: --skip-tests, --dry-run, --scope=all|explicit|derived|lexical
       --skip-tests             → skip_tests = true        (default: false)
       --dry-run                → dry_run = true           (default: false)
       --scope=<value>          → scope = <value>          (default: all)
       SET yaml_asset = "doctor_skill-advisor.yaml"
       ;;
     skill-budget)
       # allowed: --json, --top-n=N, --fail-over=N, --project-ceiling=N
       --json                   → json_output = true       (default: false)
       --top-n=N                → top_n = N                (default: 10)
       --fail-over=N            → fail_over = N            (default: unset)
       --project-ceiling=N      → project_ceiling = N      (default: 5600)
       SET yaml_asset = "doctor_skill-budget.yaml"
       ;;
   esac

7. CROSS-SCHEMA FLAG INJECTION CHECK:
   - For each flag in $ARGUMENTS NOT recognized by the target's `allowed_flags`:
     - EMIT "Flag '<flag>' is not valid for target '<target>'. Did you mean `/doctor <other-target> <flag>`?"
       (Suggest the correct target by scanning `_routes.yaml` for any route whose allowed_flags contains <flag>.)
     - EXIT with STATUS=FAIL ERROR=cross_target_flag_injection.

8. ASK any unresolved required setup_var question. Print VERBATIM:

   **For `memory`** (if `--incremental` was not passed):
   ```
   Rebuild mode?
      1) Incremental — only changed files (fast, ~30s, default)
      2) Full        — every file (5-15 min; needed after upgrade)
   ```
   Accept: 1/I/Enter → incremental=true; 2/F/full → incremental=false.

   **For `code-graph`** (if `--scope` was not passed AND `--operation` is mutating):
   ```
   Code-graph scope?
      1) stale     — files indexed but mtime moved
      2) missed    — files in repo but not indexed
      3) bloat     — large dirs hogging the graph
      4) all       — full scan (default)
      5) excludes  — review the exclude config
   ```
   Accept: 1-5 → scope=<value>; empty → scope=all.

   **For other targets** (causal-graph, deep-loop, cocoindex, skill-advisor, skill-budget):
   No prompt needed — defaults apply (causal-graph confidence_threshold=0.7, deep-loop scope=both, others have no required vars).

9. STORE: execution_mode, target, yaml_asset, AND every setup_var for that target.

10. SET STATUS=PASSED, HAND OFF to assets/<yaml_asset>.
```

**Phase Output:** `execution_mode` | `target` | `yaml_asset` | (target's resolved setup_vars)

---

## 1. PURPOSE

`/doctor` is the single entry point for per-subsystem diagnostics in the spec-kit ecosystem. It replaces 7 previously-separate `/doctor:*` commands (`/doctor:memory`, `/doctor:causal-graph`, `/doctor:code-graph`, `/doctor:deep-loop`, `/doctor:cocoindex`, `/doctor:skill-advisor`, `/doctor:skill-budget`) with one router that dispatches via `_routes.yaml`. The router preserves every previous behavior — same setup variables, same YAML workflows, same mutation boundaries — while collapsing the markdown surface area by ~75%.

Use `/doctor` when you need to diagnose or rebuild ONE subsystem. Use `/doctor:update` when you want a dependency-safe rebuild across all subsystems with one lock, snapshot set, and rollback policy. Use `/doctor:mcp` when the MCP servers themselves (not the databases they populate) are broken.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — `<target>` (positional) plus target-specific flags.

**Outputs:**
- `STATUS=OK` — target dispatched, YAML loaded, workflow ran
- `STATUS=CANCEL` — user picked X/cancel or chose to switch to /doctor:update or /doctor:mcp
- `STATUS=FAIL ERROR="unknown_target"` — positional target not in _routes.yaml
- `STATUS=FAIL ERROR="cross_target_flag_injection"` — flag from wrong target's schema
- `STATUS=FAIL ERROR="unknown_selection"` — Tier 1 menu got invalid response after 2 attempts

**Routing source of truth:** `.opencode/commands/doctor/_routes.yaml`
**CI assertion:** `.opencode/commands/doctor/scripts/route-validate.sh`

---

## 3. EXAMPLES

```
# Per-target diagnostics
/doctor                                              # Interactive menu — pick subsystem
/doctor list                                          # Print SUBSYSTEM MANIFEST and exit
/doctor memory                                        # Diagnose continuity index (incremental prompt)
/doctor memory --incremental=true --dry-run           # Skip prompts; dry-run rebuild
/doctor causal-graph                                  # Diagnose causal edges; recommend candidates
/doctor causal-graph --confidence-threshold=0.8       # Stricter candidate floor
/doctor code-graph --scope=stale --operation=rescan   # Rescan stale code-graph nodes
/doctor deep-loop --scope=both --dry-run              # Diagnose research + review coverage graphs
/doctor cocoindex --dry-run                           # Daemon health + propose reindex
/doctor skill-advisor --skip-tests --dry-run          # Tune advisor scoring without gold tests
/doctor skill-budget --json --fail-over=5600          # CI-friendly description budget audit

# Compatibility alias (rarely used; argv-positional is the primary form)
/doctor --target=memory --dry-run                     # Equivalent to /doctor memory --dry-run
```

---

## 4. TROUBLESHOOTING / NEXT STEPS

| Situation                                                  | Suggested action                                                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| You want to fix EVERYTHING in dependency-safe order        | Use `/doctor:update` — multi-subsystem orchestrator with cross-database snapshot + lock + rollback       |
| MCP servers themselves are broken (not the databases)      | Use `/doctor:mcp debug --fix` — repair MCP infra                                                         |
| Fresh-install MCP servers (post-upgrade or first-time)     | Use `/doctor:mcp install` — guided install per-server                                                    |
| Old `/doctor:memory` muscle memory                         | Same workflow as `/doctor memory` — use the new form going forward; old commands removed in Phase 2     |
| Cross-target flag rejected ("not valid for `memory`")      | The error suggests the right target; type that command instead                                          |
| `_routes.yaml` parse error                                 | Run `bash .opencode/commands/doctor/scripts/route-validate.sh` for detailed diagnostics                  |

---

## 5. INTERNAL: WHY THE TWO-TIER SETUP

Each routed target's YAML expects specific `setup_vars` to be bound before Phase 0. The pre-014 commands used 8 separate .md files (one per subsystem + update) to parse target-specific flags. The router collapses that into one .md by:

1. **Tier 1** resolves WHICH target (positional argv or interactive menu).
2. **Tier 2** runs the target-specific flag parser (the `case "$target" in` block above) using only that target's `allowed_flags`.

Per ADR-005 in `013/003-router-phase/decision-record.md`: parsing flags BEFORE target resolution is FORBIDDEN — cross-target flag schemas collide (e.g. `--scope` means different things in `code-graph` vs `deep-loop`). Target-first is the only safe order.

Per ADR-006: the `allowed-tools` frontmatter on this command is the UNION of all 7 targets' MCP tools (plus the tools `/doctor:mcp` needs). This is unavoidable per OpenCode runner (no lazy authorization). `_routes.yaml` documents the per-target subset for CI assertions via `route-validate.sh`.
