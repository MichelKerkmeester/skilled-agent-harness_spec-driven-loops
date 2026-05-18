# Codex dispatch: Polish track — sk-doc-align all 21 new doctor YAMLs

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to polish 21 existing doctor YAML asset files so they match the canonical `doctor_code-graph_apply.yaml` style. The structural skeleton is already correct (workflow phases, mutation_boundaries, validate_targets, snapshot, mutate, post-verify, rollback). What's missing is **descriptive richness**.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-initial-doctor-commands/`

## CANONICAL STYLE REFERENCES (read first; treat as locked authority)

1. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — gold standard for `:apply` mode YAMLs (read fully).
2. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_code-graph_apply-confirm.yaml`** — gold standard for `:apply-confirm` mode (read fully).
3. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_skill-advisor_auto.yaml`** — alternate gold standard for `:auto` mode with `field_handling.policy` mappings.
4. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_skill-advisor_confirm.yaml`** — alternate gold standard for `:confirm` mode.

## PACKET CONTEXT

5. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-initial-doctor-commands/decision-record.md`** — ADR-001..ADR-009 (council 10-line spec, tx-model finding). Cite ADR IDs in `upstream_assets` blocks where relevant.
6. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-initial-doctor-commands/spec.md`** — REQ-001..REQ-023.

## IN_SCOPE_FILES (21 YAMLs to polish)

```
.opencode/commands/doctor/assets/doctor_memory_auto.yaml
.opencode/commands/doctor/assets/doctor_memory_confirm.yaml
.opencode/commands/doctor/assets/doctor_memory_apply.yaml
.opencode/commands/doctor/assets/doctor_memory_apply-confirm.yaml
.opencode/commands/doctor/assets/doctor_causal-graph_auto.yaml
.opencode/commands/doctor/assets/doctor_causal-graph_confirm.yaml
.opencode/commands/doctor/assets/doctor_causal-graph_apply.yaml
.opencode/commands/doctor/assets/doctor_causal-graph_apply-confirm.yaml
.opencode/commands/doctor/assets/doctor_deep-loop_auto.yaml
.opencode/commands/doctor/assets/doctor_deep-loop_confirm.yaml
.opencode/commands/doctor/assets/doctor_deep-loop_apply.yaml
.opencode/commands/doctor/assets/doctor_deep-loop_apply-confirm.yaml
.opencode/commands/doctor/assets/doctor_cocoindex_auto.yaml
.opencode/commands/doctor/assets/doctor_cocoindex_confirm.yaml
.opencode/commands/doctor/assets/doctor_cocoindex_apply.yaml
.opencode/commands/doctor/assets/doctor_cocoindex_apply-confirm.yaml
.opencode/commands/doctor/assets/doctor_update_default.yaml
.opencode/commands/doctor/assets/doctor_update_auto.yaml
.opencode/commands/doctor/assets/doctor_update_confirm.yaml
.opencode/commands/doctor/assets/doctor_update_apply.yaml
.opencode/commands/doctor/assets/doctor_update_apply-confirm.yaml
```

## OUT_OF_SCOPE (forbidden — do NOT modify)

- ANY `.md` file (Markdown entrypoints are correct as authored)
- The 5 canonical reference YAMLs you read for style (code-graph_*, skill-advisor_*)
- `migration-manifest.json` or any other JSON
- `.opencode/specs/**` — never touch spec packet docs
- Any MCP server source code

## POLISH OBJECTIVES (what's missing in current YAMLs)

### 1. ADD `upstream_assets` block (where applicable)

Reference pattern (`code-graph_apply.yaml:24-37`):

```yaml
upstream_assets:
  packet: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-initial-doctor-commands"
  files:
    spec: "spec.md"                                  # REQ-001..REQ-023
    decision_record: "decision-record.md"            # ADR-001..ADR-009
    council_spec: "decision-record.md#adr-002"       # 10-line spec for /doctor:update only
  pass_policy:
    # Per-command pass thresholds; document the MEASURABLE acceptance bar
    gold_battery_recall_floor: 0.90    # memory only
    coverage_target: 0.60               # causal-graph only (CHK-065 from prior packet)
    convergence_signal_required: true   # deep-loop only
    daemon_health_required: true        # cocoindex only
```

Customize per-command: `/doctor:memory` cites ADR-001 for tx model + REQ-005..REQ-007; `/doctor:causal-graph` cites coverage 60% threshold from CHK-065 + REQ-010; `/doctor:deep-loop` cites lazy-init from REQ-013; `/doctor:cocoindex` cites 3.4.1.0 daemon resilience fix; `/doctor:update` cites council 10-line spec (ADR-002..ADR-008).

### 2. ADD module-specific `_invariant` block (multi-line `|` triple-quoted)

Reference pattern (`code-graph_apply.yaml:14-22`):

```yaml
phase_b_invariant: |
  Apply-mode mutates only through the code_graph_apply MCP tool. The workflow
  never executes recovery-playbook shell snippets. ...
```

Per-command invariants:
- `memory_apply.yaml` already has `memory_apply_invariant` — verify it's present and rich
- `causal_graph_apply.yaml`: add `causal_graph_apply_invariant: |` documenting add-only mutation, confidence ≥0.7, never deletes existing edges
- `deep_loop_apply.yaml`: add `deep_loop_apply_invariant: |` documenting lazy-init source detection, iteration-folder read-only inputs, upsert-only mutation
- `cocoindex_apply.yaml`: add `cocoindex_apply_invariant: |` documenting daemon-health refusal, idempotent restart per 3.4.1.0 fix, single ccc_reindex tool path
- `update_*.yaml` (all 5 modes): add `update_orchestrator_invariant: |` documenting flock-protected single-instance, dependency DAG ordering, snapshot + per-step rollback contract, 5-sec SIGINT settle window per ADR-001

### 3. ADD `field_handling.policy` with per-value mappings

Reference pattern (`skill-advisor_auto.yaml:34-44`):

```yaml
field_handling:
  defaults:
    scope_empty: "all"
    skip_tests_empty: "false"
    dry_run_empty: "false"
  scope_policy:
    all: "tune explicit + derived + lexical lanes"
    explicit: "tune TOKEN_BOOSTS and PHRASE_BOOSTS only"
    derived: "tune graph-metadata.json triggers/keywords only"
    lexical: "tune CATEGORY_HINTS only"
```

Add per-command (where the YAML has discriminating user inputs). For example:
- `memory_apply.yaml` field_handling: `incremental_policy: { true: "...", false: "..." }`, `dry_run_empty: "false"`, etc.
- `update_default.yaml` field_handling: `migrate_policy: { true: "run migration-manifest Phase 0", false: "skip migration phase" }`, `force_policy: { true: "...", false: "..." }`, etc.

### 4. ADD inline `# ` comments on non-obvious config values

Patterns to follow (code-graph_apply.yaml has them sprinkled throughout). Examples to add to new yamls:

```yaml
mutation_boundaries:
  allowed_targets:
    - "mcp_server/database/context-index.sqlite"  # primary memory FTS DB
    - "mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"  # 1024-dim voyage embeddings
    - "mcp_server/database/context-index*.sqlite.pre-doctor-memory.*.bak"  # snapshot files only
```

Add similar inline-trailing comments to clarify WHY each value is what it is in workflow phases, halt_conditions, gold_battery thresholds, etc.

### 5. TIGHTEN forbidden_targets globs

Current new yamls have over-broad globs like `.opencode/specs/**/*.md` and `.opencode/skills/**`. Tighten to specific patterns. Example:

```yaml
# BEFORE (too broad)
forbidden_targets:
  - ".opencode/skills/**"

# AFTER (specific)
forbidden_targets:
  - ".opencode/skills/**/SKILL.md            # never edit skill bodies"
  - ".opencode/skills/**/graph-metadata.json # never edit skill metadata in this command (use /doctor:skill-advisor)"
  - ".opencode/specs/**/*.md                 # never write into spec packet docs from doctor commands"
  - "mcp_server/database/code-graph.sqlite   # /doctor:memory does NOT touch code graph (use /doctor:code-graph)"
