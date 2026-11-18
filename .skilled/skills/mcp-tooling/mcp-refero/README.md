---
title: mcp-refero
description: "Search real shipped UI as design-reference evidence: visual styles, screen patterns, user flows and the metadata behind them, read-only through Code Mode, pairing with sk-design-md-generator for a measured Style Reference (extracted design tokens)."
trigger_phrases:
  - "refero"
  - "refero mcp"
  - "design reference"
  - "ui reference search"
  - "real app screens"
version: 1.1.9.0
---

# mcp-refero

> Find real shipped app screens, visual styles and user flows as cited design evidence, read-only from your agent.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Visual styles for a direction, real screens for a UI pattern, flows for a multi-step process and a wiring check |
| **Invoke with** | "refero", "refero mcp", "design reference", "ui reference search", "real app screens" or hub routing on a Refero signal |
| **Works on** | The hosted Refero MCP at `api.refero.design/mcp`, bridged from the registered `refero` manual on a Pro plan or higher |
| **Produces** | Cited style records, screen metadata, screenshots and ordered flow steps, returned to the requesting workflow |

### What It Does

The packet is a read-only transport in the `mcp-tooling` hub, declared `packetKind: transport` with `mutatesWorkspace: false`. It reaches the hosted Refero MCP through Code Mode and searches shipped UI in three layers. Styles answer visual direction. Screens answer a concrete pattern. Flows answer a multi-step process. Start with [the doctor script](./scripts/doctor.sh), confirm the callable with `tool_info` and run the search through `call_tool_chain`. Every read happens against the external service, so nothing in this repo changes.

It returns cited evidence, never a taste verdict. Any design-affecting use pairs `sk-design-md-generator` for a measured Style Reference taken from a live site's real CSS.

### Why This Skill Exists

Refero search results look authoritative, so an agent will treat a top-ranked reference as a design verdict unless the packet says otherwise. The wiring adds two traps. Code Mode doubles the callable prefix. Stale extractions of an older tool surface also circulate with `_tool` names, numeric screen IDs and `limit`/`offset` paging. This packet records the contract, the auth gate and the read-only boundary that stop an agent from guessing.

### The Eight-Tool Surface

| Layer | Tools | What you can operate |
|---|---|---|
| **Styles** | `refero_search_styles`, `refero_get_style` | visual direction from web marketing and product pages |
| **Screens** | `refero_search_screens`, `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image` | concrete UI patterns for web and iOS |
| **Flows** | `refero_search_flows`, `refero_get_flow` | multi-step processes with ordered step goals, actions and system responses |

Styles and screens use UUID strings. Flows use numeric IDs. The two typings never mix. "Apps" and "elements" are query facets read through `site` and `ui_elements` metadata, not tool families. The full contract lives in [the tool-surface reference](./references/tool-surface.md).

---

## 2. QUICK START

The wiring check is read-only. Live calls need a Pro account and operator-completed OAuth.

**Step 1: Check the wiring.**

```bash
bash .skilled/skills/mcp-tooling/mcp-refero/scripts/doctor.sh
```

Expected output: exit 0 with `OK    'refero' manual registered in .utcp_config.json` and `OK    Bridge shape present: npx mcp-remote -> https://api.refero.design/mcp`. A Node runtime of 25 or newer adds a WARN line. The doctor is report-only, so read its WARN and ERR lines.

**Step 2: Confirm the callable.**

```typescript
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" })
```

Expected result: a schema for `refero.refero_refero_search_styles`. Discovery works before OAuth. Fail closed if the eight documented tools are missing, renamed, expanded or otherwise changed.

**Step 3: Run a search, metadata first.**

```typescript
call_tool_chain({
  code: `
    const styles = refero.refero_refero_search_styles({
      query: "editorial monochrome saas landing page",
      response_format: "json"
    })
    const list = styles.records || []
    const full = refero.refero_refero_get_style({ style_id: list[0].uuid, response_format: "json" })
    return { count: list.length, first: list[0]?.url, full }
  `
})
```

Expected result: `{ count, first, full }`, where `count` is the number of style records, `first` is the first style URL and `full` is the full style record. The call runs synchronously in the chain body, with no top-level `await`.

**Step 4: Cite the evidence and pair when needed.**

Cite styles by `record.url` and screens by `record.refero_url`. When the work also needs a measured Style Reference of extracted design tokens, pair `sk-design-md-generator`.

---

## 3. HOW IT WORKS

A request arrives as a design-reference question. The agent reads the wiring state, confirms the callable in the live session and then searches one layer at a time. Metadata is compared before any detail is fetched. A screenshot is the last request. Every record used is cited by its source URL.

```text
┌───────────────────────────────────────┐
│       Design-reference request        │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│   doctor.sh reads the manual state    │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│    tool_info confirms the callable    │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│   styles, then screens, then flows    │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│  cited evidence by url or refero_url  │
└───────────────────────────────────────┘
```

