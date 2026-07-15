---
title: "Spec: domain-tuned reranker fine-tune for spec-memory (with template-stripping) [template:level_1/spec.md]"
description: "Phase 3 of the rerank decision arc — path of last resort. Fine-tunes a small cross-encoder (ms-marco-MiniLM-L-6-v2 or bge-reranker-base) on synthetic spec-memory triples. KEY refinement over the superseded 010 packet: template-stripping in the triple-generation pipeline so the model learns content relevance instead of template/anchor scaffolding. Gated on both Phase 1 (OFF_DEFICIENT) and Phase 2 (HOLD)."
trigger_phrases:
  - "011/003 domain tuned finetune"
  - "spec-memory rerank fine-tune"
  - "template-stripping triple generation"
  - "ms-marco-MiniLM fine-tune"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: domain-tuned reranker fine-tune for spec-memory (with template-stripping)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (gated on Phases 1+2 outcomes) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 013 of 013 (terminus) |
| **Supersedes** | `008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune` |
| **Executor** | cli-codex gpt-5.5 high fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

If Phases 1 and 2 both fail to land an acceptable rerank path, the remaining hypothesis is that **no off-the-shelf cross-encoder is well-aligned to the spec-memory corpus**. The corpus has properties most generic rerankers don't see in training:

- Heavy template scaffolding (`&lt;!-- ANCHOR:id --&gt;`, frontmatter, packet-id slugs, ADR headers)
- Structural references between docs (`parent_id`, `related_to`, `depends_on` edges in `graph-metadata.json`)
- Domain-specific vocabulary (rerank gates, MPS attention, sidecar lifecycle terms)
- Long-form docs (often 200-500 lines) where the relevant span is a small section

A domain-tuned cross-encoder, trained on triples drawn from the actual corpus, addresses this directly. The key refinement over the superseded 010 packet: **template-stripping in the triple-generation pipeline**, so the model can't learn to rank by template-similarity instead of content.

### The 010 packet's gap

The original 010 scaffold generated hard negatives from graph-metadata's `parent_id` / `related_to` edges — sensible structurally. But spec-memory's structural neighbors share `&lt;!-- ANCHOR:metadata --&gt;`, `## 1. METADATA`, frontmatter shape, and other template scaffolding heavily. Without template-stripping, contrastive loss has an easy shortcut: rank by template-similarity. The resulting model would do well on the existing 50-probe fixture (which also has scaffolded docs) while learning nothing useful about content relevance. This phase removes that shortcut.

### Purpose

Train a fine-tuned cross-encoder that beats both (a) OFF baseline by ≥3 hits AND (b) the Phase 2 bge-v2-m3 verdict number (HOLD or PROMOTE — whichever was the higher hit-rate at Phase 2 close). Publish the artifact to private HF or local cache; pin a revision; flip the spec-memory default.

### Why this is gated

Cost: ~3-5 days wall clock (data generation + training + eval + publishing). Significantly higher than Phases 1-2. Only worth doing if cheaper options haven't already landed a working reranker OR closed the arc with OFF_ACCEPTABLE.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (when executed)

- **Triple generation pipeline** (new code, lives under sidecar skill OR a new finetune-helper skill — decided in Phase A of plan.md):
  1. Iterate over all docs in spec-memory's indexed corpus (excluding `z_archive/`)
  2. **Template-strip each doc** before using it as a positive: remove frontmatter, all `&lt;!-- ANCHOR:...--&gt;` tags + matching closing tags, `&lt;!-- SPECKIT_*:...--&gt;` markers, repeated `## N. SECTION` headers, code-fence delimiters. Keep only the natural-language content + any inline content within fences.
  3. Generate paraphrased queries via LLM (cli-codex or similar): 3-5 queries per doc, varying length and specificity
  4. Hard negatives drawn from graph-metadata edges (`parent_id`, `related_to`) — same template-strip applied so contrastive loss sees content not scaffolding
  5. Optional: cross-corpus easy negatives (random non-related docs) at 20% of negatives
  6. 80/20 train/test split by `packet_id` (held-out test packets never appear as positive OR negative in training)
  7. Output: train.jsonl + test.jsonl with `(query, positive, negative, packet_id_pos, packet_id_neg)` rows
