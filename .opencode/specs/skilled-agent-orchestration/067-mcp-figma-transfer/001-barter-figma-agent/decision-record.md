---
title: "Decision Record: Phase 1 — Barter Figma Agent"
description: "Architectural decisions D1-D10 from approved master plan, scoped to Phase 1 Barter authoring. ADRs cover persona translation, format mirror, MCP server bundling, and execution mode."
trigger_phrases:
  - "phase 1 decisions"
  - "barter figma adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/067-mcp-figma-transfer/001-barter-figma-agent"
    last_updated_at: "2026-05-05T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "Begin Step 8 (Analysis) and Step 10 (Implementation)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:phase1-dr-author-2026-05-05"
      session_id: "067-001-dr-2026-05-05"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "D1-D10 captured as ADRs"
---
# Decision Record: Phase 1 — Barter Figma Agent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Decisions D2 (spec history), D5 (MCP server bundling), D6 (advisor cleanup atomicity), D8 (re-grep), D9 (Public duplicate scrub), D10 (Public README badge) primarily affect Phase 2 or Phase 3 — captured here for completeness with cross-phase markers.

---

## ADR-001: Reframe persona from engineering tool → role-bound MCP agent

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester (user), Claude (orchestrator) |

### Context
The source `mcp-figma` skill is framed as a "design-to-code bridge for AI assistants in development workflows." The target audience for `Barter/MCP Agents/Figma/` is NOT developers — it is AI assistants doing Figma read-ops as part of project management or design-ops workflows. The ClickUp agent (the format reference) opens with strict role boundaries: "You are NOT a developer, NOT an engineer, NOT optimizing code, NOT using manual API calls outside the MCP/CLI pathways."

### Constraints
- Mirror ClickUp persona pattern exactly to preserve cross-agent vocabulary consistency
- Source content is technical (engineering examples, code mode invocations) — must be reframed
- Persona drift breaks the cross-agent UX (user expects all Barter agents to behave consistently)

### Decision
**We chose**: Translate every persona-bearing line to "Figma MCP Agent" with four explicit Boundary statements: NOT a designer, NOT a developer, NOT manual API, IS native MCP only. Add Authority Level supersession clause.

**How it works**: AGENTS.md §1 opens with Context Override / Who You Are / Boundaries / Authority Level / Enforcement / Sequential Thinking Protocol — copying ClickUp's structure with Figma-specific verb adaptations.

### Alternatives Considered
- **Soft persona** (no boundaries) — rejected: breaks ClickUp pattern; allows agent drift into engineering mode
- **Different role** ("Figma reader") — rejected: too narrow; doesn't cover comments/exports/team navigation

### Consequences
- All examples in source skill that show code-mode invocations need rewriting in agent voice
- Sequential Thinking Protocol added (matches ClickUp); not present in source skill

---

## ADR-002: Mirror ClickUp folder structure exactly (D9 base)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
Multiple AI Systems agents already exist in Barter (CapCut, ClickUp, Media Editor, Notion, Webflow). ClickUp is the most recent and most complete. To minimize cognitive overhead for Barter team and AI consumers, structural parity matters more than aesthetic novelty.

### Constraints
- File-naming convention: `[Domain] - [Category] - [Topic] - v0.100.md`
- Folder layout: `AGENTS.md + README.md + INSTALL_GUIDE.md + Favicon.jpg + context/ + knowledge base/{system,integrations,reference}/ + mcp servers/`
- Document Loading DAG explicit with file paths

### Decision
**We chose**: Byte-for-byte structural mirror of `Barter/MCP Agents/ClickUp/` with Figma-specific content swap.

**How it works**: cli-codex receives ClickUp file paths as references when authoring Figma equivalents. Pattern enforcement via opus verification hook B (Phase 1E).

### Alternatives Considered
- **Custom Figma layout** (e.g., separate folders for each command) — rejected: breaks pattern; harder to maintain
- **Lighter scaffold** (skip mcp servers/) — rejected: ClickUp ships full bundle; Public ClickUp also ships full bundle

### Consequences
- Bundle size includes node_modules per D5 (see ADR-005)
- Future agents must follow same pattern

---

## ADR-003: SYNC verb stays "Create" not "Capture" (D4)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
Figma agent is read-mostly (file reads, image exports, token extraction, component fetches). Comments + image exports are the only "writes." Considered renaming SYNC's last verb from "Create" → "Capture" to better fit read-mostly nature.

### Constraints
- Other Barter agents (Webflow, Notion, ClickUp, CapCut) use "Create"
- Cross-agent vocabulary consistency preferred over per-agent fit

### Decision
**We chose**: Keep "Create" — comments and image exports ARE creates; preserves cross-agent SYNC vocabulary.

**How it works**: All knowledge base SYNC mentions use "Survey → Yield → Navigate → Create."

### Alternatives Considered
- "Capture" — rejected: breaks vocabulary consistency

### Consequences
- Slight semantic stretch (image exports as "creates" rather than "captures")
- Cross-agent UX uniform

---

## ADR-004: Defer Favicon.jpg to TODO marker (D3)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
ClickUp ships a 68KB Favicon.jpg. For Figma, options are: source from Figma brand assets, generate placeholder, or defer.

### Constraints
- Don't block Phase 1 commit on image asset
- Don't commit a binary placeholder (memory: "no binary placeholder — text marker preferred")

### Decision
**We chose**: Defer — place a text-marker `Favicon.jpg` file with TODO content; user supplies real image later.

### Alternatives Considered
- Generate placeholder — rejected: not Claude's strength; could look unprofessional
- Reuse existing — rejected: no source available
- Skip entirely — rejected: breaks ClickUp parity

