---
title: "Example: first authenticated session (discovery + pin)"
description: "The operator-approved first live session: doctor, discovery, drift check, version pin, fixture update."
trigger_phrases: ["webflow first session", "webflow discovery example"]
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example: first authenticated session (discovery + pin) - Worked Example

The operator-approved first live session: doctor, discovery, drift check, version pin, fixture update.

---

## 1. OVERVIEW

### Purpose

Show the deterministic first-authenticated-session sequence so the surface is pinned and recorded before any real work.

### Usage

Use once after the token + test site are provisioned. Discovery of the pinned version is the only authoritative inventory.

---

## 2. EXAMPLE SESSION

1. `bash scripts/doctor.sh` passes (token present, manual verified).
2. `list_tools()`; filter `webflow.webflow.*`.
3. Drift check against the action reference + tool surface; record drift with a dated fixture.
4. Pin the server version (operator-approved edit of the manual).
5. Record the surface + version in `mcp-servers/webflow-mcp/README.md`; update `references/tool-surface.md`.
6. Read-only smoke: one RO call (e.g., `list_sites`) as the first live evidence.

---

## 3. RELATED RESOURCES

- [`../../references/mcp-wiring.md`](../../references/mcp-wiring.md) — version-surface reconciliation
- [`../../manual-testing-playbook/discovery-setup/discover.md`](../../manual-testing-playbook/discovery-setup/discover.md)
