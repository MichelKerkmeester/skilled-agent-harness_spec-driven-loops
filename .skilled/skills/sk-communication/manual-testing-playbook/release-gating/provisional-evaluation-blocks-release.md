---
title: "COMM-006 -- Provisional evaluation blocks release"
description: "This scenario validates that LLM-proxy evaluation remains provisional and cannot authorize a communication-projection release."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-006 -- Provisional evaluation blocks release

This file is the canonical operator contract for proxy-evaluation provenance and release refusal.

---

## 1. OVERVIEW

This scenario verifies that LLM-proxy ratings retain their numeric statistics but remain provisional, and that the package release gate rejects the resulting evidence as non-human-certifiable.

### Why This Matters

Automated reviewers are useful diagnostics, but allowing them to authorize release would bypass the powered blind human non-inferiority requirement.

---

## 2. SCENARIO CONTRACT

- Objective: Prove LLM-proxy evidence is marked provisional and cannot satisfy release authorization.
- Real user request: `Prove that an LLM-proxy evaluation remains provisional and cannot authorize a communication-projection release, then return PASS or FAIL with evidence.`
- Prompt: `Prove that an LLM-proxy evaluation remains provisional and cannot authorize a communication-projection release, then return PASS or FAIL with evidence.`
- Expected execution process: Run the focused proxy-provenance test, then run the focused package release-gate refusal test.
- Expected signals: Both Vitest commands exit zero; proxy evidence has provisional provenance without altered statistics; the release decision is `blocked` with reason `evaluation-not-human-certifiable`.
- Desired user-visible outcome: A verdict that distinguishes diagnostic numeric success from release-authorizing evidence.
- Pass/fail: PASS if both focused tests pass and the release refusal reason is demonstrated; FAIL if either test fails, proxy evidence becomes human-certifiable, or provisional evidence authorizes release; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.opencode/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/evaluation/proxy-judge.test.ts -t "marks an automated end-to-end gate as provisional without changing its statistics"`.
3. Run `npm run test -- test/release/release-gate.test.ts -t "blocks a numerically passing provisional LLM-proxy evaluation"`.
4. Capture both exit statuses and focused-test summaries.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-006 | Provisional evaluation blocks release | Prove diagnostic proxy evidence cannot authorize release. | `Prove that an LLM-proxy evaluation remains provisional and cannot authorize a communication-projection release, then return PASS or FAIL with evidence.` | 1. `bash: cd .opencode/skills/sk-communication/cli-communication-projection` -> 2. `package: npm run test -- test/evaluation/proxy-judge.test.ts -t "marks an automated end-to-end gate as provisional without changing its statistics"` -> 3. `package: npm run test -- test/release/release-gate.test.ts -t "blocks a numerically passing provisional LLM-proxy evaluation"` | Both commands exit zero; each reports one passing focused test; provisional provenance and package-level release refusal are both exercised. | Both transcripts, exit statuses, passing test names, and refusal reason from the test source. | PASS if all signals match; FAIL if either test fails or provisional evidence authorizes release; SKIP only if Node or installed dependencies are unavailable. | 1. Rerun both complete test files; 2. inspect `evidenceClass` and `isProvisional`; 3. inspect human-certifiability enforcement in the release gate; 4. compare the catalog evaluation contract. |

### Evidence Review

Do not infer success from the proxy gate's numeric status alone. The decisive evidence is provisional provenance plus package-level refusal of that evidence class.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Blind non-inferiority evaluation catalog entry](../../feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md) | Human evidence and proxy-provenance contract. |
| [Release readiness catalog entry](../../feature-catalog/packaging-and-release/release-readiness-and-rollback.md) | Package-level human-certifiability requirement. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Proxy judge](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/evaluation/proxy-judge.ts) | Produces provisional automated reviewer evidence. |
| [Release gate](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/release/release-gate.ts) | Rejects non-human-certifiable evidence. |
| [Proxy judge tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/proxy-judge.test.ts) | Provenance and statistics evidence. |
| [Release gate tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | Package-level provisional-evidence refusal. |

---

## 5. SOURCE METADATA

- Group: Release Gating
- Playbook ID: COMM-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `release-gating/provisional-evaluation-blocks-release.md`
- Catalog entry: `evaluation-and-observability/blind-non-inferiority-evaluation.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
