---
title: "mcp-tooling: Manual Testing Playbook"
description: "Operator-facing index for mcp-tooling hub-routing validation: does the advisor resolve mcp-chrome-devtools vs mcp-click-up vs mcp-figma correctly through mode-registry.json and hub-router.json."
version: 1.0.0.0
---

# mcp-tooling: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `mcp-tooling` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `mcp-tooling`'s routing behavior. It covers the NEW routing surface introduced by the parent-hub fold-in (packet `126-mcp-tooling-parent`) — resolving `mcp-chrome-devtools` vs `mcp-click-up` vs `mcp-figma` — not the internal behavior of any packet, which each packet's own testing material already covers (`mcp-chrome-devtools/manual_testing_playbook/`, `mcp-click-up/manual_testing_playbook/`, `mcp-figma/manual_testing_playbook/`, unchanged by the fold-in).

Source of truth for routing behavior: `.opencode/skills/mcp-tooling/SKILL.md` §2 Smart Routing, `.opencode/skills/mcp-tooling/hub-router.json`.

---

## 1. OVERVIEW

The `mcp-tooling` hub routes any MCP tool-bridge request to exactly one advisor identity, then resolves `workflowMode` to `mcp-chrome-devtools`, `mcp-click-up`, or `mcp-figma` via `hub-router.json`. This playbook validates that resolution, not any packet's internal pipeline.

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads):

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-001 | `hub-routing/chrome-devtools-browser-debug.md` | `mcp-chrome-devtools` (browser/HAR/screenshot signal) |
| MT-002 | `hub-routing/clickup-task-management.md` | `mcp-click-up` (ClickUp/cupt task signal) |
| MT-003 | `hub-routing/figma-transport.md` | `mcp-figma` (Figma Desktop/render/export signal) |
| MT-004 | `hub-routing/ambiguous-defer.md` | `defer` (no strong tool signal — router asks, does not silently default) |

A separate, non-scored functional check: a raw "chrome devtools" query should read `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` (not the hub's own thin `SKILL.md`) — verified directly during the fold-in, not part of this scored corpus.

---

## 3. SUCCESS CRITERIA

- All 4 scenarios resolve to their expected `workflowMode` (or `defer`) and load the expected packet `SKILL.md`.
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.
- The genuinely ambiguous scenario (MT-004) does not silently default to `mcp-chrome-devtools`.

---

## 4. RELATED

- Packet-level playbooks: `mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md`, `mcp-click-up/manual_testing_playbook/manual_testing_playbook.md`, `mcp-figma/manual_testing_playbook/manual_testing_playbook.md` (unchanged by the fold-in).
- Lane-C automated benchmark: `benchmark/` (populated by phase 007 of the `126-mcp-tooling-parent` program — out of scope for the fold-in itself).
