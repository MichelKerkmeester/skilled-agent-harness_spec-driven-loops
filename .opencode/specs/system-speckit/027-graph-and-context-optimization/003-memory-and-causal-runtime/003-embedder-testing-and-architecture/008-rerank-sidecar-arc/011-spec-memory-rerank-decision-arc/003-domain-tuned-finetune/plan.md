---
title: "Plan: domain-tuned reranker fine-tune (with template-stripping) [template:level_1/plan.md]"
description: "Phase-3 execution: scripts skeleton → triple gen → template-strip validation → training → eval → publish."
trigger_phrases:
  - "011/003 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded; gated on Phases 1+2"
    next_safe_action: "Hold until Phase 2 HOLD verdict"
    blockers:
      - "Phase 1 + Phase 2 must complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: domain-tuned reranker fine-tune (with template-stripping)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Six phases. Wall clock: ~3-5 days. Multiple cli-codex dispatches.

| Phase | Step | Wall clock |
|---|---|---|
| A | Scripts skeleton + decision on layout (sidecar/finetune/ vs new skill) | ~3-4 hours |
| B | Template-strip implementation + unit tests | ~4-6 hours |
| C | Triple generation: walk corpus, generate queries, build train/test JSONL | ~6-12 hours (LLM-bound) |
| D | Training: 1-3 epochs, save checkpoints, pick best by test-set NDCG | ~6-24 hours (compute-bound) |
| E | Evaluation: 50-probe fixture vs OFF + bge-v2-m3 baselines | ~2 hours |
| F | Publish + revision pin + (if PROMOTE) flip default + live verification | ~2-4 hours |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
COMPLETE iff
  triples generated (≥5k) with template-stripping verified AND
  train/test split is leak-free (script-verified by packet_id) AND
  training completed without crash AND
  eval on 50-probe fixture captured vs OFF + bge-v2-m3 baselines AND
  verdict (PROMOTE / HOLD) supported by eval data AND
  IF PROMOTE:
    artifact published with pinned revision AND
    spec-memory default flipped AND
    ≥5 live memory_search calls show reasonable top-3 (live-validation gate)
  AND strict-validate exit 0
ELSE PARTIAL (record what was completed; HOLD acceptable but explicit).
```

Auxiliary gates:

- **Anti-overfit-to-template gate**: hold out a structural-neighbor eval set of pairs (unrelated content, same template) — fine-tuned model should NOT rank them as similar (cosine/score below a threshold; threshold TBD in Phase C)
- **Sample inspection**: 10 random triples manually reviewed at the 100, 500, 1k milestones during triple generation
- **Reproducibility**: seed + hyperparams + base model SHA + triple-generation script SHA all recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Scripts layout (Phase A decision)

Option A (default): `.opencode/skills/system-rerank-sidecar/scripts/finetune/`

```
.opencode/skills/system-rerank-sidecar/scripts/finetune/
├── strip_templates.py       # the template-stripping function + unit tests
├── generate_triples.py      # walks corpus, generates queries via LLM, applies strip, writes JSONL
├── verify_split.py          # asserts no packet_id leak between train.jsonl and test.jsonl
├── train.py                 # contrastive / MarginMSE training loop
├── eval_on_fixture.py       # runs the 50-probe fixture against the fine-tuned model
└── publish.py               # pushes to HF private OR copies to ~/.cache/huggingface/hub/
```

Option B (escalation): new skill `system-rerank-finetune/`. Only if Phase A discovers the finetune work is more than ~2k LOC and would clutter the sidecar skill.

### Template-stripping function

```python
def strip_templates(doc: str) -> str:
    """Remove template scaffolding from a spec-memory doc.

    Removes:
    - YAML frontmatter (--- ... ---)
    - ANCHOR comments: `&lt;!-- ANCHOR:id --&gt;` and `&lt;!-- /ANCHOR:id --&gt;`
    - SPECKIT_* markers: <!-- SPECKIT_*:... -->
    - Other HTML comment blocks containing template metadata
    - Section headers matching ## \d+\. SECTION patterns
    - Code fences with language tag (```bash, ```ts, etc.)
      [Q3 from spec — preserve untagged fences + inline backticks]

    Returns content suitable for use as a training positive.
    Min length: 50 words; shorter docs are filtered out at the
    triple-generation step, not here.
    """
