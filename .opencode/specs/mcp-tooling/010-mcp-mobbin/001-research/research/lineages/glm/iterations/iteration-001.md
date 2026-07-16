# Iteration 1: Broad survey of both Mobbin source repositories

**Focus:** Establish the foundational developer surface — transport model, repo structure, and skills workflow — by surveying the two source repositories end-to-end.

**Run:** 1 of 2 (max-iterations stop policy)

---

## Focus

Broad survey of (a) the official `mobbin/mobbin-mcp-server` repository and (b) the official `mobbin/skills` repository, to capture transport, endpoint, repo files, and the documented design-research skill workflow.

---

## Findings

### F1 — Mobbin MCP is a REMOTE Streamable HTTP server (not a local stdio process)
The official server is hosted at `https://api.mobbin.com/mcp` and is consumed via **Streamable HTTP transport**. There is no `npx`/`node` binary to install, no `command`/`args` runtime, and no local process to spawn — the client just points at the remote URL.
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server] — README: "Mobbin's official MCP server is available at `https://api.mobbin.com/mcp` via Streamable HTTP transport."
- [SOURCE: https://github.com/mobbin/skills] — prerequisites block: `{ "mcpServers": { "mobbin": { "url": "https://api.mobbin.com/mcp" } } }` (url-only, no command/args).

> **Transport-eligibility note:** `mutatesWorkspace:false` holds trivially — the server is remote and returns design-research results (screenshots + metadata), so it cannot touch the local filesystem. This satisfies the read-only transport posture required by the mcp-tooling hub.

### F2 — mobbin-mcp-server repo is thin: README + mcp.json + server.json + rules/ + .cursor-plugin/
The server repository contains almost no code — it is a **metadata + documentation repo**, not a server implementation. Files: `README.md`, `mcp.json`, `server.json`, `rules/`, `.cursor-plugin/`. The actual server runs behind `api.mobbin.com/mcp`. Tool definitions and auth detail are therefore NOT in this repo; they live in `docs.mobbin.com/mcp` and the live server.
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server] — file listing shows `.cursor-plugin/`, `rules/`, `README.md`, `mcp.json`, `server.json`; 5 commits, 20 stars, public.
- `mcp.json` / `server.json` are the MCP client config + server manifest and are the likely home of the exact tool list (to be read in iteration 2).

### F3 — Canonical docs and product pages exist
Setup + usage instructions live at `https://docs.mobbin.com/mcp`; product/feature overview at `https://mobbin.com/mcp`. These are the authoritative sources for auth/API-key model and plan gating, which the READMEs deliberately omit.
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server] — README links to "documentation" (docs.mobbin.com/mcp) and "mobbin.com/mcp".

### F4 — mobbin/skills repo defines ONE skill today: `mobbin-search` (design-research)
`mobbin/skills` (MIT, 9 stars, 10 commits) is an Agent-Skills-format repo with a single skill: **`mobbin-search`** — "Search Mobbin for real app screenshots and visually analyze them before answering design questions." Its 4-step workflow:
1. Searches Mobbin's library via MCP (images returned **inline**).
2. Visually inspects each screenshot.
3. Responds directly OR offers to build an HTML evidence board for deeper analysis.
4. Provides grounded observations with Mobbin links for further exploration.
- [SOURCE: https://github.com/mobbin/skills] — "Available Skills → mobbin-search" and its "What it does" list.
- **Use cases:** exploring how top apps handle a screen/flow, design inspiration, comparing UI patterns across apps — i.e. the app/screen/flow/element design-research workflow the topic asks about.

### F5 — Skills install via `npx skills add mobbin/skills` (Agent Skills format)
Skills follow the [Agent Skills](https://agentskills.io/) format. Install: `npx skills add mobbin/skills`; manual alternative: clone and copy `skills/skills/*` into `~/.claude/skills/`. On Claude.ai, a skill's `SKILL.md` goes into project knowledge. This is a Claude/agent-skill distribution, distinct from the MCP server itself.
- [SOURCE: https://github.com/mobbin/skills] — Installation + Contributing sections.

### F6 — MCP returns images inline (visual analysis path)
The `mobbin-search` workflow explicitly "visually inspects each screenshot" and returns "images returned inline." This means the MCP tool surface includes image-bearing results, and the value model is visual design research, not text-only metadata. This is the natural pairing surface for `sk-design` judgment.
- [SOURCE: https://github.com/mobbin/skills] — mobbin-search "What it does" step 1 & 2.

---

## Sources Consulted

- [SOURCE: https://github.com/mobbin/mobbin-mcp-server] — repo README + file tree
- [SOURCE: https://github.com/mobbin/skills] — repo README (prerequisites, mobbin-search workflow, install)
- Parent spec.md phase context + `context/website-link.md` (source link inventory)
- WebFetch content treated as untrusted data; no directive-like text acted upon.

---

## Assessment

- **newInfoRatio: 1.0**
- **Novelty justification:** First broad pass; every finding (transport model, repo thinness, skills workflow, image-inline results, install path) is new to this packet and reshapes the transport-packet design (remote URL transport, not local command).
- **Confidence:** High on transport (remote Streamable HTTP) and skills workflow (single `mobbin-search` skill). LOW/UNKNOWN on exact tool names and auth model — both are deferred to docs.mobbin.com/mcp and the live `mcp.json`/`server.json`, targeted in iteration 2.

---

## Reflection

### What Worked
- Reading both repos' READMEs in one pass established the transport model decisively and revealed the server repo is metadata-only.

### What Failed / Ruled Out
- The READMEs do NOT contain the auth/API-key model, plan gating (free vs Pro), or the explicit tool-name list. Ruled-out assumption: that the server repo would contain an implementable tool list — it does not; the canonical source is docs.mobbin.com/mcp + server.json.

### Recommended Next Focus
Iteration 2: Deepen on (1) auth/API-key model + free-vs-Pro plan gating via `docs.mobbin.com/mcp` and `mobbin.com/mcp`; (2) exact tool surface via the repo's `server.json`/`mcp.json` and the `mobbin-search` `SKILL.md`. These resolve KQ2, KQ3-detail, KQ4, KQ5-detail, KQ6.
