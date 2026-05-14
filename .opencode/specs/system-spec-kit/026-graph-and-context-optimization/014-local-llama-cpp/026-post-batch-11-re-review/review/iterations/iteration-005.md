# Iteration 005 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability drift after the 022 remediation batches: user-facing docs, spec metadata/docs, install guides, README/SKILL surfaces, references, and config notes that still assert stale local-LLM defaults. I swept for explicit `hf-local` default restoration, `llama-cpp` opt-in-only wording, stale MiniLM/Nomic defaults, retired singleton DB filenames, and Voyage marketing residue, then read the live candidate docs in context to separate current residue from historical review artifacts, test fixtures, and allowed legacy-model registries.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-005-001 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:17 | "Keep auto mode on hf-local; use llama-cpp only with explicit EMBEDDINGS_PROVIDER=llama-cpp" | confirmed-residue | Update the continuity next action to the clarified canonical state: auto mode can select llama-cpp when the GGUF runtime is available, with hf-local only as fallback. |
| L-005-002 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:71 | "The automatic default was therefore restored to `hf-local`; `llama-cpp` remains explicit opt-in." | confirmed-residue | Rewrite the outcome paragraph to record the user-accepted flip: llama-cpp became the intended automatic local default when installed. |
| L-005-003 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/spec.md:103 | "Documented hf-local auto default and llama-cpp explicit opt-in" | confirmed-residue | Replace this file-change summary with the canonical runtime-note cascade: Voyage -> OpenAI -> llama-cpp -> hf-local. |
| L-005-004 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/plan.md:73 | "`llama-cpp` remains a supported provider, but after Phase 4 the auto fallback path is:" | confirmed-residue | Change the architecture section so `llama-cpp` is part of the auto resolver order before `hf-local`, not merely a supported explicit provider. |
| L-005-005 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/plan.md:93 | "Codex, Claude, Gemini, OpenCode notes updated to final hf-local default" | confirmed-residue | Replace "final hf-local default" with "final auto cascade" and name the llama-cpp local-default branch. |
| L-005-006 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/checklist.md:63 | "Auto mode restored to hf-local after failed probe." | confirmed-residue | Update the checklist evidence to reflect the post-clarification outcome: auto mode selects llama-cpp when available and falls back to hf-local. |
| L-005-007 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/tasks.md:70 | "`.codex/config.toml` final hf-local default notes" | confirmed-residue | Update the runtime-config task evidence to say the notes document the canonical auto cascade, not an hf-local default. |
| L-005-008 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/tasks.md:100 | "Auto provider resolution restored to hf-local after the MILD_DIVERGENCE verdict." | confirmed-residue | Replace this completion criterion with the clarified accepted flip and hf-local fallback behavior. |

## Iteration summary
- Files scanned: 5289
- New findings: 8 (P0=0, P1=8, P2=0)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation is starting on traceability. Current implementation-summary wording for 017 no longer carries the bad framing, and current system-spec-kit / mcp-coco-index READMEs mostly reflect EmbeddingGemma and the canonical cascade. The remaining confirmed residue is stale authored metadata/body text in the 017 packet docs, excluding already-reported `description.json` and `graph-metadata.json`.
