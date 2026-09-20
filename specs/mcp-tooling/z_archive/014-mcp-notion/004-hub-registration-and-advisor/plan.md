---
title: "Implementation Plan: Phase 004 — Register mcp-notion across the mcp-tooling hub, router, and skill-advisor"
description: "Edit the hub router (mode-registry + hub-router + ROUTER.md) and advisor hub identity (description + graph-metadata), update SKILL.md, regenerate the leaf-manifest, author the feature-catalog + examples, and rebuild the advisor — updating both awareness systems without introducing drift."
trigger_phrases:
  - "mcp-notion hub registration plan"
  - "mcp-notion router advisor plan"
  - "mcp-notion phase 4 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/004-hub-registration-and-advisor"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Registered mcp-notion across hub router + advisor; leaf-manifest regenerated, advisor rebuilt"
    next_safe_action: "Proceed to Phase 5 verification and closeout"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-004-hub-registration"
      parent_session_id: "014-mcp-notion"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 004 — Register mcp-notion across the mcp-tooling hub, router, and skill-advisor

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
| **Language/Stack** | JSON + Markdown hub config; Node canon checker (`ci-skill-root-metadata.cjs`) |
| **Framework** | `mcp-tooling` parent-hub routing + skill-advisor (two awareness systems) |
| **Storage** | Hub root config files + `leaf-manifest.json` + advisor index |
| **Testing** | `ci-skill-root-metadata.cjs --skill mcp-tooling` (PASS), `parent-skill-check.cjs` (`PARENT_HUB_CHECK_STRICT=1`, exit 0), `advisor_recommend` recall, `validate_document.py` (0 issues) |

### Overview
Register `mcp-notion` in the router (mode-registry + hub-router + ROUTER.md) and the advisor (description.json + graph-metadata), update SKILL.md, regenerate the leaf-manifest with the canon checker, author the feature-catalog + examples packages, and rebuild the advisor — then verify with the canon checker, `parent-skill-check` STRICT, and an advisor recall check, with zero registry↔router drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `mcp-notion` package (Phases 002–003) exists so leaves resolve
- [x] Canon checker `--fix` confirmed as the leaf-manifest regenerator
- [x] `mcp-click-up` entries read as the template for the mode object shape

### Definition of Done
- [x] Router edited (mode-registry.json + hub-router.json + ROUTER.md); advisor edited (description.json + graph-metadata.json); SKILL.md updated
- [x] `leaf-manifest.json` regenerated via the canon checker `--fix` (not hand-edited)
- [x] `feature-catalog/FEATURE-CATALOG.md` + `examples/README.md` authored; both `validate_document.py` = 0 issues
- [x] `skill_graph_scan` + `advisor_rebuild --force` run; advisor returns `mcp-tooling` for Notion prompts
- [x] Canon checker PASS; `parent-skill-check` STRICT exits 0 with 0 warnings
- [x] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-awareness registration — the advisor (hub identity) and the in-hub router are fed by disjoint files and must be updated together, then each re-indexed. The advisor routes the single hub identity `mcp-tooling`; the hub then resolves `mcp-notion` via the mode object's `routingClass: metadata`.

### Key Components
- **Router (B)**: `mode-registry.json` (mode object) + `hub-router.json` (tieBreak/routerSignals/vocabularyClasses) + `ROUTER.md` (NOTION intent + INTENT_SIGNALS + RESOURCE_MAP).
- **Advisor (A)**: `description.json` (Notion description + keywords) + `graph-metadata.json` (domains/intent_signals/derived/entity) → indexed by `skill_graph_scan` + `advisor_rebuild --force`.
- **Hub docs / manifest / packages**: `SKILL.md` (rows/counts/tree) + `leaf-manifest.json` (regenerated) + `feature-catalog/FEATURE-CATALOG.md` + `examples/README.md`.

