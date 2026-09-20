---
title: "Feature Specification: Phase 1 — Deep research: official Notion MCP coverage (adopt-vs-build)"
description: "10-iteration /deep:research (GLM-5.2-High via cli-devin, no early convergence) deciding whether the official @notionhq/notion-mcp-server can back an mcp-notion mode on its own, or whether a custom skill mode plus a Notion knowledge layer are required — mirroring how 013-mcp-obsidian was built."
trigger_phrases:
  - "014 deep research notion mcp"
  - "notion mcp coverage evaluation"
  - "mcp-notion adopt vs build"
  - "official notion mcp 24 tools parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/001-deep-research"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored deep-research scope; ready for /deep:research launch"
    next_safe_action: "Launch /deep:research (10 iters, no early convergence, GLM-5.2-High, cli-devin)"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-001-deep-research"
      parent_session_id: "014-mcp-notion"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Deep research: official Notion MCP coverage (adopt-vs-build)

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
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-skill-authoring |
| **Handoff Criteria** | `research/research.md` with a decided adopt-vs-build verdict, the official MCP's verified package identity and tool count, a documented capability/gap matrix, the auth + dual-backend model, and the Notion knowledge layer the mode must encode. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the `mcp-notion` mode build. It is the ONLY research-first phase and it **gates every build phase** — nothing is scaffolded, authored, or registered until this phase decides whether the official Notion MCP suffices on its own or a custom skill mode is needed.

**Scope Boundary**: Read-only investigation plus a synthesized `research.md`. This phase does NOT scaffold the mode, does NOT register anything in the hub, and does NOT install packages. (Contrast: phases 002–005 author the skill, its references, and its registration.)

**Dependencies**:
- `/deep:research` loop (system-deep-loop) with its externalized state machine (`deep-research-state.jsonl`, `deltas/`, `logs/`).
- Executor **cli-devin**, model **GLM-5.2 High** (`glm-5-2`). Per PLAN-WORKFLOW LOCK, **read `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` before any dispatch** — it owns the fanout flag/env requirements.
- `WebFetch` / `WebSearch` for the seed sources (official Notion API docs, the `@notionhq/notion-mcp-server` repo, the hosted `mcp.notion.com` docs).

**Deliverables**:
- `research/research.md` — synthesized findings, per-question answers, the capability/gap matrix, and the ranked adopt-vs-build verdict.
- Deep-research runtime state under `research/lineages/glm/` (config, state ledger, per-iteration files, findings registry).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-tooling` hub covers ClickUp, Chrome DevTools, Obsidian, and several design transports, but has no Notion support. Before building a Notion mode we do not know whether the official Notion MCP (`@notionhq/notion-mcp-server`) covers every needed operation on its own, or whether — like `013-mcp-obsidian` — the mode needs custom tooling and a domain knowledge layer. Guessing risks either over-building a full skill Notion does not warrant, or under-building a thin transport that cannot make the direct API calls Notion requires.

### Purpose
Produce a cited `research.md` that decides adopt-vs-build for the `mcp-notion` mode: whether a thin transport wrapping the official MCP suffices (the `mcp-figma` / `mcp-mobbin` pattern), a light workflow mode is the right size (the `mcp-click-up` pattern), or a full plugin-depth skill is needed (the `mcp-obsidian` pattern) — with the official MCP's package identity and tool count verified, its capability/gap matrix mapped, and the auth + runtime model captured, so Phase 2 can start authoring with no open build-vs-adopt question.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A single-model `/deep:research` run, **no early convergence**, on the config below.
- Coverage of the official Notion API docs, the `@notionhq/notion-mcp-server` package (local stdio) and the hosted remote server (`mcp.notion.com`), and the Notion data model (data sources, property types, relations, rollups, formulas).
- An adopt-vs-build verdict, the official MCP's verified tool inventory and domains, a capability/gap matrix, the auth + dual-backend model, and the knowledge layer the mode must encode.

#### Research Config (exact — no early convergence)

| Field | Value |
|-------|-------|
| Executor | cli-devin |
| Model | GLM-5.2 High (`glm-5-2`) |
| Iterations | 10 |
| Convergence | Off — run all 10 regardless of signal |
| Stop policy | `max-iterations` |

#### Seed sources (starting set — expanded during iterations)
- Official Notion API reference and changelog (data sources, property types, API versions `2025-09-03` and `2026-03-11`).
- The `@notionhq/notion-mcp-server` npm package + GitHub repo (local stdio server, `NOTION_TOKEN`).
- The hosted remote Notion MCP docs (`https://mcp.notion.com/mcp`, Streamable HTTP + OAuth).
- Notion data-model docs: data sources, the 22 property types, relations, rollups, Formulas 2.0.
- The `013-mcp-obsidian` mode as the parity reference; the `mcp-click-up` and `mcp-figma`/`mcp-mobbin` modes as pattern references.

