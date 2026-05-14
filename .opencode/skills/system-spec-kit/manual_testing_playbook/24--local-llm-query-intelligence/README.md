---
title: "24 — Local-LLM query intelligence"
description: "Operator-driven scenarios that evaluate the real query intelligence delivered by the post-014 local-LLM stack: EmbeddingGemma 300m (q8) via llama-cpp on Apple Silicon Metal, with hf-local ONNX as the fallback. Each scenario fires a realistic user query through the Memory MCP / CocoIndex semantic search path and grades the response against expected signals."
audited_post_018: true
---

# 24 — Local-LLM query intelligence

## Why this category

The vitest-style tests under `mcp_server/tests/local-llm-features/` verify the **mechanical** properties of the local-LLM stack: vector shape, determinism, L2 normalization, cascade resolution, profile-keyed DB filenames, auto-migration, native module loading. Those are necessary but not sufficient — they cannot tell you whether the system **actually retrieves the right thing** when a real operator types a real question.

This playbook fills that gap. Each scenario is a small, realistic query session that exercises one dimension of query intelligence end-to-end:

- **Recall under paraphrase** — does a memory survive when the operator queries it with different words?
- **Code-intent matching** — does "how does X work" find X's implementation, not just the docs?
- **Disambiguation** — when a token has multiple senses, does context choose the right one?
- **Multi-aspect synthesis** — does a compound query pull from multiple sources correctly?
- **Adversarial near-miss** — does lexical overlap alone fool the ranker?
- **LLM-made output recall** — when the local LLM has stored something, is it retrievable later?

Run each scenario manually. Capture the top-K returned by the search. Compare against the expected signals. Mark PASS / FAIL / SKIP and attach the verbatim transcript.

## Pre-flight (run once before the suite)

```bash
# Confirm the active provider is the canonical llama-cpp path:
test -f ~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf \
  && echo "llama-cpp ready" || echo "llama-cpp missing — scenarios will exercise hf-local fallback instead"

# Confirm the Memory MCP database exists and is the active profile:
ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite | head -3

# Confirm CocoIndex has indexed the repo:
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status 2>&1 | head -5
```

If llama-cpp is missing, the scenarios still run — they just exercise hf-local instead. Note which provider was active in each scenario's evidence section.

## Scenario inventory

| # | Title | Probes | Pass signal |
|---|-------|--------|-------------|
| 401 | Paraphrase recall | Same concept, different wording → same memory surfaces | Top-3 includes the paraphrased target |
| 402 | Synonymy across vocabularies | Domain jargon vs plain language | Both queries hit the same canonical docs |
| 403 | Code-intent matching | Question-form query finds implementation | Implementation file ranks higher than its README |
| 404 | Disambiguation under context | Polysemous query token | Active context biases the ranking correctly |
| 405 | Multi-aspect query synthesis | 3-concept compound query | Top-K spans all 3 concepts |
| 406 | Specificity ladder | Same topic at 3 abstraction levels | Each level returns the most-specific match |
| 407 | Adversarial near-miss | Lexical overlap, semantic distance | The semantically-correct result outranks the lexical decoy |
| 408 | Compound concept synthesis | Concept not directly stated in any single doc | Top-3 results compose the answer |
| 409 | LLM-made memory recall | Quality of memories the local LLM has indexed | Self-stored memories surface for their own triggers |
| 410 | Query latency + throughput under load | Real-world query load on local stack | p50 ≤ 200ms, p95 ≤ 800ms over 50 mixed queries |

## How to read a scenario file

Each file follows the same shape as `23--doctor-commands/*.md`:

1. **OVERVIEW** — one-paragraph scope statement
2. **SCENARIO CONTRACT** — objective, real user request, RCAF prompt, expected signals, pass/fail criteria
3. **TEST EXECUTION** — prompt + exact command sequence
4. **EXPECTED** — what the operator should observe in the response
5. **EVIDENCE** — what to capture (transcript, top-K dump, latency, etc.)

The commands assume the runtime is the canonical Memory MCP + CocoIndex setup (post-014). MCP tool names use the `mcp__spec_kit_memory__*` / `mcp__cocoindex_code__search` namespaces as exposed in the runtime.

## Grading rubric

- **PASS** — Top-K matches expected signals, observed within latency bounds, no errors in the transcript.
- **PARTIAL** — Top-K contains the expected target but ranked below another reasonable result (still actionable; note specifics).
- **FAIL** — Top-K does NOT contain the expected target, OR the ranking inverts semantic distance (clearly wrong result outranks correct one).
- **SKIP** — Pre-flight missing (no llama-cpp + hf-local both unavailable, no indexed corpus, etc.). Document the blocker.

Aggregate the 10 scenarios into a single packet-level verdict in `_sandbox/24--local-llm-query-intelligence/evidence/`.

## Related references

- Vitest mechanical checks: `mcp_server/tests/local-llm-features/*.vitest.ts` (10 files, 53 tests)
- Quality property checks: `mcp_server/tests/local-llm-features/llama-cpp-quality.vitest.ts` (determinism, L2 norm, similarity ordering)
- Embedding architecture: `shared/embeddings/README.md`, `references/memory/embedding_resilience.md`
- Cascade behavior: `shared/embeddings/factory.ts:resolveProvider`, `shared/embeddings/profile.ts:resolveActiveProfileProvider`