### The Research Funnel

Styles come first because they carry visual direction. Search three to five semantic angles, compare the metadata and fetch `refero_get_style` only for shortlisted UUIDs. Full styles run about 10-15k characters each, so keep a batch to 3-4. Screens follow for a concrete pattern, with the required `platform` of `web` or `ios`. Flows come last for a multi-step process. `related_queries` widens a sparse result. When a flow is reconstructed from screens, the packet labels it inference.

A screenshot is the last step. `thumbnail` comes before `full`. Unknown response fields are preserved because the provider says fields can grow.

### The Doubled-Prefix Callable

Code Mode names a call `{manual}.{manual}_{tool}`. The manual is `refero` and every Refero tool is already named `refero_*`, so the callable doubles the prefix: `refero.refero_refero_search_styles(...)`. The dotted discovery name is `refero.refero.refero_<tool>`.

The 2026-07-16 discovery fixture records all eight tools under those dotted names, listed before OAuth. The fixture records the surface as it stood on that date, so discovery stays a per-session step. Confirm the exact callable with `tool_info` before first use and fail closed on catalog drift.

### Wiring And Authentication

The `refero` manual is already registered in `.utcp_config.json`. It launches `npx -y mcp-remote https://api.refero.design/mcp` over stdio with an empty `env`. Code Mode owns that process. Verify the entry read-only and never edit it. The bridge is HTTP-first with SSE fallback only after a 404. `mcp-remote` stays unpinned.

Authentication is operator-only. First use opens browser OAuth with a localhost callback on port 3334 by default and a 30-second timeout, then keeps the state under `~/.mcp-auth`. A documented Bearer header exists as an alternative in [the manual asset](./assets/utcp-refero-manual.md) and never enters the base manual. An unauthenticated call returns HTTP 401. End-to-end OAuth through this bridge is Inferred, so the packet reports it that way.

Plan gating is hard. The Free plan has no MCP access. Pro carries 8,000 tool calls per month. No short-window limit or retry contract is published. Code Mode must run on Node 24. On Node 25 and newer the doctor warns that `call_tool_chain` is known to crash, because isolated-vm has no Node 25 build.

### The Judgment Boundary

Breadth is fine while you research. Compare several records and their metadata before you narrow. Design-affecting use is different. It pairs `sk-design-md-generator` for a measured Style Reference taken from a live site's real CSS, shows no chooser and copies nothing. Search rank is not taste and similarity is not approval. No taste, accessibility, responsiveness or readiness verdict comes from this packet.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when you want Refero evidence: a visual style for a direction, a real screen for a pattern or state, a flow for a multi-step process or company and domain research through screen and flow metadata. Reach for it too when the `refero` wiring or its auth state needs a read-only report.

Skip it when the work is the design judgment itself. Skip Mobbin research for `mcp-mobbin`, Figma work for `mcp-figma`, browser automation and previews for `mcp-chrome-devtools` and generic app coding for `sk-code`. Never use it to change files. The allowed surface is Read, Bash, Grep, Glob and the Code Mode call.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-md-generator` | The measured-extraction companion. It turns a live website's real CSS into a Style Reference DESIGN.md of named design tokens. This packet retrieves cited shipped-UI evidence. |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{manual}_{tool}` naming, discovery and the error envelope all come from Code Mode. |
| `mcp-mobbin` | The sibling transport for Mobbin research, covering real app screens, flows and website sections. This packet covers web styles, plus screens and flows from web or iOS. |
| `mcp-figma` | Figma Desktop work: component renders, token exports and explicit-path local exports. No surface overlap with Refero. |
| `mcp-chrome-devtools` | Browser inspection and preview, never a design-reference search surface. |
| `sk-code` | Owns adapting a design decision into application code and verifying it. |

---

## 5. TROUBLESHOOTING

> Full symptom, cause and fix detail lives in [the troubleshooting reference](./references/troubleshooting.md).

