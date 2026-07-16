# Tool Evidence

This lineage used direct reads and rg searches. Code Graph MCP was unavailable in the session, so graphless fallback was used.

Key commands/read groups:

- Read `.opencode/skills/deep-review/SKILL.md` and protocol references.
- Read the target `spec.md` scope and review focus.
- Searched fanout-run/fanout-pool/executor-config for `spawnSync`, `iterations`, `sandboxMode`, and `concurrency`.
- Searched system-skill-advisor descriptors, schemas, and hook validation docs for `workspaceRoot`, thresholds, and validate payload fields.
- Searched deep-review/deep-loop-runtime graph contracts for `graphEvents`, `IN_DIMENSION`, `IN_FILE`, `COVERS`, and `dimensionCoverage`.
- Verified `.opencode/skills/deep-loop-runtime/scripts/reduce-state.cjs` is absent and loop-specific reducers live elsewhere.
