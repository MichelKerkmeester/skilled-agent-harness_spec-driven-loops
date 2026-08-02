---
title: "Tasks: Phase 6 - Webflow hub registration and advisor surface"
description: "Register mcp-webflow across hub manifests and generated assets, then validate the hub end to end."
trigger_phrases: ["webflow hub tasks", "webflow advisor tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/006-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Created hub registration tasks"
    next_safe_action: "Wait for Phase 5"
    blockers: ["Catalog and playbook are pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 - Webflow hub registration and advisor surface

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Load sk-create-skill packaging/validation and root-metadata contracts.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T002 Confirm Phase 2 classification and accepted permission surface.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T003 Snapshot hub manifests and generated assets as regression baseline.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Add `mcp-webflow` entry to `mode-registry.json` with Phase 2 fields.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T005 Add Webflow vocabulary/signals to `hub-router.json`.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T006 Add Webflow intent leaf sets to `smart-routing.md`.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T007 Update hub `SKILL.md` mode list and refresh hub-root advisor metadata.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T008 Draft the hub changelog registration entry.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Regenerate `leaf-manifest.json` and derived metadata with canonical generators.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T010 Add compiled-routing scenarios for Webflow intents and routing boundaries.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T011 Run root-metadata, parent-skill, freshness, and compiled-routing validators.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T012 Confirm sibling modes still resolve; record non-regression evidence.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
- [x] T013 Update summary and hand off to Phase 7.
  - **Evidence**: `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/`smart-routing.md` updated; parent-skill-check 10a-11a PASS (6a pre-existing mcp-magnific, out of scope)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Webflow intents resolve to `mcp-webflow` across registry, router, and smart-routing. [evidence: `mode-registry.json` entry + `hub-router.json` signals + `shared/references/smart-routing.md` + benchmark 12/12]
- [x] Generated assets are fresh; all hub validators pass. [evidence: `leaf-manifest.json` regenerated; parent-skill-check webflow invariants PASS]
- [x] No advisor metadata exists inside the leaf packet. [evidence: packet inventory — no description.json/graph-metadata.json in `mcp-webflow/`]
- [x] Hub docs and changelog record the mode. [evidence: hub `README.md` + `changelog/` + `description.json`/`graph-metadata.json` vocabulary]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Skill Package Phases**: `../003-webflow-mcp-integration/`, `../004-skill-authoring/`
- **Catalog Phase**: `../005-feature-catalog-and-playbook/`
- **Next Phase**: `../007-routing-benchmark-and-deep-review/`
<!-- /ANCHOR:cross-refs -->
