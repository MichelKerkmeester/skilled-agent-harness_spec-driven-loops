---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Packet 017 closes the hf-local, voyage, and openai shard-fallback follow-on by proving there are no non-Ollama active-embedder database resolvers in factory.ts to patch."
trigger_phrases:
  - "factory shard fallback implementation"
  - "hf-local voyage openai no code change"
  - "readActiveOllamaEmbedderFromDb only"
  - "ADR-012 resolver follow-on closed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai"
    last_updated_at: "2026-05-19T19:22:07Z"
    last_updated_by: "codex"
    recent_action: "Closed follow-on as documentation-only after resolver audit"
    next_safe_action: "Main agent stages listed files and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/plan.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/tasks.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0170000000000000000000000000000000000000000000000000000000000004"
      session_id: "016-002-017-factory-shard-fallback-for-hf-voyage-openai"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No hf-local, voyage, or openai resolver needs shard fallback because no such resolver exists in factory.ts."
      - "The only persisted active-embedder provider override remains Ollama."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-factory-shard-fallback-for-hf-voyage-openai |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 017 closes the provider shard-fallback follow-on without touching `factory.ts`. The requested hf-local, voyage, and openai `readActive*EmbedderFromDb` functions do not exist on main, so there is no current non-Ollama database resolver to patch.

### Resolver Audit

The search started with `grep -n` against `shared/embeddings/factory.ts`. It found `readActiveOllamaEmbedderFromDb` and no `readActiveHfEmbedderFromDb`, `readActiveVoyageEmbedderFromDb`, or `readActiveOpenaiEmbedderFromDb` equivalent. A second source read confirmed provider selection flows through `resolveProvider`: explicit `EMBEDDINGS_PROVIDER`, persisted Ollama metadata, `VOYAGE_API_KEY`, `OPENAI_API_KEY`, then hf-local fallback.

### ADR-012 Shard Evidence

`mcp_server/lib/search/vector-index-store.ts::get_vector_shard_path` remains the shard naming source of truth. It creates `vectors/context-vectors__${profile.slug}.sqlite`, and the current database has both `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` and `context-vectors__hf-local__baai_bge-base-en-v1.5__768__q8.sqlite`. That quantized hf-local filename matters for future resolver work, but current factory provider selection never reads it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/spec.md` | Modified | Parent phase documentation map row for packet 017. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/spec.md` | Created | Specification for the no-code-change resolver audit. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/plan.md` | Created | Plan and affected-surface matrix for the investigation. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/tasks.md` | Created | Completed task ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/implementation-summary.md` | Created | Delivery summary, verification evidence, and commit handoff. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed the predecessor packet first, then read the factory and vector shard source. The no-code-change decision came from direct source evidence: only Ollama has a persisted active-embedder DB resolver, while hf-local, voyage, and openai resolve through provider configuration and API-key state. Both TypeScript workspaces built successfully after the investigation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `factory.ts` unchanged | Adding shard fallback without an existing hf-local, voyage, or openai active-embedder DB resolver would invent new resolution semantics outside the requested follow-on. |
| Document the hf-local quantized shard suffix | Current database evidence shows `context-vectors__hf-local__baai_bge-base-en-v1.5__768__q8.sqlite`, so future resolver work must allow suffixes beyond provider, model, and dim. |
| Keep build verification even without source edits | The user requested both workspace builds, and passing builds prove current main remains healthy for the inspected packages. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -n "readActive.*EmbedderFromDb\|hf-local\|voyage\|openai\|ollama" .opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | PASS, only `readActiveOllamaEmbedderFromDb` exists. |
| `grep -R -n "readActiveHf\|readActiveVoyage\|readActiveOpenai\|active_embedder_name\|active_embedder_dim" .opencode/skills/system-spec-kit/shared .opencode/skills/system-spec-kit/mcp_server/lib` | PASS, no non-Ollama active factory resolver found. |
| `sed -n '352,374p' .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | PASS, confirms `context-vectors__${profile.slug}.sqlite` under `vectors/`. |
| `find .opencode/skills/system-spec-kit/mcp_server/database/vectors -maxdepth 1 -name 'context-vectors__*.sqlite' -print` | PASS, confirms current Ollama and hf-local shard filenames. |
| `npm run build` in `.opencode/skills/system-spec-kit/shared` | PASS, `tsc --build`. |
| `npm run build` in `.opencode/skills/system-spec-kit/mcp_server` | PASS, `tsc --build && node scripts/finalize-dist.mjs`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai --strict` | PASS, exit code 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Future non-Ollama active resolvers still need ADR-012 fallback.** This packet closes the current main-state follow-on only. If a later change adds hf-local, voyage, or openai active-embedder DB resolution, that resolver must use glob-style shard matching so quant suffixes such as `__q8` work.
2. **No runtime behavior changed.** The packet records an architectural finding and verification evidence; it does not alter provider selection.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Stage these paths:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/spec.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/description.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/spec.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/plan.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/tasks.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/implementation-summary.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/description.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/graph-metadata.json`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/scratch/.gitkeep`

Draft commit header:

`docs(system-spec-kit): close provider shard fallback audit`

Draft commit body:

`Document that only Ollama has a persisted active-embedder DB resolver in factory.ts.`
`Record ADR-012 shard evidence, current hf-local quantized shard naming, and build verification.`
`Add packet 017 docs plus parent phase-map metadata for commit handoff.`

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
