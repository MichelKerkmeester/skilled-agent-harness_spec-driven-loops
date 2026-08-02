---
title: "Feature Specification: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor"
description: "Register the mcp-obsidian mode across the hub's two independent awareness systems — the skill-advisor (hub identity: description.json + graph-metadata.json) and the in-hub router (mode-registry.json + hub-router.json + smart-routing.md) — plus SKILL.md, a regenerated leaf-manifest, a re-minted compiled router, advisor_rebuild, and the repo README."
trigger_phrases:
  - "obsidian hub registration"
  - "mcp-obsidian advisor routing"
  - "mcp-obsidian phase 7"
  - "register obsidian mode"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/007-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 7 hub-registration spec (two awareness systems + full surface list)"
    next_safe_action: "Confirm the compiled-routing mint entrypoint, then edit mode-registry.json first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-hub-registration-and-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor

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
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-feature-catalog-and-playbook |
| **Successor** | 008-verification-and-closeout |
| **Handoff Criteria** | Mode registered in all five hub files + `smart-routing.md`; `leaf-manifest.json` regenerated (not hand-edited); compiled routing re-minted (or the legacy fallback documented); `advisor_rebuild` run and the advisor returns `mcp-tooling` for obsidian prompts; `parent-skill-check` exits 0; repo README updated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the `mcp-obsidian` mode build — the **highest-blast-radius** phase, because it edits SHARED hub routing surfaces that every `mcp-tooling` mode depends on. Phase 6 authored the mode's documentation packages; this phase makes the mode discoverable and routable.

There are **TWO INDEPENDENT AWARENESS SYSTEMS** and both must be updated:
- **(A) The skill-ADVISOR** routes a query to the single hub identity `mcp-tooling`. It is fed by the HUB's `description.json` keywords + `graph-metadata.json` intent_signals and activated by `advisor_rebuild`. It does **not** read `mode-registry.json`.
- **(B) The in-hub ROUTER** picks the mode inside the hub. It is fed by `mode-registry.json` + `hub-router.json` (+ `shared/references/smart-routing.md` for leaves), with a COMPILED router that must be re-minted after edits.

**Scope Boundary**: Registration + rebuild/re-index only. Edits the five hub files + `smart-routing.md` + the repo README, regenerates `leaf-manifest.json`, re-mints the compiled router, and rebuilds the advisor index. It does NOT change any other `mcp-tooling` mode, does NOT author package docs (Phase 5/6), and does NOT run end-to-end verification (Phase 8).

**Dependencies**:
- The `mcp-obsidian` package authored in Phases 002–006 (SKILL.md, mcp-servers, references, feature-catalog, playbook) must exist so the leaves resolve.
- `generate-leaf-manifest.cjs` (regenerator), `compiled-route-sync.cjs` (compiled-router mint + `--verify`), `advisor_rebuild`/`advisor_status`/`advisor_validate` (trusted caller), `parent-skill-check.cjs`, `route-validate.sh`.

