---
title: "439 -- Semantic Trigger Shadow and Union Modes"
description: "Manual check that semantic trigger matching stays inert by default, exposes shadow metadata when enabled, and only supplements weak lexical results in union mode."
---

# 439 -- Semantic Trigger Shadow and Union Modes

## 1. OVERVIEW

This scenario validates the semantic trigger rollout controls. Lexical trigger matching remains the primary path. The semantic stage must be absent when the master flag is unset, shadow-only when the master flag is enabled with default mode, and result-affecting only when union mode is explicitly enabled and lexical matching is weak.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm semantic trigger matching follows default-off, shadow, and gated union behavior.
- Real user request: `Validate semantic trigger matching without changing default trigger results, then prove union mode only supplements weak lexical matches.`
- Prompt: `Validate semantic trigger shadow and union modes for memory_match_triggers, including enable, verify, and disable steps.`
- Expected execution process: Run one baseline trigger call with both semantic env vars unset, run a shadow-mode call with the master flag enabled, run a union-mode call with both flags enabled and weak lexical input, then disable both flags and repeat the baseline.
- Expected signals: Baseline and final disabled runs contain lexical-only results and no semantic result promotion; shadow mode surfaces semantic metadata without changing returned results; union mode may add semantic hits only when lexical results are empty or below the requested limit and no strong exact lexical match exists.
- Desired user-visible outcome: The operator can state which mode was active, whether returned results changed, and whether disabling the flags restored lexical-only behavior.
- Pass/fail: PASS only when all four mode assertions are observed and the disabled rerun matches the baseline behavior.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate semantic trigger shadow and union modes for memory_match_triggers, including enable, verify, and disable steps.
```

### Commands

1. In a fresh terminal, unset both flags: `unset SPECKIT_SEMANTIC_TRIGGERS SPECKIT_SEMANTIC_TRIGGERS_MODE`.
2. Run `memory_match_triggers({ prompt: "semantic trigger fallback probe", limit: 5, include_cognitive: false })` and save the returned IDs plus metadata as `BASELINE`.
3. Enable shadow mode: `export SPECKIT_SEMANTIC_TRIGGERS=true`; leave `SPECKIT_SEMANTIC_TRIGGERS_MODE` unset or set to `shadow`.
4. Restart the MCP daemon or run the handler in a fresh process so the env change is loaded.
5. Repeat the same `memory_match_triggers` call and save output as `SHADOW`.
6. Enable union mode: `export SPECKIT_SEMANTIC_TRIGGERS_MODE=union`; restart the daemon or handler process again.
7. Run `memory_match_triggers({ prompt: "wording that is conceptually close to a known trigger but not an exact trigger phrase", limit: 5, include_cognitive: false })` and save output as `UNION`.
8. Disable both flags: `unset SPECKIT_SEMANTIC_TRIGGERS SPECKIT_SEMANTIC_TRIGGERS_MODE`; restart the daemon or handler process.
9. Repeat the baseline call and save output as `DISABLED`.

### Expected

- `BASELINE` and `DISABLED` use lexical matching only and do not include promoted semantic hits.
- `SHADOW` includes semantic shadow stats or trace metadata, but returned result IDs and ordering match `BASELINE` for the same prompt.
- `UNION` may include semantic hits only when lexical output is weak, below limit, or empty.
- A strong exact lexical match is not displaced by semantic results in any mode.

### Evidence

Command transcript showing env state, daemon or handler restart boundary, the four captured outputs, and a compact comparison table of result IDs plus semantic metadata fields.

### Pass / Fail

- **Pass**: default-off and disabled runs are lexical-only, shadow mode is non-result-affecting, and union mode supplements only weak lexical output.
- **Fail**: semantic matching runs while disabled, shadow mode changes returned results, union mode displaces a strong lexical match, or disabling the flags does not restore baseline behavior.

### Failure Triage

Inspect `lib/triggers/semantic-trigger-matcher.ts`, `handlers/memory-triggers.ts`, and the semantic-trigger vitest suites. Confirm the daemon process actually picked up the env changes before judging the result.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `19--feature-flag-reference/semantic-trigger-shadow-and-union.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Semantic trigger matcher implementation |
| `mcp_server/handlers/memory-triggers.ts` | Trigger handler mode integration |
| `mcp_server/tests/semantic-trigger-matcher.vitest.ts` | Semantic matcher regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 439
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/semantic-trigger-shadow-and-union.md`
