---
title: "Raw CDP Execution"
description: "bdg cdp <Method> ['<json>'] — execute any discovered CDP method with optional JSON parameters."
trigger_phrases:
  - "bdg cdp command"
  - "raw cdp method"
  - "execute cdp with parameters"
version: 1.0.0.0
---

# Raw CDP Execution

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg cdp Page.reload 2>&1` executes a CDP method directly; `bdg cdp Network.setCookie '{"name":"x","value":"y"}' 2>&1` passes JSON parameters. This is the full-surface escape hatch beyond the helper commands — the CLI reaches 300+ methods across 53 domains.

---

## 2. HOW IT WORKS

Requires an active session and a discovered method name (never assume names without discovery — SKILL.md NEVER rule 5). Domain patterns for Page, DOM, Network, Runtime, Memory, and Performance live in the CDP patterns reference; prefer helper commands (`bdg dom query`, `bdg console --list`) when one exists.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Raw CDP command reference |
| `references/cdp_patterns.md` §4 | Reference | Per-domain CDP command patterns |
| `INSTALL-GUIDE.md` §6 | Guide | Raw CDP examples |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/protocol_discovery/describe_page_domain.md` | Manual | Discovery precondition (BDG-006) |

---

## 4. SOURCE METADATA

- Group: Protocol Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `protocol_discovery/raw_cdp_command.md`
Related references:
- [search_cdp_method.md](../protocol_discovery/search_cdp_method.md) — Search CDP Methods
- [viewport_emulation.md](../dom_and_screenshot/viewport_emulation.md) — Viewport Emulation
