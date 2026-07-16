---
title: "PLATFORM-001 -- Platform Filter Discipline (ios vs web)"
description: "This scenario validates platform-filter behavior for `PLATFORM-001`. It focuses on the platform enum being exactly ios or web, inferred from app context or asked when unclear, never guessed silently and never invented beyond the documented enum, with cross-platform comparison run as one call per platform value."
version: 1.1.0.0
---

# PLATFORM-001 -- Platform Filter Discipline (ios vs web)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PLATFORM-001`.

---

## 1. OVERVIEW

This scenario validates platform-filter behavior for `PLATFORM-001`. It focuses on the documented `platform` contract from the research record: the value is the enum `ios` | `web` and nothing else (no `android`, no `all`, no omission games), it is **inferred from app context** when the request implies one ("iPhone banking apps" -> `ios`; "SaaS dashboard" -> `web`) and **asked** when the context is genuinely ambiguous, and a cross-platform comparison runs as one `search_screens` call per platform value — never a single call with an invented combined filter.

### Why This Matters

The platform filter is where the research workflows meet the schema honesty rules. The official operating sequence makes infer-or-ask an explicit step, and the enum is part of the documented baseline: an agent that passes `android`, omits the field on a platform-specific request, or fabricates an `all` value has left the documented record exactly the way inventing `search_apps` would. Cross-platform work also doubles the number of calls, which makes this scenario the natural place to observe the rate-limit budget in practice.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `PLATFORM-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the platform enum discipline, the infer-or-ask step, and the per-platform call pattern for comparisons
- Real user request: `Compare how subscription paywalls look on mobile apps versus web apps.`
- Prompt: `Compare how subscription paywalls look on mobile apps versus web apps.`
- Expected execution process: confirmed callable (DISCOVER-001 live PASS) -> the agent recognizes the two-platform comparison -> one `search_screens` call with `platform: "ios"` and one with `platform: "web"`, same query shape, `limit: 5` each -> results compared side by side through `app_name`/`platform` metadata and inline images -> cited evidence returned per platform
- Expected signals: exactly two calls, each with a valid enum value; no `android`/`all`/omitted platform; if the user's request had been ambiguous ("show me paywalls"), the agent asks instead of guessing; both `failed[]` lists reported
- Desired user-visible outcome: a two-column comparison grounded in cited screens per platform (or a session/auth SKIP), never a design verdict
- Pass/fail: PASS if only documented enum values were used AND the infer-or-ask step was visible AND comparison ran per platform; FAIL if a platform value was invented, silently guessed on an ambiguous request, or both platforms were claimed from a single call; SKIP with the session/auth blocker documented

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval stays local; judgment (if requested) routes to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (fresh Code Mode session, operator OAuth on a paid account). Otherwise SKIP with the blocker documented; the infer-or-ask contract half is still gradable from the agent's plan.

1. `tool_info` confirmation of the live callable  # -> schema on the live name
2. `mobbin.mobbin_search_screens({ query: "subscription paywall", platform: "ios", limit: 5 })`  # -> ios screens[] + failed[]
3. `mobbin.mobbin_search_screens({ query: "subscription paywall", platform: "web", limit: 5 })`  # -> web screens[] + failed[]
4. side-by-side comparison, cited per `mobbin_url`, both `failed[]` lists reported  # -> no verdict

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PLATFORM-001 | Platform filter discipline | Verify the ios/web enum, infer-or-ask, and per-platform comparison calls | `Compare how subscription paywalls look on mobile apps versus web apps.` | 1. `tool_info` -> 2. ios call -> 3. web call -> 4. cited two-platform comparison | Steps 2-3: valid enum values only, one call per platform. Step 4: citations + both failed[] reports | Call transcript showing both platform values; citation list; failed[] reports | PASS if enum discipline held AND comparison ran per platform AND ambiguity (if present) was asked about. FAIL if a platform value was invented or guessed silently. SKIP with the session/auth blocker documented | 1. Confirm the platform values used. 2. Confirm one call per platform. 3. Confirm the infer-or-ask step on ambiguous phrasing. |

### Optional Supplemental Checks

Run the ambiguous variant `"Show me great paywall designs"` and confirm the agent asks for the platform instead of defaulting. A silent default is a FAIL of the official operating sequence even when the returned evidence happens to be useful.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/screens/screens.md` | The screen-search contract the platform filter shapes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The `platform` enum, the infer-or-ask rule, and the official operating sequence |
| `../../references/mcp-wiring.md` | The discovery-first contract this scenario depends on |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: PLATFORM-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `read-only/platform-filter.md`
