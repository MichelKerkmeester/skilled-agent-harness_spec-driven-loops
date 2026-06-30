---
title: "Implementation Plan: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces"
description: "Surgically distribute the Fable 5 doctrine across AGENTS.md, two new constitutional rules, an existing-rule fold, and sk-code, validated by a converged deep-research loop rather than restating rules or bloating AGENTS.md."
trigger_phrases:
  - "fable 5"
  - "operating doctrine"
  - "implementation plan"
  - "constitutional rules"
  - "surgical distribution"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/114-operate-like-fable-5"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 plan for the Fable 5 distribution work"
    next_safe_action: "Owner decision on Barter git-posture contradiction"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown policy/doc surfaces (no executable code) |
| **Framework** | Spec-Kit constitutional rules + AGENTS.md/CLAUDE.md mirror system |
| **Storage** | Filesystem; spec-memory index for constitutional rules |
| **Testing** | grep/diff/line-count checks plus a converged deep-research loop |

### Overview
Distribute the Fable 5 operating doctrine surgically: add one cross-referencing subsection to the AGENTS.md surfaces, add two new constitutional rules that act as deltas over the existing `verify-before-completion-claims.md`, fold a non-git outward-action bullet into `main-branch-direct-push.md`, and add a baseline/blast-radius line to sk-code. A deep-research loop validated the distribution and the redundancy analysis before any edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (byte-identical twin, line budget, subsection presence, rule presence)
- [x] Dependencies identified (auto-sync mirrors, spec-memory dist)

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] Checks passing (diff, grep, line counts)
- [x] Docs updated (spec/plan/tasks/implementation-summary/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical distribution across enforced surfaces (cross-reference, do not restate).

### Key Components
- **AGENTS.md / CLAUDE.md surfaces**: highest-read agent policy text; receive the Operating Discipline subsection.
- **Constitutional rules**: auto-surfaced by the advisor; carry the two new deltas plus the folded outward-action bullet.
- **sk-code/SKILL.md**: the code-implementation surface; carries the baseline/blast-radius read after the Iron Law.

### Data Flow
A source edit on `AGENTS.md` auto-syncs to its byte-identical `CLAUDE.md` twin; `.opencode/...` constitutional and skill edits auto-sync to their `.claude` mirrors; constitutional rules are then surfaced to agents through the skill advisor on the next index scan.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research & Validation
- [x] Run a deep-research loop (cli-codex gpt-5.5, reasoning_effort=xhigh, service_tier=fast, max 10 iterations) over the doctrine and the current stack.
- [x] Reach convergence (5 iterations; newInfoRatio 0.95 → 0.72 → 0.55 → 0.38 → 0.08; 5/5 questions answered).
- [x] Capture the canonical synthesis at `research/research.md`.

### Phase 2: Surgical Edits
- [x] Add the Operating Discipline subsection to Public `AGENTS.md` (+13 → 446) and verify the `CLAUDE.md` twin.
- [x] Add the read-only-git variant to `Barter/ai-speckit/coder/AGENTS.md` (+13 → 467).
- [x] Create `regression-baseline-and-delta.md` and `finding-is-a-hypothesis.md` (Public + Barter mirror).
- [x] Fold the non-git outward-action bullet into `main-branch-direct-push.md`.
- [x] Add the Baseline & blast-radius line to `sk-code/SKILL.md`.

### Phase 3: Verification & Scope Reconciliation
- [x] Confirm `diff AGENTS.md CLAUDE.md` is clean and both AGENTS files are under budget.
- [x] Confirm the subsection and rule files are present across all surfaces.
- [x] Drop the two superseded embeddings (sk-git, orchestrate.md) after reading the actual files, and record why.
- [x] Defer constitutional re-index to the next daemon scan (pre-existing stale dist).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Identity | `AGENTS.md` ≡ `CLAUDE.md` | `diff` |
| Budget | Both AGENTS files under ~500 lines | `wc -l` |
| Presence | Subsection + rule files across surfaces | `grep`, `ls` |
| Research | Doctrine distribution + redundancy validation | Deep-research convergence loop |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AGENTS.md → CLAUDE.md auto-sync | Internal | Green | Twin could drift; caught by diff check |
| `.opencode` → `.claude` mirror sync | Internal | Green | Mirror could drift; caught by presence check |
| spec-memory dist (constitutional re-index) | Internal | Yellow | Re-index deferred to next daemon scan |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: AGENTS.md exceeds budget, the byte-identical twin breaks, or a constitutional rule is malformed.
- **Procedure**: `git revert` the offending edit (each surface edit is independent and reversible), re-run the diff/grep/line-count checks, then re-apply on a clean base.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Research & Validation) ──► Phase 2 (Surgical Edits) ──► Phase 3 (Verification & Reconciliation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research & Validation | None | Surgical Edits |
| Surgical Edits | Research & Validation | Verification |
| Verification & Reconciliation | Surgical Edits | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research & Validation | Med | Deep-research loop, 5 iterations |
| Surgical Edits | Low | ~5 files, small additive edits |
| Verification & Reconciliation | Low | grep/diff/line-count checks |
| **Total** | | **Low-Med; research-bounded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; no backup needed
- [x] No feature flag (static policy text)
- [x] Byte-identical twin and mirror checks in place

### Rollback Procedure
1. `git revert` the specific surface edit (each is independent).
2. Re-run `diff AGENTS.md CLAUDE.md` and the line-count checks.
3. Confirm the reverted surface is well-formed and the others are untouched.
4. No stakeholder notification needed; surfaces are internal policy text.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
