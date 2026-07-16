---
title: "Verification Checklist: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Verification Date: TBD — packet is Draft/unexecuted at scaffold time."
trigger_phrases:
  - "system-code-graph stub cleanup checklist"
  - "remove untracked spec stubs checklist"
  - "007 009 stub directory removal verification"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level 2 verification checklist unchecked"
    next_safe_action: "Check items with evidence during cleanup execution"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/007-code-graph-buildout/"
      - ".opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Remove untracked stub packets below the system-code-graph archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`; both stub directories confirmed 0 tracked files via `git ls-files` at scaffold time.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (verify-then-`rm -rf`, no git-side rollback needed since untracked).
- [ ] CHK-003 [P1] Dependencies identified and available (`git ls-files`, `find`, `rg`, `validate.sh`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] N/A — no source code changed by this packet (directory deletion only); confirm no build/lint surface is touched.
- [ ] CHK-011 [P0] N/A — no console/runtime output involved.
- [ ] CHK-012 [P1] N/A — no error-handling logic introduced.
- [ ] CHK-013 [P1] Deletion follows the verify-then-delete pattern documented in `plan.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Both stub directories confirmed 0 tracked files immediately before deletion; evidence: `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` returns empty output.
- [ ] CHK-021 [P0] Both stub directories are gone after deletion; evidence: `ls .opencode/specs/system-code-graph/007-code-graph-buildout` and `ls .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` both report "No such file or directory".
- [ ] CHK-022 [P1] Packet number-line invariant holds post-deletion; evidence: sorted numeric listing of `.opencode/specs/system-code-graph/*/` shows archive max `024` immediately followed by active min `025` (active-min `025` > archive-max `024`), with no `007-` or `009-` gap-filler directory remaining.
- [ ] CHK-023 [P1] `git status --porcelain` shows no diff attributable to this deletion; evidence: both paths were untracked, so removing them produces no tracked-file change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `instance-only` — two isolated untracked stub directories, not a class-of-bug affecting other packets.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed via `git ls-files`, proving 0 tracked files in both directories (instance-only status proven by grep/git, not assumed).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the basenames: `context-index.md` (historical rename-mapping record, unchanged) and `descriptions.json` (152 stale search-index entries, out-of-scope follow-up, unchanged) — both confirmed non-blocking for deletion.
- [ ] CHK-FIX-004 [P0] N/A — not a security/path/parser/redaction fix; no adversarial table applies to a plain directory deletion.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in `plan.md` §3 (2 directories x 4 checks: tracking status, content inventory, reference classification, post-deletion invariant).
- [ ] CHK-FIX-006 [P1] N/A — no process-wide/global state read by this housekeeping task.
- [ ] CHK-FIX-007 [P1] Evidence will be pinned to the exact command outputs captured during Phase 1/3 execution, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets involved; evidence: change is a directory deletion only.
- [ ] CHK-031 [P0] N/A — no input validation surface.
- [ ] CHK-032 [P1] N/A — no auth/authz surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` synchronized at scaffold time; will be re-synchronized with execution evidence in `implementation-summary.md`.
- [ ] CHK-041 [P1] N/A — no code comments involved.
- [ ] CHK-042 [P2] N/A — no README update required for internal spec-folder housekeeping.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] N/A — no temp files created by this packet's own execution (target directories already contained only stray scratch/log artifacts from a prior, unrelated migration).
- [ ] CHK-051 [P1] Both target stub directories confirmed absent after execution; evidence: `ls` reports "No such file or directory" for both `.opencode/specs/system-code-graph/007-code-graph-buildout` and `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet is Draft/unexecuted at scaffold time; 2026-07-16 is the scaffold date, not the verification date)
<!-- /ANCHOR:summary -->
