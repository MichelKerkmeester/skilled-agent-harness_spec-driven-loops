---
title: "Implementation Plan: Remote Branch Push Permission Policy"
description: "Allowlist mechanism -> pre-push hook permission gate -> test suite update -> sk-git skill docs -> root CLAUDE.md sync."
trigger_phrases:
  - "implementation"
  - "plan"
  - "remote branch policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:01:41Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored 5-phase plan"
    next_safe_action: "Execute Phase 1 tasks"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Remote Branch Push Permission Policy

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (git hooks + sk-git scripts), Markdown (skill docs) |
| **Framework** | None — plain POSIX-ish bash, `set -euo pipefail` style matching existing hooks |
| **Storage** | One new plain-text config file (`remote-branch-allowlist.txt`) |
| **Testing** | `.opencode/scripts/git-hooks/tests/pre-push.test.sh` (bash test harness, isolated fixture repo) |

### Overview
Extend the existing naming-only pre-push hook with a second, independent permission gate driven by a small allowlist (hardcoded `main`/`skilled/v*` + an operator-editable file), wire a scoped exception for the continuous-integration autosync's live branch, update the hook's test suite for the resulting behavior changes, then document the policy as MANDATORY agent behavior in sk-git's SKILL.md and cross-link it from the affected reference docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Two operator-decided forks resolved (ask-every-push; CLAUDE.md sync) — research.md §6
- [x] Architecture decisions recorded (decision-record.md ADR-001/002/003)

### Definition of Done
- [x] `pre-push.test.sh` passes in full after the rewrite (`PASS=21 FAIL=0`)
- [x] Manual dry-run of a real push confirms block-by-default + bypass-var + allowlist behavior end to end
- [x] SKILL.md, references, feature-catalog, install-git-hooks.sh, and root CLAUDE.md all reflect the new rule
- [x] `checklist.md` fully verified with evidence; `validate.sh --strict` passes on this spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent, composable gates inside one existing git hook (naming gate unchanged in spirit; permission gate new), backed by a shared validator script that already gets sourced by that hook.

### Key Components
- **`worktree-naming.sh` §3 VALIDATORS**: new `is_remote_push_allowlisted()` + `_wn_remote_allowlist_file()`, new CLI subcommand `validate-remote-allowlist`
- **`remote-branch-allowlist.txt`**: operator-editable allowlist extension (comment-only template; `main`/`skilled/v*` stay hardcoded in the function, never solely in this file)
- **`pre-push` hook**: single per-ref loop now runs BOTH gates (naming for new branches only; permission for every push), each independently bypassable
- **sk-git `SKILL.md`**: MANDATORY behavioral rule mirroring the existing "Workspace Choice Enforcement" pattern

### Data Flow
`git push` → git invokes `pre-push` with ref lines on stdin → hook sources `worktree-naming.sh` once → per ref: naming gate (new branches only) → permission gate (allowlist check → bypass-var check → autosync-exception check → BLOCK) → hook exit code 0/1 → git proceeds or aborts the whole push.
<!-- /ANCHOR:architecture -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting any task below, confirm: the prior phase's tasks are all `[x]` in `tasks.md`, `pre-push.test.sh` is green from the last run, and no uncommitted change conflicts with the file this task touches.

### Execution Rules (TASK-SEQ / TASK-SCOPE)
- TASK-SEQ: execute phases in order (1→5) — Phase 2 sources functions Phase 1 adds; Phase 3 tests behavior Phase 2 implements.
- TASK-SCOPE: touch only the file(s) named on the task line; a task that seems to need an out-of-scope file is a signal to stop and re-check this plan, not to expand scope silently.

### Status Reporting Format
Report each phase as: `Phase N: <done|blocked> — <one-line evidence, e.g. test count or file diff>`.