### Consequences
- Visual asset gap until user provides image
- All other deliverables can proceed

---

## ADR-005: Mirror ClickUp's actual bundling pattern for mcp servers/figma-mcp-stdio/ (D5)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted (revised 2026-05-05 post-Phase-1 implementation) |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |
| **Revision note** | Original framing said "full bundling = node_modules committed". Implementation discovered Barter root `.gitignore` excludes `node_modules/` globally. ClickUp's actual practice = `package.json` + `package-lock.json` committed; `node_modules` built locally via `npm install`. Phase 1 implementation already consistent with this. Revised here for accuracy. |

### Context
ClickUp ships `mcp servers/clickup-cli/node_modules/` and `mcp servers/clickup-mcp/node_modules/` (full bundle, ~10-30MB each). For Figma, options were: full bundle, package.json+install.sh only (npx pulls on demand), or docs-only.

### Constraints
- "Mirror ClickUp as much as possible" (user direction)
- npm install on user's machine adds friction
- Repo size budget allows ~50MB before review

### Decision
**We chose**: Full bundling — include `node_modules/` in the commit, mirror ClickUp pattern.

**How it works**: Phase 1C runs `npm install` in `mcp servers/figma-mcp-stdio/` to populate `node_modules/`; the entire folder commits.

### Alternatives Considered
- Lighter (package.json + install.sh) — initially recommended; rejected after user said "mirror ClickUp as much as possible"
- Documentation-only — rejected; breaks ClickUp parity

### Consequences
- Repo size grows by ~10-30MB
- User's clone time increases marginally
- ESCALATION TRIGGER: if `figma-developer-mcp` + deps exceeds 50MB, switch to lighter alternative and update this ADR (status → Superseded)

---

## ADR-006: cli-codex (gpt-5.5 high) primary executor + opus subagent verification (D7)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
~150K of new markdown content needed. Claude (this session) is the orchestrator; heavy authoring would consume context budget. cli-codex (gpt-5.5 high) is fast, cheap, parallelizable.

### Constraints
- Memory: "Codex CLI fast mode must be explicit" — `-c service_tier="fast"`
- Memory: "Copilot CLI max 3 concurrent dispatches" — applies to cli-codex too due to similar throttling
- Verification needed to catch persona drift

### Decision
**We chose**: cli-codex authors all heavy content; opus subagent verifies at every phase boundary.

**How it works**:
- Invocation: `codex exec -c model="gpt-5.5" -c model_reasoning_effort="high" -c service_tier="fast" "<task>"`
- Max 3 concurrent
- Per-task input pack: output path + ClickUp template references + persona constraints + format constraints
- Opus hook B after dispatch completes

### Alternatives Considered
- Claude does everything — rejected: context budget
- Hybrid with multiple parallel agents — rejected: complexity not warranted at Phase 1 scale

### Consequences
- Faster wall-clock (parallel dispatch)
- Verification step adds 10-15 min per phase boundary
- Risk of cli-codex drift mitigated by opus

---

## ADR-007: Stay on main, no feature branches (memory rule)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester (memory rule), Claude |

### Context
Memory rule: "Stay on main, no feature branches — `create.sh` auto-branches; immediately switch back to main and delete the packet branch (carry uncommitted changes; cherry-pick any orphan continuity commits first)."

### Constraints
- create.sh in Public skill repo auto-creates feature branch
- AI_Systems/Barter is a separate repo — no auto-branch there
- Phase 1 commit must land on Barter main directly

### Decision
**We chose**: Author + commit on Barter main directly. No feature branch for Phase 1.

**How it works**: `git -C "<barter-path>" add ...` and commit, no checkout.

### Consequences
- No PR review (acceptable per Barter solo-maintainer pattern)
- No rollback target other than `git revert`

---

## Cross-phase decisions (recorded for traceability)

### D1 (Phase 3): Code Mode keeps figma-developer-mcp tool refs (KEEP 127, STRIP 4)
Phase 3 decision; documented here for full ADR set. See `003-mcp-figma-skill-removal/decision-record.md` for full ADR.

### D2 (Phase 3): Spec history preserved
Phase 3 decision; cross-reference only.

### D8 (Phase 3): Re-grep at execution start
Phase 3 decision; ensures no drift from this brief.

### D9 (Phase 2): "Exact duplicate" = Mirror ClickUp's actual pattern
Phase 2 decision: drop `context/`, allow README divergence.

### D10 (Phase 2): Public README badge stays at 8
Phase 2 decision: pre-existing folder/TOC drift left out of scope; Figma becomes 8th TOC entry.

---

## Decision Index

| ID | Topic | Status | Owner Phase |
|---|---|---|---|
| ADR-001 | Persona reframe | Accepted | Phase 1 |
| ADR-002 | Mirror ClickUp structure | Accepted | Phase 1 (cross-cutting) |
| ADR-003 | SYNC verb = Create (D4) | Accepted | Phase 1 (cross-cutting) |
| ADR-004 | Favicon TODO defer (D3) | Accepted | Phase 1 (cross-cutting) |
| ADR-005 | Full bundling (D5) | Accepted (escalation rule) | Phase 1 |
| ADR-006 | cli-codex primary (D7) | Accepted | Cross-cutting |
| ADR-007 | Stay on main | Accepted | Cross-cutting |
| D1 | Code Mode keep+strip | Accepted | Phase 3 |
| D2 | Spec history preserved | Accepted | Phase 3 |
| D8 | Re-grep at exec start | Accepted | Phase 3 |
| D9 | Public duplicate scrub | Accepted | Phase 2 |
| D10 | Public README badge | Accepted | Phase 2 |
