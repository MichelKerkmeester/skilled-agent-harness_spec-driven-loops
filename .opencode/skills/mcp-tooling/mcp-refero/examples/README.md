---
title: "Refero - Example Walkthroughs"
description: "Worked Code Mode invocation walkthroughs for the three read-only Refero lanes: the styles-screens-flows research funnel, a single-tool metadata-first lookup, and a screenshot fetch, each opening with the mandatory tool_info confirmation."
trigger_phrases:
  - "refero examples"
  - "refero example walkthrough"
  - "refero code mode example"
version: 1.0.0.0
---

# Refero - Example Walkthroughs

> Worked Code Mode invocation walkthroughs covering the read-only lanes of `mcp-refero`: the full styles -> screens -> flows research funnel, a single-tool metadata-first screen lookup, and a screenshot fetch. Every callable uses the doubled-prefix form and every walkthrough opens with the mandatory `tool_info` confirmation.

---

## 1. OVERVIEW

Each walkthrough is a working sequence and an honest capability boundary: it exercises only the eight documented tools from [`references/tool-surface.md`](../references/tool-surface.md), confirms callable names live before relying on them, and marks every OAuth-gated step **SKIP-valid** with the exact command an operator (or a later authenticated run) executes. These are documents, not shell scripts, because every Refero call runs inside Code Mode (`call_tool_chain`), never in a shell.

**Prerequisites for all walkthroughs**: the `refero` manual registered in `.utcp_config.json` (verify with `bash ../scripts/doctor.sh` or `bash ../scripts/install.sh`; read-only, never edited), Code Mode on Node 24, and — for live steps — a Refero **Pro (or higher)** account with operator-completed OAuth. The Free plan has no MCP access at all, so an unauthenticated environment records live steps as SKIP with the auth blocker, never as failures. See [INSTALL-GUIDE.md](../INSTALL-GUIDE.md).

---

## 2. AVAILABLE WALKTHROUGHS

### 2.1 funnel-styles-screens-flows.md

**Purpose:** The full official research funnel — styles first for visual direction, screens for concrete patterns, flows for the journey — with metadata-first ordering held at every layer.

**What it enforces:**
- `tool_info` confirmation of the doubled-prefix callables before any call
- Search -> metadata shortlist -> bounded `get_*` detail, in that order at every layer
- UUID typing for styles/screens, numeric typing for flows; citations by `url` / `refero_url`

---

### 2.2 metadata-first-lookup.md

**Purpose:** A single-tool, metadata-first screen lookup: answer "what do real empty states look like" from search metadata alone, fetching detail only for a justified shortlist.

**What it enforces:**
- One search call answers metadata questions; detail is fetched only for shortlisted UUIDs
- The elements facet (`ui_elements`, `ux_patterns`, `page_types`) replaces the non-existent `search_elements`
- No taste verdict from the transport; design-affecting evidence routes to `sk-design`

---

### 2.3 screen-image-fetch.md

**Purpose:** Fetch a screenshot for one materially relevant screen — image last, `thumbnail` before `full`, and never `response_format` on the image tool.

**What it enforces:**
- Images are the last resort of the funnel, requested only when text cannot answer
- `image_size: "thumbnail"` before `"full"`; `response_format` never passed to `refero_get_screen_image`
- The raw image is used as evidence, never cached into this repo

---

## 3. COMMON PATTERNS

### Confirm before calling (mandatory, every walkthrough)

```typescript
// Inside Code Mode. Discovery names appear dotted: refero.refero.refero_search_styles
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
// Fail closed if the eight documented tools are missing, renamed, or expanded.
```

### SKIP-valid marking for OAuth-gated steps

Live calls need operator-completed OAuth on a Pro (or higher) account. When that precondition is absent, record the step as `SKIP (auth blocker)` together with the exact command that would run — never guess, never touch `~/.mcp-auth`, and never treat the 401 as a bug to fix.

### Synchronous calls, cited evidence

Calls run synchronously inside the `call_tool_chain` body (no top-level `await`). Every retrieved record is cited by its source URL: `record.url` for styles, `record.refero_url` for screens.

---

## 4. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| HTTP 401 on any call | Operator-only auth step — see [`references/troubleshooting.md`](../references/troubleshooting.md); SKIP the live step with the blocker documented |
| `refero.refero_search_styles` not found | Single-prefix name used; the callable doubles the prefix — confirm with `tool_info` first |
| `-32000 Connection closed` on every call | Code Mode on Node 25 (isolated-vm SIGSEGV); run Code Mode on Node 24 |
| Sparse flow results | Broaden the query or reconstruct from screens, reporting the reconstruction as inference |

---

## 5. SEE ALSO

- `../SKILL.md` — the runtime contract and full rule set
- `../references/tool-surface.md` — the eight-tool contract every walkthrough traces to
- `../references/mcp-wiring.md` — the registered manual, discovery, and the doubled-prefix rule
- `../scripts/install.sh` — non-interactive verify-only posture check
- `../scripts/doctor.sh` — read-only diagnostics with the optional gated endpoint probe
