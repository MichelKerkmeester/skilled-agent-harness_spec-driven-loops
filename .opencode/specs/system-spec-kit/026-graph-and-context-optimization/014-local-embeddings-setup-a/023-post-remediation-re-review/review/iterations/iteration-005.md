# Iteration 005 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue in user-facing markdown, install guides, references, templates, fixtures, and config-facing text. I searched for stale local-embedding defaults, legacy `nomic`/Ollama setup instructions, singleton SQLite path language, rejected ONNX runtime references, and misleading provider-selection examples, then filtered out prior iteration findings, frozen review/evidence artifacts, historical changelogs, intentional legacy lookup registries, and CocoIndex alternative-model documentation.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-005-001 | P1 | traceability | .opencode/install_guides/README.md:600 | `"EMBEDDINGS_PROVIDER": "hf-local"` | confirmed-residue | Change the install-guide `opencode.json` example to leave `EMBEDDINGS_PROVIDER` unset or set it to `auto`, so the sample does not pin new installs to the fallback provider. |
| L-005-002 | P1 | traceability | .opencode/install_guides/README.md:925 | `"Ollama running with nomic-embed-text model"` | confirmed-residue | Remove the Ollama/nomic checklist item or replace it with verification of the active `llama-cpp`/EmbeddingGemma profile DB. |
| L-005-003 | P1 | traceability | .opencode/install_guides/README.md:938 | `"ollama list \| grep -q \"nomic-embed-text\" &&"` | confirmed-residue | Replace the final verification command with a provider-cascade check that does not require Ollama or the legacy nomic model. |
| L-005-004 | P1 | traceability | .opencode/install_guides/README.md:1427 | `"ollama pull nomic-embed-text"` | confirmed-residue | Remove the quick-reference nomic pull command from the default install path; if retained, label it as unrelated optional Ollama usage. |
| L-005-005 | P2 | traceability | .opencode/install_guides/README.md:376 | `"Prerequisites → Ollama → Code Mode → Spec Kit Memory →"` | confirmed-residue | Refresh the full-bundle sequence so Ollama is not shown as a required step before Spec Kit Memory. |

## Iteration summary
- Files scanned: 4364
- New findings: 5 (P0=0, P1=4, P2=1)
- Out-of-scope/historical noted but NOT flagged: 24
- Notes: Saturation is visible outside the install guide: remaining hits were prior iteration findings, intentional provider cascade docs, explicit alternative-model examples, test temp-db idioms, legacy compatibility tests, historical changelogs, or frozen review/evidence artifacts.
