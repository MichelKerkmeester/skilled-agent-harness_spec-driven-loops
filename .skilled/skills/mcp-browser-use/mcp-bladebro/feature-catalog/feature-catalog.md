---
title: "mcp-bladebro: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the mcp-bladebro mode: the CLI and MCP transports, the agent browser, the real-browser lanes, install and health, and the limits and safety gates."
trigger_phrases:
  - "mcp-bladebro"
  - "bladebro feature catalog"
  - "bladebro capabilities"
  - "feature catalog"
last_updated: "2026-11-22"
version: 1.0.1.0
---

# mcp-bladebro: Feature Catalog

This document combines the current feature inventory for the `mcp-bladebro` mode of the `mcp-browser-use` hub into a single reference. The root catalog acts as the mode's directory: it summarizes each capability area, describes what Bladebro does today, and points to the per-feature files that carry the source and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `mcp-bladebro` surface. The numbered sections below group the mode by capability area, so a reader can move from a top-level summary into a per-feature file without losing the lane and safety context.

Every entry is pinned to Bladebro v4.8.2. The behavior comes from the packet's `SKILL.md` and `references/`, which follow the upstream documentation, and the current reality comes from the recorded runs in `benchmark/reports/`. Execution detail, such as exact commands, expected signals and pass or fail criteria, lives in the [manual testing playbook](../manual-testing-playbook/manual-testing-playbook.md).

Bladebro exposes five tools, `act`, `see`, `state`, `run` and `vision`, through two transports that share the same handlers. The CLI is the default. `bladebro mcp` through Code Mode is the fallback. The owned agent browser is the default lane, and the real-browser `rb` lanes run only on an explicit operator request. The installed `bladebro help` also lists commands this packet does not document, such as `nav`, `audit`, `audio`, `hermes` and `update`. They stay out of this catalog until the packet covers them.

---

## 2. TRANSPORT

### CLI lane and output envelope

#### Description

The `bladebro` CLI is the default transport, with a persistent daemon, a `--json` envelope carrying `ok`, `is_error` and `text`, and exit codes 0, 1 and 2.

#### Current Reality

The CLI is chosen when `command -v bladebro` succeeds and `bladebro doctor` passes. The first command starts a daemon that keeps one browser for later commands, `--no-daemon` runs one command with its own browser, and `bladebro stop` shuts the daemon down. The live macOS runs judged every CLI result by its exit code and its `ok` field.

#### Source Files

See [`transport/cli-lane-and-output-envelope.md`](transport/cli-lane-and-output-envelope.md) for full implementation and test file listings.

---

### MCP lane through Code Mode

#### Description

`bladebro mcp` is a local stdio server with the same five tools, reached from Code Mode through the registered `bladebro` manual with synchronous calls.

#### Current Reality

Over stdio, `tools/list` names act, see, state, run and vision. Code Mode discovery exposed `bladebro.bladebro_{act,see,state,run,vision}`, and a live `bladebro_see` call returned the example.com text. A call written with `await` failed, so calls are synchronous. Callable names are confirmed again in each session.

#### Source Files

See [`transport/mcp-code-mode-lane.md`](transport/mcp-code-mode-lane.md) for full implementation and test file listings.

---

## 3. AGENT BROWSER

### Agent-browser isolation

#### Description

The Bladebro-owned agent-browser profile is the default lane, and `BLADE_HOME` or `BLADE_FRESH=1` isolates a task from ordinary Bladebro data.

#### Current Reality

Every agent-browser probe ran on the owned profile on macOS arm64 and passed. The default data root is `~/.local/state/blade`, and `bladebro doctor` prints the path that resolved. A running daemon keeps its launch settings, so isolation settings apply only to a daemon started after they are set.

#### Source Files

See [`agent-browser/agent-browser-isolation.md`](agent-browser/agent-browser-isolation.md) for full implementation and test file listings.

---

### Page reads

#### Description

