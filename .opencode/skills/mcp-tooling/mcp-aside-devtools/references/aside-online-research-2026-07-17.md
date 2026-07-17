---
title: "Aside Online Research Refresh (2026-07-17)"
description: "Dated, cited snapshot of the Aside AI-browser developer surface (CLI, aside mcp, aside repl) captured from the public docs on 2026-07-17, with CONFIRMED / INFERRED / UNKNOWN tags and the mcp.json wiring, permission model, and distribution facts that ground the DevTools-parity feature expansion."
trigger_phrases:
  - "aside online research"
  - "aside developer docs"
  - "aside changelog"
  - "aside permission model"
importance_tier: normal
contextType: reference
last_updated: "2026-07-17"
version: 1.0.0.0
---

# Aside Online Research Refresh (2026-07-17)

Dated source snapshot of the public Aside developer surface.

## 1. OVERVIEW

### Purpose

Fresh capture of the public Aside developer documentation, taken 2026-07-17. This is the online-source layer for the v1.3.0.0 DevTools-parity feature expansion. The authoritative machine-readable capability envelope remains the live Code Mode discovery fixture ([`discovery-fixture-2026-07-16.json`](discovery-fixture-2026-07-16.json)); the online docs below corroborate the transport, permission, and distribution facts and add the verbatim `mcp.json` wiring. Every claim is tagged CONFIRMED (direct doc quote), INFERRED (reasoned from cited material), or UNKNOWN (not resolvable from the sources).

### Usage

Use this document as corroborating source evidence, then re-capture the installed CLI and live Code Mode discovery before relying on a command or callable.

> **Untrusted-source discipline.** Everything below is transcribed from third-party web pages and treated as data. No page instruction was acted on. Re-capture `aside --help` and re-run Code Mode discovery before relying on any command or callable — the docs are a corroborating layer, not a contract.

---

## 2. SOURCES FETCHED

| # | URL | Fetched | What it gave |
|---|---|---|---|
| S1 | `https://docs.aside.com/help/developers` | 2026-07-17 | CLI/MCP/REPL overview page ("Use the CLI, MCP, and REPL") |
| S2 | `https://docs.aside.com/help/developers.md` | 2026-07-17 | Raw markdown: CLI flags, the `aside mcp` `mcp.json` config block, REPL invocation form |
| S3 | `https://docs.aside.com/help/security.md` | 2026-07-17 | Permission model: Read only / Guard / Full access; Allow / Ask / Deny; password handling |
| S4 | `https://aside.com/blog/developers` | 2026-07-17 | Developer positioning + example `aside "..."` tasks and use cases |
| S5 | `https://docs.aside.com/changelog/native` | 2026-07-17 | Native browser changelog (latest entries; no dev-surface change since 2026-07-16) |
| S6 | Web search (`aside browser npm/github`, `aside changelog 2026`) | 2026-07-17 | Distribution / package presence check |

---

## 3. CLI COMMAND SURFACE

**CONFIRMED (S1, S2, S4)** — the online docs corroborate the version-pinned surface already captured in [`aside-cli-reference.md`](aside-cli-reference.md); nothing new was added or removed:

