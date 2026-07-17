---
title: "FLOWS-001 -- Numeric-ID Flow Detail"
description: "This scenario validates flow research for `FLOWS-001`: platform-scoped flow search, numeric-ID detail retrieval, ordered steps, and sparse-flow reconstruction honestly reported as inference."
version: 1.0.0.0
---

# FLOWS-001 -- Numeric-ID Flow Detail

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FLOWS-001`.

---

## 1. OVERVIEW

This scenario validates flow research for `FLOWS-001`. It focuses on confirming a flow search plus detail retrieval respects the numeric ID typing (never UUIDs), the required `platform` argument, and the sparse-flow rule: broaden the query or reconstruct the journey from screens, with any reconstruction reported as inference.

### Why This Matters

Flows are the one numeric layer in an otherwise UUID-typed surface, and mixing the typings is a documented hard constraint violation. The sparse-flow rule is the packet's epistemic-honesty discipline in miniature: a reconstructed journey presented as retrieved fact is a fabricated capability claim.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `FLOWS-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm flow typing, platform scoping, and honest sparse handling
- Real user request: `Show me how real products run a subscription-cancellation journey on the web.`
- Prompt: `Show me how real products run a subscription-cancellation journey on the web.`
- Expected execution process: `refero_refero_search_flows` with `platform: "web"` -> one relevant **numeric** flow -> `refero_refero_get_flow` -> ordered steps reported; on sparse results, broaden or reconstruct from screens with the reconstruction labeled inference
- Expected signals: numeric flow IDs in search results; ordered steps with goal, action, and system response; any reconstruction explicitly labeled
- Desired user-visible outcome: an evidence-backed journey narrative (or an auth/plan SKIP), with inference never presented as retrieved fact
- Pass/fail: PASS if numeric typing held AND platform was passed AND sparse handling (if triggered) was labeled inference; FAIL if a UUID was passed to `get_flow` OR reconstruction was presented as fact; SKIP with the documented auth/plan blocker

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval runs in this transport.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (authenticated Pro or higher). Otherwise SKIP with the documented auth/plan blocker.

1. `refero.refero_refero_search_flows({ query: "cancel subscription", platform: "web", response_format: "json" })`  # -> summaries with NUMERIC flow IDs
2. `refero.refero_refero_get_flow({ flow_id: <number> })`  # -> ordered steps (goal / action / system response)
3. agent reports the journey, widening via `related_queries` if needed  # -> reconstruction (if any) labeled inference

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FLOWS-001 | Flow detail | Verify numeric flow IDs, platform scoping, and honest sparse handling | `Show me how real products run a subscription-cancellation journey on the web.` | 1. search flows (platform web) -> 2. `get_flow` on a numeric ID -> 3. ordered steps reported | Step 1: numeric IDs. Step 2: ordered steps with goals/actions/responses. Step 3: sparse path handled per the rule | Call transcript with the numeric ID visible; the step narrative; any inference label | PASS if numeric typing held AND platform passed AND sparse handling labeled inference. FAIL if a UUID was passed to get_flow OR reconstruction presented as fact. SKIP with the auth/plan blocker documented | 1. Confirm the ID type. 2. Confirm `platform` was passed. 3. Confirm the inference label on any reconstruction. |

### Optional Supplemental Checks

If a multi-flow batch is used, note the local batch-of-10 observation is a heuristic, not a published contract; on a batch failure the recovery is fewer IDs. Step screen UUIDs inside a flow may feed `refero_get_screen` follow-ups, which switches back to UUID typing; verify the switch happened correctly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/flows/flows.md` | Feature-catalog source for the flows layer |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The numeric-ID rule, flow contract, and the sparse-flow discipline |
| `../../references/troubleshooting.md` | The sparse-results and batch-failure recovery paths |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: FLOWS-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/flow-detail.md`
