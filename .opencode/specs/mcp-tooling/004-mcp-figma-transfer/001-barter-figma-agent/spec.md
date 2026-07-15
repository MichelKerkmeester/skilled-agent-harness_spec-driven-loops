---
title: "Feature Specification: Phase 1 — Author Barter Figma MCP Agent"
description: "Author the Figma MCP Agent at AI_Systems/Barter/MCP Agents/Figma/ mirroring ClickUp's structure: AGENTS.md, README.md, INSTALL_GUIDE.md, knowledge base/{system,integrations,reference}/, mcp servers/{figma-mcp-http,figma-mcp-stdio}/. Source content from the public mcp-figma skill, reframed as a role-bound MCP agent persona (NOT a designer, NOT a developer, native MCP only)."
trigger_phrases:
  - "barter-figma-agent"
  - "phase 1 figma"
  - "AI_Systems Barter Figma"
  - "Figma MCP Agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-figma-transfer/001-barter-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files:
      - "AI_Systems/Barter/MCP Agents/Figma/AGENTS.md"
      - "AI_Systems/Barter/MCP Agents/Figma/README.md"
      - "AI_Systems/Barter/MCP Agents/Figma/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:245394246c03c6d0807583136a8ec08eaa0f9e4339dd1cdae30e4e70798b1aec"
      session_id: "067-001-spec-2026-05-05"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "D1-D10 resolved at parent level"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Author Barter Figma MCP Agent

## EXECUTIVE SUMMARY

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

<!-- ANCHOR:metadata -->
## 1. METADATA

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

## 8. EDGE CASES

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

## 9. COMPLEXITY ASSESSMENT

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

## 10. RISK MATRIX

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

## 11. USER STORIES

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

Template compliance scaffold for 001-barter-figma-agent/spec.md; original authored content is retained below.

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-public-figma-agent |
| **Handoff Criteria** | All Barter Figma files exist; AGENTS.md DAG paths resolve; opus verification hook B passes; Commit 1 lands in AI_Systems/Barter |
---

### Phase Context

This is **Phase 1** of the mcp-figma transfer. Output: a complete role-bound Figma MCP Agent at `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/MCP Agents/Figma/` matching the ClickUp agent's folder structure exactly (AGENTS.md + README.md + INSTALL_GUIDE.md + Favicon.jpg + context/ + knowledge base/{system,integrations,reference}/ + mcp servers/{figma-mcp-http,figma-mcp-stdio}/).

**Scope Boundary**: Authoring + committing in the **AI_Systems/Barter** repo only. Public AI Systems duplicate (Phase 2) and Public skill repo deletion (Phase 3) are out of scope here.

**Dependencies**:
- Read access to `Code_Environment/Public/.opencode/skills/mcp-figma/` (source content)
- Read access to `AI_Systems/Barter/MCP Agents/ClickUp/` (format ground truth)
- Approved decision register D1–D10 in `decision-record.md`

**Deliverables**:
- 16+ files committed in AI_Systems/Barter as `Figma MCP`

**Changelog**: When this phase closes, refresh `../changelog/` with the parent packet number plus this phase folder name.
---

### 2. PROBLEM & PURPOSE

### Problem Statement
The Figma MCP capability lives as a developer-grade skill (`mcp-figma`) inside the Public skill repo. Its proper home is the AI Systems persona library (alongside ClickUp / Notion / Webflow / CapCut), where it can be a role-bound MCP agent for Figma read-ops rather than an engineering tool buried in dev tooling. Source format (SKILL.md + smart-router pseudocode + nodes/) does not match target format (AGENTS.md + Context Override + Command Registry + SYNC + knowledge base/), so this is a **reframe**, not a relocation.

### Purpose
Stand up a Figma MCP Agent in `AI_Systems/Barter/MCP Agents/Figma/` that mirrors the ClickUp agent's structure exactly, translates the engineering-tool persona to a role-bound persona ("NOT a designer, NOT a developer, IS native MCP only"), and consolidates 18 Figma MCP tools under a Command Registry ($file/$node/$export/$component/$style/$team/$comment/$auth/$interactive).
---

### 3. SCOPE

