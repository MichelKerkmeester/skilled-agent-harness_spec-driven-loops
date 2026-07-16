---
title: "016/002/006: Ollama encode-path wiring"
description: "Wire the shared embeddings factory to Ollama-backed active embedders so query-time encoding matches the re-indexed vec_<dim> table."
trigger_phrases:
  - "016/006 ollama encode path"
  - "jina encode path wiring"
  - "ollama shared embeddings factory"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/006-ollama-encode-path-wiring"
    last_updated_at: "2026-05-18T19:15:12Z"
    last_updated_by: "codex"
    recent_action: "Wired shared factory to OllamaProvider"
    next_safe_action: "Operator can restart spec-memory daemon after commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-006-ollama-encode-path"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# 016/002/006: Ollama encode-path wiring

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P0 |
| Status | Implemented |
| Branch | main |
| Runtime | Codex CLI |
| Predecessors | 016/002/001 adapter interface; 016/002/002 Ollama backend + multi-dim schema; 016/002/003 MCP tools + re-index; 016/002/004 bake-off; 016/002/005 memory reduction research |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
016/002 shipped the registry, Ollama adapter, `vec_<dim>` tables, and re-index path as an additive layer. The shared search-side factory stayed on the older provider set: `openai`, `voyage`, `hf-local`, `llama-cpp`, and `auto`.

That left a production asymmetry. The index path can write Jina v3 vectors into `vec_1024`, while query-time `generateEmbedding()` and `generateQueryEmbedding()` can still instantiate llama-cpp and produce 768-dim EmbeddingGemma vectors. The live machine has `vec_metadata.active_embedder_name='jina-embeddings-v3'`, `active_embedder_dim=1024`, and a populated `vec_1024`, so search must encode queries with the same Ollama-backed model.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
In scope:
- Add a shared `OllamaProvider` implementing `IEmbeddingProvider`.
- Add `ollama` to shared provider resolution, startup profile, dimensions, and validation.
- Consult `vec_metadata.active_embedder_name` and `active_embedder_dim` in auto mode when they point at a populated Ollama `vec_<dim>` table.
- Preserve fallback to EmbeddingGemma when the active pointer is invalid, mismatched, missing its dim table, or points at an empty table.
- Add regression coverage to `mcp_server/tests/embedder-ollama.vitest.ts`.
- Document the dual path and operator runbook.

Out of scope:
- Restarting the live spec-memory daemon.
- Deleting legacy database files.
- Changing the existing registry, re-index orchestrator, or Ollama adapter.
- Changing unrelated spec packets.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
| ID | Priority | Requirement | Acceptance |
|----|----------|-------------|------------|
| REQ-001 | P0 | `EMBEDDINGS_PROVIDER=ollama` creates an Ollama provider | Vitest + live probe return `OllamaProvider` |
| REQ-002 | P0 | Auto mode selects Ollama when `vec_metadata` points at a populated Ollama `vec_<dim>` table | Vitest covers `jina-embeddings-v3` + `vec_1024` |
| REQ-003 | P0 | Query and document embeddings preserve model-specific prefixes and dimensions | Existing adapter tests + provider test |
| REQ-004 | P0 | llama-cpp does not load on a valid Ollama active path | Explicit Ollama provider path avoids llama-cpp dynamic provider import |
| REQ-005 | P0 | Missing or empty active dim table falls back clearly | Vitest covers missing `vec_1024`; factory logs warning |
| REQ-006 | P1 | OpenAI, Voyage, hf-local, and llama-cpp remain valid providers | Typecheck and unchanged fallback chain |
| REQ-007 | P1 | Architecture docs explain the dual path and runbook | `references/memory/embedder_architecture.md` |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- `createEmbeddingsProvider({ provider: "ollama", model: "jina-embeddings-v3", dim: 1024 })` returns an `OllamaProvider`.
- `generateEmbedding("test query")` returns a 1024-dim `Float32Array` from `http://127.0.0.1:11434/api/embed`.
- Auto provider resolution returns `ollama` on the live active Jina v3 pointer.
- Invalid `vec_metadata`/`vec_<dim>` state does not crash startup.
- The compiled shared dist includes the new provider and factory wiring.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Risk: shared factory cannot import MCP server registry without creating package-direction coupling. Mitigation: duplicate the Ollama manifest table in the shared provider and document the symmetry requirement.
- Risk: active-pointer auto detection could pick stale metadata. Mitigation: require matching `vec_<dim>` table existence and row count before selecting Ollama.
- Risk: a live daemon will keep old module state until restart. Mitigation: document restart as an operator handoff, not part of this packet.

Dependencies:
- Running Ollama with the selected model pulled.
- `sqlite3` CLI for factory-side metadata inspection.
- Existing 016/002 registry and re-index jobs.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Active Ollama query encoding must avoid loading `node-llama-cpp` provider runtime.
- **NFR-P02**: Provider availability probing must be bounded and not block daemon startup indefinitely.

### Security
- **NFR-S01**: No credentials are introduced; Ollama uses local `OLLAMA_BASE_URL`.
- **NFR-S02**: SQLite metadata inspection is read-only and uses fixed keys / validated dim table names.

### Reliability
- **NFR-R01**: Invalid active metadata falls back without crashing.
- **NFR-R02**: Existing non-Ollama providers keep their explicit configuration behavior.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty embedding text returns `null`, matching the shared provider contract.
- Oversized text is semantically chunked or bounded by the Ollama manifest limit.
- Unknown Ollama model names fail fast during provider creation.

### Error Scenarios
- Ollama unreachable: provider creation fails and auto mode can continue to local fallback.
- Missing active dim table: factory logs a warning and skips active Ollama selection.
- Empty active dim table: factory logs a warning and skips active Ollama selection.

### State Transitions
- Completed re-index: `vec_metadata` activates Ollama and shared factory follows it.
- Partial re-index: active pointer/table guard prevents query-time dimension mismatch.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Shared provider, factory, profile, tests, docs |
| Risk | 18/25 | Production search path and provider cascade |
| Research | 14/20 | Required source/caller investigation and live probe |
| **Total** | **49/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
None blocking. A follow-up can decide whether `embedder_status` should also report the active shared provider metadata; this packet keeps handler files out of scope.

<!-- /ANCHOR:questions -->
