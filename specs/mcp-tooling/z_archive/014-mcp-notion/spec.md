---
title: "Feature Specification: mcp-notion — official Notion MCP evaluation + Notion mode for the mcp-tooling hub"
description: "Phase parent for adding Notion support to the mcp-tooling hub: first validate whether the official Notion MCP (@notionhq/notion-mcp-server, 24 tools) covers the needed operations, then adopt-or-build an mcp-notion mode mirroring mcp-obsidian — deep research, scaffold, author the skill, register in hub + advisor, verify. BUILT: mcp-notion mode shipped and routing at 0.95 advisor confidence."
trigger_phrases:
  - "014-mcp-notion"
  - "mcp-notion"
  - "notion mcp"
  - "notion mode mcp-tooling"
  - "official notion mcp evaluation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "mcp-notion built + hub-registered; advisor routes Notion 0.95; canon + parent-hub green"
    next_safe_action: "Operator: add notion_NOTION_TOKEN for a live smoke test, then commit"
    blockers:
      - "Live Notion API round-trip needs the operator's NOTION_TOKEN in .env; build + registration are complete and verified (placeholder in .env.example)"
    key_files:
      - "spec.md"
      - "001-deep-research/research/research.md"
      - "../../../.opencode/skills/mcp-tooling/mcp-notion/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-mcp-notion"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Official Notion MCP transport for Code Mode: stdio @notionhq/notion-mcp-server with NOTION_TOKEN; the hosted OAuth server cannot run headless"
      - "Adopt-vs-build: BUILD mcp-notion as a light workflow mode (mcp-click-up pattern) — 24-tool MCP covers all CRUD but leaves 5 fillable tooling gaps + needs a Notion knowledge layer; dual-backend (local stdio deprecated/headless vs remote OAuth/interactive)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: mcp-notion mode for the mcp-tooling hub

---

## 1. ROOT PURPOSE

The `mcp-tooling` hub covers ClickUp, Chrome DevTools, Obsidian, and several design transports, but has **no Notion support**. This packet adds one — but deliberately gates the build on a first question the operator raised: **can the official Notion MCP do everything on its own, or do we need to build custom tooling the way `013-mcp-obsidian` did?**

So the decomposition is *evaluate first, then adopt-or-build*, rather than assuming a full custom skill from the start.

---

## 2. WHAT NEEDS DONE

- Determine whether the official Notion MCP (`@notionhq/notion-mcp-server`, stdio, 18 tools) covers the operations an `mcp-notion` mode needs, benchmarked against the `mcp-obsidian` capability set.
- Based on that verdict, either **adopt** the official MCP as a thin transport mode (like `mcp-figma` / `mcp-mobbin`) or **build** a fuller skill with a Notion knowledge layer (like `mcp-obsidian`).
- Author the mode, register it in the hub `mode-registry.json` and the skill advisor, and verify end-to-end.

The official Notion MCP is already registered in Code Mode (`.utcp_config.json` manual `notion`, env `notion_NOTION_TOKEN`); live use needs the operator's integration token in `.env`.

---

## 3. SUB-PHASE LIST

| Phase | Folder | Outcome |
|---|---|---|
| **001 — Deep research** | `001-deep-research/` | 10-iteration deep research (GLM-5.2-High via cli-devin, no early convergence): does the official Notion MCP cover a full mcp-notion mode, or is custom tooling required? Produces the adopt-vs-build verdict. |
| 002+ — provisional | *(pending 001 verdict)* | Scaffold, skill authoring, hub + advisor registration, and verification. Their exact shape is decided by the 001 adopt-vs-build outcome, mirroring `010-mcp-mobbin` (adopt/transport path) or `013-mcp-obsidian` (build path). |

Later phases are intentionally left provisional: their structure depends on the 001 verdict, so decomposing them now would presume the answer.
