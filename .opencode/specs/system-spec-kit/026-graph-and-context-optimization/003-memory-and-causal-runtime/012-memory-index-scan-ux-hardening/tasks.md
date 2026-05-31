---
title: "Tasks: memory_index_scan UX hardening (deep-research design packet) [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/tasks]"
description: "Task surface for a DESIGN-research packet. The research tasks are complete; implementation tasks belong to a follow-on /speckit:plan."
trigger_phrases:
  - "memory index scan ux hardening tasks"
  - "012 deep research tasks"
importance_tier: "normal"
contextType: "research"
---

# Tasks: memory_index_scan UX Hardening (Deep-Research Design Packet)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:tasks -->
## Task List

- [x] T001 — Define 5 research angles (caller contract, timeout hardening, concurrency, embedder resilience, self-healing)
- [x] T002 — Iteration 1: A1 scan lifecycle & caller contract (cli-codex gpt-5.5 xhigh, ratio 0.92)
- [x] T003 — Iteration 2: A2 unbounded-work / timeout hardening (cli-opencode gpt-5.5 high, ratio 0.86)
- [x] T004 — Iteration 3: A3 concurrency & multi-writer (cli-opencode gpt-5.5 high, ratio 0.78)
- [x] T005 — Iteration 4: A4 embedder resilience & degraded-mode (cli-opencode gpt-5.5 high, ratio 0.74)
- [x] T006 — Iteration 5: A5 self-healing & observability + synthesis seed (cli-opencode gpt-5.5 high, ratio 0.62)
- [x] T007 — Synthesize research/research.md (17 sections) + emit research/resource-map.md
- [x] T008 — Reconcile synthesis against real iteration-5 evidence; mark config.status=complete
- [ ] T009 — (follow-on /speckit:plan) Implement minimal first slice: caller-contract coalescing + memory_health.index + bounded orphan sweep
<!-- /ANCHOR:tasks -->

---

## RELATED DOCUMENTS
- **Canonical synthesis**: `research/research.md`
- **Outcome**: `implementation-summary.md`