| What you see | Why | Fix |
|---|---|---|
| HTTP 401 on every call | The endpoint requires authentication. The empty manual `env` is not anonymous access | Operator only: complete browser OAuth on a Pro (or higher) account or wire the documented Bearer alternative. The agent surfaces the step and waits |
| Access denied on a Free account | The Free plan has no MCP access at all, so this is a denial rather than a smaller tool list | Report the entitlement denial verbatim and stop |
| `refero.*` tools do not resolve | The manual ships disabled and has not been registered in this session or OAuth is incomplete | Run the ask step so `register_manual` registers the manual, verify it with the doctor script and escalate auth to the operator |
| `refero.refero_search_styles` not found | A single-prefix name was used. The convention doubles the prefix for tools already named `refero_*` | Use `refero.refero_refero_<tool>(...)` and confirm the exact callable with `tool_info` first |
| `-32000 Connection closed` on every call | Code Mode runs on Node 25 or newer, where isolated-vm has no build and `call_tool_chain` crashes | Operator side: run Code Mode on Node 24 |
| A `get_style` or `get_screen` batch fails | Full styles run about 10-15k characters each, so a large batch is too big | Retry with fewer IDs, 3-4 styles per batch |
| `await is only valid in async functions` | The chain body contains a top-level `await` | Call synchronously inside the body, with no `await` |
| 429 or quota exhaustion | Pro is 8,000 calls per month. No short-window limit is published | Relay the provider's message verbatim. Never invent a backoff schedule |
| Discovery shows missing or extra tools | The provider surface drifted from the documented eight-tool contract | Fail closed, report the drift and stop. A changed surface needs a reviewed packet update |

---

## 6. FAQ

### Do I need a paid Refero account?

Yes, for any live call. The Free plan has no MCP access at all, so the answer is a denial rather than a smaller tool list. Pro is the first tier with MCP and carries a published quota of 8,000 tool calls per month.

### Why is the callable prefix doubled?

Code Mode names a call `{manual}.{manual}_{tool}`. The manual is `refero` and every Refero tool already starts with `refero_`, so the callable is `refero.refero_refero_<tool>`. The dotted name `refero.refero.refero_<tool>` is what discovery returns. The 2026-07-16 fixture records all eight. Confirm the name with `tool_info` in each session, because provider surfaces drift.

### Does OAuth work end to end?

End-to-end OAuth through this bridge is Inferred, not verified. The bridge documents its OAuth flow and an unauthenticated probe returned HTTP 401 with OAuth metadata. Completing that authorization is an operator-only step. The packet never handles the credentials.

### Can this packet change my files or the manual?

No. It is a transport with `mutatesWorkspace: false`. It cannot write or edit files. It cannot dispatch a task. The `refero` manual in `.utcp_config.json` is verified as-is. Auth state under `~/.mcp-auth` is operator-owned and never touched.

### How does this relate to `sk-design-md-generator`?

`sk-design-md-generator` extracts a live website's real CSS into a measured Style Reference of named design tokens. This packet carries shipped-UI reference evidence and hands any design decision to that measurement step. The official Refero skill repository is a design methodology peer of `sk-design-md-generator`. This packet does not vendor it.

---

## 7. VERIFICATION

The live-call checks need a Pro account and operator OAuth. A SKIP with a documented blocker is a valid result for those.

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-refero/README.md` prints `✅ VALID` and `Total issues: 0` |
| Skill package | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-tooling/mcp-refero --check` prints `Result: PASS` |
| Runtime and manual | `bash .skilled/skills/mcp-tooling/mcp-refero/scripts/install.sh` exits 0 with `OK    Posture verified.` |
| Wiring state | `bash .skilled/skills/mcp-tooling/mcp-refero/scripts/doctor.sh` prints `OK    'refero' manual registered in .utcp_config.json` and the bridge shape. The doctor is report-only, so read its WARN and ERR lines |
| Endpoint reachability | `REFERO_DOCTOR_LIVE=1 bash .skilled/skills/mcp-tooling/mcp-refero/scripts/doctor.sh` reports HTTP 401 on a healthy unauthenticated network, the documented auth requirement |
| Callable confirmation | In Code Mode, `tool_info({ tool_name: "refero.refero_refero_search_styles" })` returns a schema. Discovery works before OAuth |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and references |
| [`ROUTER.md#3-machine-router`](./ROUTER.md#3-machine-router) | Machine router: intent map, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Verify-only setup: the registered manual, the Pro-plan requirement and the operator-only OAuth step |
| [`references/tool-surface.md`](./references/tool-surface.md) | The eight-tool contract, ID typing, the research funnel and plan gating |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The registered manual, the `mcp-remote` bridge, OAuth and Bearer auth, naming and discovery |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Full failure-mode table |
| [`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json) | The dated pre-auth discovery fixture the callable baseline comes from |
| [`assets/utcp-refero-manual.md`](./assets/utcp-refero-manual.md) | The verified manual snapshot and the Bearer alternative, verbatim |
| [`examples/README.md`](./examples/README.md) | Worked Code Mode walkthroughs: the full funnel, a metadata-first lookup and a screen-image fetch |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory by layer, with one leaf per documented tool |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation scenarios, with SKIP allowed for paid or OAuth-gated steps |
| [`scripts/README.md`](./scripts/README.md) | What each helper script checks and the output it prints |
| [`mcp-servers/refero-mcp/README.md`](./mcp-servers/refero-mcp/README.md) | The remote server registration: the bridge, discovery, auth and plan posture |
| [Skills Library](../../README.txt) | The skill catalog and routing front door |
