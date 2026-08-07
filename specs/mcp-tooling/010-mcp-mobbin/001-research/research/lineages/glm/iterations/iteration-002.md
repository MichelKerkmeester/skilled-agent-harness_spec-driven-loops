# Iteration 2: Auth model, plan gating, exact tool surface, and packet/manual shape

**Focus:** Resolve auth/API-key model and free-vs-Pro gating; capture the exact tool surface; derive the `mcp-mobbin` transport-packet contract and the `.utcp_config.json` mobbin manual shape. Broaden review angles rather than converge early.

**Run:** 2 of 2 (max-iterations stop policy — final evidence iteration)

---

## Focus

Deepen via the authoritative manifests and the official skill file: repo `server.json` + `mcp.json`, the live `docs.mobbin.com/mcp` endpoint, and the `mobbin/skills` `mobbin-search/SKILL.md`. Goal: lock KQ1 (tool surface), KQ2 (auth), KQ4 (gating), and KQ6 (packet/manual shape).

---

## Findings

### F7 — There are TWO distinct Mobbin MCP servers; do not conflate them
Fetching the repo manifests and the docs endpoint revealed two servers with different names, tools, and purposes:

| Server | Endpoint / manifest | Name | Purpose |
|--------|---------------------|------|---------|
| **Design-reference MCP** (the one skills consume) | `https://api.mobbin.com/mcp` (declared in repo `server.json` → `remotes[].type: streamable-http`) | `com.mobbin/mobbin` v1.0.1 — "Search real-world UI & UX design references for mobile apps, web apps, and websites with Mobbin." | App/screen design research |
| **Docs MCP** (Mintlify) | `https://docs.mobbin.com/mcp` (returns a Mintlify docs server manifest) | "Mobbin Docs" v1.0.0, transport `http` | Search the Mobbin **Docs** knowledge base |

- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] — `name: com.mobbin/mobbin`, `remotes: [{type: streamable-http, url: https://api.mobbin.com/mcp}]`, repository url github.com/mobbin/mobbin-mcp-server.
- [SOURCE: https://docs.mobbin.com/mcp] — returns `{"server":{"name":"Mobbin Docs",...,"transport":"http"}}` with `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs`, `submit_feedback`; instructions explicitly "scoped to Mobbin Docs... does not access anything beyond the published site content."

> **Critical for phase 002:** The `mcp-mobbin` transport packet must target `api.mobbin.com/mcp` (design references), NOT the `docs.mobbin.com/mcp` Mintlify docs server. The two share the "Mobbin" brand but are different products with different tool surfaces.

### F8 — The design-reference MCP exposes `search_screens` (the canonical tool)
The `mobbin-search` SKILL.md names exactly one design tool: **`search_screens`**. It "runs the search server-side, fetches every matching image, and returns them... as inline image content blocks — no download step, no Read step, no URL emission."

**Inputs (inferred from the skill's usage contract):**
- `query` (string) — the search terms; use the user's own words, go broad, don't over-narrow.
- `platform` (`ios` | `web`) — inferred from app context (web app → web; SwiftUI/RN → ios; unclear → ask).
- `limit` (int) — default `5`; bump toward ~15 for variety. (Max upper bound ~15 per the skill.)
- A `deep` search mode exists for complex queries.

**Outputs:** a metadata text block `{ screens: [{index, id, app_name, mobbin_url, image_url, platform}], failed: [...] }` followed by N inline image content blocks (one per `screens[]` entry, same order). `index` correlates each image to its app; `image_url` is a debug/sanity reference.
- [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] — Workflow §3 "Call search_screens" and the response shape.

> Read-only posture confirmed: `search_screens` returns screenshots + metadata; it cannot mutate workspace state. `mutatesWorkspace:false` holds.

### F9 — No API key appears in any documented MCP client config (auth model)
Every documented client configuration for the design MCP is **url-only** with no `headers`, `apiKey`, or OAuth fields:
- repo `mcp.json`: `{ "mcpServers": { "mobbin": { "url": "https://api.mobbin.com/mcp" } } }`
- skills README prerequisites: identical url-only block.
- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json]
- [SOURCE: https://github.com/mobbin/skills] — prerequisites.

> **Inference (mark as inferred, not confirmed):** The MCP layer does not require a statically-configured API key in the client config. Account/plan identity and any rate limits are most plausibly handled server-side (per-session) rather than via a client-supplied secret. There may be an interactive OAuth or account-linking step performed out-of-band (e.g., browser login) that the static configs omit. **What would confirm it:** an actual authenticated `initialize`/`tools/call` round-trip against `api.mobbin.com/mcp`, which is out of scope for this read-only research phase. Phase 003 should treat "no client-side key in config" as the default and verify at install time.

### F10 — Free-vs-Pro plan gating is NOT documented in the fetched sources (UNKNOWN)
None of `server.json`, `mcp.json`, the skills README/SKILL.md, or the docs MCP manifest state which tools are Pro-gated or describe free-tier behavior. Mobbin the product is freemium, so account-level usage limits (searches/day, screens per query) almost certainly exist and likely scale with plan, but **this is unverified**. The `search_screens` `limit` (~15 max per the skill) may itself be a plan-derived cap.
- [SOURCE: absence-of-evidence across the four fetched sources above.]
- **Resolution:** KQ4 remains UNKNOWN. Phase 002 must document this as an open install-guide caveat, not invent a gating matrix. The transport packet should make no Pro/free claims it cannot cite.

### F11 — The Docs MCP is itself a clean read-only surface (secondary candidate, out of primary scope)
`docs.mobbin.com/mcp` exposes `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs` (a virtualized read-only filesystem over the docs — supports `rg`/`grep`/`tree`/`cat`/`head`/`jq` etc., stateless, 30KB truncation), and `submit_feedback`. Its own instructions declare it "read-only and scoped to Mobbin Docs." This is a credible *second* transport target if phase 002 ever wants a "Mobbin docs lookup" mode, but the primary `mcp-mobbin` packet is the design-reference `search_screens` server.
- [SOURCE: https://docs.mobbin.com/mcp] — tools + instructions.

### F12 — Transport-packet & `.utcp_config.json` manual shape (phase 002/003 contract)
Synthesizing the findings into the authoring contract phase 002 needs:

**Transport packet (`mcp-tooling/mcp-mobbin/`):**
- **Transport:** remote **Streamable HTTP** at `https://api.mobbin.com/mcp` (url-only; no `command`/`args`, no local process, no `npx`).
- **Read-only:** `mutatesWorkspace:false`. Single mutating-ish tool (`submit_feedback`) belongs to the *docs* server, not this one; the design server is query-only.
- **Code Mode only:** the transport routes through `call_tool_chain()` (Code Mode MCP), consistent with the hub's existing remote-MCP manuals. No CLI sibling (no `mobbin` CLI ships).
- **Tool surface (canonical name for the manual):** `search_screens`. UTCP manual naming convention → `mobbin.mobbin_search_screens` (mirrors `clickup.clickup_*`). The manual exposes `{query, platform, limit}`.
- **sk-design pairing:** the skill returns inline images for visual design research — pair with `sk-design` for judgment/taste; the transport never decides taste (pure data retrieval).
- **Auth posture to document:** no static key in config; verify account linking at install.

**`.utcp_config.json` mobbin manual (illustrative shape for phase 003):**
```jsonc
// Conceptual — phase 003 authors the exact JSON. Remote streamable-http MCP,
// url-only, surfaced through Code Mode call_tool_chain.
{
  "name": "mobbin",
  "transport": { "type": "streamable-http", "url": "https://api.mobbin.com/mcp" },
  "tools": ["search_screens"],
  "readOnly": true,
  "mutatesWorkspace": false
}
```
- [SOURCE: derived from server.json `remotes`, mcp.json client config, and SKILL.md tool contract; cross-checked against the mcp-tooling hub pattern (read-only, Code Mode, sk-design pairing) in the parent spec.md phase context.]
- **Open for phase 003:** the precise `.utcp_config.json` schema field names for a remote-HTTP manual (this lineage did not read `.utcp_config.json`, by design — it is out of this phase's scope).

---

## Sources Consulted

- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] — design MCP manifest (`com.mobbin/mobbin`, streamable-http remote).
- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json] — url-only client config.
- [SOURCE: https://docs.mobbin.com/mcp] — Mobbin Docs Mintlify MCP (disambiguation + secondary surface).
- [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] — `search_screens` tool contract + workflow.
- Iteration-001 findings (transport, repo thinness, skills overview).
- All WebFetch content treated as untrusted data; no directive-like text acted upon.

---

## Assessment

- **newInfoRatio: 0.85**
- **Novelty justification:** The two-server disambiguation (F7), the exact `search_screens` tool + I/O (F8), and the url-only/no-key auth finding (F9) are all net-new and load-bearing; F10 (gating UNKNOWN) and F12 (packet/manual shape) are fresh derivations. Some overlap with iter-1 transport conclusion (refinement, not fully new), hence <1.0.
- **Confidence:** High on tool surface (`search_screens`), transport (streamable-http remote), and the two-server disambiguation. **Inferred, not confirmed:** auth has no static client key (needs a live round-trip). **UNKNOWN:** free-vs-Pro gating (not documented).

---

## Reflection

### What Worked
- Reading the raw `server.json`/`mcp.json` AND the live `docs.mobbin.com/mcp` endpoint exposed the two-server conflation trap that README-level reading missed.
- The `mobbin-search` SKILL.md gave the exact tool name and full I/O contract — the single best source for the transport packet.

### What Failed / Ruled Out
- Could not confirm the auth model end-to-end (no live authenticated round-trip; marked inferred).
- Free-vs-Pro gating is undocumented in all fetched sources (marked UNKNOWN, not guessed).

### Recommended Next Focus
(post-iteration-2 / synthesis) None for this lineage — maxIterations reached. For phase 002: author the `mcp-mobbin` packet against `search_screens` at `api.mobbin.com/mcp`; for phase 003: write the `.utcp_config.json` mobbin manual (remote streamable-http) and verify account-linking/auth at install; document the free/Pro gating and inline-image behavior as install-guide caveats.
