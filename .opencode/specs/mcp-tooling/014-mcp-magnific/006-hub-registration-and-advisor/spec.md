---
title: "Feature Specification: Phase 6 — Register mcp-magnific in the hub and advisor"
description: "Register the Magnific transport mode across mcp-tooling registry, router, advisor identity, smart-routing resources, leaf projection, compiled-routing inputs, and repository documentation."
trigger_phrases:
  - "register mcp-magnific"
  - "magnific hub routing"
  - "magnific advisor discovery"
  - "mcp-magnific phase 6"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/006-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T13:36:51Z"
    last_updated_by: "spec-author"
    recent_action: "Define Magnific hub registration phase"
    next_safe_action: "Register the validated mode package"
    blockers:
      - "Phase 5 package must validate before shared hub edits"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-magnific-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 — Register mcp-magnific in the hub and advisor

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | `005-feature-catalog-and-playbook` |
| **Successor** | `007-verification-and-closeout` |
| **Handoff Criteria** | Hub registry, router, advisor, smart-routing, leaf manifest, compiled-routing inputs, and README consistently identify the new mode. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This is the shared-surface phase. It makes a validated package routable under the hub's single advisor identity while preserving transport-axis rules and existing mode behavior.

**Scope Boundary**: Shared registration and generated projections only. Do not change another mode's workflow contract.

**Dependencies**:
- Validated package from Phases 4–5.
- Current hub registry/router schemas.
- Manifest generator, compiled-routing tools, advisor scanner, and parent-skill checker.

**Deliverables**:
- Consistent `mcp-magnific` entry and vocabulary across all hub surfaces.
- Regenerated leaf projection and verified routing.
- Repository README entry.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A mode package on disk remains invisible until both hub-local routing and advisor-level hub discovery include its vocabulary. Partial registration creates drift between registry, router, smart-routing, manifest, and documentation.

### Purpose
Register Magnific atomically across every required awareness surface and prove that Magnific prompts resolve to `mcp-tooling → mcp-magnific`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Registry entry with transport classification and minimal tools.
- Router signals, vocabulary classes, tie-break ordering, and resources.
- Hub SKILL mode table and resource references.
- Hub description/graph keywords and intent signals.
- Smart-routing intent and resource map.
- Leaf-manifest regeneration, compiled-route synchronization, advisor scan/recall, and README update.

### Out of Scope
- Editing package content except registration-driven path corrections.
- Changing other mode aliases or permissions.
- Activating compiled serving authority beyond the current hub policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add `mcp-magnific` transport entry |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Add routing signal and vocabulary |
| `.opencode/skills/mcp-tooling/{SKILL.md,description.json,graph-metadata.json}` | Modify | Update hub docs and advisor identity |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | Add Magnific route resources |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | Project mode leaves |
| `README.md` | Modify | Add integration listing |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add one canonical registry entry | Folder, packet skill name, aliases, packet kind, backend kind, and tool surface agree |
| REQ-002 | Keep router and registry synchronized | Given a registry mode, router signals and tie-break include it exactly once |
| REQ-003 | Preserve single advisor identity | No graph or description metadata is added inside `mcp-magnific` |
| REQ-004 | Regenerate projections | Leaf and compiled-routing checks use generators and freshness verification, not hand-authored digests |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Prove advisor recall | Magnific prompts return `mcp-tooling` and hub routing selects `mcp-magnific` |
| REQ-006 | Update repository docs | Integration list and skill table describe the verified mode without unsupported claims |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent-skill and route validators report no Magnific registration drift.
- **SC-002**: Advisor and hub routing resolve narrow Magnific prompts correctly.
- **SC-003**: Every routed resource path exists and no existing mode behavior regresses.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared hub files | Broad blast radius | Snapshot and edit all registration surfaces in one pass |
| Risk | Generic image-generation vocabulary collides with design routes | Wrong mode selected | Use Magnific-specific aliases and require explicit product signal |
| Risk | Manual leaf edits | Generated drift | Run the canonical generator only |
| Risk | Compiled route stale | Legacy/compiled mismatch | Run freshness verification and retain documented fallback |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which generic creative phrases are safe to add without stealing traffic from `sk-design` or other transports?
- Does current compiled-routing policy serve the new mode immediately or only shadow it after re-minting?
<!-- /ANCHOR:questions -->
