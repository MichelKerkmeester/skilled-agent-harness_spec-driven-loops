---
title: "COMM-011 -- Offline judge census stops at the label gate"
description: "This scenario validates that the offline judge measurement counts the committed masked replies and stops at its label gate with zero model calls, and that a stub Deem backend is skipped without changing the census."
catalog_applicable: true
version: 1.4.0.0
---

# COMM-011 -- Offline judge census stops at the label gate

This file is the canonical operator contract for the zero-call census of `judge-agreement.mjs` and its stub-backend skip.

---

## 1. OVERVIEW

This scenario verifies that `judge-agreement.mjs` counts the committed masked replies, prints the mechanical baseline and stops at its label gate without calling a model. It also verifies that `--deem` against a stub backend prints one skip line and leaves every census line as it was. `--jev` adds a Jev column only after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0, and a stub whose `auth status` exits 3 prints `jev arm skipped: no credential` with every census line unchanged.

### Why This Matters

A model judge earns trust only against the operator's grades. A census that called a model before those grades exist, or a skipped judge that altered the census, would make the measurement's own numbers unreliable.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the default run makes zero model calls and stops at the label gate, and that a stub Deem backend is skipped with the census unchanged.
- Real user request: `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.`
- Prompt: `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.`
- Expected execution process: Run the two focused node tests, then run the census on the three committed blind runs and compare `git status --short` before and after it.
- Expected signals: Both focused tests pass. The census exits zero and prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies`. The working tree status is the same before and after.
- Desired user-visible outcome: A verdict that names the census counts, the label gate line and the stub-backend skip line.
- Pass/fail: PASS if both tests pass, the census prints the four expected lines and the status is unchanged. FAIL if a test fails, a count differs, the census prints `planned calls:` or the status changes. SKIP only if Node or Python 3 is unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. From the repository root, run `node --test --test-name-pattern "label gate stop on the default run" --test-name-pattern "stub backend" .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`.
2. Run `git status --short > /tmp/comm-011-before.txt`.
3. Run the census on the three committed blind runs and their six replies directories, shown in full in the table below.
4. Run `git status --short | diff /tmp/comm-011-before.txt -` and capture both exit statuses.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-011 | Offline judge census stops at the label gate | Prove the census calls no model below the label gate and a stub Deem backend changes nothing. | `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.` | 1. `bash: node --test --test-name-pattern "label gate stop on the default run" --test-name-pattern "stub backend" .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` -> 2. `bash: git status --short > /tmp/comm-011-before.txt` -> 3. `bash: R=specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs && node .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs --masked $R/blind --masked $R/sonnet/blind --masked $R/attempt-1/blind --replies $R/before-replies --replies $R/after-replies --replies $R/sonnet/before-replies --replies $R/sonnet/after-replies --replies $R/attempt-1/before-replies --replies $R/attempt-1/after-replies` -> 4. `bash: git status --short \| diff /tmp/comm-011-before.txt -` | Step 1 exits zero with two passing tests. Step 3 exits zero and prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies`. Step 4 prints nothing and exits zero. | Transcripts and exit statuses of all four steps, the two passing test names and the four census lines. | PASS if all signals match. FAIL if a test fails, a count differs, `planned calls:` appears or the status changes. SKIP only if Node or Python 3 is unavailable. | 1. Rerun the whole test file. 2. Check that the three blind directories still hold 14 masked files each. 3. Run `score.mjs` alone on one replies directory to confirm Python 3 and the scanner work. 4. Compare the census join in `judge-agreement.mjs` with the masked file shape `blind.mjs` writes. |

### Evidence Review

A passing census is not enough on its own. The evidence must show the label gate line, because a run past the gate would be the first one allowed to call a model.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Offline judge agreement catalog entry](../../feature-catalog/evaluation-and-observability/offline-judge-agreement.md) | The measurement, its zero-call default and its two judge switches. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Judge agreement script](../../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs) | Census, baseline, label gate and both judge arms. |
| [Judge agreement tests](../../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs) | Default-run and stub-backend evidence on stub binaries. |

---

## 5. SOURCE METADATA

- Group: Release Gating
- Playbook ID: COMM-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `release-gating/offline-judge-census-stops-at-label-gate.md`
- Catalog entry: `evaluation-and-observability/offline-judge-agreement.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
