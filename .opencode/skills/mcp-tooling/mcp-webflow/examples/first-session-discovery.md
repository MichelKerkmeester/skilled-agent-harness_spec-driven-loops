---
title: "Example: first authenticated session (discovery + pin)"
description: "The operator-approved first live session: doctor, discovery, drift check, version pin, fixture update."
trigger_phrases: ["webflow first session", "webflow discovery example"]
importance_tier: normal
contextType: example
version: 1.0.0.0
---

# Example: first authenticated session (discovery + pin)

## Prerequisites (operator)

- `WEBFLOW_TOKEN` exported (least-privilege scopes on the dedicated test site).
- `bash scripts/doctor.sh` passes.

## Steps

1. **Discover**: `list_tools()`; filter `webflow.webflow.*`.
2. **Drift check**: compare against `references/tool-surface.md`; record any drift (missing,
   renamed, extra tools) with a dated fixture before proceeding.
3. **Pin**: replace `webflow-mcp-server@latest` in the manual with the exact verified version
   (verify-only edit of `.utcp_config.json` after operator approval).
4. **Record**: write the discovered surface + endpoint + version into
   `mcp-servers/webflow-mcp/README.md` §3 and update `references/tool-surface.md`.
5. **Read-only smoke**: one RO call (e.g., `list_sites` on the test site) as the first live
   evidence.

## Why

The README and hosted docs disagree on the remote surface (`/sse` vs `/mcp`) — live discovery of
the pinned version is the only authoritative inventory.