- **Base model selection**: `cross-encoder/ms-marco-MiniLM-L-6-v2` (33M, fast) OR `BAAI/bge-reranker-base` (~110M). Choose based on Phase 2 bge-v2-m3 size/latency observations.
- **Training**:
  - 1-3 epochs (early-stop on test-set NDCG)
  - MarginMSE or contrastive loss (CrossEntropyLoss with positive/negative pairs)
  - Apple Silicon MPS if it fits; CPU otherwise
  - Save checkpoints every epoch; pick the best test-set NDCG
- **Evaluation**:
  - On the existing 50-probe fixture (NEVER appears in training data because the fixture probes are queries, not docs, and the held-out test-set split is by packet_id)
  - vs OFF baseline (from Phase 1)
  - vs bge-v2-m3 (from Phase 2, even if HOLD — establishes whether fine-tune actually beats the strongest off-the-shelf)
  - vs ms-marco baseline (from arc 008 Phase 005, if comparable)
- **Publishing**:
  - Private HF org (or local cache `~/.cache/huggingface/hub/`) — operator decision
  - Pin revision SHA in sidecar `RERANK_MODEL_REVISIONS`
  - Add to `RERANK_ALLOWED_MODELS`
- **Verdict gate**: hit-rate ≥ OFF + 3 AND ≥ bge-v2-m3 + 1 AND p95 latency < +500ms vs OFF AND no OOM

### Out of Scope

- Multi-corpus fine-tune (this packet trains on spec-memory only; cocoindex stays on Qwen)
- Larger base models (>500MB) — keep inference cheap on Apple Silicon
- RL / preference tuning — standard contrastive or MarginMSE is enough
- Human-labeled triples — synthetic + structural negatives only
- Adding new probes to the fixture — held-out test split is the eval surface for training; the 50-probe fixture remains the production gate
- Re-training cocoindex's reranker

### Files likely to be modified / created

- New: `.opencode/skills/system-rerank-sidecar/scripts/finetune/` (triple generation, training, eval scripts) OR a new top-level skill (decided in Phase A of plan.md)
- New: training data artifacts (NOT in git — store under `.cache/` or sidecar-local with .gitignore)
- New: model artifacts (NOT in git — store via HF or local cache)
- Modified: `.opencode/skills/system-rerank-sidecar/.env*` (allowlist + revision pin for the fine-tuned model)
- Modified: `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:54` (point local provider at the fine-tuned model) — PROMOTE only
- Modified: `003-domain-tuned-finetune/implementation-summary.md`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Triple-generation pipeline produces ≥5k triples | train.jsonl line count + test.jsonl line count captured |
| REQ-002 | Template-stripping applied to every positive AND negative | Sample inspection: 10 random rows have no `&lt;!-- ANCHOR:...--&gt;` or frontmatter remnants |
| REQ-003 | Train/test split is by packet_id (no leakage) | A script confirms no packet_id appears in both train and test |
| REQ-004 | Training completes 1-3 epochs without crash | Logs captured; best epoch + test-set NDCG recorded |
| REQ-005 | Eval on 50-probe fixture vs OFF + vs bge-v2-m3 baselines | Side-by-side table in implementation-summary §Eval Results |
| REQ-006 | Verdict gate evaluated | hit-rate ≥ OFF + 3 AND ≥ bge-v2-m3 + 1 AND p95 < +500ms AND no OOM |
| REQ-007 | If PROMOTE: artifact published + revision pinned + spec-memory default flipped | HF/cache path + SHA + cross-encoder.ts diff captured |
| REQ-008 | Strict-validate exit 0 | `bash validate.sh <packet> --strict` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Training reproducibility: seed + hyperparams + base model SHA recorded | All in implementation-summary §Training Config |
| REQ-010 | Template-stripping function has dedicated unit tests | New pytest or vitest covering each stripped element type |
| REQ-011 | Update arc parent to reflect Phase 3 verdict | `_memory.continuity.recent_action` updated in 011 spec.md |
| REQ-012 | Decision record entry | `decision-record.md` ADR for "fine-tune over off-the-shelf" if PROMOTE |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fine-tuned model exists, is reproducible, has a pinned revision
- **SC-002**: Verdict (PROMOTE / HOLD) supported by eval data
- **SC-003**: Template-stripping is provably applied (unit tests + sample inspection)
- **SC-004**: No leakage between train and test (script-verified)
- **SC-005**: Strict-validate exit 0
- **SC-006** (if HOLD): clear documentation of "rerank is intrinsically hard for this corpus" + recommendation to accept OFF as production state
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Template-strip removes too much content; positives become near-empty | Medium | Training data is degenerate | Min-length filter on positives (e.g., ≥50 words after stripping); manual sample inspection at 100, 500, 1k triples |
| Template-strip removes too little; model still overfits to scaffolding | Medium | Defeats Phase 3's purpose | Hold out a "structural-neighbor" eval set: pairs of unrelated docs with same template; fine-tuned model should NOT rank them as similar |
| LLM-generated paraphrased queries are too uniform | Medium | Train/test distribution mismatch with real queries | Vary query length 5-30 words; include keyword-only and natural-language styles; sample 20 queries for manual review before training |
| Training OOMs on MPS at large batch sizes | Medium | Fall back to CPU or smaller batches | Start batch_size=8 on MPS; halve if OOM; CPU at batch=16 is acceptable fallback |
| Fine-tuned model PROMOTEs on the 50-probe fixture but regresses on real-world queries | Medium-High | Production quality drop | Live-validation gate: ≥5 real memory_search calls show reasonable top-3 results before flipping default. Failure → HOLD even if benchmark says PROMOTE |
| Synthetic query generation costs more LLM tokens than expected | Low | Cost overrun | Cap at 5k triples; if 5k isn't enough, file as a separate "data extension" packet |
| HF private repo / local cache mechanism unfamiliar | Low | Publishing step delayed | Use local cache path on first iteration; HF private repo is a follow-on |

