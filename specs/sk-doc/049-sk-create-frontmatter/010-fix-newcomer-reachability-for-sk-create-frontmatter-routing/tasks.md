---
title: "Task Breakdown: fix newcomer reachability for sk-create-frontmatter routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "newcomer reachability tasks"
  - "routing alias tasks"
  - "reachability checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: fix newcomer reachability for sk-create-frontmatter routing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the eighteen declared triggers and ten newcomer prompts through the advisor, recording the generation
- [x] T002 Read the hub router's alias class and the ROUTER.md keyword map for the mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add ten plain-language phrases to both stage-one lists (`.opencode/skills/sk-doc/graph-metadata.json`)
- [x] T004 Add the same ten to the registry aliases, the hub router alias class, the ROUTER.md keyword map and the mode keyword line (`.opencode/skills/sk-doc/{mode-registry.json,hub-router.json,ROUTER.md,sk-create-frontmatter/SKILL.md}`)
- [x] T005 Replace `missing a field` with `validator says my file is missing` after it captured a form prompt, on all five surfaces
- [x] T006 Re-mint the activation manifests, rebuild the canary artifacts and re-pin the three authored digests the edit moved
- [x] T007 Re-pin the two tool digests a benchmark commit had moved at HEAD, in the shared pin source and the four sibling canaries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Replay the ten newcomer prompts, the declared triggers, five out-of-domain prompts and five version probes
- [x] T009 Run `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --verify` and the authored canary
- [x] T010 Regenerate packet metadata and run `validate.sh --strict` on the parent and this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks, every JSON surface parses after the edit
- [x] CHK-011 [P0] No console errors or warnings, every gate exits 0 with its marker
- [x] CHK-012 [P1] Error handling implemented, not applicable, vocabulary only
- [x] CHK-013 [P1] Code follows project patterns, phrases inserted in the existing list shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete, replays before and after
- [x] CHK-022 [P1] Edge cases tested, the over-capturing phrase and the version probes
- [x] CHK-023 [P1] Error scenarios validated, guard stale then fresh, canary red on committed drift then green
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class, recorded in `implementation-summary.md`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, the five surfaces grepped for each phrase
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the alias list, parity check empty
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction fix in this phase
- [x] CHK-FIX-005 [P1] Matrix axes listed: ten prompts, eighteen triggers, five out-of-domain, five probes
- [x] CHK-FIX-006 [P1] No process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned to the working tree at close, named in the summary
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented, not applicable
- [x] CHK-032 [P1] Auth/authz working correctly, not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate, one durable comment on the re-pinned digest set
- [x] CHK-042 [P2] README updated, not needed, the mode README lists no aliases
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented, not applicable
<!-- /ANCHOR:arch-verify -->
