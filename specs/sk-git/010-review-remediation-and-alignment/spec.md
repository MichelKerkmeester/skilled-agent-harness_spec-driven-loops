---
title: "Feature Specification: sk-git Review Remediation and sk-code Alignment"
description: "Fix the confirmed correctness/safety findings from the GPT-5.6-SOL review of the owner-first worktree tooling (session/reaper/allocator/pre-push), align the shell surface with the sk-code code-opencode conventions, add adversarial regression coverage, reconcile the overclaimed 002 closeout docs, and refresh affected READMEs."
trigger_phrases:
  - "sk-git review remediation"
  - "worktree tooling hardening"
  - "sk-git sk-code alignment"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/010-review-remediation-and-alignment"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "All findings fixed + verified; packet complete"
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
# Feature Specification: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## EXECUTIVE SUMMARY

A GPT-5.6-SOL (max) adversarial review of the owner-first worktree tooling shipped by `009-skill-scoped-worktree-naming` returned DO-NOT-SHIP with reproduced correctness and safety defects. Six were independently re-verified against source. This packet fixes every confirmed finding across `worktree-session.sh`, `worktree-reaper.sh`, `worktree-naming.sh`, and the `pre-push` hook; adds the adversarial regression cases the original harnesses missed; aligns the sourceable shell surface with the sk-code code-opencode conventions; reconciles the 002 closeout rows that over-claimed the now-disproven safety contracts (no data was lost — that finding was a doc-overclaim, verified); and refreshes the affected READMEs.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 (multi-file safety-critical remediation + tooling alignment) |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | `sk-git` |
| **Predecessor** | `009-skill-scoped-worktree-naming` |
| **Provenance** | GPT-5.6-SOL (max/fast) review verdict DO-NOT-SHIP; orchestrator re-verified 6 findings against source |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The owner-first worktree tooling passed its own harnesses (31/9/8) but the harnesses never exercised adversarial inputs. An independent SOL review reproduced real defects: a wrapper child-exec leaks its diagnostic reason into the runtime argv; runtime validation accepts `/`-bearing identities that produce invalid Git refs; a shared-path `rm -rf` follows `..` outside the worktree; the reaper accepts a malformed session marker as proof of a dead PID, treats any `work/*` branch as a reapable wrapper pair, and (under `--reap-daemons`) signals live-worktree daemons without an existence check; the allocator lock-steal has a TOCTOU race and ignores high-water persistence failure; owner discovery trusts untracked `SKILL.md` files; and the pre-push validator is not fail-open on internal error. Separately, the 002 closeout docs mark these safety contracts complete.

### Purpose

Restore the shipped-state claims to truth: fix each confirmed defect with a RED-first regression test, align the shell to the sk-code code-opencode surface, and reconcile the docs so no closeout row claims a contract the code does not honor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Code fixes for every confirmed finding in `worktree-session.sh`, `worktree-reaper.sh`, `worktree-naming.sh`, `pre-push`.
- Adversarial regression tests for each reproduced defect.
- sk-code code-opencode conformance for the sourceable shell surface (strict-mode pattern, verification gate).
- Reconciliation of the 002 packet's over-claimed closeout rows + the Phase-5 "0-ahead each" wording + the branch-count accounting.
- README refresh for `.opencode/bin/README.md` and `.opencode/scripts/git-hooks/README.md` where behavior changed.

### Out of Scope

