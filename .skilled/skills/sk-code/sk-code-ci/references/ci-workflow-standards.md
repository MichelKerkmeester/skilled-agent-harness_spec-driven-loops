---
title: CI Workflow Standards - Rule Index
description: The index of the repository's GitHub Actions workflow rules, each with the file and line that prove it and whether a machine gate enforces it.
trigger_phrases:
  - "ci workflow standards"
  - "github actions workflow rules"
  - "workflow rule index"
  - "sha pinned actions"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# CI Workflow Standards - Rule Index

The normative list of rules the repository's workflows follow, with the evidence behind each and an honest note on what enforces it.

---

## 1. OVERVIEW

### Purpose

A reader lands here first, then follows a row to the detailed file. The counts are the values read on the tree when this packet was written. Re-run the quoted command before relying on one, because the workflow files change faster than this index.

### Reading the Enforcement Column

A row says **machine gate** when a script or workflow fails on a violation. It says **honour-system** when nothing checks the rule, so only a reviewer who knows it will catch a lapse. A rule with no enforcement is honour-system, and this index says so rather than implying a check exists.

---

## 2. THE RULES

| Rule | Statement | Followed today | Evidence | Enforcement |
|---|---|---|---|---|
| Path parity | The path parity rule: every path filter and hook input that names one source root names its twin in the other root, so `.skilled/` and `.opencode/` stay mirrored | Yes | `.github/scripts/check-gate-inputs.sh:112-124` (the twin matcher), run by `.github/workflows/gate-inputs.yml` | Machine gate. The only workflow rule one enforces |
| SHA-pinned `uses:` | Every remote action is pinned to a full 40-character commit SHA with the release tag as a trailing comment | 33 of 33 workflows, 91 remote `uses:` lines | `.github/workflows/advisory-checks.yml:26` (`actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`). Dependabot keeps the pins current through the `github-actions` ecosystem in `.github/dependabot.yml:33` | Honour-system. Dependabot refreshes a pin but nothing rejects an unpinned one |
| README row per workflow | Every file in `.github/workflows/` has one row in the contents table of the workflow README, and a trigger row in the push versus pull-request table | 33 of 33 | `.github/workflows/README.md:26-58` (contents) and `.github/workflows/README.md:73` (the push versus pull-request row for `message-contract.yml`) | Honour-system |
| `set -euo pipefail` | A multi-line `run:` block starts with `set -euo pipefail`. A report-only step that must keep going on a failure uses `set -uo pipefail` and says why | 28 of 29 files with a multi-line `run:` carry `set -euo pipefail`. `.github/workflows/advisory-checks.yml:34` is the deliberate `-uo` case, because its steps are report-only | `.github/workflows/message-contract.yml:81` (`set -euo pipefail`), `.github/workflows/advisory-checks.yml:34` | Honour-system here. The shell doctrine is owned by `sk-code-skilled` |
| Fork and secret safety | No `pull_request_target` trigger. A free-text event field (branch name, body, title, commit message) reaches a script only through `env:`, never interpolated into `run:`. Only hex SHAs and numbers are interpolated in a script | Yes. No workflow uses `pull_request_target` | `.github/workflows/message-contract.yml:72-79` (head ref and body passed through `env:`) | Honour-system |
| Matrix and `fail-fast` | A matrix whose entries report independently sets `fail-fast: false`, so one failing entry does not cancel the others | Both matrix workflows set it | `.github/workflows/pi-extension-tests.yml:57` and `.github/workflows/opencode-dual-version.yml:91` | Honour-system |
| Trigger and filter shape | Generated-path rules are push-only, a rebuild commit skips the downstream workflows and one trigger is a recorded exception | Yes | `references/trigger-and-filter-rules.md` | Mixed. See that file |
| Job shape | Timeouts, least-privilege permissions, the concurrency template, the composite setup action and the switch condition | Partly. Each row in `references/job-shape-rules.md` states its own count | `references/job-shape-rules.md` | Honour-system |
| Protected workflows | A workflow protected by function is never edited or switched off without a second named confirmation | Yes | `references/protected-set.md` | Honour-system |

---

## 3. HOW TO APPLY THE INDEX

1. Find the rule row for the change. A new workflow touches every row, so start from `assets/workflow-template.yml` instead.
2. Re-run the quoted command or open the cited line. A count that no longer matches means the tree moved, so trust the tree and refresh this file.
3. Where the enforcement is honour-system, check the rule by hand, because a green CI run proves nothing about it.
4. Where the change reaches a protected workflow, stop and follow `references/protected-set.md`.

### Quick Checks

```bash
grep -hE '^\s*-?\s*uses: ' .github/workflows/*.yml | grep -v 'uses: \./' | grep -vE '@[0-9a-f]{40}( |$)'
for f in .github/workflows/*.yml; do grep -qF "$(basename "$f")" .github/workflows/README.md || echo "no row: $f"; done
grep -l 'pull_request_target' .github/workflows/*.yml
```

The first prints nothing when every remote action is pinned. The second prints a line for each workflow that has no row in the workflow README. The third prints nothing when no workflow uses `pull_request_target`.
