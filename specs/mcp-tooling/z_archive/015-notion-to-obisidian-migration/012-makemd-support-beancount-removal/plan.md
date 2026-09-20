---
title: "Implementation Plan: Phase 012: makemd-support-beancount-removal"
description: "Plan for removing the beancount-finance plugin from the mcp-obsidian skill and adding Make.md (make-md) as a supported plugin mirroring notion-bases: author the make-md reference set from the finance A/B research, strip every beancount surface, wire PLUGIN_MAKEMD through SKILL.md, bump the version and changelog, then validate every changed doc."
trigger_phrases:
  - "015 makemd beancount plan"
  - "mcp-obsidian make-md support plan"
  - "PLUGIN_MAKEMD wiring plan"
  - "phase 012 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/012-makemd-support-beancount-removal"
    last_updated_at: "2026-08-23T19:40:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the make-md/beancount implementation plan"
    next_safe_action: "Generate description.json + graph-metadata.json, then validate --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-012-makemd-support-beancount-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 012: makemd-support-beancount-removal

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
| **Language/Stack** | Markdown skill docs under `.opencode/skills/mcp-tooling/mcp-obsidian/`; SKILL.md router surface; spec-folder metadata under `specs/` |
| **Framework** | The notion-bases plugin documentation as the structural template to mirror; the finance A/B research as the make-md source of truth |
| **Storage** | Edits to the mcp-obsidian skill only; the personal vault and sibling packets are read-only or untouched |
| **Testing** | `validate_document.py` per changed doc; grep sweeps for beancount and the SKILL.md router surface; `validate.sh --strict` on this folder |

### Overview
Retire Beancount from the skill and promote Make.md to first-class support by mirroring notion-bases: author the make-md reference tree and feature-catalog entry from the finance A/B research, remove every beancount surface (files + prose + the full SKILL.md `PLUGIN_FINANCE` router surface), wire `PLUGIN_MAKEMD` through the same points, bump SKILL.md to 0.22.0.0 with a changelog entry, then validate each changed doc and this phase package.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The notion-bases documentation read as the structural template to mirror
- [x] The finance A/B research (Make.md install/features/mobile + reverse-engineered `.space` format) read as the make-md source of truth
- [x] Scope lock understood - only the mcp-obsidian skill and this folder are writable; the vault is read-only

### Definition of Done
- [x] Beancount grep across the skill (excluding `changelog/`) is empty; SKILL.md has no `PLUGIN_FINANCE` surface
- [x] Make.md documented mirroring notion-bases (reference tree + feature-catalog entry + `PLUGIN_MAKEMD` + index rows), links resolve
- [x] SKILL.md at 0.22.0.0 with `changelog/v0.22.0.0.md`
- [x] The 5 make-md docs and SKILL.md pass `validate_document.py` (0 issues)
- [x] `validate.sh <this-folder> --strict` = Errors:0 for the authored docs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror-and-swap documentation refactor: notion-bases is the reference structure, Make.md is authored to match it point-for-point, and Beancount is removed at every surface it occupies. No plugin behavior is invented; the make-md docs are grounded in the finance A/B research and the reverse-engineered `.space` on-disk format.

### Key Components
- **Make.md reference tree** - `references/plugins/make-md/` with `make-md.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`, mirroring the notion-bases file set and frontmatter.
- **Router surface** - `PLUGIN_MAKEMD` added to the SKILL.md intent list, RESOURCE_MAP (nine make-md paths), PLUGINS aggregate, `specific_plugin_intents` tuple, headline list, keywords, and activation triggers; the mirror-image `PLUGIN_FINANCE` surface removed.
- **Shared index docs** - make-md rows added to `installed-plugins.md`, `FEATURE-CATALOG.md`, and the other index docs where notion-bases appears; beancount mentions removed.
- **Version + changelog** - SKILL.md 0.21.0.0 to 0.22.0.0 with `changelog/v0.22.0.0.md`.

