# Codex dispatch: Track B2 — full /doctor:causal-graph command + 4 YAMLs

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author `/doctor:causal-graph` from scratch (Markdown entrypoint + 4 YAML mode assets). The command exposes the existing `memory_causal_*` MCP tools as a doctor surface for causal-edges integrity + auto-link.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`

## CANONICAL TEMPLATE SOURCES (read first)

Treat as locked authority.

1. **`.opencode/commands/doctor/memory.md`** — Reference Markdown shape (just authored in 013 packet, ~283 LOC, valid). Use for frontmatter / Execution Protocol / Constraints / Unified Setup Phase / numbered H2 sections (1. PURPOSE, 6. INSTRUCTIONS).
2. **`.opencode/commands/doctor/assets/doctor_memory_auto.yaml`** — Reference YAML for read-only diagnostic mode (just authored).
3. **`.opencode/commands/doctor/code-graph.md`** — Original canonical Markdown for write-mutation commands.
4. **`.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — Canonical write-mutation pattern (snapshot + post-verify + rollback).

## CONTEXT FROM PACKET

5. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` §3.2** — per-command specification for `/doctor:causal-graph`.
6. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/decision-record.md`** — ADR-002..ADR-008 council answers.
7. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/spec.md`** — predecessor packet that ships causal-edges (1,328 edges, ~46% coverage). Coverage target ≥ 60% per CHK-065 from prior packet.

## SUBSYSTEM CONTRACT

| Aspect | Value |
| ------ | ----- |
| Command | `/doctor:causal-graph` |
| Modes | `:auto` (stats + drift), `:confirm`, `:apply` (auto-link), `:apply-confirm` |
| Targets | `causal_edges` table inside `mcp_server/database/context-index.sqlite` |
| Snapshot | YES — snapshots host context-index DB before any link mutation |
| Mutation boundary | **ADD-ONLY edges; never deletes existing edges** |
| Auto-link confidence | ≥ 0.7 only |
| Coverage target | ≥ 60% of spec-doc records (gold-battery threshold) |
| MCP tools | `memory_causal_stats`, `memory_causal_link`, `memory_drift_why` |

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/causal-graph.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_causal-graph_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_causal-graph_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_causal-graph_apply.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_causal-graph_apply-confirm.yaml`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any other command, MCP server code, or spec packet docs.
- DO NOT delete any existing causal edge under any circumstance (add-only mutation boundary).
- DO NOT widen `allowed-tools` beyond what the subsystem requires.
- DO NOT include `code_graph_*` or `skill_graph_*` tools in `allowed-tools` — out of scope for this command.

## HARD CONSTRAINTS

1. **Markdown passes** `validate_document.py --type command` with `valid: true` (warnings about non-sequential numbering OK — same as canonical `/doctor:code-graph.md`).
2. **All YAMLs load via canonical-path validator** with `mutation_boundaries.allowed_targets` exactly:
   - `mcp_server/database/context-index.sqlite` (the host DB containing causal_edges table)
   - `mcp_server/database/context-index.sqlite.pre-doctor-causal-graph.*.bak` (snapshot path)
3. **`forbidden_targets`** must include all spec folder docs, all skills/agents/commands, all other databases, and `causal_edges` row deletions (enforce add-only via mutation_boundaries.policy).
4. **`apply.yaml` and `apply-confirm.yaml`** include Phase 2 snapshot, Phase 3 mutation (auto-link only via `memory_causal_link`), Phase 4 post-verify (gold-battery: coverage ≥ 60%), Phase 5 rollback option.
5. **Auto-link confidence threshold**: `memory_causal_link()` calls only for records with confidence score ≥ 0.7. Document the threshold in YAML.
6. **Add-only mutation**: YAML must explicitly declare in `mutation_boundaries.policy: "add-only edges; deletion is forbidden"`. Phase 3 first activity = canonical-path validator + add-only policy check.
7. **State log path**: `<packet_scratch>/doctor-causal-graph-state.<timestamp>.json`.

## SPECIFIC EDITS

### `causal-graph.md` (Markdown entrypoint)

Use `memory.md` as the structural template. Adjust:

