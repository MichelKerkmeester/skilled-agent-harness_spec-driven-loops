---
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-research-driven-remediation"
    last_updated_at: "2026-06-06T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed 4 research-driven code fixes; builds + targeted tests green"
    next_safe_action: "Recycle mk-spec-memory + reconnect code-graph to activate dists"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Research-Driven Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-06 |

---

## 2. OVERVIEW

Land the concrete, fixable code defects surfaced by the 028 three-model deep research (`028-026-program-research/research/research.md`). Scope is the four verified code findings, not the measurement-backlog experiments.

In scope (FROZEN):
1. Causal link/unlink miss the post-mutation graph-cache invalidation hook (`handlers/causal-graph.ts`).
2. `live-executor.cjs` strips `--variant` for minimax models on a stale "rejects variants" assumption (`deep-improvement/scripts/skill-benchmark/live-executor.cjs:83`) — fix only if a live test confirms minimax-M3 accepts the flag.
3. Launcher test fixtures copy the launcher `.cjs` without its `lib/` tree (same latent defect already fixed in `launcher-lease.vitest.ts`).
4. Code-graph blast-radius BFS truncates at `maxDepth` with no completeness signal (`system-code-graph/.../handlers/query.ts`) — add a `depthTruncated` flag mirroring `overflowed`.

Out of scope: the measurement experiments (q8/fp16 bench, cloud-vs-local A/B, RSS calibration, fan-out diversity, routing calibration) — those are runs, not fixes.

## 3. VERIFICATION

Each fix builds its dist where applicable and runs its targeted suite. No completion claim without a green targeted run.