### In Scope
- Author AGENTS.md (Context Override + Reading Instructions + Processing Hierarchy + Command Registry + Document Loading DAG)
- Author README.md (User Guide v0.100, internal Barter audience)
- Author INSTALL_GUIDE.md (AI-First Install Prompt + Option A HTTP/OAuth + Option B Framelink stdio + verification + troubleshooting)
- Author 5 knowledge base docs (System Prompt, SYNC Framework, Interactive Intelligence, MCP Knowledge, Combined Workflows)
- Scaffold mcp servers/figma-mcp-http/ (config snippets + verify.sh)
- Scaffold mcp servers/figma-mcp-stdio/ (package.json + install.sh + config snippets + node_modules per D5 mirror-ClickUp full-bundling)
- Place Favicon.jpg TODO marker (per D3 defer)
- Place context/.gitkeep (placeholder for user-specific Figma assets)
- Commit "Figma MCP" in AI_Systems/Barter

### Out of Scope
- Public AI Systems duplicate — Phase 2
- Public README §8 patch — Phase 2
- Code_Environment/Public skill deletion + cross-ref patches + advisor regen — Phase 3
- Favicon.jpg image content — deferred (TODO marker only) per D3
- mcp-code-mode strip work (4 hits) — Phase 3 owns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AI_Systems/Barter/MCP Agents/Figma/AGENTS.md` | Create | Role-bound entry point |
| `AI_Systems/Barter/MCP Agents/Figma/README.md` | Create | User Guide v0.100 (internal audience) |
| `AI_Systems/Barter/MCP Agents/Figma/INSTALL_GUIDE.md` | Create | AI-First + Option A/B install |
| `AI_Systems/Barter/MCP Agents/Figma/Favicon.jpg` | Create | TODO marker (text placeholder) |
| `AI_Systems/Barter/MCP Agents/Figma/context/.gitkeep` | Create | Placeholder folder |
| `AI_Systems/Barter/MCP Agents/Figma/knowledge base/system/Figma - System - Prompt - v0.100.md` | Create | Routing + verification + SYNC integration |
| `AI_Systems/Barter/MCP Agents/Figma/knowledge base/system/Figma - Thinking - SYNC Framework - v0.100.md` | Create | 4-phase methodology (S/Y/N/Create) |
| `AI_Systems/Barter/MCP Agents/Figma/knowledge base/system/Figma - System - Interactive Intelligence - v0.100.md` | Create | Clarification flow |
| `AI_Systems/Barter/MCP Agents/Figma/knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md` | Create | All 18 MCP tools + Option A HTTP + Option B stdio |
| `AI_Systems/Barter/MCP Agents/Figma/knowledge base/reference/Figma - Reference - Combined Workflows - v0.100.md` | Create | Multi-tool patterns |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-http/config-snippets.md` | Create | opencode.json / .mcp.json / claude-desktop config |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-http/verify.sh` | Create | OAuth round-trip test |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio/package.json` | Create | figma-developer-mcp dep |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio/install.sh` | Create | npm install + node_modules bundle |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio/config-snippets.md` | Create | .utcp_config.json + direct-MCP-client config |
| `AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio/node_modules/` | Create | Bundled deps per D5 |
---

### 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md with strict role boundaries | All four boundary statements (NOT designer, NOT developer, NOT manual API, IS native MCP) + Authority Level supersession clause + 9-step Processing Hierarchy |
| REQ-002 | Command Registry replaces smart-router pseudocode | `$file/$node/$export/$component/$style/$team/$comment/$auth/$interactive` + 4-level Detection Priority + Document Loading DAG |
| REQ-003 | All 5 knowledge base docs present in correct subfolders | system/ has 3 (Prompt, SYNC Framework, Interactive Intelligence); integrations/ has 1 (MCP Knowledge); reference/ has 1 (Combined Workflows) |
| REQ-004 | mcp servers/ parity with ClickUp | Both http and stdio subfolders exist; stdio has full node_modules bundle per D5 |
| REQ-005 | Folder name matches ClickUp pattern | `Barter/MCP Agents/Figma/` (capital F, sibling to CapCut/ClickUp/Media Editor/Notion/Webflow) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | INSTALL_GUIDE.md AI-First prompt walks through to working install (Option A and B) | Both copy-paste prompts complete and self-contained |
| REQ-011 | SYNC framework uses "Create" verb (per D4) | All knowledge base mentions of SYNC say "Survey → Yield → Navigate → Create" |
| REQ-012 | File-naming convention `[Domain] - [Category] - [Topic] - v0.100.md` | All 5 knowledge base docs follow this pattern |
| REQ-013 | README.md follows ClickUp internal audience tone | Internal team framing, version history, capability table |
| REQ-014 | Favicon.jpg present as TODO marker (per D3) | File exists but flagged with text marker; image deferred |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | context/ folder seeded with relevant placeholder | `.gitkeep` plus README explaining intended user-specific Figma asset population |
---

