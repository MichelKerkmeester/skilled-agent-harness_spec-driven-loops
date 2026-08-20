---
title: "PAIR-001 -- sk-design-md-generator Pairing Enforced"
description: "This scenario validates the evidence boundary for `PAIR-001`: a design-affecting request pairs with sk-design-md-generator for a measured Style Reference, the transport supplies only requested evidence, and no taste verdict is issued from transport output."
version: 1.0.0.0
---

# PAIR-001 -- sk-design-md-generator Pairing Enforced

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PAIR-001`.

---

## 1. OVERVIEW

This scenario validates the mandatory cross-hub design pairing for `PAIR-001`. It focuses on confirming that a design-affecting request pairs with `sk-design-md-generator` for a measured Style Reference (extracted design tokens) before retrieval, that the transport supplies only requested evidence, that the transport shows no chooser and issues no verdict, and that no taste, accessibility, or readiness verdict is ever issued from transport output.

### Why This Matters

Refero results look authoritative, and "pick the best style" is exactly the request that turns a search ranking into an unlicensed design decision. The hub's transport axis is explicit: this packet never performs design judgment, and `sk-design-md-generator` is its measured Style Reference pairing (extracted design tokens) for design decisions. This is the boundary that keeps evidence and taste in their own lanes, which is why this scenario is critical-path and must never SKIP.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `PAIR-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the mandatory cross-hub pairing and the taste-authority boundary
- Real user request: `Use Refero to pick the best visual style for our new pricing page and apply it.`
- Prompt: `Use Refero to pick the best visual style for our new pricing page and apply it.`
- Expected execution process: the agent recognizes a design-affecting request; pairs with `sk-design-md-generator` for a measured Style Reference (extracted design tokens) before retrieval; retrieves evidence through this transport on request, following the funnel; the transport issues no "pick the best" verdict, and any application belongs to the owning build workflow, never to this transport
- Expected signals: `sk-design-md-generator` paired first; transport output framed as untrusted reference evidence; no verdict from the transport; no ranking-as-taste; no file changes from this packet
- Desired user-visible outcome: a measured Style Reference (extracted design tokens) from the pairing, grounded in cited Refero evidence, with the transport's role visible and bounded
- Pass/fail: PASS if `sk-design-md-generator` was paired before retrieval AND the transport issued no verdict AND a measured Style Reference emerged; FAIL if the transport picked "the best" style OR search rank was treated as taste

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide the routing: a measured Style Reference to `sk-design-md-generator`, retrieval to this transport, application to the owning workflow.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: `sk-design-md-generator` must be loadable. If live Refero access is unavailable, the pairing order and boundary statements are still fully gradable; only the evidence content is SKIPped.

1. agent recognizes the design-affecting request and pairs with `sk-design-md-generator` FIRST  # -> measured Style Reference (extracted design tokens)
2. the pairing requests evidence; this transport runs the styles funnel  # -> cited records, no verdict
3. the pairing produces a measured Style Reference from the evidence  # -> no chooser from the transport
4. application ownership stated  # -> the transport issues no verdict; build hands to the owning workflow

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAIR-001 | Design pairing | Verify sk-design-md-generator is paired for a measured Style Reference; transport stays evidence-only | `Use Refero to pick the best visual style for our new pricing page and apply it.` | 1. pair with `sk-design-md-generator` -> 2. transport retrieves evidence (funnel) -> 3. a measured Style Reference from the pairing -> 4. ownership stated | Step 1: sk-design-md-generator paired before retrieval. Step 2: cited evidence, no verdict. Step 3: a measured Style Reference produced. Step 4: application handed off | Routing transcript; the measured Style Reference; the boundary statement | PASS if sk-design-md-generator was paired before retrieval AND no transport verdict AND a measured Style Reference. FAIL if the transport picked "the best" style OR rank was treated as taste | 1. Confirm pairing order. 2. Confirm no verdict came from the transport. 3. Confirm no chooser was presented from transport output. |

### Optional Supplemental Checks

A pure factual lookup ("list Refero screens matching X") may legitimately return evidence without a taste verdict and without pairing with `sk-design-md-generator`; the gate triggers when the evidence will influence a design. If the transcript shows that boundary reasoned about explicitly, note it as positive evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/styles/styles.md` | The styles layer this pairing scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The ALWAYS rule on pairing with sk-design-md-generator and the INTEGRATION POINTS pairing contract |
| `../../references/tool-surface.md` | The local judgment boundary (one reference, no chooser, no copy) |

---

## 5. SOURCE METADATA

- Group: Judgment Pairing
- Playbook ID: PAIR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pairing/design-pairing.md`
