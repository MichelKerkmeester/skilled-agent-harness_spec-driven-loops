---
title: "BB-015 -- Reads in the real-browser lane by attaching to a running browser"
description: "This scenario validates page reads and an eval for `BB-015` by attaching to a browser the operator already runs on a fixed debug port. It focuses on reaching a signed-in site without copying the profile."
version: 1.0.2.0
---

# BB-015 -- Reads in the real-browser lane by attaching to a running browser

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-015`.

---

## 1. OVERVIEW

The attach mechanism of the real-browser lane. BB-011 and BB-012 import a copy of the profile into a second browser. This scenario instead drives the browser the operator already runs, so the live cookies and sessions of that browser serve the reads. Nothing is copied and no password store is read.

### Why This Matters

On macOS a second instance of a Chromium-family browser launched from a copied profile can expose no page target, which fails BB-012. Attach mode is the other route to a signed-in site, and it needs its own proof.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-015` and confirm the expected signals without contradictory evidence.

- Objective: Attach to the running browser, read the confirmed target site, read its model and evaluate the page title, all read-only.
- Real user request: `Attach Bladebro to my running browser and read the site I confirmed, without clicking or typing anything.`
- Prompt: `Attach Bladebro to my running browser and read the site I confirmed, without clicking or typing anything.`
- Precondition: the browser must accept a debug port on the data directory it runs. Branded Google Chrome 136 and later refuses remote debugging on its default data directory. Use one of three builds. The first is the Aside browser both recorded passes used. The second is Chromium or Chrome for Testing. The third is branded Chrome on a non-default `--user-data-dir` the operator has signed into first. A fresh data directory holds no sessions, so the site would show its sign-in page.
- Expected execution process: the operator picks the browser and profile, then confirms the target site and a browser restart. Run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: the debug port answers with a browser version, each read returns `ok: true` and exits 0, and the eval reports a signed-in page rather than a sign-in page
- Desired user-visible outcome: Bladebro reads the signed-in site through the operator's own browser.
- Pass/fail: PASS if the port answers and all three reads succeed on the signed-in page. FAIL if the port stays closed, any read errors or the site shows its sign-in page. Record it without a retry, then close the port.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Attach Bladebro to my running browser and read the site I confirmed, without clicking or typing anything.`

### Commands

1. Quit the browser, then start it with a fixed debug port: `open -a <browser app> --args --remote-debugging-port=9333`. For branded Chrome 136 or later, add the signed-in non-default data directory: `open -a "Google Chrome" --args --remote-debugging-port=9333 --user-data-dir=<dir>`
2. `curl -s http://127.0.0.1:9333/json/version`
3. `bladebro see content <target URL> --port 9333 --json`
4. `bladebro see model --port 9333 --json`
5. `bladebro act eval "'host-match ' + (location.hostname === new URL('<target URL>').hostname) + ' sign-in ' + /sign ?in|log ?in/i.test(document.title)" --port 9333 --json`
6. Quit the browser, confirm `curl -s http://127.0.0.1:9333/json/version` gets no answer, then start the browser normally.

### Expected

- A `"Browser"` line from the debug port
- The page text and a ref list for the target site
- The eval result `host-match true sign-in false`: the tab is on the target and its title is not a sign-in page

### Evidence

Every output and exit status. Page text, hostnames, account names, workspace names and cookie values are never quoted in the record, because on a site with one subdomain per customer the hostname is the workspace name. The record keeps the exit status, the `ok` field and the two eval booleans only.

### Pass / Fail

- **Pass**: the port answers and all three reads succeed on the signed-in page.
- **Fail**: the port stays closed, any read errors or the site shows its sign-in page. Record it without a retry, then close the port.

### Failure Triage

1. No answer on the port from branded Google Chrome 136 or later, started on its default data directory, means the build refused remote debugging there. Switch to a build from the precondition and repeat step 1. This is a FAIL of the precondition, not of Bladebro.
2. No answer on the port from any other build means the browser was still running when it was started again. Quit it fully and repeat step 1.
3. A sign-in page means the running browser holds no session for the site. That is a FAIL of the precondition, not of Bladebro.
4. While the port is open any local process can drive the signed-in browser. Close it as soon as the reads finish.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `real-browser/attach-mode-reads.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and the JSON result envelope |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/real-browser/attach-mode.md` | Feature catalog entry: Attach mode and the per-command `--port` flag |

---

## 5. SOURCE METADATA

- Group: Real Browser
- Playbook ID: BB-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `real-browser/attach-mode-reads.md`
