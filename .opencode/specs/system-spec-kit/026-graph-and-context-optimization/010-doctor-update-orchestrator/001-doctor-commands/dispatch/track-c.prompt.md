# Codex dispatch: Track C — /doctor:update unified orchestrator + 5 YAMLs (council 10-line spec)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author the **headline deliverable** of packet 013: `/doctor:update`, a unified orchestrator that rebuilds every spec-kit database in dependency-safe order with snapshot + rollback, implementing the Multi-AI Council's 10-line spec verbatim.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`

## CANONICAL TEMPLATE SOURCES (read first)

1. **`.opencode/commands/doctor/memory.md`** — Reference Markdown shape (just authored in 013, valid).
2. **All Track B siblings** (`memory.md`, `causal-graph.md`, `deep-loop.md`, `cocoindex.md`) — just authored in 013. Read all 4 for the per-subsystem MCP tool inventory the orchestrator chains.
3. **`.opencode/commands/doctor/code-graph.md`** — Canonical write-mutation Markdown.
4. **`.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — Canonical orchestrator-class YAML with snapshot + gold-battery + rollback.

## CONTEXT FROM PACKET (read first; treat as locked)

5. **`spec.md` §3.5** — `/doctor:update` per-command specification.
6. **`spec.md` §4 REQ-004** — orchestrator implements all 10 lines of the council spec.
7. **`decision-record.md`** — ADR-001 confirmed per-batch tx model; ADR-002..ADR-008 are the 7 council answers (one per orchestrator design question); ADR-009 external dispatch deferred.
8. **`plan.md` §3 ARCHITECTURE → Dependency DAG** — execution order: code_graph → context-index → causal-edges init → skill-graph → advisor → deep-loop → optional eval.
9. **`tasks.md` §5 PHASE C** — T-027..T-040 task graph for orchestrator.

## COUNCIL 10-LINE SPEC (verbatim implementation contract; from decision-record.md)

```
1. ACQUIRE flock at mcp_server/database/.doctor-update.flock; refuse if held; refuse if PID-file stale-locked >2h.
2. PROBE other MCP-client activity; if active → warn + prompt (force-ok with --force).
3. SNAPSHOT every *.sqlite via VACUUM INTO; filename `<name>.pre-doctor-update.<version>.<timestamp>.bak`; refuse if disk free < 2x DB total.
4. EXECUTE in dependency order: code-graph → context-index → causal-edges-init → skill-graph → deep-loop-graph → speckit-eval. Tier prompts per Q5: short auto, medium combined, long-pole ETA-prompted (unless :auto).
5. ON STEP FAILURE: one retry with 5-sec backoff; if still fails → in :auto restore snapshot of failed DB + downstream, log to `.doctor-update.last-run.json`, exit 1; in :confirm prompt retry/rollback/leave.
6. ON SIGINT: set cancel flag, let current SQLite tx commit/abort, restore snapshot of in-flight DB, log "cancelled by user", exit 130.
7. POST-RUN VALIDATION: gold-battery sanity check per DB (existence + schema-version + row-count delta within bounds); regression → auto-rollback in :auto, prompt in :confirm.
8. MIGRATION (--migrate or auto-detected version skip): run `migration-manifest.json` Phase 0 before snapshots; refuse to proceed if manifest gap detected.
9. LEGACY (--cleanup-legacy): detect known-legacy files (per migration-manifest), prompt-delete each (never silent); skip if not specified.
10. ON COMPLETE: write `.doctor-update.last-run.json` with timestamps, durations, snapshot paths; release flock; auto-cleanup snapshots >30 days unless --keep-snapshots.
```

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/update.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update_default.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update_apply.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update_apply-confirm.yaml`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any other doctor command, MCP server code, or spec packet docs.
- DO NOT add new MCP tools — only call existing ones (`code_graph_*`, `memory_*`, `skill_graph_*`, `advisor_*`, `deep_loop_graph_*`, `ccc_*`, `eval_run_ablation`, `session_health`).
- DO NOT touch `migration-manifest.json` (out of scope for Track C; Track D will author it).
- DO NOT widen `allowed-tools` beyond the union of B1-B4 + code/skill/advisor/eval tool sets.

## HARD CONSTRAINTS

1. **Markdown passes** `validate_document.py --type command` (warnings about non-sequential numbering OK).
2. **5 YAMLs load** via canonical-path validator with allowed_targets covering ALL 6 SQLite DB paths + their snapshot globs:
   - `mcp_server/database/code-graph.sqlite` + `*.bak`
   - `mcp_server/database/context-index.sqlite` + `*.bak`
   - `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` + `*.bak`
   - `mcp_server/database/skill-graph.sqlite` + `*.bak`
   - `mcp_server/database/deep-loop-graph.sqlite` + `*.bak`
   - `mcp_server/database/speckit-eval.db` + `*.bak`
   - `mcp_server/database/.doctor-update.flock` (lock file) + `.doctor-update.lock` (PID file fallback) + `.doctor-update.last-run.json` (state log)
