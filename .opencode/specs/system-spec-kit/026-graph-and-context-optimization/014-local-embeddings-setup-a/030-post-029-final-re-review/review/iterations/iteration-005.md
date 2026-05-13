# Iteration 005 — Local-LLM Legacy Hunt

## Focus
This iteration scanned traceability surfaces for post-014 embedding-default drift after the 022 remediation batches: root and skill READMEs, install guides, embedding references, config notes, and scoped code/test strings that could leak into user-facing guidance. The scan used exact residue terms for stale hf-local/Nomic/MiniLM defaults, opt-in-only llama-cpp wording, singleton sqlite filenames, cloud-provider marketing claims, and ONNX runtime references, while excluding this review packet, frozen review artifacts, archives, temp dependency trees, and the explicitly allowed legacy/test patterns.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-005-001 | P2 | traceability | README.md:139 | "# Default when no cloud keys are set: llama-cpp (free, local, zero setup on Apple Silicon with Metal GPU)" | confirmed-residue | Rephrase the setup snippet to say llama-cpp is selected when the GGUF runtime/model probe succeeds; avoid making Apple Silicon or zero setup sound like the resolver condition. |
| L-005-002 | P2 | traceability | README.md:520 | "- **llama-cpp** - Default on Apple Silicon. Free, local, 768d Q8_0 GGUF with Metal GPU. No setup." | confirmed-residue | Align the root feature list with the canonical condition: default local provider when the GGUF runtime is installed and reachable, with Metal as an acceleration detail rather than the selection rule. |
| L-005-003 | P2 | traceability | .opencode/skills/system-spec-kit/shared/README.md:260 | "\| **Auto-Detection** \| Selects best provider based on API keys \|" | confirmed-residue | Expand the auto-detection summary so it includes the full resolver inputs: cloud keys first, then the local llama-cpp runtime/model probe, then hf-local fallback. |
| L-005-004 | P2 | traceability | .opencode/skills/system-spec-kit/shared/README.md:325 | "\| Default    \| Yes (Apple Silicon) \| Fallback \| Opt-in \| Opt-in \|" | confirmed-residue | Replace the Apple-Silicon-specific default marker with the canonical runtime-probe wording, and keep Voyage/OpenAI described as selected when their API keys are present. |
| L-005-005 | P2 | traceability | .opencode/skills/system-spec-kit/shared/embeddings/README.md:36 | "- `auto` cascades cloud-keys-first then local: `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> `llama-cpp` (default local on Apple Silicon) -> `hf-local` (always-available CPU fallback when llama-cpp init fails)." | confirmed-residue | Change the parenthetical to "default local when the GGUF runtime and model probe succeeds" so shared embedding docs match the post-014 resolver contract. |
| L-005-006 | P2 | traceability | .opencode/skills/system-spec-kit/mcp_server/README.md:71 | "Use `EMBEDDINGS_PROVIDER=hf-local` when a host cannot load the GGUF runtime or when you intentionally want the old provider for that run." | confirmed-residue | Avoid calling hf-local "old"; it is still the canonical automatic fallback. Say "fallback provider" or "force the hf-local provider for that run." |

## Iteration summary
- Files scanned: 4235
- New findings: 6 (P0=0, P1=0, P2=6)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation is emerging for the requested true-residue classes. I found no new P0/P1 traceability claims for Nomic/MiniLM current defaults, llama-cpp explicit opt-in, hf-local restored as the automatic default, Voyage recommendation/8% marketing, or current 384-dimensional defaults. The remaining live residue is weaker wording drift around Apple Silicon/Metal as if it were the llama-cpp selection condition, plus one hf-local "old provider" phrase.