```

Validate with pytest cases for each removal type + edge cases (nested anchors, unterminated fences, etc.).

### Triple generation pipeline

```python
def generate_triples(
    corpus_root: Path,
    n_triples_per_doc: int = 4,
    hard_negatives_per_positive: int = 2,
) -> tuple[list[Triple], list[Triple]]:
    """Walk corpus, generate (query, positive, negative) triples.

    For each doc:
      1. Strip template; skip if < 50 words after stripping
      2. Generate 4 paraphrased queries via LLM (varied length + style)
      3. For each query, build 2 hard negatives from graph-metadata edges
         (parent_id + related_to + depends_on neighbors), template-stripped
      4. Optionally add 1 easy negative (random unrelated doc)
    Returns (train_triples, test_triples) split by packet_id.
    """
```

### Training

Standard cross-encoder fine-tune via sentence-transformers (matches sidecar's existing dependency stack):

```python
from sentence_transformers import CrossEncoder
from sentence_transformers.losses import ContrastiveLoss

model = CrossEncoder(base_model_name, num_labels=1)
# train with (query, positive) and (query, negative) pairs
# loss = MarginMSE or contrastive depending on Phase A decision
```

### Eval

Reuse the 50-probe fixture harness from Phase 2. Just swap which model the sidecar serves; everything else is the same.

### Publishing

Local-first: copy the final checkpoint to `~/.cache/huggingface/hub/<org>/<model-name>/`. Pin a revision SHA derived from the artifact contents. Sidecar allowlist additions same as Phase 2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Scripts skeleton

1. Read sidecar layout to decide Option A vs Option B
2. Create the skeleton directory + empty Python files
3. Wire up pyproject/setup so the scripts run via `.venv/bin/python` from the sidecar venv

### Phase B — Template-stripping

1. Implement `strip_templates()` per the rules in §Architecture
2. Pytest cases: each removal type + edge cases
3. Run on 20 random docs from the corpus; manually inspect outputs

### Phase C — Triple generation

1. Implement query-generation via LLM (start with cli-codex for synthetic queries; explore alternatives if cost is high)
2. Walk corpus; for each doc, build positives + hard negatives + optional easy negatives
3. Split by packet_id (80/20)
4. `verify_split.py` confirms no leakage
5. Sample inspection at 100 / 500 / 1k milestones
6. Stop at 5k-10k triples (mention in §Verdict if more was needed)

### Phase D — Training

1. Choose base model based on Phase 2 latency data
2. Configure batch_size, learning_rate, epochs (1-3, early-stop on test NDCG)
3. Train on MPS if it fits; CPU otherwise
4. Save checkpoints; pick best by test-set NDCG
5. Reproducibility log (seed, hyperparams, base SHA)

### Phase E — Eval

1. Pre-fetch fine-tuned artifact through sidecar warmup
2. Run 50-probe fixture
3. Compute deltas vs OFF (Phase 1) and bge-v2-m3 (Phase 2)
4. Run anti-overfit-to-template gate against structural-neighbor pairs
5. Apply quality gate → verdict

### Phase F — Publish + flip

1. Pin revision SHA in sidecar allowlist + revisions
2. (PROMOTE only) Update cross-encoder.ts:54 to the fine-tuned model name
3. (PROMOTE only) Live-validation gate: 5 real memory_search calls
4. Strict-validate
5. Update arc parent: mark this phase Complete; arc terminates
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Phase B**: pytest for `strip_templates()` — each rule covered + edge cases
- **Phase C**: `verify_split.py` script as a runtime check; sample inspection as manual gate
- **Phase D**: training-loss curves recorded; no formal regression test (training is non-deterministic by design)
- **Phase E**: existing 50-probe fixture is the eval surface
- **Phase F**: live-validation gate is a manual check + 5 memory_search calls captured in implementation-summary
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 OFF baseline (target floor)
- Phase 2 bge-v2-m3 numbers (target to beat by ≥1)
- spec-memory's indexed corpus
- graph-metadata.json files across packets
- LLM access for synthetic query generation
- sentence-transformers (already in sidecar venv per `manifest.yml`/`pyproject.toml`)
- HuggingFace cache (`~/.cache/huggingface/hub/`)
- ~10 GB disk free
- MPS or CPU compute
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To revert (PROMOTE path):

1. `git revert <commit-sha>` for cross-encoder.ts + env file changes
2. Restart sidecar (resumes serving the previously-configured model)

To purge (training failure or HOLD):

1. Delete `~/.cache/huggingface/hub/<fine-tuned-name>/` if disk pressure
2. The triple-generation data + checkpoints stay reusable for future iterations

No data migration; spec-memory index is independent of reranker model.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch -->
## 8. DISPATCH (cli-codex gpt-5.5 high fast)

**Pre-flight:** main agent reads `.opencode/skills/cli-codex/SKILL.md`. Phase 3 is multi-day work; expect multiple cli-codex dispatches (one per phase A-F or one per logical chunk).

**Dispatch prompt — Phase A (scripts skeleton):**

```text
SCOPE: spec packet 011/003-domain-tuned-finetune Phase A. Create the scripts skeleton at .opencode/skills/system-rerank-sidecar/scripts/finetune/ per plan.md §Architecture.

