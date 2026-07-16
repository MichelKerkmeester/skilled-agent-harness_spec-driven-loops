---
title: "Deep-review strategy: 007 rename packet"
description: "Auto-generated strategy for 109-iter cap deep-review of the sk-small-model → sk-prompt-small-model rename packet."
---

# Deep-Review Strategy — 007 rename packet

**Target**: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/007-sk-prompt-small-model-rename/`
**Executor**: cli-devin SWE-1.6 (`-p --prompt-file ... --model swe-1.6 --permission-mode auto </dev/null`)
**Max iters**: 109 (with convergence detection — expected to stop ~5-10 iters)
**Convergence threshold**: 0.15 newFindingsRatio over 3 consecutive iters
**Mode**: AUTONOMOUS (no per-iter approval gates)

## Known context (memory + repo)
- 007 just shipped 2026-05-21 — 22 live-surface rename pass + advisor reindex
- Validate exit 0; advisor confidence 0.95 on canonical small-model prompt
- 2 incidental compiler-blocker fixes outside the rename scope: `system-rerank-sidecar` category + `mcp-coco-index` reverse-sibling
- Memory `feedback_skill_graph_compiler_rebuild.md` uses tagged-historical-narrative pattern (not full rewrite)
- 114/spec.md PHASE DOCUMENTATION MAP: only one new row appended; phases 001-006 preserved

## Per-iter focus rotation (4 dimensions × ~iterations)
- **Iter 1**: correctness — historical-vs-live classification correctness + literal-match regression risks
- **Iter 2**: traceability — handoff metadata, frontmatter `next_safe_action`, parent.last_active_child_id, anchors
- **Iter 3**: security — advisor cache freshness, compiler symmetry, no broken edges, no privilege escalation
- **Iter 4**: maintainability — historical-preservation invariant durability, decision-record quality, scope-creep justification
- **Iter 5+**: rotate dimensions; deepen on weak spots from prior iters
- **Iter 10+**: adversarial / cross-cutting (test "are there OTHER surfaces we missed" hypotheses)

## Adversarial self-check focus
- Did 007 miss any surface in `.gemini/`, `.codex/`, runtime-mirror dirs?
- Did the `feedback_skill_graph_compiler_rebuild.md` tag get inserted on EVERY occurrence or just first-per-line?
- Are the `mcp-coco-index/mcp_server/benchmarks/per-probe.jsonl` mentions of `sk-small-model` (12 hits) live or historical? — flagged as P2 ambiguity in 007's spec.md §3.

## Stop conditions
- P0 finding → block convergence regardless of threshold
- 3 consecutive iters with newFindingsRatio < 0.15 → converged
- 109 iters reached → max_iterations stop
