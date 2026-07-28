---
title: "Implementation Plan: Relocate fully-portable runtime-hook guard cores"
description: "Classify hook portability by real import dependency, relocate only the fully-portable set via git mv, fix every path reference across 6 runtimes, then gate the merge decision on a forced 5-iteration deep review."
trigger_phrases:
  - "hook relocation plan"
  - "runtime-hooks git mv"
  - "portability classification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Retroactive plan authored; deep-review setup fully resolved"
    next_safe_action: "Load .opencode/commands/deep/assets/deep-review-auto.yaml with bound setup"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Merge/push/leave-local decision pending deep-review outcome."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Relocate fully-portable runtime-hook guard cores

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | Claude plan-mode (approved), then `/deep:review:auto` |
| **Authority** | Cross-cutting: cli-external-orchestration, mcp-tooling, sk-code, system-deep-loop, system-spec-kit |
| **Review Executor** | `cli-opencode gpt-5.6-sol`, reasoning effort `high` |
| **Review Policy** | `stop_policy=max-iterations`, `maxIterations=5` (forced, no early convergence) |
| **Verification** | Repo-wide stale-path grep, per-suite test re-runs, live per-runtime smoke tests, `parent-skill-check.cjs` baseline diff |

### Overview

Classify every hook candidate by real import dependency (not assumption), relocate only the set with zero owning-skill dependency, fix every reference (configs, symlinks, imports, hardcoded subprocess-spawn constants, tests, docs) found via both an import-statement grep and a separate hardcoded-path-string grep, verify via test re-runs and live smoke tests, then gate any merge decision on a forced 5-iteration deep review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Operator confirmed relocation scope: fully-portable set only. [evidence: AskUserQuestion answer, this session]
- [x] Operator confirmed isolated worktree over current branch. [evidence: AskUserQuestion answer, this session]
- [x] Plan approved via ExitPlanMode. [evidence: `/Users/michelkerkmeester/.claude/plans/flickering-imagining-stonebraker.md`]

### Definition of Done

- [x] Relocation committed with git history preserved. [evidence: commit `40d5f0d2b3`]
- [x] All affected test suites re-run and passing. [evidence: see checklist.md]
- [ ] Forced 5-iteration deep review completed with synthesized verdict. [evidence: pending]
- [ ] Merge/push/leave-local decision made. [evidence: pending, gated on review outcome]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Concern-organized relocation tree (`dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/`), each with `lib/` (portable core + co-located tests) and one subfolder per runtime that still needs a real adapter file (Pi and OpenCode adapters stay pinned by their own auto-discovery mechanism; only their import path changes).

### Key Components

- **Portability classifier**: real import-graph trace per candidate hook, not a blanket policy.
- **`.opencode/runtime-hooks/` tree**: new home for the 4 portable guard-core families.
- **Cross-adapter spawn constants**: several adapters `spawnSync` another runtime's adapter file by hardcoded path string rather than importing shared `lib/` directly — these needed a second, dedicated grep pass to find.
- **Runtime discovery mirrors**: `.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/` symlinks re-pointed at the new tree.

### Control Flow

Classify → relocate via `git mv` → fix configs/symlinks/imports → fix hardcoded spawn constants (second sweep) → fix stale test paths → re-run every affected suite → live smoke-test each runtime → sweep and fix documentation → commit → author this review packet → dispatch forced 5-iteration deep review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Portability Classification

