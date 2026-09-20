---
title: "Implementation Plan: Phase 2 — Tool selection and scaffold: mirror-scaffold the mcp-obsidian package"
description: "Read the decided research.md, record locked build-vs-adopt decisions per surface, and scaffold the mcp-obsidian package skeleton mirroring the mcp-click-up inventory."
trigger_phrases:
  - "mcp-obsidian scaffold plan"
  - "obsidian package skeleton"
  - "mcp-obsidian phase 2 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/002-tool-selection-and-scaffold"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 2 scaffold plan"
    next_safe_action: "Confirm research.md decisions, then inventory mcp-click-up for the mirror"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-tool-selection-and-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 — Tool selection and scaffold: mirror-scaffold the mcp-obsidian package

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
| **Language/Stack** | Markdown docs + shell scaffold (no runtime logic) |
| **Framework** | `sk-create-skill` doctrine (`scripts/init_skill.py` + skill/README templates) or a manual `mcp-click-up` mirror |
| **Storage** | None — filesystem skeleton under `.opencode/skills/mcp-tooling/mcp-obsidian/` |
| **Testing** | Directory-inventory diff vs `mcp-click-up` + `validate.sh` on this phase |

### Overview
Read the decided `research.md`, record one locked build-vs-adopt decision per surface, then scaffold the empty `mcp-obsidian` mode package skeleton mirroring the `mcp-click-up` inventory — no `assets/`, no mode-root advisor JSON.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `research.md` decided for both surfaces (CLI, MCP); no open build-vs-adopt question
- [ ] `mcp-click-up` tree inventoried as the mirror reference
- [ ] Scaffolder path (sk-create-skill vs manual mirror) chosen

### Definition of Done
- [ ] CLI + MCP build-vs-adopt decisions recorded with named candidates, traceable to `research.md`
- [ ] `mcp-obsidian` skeleton exists matching the mcp-click-up inventory (no `assets/`, no mode-root JSON)
- [ ] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror-scaffold — copy the *shape* of a proven sibling mode (`mcp-click-up`), not its content.

### Key Components
- **Decision record**: build-vs-adopt per surface, each with a named candidate + rationale.
- **Skeleton generator**: `init_skill.py` (mode-adjusted) or a manual `mkdir` + placeholder mirror.
- **Layout guard**: strips mode-illegal artifacts (`assets/`, mode-root `description.json`/`graph-metadata.json`).

### Data Flow
`research.md` recommendation → locked decisions (this phase's docs) → skeleton tree → phases 3/4 fill surfaces.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase creates a new shipped surface — the `mcp-obsidian` mode package under `.opencode/skills/mcp-tooling/`. It is purely **additive** (a new sibling mode); it does NOT modify the hub router, `mcp-click-up`, or any existing mode. Advisor metadata is deliberately NOT added here (hub-root only), so hub routing stays unchanged until Phase 6.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/**` | New mode package (does not exist yet) | Create empty skeleton | `find` inventory diff vs `mcp-click-up` |
| `mcp-tooling` hub router / `mcp-click-up` sibling | Existing hub + sibling mode | Unchanged (no advisor metadata in a mode) | `rg -n 'mcp-obsidian'` shows no new mode-root JSON / router edit |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `../001-deep-research/research.md`; extract the decided per-surface recommendation
- [ ] Inventory the `mcp-click-up` tree as the mirror reference
- [ ] Choose the scaffolder path (sk-create-skill `init_skill.py` vs manual mirror) and justify

### Phase 2: Core Implementation
- [ ] Record the CLI build-vs-adopt decision (named candidate + rationale)
- [ ] Record the MCP build-vs-adopt decision (named candidate + rationale)
- [ ] Scaffold the `mcp-obsidian` skeleton mirroring the mcp-click-up inventory
- [ ] Strip mode-illegal artifacts (`assets/`, mode-root `description.json`/`graph-metadata.json`)

### Phase 3: Verification
- [ ] Diff the skeleton inventory against `mcp-click-up`; confirm parity (minus `assets/` + mode-root JSON)
- [ ] If a decision is architecturally heavy, add `decision-record.md` + bump to Level 2/3
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Skeleton dirs/files vs mcp-click-up | `find` / `diff` |
| Layout guard | No `assets/`, no mode-root JSON | `test ! -e` / `rg` |
| Doc | Phase docs structure + decisions | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 `research.md` | Internal | Green | No locked decision → cannot scaffold |
| `sk-create-skill` doctrine | Internal | Green | Fall back to a manual mcp-click-up mirror |
| `mcp-click-up` tree (mirror reference) | Internal | Green | No reference shape to copy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: research inconclusive, or the scaffolded layout is wrong.
- **Procedure**: the skeleton is additive and self-contained — `rm -rf .opencode/skills/mcp-tooling/mcp-obsidian/`; the hub is untouched (no advisor metadata added), so no registry revert is needed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
