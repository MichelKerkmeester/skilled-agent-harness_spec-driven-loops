---
title: "Checklist: integrate and close out (032 phase 011)"
description: "Blocking SOL verifier contract for phase 011: rebase onto the latest base, rerun the complete whole-repo gate, fast-forward only, and reconcile final packet state."
trigger_phrases:
  - "integrate and close out checklist"
  - "hyphen naming phase 011 checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking final-integration and parent-rollup checks"
    next_safe_action: "Run after phase 010 reports a green pre-rebase candidate"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Integrate and close out

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 011. The report pins the pre-rebase candidate, latest-base SHA, post-rebase candidate, final integrated commit, and phase 010 map hash; records rebase/conflict evidence, every rerun command and exit code, the fast-forward result, and the final tracked-state check. A pre-rebase green report is not evidence for the post-rebase candidate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 010 has a complete green report with candidate SHA, BASE SHA, map hash, and all gate-domain evidence.
- [ ] CHK-002 [P0] The latest base SHA, migration head, target ref, and rollback refs are recorded before rebase.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Rebase conflict resolutions preserve the approved naming policy, frozen map, exemptions, and reference closure; no unrelated cleanup is introduced.
- [ ] CHK-004 [P1] The final integration changes no code identifiers, data keys, frontmatter fields, tool-mandated names, or frozen history outside approved scope.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The migration branch is rebased onto the recorded latest base with no unresolved conflicts; the pre/post commit identities and resolution review are attached.
- [ ] CHK-006 [P0] The complete phase 010 checklist is rerun unchanged on the post-rebase candidate, including naming, reference, Git-history, validation, build, typecheck, test, discovery, import/path/link, and Lane C checks.
- [ ] CHK-007 [P0] Every rerun command exits 0 with evidence tied to the post-rebase candidate; no pre-rebase result is reused as proof.
- [ ] CHK-008 [P0] The integration target advances with fast-forward-only semantics after the gate; no merge commit, forced update, or premature target movement exists.
- [ ] CHK-009 [P1] The final integrated commit equals the gate-passed candidate and the tracked worktree is clean.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] Final child-phase evidence, checklist states, closeout notes, and parent rollup agree on the same integrated commit and status.
- [ ] CHK-011 [P1] Any conflict-resolution change that affects the migration is covered by the rerun gate; no unverified side fix remains.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] Integration preserves sandbox, path-boundary, allowlist, and clean-worktree safeguards; no force operation bypasses review.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] The phase 011 closeout record names the latest base, final commit, rerun evidence, fast-forward result, and parent rollup outcome.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] The final integration is linear, path-scoped, and free of generated verifier artifacts or unrelated worktree changes.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is acceptable only when the exact post-rebase candidate passes the complete phase 010 gate, the target advances fast-forward-only, and the final child and parent documentation agree on the integrated commit.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the final integrated commit is recorded, and no stale or conflicting closeout state remains in the packet rollup.
<!-- /ANCHOR:sign-off -->
