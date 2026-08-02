---
title: "Feature Specification: Phase 6 - Webflow hub registration and advisor surface"
description: "Register the mcp-webflow mode across the hub registry, router, smart-routing leaf sets, advisor metadata, compiled routing, and leaf manifest, then prove parent-skill validation passes."
trigger_phrases: ["webflow hub registration", "mcp-webflow phase 6", "webflow advisor registration"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/006-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T16:30:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending hub registration and advisor contract"
    next_safe_action: "Wait for Phase 5 catalog and playbook"
    blockers: ["Phase 5 is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 - Webflow hub registration and advisor surface

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 8 |
| **Predecessor** | `005-feature-catalog-and-playbook` |
| **Successor** | `007-routing-benchmark-and-deep-review` |
| **Handoff Criteria** | The mode is discoverable through the registry, router, smart-routing, advisor metadata, compiled routing, and leaf manifest; all parent-skill and freshness checks pass; hub docs list the mode. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase makes `mcp-webflow` a first-class member of the `mcp-tooling` hub. Registration is generated and validated through the hub's canonical scripts rather than hand-edited manifests, and the advisor identity metadata stays at the hub root — never inside the leaf packet.

**Dependencies**: completed Phases 1-5 and current sk-create-skill packaging/validation contracts.

**Deliverables**: registry entry, router vocabulary, smart-routing leaf sets, refreshed hub SKILL.md and advisor metadata, regenerated leaf manifest, compiled-routing scenarios, changelog entry, and passing hub checks.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
An authored mode that is not registered is invisible: the hub router never selects it, the advisor cannot recommend it, compiled routing does not cover it, and the leaf manifest stays stale. Hand-editing hub manifests without running the canonical generators produces freshness failures and duplicate advisor metadata.

### Purpose
Register `mcp-webflow` through every hub surface using the canonical scripts, and prove the hub validates clean afterward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Add the `mcp-webflow` entry to `mode-registry.json` using the `packetKind`/`backendKind` classification frozen in Phase 2.
- Add Webflow vocabulary and signals to `hub-router.json`; add Webflow intent leaf sets to `shared/references/smart-routing.md`.
- List the mode in the hub `SKILL.md` mode surface.
- Refresh hub-root `description.json`/`graph-metadata.json` advisor identity only at the hub root; the leaf packet carries no advisor metadata.
- Regenerate `leaf-manifest.json` and derived metadata with the canonical generators, then add compiled-routing scenarios.
- Run parent-skill and freshness checks and record evidence; add a hub changelog entry.

### Out of Scope
- Routing benchmarks and deep review (Phase 7).
- Final verification and live smoke (Phase 8).
- Any advisor metadata files inside `mcp-webflow/` — identity metadata lives at the hub root only.
- Touching sibling `014-mcp-magnific` or unrelated hub modes.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add `mcp-webflow` mode entry with Phase 2 classification |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Add Webflow intent vocabulary and router signals |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | Add per-mode Webflow leaf sets |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | List the Webflow mode surface |
| `.opencode/skills/mcp-tooling/description.json` and `graph-metadata.json` | Modify | Hub-root advisor identity only |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | Canonical generator output |
| `.opencode/skills/mcp-tooling/changelog/v1.x.y.z.md` | Modify | Record hub registration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register the mode in the registry | `mode-registry.json` has one canonical `mcp-webflow` entry with fields matching the Phase 2 classification |
| REQ-002 | Route Webflow intents | `hub-router.json` and `smart-routing.md` emit the mode for Webflow intent and no other mode |
| REQ-003 | Keep advisor metadata single-sourced | Hub-root identity metadata refreshed; no `description.json`/`graph-metadata.json` inside `mcp-webflow/` |
| REQ-004 | Regenerate generated assets with canonical scripts | `leaf-manifest.json` and derived metadata match generator output; freshness checks pass |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Prove hub validation | `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs mcp-tooling`, and compiled-routing scenario validation pass |
| REQ-006 | Document the change | Hub SKILL.md lists the mode; changelog entry records the registration |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A Webflow intent resolves to `mcp-webflow` in the registry, router, and smart-routing surfaces.
- **SC-002**: Generated assets are current and freshness/validation scripts exit clean.
- **SC-003**: No advisor metadata exists inside the leaf packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 classification | Registry entry would be wrong | Block until the mode kind/backend contract is accepted |
| Risk | Hand-edited generated manifests | Freshness checks fail | Edit source inputs only; regenerate with canonical scripts |
| Risk | Duplicate advisor metadata | Identity ambiguity and validation errors | Keep identity at hub root per the root-metadata contract |
| Risk | Router confusion with design modes | Wrong mode selected | Boundary-tested in Phase 7; register distinct vocabulary now |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Which `hub-router.json` vocabulary classes best capture Webflow site, CMS, and publish intents without colliding with existing modes?
- Does the current hub changelog versioning require a minor bump for a new mode?
<!-- /ANCHOR:questions -->
