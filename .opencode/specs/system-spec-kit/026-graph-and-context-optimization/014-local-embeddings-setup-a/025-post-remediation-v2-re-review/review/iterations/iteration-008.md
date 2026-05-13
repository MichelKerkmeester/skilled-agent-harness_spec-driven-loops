# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This traceability pass scanned user-facing setup docs, skill references, shared embedding documentation, and scoped code comments/config notes for post-014 provider-default drift. The review specifically filtered out the accepted Voyage -> OpenAI -> llama-cpp -> hf-local cascade, historical/review/evidence artifacts, vitest temp database idioms, and already-reported residues from iterations 001-007, then checked remaining hits for claims that still misdescribe the canonical EmbeddingGemma/llama-cpp/hf-local profile story.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-008-001 | P2 | traceability | .opencode/install_guides/README.md:567 | "Spec Kit Memory now supports three embedding backends:" | confirmed-residue | Change the count to four concrete providers, or say "multiple embedding providers" so it matches the table and canonical resolver. |
| L-008-002 | P1 | traceability | .opencode/install_guides/README.md:643 | "- [ ] Embeddings provider loads on first run (OpenAI or HF local depending on config)" | confirmed-residue | Replace the stale validation note with the canonical first-run resolver: Voyage if keyed, OpenAI if keyed, llama-cpp when GGUF runtime is available, then hf-local. |
| L-008-003 | P1 | traceability | .opencode/install_guides/README.md:1289 | "sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__*.sqlite \"SELECT COUNT(*) FROM memory_index;\"" | confirmed-residue | Make the troubleshooting command use the actual file selected by the preceding `ls context-index__*.sqlite` step, not a llama-cpp-only wildcard. |
| L-008-004 | P1 | traceability | .opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:50 | "│    Quality: Highest (optimized for code/technical content)        │" | confirmed-residue | Remove the unsubstantiated quality ranking and describe Voyage neutrally as the first cloud provider selected when `VOYAGE_API_KEY` is present. |
| L-008-005 | P2 | traceability | .opencode/skills/system-spec-kit/shared/types.ts:53 | "/** Interface for all embedding providers (HfLocal, OpenAI, Voyage) */" | confirmed-residue | Include `llama-cpp` in the provider list or make the comment provider-neutral. |
| L-008-006 | P2 | traceability | .opencode/skills/system-spec-kit/shared/README.md:260 | "\| **Auto-Detection** \| Selects best provider based on API keys \|" | confirmed-residue | Expand the auto-detection description to include API-key precedence plus local llama-cpp probing and hf-local fallback. |
| L-008-007 | P2 | traceability | .opencode/skills/system-spec-kit/README.md:687 | "Five providers are supported. The default cascade (when `EMBEDDINGS_PROVIDER=auto` or unset) is Voyage -> OpenAI -> llama-cpp -> hf-local:" | confirmed-residue | Distinguish four concrete providers from the `auto` resolver mode so the count does not imply an extra embedding backend. |

## Iteration summary
- Files scanned: 4360
- New findings: 7 (P0=0, P1=3, P2=4)
- Out-of-scope/historical noted but NOT flagged: 31
- Notes: Saturation is close for traceability. Most high-signal hits remaining in the broad sweep were already covered by iterations 001-007, explicitly historical changelogs/review artifacts, intentional legacy model registries, or accepted cloud-key/local fallback cascade wording.
