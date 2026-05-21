# Deep-Review iter-2 — 007 rename packet — dimension: TRACEABILITY

## Role
You are a senior deep-reviewer. Read-only audit. Cite EVIDENCE for every finding.

## Context
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`
Target packet: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-rename-sk-ai-small-model/`
Mode: **READ-ONLY**.

Iter-1 finished with 0 findings (correctness dim). Now examining TRACEABILITY.

## Scope: TRACEABILITY dimension (iter 2)
Verify that the 007 packet's metadata + handoff state correctly traces to the rename outcomes:

### Pre-planning

1. **Frontmatter continuity**: Read the `_memory.continuity` blocks in spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md. Verify:
   - `packet_pointer` points at 007 path
   - `last_updated_*` consistent
   - `key_files` reflect the actual touched surfaces
   - `session_dedup` chain has internally consistent parent_session_id linkage
   - `next_safe_action` compact (no narrative)
   - Acceptance: list any inconsistencies.

2. **Parent linkage**: Read 114/graph-metadata.json + 114/spec.md PHASE DOCUMENTATION MAP. Verify:
   - `children_ids` includes 007 path
   - `derived.last_active_child_id` points at 007
   - PHASE 7 row exists in MAP without rewriting phases 001-006
   - Phase F deletion note amended (not rewritten)
   - Acceptance: cite jq/grep evidence per check.

3. **Anchor coverage**: Read implementation-summary.md anchors (metadata, what-built, how-delivered, decisions, verification, limitations). Verify each anchor's content is non-empty and traces back to spec.md requirements.
   - Acceptance: per-anchor evidence cite.

4. **CHK evidence quality**: Read checklist.md CHK items. For each `[x]`, verify the EVIDENCE row is concrete (file:lines or commit-sha or jq output) — not vague narrative.
   - Acceptance: count of evidence-quality fails per priority bucket.

5. **Memory link integrity**: Verify [[wikilinks]] in spec/plan/tasks/checklist/impl-summary resolve to existing memory file slugs at `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/`.

### Action
Run pre-planning 1-5 in order, then emit findings.

### Output
JSON block under `## FINDINGS` (same schema as iter-1) + `## NARRATIVE` markdown summary.

End of prompt.
