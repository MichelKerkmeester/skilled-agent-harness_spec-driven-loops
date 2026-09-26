# Portable HTML reports

Supercov's terminal queries are deliberately small for coding agents. The HTML
report is the human view over the same immutable local evidence.

```sh
npx supercov report
```

This writes `.supercov/reports/supercov-report.html` and opens it in your
default browser. The store carries its own `.gitignore`, so the report cannot
be committed by accident; `--output` puts it anywhere else, relative to the
directory you run the command from. The file contains its application, styles, and compressed
evidence. It works after the file is moved, attached to a pull request, or
opened on a machine that does not have Supercov installed. It does not need a
server, extraction step, file picker, external font, CDN, or network request.

## What the report answers

The first screen is ordered around four questions:

1. Did the measured command pass?
2. Is the measurement complete and still current?
3. What changed from the comparison run?
4. What is the next concrete line, branch, or MC/DC obligation to test?

Sidebar entries pair the recorded time with compact Coverage, Assertions, and
Quality charts, plus a Security shield showing the flagged-file count. Missing metrics keep neutral gray charts and show a dash rather
than a zero, including in file lists and detail headers.

The **Overview** groups coverage and assertion evidence in one full-width card,
followed by Quality and Security. All four measures use the same small heading.
The run header shows its recorded branch (when available), short commit, local
change state, and date. The inline **Test command** action opens the recorded command in a
modal.
Older runs without a branch keep their recorded commit; the current checkout's
branch is never substituted for historical metadata.

**Coverage** counts obligations and never averages them. The ring summarizes
lines, statements, functions, branches and MC/DC conditions. **View breakdown**
opens a modal with a circle chart and percentage for each type; a category with navigable gaps opens the files that owe
it. Empty coverage shows no percentage. The test outcome counts, source-file count and
duration appear beneath the coverage and assertion summaries. Failed tests,
measurement limits and stale source remain explicit.

**Assertions** shows the share of measured statements credited by recorded
assertion links. Its arc retains a gap because the map's completeness is unknown.
Missing links do not prove that code has no assertions. Unavailable or stale
maps show an unavailable state rather than a percentage. Below the summaries,
the report lists files with coverage gaps first, or the lowest assertion-credit
percentages when coverage is complete. File, Coverage and Assertions headers
change the order; **All files** keeps that ordering in the complete list. Each
row opens the file's evidence.

**Quality** shows its score, band, assessment scope and files, initially sorted
by lowest score. Its File and Quality headers change the sort order. Main
concerns appear as compact labeled pills with distinct icons. Recorded 0–1
values remain available on hover and in the file assessment. Higher values
receive a stronger warm tint; these values are not severity grades. The quality gauge colors its existing weak, fair and good bands,
and the band label sits beside the score. It is a ranking,
not a target. **Security** reads saved audits from `.supercov/security/`. It shows
flagged files, file-level and line-confirmed findings, CWE references, and
cross-file paths. These are patterns to review, not a security score or proof
of exploitability. Audits pair with coverage only when recorded source digests
agree; other audits get their own timeline entry. Repeated security audits of identical
files and source bytes share one entry showing the newest result; older snapshots
remain stored. Missing or failed assessments
remain explicit.

**Files** includes measured and security-assessed files with four marks in order:
Coverage, Assertions, Quality, and Security. Each column is sortable. Security
shows a finding count with an amber shield when findings exist, green for zero,
and gray when unassessed. Its **All files** action opens this list with the most
findings first. Cross-file findings appear below the list with links to both
endpoints, and each path contributes to the count on each involved file. The list is one
card with spacious rows and rounded hover highlights, without divider rules or
redundant file-status dots. Narrow lists stack paths above labeled metrics and
wrap concerns instead of scrolling sideways. On wide screens, paths appear on one line,
with the directory muted and the basename emphasized. Below about 40 pixels a
coverage ring drops its arc and carries state alone, because a missing sliver
thinner than a pixel would read as complete. Arriving from a kind on the
overview narrows the list to the files owing it, behind a scope the reader can
see and dismiss. The file view explains each unreached obligation's evidence
beside the source.
When an assertion map explains this run, the source view also marks each
statement the map credits, and the file list shows how many of a file's
statements are credited. Credit is per statement: a line holding a guard and a
claimed consequence is marked for the consequence alone. One compact gutter
button contains both coverage and assertion symbols and opens a rounded inline
card with both kinds of evidence. Coverage
includes attributed tests, open obligations, measurement limits and decision
evidence. Named test rows show their file locations. Assertion cards lead with
the observed behavior and flow explanation, followed by the expression and test
location. Missing links and unavailable maps have explicit empty states.

