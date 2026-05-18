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

<!-- Keywords: system-skill-advisor, skill-advisor, advisor_recommend, advisor_status, advisor_rebuild, advisor_validate, skill_graph_scan, skill_graph_query, skill_graph_status, skill_graph_validate, skill_graph_propagate_enhances, cross-skill-edges, gate-2-routing, standalone-mcp, legacy-tool-bridge, skill-graph -->

# System Skill Advisor

<!-- sk-doc-template: skill_md -->

Routes non-trivial user requests to the right skill through the standalone Skill Advisor MCP package.

---

<!-- ANCHOR:1-when-to-use -->
## 1. WHEN TO USE

Use this skill when the work is about skill selection, Gate 2 routing, advisor MCP tools, prompt-time skill-advisor hooks, skill graph freshness or the standalone advisor package.

Activation signals:

- A request asks which skill should handle a task.
- A runtime hook needs a skill recommendation before execution.
- An operator asks about `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` or `skill_graph_propagate_enhances`.
- A packet touches the skill graph, skill metadata, advisor scorer, advisor feature catalog or manual testing playbook.
- A migration step references ADR-001: `<spec-folder>`.

Do not use this skill as a replacement for the recommended target skill. For example, route code implementation to `sk-code`, documentation authoring to `sk-doc`, git work to `sk-git` and MCP orchestration to `mcp-code-mode` after the advisor has made the recommendation.

---

<!-- /ANCHOR:1-when-to-use -->

<!-- ANCHOR:2-smart-routing -->
## 2. SMART ROUTING

This package is mandatory context for non-trivial Gate 2 routing. The advisor scores the prompt against skill metadata, hook signals, graph-derived relations and manual intent declarations, then returns calibrated recommendations.

Routing model:

```text
user prompt
  |
  +-- exact skill name or explicit user direction -> named skill wins
  |
  +-- non-trivial or ambiguous request
        |
        +-- advisor_recommend on mk_skill_advisor MCP
        |
        +-- top recommendation above confidence threshold -> invoke that skill
        |
        +-- ambiguous top scores -> surface top candidates and ask or route with caveat
```

Resource domains:

- `feature_catalog/` documents current advisor capabilities and source-of-truth feature references.
- `manual_testing_playbook/` documents deterministic operator scenarios for advisor tools, hooks, compatibility, daemon behavior and skill graph flows.
- `references/` contains package policies and architectural summaries used by extraction and maintenance work.
- `mcp_server/` owns handlers, schemas, tools, scripts, tests, library modules and the package-local SQLite database.

### Routing key

The routing key is the prompt's intent class, scored by `advisor_recommend` against indexed skill metadata, hook signals plus graph-derived relations. Operators may override the advisor by naming a skill explicitly in the prompt.

### Smart router pseudocode

This pseudocode captures the canonical advisor routing contract callers must follow. See [`references/advisor-scorer.md`](./references/advisor-scorer.md) for the actual scorer mechanics.

```python
# Pattern 1: Runtime skill discovery
# The advisor reads .opencode/skills/*/SKILL.md at every call.
# Do not cache the inventory in caller code.
INVENTORY = discover_skills(root=".opencode/skills")  # MCP-side, not caller-side

# Pattern 2: Existence check before route
# Always call advisor_status first when freshness matters.
status = mcp__mk_skill_advisor__advisor_status({})
if status["trustState"] in ("absent", "unavailable"):
    return UNAVAILABLE_FALLBACK  # see Pattern 4

# Pattern 3: Extensible routing key (the prompt itself)
# The prompt IS the routing key. Caller passes it through unchanged.
def get_routing_key(prompt: str) -> str:
    return prompt.strip()

# Pattern 4: Multi-tier graceful fallback
recommendations = mcp__mk_skill_advisor__advisor_recommend({
    "prompt": get_routing_key(user_prompt),
    "options": {"topK": 5, "includeAttribution": True}
})

# Tier 1: ambiguous top scores (within 0.1 of each other), surface candidates
if is_ambiguous(recommendations):
    return SURFACE_CANDIDATES(recommendations[:3])

# Tier 2: low confidence (top score below threshold), request disambiguation
if recommendations[0]["score"] < CONFIDENCE_THRESHOLD:
    return UNKNOWN_FALLBACK_CHECKLIST

# Tier 3: happy path, invoke the recommended skill
return invoke_skill(recommendations[0]["skill_id"])
```

### Fallback contract

- **Low confidence (top score below the configured threshold):** surface the top 3 candidates with their scores, request disambiguation, load no skill until the operator picks one.
- **Ambiguous top scores (within 0.1 of each other):** surface both candidates instead of routing silently.
- **Advisor MCP unavailable:** fall back to Python `skill_advisor.py` shim, then to keyword matching against each skill's frontmatter `trigger_phrases`. Announce the degraded mode in the response.
- **Empty result:** never route silently. Always emit a "no candidate above threshold" notice with a disambiguation checklist.

```python
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the runtime surface where the request originated",
    "Confirm the intent (file modification, research, debugging, planning)",
    "Provide one concrete input, error or expected output",
    "Confirm the verification command set before completion",
]
```

### Anti-patterns