`see` reads a page without acting, returning the page model with refs, the main text, headings, text search, a scoped subtree, structured extraction or console and network logs.

#### Current Reality

`see content` and `see model` passed live on example.com with `ok: true` and exit 0, and the model listed a ref for the page's one link. Large results come back as an artifact path plus a paging receipt.

#### Source Files

See [`agent-browser/page-reads.md`](agent-browser/page-reads.md) for full implementation and test file listings.

---

### Page actions

#### Description

`act` targets a control by ref, selector, label, text or coordinates and runs one action, such as click, type, fill, press, eval or download.

#### Current Reality

`act click` by positional text and by `--text` both navigated once on example.com. An accepted click or submit dispatches once. After a disconnect leaves an outcome unknown, the destination is inspected before an action is sent again.

#### Source Files

See [`agent-browser/page-actions.md`](agent-browser/page-actions.md) for full implementation and test file listings.

---

### Step plans

#### Description

`run` executes a plan of reads, actions, branches and bounded loops in one call, and `act batch` runs a straight sequence.

#### Current Reality

A two-step plan that navigates and reads returned `"status":"completed"` with each step `ok`. A malformed step exits 1 with a usage error that names the valid actions. Completed actions stay in effect when a later step stops.

#### Source Files

See [`agent-browser/step-plans.md`](agent-browser/step-plans.md) for full implementation and test file listings.

---

### Marked screenshots

#### Description

`vision` saves a PNG and returns its `image_path`, optionally overlaid with numbered ref badges through `--marks`.

#### Current Reality

`vision --marks --json` passed live with an `image_path` to a PNG and a count of marked elements. The structural model is cheaper and gives actionable refs, so vision is the last resort.

#### Source Files

See [`agent-browser/marked-screenshots.md`](agent-browser/marked-screenshots.md) for full implementation and test file listings.

---

### Tabs, cookies and sessions

#### Description

`state` lists and switches tabs, reads and sets cookies and web storage, saves and loads named sessions, and sets resource blocking.

#### Current Reality

`state tabs` passed live with the current tab marked. Cookie, storage and named-session data stay out of the repository and out of replies.

#### Source Files

See [`agent-browser/tabs-cookies-and-sessions.md`](agent-browser/tabs-cookies-and-sessions.md) for full implementation and test file listings.

---

## 4. REAL BROWSER

### Lane selection and status

#### Description

`rb use`, `rb profile` and `rb mode` choose the browser, the profile and the mechanism, and `rb status` shows the selection, all on explicit operator request only.

#### Current Reality

Selecting the Aside binary, a staged profile copy and `clone` passed live, with the status reading `STANDBY` before the lane turned on. The status labels the browser `Google Chrome (Chrome)` even with an Aside binary override.

#### Source Files

See [`real-browser/lane-selection-and-status.md`](real-browser/lane-selection-and-status.md) for full implementation and test file listings.

---

### Clone mode

#### Description

`clone` imports the selected profile into a Bladebro-owned copy that refreshes from the real browser, which can stay open and is never written to.

#### Current Reality

`rb on` imported the copy and reported the lane `ON`, then `ACTIVE`. Reads on that lane failed in both recorded runs with the Aside binary, once on example.com and once on a signed-in site. Each read exited 1 with `Chrome launch failed: no page target available`. Clone mode with a stock Chromium-family binary has no recorded run.

#### Source Files

See [`real-browser/clone-mode.md`](real-browser/clone-mode.md) for full implementation and test file listings.

---

### Attach mode

#### Description

Attach drives a browser the caller already runs on a fixed debug port, through the per-command `--port <N>` flag, and leaves that browser open.

#### Current Reality

Attaching to a running Aside on port 9333 passed in both recorded runs, once on example.com and once on a signed-in site. Each read-only content, model and eval read returned `ok: true` and exit 0, and a fixed port reported `webdriver=false`. While the port is open, any local process can drive that browser.

#### Source Files

See [`real-browser/attach-mode.md`](real-browser/attach-mode.md) for full implementation and test file listings.

