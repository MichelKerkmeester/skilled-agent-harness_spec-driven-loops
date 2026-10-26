---
title: "Decision Record: Phase 7: checker-debt-closeout"
description: "Six decisions for closing the phase 001 checker debt: one extraction path, template literals and heredocs as strings, the marker grammar, the bare-string rule, how frozen evidence is cleared and the tree delta rule."
trigger_phrases:
  - "checker debt closeout decision record"
  - "frozen evidence hygiene-ok decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/007-checker-debt-closeout"
    last_updated_at: "2026-10-26T06:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded ADR-001 to ADR-006"
    next_safe_action: "Confirm ADR-001 to ADR-006 at program end"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 7: checker-debt-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

The operator asked for an autonomous build, so each decision below takes the default this phase judged best and carries the status "Accepted, pending operator confirmation at program end". Each one names its alternatives and its reversal. The design behind the packet does not cover this phase, so these are this phase's own judgments, drawn from the measurements of 2026-10-26 at `f69e5cd2e8`.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The ceiling report loads the checker file and reads comment text through it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-001-context -->
### Context

The ceiling report keeps its own comment scanner, `family_reader`, `find_unquoted_comment` and `comment_text` (`ceiling-report.sh:49`, `:74`, `:102`). Its own comment says why: the checker is a shell entrypoint with no importable module (`:71-73`). The two copies disagree. On 2026-10-26 the report listed a `# ceiling:` line inside a YAML block scalar and inside a triple-quoted data string, where the checker reads text and reports nothing. The brief asks for one code path, not a second copy of the rules.

### Constraints

- CI, pre-commit, the runner and the post-edit router call the checker by its path, so the checker must keep its path and run alone.
- The 6.4 baseline and the `missing_table` suite case copy the checker out of its folder, so the checker must not import a sibling module.
- The report must write no file, and it runs on python3 3.9.6 here.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the report loads `check-comment-hygiene.sh` from beside its own real path with `importlib.machinery.SourceFileLoader`, with bytecode writing turned off first, and calls its `load_table`, `language_for`, `ScanState` and `comment_text`. The report keeps only its marker grammar, its trigger tags and its tracked-file walk.

**How it works**: The loader accepts a file of any name, so the `.sh` entrypoint needs no rename. A probe on 2026-10-26 loaded a copy of the checker this way, read its table and wrote no bytecode file. When the checker cannot be loaded, the report prints one line and exits 2.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Load the checker file as a module (chosen)** | One copy of the rules, no new file, no change for the checker's callers | The report depends on a sibling file by path | 8/10 |
| Move the scanner into `scripts/lib/comment_scan.py` and import it from both | A clean module boundary | The checker stops running alone, which breaks the baseline recipe, the `missing_table` case and any repository that copies the checker by itself | 4/10 |
| Add a `--comments` mode to the checker and spawn it from the report | A process boundary, no import | A new public option on the blocking engine and a second process for every report run | 5/10 |
| Keep the second copy and teach it the missing state | No coupling | Two copies drift again, which is the defect being closed | 2/10 |

**Why this one**: It removes the second copy while every caller of the checker keeps calling the same single file.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The report and the checker can no longer disagree about what is comment text.

**What it costs**:
- A change to the checker's function names breaks the report. Mitigation: the ceiling suite calls the report on every case, so a rename fails that suite at once.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The checker file is missing beside the report | L | The report exits 2 with a message, and the `missing_checker` case covers it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The two copies disagreed on five probes |
| 2 | **Beyond Local Maxima?** | PASS | Four options were scored |
| 3 | **Sufficient?** | PASS | One loader and the removal of three functions |
| 4 | **Fits Goal?** | PASS | The brief asks for one code path |
| 5 | **Open Horizons?** | PASS | A later move to a shared module stays open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: `Q/scripts/ceiling-report.sh` and its suite (T005 to T008).

**How to roll back**: Restore `ceiling-report.sh` from `BASE`. Its suite cases for the string forms then fail, so revert the suite too.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Template literals and shell heredocs read as strings in the shared extraction

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-002-context -->
### Context

