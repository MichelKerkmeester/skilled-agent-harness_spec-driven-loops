---
title: mcp-mobbin
description: "Search a library of real app screens and flows from your agent as cited, read-only design evidence, plus website sections from the same server."
trigger_phrases:
  - "mobbin"
  - "mobbin mcp"
  - "app design research"
  - "screen examples"
  - "ux flow references"
version: 1.1.8.0
---

# mcp-mobbin

> Search a library of real app screens and flows from your agent as cited, read-only design evidence.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Real-app screen and flow references for design research, plus the wiring and auth state of the `mobbin` manual |
| **Invoke with** | "mobbin", "mobbin mcp", "app design research", "screen examples", "ux flow references" or hub routing on Mobbin signals |
| **Works on** | The hosted Mobbin MCP at `api.mobbin.com/mcp`, bridged by `npx -y mcp-remote` from the registered `mobbin` manual. A paid plan and browser OAuth are required. No API key exists |
| **Produces** | Cited evidence with a `mobbin_url` on every record you use, returned to the requesting workflow |

### What It Does

The packet is a read-only transport in the `mcp-tooling` hub, declared `packetKind: transport` with `mutatesWorkspace: false`. It reaches the hosted Mobbin MCP through Code Mode and answers one evidence question per call. Every call runs against the external service, so nothing in this repo changes. Start with [the doctor script](./scripts/doctor.sh) to read the wiring state, confirm the callable with `tool_info` and then search through `call_tool_chain`.

It returns evidence, never design tokens. Pair `sk-design-md-generator` when the work needs a measured Style Reference taken from a live site's real CSS.

### Why This Skill Exists

An agent pointed at Mobbin without a written contract guesses in documented ways. It invents tools the provider never shipped. It wires a `MOBBIN_API_KEY` that does not exist, because the auth model is browser OAuth only. This README records the contract the fixture lists. It also records the auth model and the read-only boundary, which are what let an agent search without fabricating.

### The Three-Tool Search Surface

One dated fixture records the whole callable surface. The packet never calls past it. Each tool answers one evidence domain.

| Tool | What it searches | Notable inputs |
|---|---|---|
| `search_screens` | One app, screen or element intent, answered from the screen library | `query`, `platform` (`ios` or `web`), `mode` (`deep`, `standard` or `fast`), `limit`, `exclude_screen_ids`, `image_format` |
| `search_flows` | One user flow per query, returned as ordered flow objects | `query`, `platform`, `limit`, `page` (max 20), `image_format` |
| `search_sections` | One website section per query | `query`, `limit`, `page`, `image_format` |

The `mode` input on `search_screens` is client-settable. `deep` scores results for relevance on nuanced queries. `standard` returns results with low latency. `fast` is a deprecated alias for `standard`.

---

## 2. QUICK START

The wiring check runs anywhere. The calls need a paid plan and an operator-completed browser OAuth.

**Step 1: Check the wiring.**

```bash
bash .skilled/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
```

Expect exit 0 with `OK    'mobbin' manual registered in .utcp_config.json` and `OK    Bridge shape present: npx mcp-remote -> https://api.mobbin.com/mcp`.

**Step 2: Confirm the callable.**

```typescript
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" })
```

Expect a schema for `mobbin.mobbin_search_screens`. Discovery works before OAuth. Fail closed on any drift from the fixture baseline.

**Step 3: Run an intent-shaped search.**

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    })
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() }
  `
})
```

Expect `{ query, screens[] }` with `id`, `app_name`, `mobbin_url`, `image_url` and `platform` on each screen. That is the declared schema. Live authenticated responses are unexercised, so check the first real response and keep every field the schema does not name.

**Step 4: Cite the evidence and pair when needed.**

Cite every record you use by `mobbin_url`. When the work also needs a measured Style Reference of extracted design tokens, pair `sk-design-md-generator`.

---

## 3. HOW IT WORKS

A request arrives as an intent, not as a tool name. The packet reads the wiring state, confirms the callable in the live session and then calls one search tool with a query built from the user's own words. Results come back as metadata plus inline images. Every selected record is cited by its `mobbin_url`. A missing image is reported as partial success rather than dropped.

