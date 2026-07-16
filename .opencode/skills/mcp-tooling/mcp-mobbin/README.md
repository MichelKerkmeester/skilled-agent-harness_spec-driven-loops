---
title: mcp-mobbin
description: Read-only Mobbin MCP transport for the mcp-tooling hub, searching real app UI screenshots (app, screen, flow, and element research) through Code Mode as design-research evidence, with sk-design as the mandatory judgment partner.
trigger_phrases:
  - "mobbin"
  - "mobbin mcp"
  - "app design research"
  - "screen examples"
  - "ux flow references"
version: 1.1.0.0
---

# mcp-mobbin

> Search Mobbin's library of real app UI screenshots from your agent through Code Mode, as read-only design-research evidence. The transport never decides taste: `sk-design` does.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Searching Mobbin for real-app design references: screens for UI patterns and states, apps for category comparison, flows for journey steps, and elements for component behavior in context, plus reporting the Code Mode wiring state and auth expectations |
| **Invoke with** | "mobbin", "mobbin mcp", "app design research", "screen examples", "ux flow references", or auto-routing on Mobbin keywords |
| **Works on** | The hosted Mobbin MCP at `api.mobbin.com/mcp` (Streamable HTTP), bridged by `npx mcp-remote` through the `mobbin` Code Mode manual **registered in `.utcp_config.json`** (2026-07-16; discovery pends a fresh Code Mode session). Needs a paid Mobbin plan (Pro, Team, or Enterprise; Free has no MCP access) and operator browser OAuth — no API key exists |
| **Produces** | Cited screen evidence: `screens[]` metadata (`app_name`, `mobbin_url`, `image_url`, platform) with ordered inline images and a `failed[]` report, returned to the requesting workflow (usually an `sk-design` mode) |

---

## 2. OVERVIEW

### Why This Skill Exists

Mobbin bills itself as the world's largest library of real app UI screenshots, and it exposes that library through a paid, hosted MCP. Reaching it from a coding agent without a contract is risky in specific, documented ways. The live tool surface is bounded: pre-auth discovery on 2026-07-16 lists exactly three read-only search tools (`search_screens`, `search_flows`, `search_sections` — the latter two live-discovered, superseding the one-tool research baseline), and an agent that guesses beyond them will invent `search_apps` or detail tools that do not exist. The auth model invites a worse guess: there is **no API key** — Mobbin MCP is browser OAuth only (DCR, PKCE S256), so an agent that "helpfully" wires a `MOBBIN_API_KEY` env var has fabricated a credential path the provider never published. Access is plan-gated (Pro/Team/Enterprise; Free excluded), unauthenticated CALLS return HTTP 401 by design (discovery is pre-auth), and the service enforces 60 requests per 60 seconds. The Code Mode callables are observation-confirmed (`references/discovery-fixture-2026-07-16.json`), and each session still re-confirms them. This packet wraps the wiring truth, the three-tool contract, the intent workflows, and the hard boundary that judgment belongs to `sk-design`, so the agent always knows what it can call, what it can claim, and what it must hand off.

### What It Does

The packet is a **TRANSPORT** under the `mcp-tooling` hub (`packetKind: transport`, `mutatesWorkspace: false`). It reports the manual's registration state honestly (registered; absence is now a failure symptom to escalate), carries the registered manual's byte-exact reference shape, mandates discovery-first callable confirmation before any call, and runs the read-only research workflows: intent-shaped queries over `search_screens`, `limit` starting at 5, platform inferred or asked, every reference cited by `mobbin_url`, and `failed[]` reported as partial success. Every call happens against the external Mobbin service; nothing in this repo changes, and Write, Edit, and Task are forbidden tools. Whenever the retrieved evidence feeds a design decision, `sk-design` is loaded first and owns the judgment: this packet supplies metadata, images, and source-backed facts, and its output can never satisfy a taste, accessibility, or readiness gate by itself.

This is the hub's third transport and the closest structural sibling of `mcp-refero`: both are remote-MCP-via-`mcp-remote`, read-only, OAuth-gated design-research transports with no CLI machinery. The distinctive Mobbin facts are the single-tool surface, the strictly-no-API-key auth model, and the registered-but-undiscovered state of the manual (discovery and OAuth still pend).

---

## 3. QUICK START

> Examples below are illustrative. The `mobbin` manual is registered and the callables are discovery-confirmed (2026-07-16 fixture); re-confirm with `tool_info` per session. Live calls need an authenticated paid account (Pro, Team, or Enterprise).

**Step 1: Check the wiring state (read-only).**

