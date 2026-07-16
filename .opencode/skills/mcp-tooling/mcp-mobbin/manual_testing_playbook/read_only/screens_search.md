---
title: "SCREENS-001 -- Screen Search Contract And Citation Discipline"
description: "This scenario validates the read-only search contract for `SCREENS-001`. It focuses on the documented query/platform/limit inputs, mobbin_url citation discipline, honest failed[] reporting, preserved unknown fields, and the absence of invented tools or parameters."
version: 1.1.0.0
---

# SCREENS-001 -- Screen Search Contract And Citation Discipline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SCREENS-001`.

---

## 1. OVERVIEW

This scenario validates the read-only search contract for `SCREENS-001`. It focuses on one screen-intent `search_screens` call honoring the documented inputs (`query` from the user's words, `platform` inferred or asked, `limit` starting at 5 and never exceeding ~15 without asking), on every used reference being cited by its `mobbin_url`, on `failed[]` entries and missing images being reported as partial success, on unknown response fields being preserved, and on no invented tool or parameter (including the disputed `deep`) appearing anywhere.

### Why This Matters

The single-tool surface invites over-reach: an agent that fabricates `search_apps` or hardcodes `deep` has left the documented record. And citation discipline is what makes transport output usable as evidence downstream — an uncited screen cannot anchor an `sk-design` critique.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `SCREENS-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the single-tool search contract and citation discipline
- Real user request: `Find real iOS banking onboarding screens with identity verification.`
- Prompt: `Find real iOS banking onboarding screens with identity verification.`
- Expected execution process: confirmed callable (DISCOVER-001 live PASS) -> one `search_screens` call with `query`, `platform: "ios"`, `limit: 5` -> visual inspection of the returned references (content, structure, styling, interaction) -> evidence returned with `mobbin_url` citations and the `failed[]` report; if design-affecting, routed onward through `sk-design`
- Expected signals: `screens[]` records with the documented fields; inline images correlated by `index`; no `deep` parameter; no widening beyond ~15 without asking; unknown fields preserved
- Desired user-visible outcome: cited screen evidence (or a session/auth SKIP), never a design decision
- Pass/fail: PASS if the input contract held AND all evidence was cited AND partial success was reported honestly AND nothing was invented; FAIL if `deep` was hardcoded, a tool was invented, or a design verdict came from the transport; SKIP with the session/auth blocker documented

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval stays local; judgment (if requested) routes to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (registered manual, operator OAuth on a paid account). Otherwise SKIP with the blocker documented.

1. `tool_info` confirmation of the live callable (from DISCOVER-001)  # -> schema on the live name
2. `mobbin.mobbin_search_screens({ query: "banking app onboarding identity verification", platform: "ios", limit: 5 })` (live name from step 1)  # -> screens[] + failed[] + inline images
3. visual inspection of returned references  # -> observations tied to specific screens
4. evidence returned: citations by `mobbin_url`, failed[] report, account plan noted  # -> no verdict

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCREENS-001 | Screen search contract | Verify query/platform/limit discipline, citations, and honest partial success | `Find real iOS banking onboarding screens with identity verification.` | 1. `tool_info` -> 2. search call (documented inputs) -> 3. visual inspection -> 4. cited evidence + failed[] | Step 2: documented inputs only. Step 3: images correlated by index. Step 4: every claim cites a `mobbin_url` | Call transcript, citation list, failed[] report, account plan | PASS if the contract held AND citations complete AND nothing invented. FAIL if `deep` hardcoded, a tool invented, or a verdict issued. SKIP with the blocker documented | 1. Confirm the inputs used. 2. Confirm citations + failed[]. 3. Confirm no invented parameter or verdict. |

### Optional Supplemental Checks

If inline images do not arrive through `call_tool_chain`, that is a dated live finding on the packet's open image-fidelity question: report the gap (metadata-only partial success) rather than fabricating an image tool or a side-channel on the spot.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/screens/screens.md` | The screen-intent capability this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool_surface.md` | Inputs, response shape, context discipline, and the `deep` conflict |
| `../../references/mcp_wiring.md` | The discovery-first contract this scenario depends on |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: SCREENS-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `read_only/screens_search.md`
