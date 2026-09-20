---
title: "mcp-tooling: Manual Testing Playbook"
description: "Operator-facing index for mcp-tooling hub-routing validation across ten modes: six workflow bridges, four read-only design transports, eight blind holdouts, and the generic-tool ownership boundaries."
version: 1.2.0.0
---

# mcp-tooling: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `mcp-tooling` routing contract — no mocks or stubs. Scenarios verify the hub's actual `workflowMode` decision, packet-qualified resources, and ambiguous-input behavior. Acceptable verdicts are `PASS`, `FAIL`, or `SKIP`; every `SKIP` must name the specific runtime, credential, authorization, disposable-target, or compiled-serving blocker.

This is the hub-level operator directory for nine modes: five workflow bridges (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, and `mcp-notion`) and four read-only design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`, and `mcp-magicpath`). It validates hub-level mode resolution only; each packet owns its internal behavior tests.

The source of truth for routing is `.skilled/skills/mcp-tooling/hub-router.json`, `.skilled/skills/mcp-tooling/mode-registry.json`, and the root `ROUTER.md` surface map. The compiled route is checked first when its activation manifest is fresh; a legacy-authority or stale-manifest result is recorded rather than presented as compiled-serving evidence.

---

## 1. OVERVIEW

The hub routes an MCP tool-bridge request to one advisor identity, then resolves a `workflowMode` through the stage-one router. The root `ROUTER.md` maps that mode to the exact packet-local leaves. A scored route must not inherit the fallback `defaultResource` set.

The hub-routing fixture directory contains **18 scenario files**: 10 primary routing scenarios (one for each mode plus the ambiguous-defer contract) and 8 blind holdouts. The holdouts exercise natural-language routing for eight of ten modes; `mcp-notion` and `mcp-magicpath` remain without blind holdouts and that gap is reported honestly.

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/`.

### Primary routing (10)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-001 | [`hub-routing/chrome-devtools-browser-debug.md`](hub-routing/chrome-devtools-browser-debug.md) | `mcp-chrome-devtools` |
| MT-002 | [`hub-routing/clickup-task-management.md`](hub-routing/clickup-task-management.md) | `mcp-click-up` |
| MT-003 | [`hub-routing/figma-transport.md`](hub-routing/figma-transport.md) | `mcp-figma` |
| MT-004 | [`hub-routing/ambiguous-defer.md`](hub-routing/ambiguous-defer.md) | `defer` |
| MT-007 | [`hub-routing/aside-browser-automation.md`](hub-routing/aside-browser-automation.md) | `mcp-aside-devtools` |
| MT-008 | [`hub-routing/refero-design-reference.md`](hub-routing/refero-design-reference.md) | `mcp-refero` |
| MT-009 | [`hub-routing/mobbin-app-research.md`](hub-routing/mobbin-app-research.md) | `mcp-mobbin` |
| MT-010 | [`hub-routing/obsidian-note-management.md`](hub-routing/obsidian-note-management.md) | `mcp-obsidian` |
| MT-011 | [`hub-routing/magicpath-component-lookup.md`](hub-routing/magicpath-component-lookup.md) | `mcp-magicpath` |

### Blind holdouts (7; coverage 7/9)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-H01 | [`hub-routing/holdout-browser-inspect.md`](hub-routing/holdout-browser-inspect.md) | `mcp-chrome-devtools` |
| MT-H02 | [`hub-routing/holdout-design-tokens.md`](hub-routing/holdout-design-tokens.md) | `mcp-figma` |
| MT-H03 | [`hub-routing/holdout-task-tracking.md`](hub-routing/holdout-task-tracking.md) | `mcp-click-up` |
| MT-H04 | [`hub-routing/holdout-agentic-browser.md`](hub-routing/holdout-agentic-browser.md) | `mcp-aside-devtools` |
| MT-H05 | [`hub-routing/holdout-web-design-reference.md`](hub-routing/holdout-web-design-reference.md) | `mcp-refero` |
| MT-H06 | [`hub-routing/holdout-mobile-pattern-research.md`](hub-routing/holdout-mobile-pattern-research.md) | `mcp-mobbin` |
| MT-H07 | [`hub-routing/holdout-knowledge-base.md`](hub-routing/holdout-knowledge-base.md) | `mcp-obsidian` |

### Ownership boundaries

- **Chrome vs Aside:** developer-driven network, DOM, HAR, and performance inspection without autonomous browser language must route to `mcp-chrome-devtools`; an autonomous agentic browser task routes to `mcp-aside-devtools`.
- **Obsidian vs ClickUp:** linked markdown, vault, and knowledge-base intent routes to `mcp-obsidian`; project, ticket, task, and time-tracking intent routes to `mcp-click-up`.
- **Orca vs generic tools:** Orca CLI work is owned by the standalone `cli-orca` skill. This hub holds no Orca signal, so generic Git worktrees, ordinary shell terminals, generic Chrome/CDP, and generic agentic browser work stay with their normal owners and no Orca request can be captured here. The two retired Orca scenarios moved to `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/`.
- **MagicPath and Notion:** neither currently has a hub blind holdout, so a natural-language miss for either is a coverage gap, not a passing result.

---

## 3. SUCCESS CRITERIA

- All 18 scenarios resolve to their expected `workflowMode` or to `defer` for MT-004 and assemble exactly the expected packet-qualified resources.
- No scenario silently loads the wrong packet, a stale flat-skill path, or the fallback resource set on a scored route.
- MT-004 remains a zero-signal defer: no mode scores, no packet resources are assembled, and the fallback resources are only a defer-time suggestion.
- MT-H01 and MT-H07 preserve the Chrome/Aside and Obsidian/ClickUp boundaries, and a retired Orca holdout moved with the subject to the standalone `cli-orca` skill.
- Seven of nine modes have a passing blind holdout. The missing `mcp-notion` and `mcp-magicpath` holdouts are explicitly reported rather than inferred as coverage.
- Positive and negative alias replays cover the surviving nine modes, including a generic Git worktree prompt, generic Chrome/CDP wording, and generic agentic-browser wording, none of which may be captured by the wrong packet.
- If compiled routing is unavailable or its activation manifest is stale, the run records the legacy decision and exact cause code. It does not claim compiled parity.

---

## 4. EVIDENCE AND REPORTING

For each executed scenario, record the prompt, router command, selected `workflowMode`, expected and observed leaf pairs, command output, exit status, verdict, and any redaction or blocker check. Store current runs under a dated `benchmark/reports/<run-label>/` directory. The existing `benchmark/` Lane C reports are frozen historical evidence for an older hub and cannot serve as current hub validation.

Packet-level playbooks remain authoritative for provider behavior, credentials, mutation gates, browser state, and recovery. Orca CLI behavior is owned by the standalone `cli-orca` skill, whose manual testing playbook carries the moved scenarios.
