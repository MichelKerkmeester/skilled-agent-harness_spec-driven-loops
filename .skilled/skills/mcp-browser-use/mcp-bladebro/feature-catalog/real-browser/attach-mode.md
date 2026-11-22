---
title: "Attach mode"
description: "Attach drives a browser the caller already runs on a fixed debug port, through the per-command `--port <N>` flag, and leaves that browser open."
trigger_phrases:
  - "attach mode"
  - "bladebro attach"
  - "bladebro --port"
  - "bladebro rb attach"
version: 1.0.0.0
---

# Attach mode (--port, rb mode attach)

## 1. OVERVIEW

Attach drives a browser the caller already runs on a fixed debug port, through the per-command `--port <N>` flag, and leaves that browser open.

Attach uses the running browser's live cookies and sessions. Nothing is copied and no password store is read, and the browser stays caller-owned when Bladebro detaches. It is the mechanism to use whenever the browser must stay open.

---

## 2. HOW IT WORKS

### Core Behavior

The operator starts the browser with a fixed debug port, for example `open -a <browser app> --args --remote-debugging-port=9333`, after quitting it fully. `curl -s http://127.0.0.1:9333/json/version` confirms the port answers. Each Bladebro command then takes `--port 9333`, which drives that running browser and skips Bladebro's own daemon. The installed help lists `--host` beside `--port` for the same purpose. `rb mode attach` selects the same mechanism for the `rb` lane.

### Recorded Results

Attaching to a running Aside on port 9333 passed in both recorded runs. The first visited example.com only. The second read a signed-in site the operator confirmed. In each run, `see content`, `see model` and one `act eval` returned `ok: true` and exit 0. The first run's eval checked the browser identity, and the second run's eval checked that the title was not a sign-in page. Aside opened the port on its normal profile, which branded Chrome 136 and later refuses.

### Async & Safety

A fixed port reported `navigator.webdriver` as `false`, while an ephemeral `--remote-debugging-port=0` port makes Chrome report it as `true`. While the port is open, any local process can drive the signed-in browser, so the operator closes it as soon as the reads finish. The reads stay read-only unless the operator asks for more.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | The `attach` mechanism and its guidance |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/attach-read.sh` | Script | Read-only probe and reads against a running browser's port |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md` | Manual playbook | Attach, read the confirmed site and evaluate its title |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--attach-probe--aside-browser/README.md` | Benchmark | Attach reads on example.com and the `webdriver` check |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/README.md` | Benchmark | Attach reads on a signed-in target |

---

## 4. SOURCE METADATA

- Group: Real Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `real-browser/attach-mode.md`

Related references:
- [clone-mode.md](clone-mode.md) - The copy-based mechanism that failed on the same browser
- [pause-resume-and-switch-back.md](pause-resume-and-switch-back.md) - Handing control back to the operator
