---
title: "COMM-003 -- Privacy precedes provider ranking"
description: "This scenario validates that hosted-egress consent and privacy eligibility are enforced before provider ranking."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-003 -- Privacy precedes provider ranking

This file is the canonical operator contract for privacy-first route selection.

---

## 1. OVERVIEW

This scenario verifies that hosted egress without consent is denied before the ranker is called and that ranking sees only privacy-approved providers.

### Why This Matters

Ranking by quality, cost, or latency before privacy evaluation can leak private content or make an ineligible hosted route appear selectable.

---

## 2. SCENARIO CONTRACT

- Objective: Prove privacy classification and egress consent filter candidates before provider ranking.
- Real user request: `Check that hosted egress is rejected before provider ranking when consent is absent, and return a PASS or FAIL verdict with the focused test evidence.`
- Prompt: `Check that hosted egress is rejected before provider ranking when consent is absent, and return a PASS or FAIL verdict with the focused test evidence.`
- Expected execution process: Run the complete existing privacy-router test file from the package directory and inspect the five-test summary.
- Expected signals: Vitest exits zero with one passing test file and five passing tests, including `denies hosted egress before invoking the ranker` and `passes only privacy-approved candidates into ranking`.
- Desired user-visible outcome: A verdict that demonstrates both early denial and filtered ranker input.
- Pass/fail: PASS if all five privacy-router tests pass and both named tests appear; FAIL if the file fails, fewer than five tests execute, or either named test is absent; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.opencode/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/providers/privacy.test.ts`.
3. Capture the exit status, five-test summary, and the two named privacy-ordering tests.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-003 | Privacy precedes provider ranking | Prove privacy eligibility is decided before ranking. | `Check that hosted egress is rejected before provider ranking when consent is absent, and return a PASS or FAIL verdict with the focused test evidence.` | 1. `bash: cd .opencode/skills/sk-communication/cli-communication-projection` -> 2. `package: npm run test -- test/providers/privacy.test.ts` -> 3. Capture exit status and named tests. | Exit zero; one test file passes; five tests pass; early-denial and approved-candidates-only test names are present. | Command transcript, exit status, five-test summary, and named-test lines. | PASS if all signals match; FAIL if the suite fails, the count differs, or either named test is missing; SKIP only if Node or installed dependencies are unavailable. | 1. Confirm the package lockfile dependencies are installed; 2. rerun the early-denial test with `-t`; 3. inspect `router.ts` before the ranking call; 4. inspect provider fixtures for changed census. |

### Evidence Review

The ranker's non-invocation on denied hosted egress is load-bearing. A merely denied final route does not prove privacy ran before ranking.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Privacy-first provider routing catalog entry](../../feature-catalog/provider-and-privacy/privacy-first-provider-routing.md) | Current privacy-before-ranking contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Privacy router](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/privacy/router.ts) | Consent, evidence, eligibility, and ranking order. |
| [Provider registry](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts) | Provider records consumed by the router. |
| [Privacy router tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/providers/privacy.test.ts) | Deterministic privacy and fallback coverage. |

---

## 5. SOURCE METADATA

- Group: Fidelity And Privacy
- Playbook ID: COMM-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fidelity-and-privacy/privacy-precedes-provider-ranking.md`
- Catalog entry: `provider-and-privacy/privacy-first-provider-routing.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
