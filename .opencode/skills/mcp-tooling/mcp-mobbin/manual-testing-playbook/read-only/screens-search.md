---
title: "SCREENS-001 -- Screen Search Contract And Citation Discipline"
description: "This scenario validates the read-only search contract for `SCREENS-001`. It focuses on the documented query/platform/limit inputs, mobbin_url citation discipline, honest failed[] reporting, preserved unknown fields, and the absence of invented tools or parameters."
version: 1.0.0.0
---

# SCREENS-001 -- Screen Search Contract And Citation Discipline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SCREENS-001`.

---

## 1. OVERVIEW

This scenario validates the read-only search contract for `SCREENS-001`. It focuses on one screen-intent `search_screens` call honoring the fixture-confirmed inputs (`query` from the user's words, `platform` inferred or asked, `limit` starting at 5 and never exceeding ~15 without asking; `mode`/`exclude_screen_ids`/`image_format` only when deliberate — all confirmed 2026-07-16), on every used reference being cited by its `mobbin_url`, on missing images or partial results being reported as partial success, on unknown response fields being preserved, and on no invented tool or undeclared parameter appearing anywhere.

### Why This Matters

The bounded surface invites over-reach: an agent that fabricates `search_apps` or an undeclared parameter has left the fixture record (the `deep` mode, by contrast, is now a confirmed input to use deliberately). And citation discipline is what makes transport output usable as evidence downstream — an uncited screen cannot anchor an `sk-design` critique.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `SCREENS-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the single-tool search contract and citation discipline
- Real user request: `Find real iOS banking onboarding screens with identity verification.`
- Prompt: `Find real iOS banking onboarding screens with identity verification.`
- Expected execution process: confirmed callable (DISCOVER-001 live PASS) -> one `search_screens` call with `query`, `platform: "ios"`, `limit: 5` -> visual inspection of the returned references (content, structure, styling, interaction) -> evidence returned with `mobbin_url` citations and the `failed[]` report; if design-affecting, routed onward through `sk-design`
- Expected signals: `screens[]` records with the fixture-declared fields (`id`, `app_name`, `mobbin_url`, `image_url`, `platform`); inline images examined; only declared parameters used (`mode` allowed, deliberately); no widening beyond ~15 without asking; unknown fields preserved
- Desired user-visible outcome: cited screen evidence (or a session/auth SKIP), never a design decision
- Pass/fail: PASS if the input contract held AND all evidence was cited AND partial success was reported honestly AND nothing was invented; FAIL if an undeclared parameter was used, a tool was invented, or a design verdict came from the transport; SKIP with the session/auth blocker documented

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
| SCREENS-001 | Screen search contract | Verify query/platform/limit discipline, citations, and honest partial success | `Find real iOS banking onboarding screens with identity verification.` | 1. `tool_info` -> 2. search call (declared inputs) -> 3. visual inspection -> 4. cited evidence + partial-success report | Step 2: fixture-declared inputs only. Step 3: returned images examined. Step 4: every claim cites a `mobbin_url` | Call transcript, citation list, partial-success report, account plan | PASS if the contract held AND citations complete AND nothing invented. FAIL if an undeclared parameter was used, a tool invented, or a verdict issued. SKIP with the blocker documented | 1. Confirm the inputs used. 2. Confirm citations + partial-success report. 3. Confirm no invented parameter or verdict. |

### Optional Supplemental Checks

If inline images do not arrive through `call_tool_chain`, that is a dated live finding on the packet's open image-fidelity question: report the gap (metadata-only partial success) rather than fabricating an image tool or a side-channel on the spot.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/screens/screens.md` | The screen-intent capability this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Inputs, response shape, context discipline, and the resolved `deep` mode |
| `../../references/mcp-wiring.md` | The discovery-first contract this scenario depends on |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: SCREENS-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/screens-search.md`
