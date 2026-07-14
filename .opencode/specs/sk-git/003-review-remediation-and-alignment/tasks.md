---
title: "Tasks: sk-git Review Remediation and sk-code Alignment"
description: "Task queue for the sk-git SOL-review remediation: per-file RED-first fixes across session/reaper/allocator/pre-push via parallel LUNA dispatches, sk-code alignment, adversarial regression coverage, 002 doc reconciliation, and README refresh."
trigger_phrases:
  - "sk-git remediation tasks"
  - "worktree tooling hardening tasks"
  - "sk-git sk-code alignment tasks"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/003-review-remediation-and-alignment"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "All fixes verified; 002 reconciled; docs closed out"
    next_safe_action: "Commit packet 003 (scoped)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (artifact)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-verify each SOL finding against source (session/reaper/naming/pre-push line references) — captured in `spec.md` §4 and the review output
- [x] T002 Freeze the remediation design in `spec.md` + `plan.md` + `decision-record.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Three disjoint-by-file fixes ran RED-first (add the failing adversarial test, apply the fix, prove GREEN). GPT-5.6-LUNA (xhigh/fast) executed the per-file fixes; the orchestrator verified each independently and — after the allocator race survived two LUNA rounds whose 10-run self-gate passed by luck on a ~10-15% race — applied the final race-safe allocator fix directly under operator approval (see `decision-record.md` ADR-002).

### LUNA-1 — session (`worktree-session.sh`)

- [x] T010 [P] Sanitize `SPECKIT_WORKTREE_SHARED_PATHS`: reject `..`/absolute, canonicalize source + destination, containment-check, `rm --` (REQ-001). Evidence: `worktree-session.sh`; RED test "traversal destination is not replaced by a symlink" (external sentinel) passes.
- [x] T011 [P] `shift` the reason in `exec_in_place` so the child exec is exactly `$RUNTIME "$@"` (REQ-002). Evidence: `worktree-session.sh`; test "child reason is absent from the exec argv".
- [x] T012 [P] Separate the resolvable executable path from a runtime id restricted to the wrapper grammar (REQ-003). Evidence: `worktree-session.sh`; test "path-bearing runtime is rejected" (`/usr/bin/true`).
- [x] T013 [P] Hermetic session test asserting exec argv + shared-path containment. Evidence: `worktree-session.test.sh` PASS=15 FAIL=0.

### LUNA-2 — reaper (`worktree-reaper.sh`)

- [x] T020 [P] Require the whole marker file to match a PID grammar; ambiguity → report-only keep (REQ-004). Evidence: `worktree-reaper.sh`; test "wrapper+malformed-marker: dir kept" (`garbage99999999`).
- [x] T021 [P] Parse exact `work/<runtime>/<slug>` and require runtime/slug to equal the directory basename (REQ-004). Evidence: `worktree-reaper.sh`; test "invalid wrapper branch: branch kept" (`work/human`).
- [x] T022 [P] `--reap-daemons`: canonicalize the referenced path, require it absent, revalidate PID identity before any signal (REQ-006). Evidence: `worktree-reaper.sh`; test "live daemon path is not an orphan".
- [x] T023 [P] Malformed-marker, mismatched-pair, and live-daemon regression cases. Evidence: `worktree-reaper.test.sh` PASS=15 FAIL=0.

### LUNA-3 + orchestrator — allocator + pre-push (`worktree-naming.sh`, `pre-push`)

- [x] T030 [P] Race-safe lock so N stale-lock contenders yield N distinct numbers (REQ-005). Evidence: `worktree-naming.sh` `_wn_acquire_lock` atomic rename-steal; "stale-lock concurrent allocs distinct" 16/16; 100/100 clean sequential determinism runs.
- [x] T031 [P] Atomic high-water persist that aborts without a number on persistence failure (REQ-005). Evidence: `worktree-naming.sh` `_wn_persist_highwater`; persistence-failure RED case.
- [x] T032 [P] Owners from version-controlled `SKILL.md` only (`git ls-files`), not untracked (REQ-007). Evidence: `worktree-naming.sh` `load_skill_ids`; test "untracked owner invalid".
- [x] T033 [P] Enforce `0001..9999` and the exact `.worktrees/<pair>` path (REQ-011). Evidence: `worktree-naming.sh`; tests "zero number invalid" + "9999 allocation rc" 1.
- [x] T034 [P] sk-code-compliant guarded strict-mode preserving sourceable semantics (REQ-009). Evidence: guarded `set -euo pipefail`; sk-code alignment 0 findings on the 4 production scripts.
- [x] T035 [P] `pre-push` tri-state validation, fail-open on internal error; owners from the tracked tree (REQ-008, REQ-007). Evidence: `pre-push`; `pre-push.test.sh` PASS=12 FAIL=0.
- [x] T036 [P] Stale-lock-contention, persistence-failure, bounds, fail-open, untracked-owner regression cases. Evidence: `worktree-naming.test.sh` PASS=43 + `pre-push.test.sh` PASS=12.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Reconcile 002 over-claimed rows and point them at this packet (REQ-010). Evidence: `002-…/checklist.md` CHK-031/033/034 annotated with the 003 hardening; `SKILL.md`/`README.md` allocation + reaping claims now backed by the fixes (documented in `changelog/v1.3.1.0.md`).
- [x] T041 Reword Phase-5 "0-ahead each"/"lossless" to reachability-based; correct 30→31 (REQ-010). Evidence: `002-…/tasks.md` T040/T042a + `implementation-summary.md` + `deleted-branches-recovery.txt` header.
- [x] T042 Refresh `.opencode/bin/README.md` + `.opencode/scripts/git-hooks/README.md` where behavior changed (REQ-012). Evidence: reaper pair/marker/`--reap-daemons` + session shared-path containment notes in `bin/README.md`; pre-push tri-state fail-open note in the git-hooks README.
- [x] T043 Re-run all three harnesses + `bash -n`; sk-code OPENCODE/SHELL passes on the production shell (SC-002). Evidence: session `PASS=15`, reaper `PASS=15`, pre-push `PASS=12`, naming `PASS=43` (100/100 gate); `bash -n` clean on all four; sk-code alignment 0 findings on the 4 production scripts.
- [x] T044 Re-run each SOL reproduction; none can still fire (SC-005). Evidence: each reproduction is encoded as a now-passing RED-first regression case across the four green harnesses.
- [x] T045 `package_skill.py --check` PASS; `validate.sh --recursive --strict` on this packet Errors 0; regenerate metadata last (SC-004). Evidence: checker `Result: PASS`; 003 `--recursive --strict` `Errors: 0` + 002 (reconciled) `--strict` `Errors: 0`; `description.json`/`graph-metadata.json` regenerated last. (Track-root/`000`/`001` recursive failures are pre-existing/untracked concurrent-session work, out of scope.)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every confirmed SOL finding has a RED-first regression test that now passes — session/reaper/naming/pre-push harnesses all green
- [x] sk-code OPENCODE/SHELL verification passes on the touched shell — 0 findings on the 4 production scripts
- [x] No 002 closeout row claims a contract the code does not honor — CHK-031/033/034 + Phase-5 wording reconciled
- [x] All harnesses green; each SOL reproduction can no longer fire — `15/15/12/43`
- [x] `validate.sh --recursive --strict` on this packet Errors 0; `package_skill.py --check` PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **Predecessor**: `../002-skill-scoped-worktree-naming/spec.md`
<!-- /ANCHOR:cross-refs -->
