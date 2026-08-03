---
title: "DISCOVER-001: discovery and prefix contract"
description: "Verify list_tools surfaces the webflow manual and the doubled-prefix callables."
version: 1.0.0.0
---

# DISCOVER-001 — Discovery and prefix contract

1. Ensure `webflow_WEBFLOW_TOKEN` is exported (or record the blocker).
2. `list_tools()` → filter `name.startsWith("webflow.webflow.")`.
3. PASS: at least the data modules (pages, cms, sites, workflows, scripts, components) appear under the `webflow.webflow.*` namespace (expected convention; exact form recorded at first authenticated session).
4. Record the live inventory diff against `references/tool-surface.md`; pin the server version.
