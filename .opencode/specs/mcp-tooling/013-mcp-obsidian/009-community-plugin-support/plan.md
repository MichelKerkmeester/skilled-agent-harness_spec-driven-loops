---
title: "Implementation Plan: Phase 9 — Community plugin support (flat-financing / tables / BRAT)"
description: "Author 4 references + 4 assets documenting how the mcp-obsidian AI operates three community plugins at the vault file layer."
trigger_phrases:
  - "obsidian community plugins plan"
  - "beancount tables brat knowledge"
  - "mcp-obsidian phase 9 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/009-community-plugin-support"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 9 plan"
    next_safe_action: "Author the 4 reference docs from the fetched plugin facts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-community-plugin-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9 — Community plugin support (flat-financing / tables / BRAT)

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
| **Language/Stack** | Markdown knowledge docs + example data files (`.beancount`, `.table.md`, `.json`) |
| **Framework** | Consumed by the `mcp-obsidian` CLI/MCP file-layer surface |
| **Storage** | `009-community-plugin-support/references/` + `assets/` |
| **Testing** | `validate.sh` + each example parses / is well-formed |

### Overview
Turn the fetched, verified facts about three community plugins into a compact knowledge base: three per-plugin references, one connective operation-logic reference, and example/workflow assets — all framed around operating each plugin's data at the file layer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Plugin facts fetched + verified (repo id/author, data model, commands)
- [ ] File-layer operation model decided (edit underlying data, not UI)

### Definition of Done
- [ ] 4 references + 4 assets authored; claims grounded or `VERIFY`-marked
- [ ] Each example is well-formed and minimal
- [ ] `validate.sh` on this phase passes; Phase-5 handoff note present
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Knowledge base: per-plugin reference + one generalizing operation-logic reference + example assets.

### Key Components
- **Per-plugin references** — flat-financing (Beancount), obsidian-tables (`.table.md` JSON), obsidian42-BRAT (installer).
- **plugin-operation-logic.md** — the "operate the data the plugin reads, not the UI" principle, generalized so future plugins slot in.
- **assets/** — minimal working examples + `workflows.md`.

### Data Flow
Plugin README/official page (fetched) → verified facts → reference docs + example assets → (Phase 5) folded into `mcp-obsidian/references/` → the mode's router loads them on demand.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Additive knowledge only — this phase creates docs inside its own folder. It touches no shipped runtime, no hub file, and no other packet. The one downstream coupling is intentional: Phase 5 (skill-authoring) copies these `references/`/`assets/` into `.opencode/skills/mcp-tooling/mcp-obsidian/references/`, so keep filenames stable and self-contained.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm verified facts per plugin (repo id, data model, commands, settings)
- [ ] Fix the doc set (3 plugin refs + 1 logic ref + 4 assets) and filenames

### Phase 2: Core Implementation
- [ ] Author `references/flat-financing.md` (+ `assets/beancount-example.beancount`)
- [ ] Author `references/obsidian-tables.md` (+ `assets/table-example.table.md`)
- [ ] Author `references/obsidian42-brat.md` (+ `assets/brat-data-entry.example.json`)
- [ ] Author `references/plugin-operation-logic.md` + `assets/workflows.md`

### Phase 3: Verification
- [ ] Each example is well-formed; each claim grounded or `VERIFY`-marked
- [ ] `validate.sh` this phase; refresh `implementation-summary.md` + continuity + `../changelog/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc | Structure + grounded claims | `validate.sh`, manual review |
| Example | `.beancount` / `.table.md` / `.json` well-formed | `node -e JSON.parse`, visual |
| Workflow | Steps expressed as file operations, not UI | manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mcp-obsidian file-layer surface (Phases 3/4) | Internal | Yellow | Workflows reference CLI/MCP that lands in 3/4 |
| Plugin sources (3 repos) | External | Green | Facts fetched + verified this session |
| Phase 5 skill-authoring | Internal | Yellow | Final home for these references |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: plugin knowledge wrong or plugin abandoned.
- **Procedure**: docs are additive + phase-local — delete/revise the affected reference/asset; nothing shipped to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