- Frontmatter `description`: "Diagnose and rebuild causal-edges integrity (add-only auto-link). :auto/:confirm read-only stats; :apply/:apply-confirm auto-link with confidence ≥ 0.7."
- `argument-hint`: `[:auto|:confirm|:apply|:apply-confirm] [--confidence-threshold=0.7] [--no-snapshot] [--dry-run]`
- `allowed-tools`: `Read, Bash, Grep, Glob, mcp__mk_spec_memory__memory_causal_stats, mcp__mk_spec_memory__memory_causal_link, mcp__mk_spec_memory__memory_drift_why, mcp__mk_spec_memory__memory_search`
- `## 1. PURPOSE`: explain causal_edges drift causes (new spec docs without explicit links, ad-hoc memory_save without link suggestions, evolving decision lineage).
- `## SUBSYSTEM CONTRACT`: per the table above.
- `## STALENESS SIGNALS`: low coverage (<60%), orphan records (no incoming edges), divergent edge weights, stale edge `last_observed_at` timestamps.
- `## RECOMMENDED MODES`: `:auto` for routine check, `:apply` after a deep-research/deep-review iteration, `:apply-confirm` for first-time auto-link on a packet.
- `## MUTATION BOUNDARIES`: add-only; never delete edges. Phase 3 first activity validates.
- `## WORKFLOW PHASES`: 6 phases (discovery, analysis, snapshot, apply, post-verify, rollback) — same shape as `memory.md` but customized.
- `## OUTPUT CONTRACT`: stats table, drift signals, action taken, recommendation, next steps.
- `## RELATED COMMANDS`: `/doctor:update`, `/doctor:memory` (host DB), `/deep:start-research-loop`, `/deep:start-review-loop`.

### `doctor_causal-graph_auto.yaml`

Read-only diagnostic. Phase 0 discovery (memory_causal_stats), Phase 1 analysis (sample 10 records via memory_drift_why), Phase 2 recommendation, Phase 3 report. No mutation.

### `doctor_causal-graph_confirm.yaml`

Same flow as auto + interactive gates between phases.

### `doctor_causal-graph_apply.yaml`

Discovery + analysis + snapshot + auto-link + gold-battery + rollback. The mutation step calls `memory_causal_link()` for each candidate record with confidence ≥ 0.7. Auto-rollback in autonomous on coverage regression.

### `doctor_causal-graph_apply-confirm.yaml`

Same as apply + interactive gates. User confirms each batch of links before commit.

## VERIFICATION (run after authoring; paste output)

```bash
SKDOC=".opencode/skills/sk-doc/scripts"

echo "=== Files created ==="
ls -la .opencode/commands/doctor/causal-graph.md .opencode/commands/doctor/assets/doctor_causal-graph_*.yaml

echo "=== Markdown validation ==="
python3 "$SKDOC/validate_document.py" --type command .opencode/commands/doctor/causal-graph.md 2>&1 | head -10

echo "=== YAML syntax per file ==="
for f in .opencode/commands/doctor/assets/doctor_causal-graph_*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "$f: YAML VALID" || echo "$f: INVALID"
done

echo "=== Add-only policy declared (apply + apply-confirm only) ==="
for f in .opencode/commands/doctor/assets/doctor_causal-graph_{apply,apply-confirm}.yaml; do
  grep -q 'add-only\|policy:.*add' "$f" && echo "$f: add-only policy present ✓" || echo "$f: MISSING"
done

echo "=== Confidence threshold declared ==="
grep -h 'confidence.*0\.7\|threshold.*0\.7' .opencode/commands/doctor/assets/doctor_causal-graph_apply*.yaml | head -3

echo "=== Coverage target ≥60% in gold-battery ==="
grep -h '60\|0\.6\|coverage' .opencode/commands/doctor/assets/doctor_causal-graph_apply.yaml | head -5
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each.
2. Verification block output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-7.
4. Halt-and-report on any violation.

## MEMORY HANDBACK

After completing the work, emit a concise `MEMORY_HANDBACK` block (~10 lines) summarizing: files created, verification status per gate, any deviations from spec, and recommended next track to dispatch.
