---
title: "mcp-aside-devtools: Feature Catalog"
description: "Unified capability inventory for the mcp-aside-devtools orchestrator: the five router intent domains (task, repl, mcp, install, troubleshoot) mapped over the three lanes — agent-task CLI, deterministic REPL, and the registered Aside MCP manual via Code Mode — with mutation class and UNKNOWN flags per capability."
trigger_phrases:
  - "aside"
  - "aside feature catalog"
  - "aside capabilities"
  - "aside chrome devtools parity"
last_updated: "2026-07-17"
version: 1.1.0.0
---

# mcp-aside-devtools: Feature Catalog

This document is the canonical capability inventory for the `mcp-aside-devtools` skill. The root catalog acts as the system-level directory: it maps the five Smart Router intent domains (TASK, REPL, MCP, INSTALL, TROUBLESHOOT from SKILL.md §2) onto the three lanes the skill routes between — the natural-language agent-task CLI, the deterministic Playwright-compatible REPL, and the Aside MCP server via Code Mode. Every capability below traces to the packet's references, examples, playbook scenarios, or the completed fan-out research; nothing is invented beyond that verified surface.

> **Registration status (read first).** The `aside` UTCP manual **is registered** in `.utcp_config.json` (2026-07-16; snapshot in [`../assets/utcp-aside-manual.md`](../assets/utcp-aside-manual.md)), and the Code Mode callable is **CONFIRMED by live discovery 2026-07-16** ([`../references/discovery-fixture-2026-07-16.json`](../references/discovery-fixture-2026-07-16.json)): registry/discovery name `aside.aside.repl` (dot-separated), TypeScript callable `aside.aside_repl(args)` inside `call_tool_chain`. Per-session rediscovery still precedes first invocation (`tools.listChanged: true`).

> **Verification note.** The CLI command surface and the one-`repl`-tool MCP inventory are version-pinned evidence against `1.26.626.1517` (observed 2026-07-16). Re-capture `aside --help` and re-run `tools/list` before relying on any flag or tool name; `tools.listChanged: true` makes hardcoding a defect.

---

## 1. OVERVIEW

Use this catalog as the inventory for the `mcp-aside-devtools` surface. The numbered sections below group the five intent domains so readers can move from a top-level summary into per-domain detail without losing the lane-routing context.

The capability surface has one hard prerequisite and three lanes. Everything depends on the **installed, signed-in `aside` binary** (macOS Darwin arm64/x64 only; built-in models fail closed when signed out). From there the router picks a lane: outcome-oriented goals go to `aside "<task>"` / `aside exec`; deterministic evidence steps go to `aside repl "<JavaScript>"`; composition with other Code Mode tools goes to the Aside MCP `repl` tool through the registered `aside` manual.

A note on what stays out of scope. This skill never installs or updates the binary implicitly, never registers a second `aside` manual (single-vs-dual manual is an unresolved open question), never invents typed subcommands (`aside navigate/dom/screenshot/console/network` do not exist), and never promises console or network capture — no verified contract exists for either; guarded probes fail closed.

### Capability class

Browser lanes act on live web pages under the signed-in Aside account, so agent-task and REPL capabilities are MUTATING on the browser side (tabs, navigation, form actions) while remaining read-only against this workspace except for operator-directed artifact writes (screenshots, PDFs, fixtures). Diagnostics (`doctor.sh`, account status, MCP handshake probe) are READ-ONLY. UNKNOWN items are flagged inline and stay UNKNOWN until evidence lands.

### Capability areas

| Capability area | Intent role | Key constraint |
|---|---|---|
| Task | Outcome-oriented, multi-step browser-agent goals | Approval/MFA/CAPTCHA pauses are human-only boundaries |
| Repl | Deterministic, evidence-friendly browser steps | Artifacts verified independently (PNG magic bytes) |
| Mcp | Code Mode composition through the registered `aside` manual | Callable confirmed 2026-07-16 (`aside.aside.repl` registry / `aside.aside_repl(args)` TS); re-verify per session |
| Install | Operator-invoked install, verification, diagnostics | Never install or update implicitly |
| Troubleshoot | Failure classification and recovery | PROFILE_UNBOUND is binding state, never auth failure |

---

## 2. TASK

Outcome-oriented browser-agent work: `aside "<task>"` and `aside exec` run natural-language goals under the signed-in account, with `--session <id>` continuation and `--account <id>` selection.

| Feature | One-line description | Class | Canonical invocation |
|---|---|---|---|
| Direct agent task | Natural-language multi-step browser goal under the signed-in account | MUTATING (browser-side) | `aside "<task>"` |
| Session continuation | Continue a prior task's account-scoped state | MUTATING (browser-side) | `aside --session <id> "<task>"` |
| Explicit execution | Task execution with provider/model controls | MUTATING (browser-side) | `aside exec ...` |
| Account selection | Run a direct task under a chosen account | MUTATING (browser-side) | `aside --account <id> "<task>"` |

See [`task/agent-tasks.md`](task/agent-tasks.md) for boundary rules, the pause/resume approval model, and the unresolved model-flag spelling.