The **Improve** buttons open copyable, metric-specific prompts for Codex, Claude
Code, Gemini CLI, or another coding agent. The dialog shares supercov.com's
numbered steps and copy controls, with two options for each action. The native
command is detected from the recorded test command and source extensions.
Prompts contain the native Supercov command, project, saved run or assessment,
optional file path, current metric value, and next action. File prompts use the
file's value; overview prompts use the project value. Unavailable metrics are
labeled unmeasured or unassessed. This context appears in the prompt paragraph.
Coverage breakdowns are available for both the project and individual files,
with a circle chart and percentage for each coverage type.
The **New run** button beside
the view tabs opens a prompt to measure the current project, reusing the saved
test command when available. Neither button executes commands or requires report
generation. Security prompts include the saved audit ID and current findings,
and use the `npx supercov security` command.

File headers show Coverage, Assertions, Quality, and Security without repeating
the detailed counts. Below the source, Tests comes before Assertions and Quality,
with Security last. Unavailable security results remain labeled Not assessed.

A file's **Assertions** card previews three linked assertions and opens a searchable modal for all
of them. Selecting one jumps to its source evidence. The **Quality** card pairs
the gauge with descriptions from the assessment's property catalog and shows
each recorded property value beside its concern. **Tests covering this file** previews the three
tests reaching the most lines, with an **All tests** action into the filtered test
browser. These lists share the same flat row treatment.

A statement's coverage is recorded on the line where it starts. Lines that
continue it, such as the remaining arguments of a call or a block's closing
brace, take that line's state in the source view rather than reading as
non-executable; comments and blank lines inside a statement do not.
**Tests** uses inset, padded lists inside cards at the file and individual-test
levels. Evidence lists use explicit buttons and searchable modals rather than
disclosure dropdowns. It shows runner, kind, outcome, retry, and attributed
source information, and opens from any assertion that credits a file.

The address bar follows the reader: tab, timeline entry, file and line each
get a history entry, so the browser's back button retraces the path.

## Choose runs and output

Up to ten recent runs are included by default. The selected run is compared with
the previous saved run automatically:

```sh
npx supercov report
npx supercov report <run-id>
npx supercov report latest --compare <older-run-id>
```

Include more local history or choose a destination with:

```sh
npx supercov report --runs 5
npx supercov report --output artifacts/coverage.html --no-open
```

`--runs` accepts 1 through 20. The generated file is capped at 24 MB, leaving
room under GitHub's normal 25 MB attachment limit. A report that exceeds the
cap is not written; retry with fewer runs.

## Source integrity

Stored evidence always supplies immutable source locations and snippets. Full
authored source is added only when its current source fingerprint is identical
to the selected run. A test-only change can therefore mark a run stale while
its source remains safe to show. If authored source changed, the report labels
that run as stale and uses the stored snippets instead of displaying newer code
beside older coverage.

Individual source files over 1 MB and total source beyond 16 MB are omitted.
The report names its source mode and any omitted paths rather than silently
substituting content.

## Privacy and sharing

The report includes source, test names, commands, and coverage evidence. Treat
it like any other development artifact and share it only with intended
reviewers. Supercov does not include environment variables or raw test output,
and the report has a content-security policy that blocks outbound connections.

For an ordinary pull request, attach the report file from
`.supercov/reports/` to the description or a comment. GitHub serves HTML attachments as downloads. The reviewer clicks
the attachment, downloads the single file, and opens it locally.
