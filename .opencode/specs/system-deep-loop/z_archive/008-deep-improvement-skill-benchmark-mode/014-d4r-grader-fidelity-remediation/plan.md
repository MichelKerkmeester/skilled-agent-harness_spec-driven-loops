---
title: "Implementation Plan: D4-R Grader Fidelity + Doc Reconciliation Remediation"
description: "How the 28 deep-review findings are fixed: gpt-5.5-fast (high) drafts behavior-preserving edits across 11 files in an isolated wt/0007 worktree under RM-8, the operator reviews the diff and integrates to main, then validates with the full vitest suite + the router drift guard."
trigger_phrases:
  - "d4r remediation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/014-d4r-grader-fidelity-remediation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the remediation plan"
    next_safe_action: "Await the gpt-5.5 worktree diff; review + integrate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d4r-grader-fidelity-remediation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D4-R Grader Fidelity + Doc Reconciliation Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

One long **gpt-5.5-fast (high) via cli-opencode** dispatch, sandboxed in an isolated **`wt/0007-d4r-remediation`** worktree (RM-8 isolation), applies all 28 deep-review findings against committed HEAD `b697b0a1d1`. The dispatch prompt enumerates each finding with its exact fix, a BANNED/ALLOWED scope, and a behavior-preserving + comment-hygiene mandate, and syntax-checks each `.cjs` with `node --check`. I review the diff, integrate only the 11 target files into main, and validate with the full vitest suite + the router drift guard.

### Technical Context
The findings span the skill-benchmark + model-benchmark scripts (`harness.cjs`, `live-executor.cjs`, `dispatch-model.cjs`, `score-skill-benchmark.cjs`, `d4-ablation.cjs`, `sweep-benchmark.cjs`, `score-model-variant.cjs`) and the doc set (`SKILL.md`, `README.md`, `scoring_contract.md`, `changelog/v1.11.0.0.md`). The full vitest suite (349 passing) is the behavior-preservation gate; the `sk-code-router-sync.vitest.ts` drift guard must stay green.

### Overview
Close every finding with small, local, behavior-preserving edits so the D4-R grader is correct end-to-end and the docs are traceable to code — outsourced safely (worktree + scoped prompt), integrated only after review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
The worktree exists off the recorded HEAD baseline `b697b0a1d1`; the gpt-5.5 prompt enumerates all 28 fixes + the RM-8 BANNED/ALLOWED scope + a Gate-3 pre-answer for the non-interactive agent.

### Definition of Done
All 28 findings fixed (or explicitly deferred with reason); full vitest suite 349+/0 and the drift guard green on main after a reviewed integration; comment hygiene clean; gpt-5.5's per-finding report preserved in `proposals/`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Outsourced-remediation-in-worktree with reviewed integration — the mechanical edits run sandboxed, the prod skill changes only through a vetted merge with the suite green.

### Key Components
The gpt-5.5 dispatch (cli-opencode `openai/gpt-5.5-fast --variant high`, omit `--agent`, `--format json`, `--dir <worktree>`, `</dev/null`, `gtimeout -k`); the `wt/0007` worktree; the 11 target files; the full vitest suite + the drift guard.

### Key Decisions
- **Worktree, not main (RM-8 L2).** `--dangerously-skip-permissions` grants FS-wide write; prose scope alone once let a dispatch delete 44 files. The worktree contains any damage.
- **gpt-5.5, not deepseek (RM-8 L4).** The user-chosen, careful model for write-capable dispatch.
- **Default `dimId='D4'`.** Threading the dimension with a default preserves every existing grader caller while killing the hardcoded-'D4' fallback bug.
- **Behavior-preserving or defer.** A refactor that cannot be proven equivalent is deferred with a reason rather than risking score drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- deep-improvement skill-benchmark scripts: `live-executor.cjs`, `score-skill-benchmark.cjs`, `d4-ablation.cjs`.
- deep-improvement model-benchmark scripts: `scorer/grader/harness.cjs`, `dispatch-model.cjs`, `sweep-benchmark.cjs`, `scorer/score-model-variant.cjs`.
- deep-improvement docs: `SKILL.md`, `README.md`, `references/skill-benchmark/scoring_contract.md`, `changelog/v1.11.0.0.md`.
- The `sk-code-router-sync.vitest.ts` drift guard + the full vitest suite — must stay green.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Record the HEAD baseline `b697b0a1d1` (RM-8 L3); create the `wt/0007-d4r-remediation` worktree off it; compose the RM-8-scoped per-finding remediation prompt.

### Phase 2: Core Implementation
Dispatch gpt-5.5 in the worktree to apply the five workstreams — WS-1 grader fidelity (harness.cjs), WS-2 answer fairness (live-executor.cjs), WS-3 doc↔code sync (SKILL.md/README/scoring_contract/changelog), WS-4 hardening (dispatch-model.cjs/score-model-variant.cjs), WS-5 maintainability (score-skill-benchmark.cjs/d4-ablation.cjs/sweep-benchmark.cjs) — each `.cjs` `node --check`-gated.

### Phase 3: Verification
Review the worktree diff (behavior-preserving, hygiene-clean); integrate the 11 files into main with per-file collision checks against the parallel session's churn; run `npx vitest run` (349+/0) + the drift guard; copy gpt-5.5's report to `proposals/`; remove the worktree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run` from `deep-improvement/scripts` (expect 349+/0) is the behavior-preservation gate after integration; `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` confirms the router drift guard. In the worktree (no node_modules), `node --check` on each `.cjs` is the syntax gate. Doc accuracy is spot-checked against an `ls` of the actual tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The findings source (`013/review/review-report.md`), the 11 target files at committed HEAD, the full vitest suite, and the router drift guard. A parallel session has unrelated uncommitted edits elsewhere in deep-improvement — none in the 11 target files.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work is in `wt/0007`; main is untouched until integration. If the suite regresses on integration, `git checkout b697b0a1d1 -- <file>` restores any of the 11 target files (all clean at that baseline). The worktree branch is disposable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (worktree + prompt) → 2 (gpt-5.5 applies the 5 workstreams in the worktree) → 3 (review + integrate + verify). Phase 3 gates what reaches main; the full suite is the hard gate.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small-to-moderate: 11 files, 28 mostly-local fixes. The edit effort is gpt-5.5's (one long high-reasoning dispatch); mine is the prompt, the diff review, the integration, and the suite/drift verification.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
HEAD baseline `b697b0a1d1` recorded; worktree created off it; full suite + drift guard green pre-change on main.

### Rollback Procedure
Discard the worktree (`git worktree remove`); if already integrated and regressing, `git checkout b697b0a1d1 -- <file>` per affected file, or a single-commit revert of the integration.

### Data Reversal
None — code + docs only; no persisted state or migrations.
<!-- /ANCHOR:enhanced-rollback -->
