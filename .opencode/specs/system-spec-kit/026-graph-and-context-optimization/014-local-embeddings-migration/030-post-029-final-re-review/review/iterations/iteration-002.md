# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue in live user-facing docs, install guides, skill references, runtime configs, prompt-pack mirrors, and scoped fixtures that could still describe pre-014 embedding defaults. I searched for stale hf-local defaults, 384-dimensional MiniLM-era claims, llama-cpp explicit-opt-in wording, Voyage marketing/default drift, singleton sqlite filenames, and ONNX runtime residue, then separated live assertions from historical records, registry compatibility, test-only fixed filenames, and diagnostic guardrails.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4501
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 7
- Notes: Saturation for the traceability pass. Not flagged: root README Voyage "opt-in" language because it describes operator API-key activation, not a wrong resolver order; CocoIndex `voyage/voyage-code-3` references because they are cloud alternatives, not defaults; `nomic-ai/nomic-embed-text-v1.5` registry/test hits because legacy lookup and backward-compat tests are intentional; `context-index.sqlite` test temp filenames because they match the allowed vitest idiom; doctor causal-graph singleton DB entries because they are forbidden-target guardrails; package-lock/vendor `onnxruntime-*` hits because scoped package.json files no longer directly depend on them; and `.venv`/vendor MiniLM examples because they are third-party installed text, not repo-authored defaults.
