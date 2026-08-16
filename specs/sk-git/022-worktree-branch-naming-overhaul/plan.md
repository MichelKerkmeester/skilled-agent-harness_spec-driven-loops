---
title: "Implementation Plan: Worktree/Branch Naming Overhaul [template:level-3/plan.md]"
description: "Level 3 implementation plan: two flat numbered namespaces, per-namespace allocator + validators, pre-push gate update, dry-run migration helper, self-test rewrite, and full docs rewrite."
trigger_phrases:
  - "implementation"
  - "plan"
  - "worktree"
  - "branch"
  - "naming"
  - "grammar"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/022-worktree-branch-naming-overhaul"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Author the Level 3 plan for the naming overhaul"
    next_safe_action: "Execute the plan phases in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Worktree/Branch Naming Overhaul

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash (allocator + validators + hook + helper), git, markdown docs |
| **Framework** | sk-git skill; pre-push hook sources the validator file |
| **Storage** | Common git dir (lock + per-namespace high-water files); `.worktrees/` directories |
| **Testing** | Hermetic self-test harness + packet `validate.sh --strict` + sandbox proofs |

### Overview
Replace the owner-first `OWNER/NNNN-SLUG` branch grammar with two flat spec-style namespaces (`worktrees/NNN-slug`, `branches/NNN-slug`) each numbered independently 001..999 with no skip/reuse. Rewrite the allocator and its sourceable validators, update the pre-push gate, ship a dry-run migration helper, rewrite the self-test harness, and rewrite every doc that described the old grammar.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Frozen spec read; grammar and numbering rules immutable.
- [x] File scope locked to the allocator, pre-push, migration helper, named docs, and the 022 packet.
- [x] Existing allocator, hook, and self-test harness contract read.

### Definition of Done
- [x] Allocator API matches the contract (`create`, `create-branch`, `allocate [worktrees|branches]`).
- [x] Validators accept/reject per the acceptance proof list; sourceable with no `set -e` leak.
- [x] Pre-push sources validators; `backup/*` not mis-flagged; permission gate unweakened.
- [x] Migration helper written with `--dry-run`; idempotent; not executed.
- [x] Self-test harness passes; `bash -n` clean; packet `--strict` 0/0.
- [x] `.opencode/package.json` / `package-lock.json` untouched.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two flat per-namespace counters (`worktrees/`, `branches/`) guarded by a single mkdir-based lock in the common git dir, with per-namespace high-water files. The allocator file doubles as the sourced validator library for the pre-push hook.

### Key Components
- **`worktree-naming.sh`**: per-namespace scan/allocate, validators, `create`/`create-branch`/`create-detached`, CLI dispatch.
- **`pre-push`**: sources the validators; `is_wrapper_branch` checked first; `backup/*` reaches the permission gate.
- **`migrate-legacy-branch-names.sh`**: dry-run-first renumberer of legacy owner-first pairs into `worktrees/NNN-slug`.
- **`worktree-naming.test.sh`**: hermetic harness for grammar, scan, no-skip, concurrent + stale-lock allocation, creators.

### Data Flow
`worktree-naming.sh allocate/scan-max` reads the namespace high-water file + matching local/remote refs + (worktrees/) registered worktree basenames under the lock; `create`/`create-branch` allocate then run `git worktree add -b` / `git branch`; the pre-push hook sources the same file for its validators.

### Component Diagram
```
worktree-naming.sh  ──create/create-branch──>  git worktree / git branch
       │                                              │
       └──sourced by──>  pre-push (naming + permission gates)
       │
       └──tested by──>  worktree-naming.test.sh (throwaway repo)
```

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Allocator + Validators (Day 1 AM)
- [x] Rewrite the grammar header and the per-namespace numbering model.
- [x] Replace validators: drop `is_valid_owner`/`load_skill_ids`/`is_valid_nnnn`; add `is_valid_nnn` and `is_backup_branch`; extend `is_valid_branch`; rework `is_valid_pair`.
- [x] Rework scan/allocate for two per-namespace counters with separate high-water files and the shared lock; update `create`/`create-branch`/`allocate` dispatch and usage.

### Phase 2: Pre-Push Hook (Day 1 PM)
- [x] Update `_expected_grammar`; check `is_wrapper_branch` first; ensure `backup/*` passes the naming gate; reword messages.

### Phase 3: Migration Helper (Day 2 AM)
- [x] Write `migrate-legacy-branch-names.sh` with `--dry-run`; scan legacy owner-first pairs; renumber to `worktrees/001..`; idempotent + collision-safe.

### Phase 4: Self-Test Harness (Day 2 PM)
- [x] Rewrite `worktree-naming.test.sh` for the new grammar and per-namespace no-skip allocation.

### Phase 5: Docs Rewrite (Day 3)
- [x] Rewrite `SKILL.md`, `AGENTS.md` rows, references, support docs, feature catalog, manual-testing-playbook scenarios.

