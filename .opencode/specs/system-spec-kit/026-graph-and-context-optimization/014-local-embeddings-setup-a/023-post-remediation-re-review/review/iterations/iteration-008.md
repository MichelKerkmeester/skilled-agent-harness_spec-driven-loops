# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue in current docs, README surfaces, manual testing playbooks, install guides, and packet metadata after the 022 remediation batches. I scanned the scoped files for stale hf-local default claims, explicit-opt-in llama-cpp wording, singleton sqlite filename examples, rejected ONNX references, legacy model/dimension defaults, and Voyage wording that conflicts with the canonical auto-pick behavior when `VOYAGE_API_KEY` is present.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-008-001 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/description.json:5 | "auto mode was restored to hf-local and llama-cpp remains explicit opt-in." | confirmed-residue | Refresh the 017 packet metadata to match the accepted ship state: llama-cpp became the no-cloud-key auto default when the GGUF runtime is installed, with hf-local as fallback. |
| L-008-002 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/graph-metadata.json:54 | "auto mode was restored to hf-local and llama-cpp remains explicit opt-in." | confirmed-residue | Regenerate or patch graph metadata so memory/review discovery does not resurface the reversed 017 conclusion. |
| L-008-003 | P1 | traceability | .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md:45 | "`shasum .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`" | confirmed-residue | Make the SIGINT playbook record the active resolved provider DB checksum, using the llama-cpp profile for the no-cloud-key installed-runtime case and hf-local only for fallback/override cases. |
| L-008-004 | P2 | traceability | README.md:142 | "# Option A: Voyage AI (cloud, requires API key, opt-in only)" | confirmed-residue | Rephrase Voyage setup as auto-selected when `VOYAGE_API_KEY` exists; avoid "opt-in only" wording unless it explicitly means "provide a key." |
| L-008-005 | P2 | traceability | .opencode/install_guides/README.md:191 | "Voyage (cloud opt-in), OpenAI (cloud opt-in)." | confirmed-residue | Update the install-guide provider note to say cloud providers are selected automatically by key presence in the canonical cascade. |
| L-008-006 | P2 | traceability | .opencode/skills/system-spec-kit/README.md:693 | "Cloud opt-in. Requires `VOYAGE_API_KEY`. Gated by egress guard." | confirmed-residue | Reword the provider table so Voyage is not presented as a separate explicit opt-in path; it should say `auto` selects Voyage first when the key is present. |

## Iteration summary
- Files scanned: 5869
- New findings: 6 (P0=0, P1=3, P2=3)
- Out-of-scope/historical noted but NOT flagged: 24
- Notes: Saturation is starting to show. The main config mirrors and current embedding READMEs mostly contain the corrected Voyage -> OpenAI -> llama-cpp -> hf-local cascade; remaining traceability residue is concentrated in 017 metadata, one doctor-memory playbook, and "cloud opt-in" wording that can still obscure the intended key-driven Voyage/OpenAI auto-pick behavior.
