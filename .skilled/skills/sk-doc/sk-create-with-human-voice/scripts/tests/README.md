---
title: "Create-with-human-voice scripts tests"
description: "Plain-runner python tests for the HVR scanner masking contract."
trigger_phrases:
  - "create-with-human-voice script tests"
  - "hvr scanner masking tests"
---

# Create-with-human-voice scripts tests

---

## 1. OVERVIEW

`tests/` holds the plain-runner suite for the scanner in `../`. The file carries its own assertions, prints one `PASS` or `FAIL` line per check and ends with `ALL PASS` or the failure count, so a run needs no test framework and exits nonzero on any failure.

The suite stays offline. `test_hvr_scan.py` drives `../hvr_scan.py` in a subprocess over temporary documents and the shipped fixtures.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `test_hvr_scan.py` | Pins the masking contract: which fences and spans a template payload reads as prose, which it still masks, how an inline span that wraps two lines is treated and the finding counts of the dirty and clean fixtures. |
| `fixtures/` | Prose samples the masking contract pins to fixed finding counts and the manual-testing playbook scenarios run against. |

---

## 3. VALIDATION

Run from the repository root:

```bash
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py
```

Expected result: the script prints one `PASS` line per check and `ALL PASS`, and exits 0.

---

## 4. RELATED

- [`sk-create-with-human-voice Scripts`](../README.md)
- [`create-with-human-voice`](../../README.md)
