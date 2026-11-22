---
title: "Lighthouse and Performance Trace (MCP)"
description: "lighthouse_audit scores accessibility, SEO and best practices but excludes performance; Core Web Vitals and load timing come from the performance trace tools. Both run only in the MCP lane through Code Mode."
trigger_phrases:
  - "lighthouse audit"
  - "performance trace"
  - "core web vitals"
version: 1.0.1.0
---

# Lighthouse and Performance Trace (MCP)

---

## 1. OVERVIEW

The Chrome DevTools MCP serves two audit families, and they answer different questions. `lighthouse_audit` returns Lighthouse scores, the failing audits and the DOM nodes they flag for accessibility, SEO, best practices and agentic browsing, and saves the full report to disk. It excludes performance. A performance question, such as Core Web Vitals or load timing, goes to the trace tools: `performance_start_trace`, `performance_stop_trace` and `performance_analyze_insight`.

Both families run in the MCP lane only. The `bdg` CLI ships no Lighthouse command, so a Lighthouse or trace request uses Code Mode even when `bdg` is installed.

---

## 2. HOW IT WORKS

Call the tools through `call_tool_chain()` with the manual namespace, for example `chrome_devtools_1.chrome_devtools_1_lighthouse_audit({ ... })`. Confirm each name with `list_tools()` or `tool_info()` before the first call, because the exposed tool set changes between releases and this leaf freezes no count.

- **Lighthouse audit.** Open the page with `new_page`, run `lighthouse_audit`, then read the scores and the flagged nodes. Read the saved report for the full audit list.
- **Performance trace.** Start `performance_start_trace`, load or interact with the page, stop with `performance_stop_trace`, then pass a named insight from the result to `performance_analyze_insight`.
- **Cleanup.** Close the pages the program opened in a `finally` block, as the session-cleanup leaf describes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` | MCP | Lane choice: the CLI first, the MCP for capabilities the CLI does not ship |
| `assets/utcp-chrome-devtools-manuals.md` | Config | Registered `chrome_devtools_1`, `chrome_devtools_2` and `chrome_devtools_live` manuals |
| `../mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | Evidence | A `list_tools()` snapshot that lists `lighthouse_audit` and the three trace tools |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `../manual-testing-playbook/hub-routing/lighthouse-performance-audit.md` | Manual playbook | Routing only: MT-013 proves a Lighthouse request reaches this mode. No scenario runs the audit or a trace yet |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-parallel-instances/lighthouse-and-performance-trace.md`
Related references:
- [code-mode-invocation.md](../../feature-catalog/mcp-parallel-instances/code-mode-invocation.md): Code Mode Invocation
- [session-cleanup.md](../../feature-catalog/mcp-parallel-instances/session-cleanup.md): Session Cleanup (MCP)
