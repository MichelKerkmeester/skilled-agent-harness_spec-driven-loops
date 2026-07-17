---
title: mcp-refero
description: Read-only Refero MCP transport for the mcp-tooling hub, searching real shipped UI (styles, screens, flows) through Code Mode as design-reference evidence, with sk-design as the mandatory judgment partner.
trigger_phrases:
  - "refero"
  - "refero mcp"
  - "design reference"
  - "ui reference search"
  - "real app screens"
version: 1.0.0.0
---

# mcp-refero

> Search Refero's library of real shipped UI (styles, screens, flows) from your agent through Code Mode, as read-only design-reference evidence. The transport never decides taste: `sk-design` does.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Searching Refero for design references: visual styles for direction, real app screens for UI patterns, and user flows for multi-step journeys, plus verifying the Code Mode wiring and auth expectations |
| **Invoke with** | "refero", "refero mcp", "design reference", "ui reference search", "real app screens", or auto-routing on Refero keywords |
| **Works on** | The remote Refero MCP at `api.refero.design/mcp`, bridged by `npx mcp-remote` through the `refero` manual already registered in this repo's Code Mode. Needs a Refero **Pro** (or higher) plan and operator authentication; the Free plan has no MCP access |
| **Produces** | Cited reference evidence: style records and full style references, screen metadata and screenshots, ordered flow steps, all returned to the requesting workflow (usually an `sk-design` mode) |

---

## 2. OVERVIEW

### Why This Skill Exists

Refero indexes a large library of real shipped UI (150,000+ app screens and 6,000+ user flows per its official repository) and exposes it through a paid, read-only MCP. Reaching it from a coding agent without a contract is risky in specific, documented ways. The callable names double their prefix inside Code Mode (`refero.refero_refero_<tool>`), a detail two independent research lineages got wrong by derivation and only live evidence settled, so discovery confirmation is mandatory. Access is plan-gated: the Free tier has no MCP at all, and unauthenticated calls return HTTP 401, so an agent that guesses will burn a round trip and then misreport the failure. Stale extractions of an older tool surface still circulate (four-tool lists, `_tool` names, numeric screen IDs, `limit`/`offset` paging), and calling them fails. And the biggest risk is not technical: search results look authoritative, and an agent will happily treat a top-ranked reference as a design verdict. This packet wraps the wiring, the eight-tool contract, the funnel discipline, and the hard boundary that judgment belongs to `sk-design`, so the agent always knows what it can call, what it can claim, and what it must hand off.

### What It Does

The packet is a **TRANSPORT** under the `mcp-tooling` hub (`packetKind: transport`, `mutatesWorkspace: false`). It verifies the existing `refero` Code Mode manual, discovers and confirms the live callables, and runs the read-only research funnel: styles first for visual direction, screens for concrete UI patterns, flows for journeys, with metadata-first ordering and images last. Every read happens against the external Refero service; nothing in this repo changes, and Write, Edit, and Task are forbidden tools. Whenever the retrieved evidence feeds a design decision, `sk-design` is loaded first and owns the judgment: this packet supplies IDs, metadata, images, and source-backed facts, and its output can never satisfy a taste, accessibility, or readiness gate by itself.

This is the hub's second transport, a simpler peer of `mcp-figma`: MCP-only, read-only-only, no CLI machinery, no mutating or destructive gating taxonomy, because the provider surface itself is read-only.

---

## 3. QUICK START

> Examples below are illustrative. The callable names must be confirmed live with `tool_info` before use, and live calls need an authenticated Pro (or higher) account.

**Step 1: Verify the wiring (read-only).**

```bash
bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh
# Confirms node/npx, the 'refero' manual in .utcp_config.json (grep only, never edited),
# and prints the auth expectations. REFERO_DOCTOR_LIVE=1 adds one unauthenticated
# endpoint probe (expected: HTTP 401, because access requires auth).
```

**Step 2: Discover and confirm the callables (mandatory).**

```typescript
// Inside Code Mode. Discovery names appear dotted; callables use the DOUBLED prefix.
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
// Fail closed if the eight documented tools are missing, renamed, or expanded.
```

**Step 3: Run the funnel, styles first, metadata first.**

```typescript
call_tool_chain({
  code: `
    const styles = refero.refero_refero_search_styles({
      query: "editorial monochrome saas landing page",
      response_format: "json"
    });
    const list = styles.records || [];
    const full = refero.refero_refero_get_style({ style_id: list[0].uuid, response_format: "json" });
    return { count: list.length, first: list[0]?.url, full };
  `
});
```

