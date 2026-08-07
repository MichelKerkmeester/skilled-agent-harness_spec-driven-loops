# Codex dispatch: Track B3 — full /doctor:deep-loop command + 4 YAMLs

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author `/doctor:deep-loop` from scratch (Markdown entrypoint + 4 YAML mode assets). The command exposes the existing `deep_loop_graph_*` MCP tools as a doctor surface for research+review coverage graphs.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`

## CANONICAL TEMPLATE SOURCES (read first)

1. **`.opencode/commands/doctor/memory.md`** — Reference Markdown shape (just authored in 013, valid).
2. **`.opencode/commands/doctor/causal-graph.md`** — Just authored sibling (Track B2). Same packet, similar add-only-mutation feel. Use as second reference if available.
3. **`.opencode/commands/doctor/assets/doctor_memory_apply.yaml`** — Reference YAML for snapshot+post-verify+rollback (just authored).
4. **`.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — Original canonical write-mutation pattern.

## CONTEXT FROM PACKET

5. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` §3.3** — per-command specification.
6. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/decision-record.md`** — ADR-001..ADR-009 council answers.

## SUBSYSTEM CONTRACT

| Aspect | Value |
| ------ | ----- |
| Command | `/doctor:deep-loop` |
| Modes | `:auto` (status), `:confirm`, `:apply` (rebuild from iteration set), `:apply-confirm` |
| Targets | `mcp_server/database/deep-loop-graph.sqlite` |
| Snapshot | YES |
| Lazy-init | Detects empty graph, offers init-from-iteration-folders if research/review packets exist |
| Coverage | Research + review iteration node/edge integrity |
| MCP tools | `deep_loop_graph_status`, `deep_loop_graph_query`, `deep_loop_graph_upsert`, `deep_loop_graph_convergence` |
| Gold-battery | Convergence signal returns non-empty for any packet with ≥3 iterations |

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/deep-loop.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_deep-loop_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_deep-loop_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_deep-loop_apply.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_deep-loop_apply-confirm.yaml`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any other doctor command, MCP server code, or spec packet docs.
- DO NOT widen `allowed-tools` beyond `Read`, `Bash`, `Grep`, `Glob`, and the 4 deep_loop_graph MCP tools.

## HARD CONSTRAINTS

1. Markdown passes `validate_document.py --type command`.
2. All YAMLs load via canonical-path validator. `mutation_boundaries.allowed_targets`:
   - `mcp_server/database/deep-loop-graph.sqlite`
   - `mcp_server/database/deep-loop-graph.sqlite.pre-doctor-deep-loop.*.bak`
3. `forbidden_targets` includes all spec folder docs, all skills/agents/commands, all other databases.
4. `apply.yaml` and `apply-confirm.yaml`: Phase 2 snapshot (VACUUM INTO), Phase 3 mutation, Phase 4 post-verify (gold-battery: convergence signal non-empty for ≥3-iteration packets), Phase 5 rollback option.
5. Auto-rollback in `:auto`; prompt in `:confirm`.
6. Lazy-init detection: Phase 0 detects empty graph; if research/review iteration folders exist (`.opencode/specs/**/research/iterations/*.md` or `.opencode/specs/**/review/iterations/*.md`), Phase 1 proposes init-from-iteration-folders.
7. State log path: `<packet_scratch>/doctor-deep-loop-state.<timestamp>.json`.

## SPECIFIC EDITS

Mirror the structure of the just-authored `/doctor:memory` and `/doctor:causal-graph` files. Customize:

- Frontmatter `description`: "Diagnose and rebuild deep-loop coverage graphs (research + review). :auto/:confirm read-only status; :apply/:apply-confirm rebuild from iteration set."
- `argument-hint`: `[:auto|:confirm|:apply|:apply-confirm] [--scope=research|review|both] [--no-snapshot] [--dry-run]`
- `## STALENESS SIGNALS`: empty graph (no nodes), stale graph (last write > 7 days), orphan nodes (questions without claims), missing convergence signal for active packets.
- `## RECOMMENDED MODES`: `:auto` for routine check, `:apply` after a deep-research/deep-review iteration completes.
- `## WORKFLOW PHASES`: 6 phases with lazy-init detection in Phase 0.
- Phase 3 mutation: `deep_loop_graph_upsert()` per iteration node + edge from the source packet's iteration files.

## VERIFICATION (run after authoring; paste output)

```bash
SKDOC=".opencode/skills/sk-doc/scripts"

echo "=== Files ==="
ls -la .opencode/commands/doctor/deep-loop.md .opencode/commands/doctor/assets/doctor_deep-loop_*.yaml

echo "=== Markdown validation ==="
python3 "$SKDOC/validate_document.py" --type command .opencode/commands/doctor/deep-loop.md 2>&1 | head -10

echo "=== YAML syntax ==="
for f in .opencode/commands/doctor/assets/doctor_deep-loop_*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" 2>&1 && echo "$f: VALID" || echo "$f: INVALID"
done

echo "=== Lazy-init logic in apply.yaml ==="
grep -i 'lazy.init\|empty.graph\|iteration' .opencode/commands/doctor/assets/doctor_deep-loop_apply.yaml | head -5

echo "=== Convergence gold-battery ==="
grep -i 'convergence\|>=.3\|gold.battery' .opencode/commands/doctor/assets/doctor_deep-loop_apply.yaml | head -5
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each.
2. Verification output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-7.
4. Halt-and-report on any violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~10 lines) with file list, verification status, deviations, recommended next track.
