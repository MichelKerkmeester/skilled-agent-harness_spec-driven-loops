---
title: "Implementation Plan: Documentation Truth Audit (030 packet)"
description: "Plan for dispatching a 10-iteration GPT-5.5-fast deep-review of packet 030's documentation surface, then applying confirmed fixes."
trigger_phrases:
  - "030 documentation truth audit"
  - "packet 030 readme agents drift"
  - "goal plugin readme integration"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/010-documentation-truth-audit"
    last_updated_at: "2026-07-01T20:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All plan phases complete"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-010-doc-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Documentation Truth Audit (030 packet)

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, spec-kit deep-review workflow, `cli-opencode` dispatch |
| **Framework** | `/deep:review` (deep-loop-workflows/deep-review packet) |
| **Storage** | Packet-local review state (`review/deep-review-*.json*`, `review/iterations/`, `review/deltas/`) |
| **Testing** | `validate.sh --strict` / `--recursive` |

### Overview
Dispatch 10 forced iterations of `/deep:review` against this phase folder, executed by `openai/gpt-5.5-fast` (variant `high`) via `cli-opencode`, driven sequentially by Claude Code the same way the 11 children of phase 009 were dispatched. Each iteration's 3 required artifacts are independently verified before the next iteration starts. After synthesis, reconcile `review-report.md` against the two pre-decided README.md fixes plus any additional confirmed drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`).
- [x] Structural approach confirmed with the user (new child phase, full ceremony).
- [x] `cli-opencode` dispatch shape confirmed against `deep_review_auto.yaml`.

### Definition of Done
- [x] All 10 iterations complete, `stopPolicy=max-iterations` honored.
- [x] `review-report.md` synthesized with cited evidence.
- [x] Pre-decided README.md fixes applied.
- [x] Any additional confirmed README/AGENTS/AGENTS_Barter.md fixes applied.
- [x] `before-vs-after.md` / `timeline.md` / `changelog/` extended for phase 010.
- [x] `validate.sh --strict` (this phase) and `--recursive` (030 root) both exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dispatched deep-review (read-only target) followed by a separate, explicit doc-fix pass.

### Key Components
- **Review lineage**: a new, distinctly-named lineage under `review/lineages/` (not `codex` or `glm`), config `maxIterations=10`, `stopPolicy=max-iterations`, `executor.kind=cli-opencode`, `executor.model=openai/gpt-5.5-fast`, `executor.reasoningEffort=high`.
- **Dispatch loop**: Claude Code runs `opencode run --model openai/gpt-5.5-fast --format json --dangerously-skip-permissions --pure --dir <repo_root> --variant high "<iteration prompt>"` once per iteration, verifying artifacts before continuing.
- **Reconciliation pass**: reads `review-report.md`, applies pre-decided + confirmed fixes directly (not via the review agent, which is read-only).

### Data Flow
Each iteration prompt carries prior state (iteration count, prior findings) per the standard prompt-pack contract; the dispatcher appends verified results to `deep-review-state.jsonl` and `deltas/iter-NNN.jsonl`. After iteration 10, synthesis produces `review-report.md`. The reconciliation pass then edits `README.md`/`AGENTS.md`/`AGENTS_Barter.md` directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold spec.md/plan.md/tasks.md/checklist.md.
- [x] Read `cli-opencode/SKILL.md`.
- [x] Initialize the new review lineage (config, empty state files).

### Phase 2: Review Execution
- [x] Dispatch iterations 1-10 sequentially, verifying 3 artifacts per iteration before continuing.
- [x] Confirm `stopPolicy=max-iterations` was honored (no early stop).
- [x] Synthesize `review-report.md`.

### Phase 3: Reconciliation
- [x] Apply the two pre-decided README.md fixes (Spec Kit Framework rename, Goal Plugin FEATURES subsection).
- [x] Apply any additional confirmed README/AGENTS/AGENTS_Barter.md fixes.
- [x] Report unrelated findings to the user as follow-ups.

### Phase 4: Verification & Historic Docs
- [x] Extend `before-vs-after.md`, `timeline.md`, `changelog/` for phase 010.
- [x] Fill checklist.md and implementation-summary.md with real evidence.
- [x] Run `validate.sh --strict` (this phase) and `--recursive` (030 root).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Review-state integrity | Per-iteration artifact presence/shape | Direct file reads, JSONL line-count checks |
| Static doc audit | README/AGENTS anchor and content accuracy | `grep`, `rg` |
| Validation | Packet structure | `validate.sh --strict` / `--recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` skill contract | Internal | Available | Defines the exact dispatch shape |
| `deep-review` SKILL.md / `deep_review_auto.yaml` | Internal | Available | Defines the 3-artifact-per-iteration contract |
| Packet 030 phases 001-009 | Internal | Complete | Provides the shipped-work surface being audited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Review lineage produces unusable/corrupt state, or fixes need to be discarded before commit.
- **Procedure**: Remove only this phase folder's `review/` lineage subdirectory and revert README.md/AGENTS.md edits via git checkout; no other packet content is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Review Execution -> Reconciliation -> Verification & Historic Docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Review Execution |
| Review Execution | Setup | Reconciliation |
| Reconciliation | Review Execution | Verification & Historic Docs |
| Verification & Historic Docs | Reconciliation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Review Execution | Medium | 10 sequential dispatches |
| Reconciliation | Low | Small |
| Verification & Historic Docs | Low | Small |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Review lineage isolated from `codex`/`glm` lineages.
- [x] No packet-030 phase 001-009 content modified.

### Rollback Procedure
1. Delete this phase's `review/` lineage subdirectory if the run should be abandoned.
2. `git checkout -- README.md AGENTS.md AGENTS_Barter.md` if fixes need to be discarded pre-commit.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:enhanced-rollback -->
- **Reversal procedure**: Not applicable.
