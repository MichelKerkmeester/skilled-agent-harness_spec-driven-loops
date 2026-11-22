---
title: "Teardown and rollback"
description: "`rb off`, `rb forget` and `bladebro stop` return to the agent browser, wipe a clone and stop the daemon, and `npm uninstall -g bladebro` rolls the install back after an operator yes."
trigger_phrases:
  - "teardown and rollback"
  - "bladebro stop"
  - "bladebro rb forget"
  - "uninstall bladebro"
version: 1.0.0.0
---

# Teardown and rollback (bladebro stop, npm uninstall -g bladebro)

## 1. OVERVIEW

`rb off`, `rb forget` and `bladebro stop` return to the agent browser, wipe a clone and stop the daemon, and `npm uninstall -g bladebro` rolls the install back after an operator yes.

Teardown has two halves. The lane reset is routine and runs after every real-browser session. The uninstall removes the package and, separately, the data root, and both wait for the operator.

---

## 2. HOW IT WORKS

### Lane Reset

`bladebro rb off` returns to the agent browser, and `bladebro rb forget` wipes the imported clone. `bladebro rb use --binary auto`, `bladebro rb profile auto` and `bladebro rb mode auto` clear the overrides. `bladebro stop` shuts down the owned daemon. The final `bladebro rb status` reads `STANDBY` with no override. This passed live in both runs that turned the real-browser lane on.

### Uninstall

`npm uninstall -g bladebro` removes the package. The data root that `bladebro doctor` reported is removed only after the operator confirms no needed named session remains in it. The uninstall was skipped in the recorded run while it waits for operator approval, so Bladebro stays installed on the test host.

### Updates

An update is also an operator decision: `npm update -g bladebro` for npm installs, or `bladebro -u` for the standalone binary, with `bladebro --rollback` to restore the previous standalone binary. An update replaces the pinned version, so it is treated as a new install with a fresh digest check and a flag re-check.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Shared | Teardown, rollback and update steps |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | `rb off` and `rb forget` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/lane-off-and-stop.md` | Manual playbook | Lane off, clone wiped, overrides reset and daemon stopped |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md` | Manual playbook | Package and data root removal after approval |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded teardown output and the uninstall skip |

---

## 4. SOURCE METADATA

- Group: Install and Health
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `install-and-health/teardown-and-rollback.md`

Related references:
- [pinned-install-and-digest-check.md](pinned-install-and-digest-check.md) - The install this undoes
- [health-diagnostics.md](health-diagnostics.md) - Where the data root path comes from
