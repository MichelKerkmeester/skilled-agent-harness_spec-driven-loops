---
title: "cli-external-orchestration: Manual Testing Playbook"
description: "Operator-facing index for cli-external-orchestration hub-routing validation: does the advisor resolve cli-opencode vs cli-claude-code correctly through mode-registry.json and hub-router.json."
version: 1.4.2.0
---

# cli-external-orchestration: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `cli-external-orchestration` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `cli-external-orchestration`'s routing behavior. It covers the NEW routing surface introduced by the parent-hub fold-in (packet `125-cli-external-orchestration-parent`) — resolving `cli-opencode` vs `cli-claude-code` — not the internal dispatch behavior of either packet, which each packet's own testing material already covers (`cli-opencode/manual-testing-playbook/`, `cli-claude-code/manual-testing-playbook/`, unchanged by the fold-in).

Source of truth for routing behavior: `.skilled/skills/cli-external-orchestration/SKILL.md` §2 Smart Routing, `.skilled/skills/cli-external-orchestration/hub-router.json`.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Manual scenario completion**: a scenario is incomplete until its `PASS`, `FAIL`, or `SKIP` outcome, the
> reason and the evidence paths are recorded under
> `cli-external-orchestration/benchmark/reports/<dated-run-label>/`.

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

Scenarios live as per-file YAML-frontmatter typed gold under `hub-routing/`. Each scenario's `expected_resources` paths are written relative to the hub root, `.skilled/skills/cli-external-orchestration/` — not to the repository root §4 uses for commands, and not to the scenario's own directory:

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| CE-001 | `hub-routing/opencode-full-runtime-dispatch.md` | `cli-opencode` (opencode run / full-runtime dispatch signal) |
| CE-002 | `hub-routing/claude-code-second-opinion.md` | `cli-claude-code` (Anthropic-backed / deep-reasoning signal) |
| CE-003 | `hub-routing/ambiguous-defer.md` | `defer` (no strong executor signal — router asks, does not silently default) |

A separate, non-scored functional check: the executor-delegation scorer (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts`) must resolve a direct-alias or orchestrator-cue delegation prompt to the executor-kind string `cli-opencode` or `cli-claude-code`, never to the non-executor hub identity `cli-external-orchestration` — verified by `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json`, not part of this scored corpus.

### Plugins And Hooks

Unscored, directly-run manual scenarios validating shared `cli-external-orchestration` plugin/hook infrastructure (not `workflowMode` routing, so not part of the scored hub-routing corpus above) live under `plugins-and-hooks/`:

| ID | Scenario | File |
| --- | --- | --- |
| cli-dispatch-audit-trail | CLI Dispatch Audit Trail | [cli-dispatch-audit-trail.md](plugins-and-hooks/cli-dispatch-audit-trail.md) |
| cli-dispatch-preflight-authorization | CLI Dispatch Preflight Authorization | [cli-dispatch-preflight-authorization.md](plugins-and-hooks/cli-dispatch-preflight-authorization.md) |
| codex-hook-parity | Codex Hook/Plugin Parity | [codex-hook-parity.md](plugins-and-hooks/codex-hook-parity.md) |
| goal-manage-cli | Goal Manage CLI: Session Isolation And Legacy Cutover | [goal-manage-cli.md](plugins-and-hooks/goal-manage-cli.md) |

### Fanout Stress

Hermetic operator scenarios for the shared fan-out runner live under `fanout-stress/`. Each one runs a single manifest-indexed Vitest case against shim providers and carries the five-section operator contract, so none of them is a routing-gold file:

| Matrix cell | Scenario | File |
| --- | --- | --- |
| fanout-run:EC-001 | fanout-run authentication failure | [auth-failure.md](fanout-stress/auth-failure.md) |
| fanout-run:EC-002 | fanout-run model or balance failure | [model-or-balance.md](fanout-stress/model-or-balance.md) |
| fanout-run:EC-003 | fanout-run rate limit | [rate-limit.md](fanout-stress/rate-limit.md) |
| fanout-run:EC-004 | fanout-run timeout | [timeout.md](fanout-stress/timeout.md) |
| fanout-run:EC-005 | fanout-run stdin closure | [stdin-hang.md](fanout-stress/stdin-hang.md) |
| fanout-run:EC-006 | fanout-run child spec gate | [child-spec-gate.md](fanout-stress/child-spec-gate.md) |
| fanout-run:EC-007 | fanout-run sandbox or permission | [sandbox-permission.md](fanout-stress/sandbox-permission.md) |
| fanout-run:EC-008 | fanout-run missing transport | [transport-missing.md](fanout-stress/transport-missing.md) |
| fanout-run:EC-009 | fanout-run budget rejection | [budget-rejection.md](fanout-stress/budget-rejection.md) |
| fanout-run:EC-010 | fanout-run partial lineage death | [partial-lineage-death.md](fanout-stress/partial-lineage-death.md) |
| fanout-run:EC-011 | fanout-run orphan cleanup | [orphan-cleanup.md](fanout-stress/orphan-cleanup.md) |
| fanout-run:EC-012 | fanout-run worktree collision | [worktree-collision.md](fanout-stress/worktree-collision.md) |
| fanout-run:EC-013 | fanout-run node modules integrity | [node-modules-integrity.md](fanout-stress/node-modules-integrity.md) |
| fanout-run:EC-014 | fanout-run self invocation | [self-invocation.md](fanout-stress/self-invocation.md) |

---

## 6. SUCCESS CRITERIA

- All 3 scenarios resolve to their expected `workflowMode` (or `defer`) and load the expected packet `SKILL.md`.
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.
- The genuinely ambiguous scenario (CE-003) does not silently default to `cli-opencode`.

---

## 7. RELATED

- Packet-level playbooks: `cli-opencode/manual-testing-playbook/manual-testing-playbook.md`, `cli-claude-code/manual-testing-playbook/manual-testing-playbook.md` (unchanged by the fold-in).
- Benchmark tree: `benchmark/` (the retired Lane C harness left no run here; the tree now carries the compiled-routing archive convention).
- Plugins-and-hooks scenarios (§5): each carries its own PASS/FAIL verdict independent of the hub-routing success criteria in §6, which scopes to `workflowMode` resolution only.