**Step 4: Hand the evidence to the judgment owner.**

Any design-affecting use routes through `sk-design`, which collapses the evidence to one declared critique reference. Cite styles by `record.url` and screens by `record.refero_url`.

---

## 4. HOW IT WORKS

### The Eight-Tool Surface

Refero exposes eight read-only tools across three layers. Styles (`refero_search_styles`, `refero_get_style`) carry visual direction and cover web marketing/product pages only. Screens (`refero_search_screens`, `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image`) carry concrete UI patterns for web and iOS. Flows (`refero_search_flows`, `refero_get_flow`) carry multi-step journeys with ordered step goals, actions, and system responses. Styles and screens use UUID strings; flows use numeric IDs; the two typings are never interchangeable. "Apps" and "elements" are query facets inspected through `site` and `ui_elements` metadata, not tool families. Full contract: [`references/tool-surface.md`](./references/tool-surface.md).

### The Doubled-Prefix Callable

Code Mode names calls `{manual}.{manual}_{tool}`. Because every Refero tool is already named `refero_*`, the callable form doubles the prefix: `refero.refero_refero_search_styles(...)`. Live discovery on 2026-07-16 (`references/discovery-fixture-2026-07-16.json`) settled the research record's naming conflict: all eight tools listed pre-auth under the dotted doubled registry names `refero.refero.refero_<tool>`, and the fixture's `Access as:` line confirms the doubled TS callable. The rule stays discovery-first: re-confirm the exact callable with `tool_info` per session, and fail closed on drift. Calls run synchronously inside the `call_tool_chain` body, with no top-level `await`.

### Wiring And Authentication

The `refero` manual is already registered in `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`, stdio, empty env) and is validated as-is: the packet verifies it read-only and never edits it. The `mcp-remote` bridge is HTTP-first (SSE fallback only after a 404) and intentionally unpinned. Authentication is operator-only: the default is a browser OAuth flow whose state persists under `~/.mcp-auth`, and a documented env-backed Bearer header exists as an alternative that never enters the base manual. An unauthenticated probe observes HTTP 401; end-to-end OAuth through this bridge is Inferred, not verified, and the packet reports it that way. Plan gating is hard: Free has no MCP access at all, Pro carries 8,000 tool calls per month, and no finer-grained rate or retry contract is published, so the packet never invents one.

### The Judgment Boundary

