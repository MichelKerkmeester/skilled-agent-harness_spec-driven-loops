---
title: "mcp-tooling: Manual Testing Playbook"
description: "Operator-facing index for mcp-tooling hub-routing validation across all six modes: does the hub resolve mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, and mcp-mobbin correctly through mode-registry.json and hub-router.json, including six blind holdouts and the chrome-vs-aside boundary."
version: 1.1.0.0
---

# mcp-tooling: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `mcp-tooling` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `mcp-tooling`'s routing behavior across its SIX modes — three workflow bridges (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`) and three design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`). It covers hub-level mode resolution only, not the internal behavior of any packet, which each packet's own testing material already covers (`<packet>/manual_testing_playbook/`, unchanged by the hub corpus).

Source of truth for routing behavior: `.opencode/skills/mcp-tooling/SKILL.md` §2 Smart Routing, `.opencode/skills/mcp-tooling/hub-router.json` (including `routerPolicy.defaultResourceSemantics: "fallback-only"` and the discovery-only `routerPolicy.discoveryClasses`).

---

## 1. OVERVIEW

The `mcp-tooling` hub routes any MCP tool-bridge request to exactly one advisor identity, then resolves `workflowMode` to one of six packets via `hub-router.json`. This playbook validates that resolution, not any packet's internal pipeline.

The scored corpus holds **13 scenario files** under `hub_routing/`: 7 primary routing scenarios (one per mode plus the ambiguous-defer contract) and 6 blind holdouts (one per mode, `blindToRouterKeywords: true`, with any remediation-era vocabulary bindings recorded honestly as `blindExceptions`).

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub_routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads).

### Primary routing (7)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-001 | [`hub_routing/chrome_devtools_browser_debug.md`](hub_routing/chrome_devtools_browser_debug.md) | `mcp-chrome-devtools` (browser/HAR/screenshot signal) |
| MT-002 | [`hub_routing/clickup_task_management.md`](hub_routing/clickup_task_management.md) | `mcp-click-up` (ClickUp/cupt task signal) |
| MT-003 | [`hub_routing/figma_transport.md`](hub_routing/figma_transport.md) | `mcp-figma` (Figma Desktop/render/design-tokens signal) |
| MT-004 | [`hub_routing/ambiguous_defer.md`](hub_routing/ambiguous_defer.md) | `defer` (hub-identity vocabulary only — zero modes score, NO resources assembled, fallback-only contract) |
| MT-007 | [`hub_routing/aside_browser_automation.md`](hub_routing/aside_browser_automation.md) | `mcp-aside-devtools` (Aside/agentic-browser/REPL-evidence signal) |
| MT-008 | [`hub_routing/refero_design_reference.md`](hub_routing/refero_design_reference.md) | `mcp-refero` (Refero/real-app style-reference signal) |
| MT-009 | [`hub_routing/mobbin_app_research.md`](hub_routing/mobbin_app_research.md) | `mcp-mobbin` (Mobbin/app-design-research signal) |

### Blind holdouts (6 — one per mode, coverage 6/6)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-H01 | [`hub_routing/holdout_browser_inspect.md`](hub_routing/holdout_browser_inspect.md) | `mcp-chrome-devtools` (natural-language browser inspection, no aliases) |
| MT-H02 | [`hub_routing/holdout_design_tokens.md`](hub_routing/holdout_design_tokens.md) | `mcp-figma` (natural-language design-token extraction) |
| MT-H03 | [`hub_routing/holdout_task_tracking.md`](hub_routing/holdout_task_tracking.md) | `mcp-click-up` (natural-language task tracking) |
| MT-H04 | [`hub_routing/holdout_agentic_browser.md`](hub_routing/holdout_agentic_browser.md) | `mcp-aside-devtools` (natural-language autonomous browser task) |
| MT-H05 | [`hub_routing/holdout_web_design_reference.md`](hub_routing/holdout_web_design_reference.md) | `mcp-refero` (natural-language shipped-web-product UI references) |
| MT-H06 | [`hub_routing/holdout_mobile_pattern_research.md`](hub_routing/holdout_mobile_pattern_research.md) | `mcp-mobbin` (natural-language mobile app pattern research) |

### The MT-H01 boundary (chrome vs aside)

MT-H01 is the certified chrome-vs-aside boundary case for the six-mode hub: developer-driven inspection primitives (network requests, live DOM) with no agentic vocabulary must STILL resolve `mcp-chrome-devtools`; `mcp-aside-devtools` wins only when the prompt asks the browser to act autonomously (MT-H04 is the inverse). An `mcp-aside-devtools` or `defer` result on MT-H01 is a routing regression.

---

## 3. SUCCESS CRITERIA

- All 13 scenarios resolve to their expected `workflowMode` (or `defer` for MT-004) and assemble exactly the expected packet resources — no more (fallback-only: `defaultResource` is never unioned into a scored route).
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.
- The genuinely ambiguous scenario (MT-004) defers: zero modes score, no packet resources are assembled, and the Chrome default is at most a defer-time suggestion.
- The MT-H01 chrome-vs-aside boundary holds (see above), and each of the six modes has a passing blind holdout (coverage 6/6).

---

## 4. RELATED

- Packet-level playbooks: `mcp-chrome-devtools/manual_testing_playbook/manual_testing_playbook.md`, `mcp-click-up/manual_testing_playbook/manual_testing_playbook.md`, `mcp-aside-devtools/manual_testing_playbook/manual_testing_playbook.md`, `mcp-figma/manual_testing_playbook/manual_testing_playbook.md`, `mcp-refero/manual_testing_playbook/manual_testing_playbook.md`, `mcp-mobbin/manual_testing_playbook/manual_testing_playbook.md` (each covers its packet's internal behavior and intra-packet routing recall).
- Lane-C automated benchmark: `benchmark/` — frozen pre-remediation run under `benchmark/baseline/` (PASS 95), enforced route-gold re-run under `benchmark/after-routing-remediation/` (PASS 98, routeGold 13/13); see `benchmark/README.md` for the run table.
