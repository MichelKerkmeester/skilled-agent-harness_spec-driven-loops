---
title: "Implementation Plan: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode"
description: "Author the mcp-obsidian feature-catalog/ and manual-testing-playbook/ packages from the sk-create doctrines and the mcp-click-up template, documenting the CURRENT shipped CLI + MCP surface, then validate both."
trigger_phrases:
  - "obsidian catalog plan"
  - "obsidian playbook plan"
  - "mcp-obsidian phase 6 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/006-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 6 catalog + playbook plan"
    next_safe_action: "Read the two sk-create doctrines, then copy the mcp-click-up package as the template"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-feature-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (no code) |
| **Framework** | `sk-create-feature-catalog` + `sk-create-manual-testing-playbook` doctrine |
| **Storage** | Files under `mcp-obsidian/feature-catalog/` and `mcp-obsidian/manual-testing-playbook/` |
| **Testing** | `check_no_hyphenated_catalog_content.py` + `validate_document.py`; `validate.sh` on this phase |

### Overview
Copy the `mcp-click-up` catalog + playbook packages as the structural template, then author the `mcp-obsidian` equivalents from the shipped CLI + MCP surface (research + Phases 003/004): a feature catalog (root inventory + category cards) and a manual-testing playbook (root policy + scenario contracts with stable IDs), cross-referenced, and passing the catalog validators.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `sk-create-feature-catalog` + `sk-create-manual-testing-playbook` doctrines read
- [ ] Shipped feature surface known from research + Phases 003/004 (CLI + MCP)
- [ ] `mcp-click-up/{feature-catalog,manual-testing-playbook}/` reviewed as the template

### Definition of Done
- [ ] `feature-catalog/` authored (root inventory + category cards) and passes `check_no_hyphenated_catalog_content.py` + `validate_document.py`
- [ ] `manual-testing-playbook/` authored (root policy + scenarios with the 9-field contract, stable IDs, `stage:` frontmatter) and validates
- [ ] Catalog <-> playbook cross-references resolve
- [ ] `validate.sh` on this phase passes; continuity + changelog refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first documentation authoring — copy the proven `mcp-click-up` package shape, then repopulate from the Obsidian feature surface.

### Key Components
- **Feature catalog**: root `feature-catalog.md` inventory + kebab-case category subdirs + per-feature cards (impl-source table, test-anchor table, SOURCE METADATA, >=3 trigger_phrases).
- **Manual-testing playbook**: root `manual-testing-playbook.md` (EXECUTION POLICY + waves + scenario tables) + scenario subdirs with the 9-field SCENARIO CONTRACT, stable `{PREFIX}-{NNN}` IDs, and `stage:` frontmatter.

### Data Flow
Research + Phase 003/004 shipped surface → catalog cards (one per feature) → playbook scenarios (one per testable feature, keyed by the same feature ID) → cross-referenced package pair.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a runtime/policy fix — this phase is additive documentation authored ONLY inside the mode's own package (`mcp-obsidian/feature-catalog/**` and `mcp-obsidian/manual-testing-playbook/**`). It touches no shared policy, no hub routing, no `.utcp_config.json`, and no other packet. (The hub-facing surfaces — mode-registry, hub-router, description/graph metadata, SKILL.md, smart-routing, leaf-manifest, repo README — are all inventoried and edited in Phase 7.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `sk-create-feature-catalog` + `sk-create-manual-testing-playbook` doctrine
- [ ] Extract the shipped feature surface from research + Phases 003/004 (CLI commands + MCP tools)
- [ ] Copy `mcp-click-up/{feature-catalog,manual-testing-playbook}/` as the structural template; decide the category taxonomy

### Phase 2: Core Implementation
- [ ] Author `feature-catalog/feature-catalog.md` root inventory (CLI + MCP metrics tables + routing note)
- [ ] Author per-feature cards under `<cli-prefix>-*` and `mcp-{high,medium,low}-priority` categories (impl-source table, test-anchor table, SOURCE METADATA, >=3 trigger_phrases)
- [ ] Author `manual-testing-playbook/manual-testing-playbook.md` (EXECUTION POLICY, waves, scenario tables)
- [ ] Author per-scenario 9-field SCENARIO CONTRACT files with stable `OBS-###`/`MCP-H###`/`MCP-M###` IDs and `stage:` frontmatter
- [ ] Wire catalog <-> playbook cross-references

### Phase 3: Verification
- [ ] Run `check_no_hyphenated_catalog_content.py` + `validate_document.py` on the catalog; fix failures
- [ ] Validate the playbook; confirm every scenario has all 9 fields and a stable ID
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Category naming has no hyphenated body content | `check_no_hyphenated_catalog_content.py` |
| Document | Card/scenario structure, headers, frontmatter | `validate_document.py` |
| Doc | Phase folder structure + anchors | `validate.sh` |
| Manual | Cross-references resolve; IDs stable | Grep + manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-feature-catalog` / `sk-create-manual-testing-playbook` | Internal | Green | No canonical package shape to author against |
| Phase 003/004 shipped surface | Internal | Yellow | Catalog inaccurate until the CLI + MCP tools are locked |
| `mcp-click-up` package | Internal | Green | Structural template; loss forces authoring from doctrine only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: catalog/playbook inaccurate or the feature surface is not yet settled.
- **Procedure**: both packages are additive and self-contained — delete `mcp-obsidian/feature-catalog/` + `mcp-obsidian/manual-testing-playbook/`; no shared runtime or hub state is touched, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
