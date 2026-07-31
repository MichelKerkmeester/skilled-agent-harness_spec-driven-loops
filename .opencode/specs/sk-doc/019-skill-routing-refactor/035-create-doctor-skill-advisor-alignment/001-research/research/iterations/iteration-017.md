# Iteration 17: Description projection boundary

## Focus

Decide whether a parent-hub `description.json` should remain descriptive metadata or participate in skill-advisor graph-vocabulary validation.

## Actions Taken

- Read the prior iteration and the externalized research state before selecting this focus.
- Read the skill-root metadata contract, the parent-hub description template, and the live `sk-doc` description/graph metadata pair.
- Read the skill-graph compiler and SQLite metadata loader to identify the files and fields that actually enter graph validation and advisor indexing.
- Read the parent-skill doctor checks covering `description.json`; no researched source file was modified.
- Ran a read-only fleet scan over all seven hub `description.json` files and compared their top-level keys with the graph metadata vocabulary.
- Ran `node .opencode/bin/install-codex-hooks.mjs --check`; it refused to anchor a linked worktree and reported the primary checkout, with no mutation.

## Findings

### 1. P1 — `description.json` and `graph-metadata.json` have different owners and purposes

The skill-root metadata contract requires both files for a packet hub, but assigns them separate roles: `description.json` is authored hub-doctor metadata, while `graph-metadata.json` is the advisor identity input. The contract explicitly says that production consumers do not read a skill-root `description.json`; the advisor ingests graph metadata for identity, domains, intent signals, and typed edges. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:56-75`]

The graph compiler confirms that boundary in code. Discovery scans direct skill roots for `graph-metadata.json` only, and validation requires `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`, and version-specific `derived` fields. `description.json` is neither discovered nor validated by the graph compiler. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:161-183,220-303`; `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/README.md:13,55`]

### 2. P1 — The existing doctor check enforces the correct descriptive boundary

`parent-skill-check.cjs` validates that `description.json` is present, valid JSON, and contains `name`, `description`, `version`, and an array-valued `keywords` field. Its second check rejects only registry-owned duplicates, currently `modes` and `backend_kinds`, because those would create a second source of truth for `mode-registry.json`. It does not require graph fields or compare description keywords to graph arrays. [SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1021-1047`]

That is a schema-boundary check, not a graph-validation omission. The parent description template calls the file “hub-doctor metadata,” permits hub-specific descriptive arrays, and points authors to `graph-metadata.json` for advisor identity. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-description-template.json:1-32`]

### 3. P2 — Current hub data shows no graph-shaped top-level vocabulary in descriptions

The read-only fleet scan found seven hub descriptions: `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, and `system-deep-loop`. Every file uses the descriptive top-level shape (`name`, `description`, `version`, `importance_tier`, `keywords`, `lastUpdated`); none contains the graph metadata keys `schema_version`, `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`, or `derived`.

The live `sk-doc` pair illustrates the intended split: `description.json` contains the hub paragraph and keywords, while `graph-metadata.json` contains schema version, identity, edges, domains, intent signals, and derived advisor metadata. [SOURCE: `.opencode/skills/sk-doc/description.json:1-35`; `.opencode/skills/sk-doc/graph-metadata.json:1-70`]

## Questions Answered

- **Should `description.json` participate in graph-vocabulary validation?** No. Keep it as an authored descriptive parent-hub projection. Graph validation should continue to operate on `graph-metadata.json`, the sole graph/advisor identity input.
- **Should doctor compare description keywords or prose with graph `domains`/`intent_signals`?** No. That would create a second, lossy vocabulary contract and would turn intentionally descriptive extensions into false drift findings.
- **What doctor guard is justified?** Keep structural JSON/required-field checks and the narrow registry-owned duplicate-key guard. A future reserved-key lint could reject explicitly documented graph identity keys if they appear at the top level, but it should be framed as duplicate-source prevention, not as graph-vocabulary validation, and should not compare values across the two files.

## Questions Remaining

- Whether the route contract test should pin the selected graph-validation/refresh tools or compare the declaration with the live advisor tool registry.
- Whether create and doctor should share a small field-vocabulary fixture for their operator-facing index handoff while retaining separate result adapters.
- Which exact post-create handoff wording should identify `description.json`, `graph-metadata.json`, `leaf-manifest.json`, and the operator-owned `skill_graph_scan`/`advisor_rebuild` steps.

## Next Focus

Trace the static route-contract tests and define the minimal assertion matrix for route declarations, workflow output fields, and the create/doctor index handoff.

## Sources Consulted

- `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-description-template.json`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/README.md`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skills/sk-doc/description.json`
- `.opencode/skills/sk-doc/graph-metadata.json`
- `.opencode/bin/install-codex-hooks.mjs --check` output for the linked-worktree source-selection guard

## Assessment

- New information ratio: **0.88**.
- This iteration resolves the `description.json` ownership question. It does not implement doctor, create, or advisor changes.
