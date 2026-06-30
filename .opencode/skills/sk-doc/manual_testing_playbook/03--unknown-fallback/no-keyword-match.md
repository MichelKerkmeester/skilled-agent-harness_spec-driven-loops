---
id: SD-008
category: 03--unknown-fallback
title: 'No-keyword prompt triggers UNKNOWN_FALLBACK_CHECKLIST'
expected_intent: UNKNOWN
expected_resources: []
expected_token_range_input: 500-1500
expected_token_range_output: 500-1500
created: 2026-05-05
version: 1.8.0.6
---

# SD-008: UNKNOWN Fallback (Zero Keyword Match)

## 1. OVERVIEW

This scenario validates UNKNOWN fallback handling for `SD-008`. It focuses on routing an unrelated weather prompt away from sk-doc resource families without pretending a documentation intent exists.

### Why This Matters

Routers need a clean abstain path for prompts outside their domain. This scenario catches keyword overreach, spurious resource loading, and confident but unsupported sk-doc recommendations for non-documentation requests.

---

## 2. SCENARIO CONTRACT

- Real user request: `Tell me about the weather.`
- Prompt: `Tell me about the weather.`
- Expected intent: `UNKNOWN`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-008 | No-keyword prompt triggers UNKNOWN_FALLBACK_CHECKLIST | Verify sk-doc routes the scenario to `UNKNOWN` with the expected resources. | `Tell me about the weather.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `UNKNOWN`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Tell me about the weather.
```

## Expected Behavior

- **Intent picked**: none (all intent scores == 0)
- **Resources loaded**: none from `RESOURCE_MAP`; CLI returns `UNKNOWN_FALLBACK_CHECKLIST` with `needs_disambiguation=true`.
- **Outcome**: CLI does NOT proceed with any documentation work. It surfaces the fallback checklist and asks the user to specify a documentation intent (or rejects the prompt as out-of-scope for sk-doc).

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: may try to answer the literal weather question — verify it instead emits the fallback.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: emits short refusal + fallback checklist.

## Success Criteria

- intent_picked == `UNKNOWN` (no intent above zero)
- needs_disambiguation flag is true OR CLI asks for clarification
- false_positive_resource_load_count == 0 (no RESOURCE_MAP load)

## 4. SOURCE METADATA

- Group: Unknown Fallback
- Playbook ID: SD-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--unknown-fallback/no-keyword-match.md`
