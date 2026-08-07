---
title: "Research: 016/004/011 Rerank Model Fit Investigation"
description: "Phase 1 research survey for code-aware cross-encoder rerankers that could replace BAAI/bge-reranker-v2-m3 in CocoIndex."
trigger_phrases:
  - "rerank model fit research"
  - "code-aware reranker candidates"
  - "COCOINDEX_RERANK_MODEL candidate survey"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Research: 016/004/011 Rerank Model Fit Investigation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Research ID | 016/004/011 |
| Status | Phase 1 complete; Phase 2 gated |
| Date | 2026-05-18 |
| Scope | Candidate survey only; no bench executed |
| Baseline issue | `BAAI/bge-reranker-v2-m3` demotes implementations below tests, refs, or source artifacts on probes 3, 10, 14, 18 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:summary -->
## 2. SUMMARY

The best drop-in local candidates for Phase 2 are:

1. `mixedbread-ai/mxbai-rerank-base-v2`
2. `Qwen/Qwen3-Reranker-0.6B`

Both expose Sentence Transformers cross-encoder metadata and can be tested with the existing `COCOINDEX_RERANK_MODEL=<id>` path. `mxbai-rerank-base-v2` is the better first measurement because it is Apache-2.0, about 494M parameters, explicitly supports code/technical retrieval, and has no documented flash-attn or xformers gate. `Qwen3-Reranker-0.6B` is a close second because it is Apache-2.0, instruction-aware, and explicitly includes code retrieval in the Qwen3 ranking task family, but its default prompt is web-search oriented unless CocoIndex grows prompt support.

The most semantically promising code-specialized model is `hq-bench/coreb-code-reranker`, but it is not a simple current drop-in: it is a 4B Qwen3 LoRA/code reranker with custom causal-LM scoring and no `modules.json` Sentence Transformers package. It belongs in a follow-up adapter packet, not this env-var-only Phase 2.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sources -->
## 3. SOURCES CHECKED

Primary sources:

- BGE reranker family: <https://huggingface.co/BAAI/bge-reranker-v2-m3>, <https://huggingface.co/BAAI/bge-reranker-large>, and Hugging Face model API metadata.
- Mixedbread v2: <https://www.mixedbread.com/blog/mxbai-rerank-v2>, <https://huggingface.co/collections/mixedbread-ai/reranking-series-v2>, and Hugging Face model API metadata.
- Qwen3 reranker: <https://huggingface.co/Qwen/Qwen3-Reranker-0.6B> and Hugging Face model API metadata.
- Jina reranker: <https://huggingface.co/jinaai/jina-reranker-v1-turbo-en>, <https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual>, and Hugging Face model API metadata.
- Code-specific rerankers: <https://huggingface.co/hq-bench/coreb-code-reranker>, <https://huggingface.co/jamie8johnson/code-reranker-v1>.
- Code embedding non-reranker checks: <https://huggingface.co/codesage/codesage-base-v2>, <https://huggingface.co/Qodo/Qodo-Embed-1-1.5B>.
- API references: <https://docs.cohere.com/v2/docs/rerank>, <https://docs.voyageai.com/docs/reranker>, <https://docs.voyageai.com/reference/reranker-api>, <https://blog.voyageai.com/2024/09/30/rerank-2/>.
<!-- /ANCHOR:sources -->

<!-- ANCHOR:triage-rubric -->
## 4. TRIAGE RUBRIC

| Verdict | Meaning |
|---|---|
| MEASURE | Drop-in enough for `COCOINDEX_RERANK_MODEL=<id>` and plausible to improve the lexical-density failure mode. |
| CONSIDER | Useful signal, but blocked by license, loader shape, model size, Apple-Silicon friction, or non-local deployment. |
| SKIP | Not a reranker, already known negative, API-only for this local-default decision, or likely repeats the current failure mode. |
<!-- /ANCHOR:triage-rubric -->

<!-- ANCHOR:candidates -->
## 5. CANDIDATE TRIAGE

