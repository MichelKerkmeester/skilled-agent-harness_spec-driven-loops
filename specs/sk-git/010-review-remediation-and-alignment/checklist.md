---
title: "Checklist: sk-git Review Remediation and sk-code Alignment"
description: "QA gate for the sk-git SOL-review remediation: each confirmed finding has a RED-first regression test, the sourceable shell aligns with sk-code code-opencode, the 002 over-claims are reconciled, and the affected READMEs are refreshed."
trigger_phrases:
  - "sk-git remediation checklist"
  - "worktree tooling hardening checklist"
  - "sk-git sk-code alignment checklist"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/010-review-remediation-and-alignment"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "All P0/P1 items verified [x]; packet complete"
    next_safe_action: "Commit packet 003 (scoped)"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

> Mark each item `[x]` only with evidence (file:line, commit sha, test result, or command output). No completion claim until every P0/P1 item is `[x]` with evidence.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before the fix it guards is called complete |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later pass |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Each SOL finding re-verified against source with a file:line and reproduction. Evidence: `spec.md` §4 + the review output.
- [x] CHK-002 [P0] Remediation design frozen. Evidence: `spec.md` + `plan.md` + `decision-record.md`.
- [x] CHK-003 [P0] The Phase-5 P0 classified (doc-overclaim vs data-loss). Evidence: `decision-record.md` ADR-004.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared-path expansion rejects `..`/absolute, canonicalizes, containment-checks, uses `rm --`. Evidence: `worktree-session.sh`; RED test "traversal destination is not replaced by a symlink" (external sentinel) passes.
- [x] CHK-011 [P0] `exec_in_place` shifts the reason; child exec argv is exactly `$RUNTIME "$@"`. Evidence: `worktree-session.sh`; test "child reason is absent from the exec argv".
- [x] CHK-012 [P0] `/`-bearing / grammar-violating runtime id rejected before `worktree add`. Evidence: `worktree-session.sh`; test "path-bearing runtime is rejected" (`/usr/bin/true`).
- [x] CHK-013 [P0] Code comments carry the durable WHY only — no packet/requirement identifiers. Evidence: `grep` for `.opencode/specs/`/`ADR-`/`REQ-`/`CHK-` across all 8 touched shell + test files returned no matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Reaper requires a full-file PID-grammar marker; malformed marker → keep. Evidence: `worktree-reaper.sh`; RED test "wrapper+malformed-marker: dir kept" (`garbage99999999`).
- [x] CHK-021 [P0] Reaper matches exact `work/<runtime>/<slug>` with runtime/slug == dir basename. Evidence: test "invalid wrapper branch: branch kept" (`work/human`).
- [x] CHK-022 [P0] `--reap-daemons` requires the referenced path absent + revalidates PID before signal. Evidence: dry-run test "live daemon path is not an orphan".
- [x] CHK-023 [P0] Allocator lock race-safe; N stale-lock contenders yield N distinct numbers. Evidence: `worktree-naming.sh` atomic rename-steal; "stale-lock concurrent allocs distinct" 16/16; 100/100 clean sequential runs.
- [x] CHK-024 [P0] High-water persistence failure aborts allocation without emitting a number. Evidence: `worktree-naming.sh` `_wn_persist_highwater`; directory-at-highwater RED case (rc 1, empty output).
- [x] CHK-025 [P0] `pre-push` validation tri-state; fails open on internal error. Evidence: `pre-push` tri-state validator; `pre-push.test.sh` PASS=12.
- [x] CHK-026 [P0] `bash -n` clean on all touched shell; all three harnesses green. Evidence: `bash -n` OK on all four; session `15`, reaper `15`, pre-push `12`, naming `43`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-001 shared-path containment landed with a passing regression test. Evidence: `worktree-session.sh`; external-sentinel test proves the outside target is untouched.
- [x] CHK-031 [P0] REQ-004 reaper reaps only proven-inactive exact wrapper pairs. Evidence: `worktree-reaper.sh`; `worktree-reaper.test.sh` PASS=15 (malformed-marker + mismatched-pair kept).
- [x] CHK-032 [P0] REQ-005 allocator issues no duplicate/unpersisted number. Evidence: `worktree-naming.sh`; 100/100 stale-lock-contention runs, all 16/16 distinct.
- [x] CHK-033 [P1] REQ-006 `--reap-daemons` spares live-worktree daemons. Evidence: `worktree-reaper.sh`; "live daemon path is not an orphan" test.
- [x] CHK-034 [P1] REQ-008 pre-push fails open on internal error. Evidence: `pre-push` tri-state; `pre-push.test.sh` PASS=12.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No path traversal reachable via `SPECKIT_WORKTREE_SHARED_PATHS`; external targets provably untouched. Evidence: `worktree-session.sh`; external-sentinel RED test (outside file present + not symlinked after the run).
- [x] CHK-041 [P1] Owner authorization derives only from version-controlled `SKILL.md`; untracked-owner branch rejected. Evidence: `worktree-naming.sh` `load_skill_ids` (`git ls-files`); tests "untracked owner invalid" + "untracked owner branch rejected".
- [x] CHK-042 [P1] All touched shell runs credential-free, no network, no untrusted-code execution; harnesses hermetic. Evidence: harnesses use `mktemp` fixtures + neutralized `core.hooksPath`; pure local git+shell, no network.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] 002 over-claimed rows reconciled and pointed at this packet. Evidence: `002-…/checklist.md` CHK-031/033/034 annotated with the 003 hardening; safety-contract claims now backed by `changelog/v1.3.1.0.md`.
- [x] CHK-051 [P1] Phase-5 "0-ahead each"/"lossless" reworded to reachability-based; 30-vs-31 accounting corrected. Evidence: `002-…/tasks.md` T040/T042a, `implementation-summary.md`, `deleted-branches-recovery.txt` header (31 branches; reachability losslessness).
- [x] CHK-052 [P1] `.opencode/bin/README.md` + git-hooks README refreshed where behavior changed. Evidence: reaper pair/marker/daemon + session containment notes; pre-push tri-state fail-open note.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] `description.json` + `graph-metadata.json` present and current for this packet. Evidence: regenerated last via `backfill-graph-metadata.js` + `generate-description.js`; packet validates Errors 0.
- [x] CHK-061 [P1] Packet lives under the `sk-git` track as `010-review-remediation-and-alignment`. Evidence: `.opencode/specs/sk-git/010-review-remediation-and-alignment/` (sibling of `.opencode/specs/sk-git/009-skill-scoped-worktree-naming/`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Total | P0 Passed | Status |
|----------|----------|-----------|--------|
| Pre-Implementation | 3 | 3 | Pass |
| Code Quality | 3 | 3 | Pass |
| Testing | 6 | 6 | Pass (harnesses 15/15/12/43) |
| Fix Completeness | 3 | 3 | Pass |
| Security | 1 | 1 | Pass |
| Documentation | 1 | 1 | Pass |

Overall: every confirmed SOL finding fixed RED-first and independently verified — session/reaper/pre-push via GPT-5.6-LUNA, and the allocator race fixed by the orchestrator (atomic rename-steal) after two LUNA rounds left a residual ~10-15% race whose 10-run self-gate passed by luck (operator-approved). Harnesses green (`15/15/12/43`; allocator 100/100 clean sequential); sk-code alignment 0 findings on the four production scripts; the 002 over-claims reconciled; the two READMEs refreshed; `changelog/v1.3.1.0.md` added. `package_skill.py --check` PASS; packet validate Errors 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification

- [x] CHK-070 [P0] The defect map (file → fix) is complete: every confirmed finding maps to exactly one file group. Evidence: `plan.md` §3 defect map; all 4 file groups fixed + green.
- [x] CHK-071 [P1] Fixes are additive and revertable; no name/interface change to the wrapper/allocator public surface. Evidence: diff touches internal functions only (`_wn_acquire_lock`, marker/pair parsing, arg handling); CLI/branch grammar unchanged.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-080 [P2] The race-safe lock holds no longer than the scan+write window; `next`-preview stays lock-free. Evidence: `worktree-naming.sh` `allocate_number` (lock around scan+persist, released after) vs `next_number` (lock-free preview).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [x] CHK-090 [P1] No worktree/branch mutation is performed by this packet; the fixes are pure code + tests + docs. Evidence: diff is limited to the 4 scripts + 4 harnesses + docs; no `git worktree`/`branch` op; harnesses run in `mktemp` fixtures only.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-100 [P1] sk-code OPENCODE/SHELL verification passes on all touched scripts. Evidence: `verify_alignment_drift.py` reports 0 findings on the 4 production scripts (`worktree-session/reaper/naming.sh`, `pre-push`); the 2 ERRORs are pre-existing out-of-scope sibling libs (`autostash-orphan-guard.sh`, `memory-drift-marker.sh`) not touched here; the 2 WARNs are the tally-style test harnesses that cannot adopt `set -e` without aborting multi-assertion runs (accepted exemption, ADR-005 reasoning).
- [x] CHK-101 [P1] `package_skill.py --check` on sk-git stays PASS (leaf skill; parent-hub checks N/A). Evidence: checker `Result: PASS`.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-110 [P1] `validate.sh --recursive --strict` on this packet exits Errors 0; metadata regenerated last. Evidence: 003 `--recursive --strict` `Errors: 0`; the reconciled 002 packet `--strict` `Errors: 0`; `description.json`/`graph-metadata.json` regenerated after all doc edits. (A track-root recursive run surfaces only pre-existing/untracked concurrent-session siblings — `007-continuous-integration-workflow`, `008-research-and-requirements` — plus the track-root non-phase-parent mis-classification; none in this packet's scope.)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] CHK-120 [P0] Operator authorized the remediation and froze the executor (GPT-5.6-LUNA xhigh/fast, parallel). Evidence: `decision-record.md` ADR-002 (records the operator directive "Fix all findings ... USE GPT 5.6 FAST LUNA XHIGH ... more than 1 at same time").
- [x] CHK-121 [P0] Each SOL reproduction re-run post-fix; none can still fire. Evidence: each reproduction is a now-passing RED-first regression case across the four green harnesses (`15/15/12/43`; allocator 100/100 clean).
<!-- /ANCHOR:sign-off -->
