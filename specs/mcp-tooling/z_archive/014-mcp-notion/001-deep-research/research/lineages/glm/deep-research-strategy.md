---
title: "Deep Research Strategy — mcp-notion adopt-vs-build"
trigger_phrases: []
---
# Deep Research Strategy — mcp-notion adopt-vs-build

## 2. TOPIC
Does the official Notion MCP (`@notionhq/notion-mcp-server`, ~18 tools) cover a full mcp-notion mode of the mcp-tooling hub at mcp-obsidian parity, or is custom CLI/MCP tooling plus a Notion knowledge layer required? Adopt-vs-build verdict, plus the Notion knowledge layer (databases, properties, relations, rollups, formulas, API version) the mode must encode.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] q-capability-map: What do the official Notion MCP server's ~18 tools actually cover (pages, databases, blocks, search, comments, users, file uploads) and where are the gaps vs the full Notion API?
- [ ] q-parity-obsidian: How does each mcp-obsidian capability (note CRUD, search, tags, frontmatter, daily notes, plugin file-layer) map to a Notion-MCP equivalent, and what has no equivalent?
- [ ] q-adopt-vs-build: Can a thin transport mode wrapping the official MCP suffice (mcp-figma/mcp-mobbin pattern), or is a fuller skill with a Notion knowledge layer needed (mcp-obsidian pattern)?
- [ ] q-auth-runtime: What are the auth model (NOTION_TOKEN, ntn_ prefix), rate limits, hosted-OAuth-vs-local-stdio tradeoffs, and headless constraints for Code Mode?
- [ ] q-knowledge-layer: What Notion-specific knowledge must the mode encode — database schemas, property types, relations/rollups, formulas, API-version pinning — analogous to mcp-obsidian's plugin file-layer doctrine?
- [ ] q-migration-tiein: How does the 015 Notion→Obsidian migration relate: is mcp-notion also a migration enabler (reading Notion structure to drive an Obsidian import)?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- This research does NOT implement the mcp-notion mode — it produces the verdict and knowledge-layer spec that 002+ phases will build from.
- This research does NOT evaluate non-official Notion MCP servers (community/third-party) as primary candidates; the official `@notionhq/notion-mcp-server` is the adoption target.
- This research does NOT test live Notion API calls (no NOTION_TOKEN available); findings are based on published API/MCP documentation and codebase analysis.

---

