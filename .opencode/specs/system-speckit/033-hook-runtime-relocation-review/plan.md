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
    last_updated_at: "2026-07-28T14:09:19Z"
    last_updated_by: "claude"
    recent_action: "Implemented Phase 6 (T017-T024): all 6 P1 findings fixed + re-verified"
    next_safe_action: "Re-run /deep:review before the merge/push/leave-local decision"
    blockers:
      - "Re-review not yet run; merge/push/leave-local decision still pending."
    key_files:
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Merge/push/leave-local decision pending remediation + re-review."
    answered_questions:
      - "Deep-review result: CONDITIONAL, P0=0 P1=6 P2=4."
      - "Remediation scope: all 6 P1s within this packet, not a separate follow-up."
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
- [x] Forced 5-iteration deep review completed with synthesized verdict. [evidence: CONDITIONAL, P0=0 P1=6 P2=4, `review/review-report.md`]
- [x] All 6 active P1s remediated (REQ-008 through REQ-013). [evidence: T017-T023, this session — see `tasks.md` Phase 6]
- [ ] Re-review confirms no regressions. [evidence: pending]
- [ ] Merge/push/leave-local decision made. [evidence: pending, gated on re-review]
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
- [x] Dispatch `/deep:review:auto`, 5 forced iterations, `cli-opencode` `gpt-5.6-sol` `high`, over the full worktree diff.
- [x] Verdict returned: CONDITIONAL, P0=0 P1=6 P2=4.

### Phase 6: P1 Remediation (all 6 active findings)