**Deliverables**:
- Five hub files + `smart-routing.md` edited; `leaf-manifest.json` regenerated; compiled routing re-minted; advisor rebuilt; repo README updated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-obsidian` package exists on disk but is invisible: the skill-advisor does not surface `mcp-tooling` for obsidian prompts (its hub keywords/intent_signals lack obsidian vocabulary), and the in-hub router has no `mcp-obsidian` mode entry, tie-break, or router signals — so even if the hub is chosen, the mode cannot be picked. The compiled router and leaf-manifest are stale.

### Purpose
Register `mcp-obsidian` across BOTH awareness systems and re-index them so an obsidian query routes to `mcp-tooling → mcp-obsidian` exactly like `mcp-click-up`, with `parent-skill-check` green and no registry/router drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **(B) Router**: add an `mcp-obsidian` mode object to `mode-registry.json`; add tie-break + router signals + vocabulary classes to `hub-router.json`; add an OBSIDIAN intent + RESOURCE_MAP entry to `shared/references/smart-routing.md`.
- **(A) Advisor**: append obsidian keywords to `description.json` (+ version bump + count prose); add obsidian domains / intent_signals / derived fields + causal-summary count bump ("six"->"seven" MCP bridges) to `graph-metadata.json`.
- **Hub docs**: update `SKILL.md` (frontmatter counts, version, keywords comment, §1 mode-table row, §2 counts, §3 layout subtree, §5 references line).
- **Regenerate** `leaf-manifest.json` via `generate-leaf-manifest.cjs` (never hand-edit).
- **Re-mint** the compiled router via `compiled-route-sync.cjs` (+ `--verify`); document the `SPECKIT_COMPILED_ROUTING=0` legacy-prose fallback.
- **Rebuild** the advisor (`advisor_rebuild` trusted → `advisor_status`/`advisor_validate`).
- **Repo README**: add `mcp-obsidian` to the integration list + skill table.

### Out of Scope
- Any change to another `mcp-tooling` mode's registry/router entry - [would be drift beyond scope].
- Authoring the mode's package docs - [done in Phases 002–006].
- End-to-end verification, live smoke, and benchmark - [Phase 8].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add `mcp-obsidian` mode object (workflow / cli-plus-mcp / mutatesWorkspace / toolSurface / aliases / advisorRouting) |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Append tieBreak; add routerSignals["mcp-obsidian"]; add two vocabularyClasses |
| `.opencode/skills/mcp-tooling/description.json` | Modify | Append obsidian keywords; bump version; update mode/transport-count prose; refresh lastUpdated |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | Add obsidian domains + intent_signals + derived fields; bump causal_summary count; refresh source_docs + timestamps |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | Frontmatter counts + version + keywords; §1 mode row; §2 counts; §3 layout subtree; §5 references line |
| `.opencode/skills/mcp-tooling/shared/references/smart-routing.md` | Modify | Add OBSIDIAN intent + byte-exact RESOURCE_MAP entry (every path must resolve) |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Regenerate | `generate-leaf-manifest.cjs --write` (generator only) |
| `README.md` (repo root) | Modify | Integration list + skill table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the `mcp-obsidian` router registration (mode-registry object + hub-router tieBreak/routerSignals/vocabularyClasses + smart-routing OBSIDIAN intent) with no registry<->router drift | `mode-registry.json`, `hub-router.json`, and `smart-routing.md` all reference `mcp-obsidian`; every smart-routing RESOURCE_MAP path resolves on disk |
| REQ-002 | Add the advisor registration (description.json keywords + version bump; graph-metadata domains/intent_signals/derived + causal_summary "six"->"seven") and run `advisor_rebuild` (trusted) | `advisor_status`/`advisor_validate` pass; the advisor returns `mcp-tooling` for obsidian prompts |
| REQ-003 | Regenerate `leaf-manifest.json` with the generator and update SKILL.md counts/rows/layout | `generate-leaf-manifest.cjs` ran (no hand edits); SKILL.md §1/§2/§3/§5 reflect the new mode; `parent-skill-check` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Re-mint the compiled router (`compiled-route-sync.cjs` + `--verify`) with the legacy fallback documented | Compiled router verifies; the `SPECKIT_COMPILED_ROUTING=0` prose-routing fallback is documented in this phase's docs |
| REQ-005 | Update the repo root `README.md` integration list + skill table | `mcp-obsidian` appears in both the integration list and the skill table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs .opencode/skills/mcp-tooling` exits 0 and `route-validate.sh` passes.
- **SC-002**: The advisor returns `mcp-tooling` for obsidian prompts after `advisor_rebuild`.
- **SC-003**: No registry<->router drift — every mode reference is consistent across `mode-registry.json`, `hub-router.json`, `smart-routing.md`, and the regenerated `leaf-manifest.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled-routing mint (`compiled-route-sync.cjs`) | Fragile; part of the router-unification program | Confirm the mint entrypoint BEFORE running; run `--verify`; keep `SPECKIT_COMPILED_ROUTING=0` legacy fallback ready |
| Dependency | `advisor_rebuild` requires a trusted caller | Advisor not re-indexed | Run the rebuild with the trusted flag; verify via `advisor_status`/`advisor_validate` |
| Risk | Registry <-> router drift | Mode chosen by one system, dropped by the other | Cross-check all five files + smart-routing after edits; `parent-skill-check` must exit 0 |
| Risk | `leaf-manifest.json` hand-edited instead of regenerated | Manifest diverges from the generator's contract | Use `generate-leaf-manifest.cjs --write` only; never hand-edit |
| Risk | smart-routing RESOURCE_MAP path typo | Machine block fails to resolve | Byte-exact entry; confirm every path exists on disk |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the exact compiled-routing mint entrypoint and invocation for the current router-unification revision? (Confirm before the re-mint step.)
- What is the current `description.json` version and the `graph-metadata.json` MCP-bridge count word, so the bump is correct ("six"->"seven")?
- Which trusted-caller path is available for `advisor_rebuild` in this environment?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
