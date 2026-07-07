---
title: "Implementation Plan: Phase 12 spec-kit relocation"
description: "Level 2 plan for relocating spec-folder authoring docs from sk-code to system-spec-kit and repointing inbound references."
trigger_phrases:
  - "spec kit relocation plan"
  - "spec-folder authoring docs relocation"
  - "system-spec-kit workflows"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/012-spec-kit-relocation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 plan for the already-shipped spec-kit relocation phase"
    next_safe_action: "Run strict validation for this phase folder"
---
# Implementation Plan: Phase 12 spec-kit relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, TypeScript-adjacent skill metadata |
| **Framework** | OpenCode skill and spec-kit routing docs |
| **Storage** | Local `.opencode/skills/` and `.opencode/commands/` files |
| **Testing** | `sk-code-router-sync` vitest, link checks, dead-reference sweep |

### Overview
This phase moved spec-folder authoring guidance out of the sk-code surface and into system-spec-kit, the domain that owns spec-folder documentation workflows. The implementation preserved the two moved documents, repointed all named inbound references, and recorded version bumps for both affected skills.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and domain boundary documented in `spec.md`.
- [x] Source and destination paths identified.
- [x] Known inbound reference surfaces listed.
- [x] Out-of-scope authoring checklists identified.

### Definition of Done
- [x] Both spec-folder authoring docs moved to system-spec-kit workflows.
- [x] Named inbound references repointed.
- [x] sk-code and system-spec-kit versions bumped with changelog entries.
- [x] Verification evidence recorded: shipped commit `85a0c2c9ac`, `sk-code-router-sync` 4/4, touched-file links clean, dead-reference sweep clean.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-skill documentation ownership relocation: system-spec-kit owns spec-folder authoring docs, while sk-code keeps cross-skill pointers where code workflows need them.

### Key Components
- **system-spec-kit workflow docs**: new canonical homes for the spec-folder write recipe and authoring checklist.
- **sk-code workflow docs**: inbound pointers from implement and quality workflows.
- **shared smart routing**: machine RESOURCE_MAP and prose reference updates that keep router-sync aligned with moved filesystem paths.
- **speckit complete YAMLs**: cross-skill authoring-load entries that direct completion workflows to system-spec-kit.
- **skill version metadata**: sk-code 4.0.1.0 and system-spec-kit 3.7.1.0 changelog entries.

### Data Flow
Spec-folder completion or authoring intent routes through system-spec-kit COMPLETE resources. sk-code workflows that need spec-folder authoring guidance cross-load the system-spec-kit docs rather than owning those docs locally.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed the two spec-folder authoring docs belonged to system-spec-kit.
- [x] Listed the inbound references that needed repointing.
- [x] Confirmed remaining `{skill,agent,command,mcp_server}` authoring checklists were outside this phase.

### Phase 2: Core Implementation
- [x] Moved `spec_folder_write.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md`.
- [x] Moved `spec_folder_authoring.md` to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md`.
- [x] Repointed moved-doc internal cross-references to same-directory siblings.
- [x] Repointed inbound references across sk-code, shared routing, speckit command YAMLs, and system-spec-kit.
- [x] Added sk-code 4.0.1.0 and system-spec-kit 3.7.1.0 changelog entries.

### Phase 3: Verification
- [x] Ran `sk-code-router-sync` vitest with 4/4 passing.
- [x] Checked touched-file markdown links with no broken links found.
- [x] Ran dead-reference sweep with clean result.
- [x] Shipped as remote commit `85a0c2c9ac`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Router synchronization | Moved filesystem paths and smart-routing machine block | `sk-code-router-sync` vitest |
| Link integrity | Touched markdown and metadata references | Broken-link check among touched files |
| Reference integrity | Old moved paths and inbound references | Dead-reference sweep |
| Shipment evidence | Remote commit containing phase work | Commit `85a0c2c9ac` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit `references/workflows/` | Internal | Green | Moved docs would lack a canonical home |
| sk-code router-sync guard | Internal | Green | RESOURCE_MAP drift could ship undetected |
| speckit completion YAMLs | Internal | Green | Completion workflows could load stale sk-code paths |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Router-sync or reference sweeps fail because the move creates stale or unresolved paths.
- **Procedure**: Revert commit `85a0c2c9ac`, then reapply the relocation with corrected inbound references and rerun the same verification gates.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Existing sk-code and system-spec-kit doc layout | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Shipment |
| Shipment | Verification | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2-3.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Target docs and inbound references identified.
- [x] Out-of-scope checklists left in sk-code.
- [x] Verification gates selected before shipment.

### Rollback Procedure
1. Revert shipped commit `85a0c2c9ac` if relocation breaks routing or links.
2. Restore the two original sk-code doc paths if needed during rollback.
3. Re-run `sk-code-router-sync` and reference sweeps after the rollback or corrected relocation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Git revert only; the phase moved repository documentation and metadata.

<!-- /ANCHOR:enhanced-rollback -->
