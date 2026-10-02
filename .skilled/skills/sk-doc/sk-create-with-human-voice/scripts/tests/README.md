---
title: "Create-with-human-voice scripts tests"
description: "Plain-runner python tests for the HVR scanner masking contract and the reader-needed lens."
trigger_phrases:
  - "create-with-human-voice script tests"
  - "hvr scanner masking tests"
  - "reader-needed lens tests"
---

# Create-with-human-voice scripts tests

---

## 1. OVERVIEW

`tests/` holds the plain-runner suites for the two scripts in `../`. Each file carries its own assertions, prints one `PASS` or `FAIL` line per check and ends with `ALL PASS` or the failure count, so a run needs no test framework and exits nonzero on any failure.

Both suites stay offline. `test_hvr_scan.py` drives `../hvr_scan.py` in a subprocess over temporary documents and the shipped fixtures. `test_hvr_reader_lens.py` runs `../hvr_reader_lens.py` against a throwaway git repository with a stub `jev` binary first on `PATH`, so no check reaches a live backend.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `test_hvr_scan.py` | Pins the masking contract: which fences and spans a template payload reads as prose, which it still masks, how an inline span that wraps two lines is treated and the finding counts of the dirty and clean fixtures. |
| `test_hvr_reader_lens.py` | Pins the reader-needed lens contract: the frame walker, the census, the draw, the label gate, the baselines and the backend arm, all against a throwaway git repository with a stub backend. |
| `fixtures/` | Prose samples the masking contract pins to fixed finding counts and the manual-testing playbook scenarios run against. |

---

## 3. VALIDATION

Run from the repository root:

```bash
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py
```

Expected result: each script prints one `PASS` line per check and `ALL PASS`, and both exit 0.

---

## 4. RELATED

- [`sk-create-with-human-voice Scripts`](../README.md)
- [`create-with-human-voice`](../../README.md)
