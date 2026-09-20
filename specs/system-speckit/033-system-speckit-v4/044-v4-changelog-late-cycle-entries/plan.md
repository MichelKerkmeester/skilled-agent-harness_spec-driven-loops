---
title: "Implementation Plan: v4 changelog late-cycle entries"
description: "Extend the After This Draft section with the jev and orca late-cycle moves using anchor-asserting edits, verifying every cited fact against its live source before the edit lands."
trigger_phrases:
  - "v4 changelog late cycle plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4 changelog late-cycle entries

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Input** | The two skills' own changelogs (`cli-jev` v0.1.0.0 and v0.2.0.0, `cli-orca` v0.1.0.0), the recorded benchmark reports, and `git log` |
| **Method** | Two anchored line replacements in the After This Draft list, plus the count correction in its intro |
| **Verification** | `git log` per cited hash, `rg` on the benchmark reports, a `python3` mode-count read, an HVR sweep of the changed lines, parent `validate.sh --strict` |

Each new sentence names its evidence before it is written: the hash first resolves through `git log`, the verdicts first appear in the recorded reports, the mode count first reads out of the live registry. The edit follows the section's established voice, bold label, hashes in parentheses, story in prose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. PHASES

### Phase 1: Verify the claim set

Every sentence the changelog will gain names its evidence first.

| Phase | Work | Output |
|-------|------|--------|
| 1 | Resolve and verify every fact: hashes, verdicts, mode count, commit total | verified claim set |
| 2 | Apply the two bullet rewrites and the count correction in one anchored edit | patched changelog |
| 3 | HVR sweep on the changed lines, parent strict validation, commit and push | committed evidence |
<!-- /ANCHOR:phases -->
