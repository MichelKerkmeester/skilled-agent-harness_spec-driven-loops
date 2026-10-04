---
title: "Citation Drift Scan"
description: "Reports the dead file-and-line citations in the tracked skill docs, where the target is gone or the cited line sits past its end, so an author can repair the citation before a reader follows it."
trigger_phrases:
  - "citation drift scan"
  - "skill doc citation drift check"
  - "cite-drift-scan.mjs"
  - "cite-drift-labels.jsonl"
version: 2.2.0.0
---

# Citation Drift Scan (cite-drift-scan.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reports the dead file-and-line citations in the tracked skill docs, where the target is gone or the cited line sits past its end, so an author can repair the citation before a reader follows it.

`cite-drift-scan.mjs` counts every `<path>.<ext>:<line>` citation in the prose of the tracked skill docs and resolves each one against the tracked files. It prints one count line per skill, a totals line and one `cite dead:` line per dead citation, then measures offline whether a Jev call flags a drifted citation better than two fixed comparators. It makes zero model calls by default and changes no citation, no validator and no cited file.

---

## 2. HOW IT WORKS

The scan reads each tracked skill doc at `HEAD` and takes citations from prose only, because a line inside a fenced code block is an example rather than a claim. It resolves each citation in order against the citing doc's own folder, the repository root, the citing doc's skill root, then the redirect table of renamed directories and last a unique basename among the tracked files. A citation found through the redirect table counts as `moved_in_range` or `moved_past_end`, and one found only by basename counts as `basename_only` rather than in range. A target that is missing on disk, or cited past its last line, is dead and prints as `cite dead: <doc>:<line> -> <target>:<line>`. A citation to a `.env` file, or to a file that exists on disk but is not tracked, is refused and never opened. A citation that matches no tracked path and no file on disk is unresolved. Every run except `--draw` prints one `skill <skill>: citations=<n> in_range=<n> past_end=<n> moved_in_range=<n> moved_past_end=<n> basename_only=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, then the totals line, then `margin: 0.10` and the `keep rule:` line, all before any call. The default run makes no model call and writes no file.

The two comparators are flag nothing, and identifier overlap between the citing sentence and the window around the cited line. To measure them the script draws a labeled sample. `--draw --seed <n>` writes 40 rows to the labels file `cite-drift-labels.jsonl`, 20 live citations whose `verdict` and `labeler` fields stay null until the operator labels them `supports`, `partial` or `contradicts`, and 20 constructed rows whose window was moved 60 lines down its own file and marked `verdict: contradicts` and `labeler: construction`. `supports` counts as clean, `partial` and `contradicts` as drifted, and no model writes a label. `--draw` exits 2 without writing when the labels file already holds a row with any `labeler`, which includes the 20 construction rows every draw writes, and a draw prints only its one `draw:` line. With fewer than 40 labeled rows the run prints `stop: fewer than 40 labeled rows` and stops there. With 40 or more it prints the two comparator lines and the baseline, then `no headroom` when the baseline leaves no room for the 0.10 margin, or `underpowered: winnable=<n>` when fewer than 5 rows are winnable.

`--jev` runs the backend, and needs `--out <dir>` so every call is recorded. Its check runs before its arm and calls no model, and a failed check prints its skip line, such as `jev arm skipped: no credential`. A check that passes below a gate prints `jev arm skipped: label gate`, `jev arm skipped: no headroom` or `jev arm skipped: underpowered`. Each call asks the fixed question `Does the cited code window still show what the citing sentence claims?`. A run whose arm is skipped or stopped still exits 0, while a bad invocation exits 2 before any call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Script | Counts and resolves the citations, draws the label sample and runs the gate and the backend arm |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Node test | The extraction, resolution, draw, comparator, gate and arm cases on a fixture repository with a stub backend |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md` | Manual playbook | Runs the zero-call default and one stub-backend skip against the real tree |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/citation-drift-scan.md`

Related references:
- [goal-criteria-lint.md](goal-criteria-lint.md) - flags goal completion criteria a reader cannot check from the line alone
- [changelog-entry-frontmatter-check.md](changelog-entry-frontmatter-check.md) - blocks a changelog entry that lacks the search metadata a spec document carries