### Phase 6: Packet + Verification (Day 4)
- [x] Author the 022 packet docs; regenerate metadata; run `bash -n`, self-tests, sandbox proofs, migrate dry-run, and `validate.sh --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target |
|-----------|-------|-------|-----------------|
| Syntax | All three scripts | `bash -n` | No syntax errors |
| Self-test | Allocator + validators | `worktree-naming.test.sh` | PASS=65 FAIL=0 |
| Validator proof | Accept/reject matrix | Scratch-shell source | New grammar accepted; owner-first + malformed rejected |
| No-skip sandbox | Allocation semantics | Throwaway git repo (`GIT_CONFIG_GLOBAL=/dev/null`) | delete-then-allocate returns max+1 |
| Hook gate | Pre-push behavior | Sandbox pre-push feed | `backup/*` reaches permission gate; wrapper blocked; owner-first blocked |
| Packet | Docs conformance | `validate.sh --strict` | Errors 0 Warnings 0 |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `worktree-naming.sh` validators | Internal | Green | Pre-push naming + permission gates unavailable |
| `git` worktree/branch primitives | External | Green | Allocator cannot create branches/dirs |
| Self-test harness | Internal | Green | Numbering regressions go undetected |
| Canonical packet templates | Internal | Green | `validate.sh --strict` cannot reach 0/0 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed script or doc regresses behavior.
- **Procedure**: `git checkout` on the touched files; no git refs/worktrees were mutated (the migration helper was never executed). The old single `worktree-number.highwater` is superseded by the two per-namespace files and regenerated on the next allocation.
- **Data Reversal**: None — no history rewriting, no branch/worktree state changed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Allocator + Validators | Frozen spec read | Pre-Push Hook |
| Pre-Push Hook | Allocator + Validators | Migration Helper |
| Migration Helper | Allocator + Validators | Self-Test Harness |
| Self-Test Harness | Allocator + Validators | Docs Rewrite |
| Docs Rewrite | Allocator + Validators | Packet + Verification |
| Packet + Verification | All five phases | Completion |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Allocator + Validators | High | 100 minutes |
| Pre-Push Hook | Medium | 25 minutes |
| Migration Helper | Medium | 35 minutes |
| Self-Test Harness | High | 40 minutes |
| Docs Rewrite | High | 150 minutes |
| Packet + Verification | Medium | 70 minutes |
| **Total** | | **420 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Frozen spec read.
- [x] Allowed file scope confirmed.
- [x] `.opencode/package.json` / `package-lock.json` clean.

### Rollback Procedure
1. `git checkout -- <touched files>` to revert any single change.
2. Re-run `bash -n` and the self-test harness.
3. Re-run packet `validate.sh --strict`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: High-water files regenerate on the next allocation; no refs or worktrees are mutated by this task.

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
worktree-naming.sh ──> pre-push (sources validators)
        │
        ├──> create/create-branch ──> git worktree add -b / git branch
        │
        └──> worktree-naming.test.sh (hermetic proof)
migrate-legacy-branch-names.sh ──> operator-run renumbering (dry-run first)
packet docs ──> validate.sh --strict (0/0)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Allocator + validators | Frozen spec | New grammar + numbering | Pre-push, harness, docs |
| Pre-push hook | Validators | Naming + permission gates | Origin pushes |
| Migration helper | Allocator | Renumbering plan | Operator migration |
| Self-test harness | Allocator | Green/red proof | Docs claim |
| Packet docs | All artifacts | Valid 0/0 packet | Completion claim |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read frozen spec** - 10 minutes - CRITICAL
2. **Rewrite allocator + validators** - 100 minutes - CRITICAL
3. **Rewrite self-test harness + prove** - 60 minutes - CRITICAL
4. **Rewrite pre-push + sandbox proof** - 30 minutes - CRITICAL
5. **Rewrite docs** - 150 minutes - CRITICAL
6. **Validate packet 0/0** - 30 minutes - CRITICAL

**Total Critical Path**: 380 minutes

**Parallel Opportunities**:
- Migration helper and pre-push can proceed once the allocator API is stable.
- Feature-catalog and playbook rewrites are independent of one another.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Allocator + validators rewritten | API + validator proof green | Allocator phase |
| M2 | Pre-push + migration helper done | Sandbox hook proof + dry-run plan | Pre-push phase |
| M3 | Self-test + docs rewritten | Harness FAIL=0; docs grep clean | Docs phase |
| M4 | Packet valid | `validate.sh --strict` 0/0 | Verification phase |

<!-- /ANCHOR:milestones -->
---

## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist
- [x] Confirm the frozen grammar + numbering rules from `spec.md`.
- [x] Confirm the allowed file scope (allocator, pre-push, migration helper, named docs, 022 packet).
- [x] Read the existing allocator, pre-push hook, and self-test harness before editing.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Implement in order: allocator → validators → pre-push → migration helper → harness → docs → packet. |
| TASK-SCOPE | Touch only the files named in `spec.md` §3 Files to Change; no adjacent cleanup. |
| SOURCEABLE | Never leak `set -e` into the pre-push caller when sourcing the validators. |
| NO-RUN | Write `migrate-legacy-branch-names.sh` but never execute it. |

### Status Reporting Format

`<phase> <done/total> — <last completed artifact> — <next step>`

Example: `docs 2/5 — references rewritten — feature-catalog next`.

### Blocked Task Protocol

On a failing check (syntax, harness, or validation): stop forward progress, reproduce the exact failure, fix the root cause, and re-run the same check before continuing. If the failure cannot be resolved after two attempts, escalate with evidence.


See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Two flat numbered namespaces instead of owner-first prefixes | Git-UI branch tree reads as clean folders; worktree vs dedicated branches visible |
| ADR-002 | Independent per-namespace counters with no-skip allocation | `worktrees/003` and `branches/003` coexist; freed numbers never reissued |
| ADR-003 | Validators stay sourceable; strict mode scoped to direct execution | No `set -e` leak into the pre-push caller |
| ADR-004 | `backup/*` passes the naming gate; wrapper refs checked first | Backup gated on permission; wrapper never pushed |
| ADR-005 | Migration helper is dry-run-first and never executed by tooling | Operator reviews the plan before any live rename |
