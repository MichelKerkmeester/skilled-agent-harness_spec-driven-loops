---
title: "STYLES-001 -- Metadata-First Styles Funnel"
description: "This scenario validates the read-only styles research funnel for `STYLES-001`: semantic search, metadata shortlisting, bounded get_style batches, source-URL citation, and no taste verdict from the transport."
version: 1.0.0.0
---

# STYLES-001 -- Metadata-First Styles Funnel

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `STYLES-001`.

---

## 1. OVERVIEW

This scenario validates the styles research funnel for `STYLES-001`. It focuses on confirming that a styles request runs in the documented order (search on 3-5 semantic angles, shortlist on metadata, `get_style` for at most 3-4 UUIDs), that results are cited by source URL, that unknown response fields are preserved, and that no averaging or taste verdict occurs in the transport.

### Why This Matters

The funnel is the provider's own workflow contract, and it exists for a reason: full styles run 10-15k characters each, so fetching detail before shortlisting burns quota and context, and treating search rank as a verdict smuggles taste authority into a transport that is forbidden from having it. This scenario proves the discipline holds under a natural request.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `STYLES-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the metadata-first funnel and citation discipline on the styles layer
- Real user request: `Find visual direction references for an editorial SaaS landing page.`
- Prompt: `Find visual direction references for an editorial SaaS landing page.`
- Expected execution process: confirmed callables (DISCOVER-001) -> `refero_refero_search_styles` with 3-5 semantic angles -> shortlist on metadata (titles, descriptions, tags) -> `refero_refero_get_style` for at most 3-4 UUIDs -> results returned as cited evidence; if design-affecting, routed onward through `sk-design`
- Expected signals: `{ pagination, records }` response shape; UUID string IDs; batches within bounds; citations by `record.url`; no taste verdict issued by the transport
- Desired user-visible outcome: cited style evidence (or an auth/plan SKIP), never a design decision
- Pass/fail: PASS if the funnel order held AND batches stayed within bounds AND all evidence was cited AND no taste verdict was issued; FAIL if detail was fetched before metadata shortlisting OR a design verdict came from the transport; SKIP with the documented auth/plan blocker

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval runs in this transport; any verdict belongs to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (authenticated Pro or higher). Otherwise SKIP with the documented auth/plan blocker.

1. `refero.refero_refero_search_styles({ query: "<angle>", response_format: "json" })` for 3-5 angles  # -> { pagination, records }
2. shortlist on metadata only  # -> justified UUID shortlist, no detail fetched yet
3. `refero.refero_refero_get_style({ style_ids: [<=4 UUIDs] })`  # -> full references
4. cited evidence returned (record.url per claim)  # -> no verdict, no averaging

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| STYLES-001 | Styles funnel | Verify search -> metadata shortlist -> bounded get_style, with citations | `Find visual direction references for an editorial SaaS landing page.` | 1. search (3-5 angles, json) -> 2. metadata shortlist -> 3. `get_style` (<=4 UUIDs) -> 4. cited evidence | Step 1: records with UUIDs + urls. Step 2: shortlist justified by metadata. Step 3: batch within 3-4. Step 4: every claim cites a `url` | Call transcript, shortlist rationale, citation list, account tier noted | PASS if funnel order held AND batches within bounds AND evidence cited AND no taste verdict. FAIL if detail preceded shortlisting OR a verdict came from the transport. SKIP with the auth/plan blocker documented | 1. Confirm search preceded detail. 2. Confirm batch size. 3. Confirm citations and the absence of a verdict. |

### Optional Supplemental Checks

If a batch call fails, the recovery is a retry with fewer IDs, never a switch to unbounded single-call loops over the whole result set. If the query domain is in-app or iOS material, the correct behavior is to state the styles coverage boundary (web marketing/product pages only) and pivot to the screens layer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/styles/styles.md` | Feature-catalog source for the styles layer |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The funnel contract, batching bounds, and the coverage boundary |
| `../../SKILL.md` | The ALWAYS rules on funnel order, citation, and the judgment boundary |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: STYLES-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/styles-funnel.md`
