---
title: "Implementation Plan: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor"
description: "Edit the five hub files + smart-routing.md, regenerate the leaf-manifest, re-mint the compiled router, rebuild the advisor, and update the repo README — updating both the advisor (hub-identity) and router (in-hub) awareness systems without introducing drift."
trigger_phrases:
  - "obsidian hub registration plan"
  - "mcp-obsidian router advisor plan"
  - "mcp-obsidian phase 7 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/007-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 7 hub-registration plan (affected-surfaces inventory)"
    next_safe_action: "Confirm the compiled-routing mint entrypoint, then edit mode-registry.json"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7 — Register mcp-obsidian across the mcp-tooling hub, router, and skill-advisor

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
| **Language/Stack** | JSON + Markdown hub config; Node regenerators (`generate-leaf-manifest.cjs`, `compiled-route-sync.cjs`) |
| **Framework** | `mcp-tooling` parent-hub routing + skill-advisor (two awareness systems) |
| **Storage** | Hub root config files + compiled-routing artifacts + advisor index |
| **Testing** | `parent-skill-check.cjs` (exit 0), `route-validate.sh`, `advisor_status`/`advisor_validate`, `compiled-route-sync --verify` |

### Overview
Register `mcp-obsidian` in the router (mode-registry + hub-router + smart-routing) and the advisor (description.json + graph-metadata), update SKILL.md, regenerate the leaf-manifest, re-mint the compiled router, rebuild the advisor, and update the repo README — then verify with `parent-skill-check`, `route-validate`, and an advisor recall check, with zero registry<->router drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `mcp-obsidian` package (Phases 002–006) exists so leaves resolve
- [ ] Compiled-routing mint entrypoint confirmed for the current router-unification revision
- [ ] Current `description.json` version + `graph-metadata.json` MCP-bridge count word known (for the "six"->"seven" bump)

### Definition of Done
- [ ] Five hub files + `smart-routing.md` edited; `leaf-manifest.json` regenerated (not hand-edited)
- [ ] Compiled router re-minted + `--verify` (or legacy `SPECKIT_COMPILED_ROUTING=0` fallback documented)
- [ ] `advisor_rebuild` run (trusted); `advisor_status`/`advisor_validate` pass; advisor returns `mcp-tooling` for obsidian prompts
- [ ] `parent-skill-check.cjs` exits 0; `route-validate.sh` passes; repo README updated
- [ ] `validate.sh` on this phase passes; continuity + changelog refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-awareness registration — the advisor (hub identity) and the in-hub router are fed by disjoint files and must be updated together, then each re-indexed by its own regenerator.

### Key Components
- **Router (B)**: `mode-registry.json` (mode object) + `hub-router.json` (tieBreak/routerSignals/vocabularyClasses) + `shared/references/smart-routing.md` (OBSIDIAN intent + RESOURCE_MAP) → compiled by `compiled-route-sync.cjs`.
- **Advisor (A)**: `description.json` (keywords/version) + `graph-metadata.json` (domains/intent_signals/derived) → indexed by `advisor_rebuild`.
- **Hub docs / manifest**: `SKILL.md` (rows/counts/layout) + `leaf-manifest.json` (regenerated) + repo `README.md`.

### Data Flow
Obsidian query → advisor (description/graph keywords) → hub `mcp-tooling` → in-hub router (mode-registry + hub-router + compiled router) → `mcp-obsidian` mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase edits SHARED hub routing surfaces (high blast radius). Every touched surface is inventoried below; all paths are under `.opencode/skills/mcp-tooling/` unless noted.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | In-hub router: enumerates modes + tool surfaces | Update: add `mcp-obsidian` object (`packetKind: workflow`, `backendKind: cli-plus-mcp`, `toolSurface.allowed` = [Read, Write, Edit, Bash, Glob, Grep, mcp__code_mode__call_tool_chain], `mutatesWorkspace: true`, `packet`/`packetSkillName: mcp-obsidian`, `grandfatheredFolderMismatch: false`, `command: null`, `aliases`, `advisorRouting.routingClass: metadata`) | `rg -n 'mcp-obsidian' mode-registry.json`; `parent-skill-check` exit 0 |
| `hub-router.json` | In-hub router: tie-breaks + router signals + vocabulary | Update: append `mcp-obsidian` to `routerPolicy.tieBreak[]`; add `routerSignals["mcp-obsidian"]` {weight 4, classes:["obsidian-aliases","note-management"], resources:["mcp-obsidian/SKILL.md"]}; add vocabularyClasses `obsidian-aliases` + `note-management` | `rg -n 'mcp-obsidian|obsidian-aliases|note-management' hub-router.json`; `route-validate.sh` |
| `shared/references/smart-routing.md` | Leaf routing prose + machine RESOURCE_MAP | Update: add an OBSIDIAN intent + a byte-exact RESOURCE_MAP entry | `route-validate.sh`; every RESOURCE_MAP path resolves on disk |
| `description.json` | Advisor hub identity: keywords + version | Update: append obsidian keywords; bump version; update mode/transport-count prose; refresh lastUpdated | `rg -n 'obsidian' description.json`; `advisor_validate` |
| `graph-metadata.json` | Advisor hub identity: domains + intent_signals + derived | Update: add obsidian domains/intent_signals/derived (trigger_phrases/key_topics/key_files/entities); bump causal_summary "six"->"seven" MCP bridges; refresh source_docs + timestamps | `rg -n 'obsidian|seven' graph-metadata.json`; `advisor_validate` |
| `SKILL.md` | Hub doc: mode table + counts + layout + references | Update: frontmatter description counts + version + keywords comment; §1 mode-table row; §2 counts; §3 `mcp-obsidian/` layout subtree; §5 references line | `rg -n 'mcp-obsidian' SKILL.md`; `parent-skill-check` exit 0 |
| `leaf-manifest.json` | Compiled leaf inventory (generator-owned) | Regenerate (NOT hand-edit) via `generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling` | `rg -n 'mcp-obsidian' leaf-manifest.json`; generator ran clean |
| Compiled-routing artifacts | Compiled in-hub router | Re-mint via `.opencode/bin/compiled-route-sync.cjs` (+ `--verify`); fallback `SPECKIT_COMPILED_ROUTING=0` forces legacy prose routing | `compiled-route-sync --verify` passes |
| Advisor index | Advisor recall for `mcp-tooling` | Rebuild via `advisor_rebuild` (trusted) → `advisor_status`/`advisor_validate` | Advisor returns `mcp-tooling` for obsidian prompts |
| `README.md` (repo root) | Public integration list + skill table | Update: add `mcp-obsidian` to the integration list + skill table | `rg -n 'mcp-obsidian' README.md` |

