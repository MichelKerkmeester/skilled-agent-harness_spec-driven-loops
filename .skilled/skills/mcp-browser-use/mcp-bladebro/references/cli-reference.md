---
title: "Bladebro CLI Reference"
description: "The five Bladebro tools, their CLI shortcuts, the CLI output envelope and exit codes, and the environment settings that change launch behavior, pinned to v4.8.2."
trigger_phrases:
  - "bladebro cli reference"
  - "bladebro five tools"
importance_tier: normal
contextType: reference
version: 1.1.0.0
---

# Bladebro CLI Reference

The command surface for the CLI lane. Every entry is upstream documentation pinned to v4.8.2 and read 2026-11-21. Re-check each flag against `bladebro help --json` on the installed binary before relying on it.

---

## 1. OVERVIEW

### Purpose

Gives the agent the tool, the action and the output shape to expect, so a CLI run can be checked by exit code and envelope rather than by reading prose.

### When to Use

Load this file when the hub selected `mcp-bladebro` and the lane rule chose the CLI, or when a Code Mode call needs the same action vocabulary.

### Core Principle

The CLI and MCP share the same five handlers. Learning the actions here covers both transports; only the envelope differs.

---

## 2. THE FIVE TOOLS

| Tool | What it does | CLI example |
|---|---|---|
| `act` | Navigate, click, type, fill, select, press, read a control, hover, scroll, wait, upload, download, pdf, `collect`, `paginate`, `batch` | `bladebro act click --text 'Continue'` |
| `see` | Page model with element refs (`model`, the default), main text (`content`), headings (`outline`), `find`, `scope`, `extract` (`auto`, `links`, `forms`, `json`), `changes`, `logs` (`console`, `network`, `xhr`) | `bladebro see model --json` |
| `state` | Tabs, cookies, web storage, named sessions (`save`, `load`), resource blocking, output compression | `bladebro state tabs` |
| `run` | A plan with reads, actions, branches and bounded loops in one call | `bladebro run @steps.json` |
| `vision` | A PNG, optionally marked with element refs | `bladebro vision --marks --json` |

### Targeting and Refs

Target a control by ref (such as `e5`), selector, label, text or coordinates. Take a fresh ref after navigation or a tab switch. When several controls match equally, Bladebro returns the candidates; pick by ref, a unique selector or a one-based `nth`. Open shadow roots are covered by selector matching.

### Plans

A `run` plan validates every static step before the first effect, including unchosen branches. It accepts up to 1,000 static steps and 32 nesting levels. A `while` needs a test and a step array and runs at most 100 iterations. Completed actions stay in effect if a later step stops. Use `act batch` for a straight sequence and `run` for conditions and loops. For MCP, wrap the array in a `steps` field.

### Large Reads

Large results come back as an artifact path plus a paging receipt. Page with `see artifact="<path>"`. For JSON arrays, `items: true` pages whole rows; follow `next_offset` until it is null.

---

## 3. CLI RESULTS AND LIFETIME

- The CLI runs a persistent daemon by default. `--no-daemon` runs one command with its own browser.
- With `--json`, stdout holds one object with `ok`, `is_error` and `text`, plus `image_path` for a saved screenshot. Logs go to stderr.
- Exit codes: 0 success, 1 execution failure, 2 usage error.
- `bladebro stop` shuts down the owned daemon and browser. A running daemon keeps its launch settings, so stop it after changing configuration.
- An accepted click or submit dispatches once. If a disconnect leaves a mutation's outcome unknown, inspect the destination before sending another action.

---

## 4. CONFIGURATION

Set environment variables on the Bladebro process. For the CLI, set them before the daemon starts; for MCP, set them in the server entry.

| Setting | Effect |
|---|---|
| `BLADE_HOME` | Override the whole data root: daemon state, artifacts, sessions and profiles |
| `BLADE_FRESH=1` | Use an ephemeral browser profile |
| `BLADE_PROFILE_DIR` | Override the owned profile directory |
| `CHROME_PATH` | Select a Chrome or Chromium executable |
| `BLADE_LANE=real` | Select the real-browser lane for this process (an `rb` lane: R-SEC-1 applies) |
| `BLADE_CONSENT` | `reject` (default), `accept` or `off` for recognized consent dialogs |
| `BLADE_NO_UPDATE_CHECK=1` | Skip update checks |

The default data root on macOS and Linux is `~/.local/state/blade`, or a previously used `~/.blade`. `bladebro doctor` prints the path that resolved. Keep it private: it can hold cookies, session snapshots and page artifacts.

---

## 5. RELATED RESOURCES

- [`browser-lanes.md`](./browser-lanes.md): which browser the commands act on.
- [`mcp-wiring.md`](./mcp-wiring.md): the same tools through Code Mode.
- [`install-and-verify.md`](./install-and-verify.md): detection, pin check and rollback.
- Upstream `docs/tools.md` and `docs/configuration.md` at `https://github.com/dondai44423/bladebro`.
