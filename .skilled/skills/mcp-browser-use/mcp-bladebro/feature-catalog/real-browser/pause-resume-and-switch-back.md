---
title: "Pause, resume and switch back"
description: "`rb pause` blocks input, navigation, downloads, collection and tab work while reads, waits and eval continue, `rb resume` re-enables input, and `rb off` returns to the agent browser."
trigger_phrases:
  - "pause, resume and switch back"
  - "bladebro rb pause"
  - "bladebro rb resume"
  - "bladebro rb off"
version: 1.0.0.0
---

# Pause, resume and switch back (rb pause, rb resume, rb off)

## 1. OVERVIEW

`rb pause` blocks input, navigation, downloads, collection and tab work while reads, waits and eval continue, `rb resume` re-enables input, and `rb off` returns to the agent browser.

The pair is how an operator takes over a signed-in browser mid-task while the agent keeps observing. The packet gates every mutation in a signed-in profile behind it.

---

## 2. HOW IT WORKS

While paused, input, navigation, history, downloads, collecting and tab operations refuse, and reads, waits and eval stay available. `rb resume` hands the browser back. `rb off` switches the lane off, and the isolated agent browser becomes the default again. The CLI restarts its daemon on a lane change, and a running MCP session relaunches its browser on its next call. `rb off` passed live in both teardown runs. `rb pause` and `rb resume` appear in the upstream documentation and in the installed `bladebro help rb`, and no recorded run exercised them.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | Pause, resume and switch-back behavior |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | The rule to gate mutations behind pause and resume |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/lane-off-and-stop.md` | Manual playbook | Turns the lane off during teardown |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Reference | Documents the pause and resume semantics no run has exercised |

---

## 4. SOURCE METADATA

- Group: Real Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `real-browser/pause-resume-and-switch-back.md`

Related references:
- [attach-mode.md](attach-mode.md) - The working route to a signed-in browser
- [lane-selection-and-status.md](lane-selection-and-status.md) - Turning the lane on
