---
title: "Implementation Plan: Phase 5 — Skill authoring for mcp-obsidian"
description: "Author the mcp-obsidian SKILL.md CLI↔MCP router plus README, INSTALL-GUIDE, changelog, and references index from sk-create-skill templates, mirroring mcp-click-up and keeping every reference resolvable."
trigger_phrases:
  - "obsidian skill plan"
  - "mcp-obsidian skill md plan"
  - "obsidian routing contract plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/005-skill-authoring"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 5 skill-authoring plan"
    next_safe_action: "Read sk-create-skill templates + Phase 3/4 references, then draft SKILL.md §2 router"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: skill-authoring

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
| **Language/Stack** | Markdown authoring (SKILL.md, README, INSTALL-GUIDE, changelog, references) — no code |
| **Framework** | `sk-create-skill` templates (`skill-md-template.md`, `skill-readme-template.md`); mirrors `mcp-click-up` |
| **Storage** | None (docs only) |
| **Testing** | `validate.sh` + RESOURCE_MAP path-resolution grep + no-dangling-reference grep |

### Overview
Author the mode's routing contract and human docs by copying the `sk-create-skill` template shapes and mirroring `mcp-click-up`: a SKILL.md whose §2 smart router maps INTENT_SIGNALS to a RESOURCE_MAP over the Phase 3 CLI and Phase 4 MCP references, plus README (9 sections), INSTALL-GUIDE (0–7 + AI-FIRST block, at mode root), a changelog, and a references index — with every reference resolving.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 3 `references/<cli>-commands.md` + Phase 4 `references/mcp-tools.md` exist (RESOURCE_MAP targets)
- [ ] `sk-create-skill` templates + `mcp-click-up` SKILL.md/README/INSTALL-GUIDE read as the structural mirror
- [ ] Obsidian domain-format conventions (frontmatter/wikilinks/tags) + INTENT_SIGNALS drafted

### Definition of Done
- [ ] SKILL.md authored: no `parent:` key; keywords comment; domain-format contract; §1–§8 incl. §2 INTENT_SIGNALS/RESOURCE_MAP + Resource Loading Levels
- [ ] README (9 sections) + INSTALL-GUIDE (0–7 + AI-FIRST block at mode root) + `changelog/v1.0.0.0.md` + `references/` index authored
- [ ] Every RESOURCE_MAP path and SKILL.md §8 reference resolves on disk; no dangling refs
- [ ] `validate.sh` passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Routing-contract + human-docs authoring; a smart router (INTENT_SIGNALS → RESOURCE_MAP → Resource Loading Levels) mirroring `mcp-click-up` §2, arbitrating the CLI (Bash) and MCP (`call_tool_chain`) surfaces.

### Key Components
- **SKILL.md §2 router**: INTENT_SIGNALS classify a request; RESOURCE_MAP loads exactly the reference for that intent (CLI vs MCP).
- **SKILL.md §3 HOW IT WORKS**: CLI-vs-MCP comparison table + inline `.utcp_config.json` block + both step paths.
- **README / INSTALL-GUIDE**: human onboarding; INSTALL-GUIDE holds the AI-FIRST copy-paste prompt at §0.
- **references/ index**: single map of the mode's reference docs, all links resolving.

### Data Flow
User/agent request → SKILL.md §1 activation → §2 INTENT_SIGNALS classify → RESOURCE_MAP loads the CLI or MCP reference → §3 executes via Bash (CLI) or `call_tool_chain` (MCP).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase authors mode-local documentation only. It creates files inside `mcp-obsidian/` and touches no shipped runtime, no shared config (`.utcp_config.json` / `.env.example` were handled in Phase 4), no shared policy, and no hub routing. Hub registration and advisor wiring are inventoried in Phase 7 (`007-hub-registration-and-advisor`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `sk-create-skill` templates (`skill-md-template.md`, `skill-readme-template.md`) + `mcp-click-up` SKILL.md/README/INSTALL-GUIDE as the structural mirror
- [ ] Confirm Phase 3 `references/<cli>-commands.md` + Phase 4 `references/mcp-tools.md` exist for RESOURCE_MAP targets
- [ ] Draft the Obsidian note/frontmatter domain-format contract + INTENT_SIGNALS/RESOURCE_MAP entries

### Phase 2: Core Implementation
- [ ] Author SKILL.md: frontmatter (no `parent:`), keywords comment, domain-format contract, §1–§8 (incl. §2 router + Resource Loading Levels, §3 CLI-vs-MCP table + inline `.utcp_config.json` block)
- [ ] Author README.md (9 sections)
- [ ] Author INSTALL-GUIDE.md at the mode root (§0 AI-FIRST block + sections 1–7)
- [ ] Author `changelog/v1.0.0.0.md` + the `references/` index

### Phase 3: Verification
- [ ] Grep every SKILL.md §8 reference + RESOURCE_MAP path resolves on disk (no dangling refs; no `references/INSTALL-GUIDE.md`)
- [ ] Confirm no `parent:` key in SKILL.md frontmatter; `allowed-tools` matches the required set
- [ ] `validate.sh` the package docs; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | SKILL.md §1–§8, README 9 sections, INSTALL-GUIDE 0–7 | `validate.sh`, `rg` on headings |
| References | RESOURCE_MAP paths + §8 links resolve; no dangling refs | `rg` + disk existence check |
| Frontmatter | No `parent:` key; `allowed-tools` correct | `rg -n 'parent:|allowed-tools' SKILL.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 CLI reference | Internal | Green | RESOURCE_MAP has no CLI target |
| Phase 4 MCP reference | Internal | Green | RESOURCE_MAP has no MCP target |
| `sk-create-skill` templates | Internal | Green | Structural drift from house style |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: routing contract incoherent, or references cannot be made to resolve.
- **Procedure**: the authored docs are additive and mode-local — delete `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, `changelog/v1.0.0.0.md`, and the `references/` index. No shared runtime or other mode is affected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