3. **`forbidden_targets`** includes all spec folder docs, all skills/agents/commands, the migration-manifest.json itself (read-only here).
4. **All 10 council lines covered** with explicit YAML phase/activity per line. Phase numbering in YAML matches the 10-line spec ordering.
5. **Tier-aware default mode** (no suffix → tier-aware confirm). Short steps (skill-graph init, deep-loop init): no prompt. Medium (code-graph, eval): one combined prompt. Long-pole (memory_index_scan): explicit ETA prompt.
6. **5 flags wired**: `--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`. Each flag's behavior documented in Markdown setup phase + YAML.
7. **State log JSON schema** documented in Markdown + emitted by every YAML mode. Schema fields: `command`, `mode`, `start`, `end`, `duration_seconds`, `steps[]` (per-step start/end/exit/snapshot_path), `final_status`.
8. **SIGINT graceful cancel** in YAML: set cancel flag → wait for current SQLite tx (~5 sec settle per ADR-001) → restore snapshot of in-flight DB → exit 130.
9. **Concurrent dispatch refusal**: flock primitive in Phase 1; if held, refuse with helpful message including holding PID + start timestamp.
10. **Cross-subsystem health dashboard** rendered as Phase 4 output: one row per subsystem (code-graph, context-index, causal-edges, skill-graph, advisor, deep-loop, cocoindex, eval) with status + age + recommended action.

## SPECIFIC EDITS

### `update.md` (Markdown entrypoint, ~350 LOC)

Use `memory.md` as the structural template, scaled up for orchestrator complexity. Sections:

- Frontmatter: `description`, `argument-hint`, comprehensive `allowed-tools` (union of all subsystem tools).
- `## CONSTRAINTS` (per canonical pattern).
- `## GATE 3 STATUS: EXEMPT`.
- `## 0. UNIFIED SETUP PHASE`: extends the canonical pattern with all 5 flags + tier-aware mode resolution. Q0 only when no suffix.
- `## 1. PURPOSE`: explains the unified orchestrator's role in the spec-kit ecosystem (one-shot path for users to align all databases with codebase).
- `## SUBSYSTEM CONTRACT`: one row per subsystem the orchestrator chains.
- `## DEPENDENCY DAG`: visual diagram of execution order.
- `## TIER-AWARE PROMPT TIERS`: short / medium / long-pole table.
- `## MUTATION BOUNDARIES`: per Hard Constraint 2.
- `## WORKFLOW PHASES`: 10 phases mapping to the council 10-line spec.
- `## STATE LOG SCHEMA`: JSON shape per Hard Constraint 7.
- `## OUTPUT CONTRACT`: cross-subsystem dashboard format + final status block.
- `## RELATED COMMANDS`: all 4 isolated `/doctor:*` commands + `/doctor:code-graph`, `/doctor:skill-advisor`, `/doctor:skill-budget`.
- `## 6. INSTRUCTIONS`: orchestrator-specific runbook for the operator running this command.

### `doctor_update_default.yaml` (~250 LOC; tier-aware confirm — no-suffix path)

Implements council 10-line spec with tier-aware prompts. Short steps auto, medium combined-prompt, long-pole explicit-prompt-with-ETA.

### `doctor_update_auto.yaml` (~200 LOC; autonomous all-step)

Same 10 phases; bypasses tier prompts; snapshot still mandatory; auto-rollback on regression.

### `doctor_update_confirm.yaml` (~250 LOC; per-step prompt)

Same 10 phases; user prompts at every phase boundary.

### `doctor_update_apply.yaml` (~200 LOC; autonomous + skip-status-check)

Assumes all subsystems need rebuild; bypasses Phase 4 status check; runs full chain.

### `doctor_update_apply-confirm.yaml` (~250 LOC; interactive + skip-status-check)

Same as apply + per-phase prompts.

## VERIFICATION

```bash
SKDOC=".opencode/skills/sk-doc/scripts"

echo "=== Files ==="
ls -la .opencode/commands/doctor/update.md .opencode/commands/doctor/assets/doctor_update_*.yaml

echo "=== Markdown validation ==="
python3 "$SKDOC/validate_document.py" --type command .opencode/commands/doctor/update.md 2>&1 | head -10

echo "=== YAML syntax (5 files) ==="
for f in .opencode/commands/doctor/assets/doctor_update_*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" 2>&1 && echo "$f: VALID" || echo "$f: INVALID"
done

echo "=== Council 10-line coverage in default.yaml ==="
for line in flock probe snapshot dependency.order retry SIGINT post.run.validation migration legacy state.log; do
  grep -qi "$line" .opencode/commands/doctor/assets/doctor_update_default.yaml && echo "  $line: ✓" || echo "  $line: MISSING"
done

echo "=== 5 flags wired in Markdown ==="
for flag in '--force' '--no-snapshot' '--cleanup-legacy' '--migrate' '--keep-snapshots'; do
  grep -q "$flag" .opencode/commands/doctor/update.md && echo "  $flag: ✓" || echo "  $flag: MISSING"
done

echo "=== State log schema declared ==="
grep -i 'state.log\|last-run\.json' .opencode/commands/doctor/update.md | head -5

echo "=== Cross-subsystem dashboard described ==="
grep -i 'dashboard\|7.subsystem\|cross-subsystem' .opencode/commands/doctor/update.md | head -5
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each.
2. Verification output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-10 (yes — there are 10 to track).
4. Halt-and-report on any violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~12 lines) summarizing files created, council 10-line coverage, flag wiring status, state-log schema confirmation, deviations, recommended next track (likely Track D migration manifest).
