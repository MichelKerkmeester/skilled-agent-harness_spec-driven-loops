---
title: "Feature Specification: Phase 006 Routing Precision Fixes"
description: "Phase 006 remediates the 9 findings from the Phase 005 cross-CLI smart-routing audit. It restores critical-path routing for RD-002 doc-only edits and CS-002 explicit non-Webflow Motion.dev prompts, then tightens resource path precision, advisor signals, and result extraction."
trigger_phrases:
  - "phase 006 routing precision"
  - "packet 069 routing fixes"
  - "RD-002 sk-doc routing"
  - "CS-002 non-Webflow guard"
  - "motion.dev path precision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/006-routing-precision-fixes"
    last_updated_at: "2026-05-05T13:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Remediating 9 audit findings"
    next_safe_action: "Validate post-fix"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "../../../.opencode/skills/sk-code/SKILL.md"
      - "../../../.opencode/skills/sk-code/references/router/code_surface_detection.md"
      - "../../../.opencode/skills/sk-code/references/router/intent_classification.md"
      - "../../../.opencode/skills/sk-code/references/router/resource_loading.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Gate 3 was pre-approved by the user for this phase folder."
      - "The skill-graph file lives at mcp_server/skill_advisor/scripts/skill-graph.json in this repo."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 006 Routing Precision Fixes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Packet** | `006-routing-precision-fixes` |
