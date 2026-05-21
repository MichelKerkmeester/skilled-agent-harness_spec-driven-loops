# Rerank Fine-Tune Scripts

This folder contains the execution scripts for Phase 3 of the spec-memory
rerank decision arc.

Full context:

- Spec packet:
  `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md`
- Plan:
  `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/plan.md`

## Scripts

- `strip_templates.py`: removes repeated spec-kit scaffolding before a document
  is used as a training positive or negative.
- `generate_triples.py`: planned Phase C entrypoint for corpus walking, query
  synthesis, hard-negative selection, and train/test JSONL output.
- `verify_split.py`: planned Phase C leak check ensuring no packet_id appears in
  both train and test data.
- `train.py`: planned Phase D training entrypoint for the selected cross-encoder
  base model.
- `eval_on_fixture.py`: planned Phase E evaluator for the 50-probe fixture and
  structural-neighbor anti-overfit gate.
- `publish.py`: planned Phase F helper for local-cache staging or private HF
  publishing plus revision-pin handoff.

## Local Usage

Run scripts from the sidecar skill root with its existing virtualenv:

```bash
cd .opencode/skills/system-rerank-sidecar
.venv/bin/python -m scripts.finetune.strip_templates --help
.venv/bin/python -m pytest scripts/finetune/tests/test_strip_templates.py -v
```

Only `strip_templates.py` is implemented in Phase B. The other modules are
intentional skeletons for later dispatches.

