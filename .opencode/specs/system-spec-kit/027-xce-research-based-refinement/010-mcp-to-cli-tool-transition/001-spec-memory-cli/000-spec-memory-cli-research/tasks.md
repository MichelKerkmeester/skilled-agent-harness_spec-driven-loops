---
title: "Tasks: Memory MCP to CLI Feasibility [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/tasks]"
description: "Task breakdown for the 3-lane fan-out feasibility research: bootstrap, launch, monitor, reconcile."
trigger_phrases:
  - "mcp cli feasibility tasks"
  - "028 tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research"
    last_updated_at: "2026-06-06T12:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "T009 run-4 total risk closure complete; all tasks done"
    next_safe_action: "Plan the CLI implementation packet via speckit:plan"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Memory MCP to CLI Feasibility

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Bootstrap packet: four core docs authored from v2.2 templates (spec.md, plan.md, tasks.md, implementation-summary.md)
- [x] T002 Generate description.json + graph-metadata.json, then pass pre-run `validate.sh --strict` (PASSED 2026-06-06, 0 errors 0 warnings)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Launch `/deep:start-research-loop:auto` fan-out: lanes deepseek (deepseek/deepseek-v4-pro), minimax (minimax-coding-plan/MiniMax-M3, 1500s iteration ceiling), mimo (xiaomi-token-plan-ams/mimo-v2.5-pro); 5 iterations per lane (terminal cap), reasoning effort high, concurrency 2 (research/) — launched 2026-06-06T08:52Z
- [x] T004 Monitor lanes to completion — 3/3 succeeded, 0 failed, 15/15 iterations, no salvage events (orchestration-summary.json); lane durations 9.6 / 40.7 / 6.6 min
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Verify merged outputs: merged registry (18 findings) + fanout-attribution.md present; root research.md verdict-shaped (consolidated parity matrix, loss table, GO verdict with adjudication); per-lane counts 5/5/5, zero early stops; MiMo lane flagged deepseek-informed (read sibling lineage; recorded in research.md §10)
- [x] T006 Reconcile: tasks ticked, metadata regenerated, final `validate.sh --strict` PASSED, continuity saved via generate-context.js (MCP down; CLI save path used)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: CLI Back-End Design (run 2, operator-directed)

- [x] T007 Run-2 deep research: cli-codex lane (gpt-5.5, reasoning xhigh, service tier fast), 3 forced iterations on the dual-stack CLI design — 1/1 succeeded, 3/3 KQs answered, design synthesized into research/research.md §12 and research/cli-backend/lineages/gpt/research.md
- [x] T008 Run-3 risk-resolution research: deepseek-v4-pro + mimo-v2.5-pro lanes @ high, convergence 0.05, cap 20 each — lanes stopped at 3/20 and 5/20 with all questions terminally classified (7 RESOLVED, 4 MITIGATED, 0 unresolved, 2 deferred out-of-scope); escalation gate not triggered; Risk Resolution Matrix in research/research.md §13; verdict: cleared for implementation
- [x] T009 Run-4 total-risk-closure research: cli-codex lane (gpt-5.5, reasoning xhigh, service tier fast), convergence 0.05, cap 20 — converged at 4/20 (9.4 min, registry 8/8 terminal, score 0.97); both run-3 deferrals terminally classified (OpenCode gate ACCEPTED on installed 1.16.2 evidence; migration MEASURED 93 files/1,041 refs); deltas D1–D7+DD-001 re-derived bottom-up (2.0–2.5d, 10–13d total confirmed); corrections: warm hook overhead ~40–46ms p95, socket path 134B pre-pin; final posture 2 RESOLVED / 4 MITIGATED-terminal / 2 ACCEPTED / 0 unknown (research/research.md §14)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001..REQ-003 in spec.md verified with evidence (3/3 lanes merged; research.md verdict-shaped; every feature classed ported/adapted/lost per architecture with the (a)-losses enumerated)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research outputs**: `research/` (workflow-owned)
<!-- /ANCHOR:cross-refs -->
