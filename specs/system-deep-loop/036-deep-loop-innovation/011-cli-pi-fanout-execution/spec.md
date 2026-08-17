---
title: "Feature Specification: cli-pi Fan-out Execution (drive the loop, don't requeue it)"
description: "Make the deep-loop fan-out runner drive a cli-pi (Pi print-mode) DeepSeek lineage to completion instead of orphan-requeuing it to death, so DeepSeek-via-cli-pi runs the research and review loop modes."
trigger_phrases:
  - "cli-pi fanout execution"
  - "pi lineage orphan requeue"
  - "deepseek cli-pi stall"
  - "non-streaming executor fanout"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "claude"
    recent_action: "Scoped the cli-pi fan-out execution fix from the live stall finding"
    next_safe_action: "Operator approves approach, then diagnose the exact requeue trigger"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Tune orphan/stall detection for cli-pi, dispatch pi in --mode json, or both?"
    answered_questions: []
---
# Feature Specification: cli-pi Fan-out Execution (drive the loop, don't requeue it)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

> **Amendment (from Phase-1 reproduction).** This packet was scoped from a live per-mode test that appeared to show a cli-pi review lineage requeuing to death. Controlled reproduction **overturned that premise**: a single cli-pi DeepSeek review lineage completes `fulfilled` (exit 0, all iterations), the lag-ceiling abort path is not armed in the shipped runtime, and no persisted ledger records a real `orphan_requeued`. The original "failure" was a slow-but-working run killed by hand when it looked idle. The requirements below are retained — at the operator's direction — as a **robustness hardening** of the real defect described here, not a fix for an active loop. Full evidence: `decision-record.md`.

The real defect is that a genuinely-working **non-streaming** lineage looks idle to the fan-out runner. The route itself works: `pi -p --offline --model opencode-go/deepseek-v4-flash --thinking high` returns real output for both trivial and agentic prompts (exit 0), and drives the review loop to completion.

The runner's liveness detection — `stallWatchdog`, `progressHeartbeat`, orphan reaping — reads liveness from **streamed** stdout, which opencode and codex emit incrementally. Pi's `-p` print mode does not stream: it returns its whole response only at the end. So a working pi lineage produces no incremental signal and the runner judges it idle. Today that surfaces as a misleading advisory `stall_detected` (log only — it does not abort), which invites an operator to kill a healthy run. It also leaves the lineage exposed to two **latent** requeue paths: the lag-ceiling abort (if a config ever arms it) and a post-exit-orphan false-positive (if a print-mode CLI hands work to a child that keeps writing after the tracked process exits).

The fix closes all three: real artifact writes are counted as liveness, so a working non-streaming lineage is never falsely stalled, aborted, or orphaned — while a lineage that writes nothing at all is still caught, bounded by its own timeout. (A caveat surfaced in verification: an executor that buffers *all* writes to the end, as this pi config does, still emits the advisory `stall_detected` because there is nothing incremental to observe; it completes regardless.)

### Purpose

Make the fan-out runner drive a cli-pi lineage to completion so a DeepSeek-via-cli-pi research or review loop runs its iterations and synthesizes, exactly as a cli-opencode lineage does. Close the streaming-vs-print-mode gap in the runner's liveness detection so a non-streaming executor is judged live while it is genuinely working.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Diagnose the exact requeue trigger for a cli-pi lineage: distinguish a fast empty-exit of the Pi worker from a premature orphan/stall verdict on a still-running worker. Capture the real timing and the Pi subprocess exit behaviour before changing code.
- Make the runner drive the Pi worker to completion, by one or both of: (a) a per-executor liveness allowance so a non-streaming executor is not requeued while its subprocess is alive and within its own timeout; (b) dispatching Pi in `--mode json` (or another streaming surface) so it emits incremental events the existing detection already understands.
- Prove it with a live cli-pi DeepSeek **review** lineage that completes — iterations written, `fulfilled`, no orphan-requeue loop — and confirm the 010 write boundary holds on that run (zero out-of-scope reverts).
- Prove the same for the **research** fan-out mode (the only other fan-out loop-type).

### Out of Scope

- The six single-driver modes (ai-council, deep-improvement, the three benchmarks, deep-alignment). They are not fan-out lineages and do not render the shared loop prompt; making DeepSeek-via-cli-pi run those is separate work.
- The 010 write-boundary hardening itself — done and proven via cli-opencode; this packet only makes it reachable via cli-pi.
- Changing DeepSeek, the opencode-go provider mapping, or the Pi binary.
- Streaming-detection changes for other executors that already work (codex, opencode); the fix must not regress them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Per-executor liveness allowance in the orphan/stall detection, and/or the cli-pi command builder to add a streaming mode. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | If a streaming/liveness capability flag per executor kind is the chosen mechanism. |
| `.opencode/skills/system-deep-loop/runtime/tests/**` | Create | A test that a cli-pi lineage is not requeued while its worker is alive, plus the live-run evidence. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The exact requeue trigger is diagnosed before any fix | A recorded finding stating whether the Pi worker exits empty-fast or is orphan/stall-killed while alive, with timestamps from a real run. |
| REQ-002 | A cli-pi DeepSeek review lineage completes | A live review fan-out ends `fulfilled` with iteration files written and no `started`/`orphan_requeued` loop. |
| REQ-003 | The fix does not regress streaming executors | A cli-opencode (or codex) fan-out lineage still completes clean after the change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The 010 write boundary holds on the completed cli-pi run | The cli-pi review lineage completes with zero out-of-scope reverts and zero real forbidden-tool runs. |
| REQ-005 | The research fan-out mode also completes via cli-pi | A live research lineage completes `fulfilled` under cli-pi DeepSeek. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cli-pi DeepSeek review lineage runs its iterations and synthesizes without an orphan-requeue loop.
- **SC-002**: The 010 write boundary is finally exercisable via cli-pi and holds (zero reverts).
- **SC-003**: Streaming executors (opencode/codex) are unaffected — no new requeues, no lost liveness.
- **SC-004**: The research fan-out mode completes the same way under cli-pi.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A liveness allowance too generous masks a genuinely hung worker | Real stalls go undetected | Bound the allowance by the executor's own timeout, not by disabling detection. |
| Risk | `--mode json` changes Pi's output contract | The runner's output capture/parse breaks | Prove the JSON event shape against a real Pi run before adopting it. |
| Decision | Liveness tuning vs. streaming dispatch vs. both | Different blast radius and durability | Decide in `decision-record.md` with the diagnosis in hand. |
| Dependency | The cli-pi route (`deepseek-v4-flash` → opencode-go) | Needed for every live run | Already built and confirmed working (preflight `PI_ROUTE_OK`). |
| Dependency | Isolated git worktree for live runs | RM-8 safety for the fan-out writes | Run in a worktree with a recorded recovery baseline. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Tune orphan/stall detection per-executor for cli-pi (non-streaming allowance), dispatch Pi in `--mode json` so it streams, or both? Decide with the REQ-001 diagnosis.
- Is a per-executor-kind "streaming vs. batch" capability the right abstraction, or a narrower cli-pi special case?

<!-- /ANCHOR:questions -->
