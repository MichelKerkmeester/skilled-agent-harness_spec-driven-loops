# Iteration 001 Prompt - gpt55r2-b-10

Review the `B-rest-of-002` non-search memory store/index/lifecycle surface under `.opencode/skills/system-spec-kit/mcp_server/`.

Focus dimensions:

- Correctness of delete, tombstone, retention, and active-row lifecycle behavior.
- Correctness and observability of async ingest/index job accounting.
- Cross-check retrieval/list surfaces only where they validate whether mutation effects are honored.

Constraints:

- Write artifacts only under the supplied fan-out lineage artifact directory.
- Do not call `resolveArtifactRoot`.
- Run one iteration and synthesize findings with exact file-line evidence.