### Out of Scope
- Scaffolding, authoring, or registering the mode — that starts in Phase 2.
- Installing the server or wiring `.utcp_config.json` / `.env` — Phase 2+.
- A live Notion API round-trip (needs an operator `NOTION_TOKEN`) — deferred to the closeout phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-tooling/014-mcp-notion/001-deep-research/research/research.md` | Create | Synthesized findings + adopt-vs-build verdict |
| `.../001-deep-research/research/lineages/glm/deep-research-state.jsonl` | Create | Deep-research externalized state ledger |
| `.../001-deep-research/research/lineages/glm/iterations/iteration-001..010.md` | Create | Per-iteration findings (10 iterations) |
| `.../001-deep-research/implementation-summary.md` | Create | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the exact 10-iteration config (GLM-5.2-High via cli-devin) with **no early convergence** | State ledger shows 10 completed iterations under `max-iterations`; no early stop recorded |
| REQ-002 | Answer every research question in `research.md`, each load-bearing claim cited to a source | `research.md` resolves all 6 sub-questions; claims carry sources (30+ collected) |
| REQ-003 | Decide adopt-vs-build with a named pattern and the official MCP's **verified** package/tool identity | Verdict names the pattern; `@notionhq/notion-mcp-server` identity + tool count verified — avoiding the clickup 404 trap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Map the official MCP's capability/gap matrix — which domains are covered and which operations have no MCP tool | Matrix in `research.md` separates covered CRUD from tooling gaps and structural gaps |
| REQ-005 | Capture the auth + runtime model (token type, local stdio vs remote OAuth, headless constraint, rate limits) | Dual-backend model documented; Code Mode backend decided |
| REQ-006 | Extract the Notion knowledge layer the mode must encode (data-source hierarchy, property types, relations, rollups, formulas) | Knowledge-layer pillars listed to seed the Phase 2/3 references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 iterations completed with convergence detection off; per-iteration evidence exists under `research/lineages/glm/iterations/`.
- **SC-002**: `research.md` contains a decided, ranked adopt-vs-build verdict ready to hand to Phase 2 with no open question.
- **SC-003**: The official MCP's package identity and tool count are verified (no later 404 / miscount surprise); the capability/gap matrix, auth model, and knowledge layer are captured.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin (GLM-5.2 High) | Wrong flags/env → failed fanout or wrong model | Read `cli-devin/SKILL.md` first; apply its fanout flag/env |
| Dependency | `/deep:research` state machine | Manual state drift | Use the loop's externalized state; no manual `/tmp` state; no direct `@deep-research` dispatch |
| Risk | Write-containment guard may fatal the lineage on out-of-scope writes | Auto-synthesis skipped | Salvage `research.md` by hand from the completed per-iteration files (this occurred — see limitations) |
| Risk | WebFetch blocklist / rate limits | Missing sources | Fall back to WebSearch + cached docs; widen queries |
| Risk | Notion local stdio server is being deprecated for the hosted remote MCP | Backend choice ages | Encode the dual-backend model; local stdio for headless Code Mode, remote OAuth for interactive |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The run resolved all 6 sub-questions; the operator-gated live API round-trip (needs a real `NOTION_TOKEN`) is tracked at the parent/closeout level, not here.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
