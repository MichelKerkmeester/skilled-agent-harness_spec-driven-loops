# Iter-7 — SPEC METADATA + descriptions.json sweep

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.opencode/specs/descriptions.json` (global spec index)
2. `.opencode/specs/graph-metadata.json` (global spec graph)
3. `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/graph-metadata.json` (parent)
4. `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/description.json` (parent)
5. `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/graph-metadata.json` (parent)
6. `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/description.json` (parent)
7. Each 115 + 114 phase child graph-metadata.json + description.json

### Checks
1. 114 parent `last_active_child_id` points to 007.
2. 114 parent `children_ids` includes 007.
3. 115 parent `last_active_child_id` points to 006.
4. 115 parent `children_ids` includes all 6 phases.
5. NO stale `sk-small-model` or `deep-ai-council` in current-state fields.
6. descriptions.json reflects current renamed skills.

## Output
JSON FINDINGS + NARRATIVE. End.