GATE 3: D) Skip — packet already exists.

ALLOWED WRITE PATHS:
- .opencode/skills/system-rerank-sidecar/scripts/finetune/ (new dir + skeleton .py files)
- 011/003-domain-tuned-finetune/implementation-summary.md (§Phase A complete)
- 011-spec-memory-rerank-decision-arc/spec.md (continuity update only)

DELIVERABLES:
1. Empty Python skeleton files: strip_templates.py, generate_triples.py, verify_split.py, train.py, eval_on_fixture.py, publish.py
2. README.md in finetune/ describing each script's responsibility
3. pyproject or setup integration so scripts run via sidecar's .venv/bin/python
4. Strict-validate exit 0

DO NOT IMPLEMENT logic in this phase — just skeletons + module headers. Phase B fills strip_templates.py.

COMMIT HANDOFF: list exact paths. Main agent commits.
```

**Phase B dispatch prompt** (after Phase A merges):

```text
SCOPE: 011/003 Phase B — implement strip_templates() + pytest cases.

ALLOWED WRITE PATHS: scripts/finetune/strip_templates.py + tests/
DELIVERABLES: function per plan.md §Architecture, pytest coverage for each removal type + edge cases, manual sample-inspection results on 20 random corpus docs in implementation-summary §Phase B.
```

**Phases C-F**: similar shape, dispatched sequentially after each predecessor merges. The main agent decides when to advance based on the prior phase's verdict.

**Invocation shape (varies by phase — Phase C has network access, others don't):**

```bash
codex exec \
  --model gpt-5.5 \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=<true|false> \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c sandbox_workspace_write.writable_roots='["/path/to/Public","/Users/michelkerkmeester/.cache/huggingface"]' \
  --output-last-message /tmp/codex-003-<phase>-output.txt \
  --prompt-file /tmp/codex-003-<phase>-prompt.txt
```

- Phase A: network=false (no model downloads)
- Phase B: network=false (no model downloads)
- Phase C: network=true (LLM API access for synthetic queries)
- Phase D: network=true (HF base model download)
- Phase E: network=false (model already cached)
- Phase F: network=true if publishing to HF private; false if local-cache-only
<!-- /ANCHOR:dispatch -->
