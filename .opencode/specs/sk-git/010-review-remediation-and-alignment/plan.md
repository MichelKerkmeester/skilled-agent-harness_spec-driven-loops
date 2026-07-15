---
title: "Plan: sk-git Review Remediation and sk-code Alignment"
description: "Phased plan to fix the confirmed SOL-review defects across the worktree session/reaper/allocator/pre-push surface, add adversarial regression coverage, align the sourceable shell with sk-code code-opencode, reconcile the over-claimed 002 closeout docs, and refresh affected READMEs."
trigger_phrases:
  - "sk-git remediation plan"
  - "worktree tooling hardening plan"
  - "sk-git sk-code alignment plan"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/010-review-remediation-and-alignment"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "All phases executed + verified; packet complete"
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
# Plan: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Trigger** | GPT-5.6-SOL (max/fast) review of 002 → DO-NOT-SHIP |
| **Confirmed defects** | 2 P0 (1 code traversal, 1 doc-overclaim) + ~9 P1 + P2 |
| **Files** | `worktree-session.sh`, `worktree-reaper.sh`, `worktree-naming.sh`, `pre-push` (+3 test harnesses) |
| **Method** | RED-first per-file fixes via parallel GPT-5.6-LUNA (xhigh/fast) → orchestrator verify → doc/README reconcile |
| **Executor** | cli-codex `gpt-5.6-luna`, effort `xhigh`, tier `fast`, `--sandbox workspace-write` |

### Overview

