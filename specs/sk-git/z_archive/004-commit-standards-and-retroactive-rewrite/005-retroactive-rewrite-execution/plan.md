---
title: "Phase 005 Plan: Retroactive Rewrite Execution"
description: "Run the 56-iter cli-devin loop, synthesize mapping.jsonl, apply via git filter-repo, verify against the Phase 001 baseline. Local-only."
trigger_phrases:
  - "112-retroactive-rewrite-execution plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/004-commit-standards-and-retroactive-rewrite/005-retroactive-rewrite-execution"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 005 plan"
    next_safe_action: "Run preflight gate then create backup branch"
    blockers:
      - "Phases 001 through 004 must close"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-plan-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 005 — Retroactive Rewrite Execution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Eight stages: preflight → backup → init loop state → run 56 cli-devin iterations → synthesize mapping.jsonl → 5% adversarial sample → apply via git filter-repo → verify. Local-only, no force-push. Backup branch + bundle preserve the original history.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Acceptance |
|------|-------|------------|
| G1 | Preflight: phase 001 evidence verifies, phase 004 agent-config promoted, tooling pins match | Manual run |
| G2 | Backup branch `backup/pre-rewrite-YYYYMMDD` created and log matches baseline | `git log` diff |
| G3 | Loop converges: 56 iterations complete, legalStop=true set by synthesis | state.jsonl + synthesis |
| G4 | `mapping.jsonl` has exactly 2,795 entries, zero needs_human_review | `wc -l` + grep |
| G5 | 5% adversarial sample passes (≥95% hand-checked clean) | verification-report |
| G6 | `git filter-repo` exits 0; HEAD count unchanged; 24 merges preserved | Verification |
| G7 | Baseline recoverable post-rewrite | `git bundle verify` |
| G8 | `validate.sh --strict` exits 0 | Validator passes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

cli-devin deep-loop dispatches 56 times in sequence (or controlled parallel — decide at execution per available budget). Each iter reads commit-standards + derivation-heuristics, emits rewrites/iteration-NNN.md plus a JSONL row. Synthesis pass produces `mapping.jsonl`. A Python callback reads mapping.jsonl during `git filter-repo --message-callback` and returns rewritten messages keyed by old hash.

filter-repo invocation must NOT include `--prune-empty=always` (would flatten merges).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1 — Preflight
Verify Phase 001 evidence + Phase 004 promotion + current HEAD count matches baseline (recapture if drifted).

### Stage 2 — Backup
`git branch backup/pre-rewrite-$(date +%Y%m%d) HEAD`; verify.

### Stage 3 — Initialize loop state
Concrete commit-rewrite-config.json (sessionId, batchSize=50, totalCommits=2795, maxIterations=60); init state.jsonl + strategy.md.

### Stage 4 — 56-iter loop
For N in 1..56: compute batch range, render iter prompt, dispatch cli-devin, verify iter file and JSONL row, update strategy.

### Stage 5 — Synthesis
Dispatch synthesis prompt; emit `mapping.jsonl` (2,795 rows); zero needs_human_review.

### Stage 6 — Adversarial sample
140-commit random sample hand-checked against commit-standards; record pass rate in verification-report.

### Stage 7 — Apply
Read mapping.jsonl via apply-mapping.py callback; `git filter-repo --message-callback "$(cat callbacks/apply-mapping.py)"`.

### Stage 8 — Verify
Count check; merges preserved; no packet-ID leakage; baseline bundle still verifies. Update implementation-summary and parent graph-metadata (status=completed).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Multi-gate: per-iter convergence checks during the loop, synthesis count validation, hand-checked adversarial sample, post-rewrite structural verification (count, merge count, log inspection), backup-recoverable check.

No automated tests new in this phase — relies on filter-repo's own correctness for the apply step and on the adversarial sample for content quality.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 001 evidence (tooling-pins, bundle, baseline-log)
- Phase 002 outputs (commit-standards, derivation-heuristics)
- Phase 003 sk-git mirror parity
- Phase 004 promoted agent-config recipe + templates (callbacks/apply-mapping.py)
- `git-filter-repo` binary
- `cli-devin` + `sequential_thinking` MCP
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If anything goes wrong after Stage 7:
- `git checkout backup/pre-rewrite-YYYYMMDD`
- `git branch -f main backup/pre-rewrite-YYYYMMDD`
- If reflog is gone: `git bundle unbundle evidence/pre-rewrite.bundle` and reset main from the bundled ref
- `git reflog expire --expire=now --all && git gc --prune=now` to clean aborted filter-repo state
<!-- /ANCHOR:rollback -->
