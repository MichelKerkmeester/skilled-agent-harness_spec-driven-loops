---
title: "Feature Specification: sk-design-interface evolution"
description: "Record of de-vendoring sk-design-interface from the MIT ui-ux-pro-max repo to an Apache-2.0-only v1.1.0 (ordered: data first, MIT notices second, Apache base kept) and wiring the Open Design integration through the shared claude_design_parity.md loop (live-read only, never cached). Already shipped as commit b12ffd3d76."
trigger_phrases:
  - "sk-design-interface de-vendor"
  - "ui-ux-pro-max apache only"
  - "open design integration parity loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/003-sk-design-interface-evolution"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the shipped sk-design-interface v1.1.0 de-vendor (commit b12ffd3d76)"
    next_safe_action: "Operator reviews the record, then phase 004 validation follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:17adcee86e1f27a38b266a728f01448f81fb41291430ce729fad6740c26cfe8b"
      session_id: "session-150-003-sk-design-interface-evolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-design-interface evolution

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
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Type** | Retroactive record of completed work (already shipped) |
| **Commit** | `b12ffd3d76` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-design-interface` skill still vendored data and scripts derived from the MIT `ui-ux-pro-max` repo: nine CSV inventories (colors, typography, products, ui-reasoning, ux-guidelines, and the rest), the `design_search` scripts that queried them, and the MIT license notices that came with them. That vendored data carried license obligations and encoded the templated AI-default patterns the skill exists to resist. With phase 002 shipping `mcp-open-design`, the skill could instead read live design systems from the user's own installed Open Design app, making the vendored inventory both a liability and redundant.

### Purpose
De-vendor `sk-design-interface` to an Apache-2.0-only state and integrate it with `mcp-open-design`, so design work grounds on live, locally owned sources under a clean license. Remove the MIT-derived data and scripts in the legally safe order (data first, MIT notices second), keep the Apache-2.0 base and `LICENSE.txt`, and route the Open Design integration through the shared `claude_design_parity.md` loop with live reads that are never cached into the repo.

> **Retroactive record.** This packet documents work that already shipped as commit `b12ffd3d76`. It is a past-tense record pointing to the deliverable at `.opencode/skills/sk-design-interface/`. It does not re-do the de-vendor and it does not edit the skill.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Removing the MIT `ui-ux-pro-max`-derived assets: the nine data CSVs, the data README, and the `design_search` scripts.
- Removing the MIT license notices (`LICENSE-ui-ux-pro-max.txt`, `THIRD-PARTY-NOTICES.md`) in the ordered sequence: data first, then notices.
- Keeping the Apache-2.0 base and `LICENSE.txt` (the kept `design_principles.md` is verbatim Apache-2.0 Anthropic content).
- Wiring the Open Design integration through `references/claude_design_parity.md`: ground, reuse, render, check, revise, hand off, reading Open Design systems live via `mcp-open-design` and never caching them.
- Bumping the skill to v1.1.0 with a v1.1.0.0 changelog and updating the feature catalog, playbook, references, and graph-metadata.

### Out of Scope
- Building `mcp-open-design` (phase 002, shipped) and the live `od mcp install` verification (phase 004).
- The seed-of-thought variation-diversity logic (phase 005, a later v1.2.0).
- Re-deriving or caching Open Design content into the repo. The skill reads live and caches nothing.
- Editing the 150 parent control docs.

### Files Changed (already shipped in commit `b12ffd3d76`)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design-interface/assets/data/*.csv` (nine files) | Removed | The MIT-derived data inventory deleted first |
| `.opencode/skills/sk-design-interface/assets/data/README.md` | Removed | The vendored data README |
| `.opencode/skills/sk-design-interface/scripts/design_search*.py` | Removed | The scripts that queried the vendored data |
| `.opencode/skills/sk-design-interface/LICENSE-ui-ux-pro-max.txt` | Removed | The MIT notice, removed after the data |
| `.opencode/skills/sk-design-interface/THIRD-PARTY-NOTICES.md` | Removed | The MIT third-party notices, removed after the data |
| `.opencode/skills/sk-design-interface/references/claude_design_parity.md` | Modified | Open Design integration, live-read-only sourcing |
| `.opencode/skills/sk-design-interface/references/design_inventory.md` | Modified | Reframed around live Open Design systems |
| `.opencode/skills/sk-design-interface/SKILL.md` | Modified | Apache-2.0-only, Open Design grounding, version 1.1.0 |
| `.opencode/skills/sk-design-interface/feature_catalog/` | Modified | Design-grounding section reframed to Open Design live reads |
| `.opencode/skills/sk-design-interface/manual_testing_playbook/` | Modified | Licensing-integrity and grounding scenarios reframed |
| `.opencode/skills/sk-design-interface/changelog/v1.1.0.0.md` | Created | De-vendor and integration changelog |
| `.opencode/skills/sk-design-interface/graph-metadata.json` | Modified | Topics, edges, source docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The MIT-derived data and scripts are removed | The nine CSVs, the data README, and the `design_search` scripts no longer exist in the skill |
| REQ-002 | The MIT notices are removed in the safe order | The data was deleted before `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md` |
| REQ-003 | The Apache-2.0 base is kept | `LICENSE.txt` and the verbatim Apache-2.0 `design_principles.md` remain, with the skill licensed Apache-2.0 |

