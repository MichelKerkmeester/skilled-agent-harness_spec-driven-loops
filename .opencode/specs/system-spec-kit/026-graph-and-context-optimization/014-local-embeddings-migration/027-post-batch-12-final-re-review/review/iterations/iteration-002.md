# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This iteration scanned active traceability surfaces for post-022 drift: root release/readme docs, live install guides, system-spec-kit and CocoIndex SKILL/README/reference/assets docs, active config metadata, and packet description/graph metadata while excluding this review packet, the 021/022 packets, z_archive, review logs/iterations, evidence transcripts, generated/vendor/build folders, and known regression fixtures. The emphasis was on stale user-facing claims about embedding defaults, provider order, database filename shape, and ONNX/runtime residue, with the Q1/Q2 clarifications treated as binding.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-002-001 | P1 | traceability | PUBLIC_RELEASE.md:25 | "context-index.sqlite" | confirmed-residue | Replace the singleton example with a provider-keyed placeholder such as `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a concrete llama-cpp default example. |
| L-002-002 | P1 | traceability | .opencode/skills/system-spec-kit/shared/README.md:207 | "│       └── speckit_memory.db   # Active shared SQLite database file" | confirmed-residue | Update the package tree to show generated provider-keyed `context-index__*.sqlite` files or omit active DB filenames entirely. |
| L-002-003 | P1 | traceability | .opencode/skills/system-spec-kit/shared/README.md:364 | "└── speckit_memory.db # Active shared SQLite database file" | confirmed-residue | Align the Per-Profile Databases section with `resolveActiveProfileDbPath` and the profile-keyed `context-index__...` naming contract. |
| L-002-004 | P1 | traceability | .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:23 | "| Voyage Provider | `shared/embeddings/providers/voyage.ts` | Primary embedding provider |" | confirmed-residue | Rework the architecture table to include `llama-cpp` and `hf-local`, and describe Voyage/OpenAI as cloud cascade entries rather than the only primary/secondary providers. |
| L-002-005 | P1 | traceability | .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:62 | "│ 3. LOCAL CACHE (Last Resort)                                      │" | confirmed-residue | Replace the fallback-order diagram with the canonical auto cascade: Voyage -> OpenAI -> llama-cpp -> hf-local, with keyword/cache degradation documented separately. |
| L-002-006 | P1 | traceability | .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:98 | "envKey: 'LLAMA_CPP_EMBEDDINGS_MODEL'," | confirmed-residue | Clarify that llama-cpp auto-selects when the GGUF runtime/model probe succeeds; `LLAMA_CPP_EMBEDDINGS_MODEL` is a model override, not an opt-in selector. |
| L-002-007 | P2 | traceability | .opencode/install_guides/README.md:567 | "Spec Kit Memory now supports three embedding backends:" | confirmed-residue | Fix the stale count to match the documented table and canonical provider set: llama-cpp, hf-local, Voyage, and OpenAI under `auto`. |

## Iteration summary
- Files scanned: 1927
- New findings: 7 (P0=0, P1=6, P2=1)
- Out-of-scope/historical noted but NOT flagged: 5
- Notes: The Voyage -> OpenAI -> llama-cpp -> hf-local cascade itself looked correctly documented in the main README, ENV_REFERENCE, MCP server README, shared embeddings README, and install-guide provider-selection block. I did not flag cloud "opt-in" wording where it means setting a cloud API key, CocoIndex `voyage/voyage-code-3` alternative-model references, transitive ONNX notes for Transformers.js, historical 014 metadata/evidence, or test fixture `test-context-index.sqlite` examples.
