---
title: "Feature Specification: sk-create-diagram flowchart capability merge"
description: "Absorb sk-create-flowchart's ASCII/markdown output capability into sk-create-diagram as a second output format, alongside existing HTML/SVG."
trigger_phrases:
  - "diagram flowchart capability merge"
  - "ascii markdown diagram format"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/012-flowchart-capability-merge"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Authored spec + decision-record; dispatching build"
    next_safe_action: "Dispatch to GPT-5.6-luna-fast (max), then verify"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator's own framing: flowchart is for ASCII inside .md files, diagram is HTML/SVG; the merge upgrades sk-create-diagram to support both formats under one skill."
      - "sk-create-flowchart is redirected (SKILL.md + hub routing), not deleted, this phase — physical content preserved for a later, explicit deletion decision (decision-record.md D3)."
      - "Format is a routing dial, not diagram type #28 — avoids colliding with the existing HTML/SVG type-flowchart.md (decision-record.md D1)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: sk-create-diagram flowchart capability merge

## EXECUTIVE SUMMARY

This phase consolidates two overlapping documentation workflows without changing the existing HTML/SVG diagram grammar. `sk-create-diagram` now owns an explicit `html-svg` versus `ascii-markdown` output-format decision, while the existing HTML/SVG flowchart type remains separate from the ported ASCII pattern set.

The source `sk-create-flowchart` package remains physically intact for rollback and reference. Its live routing and command entry point redirect to the merged diagram workflow.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 12 of 15 |
| **Predecessor** | `../011-reference-template-alignment/spec.md` |
| **Successor** | `../013-deep-review-grok-deepseek/spec.md` |
 | **Handoff Criteria** | sk-create-diagram routes both HTML/SVG and ASCII/markdown requests; sk-create-flowchart redirects into it; package and packet validation results are recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### PHASE CONTEXT

**Scope Boundary**: Port capability and wire routing. No deletion of `sk-create-flowchart`'s files, no content rewrite of the ported patterns beyond what's needed to fit the new location.

**Dependencies**: Phase 008's domain-subfolder convention (`references/<domain>/`, `assets/<domain>/`) as the pattern the new subfolders follow.

