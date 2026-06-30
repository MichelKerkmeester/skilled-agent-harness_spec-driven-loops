---
title: "24 — Local-LLM memory substrate (query intelligence + causal graph + cross-AI handoff)"
description: "Operator-driven scenarios that evaluate the real-world behavior of the local-first LLM stack (Ollama nomic-embed-text-v1.5 by default, with hf-local nomic-ai/nomic-embed-text-v1.5 fallback via the Hugging Face hub cache) as a SHARED memory substrate for AI assistants. Goes beyond mechanical embedding shape checks: tests query intelligence, causal-graph quality, drift detection, cross-AI memory handoff, and concurrent multi-AI safety."
audited_post_018: true
version: 3.6.0.10
---

# 24 — Local-LLM memory substrate

## Why this category

The vitest-style tests in `mcp_server/tests/local-llm-features/` verify the **mechanical** properties of the local-LLM stack: vector shape, determinism, L2 normalization, cascade resolution, profile-keyed DB filenames, auto-migration, native module loading. Those are necessary but not sufficient — they cannot tell you whether the system **actually behaves correctly** for the AI assistants that depend on it.

This playbook fills that gap. The local LLM stack (Ollama `nomic-embed-text-v1.5` by default, then hf-local `nomic-ai/nomic-embed-text-v1.5` through the Hugging Face hub cache) is the embedding backbone that powers:

- **Query intelligence** — does a paraphrased query find the right memory?
- **Causal graph quality** — does the embedding give the edge builder enough signal to connect related memories without false-linking unrelated ones?
- **Drift detection** — does `memory_drift_why` correctly identify contradictory memories about the same concept?
- **Cross-AI handoff** — when Claude stores something, can OpenCode find it later in a separate CLI session?
- **Concurrent safety** — when two AIs interleave save + search against the same DB, does the substrate stay coherent?

Each scenario fires a realistic AI-to-CLI handoff prompt that mimics the actual production pattern: one AI (the orchestrator) dispatching another AI (an external CLI like cli-opencode / cli-claude-code) to exercise the Memory MCP through its own MCP client. The memory surface is dual-stack: `spec-memory.cjs` is the full-parity CLI front door for hooks, cron, CI, operator shell diagnostics, and transport-down recovery in addition to MCP sessions.

## Prompt convention: AI-to-CLI handoff

Every scenario uses this prompt shape (mirrors production):

```
You are <external-CLI-name>. I am <orchestrating-AI> running <scenario-title>.
The local LLM stack (Ollama `nomic-embed-text-v1.5` by default, then hf-local `nomic-ai/nomic-embed-text-v1.5`) is the embedding backbone.

I need you to:
1. <concrete action through MCP tool>
2. <concrete action>
3. Return JSON with: <required fields>
```

The orchestrating AI invokes the external CLI through `opencode run` or `claude -p ...`. The external CLI opens its own MCP session against the same Memory MCP DB. The cross-AI nature is the point — every scenario tests behavior that depends on the substrate working consistently across AI consumers.

## Pre-flight (run once before the suite)

```bash
# Confirm the active provider is the canonical local-first path:
ollama list | grep -q 'nomic-embed-text' \
  && echo "ollama nomic ready" || echo "ollama missing — scenarios will exercise hf-local fallback instead"

# Confirm the Memory MCP database exists and is the active profile:
ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite | head -3

# Confirm Code Graph has indexed the repo (structural tree-sitter index):
# call the code_graph_status MCP tool (run code_graph_scan first if the graph is empty)

# Confirm at least 2 external CLIs are installed for cross-AI scenarios:
which opencode && opencode --version
which claude && claude --version
```

If only one external CLI is available, the cross-AI scenarios (374, 375) can still run using a single CLI in two separate invocations — note that the test is then weaker (same provider on both sides).

## Scenario inventory

### A. Query intelligence (361-370)

