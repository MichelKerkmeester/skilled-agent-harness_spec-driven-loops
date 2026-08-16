---
title: "Verification Checklist: Worktree/Branch Naming Overhaul [template:level-3/checklist.md]"
description: "Level 3 verification checklist for the naming overhaul: grammar, numbering, validators, pre-push, migration helper, docs rewrite, and packet conformance."
trigger_phrases:
  - "verification"
  - "checklist"
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
    recent_action: "Author the Level 3 verification checklist for the naming overhaul"
    next_safe_action: "Verify every P0/P1 item with concrete evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Worktree/Branch Naming Overhaul

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` includes the frozen grammar, numbering rules, REQ table, success criteria, risk matrix, and user stories.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes architecture, dependency graph, critical path, milestones, and an ADR summary.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `plan.md` lists the allocator validators, git primitives, self-test harness, and canonical packet templates as green.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks
  - **Evidence**: `bash -n` on `worktree-naming.sh`, `pre-push`, and `migrate-legacy-branch-names.sh` all report OK.
- [x] CHK-011 [P0] Validators stay sourceable with no `set -e` leak
  - **Evidence**: a scratch-shell caller survives a failing command after `source`; `command -v is_valid_branch`/`is_wrapper_branch`/`is_backup_branch`/`is_remote_push_allowlisted` all resolve.
- [x] CHK-012 [P1] Validators are pure predicates with no side effects
  - **Evidence**: all validator functions return 0/1 and touch no filesystem or git state.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `worktree-naming.sh` keeps the existing mkdir-lock / high-water pattern; strict mode stays direct-exec-only like the previous version.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Validators accept the new grammar and reject owner-first + malformed
  - **Evidence**: scratch-shell proof — accepts `worktrees/007-foo`, `branches/003-bar`, `skilled/v4.0.0.0`, `main`, `backup/anything`, `work/x/y`; rejects `sk-doc/0131-foo`, `worktrees/7-foo`, `worktrees/007-Bad_slug`.
- [x] CHK-021 [P0] `is_valid_nnn` is 3-digit base-10 001..999
  - **Evidence**: accepts `001`, `007`, `099`, `100`, `999`; rejects `000`, `40`, `1000`, `abc`.
- [x] CHK-022 [P0] No-skip allocation after a delete
  - **Evidence**: sandbox transcript — allocate 001; create 001+002+003; delete 002; allocate returns 004 (never 002/003).
- [x] CHK-023 [P0] `worktrees/` and `branches/` counters are independent
  - **Evidence**: `worktrees/003` and `branches/003` coexist; branches allocate returns 001 with worktrees numbers in use.
- [x] CHK-024 [P0] Scan seeds from high-water + refs + registered worktrees
  - **Evidence**: remote `worktrees/050` seeds 051; remote `branches/060` seeds 061; registered `.worktrees/004-*` seeds 005.
- [x] CHK-025 [P1] Boundary at 999 refuses allocation
  - **Evidence**: `allocate_number` with high-water `999` returns rc 1 and empty output; preview at `998` prints `999`.
- [x] CHK-026 [P1] Self-test harness passes
  - **Evidence**: `worktree-naming.test.sh` → `PASS=65 FAIL=0`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Allocator API matches the frozen contract
  - **Evidence**: `create <slug> [base]`, `create-branch <slug> [base]`, `allocate [worktrees|branches]` all exercised in the sandbox.
- [x] CHK-031 [P0] Pre-push gates behave per the contract
  - **Evidence**: sandbox hook feed — `backup/safety-ref` reaches the permission gate; `work/x/y` blocked as a launch-wrapper ref; `sk-doc/0131-foo` blocked as malformed; `worktrees/007-foo`/`branches/003-bar` pass naming and are gated on permission.
- [x] CHK-032 [P1] Migration helper written and never executed
  - **Evidence**: `migrate-legacy-branch-names.sh --dry-run` prints a per-pair plan against the current worktrees; no rename commands were run during the task.
- [x] CHK-033 [P1] Remote-push-permission gate unweakened
  - **Evidence**: non-allowlisted new/update pushes still blocked without `SPECKIT_ALLOW_REMOTE_PUSH=1`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded secrets
  - **Evidence**: `grep -rn` over all changed files finds no credentials or tokens; only shell/doc content present.
- [x] CHK-041 [P0] No secrets introduced into the migration helper
  - **Evidence**: `migrate-legacy-branch-names.sh` touches only branch names, dirs, and git rename commands.
- [x] CHK-042 [P1] Destructive commands are operator-gated
  - **Evidence**: the migration helper's git mutations run only when the operator executes it without `--dry-run`.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] No owner-first grammar references remain in the changed docs
  - **Evidence**: grep over `AGENTS.md` + the sk-git tree returns only structural paths (`owner-first-worktree-tooling/`, `owner-first-worktree-naming.md`), the migration helper's legacy-grammar docs, historical changelogs, GitHub API `{owner}` placeholders, and self-test descriptions asserting rejection.
- [x] CHK-051 [P0] Root agent files describe the new grammar and `create-branch`
  - **Evidence**: `AGENTS.md` Git Workspace Safety rows updated (Branch grammar, Allocate-never-count, No direct branch creation).
- [x] CHK-052 [P1] References, feature catalog, and playbook updated
  - **Evidence**: `references/*`, `scripts/README.md`, `assets/worktree-checklist.md`, `feature-catalog/*`, `manual-testing-playbook/*` rewritten to the new grammar.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All changes confined to the approved file scope
  - **Evidence**: `git status --porcelain` shows only the named scripts, docs, and the 022 packet; `.opencode/package.json` / `package-lock.json` are clean.
- [x] CHK-061 [P1] No scratch/temp files left behind
  - **Evidence**: all verification ran in throwaway `mktemp -d` sandboxes that were removed.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
  - **Evidence**: `decision-record.md` includes ADR-001..ADR-005 with context, decision, alternatives, consequences, five-checks, and implementation notes.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
  - **Evidence**: `decision-record.md` ADR-001..ADR-005 each carry a `**Status** | Accepted` Metadata row.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: ADR-001/002 compare per-owner counters, shared clone-wide counter, and back-filling; rejected per the frozen contract.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Allocations complete within the lock's retry budget
  - **Evidence**: `worktree-naming.test.sh` concurrent-allocation assertions pass; no timeouts observed.
- [x] CHK-111 [P1] The self-test harness finishes quickly
  - **Evidence**: harness completes in seconds inside a throwaway repo (`mktemp -d`).

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented
  - **Evidence**: `plan.md` §7 and §L2:ENHANCED ROLLBACK describe `git checkout` on the touched files; no refs/worktrees mutated.
- [x] CHK-121 [P1] Migration helper is operator-gated and dry-run-first
  - **Evidence**: `migrate-legacy-branch-names.sh --dry-run` prints the plan; no rename commands run during the task.

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Template source comments present
  - **Evidence**: all six packet files include `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE` comments.

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Related document links are local
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` reference local packet files.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-150 [P0] Packet is ready for strict validation
  - **Evidence**: `validate.sh specs/sk-git/022-worktree-branch-naming-overhaul --strict` target: Errors 0 Warnings 0.

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-16
**Verified By**: sk-git implementation session
**ADRs**: 5 documented, 5 accepted

<!-- /ANCHOR:summary -->
