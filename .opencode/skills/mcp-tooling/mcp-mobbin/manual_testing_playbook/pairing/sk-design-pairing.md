---
title: "PAIR-001 -- sk-design Pairing Enforced"
description: "This scenario validates the judgment boundary for `PAIR-001`. It focuses on a design-affecting request loading sk-design first, the transport supplying only cited evidence, and no taste, accessibility, or readiness verdict being issued from transport output."
version: 1.1.0.0
---

# PAIR-001 -- sk-design Pairing Enforced

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PAIR-001`.

---

## 1. OVERVIEW

This scenario validates the judgment boundary for `PAIR-001`. It focuses on a design-affecting request loading `sk-design` (the mandatory cross-hub judgment partner) before retrieval, on this transport supplying only requested, cited evidence, and on no taste, accessibility, or readiness verdict being issued from transport output. Search rank is not taste, an appealing screenshot is not approval, and references are critiqued through `sk-design`, never copied wholesale.

### Why This Matters

Mobbin results look authoritative: real shipped apps, high-quality screenshots, ranked relevance. The pairing lifecycle is the packet's registry-declared contract: `sk-design` gathers goal, surface, inputs, constraints, and proof expectations; selects the smallest design-judgment mode; this transport retrieves cited screens through Code Mode; results return to the judgment mode; and `sk-design` — not transport rank or images alone — owns the decision. A transport that "picks the best" has silently become a design authority it was never allowed to be.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `PAIR-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the mandatory cross-hub pairing and the taste-authority boundary
- Real user request: `Use Mobbin to pick the best onboarding design for our app and apply it.`
- Prompt: `Use Mobbin to pick the best onboarding design for our app and apply it.`
- Expected execution process: the agent recognizes a design-affecting request, loads `sk-design` before retrieval, retrieves evidence through this transport on request (cited by `mobbin_url`, honest about `failed[]`), and returns it to the design mode; the "pick the best" verdict belongs to `sk-design`, and any application belongs to the owning workflow (`sk-code` for the build)
- Expected signals: `sk-design` loaded first; transport output framed as untrusted reference evidence; no ranking-as-taste; no wholesale copying of a reference; the boundary stated to the user
- Desired user-visible outcome: a design direction owned by the design skill, grounded in cited Mobbin evidence, with the transport's role visible and bounded
- Pass/fail: PASS if sk-design preceded retrieval AND the transport issued no verdict AND no reference was copied wholesale; FAIL if the transport picked "the best" design OR search rank/image appeal was treated as taste

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Judgment routes to `sk-design`; retrieval stays with this transport.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: `sk-design` must be loadable. The retrieval step may SKIP on the session/auth blocker; the pairing and boundary behavior are still fully gradable on the routing transcript, so this scenario itself never SKIPs.

1. agent loads `sk-design` (design-affecting request)  # -> judgment owner present before retrieval
2. transport retrieves requested evidence per the contract rules  # -> cited screens (or a clean live-half SKIP with the blocker)
3. design mode owns the verdict; application handed to the owning workflow  # -> no verdict from the transport

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAIR-001 | Judgment pairing | Verify sk-design loads first and owns the verdict; transport stays evidence-only | `Use Mobbin to pick the best onboarding design for our app and apply it.` | 1. load `sk-design` -> 2. transport retrieval (contract rules) -> 3. design-mode verdict; application handed off | Step 1: sk-design before retrieval. Step 2: evidence cited, no verdict. Step 3: verdict owned by the design skill | Routing transcript; the boundary statement; citation list | PASS if load order held AND no transport verdict AND no wholesale copying. FAIL if the transport picked "the best" OR rank/appeal was treated as taste | 1. Confirm load order. 2. Confirm the verdict's owner. 3. Confirm no chooser was presented from transport output. |

### Optional Supplemental Checks

A purely factual variant ("list Mobbin screens matching X") may return cited evidence without loading a design mode — but if that evidence later influences a design decision, it must route back through `sk-design` before any verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | The evidence capabilities this pairing governs |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The pairing rules (ALWAYS 2, NEVER 7, ESCALATE 5) this scenario proves |
| `../../references/tool-surface.md` | The judgment-boundary section behind the evidence framing |

---

## 5. SOURCE METADATA

- Group: Judgment Pairing
- Playbook ID: PAIR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pairing/sk-design-pairing.md`
