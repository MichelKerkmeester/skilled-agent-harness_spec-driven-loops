---
title: "Phase 004: mcp-notion hub registration + advisor"
description: "Register the mcp-notion mode in the mcp-tooling hub mode-registry.json (workflowMode, packetKind workflow, tool surface, aliases, advisorRouting), rebuild the skill advisor so the mode routes, and author the feature-catalog and examples."
trigger_phrases:
  - "mcp-notion hub registration"
  - "mcp-notion mode-registry advisor"
  - "notion mode routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/004-hub-registration-and-advisor"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Registered mcp-notion as hub 8th mode; advisor rebuilt, Notion routes at 0.95 confidence"
    next_safe_action: "Add mode-registry entry, rebuild advisor, author feature-catalog + examples"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 004 — Register mcp-notion across the mcp-tooling hub, router, and skill-advisor

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-knowledge-references |
| **Successor** | 005-verification-and-closeout |
| **Handoff Criteria** | Mode registered in the in-hub router (mode-registry.json + hub-router.json + ROUTER.md) and the skill-advisor hub identity (description.json + graph-metadata.json); SKILL.md updated; `leaf-manifest.json` regenerated (not hand-edited); `feature-catalog/FEATURE-CATALOG.md` + `examples/README.md` authored; advisor rebuilt and Notion prompts route to `mcp-tooling`; canon checker PASS and `parent-skill-check` STRICT exits 0 with 0 warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the `mcp-notion` mode build — the **highest-blast-radius** phase, because it edits SHARED hub routing surfaces that every `mcp-tooling` mode depends on. Phases 002–003 authored the mode's skill and knowledge references; this phase makes the mode discoverable and routable.

There are **TWO INDEPENDENT AWARENESS SYSTEMS** and both were updated:
- **(A) The skill-ADVISOR** routes a query to the single hub identity `mcp-tooling`. It is fed by the HUB's `description.json` keywords + `graph-metadata.json` intent_signals and activated by `advisor_rebuild`. It does **not** read `mode-registry.json`; the hub then resolves `mcp-notion` via `routingClass` metadata.
- **(B) The in-hub ROUTER** picks the mode inside the hub. It is fed by `mode-registry.json` + `hub-router.json` + `ROUTER.md`.

**Scope Boundary**: Registration + rebuild/re-index + the two current-state packages (feature-catalog, examples). It edits the hub-root config/docs files, regenerates `leaf-manifest.json`, and rebuilds the advisor index. It does NOT change any other `mcp-tooling` mode, does NOT re-author the mode's SKILL or reference docs (Phases 002–003), and does NOT run end-to-end verification and closeout (Phase 5).

**Dependencies**:
- The `mcp-notion` package authored in Phases 002–003 (SKILL.md, mcp-servers, references) must exist so the leaves resolve.
- `ci-skill-root-metadata.cjs` (canon checker + `--fix` leaf-manifest regeneration), `parent-skill-check.cjs` (`PARENT_HUB_CHECK_STRICT=1`), `skill_graph_scan` + `advisor_rebuild --force`, `validate_document.py`.

