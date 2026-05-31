---
title: "EX-011 -- Memory browser (memory_list)"
description: "This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit."
---

# EX-011 -- Memory browser (memory_list)

## 1. OVERVIEW

This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit.

---

## 2. SCENARIO CONTRACT


- Objective: Folder inventory audit.
- Real user request: `Please validate Memory browser (memory_list) against memory_list(specFolder,limit,offset) and tell me whether the expected signals are present: Paginated list and totals.`
- Prompt: `Validate memory_list folder inventory and confirm paginated results and totals are present with cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Paginated list and totals
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if browsable inventory returned

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_list folder inventory and confirm paginated results and totals are present with cited pass/fail evidence.
```

### Commands

1. memory_list(specFolder,limit,offset)

### Expected

Paginated list and totals

### Evidence

List output

### Pass / Fail

- **Pass**: browsable inventory returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Reduce filters; verify specFolder path

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [03--discovery/027-memory-browser-memorylist.md](../../feature_catalog/03--discovery/027-memory-browser-memorylist.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--discovery/011-memory-browser-memory-list.md`
- audited_post_018: true