Dependencies:

- Phase 1 OFF baseline numbers (target floor)
- Phase 2 bge-v2-m3 numbers (target to beat by ≥1)
- spec-memory's indexed corpus reachable from sidecar/finetune-helper scripts
- `graph-metadata.json` files across all packets (source for structural negatives)
- LLM access for query generation (cli-codex or alternate)
- ~10 GB free disk for HF cache (base model + checkpoints + final artifact)
- MPS or CPU compute (no CUDA available on this machine)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Base model — ms-marco-MiniLM-L-6-v2 (33M, fast, but underpowered for diverse markdown) or bge-reranker-base (~110M, stronger baseline, slightly slower)? Phase 2 verdict: HOLD; bge-v2-m3 baseline numbers below. bge-v2-m3 reached hit-rate@5 `0.12`, NDCG@10 `0.11`, Recall@5 `0.12`, recall misses `44/50`, ranking inversions `0`, p50 latency `609.126 ms`, p95 latency `10591.245 ms`, and post-run sidecar health timed out. Phase 3 must beat this floor and OFF.
- **Q2**: Where do the finetune scripts live? Options: (a) inside `system-rerank-sidecar/` as `scripts/finetune/`; (b) new top-level skill `system-rerank-finetune/`. Decision in plan.md §Phase A; option (a) is the lean default unless the scripts grow large.
- **Q3**: Template-strip should also remove code blocks? Pro: code blocks are content noise for natural-language rerankers. Con: some specs have load-bearing code (config snippets, command outputs). Tentative: strip language-tagged code fences (` ```bash`, ` ```ts`) but keep untagged fences and inline backticks.
- **Q4**: Publish to HF private repo or just local `~/.cache/huggingface/hub/`? Local is simpler; HF private gives the option to share across machines later. Default: local first, HF as follow-on.
- **Q5**: Should the fine-tuned model be added to cocoindex's allowlist too, or stay spec-memory-only? Stay spec-memory-only for this packet; cocoindex evaluation is a separate concern.
<!-- /ANCHOR:questions -->