## 5. STOP CONDITIONS
- stopPolicy: max-iterations — run all 10 iterations regardless of convergence signal; convergence before iteration 10 is telemetry only.
- Escalate if: the official MCP server is found to be deprecated or unmaintained, or if the Notion API surface is fundamentally incompatible with headless/stdio operation.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- q-capability-map: The official Notion MCP server (v2.5.1) has **24 tools** (not ~18), covering pages (7: CRUD + markdown round-trip + move), blocks (5: CRUD), databases/data sources (6: query/retrieve/update/create/templates + retrieve-database), comments (2: create/list), users (3: list/retrieve/bot), search (1). API version 2025-09-03 for most tools, 2026-03-11 for markdown tools. NOT covered: file uploads, views, async tasks, page property items, agents, sessions, custom emojis, meeting notes. **Critical: the open-source local server is being deprecated** in favor of the remote Notion MCP at mcp.notion.com. (iteration 1)
- q-parity-obsidian: mcp-obsidian is a **full skill** with 3 execution surfaces (headless notesmd-cli, app-backed obsidian CLI, cyanheads MCP with 14 tools), 15 core note operations, and an 11-plugin file-layer knowledge layer (Beancount, Tables, BRAT, Health.md, Iconic, Charts, Dataview, Excalidraw, Git, Outliner, Minimal). Auth is local (no OAuth). Headless CLI operates on filesystem — architecturally impossible for Notion (cloud-only). The 11-plugin knowledge layer is the core differentiator vs a thin transport. (iteration 3)
- q-adopt-vs-build: **VERDICT: BUILD** — as a light workflow mode (mcp-click-up pattern), not a full skill (mcp-obsidian pattern) and not a thin transport (mcp-figma pattern). mcp-notion must mutate the workspace (packetKind: workflow), needs direct API calls for 5 tooling gaps (file uploads, views, property items, async tasks, daily notes), needs a Notion knowledge layer (22 property types, database schemas, rate limits, API versioning), and the deprecation risk requires backend abstraction (local stdio → remote OAuth migration). But Notion has no plugin ecosystem, so the 11-plugin depth of mcp-obsidian is unnecessary. (iteration 5)
- q-knowledge-layer: The Notion knowledge layer has three pillars: (1) the database → data source → page hierarchy (API 2025-09-03), (2) 22 property types with schema configurations (10 no-config, 3 with options, 1 with format, 4 computed, 2 user-ref, 1 relation, 1 location), (3) the relational/computed model: relations (single/dual property), rollups (14 aggregation functions, 3 not computed by API), and formulas (Formulas 2.0, JS-like syntax, prop() references, ternary, dot notation, ~50+ functions across logical/text/math/date/person/list categories). The mode must encode all three pillars plus filter/sort operations, read-only constraints, and the property type → formula data type mapping. (iterations 6-7)
- q-auth-runtime: Three token types (internal `ntn_`, PAT `ntn_`, OAuth `ntn_`). Two MCP backends: local stdio (deprecated, token-based, headless-compatible) vs remote `mcp.notion.com/mcp` (recommended, OAuth 2.0 with PKCE, requires interactive browser — incompatible with headless). Remote MCP does NOT accept internal integration tokens — must initiate OAuth with the MCP server itself. Rate limit: 3 r/s per integration with Retry-After. The mode must support BOTH backends and route by runtime context (headless → local stdio + token; interactive → remote MCP + OAuth). (iteration 8)
- q-migration-tiein: The 015 spec is Notion→Obsidian migration (read from Notion, write to Obsidian). mcp-notion's role is **read-side inventory enabler** — its tools (retrieve-database, retrieve-data-source, query-data-source) and knowledge layer (22 property types, relations, rollups, formulas) automate the pre-flight inventory step. mcp-notion is NOT the migration executor (that's Obsidian's in-app Importer + mcp-obsidian's file-layer reconstruction). The knowledge layer is shared: the same property-type/relation/rollup/formula model serves both operational use and migration inventory. API versions: 2025-09-03 (most tools), 2026-03-11 (markdown + async); the mode must pin per-operation. (iteration 9)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Web search + raw README fetch: gave authoritative tool inventory and deprecation status (iteration 1)
- Third-party benchmark comparison: confirmed 24-tool count and token footprint (iteration 1)
- Official API reference pages: authoritative endpoint enumeration and property type catalog (iteration 2)
- Rate limit search: surfaced both official docs and practical analysis (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- GitHub rendered page: did not surface README content; had to fetch raw URL (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Hard delete as a requirement: Notion's archive model is the native pattern; pursuing hard delete fights the platform (iteration 4, evidence: iteration-004.md F4.7)
- Headless filesystem operation: architecturally impossible for a cloud service (iteration 4, evidence: iteration-004.md F4.4)
- Thin transport (adopt) pattern: architecturally wrong for a workspace-mutating mode; cannot make direct API calls for 5 tooling gaps (iteration 5, evidence: iteration-005.md F5.2)
- Full mcp-obsidian-level skill: over-engineered for a plugin-less platform; 6 of 11 plugin domains are structurally non-applicable (iteration 5, evidence: iteration-005.md F5.3)
- Remote MCP as sole backend: requires interactive OAuth, incompatible with headless/Code Mode; mode must support local stdio server despite deprecation (iteration 8, evidence: iteration-008.md F8.3)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 10: Final gap analysis + verdict consolidation. Consolidate all findings across 9 iterations into a final gap matrix, confirm the BUILD verdict with the complete evidence base, and prepare for synthesis.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- **Source pointers**: `mcp-tooling` hub at `.claude/skills/mcp-tooling/SKILL.md`; `mcp-obsidian` mode at `.claude/skills/mcp-tooling/mcp-obsidian/SKILL.md` (parity baseline); `mode-registry.json` at hub root; spec at `specs/mcp-tooling/014-mcp-notion/spec.md` and `001-deep-research/spec.md`.
- **Reuse candidates**: `mcp-figma` / `mcp-mobbin` (thin transport pattern — adopt path); `mcp-obsidian` (full skill with knowledge layer — build path); `mcp-code-mode` (shared MCP execution substrate).
- **Integration points**: `mode-registry.json` (hub registration), `.utcp_config.json` (Code Mode MCP registration — `notion` manual entry already added), `.env` / `.env.example` (`notion_NOTION_TOKEN` placeholder), skill advisor registration.
- **Constraints and risks**: No live NOTION_TOKEN available (research is documentation-based); Notion API version 2026-03-11 is the pinned version per spec; hosted OAuth server cannot run headless (already answered in parent spec).

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only — stopPolicy is max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-08-21T13:05:00Z
