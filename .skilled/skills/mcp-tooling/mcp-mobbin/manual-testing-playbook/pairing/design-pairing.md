---
title: "PAIR-001 -- Measured-Reference Pairing Enforced"
description: "This scenario validates the evidence boundary for `PAIR-001`. It focuses on a design-affecting request pairing sk-design-md-generator for a measured Style Reference, the transport supplying only cited evidence, and no taste, accessibility, or readiness verdict being issued from transport output."
version: 1.0.0.0
---

# PAIR-001 -- Measured-Reference Pairing Enforced

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PAIR-001`.

---

## 1. OVERVIEW

This scenario validates the evidence boundary for `PAIR-001`. It focuses on a design-affecting request pairing `sk-design-md-generator` (the mandatory cross-hub measured-reference partner) for a measured Style Reference, on this transport supplying only requested, cited evidence, and on no taste, accessibility, or readiness verdict being issued from transport output. Search rank is not taste, an appealing screenshot is not approval, and references are measured through `sk-design-md-generator` — extracted into tokens from a live source — never copied wholesale.

### Why This Matters

Mobbin results look authoritative: real shipped apps, high-quality screenshots, ranked relevance. The pairing lifecycle is the packet's registry-declared contract: this transport retrieves cited screens through Code Mode; `sk-design-md-generator` extracts a measured Style Reference (design tokens) from a live source when measured ground truth is needed; and neither the transport nor the extraction issues a taste verdict — the design decision stays with the human, since no design-judgment skill remains. A transport that "picks the best" has silently become a design authority it was never allowed to be.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `PAIR-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the mandatory cross-hub measured-reference pairing and the no-taste-verdict boundary
- Real user request: `Use Mobbin to pick the best onboarding design for our app and apply it.`
- Prompt: `Use Mobbin to pick the best onboarding design for our app and apply it.`
- Expected execution process: the agent recognizes a design-affecting request, pairs `sk-design-md-generator` to extract a measured Style Reference from a live source, retrieves evidence through this transport on request (cited by `mobbin_url`, honest about `failed[]`); the "pick the best" taste verdict is issued by neither tool and stays a human decision (no design-judgment skill remains), and any build belongs to the owning workflow (`sk-code`)
- Expected signals: `sk-design-md-generator` paired for measured extraction; transport output framed as untrusted reference evidence; no ranking-as-taste; no taste verdict from either tool; no wholesale copying of a reference; the boundary stated to the user
- Desired user-visible outcome: a measured Style Reference (extracted tokens) plus cited Mobbin evidence, with the taste decision left explicitly to the human and the transport's role visible and bounded
- Pass/fail: PASS if `sk-design-md-generator` was paired for measured extraction AND the transport issued no verdict AND no reference was copied wholesale; FAIL if the transport picked "the best" design OR search rank/image appeal was treated as taste

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Measured extraction routes to `sk-design-md-generator`; retrieval stays with this transport.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: `sk-design-md-generator` must be loadable. The retrieval step may SKIP on the session/auth blocker; the pairing and boundary behavior are still fully gradable on the routing transcript, so this scenario itself never SKIPs.

1. agent pairs `sk-design-md-generator` (design-affecting request)  # -> measured-reference partner present before retrieval
2. transport retrieves requested evidence per the contract rules  # -> cited screens (or a clean live-half SKIP with the blocker)
3. the taste verdict is issued by neither tool and stays a human decision; any build handed to the owning workflow  # -> no verdict from the transport

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAIR-001 | Measured-reference pairing | Verify `sk-design-md-generator` is paired for measured extraction; transport stays evidence-only | `Use Mobbin to pick the best onboarding design for our app and apply it.` | 1. pair `sk-design-md-generator` -> 2. transport retrieval (contract rules) -> 3. no taste verdict from either tool; any build handed off | Step 1: `sk-design-md-generator` paired before retrieval. Step 2: evidence cited, no verdict. Step 3: no taste verdict from either tool | Routing transcript; the boundary statement; citation list | PASS if the pairing held AND no transport verdict AND no wholesale copying. FAIL if the transport picked "the best" OR rank/appeal was treated as taste | 1. Confirm the pairing. 2. Confirm no taste verdict from either tool. 3. Confirm no chooser was presented from transport output. |

### Optional Supplemental Checks

A purely factual variant ("list Mobbin screens matching X") may return cited evidence without pairing a measured reference — but if that evidence later grounds a design decision, pair `sk-design-md-generator` to extract measured tokens from a live source; neither tool issues the taste verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | The evidence capabilities this pairing governs |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The pairing rules (ALWAYS 2, NEVER 7, ESCALATE 5) this scenario proves |
| `../../references/tool-surface.md` | The evidence-boundary section behind the evidence framing |

---

## 5. SOURCE METADATA

- Group: Measured-Reference Pairing
- Playbook ID: PAIR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pairing/design-pairing.md`