```text
┌────────────────────┐
│ Mobbin request     │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ doctor.sh reads    │
│ the manual state   │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ tool_info confirms │
│ the callable       │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ one search tool    │
│ runs the intent    │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ cited evidence by  │
│ mobbin_url         │
└────────────────────┘
```

### The Registered Manual

The `mobbin` manual is registered in `.utcp_config.json` by an operator. It is a stdio manual that launches `npx -y mcp-remote https://api.mobbin.com/mcp` with an empty `env`. The provider is a hosted server over Streamable HTTP, so there is no local package to install. The packet verifies the entry read-only and never edits it. [The manual reference shape](./assets/utcp-mobbin-manual.md) is the copy the live entry is checked against.

The bridge is HTTP-first with SSE fallback only after an HTTP 404. `mcp-remote` is unpinned and experimental. Node 18 or newer with a working `npx` is required.

### Authentication Without An API Key

Mobbin MCP accepts browser OAuth only: protected-resource discovery, Dynamic Client Registration (RFC 7591), the authorization-code flow with PKCE S256 and the `openid` scope. Access is revocable from Mobbin Account Settings. An unauthenticated request returns HTTP 401 with a `WWW-Authenticate` pointer to the protected-resource metadata. That challenge is expected, not a missing key.

No static API key exists for MCP. The API-key Bearer model belongs to the separate Team and Enterprise REST API, so the manual `env` stays empty. Auth state under `~/.mcp-auth` is operator-owned. End-to-end OAuth through the local bridge is Inferred, not verified.

### Plans And Limits

MCP starts at Pro. The Free plan has no MCP access. The exact denial payload for a Free account is unverified, so the packet states the plan gate and relays the provider message verbatim. The service enforces 60 requests per 60 seconds per user. On HTTP 429, honor `Retry-After` and then back off exponentially with jitter. Per-plan usage caps within the paid tiers are undocumented.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when the request names Mobbin or asks for real app screenshots, screen examples from shipped apps, UX flow references or app design research. Reach for it when the `mobbin` manual's wiring state needs reporting, including the plan gate and the auth model.

Skip it when the work is measured extraction, which is `sk-design-md-generator`'s job. Skip it for Refero research (`mcp-refero`), for Figma work (`mcp-figma`), for browser automation and previews (`mcp-chrome-devtools`) and for generic app coding (`sk-code`). Skip the Mobbin docs search too, because `docs.mobbin.com/mcp` is a separate docs-search MCP and not this packet's server. Never use it to change files. The manual and the auth state are operator-owned.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-md-generator` | The measured-extraction companion. It turns a live website's real CSS into a Style Reference DESIGN.md of named design tokens. This packet retrieves cited screenshot evidence. |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{manual}_{tool}` naming, discovery and the error envelope all come from Code Mode. |
| `mcp-refero` | The closest sibling: another remote MCP over `mcp-remote`, read-only and OAuth-gated. It covers styles, screens and flows. This packet covers screens, flows and sections. |
| `mcp-figma` | Figma work: inspect, tokens and render. No surface overlap with Mobbin. |
| `mcp-chrome-devtools` | Browser inspection and preview, never a design-reference search surface. |
| `sk-code` | Owns adapting a design decision into application code and verifying it. |

---

## 5. TROUBLESHOOTING

> Full symptom, cause and fix detail lives in [the troubleshooting reference](./references/troubleshooting.md).

| What you see | Why | Fix |
|---|---|---|
| No `mobbin.*` tools resolve in Code Mode | The session started before the registration (manuals load at startup), OAuth is incomplete or the registration broke | Reconnect Code Mode in a fresh session and run the doctor script. A missing manual goes to the operator |
| HTTP 401 before any authorization | The expected protected-resource challenge. The empty `env` is not anonymous access | Operator only: complete browser OAuth on a paid account. Never add an API key, none exists |
| The browser or OAuth callback fails | Headless session, blocked localhost callback port or timeout | Move to an interactive browser-capable session. No token-paste path exists |
| The callable name differs from the fixture | Provider or adapter drift since the dated discovery | Use the name `tool_info` returns, fail closed and record a fresh dated fixture |
| HTTP 429 | The 60 requests per 60 seconds per user window was exceeded | Honor `Retry-After` and then back off exponentially with jitter |
| A Free account is blocked | MCP starts at Pro. The exact denial payload is unverified | State the plan gate and relay the provider message verbatim |
| Inline images do not arrive | Fidelity through `call_tool_chain` is unverified and image blocks can drop | Report partial success and plan a side channel for visual inspection |

