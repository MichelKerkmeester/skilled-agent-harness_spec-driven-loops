# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This traceability pass scanned current-facing setup docs, skill READMEs, install guides, feature catalogs, manual playbooks, runtime config notes, and packet metadata for residue contradicting the post-014/post-022 embedding defaults. The emphasis was on user-visible claims about hf-local defaults, llama-cpp default selection, cloud-key cascade precedence, profile-keyed sqlite filenames, rejected ONNX backend wording, stale 384-dimensional expectations, and Voyage marketing/default positioning.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 4219
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 12
- Notes: Saturation reached for traceability. The remaining candidate hits read as intentional current docs, historical changelog/spec metadata, package-lock/transitive dependency noise, vitest temp-db idioms, backward-compatibility tests, or explicitly allowed legacy model registry support. No new traceability residue was confirmed beyond iteration 001's already-covered test fixture finding.