| Candidate | Size | Training-data summary | License | Apple-Silicon compatibility | Latency expectation | Verdict | Rationale |
|---|---:|---|---|---|---|---|---|
| `mixedbread-ai/mxbai-rerank-base-v2` | 494M params | Mixedbread v2 uses RL-style GRPO, contrastive learning, and preference learning; published as supporting code, SQL, JSON, MCP/tool retrieval, long context, and 100+ languages. | Apache-2.0 | Likely compatible. Hugging Face package has `modules.json`, `config_sentence_transformers.json`, and `LogitScore`; no documented xformers/flash-attn requirement. | Mixedbread reports 0.67s/query on A100 for base-v2; expect laptop MPS/CPU slower, but acceptable for an 8-probe targeted bench. | MEASURE | Best first local candidate: drop-in, current, code-aware enough, and permissive. |
| `Qwen/Qwen3-Reranker-0.6B` | 596M params | Qwen3 ranking family is trained for text retrieval, code retrieval, classification, clustering, bitext mining, multilingual and code-related tasks; instruction-aware. | Apache-2.0 | Likely compatible. Sentence Transformers package includes `modules.json` and `LogitScore`; flash attention is recommended only as an optional acceleration path in raw Transformers usage. | Expect medium to high local latency because it is a 28-layer causal-LM reranker, not a small classifier head. Still plausible for 8 probes. | MEASURE | The strongest permissive general reranker with explicit code-retrieval scope and a direct current loader path. Caveat: current CocoIndex cannot pass a code-specific rerank prompt. |
| `hq-bench/coreb-code-reranker` | 4.02B params | Fine-tuned from Qwen3-Reranker-4B via LoRA on about 3.1M code-search reranking examples from CoREB, CodeSearchNet, APPS, CosQA, and CodeFeedback; reports positive deltas for text-to-code, code-to-text, and code-to-code. | Apache-2.0 | CPU possible in principle, but Apple laptop latency and memory are poor fits. No Sentence Transformers `modules.json`; usage is custom `AutoModelForCausalLM` scoring. | Too slow for the current local env-var bench; likely minutes-scale cold start and heavy per-query latency on Apple Silicon. | CONSIDER | Best semantic fit, but not `COCOINDEX_RERANK_MODEL` drop-in. Needs a Qwen/CoREB reranker adapter packet. |
| `jinaai/jina-reranker-v2-base-multilingual` | 278M params | Jina says v2 is trained on large query-document pairs and benchmarked for multilingual, function-calling-aware, text-to-SQL-aware, and code retrieval tasks. | CC-BY-NC-4.0 | Risky for current loader. Model card says default flash attention may require GPU hardware, with `use_flash_attn=False` as workaround; current CocoIndex CrossEncoder call cannot pass that flag. | Could be fast if it loads, but loader friction and non-commercial license block production default. | CONSIDER | Worth a research-only spot check later, but not a good default candidate under local-first/commercial-friendly constraints. |
| `rerank-v3.5` / `rerank-english-v3.0` / `rerank-multilingual-v3.0` (Cohere API) | Not disclosed | Proprietary Cohere rerankers for semantic relevance over text and semi-structured data. Current docs also list Rerank 4.0, but Rerank 3.5 remains the Rerank 3 reference point. | Proprietary/API terms | Apple-Silicon local compatibility is not applicable; API-only unless private deployment is separately procured. | Network/API latency and billing; no local bench through current `reranker.py`. | SKIP | Useful reference ceiling, not a local default candidate. |
| `rerank-2.5` / `rerank-2` (Voyage API) | Not disclosed | Proprietary Voyage rerankers; Voyage reports evaluation across 93 retrieval datasets spanning technical documentation, code, law, finance, multilingual, long documents, and conversations. | Proprietary/API terms | Apple-Silicon local compatibility is not applicable; API-only. | Network/API latency and billing; no local bench through current `reranker.py`. | SKIP | Useful reference ceiling, especially because Voyage explicitly includes code in evaluation domains, but not production-local. |
<!-- /ANCHOR:candidates -->

<!-- ANCHOR:screened-out -->
## 6. SCREENED-OUT NOTES

