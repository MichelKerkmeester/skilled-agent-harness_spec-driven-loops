---
id: SD-009
category: 03--unknown-fallback
title: 'FEATURE_CATALOG vs PLAYBOOK tie within delta=1'
expected_intent: FEATURE_CATALOG+PLAYBOOK
expected_resources:
  - references/feature_catalog_creation.md
  - references/manual_testing_playbook_creation.md
expected_token_range_input: 1000-2000
expected_token_range_output: 1000-2500
created: 2026-05-05
version: 1.8.0.7
---

# SD-009: Disambiguation Required (FEATURE_CATALOG ↔ PLAYBOOK)

## 1. OVERVIEW

This scenario validates FEATURE_CATALOG and PLAYBOOK disambiguation for `SD-009`. It focuses on a prompt that asks for catalog entries and playbook scenario documentation in the same request.

### Why This Matters

Feature catalogs and manual playbooks are related but have different file shapes and validation contracts. This scenario catches routing that collapses the two modes into one answer without asking which artifact should be primary or loading both relevant guidance sets.

---

## 2. SCENARIO CONTRACT

- Real user request: `Build a feature catalog for the playbook system and document each scenario as a catalog entry.`
- Prompt: `Build a feature catalog for the playbook system and document each scenario as a catalog entry.`
- Expected intent: `FEATURE_CATALOG+PLAYBOOK`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-009 | FEATURE_CATALOG vs PLAYBOOK tie within delta=1 | Verify sk-doc routes the scenario to `FEATURE_CATALOG+PLAYBOOK` with the expected resources. | `Build a feature catalog for the playbook system and document each scenario as a catalog entry.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `FEATURE_CATALOG+PLAYBOOK`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Build a feature catalog for the playbook system and document each scenario as a catalog entry.
```

## Expected Behavior

- **Intent picked**: `FEATURE_CATALOG` and `PLAYBOOK` both score high; gap within `AMBIGUITY_DELTA=1`.
- **Resources loaded**: top-2 candidates returned; CLI either disambiguates or loads both intents' references.
- **Outcome**: CLI surfaces both candidate intents with scores, OR proceeds with the more specific one (`FEATURE_CATALOG`) but loads PLAYBOOK reference too.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: may silently pick top-1 — verify both are scored.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact tie-resolution; verify resource list.

## Success Criteria

- both `FEATURE_CATALOG` and `PLAYBOOK` appear in top-2 within delta=1
- response either disambiguates OR loads both expected_resources
- false_positive_resource_load_count <= 2

## 4. SOURCE METADATA

- Group: Unknown Fallback
- Playbook ID: SD-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--unknown-fallback/disambiguation-required.md`
