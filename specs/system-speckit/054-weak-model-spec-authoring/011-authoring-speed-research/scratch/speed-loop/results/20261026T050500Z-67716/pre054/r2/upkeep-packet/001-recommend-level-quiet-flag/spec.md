---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh answers one question and prints more than a dozen lines to do it. A --quiet flag prints only the recommended-level line, and every existing invocation keeps its current output byte for byte."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level.sh --quiet"
  - "recommend level one line output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` scores a task and recommends a documentation level, then prints the score, a six-row breakdown and a phase section around that single answer. Callers who want only the answer parse the output or switch to `--json`, which returns twenty fields where one was wanted. A `--quiet` flag prints the recommended-level line and nothing else.

**Key Decisions**: quiet output reuses the line the normal output already prints, rather than inventing a compact format; `--quiet` with `--json` is refused instead of resolved by precedence.

**Critical Dependencies**: None. The script is standalone Bash and the change touches one file plus one new test.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
| **Related** | `.skilled/commands/speckit/assets/speckit-plan.yaml:86` and `speckit-complete.yaml:147`, the two current callers, both using `--json` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` answers one question: which documentation level a task needs. `output_text()` at `:508-558` prints the answer at `:510`, then a score line, a six-row point breakdown and a phase recommendation section, so a caller who wants the level alone reads more than a dozen lines to get it. The two YAML assets that call the script, `speckit-plan.yaml:86` and `speckit-complete.yaml:147`, avoid the text output by passing `--json`, which returns a twenty-field document where one field was wanted.

There is no middle option. A shell caller either filters text with `head`, `grep` or `sed`, which breaks silently when the surrounding format changes, or parses JSON, which brings a parser into a script that needed one string.

### Purpose
One flag, `--quiet`, prints the recommended-level line and nothing else, and every invocation that does not pass it behaves exactly as it does today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--quiet` option that suppresses the score, the breakdown and the phase section, leaving only the recommended-level line on stdout
- A `QUIET` global beside `JSON_OUTPUT`, one case arm in the argument parser, and a third branch in the output dispatch at `:770-774`
- Documentation of the flag in the header OPTIONS comment at `:16-27` and in `show_help()` at `:171-182`
- A refusal, with a non-zero exit, when `--quiet` and `--json` are passed together
- A new test that spawns the script and asserts the exact bytes on stdout, on stderr and the exit code

### Out of Scope
- Any change to scoring. `--quiet` is presentation only, so `calculate_loc_score`, `determine_level` and `determine_phasing` are untouched and the same inputs produce the same level in both modes
- A `-q` short alias. The request names `--quiet` only; a short form is a separate decision with its own collision risk against future flags
- The JSON shape. `--json` keeps its twenty fields and stays the machine-readable path
- The stale trailing comment at `:778-780`, which lists one of the script's four exit-1 causes. It is wrong today and stays out of this change's scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | `QUIET` global, `--quiet` case arm, output-dispatch branch, conflict check, header and help text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts` | Create | Spawns the script and asserts stdout, stderr and exit code for each case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted, and stdout is exactly one line, `Recommended Level: <N> (<Name>)`, followed by a newline, with exit 0 |
| REQ-002 | Without `--quiet`, stdout, stderr and the exit code are byte-identical to the pre-change script for every existing invocation, including text, `--json`, `--no-recommend-phases` and `--help` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `--quiet` with `--json`, in either order, exits 1 with an error on stderr and writes nothing to stdout |
| REQ-004 | `--quiet` never changes the recommended level or the exit code for a given input, and an error path still reports on stderr and exits 1 rather than printing a quiet line |
| REQ-005 | `--quiet` appears in the header OPTIONS comment and in `show_help()` |
| REQ-006 | With `--quiet`, every warning the script writes to stderr is still written to stderr. `--quiet` trims stdout only, and neither the quiet branch nor `output_quiet` suppresses, redirects or merges stderr |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For one input in each level band, `--quiet` prints the same `Recommended Level:` line that the same input prints without it, and prints nothing else
- **SC-002**: A diff of pre-change and post-change stdout over a fixed matrix of existing invocations is empty
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 compatibility, the script's stated floor | A construct outside 3.2 breaks macOS | Use the existing `case` and `[[ ]]` forms already in the file; no arrays or associative maps |
| Risk | A caller already filters stdout and would be unaffected, but a future caller assumes quiet output is a bare integer | Med | Print the existing line verbatim, and name the exact line in the help text |
| Risk | The quiet line drifts from the normal one after a later edit | Med | One output function is shared: `output_quiet` prints the same string as `output_text`, and a test compares both |
| Risk | `--quiet` silently swallows an error path | High | Every error returns before the output dispatch, so quiet cannot reach one; the test covers an invalid input under `--quiet` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time to a run. It prints one line instead of more than a dozen, so it can only be faster than the default

### Security
- **NFR-S01**: The flag reads no file and writes none. It changes what the script prints, not what it can reach

### Reliability
- **NFR-R01**: The `--quiet` and `--json` conflict is detected after argument parsing and before scoring, so a refused run produces no partial output

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` alone still hits the existing "At least --loc or --files must be provided" error at `:738-742`, on stderr, with exit 1
- Maximum length: not applicable. The flag takes no value, and the line's width is bounded by the level name
- Repeated flag: `--quiet --quiet` is accepted and behaves as one, the same way `--auth` repeats today

### Error Scenarios
- Invalid numeric input under `--quiet`: the `:722-735` validation reports on stderr and exits 1 with no stdout, because the output dispatch is never reached
- `--quiet --json` or `--json --quiet`: the same refusal in either order, exit 1, nothing on stdout
- `--quiet --help`: help wins. `show_help()` exits 0 from the parse loop at `:710-712`, before any output function runs, so the request for help is answered in full

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 2 (one script, one test), LOC: ~20, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N, public output surface: Y |
| Research | 3/20 | The script is 780 lines and already read end to end; the caller inventory is two greps |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 0/15 | Dependencies: none outside the file |
| **Total** | **12/100** | **Level 3 as requested when the packet was created; the score alone would recommend Level 0** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The default output changes as a side effect of the new branch | H | L | Byte-compare pre-change and post-change stdout across the existing invocation matrix |
| R-002 | Quiet and JSON are both requested and one silently wins | M | M | Refuse the pair, with a test for each order |
| R-003 | The quiet line diverges from the normal one over time | M | L | Both come from one string, and a test asserts they match |
| R-004 | The new flag is undocumented in `--help` | L | M | REQ-005, checked by a test that greps the help output |

---

## 11. USER STORIES

### US-001: One line for a script (Priority: P0)

**As a** shell script that needs a documentation level, **I want** `recommend-level.sh --quiet` to print only the recommended level, **so that** I can read one line instead of filtering a report or parsing JSON.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: No change for existing callers (Priority: P1)

**As a** maintainer of the two Speckit YAML assets that call this script, **I want** the default and `--json` output to stay byte-identical, **so that** the flag can ship without touching them.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should a later change add `-q` as an alias, or keep the long form alone to leave the short-flag namespace free? This packet keeps it alone and records the reasoning in ADR-002.
- Should the quiet line ever omit the level name and print the integer only? A bare integer is easier to compare and harder to read in a log. This packet keeps the existing line, and ADR-001 records why.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: ADR-001 and ADR-002 in `plan.md`

---

