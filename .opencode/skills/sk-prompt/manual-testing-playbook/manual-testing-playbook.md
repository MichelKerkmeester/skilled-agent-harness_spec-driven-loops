---
title: "sk-prompt: Manual Testing Playbook"
description: "Operator-facing index for sk-prompt hub-routing validation: does the advisor resolve prompt-improve vs prompt-models correctly through mode-registry.json and hub-router.json."
version: 1.0.0.0
---

# sk-prompt: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `sk-prompt` hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the hub router picks (per `hub-router.json` `routerSignals`/`vocabularyClasses`), which packet it loads, and how it behaves under ambiguous or model-specific input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the hub-level operator directory for `sk-prompt`'s routing behavior. It covers the NEW routing surface introduced by the parent-hub fold-in (packet 124) — resolving `prompt-improve` vs `prompt-models` — not the internal behavior of either packet, which each packet's own testing material already covers (`prompt-improve/manual-testing-playbook/`, 27 pre-existing scenarios covering mode detection, DEPTH/CLEAR, framework selection, and format modes).

Source of truth for routing behavior: `.opencode/skills/sk-prompt/SKILL.md` §2 Smart Routing, `.opencode/skills/sk-prompt/hub-router.json`.

---

## 1. OVERVIEW

The `sk-prompt` hub routes any prompt-engineering request to exactly one advisor identity, then resolves `workflowMode` to `prompt-improve` or `prompt-models` via `hub-router.json`. This playbook validates that resolution, not either packet's internal pipeline.

---

## 2. SCENARIOS

Scored scenarios live as per-file YAML-frontmatter gold under `hub-routing/` (the sk-doc shape the Lane-C skill-benchmark loader reads):

| ID | File | Expected `workflowMode` |
|----|------|--------------------------|
| SP-001 | `hub-routing/generic-prompt-improve.md` | `prompt-improve` (default mode, no model named) |
| SP-002 | `hub-routing/named-model-prompt-models.md` | `prompt-models` (DeepSeek-v4-pro named) |
| SP-003 | `hub-routing/ambiguous-default.md` | `prompt-improve` (model-adjacent vocabulary, no model id) |
| SP-004 | `hub-routing/second-model-glm.md` | `prompt-models` (GLM-5.2 named — confirms the signal generalizes beyond one example model) |

A separate, non-scored functional check: `/prompt-improve "Write a blog post about AI"` should read `.opencode/skills/sk-prompt/prompt-improve/SKILL.md` (not the hub's own thin `SKILL.md`) — verified directly in phase 004, not part of this scored corpus.

---

## 3. SUCCESS CRITERIA

- All 4 scenarios resolve to their expected `workflowMode` and load the expected packet `SKILL.md`.
- No scenario silently loads the wrong packet or falls through to a stale flat-skill path.

---

## 4. RELATED

- Packet-level playbook: `prompt-improve/manual-testing-playbook/manual-testing-playbook.md` (27 scenarios, unchanged by the fold-in).
- Lane-C automated benchmark: `benchmark/` (populated by phase 007 of the `124-sk-prompt-parent` program).
