---
title: Create Diff Fixtures
description: Runnable before-and-after fixture files for demonstrating and validating the local create-diff workflow.
trigger_phrases:
  - "create diff fixtures"
  - "before and after diff example"
  - "onboarding diff fixture"
  - "run create diff example"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# create-diff fixtures

A runnable before/after worked example for the local create-diff workflow.

---

## 1. OVERVIEW

`onboarding-before.md` and `onboarding-after.md` are two versions of the same onboarding guide: the "after" edits a sentence, expands two bullets, adds a "First Login" section, and extends the support line.

## 2. RUN IT

From the packet directory (`.opencode/skills/sk-doc/sk-create-diff/`):

```bash
python3 scripts/create_diff.py compare-pair \
  --before assets/fixtures/onboarding-before.md \
  --after  assets/fixtures/onboarding-after.md \
  --report /tmp/onboarding-review.html

python3 scripts/validate_report.py /tmp/onboarding-review.html
```

Expected summary: `markdown, tier full` with additions and in-place changes and no removals. Open `/tmp/onboarding-review.html` in any browser (offline) to see the unified report; add `--view side-by-side` for the two-column layout.

These fixtures are also used by the walkthrough in `../../references/worked-example.md`.
