---
title: "Context Isolation"
description: "--isolated=true per manual — independent cookie/storage state per instance."
trigger_phrases:
  - "isolated browser instances"
  - "--isolated=true"
  - "cookie isolation cross instance"
version: 1.0.0.0
---

# Context Isolation

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Each chrome_devtools manual runs `chrome-devtools-mcp` with `--isolated=true`, giving every instance its own browser process with independent cookie and storage state. A cookie set in `chrome_devtools_1` never appears in `chrome_devtools_2`.

---

## 2. HOW IT WORKS

Isolation is what makes parallel testing safe: no session conflicts between instances, and per-instance auth states can differ (e.g. logged-in vs anonymous comparisons). The playbook verifies isolation by setting a cookie in instance 1 and proving `getCookies` on instance 2 does not return it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | `--isolated=true` key feature and benefits |
| `INSTALL-GUIDE.md` §4 | Guide | UTCP config with isolation flag |
| `assets/utcp-chrome-devtools-manuals.md` | Asset | Registered-state snapshot showing both flags |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-parallel-instances/page-context-isolation.md` | Manual | BDG-018 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-parallel-instances/context-isolation.md`
Related references:
- [dual-instance-parallel.md](../mcp-parallel-instances/dual-instance-parallel.md) — Dual-Instance Parallel
- [cookie-management.md](../console-and-network/cookie-management.md) — Cookie Management