---

## 6. FAQ

### Do I need a Mobbin API key?

No. Mobbin MCP has no API key and no auth env var. Authentication is browser OAuth only, completed by the operator. The API-key Bearer model in Mobbin's docs belongs to the separate Team and Enterprise REST API, which this packet never touches. The manual's `env` stays empty.

### Why do no `mobbin.*` tools resolve in Code Mode?

The `mobbin` manual is registered, but manuals load at Code Mode startup, so a session opened before the registration cannot see it. Operator OAuth is still pending too. Reconnect Code Mode in a fresh session and run the doctor script. When the doctor reports the manual missing, the registration broke and the operator owns the fix.

### How do I research a flow or a website section?

Each dedicated case has its own tool:

- `search_flows` takes one flow per query and returns ordered per-screen previews with `actions[]` and `screen_count`
- `search_sections` takes one website section per query and returns `site_name` with section images

Anything else runs over `search_screens` as a query intent, including element research.

### Can this packet change my files or the manual?

No. It is a transport with `mutatesWorkspace: false`. The Write and Edit tools are never available. Neither is Task. `.utcp_config.json` is never edited, even when the registration breaks. Auth state under `~/.mcp-auth` is operator-owned and never touched.

---

## 7. VERIFICATION

The live-call checks need a paid account and operator OAuth. A SKIP with a documented blocker is a valid result for those.

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-mobbin/README.md` prints `✅ VALID` and `Total issues: 0` |
| Skill package | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-tooling/mcp-mobbin --check` prints `Result: PASS` and exits 0 |
| Runtime and manual | `bash .skilled/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` exits 0 with `OK    Posture verified: runtime ready, manual registered` |
| Wiring state | `bash .skilled/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` prints `OK    'mobbin' manual registered in .utcp_config.json` and the bridge shape. The doctor is report-only, so read its WARN and ERR lines |
| Endpoint reachability | `MOBBIN_DOCTOR_LIVE=1 bash .skilled/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports HTTP 401 on a healthy unauthenticated network, the documented challenge rather than a missing key |
| Callable confirmation | In Code Mode, `tool_info({ tool_name: "mobbin.mobbin_search_screens" })` returns a schema. Discovery works before OAuth |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and references |
| [`ROUTER.md#3-machine-router`](./ROUTER.md#3-machine-router) | Machine router: intent map, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Verify-only setup: the registered wiring state, the paid-plan gate and the operator-only OAuth step |
| [`references/tool-surface.md`](./references/tool-surface.md) | The three-tool contract, the intent workflows, plan gating, the rate limit and the open questions |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The registered manual, the `mcp-remote` bridge, OAuth, DCR, PKCE and discovery |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Full failure-mode table |
| [`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json) | The dated pre-auth discovery fixture the callable baseline comes from |
| [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md) | The registered manual's reference shape and the post-registration checklist |
| [`scripts/README.md`](./scripts/README.md) | The verify-only posture check and the report-only diagnostics, with the output each one prints |
| [`examples/README.md`](./examples/README.md) | Worked Code Mode walkthroughs: a smoke search, a platform-filtered flow pass and an element intent |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory across the intent domains |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation scenarios (read-only, SKIP allowed for OAuth-gated steps) |
| [`mcp-servers/mobbin-mcp/README.md`](./mcp-servers/mobbin-mcp/README.md) | The hosted server pointer: the `mcp-remote` bridge, discovery, auth and plan posture |
| [Skills Library](../../README.txt) | The skill catalog and routing front door |
