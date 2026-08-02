---
title: "OBS-011 -- Beancount file-layer transaction"
description: "This scenario validates the flat-financing file-layer tie-in by appending and checking a balanced scratch ledger."
stage: routing
version: 1.0.0.0
---

# OBS-011 -- Beancount file-layer transaction

## 1. OVERVIEW

This scenario validates the `obsidian-flat-financing` integration at the data-file layer. It appends a balanced grocery transaction to a scratch `.beancount` ledger and lets the existing example run `bean-check` when installed.

### Why This Matters

The mode operates plugin data, not plugin UI. A valid Beancount ledger is the observable contract; the dashboard must be re-opened or reloaded in Obsidian to render the changed file.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-011`
- Feature Name: Beancount file-layer transaction
- Scenario Objective: Append a balanced transaction to a scratch ledger and report validation status.
- Exact Prompt: `Append a balanced grocery transaction to a scratch Beancount ledger and report whether the ledger validates.`
- Exact Command Sequence: `1. LEDGER="${TMPDIR:-/tmp}/mcp-obsidian-playbook.beancount" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/beancount-transaction.sh`
- Expected Signals: The script initializes/open accounts when needed, appends two postings that balance to zero, exits 0, and either reports successful `bean-check` or explicitly warns that `bean-check` is unavailable.
- Evidence: Ledger path, script transcript, final ledger tail, and `bean-check` result or absence warning.
- Pass/Fail Criteria: PASS if the transaction is appended with opened accounts and the script exits 0; FAIL if postings do not balance, the ledger is malformed, or the script exits non-zero for an unexplained reason.
- Failure Triage: 1. Inspect the ledger tail and account-open directives. 2. Run `bean-check "LEDGER"` when installed. 3. Compare the transaction with the flat-financing data model and correct only the scratch ledger.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run with the default scratch path or an operator-owned temporary path. Do not point the example at a production ledger.

### Prompt

`Append a balanced grocery transaction to a scratch Beancount ledger and report whether the ledger validates.`

### Commands

1. `LEDGER="${TMPDIR:-/tmp}/mcp-obsidian-playbook.beancount" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/beancount-transaction.sh`

### Expected

Accounts are opened, a balanced transaction is appended, and the script exits 0. `bean-check` success is preferred; its absence is an explicit warning, not an invented validation pass.

### Evidence

Capture the scratch ledger path, full script output, final ledger tail, and validator result.

### Pass / Fail

- **Pass:** scratch ledger is valid or the script documents the optional validator absence after a balanced append.
- **Fail:** the script reports malformed or unbalanced postings, cannot create the ledger, or exits non-zero unexpectedly.

### Failure Triage

1. Inspect the ledger's opening directives and final transaction.
2. Run `bean-check "LEDGER"` if available.
3. Compare the file with the flat-financing reference and keep all repairs inside the scratch ledger.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-011 | Beancount file-layer transaction | Append and validate a balanced scratch transaction | `Append a balanced grocery transaction to a scratch Beancount ledger and report whether the ledger validates.` | 1. `LEDGER="${TMPDIR:-/tmp}/mcp-obsidian-playbook.beancount" bash .opencode/skills/mcp-tooling/mcp-obsidian/examples/beancount-transaction.sh` | Accounts open; balanced transaction appended; exit 0; bean-check success or explicit unavailable warning | Script transcript, ledger tail, validator result | PASS if balanced append succeeds; FAIL on malformed ledger or unexplained non-zero exit | Inspect directives, run bean-check, compare reference |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [`../../references/plugins/flat-financing.md`](../../references/plugins/flat-financing.md) | Plugin data model and file-layer recipe |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../examples/beancount-transaction.sh`](../../examples/beancount-transaction.sh) | Executable scratch-ledger workflow |
| [`../../references/plugins/plugin-operation-logic.md`](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 5. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: `OBS-011`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-tie-ins/beancount-transaction.md`