With one extraction, the report lists exactly what the checker reads as comment text. The checker reads a line inside a multi-line template literal and a line inside a heredoc body as comment text today: on 2026-10-26 it flagged `// see ADR-12` inside a template literal and `# see ADR-12` inside a `cat <<EOF` body, each with exit 1. So the report would still list a `# ceiling:` line inside those strings, which is the defect the brief names. The checker's own rule, set in phase 001, is that text inside a string is never a comment. A scan of the 63 tree findings found 2 inside a heredoc and 1 inside a template literal. That count is an inference from a scan, and T016 measures the real delta.

### Constraints

- The c family serves JavaScript, TypeScript and JSONC, and the hash family serves shell only.
- Go raw strings take no escapes, so an escape rule must not reach them.
- A narrower extraction removes findings in CI and pre-commit, so every removal must sit inside a real string.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the backtick moves to the c family's `multilineStrings`, and a backslash before it does not close the literal. The hash family gains a `heredocs` flag: a body runs from the line after `<<WORD`, `<<-WORD`, `<<'WORD'` or `<<"WORD"` to the line that holds only the word, after leading tabs for `<<-`.

**How it works**: The checker's existing open-string state carries the literal or the body across lines, and a line inside it yields no comment text. A here-string `<<<` and an arithmetic shift open nothing, and the opener's own line is still scanned for a comment.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Both are strings (chosen)** | The report stops listing markers inside them, and the checker follows its own string rule | A stray backtick or an unclosed word hides the lines after it | 7/10 |
| Leave both as comment text, and prove only that the two tools agree | No change to the blocking engine | The report still lists markers inside strings, so the limitation stays open | 3/10 |
| Teach only the report to skip them | No CI or pre-commit change | A second copy of the rules again, which ADR-001 removes | 2/10 |

**Why this one**: It closes the limitation in the one place the rules live, and phase 001 already made the same trade for YAML block scalars that hold shell.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A heading or a URL inside a prompt heredoc, and a code sample inside a template literal, no longer fail pre-commit.

**What it costs**:
- A comment inside a script fed to `bash <<EOF`, or inside a `${...}` interpolation, is no longer checked. Mitigation: the spec's edge cases record both, and the same holds for YAML `run:` blocks today.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A backtick in a regex literal keeps a literal open and hides later comments | H | T016 reads every removed delta line, and a removal outside a real string stops the phase |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checker flagged both probe strings |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One table move, one flag and the state that already exists |
| 4 | **Fits Goal?** | PASS | The brief's template literal and heredoc cases need it |
| 5 | **Open Horizons?** | PASS | Interpolation parsing can come later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: `Q/assets/comment-syntax.json`, `Q/scripts/check-comment-hygiene.sh` and the checker suite (T009, T010).

**How to roll back**: Move the backtick back to `quotes`, remove the `heredocs` flag and its state, and delete the eight new cases. Findings inside those strings then return to the tree run.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: A ceiling marker may start without a comment prefix

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-003-context -->
### Context

The report counts a marker only when the comment text starts with a comment prefix and then the marker word (`ceiling-report.sh:15`, `:60`). The checker reads docstring text and block-comment body lines as comment text with no prefix in front. Under one extraction a docstring that reads `ceiling: one pass; split it past 10 rows` would never count, although it is comment text to the checker, and the brief asks for a docstring case.

### Constraints

- Prose that holds the word later in a comment, such as `// the ceiling: a longer section`, must still not count. The `prose` case pins it.
- Code is never comment text, so a YAML key or an object key named `ceiling` cannot match.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: a marker is comment text that starts with `ceiling:` or `intentional-limit:` after an optional comment prefix.

**How it works**: The pattern stays anchored at the start of the comment text, with the prefix group made optional. A docstring line and a block body line can carry a marker, and the trigger tags are unchanged.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional prefix at the start of comment text (chosen)** | Docstring and block-body markers are found, and the rule stays one line | The report may list a few more markers than today | 8/10 |
| Keep the prefix rule | No change in what the report lists | A docstring marker would need a `#` inside the docstring, which nobody writes | 3/10 |
| Match the marker anywhere in the comment text | Finds every mention | Prose about a ceiling counts, which the `prose` case forbids | 2/10 |

**Why this one**: It counts exactly the comment text that starts with the marker, whatever form the comment takes.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A marker in a Python docstring is reported, so a debt pass sees it.

