# Codex dispatch: Track B1-yamls — complete /doctor:memory YAMLs (3 modes)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author 3 YAML asset files completing the `/doctor:memory` command. The Markdown entrypoint and the `auto.yaml` mode are already authored and validated; you are completing the remaining 3 modes (`confirm`, `apply`, `apply-confirm`).

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`

## CANONICAL TEMPLATE SOURCES (read first)

Treat these as locked authority. Read them before authoring anything.

1. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/memory.md`** — the Markdown entrypoint that all 4 YAMLs serve. Read fully. The setup-phase outputs (`execution_mode`, `intent`, `incremental`, `no_snapshot`, `dry_run`) are the inputs each YAML consumes.
2. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_memory_auto.yaml`** — the read-only diagnostic mode. Use as the structural template for `confirm.yaml` (just add interactive gates).
3. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — the canonical write-mutation pattern. Use for the snapshot + post-verify + rollback shape in `apply.yaml`.
4. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_code-graph_apply-confirm.yaml`** — interactive write-mutation pattern. Reference for `apply-confirm.yaml`.

## CONTEXT FROM PACKET

5. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/decision-record.md`** — ADR-001 confirms `memory_index_scan` uses per-batch (per-file) transactions. SIGINT graceful cancel needs only ~5 sec settle window. Snapshot-restore is mandatory for cross-file consistency.
6. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` §3.1** — per-command specification for `/doctor:memory`.

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_memory_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_memory_apply.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_memory_apply-confirm.yaml`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify `memory.md` (already authored + valid)
- DO NOT modify `doctor_memory_auto.yaml` (already authored)
- DO NOT touch any other doctor command, MCP server code, or spec packet docs
- DO NOT widen `allowed-tools` in any YAML
- DO NOT write into `.opencode/specs/` from these YAMLs at runtime

## HARD CONSTRAINTS

1. **YAMLs must load via the canonical-path validator** (per `doctor_skill-advisor_auto.yaml:49-70` pattern reused by `doctor_code-graph_*.yaml`). Each YAML's `mutation_boundaries.allowed_targets` must include only `mcp_server/database/context-index.sqlite`, `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`, and the snapshot path glob `mcp_server/database/context-index*.sqlite.pre-doctor-memory.*.bak`.
2. **`forbidden_targets`** must include all spec folder docs, all skills/agents/commands, and all other databases.
3. **`apply.yaml` and `apply-confirm.yaml`** MUST include Phase 2 snapshot via `VACUUM INTO` BEFORE Phase 3 mutation, and Phase 4 post-verify (gold-battery: 5 representative `memory_search()` queries) BEFORE Phase 5 rollback option.
4. **Auto-rollback in `apply.yaml`** on gold-battery regression. **Prompt user in `apply-confirm.yaml`** at every gate.
5. **`confirm.yaml`** is read-only like `auto.yaml` but adds interactive review gates between phases.
6. **All YAMLs honor ADR-001**: per-file (per-batch) tx model. SIGINT settle window ~5 sec, not 30 sec. Document this in YAML comments where relevant.
7. **State log path**: `<packet_scratch>/doctor-memory-state.<timestamp>.json` (per `auto.yaml`).

## SPECIFIC EDITS

### `doctor_memory_confirm.yaml`

Copy the structure of `doctor_memory_auto.yaml`. Change:
- `operating_mode.execution: autonomous` → `interactive`
- `operating_mode.approvals: none` → `per_phase`
- Add an `interactive_gates` block before `phase_1_analysis` and `phase_2_recommendation` requiring user approval to advance.
- Add Q-prompt template at each gate: "Phase N complete. Continue to Phase N+1? (y/n/details)"
- All other content stays identical to `auto.yaml`.

### `doctor_memory_apply.yaml`

Start from the SHAPE of `doctor_code-graph_apply.yaml`, customized to memory subsystem:

- `intent: APPLY`
- `operating_mode.execution: autonomous`, `approvals: none`
- Phase 0: discovery (memory_health, memory_stats)
- Phase 1: analysis (drift classification)
- **Phase 2: snapshot** — `VACUUM INTO` for both `context-index.sqlite` and `context-index__voyage__voyage-4__1024.sqlite`. Disk-free preflight: refuse if free < 2× DB total. Filename: `<name>.pre-doctor-memory.<ISO_timestamp>.bak`.
- **Phase 3: validate_targets** (canonical-path validator first activity), then `memory_index_scan({incremental, force: !incremental})` per user input.
- **Phase 4: post-verify (gold-battery)** — run 5 representative `memory_search()` queries, compare result count vs baseline (Recall@20 within bounds). Document baseline thresholds in YAML.
- **Phase 5: rollback (auto on regression)** — restore both DBs from snapshots via `cp -p`.
- Phase 6: state log + flock release.
- Halt conditions: disk insufficient, snapshot fails, mutation_boundary violation, gold-battery regression.

### `doctor_memory_apply-confirm.yaml`

Copy `apply.yaml`. Change:
- `operating_mode.execution: interactive`, `approvals: per_phase`
- Add `interactive_gates` block before each of Phase 2, 3, 4, 5
- Phase 5 rollback in confirm mode: PROMPT user to choose retry/rollback/leave (per ADR-004) instead of auto-rollback.
- Long-pole prompt at start: "Full rebuild can take 5-15 min. Snapshot of context-index (134M) + voyage embeddings (362M) will be taken first. Disk during snapshot: ~1 GB transient. Proceed? (y/n)"

## VERIFICATION (run after authoring; paste output)

```bash
SKDOC=".opencode/skills/sk-doc/scripts"

echo "=== Files created ==="
ls -la .opencode/commands/doctor/assets/doctor_memory_*.yaml

echo "=== YAML syntax validation per file ==="
for f in .opencode/commands/doctor/assets/doctor_memory_{confirm,apply,apply-confirm}.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "$f: YAML VALID" || echo "$f: YAML INVALID"
done

echo "=== Required keys present per YAML ==="
for f in .opencode/commands/doctor/assets/doctor_memory_{confirm,apply,apply-confirm}.yaml; do
  echo "--- $f ---"
  for key in role purpose operating_mode mutation_boundaries workflow halt_conditions; do
    grep -q "^${key}:" "$f" && echo "  $key: ✓" || echo "  $key: MISSING"
  done
done

echo "=== Mutation boundaries check (apply + apply-confirm only) ==="
for f in .opencode/commands/doctor/assets/doctor_memory_{apply,apply-confirm}.yaml; do
  echo "--- $f ---"
  echo "  allowed_targets:"; grep -A 5 'allowed_targets:' "$f" | head -8
  echo "  forbidden_targets contains spec folder?"
  grep -A 5 'forbidden_targets:' "$f" | grep -q 'specs' && echo "    ✓" || echo "    MISSING"
done

echo "=== ADR-001 reference present (per-batch tx + SIGINT ~5 sec) ==="
grep -l 'per-batch\|ADR-001\|per-file\|5.*sec' .opencode/commands/doctor/assets/doctor_memory_apply.yaml || echo "ADR-001 reference: MISSING"
```

## OUTPUT REQUIREMENT

1. **Files created**: list each path with one-line rationale.
2. **Verification block output**: paste full output of the verification commands.
3. **Constraint compliance**: yes/no per Hard Constraint 1-7.
4. **Halt-and-report** on any constraint violation. Do NOT proceed past a violation.

## MEMORY HANDBACK

After completing the work, emit a concise `MEMORY_HANDBACK` block (~10 lines) summarizing: files created, verification status per gate, any deviations from spec, and the recommended next track to dispatch.
