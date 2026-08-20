---
title: "COMM-009 -- External CLI provider fallback"
description: "This scenario validates that the external-cli provider returns exact-original output on CLI dispatch failure and only routes with hosted egress consent."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-009 -- External CLI provider fallback

This file is the canonical operator contract for the external-cli provider's fail-closed fallback and privacy gating.

---

## 1. OVERVIEW

This scenario verifies that the external-cli provider path returns the exact original bytes when the CLI dispatch fails, and that its hosted-retained record is denied when hosted egress is not consented.

### Why This Matters

The external-cli provider dispatches a rewrite to a remote CLI agent. If a failed dispatch leaked a partial candidate, or if the route ran without egress consent, the projection would breach the display-only and privacy-first boundaries the package guarantees for every provider.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a failed external CLI dispatch returns exact-original output and that the hosted external-cli record is denied without egress consent.
- Real user request: `Verify that the external CLI provider returns the exact original bytes when the CLI dispatch fails and only routes with hosted egress consent, then give me a PASS or FAIL verdict with the focused test evidence.`
- Prompt: `Verify that the external CLI provider returns the exact original bytes when the CLI dispatch fails and only routes with hosted egress consent, then give me a PASS or FAIL verdict with the focused test evidence.`
- Expected execution process: Run one focused fallback test and one focused egress-consent test from the package directory.
- Expected signals: Both Vitest commands exit zero; each reports one passing focused test; the test names explicitly cover the exact-original fallback and the egress-consent denial.
- Desired user-visible outcome: A verdict supported by both the fallback and privacy-gate evidence.
- Pass/fail: PASS if both focused tests pass; FAIL if either command fails or the named invariant is not exercised; SKIP only if the supported Node runtime or installed package dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.opencode/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/providers/external-cli.test.ts -t "falls back to the exact original when the CLI runner fails"`.
3. Run `npm run test -- test/providers/external-cli.test.ts -t "is denied when hosted egress is not consented"`.
4. Capture both exit statuses and the named Vitest summaries.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-009 | External CLI provider fallback | Prove exact-original fallback on CLI dispatch failure and egress-consent gating. | `Verify that the external CLI provider returns the exact original bytes when the CLI dispatch fails and only routes with hosted egress consent, then give me a PASS or FAIL verdict with the focused test evidence.` | 1. `bash: cd .opencode/skills/sk-communication/cli-communication-projection` -> 2. `package: npm run test -- test/providers/external-cli.test.ts -t "falls back to the exact original when the CLI runner fails"` -> 3. `package: npm run test -- test/providers/external-cli.test.ts -t "is denied when hosted egress is not consented"` | Both commands exit zero; each reports one passing focused test; no failing test file or test appears. | Full transcripts, exit statuses, and the two passing test names. | PASS if both focused tests pass; FAIL if either fails or is not selected; SKIP only if Node or installed dependencies are unavailable. | 1. Confirm the test file exists; 2. rerun the file without `-t`; 3. inspect `transports/cli.ts` dispatch mapping and `providers/presets.ts` privacy class; 4. run `npm run typecheck`. |

### Evidence Review

The two commands are jointly required: the fallback test alone does not prove the privacy gate, and the egress-consent denial alone does not prove exact-original output after a failed dispatch.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [External CLI agent provider catalog entry](../../feature-catalog/provider-and-privacy/external-cli-provider.md) | Current external-cli provider contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [External CLI transport](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts) | Dispatch mapping and fail-closed responses. |
| [External CLI preset](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts) | Hosted-retained record and privacy class. |
| [External CLI provider tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/providers/external-cli.test.ts) | Fallback and egress-consent evidence. |
| [External CLI transport tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/transports/cli.test.ts) | Engine resolution, argv, timeout, and fail-closed evidence. |

---

## 5. SOURCE METADATA

- Group: Fidelity And Privacy
- Playbook ID: COMM-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fidelity-and-privacy/external-cli-provider-fallback.md`
- Catalog entry: `provider-and-privacy/external-cli-provider.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