**What it costs**:
- The tree report may grow past its 3 markers. Mitigation: the report never gates, and T031 records the new count.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A block body line that opens with the word in plain prose counts | L | The word must be followed by a colon at the start of the text, which prose rarely does |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it the docstring case cannot list a marker |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One optional group in one pattern |
| 4 | **Fits Goal?** | PASS | The brief asks for a docstring case |
| 5 | **Open Horizons?** | PASS | The marker words stay a list |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: The marker pattern in `Q/scripts/ceiling-report.sh` and the `block_body_marker` case (T008).

**How to roll back**: Make the prefix group required again and flip `py_docstring_marker` to expect no marker.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Every bare string statement is comment text, and an f-string is data

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-004-context -->
### Context

The checker reads a triple-quoted string as comment text only first in a module, first in a def or class body, or right after an assignment (`check-comment-hygiene.sh:50`, `:234`). A triple-quoted string used as a block comment after other code is unchecked, and the suite pins that with `py_string_after_code` expecting exit 0 (`check-comment-hygiene.test.sh:104`). The brief asks for every bare string expression statement to count, with assigned strings, f-strings, call arguments, return values and dict values kept as data. A walk of the 339 tracked `.py` files on 2026-10-26 found 1760 string statements, none outside a documented position, none single quoted and none an f-string. The rule is therefore expected to add no tree finding in `.py` files, and T016 measures it.

### Constraints

- Python never reads an f-string as a docstring, and it evaluates one as an expression.
- The decision must be taken when the string opens, because the checker emits comment text line by line.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: a string literal, single, double or triple quoted, with an optional `r`, `u` or `b` prefix, that opens a logical line at bracket depth 0 is comment text wherever it stands. A prefix that holds `f` makes it data in every position, docstring positions included.

**How it works**: The documented-statement check is removed, and the `f` forms leave the docstring prefix set. A single-line bare string counts once its logical line ends with nothing but string literals. An assignment, a `return`, a call and a dict entry put code or a bracket before the string, so they stay data.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Every bare string statement, f-strings as data (chosen)** | One rule with no position list, and it matches how Python treats f-strings | An f-string in a docstring position stops being checked | 8/10 |
| Every bare triple-quoted statement only | Smaller change | A one-line bare string stays unchecked, so "every" is not met | 5/10 |
| Keep the documented positions | No change | The limitation stays open | 2/10 |

**Why this one**: It is the brief's rule stated once, and the measured tree impact is none.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A block-comment string anywhere in a body is checked like a docstring.

**What it costs**:
- `py_string_after_code` flips from exit 0 to exit 1, a deliberate contract change. Mitigation: this record and the quality changelog name it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A bare string whose closing line goes on with code, such as `""".strip()`, reads as comment text | L | Its value is discarded, so only a person reads it, and the spec's edge cases record the choice |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 001 recorded the gap as Known Limitation 3 |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One rule replaces a position list |
| 4 | **Fits Goal?** | PASS | The brief names the rule and its data cases |
| 5 | **Open Horizons?** | PASS | Another language's bare strings can take the same flag |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `Q/scripts/check-comment-hygiene.sh` and its suite (T012 to T014).

**How to roll back**: Restore `DOCUMENTED_STATEMENT` and the `f` prefixes from `BASE`, flip `py_string_after_code` back to exit 0 and delete the new cases.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Frozen evidence keeps its text and gains a per-line `hygiene-ok`, and live packets are rewritten

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-005-context -->
### Context

The whole-tree run at `f69e5cd2e8` reports 63 findings in 41 files, all under `specs/`. 44 lines in 27 files sit in frozen evidence: 42 lines in 25 files under a `z_archive/` folder, 4 of them in pre-promote backup copies and 1 in a review baseline, and 2 lines in 2 research lineage working trees outside an archive. The other 19 lines in 14 files sit in live packets. Frozen evidence is a record of what ran, so rewriting its comments changes the record. The brief rules out a path-wide exclusion, because it could hide live code.

### Constraints

