# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This traceability pass scanned user-facing documentation, SKILL/README/INSTALL guide surfaces, embedding references, runtime config notes, and scoped setup templates for stale post-014 embedding defaults. The scan specifically distinguished canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade language from residue that still describes llama-cpp selection as Apple-Silicon-specific, hf-local as a restored default, legacy MiniLM/Nomic defaults, old singleton SQLite filenames, or rejected ONNX-runtime backend claims.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-008-001 | P2 | traceability | .opencode/skills/system-spec-kit/README.md:146 | "Auto-cascade uses Voyage/OpenAI when keys are set, then llama-cpp on Apple Silicon, then HF Local ONNX." | confirmed-residue | Rephrase the requirements row to say llama-cpp is selected when the GGUF runtime/model probe succeeds; keep Apple Silicon/Metal as an acceleration detail, not the resolver condition. |

## Iteration summary
- Files scanned: 4234
- New findings: 1 (P0=0, P1=0, P2=1)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation reached for the requested traceability residue classes. Remaining noisy hits were prior-iteration duplicates, acceptable cloud-key opt-in wording, CocoIndex alternate-model support, runtime/test fixtures, transitive dependency notes, or intentional legacy lookup support rather than new post-022 residue.
