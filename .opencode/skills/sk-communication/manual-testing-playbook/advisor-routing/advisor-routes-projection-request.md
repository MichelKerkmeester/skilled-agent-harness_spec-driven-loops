---
title: "COMM-001 -- Advisor routes a projection request"
description: "This scenario validates that a projection request with canonical-byte and privacy constraints routes to sk-communication."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-001 -- Advisor routes a projection request

This file is the canonical operator contract for advisor activation of `sk-communication`.

---

## 1. OVERVIEW

This scenario verifies that the skill advisor recognizes a natural projection request and returns `sk-communication` as the passing top recommendation.

### Why This Matters

The projection package cannot protect canonical bytes or apply privacy policy if a request is routed to a generic implementation workflow instead of its owning skill.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that a communication-projection request routes to `sk-communication` at the configured threshold.
- Real user request: `Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing.`
- Prompt: `Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing.`
- Expected execution process: Run the advisor compatibility entry point from the repository root and inspect the ordered JSON recommendation array.
- Expected signals: Exit status is zero; the first recommendation has `skill: "sk-communication"`, `passes_threshold: true`, and confidence at or above `0.8`.
- Desired user-visible outcome: A concise verdict that names the selected skill and the observed confidence.
- Pass/fail: PASS if every expected signal is present; FAIL if routing is absent, below threshold, or another skill ranks first; SKIP only if Python or both native and compatibility advisor paths are unavailable in the environment.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. From the repository root, run `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing." --threshold 0.8`.
2. Record the process exit status and the complete JSON recommendation array.
3. Inspect the first recommendation's `skill`, `confidence`, and `passes_threshold` fields.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-001 | Advisor routes a projection request | Prove the advisor selects the owning skill for a projection-and-privacy request. | `Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "Rewrite terse agent status output into plain English without changing canonical bytes, and use privacy-first provider routing." --threshold 0.8` -> 2. Capture exit status and JSON -> 3. Inspect the first recommendation. | Exit zero; first `skill` is `sk-communication`; `passes_threshold` is `true`; confidence is at least `0.8`. | Command transcript, exit status, and first recommendation fields. | PASS if all signals match; FAIL if the result is absent, under threshold, or another skill ranks first; SKIP only if Python or both advisor paths are unavailable. | 1. Run the script with `--help`; 2. inspect advisor freshness or fallback warnings; 3. compare the prompt with `SKILL.md` activation triggers; 4. rerun after restoring the advisor runtime. |

### Evidence Review

Do not treat a non-empty recommendation list alone as success. The owning skill must be first and must pass the configured threshold.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Privacy-first provider routing catalog entry](../../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md) | Product behavior named by the routing prompt. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [sk-communication skill](../../SKILL.md) | Activation triggers and routing contract. |
| [Advisor compatibility entry point](../../../system-skill-advisor/mcp-server/scripts/skill_advisor.py) | Executable advisor smoke surface. |

---

## 5. SOURCE METADATA

- Group: Advisor Routing
- Playbook ID: COMM-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `advisor-routing/advisor-routes-projection-request.md`
- Catalog entry: `provider-and-privacy/privacy-first-provider-routing.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
