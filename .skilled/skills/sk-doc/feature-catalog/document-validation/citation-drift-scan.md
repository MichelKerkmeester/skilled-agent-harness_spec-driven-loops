---
title: "Citation Drift Scan"
description: "Reports the dead file-and-line citations in the tracked skill docs, where the target is gone or the cited line sits past its end, so an author can repair the citation before a reader follows it."
trigger_phrases:
  - "citation drift scan"
  - "skill doc citation drift check"
  - "citation drift advisory"
  - "cite-drift-scan.mjs"
  - "cite-drift-labels.jsonl"
version: 2.2.0.0
---

# Citation Drift Scan (cite-drift-scan.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reports the dead file-and-line citations in the tracked skill docs, where the target is gone or the cited line sits past its end, so an author can repair the citation before a reader follows it.

`cite-drift-scan.mjs` counts every `<path>.<ext>:<line>` citation in the prose of the tracked skill docs and resolves each one against the tracked files. It prints one count line per skill, a totals line and one `cite dead:` line per dead citation, then measures offline whether a Jev call flags a drifted citation better than two fixed comparators. Its default run makes zero model calls, and it changes no citation, no validator and no cited file. Doc validation also runs it as a non-blocking advisory on the document being validated, described at the end of section 2.

---

## 2. HOW IT WORKS

The scan reads each tracked skill doc at `HEAD` and takes citations from prose only, because a line inside a fenced code block is an example rather than a claim. It resolves each citation in order against the citing doc's own folder, the repository root, the citing doc's skill root and then a unique basename among the tracked files. A target that is missing on disk, or cited past its last line, is dead and prints as `cite dead: <doc>:<line> -> <target>:<line>`. A citation to a `.env` file, or to a file that exists on disk but is not tracked, is refused and never opened. A citation that matches no tracked path and no file on disk is unresolved. Every run except `--draw` prints one `skill <skill>: citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, then the totals line, then `margin: 0.10` and the `keep rule:` line, all before any call. The default run makes no model call and writes no file.

The two comparators are flag nothing, and identifier overlap. Identifier overlap takes the claim's own identifiers from the citing line's code spans, after removing every citation, path, file name and line reference and every part of the cited file's own path, and flags the citation when none of them appears as a whole identifier in the window around the cited line. A path names the whole cited file, so it cannot say whether the window still holds the claim. To measure them the script draws a labeled sample. `--draw --seed <n>` writes 40 rows to the labels file `cite-drift-labels.jsonl`, 20 live citations whose `verdict` and `labeler` fields stay null until the operator labels them `supports`, `partial` or `contradicts`, and 20 constructed rows whose window was moved 60 lines down its own file and marked `verdict: contradicts` and `labeler: construction`. `supports` counts as clean, `partial` and `contradicts` as drifted, and no model writes a label. `--draw` exits 2 without writing when the labels file already holds a row with any `labeler`, which includes the 20 construction rows every draw writes, and a draw prints only its one `draw:` line. With fewer than 40 labeled rows the run prints `stop: fewer than 40 labeled rows` and stops there. With 40 or more it prints the two comparator lines and the baseline, then `no headroom` when the baseline leaves no room for the 0.10 margin, or `underpowered: winnable=<n>` when fewer than 5 rows are winnable.

`--jev` runs the backend, and needs `--out <dir>` so every call is recorded. Its check runs before its arm and calls no model, and a failed check prints its skip line, such as `jev arm skipped: no credential`. A check that passes below a gate prints `jev arm skipped: label gate`, `jev arm skipped: no headroom` or `jev arm skipped: underpowered`. Each call asks the fixed question `Does the cited code window still show what the citing sentence claims?`. A run whose arm is skipped or stopped still exits 0, while a bad invocation exits 2 before any call. Each call record names the model that answered it, read from the transport's outcome with the `jev auth test` model standing in when the outcome names none, and carries the token usage when the answer reports it. The verdict line's `model=` names every model that answered a measured call, joined by `+`, so a run whose calls moved between Pi and the CLI reads as a model change against an earlier report.

**Advisory check in doc validation.** `validate_document.py` ends its human report by running `cite-drift-scan.mjs --advise <doc>` on the document it validated. The check reads only that document's citations, from the working tree, and skips every citation that does not resolve in range. It stays silent unless `jev --version` answers `jev 0.6.2` and `jev auth status` finds a stored credential. Each citation gets the measured protocol: one call, two more when the first score falls between 0.35 and 0.65, and a flag when the lowest score falls below 0.5. The claim is the citing line, as in the labels the keep was measured on. A flagged citation prints `cite-drift advisory: <doc>:<line> cites <target>:<line>, whose window may no longer show the claim (p_yes=<p>)`, and a summary line gives `checked`, `flagged` and `unchecked`. One run asks about at most 20 citations within 60 seconds and counts the rest as unchecked.

The check never changes the validator's exit code. It does not run with `--json`, which batch callers read, or with `--blocking-only`. `SKDOC_CITE_DRIFT_CHECK=0` skips it before anything is spawned, and `SKDOC_CITE_DRIFT_OUT=<dir>` records each call in `<dir>/calls.jsonl`, appending across documents.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Script | Counts and resolves the citations, draws the label sample, runs the gate and the backend arm, and serves the advisory check |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Script | Runs the advisory check at the end of its human report |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Node test | The extraction, resolution, draw, comparator, gate, arm and advisory cases on a fixture repository with a stub backend |
| `.skilled/skills/sk-doc/scripts/tests/test_cite_drift_advisory.py` | Automated test | The validator's advisory: the same exit code with and without flags, silence without a credential, the opt-out, and no check under `--json` or `--blocking-only` |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md` | Manual playbook | Runs the zero-call default and one stub-backend skip against the real tree |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/citation-drift-scan.md`

Related references:
- [goal-criteria-lint.md](goal-criteria-lint.md) - flags goal completion criteria a reader cannot check from the line alone
- [changelog-entry-frontmatter-check.md](changelog-entry-frontmatter-check.md) - blocks a changelog entry that lacks the search metadata a spec document carries