### P1 - Required (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Open Design is wired in through the shared parity loop | `claude_design_parity.md` reads Open Design systems live via `mcp-open-design` and grounds the loop on them |
| REQ-005 | Live reads are never cached | The parity loop and the inventory state Open Design content is read live and never copied into the repo |
| REQ-006 | Version bumped and changelog added | SKILL.md version is 1.1.0 and `changelog/v1.1.0.0.md` exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The skill at `.opencode/skills/sk-design-interface/` is Apache-2.0-only with no MIT-derived data, scripts, or notices remaining (delivered in commit `b12ffd3d76`).
- **SC-002**: `validate.sh` on this packet with `--strict` reports zero errors.
- **SC-003**: The Open Design integration grounds the parity loop on live `mcp-open-design` reads that are never cached.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the MIT notices before the data leaves derived data unattributed | High | The ordered sequence deleted the data first, then the notices |
| Risk | Deleting the Apache base by mistake | High | `LICENSE.txt` and `design_principles.md` were kept, so the skill stays Apache-2.0 |
| Risk | Caching Open Design content attaches a new license | Medium | The integration reads live via `mcp-open-design` and caches nothing into the repo |
| Dependency | The `mcp-open-design` skill (phase 002) | Green | The live-read integration depends on it, and it shipped first |
| Dependency | The shared `claude_design_parity.md` loop | Green | The seam between the judgment skill and the transport skill |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: The licensing cleanup ran data first then notices, so derived data was never left in the tree without its attribution and the Apache base was never removed.

### Consistency
- **NFR-C01**: House voice holds across all edits, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: The integration states plainly that Open Design content is read live and never cached, so no reader infers a copy-into-repo path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Grounding boundaries
- No Open Design system is registered for the work: the parity loop captures only what is present and never invents a brief or a style.
- A matched Open Design system tempts reuse as a preset: the loop keeps it reuse-ground or critique-against, never a generator or a style chooser.

### Licensing boundaries
- The kept `design_principles.md` is verbatim Apache content: `LICENSE.txt` must stay to carry its terms, so it was retained through the de-vendor.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Removed twelve-plus files and reframed SKILL.md, references, catalog, playbook |
| Risk | 11/25 | Licensing-ordered deletion is correctness-critical, but reversible via git |
| Research | 5/20 | The de-vendor sequence and integration came from phase 001, and the build applied it |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. A deep review (phase 004) later found and fixed stale MIT-attribution wording in the playbook index. The shipped license state (Apache-2.0 only) was correct throughout.
<!-- /ANCHOR:questions -->
