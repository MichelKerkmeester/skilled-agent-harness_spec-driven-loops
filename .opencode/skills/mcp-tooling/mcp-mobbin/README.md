---
title: mcp-mobbin
description: Search Mobbin's library of real app UI screenshots from your agent as read-only design-research evidence, with sk-design owning every taste verdict.
trigger_phrases:
  - "mobbin"
  - "mobbin mcp"
  - "app design research"
  - "screen examples"
  - "ux flow references"
version: 1.1.0.0
---

# mcp-mobbin

> Search Mobbin's library of real app UI screenshots from your agent as read-only design-research evidence, with `sk-design` owning every taste verdict.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Real-app design references: screens for UI patterns and states, apps for category comparison, flows for step research, elements for component behavior in context, plus the Code Mode wiring state and auth expectations |
| **Invoke with** | "mobbin", "mobbin mcp", "app design research", "screen examples", "ux flow references" or auto-routing on Mobbin keywords |
| **Works on** | The hosted Mobbin MCP at `api.mobbin.com/mcp`, bridged by `npx mcp-remote` through the registered `mobbin` Code Mode manual. Needs a paid plan (Pro or higher, Free has no MCP access) and operator browser OAuth. There is no API key |
| **Produces** | Cited screen evidence: `screens[]` metadata (`app_name`, `mobbin_url`, `image_url`, platform) with ordered inline images and a `failed[]` report, handed to the requesting workflow |

---

## 2. OVERVIEW

### Why This Skill Exists

Mobbin holds one of the largest libraries of real app UI screenshots. It exposes that library through a paid hosted MCP. Reaching it from a coding agent without a written contract is risky in specific, documented ways. Live pre-auth discovery on 2026-07-16 listed exactly three read-only search tools, so an agent that guesses beyond them invents tools that do not exist. The auth model invites a worse guess: there is no API key, only browser OAuth, so a helper that wires a `MOBBIN_API_KEY` env var fabricates a credential path the provider never published. This README records the wiring truth, the three-tool contract, the auth expectations and the boundary that `sk-design` owns every taste verdict.

### What It Does

This packet is a read-only TRANSPORT in the `mcp-tooling` hub (`packetKind: transport`, `mutatesWorkspace: false`). It reports the `mobbin` manual's registration state honestly, carries the registered manual's reference shape, mandates discovery-first callable confirmation before any call and runs the research workflows: intent-shaped queries over `search_screens`, `limit` starting at 5, platform inferred or asked, every reference cited by `mobbin_url` and `failed[]` reported as partial success. Every call happens against the external Mobbin service and nothing in this repo changes: the transport is read-only, never changes a file and never dispatches another agent. Whenever retrieved evidence feeds a design decision, `sk-design` loads first and owns the judgment. This transport supplies metadata and cited images, with every claim sourced from the provider response, Its output never satisfies a taste or readiness gate by itself.

### The Three-Tool Search Surface

Live pre-auth discovery confirmed a bounded read-only surface. Each tool covers one evidence domain. Every session re-confirms the callables with `tool_info` before the first call.

| Tool | What it searches | Notable inputs |
|---|---|---|
| `search_screens` | App and screen research, with element behavior in context | `query`, `platform` (ios or web), `mode` (deep, standard or fast), `limit`, `exclude_screen_ids`, `image_format` |
| `search_flows` | One user flow per query | `platform`, `limit`, `page` up to 20 |
| `search_sections` | One website section per query | `limit`, `page` |

---

## 3. QUICK START

> The examples below are illustrative. The `mobbin` manual is registered and the callables are discovery-confirmed (2026-07-16 fixture). Each session re-confirms them with `tool_info`. Live calls need an authenticated paid account (Pro or higher).

**Step 1: Check the wiring state (read-only).**

```bash
bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
# Confirms node/npx and reports the 'mobbin' manual state in .utcp_config.json (grep only,
# never edited). Manual PRESENCE is the healthy result. ABSENCE reports as an ERROR
# (a broken or reverted registration). MOBBIN_DOCTOR_LIVE=1 adds one unauthenticated
# endpoint probe (expected: HTTP 401, because access requires browser OAuth).
```

**Step 2 (operator): reconnect, authenticate, discover.**

The `mobbin` manual is registered in `.utcp_config.json` (reference shape in [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md)). An operator reconnects Code Mode (manuals load at startup) and completes browser OAuth on a paid account. Then discovery is mandatory:

```typescript
// Inside Code Mode. Callables CONFIRMED by live discovery 2026-07-16 (pre-auth):
//   registry names mobbin.mobbin.{search_screens,search_flows,search_sections}
//   TS callables mobbin.mobbin_search_screens(...) etc.
// Fixture: references/discovery-fixture-2026-07-16.json. Re-confirm per session:
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
// Fail closed if name, schema or tool set drift from the fixture baseline.
```

**Step 3: Run an intent-shaped search.**

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

**Step 4: Hand the evidence to the judgment owner.**