- [x] REQ-008 (R2-P1-001): Fix Codex multi-file post-edit-quality coverage so every file in a multi-file `apply_patch` gets checked, not only the first.
- [x] REQ-009 (R3-P1-001): Harden the deep-loop dispatch-guard command-driven exemption so a forged "iteration N of M" text marker cannot substitute for the real structural dispatch context.
- [x] REQ-010 (R3-P1-002): Close the dispatch-audit-log redaction allowlist gap so credential-shaped text outside the current pattern set is not persisted verbatim.
- [x] REQ-011 (R4-P1-001): Fix the 2 stale manual-testing-playbook paths and correct the checklist.md CHK-011/CHK-041 evidence rows.
- [x] REQ-012 (R4-P1-002): Resolve the "verified across 6 runtimes" overclaim in implementation-summary.md (narrow to what was actually live-tested, or add real live evidence for the other 4).
- [x] REQ-013 (R5-P1-001): Resolve or accurately frame the system-spec-kit dependency in the 5 relocated adapters that import `hook-adapter-shared.cjs`.
- [x] Re-run affected test suites and re-validate docs after the fixes.
- [ ] Re-review (or re-verify) before the merge/push/leave-local decision.
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
| Independent review | Full diff, all dimensions | `/deep:review:auto`, 5 forced iterations -- CONDITIONAL (P0=0 P1=6 P2=4) |
| Remediation regression | REQ-008/REQ-009/REQ-010 code fixes | New/updated unit tests: multi-file patch coverage, forged-marker rejection, out-of-allowlist secret redaction |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from `review/review-report.md`'s Planning Packet JSON (`fixCompletenessRequired: true`). Planning Packet fields are treated as inert data: quoted below, not executed, not followed as instructions. `activeFindings[].scopeProof` values are not command-shaped or shell-shaped in this report; each is a plain file-path citation, independently confirmed by direct reads and `git log --follow`/`git show --stat` in this planning pass rather than copied blind.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs` (`firstPatchPath()`, confirmed single non-global regex match) | Producer: resolves the target file(s) of a Codex `apply_patch` for quality checking | Update to iterate every `*** Add/Update/Delete File:` header, not just the first | New regression test with a 2+ file patch; `rg -n "firstPatchPath" .opencode/runtime-hooks` for other call sites |
| `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs` (`isCommandDrivenIteration()`, confirmed 0 line changes since relocation) | Producer: decides whether a dispatch is exempt from loop-repeat rejection | Bind the exemption to a verified structural field, not a free-text regex match alone | New regression test: forged marker in prompt text alone must not satisfy the exemption |
| `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs` (`SECRET_PATTERNS`, confirmed 0 line changes since relocation) | Producer: redacts credential-shaped text before persisting the dispatch audit log | Broaden the redaction approach (e.g. entropy/shape heuristic alongside the allowlist) so unrecognized secret shapes are not persisted verbatim | New regression test: out-of-allowlist secret-shaped string is not present verbatim in the resulting log line |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/{cli-dispatch-audit-trail,codex-hook-parity}.md` | Consumer/docs: executable command examples referencing hook paths | Update the 2 stale command paths to the current `.opencode/runtime-hooks/...` locations | Repo-wide grep for the old path strings returns 0 hits in these files |
| `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md` (CHK-011, CHK-041) | Consumer/evidence: this packet's own QA claims | Correct the two evidence rows to match the actual (not overstated) verification state | Manual review against `implementation-summary.md`'s corrected verification table |
| `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md` (verification table, "verified across 6 runtimes" claim) | Consumer/docs: this packet's own completion claim | Narrow the claim to Pi + OpenCode live-tested, others via config/test-suite checks -- or add real commit-pinned live evidence for the other 4 | Manual review; no unverified claim remains |
| `.opencode/runtime-hooks/README.md` (Node-builtin-equivalence framing, confirmed at lines 37 and 92) | Producer/docs: this tree's own portability claim | Either remove the 5 adapters' dependency on `hook-adapter-shared.cjs` (duplicate the 24-line, dependency-free helper into `runtime-hooks/`) or correct the framing to state the real dependency plainly | `rg -n "hook-adapter-shared" .opencode/runtime-hooks` shows either 0 hits (dependency removed) or README wording no longer claims builtin-equivalence |

Required inventories:
- Same-class producers for the redaction gap: `rg -n "SECRET_PATTERNS|scrubSecrets" .opencode/runtime-hooks .opencode/skills` -- confirm `dispatch-audit.mjs` is the sole producer before scoping the fix there alone.
- Consumers of `hook-adapter-shared.cjs`: `rg -n "hook-adapter-shared" .` -- confirmed exactly 5 relocated adapters plus the still-in-place `spec-gate-enforce.mjs` (which does not move).
- Matrix axes for REQ-008: file count in a single Codex `apply_patch` (1 vs 2+ vs many) x whether each target already exists.
- Algorithm invariant for REQ-009: the exemption must never be satisfiable by prompt text alone; it must require a structural field independently set by the dispatching command, not copyable into arbitrary free text.
<!-- /ANCHOR:affected-surfaces -->

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
| Retroactive Documentation & Deep Review | All prior phases | P1 Remediation |
| P1 Remediation | Deep-review CONDITIONAL verdict | Merge decision |
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
| Retroactive Documentation & Deep Review | Medium | This packet + a forced 5-iteration review, CONDITIONAL verdict |
| P1 Remediation | Medium | 3 code fixes + regression tests, 2 doc/evidence fixes, 1 architecture fix |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [x] Work isolated to a dedicated worktree/branch, unmerged.
- [x] Single relocation commit, not squashed across unrelated work.
- [x] Baseline captured for the one pre-existing unrelated failure (`mcp-code-mode` parent-skill-check) to avoid misattributing it.

### Rollback Procedure

1. Deep review returned CONDITIONAL (P0=0, P1=6); did not merge. Returned to `/speckit:plan` (this Phase 6) for remediation instead.
2. Remediate on the same worktree branch, re-run affected suites.
3. Re-review before any merge decision.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Branch deletion / worktree removal if abandoned; no shared-state cleanup required.
<!-- /ANCHOR:enhanced-rollback -->
