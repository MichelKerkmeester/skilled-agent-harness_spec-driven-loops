---
title: "Plan: 020 deep-review dispatch"
description: "Implementation phases for the 20-iter cli-devin deep-review run"
trigger_phrases: ["020 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-deep-review-016-019-stack"
    last_updated_at: "2026-05-17T20:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored dispatch phases"
    next_safe_action: "Run pre-flight then dispatch"
    blockers: []
    key_files:
      - "evidence/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000020000"
      session_id: "020-deep-review-016-019-stack-plan"
      parent_session_id: "020-deep-review-016-019-stack"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 020 deep-review dispatch

<!-- ANCHOR:summary -->
## 1. SUMMARY

Pre-flight verifies scope is fully committed + cli-devin SWE 1.6 reachable. Dispatch /spec_kit:deep-review with explicit scope manifest + iterations=20. Bundle gate validates each iteration output. Convergence detection short-circuits if no new findings for 3 consecutive iterations. Synthesize review-report.md + memory note.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Pre-flight | git status clean for in-scope paths; cli-devin --version returns; SWE-1.6 listed |
| Iteration gate | Each output: imports grep PASS + exports grep PASS + validation_commands smoke-run PASS |
| Convergence | 3 consecutive iters with no new P0/P1 → early stop |
| Synthesis | review-report.md cites each finding with file:line + repro steps |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
Pre-flight checks
    ↓
/spec_kit:deep-review dispatch (cli-devin SWE 1.6, iter=20)
    ↓ (per iteration)
    ├─ Bundle output → 3-check gate
    ├─ Findings recorded → JSONL state
    └─ Convergence test → continue or break
    ↓ (post-loop)
Synthesize → review-report.md
    ↓
Memory note ratification
    ↓
Optional: remediation packet scaffolds for P0/P1
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight (5 min)
- `git status --porcelain` clean for in-scope paths
- `cli-devin --version` succeeds
- `cli-devin --list-models | grep -i swe-1.6` succeeds
- Confirm 016-019 commits are all on origin/main

### Phase 2: Author dispatch prompt (5 min)
- Write `/tmp/020-deep-review-prompt.md` with:
  - Explicit scope manifest (file paths from spec.md §3)
  - Iteration target = 20
  - Convergence rule = 3-consecutive-no-new-findings
  - 3-check bundle gate per memory note
  - Output format = `evidence/review-report.md`

### Phase 3: Dispatch (40-90 min wall time, runs in background)
- Invoke /spec_kit:deep-review with the prompt
- Monitor via task notification on completion

### Phase 4: Synthesize + commit (15 min)
- Validate review-report.md exists + cites findings properly
- If P0 findings: scaffold immediate remediation packet
- If P1 findings: queue for next cycle
- Memory note ratifying review outcome
- Strict-validate + commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Pre-flight scripted checks before dispatch (no false starts)
- Per-iter bundle gate catches cli-devin hallucinations early
- Final review-report.md hand-reviewed for citation completeness
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- /spec_kit:deep-review skill
- cli-devin executor + SWE 1.6 model
- All 016-019 code committed on origin/main
- Memory notes: feedback_cli_devin_bundle_verification, feedback_bundle_gate_smoke_run
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| cli-devin SWE 1.6 unavailable | Fall back to cli-codex gpt-5.5 high — slower but reliable |
| Bundle gate fails on > 3 iterations | Halt; investigate why outputs are malformed |
| Iter 1-3 surface critical infra defects | Halt; report; let operator decide whether to continue or revert in-scope commits |
| Review report incoherent | Discard; rerun with tightened scope or different model |
<!-- /ANCHOR:rollback -->
