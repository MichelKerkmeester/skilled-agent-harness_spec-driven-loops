---
title: "Scratch: llama-cpp Surface Inventory"
description: "Initial and final grep evidence for 016/002/007 purge work."
---

# llama-cpp Surface Inventory

Initial inventory command:

```bash
git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider' \
  .opencode/skills/system-spec-kit/
```

Initial categories found:

- Runtime source: shared embedding factory/profile/provider files, embedder registry/schema, local reranker, save error classifier comments.
- Tests: embedder registry/list/set/status/reindex, local embedding feature suites, local reranker comments, script regression fixtures.
- Generated sidecars: stale checked-in `.js`, `.d.ts`, and source maps under `shared/embeddings/`.
- Package metadata: `mcp_server/package.json` and root `package-lock.json`.
- Documentation: install guides, provider READMEs, architecture/resilience references, feature catalog, manual playbooks, benchmark artifacts.

Final purge gate:

```bash
git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider' \
  .opencode/skills/system-spec-kit/
```

Result: no output.
