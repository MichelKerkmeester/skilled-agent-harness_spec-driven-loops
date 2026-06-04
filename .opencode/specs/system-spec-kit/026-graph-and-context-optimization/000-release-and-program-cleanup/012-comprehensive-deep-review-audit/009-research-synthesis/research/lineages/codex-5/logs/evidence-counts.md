# Evidence Counts and Command Outputs

## Metadata Graph Counts
Command: `find .opencode/specs/system-spec-kit/026-graph-and-context-optimization -name graph-metadata.json -type f | wc -l`
Output: `714`

Command: `find .opencode/specs/system-spec-kit/027-xce-research-based-refinement -name graph-metadata.json -type f | wc -l`
Output: `18`

## Entity-Density Invalidation Search
Command: `rg -n "invalidateEntityDensityCache" .opencode/skills/system-spec-kit/mcp_server/handlers .opencode/skills/system-spec-kit/mcp_server/lib -g '*.ts'`

Observed invalidation sites:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2854`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:859`
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:581`

No direct hit appeared in `memory-crud-update.ts`, `memory-crud-delete.ts`, or `mutation-hooks.ts`.

## Playbook Scenario Count
Command: `find .opencode/skills/system-spec-kit/manual_testing_playbook -path '.opencode/skills/system-spec-kit/manual_testing_playbook/[0-9][0-9]--*/*.md' -type f | wc -l`
Output: `384`

Command: `find .opencode/skills/system-spec-kit/manual_testing_playbook -path '.opencode/skills/system-spec-kit/manual_testing_playbook/[0-9][0-9]--*/_deprecated/*.md' -type f | wc -l`
Output: `0`

## Local LLM Scenario Filenames
Command: `find .opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence -maxdepth 1 -type f -name '*.md'`

Observed files:
- `361-paraphrase-recall.md`
- `362-synonymy-across-vocabularies.md`
- `363-code-intent-matching.md`
- `364-disambiguation-under-context.md`
- `365-multi-aspect-query-synthesis.md`
- `366-specificity-ladder.md`
- `367-adversarial-near-miss.md`
- `368-compound-concept-synthesis.md`
- `369-llm-made-memory-recall.md`
- `370-query-latency-and-throughput.md`
- `371-causal-graph-link-quality.md`
- `372-causal-coverage-under-bulk-save.md`
- `373-drift-detection-quality.md`
- `374-cross-ai-memory-handoff.md`
- `375-concurrent-multi-ai-safety.md`
- `README.md`

## Review Summary Shape
Command: `find .opencode/specs -path '*/orchestration-summary.json' -type f ...`

Observed for all eight slices in this audit packet:
- `total=1`
- `succeeded=1`
- `failed=0`
- `total_cli_lineages=1`
