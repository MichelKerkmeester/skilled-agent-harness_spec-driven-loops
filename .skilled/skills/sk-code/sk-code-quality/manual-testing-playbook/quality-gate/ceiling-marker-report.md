---
id: CQ-015
category: quality_gate
title: 'The ceiling report tags the markers whose trigger cannot fire'
description: "This scenario validates the ceiling-marker report for `CQ-015`. It runs the report over a small folder holding one marker per tag state and confirms each output line, the closing counts line and the exit status, then replays the report's own test cases."
expected_intent: QUALITY
expected_resources:
  - scripts/ceiling-report.sh
  - scripts/check-comment-hygiene.sh
  - assets/comment-syntax.json
catalog_applicable: true
version: 1.0.0.0
---

# CQ-015: The Ceiling Report Tags The Markers Whose Trigger Cannot Fire

This document captures the report contract, execution process, source anchors and metadata for `CQ-015`.

---

## 1. OVERVIEW

This scenario validates the ceiling-marker report for `CQ-015`. `scripts/ceiling-report.sh` is the ON_DEMAND resource the skill names for a debt pass, a release check or a reviewer who asks what limits the code knowingly accepts. It lists every comment that starts with `ceiling:` or `intentional-limit:`, splits the text after the colon at its first semicolon or comma, and treats the part after that split as the trigger. A marker with no trigger is tagged `no-trigger`. A trigger with no digit, no percent sign and no measurable term is tagged `no-signal`, which is the case the report exists for: a limit whose stated escape condition can never be observed.

The report reads what counts as comment text through `check-comment-hygiene.sh`, so it never keeps a second copy of the language rules. It prints one `path:line  text  [tags]` line per marker, then `markers=N no-trigger=N no-signal=N`, and exits 0 because it reports and does not gate. This scenario pins all three tags, the counts and the exit status.

### Why This Matters

A ceiling marker is a promise about a deliberate shortcut, and the trigger is the sentence that says when the shortcut stops being acceptable. A marker with no trigger, or one whose trigger names nothing measurable, is a limit nobody can revisit, so it survives every release. The report is the only place that failure is visible, and it is a report rather than a gate, which is why its exit status and counts matter as much as its lines: a reader who mistook a finding for a failure would stop a release on a debt list.

---

## 2. SCENARIO CONTRACT

Operators confirm that one marker per tag state prints its own line with the right tag, that the closing line counts them, and that the report exits 0 and reports rather than gates.

- Objective: confirm the three tag states, the marker text on each line, the closing counts line and the exit status.
- Real user request: `Before we cut the release, show me the shortcuts in this module and whether each one has a condition that can actually fire.`
- Prompt: `List the ceiling markers in this module and tell me which ones have no measurable trigger.`

**Exact prompt**:

```text
List the ceiling markers in this module and tell me which ones have no measurable trigger.
```

- Fixture: a scratch folder outside the repository holding one JavaScript module with three markers, one per tag state.

| Marker | Seeded text | What the report must say |
| --- | --- | --- |
| trigger with a number | a ceiling marker whose trigger reads `revisit past 10k rows` | the line ends in `[]`, because a digit makes the trigger measurable |
| no trigger | a ceiling marker with no semicolon and no comma | the line ends in `[no-trigger]` |
| trigger with no signal | a ceiling marker whose trigger reads `revisit when the queue backs up` | the line ends in `[no-signal]`, because it carries no digit and no measurable term |

