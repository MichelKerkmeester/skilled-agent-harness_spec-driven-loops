---
title: "Implementation Summary: cli-pi Fan-out Execution"
description: "Planned — make the deep-loop fan-out runner drive a non-streaming cli-pi lineage to completion instead of orphan-requeuing it. Not yet implemented."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-16T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scoped the packet from the live cli-pi stall finding"
    next_safe_action: "Operator approves approach, then run the REQ-001 diagnosis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Tune orphan/stall detection for cli-pi, dispatch pi in --mode json, or both?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-cli-pi-fanout-execution |
| **Completed** | — (Planned) |
| **Level** | 2 |
| **Actual Effort** | — (estimated: ~5-8 hours) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: Planned — not yet implemented.** This packet is scoped and planned; no code has been changed.

It follows directly from a live finding: DeepSeek via cli-pi cannot complete a deep-loop fan-out lineage because the runner's orphan/stall detection — tuned for streaming executors — repeatedly requeues Pi's non-streaming print-mode worker (`started → orphan_requeued` loop, empty output, zero iterations, `stall_detected`). The route itself works (preflight `PI_ROUTE_OK`). The fix makes the runner judge a working-but-silent cli-pi worker as live, so a DeepSeek-via-cli-pi research or review loop runs to completion — which also finally lets the 010 write boundary be exercised via cli-pi.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The plan is diagnose-first (characterize the exact requeue trigger with real timestamps), decide the mechanism (per-executor liveness allowance, `--mode json` streaming dispatch, or both) in a decision record, then apply a bounded fix and prove it with a live cli-pi DeepSeek lineage — without regressing the streaming executors that already work.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Diagnose before fixing.** The requeue could be a fast empty-exit of the Pi worker or a premature orphan/stall verdict on a live worker; the fix differs, so the timing is captured first.
- **Executor-aware, not detection-off.** The allowance must be bounded by the executor's own timeout so genuine hangs are still caught — no blanket disable of orphan/stall detection.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

Not yet run. The authoritative gate is `validate.sh <spec-folder> --strict` plus a live cli-pi DeepSeek review lineage completing `fulfilled` with iterations and zero write-boundary reverts, and a streaming-executor non-regression run. Acceptance criteria are in `spec.md` §5 and `checklist.md`.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- Scope is the two fan-out loop-types (research, review). The six single-driver modes (ai-council, deep-improvement, the three benchmarks, deep-alignment) are not fan-out lineages and are out of scope here.
- The fix targets the orchestration liveness gap; if Pi print mode also cannot complete a full multi-phase loop in one dispatch for a weak model, a follow-on may be needed — the diagnosis in Phase 1 confirms which.

<!-- /ANCHOR:limitations -->
