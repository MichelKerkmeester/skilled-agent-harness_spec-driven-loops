# Iteration 006 — Local-LLM Legacy Hunt

## Focus
This maintainability pass scanned scoped code comments, fixtures, templates, prompt/config examples, install/reference docs, feature catalogs, manual playbooks, and packet metadata for residue that would make follow-on cleanup harder after packet 022. The scan specifically separated live residue from intentional Voyage/OpenAI/llama-cpp/hf-local cascade documentation, legacy model registries, temp-test sqlite filenames, historical changelog/spec narratives, and prior iteration findings.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-006-001 | P2 | maintainability | .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:210 | "embedding models (nomic-embed-text-v1.5 and compatible providers)." | confirmed-residue | Reword the normalization comment around provider-neutral semantic embedding input, or name the current EmbeddingGemma defaults instead of the old Nomic-era model. |

## Iteration summary
- Files scanned: 4356
- New findings: 1 (P0=0, P1=0, P2=1)
- Out-of-scope/historical noted but NOT flagged: 11
- Notes: Saturation is likely for maintainability-specific residue under this pass. Skipped candidates included prior iteration findings, vitest temp-dir `context-index.sqlite` idioms, legacy-model lookup registries, `test_backward_compat.py`, historical changelog/spec metadata, package-lock transitive ONNX entries, and intentional CocoIndex `voyage-code-3` cloud-alternative examples.
