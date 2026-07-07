---
title: "Implementation Summary: Phase 12 spec-kit relocation"
description: "Moved two spec-folder authoring docs to system-spec-kit workflows, repointed inbound references, bumped sk-code and system-spec-kit versions, and shipped as remote commit 85a0c2c9ac."
trigger_phrases:
  - "spec-kit relocation summary"
  - "spec-folder authoring docs relocation"
  - "system-spec-kit workflows"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/012-spec-kit-relocation"
    last_updated_at: "2026-07-05T10:12:34.367Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 docs for shipped commit 85a0c2c9ac"
    next_safe_action: "Keep phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md"
      - ".opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/commands/speckit_complete_auto.yaml"
      - ".opencode/commands/speckit_complete_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Phase 12 spec-kit relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-spec-kit-relocation |
| **Completed** | 2026-07-04 |
| **Level** | 2 |
| **Actual Effort** | Not recorded in source facts |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 12 moved spec-folder authoring guidance to the system that owns it. The shipped commit relocated the write recipe and authoring checklist into system-spec-kit workflows, repointed the known inbound references, and left unrelated authoring checklists in sk-code for the later surface restructure.

### Spec-Folder Workflow Relocation

The phase moved `code-implement/assets/opencode/recipes/spec_folder_write.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` and `code-quality/assets/opencode-checklists/spec_folder_authoring.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md`. Content was preserved, and internal cross-references were repointed to same-directory siblings.

### Inbound Reference Repointing

The phase repointed `code-implement/SKILL.md`, `code-quality/SKILL.md`, `shared/references/smart_routing.md`, `sk-code/description.json`, both `speckit_complete_{auto,confirm}.yaml` cross-skill authoring-load lines, and the system-spec-kit SKILL cross-load note. The moved docs were indexed under the system-spec-kit COMPLETE intent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` | Moved | Canonical system-spec-kit home for the spec-folder write recipe |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` | Moved | Canonical system-spec-kit home for the spec-folder authoring checklist |
| `.opencode/skills/sk-code/code-implement/SKILL.md` | Updated | Repointed four load-contract rows |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Updated | Repointed spec-folder authoring reference |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Updated | Removed moved RESOURCE_MAP entries and rewrote prose reference |
| `.opencode/skills/sk-code/description.json` | Updated | Removed moved spec-folder keywords |
| `.opencode/commands/speckit_complete_auto.yaml` | Updated | Repointed cross-skill authoring load |
| `.opencode/commands/speckit_complete_confirm.yaml` | Updated | Repointed cross-skill authoring load |
| `.opencode/skills/system-spec-kit/SKILL.md` | Updated | Added COMPLETE-intent cross-load note and resource indexing |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase shipped as remote commit `85a0c2c9ac` (`85a0c2c9ac591c16f2def531cde401ea75779081` in the existing summary). The relocation was verified with `sk-code-router-sync` vitest 4/4, touched-file broken-link checking, and a clean dead-reference sweep.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Move spec-folder authoring docs to system-spec-kit | Spec-folder authoring is system-spec-kit's domain, not a sk-code surface |
| Preserve moved document content | The task was an ownership relocation, not a rewrite of authoring guidance |
| Repoint every named inbound reference | Stale pre-hub references were part of the original problem |
| Leave `{skill,agent,command,mcp_server}` authoring checklists in sk-code | Those checklists intentionally moved with the surface restructure in phase 013 |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Shipment | Pass | Phase work | Remote commit `85a0c2c9ac` |
| Router sync | Pass | sk-code moved filesystem and machine block agreement | `sk-code-router-sync` vitest 4/4 |
| Link integrity | Pass | Touched files | No broken links among touched files |
| Dead-reference sweep | Pass | Stale moved references | Clean result |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Relocated markdown and metadata references | N/A | N/A | N/A |
| Router-sync behavior | Covered by `sk-code-router-sync` vitest | Covered by dynamic guard | Covered by dynamic guard |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Router checks remain deterministic without fixture edits | `sk-code-router-sync` passed 4/4 once filesystem and RESOURCE_MAP agreed | Pass |
| NFR-S01 | No secrets in relocated docs or references | Phase facts and existing docs identify markdown and metadata updates only | Pass |
| NFR-R01 | Link and dead-reference sweeps clean | Touched-file links clean; dead-reference sweep clean | Pass |
| NFR-R02 | Old sk-code authoring-checklist boundary preserved | Remaining `{skill,agent,command,mcp_server}` checklists stayed in sk-code for phase 013 | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Actual elapsed effort was not recorded in the provided phase facts or existing docs.
2. The remaining `{skill,agent,command,mcp_server}` authoring checklists were intentionally outside this phase and moved with phase 013.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Move spec-folder authoring docs to system-spec-kit | Completed and shipped in commit `85a0c2c9ac` | Matches the phase scope |
| Repoint inbound references | Completed across the named sk-code, command YAML, and system-spec-kit references | Required to remove stale pre-hub paths |
| Move all authoring checklists | Not done in this phase | Remaining authoring checklists intentionally stayed in sk-code for phase 013 |

<!-- /ANCHOR:deviations -->
