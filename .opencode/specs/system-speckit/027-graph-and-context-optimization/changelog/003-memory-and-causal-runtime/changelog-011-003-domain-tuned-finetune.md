---
title: "Rerank Decision Arc Phase 003: Domain-Tuned Fine-Tune Setup with Template Stripping"
description: "Phase A/B of the domain-tuned cross-encoder fine-tune path. Skeleton scripts and a tested template-stripping function shipped under the rerank sidecar skill. Phases C through F (triple generation, training, eval, publishing) remain pending follow-on dispatches."
trigger_phrases:
  - "domain tuned reranker finetune"
  - "spec-memory rerank fine-tune"
  - "template stripping strip templates"
  - "ms-marco-MiniLM finetune setup"
  - "rerank sidecar finetune scripts"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc`

### Summary

Off-the-shelf cross-encoders (Phases 1 and 2 of the arc) were unable to lift recall on the spec-memory corpus above the OFF baseline because generic models train on scaffolding similarity rather than content relevance. Both Phase 1 (OFF_DEFICIENT: hit-rate@5 of 0.12) and Phase 2 (HOLD: bge-v2-m3 at the same floor) closed without a promotable result.

Phase 3 opens the domain-tuned path as a last resort. The key refinement over the superseded 010 packet is a template-stripping pipeline that removes frontmatter, ANCHOR comments, SPECKIT markers, language-tagged code fences before triples are generated, so contrastive loss cannot exploit scaffolding similarity as a shortcut.

Phases A and B shipped in a single cli-codex dispatch. The nine finetune helper scripts were created under `.opencode/skills/system-rerank-sidecar/scripts/finetune/`. The `strip_templates()` function was fully implemented with 10-test pytest coverage. Five deterministic sample inspections confirmed that template scaffolding is removed while document content is preserved. Phases C through F (triple generation, training, eval, publishing) are gated on separate follow-on dispatches.

### Added

- Nine skeleton scripts under `.opencode/skills/system-rerank-sidecar/scripts/finetune/`: `__init__.py`, `strip_templates.py`, `generate_triples.py`, `verify_split.py`, `train.py`, `eval_on_fixture.py`, `publish.py`, `README.md`
- `tests/test_strip_templates.py` with 10 pytest cases covering frontmatter removal, ANCHOR comment removal, SPECKIT comment removal, numbered all-caps section header removal, language-tagged fence stripping, untagged fence preservation, nested anchors, unterminated fences, multi-line frontmatter, idempotency
- `strip_templates(doc: str) -> str` function in `strip_templates.py` handling all six documented strip cases

### Changed

- Non-Phase-B modules carry `NotImplementedError` stubs, module docstrings, planned function signatures, argparse `--help` entrypoints to enable per-module dispatch in follow-on phases

### Fixed

- None. This dispatch establishes new scaffolding.

### Verification

| Check | Result |
|-------|--------|
| `pytest scripts/finetune/tests/test_strip_templates.py -v` | 10 of 10 passed in 0.01s |
| `py_compile` on all finetune scripts and tests | Exit 0 |
| `--help` entrypoint check on all six modules | All six returned usage strings without error |
| `verify_alignment_drift.py` scan on `scripts/finetune/` | PASS. 8 files scanned. 0 findings, 0 errors, 0 violations |
| `validate.sh --strict` on this packet | Exit 0. Errors: 0. Warnings: 0 |
| Sample inspection: 5 deterministic random `spec.md` files | Frontmatter and template scaffolding removed. Document content preserved in all 5 samples |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/__init__.py` (NEW) | Package marker |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/strip_templates.py` (NEW) | Fully implemented template-stripping function with six strip cases |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/generate_triples.py` (NEW) | Skeleton with argparse entrypoint and `NotImplementedError` stubs |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/verify_split.py` (NEW) | Skeleton with argparse entrypoint and `NotImplementedError` stubs |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/train.py` (NEW) | Skeleton with argparse entrypoint and `NotImplementedError` stubs |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/eval_on_fixture.py` (NEW) | Skeleton with argparse entrypoint and `NotImplementedError` stubs |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/publish.py` (NEW) | Skeleton with argparse entrypoint and `NotImplementedError` stubs |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/README.md` (NEW) | Per-script responsibility descriptions with links to packet spec |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/tests/test_strip_templates.py` (NEW) | 10 pytest cases for the template-stripping function |

### Follow-Ups

- Dispatch Phase C: run triple generation against the full indexed corpus using the implemented `strip_templates` pipeline.
- Dispatch Phase D: run model training on the generated triples using `ms-marco-MiniLM-L-6-v2` or `bge-reranker-base` depending on Phase 2 size observations.
- Dispatch Phase E: evaluate the fine-tuned model on the 50-probe fixture against the OFF and bge-v2-m3 baselines.
- Dispatch Phase F: if the verdict is PROMOTE, publish the artifact to local cache or HF private repo, pin the revision SHA, then flip the spec-memory default in `cross-encoder.ts`.
- Calibrate the anti-overfit-to-template gate threshold in Phase E: the structural-neighbor eval set approach is specified but the numeric cutoff is TBD.
- Verify cross-machine artifact sharing if the fine-tuned model needs to leave this machine. Local-cache publishing is one-machine-only. An HF push is a separate follow-on.
