---
title: "Clone mode"
description: "`clone` imports the selected profile into a Bladebro-owned copy that refreshes from the real browser, which can stay open and is never written to."
trigger_phrases:
  - "clone mode"
  - "bladebro rb mode clone"
  - "bladebro rb on clone"
  - "bladebro rb refresh"
version: 1.0.0.0
---

# Clone mode (rb mode clone)

## 1. OVERVIEW

`clone` imports the selected profile into a Bladebro-owned copy that refreshes from the real browser, which can stay open and is never written to.

The packet names `clone` as the preferred macOS mechanism, and `auto` falls back to it when no debug endpoint is live. The recorded runs show the import working and the reads failing with the Aside browser binary, so on that binary this mechanism is not a working route today.

---

## 2. HOW IT WORKS

### Core Behavior

On the first launch after `rb on`, Bladebro imports the selected profile into its own copy and reports the lane `ON`. `rb status` then reads `ACTIVE` with the clone up to date. The copy refreshes automatically when the real browser writes newer logins, cookies or storage. `rb refresh` forces a re-import, and `rb forget` wipes the imported copy.

### Recorded Results

Both recorded runs used the Aside browser binary and a staged, cookie-only copy of a signed-in Aside profile. The import and the lane switch passed. Every read on the lane then exited 1 with `Chrome launch failed: no page target available`, first on example.com and later on a signed-in site, and neither run retried. The first run's launch log showed DevTools listening while Aside's built-in extensions failed to reach Aside's local service.

### Edge Cases

Clone mode with a stock Chrome or Chromium binary and a fresh profile has no recorded run, so the records cannot yet separate an Aside binary limit from a Bladebro defect. `BLADE_RB_DEBUG=1` surfaces the browser's own stderr on a launch failure. Attach mode is the route that worked against a signed-in Aside.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | The `clone` mechanism, `rb refresh` and `rb forget` |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The macOS lane guidance |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/lane-on-clone.md` | Manual playbook | Turns the lane on in clone mode |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/real-mode-reads.md` | Manual playbook | Reads and an eval on the cloned lane |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded import, failed reads and the launch log |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md` | Benchmark | The same failure on a signed-in target |

---

## 4. SOURCE METADATA

- Group: Real Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `real-browser/clone-mode.md`

Related references:
- [lane-selection-and-status.md](lane-selection-and-status.md) - Choosing the mechanism
- [attach-mode.md](attach-mode.md) - The mechanism that passed where this one failed