**Deliverables**: `references/ascii-format/` (4 files), `assets/ascii-patterns/` (6 files), `scripts/validate-flowchart.sh`, an updated `SKILL.md` with the format dial, updated hub-router/mode-registry entries, a redirect stub in `sk-create-flowchart/SKILL.md`, and command-surface wiring for `/create:flowchart` → `/create:diagram`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-create-flowchart` (ASCII/markdown-only) and `sk-create-diagram` (HTML/SVG-only) are two separately-routed skills for overlapping request shapes (decision trees, workflows, system interactions). The packet's own earlier phases explicitly scoped flowchart out as untouched; the operator has now asked to merge flowchart's capability into diagram so one skill serves both output formats.

### Purpose

Upgrade `sk-create-diagram` to route and serve both HTML/SVG (existing, unchanged) and ASCII/markdown (newly absorbed) diagram requests, retire `sk-create-flowchart` as a live routing target via redirect, and keep its shipped content available for reference/rollback rather than deleting it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Port `sk-create-flowchart/references/{README,notation-and-validator,pattern-selection,worked-example}.md` → `sk-create-diagram/references/ascii-format/` (4 files — `references/README.md` was confirmed via `leaf-manifest.json`'s `sk-create-flowchart` leaves array).
- Port `sk-create-flowchart/assets/*.md` (6 pattern files) → `sk-create-diagram/assets/ascii-patterns/`.
- Port `sk-create-flowchart/scripts/validate-flowchart.sh` → `sk-create-diagram/scripts/validate-flowchart.sh`.
- Rewrite `sk-create-diagram/SKILL.md`: add ASCII/markdown activation triggers and keywords, add a format-resolution step to Smart Routing (html-svg vs ascii-markdown), add the ported pattern-selection table, add validator requirement to Rules.
- Update `sk-doc/hub-router.json`: merge `create-flowchart-aliases` keywords (confirmed list: `create flowchart`, `flowchart`, `ASCII flowchart`, `workflow diagram`, `text diagram`, `text characters`, `decision tree`, `decision branch`, `swimlane`, `parallel execution diagram`, `approval loop diagram`) into `create-diagram-aliases`, keep `sk-create-flowchart`'s own signal present but redirect-noted, not removed.
- Update `sk-doc/mode-registry.json`: extend `modes[11]` (sk-create-diagram)'s `aliases` array with the flowchart keywords above (dedupe against existing entries like `swimlane`, already present); leave `modes[8]` (sk-create-flowchart) structurally intact.
- Update `sk-doc/leaf-manifest.json`: extend sk-create-diagram's `leaves` array with the 11 newly ported file paths (4 references + 6 assets + 1 script) under their new `ascii-format/`/`ascii-patterns/` locations; sk-create-flowchart's own entry stays accurate since its files are untouched.
- Update `sk-doc/graph-metadata.json` (the hub's own advisor identity file, schema_version 2): its `domains` array already lists `"flowchart"` but never listed `"diagram"` — a real, pre-existing gap independent of this merge. Add `"diagram"` to `domains` and add diagram-relevant `intent_signals` entries (e.g. "create diagram", "html svg diagram") alongside the existing flowchart ones.
- After all JSON edits: run the Skill Advisor's `advisor_rebuild` (or `skill_graph_scan`) to refresh the live index, then `advisor_validate` (or `skill_graph_validate`) to confirm no drift — editing JSON on disk without refreshing the live advisor state leaves routing behavior stale.
- Convert `sk-create-flowchart/SKILL.md`'s "When to Use" section into an explicit redirect: "This capability now lives in sk-create-diagram (ascii-markdown format) — see \`sk-create-diagram/SKILL.md\`."
- Wire `/create:flowchart` (`flowchart.md` + its YAML assets) as a thin pass-through into `/create:diagram` with the ascii-markdown format pre-selected.

### Out of Scope

- Deleting any `sk-create-flowchart` file (decision-record.md D3).
- Rewriting the 6 ported pattern examples' content — port verbatim, adapt only path references.
- Touching the existing 27 HTML/SVG diagram types or `type-flowchart.md`.
- Re-authoring `manual-testing-playbook/` or `feature-catalog/` for the new format (a natural phase-013 follow-up, not bundled here).

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `sk-create-diagram/references/ascii-format/*.md` | Create | 4 ported reference files |
| `sk-create-diagram/assets/ascii-patterns/*.md` | Create | 6 ported pattern examples |
| `sk-create-diagram/scripts/validate-flowchart.sh` | Create | Ported validator |
| `sk-create-diagram/SKILL.md` | Edit | Format dial, triggers, keywords, rules |
| `sk-create-diagram/scripts/README.md` | Edit | Add the ported script's entry |
| `sk-doc/hub-router.json` | Edit | Merge flowchart keywords into diagram's routing |
| `sk-doc/mode-registry.json` | Edit | Extend diagram's alias array; flowchart entry unchanged |
| `sk-doc/leaf-manifest.json` | Edit | Add 11 ported file paths to diagram's leaves array |
| `sk-doc/graph-metadata.json` | Edit | Add missing `"diagram"` domain (pre-existing gap) + intent signals |
| `sk-create-flowchart/SKILL.md` | Edit | Redirect stub |
| `.opencode/commands/create/flowchart.md` + assets | Edit | Thin pass-through into `/create:diagram` |
| `012-flowchart-capability-merge/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-create-diagram's Smart Routing resolves a format dial (html-svg default, ascii-markdown when the request shape matches) before selecting the type/pattern. | `SKILL.md` §2 documents the resolution rule explicitly. |
| REQ-002 | All 9 ported files (3 references + 6 patterns) exist at their new paths with content intact. | File existence + diff against the original confirms only path-relative link changes. |
| REQ-003 | The ported validator runs from its new location with an unchanged exit-code contract. | `bash scripts/validate-flowchart.sh <target>` exits 0/1 exactly as it did in its original location. |
| REQ-004 | sk-create-flowchart no longer wins routing for flowchart-shaped requests — it redirects instead. | `hub-router.json` reflects the merge; `sk-create-flowchart/SKILL.md`'s "When to Use" states the redirect explicitly. |
| REQ-007 | The Skill Advisor's live index reflects the merge, not just the on-disk JSON. | `advisor_rebuild`/`skill_graph_scan` run after edits; `advisor_validate`/`skill_graph_validate` reports no drift. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `validate_skill_package.py --strict` passes on `sk-create-diagram` after the merge. | Command output captured. |
| REQ-006 | `/create:flowchart` still works end-to-end, now via the redirect into `/create:diagram`. | Manual invocation trace confirms the pass-through. |
| REQ-008 | `leaf-manifest.json` and `graph-metadata.json` (hub identity) accurately reflect the merge. | 11 new leaf paths present; `"diagram"` present in `domains`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-create-diagram serves both formats from one skill, confirmed by a routing trace for each.
- **SC-002**: `sk-create-flowchart` content is intact but no longer the live routing target.
- **SC-003**: `validate_skill_package.py --strict` and `validate-flowchart.sh` both pass post-merge.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The format dial could misroute an ambiguous request (e.g. "show me a decision tree" with no format hint). | Medium | Follow the existing UNKNOWN_FALLBACK pattern already used elsewhere in this skill's routing — ask rather than guess. |
| Risk | Hub JSON edits (`hub-router.json`, `mode-registry.json`) have wider blast radius than a packet-local file. | Medium | Independently verify JSON validity and re-run `validate_skill_package.py --strict` after edits, same discipline as phase 009's registry check. |
| Dependency | Phase 008's domain-subfolder convention | High | New subfolders (`ascii-format/`, `ascii-patterns/`) follow the identical shape already established for `types/`, `primitives/`, `import-export/`, `foundations/`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Routing

- **NFR-R01**: Requests with an explicit ASCII or markdown target resolve to `ascii-markdown` before pattern selection.
- **NFR-R02**: Requests without an ASCII or markdown signal retain the existing `html-svg` default.

### Integrity

- **NFR-I01**: Ported reference, pattern, and validator content remains intact except for required relative-link updates.
- **NFR-I02**: Existing `--format png|svg|html+png` export semantics remain distinct from the new `--output-format` routing dial.

---

## 8. EDGE CASES

### Ambiguous format

- A request that names a flowchart but supplies no output-format signal follows the existing clarification or default behavior rather than inventing an ASCII pattern.

### Existing HTML flowchart type

- A request for an HTML/SVG flowchart continues to use `references/types/type-flowchart.md` and does not resolve to the ASCII pattern set.

### Source preservation

- The redirect leaves the source skill's references, assets, and validator available so rollback does not require reconstructing content.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Multiple skill, command, registry, manifest, and validator surfaces |
| Risk | 20/25 | Shared advisor routing and overlapping flowchart request vocabulary |
| Research | 14/20 | Existing skill contracts, command assets, and manifest conventions inspected |
| Multi-Agent | 8/15 | One implementation dispatch plus independent verification |
| Coordination | 10/15 | Port integrity, live advisor refresh, and packet validation are coupled |
| **Total** | **74/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|----------|-------------|--------|------------|------------|
| R-001 | Format signals could misroute an ambiguous request. | M | M | Resolve explicit signals first and retain the existing fallback behavior. |
| R-002 | Registry edits could leave live advisor state stale. | H | M | Rebuild and validate the advisor after JSON changes. |
| R-003 | Relative links could break during the port. | M | M | Compare every source/target reference and run the target validator. |
| R-004 | Redirect and source content could diverge. | M | L | Keep source resources untouched and inspect the redirect separately. |

---

## 11. USER STORIES

### US-001: Create an ASCII flowchart (Priority: P0)

**As a** documentation author, **I want** to request an ASCII flowchart through the diagram workflow, **so that** I can keep the result inside a markdown document.

**Acceptance Criteria**:
1. Given an ASCII or markdown output signal, when the request is routed, then `ascii-markdown` is selected before pattern selection.

### US-002: Preserve HTML/SVG diagrams (Priority: P0)

**As a** diagram author, **I want** existing HTML/SVG requests to retain their current path, **so that** the merge does not change shipped diagram behavior.

**Acceptance Criteria**:
1. Given an HTML/SVG flowchart request, when the request is routed, then the existing HTML/SVG flowchart type remains selected.

### US-003: Keep the old entry point usable (Priority: P1)

**As a** user of `/create:flowchart`, **I want** the command to redirect into the merged workflow, **so that** existing invocations continue to reach the capability.

**Acceptance Criteria**:
1. Given `/create:flowchart`, when the command runs, then it passes through to `/create:diagram` with `ascii-markdown` pre-selected.

---

## 12. OPEN QUESTIONS

None — merge scope, redirect-not-delete decision, and format-dial architecture are resolved in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
- Packet root: `../spec.md`
- Source skill: `.opencode/skills/sk-doc/sk-create-flowchart/SKILL.md`
