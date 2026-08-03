---
title: "Webflow MCP Version Fixture"
description: "Dated capture of the authoritative surface identity: endpoint, pinned package version, tool/action counts, schema digest, and the refresh procedure discovery must consume."
trigger_phrases:
  - "webflow version fixture"
  - "webflow pinned surface"
  - "webflow schema digest"
  - "webflow discovery fixture"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Webflow MCP Version Fixture - Dated Surface Capture

The single recorded identity of the tested Webflow MCP surface; discovery must consume this fixture before any action, and the fixture is refreshed only by a documented capture run.

---

## 1. OVERVIEW

`webflow-mcp-server@latest` is not a reproducible inventory source: the hosted docs, the OSS
README, and the packet previously disagreed on endpoint and capability provenance. This fixture
records what was actually captured on a dated run, so the packet's action reference,
tool-surface, and wiring docs always point at one authoritative snapshot. **Purpose**: pin the
captured identity. **Usage**: read before discovery; refresh via the procedure in §4 and bump
the digest.

---

## 2. CAPTURED SURFACE IDENTITY (2026-08-03)

| Field | Value |
|---|---|
| Registry surface | `com.webflow/mcp` (Streamable HTTP, remote OAuth) |
| Remote endpoint (hosted docs) | `https://mcp.webflow.com/mcp` |
| Remote endpoint (OSS README, legacy) | `https://mcp.webflow.com/sse` |
| Local transport | stdio via `npx -y webflow-mcp-server` |
| Local package pin | **UNPINNED — `@latest`** (pin before live use) |
| Tool count (remote, documented) | 31 tools / 220 actions |
| Tool modules (local OSS baseline) | 18 modules (`src/tools/*`) |
| Action-schema digest | **UNVERIFIED** — capture via live `list_tools()` on the pinned version |
| Bridge App | Required for canvas-bound ops only; auto-installs on remote OAuth |

---

## 3. CONSUMPTION RULE

Discovery compares the live `list_tools()` result against this fixture's expected counts and
digest **before any action**. Mismatch → fail closed: report the drift, do not execute. When the
fixture's digest is UNVERIFIED, discovery must capture it on the first authenticated session and
record it here.

---

## 4. REFRESH PROCEDURE

1. Pin the package version in the manual registration (`webflow-mcp-server@<exact>`), replacing `@latest`.
2. Run discovery (`list_tools()`) against the pinned version; record tool/action counts.
3. Capture the action-schema digest (hash of the sorted schema JSON) and fill the table above.
4. Re-check `tool-surface.md` module list and `action-reference.md` counts against the capture;
   update drift notes, bump this fixture's `version`, and re-run packet validators.

---

## 5. RELATED RESOURCES

- [`mcp-wiring.md`](mcp-wiring.md) — transport, auth, and the version-surface contradiction
- [`tool-surface.md`](tool-surface.md) — local OSS module baseline
- [`action-reference.md`](action-reference.md) — remote action inventory (31/220)
- [`troubleshooting.md`](troubleshooting.md) — drift and failure triage
