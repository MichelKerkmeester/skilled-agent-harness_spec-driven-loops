---
title: "Plan: deep review + empirical benchmark of the context-loading contract"
description: "Two parallel tracks — a 10-iteration gpt-5.5 deep review of 029/030, and a 4-run A/B benchmark with Kimi K2.7 + MiniMax M3 as test subjects — then a combined verdict. Observation only."
trigger_phrases:
  - "context contract benchmark plan"
  - "deep review benchmark plan design"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/035-design-context-benchmark"
    last_updated_at: "2026-06-27T16:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the two-track eval method after both tracks completed"
    next_safe_action: "Optional follow-ups; otherwise phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "benchmark-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "eval-154-035-design-context-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: deep review + empirical benchmark of the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Two tracks run in parallel. Track 1: a single cli-codex gpt-5.5 @ high agent executes the deep-review methodology for 10 iterations over the 029/030 work, scoped to the explicit diff. Track 2: four background `opencode run` dispatches (MiniMax M3 + Kimi K2.7, each ×{baseline, contract}) build the same card; outputs are scored against a fixed rubric. Results are synthesized into a combined verdict. Nothing in 029/030 or the live skills is edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- The review converges (10 iters) and cites file:line for every finding.
- All 4 benchmark runs produce artifacts and are scored on the same rubric.
- Contrast claims are independently recomputed (not taken from model output).
- Models write only to their run dir (scope verified post-run).
- `validate.sh --strict` clean for the `031` packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

- **Track 1 (review):** `codex exec --model gpt-5.5 -c model_reasoning_effort=high --sandbox workspace-write`, prompt reads the deep-review SKILL + the explicit scope (`git diff 3c170c46de`, 029 research, 030 docs); writes `review/` artifacts; scope-locked to `031/review/`.
- **Track 2 (benchmark):** `opencode run --model <slug> --format json --dir ROOT … </dev/null`, 4 parallel runs. MiniMax M3 = `minimax/MiniMax-M3` (TIDD-EC scaffold); Kimi K2.7 = `kimi-for-coding/k2p7` (COSTAR scaffold, read-cap). Condition A = task only; condition B = task + the context-loading dispatch protocol.
- **Rubric:** register-first / contrast-pair inventory / interface pre-flight / audit-evidence / both cards / four-misses-avoided (6 criteria, scored per run).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Setup** — consult sk-prompt-small-model for both recipes; smoke-test both transports; create the `031` packet + run dirs.
2. **Run (parallel)** — launch Track 1 (review loop) and Track 2 (4 A/B runs) as concurrent background jobs.
3. **Score + synthesize** — score the 4 runs on the rubric (independently recomputing contrast); read the review report; write the benchmark matrix + combined verdict.
4. **Finalize** — author the wrapper docs; strict-validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

The benchmark IS the test (empirical A/B). Verification is evidence-based: independently recompute the decisive contrast ratios (`#787878` etc.) rather than trusting model claims; confirm scope isolation via `git status`; converge the review at 10 iterations with file:line evidence. `validate.sh --strict` on the packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 029/030 deliverables + the live contract (review target + benchmark condition B).
- `sk-prompt-small-model` recipes; `cli-opencode` mechanics.
- `codex` (gpt-5.5) for the review; Kimi/MiniMax transports for the benchmark.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Observation-only and additive: the entire phase is new files under `031/`. Revert = delete the `031` folder. No 029/030, live-skill, runtime, or deploy impact.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Deliverables**: `review/review-report.md`, `benchmark-matrix.md`