| Candidate/family | Verdict | Reason |
|---|---|---|
| `BAAI/bge-reranker-v2-m3` | Baseline | Current default. Instrumented May 18 run already shows the structural failure mode: lexical-cue density beats semantic role on probes 3, 10, 14, 18. |
| `BAAI/bge-reranker-base`, `BAAI/bge-reranker-large` | SKIP | Older Chinese/English XLM-R cross-encoders, 278M and 560M params, MIT. They are easy to load but have no code-specific training signal and shorter 512-token context; likely same class of lexical bias as the current BGE family. |
| `BAAI/bge-reranker-v2-gemma`, `BAAI/bge-reranker-v2-minicpm-layerwise` | SKIP | BGE v2 family alternatives are LLM/layerwise rerankers. They require `FlagLLMReranker`/layerwise usage, are heavier, and do not fit the current `CrossEncoder(model_id)` path. |
| `mixedbread-ai/mxbai-rerank-base-v1`, `mixedbread-ai/mxbai-rerank-large-v1` | SKIP | v2 supersedes v1 and explicitly adds code/JSON/MCP style support, broader languages, longer context, and better reported code-search scores. Measure v2 first. |
| `mixedbread-ai/mxbai-rerank-large-v2` | CONSIDER | Same family as the MEASURE candidate, but 1.54B params. Keep as second-wave only if base-v2 fixes the failure probes but leaves tight margins. |
| `jamie8johnson/code-reranker-v1` | SKIP | It is a true code-search cross-encoder, Apache-2.0, and small, but its model card labels it a negative result: random same-language negatives led it to learn surface patterns and regress hard-eval retrieval. |
| `codesage/*` | SKIP | CodeSage is a code embedding family, not a cross-encoder reranker. Useful for first-stage retrieval, not a `COCOINDEX_RERANK_MODEL` swap. |
| `Qodo/Qodo-Embed-1-1.5B` | SKIP | Qodo-Embed is a code embedding model, not a reranker. No Qodo reranker candidate was found. |
| `Salesforce/codet5-*` and Salesforce code-model spinouts | SKIP | CodeT5-style artifacts are code understanding/generation models, not packaged cross-encoder rerankers for the current CocoIndex path. |
| Exact IDs `codesage-reranker`, `qodo-reranker`, `bge-code-reranker` | SKIP | No stable Hugging Face model matching these exact roles was found. Closest real code-tuned rerankers are `hq-bench/coreb-code-reranker` and `jamie8johnson/code-reranker-v1`. |
<!-- /ANCHOR:screened-out -->

<!-- ANCHOR:measure-commands -->
## 7. PHASE 2 MEASURE COMMANDS

Do not run these until CocoIndex is restored and Phase 2 is explicitly opened. These commands reuse the existing jina-code vector index. They intentionally do not run `ccc reset` or `ccc index`.

### Candidate A: mixedbread base v2

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

export COCOINDEX_RERANK_MODEL=mixedbread-ai/mxbai-rerank-base-v2
export COCOINDEX_RERANK_LOG_PATH=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/evidence/rerank-scores-mixedbread-ai__mxbai-rerank-base-v2.jsonl

# Then run the shared targeted-bench scaffold below.
```

### Candidate B: Qwen3 0.6B

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

export COCOINDEX_RERANK_MODEL=Qwen/Qwen3-Reranker-0.6B
export COCOINDEX_RERANK_LOG_PATH=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/evidence/rerank-scores-Qwen__Qwen3-Reranker-0.6B.jsonl

# Then run the shared targeted-bench scaffold below.
```

The two command blocks above provide the exact reranker-model swap. The shared scaffold below is the targeted bench body to run after exporting one candidate's env vars. If converted to a real script in Phase 2, keep it inside this spec folder and keep the index-reuse precondition.

