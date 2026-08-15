---
title: "Tasks: git hook gate hardening"
description: "Task list for gate hardening and safe SessionStart reconciliation of the primary live checkout."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
  - "session start primary reconcile"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T14:57:27Z"
    last_updated_by: "opencode"
    recent_action: "Completed the second work item and all task-scoped verification"
    next_safe_action: "Review the scoped diff; no real repository push was performed"
---
# Tasks: git hook gate hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all named hooks, shared libraries, publisher code, metadata checker, and reference docs [30m] [Evidence: `pre-push`, `pre-commit`, `post-commit`, and `git-sync.sh` reads]
- [x] T002 Create the new Level 2 phase packet from the adjacent sibling and reset it to Planned [15m] [Evidence: `specs/sk-git/021-hook-gate-hardening`]
- [x] T003 Inventory each gate's autosync execution, exemption, diagnostics, and silent-block risk [20m] [Evidence: gate map in `continuous-integration.md`]
- [x] T004 Define non-Git command-stub simulations for skill metadata, mass deletion, and clean publication [20m] [Evidence: `bash` function stubs exercised real hook and publisher scripts]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add exact live-branch autosync detection and naming coverage (`pre-push`) [15m] [Evidence: first-publication naming simulation exits 0]
- [x] T006 Keep unsafe post-commit regeneration blocked and emit the exact repair command (`pre-push`) [20m] [Evidence: skill-root simulation]
- [x] T007 Capture and classify pre-push stderr (`git-sync.sh`) [25m] [Evidence: real hook diagnostics replayed by publisher]
- [x] T008 Replay loud diagnostics and append gate id plus repair guidance to the durable log (`git-sync.sh`) [20m] [Evidence: `blocked gate=... fix=...` records]
- [x] T009 Harden additional audited silent autosync blocks without weakening safety [20m] [Evidence: `pre-commit` and `post-commit` concern-local control flow]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Document the full gate map and autosync behavior (`continuous-integration.md`, `remote-branch-policy.md`) [25m] [Evidence: lifecycle gate table and exception policy]
- [x] T011 Run `bash -n` on every modified shell script [10m] [Evidence: five exit-0 checks]
- [x] T012 Simulate a skill-root block or repair and capture terminal plus durable-log evidence [20m] [Evidence: loud classified output and `gate=skill-root-metadata`]
- [x] T013 Simulate a mass-deletion block and capture terminal plus durable-log evidence [15m] [Evidence: 101-deletion block and `gate=mass-deletion`]
- [x] T014 Simulate a clean autosync publication and capture success evidence [10m] [Evidence: empty quiet output and `published` log record]
- [x] T015 Generate packet metadata and run strict validation to zero warnings and errors [15m] [Evidence: `validate.sh --strict` reported Errors 0 and Warnings 0]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 tasks across both work items have direct command or file evidence. [Evidence: T001-T028 inline receipts]
- [x] No true safety gate has been weakened or bypassed. [Evidence: dirty, conflict, and classified push-block sandbox paths]
- [x] The final audit table accounts for every gate. [Evidence: `continuous-integration.md` lifecycle gate map]
- [x] Strict packet validation reports zero errors and zero warnings after SessionStart reconciliation is complete. [Evidence: final `validate.sh --strict` output]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:work-item-2 -->
## Work Item 2: SessionStart Primary Reconcile

- [x] T016 Reopen and extend the packet as In Progress without removing prior evidence (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) [20m] [Evidence: second-work-item sections and pending rows]
- [x] T017 Read sibling live-sync scripts, the shared flag resolver, all four runtime startup surfaces, and named references [25m] [Evidence: `.opencode/bin/git-sync.sh:1-273`, `.opencode/bin/git-live-follow.sh:1-206`, and `hook-flags.sh:1-48`]
- [x] T018 Implement the always-zero primary reconciler (`.opencode/bin/git-primary-reconcile.sh`) [45m] [Evidence: primary/live/dirty/lock/timeout/rebase/push/log control flow plus ShellCheck clean]
- [x] T019 Add thin background SessionStart calls (`.claude/settings.json`, `.codex/hooks.json`, `.opencode/plugins/session-cleanup.js`, Pi advisories) [25m] [Evidence: JSON parse passes, detached OpenCode spawn, Pi background shell]
- [x] T020 Document reconcile behavior and `MK_PRIMARY_RECONCILE_DISABLED` (`continuous-integration.md`, `ENV-REFERENCE.md`) [20m] [Evidence: four-script model and hook kill-switch row]
- [x] T021 Validate shell and JSON syntax [10m] [Evidence: `bash -n` and both `JSON.parse` commands exit 0]
- [x] T022 Prove tracked-dirty skip preserves the complete local and remote state in a scratch repository [15m] [Evidence: HEAD `01281b5`, file hash, remote `b1a9764`, and stale tracking ref all unchanged]
- [x] T023 Prove clean behind-only state fast-forwards without pushing in a scratch repository [10m] [Evidence: local reached remote `4ed6b47`; remote unchanged; untracked artifact preserved]
- [x] T024 Prove clean local commits rebase and publish to the scratch remote [15m] [Evidence: local `2bb7686` rebased to `4adc7fa`; bare remote advanced from `4f6b8b5` to `4adc7fa`]
- [x] T025 Prove a rebase conflict aborts cleanly, preserves the local commit, and leaves the scratch remote unchanged [15m] [Evidence: local `ae2a51b` and remote `0c43bd9` unchanged; tracked-clean yes; rebase-state none]
- [x] T026 Prove linked-worktree and `MK_LIVE_SYNC_DISABLED=1` paths are zero-exit no-ops [10m] [Evidence: linked path silent at `6237ea3`; disabled HEAD/tracking `3e6e4ac` unchanged while remote stayed `d1d396e`; per-concern flag also silent]
- [x] T027 Run scoped runtime/code-quality verification and inspect the final diff [20m] [Evidence: ShellCheck and comment hygiene clean; plugin 13/13; TypeScript typecheck pass; stack-folders pass; router-sync 10/10]
- [x] T028 Finalize packet evidence, regenerate metadata, and pass strict validation [20m] [Evidence: `generate-context.js` completed and strict validator reported Errors 0 / Warnings 0]

<!-- /ANCHOR:work-item-2 -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
