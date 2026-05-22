---
title: "Memory Leak Follow-Ons Arc — Phase Parent"
description: "Phase parent for deferred follow-on work from the memory-leak remediation arc 009: test-suite triage, adapter resident-memory benchmark, and owner-lease heartbeat-staleness detection."
trigger_phrases:
  - "memory leak follow-ons arc"
  - "010 memory leak follow-ons"
  - "post-009 follow-ons"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc"
    last_updated_at: "2026-05-22T16:03:59Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-010-phase-002-adapter-rss-benchmark"
    next_safe_action: "arc-010-closed-or-operator-rss-followup"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0100100100100100100100100100100100100100100100100100100100100100"
      session_id: "010-memory-leak-follow-ons-arc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three deferred items scoped from arc 009's documented out-of-scope baselines and phase 007 owner-lease gap discovered during arc closure."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Memory Leak Follow-Ons Arc

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Lean phase-parent control file. Control docs stay limited to
  {spec.md, description.json, graph-metadata.json}. Heavy working docs
  live in each phase child.
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

Coordinate three deferred follow-on items from the memory-leak remediation arc 009 that were documented as out-of-scope baselines during arc closure (commit `8b84612f12`):

1. Triage 31 pre-existing test failures in the broader `system-code-graph` vitest suite (runtime-detection, tree-sitter-parser, code-graph-query-handler, auto-rescan-policy, etc) that pre-date arc 009 and were authorized as a targeted-gate exclusion.
2. Benchmark adapter resident-memory growth on successful-search and sidecar 5xx fallback paths to confirm whether P2 (default) severity holds or escalation to P1 is warranted (phase 008 left this benchmark-gated).
3. Close the orphan-launcher gap discovered during arc 009 closure: phase 007's owner-lease accepts a stale-heartbeat-but-PID-alive owner as `live-owner`, which blocks MCP reconnect after a parent disconnect without graceful shutdown.

The operating rule remains verification first: no cleanup path may claim memory relief or kill a process unless ownership, resource identity, and before/after telemetry are explicit.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Priority | Status |
|---|---|---|---|
| `001-system-code-graph-suite-triage/` | Triage and Close 31 Pre-existing Vitest Failures | P1 | Completed |
| `002-adapter-resident-memory-benchmark/` | Successful-Search + Sidecar 5xx Fallback RSS Benchmark | P2 | Completed |
| `003-owner-lease-heartbeat-staleness-detection/` | Owner-Lease Heartbeat-Staleness Gap From Phase 007 | P1 | Completed |

### Phase Transition Rules

- Phases are independent; no strict ordering. Phase 003 has the highest operational impact (blocks MCP reconnect) and is recommended first.
- Each child phase validates independently before completion.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-system-code-graph-suite-triage` | (none) | Each of the 31 failing tests resolved with one of: fix, mark skip with reason, or document as known limitation with follow-on packet pointer. | Phase summary records the per-test triage outcome. |
| `002-adapter-resident-memory-benchmark` | (none) | RSS slope measurement on successful-search + sidecar 5xx fallback. P2 hold or P1 escalation decision recorded. | Phase summary records the benchmark methodology + numbers. |
| `003-owner-lease-heartbeat-staleness-detection` | (none) | Owner-lease classifier rejects live-PID owners whose heartbeat is older than `ttlMs * 2`; new tests cover stale-heartbeat reclaim. | Phase summary records the integration site + tests. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

1. Restore the broader `system-code-graph` vitest suite to green by triaging each of the 31 pre-existing failures.
2. Measure RSS slopes on the rerank pipeline's successful-search + sidecar 5xx fallback paths and decide whether to escalate adapter resident-memory work from P2 to P1.
3. Close the owner-lease heartbeat-staleness gap so phase 007's launcher refuses to inherit orphan owners whose heartbeats are older than `ttlMs * 2`.

Source evidence for items 1 + 2 lives in `../009-memory-leak-remediation-arc/`:
- Item 1: phase 007's `implementation-summary.md` documents the 31 failing test files as an out-of-scope baseline.
- Item 2: phase 008's `implementation-summary.md` documents the P2-default + benchmark-gated severity decision.
- Item 3: discovered during arc 009 closure when mk_code_index MCP reconnect failed with `-32000` despite a live launcher process — the lease's `lastHeartbeatIso` was 22 minutes stale against a 60-second TTL, but phase 007's `classifyOwner` returned `live-owner` because `processAlive` was still true.
<!-- /ANCHOR:what-needs-done -->