```bash
#!/usr/bin/env bash
set -euo pipefail

SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation"
FIXTURE=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json"
CCC="${CCC:-$PWD/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc}"
SAFE_MODEL_ID="$(printf '%s' "$COCOINDEX_RERANK_MODEL" | tr '/:' '__')"
OUT_JSONL="$SPEC/evidence/targeted-8probe-$SAFE_MODEL_ID.jsonl"
RUNLOG="$SPEC/evidence/runlog-targeted-8probe-$SAFE_MODEL_ID.txt"

mkdir -p "$SPEC/evidence"
: > "$COCOINDEX_RERANK_LOG_PATH"
: > "$OUT_JSONL"

export COCOINDEX_RERANK=1
export COCOINDEX_RERANK_TOP_K=20
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/jinaai/jina-embeddings-v2-base-code"
export CCC

# Phase 2 precondition: the existing .cocoindex_code index is already built with jina-code.
# Do not reset or reindex here. Restart only the daemon so the reranker env vars apply.
pkill -TERM -f "ccc run-daemon" 2>/dev/null || true

python3 - "$FIXTURE" "$OUT_JSONL" <<'PYTHON' 2>&1 | tee -a "$RUNLOG"
import json
import os
import re
import subprocess
import sys
import time

fixture_path = sys.argv[1]
jsonl_path = sys.argv[2]
ccc_bin = os.environ.get("CCC", "ccc")
model_id = os.environ["COCOINDEX_RERANK_MODEL"]
probe_ids = [3, 10, 14, 18, 2, 4, 9, 13]
pairs = json.loads(open(fixture_path, encoding="utf-8").read())

def norm(path: str) -> str:
    for prefix in [".opencode/", ".claude/", ".codex/", ".gemini/"]:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    return re.sub(r":\d+(-\d+)?$", "", path)

for probe_id in probe_ids:
    row = pairs[probe_id - 1]
    query = row["query"]
    expected = row.get("expected_source_path") or row.get("expected_path") or ""
    t0 = time.monotonic()
    result = subprocess.run(
        [ccc_bin, "search", query, "--limit", "5"],
        capture_output=True,
        text=True,
        timeout=45,
        check=False,
    )
    latency_ms = int((time.monotonic() - t0) * 1000)
    top_paths = []
    for line in result.stdout.splitlines():
        for part in line.strip().split():
            if "/" in part and "." in part.split("/")[-1]:
                candidate = re.sub(r":\d+(-\d+)?$", "", part).rstrip(",;:()")
                if candidate and candidate not in top_paths:
                    top_paths.append(candidate)
    normalized = [norm(p) for p in top_paths[:5]]
    hit = norm(expected) in normalized if expected else False
    output = {
        "reranker": model_id,
        "probe": probe_id,
        "difficulty": row.get("difficulty", "medium"),
        "query": query,
        "expected": expected,
        "top1": top_paths[0] if top_paths else "",
        "top5": top_paths[:5],
        "hit": hit,
        "latency_ms": latency_ms,
        "returncode": result.returncode,
    }
    with open(jsonl_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(output) + "\n")
    print(json.dumps(output))
PYTHON
```
<!-- /ANCHOR:measure-commands -->

<!-- ANCHOR:phase-2-plan -->
## 8. PHASE 2 PLAN

Probe selection:

| Set | Probes | Reason |
|---|---|---|
| Failure probes | 3, 10, 14, 18 | Current reranker demotes the expected implementation/test/artifact below lexical-dense tests, refs, or neighboring source files. |
| Control probes | 2, 4, 9, 13 | Universal-floor controls from the May 18 bake-off, spanning easy/medium/hard and handler/script/registry/budget code. These should stay hits if the reranker swap is safe. |

ETA:

- If both reranker models are already cached: about 10-20 minutes total.
- If downloads and cold loads are needed on Apple Silicon: about 20-45 minutes total.
- No index rebuild should be required because the first-stage jina-code vector index is reused.

Decision rubric:

| Outcome | Decision |
|---|---|
| Candidate fixes at least 2 of probes 3, 10, 14, 18 with 0/4 control regressions and acceptable latency | Recommend SWAP candidate for a follow-on config/doc packet. |
| Candidate fixes 1 failure probe or has tight score margins without regressions | HOLD default; keep candidate as optional or rerun with 18-probe full bench. |
| Candidate fixes failures but regresses any control probe | HOLD default; inspect per-probe rerank-score JSONL before considering path-class mitigation. |
| Both MEASURE candidates fail the same pattern | Conclude off-the-shelf general rerankers do not solve this; open a path-class boost or code-reranker adapter packet. |
| `hq-bench/coreb-code-reranker` remains attractive after local candidates fail | Open adapter packet for Qwen/CoREB causal-LM scoring; do not force it through current `CrossEncoder` config. |
<!-- /ANCHOR:phase-2-plan -->

<!-- ANCHOR:recommendation -->
## 9. PHASE 1 RECOMMENDATION

Measure `mixedbread-ai/mxbai-rerank-base-v2` first, then `Qwen/Qwen3-Reranker-0.6B`. Do not spend Phase 2 time on older BGE, Mixedbread v1, CodeSage, Qodo-Embed, or `jamie8johnson/code-reranker-v1`.

If both local drop-ins fail, the evidence points away from "pick a better general reranker" and toward either a path-class reweighting layer or a dedicated code-reranker adapter for `hq-bench/coreb-code-reranker`.
<!-- /ANCHOR:recommendation -->
