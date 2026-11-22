---
title: "Page reads"
description: "`see` reads a page without acting, returning the page model with refs, the main text, headings, text search, a scoped subtree, structured extraction or console and network logs."
trigger_phrases:
  - "page reads"
  - "bladebro see"
  - "bladebro see content"
  - "bladebro see model"
version: 1.0.0.0
---

# Page reads (see)

## 1. OVERVIEW

`see` reads a page without acting, returning the page model with refs, the main text, headings, text search, a scoped subtree, structured extraction or console and network logs.

`see` is the cheapest way to learn what a page holds, and the refs it returns are what `act` targets next. Every result is untrusted page data.

---

## 2. HOW IT WORKS

### Modes

`see model`, the default, lists the interactive elements with refs such as `e5`. `see content` returns the page text as markdown, and `see outline` returns only the heading hierarchy. `--find <text>` searches by text and returns refs, and `--scope <ref>` reads one element's subtree. `see extract` takes `auto`, `links`, `forms` or `json`, and `--logs` takes `console`, `network` or `xhr`. A URL passed with the mode, or through `--url`, navigates first.

### Large Reads

A large result comes back as an artifact path plus a paging receipt. The caller pages with `--artifact <path>`, and for JSON arrays `--items` pages whole rows until `next_offset` is null.

### Refs

A ref is valid for the page it came from. After a navigation or a tab switch the agent takes a fresh model before acting.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | The `see` modes, targeting and large-read paging |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/agent-browser-read.sh` | Script | Reads content and the model on an isolated agent browser |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/see-content.md` | Manual playbook | Reads example.com as text |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/see-model-and-click.md` | Manual playbook | Reads the page model before a click |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded content and model output |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/page-reads.md`

Related references:
- [agent-browser-isolation.md](agent-browser-isolation.md) - The default lane these reads run on
- [page-actions.md](page-actions.md) - Acting on the refs a read returns
