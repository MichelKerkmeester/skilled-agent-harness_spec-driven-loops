---
title: create-diff Worked Example
description: An end-to-end create-diff run using the shipped onboarding fixtures, covering explicit-pair, snapshot flow, report verification, and JSON output.
trigger_phrases:
  - "create-diff worked example"
  - "create-diff walkthrough"
  - "document diff example"
  - "before after report example"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Worked example

An end-to-end run using the shipped fixtures (`../assets/fixtures/`). Two versions of an onboarding guide: the "after" rewrites a sentence, expands two bullets, adds a section, and extends a line.

## 1. Explicit-pair comparison

From the packet directory:

```bash
python3 scripts/create_diff.py compare-pair \
  --before assets/fixtures/onboarding-before.md \
  --after  assets/fixtures/onboarding-after.md \
  --report /tmp/onboarding-review.html
```

Output:

```text
Compared onboarding-before.md → onboarding-after.md (markdown, tier full)
  +4  −0  ~5  moves≈0  unchanged 12
  report: /tmp/onboarding-review.html
```

`+4` added lines, `~5` changed in place, no removals — the additions are the new "First Login" section and expanded bullets; the changes are the reworded sentences, shown with word-level highlights.

## 2. Verify the report

```bash
python3 scripts/validate_report.py /tmp/onboarding-review.html
# -> PASS /tmp/onboarding-review.html
```

Open the file in any browser, offline. The unified view shows old/new line numbers, a `+`/`−` marker column, collapsed unchanged runs, and inline `<mark>` highlights on changed words. Add `--view side-by-side` for two columns.

## 3. The automatic (snapshot) flow

The same result via the baseline workflow — capture before editing, compare after:

```bash
cp assets/fixtures/onboarding-before.md /tmp/doc.md
python3 scripts/create_diff.py snapshot /tmp/doc.md         # BEFORE the edit
cp assets/fixtures/onboarding-after.md /tmp/doc.md          # the "edit"
python3 scripts/create_diff.py compare /tmp/doc.md --report /tmp/review.html
```

`compare` reads the latest baseline as "before" and the current file as "after". The source (`/tmp/doc.md`) is never written by the tool — only your `cp` changed it.

## 4. JSON for automation

```bash
python3 scripts/create_diff.py compare-pair \
  --before assets/fixtures/onboarding-before.md \
  --after  assets/fixtures/onboarding-after.md \
  --report /tmp/r.html --json
```

```json
{
  "format": "markdown", "fidelity_tier": "full",
  "added": 4, "removed": 0, "changed": 5,
  "unchanged": 12, "possible_moves": 0,
  "total_changes": 9, "identical": false,
  "report": "/tmp/r.html"
}
```

Use `total_changes`/`identical` to decide whether a review is even needed, and `fidelity_tier` to decide how much to trust it.