- Expected execution process: the operator reads the report's own usage block, builds the three-marker module in a scratch folder, runs the report over that one file and reads each line and the closing counts line. The operator then replays the report's test cases, which cover the comment families it reads and the argument errors it refuses.
- Expected signals: three marker lines in file order, tagged `[]`, `[no-trigger]` and `[no-signal]`; a closing `markers=3 no-trigger=1 no-signal=1` line; and exit `0` from both the report and its suite.
- Desired user-visible outcome: the reviewer gets a list of the shortcuts with their triggers and the two a reader cannot act on, and knows the report made no blocking claim.
- Pass/fail: PASS if every value in the expected-result table below holds and both commands exit 0. FAIL if a tag is wrong, a marker is missing, the counts disagree with the lines, or the report exits non-zero over markers it found.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List the ceiling markers in this module and tell me which ones have no measurable trigger.`

### Commands

Run the commands from the repository root in one shell session, so the folder set in step 1 stays defined.

1. Build the fixture under a scratch folder and set `TMP`.

```bash
TMP="$(mktemp -d)"
cat > "$TMP/scan.js" <<'JS'
// ceiling: the scan stops at the first match; revisit past 10k rows
// ceiling: the retry cap is fine for now
// ceiling: single-threaded by design, revisit when the queue backs up
module.exports = {};
JS
```

2. `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh "$TMP/scan.js"; echo "report exit $?"`
3. `bash .skilled/skills/sk-code/sk-code-quality/scripts/tests/ceiling-report.test.sh; echo "suite exit $?"`
4. `for p in scripts/ceiling-report.sh scripts/check-comment-hygiene.sh assets/comment-syntax.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`
5. Clean up: `rm -rf "$TMP"`

### Expected

Step 2 prints three marker lines with the scratch folder in place of `<scratch>`, then the counts line and the exit line. The report is a Python entrypoint behind a `.sh` name, so it runs directly and never through `bash`:

```text
<scratch>/scan.js:1  // ceiling: the scan stops at the first match; revisit past 10k rows  []
<scratch>/scan.js:2  // ceiling: the retry cap is fine for now  [no-trigger]
<scratch>/scan.js:3  // ceiling: single-threaded by design, revisit when the queue backs up  [no-signal]
markers=3 no-trigger=1 no-signal=1
report exit 0
```

Step 3 prints one `PASS` line per test case and a closing `All ceiling report test cases passed`, then `suite exit 0`. Step 4 prints `OK` for all three paths. Step 5 prints nothing.

| Signal | Expected value |
| --- | --- |
| marker lines | three, in file order, each `path:line  text  [tags]` |
| tags | `[]`, `[no-trigger]`, `[no-signal]` |
| counts line | `markers=3 no-trigger=1 no-signal=1` |
| report exit | `0` |
| suite result | every case `PASS`, then `All ceiling report test cases passed` |
| suite exit | `0` |
| scratch folder after step 5 | removed |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the three marker lines, the counts line, the report's exit line, the suite's closing line and its exit line, and the four `OK` lines. Save the transcript under the dated run label the playbook names. The report is a debt list, so the transcript must not describe it as a gate result either way.

### Pass / Fail

- **Pass**: the three lines carry the three tags, the counts line reads `markers=3 no-trigger=1 no-signal=1`, the report and the suite each exit `0`, and the scratch folder is removed.
- **Fail**: a tag is missing or wrong, a marker is absent from the output, the counts disagree with the lines, either command exits non-zero, or the scratch folder survives step 5.

### Failure Triage

1. If the report exits `2`, read its stderr: it refuses an unknown option, a path that does not exist, a directory, a folder outside a git repository when it is run with no arguments, and a comment-family table it cannot read.
2. If a marker line is missing, confirm the marker starts the comment text after the comment prefix. A marker later in a sentence is prose, and a marker inside a string, a heredoc body or a YAML block scalar is never comment text.
3. If the `no-signal` case reads `[]`, its trigger carries a digit or a term the report treats as measurable, such as `rows`, `count`, `size`, `rate`, `load`, `latency` or `MB`. Reword the trigger without one.
4. If the suite fails on one case, rerun `bash -x` over that case alone and read the report's own output for the fixture it built.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: no entry; the nearest is [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog describes the runner and its checks, and names no ceiling-report entry |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ceiling-report.sh](../../scripts/ceiling-report.sh) | The report, its marker grammar and its tag rules |
| [check-comment-hygiene.sh](../../scripts/check-comment-hygiene.sh) | The checker the report loads for comment text and language |
| [comment-syntax.json](../../assets/comment-syntax.json) | The comment families and extensions the report reads |
| [ceiling-report.test.sh](../../scripts/tests/ceiling-report.test.sh) | The report cases this scenario replays |
| [SKILL.md](../../SKILL.md) §3 | The ON_DEMAND load level and the usage line this scenario exercises |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/ceiling-marker-report.md`
