---
title: "mcp-tooling: Manual Testing Playbook"
description: "Operator-facing index for mcp-tooling hub-routing validation across six modes: three workflow bridges, three read-only design transports, five blind holdouts, and the generic-tool ownership boundaries."
version: 1.2.3.0
---

# mcp-tooling: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `mcp-tooling` routing contract — no mocks or stubs. Scenarios verify the hub's actual `workflowMode` decision, packet-qualified resources, and ambiguous-input behavior. Acceptable verdicts are `PASS`, `FAIL`, or `SKIP`; every `SKIP` must name the specific runtime, credential, authorization, disposable-target, or compiled-serving blocker.

This is the hub-level operator directory for six modes: three workflow bridges (`mcp-click-up`, `mcp-obsidian`, and `mcp-notion`) and three read-only design transports (`mcp-figma`, `mcp-refero`, and `mcp-mobbin`). It validates hub-level mode resolution only; each packet owns its internal behavior tests.

The source of truth for routing is `.skilled/skills/mcp-tooling/hub-router.json`, `.skilled/skills/mcp-tooling/mode-registry.json`, and the root `ROUTER.md` surface map. The compiled route is checked first when its activation manifest is fresh; a legacy-authority or stale-manifest result is recorded rather than presented as compiled-serving evidence.

---

## 1. OVERVIEW

The hub routes an MCP tool-bridge request to one advisor identity, then resolves a `workflowMode` through the stage-one router. The root `ROUTER.md` maps that mode to the exact packet-local leaves. A scored route must not inherit the fallback `defaultResource` set.

The hub-routing fixture directory contains **12 scenario files**: 7 primary routing scenarios (one for each of the six modes plus the ambiguous-defer contract) and 5 blind holdouts. The holdouts exercise natural-language routing for five of six modes; `mcp-notion` has a primary scenario but no blind holdout, because every word of its vocabulary names Notion, and that gap is reported honestly.

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/`.

### Primary routing (7)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-002 | [`hub-routing/clickup-task-management.md`](hub-routing/clickup-task-management.md) | `mcp-click-up` |
| MT-003 | [`hub-routing/figma-transport.md`](hub-routing/figma-transport.md) | `mcp-figma` |
| MT-004 | [`hub-routing/ambiguous-defer.md`](hub-routing/ambiguous-defer.md) | `defer` |
| MT-008 | [`hub-routing/refero-design-reference.md`](hub-routing/refero-design-reference.md) | `mcp-refero` |
| MT-009 | [`hub-routing/mobbin-app-research.md`](hub-routing/mobbin-app-research.md) | `mcp-mobbin` |
| MT-010 | [`hub-routing/obsidian-note-management.md`](hub-routing/obsidian-note-management.md) | `mcp-obsidian` |
| MT-011 | [`hub-routing/notion-workspace-data.md`](hub-routing/notion-workspace-data.md) | `mcp-notion` |

### Blind holdouts (5; coverage 5/6)

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| MT-H02 | [`hub-routing/holdout-design-tokens.md`](hub-routing/holdout-design-tokens.md) | `mcp-figma` |
| MT-H03 | [`hub-routing/holdout-task-tracking.md`](hub-routing/holdout-task-tracking.md) | `mcp-click-up` |
| MT-H05 | [`hub-routing/holdout-web-design-reference.md`](hub-routing/holdout-web-design-reference.md) | `mcp-refero` |
| MT-H06 | [`hub-routing/holdout-mobile-pattern-research.md`](hub-routing/holdout-mobile-pattern-research.md) | `mcp-mobbin` |
| MT-H07 | [`hub-routing/holdout-knowledge-base.md`](hub-routing/holdout-knowledge-base.md) | `mcp-obsidian` |

### Ownership boundaries

- **Browser work:** Chrome DevTools and Aside scenarios left this hub with their packets. The `mcp-browser-use` hub owns them, and this hub holds no browser signal.
- **Obsidian vs ClickUp:** linked markdown, vault, and knowledge-base intent routes to `mcp-obsidian`; project, ticket, task, and time-tracking intent routes to `mcp-click-up`.
- **Orca vs generic tools:** Orca CLI work is owned by the standalone `cli-orca` skill. This hub holds no Orca signal, so generic Git worktrees, ordinary shell terminals, generic Chrome/CDP, and generic agentic browser work stay with their normal owners and no Orca request can be captured here. The two retired Orca scenarios moved to `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/`.

---

## 3. SUCCESS CRITERIA

- All 12 scenarios resolve to their expected `workflowMode` or to `defer` for MT-004 and assemble exactly the expected packet-qualified resources.
- No scenario silently loads the wrong packet, a stale flat-skill path, or the fallback resource set on a scored route.
- MT-004 remains a zero-signal defer: no mode scores, no packet resources are assembled, and the fallback resources are only a defer-time suggestion.
- MT-H07 preserves the Obsidian/ClickUp boundary, and a retired Orca holdout moved with the subject to the standalone `cli-orca` skill.
- Five of six modes have a passing blind holdout. The missing `mcp-notion` holdout is explicitly reported rather than inferred as coverage.
- Positive and negative alias replays cover the surviving six modes, including a generic Git worktree prompt, generic Chrome/CDP wording, and generic agentic-browser wording, none of which may be captured by the wrong packet.
- If compiled routing is unavailable or its activation manifest is stale, the run records the legacy decision and exact cause code. It does not claim compiled parity.

---

## 4. EVIDENCE AND REPORTING

For each executed scenario, record the prompt, router command, selected `workflowMode`, expected and observed leaf pairs, command output, exit status, verdict, and any redaction or blocker check. Store current runs under a dated `benchmark/reports/<run-label>/` directory. The existing `benchmark/` Lane C reports are frozen historical evidence for an older hub and cannot serve as current hub validation.

Packet-level playbooks remain authoritative for provider behavior, credentials, mutation gates, browser state, and recovery. Orca CLI behavior is owned by the standalone `cli-orca` skill, whose manual testing playbook carries the moved scenarios.
