---
title: "Verification Checklist: Close-out and tail"
description: "Level 2 verification checklist for the shipped close-out tail, with concrete commit and gate evidence plus deferred follow-ups."
trigger_phrases:
  - "sk-code close-out checklist"
  - "advisor scorer verification"
  - "review identity verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/014-close-out-and-tail"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 checklist for shipped close-out commits"
    next_safe_action: "Run strict validation for phase 014"
---
# Verification Checklist: Close-out and tail

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` records review identity cleanup, advisor scorer repair, rename-invariant repair, remaining-failure classification, and deferred gated follow-ups.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` lists target components, shipped commits, verification strategy, dependencies, rollback, and Level 2 addenda.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` marks review fold-in, scorer tests, Python scorer behavior, and strict validation as available, while skill graph daemon work is gated.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: target gates]
  - **Evidence**: Target gates passed for review identity cleanup, advisor scorer repair, and rename-invariant repair as recorded in shipped phase facts.
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: target suites]
  - **Evidence**: No runtime console surface applies; target suite evidence is `39/39` advisor target tests green and `4/4` rename-invariants green.
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: failure classification]
  - **Evidence**: Remaining full advisor-suite failures were classified by ownership instead of being masked or changed in other sessions' files.
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: shipped commits]
  - **Evidence**: Commit `027882bfd0` keeps review as a mode of `sk-code`; commit `ea689d84e0` aligns scorer behavior with Python routing; commit `dd9487d65d` restores the original TOML source pattern.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: REQ-001 through REQ-007]
  - **Evidence**: Requirements are satisfied by commits `027882bfd0`, `ea689d84e0`, and `dd9487d65d`, with deferred items explicitly out of completion scope.
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: review-tree and classification checks]
  - **Evidence**: Review-tree links were clean, remaining advisor-suite failures were manually classified, and concurrent dirty files were left untouched.
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: cli-opencode saturation case]
  - **Evidence**: The prompt `Use cli-opencode to delegate this coding task through OpenCode CLI` was the real routing regression and is covered by the widened `-3.0` disambiguation.
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: baseline delta]
  - **Evidence**: Full advisor-suite baseline improved from 13 to 9 failures with zero new failures; the remaining eight were assigned to other in-flight sessions.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Requested close-out code fixes shipped [EVIDENCE: commits 027882bfd0, ea689d84e0, dd9487d65d]
  - **Evidence**: The three shipped commits cover stale review identity labels, advisor scorer repairs, cli-opencode routing, and rename-invariant TOML restoration.
- [x] CHK-025 [P1] Out-of-scope concurrent work left untouched [EVIDENCE: failure classification]
  - **Evidence**: Seven failures tied to dirty `skill_advisor.py`, `skill-graph.json`, and `aliases.ts`; one tied to deep-loops/036 WIP playbook row. None were changed by this phase.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: changed file list]
  - **Evidence**: Changed files are skill docs, playbook markdown, scorer TypeScript, and tests; no secret-bearing config was introduced.
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: not applicable]
  - **Evidence**: This phase changed scorer/test/doc surfaces, not request-handling input surfaces.
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable]
  - **Evidence**: This phase did not touch authentication or authorization code.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: phase docs]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` all describe the same shipped commits, target gates, and deferred follow-ups.
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: no code comments added]
  - **Evidence**: No code comments were added by this documentation backfill.
- [ ] CHK-042 [P2] Canonical reindex and skill-graph recompile complete [EVIDENCE: deferred]
  - **Evidence**: Deferred because the daemon was flagged broken; this is open and not claimed done.
- [ ] CHK-043 [P2] Lane-C fresh baseline re-derived [EVIDENCE: deferred]
  - **Evidence**: Deferred and not claimed done.
- [ ] CHK-044 [P2] Worktree cleanup completed [EVIDENCE: deferred]
  - **Evidence**: `.worktrees/0014-sk-code-parent` cleanup remains open and not claimed done.
- [ ] CHK-045 [P2] Phase 015 sibling alignment completed [EVIDENCE: deferred]
  - **Evidence**: Phase 015 alignment remains open and not claimed done.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: no scratch files]
  - **Evidence**: This doc backfill created only the five required Level 2 markdown files in the phase folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: no scratch dir]
  - **Evidence**: No scratch directory is part of this phase folder.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 4 | 0/4 deferred |

**Verification Date**: 2026-07-05
**Verified By**: gpt-5.5

<!-- /ANCHOR:summary -->
