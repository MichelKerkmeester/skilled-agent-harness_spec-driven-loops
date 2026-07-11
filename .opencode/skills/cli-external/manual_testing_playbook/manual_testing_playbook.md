---
title: "cli-external: Manual Testing Playbook"
description: "Operator-facing index for cli-external hub-routing validation: does the advisor resolve cli-opencode vs cli-claude-code correctly through mode-registry.json and hub-router.json."
version: 1.0.0.0
---

# cli-external: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `cli-external` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `cli-external`'s routing behavior. It covers the NEW routing surface introduced by the parent-hub fold-in (packet `125-cli-external-parent`) — resolving `cli-opencode` vs `cli-claude-code` — not the internal dispatch behavior of either packet, which each packet's own testing material already covers (`cli-opencode/manual_testing_playbook/`, `cli-claude-code/manual_testing_playbook/`, unchanged by the fold-in).

Source of truth for routing behavior: `.opencode/skills/cli-external/SKILL.md` §2 Smart Routing, `.opencode/skills/cli-external/hub-router.json`.

---

## 1. OVERVIEW

The `cli-external` hub routes any external-CLI-dispatch request to exactly one advisor identity, then resolves `workflowMode` to `cli-opencode` or `cli-claude-code` via `hub-router.json`. This playbook validates that resolution, not either packet's internal dispatch pipeline.

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads):

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| CE-001 | `hub-routing/001-opencode-full-runtime-dispatch.md` | `cli-opencode` (opencode run / full-runtime dispatch signal) |
| CE-002 | `hub-routing/002-claude-code-second-opinion.md` | `cli-claude-code` (Anthropic-backed / deep-reasoning signal) |
| CE-003 | `hub-routing/003-ambiguous-defer.md` | `defer` (no strong executor signal — router asks, does not silently default) |

A separate, non-scored functional check: the executor-delegation scorer (`system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts`) must resolve a direct-alias or orchestrator-cue delegation prompt to the executor-kind string `cli-opencode` or `cli-claude-code`, never to the non-executor hub identity `cli-external` — verified by `tests/scorer/executor-delegation.vitest.ts` and `tests/parity/fixtures/executor-delegation-cases.json`, not part of this scored corpus.

---

## 3. SUCCESS CRITERIA

- All 3 scenarios resolve to their expected `workflowMode` (or `defer`) and load the expected packet `SKILL.md`.
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.
- The genuinely ambiguous scenario (CE-003) does not silently default to `cli-opencode`.

---

## 4. RELATED

- Packet-level playbooks: `cli-opencode/manual_testing_playbook/manual_testing_playbook.md`, `cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` (unchanged by the fold-in).
- Lane-C automated benchmark: `benchmark/` (populated by a future benchmark pass — out of scope for the fold-in itself).