### Data Flow
Notion query → advisor (description/graph keywords) → hub `mcp-tooling` → in-hub router (mode-registry + hub-router + ROUTER.md) → `mcp-notion` mode (resolved by routingClass metadata).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase edits SHARED hub routing surfaces (high blast radius). Every touched surface is inventoried below; all paths are under `.opencode/skills/mcp-tooling/` unless noted.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | In-hub router: enumerates modes + tool surfaces | Add `mcp-notion` object (`packetKind: workflow`, `backendKind: code-mode-remote-mcp`, `mutatesWorkspace: true`, MCP toolSurface, 14 aliases, `advisorRouting.routingClass: metadata`) | `rg -n 'mcp-notion' mode-registry.json`; canon checker PASS |
| `hub-router.json` | In-hub router: tie-breaks + router signals + vocabulary | Append `mcp-notion` to tieBreak; add `routerSignals["mcp-notion"]` (classes notion-aliases/notion-data); add vocabularyClasses `notion-aliases` + `notion-data` | `rg -n 'mcp-notion|notion-aliases|notion-data' hub-router.json`; `parent-skill-check` STRICT |
| `ROUTER.md` | In-hub routing prose + machine RESOURCE_MAP | Add mode-list entry + INTENT MODEL bullet + NOTION INTENT_SIGNALS + byte-exact NOTION RESOURCE_MAP (mcp-tools.md + api-gap-tools.md) | `parent-skill-check` STRICT; every RESOURCE_MAP path resolves on disk |
| `description.json` | Advisor hub identity: description + keywords | Append Notion description + 14 keywords | `rg -n 'notion' description.json`; advisor recall |
| `graph-metadata.json` | Advisor hub identity: domains + intent_signals + derived | Add Notion domains/intent_signals/derived (trigger_phrases/key_topics) + `mcp-notion` entity + key_file + source_doc; bump edges + causal_summary seven→eight modes | `rg -n 'notion|eight' graph-metadata.json`; advisor recall |
| `SKILL.md` | Hub doc: description + mode table + counts + tree | Update description + keywords + §1 mode row + packetKind list + mode counts + dir tree + workflow-packets list | `rg -n 'mcp-notion' SKILL.md`; `parent-skill-check` STRICT |
| `leaf-manifest.json` | Compiled leaf inventory (generator-owned) | Regenerate (NOT hand-edit) via `ci-skill-root-metadata.cjs --skill mcp-tooling --fix` | leaf-manifest matches fresh regeneration byte-for-byte |
| `mcp-notion/feature-catalog/FEATURE-CATALOG.md` | Current-state capability inventory | Author 24-tool inventory | `validate_document.py` = 0 issues |
| `mcp-notion/examples/README.md` | Code Mode workflow examples | Author Code Mode Notion examples | `validate_document.py` = 0 issues |
| Advisor index | Advisor recall for `mcp-tooling` | Rebuild via `skill_graph_scan` + `advisor_rebuild --force` | Advisor returns `mcp-tooling` for Notion prompts |

Required inventories:
- Same-class producers: `rg -n 'mcp-click-up' .opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,description.json,graph-metadata.json,SKILL.md,ROUTER.md,leaf-manifest.json}` — mirror every place the sibling mode appears.
- Consumers of changed symbols: `rg -n 'mcp-notion|notion-aliases|notion-data' .opencode/skills/mcp-tooling --glob '*.json' --glob '*.md'`.
- Matrix axes: (advisor vs router) × (config-edit vs regenerate/re-index) — both awareness systems must be edited AND re-indexed.
- Algorithm invariant: no registry↔router drift — routerSignals keys match the registry workflowMode set (8), all 24 vocabulary classes are defined, and the regenerated leaf-manifest matches byte-for-byte.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `mcp-click-up`'s entries across the hub files as the template
- [x] Confirm the canon checker `--fix` as the leaf-manifest regenerator
- [x] Confirm the trusted `skill_graph_scan` + `advisor_rebuild --force` path

### Phase 2: Core Implementation
- [x] Router edits: `mode-registry.json` object + `hub-router.json` tieBreak/routerSignals/vocabularyClasses + `ROUTER.md` NOTION intent + RESOURCE_MAP
- [x] Advisor edits: `description.json` description/keywords + `graph-metadata.json` domains/intent_signals/derived/entity + causal-summary seven→eight bump
- [x] Hub doc edits: `SKILL.md` description/keywords/§1 row/packetKind list/counts/tree/workflow-packets
- [x] Regenerate `leaf-manifest.json` via the canon checker `--fix`
- [x] Author `feature-catalog/FEATURE-CATALOG.md` (24-tool inventory) + `examples/README.md`

### Phase 3: Verification
- [x] `skill_graph_scan` + `advisor_rebuild --force`; confirm the advisor returns `mcp-tooling` for Notion prompts
- [x] `ci-skill-root-metadata.cjs --skill mcp-tooling` (PASS) + `parent-skill-check.cjs` (`PARENT_HUB_CHECK_STRICT=1`, exit 0, 0 warnings)
- [x] `validate_document.py` on both new packages = 0 issues
- [x] `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Hub config consistency, no drift | `ci-skill-root-metadata.cjs` (PASS), `parent-skill-check.cjs` (STRICT, exit 0) |
| Routing | Router picks `mcp-notion` via routingClass metadata | `parent-skill-check` STRICT (routerSignals/vocabulary/resource-path invariants) |
| Advisor | Recall returns `mcp-tooling` for Notion prompts | `skill_graph_scan`, `advisor_rebuild --force`, `advisor_recommend` |
| Doc | New packages + phase folder structure | `validate_document.py`, `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-notion` package (Phases 002–003) | Internal | Green | Leaves do not resolve; manifest regen fails |
| `ci-skill-root-metadata.cjs --fix` | Internal | Green | Leaf-manifest cannot be regenerated (never hand-edit) |
| `advisor_rebuild --force` (trusted caller) | Internal | Green | Advisor not re-indexed without the trusted path |
| `parent-skill-check.cjs` (STRICT) | Internal | Green | Drift invariants not enforced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: advisor recall regresses, canon checker fails, or `parent-skill-check` STRICT fails after edits.
- **Procedure**: `git checkout` the touched hub files (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `description.json`, `graph-metadata.json`, `SKILL.md`, `leaf-manifest.json`) and remove the new `mcp-notion/feature-catalog/` + `mcp-notion/examples/` directories; re-run `skill_graph_scan` + `advisor_rebuild --force` on the reverted state. All edits are config/doc changes — no data migration to undo.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
