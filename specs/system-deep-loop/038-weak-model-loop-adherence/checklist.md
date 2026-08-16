---
title: "Verification Checklist: Weak-Model Loop Adherence"
description: "QA verification for the deep-loop observation-only write-boundary hardening."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-weak-model-loop-adherence"
    last_updated_at: "2026-08-16T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the QA checklist for the write-boundary hardening"
    next_safe_action: "Operator approves approach, then implement Phase 1 contract text"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Weak-Model Loop Adherence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` only with cited evidence (command output, grep hit, test result, file:line). A finding is a hypothesis until confirmed against the real symptom.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] Root cause confirmed with session evidence (weak-model tooling breach, not runtime defect).
- [ ] Rendered-prompt surfaces identified (`prompt-pack.ts`, `fanout-run.cjs` lineage block, per-mode leaves).
- [ ] `sk-prompt/sk-prompt-models` confirmed as the weak-model-wording home.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] Prohibition text names the specific forbidden tooling (`generate-context.js`, `validate.sh`, `git` writes) and the lineage-only rule (REQ-001).
- [ ] `tsc --noEmit` clean on `prompt-pack.ts` changes.
- [ ] No behavior change to `write-containment.ts` (the net stays intact).
- [ ] Per-mode wording respects each mode's legitimate write surface (no over-constraint).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] Regression test present; passes on hardened prompt (T007).
- [ ] Negative control: old prompt reproduces the breach → containment fatal (T008 red).
- [ ] Hardened prompt keeps the weak-model stand-in in scope (T008 green).
- [ ] Live DeepSeek review lineage: `fulfilled`, `exitCode: 0`, zero out-of-scope reverts (T009).
- [ ] Strong-model run unchanged (T010, SC-004).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] Strong-model (codex/luna) review run still completes clean after the hardening (SC-004).
- [ ] Modes that legitimately write beyond a lineage dir (research/benchmarks) are not over-constrained.
- [ ] Existing runtime tests remain green (`tsc --noEmit`, `vitest`); no behavior change to `write-containment.ts`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] The observation-only boundary is strengthened, not weakened.
- [ ] Write-containment remains the enforced backstop for a non-compliant model.
- [ ] Any live DeepSeek re-run ran in an isolated worktree with a recorded recovery baseline (RM-8).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] Per-mode adherence table recorded (REQ-006, T011).
- [ ] `implementation-summary.md` records final state + evidence.
- [ ] `decision-record.md` authored if the hard-pre-write-jail is pursued.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Changes scoped to the files named in `spec.md` §3; no unrelated edits.
- [ ] No task-created residue in the scoped diff.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] `validate.sh <spec-folder> --strict` exit 0 (T012).
- [ ] All P0 requirements satisfied with evidence.
- [ ] Completion metadata reconciled across spec/plan/tasks/checklist/implementation-summary.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:sign-off -->
## Sign-off

- [ ] Any live DeepSeek re-run ran in an isolated worktree with a recorded recovery-baseline commit (rollback path confirmed).
- [ ] Operator approved the approach before implementation began.
- [ ] Final state proven: artifacts exist, objective checks pass, scoped diff has no residue.

<!-- /ANCHOR:sign-off -->