**Deliverables**:
- In-hub router edited (mode-registry.json + hub-router.json + ROUTER.md); advisor hub identity edited (description.json + graph-metadata.json); SKILL.md updated; `leaf-manifest.json` regenerated; `feature-catalog/FEATURE-CATALOG.md` + `examples/README.md` authored; advisor rebuilt.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-notion` package exists on disk but is invisible: the skill-advisor does not surface `mcp-tooling` for Notion prompts (its hub keywords/intent_signals lack Notion vocabulary), and the in-hub router has no `mcp-notion` mode entry, tie-break, or router signals — so even if the hub is chosen, the mode cannot be picked. The hub `leaf-manifest.json` is stale, and the mode ships without a current-state capability inventory or Code Mode workflow examples.

### Purpose
Register `mcp-notion` as the 8th mode of the `mcp-tooling` hub (5 workflow modes + 3 transports) across BOTH awareness systems and re-index them so a Notion query routes to `mcp-tooling → mcp-notion` exactly like `mcp-click-up`, with the canon checker PASS, `parent-skill-check` STRICT green, and no registry↔router drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **(B) Router**: add an `mcp-notion` mode object to `mode-registry.json` (`packetKind: workflow`, `backendKind: code-mode-remote-mcp`, `mutatesWorkspace: true`, MCP tool surface, 14 Notion aliases, `routingClass: metadata`); add the tie-break order, a `routerSignals` entry (classes `notion-aliases`/`notion-data`), and two `vocabularyClasses` keyword blocks to `hub-router.json`; add the mode to the ROUTER.md mode list, an INTENT MODEL bullet, a NOTION INTENT_SIGNALS entry, and a NOTION RESOURCE_MAP entry (pointing to `mcp-notion/references/mcp-tools.md` + `api-gap-tools.md`).
- **(A) Advisor**: append Notion description + 14 keywords to `description.json`; add Notion domains, top-level + derived intent_signals, derived trigger_phrases/key_topics, an `mcp-notion` entity + key_file + source_doc, and the edges/causal_summary "seven → eight modes" bump to `graph-metadata.json`.
- **Hub docs**: update `SKILL.md` (description, keywords, §1 mode-table row, packetKind list, mode counts, dir tree, workflow-packets list).
- **Regenerate** `leaf-manifest.json` via the canon checker `--fix` (never hand-edit).
- **Author** `mcp-notion/feature-catalog/FEATURE-CATALOG.md` (24-tool current-state inventory) and `mcp-notion/examples/README.md` (Code Mode Notion workflow examples).
- **Rebuild** the advisor (`skill_graph_scan` + `advisor_rebuild --force`).

### Out of Scope
- Any change to another `mcp-tooling` mode's registry/router entry - [would be drift beyond scope].
- Re-authoring the mode's SKILL or reference docs - [done in Phases 002–003].
- End-to-end verification, live token smoke, and closeout - [Phase 5].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add `mcp-notion` mode object (workflow / code-mode-remote-mcp / mutatesWorkspace / MCP toolSurface / 14 aliases / routingClass metadata) |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Append tieBreak; add `routerSignals["mcp-notion"]` (classes notion-aliases/notion-data); add two vocabularyClasses |
| `.opencode/skills/mcp-tooling/ROUTER.md` | Modify | Add mode-list entry, INTENT MODEL bullet, NOTION INTENT_SIGNALS, NOTION RESOURCE_MAP |
| `.opencode/skills/mcp-tooling/description.json` | Modify | Append Notion description + 14 keywords |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | Add Notion domains + intent_signals + derived fields + entity; bump causal_summary seven→eight modes |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | Description + keywords + §1 mode row + packetKind list + counts + dir tree + workflow-packets list |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | Canon checker `--fix` (generator only) |
| `.opencode/skills/mcp-tooling/mcp-notion/feature-catalog/FEATURE-CATALOG.md` | Create | 24-tool current-state capability inventory |
| `.opencode/skills/mcp-tooling/mcp-notion/examples/README.md` | Create | Code Mode Notion workflow examples |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the `mcp-notion` router registration (mode-registry object + hub-router tieBreak/routerSignals/vocabularyClasses + ROUTER.md intent + RESOURCE_MAP) with no registry↔router drift | `mode-registry.json`, `hub-router.json`, and `ROUTER.md` all reference `mcp-notion`; every ROUTER.md RESOURCE_MAP path resolves on disk |
| REQ-002 | Add the advisor registration (description.json Notion description + 14 keywords; graph-metadata domains/intent_signals/derived/entity + causal_summary seven→eight) and run `skill_graph_scan` + `advisor_rebuild --force` | The advisor returns `mcp-tooling` as the unambiguous #1 for a strong Notion prompt at ≥0.8 confidence |
| REQ-003 | Regenerate `leaf-manifest.json` with the canon checker and update SKILL.md counts/rows/tree | `leaf-manifest.json` regenerated (no hand edits); SKILL.md reflects the new mode; canon checker + `parent-skill-check` STRICT exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Author the `feature-catalog/FEATURE-CATALOG.md` current-state inventory | 24-tool inventory present; `validate_document.py` = 0 issues |
| REQ-005 | Author the `examples/README.md` Code Mode workflow examples | Examples present; `validate_document.py` = 0 issues |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ci-skill-root-metadata.cjs --skill mcp-tooling` = PASS and `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=1` exits 0 with 0 warnings.
- **SC-002**: The advisor returns `mcp-tooling` for Notion prompts after `advisor_rebuild --force` (strong prompt: score 0.792 / confidence 0.9458, unambiguous #1).
- **SC-003**: No registry↔router drift — `routerSignals` keys match the registry workflowMode set (8), all 24 vocabulary classes are defined, every router resource path resolves on disk, and `leaf-manifest.json` matches a fresh regeneration byte-for-byte.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `advisor_rebuild` requires a trusted caller | Advisor not re-indexed | Run `skill_graph_scan` + `advisor_rebuild --force`; confirm recall with an advisor recommend probe |
| Risk | Registry ↔ router drift | Mode chosen by one system, dropped by the other | Cross-check all config files + ROUTER.md after edits; `parent-skill-check` STRICT must exit 0 |
| Risk | `leaf-manifest.json` hand-edited instead of regenerated | Manifest diverges from the generator's contract | Use the canon checker `--fix` only; never hand-edit |
| Risk | ROUTER.md RESOURCE_MAP path typo | Machine block fails to resolve | Byte-exact entry; confirm every path exists on disk |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All questions were resolved during the build: the advisor routes the hub identity while the hub resolves `mcp-notion` via `routingClass` metadata, and the two current-state packages (feature-catalog, examples) both pass `validate_document.py`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