---

### Pause, resume and switch back

#### Description

`rb pause` blocks input, navigation, downloads, collection and tab work while reads, waits and eval continue, `rb resume` re-enables input, and `rb off` returns to the agent browser.

#### Current Reality

`rb off` passed live in both teardown runs. `rb pause` and `rb resume` appear in the upstream documentation and in `bladebro help rb`, and no recorded run exercised them.

#### Source Files

See [`real-browser/pause-resume-and-switch-back.md`](real-browser/pause-resume-and-switch-back.md) for full implementation and test file listings.

---

## 5. INSTALL AND HEALTH

### Pinned install and digest check

#### Description

An operator-approved `npm install -g --ignore-scripts bladebro@4.8.2` adds the native binary through optional dependencies with no lifecycle script, and the SHA-256 of the native binary and of the two JS launcher files is checked against recorded digests before first use.

#### Current Reality

The pinned install passed live on macOS arm64, and the installed native binary matched the v4.8.2 sidecar digest. `scripts/install.sh` wraps the install with lifecycle scripts off, the launcher and native binary digest checks and the version check, and removes the install again on a mismatch. Nothing installs Bladebro without an operator yes.

#### Source Files

See [`install-and-health/pinned-install-and-digest-check.md`](install-and-health/pinned-install-and-digest-check.md) for full implementation and test file listings.

---

### Health diagnostics

#### Description

`bladebro doctor` reports the data root, the browser and the release state, and `scripts/doctor.sh` adds the pin, digest, MCP handshake and manual checks, all read-only.

#### Current Reality

`bladebro --version` reported 4.8.2 and `bladebro doctor` called Bladebro operational, with advisories for a profile folder created on first run and an available update. The run stayed on the pinned version. `scripts/doctor.sh` exits 1 only on a digest mismatch or a missing `bladebro` manual.

#### Source Files

See [`install-and-health/health-diagnostics.md`](install-and-health/health-diagnostics.md) for full implementation and test file listings.

---

### Teardown and rollback

#### Description

`rb off`, `rb forget` and `bladebro stop` return to the agent browser, wipe a clone and stop the daemon, and `npm uninstall -g bladebro` rolls the install back after an operator yes.

#### Current Reality

The lane reset passed live in both runs that turned the real-browser lane on, ending with the status `STANDBY`. The uninstall was skipped while it waits for operator approval, and Bladebro stays installed on the test host.

#### Source Files

See [`install-and-health/teardown-and-rollback.md`](install-and-health/teardown-and-rollback.md) for full implementation and test file listings.

---

## 6. LIMITS AND SAFETY

### Capability gaps and handoffs

#### Description

Bladebro has no HAR export, heap snapshot, performance trace, Lighthouse audit, raw CDP passthrough or cross-origin iframe content, so those requests go to the sibling modes.

#### Current Reality

`mcp-chrome-devtools` covers HAR, heap, trace, Lighthouse, raw CDP and CDP frame methods, and `mcp-aside-devtools` covers deterministic signed-in proof and Playwright frames. Extensions and session video recording are also outside the upstream tool surface.

#### Source Files

See [`limits-and-safety/capability-gaps-and-handoffs.md`](limits-and-safety/capability-gaps-and-handoffs.md) for full implementation and test file listings.

---

### Consent gates and blocked verdicts

#### Description

Real-browser lanes and stealth runs need an explicit operator request, a chosen profile and a confirmed site, and a `blocked:` verdict ends the task without a retry.

#### Current Reality

The playbook puts these gates in front of every real-browser scenario, and the earliest run records document the operator's approval before the real-browser steps ran. No recorded run met a `blocked:` verdict. The rule to stop on one is binding packet guidance rather than observed behavior.

#### Source Files

See [`limits-and-safety/consent-gates-and-blocked-verdicts.md`](limits-and-safety/consent-gates-and-blocked-verdicts.md) for full implementation and test file listings.