```

## HARD CONSTRAINTS

1. **Preserve all existing structural correctness** — workflow phases, mutation_boundaries.allowed_targets, validate_targets, snapshot, mutate, post-verify, rollback. Do NOT rearrange or rename existing fields.
2. **Do NOT change semantics** — confidence thresholds, retry counts, tier assignments, allowed targets stay byte-identical. Only ADD descriptive richness.
3. **Each YAML file must still pass** `python3 -c "import yaml; yaml.safe_load(open('<file>'))"` after the polish.
4. **`field_handling.policy`** mappings must reflect ACTUAL behavior in the workflow phases. If a value isn't actually consumed by the workflow, do not invent a policy mapping.
5. **`upstream_assets.pass_policy`** numbers must match the gold-battery thresholds already in the workflow (e.g., causal-graph coverage 0.60 must match CHK-065 in `001-initial-doctor-commands/checklist.md`).
6. **Add `# ` inline comments only where they add value** — do not pad mechanically. Aim for 5-15 inline comments per file.
7. **Module-specific `_invariant` blocks** must use multi-line `|` triple-quoted style (NOT single-line strings). Aim for 4-8 lines per invariant.

## VERIFICATION (run after authoring; paste output)

```bash
echo "=== YAML syntax (all 21 files) ==="
PASS=0; FAIL=0
for f in .opencode/commands/doctor/assets/doctor_{memory,causal-graph,deep-loop,cocoindex,update}_*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" 2>&1 > /dev/null && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "  INVALID: $f"; }
done
echo "  Pass: $PASS / Fail: $FAIL (expected 21 / 0)"

echo ""
echo "=== upstream_assets block present per file (should be ≥21 hits) ==="
grep -l '^upstream_assets:' .opencode/commands/doctor/assets/doctor_{memory,causal-graph,deep-loop,cocoindex,update}_*.yaml | wc -l

echo ""
echo "=== Module-specific _invariant blocks (should be ≥21 hits) ==="
grep -l '_invariant:' .opencode/commands/doctor/assets/doctor_{memory,causal-graph,deep-loop,cocoindex,update}_*.yaml | wc -l

echo ""
echo "=== field_handling.policy presence (should be ≥10 — not every YAML needs one) ==="
grep -l 'field_handling:' .opencode/commands/doctor/assets/doctor_{memory,causal-graph,deep-loop,cocoindex,update}_*.yaml | wc -l

echo ""
echo "=== Inline # comments per YAML (sample 3 files; expect 5-15 each) ==="
for f in .opencode/commands/doctor/assets/doctor_memory_apply.yaml .opencode/commands/doctor/assets/doctor_causal-graph_apply.yaml .opencode/commands/doctor/assets/doctor_update_default.yaml; do
  count=$(grep -cE '^\s+#|^\s+- "[^"]*"\s+#' "$f")
  echo "  $f: $count inline comments"
done

echo ""
echo "=== Tightened forbidden_targets sample ==="
grep -A 8 'forbidden_targets:' .opencode/commands/doctor/assets/doctor_memory_apply.yaml | head -12
```

## OUTPUT REQUIREMENT

1. **Files modified**: list each path with one-line rationale (what was added).
2. **Verification block output**: paste the full output of all 5 verification commands.
3. **Constraint compliance**: yes/no per Hard Constraint 1-7.
4. **Halt-and-report** on any constraint violation. Do NOT proceed past a violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~15 lines) summarizing: per-command coverage (memory: 4/4, causal-graph: 4/4, deep-loop: 4/4, cocoindex: 4/4, update: 5/5), upstream_assets block coverage, _invariant block coverage, field_handling.policy coverage, inline comment density (avg per file), forbidden_targets tightening done, deviations from spec, recommended next track.
