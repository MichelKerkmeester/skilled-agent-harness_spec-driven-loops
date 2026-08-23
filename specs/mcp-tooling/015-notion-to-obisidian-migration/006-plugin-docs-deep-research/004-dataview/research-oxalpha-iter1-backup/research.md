# Research Synthesis: Dataview Reference Docs Optimization (004-dataview)

Progressive synthesis - updated by @deep-research each iteration when progressiveSynthesis is enabled. Reducer owns strategy/registry/dashboard; this file accumulates findings.

## Status

- Iteration 1 of 4 complete (cold start). KQ1 answered; KQ5 baseline established; KQ2/KQ3/KQ4 open.

## Key Findings (Iteration 1)

1. Live reference tree: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` (`dataview.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`) + `assets/plugins/dataview/` examples. The `.claude/...` path named in strategy context does not exist. [SOURCE: glob evidence, iteration-001.md Finding 1]
2. Local DQL skeleton coverage is strong: 4 view types, 6 FROM source forms, 6 clauses, inline prefixes, 23 verified functions (verified against installed main.js 0.5.68). [SOURCE: data-model.md:245-360]
3. Confirmed gaps vs official docs (https://blacksmithgu.github.io/obsidian-dataview/queries/structure/): boolean/parenthesized source composition; data-command multiplicity + written-order execution; TASK-level WHERE semantics (`!completed`, task fields, GROUP BY file.link + SORT rows pattern); GROUP BY `key`/`rows` variables; FLATTEN `AS` aliasing; LIST-with-field output; null-guard WHERE idiom; unscoped-vault-query performance warning.
4. No factual conflicts local-vs-official found so far. VERIFY queue: `TABLE WITHOUT ID`, source negation, `contains` variants, bracket inline fields `[key:: value]` in tasks/lists.

## Open Questions

- KQ2 DataviewJS API essentials (default OFF via `enableDataviewJs: false` - local docs already flag this).
- KQ3 frontmatter/inline-field conventions incl. bracket inline fields for Notion-migrated notes.
- KQ4 failure modes: null/missing fields, coercion, date math, cache staleness.
- KQ5 concrete doc additions: candidates from iteration 1 = source-composition section, command-ordering rules, TASK semantics block, GROUP BY rows/key explainer, performance warning.

## Next

Iteration 2: official data-commands + reference/sources pages; read workflows.md + troubleshooting.md; resolve VERIFY queue.
