---
title: "Feature Specification: Phase 008 Final Cleanup"
description: "Complete Packet 070 final P1 cleanup by strengthening deep-review advisor routing, renaming the internal deep-loop family, and normalizing sk-code entity metadata."
trigger_phrases:
  - "070 phase 008"
  - "final cleanup"
  - "iterative review loop"
  - "deep-loop family"
  - "reference-category entity kind"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-sk-deep-rename/008-final-cleanup"
    last_updated_at: "2026-05-05T17:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 008 final cleanup patches"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to refresh native routing"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 008 Final Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 008 of 008 |
| **Handoff Criteria** | P1-002, P1-003, and P1-004 are fixed in the approved write set; child and parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 070 still has three approved P1 cleanup gaps. Advisor routing can prefer single-pass `sk-code-review` over `deep-review` for iterative review-loop audit prompts, the internal graph family still uses the old `sk-deep` identity, and `sk-code` metadata uses a rejected `reference-category` entity kind.

### Purpose
Phase 008 closes those final P1 findings with targeted JSON and compiler updates, then records verification evidence in the phase packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 008 Level 2 planning, decision, checklist, metadata, and implementation artifacts.
- Strengthen `deep-review` positive advisor signals for iterative review-loop audit prompts.
- Add matching `sk-code-review` anti-signals so single-pass review does not win loop-language prompts.
- Rename the internal family taxonomy from `sk-deep` to `deep-loop` in graph source, per-skill metadata, and compiler validation.
- Normalize `.opencode/skills/sk-code/graph-metadata.json` entity kind from `reference-category` to `reference`.
- Add Phase 008 to the parent packet `children_ids`.
- Run JSON, advisor validation, targeted grep, and strict spec validation checks.

### Out of Scope
- Rebuilding advisor artifacts through the orchestrator-owned rebuild MCP path.
- Editing Packet 070 P0 remediation or changelog symlink work from Phase 007.
- Changing unrelated skill metadata or broadening entity-kind semantics.
- Modifying files outside the approved write set.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/spec.md` | Create/Update | Phase 008 scope and requirements |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/plan.md` | Create/Update | Cleanup execution plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/tasks.md` | Create/Update | One task per finding and verification item |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/decision-record.md` | Create | ADRs for family name, entity kind, and signal strategy |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/implementation-summary.md` | Create | Final cleanup summary after fixes |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/description.json` | Create | Canonical packet description |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup/graph-metadata.json` | Create/Update | Canonical graph metadata |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/graph-metadata.json` | Update | Add Phase 008 child ID |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Update | P1-002 signals and P1-003 family bucket |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Update | P1-003 family allow-list |
| `.opencode/skills/deep-review/graph-metadata.json` | Update | P1-003 family field |
| `.opencode/skills/deep-research/graph-metadata.json` | Update | P1-003 family field |
| `.opencode/skills/sk-code/graph-metadata.json` | Update | P1-004 entity kind |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve scope lock | Git diff touches only the approved write set |
| REQ-002 | Keep JSON parseable | All edited JSON files parse after patching |
| REQ-003 | Validate spec artifacts | Phase 008 and parent strict validation exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Make `deep-review` win iterative audit prompts | Probe for `iterative review loop for spec folder audit` ranks `deep-review` top-1 after the available advisor source path is evaluated |
| REQ-005 | Rename internal family to `deep-loop` | `skill-graph.json` has `families.deep-loop`, no `families.sk-deep`, and per-skill metadata no longer has `"family": "sk-deep"` |
| REQ-006 | Keep compiler validation aligned | `ALLOWED_FAMILIES` accepts `deep-loop` and no longer requires `sk-deep` |
| REQ-007 | Normalize rejected entity kind | `sk-code` metadata uses `"kind": "reference"` for the motion_dev entity |
| REQ-008 | Record decisions | `decision-record.md` includes ADR-001 through ADR-003 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `signals.deep-review` contains all requested positive prompt strings.
- **SC-002**: `anti_signals.sk-code-review` contains all requested anti-signal strings.
- **SC-003**: Family metadata uses `deep-loop` across `skill-graph.json`, `deep-review`, `deep-research`, and compiler allow-list.
- **SC-004**: No `"family": "sk-deep"` rows remain in active skill graph metadata files.
- **SC-005**: `reference-category` no longer appears in `sk-code` graph metadata.
- **SC-006**: Phase 008 and parent packet strict validation both exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor scoring depends on compiled artifacts | Medium | Patch source graph and run the available advisor probe; note orchestrator rebuild ownership if needed |
| Risk | Family allow-list divergence | Medium | Patch compiler allow-list and per-skill metadata in the same phase |
| Risk | Entity-kind normalization hides category semantics | Low | Record ADR choosing smaller blast radius over extending the allow-list |
| Dependency | `/usr/bin/python3` | Medium | Required for JSON parse, advisor validation, and probe checks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions. The user selected `deep-loop` and supplied the approved write set.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Scope Safety**: No edits outside the approved write set.
- **Traceability**: Each P1 finding maps to one task, one checklist item, and one verification result.
- **Data Integrity**: JSON syntax and compiler validation stay aligned.
- **Routing Precision**: Iterative review-loop wording should favor the autonomous review loop over single-pass code review.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- `sk-code-review` remains valid for one-pass PR and code review prompts; only loop/audit/convergence wording is anti-signaled.
- `deep-loop` is a family taxonomy value, not a skill ID; skill IDs remain `deep-review` and `deep-research`.
- The `motion_dev` entity remains represented as reference material after its kind is normalized to `reference`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Medium | Phase docs plus five active metadata/compiler surfaces |
| Behavioral Risk | Medium | Advisor routing behavior changes, but only through explicit prompt signals |
| Verification Risk | Medium | Advisor probe can depend on compiled/rebuilt state |
| Coordination Risk | Low | Write set and target changes are fully specified |
<!-- /ANCHOR:complexity -->