- Re-litigating the Phase-5 cleanup itself (verified lossless — the disputed OIDs are reachable via preserved branches/`main`).
- The sk-doc create-skill canon doc-structure conformance (tracked separately; folded in only where it overlaps a touched file).
- Any change to the owner-first grammar or the continuous-integration autosync design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/worktree-session.sh` | Modify | shift reason; restrict runtime id to wrapper grammar; sanitize shared-path (no `..`/abs, containment, `rm --`) |
| `.opencode/bin/worktree-reaper.sh` | Modify | full-file PID-grammar marker; exact 3-part wrapper match; `--reap-daemons` existence + PID recheck |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Modify | race-safe lock; atomic high-water persist-or-fail; version-controlled owner discovery; numeric/path bounds; sk-code strict-mode |
| `.opencode/scripts/git-hooks/pre-push` | Modify | tri-state validation, fail-open on internal error; owner list from pushed tree |
| `.opencode/bin/tests/worktree-reaper.test.sh` + new session test | Modify/Create | adversarial regression cases |
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | stale-lock, persistence-fail, untracked-owner, bounds cases |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Modify | internal-error fail-open, untracked-owner cases |
| `.opencode/bin/README.md`, `.opencode/scripts/git-hooks/README.md` | Modify | behavior/refresh where changed |
| `.opencode/specs/sk-git/009-skill-scoped-worktree-naming/*` | Modify | reconcile over-claimed rows; point to this remediation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared-path expansion cannot delete or symlink outside the worktree. | `SPECKIT_WORKTREE_SHARED_PATHS` entries with `..`/absolute components are rejected; both paths canonicalized and containment-checked before `rm -- `; regression test proves an external target is untouched. |
| REQ-002 | The wrapper never execs the runtime with a leaked reason argument. | `exec_in_place` shifts the reason; child exec is exactly `$RUNTIME "$@"`; regression test asserts argv. |
| REQ-003 | Runtime identity that cannot form a legal Git ref is rejected. | a `/`-bearing or grammar-violating runtime id is rejected before `worktree add`; regression test covers `/usr/bin/true`. |
| REQ-004 | The reaper reaps only a genuine, proven-inactive wrapper pair. | full marker file must match a PID grammar (ambiguity → keep); branch must match exact `work/<runtime>/<slug>` with runtime/slug equal to the directory basename; regression tests cover malformed marker + mismatched pair. |
| REQ-005 | The allocator never issues a duplicate or unpersisted number. | lock acquisition is race-safe under stale-lock contention (N contenders → N distinct numbers); a high-water persistence failure aborts without emitting a number; regression tests cover both. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `--reap-daemons` signals only genuinely orphaned daemons. | referenced worktree/DB path is canonicalized and required absent, and PID identity re-validated, before any signal; dry-run test proves a live-worktree daemon is not targeted. |
| REQ-007 | Owner authorization derives only from version-controlled skills. | owner list built from tracked `SKILL.md` (git ls-files / pushed tree), not untracked files; pre-push rejects an untracked-owner branch; regression test covers it. |
| REQ-008 | The pre-push validator is fail-open on internal error. | validation is tri-state (valid / invalid-name / internal-error); an internal error (e.g. `find` exit 2) never blocks a legal push; regression test covers it. |
| REQ-009 | The sourceable shell surface conforms to sk-code code-opencode. | sk-code OPENCODE/SHELL verification passes for the touched scripts (guarded strict-mode pattern for sourceable files); no regression to sourcing semantics. |
| REQ-010 | 002 closeout docs match reality after fixes. | over-claimed rows reconciled or pointed at this packet; Phase-5 "0-ahead each" reworded to "0-ahead or branch preserved"; branch-count accounting corrected. |

### P2

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Validators enforce documented numeric/path bounds. | `NNNN` bounded `0001..9999`; pair path is exactly `.worktrees/<pair>`; boundary tests added. |
| REQ-012 | READMEs reflect changed behavior. | `.opencode/bin/README.md` + git-hooks README updated where behavior changed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every confirmed SOL finding has a RED-first regression test that now passes.
- **SC-002**: All shell harnesses green; `bash -n` clean; sk-code code-opencode verification passes.
- **SC-003**: No 002 closeout row claims a contract the code does not honor.
- **SC-004**: `package_skill.py --check` on sk-git stays PASS; packet `validate.sh --strict` Errors 0.
- **SC-005**: An adversarial re-verification pass (re-run of the reproductions) cannot reproduce the fixed defects.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `worktree-session.sh` / `worktree-reaper.sh` govern every launched session | High — a bad edit breaks all sessions | Additive, RED-first, per-file dispatch; hermetic tests only; single revertable packet |
| Risk | Parallel executor dispatches mutate a shared tree | Medium | Disjoint file ownership per dispatch; no repo mutation / no commit by executors; orchestrator verifies tree |
| Risk | A fix changes sourcing semantics of the allocator | Medium | Preserve sourceable contract; strict mode scoped to execution path; re-run source-time tests |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Security
- No path traversal, no untrusted-code execution, credential-free, no network.

### Reliability
- Allocation atomic and race-safe; reaper never removes a live/ambiguous worktree; hooks fail open on internal error.

## 8. EDGE CASES

- Malformed/partial marker files; `..`-bearing shared paths; `/`-bearing runtime ids; two-component `work/x` branches; stale-lock contention; high-water path unwritable; untracked owner `SKILL.md`; validator internal errors; boundary numbers `0000`/`9999`/`10000`.

## 9. COMPLEXITY ASSESSMENT

Safety-critical shell touching every launched session plus push enforcement and the allocator; blast radius spans concurrency governance and data-loss surfaces, so Level 3 despite a moderate net LOC. Sequenced: parallel per-file fixes (RED-first) → doc/README reconcile → consolidated adversarial re-verify.

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| A fix regresses session launch or push enforcement | Low | High | RED-first per-file dispatch; hermetic tests; single revertable packet |
| Parallel executors collide on a shared tree | Low | Medium | Disjoint file ownership; no repo mutation / no commit by executors |
| Strict-mode change breaks the allocator's sourcing contract | Low | Medium | Execution-path-only strict mode; re-run source-time tests |

## 11. USER STORIES

- As the operator, I want the worktree tooling to be provably safe against adversarial inputs, so that a launched session can never delete data outside its worktree or be reaped while live.
- As a maintainer, I want each review finding to carry a permanent regression test, so that the class of defect cannot silently return.
- As a reader of the 002 closeout, I want every row to be true, so that "shipped" means what it says.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

| # | Question | Resolution |
|---|----------|------------|
| Q1 | Executor for the fixes | Resolved — operator froze GPT-5.6-LUNA (xhigh/fast), parallel dispatch authorized |
| Q2 | Is the Phase-5 P0 a data-loss event | Resolved — no; disputed OIDs are reachable via preserved branches / `main` (doc-overclaim only) |
| Q3 | Strict-mode vs sourceable semantics for the allocator | Resolved in ADR-005 — guarded execution-path strict mode, no unconditional top-level `set -e` |
<!-- /ANCHOR:questions -->

## 13. RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Predecessor: `../009-skill-scoped-worktree-naming/spec.md`