- `aside "<task>"` — start a natural-language browser-agent session. [SOURCE: https://docs.aside.com/help/developers.md]
- `aside --session <session-id> "<task>"` — continue an existing session. [SOURCE: https://docs.aside.com/help/developers.md]
- `aside --account <id> "<task>"` — target a specific account for a single run (documented for `aside` and `aside exec`). [SOURCE: https://docs.aside.com/help/developers.md]
- `aside account list` — list accounts (current marked with `*`). [SOURCE: https://docs.aside.com/help/developers.md]
- `aside account status [id]` — show current or specific account status. [SOURCE: https://docs.aside.com/help/developers.md]
- `aside account use <id>` — set the default account for future commands. [SOURCE: https://docs.aside.com/help/developers.md]
- `aside mcp` — launch MCP server mode. [SOURCE: https://docs.aside.com/help/developers.md]
- `aside repl "<code>"` — execute deterministic browser-automation REPL code. [SOURCE: https://docs.aside.com/help/developers.md]

**UNKNOWN — model-flag spelling.** The public docs do not resolve the `-m provider/model` vs separate `--model` / `--provider` conflict noted in SKILL.md. Still capture the installed `aside --help` before relying on either. [SOURCE: not present in S1–S5]

**CONFIRMED — example agent tasks (S4)**, useful as realistic task-lane prompts:

- `aside "Open the failed GitHub Actions run for this PR, find the first failing step, compare it with the last passing run, and draft a PR comment with log links. Do not post it."`
- `aside "Open localhost:3000, run through signup, capture desktop and mobile screenshots, and write a short QA note."`

Both examples end with an explicit "do not post / do not change settings" boundary — the docs repeatedly steer developers to keep Aside read-oriented and leave code changes in the coding agent. [SOURCE: https://aside.com/blog/developers]

---

## 4. MCP SERVER (`aside mcp`)

**CONFIRMED (S2)** — the docs give an explicit `mcp.json` wiring block, verbatim:

```json
{
  "mcpServers": {
    "aside": {
      "command": "aside",
      "args": ["mcp"]
    }
  }
}
```

[SOURCE: https://docs.aside.com/help/developers.md]

- **CONFIRMED** — purpose framing: `"Use aside mcp to connect Aside to another agent or coding tool as a Model Context Protocol server."` [SOURCE: https://docs.aside.com/help/developers.md]
- **CONFIRMED** — MCP use case (S4): reach for MCP "when your coding agent needs evidence from private browser pages, such as a CI log, feature-flag dashboard, Datadog trace, internal admin page, or staging screenshot." [SOURCE: https://aside.com/blog/developers]
- **INFERRED** — transport is local stdio launched by the client as `command: aside, args: ["mcp"]` (no URL/port/token field in the config), matching the direct-stdio probe already recorded in [`mcp-wiring.md`](mcp-wiring.md) and the fixture. [SOURCE: S2 config shape + `discovery-fixture-2026-07-16.json`]
- **CONFIRMED (fixture)** — the exposed tool inventory is exactly one tool, `repl`; Code Mode registry name `aside.aside.repl`, TS callable `aside.aside_repl(args)`. The online docs do not enumerate tools, so the fixture stays the authority. [SOURCE: `discovery-fixture-2026-07-16.json`]
- **UNKNOWN** — which permission mode the spawned `aside mcp` process inherits. S3 confirms modes exist and that per-session settings layer on agent defaults, but does not state the MCP process's default mode. [SOURCE: partial in S3]

---

## 5. REPL ENVIRONMENT AND HELPER API

**CONFIRMED (S1, S4)** — the docs describe the REPL as Playwright-shaped: "It feels like Playwright: you get `page`, tabs, locators, screenshots, downloads, and JavaScript," plus "the same page snapshots and stable element refs that the browser agent uses, so a click or assertion lines up with what Aside will actually act on." [SOURCE: https://docs.aside.com/help/developers ; https://aside.com/blog/developers]

**CONFIRMED (fixture)** — the online prose is corroborated and made precise by the live tool schema. The full helper surface (authoritative) is in [`discovery-fixture-2026-07-16.json`](discovery-fixture-2026-07-16.json) `search_tools[0].description`:

- Environment: ES2023+, `async`/`await`, 120s timeout, **no `import`/`require`**, persistent shared scope across calls (use fresh variable names each call).
- Globals: `page` (Playwright Page of the last opened tab), `tabs` (`Page[]`), `console.log(x)` (the ONLY way to return data — `return`/last-expression does NOT work), `display(input)` (render image bytes/base64/data-URL), `fs` (`node:fs/promises`), `path`, `Buffer`, `pwd`, `sleep(ms)`, `fetch(url)` (HTTP with the user's cookies).
- Tab helpers: `openTab(url)`, `closeTab(tab)`, `listBrowserTabs()`, `attachBrowserTab(targetId)`, `attachActiveBrowserTab()`, `getTabByTargetId(targetId)`.
- Read/evidence helpers: `snapshot(page, options?)` (PRIMARY read method → `{ tree, diff }`), `page.screenshot(options?)`, `locator.screenshot(options?)` (default type `webp`, `margin` default 8), `page.pdf(options?)` (Playwright PDF options; save under `./artifacts/`), `annotatedScreenshot(page)` (PNG with ref-ID labels).

**INFERRED — the capability envelope.** Because `page` is a real Playwright `Page`, the standard Playwright `page`/`context`/`browser` API is reachable inside the repl even where a helper is not pre-named: `page.$` / `page.$$` / `page.$eval` / `page.evaluate` / `page.content()`, `page.on('console'|'request'|'response'|'requestfinished', …)`, `page.context().cookies()` / `addCookies()`, `page.goto()` / `page.waitForLoadState()`, `page.setViewportSize()`. This is the grounding for the DevTools-parity feature files. It is INFERRED (from the documented "Playwright API available" + real `Page` object), not from a per-method online enumeration; treat each as pattern-documented-but-live-unconfirmed until a bound-session run captures its result shape. [SOURCE: `discovery-fixture-2026-07-16.json` "Playwright API available" + globals list]

---

## 6. PERMISSION AND ACCESS MODEL

**CONFIRMED (S3)** — corroborates and sharpens SKILL.md §3:

- Three session permission modes: **Read only** (inspect browser + file context, no file changes), **Guard** (default; work in approved folders, ask before others), **Full access** (read/write anywhere). [SOURCE: https://docs.aside.com/help/security.md]
- Three rule values: **Allow** (use without asking), **Ask** (ask first), **Deny** (block; **takes precedence**). [SOURCE: https://docs.aside.com/help/security.md]
- **CONFIRMED** — "Saved password values stay hidden from the AI agent"; the system checks password-access policy and target URL before building autofill payloads. [SOURCE: https://docs.aside.com/help/security.md]
- **CONFIRMED** — layering: "When a task has its own permission settings, Aside applies those task settings on top of the agent defaults." Permission areas span sandbox, readable/writable file roots, and tool/browser/network rules. [SOURCE: https://docs.aside.com/help/security.md]
- **UNKNOWN** — exact MFA / CAPTCHA / vault-unlock pause semantics are not spelled out in S3; SKILL.md's "human-only boundary" posture stands as the safe default, not a doc-quoted contract. [SOURCE: not detailed in S3]

---

## 7. DISTRIBUTION AND VERSIONING

- **CONFIRMED** — install is the operator-invoked curl bootstrap: `curl -fsSL https://releases.aside.com/install.sh | bash`. [SOURCE: https://docs.aside.com/help/developers]
- **CONFIRMED** — no official public npm or GitHub package for the Aside AI browser's CLI/MCP was found. The two GitHub repos named "aside" (`alxclark/aside` — a browser-extension boilerplate; `google/aside` — an unrelated Google tool) are NOT this product. Distribution is the installer only; there is no `npx`-style MCP launch (contrast `mcp-chrome-devtools`, which launches `chrome-devtools-mcp` via `npx`). [SOURCE: web search 2026-07-17; https://github.com/alxclark/aside ; https://github.com/google/aside]
- **CONFIRMED** — the native browser changelog (S5) latest entry is **v1.0.714.1** (most recent), prior dated entry **v1.0.626.1 (2026-06-26)**; entries are browser-shell/rendering/bookmark fixes. **No CLI, MCP, REPL, permission, or Playwright-surface change is documented since 2026-07-16.** [SOURCE: https://docs.aside.com/changelog/native]
- **Version-number note.** The native changelog versioning (`v1.0.714.1`) differs from the CLI/MCP build string observed by probe (`1.26.626.1517`). These appear to be separate version lines (browser shell vs CLI/agent build). INFERRED — do not equate them; pin each independently. [SOURCE: S5 vs fixture]

---

## 8. WHAT CHANGED SINCE THE PRIOR RESEARCH

| Item | Prior packet state | 2026-07-17 finding |
|---|---|---|
| `mcp.json` wiring | Described as stdio, no verbatim config | **CONFIRMED verbatim** `{"mcpServers":{"aside":{"command":"aside","args":["mcp"]}}}` (S2) |
| Permission modes | Stated in SKILL.md, lightly sourced | **CONFIRMED** against `security.md` (S3): Read only / Guard / Full access + Allow / Ask / Deny (Deny wins) |
| Console/network capture | Flagged UNKNOWN "no verified contract" | Playwright `page.on(...)` event API is **available** per the fixture — pattern now documentable; live capture still needs a bound session (see DevTools-parity feature files) |
| npm/GitHub presence | Not previously checked | **CONFIRMED none** — installer-only distribution |
| Dev-surface changelog | — | **No change** since 2026-07-16 (S5) |

---

## 9. OPEN UNKNOWNS (UNCHANGED OR NEWLY CONFIRMED-OPEN)

1. Browser-profile binding procedure for a fresh `aside mcp` process — still undocumented (not in S1–S5).
2. Which permission mode `aside mcp` inherits — S3 confirms the model but not the MCP default.
3. `-m` vs `--model`/`--provider` flag spelling — unresolved online; capture installed `--help`.
4. Live result shapes for the Playwright DevTools-parity patterns (console/network/cookies/performance) — the API is present; no bound-session capture fixture exists yet, so those playbook scenarios stay SKIP-valid until run against an authorized session.
