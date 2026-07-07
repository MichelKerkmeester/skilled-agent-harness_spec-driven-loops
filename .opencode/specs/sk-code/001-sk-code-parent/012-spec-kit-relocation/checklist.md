---
title: "Verification Checklist: Phase 12 spec-kit relocation"
description: "Completed Level 2 checklist for the shipped spec-kit relocation phase."
trigger_phrases:
  - "spec kit relocation checklist"
  - "spec-folder authoring docs relocation"
  - "system-spec-kit workflows"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/012-spec-kit-relocation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 checklist for the already-shipped spec-kit relocation phase"
    next_safe_action: "Run strict validation for this phase folder"
---
# Verification Checklist: Phase 12 spec-kit relocation

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
  - **Evidence**: `spec.md` documents the domain problem, relocation scope, inbound reference list, and acceptance criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` documents the cross-skill relocation pattern, phases, dependencies, rollback, and verification strategy.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` lists system-spec-kit workflows, sk-code router-sync guard, and speckit completion YAMLs as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: sk-code-router-sync 4/4]
  - **Evidence**: `sk-code-router-sync` vitest passed 4/4 after the moved filesystem and machine RESOURCE_MAP block agreed.
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: no broken links]
  - **Evidence**: No broken links were found among touched files.
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: dead-reference sweep]
  - **Evidence**: Dead-reference sweep was clean, covering stale-path failure cases for this relocation.
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: cross-skill system-spec-kit form]
  - **Evidence**: `shared/references/smart_routing.md` prose row was rewritten to the cross-skill system-spec-kit form the router-sync regex treats as safe.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: commit 85a0c2c9ac]
  - **Evidence**: Shipped remote commit `85a0c2c9ac` contains the relocation, inbound repoints, version bumps, and changelog entries.
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: touched-file review]
  - **Evidence**: Touched-file link check and dead-reference sweep were clean.
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: out-of-scope checklists]
  - **Evidence**: Remaining `{skill,agent,command,mcp_server}` authoring checklists intentionally stayed in sk-code for phase 013.
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: router-sync and dead-reference gates]
  - **Evidence**: RESOURCE_MAP mismatch risk was covered by `sk-code-router-sync`; stale-path risk was covered by dead-reference sweep.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Requested relocation completed [EVIDENCE: moved workflow docs]
  - **Evidence**: The write recipe and authoring checklist were moved to `.opencode/skills/system-spec-kit/references/workflows/`.
- [x] CHK-025 [P1] Unrelated authoring checklists left for phase 013 [EVIDENCE: scope boundary]
  - **Evidence**: `{skill,agent,command,mcp_server}` authoring checklists intentionally remained in sk-code.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: markdown and metadata relocation]
  - **Evidence**: The phase moved documentation and metadata references only; no secrets were part of the provided facts or existing docs.
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: not applicable]
  - **Evidence**: Not applicable to this documentation-routing relocation; folder/path validity was covered by router-sync and link checks.
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable]
  - **Evidence**: Not applicable to this spec-folder authoring documentation relocation.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: Level 2 docs]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` all describe the same relocation scope, verification gates, and shipped commit.
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: no code comments changed]
  - **Evidence**: This backfill changed only phase-folder markdown docs; no code comments were edited.
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: Not applicable; provided facts name SKILL, description, YAML, changelog, and workflow-doc updates, not README updates for this phase.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: no temp files]
  - **Evidence**: No temporary files are part of this phase folder backfill.
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: no scratch dir]
  - **Evidence**: This phase folder does not include a scratch directory.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-05
**Verified By**: gpt-5.5 documentation backfill using shipped phase evidence

<!-- /ANCHOR:summary -->
