---
title: "Decision Record: cli-pi Fan-out Execution"
description: "Phase-1 diagnosis of the cli-pi fan-out stall and the chosen fix mechanism: recognize lineage-artifact progress as liveness for a non-streaming executor."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-16T14:33:41Z"
    last_updated_by: "claude"
    recent_action: "Recorded the Phase-1 diagnosis: pi slow-but-working, fix = artifact-progress liveness"
    next_safe_action: "Implement artifact-progress markProgress in the fan-out stall detection"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-pi Fan-out Execution

## Context

The 011 spec assumed the cli-pi fan-out stall was a liveness-detection mismatch. Phase-1 diagnosis (live runs, real evidence) confirms that direction and pins the mechanism.

## Diagnosis (evidence)

- **The route works.** `pi -p --offline --model opencode-go/deepseek-v4-flash --thinking high` returns real output for a trivial prompt, a "reply DONE" agentic prompt, reading the deep-review SKILL, and a nested file write — all exit 0 in ~1-2s.
- **pi is slow-but-working on the full loop, not deadlocked.** Given the full fan-out loop prompt and a 5-minute run, pi wrote the init artifacts (`deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`) AND `iterations/iteration-001.md` — genuine progress. It did not emit `FANOUT_LINEAGE_COMPLETE` because 5 minutes only got it through init plus one iteration. The observed 0% CPU is pi waiting on the DeepSeek API during a long generation (network I/O), not a deadlock.
- **The runner kills it at ~60s.** The fan-out stall detection reads liveness from streaming stdout (`opts.onOutput` → the pool's `markProgress`) and from lineage-settle events. Pi's print mode does not stream — it returns only at the end — so within ~60s the runner sees no progress, aborts the still-working subprocess, and the killed worker is then flagged `orphaned_after_subprocess_exit` and requeued. Repeat: the `started → orphan_requeued` loop.

## Root cause

The stall/orphan liveness signal is streaming-output-based. A non-streaming executor (cli-pi) that writes artifacts slowly produces no incremental stdout, so a genuinely-working lineage is judged stalled and killed before it can finish.

## Decision

**Recognize lineage-artifact progress as liveness.** When files appear or grow in the lineage artifact directory (iteration files, state log), treat it as progress — call the same `markProgress` path that streaming output does. This is:

- **Executor-agnostic** — any executor that writes artifacts benefits; no cli-pi special case.
- **Still safe** — a genuinely hung worker that writes nothing and streams nothing is still caught; the allowance is bounded by the executor's own timeout, and the stall detector is not disabled (it keys off real artifact progress).
- **Minimal** — the runtime already has `countIterationFiles(lineageDir)` and the `markProgress` reset; the change is to feed artifact-directory change into that reset while a worker is alive.

Rejected alternatives:
- **Blanket per-executor liveness allowance (subprocess-alive only):** would let a truly-hung pi run to its full timeout with no progress; less precise than artifact-progress.
- **Dispatch pi in `--mode json` for streaming:** larger change to the cli-pi command builder and output capture; deferred unless artifact-progress proves insufficient.
- **Per-iteration dispatch for cli-pi (like the native path):** a bigger re-architecture; not needed since pi does run the loop, only slowly.

## Practical caveat

pi via opencode-go DeepSeek is slow here (~5 min for init + one iteration), so a full cli-pi review lineage runs ~15-20 min. The fix makes it complete; it does not make it fast. This is acceptable for an asynchronous fan-out but is a real cost to record.
