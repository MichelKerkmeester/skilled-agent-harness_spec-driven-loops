---
title: "HAR Export"
description: "bdg network har <path> — export network activity as a HAR file."
trigger_phrases:
  - "bdg har export"
  - "export network trace"
  - "har file analysis"
version: 1.0.0.0
---

# HAR Export

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg network har /tmp/trace.har 2>&1` writes the session's network activity as a HAR file (validate with `jq '.log.version'`). Export target is under 3 seconds.

---

## 2. HOW IT WORKS

Enable network tracking first (`bdg cdp Network.enable`), let the page load (`sleep 5`), then export. Analyze with `jq`: slow requests via `select(.time > 1000)`, failures via `select(.response.status >= 400)`. The performance-baseline script captures a HAR alongside metrics and screenshots.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Helper command list (`bdg network har`) |
| `references/cdp_patterns.md` §5 | Reference | Network monitoring workflow with jq analysis |
| `examples/performance-baseline.sh` | Script | HAR capture in the baseline bundle |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/console_and_network/har_export.md` | Manual | BDG-013 scenario contract |

---

## 4. SOURCE METADATA

- Group: Console and Network
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `console_and_network/har_export.md`
Related references:
- [cookie_management.md](../console_and_network/cookie_management.md) — Cookie Management
- [performance_baseline.md](../automation_and_performance/performance_baseline.md) — Performance Baseline
