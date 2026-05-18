# Codex dispatch: Track B4 — full /doctor:cocoindex command + 4 YAMLs

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author `/doctor:cocoindex` from scratch (Markdown entrypoint + 4 YAML mode assets). The command exposes the existing `ccc_*` MCP tools as a doctor surface for semantic search index rebuild.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/`

## CANONICAL TEMPLATE SOURCES (read first)

1. **`.opencode/commands/doctor/memory.md`** — Reference Markdown shape (just authored in 013, valid).
2. **`.opencode/commands/doctor/causal-graph.md`** + **`.opencode/commands/doctor/deep-loop.md`** — Sibling Markdown entrypoints from Tracks B2 + B3 (just authored). Read for similar shape.
3. **`.opencode/commands/doctor/assets/doctor_memory_apply.yaml`** — Reference YAML for snapshot+post-verify+rollback.
4. **`.opencode/commands/doctor/assets/doctor_code-graph_apply.yaml`** — Original canonical write-mutation pattern.

## CONTEXT FROM PACKET

5. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/spec.md` §3.4** — per-command specification.
6. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-cocoindex-stack/010-daemon-resilience/spec.md`** — predecessor packet shipping daemon idempotency fix (3.4.1.0). Reference for "refuse if daemon unhealthy" semantics.

## SUBSYSTEM CONTRACT

| Aspect | Value |
| ------ | ----- |
| Command | `/doctor:cocoindex` |
| Modes | `:auto` (status + drift), `:confirm`, `:apply` (full reindex), `:apply-confirm` |
| Targets | CocoIndex SQLite + vector store under `.opencode/skills/mcp-coco-index/mcp_server/database/` |
| Snapshot | YES |
| Daemon coordination | Refuses if daemon unhealthy; `:apply` triggers idempotent restart per 3.4.1.0 fix |
| MCP tools | `ccc_status`, `ccc_reindex`, `ccc_feedback` |
| Gold-battery | 3 representative semantic queries return ≥ 5 results post-rebuild |

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/cocoindex.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_cocoindex_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_cocoindex_confirm.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_cocoindex_apply.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_cocoindex_apply-confirm.yaml`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any other doctor command, MCP server code, or spec packet docs.
- DO NOT widen `allowed-tools` beyond `Read`, `Bash`, `Grep`, `Glob`, and the 3 ccc_* MCP tools.

## HARD CONSTRAINTS

1. Markdown passes `validate_document.py --type command`.
2. All YAMLs load via canonical-path validator. `mutation_boundaries.allowed_targets` covers CocoIndex DB paths under `mcp-coco-index/mcp_server/database/`.
3. `forbidden_targets` includes all spec folder docs, system-spec-kit databases, all skills/agents/commands.
4. `apply.yaml` and `apply-confirm.yaml`: Phase 1 daemon health probe (refuse if unhealthy), Phase 2 snapshot, Phase 3 idempotent daemon restart + `ccc_reindex()`, Phase 4 post-verify (gold-battery), Phase 5 rollback option.
5. Auto-rollback in `:auto`; prompt in `:confirm`.
6. Daemon coordination: refuse to start `:apply` if `ccc_status()` reports daemon unhealthy. Document in YAML.
7. State log path: `<packet_scratch>/doctor-cocoindex-state.<timestamp>.json`.

## SPECIFIC EDITS

Mirror the canonical sibling pattern. Customize:

- Frontmatter `description`: "Diagnose and rebuild the CocoIndex semantic search index. :auto/:confirm read-only status; :apply/:apply-confirm reindex with idempotent daemon restart."
- `argument-hint`: `[:auto|:confirm|:apply|:apply-confirm] [--no-snapshot] [--dry-run]`
- `## STALENESS SIGNALS`: code drift (codebase changed since last reindex), embedding model change, daemon zombie state (per 3.4.1.0 fix), broken-pipe accumulation (CPU spinning).
- `## RECOMMENDED MODES`: `:auto` for routine check, `:apply` after major code changes or embedding model swap.
- `## WORKFLOW PHASES`: include Phase 1 daemon health probe.

## VERIFICATION

```bash
SKDOC=".opencode/skills/sk-doc/scripts"

echo "=== Files ==="
ls -la .opencode/commands/doctor/cocoindex.md .opencode/commands/doctor/assets/doctor_cocoindex_*.yaml

echo "=== Markdown validation ==="
python3 "$SKDOC/validate_document.py" --type command .opencode/commands/doctor/cocoindex.md 2>&1 | head -10

echo "=== YAML syntax ==="
for f in .opencode/commands/doctor/assets/doctor_cocoindex_*.yaml; do
  python3 -c "import yaml; yaml.safe_load(open('$f'))" 2>&1 && echo "$f: VALID" || echo "$f: INVALID"
done

echo "=== Daemon health probe in apply.yaml ==="
grep -i 'daemon\|ccc_status\|unhealthy' .opencode/commands/doctor/assets/doctor_cocoindex_apply.yaml | head -5
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each.
2. Verification output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-7.
4. Halt-and-report on violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~10 lines).
