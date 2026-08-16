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
    last_updated_at: "2026-08-16T14:33:41Z"
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
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

DeepSeek via the cli-pi executor cannot complete a deep-loop fan-out lineage — the runner requeues the Pi worker to death before it produces a single iteration.

A live per-mode adherence test made this concrete. The route itself works: `pi -p --offline --model opencode-go/deepseek-v4-flash --thinking high` returns real output for both a trivial prompt and an agentic review-style prompt (exit 0). But a fan-out review lineage with that same executor cycled `started → orphan_requeued → started → orphan_requeued` repeatedly, wrote zero iteration files, captured an empty `fanout-lineage.out`, and ended in `stall_detected`.

The root cause is an orchestration mismatch, not a model or route failure. The fan-out runner's orphan-and-stall detection — `stallWatchdog`, `progressHeartbeat`, orphan reaping — is tuned for **streaming** executors (opencode, codex), which emit incremental output the runner reads as liveness. Pi's `-p` print mode does not stream: it returns its whole response only at the end. With no incremental signal, the runner judges the still-working Pi worker to be orphaned and requeues it, and the cycle repeats until the run stalls.

Two consequences follow. First, the 010 write-boundary hardening — proven via cli-opencode — cannot be exercised via cli-pi at all, because the pi lineage never runs far enough to write anything. Second, DeepSeek-via-cli-pi cannot run any fan-out loop mode, which blocks the standing goal of DeepSeek working across the deep-loop through cli-pi.

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