The transport allows breadth while researching (multiple styles, screens, flows compared through metadata), but design-affecting use is governed by the `sk-design` contract: one declared critique reference, no chooser, no copying, no averaging strong references into a generic middle. A transport response is untrusted reference evidence. Search rank is not taste; similarity is not approval; and no accessibility, responsiveness, or readiness verdict ever comes from this packet.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a user wants Refero evidence: visual styles for a direction, real app screens for a pattern or state, user flows for a journey, or company/domain research through screen and flow metadata, and when the `refero` wiring or its auth expectations need verification. Skip it when the work is the design judgment itself, which belongs to `sk-design` while this packet stays the transport. Skip it for Mobbin-based app research, which is `mcp-mobbin` (a planned future sibling). Skip it for browser automation or previews (`mcp-chrome-devtools`), for Figma work (`mcp-figma`), and for generic app coding (`sk-code`). And never use it to change files: it is a read-only transport that forbids Write, Edit, and Task.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | The mandatory cross-hub judgment pairing. Every design-affecting use loads it first; it owns reference locks, registers, and every taste/accessibility/readiness verdict. This packet is the transport, that skill is the taste. |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{manual}_{tool}` naming, prefixed env vars, discovery, and error-envelope discipline all come from Code Mode. |
| `mcp-figma` | The sibling Figma transport in this hub (CLI-primary with optional MCP). No surface overlap with Refero. |
| `mcp-chrome-devtools` | Browser inspection and preview, never a design-reference search surface. |
| `sk-code` | Owns adapting any resulting design decision into application code, and verifying it. |

---

## 6. TROUBLESHOOTING

> Full symptom/cause/fix detail: [`references/troubleshooting.md`](./references/troubleshooting.md).

| What you see | Why | Fix |
|---|---|---|
| HTTP 401 on any call | The endpoint requires authentication; the empty manual `env` is not anonymous access | Operator-only: complete browser OAuth on a Pro (or higher) account, or wire the documented Bearer alternative. The agent surfaces the step and waits |
| Access denied on a Free account | Free has no MCP access at all (denial, not a reduced tool set) | Report the entitlement denial verbatim and stop |
| `refero.*` tools do not resolve | Manual not loaded at Code Mode startup, or OAuth incomplete | Reconnect Code Mode; verify the manual with `scripts/doctor.sh`; escalate auth to the operator |
| `refero.refero_search_styles` not found | Single-prefix name; the convention doubles the prefix for tools already named `refero_*` | Use `refero.refero_refero_<tool>(...)` and confirm with `tool_info` first |
| `-32000 Connection closed` on every call | Code Mode running on Node 25 (isolated-vm SIGSEGV) | Operator-side: run Code Mode on Node 24 |
| A large detail batch fails | Full styles are ~10-15k chars each | Retry with fewer IDs (3-4 styles per batch) |
| 429 or quota exhaustion | Pro is 8,000 calls/month; no short-window limit is published | Relay the provider's message verbatim; never invent a backoff schedule |

---

## 7. FAQ

**Q: Do I need a paid Refero account?**

A: Yes, for any live call. The Free plan has no MCP access at all, which is an access denial, not a smaller tool list. Pro is the first tier with MCP and carries a published quota of 8,000 tool calls per month.

**Q: Why is the callable prefix doubled?**

A: Code Mode names calls `{manual}.{manual}_{tool}`. The manual is named `refero` and every Refero tool is already named `refero_*`, so the callable becomes `refero.refero_refero_<tool>`. Live registry evidence confirmed this on 2026-07-16 (`references/discovery-fixture-2026-07-16.json`): discovery lists the dotted `refero.refero.refero_<tool>` names, and the doubled TS callable is real. The packet still requires a per-session `tool_info` confirmation before first use because provider surfaces drift.

**Q: Does OAuth work end to end?**

A: Unverified. An unauthenticated probe observed HTTP 401 with OAuth metadata, and the bridge's OAuth machinery is documented upstream, but no operator has completed the flow in this repo's record, so the packet reports end-to-end OAuth as Inferred. Completing it is an operator-only step.

**Q: Can this packet change my files or the Refero config?**

A: No. It is a transport with `mutatesWorkspace: false`: Write, Edit, and Task are forbidden, the `refero` manual in `.utcp_config.json` is validated as-is and never edited, and auth state under `~/.mcp-auth` is operator-owned and never touched.

**Q: How does this relate to `sk-design` and the official Refero Skill?**

A: `sk-design` owns the design judgment and is loaded first for any design-affecting use; this packet only carries the evidence. The official `referodesign/refero_skill` repository is a design methodology skill, a peer of `sk-design`, and this packet deliberately does not vendor or duplicate it.

---

## 8. VERIFICATION

> Live-call checks require an authenticated Pro (or higher) account and are operator-gated; SKIP with a documented blocker is a valid result for those.

| Check | How to run it |
|---|---|
| Skill package | `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-refero --check` reports zero errors |
| SKILL.md frontmatter | `head -8 .opencode/skills/mcp-tooling/mcp-refero/SKILL.md` shows `name: mcp-refero`, a `description`, and `version: 1.1.0.0` |
| Install posture | `bash .opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh` exits 0 (verify-only; nothing installed or modified) |
| Wiring presence | `bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh` reports the `refero` manual registered (read-only grep) |
| Endpoint reachability | `REFERO_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh` reports HTTP 401 (auth required, as documented) |
| Callable confirmation | Inside Code Mode: `tool_info({ tool_name: "refero.refero_refero_search_styles" })` returns a schema — works pre-auth (confirmed 2026-07-16, `references/discovery-fixture-2026-07-16.json`); authenticated CALLS still need operator OAuth |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Verify-only setup: the registered manual, the Pro-plan requirement, and the operator-only OAuth step |
| [`references/tool-surface.md`](./references/tool-surface.md) | The eight-tool contract, ID typing, the research funnel, plan gating, and the deprecated legacy surface |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | The registered manual, the mcp-remote bridge, OAuth/Bearer, the doubled-prefix rule, and discovery |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Full failure-mode table |
| [`assets/utcp-refero-manual.md`](./assets/utcp-refero-manual.md) | The verified manual snapshot and the Bearer alternative, verbatim |
| [`examples/README.md`](./examples/README.md) | Worked Code Mode walkthroughs: the full funnel, a metadata-first lookup, and a screen-image fetch |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory by layer (styles, screens, flows) with one per-tool leaf per documented tool |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation scenarios (read-only, SKIP-allowed for paid/OAuth steps) |
| [Skills Library](../../README.md) | The skill catalog and routing front door |