- Each comment keeps its meaning.
- The mechanism must already be one the checker honors. The checker honors `hygiene-ok` anywhere in a line's comment text (`check-comment-hygiene.sh:431`), and its only path exclusions are `dist/`, `node_modules/` and `.git/`.
- Pre-commit checks whole files, so a frozen file that is touched must come out clean.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: in frozen evidence, each flagged comment keeps its text and gains the suffix ` hygiene-ok` at the end of its comment text, before a closing `*/` when the comment closes on the line. In live packets, each flagged comment is rewritten to its durable reason.

**How it works**: The suffix suppresses one line only, so a new comment added later to the same file is still checked. T019 checks that every changed frozen line equals its old line plus the suffix.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-line `hygiene-ok` in frozen evidence, rewrites in live packets (chosen)** | The record keeps its words, the change is the narrowest the checker honors, and nothing else is hidden | 44 lines carry an opt-out | 8/10 |
| Rewrite every comment, frozen ones included | No opt-out in the tree | The record no longer says what it said when it ran | 5/10 |
| Exclude `z_archive/`, backups and lineages by path | One line of code | Hides any live file placed under those paths, which the brief forbids | 1/10 |

**Why this one**: It is the narrowest mechanism the checker already honors, and it keeps each frozen comment word for word.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every flagged file passes pre-commit when it is next touched, and the tree run reaches 0.

**What it costs**:
- A restored pre-promote backup would carry a marked label into a live agent file. Mitigation: the four backup lines are the TOML header comments that cite a phase and an ADR, and a restore drops the suffix and rewrites them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An edit to a frozen file changes more than the suffix | M | T019's suffix-only check fails on any other change |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 44 frozen lines fail pre-commit when touched |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One suffix per line, and no code change |
| 4 | **Fits Goal?** | PASS | The brief asks for 0 findings with meaning kept |
| 5 | **Open Horizons?** | PASS | A later rewrite only removes suffixes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: The 27 frozen files and the 14 live files that `spec.md` section 3 lists (T018, T019).

**How to roll back**: Revert the commit that carries the edits. The files return to their `BASE` text and their findings return to the tree run.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The tree delta rule for the extraction changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | claude-opus-5-5, under the operator's standing build instruction |

---

<!-- ANCHOR:adr-006-context -->
### Context

ADR-002 and ADR-004 change what the blocking engine reads, so CI and pre-commit inherit the change. Phase 001 set a halt of 50 delta lines or 20 files, and its amendment counted only the delta outside `specs/`. At `f69e5cd2e8` the checker reports 0 findings outside `specs/`, so any delta line outside `specs/` is a finding this phase adds.

### Constraints

- The halt must be checkable from the delta file with no judgment at the moment of the check.
- Unlike phase 001, debt under `specs/` is not accepted here, because this phase drives the tree to 0.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: every delta line falls in a class the quality changelog counts. A delta line outside `specs/` is fixed in the same change. When the added lines outside `specs/` pass 50, or touch more than 20 files, the phase stops and asks the operator. Every line under `specs/` is cleared under ADR-005.

**How it works**: T016 saves the delta with the 6.4 recipe, and T017 counts the tab-led lines of `comm -3` whose path does not start with `specs/`.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phase 001's limits outside `specs/`, and no debt under it (chosen)** | Reuses a confirmed stop point and leaves no debt | The limits are a judgment, not a measurement | 7/10 |
| No halt | Simplest | No stop before CI inherits a large block | 3/10 |
| A halt of 0 added lines | Strictest | Stops on any honest finding a bare string reveals | 4/10 |

**Why this one**: The phase 001 limits are already pending the same operator confirmation, and the delta outside `specs/` is expected to be small.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A stop lands before CI and pre-commit inherit a large new block.

**What it costs**:
- A fix outside `specs/` widens the phase's file list. Mitigation: T034 reconciles the list with `git status`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The limits suit phase 001 but not this change | L | The operator adjusts them here and in T017 together |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The blocking engine's reading changes |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored |
| 3 | **Sufficient?** | PASS | One count over one file |
| 4 | **Fits Goal?** | PASS | The tree must reach 0 without surprises in CI |
| 5 | **Open Horizons?** | PASS | The numbers are reversible in this record |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: Tasks T016 and T017, and the class counts in `Q/changelog/v1.9.0.0.md`.

**How to roll back**: Edit the two numbers in this record and in T017 together.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---
