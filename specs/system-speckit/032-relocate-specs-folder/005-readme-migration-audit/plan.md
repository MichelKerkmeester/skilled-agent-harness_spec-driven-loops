---
title: "Implementation Plan: README Migration Audit"
description: "Dispatch /deep:review (via the system-deep-loop skill) with dual executors, deepseek-v4-flash (cli-opencode) and GLM-5.2-max (cli-devin), 10 iterations each, forced full-depth, scoped to README migration staleness."
trigger_phrases:
  - "readme migration audit plan"
  - "dual executor deep review dispatch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/005-readme-migration-audit"
    last_updated_at: "2026-08-07T20:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned the dispatch; CLI-to-model mapping verified against both SKILL.md files"
    next_safe_action: "Launch via the system-deep-loop skill"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-005"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: README Migration Audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation audit |
| **Framework** | `/deep:review` via the `system-deep-loop` skill (Claude Code entry point for the OpenCode-native `.opencode/commands/deep/review.md` workflow) |
| **Storage** | Review artifacts under `review/` inside this phase folder |
| **Testing** | N/A — documentation correctness, not code |

### Overview
Dispatch a 20-iteration (10 per executor) deep-review loop scoped to README migration correctness. Two executors, resolved against real, currently-verified CLI-to-model mappings rather than assumed: `deepseek-v4-flash` via `cli-opencode` (`--model deepseek/deepseek-v4-flash`, confirmed as a directly-listed model with a live 2026-08-07 dispatch on record), `GLM-5.2-high` via `cli-devin` (`--model glm-5-2-max` — GLM has no separate literal "-high" slug in cli-devin's roster and is not listed at all in cli-opencode's, so `glm-5-2-max` is the closest real mapping and matches this same packet's phase-001 precedent of "GLM-5.2 High via cli-devin").
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Real README census run (753 non-worktree files, 22 with a literal `.opencode/specs` hit) — the review isn't unscoped
- [x] Both CLI SKILL.md files read per the HARD dispatch rule before composing any prompt
- [x] Model-to-CLI mapping verified against each CLI's own `references/providers-and-models.md`, not assumed from memory

### Definition of Done
- [ ] Both executors ran their full 10 iterations (or converged with `max-iterations` stop-policy preventing early stop)
- [ ] `review/review-report.md` exists with a verdict
- [ ] Root `README.md`'s known stale reference resolved
- [ ] Every finding has a disposition (fixed or deferred with a reason)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Loop-owned workflow dispatch, not a hand-rolled multi-CLI orchestration. Per the PLAN-WORKFLOW LOCK rule, `/deep:review`'s own YAML workflow owns iteration state, convergence detection, and per-iteration agent dispatch — this plan's job is to bind the right inputs (target, scope, executors, iteration count) and launch it, not to reimplement any part of the loop.

### Key Components
- **`system-deep-loop` skill**: the Claude Code entry point that routes to the same underlying deep-review packet OpenCode's `.opencode/commands/deep/review.md` targets.
- **`cli-opencode` executor**: dispatches `deepseek/deepseek-v4-flash` via `opencode run`.
- **`cli-devin` executor**: dispatches `glm-5-2-max` via `devin -p`.
- **`review/` artifacts**: iteration state, findings, and the final `review-report.md`, all written under this phase folder (its write authority).

### Data Flow
No code data flow — this is a documentation-content review. Each iteration reads README files, cross-references them against the actual post-flip topology (`specs/` canonical, `.opencode/specs` symlink), and records findings; findings converge into a synthesized report; confirmed findings get fixed in place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch

#### Step 1 — Launch the dual-executor review
Invoke the `system-deep-loop` skill in review mode, `:auto` execution, bound to this phase folder as `spec_folder`, with:
- `review_target`: the repo root, scoped via the In Scope/Out of Scope boundaries in `spec.md` (every non-worktree README, root `README.md` explicitly named, `.worktrees/*` and non-README docs excluded)
- `review_dimensions`: migration-topology correctness (does this README's content match `specs/` canonical + `.opencode/specs` symlink, not the pre-flip layout)
- Executor 1: `--executor=cli-opencode --model=deepseek/deepseek-v4-flash --label=deepseek-flash --iters=10`
- Executor 2: `--executor=cli-devin --model=glm-5-2-max --label=glm-high --iters=10`
- `--stop-policy=max-iterations` (the user asked for 10 iterations per executor specifically; this forces the full depth rather than an early convergence stop)

**Check**: loop state records show `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, `mode: "review"` present for both executor labels across their iterations — the route-proof fields the command's own contract requires for a completed run to count as a real delegation, not a route violation.
**Rollback**: N/A — a review loop reads and reports; it doesn't mutate source until the fix phase, which is a separate, reviewable step.

### Phase 2: Fix confirmed findings

#### Step 2 — Apply fixes for confirmed findings
For every finding the review confirms (not just raises), fix the README content directly. Verify each fix against the actual current topology before applying — a finding is a hypothesis, not an instruction.
**Check**: `git diff` for each touched README shows only the migration-correctness fix, nothing else (scope lock).
**Rollback**: `git checkout -- <path>` before commit; `git revert` after.

### Phase 3: Close out

#### Step 3 — Reconcile packet docs and commit
Update this phase's `tasks.md`/`implementation-summary.md` with real evidence, regenerate `description.json`/`graph-metadata.json`, run `validate.sh --recursive --strict` on the whole `032-relocate-specs-folder` family, commit, and push to `skilled/v4.0.0.0`.
**Check**: `validate.sh` exit 0, `git status --porcelain` clean of anything outside this phase's scope.
**Rollback**: N/A — final verification step.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content verification | Every confirmed finding, before fixing | Direct check against `specs/`/`.opencode/specs` real topology |
| Regression | `validate.sh --recursive --strict` on the parent packet family | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` CLI installed and authenticated | External | Assumed available — used earlier this session | If missing, the deepseek-flash lane cannot dispatch; escalate rather than substitute |
| `cli-devin` CLI installed and authenticated | External | Assumed available — used in this packet's phase 001 | If missing, the GLM lane cannot dispatch; escalate rather than substitute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix applied during Phase 2 turns out to be wrong (the finding didn't actually hold up under verification).
- **Procedure**: `git checkout -- <path>` before commit; `git revert <sha>` after. Review artifacts under `review/` are additive and never need rollback themselves.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