---

## 3. REPL

Deterministic proof steps: `aside repl "<JavaScript>"` keeps a persistent Playwright-compatible context for tabs, snapshots, screenshots, and PDFs — the evidence lane.

| Feature | One-line description | Class | Canonical invocation |
|---|---|---|---|
| Deterministic browser steps | Persistent ES2023+/Playwright REPL: `openTab(url)`, `snapshot(page)` | MUTATING (browser-side) | `aside repl "<JavaScript>"` |
| Evidence capture | Screenshot/PDF artifacts verified by PNG magic bytes, not tool response | MUTATING (writes artifacts) | `bash examples/repl-evidence-capture.sh <url> <dir>` |

See [`repl/repl-evidence-capture.md`](repl/repl-evidence-capture.md) for the helper inventory and the independent-artifact-verification rule.

---

## 4. MCP

Code Mode composition: `aside mcp` (local stdio, no credential field) exposes one version-pinned `repl` tool; the registered `aside` manual makes it reachable from `call_tool_chain()` after discovery confirmation.

| Feature | One-line description | Class | Canonical invocation |
|---|---|---|---|
| Stdio handshake + discovery | `initialize` then `tools/list`; one `repl` tool on `1.26.626.1517` | READ-ONLY | `bash examples/mcp-handshake-probe.sh` |
| Code Mode composition | Chain browser work with other Code Mode tools via the registered manual | MUTATING (browser-side) | `aside.aside_repl({ title, code })` — CONFIRMED 2026-07-16 (registry name `aside.aside.repl`; fixture `references/discovery-fixture-2026-07-16.json`) |

See [`mcp/mcp-transport-and-code-mode.md`](mcp/mcp-transport-and-code-mode.md) for the registered-manual state, rediscovery mandate, and binding constraint.

---

## 5. INSTALL

Operator-invoked setup and diagnostics: the official curl installer (macOS-only), the packaged wrapper, and the read-only doctor.

| Feature | One-line description | Class | Canonical invocation |
|---|---|---|---|
| CLI install (operator-invoked) | Official curl bootstrap installer; wrapper adds platform gate + idempotency | MUTATING (host install) | `bash scripts/install.sh` |
| Health diagnostics | Read-only doctor: binary, version, account, MCP handshake, registered manual | READ-ONLY | `bash scripts/doctor.sh` |

See [`install/install-and-doctor.md`](install/install-and-doctor.md) for prerequisites, the preflight fixture discipline, and the never-install-implicitly rule.

---

## 6. TROUBLESHOOT

Failure classification and recovery: distinguishing binding, auth, transport, and daemon failures — and staying honest about what has no verified contract.

| Feature | One-line description | Class | Canonical entry point |
|---|---|---|---|
| Error taxonomy + recovery | PROFILE_UNBOUND vs signed-out vs dead child vs daemon outage | READ-ONLY | `references/troubleshooting.md` |
| Guarded capability probes | Console/network capture probes that fail closed (no verified contract) | READ-ONLY (probe) | Playbook ASD-012 / ASD-013 |

See [`troubleshoot/troubleshooting-recipes.md`](troubleshoot/troubleshooting-recipes.md) for the recovery sequences and the open UNKNOWN items.

---

## 7. DEVTOOLS PARITY

A dedicated family that mirrors the Chrome DevTools capability surface (`mcp-chrome-devtools`) through the one lane Aside actually exposes for structured browser work: the Playwright `page` API inside `aside repl`. The discovery fixture ([`../references/discovery-fixture-2026-07-16.json`](../references/discovery-fixture-2026-07-16.json)) proves `page` is a real Playwright `Page`, so DOM, screenshot, console, network, cookie, storage, performance, and navigation capabilities are all reachable — expressed as Playwright, not as typed `aside dom/console/network` subcommands (which do not exist). Two capabilities have honest gaps: **no native HAR export** (assemble a HAR-equivalent from `page.on` events) and **no built-in Lighthouse audit** (Performance-API timing only; Lighthouse-parity needs external tooling).

| Feature | One-line description | Class | Canonical repl pattern |
|---|---|---|---|
| DOM inspection + JS eval | Query/eval/read structure | READ-ONLY | `page.$eval`, `page.evaluate`, `page.content()`, `snapshot(page)` |
| Screenshots + PDF | Full-page/clip/element capture, print | MUTATING (artifacts) | `page.screenshot({ fullPage })`, `locator.screenshot`, `page.pdf` |
| Console + network capture | Event capture; HAR-equivalent (no native HAR) | READ-ONLY | `page.on('console'\|'request'\|'response', ...)` |
| Cookies + storage | Read/inject cookies, storage keys | READ-ONLY read / MUTATING write | `page.context().cookies()`, `page.evaluate(localStorage)` |
| Performance timing | Navigation/paint metrics (no Lighthouse) | READ-ONLY | `page.evaluate(performance.getEntriesByType(...))` |
| Navigation + multi-tab | Open/attach/navigate/enumerate (no parallel isolation) | MUTATING (browser-side) | `openTab`, `attachActiveBrowserTab`, `page.goto`, `tabs` |