### Blocked Task Protocol
If a task is BLOCKED (a prerequisite fails, a test can't be made to pass without weakening a P0 requirement), stop, do not mark it `[x]`, and follow this doc's §7 Rollback Plan rather than pushing forward with a weakened requirement.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Allowlist mechanism (foundation for everything else)
- [x] Add `_wn_remote_allowlist_file()` + `is_remote_push_allowlisted()` to `worktree-naming.sh` §3 VALIDATORS
- [x] Add `validate-remote-allowlist <branch>` CLI dispatch + usage line
- [x] Create `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` (comment-only template)
- [x] Manually smoke-test the function via the CLI (`bash worktree-naming.sh validate-remote-allowlist main` etc.) before wiring the hook

### Phase 2: Pre-push hook permission gate
- [x] Restructure `pre-push`: decouple `SPECKIT_SKIP_PREPUSH_NAMING` from the whole-script early exit (it must only skip the naming portion, not the new gate)
- [x] Fold the permission gate into the existing per-ref loop (allowlist → `SPECKIT_ALLOW_REMOTE_PUSH` → scoped autosync exception → BLOCK)
- [x] Update the hook's own header comment (bypass vars, allowlist file path)
- [x] Update `install-git-hooks.sh`'s pre-push description line

### Phase 3: Test suite update + verification
- [x] Update the 4 existing scenarios whose expected rc changes (research.md §5 table)
- [x] Add new scenarios: allowlist-file custom pattern, autosync live-branch exemption (positive), autosync exemption negative/scoped case, `main` always-allowed (new + update forms), `SPECKIT_ALLOW_REMOTE_PUSH` bypass on both new+update refs
- [x] Run `pre-push.test.sh`; iterate until `PASS=<N> FAIL=0`
- [x] Manual dry-run: `git push --dry-run` (or an isolated scratch remote) against a non-allowlisted branch to confirm the operator-facing message reads clearly

### Phase 4: sk-git skill documentation
- [x] `SKILL.md` §3: new "Remote Push Permission Enforcement" subsection (mirrors "Workspace Choice Enforcement")
- [x] `SKILL.md` §4 ALWAYS: new item #18
- [x] New `references/remote-branch-policy.md` (full contract doc)
- [x] `references/finish-workflows.md` Option 2: push snippet gets `SPECKIT_ALLOW_REMOTE_PUSH=1` + one-line note
- [x] `references/continuous-integration.md`: cross-link the scoped exception
- [x] `feature-catalog/feature-catalog.md`: new capability row

### Phase 5: Root CLAUDE.md sync + close-out
- [x] Add row to root `CLAUDE.md` §5 Git Workspace Safety table
- [x] Write `implementation-summary.md` with evidence (test output, files changed)
- [x] Run `validate.sh --strict` on this spec folder; reconcile `checklist.md`
<!-- /ANCHOR:phases -->

---

## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `pre-push` hook | Naming-only gate | Add permission gate | `pre-push.test.sh` full run |
| `worktree-naming.sh` | Naming validators + CLI | Add allowlist validator + CLI subcommand | CLI smoke test + hook test coverage |
| `git-sync.sh` / autosync | Publishes to live branch via `git push` | Unchanged (consumer of the new gate's exception) | Negative + positive autosync tests in `pre-push.test.sh` |
| `finish-workflows.md` Option 2 | Explicit push-and-PR menu choice | Push snippet gets bypass var | Doc review; no runtime test (doc-only) |
| `SKILL.md` | Behavioral contract for the AI | New MANDATORY subsection + ALWAYS item | Doc review against existing "Workspace Choice Enforcement" style |
| root `CLAUDE.md` §5 table | Summary pointer table | New row | Doc review |

Required inventories:
- Same-class producers of a `git push` to origin: `rg -n 'git push' .opencode/skills/sk-git .opencode/bin .opencode/scripts` — confirms `git-sync.sh`, `finish-workflows.md`, and manual operator use are the only producers; all three are addressed by this plan.
- Consumers of the naming gate's existing env vars/functions: `rg -n 'SPECKIT_SKIP_PREPUSH_NAMING|is_valid_branch|is_wrapper_branch' .opencode` — confirms only `pre-push` and its test file reference these; no other consumer to update.
- Matrix axes for the permission gate: {new vs. update} × {allowlisted vs. not} × {bypass var set vs. not} × {autosync-exception applicable vs. not} = 16 logical combinations; the test suite (Phase 3) covers the representative subset that actually differs in outcome.
- Algorithm invariant: a branch is exempt from the permission gate if and only if (`main` or `skilled/v*`) OR (matches a pattern in `remote-branch-allowlist.txt`) OR (`SPECKIT_ALLOW_REMOTE_PUSH=1` for this invocation) OR (`SPECKIT_AUTOSYNC=1` AND branch equals `$SPECKIT_LIVE_BRANCH` exactly). Adversarial cases: missing allowlist file (must narrow, not widen — REQ-003), `SPECKIT_AUTOSYNC=1` set but wrong branch (must still gate — REQ-004 negative case), multi-ref push where only one ref is exempt (each ref evaluated independently in the same loop pass).

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hook unit/scenario tests | Every branch of the permission gate + regression coverage of the naming gate | `pre-push.test.sh` (isolated fixture repo, no real refs touched) |
| CLI smoke test | `is_remote_push_allowlisted` in isolation | `bash worktree-naming.sh validate-remote-allowlist <branch>` |
| Manual dry-run | Operator-facing message clarity | `git push --dry-run` against a non-allowlisted branch in a scratch/isolated context |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `worktree-naming.sh` existing validators (`is_valid_branch`, `is_wrapper_branch`) | Internal | Green — already in place, unmodified in shape | New gate is additive; naming gate keeps working even if Phase 1 stalls |
| `git-sync.sh` / continuous-integration contract | Internal | Green — read and understood (research.md §3) | Getting the autosync exception wrong would regress a shipped feature; Phase 3's negative test is the guard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `pre-push.test.sh` cannot be made to pass without weakening a P0 requirement; or a live smoke-test shows the hook blocking `main`/release pushes unexpectedly.
- **Procedure**: `git revert` the commits from Phases 1-2 (hook + validator changes) first — this alone restores naming-only behavior with zero permission friction. Phases 4-5 (docs) can be reverted independently and don't affect runtime behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│  Allowlist  │     │  Hook Gate  │     │    Tests    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                          ┌─────▼──────┐     ┌─────────────┐
                                          │   Phase 4  │────►│   Phase 5   │
                                          │ Skill Docs │     │ Root Sync   │
                                          └────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (allowlist fn + config) | None | `is_remote_push_allowlisted()` | Phase 2 |
| Phase 2 (hook gate) | Phase 1 | Working permission gate | Phase 3 |
| Phase 3 (tests) | Phase 2 | Green test suite | Phase 5 (evidence for close-out) |
| Phase 4 (skill docs) | Phase 1-2 (describes real behavior) | Updated SKILL.md/references | Phase 5 |
| Phase 5 (root sync + close-out) | Phase 3, Phase 4 | `implementation-summary.md`, CLAUDE.md row, strict validate | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Allowlist mechanism** - CRITICAL (everything downstream sources this function)
2. **Phase 2: Pre-push hook permission gate** - CRITICAL (the actual enforcement)
3. **Phase 3: Test suite update + verification** - CRITICAL (no completion claim without green tests)

**Total Critical Path**: Phases 1→2→3, sequential (each depends on the previous)

**Parallel Opportunities**:
- Phase 4 (skill documentation) can start as soon as Phase 2's hook behavior is stable, in parallel with Phase 3's test authoring — both were in practice done back-to-back in this session since a single author was doing both.
- Phase 5's CLAUDE.md row and its implementation-summary.md can be drafted in parallel; only the final `validate.sh --strict` run needs everything else done first.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Allowlist mechanism built | CLI smoke test resolves `main`/`skilled/v4.0.0.0`/arbitrary branch correctly | End of Phase 1 |
| M2 | Permission gate enforced | Manual hook invocation blocks a non-allowlisted branch and the bypass var clears it | End of Phase 2 |
| M3 | Test suite green | `pre-push.test.sh`: `PASS=<N> FAIL=0`, including allowlist/autosync/bypass coverage | End of Phase 3 |
| M4 | Policy documented | SKILL.md, references, feature-catalog reflect the new rule | End of Phase 4 |
| M5 | Spec folder closed out | `validate.sh --strict` passes; checklist fully verified | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` — ADR-001 (two-layer enforcement over GitHub rulesets), ADR-002 (hardcoded-defaults-plus-file allowlist format), ADR-003 (scoped continuous-integration autosync exception).
