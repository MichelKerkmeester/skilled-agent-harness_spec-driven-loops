---
title: "Implementation Plan: cli-pi Fan-out Execution"
description: "Approach for making the deep-loop fan-out runner drive a non-streaming cli-pi lineage to completion instead of orphan-requeuing it."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-16T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan: diagnose-first, then liveness/streaming fix"
    next_safe_action: "Operator approves approach, then run the REQ-001 diagnosis"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-pi Fan-out Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The fan-out runner (`fanout-run.cjs`) dispatches one worker per lineage and judges liveness from incremental output plus orphan reaping (`stallWatchdog`, `progressHeartbeat`, orphan detection). Streaming executors (opencode, codex) emit incremental output that reads as liveness. The cli-pi executor dispatches `pi -p --offline`, whose print mode returns its whole response only at the end, so during real work it looks idle and gets requeued in a `started → orphan_requeued` loop.

### Overview

Diagnose the exact requeue trigger first, then close the streaming-vs-print-mode gap: either let a non-streaming executor stay "live" while its subprocess is alive and within its own timeout, or dispatch Pi in a streaming mode the existing detection already understands — or both. Prove it with a live cli-pi DeepSeek lineage that completes, without regressing the executors that already work.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The stall is reproduced and the requeue trigger is characterized with real timestamps (REQ-001).
- The chosen mechanism (liveness allowance, streaming dispatch, or both) is recorded with rationale.

### Definition of Done
- REQ-001..003 (P0) satisfied with evidence.
- A cli-pi DeepSeek review lineage completes `fulfilled` with iterations; no requeue loop.
- A streaming executor still completes clean (no regression).
- `validate.sh <spec-folder> --strict` Errors: 0; checklist verified.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Executor-aware liveness: the runner already models per-executor command construction; extend that to per-executor liveness expectations so "no incremental output yet" is not conflated with "orphaned" for a batch executor.

### Key Components

- **Orphan/stall detection** in `fanout-run.cjs` — the surface that misfires for non-streaming pi.
- **cli-pi command builder** — where a streaming `--mode json` dispatch would be introduced if chosen.
- **executor-config** — the natural home for a per-kind streaming/liveness capability if the fix is a capability flag.

### Data Flow

Dispatch pi worker → (today) no incremental output → orphan verdict → requeue loop. After the fix: worker liveness is read from subprocess state and/or a streamed event, so a working pi lineage runs to synthesis and writes its artifacts.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Reproduce the stall in the worktree and capture the requeue timing + Pi subprocess exit behaviour (REQ-001). Decide the mechanism in `decision-record.md`.

### Phase 2: Implementation
- Apply the chosen fix (per-executor liveness allowance and/or `--mode json` streaming dispatch), bounded so genuine hangs are still caught.

### Phase 3: Verification
- Live cli-pi DeepSeek review lineage completes (REQ-002); the 010 write boundary holds (REQ-004); a streaming executor is unaffected (REQ-003); research mode completes (REQ-005).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Unit:** a test that the runner does not requeue a cli-pi lineage whose worker is alive and within timeout.
- **Negative control:** a genuinely hung worker is still caught (the allowance is bounded, not disabling).
- **Live:** a cli-pi DeepSeek review lineage completes with iterations and zero reverts; a research lineage likewise.
- **Non-regression:** a cli-opencode/codex lineage still completes clean.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The cli-pi route (`deepseek-v4-flash` → opencode-go) — already confirmed working.
- Isolated git worktree with a recorded recovery baseline for the live runs (RM-8).
- The 010 packet's hardened prompt — the write boundary this run finally exercises via cli-pi.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is scoped to the fan-out runner's liveness detection and/or the cli-pi command builder; rollback is reverting those edits. Streaming executors keep their current path, so a revert cannot regress them. Live runs execute in an isolated worktree with a recorded baseline commit, so any errant fan-out write is recoverable by `git reset --hard <baseline>`.

<!-- /ANCHOR:rollback -->