```bash
bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
# Confirms node/npx and reports the 'mobbin' manual state in .utcp_config.json (grep only,
# never edited). Manual PRESENCE is the healthy result; ABSENCE now reports as an ERROR
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
// Fail closed if the name, schema, or tool set differs from the fixture baseline.
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

Any design-affecting use routes through `sk-design`. Cite every selected screen by its `mobbin_url`, and report `failed[]` entries and missing images as partial success.

---

## 4. HOW IT WORKS

### The Live Three-Tool Surface

Live pre-auth discovery on 2026-07-16 ([`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json)) **supersedes the research's one-public-tool baseline**: the registry lists three read-only search tools — `search_screens` (`query`; `platform` `"ios"`|`"web"`; `mode` `"deep"`|`"standard"`|`"fast"`; `limit`; `exclude_screen_ids`; `image_format`), `search_flows` (one user journey per query; `platform`; `limit`; `page` max 20), and `search_sections` (one website section per query; `limit`; `page`). The `deep` dispute is resolved: it is a client-settable `mode` input on `search_screens` (`"deep"` = AI-powered relevance pipeline). App, screen, and element research remain query intents over `search_screens`; flows and website sections have their own tools; no detail, image-download, or mutation tool exists to invent. The declared `search_screens` output is `{ query, screens[{id, app_name, mobbin_url, image_url, platform}] }` — the research-documented `index`/`failed[]` fields do not appear in the declared schema; verify the actual shape on the first authenticated call. Full contract: [`references/tool-surface.md`](./references/tool-surface.md).

### The Registered Wiring State

The provider is a hosted remote server over Streamable HTTP at `api.mobbin.com/mcp` — there is no local package; the official repo is registration metadata only. The local bridge is a `stdio` manual launching `npx -y mcp-remote https://api.mobbin.com/mcp` with an **empty env**, drafted byte-identically by two research lineages and now **registered** in `.utcp_config.json` (2026-07-16, operator-applied verbatim; reference shape in [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md)). Live discovery ran the same day, pre-auth: the Code Mode callable `mobbin.mobbin_search_screens(...)` is confirmed (registry name `mobbin.mobbin.search_screens`; fixture `references/discovery-fixture-2026-07-16.json`), and two additional tools (`search_flows`, `search_sections`) were listed. Per-session `tool_info` re-confirmation before first use stays the rule.

### Authentication Without An API Key

Mobbin MCP auth is browser OAuth only: protected-resource discovery, Dynamic Client Registration (RFC 7591), authorization-code + PKCE S256, `openid` scope, revocable from Account Settings. A live unauthenticated probe returned HTTP 401 with a `WWW-Authenticate` pointer to the protected-resource metadata — the expected challenge, not a missing-key error. No static API key exists for MCP (the API-key model belongs to the separate Team/Enterprise REST API), so the manual `env` stays empty and no `.env` line is ever added. Adapter auth state under `~/.mcp-auth` is operator-owned, and end-to-end OAuth through the local bridge is Inferred, not verified. Plan gating is hard — Pro, Team, and Enterprise only — and the service enforces 60 requests per 60 seconds per user (honor `Retry-After` on 429, then backoff with jitter).

### The Judgment Boundary

