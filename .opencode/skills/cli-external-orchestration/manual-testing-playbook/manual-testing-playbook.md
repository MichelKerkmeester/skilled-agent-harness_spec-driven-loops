---
title: "cli-external-orchestration: Manual Testing Playbook"
description: "Operator-facing index for cli-external-orchestration hub-routing validation: does the advisor resolve cli-opencode vs cli-claude-code correctly through mode-registry.json and hub-router.json."
version: 1.0.0.0
---

# cli-external-orchestration: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `cli-external-orchestration` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `cli-external-orchestration`'s routing behavior. It covers the NEW routing surface introduced by the parent-hub fold-in (packet `125-cli-external-orchestration-parent`) — resolving `cli-opencode` vs `cli-claude-code` — not the internal dispatch behavior of either packet, which each packet's own testing material already covers (`cli-opencode/manual-testing-playbook/`, `cli-claude-code/manual-testing-playbook/`, unchanged by the fold-in).

Source of truth for routing behavior: `.opencode/skills/cli-external-orchestration/SKILL.md` §2 Smart Routing, `.opencode/skills/cli-external-orchestration/hub-router.json`.

---

## 1. OVERVIEW

The `cli-external-orchestration` hub routes external CLI dispatch requests through `hub-router.json`. This playbook validates the retained hub-routing corpus and carries a `plugins-and-hooks/` category of directly-run shared infrastructure scenarios — see §5 Plugins And Hooks.

---

## 2. GLOBAL PRECONDITIONS

- Run from the repository root against the live mode registry and hub router.
- Keep mutation-capable executor scenarios inside disposable workspaces or their approved spec scope.
- Confirm the requested executor is not self-dispatching from inside the same runtime.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Capture the exact request, resolved workflow mode, loaded packet, command, exit status, and relevant output.
- Use PASS, PARTIAL, FAIL, or SKIP with a named blocker; never infer success from model prose alone.
- Preserve source/config/test evidence for directly-run plugin and hook scenarios.

---

## 4. DETERMINISTIC COMMAND NOTATION

Commands are shown from the repository root. Replace angle-bracket placeholders before execution, quote paths and prompts, and keep temporary state under a fresh `mktemp -d` directory.

---

## 5. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads):

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| CE-001 | `hub-routing/opencode-full-runtime-dispatch.md` | `cli-opencode` (opencode run / full-runtime dispatch signal) |
| CE-002 | `hub-routing/claude-code-second-opinion.md` | `cli-claude-code` (Anthropic-backed / deep-reasoning signal) |
| CE-003 | `hub-routing/ambiguous-defer.md` | `defer` (no strong executor signal — router asks, does not silently default) |

A separate, non-scored functional check: the executor-delegation scorer (`system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`) must resolve a direct-alias or orchestrator-cue delegation prompt to the executor-kind string `cli-opencode` or `cli-claude-code`, never to the non-executor hub identity `cli-external-orchestration` — verified by `tests/scorer/executor-delegation.vitest.ts` and `tests/parity/fixtures/executor-delegation-cases.json`, not part of this scored corpus.

### Plugins And Hooks

Unscored, directly-run manual scenarios validating shared `cli-external-orchestration` plugin/hook infrastructure (not `workflowMode` routing, so not part of the scored hub-routing corpus above) live under `plugins-and-hooks/`:

| ID | Scenario | File |
| --- | --- | --- |
| cli-dispatch-audit-trail | CLI Dispatch Audit Trail | [cli-dispatch-audit-trail.md](../manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md) |
| cli-dispatch-preflight-authorization | CLI Dispatch Preflight Authorization | [cli-dispatch-preflight-authorization.md](../manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md) |
| codex-hook-parity | Codex Hook/Plugin Parity | [codex-hook-parity.md](../manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md) |
| goal-manage-cli | Goal Manage CLI: Session Isolation And Legacy Cutover | [goal-manage-cli.md](../manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md) |

---

## 6. SUCCESS CRITERIA

- All 3 scenarios resolve to their expected `workflowMode` (or `defer`) and load the expected packet `SKILL.md`.
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.
- The genuinely ambiguous scenario (CE-003) does not silently default to `cli-opencode`.

---

## 7. RELATED

- Packet-level playbooks: `cli-opencode/manual-testing-playbook/manual-testing-playbook.md`, `cli-claude-code/manual-testing-playbook/manual-testing-playbook.md` (unchanged by the fold-in).
- Lane-C automated benchmark: `benchmark/` (populated by a future benchmark pass — out of scope for the fold-in itself).
- Plugins-and-hooks scenarios (§5): each carries its own PASS/FAIL verdict independent of the hub-routing success criteria in §6, which scopes to `workflowMode` resolution only.
