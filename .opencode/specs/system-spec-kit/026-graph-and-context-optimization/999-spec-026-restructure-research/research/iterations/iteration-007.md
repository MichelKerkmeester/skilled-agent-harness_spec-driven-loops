I've completed the deep-read of `014-local-llama-cpp/` nested children. Here are the findings:

## Nested children catalog

**58 NNN-name directories + 2 placeholders without description.json:**

- **001-014**: Local embeddings setup phases (prefix registry, model installation, MCP rollout, vec-store rebuild, Q4 quantization, BGE-M3 evaluation, Voyage cleanup, CocoIndex IPC fix, code-only patterns, EmbeddingGemma unification, v3/v4 remediation, ONNX cross-platform backend)
- **015-018**: Llama-cpp migration arc (evaluation, retrieval quality probe, default flip, auto-migration)
- **019-020**: Documentation inventory and alignment (README resource map, catalog/playbook audit)
- **021-031**: Deep-review remediation loop (legacy review, 5-batch remediation, multiple confirmatory re-reviews)
- **032-040**: Substrate repair followups (phase parent + system-code-graph cleanup, query expansion, CocoIndex reliability, embedding worker fixes, error propagation, token-aware chunking, stuck row reset, V8 overreach)
- **041-049**: CocoIndex reliability, research, and validation (IPC observability, Metal investigation, refresh split, CoreML EP research, suite revalidation, template contract, shared daemon, handover naming, V8 relaxation, substrate stress, skills alignment, runtime config)
- **052-059**: MCP server rename, documentation pipeline, and deep-loop foundation (mk-spec-memory rename, code-folder READMEs, root README realignment, deep-research, deeper rewrite, SKILL.md realignment, cli-devin deep-loop alignment)

**Placeholders:**
- `045-session-deep-review-2026-05-14` (92K, only review/ subdir, no description.json)
- `048-deep-review-cocoindex-wiring` (96K, only review/ subdir, no description.json)

## Thematic grouping

**Group A: Local embeddings setup (001-014)** — 14 packets establishing local embeddings infrastructure from Voyage/Qwen3 to EmbeddingGemma-300m-ONNX.

**Group B: Llama-cpp migration arc (015-018)** — 4 packets evaluating and migrating to llama-cpp GGUF provider.

**Group C: Deep-review remediation loop (021-031)** — 9 packets in multi-batch review/remediation cycle cleaning up post-014 residue.

**Group D: Substrate repair followups (032-040)** — Phase parent + 8 individual fixes for system-code-graph, query expansion, embedding worker, error propagation, etc.

**Group E: CocoIndex IPC and reliability (scattered)** — 8 packets diagnosing IPC truncation, MCP reliability, observability, refresh behavior, CoreML EP, suite validation.

**Group F: Documentation and README realignment (019, 020, 054-057)** — 6 packets for README inventory, alignment, code-folder READMEs, root README deep-research/rewrite.

**Group G: SKILL realignment (050, 058)** — 2 packets for skills alignment sweep and SKILL.md realignment.

**Group H: Deep-loop foundation arc (056-059)** — 4 packets establishing cli-devin SWE 1.6 deep-loop methodology (root README deep-research, deeper rewrite, SKILL.md realignment, cli-devin deep-loop alignment).

**Group I: MCP server and configuration (051-053)** — 3 packets for mk-spec-memory rename, remediation, runtime config parity.

**Group J: Memory quality and V8 validation (040-v, 044, 046, 047)** — 4 packets for V8 overreach fix, template contract, handover naming, V8 relaxation.

**Group K: Research-only investigations (019, 026, 041-metal, 043-coreml)** — 4 packets for README inventory, model runtime inventory, Metal failure research, CoreML EP research.

## Identified arcs (multi-packet)

**Arc 1: Local embeddings migration foundation (001-014)** — Core arc establishing local embeddings infrastructure. This is the foundational work enabling llama-cpp migration.

**Arc 2: Llama-cpp migration (015-018)** — Tight sequence with clear success criteria (2488 rows, zero mismatches).

**Arc 3: Deep-review remediation cycle (021-031)** — Extended multi-batch loop systematically cleaning post-014 residue.

**Arc 4: Deep-loop foundation (056-059)** — Cohesive arc establishing cli-devin SWE 1.6 deep-loop patterns for reuse across codebase.

**Arc 5: Substrate repair wave (032 + children)** — Phase parent coordinating 5 approved follow-ups to 022's substrate-repair work.

**Arc 6: CocoIndex reliability and IPC (scattered)** — Thematically linked work diagnosing and fixing CocoIndex issues across multiple packets.

## Is 014 a grab-bag?

**No.** 014 has **3 main arcs** that define its purpose:

1. **Local embeddings migration** (001-014) — foundational infrastructure
2. **Llama-cpp migration** (015-018) — performance optimization flip
3. **Deep-loop foundation** (056-059) — methodology establishment

The remaining packets are **supporting cleanup waves** (deep-review remediation loop, substrate repair) and **infrastructure fixes** (CocoIndex reliability, MCP server rename, documentation alignment) that naturally accumulated during the main arcs.

## Gaps for next iter

- Iter 008: Per-packet classification (research vs implementation vs documentation vs infrastructure)
- Iter 009: Merge candidate proposals (e.g., deep-review remediation 021-031 could consolidate into 2-3 phase parents)
- Iter 010: Consolidated phase-list for 014 clarifying main vs supporting arcs
- Question: Should placeholder directories (045-session-deep-review-2026-05-14, 048-deep-review-cocoindex-wiring) be deleted or completed?
- Question: Should duplicate 026 numbering be resolved?