| # | Title | Probes | Pass signal |
|---|-------|--------|-------------|
| 361 | Paraphrase recall | Same concept, different wording → same memory surfaces | Top-3 includes the paraphrased target, score > 0.5 |
| 362 | Synonymy across vocabularies | Domain jargon vs plain language | >= 2/4 query pairs at >= 25% top-5 Jaccard + live canonical targets present |
| 363 | Code-intent matching | Question-form query finds implementation | Implementation file ranks higher than its README in ≥ 3/4 |
| 364 | Disambiguation under context | Polysemous query token | All 3 variants correctly disambiguate to intended sense |
| 365 | Multi-aspect query synthesis | 3-concept compound query | Top-5 covers all 3 concepts with ≥ 2 multi-aspect results |
| 366 | Specificity ladder | Same topic at 3 abstraction levels | Each level returns the most-specific match |
| 367 | Adversarial near-miss | Lexical overlap, semantic distance | Semantically-correct result outranks lexical decoy in ≥ 2/3 |
| 368 | Compound concept synthesis | Concept not directly stated in any single doc | ≥ 2/4 constituents in top-3, ≥ 3/4 in top-5 |
| 369 | LLM-made memory recall | Quality of memories the local LLM has indexed | >= 8/10 deterministic fixture rows in top-3, mean rank <= 2 |
| 370 | Query latency + throughput under load | Real-world query load on local stack | p50 ≤ 200ms, p95 ≤ 800ms, p99 ≤ 2s, ≥ 5 qps |

### B. Causal graph + memory substrate (371-375)

| # | Title | Probes | Pass signal |
|---|-------|--------|-------------|
| 371 | Causal graph link quality | Does the local LLM connect a 3-step causal chain? | ≥ 2 of 2 chain edges with confidence ≥ 0.5 |
| 372 | Causal coverage under bulk save | Intra-cluster cohesion + inter-cluster separation across 4 topics | intra/inter edge ratio ≥ 2×, diagonal is row-leader in 4/4 topics |
| 373 | Drift detection quality | `memory_drift_why` ranks contradicting memories correctly | ≥ 3/5 variants surfaced; strongest contradiction in top-2 |
| 374 | Cross-AI memory handoff | AI-A stores → AI-B finds | External CLI returns stored memory in top-3, score ≥ 0.6 |
| 375 | Concurrent multi-AI safety | 50 reads interleaved with 10 writes from a different CLI | All reads internally consistent, 0 errors, 0 duplicates |

## How to read a scenario file

Each file follows the same shape:

1. **OVERVIEW** — one-paragraph scope statement
2. **SCENARIO CONTRACT** — objective, real user request, AI-to-CLI handoff prompt, expected signals, pass/fail criteria
3. **TEST EXECUTION** — phase-by-phase commands; for cross-AI scenarios, separate phases for orchestrator and external CLIs
4. **EXPECTED** — what the operator should observe (JSON schema for AI-to-CLI returns, top-K dumps, confusion matrices, rank tables)
5. **EVIDENCE** — what to capture (verbatim AI responses, per-CLI summary tables, judgment notes)
6. **CLEAN-UP** — sandbox memory deletion (where applicable)

## Grading rubric

- **PASS** — Top-K matches expected signals, observed within latency bounds, all AI-to-CLI handoffs returned coherent JSON, no errors in any transcript.
- **FAIL** — Expected target absent from top-K, OR cross-AI handoff produced corrupt JSON / errors, OR concurrent reads returned inconsistent data.
- **SKIP** — Pre-flight missing (no ollama + hf-local both unavailable, no indexed corpus, no external CLI for cross-AI scenarios). Document the blocker.
- **UNAUTOMATABLE** — Scenario cannot be run deterministically by the harness; document the manual blocker and evidence needed.

Aggregate the 15 scenarios into a single packet-level summary in `_sandbox/24--local-llm-query-intelligence/evidence/summary.md`.

## Related references

- Vitest mechanical checks: `mcp_server/tests/local-llm-features/*.vitest.ts` (10 files, 53 tests)
- Quality property checks: `mcp_server/tests/local-llm-features/ollama-quality.vitest.ts` (determinism, L2 norm, similarity ordering, 10 tests)
- Embedding architecture: `shared/embeddings/README.md`, `references/memory/embedding_resilience.md`
- Cascade behavior: `shared/embeddings/factory.ts:resolveProvider`, `shared/embeddings/profile.ts:resolveActiveProfileProvider`
- Causal graph: `shared/embeddings/causal-graph-db.ts`, `mcp_server/handlers/causal-graph.ts`
- Drift detection: `mcp_server/handlers/causal-graph.ts` (memory_drift_why handler)
- Cross-AI MCP wiring: `opencode.json`, `.claude/mcp.json`, `opencode.json`, `.mcp.json`, `.vscode/mcp.json` (all point at the same Memory MCP DB)
