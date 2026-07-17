---
title: "FUNNEL-001 -- Full Styles -> Screens -> Flows Funnel Walk"
description: "This scenario validates the complete official research funnel for `FUNNEL-001`: styles for visual direction, screens for the concrete pattern, flows for the journey, with metadata-first ordering held at every layer and each layer's ID typing respected."
version: 1.0.0.0
---

# FUNNEL-001 -- Full Styles -> Screens -> Flows Funnel Walk

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FUNNEL-001`.

---

## 1. OVERVIEW

This scenario validates the complete research funnel for `FUNNEL-001`: one brief that needs all three layers, walked in the documented order — styles (3-5 semantic angles, metadata shortlist, bounded `get_style`), screens (literal query plus required platform, detail for the most relevant UUIDs), flows (task query plus platform, one relevant numeric flow) — with citations at every layer and no layer skipped or reordered.

### Why This Matters

The single-layer scenarios (STYLES-001, FLOWS-001) prove each layer in isolation; this scenario proves the seams. Layer transitions are where funnels break in practice: an agent that jumps from a styles hit straight to a screenshot skips the metadata discipline, and one that passes a screen UUID to `refero_get_flow` crosses the UUID/numeric typing boundary. The funnel is the provider's own workflow contract (styles first for any visual task, screens for concrete patterns, flows for journeys), and holding it end to end is what keeps quota spend and context spend proportional to the question.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `FUNNEL-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the full three-layer funnel runs in order with metadata-first discipline and correct ID typing at every transition
- Real user request: `We are designing a pricing page for a developer-tools SaaS. Gather visual direction, real pricing-page patterns, and how products run the upgrade journey.`
- Prompt: `We are designing a pricing page for a developer-tools SaaS. Gather visual direction, real pricing-page patterns, and how products run the upgrade journey.`
- Expected execution process: confirmed callables (DISCOVER-001) -> styles layer (3-5 angles, metadata shortlist, `get_style` <=4 UUIDs) -> screens layer (`search_screens` with `platform: "web"`, `get_screen` for shortlisted UUIDs) -> flows layer (`search_flows` with `platform: "web"`, `get_flow` on one numeric ID) -> cited evidence per layer returned; design-affecting judgment routed onward through `sk-design`
- Expected signals: funnel order styles -> screens -> flows; UUID strings on styles/screens, a numeric ID on the flow; batches within bounds; citations (`url` / `refero_url`) at every layer; no image fetched (text answered)
- Desired user-visible outcome: a three-layer evidence package with per-layer citations (or an auth/plan SKIP), never a design decision
- Pass/fail: PASS if all three layers ran in order AND ID typing held at every transition AND every layer's evidence was cited; FAIL if a layer was skipped/reordered without a stated reason OR an ID crossed typing boundaries OR detail preceded its metadata shortlist; SKIP with the documented auth/plan blocker

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval runs in this transport; any verdict belongs to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (authenticated Pro or higher). Otherwise SKIP with the documented auth/plan blocker.

1. `refero.refero_refero_search_styles({ query: "<angle>", response_format: "json" })` for 3-5 angles  # -> { pagination, records } with UUID strings
2. metadata shortlist -> `refero.refero_refero_get_style({ style_ids: [<=4 UUIDs] })`  # -> full references, cited by record.url
3. `refero.refero_refero_search_screens({ query: "saas pricing page tier comparison", platform: "web", response_format: "json" })`  # -> UUID records
4. `refero.refero_refero_get_screen({ screen_id: "<top uuid>" })`  # -> full metadata, cited by refero_url
5. `refero.refero_refero_search_flows({ query: "upgrade to paid plan", platform: "web", response_format: "json" })`  # -> NUMERIC flow IDs
6. `refero.refero_refero_get_flow({ flow_id: <number> })`  # -> ordered steps; three-layer evidence package returned

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FUNNEL-001 | Full funnel walk | Verify styles -> screens -> flows runs in order with typing and citations at every layer | `We are designing a pricing page for a developer-tools SaaS. Gather visual direction, real pricing-page patterns, and how products run the upgrade journey.` | 1. styles search (3-5 angles) -> 2. shortlist + `get_style` (<=4 UUIDs) -> 3. screens search (platform web) -> 4. `get_screen` (UUID) -> 5. flows search (platform web) -> 6. `get_flow` (numeric) | Steps 1-2: UUID styles cited by `url`. Steps 3-4: UUID screens cited by `refero_url`. Steps 5-6: numeric flow with ordered steps. Order never reversed | Per-layer call transcript, shortlist rationale, citation list per layer, account tier noted | PASS if all three layers ran in order AND ID typing held AND every layer cited. FAIL if a layer was skipped/reordered without reason OR a UUID reached `get_flow` OR detail preceded shortlisting. SKIP with the auth/plan blocker documented | 1. Confirm the layer order in the transcript. 2. Confirm the ID type at each `get_*`. 3. Confirm per-layer citations and the absence of a verdict. |

### Optional Supplemental Checks

If the flows layer comes back sparse, the correct in-scenario behavior is FLOWS-001's rule: broaden the query or reconstruct from screens with the reconstruction labeled inference — the funnel walk still PASSES when that rule is followed and labeled. If the brief had been purely visual, stopping after the styles layer with a stated reason is correct funnel behavior, not a FAIL; this scenario's brief deliberately needs all three layers.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Cross-layer capability inventory |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The funnel contract (Section 3), ID typing, and per-tool bounds |
| `../../examples/funnel-styles-screens-flows.md` | The worked Code Mode walkthrough this scenario executes |
| `../../SKILL.md` | The ALWAYS rules on funnel order, typing validation, and citation |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: FUNNEL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/funnel-walk.md`
