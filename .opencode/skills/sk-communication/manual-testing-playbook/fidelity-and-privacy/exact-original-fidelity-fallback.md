---
title: "COMM-002 -- Exact-original fidelity fallback"
description: "This scenario validates byte-exact protected-span restoration and exact-original output for failed projection paths."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-002 -- Exact-original fidelity fallback

This file is the canonical operator contract for immutable fallback and protected-span fidelity.

---

## 1. OVERVIEW

This scenario verifies that technical spans round-trip byte-for-byte and that provider terminal failures are rejected before semantic checks with exact-original output.

### Why This Matters

Projection is display-only. A rewrite that changes protected bytes or exposes a partial candidate after failure violates the package's central safety boundary.

---

## 2. SCENARIO CONTRACT

- Objective: Prove protected technical content is restored byte-for-byte and failed provider terminals return exact-original output.
- Real user request: `Verify that a failed communication projection returns the exact original bytes and preserves protected commands, then give me a PASS or FAIL verdict with test evidence.`
- Prompt: `Verify that a failed communication projection returns the exact original bytes and preserves protected commands, then give me a PASS or FAIL verdict with test evidence.`
- Expected execution process: Run one focused protected-span test and one focused fidelity-validator failure test from the package directory.
- Expected signals: Both Vitest commands exit zero; each reports one passing focused test; the test names explicitly cover byte-for-byte restoration and provider terminal failures.
- Desired user-visible outcome: A verdict supported by both restoration and failure-path evidence.
- Pass/fail: PASS if both focused tests pass; FAIL if either command fails or the named invariant is not exercised; SKIP only if the supported Node runtime or installed package dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `packages/cli-communication-projection/`.
2. Run `npm run test -- test/fidelity/protected-spans.test.ts -t "pins one dialect and restores adversarial technical content byte for byte"`.
3. Run `npm run test -- test/fidelity/validator.test.ts -t "rejects provider terminal failures before semantic checks"`.
4. Capture both exit statuses and the named Vitest summaries.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-002 | Exact-original fidelity fallback | Prove byte-exact restoration and failure-path fallback. | `Verify that a failed communication projection returns the exact original bytes and preserves protected commands, then give me a PASS or FAIL verdict with test evidence.` | 1. `bash: cd packages/cli-communication-projection` -> 2. `package: npm run test -- test/fidelity/protected-spans.test.ts -t "pins one dialect and restores adversarial technical content byte for byte"` -> 3. `package: npm run test -- test/fidelity/validator.test.ts -t "rejects provider terminal failures before semantic checks"` | Both commands exit zero; each reports one passing focused test; no failing test file or test appears. | Full transcripts, exit statuses, and the two passing test names. | PASS if both focused tests pass; FAIL if either fails or is not selected; SKIP only if Node or installed dependencies are unavailable. | 1. Confirm both test files exist; 2. rerun each file without `-t`; 3. inspect `protected-spans.ts` restoration and `validator.ts` terminal-state handling; 4. run `npm run typecheck`. |

### Evidence Review

The two commands are jointly required: protected-span restoration alone does not prove exact-original failure behavior, and a terminal-failure test alone does not prove byte-exact technical spans.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Protected-span fidelity validation catalog entry](../../feature-catalog/fidelity-and-render/protected-span-fidelity-validation.md) | Current fidelity and fallback contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Protected-span implementation](../../../../../packages/cli-communication-projection/src/fidelity/protected-spans.ts) | Token protection and exact restoration. |
| [Fidelity validator](../../../../../packages/cli-communication-projection/src/fidelity/validator.ts) | Terminal failure and exact-original decision logic. |
| [Protected-span tests](../../../../../packages/cli-communication-projection/test/fidelity/protected-spans.test.ts) | Byte-for-byte restoration evidence. |
| [Fidelity validator tests](../../../../../packages/cli-communication-projection/test/fidelity/validator.test.ts) | Failure-path fallback evidence. |

---

## 5. SOURCE METADATA

- Group: Fidelity And Privacy
- Playbook ID: COMM-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fidelity-and-privacy/exact-original-fidelity-fallback.md`
- Catalog entry: `fidelity-and-render/protected-span-fidelity-validation.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
