---
title: "Bladebro Browser Lanes"
description: "The owned agent-browser default and the operator-requested real-browser rb lanes: auto, clone, profile and attach, plus pause, resume, off and forget, with macOS guidance, pinned to v4.8.2."
trigger_phrases:
  - "bladebro browser lanes"
  - "bladebro real browser"
importance_tier: normal
contextType: reference
version: 1.1.0.0
---

# Bladebro Browser Lanes

Which browser Bladebro drives, and the consent each lane needs. Every entry is upstream documentation pinned to v4.8.2 and read 2026-11-21. All lanes expose the same five tools.

---

## 1. OVERVIEW

### Purpose

Names the lane to pick and the gate in front of it, so an agent never reaches a signed-in profile by default.

### When to Use

Load this file when a request names a real browser, a signed-in profile, `rb`, attach, clone or a caller-owned browser.

### Core Principle

The agent browser is the default. Every real-browser lane runs only on an explicit operator request, after the operator has chosen the profile and account.

---

## 2. AGENT BROWSER (DEFAULT)

Bladebro owns this browser and its dedicated profile. State can persist across orderly shutdowns.

- Isolate a task from ordinary Bladebro data with a separate `BLADE_HOME` set before the CLI or MCP server starts.
- Request an ephemeral profile with `BLADE_FRESH=1`.
- Prefer this lane wherever stealth or a signed-in session is not required.

---

## 3. REAL-BROWSER LANES (`rb`, EXPLICIT REQUEST ONLY)

```sh
bladebro rb use          # select the browser install (rb use <id>, or --binary <path>)
bladebro rb profile      # select the profile (rb profile <key>)
bladebro rb status       # show the selection and live state (--json for machine output)
bladebro rb on           # switch to the real-browser lane
```

The real-browser lane uses the operator's Chromium-family binary and selected profile, runs on the operator's display, and turns off the driver's page injection layer. Page perception, refs and actions stay available.

| Lane | What Bladebro does | Guidance |
|---|---|---|
| `auto` (default `rb` lane) | Attaches to a live, reachable debug endpoint, otherwise imports and uses a clone | Fine on macOS |
| `clone` | Imports the profile into a Bladebro-owned copy that refreshes when the real browser writes newer logins, cookies or storage; the source stays open and untouched | Preferred on macOS |
| `profile` | Launches on the live profile; the browser must be closed first | Never on a live branded Chrome 136+, which refuses remote debugging on its default data directory |
| `attach` | Connects to an existing debug endpoint; the browser stays caller-owned and open when Bladebro detaches | Use whenever the browser must remain open |

The upstream table labels these values `rb mode`. Confirm the exact selection command with `bladebro help rb` on the installed binary before using it.

`bladebro rb refresh` forces a re-import of a clone. `bladebro rb forget` removes the imported copy.

---

## 4. PAUSE AND SWITCH BACK

```sh
bladebro rb pause    # block input, navigation, downloads, collection and tab operations
bladebro rb resume   # re-enable input
bladebro rb off      # return to the agent browser
```

Reads, waits and eval stay available while paused, so the operator can take control and the agent can still observe. Gate every mutation in a signed-in profile behind this pair. The CLI restarts its daemon on a lane change; MCP picks the change up on its next use.

---

## 5. CONSENT CHECKLIST

Before handing control to an `rb` lane:

1. The operator asked for a real-browser lane in this request.
2. The operator chose the profile and account.
3. For a stealth run, the operator confirmed the target site's terms of service and access rules.
4. Only one writer acts on that account or profile.
5. Detection output is captured fresh, with cookie and credential values redacted.

A `blocked:` verdict ends the task. Report it and stop.

---

## 6. RELATED RESOURCES

- [`cli-reference.md`](./cli-reference.md): the tools each lane exposes.
- [`install-and-verify.md`](./install-and-verify.md): the probe order for the agent and real-browser lanes.
- Upstream `docs/browser-modes.md` at `https://github.com/dondai44423/bladebro`.
