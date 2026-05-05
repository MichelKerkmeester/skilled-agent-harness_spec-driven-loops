---
title: "Decision Record: Phase 2 — Dual-publish Figma to AI_Systems/Public"
description: "Phase 2-specific ADRs: D9 (Public duplicate scrub pattern) and D10 (Public README badge math). Cross-references to ADRs in 001-barter-figma-agent/decision-record.md for the cross-cutting decisions."
trigger_phrases:
  - "phase 2 decisions"
  - "public figma adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/067-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T10:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored decision-record.md"
    next_safe_action: "Begin Phase 2 implementation (cp + sanitize)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:phase2-dr-2026-05-05"
      session_id: "067-002-dr-2026-05-05"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "D9 captured as ADR-009"
      - "D10 captured as ADR-010"
---
# Decision Record: Phase 2 — Dual-publish Figma to AI_Systems/Public

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Phase 2 owns D9 + D10 specifically. Cross-cutting ADRs (D1-D7 from Phase 1) are in `../001-barter-figma-agent/decision-record.md`.

---

## ADR-009: Public AI Systems duplicate scrub pattern (D9)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
Phase 1 produced a complete Barter Figma agent. Phase 2 needs to duplicate it to the open-source `AI_Systems/Public` repo. Three interpretations of "exact duplicate":
- (a) Byte-for-byte minus `context/`
- (b) Mirror ClickUp's actual Barter↔Public pattern (drop `context/`, allow README divergence)
- (c) Run a second cli-codex pass that takes Barter README and rewrites it for open-source audience

### Constraints
- "Mirror ClickUp as much as possible" (user direction)
- ClickUp's actual diff: `context/` dropped + README diverged ~+10% length
- Open-source audience needs different framing (no internal team references, MIT-licensed positioning)

### Decision
**We chose**: (b) MIRROR ClickUp's actual pattern. Drop `Public/Figma/context/`, allow README divergence; AGENTS / INSTALL_GUIDE / knowledge base / mcp servers stay byte-equivalent to Barter via `cp -r`.

**How it works**:
1. `cp -r Barter/MCP\ Agents/Figma/ Public/Figma/`
2. `rm -rf Public/Figma/context/`
3. `rm -rf Public/Figma/mcp servers/figma-mcp-stdio/node_modules/` (rebuild fresh; gitignored anyway)
4. cli-codex single dispatch to re-author `Public/Figma/README.md` for open-source audience using `Public/ClickUp/README.md` as tone reference
5. `npm install` in Public's stdio MCP server folder

### Alternatives Considered
- (a) Byte-for-byte minus `context/` — rejected: leaves internal Barter framing in Public README, breaks open-source positioning
- (c) Second cli-codex rewrite pass — accepted as part of (b); the README rewrite IS this pass

### Consequences
- Two commits in Public (Commit 2 folder + Commit 3 README)
- Subtle README drift maintenance burden (over time, Barter and Public READMEs may diverge further)
- Mitigation: implementation-summary.md documents the exact divergence rules so future updates can apply consistently

---

## ADR-010: Public AI Systems README badge math (D10)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | Michel Kerkmeester, Claude |

### Context
`AI_Systems/Public/README.md` shows a `Systems-8_Total` badge at the top, but the TOC under "💬 MCP's Made Easy" lists 7 systems (Prompt Engineering, Product Owner, Media Editor, Webflow, Notion, CapCut, ClickUp). Actual `Public/*/AGENTS.md`-bearing folder count = 9 (above 7 + Perplexity + Human Voice Rules — both unlisted in TOC).

Three options for adding Figma:
- (a) Trust badge `Systems-8_Total` → bump to 9 with Figma
- (b) Trust TOC count (7) → bump to 8 with Figma
- (c) Investigate the discrepancy first; reconcile during this packet

### Constraints
- This packet's scope is mcp-figma transfer, NOT general Public README cleanup
- Pre-existing drift suggests the user has chosen NOT to list Perplexity / Human Voice Rules in TOC for some reason

### Decision
**We chose**: (c) INVESTIGATE FIRST, then add Figma as §8 (8th TOC entry), badge stays at 8 (matches new TOC count).

**How it works**:
1. Phase 2D-T140: count `Public/*/` actual agent folders — confirmed 9
2. Read current TOC — confirmed 7 entries
3. Read current badge — confirmed `Systems-8_Total`
4. Conclusion: badge was forward-looking (next agent would make TOC 8); Figma fills that slot perfectly
5. Add §8 Figma Agent — TOC becomes 8, badge stays at 8 (unchanged)
6. Pre-existing drift (Perplexity + Human Voice Rules unlisted) noted in implementation-summary.md as separate cleanup

### Alternatives Considered
- (a) Bump badge to 9 — rejected: doesn't match TOC of 8 after Figma; introduces new drift
- (b) Resolve all drift in this packet — rejected: scope creep; per memory rule "scope-lock"

### Consequences
- Pre-existing drift (Perplexity + Human Voice Rules unlisted) remains
- Recommend follow-up packet: "Public README — TOC reconciliation for Perplexity + Human Voice Rules"
- Badge math becomes self-consistent after this packet (8 == 8)

---

## Cross-references

- **ADR-001 through ADR-007** (Phase 1 cross-cutting): see `../001-barter-figma-agent/decision-record.md`
  - ADR-001: Persona reframe
  - ADR-002: Mirror ClickUp structure
  - ADR-003: SYNC verb = Create (D4)
  - ADR-004: Favicon TODO defer (D3)
  - ADR-005: Bundling (D5) — Accepted (revised) per Phase 1 implementation discovery
  - ADR-006: cli-codex primary (D7)
  - ADR-007: Stay on main

- **ADR-011 through ADR-013** (Phase 3): see `../003-mcp-figma-skill-removal/decision-record.md`
  - D1: Code Mode keep figma-developer-mcp tool refs / strip 4 skill-name refs
  - D2: Spec history preserved
  - D6: Advisor cleanup atomicity (two-commit split)
  - D8: Re-grep at execution start

---

## Decision Index (full set)

| ID | Topic | Status | Owner Phase |
|---|---|---|---|
| ADR-001 | Persona reframe | Accepted | Phase 1 |
| ADR-002 | Mirror ClickUp structure | Accepted | Phase 1 (cross-cutting) |
| ADR-003 | SYNC verb = Create (D4) | Accepted | Phase 1 (cross-cutting) |
| ADR-004 | Favicon TODO defer (D3) | Accepted | Phase 1 (cross-cutting) |
| ADR-005 | Bundling (D5) | Accepted (revised) | Phase 1 |
| ADR-006 | cli-codex primary (D7) | Accepted | Cross-cutting |
| ADR-007 | Stay on main | Accepted | Cross-cutting |
| **ADR-009** | **Public duplicate scrub (D9)** | **Accepted** | **Phase 2** |
| **ADR-010** | **Public README badge math (D10)** | **Accepted** | **Phase 2** |
| ADR-011+ | Phase 3 decisions | Pending Phase 3 | Phase 3 |