- Static skill inventories that miss newly-installed skills. The advisor reads `.opencode/skills/*/SKILL.md` at every call so the inventory stays current.
- Hardcoded tool IDs in caller code. Consult the live registration in `mcp_server/tools/index.ts` and `mcp_server/tools/skill-graph-tools.ts`.
- Returning a single recommendation when two top scores are within 0.1 of each other. Surface both candidates instead.

---

<!-- /ANCHOR:2-smart-routing -->

<!-- ANCHOR:3-how-it-works -->
## 3. HOW IT WORKS

ADR-001 locks the target shape as **Standalone Advisor MCP With Legacy Tool Bridge**.

The package owns a dedicated MCP server named `mk_skill_advisor`. It registers **8 public tools plus 1 internal trusted-caller tool** (9 total). The tool ids stay stable:

Public (8):

- `advisor_recommend`
- `advisor_rebuild`
- `advisor_status`
- `advisor_validate`
- `skill_graph_scan`
- `skill_graph_query`
- `skill_graph_status`
- `skill_graph_validate`

Internal trusted-caller (1):

- `skill_graph_propagate_enhances`, gated behind trusted-caller auth (see `references/tool-ids-reference.md` §4)

The stable tool ids matter because live consumers already call them from hooks, Python compatibility shims, plugin bridges, doctor workflows, install guides and MCP clients. Server-level namespacing supplies the boundary, so callers use the standalone server without learning a new advisor vocabulary.

The advisor implementation, skill-graph library and package-local database now live under this skill package, while memory remains focused on memory tools.

---

<!-- /ANCHOR:3-how-it-works -->

<!-- ANCHOR:4-rules -->
## 4. RULES

Always:

- Treat ADR-001 as the source of truth for standalone MCP topology and bridge behavior.
- Keep the advisor database under `.opencode/skills/system-skill-advisor/mcp_server/database/`.
- Keep public advisor and skill graph tool ids stable unless a later ADR explicitly changes them.
- Preserve prompt-safety boundaries. Advisor metadata and lane attribution must not echo raw prompt text.
- Keep `lib/skill-graph/` package-local to `system-skill-advisor`.

Never:

- Store `skill-graph.sqlite` under `.opencode/skills/system-spec-kit/mcp_server/database/` after the runtime move.
- Let both memory and advisor MCP servers write the same advisor SQLite database.
- Rename `advisor_*` or `skill_graph_*` public tools as part of documentation work.
- Move `lib/skill-graph/` during a doc-only pass.

Escalate if:

- A caller requires renamed public tools.
- The standalone advisor cannot build without a broader shared-runtime extraction.
- Any migration step would create competing writers for `skill-graph.sqlite`.

---

<!-- /ANCHOR:4-rules -->

<!-- ANCHOR:5-references -->
## 5. REFERENCES

Primary contract:

- ADR-001: internal design notes
- Extraction survey: internal design notes
- Standalone MCP discussion: internal design notes

Package references:

- `references/db-path-policy.md`
- `references/standalone-mcp-shape.md`
- `references/legacy-tool-bridge.md`
- `references/skill-graph-drift.md` — detect and reconcile SQLite drift from source files.
- `references/skill-graph-extraction-plan.md` — extraction history and completion record.
- `references/deferred-decisions.md` — Tier D decision records (F4 Devin hooks, F6 deprecation banners).
- `ARCHITECTURE.md`
- `mcp_server/README.md`
- `mcp_server/tools/README.md`

---

<!-- /ANCHOR:5-references -->

<!-- ANCHOR:6-success-criteria -->
## 6. SUCCESS CRITERIA

This skill is healthy when:

- `SKILL.md` frontmatter and `graph-metadata.json` parse cleanly.
- Skill discovery sees `system-skill-advisor` as a first-class critical system skill.
- Advisor routing requests resolve to this package without displacing target execution skills such as `sk-code`, `sk-doc` or `system-spec-kit`.
- `advisor_*` and `skill_graph_*` public ids remain documented as stable.
- The package-local database path is documented consistently.

---

<!-- /ANCHOR:6-success-criteria -->

<!-- ANCHOR:7-integration-points -->
## 7. INTEGRATION POINTS

Current package state:

- `mk_skill_advisor` is registered as a standalone MCP server.
- Advisor handlers, schemas, tools, scripts, tests, docs and database path ownership live under this package.
- `skill_graph_*` MCP handlers and tool descriptors live under this package.
- `lib/skill-graph/` database/query logic is fully migrated to `system-skill-advisor` (extraction complete).

Expected consumers:

- Prompt-time hooks for Claude, Codex, Gemini and OpenCode.
- MCP clients that call `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` or `skill_graph_propagate_enhances`.
- Doctor workflows that validate advisor health and rebuild state.
- Skill graph indexers and routing accuracy checks.

---

<!-- /ANCHOR:7-integration-points -->

<!-- ANCHOR:8-references-and-related-resources -->
## 8. REFERENCES AND RELATED RESOURCES

Related skills:

- `system-spec-kit` owns spec folders, memory, validation and packet governance.
- `sk-doc` owns skill documentation, feature catalogs, install guides and playbooks.
- `sk-code` owns implementation once routing selects a code surface.
- `mcp-code-mode` owns external MCP orchestration workflows.
- `mcp-coco-index` is a peer semantic-search route for code discovery, not a replacement for advisor routing.

The advisor should recommend these skills. It should not absorb their implementation rules.

<!-- /ANCHOR:8-references-and-related-resources -->