### 5. SUCCESS CRITERIA

- **SC-001**: All 16+ files exist in `AI_Systems/Barter/MCP Agents/Figma/` with byte counts within ±20% of ClickUp's equivalent files (structural parity verified by `diff -rq`)
- **SC-002**: AGENTS.md DAG paths all resolve (no broken `[[link]]` or relative path)
- **SC-003**: Persona reframe explicit — opus subagent confirms zero "developer" / "designer" persona drift
- **SC-004**: `Figma MCP` commit lands on AI_Systems/Barter main branch
- **SC-005**: Opus verification hook B passes (knowledge base count, mcp servers parity, Favicon TODO marker, SYNC verb)
---

### 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ClickUp folder structure as ground truth | If ClickUp differs from documented expectation, drift propagates | Read ClickUp files directly during authoring, not from cached snapshots |
| Risk | cli-codex over-engineers persona language | Could reintroduce "developer" framing | Explicit persona constraints in cli-codex prompt; opus verification hook B catches drift |
| Risk | mcp servers/ node_modules bundle inflates repo | >100MB commit could degrade clone times | Audit size before commit; if >50MB, escalate to lighter D5 alternative |
| Risk | SYNC verb confusion (Create vs Capture) | Cross-agent vocabulary breaks if some docs say "Capture" | Single-pass grep at end of authoring confirms only "Create" appears |
| Dependency | AI_Systems/Barter is a SEPARATE git repo | Commit must run from inside that repo's working tree | Use `git -C "<barter-path>"` or cd into Barter for git ops |
---

### 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| **Performance** | AGENTS.md load time <100ms (size <15K) |
| **Maintainability** | File-naming convention enforces discoverability; DAG explicit |
| **Compatibility** | Works in Claude Desktop / OpenCode / VS Code Copilot / Cursor without modification |
| **Documentation Quality** | sk-doc DQI score ≥85 on each knowledge base doc |
---

### 8. EDGE CASES

| Scenario | Expected Behavior |
|----------|-------------------|
| User runs agent without API key | Agent BLOCKS at Step 3 (Tool Verification); shows API-key setup link |
| User provides invalid Figma file key | `figma_check_api_key` returns error; agent escalates with regeneration link |
| OAuth flow times out (Option A) | Agent retries once, then escalates with manual-OAuth instructions |
| node_modules out of sync with package.json | install.sh detects and re-runs `npm install` |
| User asks agent to *edit* a Figma design | Agent refuses per Boundary "NOT a designer"; offers read alternatives |
---

### 9. COMPLEXITY ASSESSMENT

| Dimension | Score (0-3) | Note |
|-----------|-------------|------|
| Domain Count | 2 | Figma read-ops + persona translation |
| File Count | 3 | 16+ files |
| LOC Estimate | 3 | ~150K total content |
| Parallel Opportunity | 2 | Knowledge base docs can author in parallel via cli-codex |
| Task Type | 2 | Moderate — ClickUp template available |
| **Total** | **12/15** | High but well-scoped |
---

### 10. EFFORT ESTIMATION

| Activity | Estimate |
|----------|----------|
| Spec docs authoring | ~30 min (Claude direct) |
| Implementation (cli-codex parallel dispatch) | ~3-5 hours wall-clock |
| Opus verification hook B | ~10 min |
| npm install + node_modules bundle | ~2 min |
| Commit + push | ~5 min |
| **Total** | **~4-6 hours** |
---

### 11. OPEN QUESTIONS

(All decisions D1–D10 resolved at parent level. No blocking questions.)
---

### RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Plan**: `./plan.md`
- **Tasks**: `./tasks.md`
- **Checklist**: `./checklist.md`
- **Decision Record**: `./decision-record.md`
- **Approved master plan**: `/Users/michelkerkmeester/.claude/plans/think-really-hard-tender-karp.md`