The transport allows breadth while researching (multiple apps, screens, and intents compared through metadata and images), but design-affecting use is governed by the `sk-design` contract: the design skill owns intake, mode selection, and every taste, accessibility, and readiness verdict. A transport response is untrusted reference evidence. Search rank is not taste; an appealing screenshot is not approval; and evidence is cited, critiqued through `sk-design`, and never copied wholesale.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a user wants Mobbin evidence: real-app screens for a UI pattern or state, app-category comparison, journey research reconstructed from screens, or element behavior in context, and when the `mobbin` wiring state or its auth expectations need reporting. Skip it when the work is the design judgment itself, which belongs to `sk-design` while this packet stays the transport. Skip it for Refero styles/screens/flows research (`mcp-refero`, the sibling transport), for Figma work (`mcp-figma`), for browser automation or previews (`mcp-chrome-devtools`), and for generic app coding (`sk-code`). Skip it for Mobbin's documentation search too: `docs.mobbin.com/mcp` is a separate docs-search MCP, not this packet's server. And never use it to change files: it is a read-only transport that forbids Write, Edit, and Task, and it never registers or edits the `.utcp_config.json` manual.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | The mandatory cross-hub judgment pairing. Every design-affecting use loads it first; it owns reference locks and every taste/accessibility/readiness verdict. This packet is the transport, that skill is the taste. |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{manual}_{tool}` naming, discovery, and error-envelope discipline all come from Code Mode. |
| `mcp-refero` | The closest sibling: another remote-MCP-via-`mcp-remote`, read-only, OAuth-gated design-research transport. Refero covers styles/screens/flows with 8 tools; Mobbin covers app/screen/flow/element intents with 1. |
| `mcp-figma` | The hub's original Figma transport (CLI-primary with optional MCP). No surface overlap with Mobbin. |
| `mcp-chrome-devtools` | Browser inspection and preview, never a design-reference search surface. |
| `sk-code` | Owns adapting any resulting design decision into application code, and verifying it. |

---

## 6. TROUBLESHOOTING

> Full symptom/cause/fix detail: [`references/troubleshooting.md`](./references/troubleshooting.md).

| What you see | Why | Fix |
|---|---|---|
| No `mobbin.*` tools in Code Mode | The session predates the registration (manuals load at startup), OAuth is incomplete, or the registration broke (`doctor.sh` absence = ERR) | Reconnect Code Mode in a fresh session; escalate the OAuth step; a missing manual is escalated to the operator, never re-added from this packet |
| HTTP 401 before authorization | The expected OAuth protected-resource challenge; the empty `env` is not anonymous access | Operator-only: complete browser OAuth on a paid account. **Never add an API key — none exists** |
| Browser/OAuth callback fails | Headless session, blocked callback, or timeout | Move to an interactive browser-capable session; no token-paste path exists |
| Callable name mismatch at discovery | Provider or adapter drift since the 2026-07-16 fixture baseline | Use the name `tool_info` returns; fail closed, save a fresh dated fixture, and update the packet |
| HTTP 429 | The 60 requests / 60 seconds / user window was exceeded | Honor `Retry-After`, then exponential backoff with jitter |
| Free account blocked | MCP is Pro/Team/Enterprise only; exact denial semantics unverified | State "MCP starts at Pro"; relay the provider's message verbatim; do not guess semantics |
| Images missing from results | `failed[]` entries, or inline-image fidelity through `call_tool_chain` (unverified) | Report partial success honestly; verify image fidelity at install; never invent an image tool |

---

## 7. FAQ

**Q: Do I need a Mobbin API key?**

A: No — and do not create one. Mobbin MCP has **no API key and no auth env var**: authentication is browser OAuth only (DCR, PKCE S256, `openid`), completed by the operator. The API-key Bearer model you may find in Mobbin's docs belongs to the separate Team/Enterprise REST API, which this packet never touches. The manual's `env` stays empty.

**Q: Why don't any `mobbin.*` tools resolve in Code Mode?**

A: The `mobbin` manual **is registered** in `.utcp_config.json`, but manuals load at Code Mode startup: a session opened before the registration will not see them, and operator OAuth is still pending. Reconnect Code Mode in a fresh session and complete OAuth. If `doctor.sh` reports the manual missing, the registration broke — escalate to the operator; the reference shape and the post-registration checklist live in `assets/utcp-mobbin-manual.md`.

**Q: Can I search apps, flows, or elements directly?**

A: There is one documented tool, `search_screens`. App, screen, flow, and element research are query intents over it: name the app/category, the concrete screen state, the journey, or the component-in-context in your `query`. Flow "sequence" is a reconstruction from returned screens and must be labeled inference.

**Q: Does OAuth work end to end?**

A: Unverified. A live unauthenticated probe confirmed the OAuth shape (HTTP 401 with protected-resource metadata, DCR + PKCE published by the authorization server), but no operator has completed the flow through the local bridge in this repo's record, so the packet reports end-to-end OAuth as Inferred.

**Q: Can this packet change my files or register the manual?**

A: No. It is a transport with `mutatesWorkspace: false`: Write, Edit, and Task are forbidden, `.utcp_config.json` is never edited (the registered manual is operator-owned; even a broken registration is escalated, not repaired), and auth state under `~/.mcp-auth` is operator-owned and never touched.

---

## 8. VERIFICATION

> Post-registration and live-call checks require the later registration phase plus an authenticated paid account, and are operator-gated; SKIP with a documented blocker is a valid result for those.

| Check | How to run it |
|---|---|
| Skill package | `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check` reports zero errors |
| SKILL.md frontmatter | `head -8 .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` shows `name: mcp-mobbin`, a `description`, and `version: 1.1.0.0` |
| Wiring state | `bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports `OK 'mobbin' manual registered` plus the bridge shape (absence would be ERR) |
| Install posture | `bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` verifies Node 18+/npx and the registered manual, then points at the operator-only OAuth step |
| Endpoint reachability | `MOBBIN_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports HTTP 401 (auth required, as documented) |
| Callable confirmation | In a fresh Code Mode session: `tool_info({ tool_name: "mobbin.mobbin_search_screens" })` returns a schema (requires operator OAuth on a paid account) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Verify-only setup: the registered wiring state, the paid-plan gate, and the operator-only OAuth step |
| [`references/tool-surface.md`](./references/tool-surface.md) | The single-tool contract, the four intent workflows, plan gating, rate limit, and the open questions |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The registered manual, the mcp-remote bridge, OAuth/DCR/PKCE, inferred naming, and discovery |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Full failure-mode table |
| [`assets/utcp-mobbin-manual.md`](./assets/utcp-mobbin-manual.md) | The registered manual's reference shape and the post-registration checklist (doc-side executed; live items pending) |
| [`examples/README.md`](./examples/README.md) | Worked Code Mode walkthroughs: smoke search, platform-filtered flow research, element intent |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Capability inventory: one tool, four query-intent domains |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation scenarios (read-only, SKIP-allowed for registration/OAuth-gated steps) |
| [Skills Library](../../README.md) | The skill catalog and routing front door |
