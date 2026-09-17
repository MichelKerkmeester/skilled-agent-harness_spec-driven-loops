---
title: "Page Management"
description: "new_page / select_page / close_page — multi-tab management within a single MCP instance."
trigger_phrases:
  - "chrome mcp new page"
  - "select page close page"
  - "multi tab single instance"
version: 1.0.0.0
---

# Page Management

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Within one instance, `new_page` opens additional pages (multi-tab), `select_page` switches the active page, and `close_page` closes one. This gives tab-level parallelism inside a single isolated browser, complementing the instance-level parallelism of the dual manuals.

---

## 2. HOW IT WORKS

Open two pages, close the first, select the second, and verify a subsequent `take_screenshot` still returns valid bytes — the playbook's close-and-select contract. Confirm exact tool names with Code Mode discovery before invoking.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | Page creation/selection/close in the tool list |
| `INSTALL-GUIDE.md` §10 | Guide | MCP tools reference |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-parallel-instances/close-and-select-page.md` | Manual | BDG-016 scenario contract |
| `manual-testing-playbook/mcp-parallel-instances/multi-tab-same-instance.md` | Manual | BDG-017 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-parallel-instances/page-management.md`
Related references:
- [dual-instance-parallel.md](../../feature-catalog/mcp-parallel-instances/dual-instance-parallel.md) — Dual-Instance Parallel
- [session-cleanup.md](../../feature-catalog/mcp-parallel-instances/session-cleanup.md) — Session Cleanup
