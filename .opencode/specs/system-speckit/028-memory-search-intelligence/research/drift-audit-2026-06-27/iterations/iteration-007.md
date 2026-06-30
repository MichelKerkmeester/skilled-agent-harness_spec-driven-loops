# Iteration 7 — gpt55

**Angle:** Reference/asset consistency: references/*.md and templates vs the real schema/DB layout/contracts (e.g. embedder + vector-shard docs vs actual DB).

**Findings:** 5

- **[P1] drift** `.opencode/skills/system-spec-kit/references/memory/memory_system.md:23` — Memory reference still claims schema v37
  - evidence: Doc says: "Current baseline: schema v37". Actual source says `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:666`: "export const SCHEMA_VERSION = 41;"
  - fix: Update `memory_system.md` to schema v41 and include V38-V41 fields, or remove the pinned version and link to `SCHEMA_VERSION` as source of truth.
- **[P1] drift** `.opencode/skills/system-spec-kit/references/memory/memory_system.md:35` — Architecture table points at retired per-profile DB filenames
  - evidence: Doc says: "`mcp_server/database/context-index__*.sqlite` ... active profile filename resolved by `shared/embeddings/profile.ts:resolveActiveProfileDbPath`". Actual source says `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:77-87`: `getCanonicalDatabasePath()` returns `context-index.sqlite` and `getVectorShardPath()` returns `vectors/context-vectors__${this.slug}.sqlite`.
  - fix: Replace the database row with the canonical `context-index.sqlite` plus per-profile `database/vectors/context-vectors__...sqlite` shard layout.
- **[P1] contradiction** `.opencode/skills/system-spec-kit/references/config/environment_variables.md:63` — Provider-selection doc denies actual cloud fallback
  - evidence: Doc says: "`ollama` when the persisted `vec_metadata` active embedder pointer is set and reachable" and line 68 says "Cloud providers ... are never auto-selected from a detected API key". Actual source says `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:488-495`: cascade is `ollama`, `hf-local`, `openai`, `voyage`; OpenAI/Voyage probes use API keys at lines 321-399.
  - fix: Rewrite the section to match code: explicit `EMBEDDINGS_PROVIDER` is tried first; otherwise the local-first cascade falls through to OpenAI/Voyage when local probes fail and keys are usable.
- **[P2] dead** `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md:187` — Sidecar worker runbook remains after execution sidecar removal
  - evidence: Doc says: "Sidecars are lazy: the worker is not forked until the first embedding request" and line 189 says `memory_health` exposes `sidecar_workers`. Actual source says `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:61`: `SPECKIT_EMBEDDER_EXECUTION=... is deprecated and ignored; using direct provider routing`, and line 275 creates a direct provider adapter.
  - fix: Remove the lazy sidecar worker and `sidecar_workers` claims; document direct provider routing and the hf-local launcher model server separately.
- **[P2] drift** `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:41` — Bootstrap probe sequence lists removed Ollama manifests
  - evidence: Doc says Ollama chooses first pulled model in order: `nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`. Actual source says `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:22-33`: `MANIFESTS` contains only `nomic-embed-text-v1.5`.
  - fix: Change the probe wording to reference `MANIFESTS` order and state the current list has only `nomic-embed-text-v1.5`, or re-add the removed manifests if that was intended.
