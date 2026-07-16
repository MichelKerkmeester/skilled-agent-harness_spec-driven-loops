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
| `INSTALL_GUIDE.md` §10 | Guide | MCP tools reference |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/mcp_parallel_instances/close_and_select_page.md` | Manual | BDG-016 scenario contract |
| `manual_testing_playbook/mcp_parallel_instances/multi_tab_same_instance.md` | Manual | BDG-017 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp_parallel_instances/page_management.md`
Related references:
- [dual_instance_parallel.md](../mcp_parallel_instances/dual_instance_parallel.md) — Dual-Instance Parallel
- [session_cleanup.md](../mcp_parallel_instances/session_cleanup.md) — Session Cleanup