### Data Flow
finance A/B research + notion-bases template (sources) → author make-md reference tree + feature-catalog entry → strip beancount files/prose/router surface → wire `PLUGIN_MAKEMD` through SKILL.md → add index rows + version bump + changelog → `validate_document.py` per doc + grep sweeps → author phase package → `generate-description.js` + graph-metadata backfill → `validate.sh --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches the mcp-obsidian skill only - `.opencode/skills/mcp-tooling/mcp-obsidian/` - plus this phase folder. notion-bases is read as the structural template and is not edited. The personal finance vault, sibling packets, and any concurrent-session lane are never written; the iCloud-synced vault is read-only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md router surface (`PLUGIN_FINANCE` / `PLUGIN_MAKEMD`) | Intent list, RESOURCE_MAP, PLUGINS aggregate, routing tuple, headline, keywords, triggers, §8 inventory | Remove every `PLUGIN_FINANCE` point; add the `PLUGIN_MAKEMD` mirror | grep for `PLUGIN_FINANCE` empty; `PLUGIN_MAKEMD` present at each notion-bases point; nine make-md RESOURCE_MAP paths |
| Beancount files (references, feature-catalog, examples, assets, manual-testing tie-in) | Shipped plugin docs | Delete | `grep -rIi beancount` (excl `changelog/`) empty; paths no longer exist |
| make-md reference tree + feature-catalog entry | New shipped plugin docs | Create mirroring notion-bases | 4 make-md reference files + feature-catalog entry exist; `validate_document.py` 0 issues |
| Shared index docs | List/route plugins | Remove beancount rows; add make-md rows | `installed-plugins.md` / `FEATURE-CATALOG.md` reference make-md not beancount; links resolve |

Required inventories:
- Beancount surface: `grep -rIi beancount .opencode/skills/mcp-tooling/mcp-obsidian --include='*.md' --include='*.sh' | grep -v changelog/`.
- Router surface: `grep -n 'PLUGIN_FINANCE\|PLUGIN_MAKEMD' SKILL.md` to confirm the swap is complete at every point.
- Algorithm invariant: every make-md capability traces to the finance A/B research or the reverse-engineered `.space` format; anything undocumented is stated as such, not asserted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the notion-bases reference tree and its SKILL.md wiring as the structural template
- [x] Read the finance A/B research (Make.md install/features/mobile + reverse-engineered `.space` format) as the make-md source of truth
- [x] Inventory every beancount surface and every notion-bases router point to mirror

### Phase 2: Core Implementation
- [x] Author the make-md reference tree and `feature-catalog/plugins/make-md.md` mirroring notion-bases
- [x] Delete the beancount reference tree, feature-catalog entry, example, assets, and manual-testing tie-in; strip beancount from the prose/index docs
- [x] SKILL.md router surgery: remove the `PLUGIN_FINANCE` surface, add `PLUGIN_MAKEMD` at every matching point, add make-md index rows, bump 0.21.0.0 to 0.22.0.0, add `changelog/v0.22.0.0.md`

### Phase 3: Verification
- [x] `validate_document.py` on the 5 make-md docs and SKILL.md - 0 issues each
- [x] Grep sweeps: beancount empty (excl `changelog/`); `PLUGIN_MAKEMD` present, `PLUGIN_FINANCE` absent; make-md links resolve
- [x] Author this phase package; run `generate-description.js` + graph-metadata backfill; `validate.sh <this-folder> --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | The 5 make-md docs + SKILL.md | `validate_document.py` |
| Removal sweep | Beancount fully gone outside `changelog/` | `grep -rIi beancount --include='*.md' --include='*.sh'` |
| Router integrity | `PLUGIN_MAKEMD` in, `PLUGIN_FINANCE` out, links resolve | `grep -n` on SKILL.md + link resolution |
| Packet | This phase folder | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| notion-bases documentation (structural template) | Internal | Green | No mirror to author make-md against |
| Finance A/B research (make-md source of truth) | Internal | Green | No grounded make-md capabilities to author |
| `validate_document.py` / `validate.sh` | Internal | Green | No completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a make-md capability is found ungrounded on review, or a dangling `PLUGIN_FINANCE` reference is discovered.
- **Procedure**: `git checkout -- <changed doc>` for the affected file (or restore the deleted beancount files from git) and re-run `validate_document.py` plus the grep sweeps.
- **Data reversal**: none - documentation-only, no migrations, no vault writes.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
