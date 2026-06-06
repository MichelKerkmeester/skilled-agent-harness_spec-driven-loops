---
title: "Local-LLM query intelligence"
description: "Category covering the local-LLM memory substrate as a shared backbone for AI assistants, including query intelligence, causal-graph quality, drift detection, cross-AI memory handoff, and concurrent multi-AI safety on the BGE local fallback plus hf-local ONNX cascade."
trigger_phrases:
  - "local-LLM query intelligence"
  - "BGE local embedder"
  - "cross-AI memory handoff"
  - "hf-local ONNX cascade drift detection"
  - "how do I use a local model for memory search"
---

# Local-LLM query intelligence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Category covering the local-LLM memory substrate as a shared backbone for AI assistants, including query intelligence, causal-graph quality, drift detection, cross-AI memory handoff, and concurrent multi-AI safety on the BGE local fallback plus hf-local ONNX cascade.

This category documents the post-014 local-LLM stack as a shared memory substrate for AI consumers rather than a single-CLI tool. The vitest mechanical checks under `mcp_server/tests/local-llm-features/` verify shape, determinism, and cascade resolution; this category captures the behavioral surface that those mechanical checks cannot prove, including paraphrase recall, polysemy disambiguation, causal-edge quality on bulk save, drift ranking on contradicting memories, and AI-to-CLI handoffs that cross provider boundaries.

---

## 2. HOW IT WORKS

The shipped surface now includes the BGE local fallback embedder (300M Q8 via ollama on Apple Silicon Metal), the hf-local ONNX fallback for hosts without ollama, profile-keyed memory databases under `mcp_server/database/context-index__*.sqlite`, a causal-graph builder backed by embedding similarity, a `memory_drift_why` handler that ranks contradicting memories, and a cross-AI MCP wiring layer that points cli-codex, cli-gemini, cli-claude-code, and opencode at the same Memory MCP database.

The playbook peer at `manual_testing_playbook/24--local-llm-query-intelligence/` covers fifteen operator scenarios across two bands. Band A (361-370) probes query intelligence, including paraphrase recall, synonymy across vocabularies, code-intent matching, polysemy disambiguation, multi-aspect synthesis, the specificity ladder, adversarial near-miss separation, compound-concept synthesis, LLM-made memory recall, and latency and throughput under load. Band B (371-375) probes the causal graph and substrate behavior, including link quality on a three-step chain, coverage under bulk save with intra-cluster cohesion and inter-cluster separation, drift detection ranking, cross-AI memory handoff, and concurrent multi-AI safety with interleaved reads and writes.

Every scenario uses the AI-to-CLI handoff prompt shape that mirrors production usage: one orchestrating AI dispatches an external CLI through `codex exec`, `gemini`, or `claude -p`, and the external CLI opens its own MCP session against the same Memory MCP database. The substrate is never exercised by a human typing directly; it is always exercised by AI assistants invoking each other.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/embeddings/factory.ts` | Lib | Cascade resolution that selects ollama, hf-local, or remote embedder |
| `shared/embeddings/profile.ts` | Lib | Profile-keyed provider resolution for the active memory database |
| `shared/embeddings/README.md` | Doc | Embedding architecture overview for the local-LLM stack |
| `shared/embeddings/causal-graph-db.ts` | Lib | Causal-graph storage and edge math backed by embedding similarity |
| `mcp_server/handlers/causal-graph.ts` | Handler | Causal-graph MCP handlers (memory_drift_why, memory_causal_link, memory_causal_stats) |
| `mcp_server/handlers/causal-links-processor.ts` | Handler | Batch causal-link inference processor |
| `manual_testing_playbook/24--local-llm-query-intelligence/README.md` | Playbook | Why-this-category brief, prompt convention, pre-flight, scenario inventory, grading rubric |
| `manual_testing_playbook/24--local-llm-query-intelligence/36[1-9].md`, `37[0-5].md` | Playbook | Per-scenario Markdown specs for query intelligence (361-370) and substrate (371-375) |
| `manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json` | Fixture | Deterministic fixture rows for the LLM-made memory recall scenario |
| `.codex/config.toml`, `.claude/mcp.json`, `opencode.json`, `.mcp.json`, `.vscode/mcp.json` | Wiring | Cross-AI MCP client configs that point at the same Memory MCP database |

### Validation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/tests/local-llm-features/*.vitest.ts` | Mechanical | Vector shape, determinism, L2 normalization, cascade, profile-keyed DB filenames, auto-migration, native module loading |
| `mcp_server/tests/local-llm-features/ollama-quality.vitest.ts` | Mechanical | Determinism, L2 norm, and similarity ordering quality checks |
| `manual_testing_playbook/_sandbox/24--local-llm-query-intelligence/evidence/summary.md` | Playbook | Packet-level aggregate summary for the fifteen scenarios |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |

---

## 4. SOURCE METADATA
- Group: Local-LLM query intelligence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `24--local-llm-query-intelligence/category-overview.md`