The owner-first tooling passed its own harnesses but never faced adversarial inputs; the SOL review reproduced real correctness/safety defects. This plan fixes each confirmed finding with a RED-first regression test, aligns the sourceable shell to the sk-code code-opencode surface, and reconciles the 002 closeout docs so no row claims a contract the code does not honor. The one P0 that is a *doc* overclaim (Phase-5 "0-ahead each" / "lossless") is corrected in prose — the underlying cleanup is verified lossless (disputed OIDs reachable via preserved branches / `main`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Traversal safety | Shared-path expansion cannot escape the worktree | RED test deletes/symlinks nothing outside; canonicalized containment |
| Reaper safety | Only proven-inactive exact wrapper pairs reaped | Malformed-marker + mismatched-pair + live-daemon RED tests |
| Allocator integrity | No duplicate/unpersisted numbers under contention | Stale-lock contention + persistence-failure RED tests |
| Fail-open push | Internal validator error never blocks a legal push | Tri-state validation RED test |
| Owner authority | Only version-controlled skills authorize owners | Untracked-owner RED test |
| sk-code alignment | Sourceable shell passes OPENCODE/SHELL gate | sk-code surface verification |
| Structure | Spec docs valid | `validate.sh --recursive --strict` |
| Doc fidelity | No closeout row over-claims | 002 reconciliation review |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Defect map (file → fix)

| File | Defect(s) | Fix |
|------|-----------|-----|
| `worktree-session.sh` | shared-path `rm -rf` follows `..`/abs (P0); reason arg leaked into exec (P1); `/`-bearing runtime id → invalid ref (P1) | reject `..`/abs + canonicalize + containment before `rm --`; `shift` reason; split executable path from a grammar-restricted runtime id |
| `worktree-reaper.sh` | malformed marker → dead-PID reap (P1); any `work/*` mis-paired (P1); `--reap-daemons` no existence check (P1) | full-file PID grammar (ambiguity→keep); exact 3-part `work/<rt>/<slug>` matching dir basename; canonicalize referenced path, require absent + revalidate PID before signal |
| `worktree-naming.sh` | lock-steal TOCTOU (P1); high-water persist-failure ignored (P1); untracked-owner accepted (P1); missing numeric/path bounds (P2); sourceable strict-mode gate (P2) | ownership-token compare-and-delete; atomic persist-or-abort; owners from `git ls-files`/pushed tree; `0001..9999` + exact `.worktrees/<pair>`; sk-code-compliant guarded strict mode |
| `pre-push` | validator internal error blocks legal push (P1); untracked-owner authorizes push (P1) | tri-state (valid/invalid/internal-error), fail-open on internal-error; owners from version-controlled tree |

### Test surfaces

`worktree-reaper.test.sh`, `worktree-naming.test.sh`, `pre-push.test.sh` each gain the reproduced adversarial fixture as a regression case; a new session-level test asserts the exec argv and shared-path containment. All hermetic (own `mktemp` fixtures + redirected `HOME`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Session hardening (LUNA-1)

`worktree-session.sh`: sanitize `SPECKIT_WORKTREE_SHARED_PATHS` (reject `..`/absolute, canonicalize source+dest, containment-check, `rm --`); `shift` the reason in `exec_in_place`; separate the resolvable executable from a normalized runtime id restricted to the wrapper grammar. New hermetic session test asserting argv + containment.

### Phase 2 — Reaper hardening (LUNA-2)

`worktree-reaper.sh`: require the whole marker file to match a PID grammar (permission/lookup ambiguity → report-only keep); parse exact `work/<runtime>/<slug>` and require runtime/slug to equal the directory basename; under `--reap-daemons` extract+canonicalize the referenced worktree/DB path, require it absent, and revalidate PID identity before any signal. Regression cases added to `worktree-reaper.test.sh`.

### Phase 3 — Allocator + pre-push hardening (LUNA-3)

`worktree-naming.sh`: race-safe lock (ownership-token compare-and-delete or OS lock) so N contenders yield N distinct numbers; atomic high-water write that aborts allocation on persistence failure; owner discovery from version-controlled `SKILL.md` only; enforce `0001..9999` and the exact `.worktrees/<pair>` path; add a sk-code-compliant guarded top-level strict-mode pattern preserving sourceable semantics. `pre-push`: tri-state validation that fails open on internal error and derives owners from the pushed/tracked tree. Regression cases added to `worktree-naming.test.sh` + `pre-push.test.sh`.

### Phase 4 — Doc + README reconciliation (orchestrator)

Reconcile 002 over-claimed rows (checklist CHK-031..034, SKILL 302/315, README allocation claim, changelog, tasks fail-open row) and point them at this packet; reword Phase-5 "0-ahead each" to "0-ahead or branch preserved"; correct the 30-vs-31 branch accounting. Refresh `.opencode/bin/README.md` + `.opencode/scripts/git-hooks/README.md` where behavior changed.

### Phase 5 — Consolidated verification (orchestrator)

Re-run all three harnesses + `bash -n`; sk-code OPENCODE/SHELL verification; re-run each SOL reproduction to confirm it can no longer fire; `package_skill.py --check` on sk-git; `validate.sh --recursive --strict`; regenerate metadata last.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Syntax | All changed shell | `bash -n` |
| Session | argv + shared-path containment | new hermetic session test |
| Reaper | malformed marker, mismatched pair, live daemon | `worktree-reaper.test.sh` |
| Allocator | stale-lock contention, persistence failure, bounds | `worktree-naming.test.sh` |
| Pre-push | internal-error fail-open, untracked owner | `pre-push.test.sh` |
| Reproduction | each SOL finding re-run post-fix | adversarial re-verify |
| sk-code | OPENCODE/SHELL surface | sk-code verification |
| Structure | This packet | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `worktree-session.sh` / `worktree-reaper.sh` | Internal | Required | Governs every launched session; edits must be additive + revertable |
| cli-codex `gpt-5.6-luna` availability | External | Required | Executor for the fixes; falls back to orchestrator hand-fix if unavailable |
| sk-code code-opencode surface | Internal | Required | Alignment gate for the sourceable shell |
| 002 packet docs | Internal | Required | Reconciliation target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Code fixes**: single-commit revert per file group; all additive, no name/interface change.
- **Tests**: purely additive regression cases; revert with the code commit.
- **Docs/README**: prose-only; revert the reconciliation commit.
- No worktree/branch mutation is performed by this packet, so there is nothing destructive to undo.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

```text
Phase 1 (session) ─┐
Phase 2 (reaper)  ─┼─▶ Phase 4 (doc/README reconcile) ─▶ Phase 5 (consolidated verify)
Phase 3 (naming+prepush) ─┘
```

Phases 1-3 are disjoint by file and run in parallel (three LUNA dispatches). Phase 4 depends on the fixes landing (docs must describe the fixed behavior). Phase 5 gates completion.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

The three parallel fix dispatches are the critical path; the slowest returning group gates Phase 4. The P0 shared-path traversal fix (Phase 1) is the highest-severity item. Phase 5's adversarial re-verify is the completion gate — no claim of "fixed" without re-running each reproduction.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M0 — Packet framed | spec/plan/tasks/checklist/decision-record written; validate 0 |
| M1 — Fixes landed | Phases 1-3 fixes applied, each with a passing RED-first regression test |
| M2 — Aligned | sk-code OPENCODE/SHELL verification passes on the touched shell |
| M3 — Docs true | 002 over-claims reconciled; READMEs refreshed |
| M4 — Verified | All harnesses green; each SOL reproduction can no longer fire; validate 0 |
<!-- /ANCHOR:milestones -->