See [`devtools-parity/dom-inspection.md`](devtools-parity/dom-inspection.md), [`devtools-parity/screenshots-and-pdf.md`](devtools-parity/screenshots-and-pdf.md), [`devtools-parity/console-and-network-capture.md`](devtools-parity/console-and-network-capture.md), [`devtools-parity/cookies-and-storage.md`](devtools-parity/cookies-and-storage.md), [`devtools-parity/performance-timing.md`](devtools-parity/performance-timing.md), and [`devtools-parity/navigation-and-tabs.md`](devtools-parity/navigation-and-tabs.md).

### Chrome DevTools capability -> Aside repl pattern

Maps each DevTools capability domain to its Aside repl pattern and confidence status. `confirmed` = grounded in the fixture's Playwright API + online research; `skip-valid` = pattern documented, live run needs a bound authorized session; `gap` = no Aside equivalent.

| DevTools capability | Aside repl pattern | New file(s) | Status |
|---|---|---|---|
| DOM query / Elements panel | `page.$` / `page.$$` / `page.$eval` / `snapshot(page)` | `devtools-parity/dom-inspection.md` · ASD-016 | confirmed / skip-valid |
| Console eval | `page.evaluate(() => ...)` | `devtools-parity/dom-inspection.md` · ASD-016 | confirmed / skip-valid |
| Screenshot (full/clip/element) | `page.screenshot` / `locator.screenshot` | `devtools-parity/screenshots-and-pdf.md` · ASD-017 | confirmed |
| Print to PDF | `page.pdf({ format })` | `devtools-parity/screenshots-and-pdf.md` · ASD-017 | confirmed |
| Console capture | `page.on('console', ...)` | `devtools-parity/console-and-network-capture.md` · ASD-018 | skip-valid (needs bound session) |
| Network capture | `page.on('request'\|'response'\|'requestfinished', ...)` | `devtools-parity/console-and-network-capture.md` · ASD-018 | skip-valid (needs bound session) |
| HAR export | assemble HAR-equivalent from events | `devtools-parity/console-and-network-capture.md` | **gap — no native HAR** |
| Cookies (read/inject) | `page.context().cookies()` / `addCookies()` | `devtools-parity/cookies-and-storage.md` · ASD-019 | confirmed / skip-valid |
| Web storage | `page.evaluate(() => localStorage/sessionStorage)` | `devtools-parity/cookies-and-storage.md` · ASD-019 | confirmed / skip-valid |
| Performance timing | `page.evaluate(performance.getEntriesByType(...))` | `devtools-parity/performance-timing.md` · ASD-020 | confirmed / skip-valid |
| Lighthouse audit | none — external tooling required | `devtools-parity/performance-timing.md` | **gap — no Lighthouse** |
| Navigate / page lifecycle | `page.goto` / `page.waitForLoadState` | `devtools-parity/navigation-and-tabs.md` · ASD-021 | confirmed / skip-valid |
| Multi-tab (single session) | `openTab` / `attachBrowserTab` / `tabs` | `devtools-parity/navigation-and-tabs.md` · ASD-021 | confirmed / skip-valid |
| Parallel isolated instances | none — single manual, single writer | `devtools-parity/navigation-and-tabs.md` | **gap — no isolation** |
| Viewport emulation | `page.setViewportSize(...)` | `devtools-parity/navigation-and-tabs.md` | confirmed (inferred) |
| Raw CDP domain access | none — Playwright API only, no CDP passthrough | — | **gap — no CDP parity** |

---

## 8. CAPABILITY COUNT SUMMARY

The five intent domains each map to one per-feature file; the DevTools-parity family adds six capability leaves that mirror the Chrome DevTools surface through the repl.

| Section | Area | Capabilities | Per-feature file(s) |
|---|---|---|---|
| 2 | Task | 4 | `task/agent-tasks.md` |
| 3 | Repl | 2 | `repl/repl-evidence-capture.md` |
| 4 | Mcp | 2 | `mcp/mcp-transport-and-code-mode.md` |
| 5 | Install | 2 | `install/install-and-doctor.md` |
| 6 | Troubleshoot | 2 | `troubleshoot/troubleshooting-recipes.md` |
| 7 | DevTools Parity | 6 | `devtools-parity/` (6 leaves) |
| **Total** | **5 intents + parity** | **18 capabilities** | **11 per-feature files** |

> The subcommand surface is exactly `account`, `exec`, `repl`, `mcp` plus the top-level task form — nothing else may be invented. Open UNKNOWNs that stay flagged: the browser-profile binding procedure, the permission mode `aside mcp` inherits, and the `-m` vs `--model`/`--provider` flag spelling. Honest capability gaps (no native HAR export, no Lighthouse audit, no parallel isolation, no raw-CDP passthrough) are documented in the DevTools-parity family rather than papered over. The five intent domains keep one file each; the DevTools-parity family holds the Playwright-API mirror of the Chrome DevTools surface.
