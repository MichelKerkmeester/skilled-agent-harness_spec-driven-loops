---
title: "FORMAT-001 -- response_format-Aware Text Retrieval"
description: "This scenario validates response_format discipline for `FORMAT-001`: per-tool availability confirmed via tool_info instead of assumed, JSON vs markdown shapes handled correctly, unknown fields preserved, and the argument never passed to the image tool."
version: 1.0.0.0
---

# FORMAT-001 -- response_format-Aware Text Retrieval

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FORMAT-001`.

---

## 1. OVERVIEW

This scenario validates `response_format` discipline for `FORMAT-001`. It focuses on confirming that per-tool availability of `response_format` is treated as a live `tool_info` check rather than an assumption, that a `"json"` search is consumed as the `{ pagination, records }` object while the default markdown is consumed as reference text, that unknown structured fields are preserved, and that the argument is never passed to `refero_get_screen_image`.

### Why This Matters

`response_format` is the one argument the research record preserves a genuine source conflict about: the strongest-sourced reading documents it on the seven text-returning tools, a narrower source shows it on one, and a broader one claims all eight. The packet resolves this the only safe way — per-tool `tool_info` at runtime — and this scenario proves that resolution is actually practiced. It also guards two real failure modes: decoding a JSON response into a closed schema (the provider documents that fields can grow) and passing the argument to the image tool, where it was never valid.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `FORMAT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm response_format availability is checked per tool via `tool_info`, both response shapes are handled correctly, and the image-tool exclusion holds
- Real user request: `Pull the pagination stats and the raw reference text for onboarding screens so I can compare them.`
- Prompt: `Pull the pagination stats and the raw reference text for onboarding screens so I can compare them.`
- Expected execution process: `tool_info` on `refero.refero_refero_search_screens` confirms whether this client exposes `response_format` -> one search with `response_format: "json"` consumed as `{ pagination, records }` (pagination stats read from `pagination`) -> one search with the default (markdown) consumed as reference text -> unknown fields passed through untouched -> the agent states, unprompted or when probed, that `refero_get_screen_image` never takes this argument
- Expected signals: `tool_info` output precedes the format-dependent calls; the JSON branch reads `pagination.count/total_count` rather than re-deriving them; the markdown branch is not force-parsed as JSON; no closed-schema stripping; no `response_format` near the image tool
- Desired user-visible outcome: pagination stats plus readable reference text, both cited (or an auth/plan SKIP), with the format behavior explained honestly
- Pass/fail: PASS if `tool_info` preceded the format-dependent calls AND both shapes were consumed correctly AND unknown fields survived AND the image-tool exclusion was honored; FAIL if `response_format` support was assumed without `tool_info` OR a response was decoded into a closed schema OR the argument was passed (or proposed) for `refero_get_screen_image`; SKIP with the documented auth/plan blocker

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval runs in this transport; any verdict belongs to `sk-design`.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (authenticated Pro or higher). Otherwise SKIP with the documented auth/plan blocker.

1. `tool_info("refero.refero_refero_search_screens")`  # -> live schema; note whether response_format is exposed
2. `refero.refero_refero_search_screens({ query: "onboarding walkthrough", platform: "web", response_format: "json" })`  # -> { pagination, records }; stats from pagination
3. `refero.refero_refero_search_screens({ query: "onboarding walkthrough", platform: "web" })`  # -> default markdown reference text
4. agent preserves unknown record fields and states the image-tool exclusion  # -> no closed schema, no response_format on get_screen_image

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FORMAT-001 | response_format discipline | Verify per-tool tool_info checking, correct handling of both shapes, and the image-tool exclusion | `Pull the pagination stats and the raw reference text for onboarding screens so I can compare them.` | 1. `tool_info` on the search tool -> 2. search with `response_format: "json"` -> 3. search with the default markdown -> 4. unknown fields preserved + exclusion stated | Step 1: schema confirmed first. Step 2: stats read from `pagination`. Step 3: text consumed as text. Step 4: no stripping; exclusion stated | Call transcript incl. the `tool_info` output, both response excerpts (token-redacted), account tier noted | PASS if `tool_info` preceded format use AND both shapes handled AND unknown fields survived AND the exclusion held. FAIL if support was assumed OR a closed schema stripped fields OR the argument touched the image tool. SKIP with the auth/plan blocker documented | 1. Confirm `tool_info` ran before step 2. 2. Confirm pagination stats came from the object, not a re-count. 3. Confirm the exclusion statement and the absence of stripping. |

### Optional Supplemental Checks

If the live `tool_info` shows `response_format` absent on this client for the search tool, the correct behavior is to say so, run the default-format call only, and record the divergence as evidence — that is a PASS for this scenario's core discipline, not a failure. Never grade against an assumed per-tool availability table; the documented baseline (seven text tools) is the expectation, `tool_info` is the authority.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/screens/screens.md` | Feature-catalog source for the screens layer |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The response_format contract (Section 1), the preserved source conflict, and the image-tool exclusion |
| `../../references/troubleshooting.md` | The rejected-argument row this scenario prevents |
| `../../SKILL.md` | NEVER rule 5 (image-tool exclusion) and the tool_info runtime-check discipline |

---

## 5. SOURCE METADATA

- Group: Read-Only Research
- Playbook ID: FORMAT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/format-text-retrieval.md`
