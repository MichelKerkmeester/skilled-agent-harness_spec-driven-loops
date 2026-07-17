---
title: "FLOWS-001 -- Flow Intent With Labeled Reconstruction"
description: "This scenario validates flow-intent research for `FLOWS-001`. Since the 2026-07-16 discovery, a live search_flows tool exists: journey research uses its returned ordering as fact and labels anything beyond it as inference; screens-level fallback keeps the old reconstruction discipline."
version: 1.1.0.0
---

# FLOWS-001 -- Flow Intent With Labeled Reconstruction

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FLOWS-001`.

---

## 1. OVERVIEW

This scenario validates flow-intent research for `FLOWS-001`. **Updated 2026-07-16**: live discovery lists a dedicated `search_flows` tool (`../../references/discovery-fixture-2026-07-16.json`), so journey research now prefers `mobbin.mobbin_search_flows` and treats its returned `screens[].position` ordering as retrieved fact. Anything beyond the returned ordering — interpolated states, skipped steps, cross-app generalizations — is reconstructed **only when the visual evidence supports it** and explicitly labeled inference. The screens-level fallback (`search_screens` with a journey-shaped query) keeps the full reconstruction-as-inference discipline.

### Why This Matters

The public contract returns screens, not an ordered flow object. The failure mode this scenario guards is subtle and common: an agent narrates a confident step-by-step journey as if the provider returned it, converting inference into fabricated fact. Honest labeling is the difference between evidence-backed reconstruction and hallucination.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `FLOWS-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the query-intent model and honest reconstruction labeling
- Real user request: `Show me how real products run a forgot-password recovery on the web.`
- Prompt: `Show me how real products run a forgot-password recovery on the web.`
- Expected execution process: confirmed callable -> `search_screens` with a journey-shaped query and `platform: "web"`, `limit: 5` -> inspect returned screens -> reconstruct sequence only where matching app, coherent progression, and consistent state transitions support it, labeled inference -> evidence-backed narrative with `mobbin_url` citations
- Expected signals: no invented flow tool or ordered-flow claim; the inference label present wherever sequence is asserted; citations per screen used; `failed[]` reported
- Desired user-visible outcome: an evidence-backed journey narrative (or a session/auth SKIP), with inference never presented as retrieved fact
- Pass/fail: PASS if the live `search_flows` tool (or the screens fallback) was used within its contract AND anything beyond returned ordering was labeled inference AND citations held; FAIL if sequence beyond the returned ordering was claimed as retrieved fact OR a tool outside the fixture inventory was fabricated; SKIP with the session/auth blocker documented

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval stays local; judgment (if requested) routes to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (registered manual, operator OAuth on a paid account). Otherwise SKIP with the blocker documented.

1. `tool_info` confirmation of the live callable  # -> schema on the live name
2. `mobbin.mobbin_search_screens({ query: "forgot password recovery", platform: "web", limit: 5 })`  # -> screens[] + failed[] + inline images
3. sequence reconstructed from evidence where supported, explicitly labeled inference  # -> "reconstructed (inference):" framing
4. cited narrative returned with `mobbin_url` provenance  # -> no retrieved-flow claim

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FLOWS-001 | Flow intent | Verify flow research runs over search_screens with labeled reconstruction | `Show me how real products run a forgot-password recovery on the web.` | 1. `tool_info` -> 2. journey-shaped search call -> 3. labeled reconstruction -> 4. cited narrative | Step 2: screen search, no invented tool. Step 3: inference label present. Step 4: citations per screen | Call transcript; the narrative with its inference labels; citation list | PASS if no flow tool invented AND reconstruction labeled AND citations held. FAIL if a flow was claimed as retrieved fact OR a tool fabricated. SKIP with the blocker documented | 1. Confirm the tool used. 2. Confirm the inference label. 3. Confirm citations. |

### Optional Supplemental Checks

If results are too sparse to support any sequence, the honest outcome is "screens found, sequence not reconstructable from this evidence" plus the option to broaden the query — never a padded narrative.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/flows/flows.md` | The flow-intent capability this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The flow-intent workflow and the reconstruction-as-inference rule |
| `../../references/mcp-wiring.md` | The discovery-first contract this scenario depends on |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: FLOWS-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/flow-intent.md`