- [x] Trace real import dependencies for every hook candidate.
- [x] Confirm spec-gate, session-lifecycle, skill-advisor brief, and git-preflight-advisory are NOT portable (each depends on its owning skill's own engine).
- [x] Confirm dispatch, mcp-route-guard, post-edit-quality, and task-dispatch ARE portable.

### Phase 2: Relocation

- [x] `git mv` 4 guard-core families + adapters into `.opencode/runtime-hooks/{concern}/`.
- [x] Author `.opencode/runtime-hooks/README.md`.
- [x] Fix every relocated adapter's own relative import.

### Phase 3: Wiring & Discovery Fixes

- [x] Repoint 4 runtime config files' command-string paths.
- [x] Re-`ln -s` every affected runtime discovery mirror symlink.
- [x] Fix `.pi/extensions/*.ts` and `.opencode/plugins/mk-*.js` import/require paths.
- [x] Second grep sweep for hardcoded (non-import) path strings; fix cross-adapter spawn constants and a concurrent session's new `.pi/extensions/git-preflight-advisory.ts`.

### Phase 4: Test & Documentation Repair

- [x] Fix 5 test files with stale relative-path constants; re-run each, confirm pass.
- [x] Batch-fix ~20 documentation files; verify relative-depth math for 2 files where the first sed pass was wrong.
- [x] `validate_document.py` on every touched/new README/doc: 0 issues.

### Phase 5: Retroactive Documentation & Deep Review

- [x] Author this Level 2 packet (spec/plan/tasks/checklist/implementation-summary) for the already-committed relocation.
- [ ] Dispatch `/deep:review:auto`, 5 forced iterations, `cli-opencode` `gpt-5.6-sol` `high`, over the full worktree diff.
- [ ] Act on review verdict; resolve the merge/push/leave-local decision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Unit | Relocated dispatch/mcp-route-guard/post-edit-quality/task-dispatch cores | `node --test`, `npx vitest run` per file's own documented runner |
| Static | Stale-path detection | Repo-wide grep for every old path string |
| Live smoke | Pi and OpenCode runtime loading | Manual `pi --offline --approve -p "..."` and OpenCode session start |
| Documentation | All touched/new README/playbook files | `validate_document.py` |
| Regression baseline | `mcp-code-mode` hub invariant failures | `parent-skill-check.cjs` run against unmodified main tree for comparison |
| Independent review | Full diff, all dimensions | `/deep:review:auto`, 5 forced iterations |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `/deep:review` command contract | Internal | Available | Cannot obtain independent verification before merge. |
| Isolated worktree `.worktrees/0118-skilled-hook-runtime-relocation` | Internal | Active | Relocation and its review must stay scoped to this worktree until merge. |
| `cli-opencode` executor + `gpt-5.6-sol` model | External CLI | Assumed available | Review cannot run with the operator-specified executor. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Deep review surfaces an unresolved P0, or a runtime is found to have regressed after the move.
- **Procedure**: The worktree branch is isolated and unmerged; rollback is simply not merging it. Individual file fixes can be reverted via `git revert` against the single relocation commit `40d5f0d2b3` without affecting `skilled/v4.0.0.0`.
- **Data impact**: None. Code/config/doc relocation only, no data migrations.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Portability Classification | None | Relocation |
| Relocation | Classification | Wiring & Discovery Fixes |
| Wiring & Discovery Fixes | Relocation | Test & Documentation Repair |
| Test & Documentation Repair | Wiring fixes | Retroactive Documentation & Deep Review |
| Retroactive Documentation & Deep Review | All prior phases | Merge decision |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Shape |
|-------|------------|--------------|
| Portability Classification | Medium | ~9 hook candidates traced, 4 qualified |
| Relocation | Medium | ~25 git mv renames across 4 concern folders |
| Wiring & Discovery Fixes | High | 4 configs, ~20 symlinks, 2 grep sweeps (import + hardcoded string) |
| Test & Documentation Repair | Medium | 5 test files, ~20 docs, 2 relative-depth corrections |
| Retroactive Documentation & Deep Review | Medium | This packet + a forced 5-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [x] Work isolated to a dedicated worktree/branch, unmerged.
- [x] Single relocation commit, not squashed across unrelated work.
- [x] Baseline captured for the one pre-existing unrelated failure (`mcp-code-mode` parent-skill-check) to avoid misattributing it.

### Rollback Procedure

1. If deep review finds an unresolved P0, do not merge; return to `/speckit:plan` for remediation.
2. Remediate on the same worktree branch, re-run affected suites.
3. Re-review before any merge decision.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Branch deletion / worktree removal if abandoned; no shared-state cleanup required.
<!-- /ANCHOR:enhanced-rollback -->