Required inventories:
- Same-class producers: `rg -n 'mcp-click-up' .opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,description.json,graph-metadata.json,SKILL.md,leaf-manifest.json}` — mirror every place the sibling mode appears.
- Consumers of changed symbols: `rg -n 'mcp-obsidian|obsidian-aliases|note-management' .opencode/skills/mcp-tooling --glob '*.json' --glob '*.md'`.
- Matrix axes: (advisor vs router) × (config-edit vs regenerate/re-index) — both awareness systems must be edited AND re-indexed.
- Algorithm invariant: no registry<->router drift — every mode reference is consistent across all five config files, smart-routing, and the regenerated leaf-manifest.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the compiled-routing mint entrypoint for the current router-unification revision
- [ ] Read `mcp-click-up`'s entries in all five hub files as the template
- [ ] Record the current `description.json` version + `graph-metadata.json` MCP-bridge count word

### Phase 2: Core Implementation
- [ ] Router edits: `mode-registry.json` object + `hub-router.json` tieBreak/routerSignals/vocabularyClasses + `smart-routing.md` OBSIDIAN intent + RESOURCE_MAP
- [ ] Advisor edits: `description.json` keywords/version + `graph-metadata.json` domains/intent_signals/derived + causal-summary bump
- [ ] Hub doc edits: `SKILL.md` frontmatter/counts/§1 row/§3 layout/§5 references
- [ ] Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write`
- [ ] Update repo `README.md` integration list + skill table

### Phase 3: Verification
- [ ] Re-mint compiled router (`compiled-route-sync.cjs` + `--verify`); document `SPECKIT_COMPILED_ROUTING=0` fallback
- [ ] `advisor_rebuild` (trusted) → `advisor_status`/`advisor_validate`; confirm the advisor returns `mcp-tooling` for obsidian prompts
- [ ] `parent-skill-check.cjs .opencode/skills/mcp-tooling` (exit 0) + `route-validate.sh`
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Hub config consistency, no drift | `parent-skill-check.cjs` (exit 0) |
| Routing | Router picks `mcp-obsidian`; compiled router valid | `route-validate.sh`, `compiled-route-sync --verify` |
| Advisor | Recall returns `mcp-tooling` for obsidian prompts | `advisor_rebuild`, `advisor_status`, `advisor_validate` |
| Doc | Phase folder structure + anchors | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-obsidian` package (Phases 002–006) | Internal | Green | Leaves do not resolve; manifest regen fails |
| `compiled-route-sync.cjs` mint | Internal | Yellow | Fragile; fall back to `SPECKIT_COMPILED_ROUTING=0` prose routing |
| `advisor_rebuild` (trusted caller) | Internal | Yellow | Advisor not re-indexed without the trusted path |
| `generate-leaf-manifest.cjs` | Internal | Green | Manifest cannot be regenerated (never hand-edit) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: compiled-router re-mint fails, advisor recall regresses, or `parent-skill-check` fails after edits.
- **Procedure**: `git checkout` the touched hub files (`mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `SKILL.md`, `smart-routing.md`, `leaf-manifest.json`) + repo `README.md`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy prose routing; re-run `advisor_rebuild` on the reverted state. All edits are config/doc reverts — no data migration to undo.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
