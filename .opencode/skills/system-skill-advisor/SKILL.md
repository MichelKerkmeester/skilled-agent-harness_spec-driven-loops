---
name: system-skill-advisor
description: Routes non-trivial requests to matching skills through standalone MCP metadata and stable advisor tool ids.
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 0.1.0
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "advisor_status"
  - "which skill should handle this"
  - "route this request to a skill"
  - "system skill advisor"
importance_tier: critical
keywords:
  - skill-routing
  - gate-2
  - advisor-mcp
  - legacy-tool-bridge
  - skill-graph
  - semantic-lane
intent_signals:
  - "Gate 2 skill routing"
  - "advisor_recommend native MCP routing"
  - "advisor_status freshness check"
  - "which skill should handle this request"
  - "run the skill advisor hook"
---

<!-- Keywords: system-skill-advisor, skill-advisor, advisor_recommend, advisor_status, advisor_rebuild, advisor_validate, gate-2-routing, standalone-mcp, legacy-tool-bridge, skill-graph -->

# System Skill Advisor

Routes non-trivial user requests to the right skill through the standalone Skill Advisor MCP package.

---

## 1. WHEN TO USE

Use this skill when the work is about skill selection, Gate 2 routing, advisor MCP tools, prompt-time skill-advisor hooks, skill graph freshness, or the standalone advisor package.

Activation signals:

- A request asks which skill should handle a task.
- A runtime hook needs a skill recommendation before execution.
- An operator asks about `advisor_recommend`, `advisor_status`, `advisor_rebuild`, or `advisor_validate`.
- A packet touches the skill graph, skill metadata, advisor scorer, advisor feature catalog, or manual testing playbook.
- A migration step references ADR-001: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`.

Do not use this skill as a replacement for the recommended target skill. For example, route code implementation to `sk-code`, documentation authoring to `sk-doc`, git work to `sk-git`, and MCP orchestration to `mcp-code-mode` after the advisor has made the recommendation.

---

## 2. SMART ROUTING

This package is mandatory context for non-trivial Gate 2 routing. The advisor scores the prompt against skill metadata, hook signals, graph-derived relations, and manual intent declarations, then returns calibrated recommendations.

Routing model:

```text
user prompt
  |
  +-- exact skill name or explicit user direction -> named skill wins
  |
  +-- non-trivial or ambiguous request
        |
        +-- advisor_recommend on system_skill_advisor MCP
        |
        +-- top recommendation above confidence threshold -> invoke that skill
        |
        +-- ambiguous top scores -> surface top candidates and ask or route with caveat
```

Resource domains:

- `feature_catalog/` documents current advisor capabilities. Child 002 contains an initial scaffold; child 003 moves the full catalog.
- `manual_testing_playbook/` documents deterministic operator scenarios. Child 002 contains an initial scenario; child 003 moves the full playbook.
- `references/` contains package policies and architectural summaries used by later extraction children.
- `mcp_server/` is the child 003 drop target for handlers, schemas, tools, scripts, tests, and the package-local SQLite database.

---

## 3. HOW IT WORKS

ADR-001 locks the target shape as **Standalone Advisor MCP With Legacy Tool Bridge**.

The target package owns a dedicated MCP server named `system_skill_advisor`. Public tool ids stay stable:

- `advisor_recommend`
- `advisor_rebuild`
- `advisor_status`
- `advisor_validate`

The stable tool ids matter because live consumers already call them from hooks, Python compatibility shims, plugin bridges, doctor workflows, install guides, and MCP clients. Server-level namespacing supplies the new boundary, so callers can move from the old memory-owned registration to the standalone server without learning a new tool vocabulary.

During the migration window, legacy `advisor_*` access through `spec_kit_memory` may be proxied or fail fast with a migration hint. After children 003-006 complete, the advisor implementation and database live under this skill package, while memory remains focused on memory tools.

---

## 4. RULES

Always:

- Treat ADR-001 as the source of truth for standalone MCP topology and bridge behavior.
- Keep the advisor database under `.opencode/skills/system-skill-advisor/mcp_server/database/`.
- Keep public advisor tool ids stable unless a later ADR explicitly changes them.
- Preserve prompt-safety boundaries. Advisor metadata and lane attribution must not echo raw prompt text.
- Distinguish envelope work from runtime moves. Child 002 is docs and scaffold only.

Never:

- Store `skill-graph.sqlite` under `.opencode/skills/system-spec-kit/mcp_server/database/` after the runtime move.
- Let both memory and advisor MCP servers write the same advisor SQLite database.
- Rename `advisor_*` tools as part of the first standalone extraction.
- Modify runtime configs, launchers, hook wrappers, or production advisor source as part of child 002.

Escalate if:

- A caller requires renamed public tools before the bridge window is complete.
- The standalone advisor cannot build without a broader shared-runtime extraction.
- Any migration step would create competing writers for `skill-graph.sqlite`.

---

## 5. REFERENCES

Primary contract:

- ADR-001: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md`
- Extraction survey: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/research/extraction-survey.md`
- Standalone MCP discussion: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-design-and-decision-record/research/standalone-mcp-discussion.md`

Package references:

- `references/db-path-policy.md`
- `references/standalone-mcp-shape.md`
- `references/legacy-tool-bridge.md`

---

## 6. SUCCESS CRITERIA

This skill is healthy when:

- `SKILL.md` frontmatter and `graph-metadata.json` parse cleanly.
- Skill discovery sees `system-skill-advisor` as a first-class critical system skill.
- Advisor routing requests resolve to this package without displacing target execution skills such as `sk-code`, `sk-doc`, or `system-spec-kit`.
- `advisor_*` public ids remain documented as stable through the migration window.
- The package-local database path is documented consistently.

---

## 7. INTEGRATION POINTS

Current migration state:

- Child 002 creates this envelope only.
- Child 003 moves advisor source, tests, and DB path ownership into `mcp_server/`.
- Child 004 adds `.opencode/bin/skill-advisor-launcher.cjs` and four-runtime MCP config entries.
- Child 005 cuts hooks, plugin bridge, Python shim, doctor workflows, and consumers over to the standalone package.
- Child 006 removes temporary legacy proxies and stale docs after validation.

Expected consumers:

- Prompt-time hooks for Claude, Codex, Gemini, and OpenCode.
- MCP clients that call `advisor_recommend`, `advisor_status`, `advisor_rebuild`, or `advisor_validate`.
- Doctor workflows that validate advisor health and rebuild state.
- Skill graph indexers and routing accuracy checks.

---

## 8. REFERENCES AND RELATED RESOURCES

Related skills:

- `system-spec-kit` owns spec folders, memory, validation, and packet governance.
- `sk-doc` owns skill documentation, feature catalogs, install guides, and playbooks.
- `sk-code` owns implementation once routing selects a code surface.
- `mcp-code-mode` owns external MCP orchestration workflows.
- `mcp-coco-index` is a peer semantic-search route for code discovery, not a replacement for advisor routing.

The advisor should recommend these skills. It should not absorb their implementation rules.
