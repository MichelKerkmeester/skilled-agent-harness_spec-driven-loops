---
title: "Implementation Summary: domain-tuned reranker fine-tune [template:level_1/implementation-summary.md]"
description: "Filled by cli-codex execution: §Phase A-F results, §Eval Results, §Verdict, §Commit Handoff. Supersedes 010 packet's intent with template-stripping refinement."
trigger_phrases:
  - "011/003 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune"
    last_updated_at: "2026-05-21T12:55:17Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase A/B setup complete"
    next_safe_action: "Phase C triple generation follow-on dispatch"
    blockers:
      - "Phase 1 OFF_DEFICIENT required"
      - "Phase 2 HOLD required"
    completion_state: "phase-a-b-complete"
---
# Implementation Summary: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: Phase A/B complete.** Skeleton scripts and template stripping are in place. Triple generation, training, eval, and publishing are pending follow-on dispatches.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (gated on Phases 1+2 outcomes) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 013 of 013 |
| **Supersedes** | `008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase A - Scripts Skeleton

Layout decision: Option A from `plan.md` was selected. The scripts live under `.opencode/skills/system-rerank-sidecar/scripts/finetune/` because the setup is a compact sidecar-local helper tree, well below the ~2k LOC escalation threshold for a new `system-rerank-finetune` skill.

Skeleton files created:

- `.opencode/skills/system-rerank-sidecar/scripts/finetune/__init__.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/strip_templates.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/generate_triples.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/verify_split.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/train.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/eval_on_fixture.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/publish.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/README.md`

The non-Phase-B modules contain module docstrings, planned function signatures, argparse `--help` entrypoints, and `NotImplementedError` stubs for later dispatches. Import and module execution wiring is local to `scripts/finetune/`; no sidecar `pyproject.toml` edit was made because the dispatch allowed writes only under `scripts/finetune/**` and this packet's spec docs.

README: `.opencode/skills/system-rerank-sidecar/scripts/finetune/README.md` describes each script's responsibility and links back to this packet's `spec.md` and `plan.md`.

### Phase B - Template Stripping

Implemented `strip_templates(doc: str) -> str` in `.opencode/skills/system-rerank-sidecar/scripts/finetune/strip_templates.py`.

Behavior covered:

- Removes YAML frontmatter at document start.
- Removes ANCHOR open/close HTML comments outside code fences.
- Removes `<!-- SPECKIT_* -->` comments outside code fences.
- Removes numbered all-caps template headers like `## 1. METADATA`.
- Converts language-tagged code fences to untagged fences so code content is preserved and a second stripping pass does not remove anchor-like strings inside code.
- Preserves untagged fences, inline backticks, paragraphs, lists, and tables.

Test coverage lives at `.opencode/skills/system-rerank-sidecar/scripts/finetune/tests/test_strip_templates.py` and includes one test per removal type plus nested anchors, unterminated tagged fences, multi-line frontmatter, anchors inside code fences, and idempotency.

### Sample Inspection

Five deterministic random `spec.md` files were sampled from `.opencode/specs/system-spec-kit/` with `random.Random(20260521)`. Before/after snippets below show frontmatter and template scaffolding removed while document content remains.

| Sample | Before | After |
|---|---|---|
| `000-release-cleanup/.../001-sk-code-opencode-standards-audit/spec.md` | `---`<br>`title: "Feature Specification: 037/001 sk-code-opencode Audit"`<br>`template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core \| v2.2"` | `# Feature Specification: 037/001 sk-code-opencode Audit`<br>`---`<br>`\| Field \| Value \|` |
| `005-cross-cutting-quality/002-deep-review-stack/spec.md` | `---`<br>`title: "Spec: 020 Deep-review of 016-019 stack via cli-devin SWE 1.6"`<br>`trigger_phrases:` | `# Spec: 020 Deep-review of 016-019 stack via cli-devin SWE 1.6`<br>`\| Field \| Value \|`<br>`\|---\|---\|` |
| `028-xce-research-based-refinement/003-memoization-dependency-dag-foundation/spec.md` | `---`<br>`title: "Memoization dependency DAG foundation"`<br>`description: "Introduce canonical-input memoization...` | `# Memoization dependency DAG foundation`<br>`---`<br>`\| Field \| Value \|` |
| `008-rerank-sidecar-arc/009-fp16-rerank/spec.md` | `---`<br>`title: "Spec: fp16 cross-encoder weights on MPS [template:level_1/spec.md]"`<br>`trigger_phrases:` | `# Spec: fp16 cross-encoder weights on MPS`<br>`---`<br>`\| Field \| Value \|` |
| `010-code-graph-adoption-eval/004-report-generator/spec.md` | `---`<br>`title: "Feature Specification: 004 Report Generator"`<br>`description: "Markdown report generator...` | `# Feature Specification: 004 Report Generator`<br>`---`<br>`\| Field \| Value \|` |

### Phase C - Pending Follow-On Dispatch

Pending. No triple generation was executed in this dispatch.

### Phase D - Pending Follow-On Dispatch

Pending. No model training, HF download, or compute-bound work was executed in this dispatch.

### Phase E - Pending Follow-On Dispatch

Pending. No 50-probe fixture evaluation was executed in this dispatch.

### Phase F - Pending Follow-On Dispatch

Pending. No publishing, sidecar env update, or `cross-encoder.ts` default flip was executed in this dispatch.

### Commit Handoff

Exact paths modified:

- `.opencode/skills/system-rerank-sidecar/scripts/finetune/__init__.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/strip_templates.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/generate_triples.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/verify_split.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/train.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/eval_on_fixture.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/publish.py`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/README.md`
- `.opencode/skills/system-rerank-sidecar/scripts/finetune/tests/test_strip_templates.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/tasks.md`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by cli-codex gpt-5.5 high fast, network=false, in parallel with Phase 1 and Phase 2 prep dispatches. Scope was limited to plan.md Phase A and Phase B: scripts skeleton, `strip_templates()`, unit tests, sample inspection, and packet documentation updates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Supersede 010 with template-stripping refinement
**Rationale:** The 010 packet was structurally correct (synthetic triples + graph-metadata hard negatives) but missed the template-similarity shortcut that contrastive loss would exploit. Without template-stripping, the model trains to rank by scaffolding similarity (anchors, frontmatter, section headers) rather than content. The 011/003 spec adds the strip step + anti-overfit-to-template eval gate.

### D-002 (scaffolded): Gated on Phases 1+2
**Rationale:** Fine-tuning is multi-day. Phase 1 might close the arc entirely if OFF is acceptable. Phase 2 might close it with a working off-the-shelf model. Phase 3 only fires when both cheaper options fail.

### D-003 (scaffolded): Synthetic queries only, no human labeling
**Rationale:** Spec-memory's corpus is small enough (~1240 packets per descriptions.json count) that LLM-generated paraphrased queries at 4 per doc gives ~5000 triples. Human labeling is multi-week effort with marginal quality gain over a well-prompted LLM.

### D-004 (scaffolded): Local cache publishing default; HF private repo as follow-on
**Rationale:** Local cache is one-machine-only but eliminates HF auth + private-repo complexity. If the artifact later needs to ship across machines, an HF push is a separate follow-on.

### D-005 (scaffolded): Anti-overfit-to-template gate as a hard checkpoint
**Rationale:** The 50-probe fixture alone can't distinguish "ranks by content" from "ranks by scaffolding" because the fixture probes also share scaffolding with the corpus. The structural-neighbor eval set (unrelated content, same template) is the only way to catch template-overfit. Without this gate, a model could PROMOTE on the 50-probe fixture while being useless for real queries.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Commands run:

```bash
cd .opencode/skills/system-rerank-sidecar
.venv/bin/python -m pytest scripts/finetune/tests/test_strip_templates.py -v
.venv/bin/python -m py_compile scripts/finetune/*.py scripts/finetune/tests/*.py
for module in strip_templates generate_triples verify_split train eval_on_fixture publish; do .venv/bin/python -m scripts.finetune.${module} --help >/tmp/finetune_${module}_help.txt || exit 1; done
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/scripts/finetune
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune --strict
```

Pytest output:

```text
============================= test session starts ==============================
platform darwin -- Python 3.11.14, pytest-9.0.3, pluggy-1.6.0 -- .../.venv/bin/python
collected 10 items

scripts/finetune/tests/test_strip_templates.py::test_removes_yaml_frontmatter PASSED [ 10%]
scripts/finetune/tests/test_strip_templates.py::test_removes_anchor_comments_only PASSED [ 20%]
scripts/finetune/tests/test_strip_templates.py::test_removes_speckit_comments PASSED [ 30%]
scripts/finetune/tests/test_strip_templates.py::test_removes_numbered_all_caps_section_headers PASSED [ 40%]
scripts/finetune/tests/test_strip_templates.py::test_removes_language_tagged_fence_delimiters_and_preserves_content PASSED [ 50%]
scripts/finetune/tests/test_strip_templates.py::test_keeps_untagged_fences_and_does_not_strip_anchor_strings_inside PASSED [ 60%]
scripts/finetune/tests/test_strip_templates.py::test_nested_anchors_are_removed_without_removing_content PASSED [ 70%]
scripts/finetune/tests/test_strip_templates.py::test_unterminated_language_tagged_fence_preserves_remaining_content PASSED [ 80%]
scripts/finetune/tests/test_strip_templates.py::test_multiline_frontmatter_is_removed PASSED [ 90%]
scripts/finetune/tests/test_strip_templates.py::test_idempotent PASSED   [100%]

============================== 10 passed in 0.01s ==============================
```

Additional verification:

```text
[alignment-drift] PASS
Scanned files: 8
Findings: 0
Errors: 0
Warnings: 0
Violations: 0

Spec Folder Validation v3.0.0
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```

This dispatch does not claim full packet completion because Phases C-F are intentionally pending.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Synthetic queries diverge from real user queries.** Mitigated by varied query styles + sample inspection, but residual distribution mismatch remains.
2. **Single base model trial.** If ms-marco-MiniLM fine-tune HOLDs, the spec doesn't escalate to bge-reranker-base by default — that's a follow-on packet.
3. **Local-cache artifact is one-machine-only.** Cross-machine sharing requires a follow-on HF push step.
4. **Anti-overfit-to-template gate threshold is TBD.** The threshold for "model should not rank structural neighbors as similar" is calibrated in Phase E; the spec only mandates that the gate exists, not the specific cutoff.
5. **HOLD verdict here closes the arc with a recommendation, not a fix.** If fine-tuning also fails, the conclusion is "spec-memory's corpus is intrinsically hard to rerank with current model families" — operator decides whether to accept OFF or escalate to a future arc (larger base model, different loss, multi-corpus joint training, etc.).
<!-- /ANCHOR:limitations -->
