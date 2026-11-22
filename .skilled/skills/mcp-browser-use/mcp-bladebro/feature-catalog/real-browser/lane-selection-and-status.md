---
title: "Lane selection and status"
description: "`rb use`, `rb profile` and `rb mode` choose the browser, the profile and the mechanism, and `rb status` shows the selection, all on explicit operator request only."
trigger_phrases:
  - "lane selection and status"
  - "bladebro rb status"
  - "bladebro rb use"
  - "bladebro rb mode"
version: 1.0.0.0
---

# Lane selection and status (rb use, rb profile, rb mode, rb status)

## 1. OVERVIEW

`rb use`, `rb profile` and `rb mode` choose the browser, the profile and the mechanism, and `rb status` shows the selection, all on explicit operator request only.

The real-browser lane drives the operator's own Chromium-family browser and profile on the operator's display, with Bladebro's page injection layer switched off. Page perception, refs and actions stay available. Because the profile can be signed in, nothing in this lane runs until the operator asks for it and picks the browser and profile.

---

## 2. HOW IT WORKS

### Selection

`rb use` lists the browser installs and `rb use <id>` picks one. `rb use --binary <path>` sets a custom binary, and `--binary auto` clears it. `rb profile` lists profiles, `rb profile <key>` picks one, an absolute profile path also works, and `auto` resets to the most recently used profile. `rb mode` takes `auto`, `clone`, `profile` or `attach`. `rb on` switches the lane on, and the CLI restarts its daemon on a lane change.

### Mechanisms

`auto`, the default, attaches to a live debug endpoint when one is reachable and otherwise clones. `clone` works from a Bladebro-owned copy of the profile. `profile` launches on the live profile, needs the browser closed, and is never used on a live branded Chrome 136 or later, which refuses remote debugging on its default data directory. `attach` drives a running browser that already exposes a debug endpoint.

### Status

`rb status` prints the lane state, such as `STANDBY` before the lane turns on and `ACTIVE` after, plus the binary, profile and mechanism, and `--json` gives the same as one object. In the recorded run the status labeled the browser `Google Chrome (Chrome)` even while an Aside binary override was set.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | The `rb` commands, mechanisms and macOS guidance |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The lane table and the explicit-request rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/lane-status-and-selection.md` | Manual playbook | Selects binary, profile and `clone`, then reads the status |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded selection commands and status output |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md` | Benchmark | Second recorded selection on a signed-in target |

---

## 4. SOURCE METADATA

- Group: Real Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `real-browser/lane-selection-and-status.md`

Related references:
- [clone-mode.md](clone-mode.md) - The mechanism selected in the recorded runs
- [attach-mode.md](attach-mode.md) - The mechanism that passed on macOS
