---
title: "sk-create-with-human-voice Scripts"
description: "The mechanical pass of the voice workflow and the two fixtures that prove it, including the fail-closed control."
trigger_phrases:
  - "hvr scan script"
  - "voice scanner"
  - "hvr_scan.py"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# sk-create-with-human-voice Scripts

The mechanical pass of the voice workflow, plus the two fixtures that prove it.

---

## 0. OVERVIEW

| File | Purpose |
|---|---|
| [`hvr_scan.py`](hvr_scan.py) | Scans prose for the deterministic Human Voice Rules findings. Parses its term lists out of `../references/hvr-rules.md` at run time and holds no copy of them |
| [`tests/fixtures/voice-dirty.md`](tests/fixtures/voice-dirty.md) | Carries one finding of each mechanical class, plus the same violations inside a fenced block and an inline code span that must not be reported |
| [`tests/fixtures/voice-clean.md`](tests/fixtures/voice-clean.md) | Carries none |

---

## 1. USAGE

```bash
python3 hvr_scan.py <file> [<file> ...]     # grouped report
python3 hvr_scan.py <file> --all            # every occurrence, line and column
python3 hvr_scan.py <file> --json           # machine-readable
python3 hvr_scan.py - < draft.md            # stdin
python3 hvr_scan.py <file> --include-code   # do not mask code spans
python3 hvr_scan.py <file> --rules <path>   # point at another copy of the standard
```

Exit 0 means no hard blocker, 1 means at least one, 2 means the standard could not be read
or parsed and the run refuses to report a clean scan.

---

## 2. WHAT IT COVERS

The subset a machine can settle: the punctuation rows that forbid a mark, the hard blocker
words, the phrase blockers and the soft deductions. Everything structural and every voice
judgment needs a reader, and the scanner prints that list on every run so the two are not
confused.

---

## 3. VERIFICATION

See section 8 of [`../README.md`](../README.md) for the four controls, including the
fail-closed one that proves a renamed section in the standard stops the scan rather than
silently emptying it.
