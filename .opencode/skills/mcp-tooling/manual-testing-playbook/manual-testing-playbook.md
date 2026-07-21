---
title: "mcp-tooling: Manual Testing Playbook"
description: "Operator-facing index for mcp-tooling hub-routing validation across all six modes: does the hub resolve mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, and mcp-mobbin correctly through mode-registry.json and hub-router.json, including six blind holdouts and the chrome-vs-aside boundary."
version: 1.1.0.0
---

# mcp-tooling: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `mcp-tooling` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `mcp-tooling`'s routing behavior across its SIX modes — three workflow bridges (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`) and three design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`). It covers hub-level mode resolution only, not the internal behavior of any packet, which each packet's own testing material already covers (`<packet>/manual-testing-playbook/`, unchanged by the hub corpus).

Source of truth for routing behavior: `.opencode/skills/mcp-tooling/SKILL.md` §2 Smart Routing, `.opencode/skills/mcp-tooling/hub-router.json` (including `routerPolicy.defaultResourceSemantics: "fallback-only"` and the discovery-only `routerPolicy.discoveryClasses`).

---

## 1. OVERVIEW

The `mcp-tooling` hub routes any MCP tool-bridge request to exactly one advisor identity, then resolves `workflowMode` to one of six packets via `hub-router.json`. This playbook validates that resolution, not any packet's internal pipeline.

The scored corpus holds **13 scenario files** under `hub-routing/`: 7 primary routing scenarios (one per mode plus the ambiguous-defer contract) and 6 blind holdouts (one per mode, `blindToRouterKeywords: true`, with any remediation-era vocabulary bindings recorded honestly as `blindExceptions`).

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads).

### Primary routing (7)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-001 | [`hub-routing/chrome-devtools-browser-debug.md`](../manual-testing-playbook/hub-routing/chrome-devtools-browser-debug.md) | `mcp-chrome-devtools` (browser/HAR/screenshot signal) |
| MT-002 | [`hub-routing/clickup-task-management.md`](../manual-testing-playbook/hub-routing/clickup-task-management.md) | `mcp-click-up` (ClickUp/cupt task signal) |
| MT-003 | [`hub-routing/figma-transport.md`](../manual-testing-playbook/hub-routing/figma-transport.md) | `mcp-figma` (Figma Desktop/render/design-tokens signal) |
| MT-004 | [`hub-routing/ambiguous-defer.md`](../manual-testing-playbook/hub-routing/ambiguous-defer.md) | `defer` (hub-identity vocabulary only — zero modes score, NO resources assembled, fallback-only contract) |
| MT-007 | [`hub-routing/aside-browser-automation.md`](../manual-testing-playbook/hub-routing/aside-browser-automation.md) | `mcp-aside-devtools` (Aside/agentic-browser/REPL-evidence signal) |
| MT-008 | [`hub-routing/refero-design-reference.md`](../manual-testing-playbook/hub-routing/refero-design-reference.md) | `mcp-refero` (Refero/real-app style-reference signal) |
| MT-009 | [`hub-routing/mobbin-app-research.md`](../manual-testing-playbook/hub-routing/mobbin-app-research.md) | `mcp-mobbin` (Mobbin/app-design-research signal) |

### Design-transport bundle (Figma + Refero) — primary evidence

The two design-reference transports (`mcp-figma`, `mcp-refero`) are the hub's ordered design-transport bundle: a single design task legitimately spans a render/token source (`mcp-figma`) and a real shipped-app reference source (`mcp-refero`). This pairing is a primary evidence concern, not a prose aside — its serving-authority parity under compiled routing is exercised by the compiled-routing scenario `MT-CR-001` (`compiled-routing/ordered-bundle-figma-refero-compiled-routing.md`), which routes the real-app-reference leg to `mcp-refero` and gates on the compiled decision matching legacy.

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-CR-001 | [`compiled-routing/ordered-bundle-figma-refero-compiled-routing.md`](../manual-testing-playbook/compiled-routing/ordered-bundle-figma-refero-compiled-routing.md) | `mcp-refero` (design-transport bundle; Figma leg covered by MT-003) |

### Blind holdouts (6 — one per mode, coverage 6/6)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-H01 | [`hub-routing/holdout-browser-inspect.md`](../manual-testing-playbook/hub-routing/holdout-browser-inspect.md) | `mcp-chrome-devtools` (natural-language browser inspection, no aliases) |
| MT-H02 | [`hub-routing/holdout-design-tokens.md`](../manual-testing-playbook/hub-routing/holdout-design-tokens.md) | `mcp-figma` (natural-language design-token extraction) |
| MT-H03 | [`hub-routing/holdout-task-tracking.md`](../manual-testing-playbook/hub-routing/holdout-task-tracking.md) | `mcp-click-up` (natural-language task tracking) |
| MT-H04 | [`hub-routing/holdout-agentic-browser.md`](../manual-testing-playbook/hub-routing/holdout-agentic-browser.md) | `mcp-aside-devtools` (natural-language autonomous browser task) |
| MT-H05 | [`hub-routing/holdout-web-design-reference.md`](../manual-testing-playbook/hub-routing/holdout-web-design-reference.md) | `mcp-refero` (natural-language shipped-web-product UI references) |
| MT-H06 | [`hub-routing/holdout-mobile-pattern-research.md`](../manual-testing-playbook/hub-routing/holdout-mobile-pattern-research.md) | `mcp-mobbin` (natural-language mobile app pattern research) |

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

- Packet-level playbooks: `mcp-chrome-devtools/manual-testing-playbook/manual-testing-playbook.md`, `mcp-click-up/manual-testing-playbook/manual-testing-playbook.md`, `mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md`, `mcp-figma/manual-testing-playbook/manual-testing-playbook.md`, `mcp-refero/manual-testing-playbook/manual-testing-playbook.md`, `mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md` (each covers its packet's internal behavior and intra-packet routing recall).
- Lane-C automated benchmark: `benchmark/` — frozen pre-remediation run under `benchmark/baseline/` (PASS 95), enforced route-gold re-run under `benchmark/after-routing-remediation/` (PASS 98, routeGold 13/13); see `benchmark/README.md` for the run table.