| **Parent Packet** | `specs/skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook` |
| **Source Audit** | `../005-playbook-cross-cli-execution/playbook-execution-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 proved the Motion.dev peer-reference architecture works on the majority path, but the matrix still returned CONDITIONAL because two critical routing classes failed. Doc-only edits to skill markdown still routed to `sk-code`, and explicit non-Webflow vanilla Motion.dev prompts were promoted to WEBFLOW by some runtimes.

### Purpose
Apply all 9 audit remediations so routing decisions become sharper, exact Motion.dev and Webflow reference paths become contractual, and the cross-CLI runners produce higher-quality YAML evidence for future audits.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 006 Level 2 planning, checklist, graph metadata, and implementation summary artifacts.
- Tune sk-code router docs and SKILL.md smart routing for doc-only markdown edits and explicit non-Webflow guards.
- Tune skill-advisor graph signals for `sk-doc`, `sk-code`, and `system-spec-kit` routing precision.
- Normalize Webflow, Motion.dev, performance, decision, and snippet reference paths in router documentation.
- Harden Phase 005 runner YAML extraction without changing historical result evidence.
- Run the required mini recheck matrix and store copied result YAMLs under Phase 006.

### Out of Scope
- Editing Phase 005 historical result YAMLs or the audit report.
- Adding new supported surfaces beyond WEBFLOW, OPENCODE, and UNKNOWN.
- Rebuilding the full skill-advisor daemon index or changing scorer implementation code outside the approved graph file.
- Running the full 52-dispatch cross-CLI matrix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `006-routing-precision-fixes/*.md` | Create | Phase 006 spec, plan, task ledger, checklist, and summary |
| `006-routing-precision-fixes/graph-metadata.json` | Create | Canonical graph metadata for the phase child |
| `006-routing-precision-fixes/spot-recheck-results/` | Create | Copied mini-matrix result YAMLs |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Router exclusions and non-Webflow pre-check |
| `.opencode/skills/sk-code/references/router/*.md` | Modify | Intent anti-signals, explicit non-Webflow guards, exact resource contracts |
| `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md` | Modify | Contract regression examples |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md` | Modify | Contract regression examples |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Modify | Advisor signals and anti-signals |
| `005-playbook-cross-cli-execution/scripts/run_*.sh` | Modify | YAML parser quality flags and placeholder rejection |
| `../spec.md` | Modify | Parent phase documentation map row for Phase 006 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | RD-002 doc-only markdown edits route to `sk-doc` | `SKILL.md`, intent docs, and skill graph all state doc-only SKILL.md headline/description/summary/readme edits are `sk-doc`, not `sk-code` |
| REQ-002 | CS-002 explicit non-Webflow Motion.dev prompts never become WEBFLOW | Negative Webflow phrases force UNKNOWN or N/A before Webflow marker checks, while still allowing `motion_dev/*` resources |
| REQ-003 | Critical rechecks produce stored evidence | RD-002, CS-002, and LS-001 recheck YAMLs are copied into `spot-recheck-results/` with verdict rationale |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | WEBFLOW detection loads the implementation trio | `resource_loading.md` names the canonical Webflow implementation trio as a MUST load |
| REQ-005 | Performance and decision refs are exact paths | Performance and decision tables name canonical files, not directory placeholders |
| REQ-006 | Executable `.opencode/` edits favor `sk-code` over `system-spec-kit` | Skill graph adds executable-code edit positives for `sk-code` and anti-signals for `system-spec-kit` |
| REQ-007 | Motion.dev regression examples capture contract drift | `decision_matrix.md` and `playbook_entries.md` include routing/ref expectations for future checks |

### P2 - Polish

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Runner YAML extraction emits useful diagnostics | Runners avoid bare `|` excerpts, reject directory placeholders, and emit `quality_flags` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 006 strict spec validation exits 0.
- **SC-002**: Parent Packet 069 strict validation exits 0.
- **SC-003**: `skill-graph.json` parses as valid JSON.
- **SC-004**: `spot-recheck-results/` contains RD-002, CS-002, and LS-001 result YAMLs.
- **SC-005**: Implementation summary maps all F-001 through F-009 findings to FIXED, PARTIAL, or DEFERRED with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Nested CLI network access | Recheck scripts can fail before producing model analysis | Capture exit codes, parser output, and document blocked results honestly |
| Risk | Advisor graph schema support | `anti_signals` may be advisory if the active scorer ignores the field | Pair graph changes with SKILL.md and router doc rules that recheck prompts can read |
| Risk | Directory placeholder rejection | Some historical outputs used broad refs | Apply only to newly generated runner results and leave historical evidence unchanged |
| Risk | Parent metadata drift | Parent map can omit new child row | Patch only the Phase Documentation Map and verify graph `children_ids` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Keep edits inside the approved Phase 006 scope.
- Preserve historical Phase 005 audit files as immutable evidence.
- Use exact relative paths for every router resource contract.
- Keep runner parser changes duplicated consistently across all four CLI scripts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A request can mention `.opencode/skills/sk-code/SKILL.md` and still be documentation-only; doc-only language routes to `sk-doc`.
- A request can mention Motion.dev and vanilla HTML/CSS/JS but explicitly say NOT Webflow; that remains UNKNOWN or N/A and loads Motion.dev peer resources only.
- A result can include `references/motion_dev/` or another directory placeholder; the parser treats that as malformed and records `directory_placeholder_refs`.
- A model can produce an empty or block-marker-only response excerpt; the parser emits `(no response)` and records `empty_excerpt`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | Router docs, one generated graph JSON, four runner scripts, and phase docs |
| Behavioral risk | Medium | Routing contracts affect future AI dispatches, but no production runtime app behavior changes |
| Documentation risk | Medium | Exact-path contracts must stay synchronized with real filenames |
| Verification complexity | Medium | Requires strict spec validation, JSON parsing, and nested CLI rechecks that may be environment-bound |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. If nested CLI rechecks fail due sandbox or network access, record the blocker and generated parser evidence in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Audit Report**: `../005-playbook-cross-cli-execution/playbook-execution-report.md`
- **RD-002 Evidence**: `../005-playbook-cross-cli-execution/results/RD-002-codex.yaml`, `../005-playbook-cross-cli-execution/results/RD-002-opencode.yaml`
- **CS-002 Evidence**: `../005-playbook-cross-cli-execution/results/CS-002-gemini.yaml`, `../005-playbook-cross-cli-execution/results/CS-002-opencode.yaml`
- **Implementation Plan**: `plan.md`
- **Task Ledger**: `tasks.md`
- **Verification Checklist**: `checklist.md`
<!-- /ANCHOR:related-docs -->