Any design-affecting use routes through `sk-design`. Cite every selected screen by its `mobbin_url` and report `failed[]` entries and missing images as partial success.

---

## 4. HOW IT WORKS

### The Live Three-Tool Surface

Live pre-auth discovery on 2026-07-16 ([`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json)) supersedes the earlier one-public-tool baseline. The registry lists three read-only search tools. The `deep` dispute is resolved: it is a client-settable `mode` input on `search_screens`, where `"deep"` selects the AI-powered relevance pipeline. App and screen research remain query intents over `search_screens`. Element research is another query intent on the same tool. Flows and website sections have their own tools. Only the three tools above exist. Guessing beyond them means inventing tools the provider never shipped. The declared `search_screens` output is `{ query, screens[{id, app_name, mobbin_url, image_url, platform}] }`. The research-documented `index` and `failed[]` fields do not appear in the declared schema, so verify the actual shape on the first authenticated call. Full contract: [`references/tool-surface.md`](./references/tool-surface.md).

### The Registered Wiring State

The provider is a hosted remote server over Streamable HTTP at `api.mobbin.com/mcp`. There is no local package. The official repo is registration metadata only. The local bridge is a `stdio` manual that launches `npx -y mcp-remote https://api.mobbin.com/mcp` with an empty env, drafted byte-identically by two research lineages and now registered in `.utcp_config.json` (2026-07-16, operator-applied verbatim, reference shape in [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md)). Live discovery ran the same day, pre-auth: the Code Mode callable `mobbin.mobbin_search_screens(...)` is confirmed (registry name `mobbin.mobbin.search_screens`, fixture [`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json)) and two additional tools were listed. Per-session `tool_info` re-confirmation before first use stays the rule.

### Authentication Without An API Key

Mobbin MCP auth is browser OAuth only: protected-resource discovery, Dynamic Client Registration (RFC 7591), authorization code with PKCE S256 and the `openid` scope, revocable from Account Settings. A live unauthenticated probe returned HTTP 401 with a `WWW-Authenticate` pointer to the protected-resource metadata. That challenge is the expected shape, not a missing-key error. No static API key exists for MCP. The API-key Bearer model belongs to the separate Team and Enterprise REST API, so the manual `env` stays empty and no `.env` line is ever added. Adapter auth state under `~/.mcp-auth` is operator-owned. End-to-end OAuth through the local bridge is Inferred, not verified. Plan gating is hard: MCP access starts at Pro or higher. Free has no MCP access. The service enforces 60 requests per 60 seconds per user. On HTTP 429, honor `Retry-After` and back off with jitter.

### The Judgment Boundary

The transport allows breadth while researching: apps, screens, flows and intents compared through metadata and images. But design-affecting use is governed by the `sk-design` contract. A transport response is untrusted reference evidence.

- Any design-affecting use loads `sk-design` first.
- The design skill owns intake, mode selection and every verdict on taste, accessibility and readiness.
- Search rank is not taste. An appealing screenshot is not approval.
- Evidence is cited, critiqued through `sk-design` and never copied wholesale.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a user wants Mobbin evidence: real-app screens for a UI pattern or state, app-category comparison, flow research reconstructed from screens or element behavior in context. Reach for it too when the `mobbin` wiring state or its auth expectations need reporting. Skip it when the work is the design judgment itself, which belongs to `sk-design` while this packet stays the transport. Skip it for Refero research (`mcp-refero`, the sibling transport), for Figma work (`mcp-figma`), for browser automation or previews (`mcp-chrome-devtools`) and for generic app coding (`sk-code`). Skip it for Mobbin's documentation search too: `docs.mobbin.com/mcp` is a separate docs-search MCP, not this packet's server. And never use it to change files: it is a read-only transport that never writes or edits files and never runs the Task tool. It never registers or edits the `.utcp_config.json` manual.

### Related Skills

The packet is the hub's third transport. Its closest structural sibling is `mcp-refero`: both are remote-MCP-via-`mcp-remote`, read-only, OAuth-gated design-research transports with no CLI machinery. What separates this packet from Refero is the three-tool surface and the no-API-key auth model.

| Skill | Relationship |
|---|---|
| `sk-design` | The mandatory judgment pairing. Every design-affecting use loads it first. It owns every taste, accessibility and readiness verdict. This packet is the transport, that skill is the taste |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{manual}_{tool}` naming, discovery and error-envelope discipline all come from Code Mode |
| `mcp-refero` | The closest sibling: another remote-MCP-via-`mcp-remote`, read-only, OAuth-gated design-research transport. Refero covers styles, screens and flows with 8 tools. Mobbin covers screens, flows and sections with 3 |
| `mcp-figma` | The hub's original Figma transport (CLI-primary with optional MCP). No surface overlap with Mobbin |
| `mcp-chrome-devtools` | Browser inspection and preview, never a design-reference search surface |
| `sk-code` | Owns adapting any resulting design decision into application code and verifying it |

---

## 6. TROUBLESHOOTING

> Full symptom, cause and fix detail: [`references/troubleshooting.md`](./references/troubleshooting.md).

| What you see | Why | Fix |
|---|---|---|
| No `mobbin.*` tools in Code Mode | The session predates the registration (manuals load at startup), OAuth is incomplete or the registration broke (doctor.sh absence equals ERR) | Reconnect Code Mode in a fresh session. Escalate the OAuth step. A missing manual is escalated to the operator, never re-added from this packet |
| HTTP 401 before authorization | The expected OAuth protected-resource challenge. The empty `env` is not anonymous access | Operator only: complete browser OAuth on a paid account. Never add an API key, none exists |
| Browser or OAuth callback fails | Headless session, blocked callback or timeout | Move to an interactive browser-capable session. No token-paste path exists |
| Callable name mismatch at discovery | Provider or adapter drift since the 2026-07-16 fixture baseline | Use the name `tool_info` returns. Fail closed, save a fresh dated fixture and update the packet |
| HTTP 429 | The 60 requests per 60 seconds per user window was exceeded | Honor `Retry-After`, then back off exponentially with jitter |
| Free account blocked | MCP starts at the Pro plan. Exact denial semantics unverified | State that MCP starts at Pro, relay the provider's message verbatim and never guess semantics |
| Images missing from results | `failed[]` entries or inline-image fidelity through `call_tool_chain` (unverified) | Report partial success honestly. Verify image fidelity at install and never invent an image tool |

---

## 7. FAQ

**Q: Do I need a Mobbin API key?**

A: No, do not create one. Mobbin MCP has no API key and no auth env var. Authentication is browser OAuth only (DCR, PKCE S256, `openid` scope), completed by the operator. The API-key Bearer model you may find in Mobbin's docs belongs to the separate Team and Enterprise REST API, which this packet never touches. The manual's `env` stays empty.

**Q: Why don't any `mobbin.*` tools resolve in Code Mode?**

A: The `mobbin` manual is registered in `.utcp_config.json`, but manuals load at Code Mode startup. A session opened before the registration will not see them. Operator OAuth is still pending. Reconnect Code Mode in a fresh session and complete OAuth. If `doctor.sh` reports the manual missing, the registration broke: escalate to the operator, with the reference shape and the post-registration checklist in `assets/utcp-mobbin-manual.md`.

**Q: Can I search apps, flows or elements directly?**

A: The documented surface has three tools. Use the one that matches the requested evidence:

- `search_screens` for app and screen research, with element behavior in context
- `search_flows` for one user flow per query
- `search_sections` for one website section per query

App and screen research remain query intents over `search_screens`, while flows and website sections use their dedicated tools.

**Q: Does OAuth work end to end?**

A: Unverified. A live unauthenticated probe confirmed the OAuth shape (HTTP 401 with protected-resource metadata, DCR plus PKCE published by the authorization server), but no operator has completed the flow through the local bridge in this repo's record, so the packet reports end-to-end OAuth as Inferred.

**Q: Can this packet change my files or register the manual?**

A: No. It is a transport with `mutatesWorkspace: false`:

- The Write and Edit tools are never available. Neither is the Task tool.
- `.utcp_config.json` is never edited. The registered manual is operator-owned. Even a broken registration is escalated, not repaired.
- Auth state under `~/.mcp-auth` is operator-owned and never touched.

---

## 8. VERIFICATION

> Post-registration and live-call checks require an authenticated paid account and are operator-gated. SKIP with a documented blocker is a valid result for those.

| Check | How to run it |
|---|---|
| Skill package | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check` reports zero errors |
| SKILL.md frontmatter | `head -8 .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` shows `name: mcp-mobbin`, a `description` and `version: 1.0.0.0` |
| Wiring state | `bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports `OK 'mobbin' manual registered` plus the bridge shape (absence would be ERR) |
| Install posture | `bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` verifies Node 18 or newer, npx and the registered manual, then points at the operator-only OAuth step |
| Endpoint reachability | `MOBBIN_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports HTTP 401 (auth required, as documented) |
| Callable confirmation | In a fresh Code Mode session: `tool_info({ tool_name: "mobbin.mobbin_search_screens" })` returns a schema (requires operator OAuth on a paid account) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and references |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Verify-only setup: the registered wiring state, the paid-plan gate and the operator-only OAuth step |
| [`references/tool-surface.md`](./references/tool-surface.md) | The three-tool contract, the intent workflows, plan gating, rate limit and the open questions |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The registered manual, the mcp-remote bridge, OAuth, DCR, PKCE, inferred naming and discovery |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Full failure-mode table |
| [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md) | The registered manual's reference shape and the post-registration checklist (doc-side executed, live items pending) |
| [`examples/README.md`](./examples/README.md) | Worked Code Mode walkthroughs: smoke search, platform-filtered flow research, element intent |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory: three tools across the supported query-intent domains |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation scenarios (read-only, SKIP allowed for registration and OAuth-gated steps) |
| [Skills Library](../../README.md) | The skill catalog and routing front door |
