---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh only prints a multi-line human report or a JSON document, so a caller that needs just the level verdict has to parse the report. This packet adds a --quiet mode that prints the single recommendation line and leaves every existing output path untouched."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the deterministic level scorer every SpecKit planning command calls. Today it answers in one of two shapes: a twenty-line human report or a full JSON document. A caller that wants only the verdict has to pull it out of that report, which couples the caller to every breakdown line the report may gain. This change adds a `--quiet` mode that prints exactly the recommendation line and nothing else, while the default report stays byte-for-byte identical.

**Key Decisions**: The quiet line reuses the text report's existing wording rather than inventing a new format; `--quiet` and `--json` are mutually exclusive so there is one machine shape per invocation.

**Critical Dependencies**: None beyond bash 3.2+, which the script already requires.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` has no output shape that carries only its verdict. The text report interleaves the recommendation with a score line, a confidence percentage and an eight-line breakdown, and the JSON document carries the whole input echo and threshold block. A shell caller that needs the level therefore greps or slices the report, and any future breakdown line silently changes what that caller matches.

### Purpose
Give callers a one-line, stable verdict on stdout that costs the script one extra output branch and changes nothing for anyone who does not pass the flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--quiet` option in the `recommend-level.sh` argument parser
- A quiet output branch that prints only the recommendation line
- A rejection path for `--quiet` combined with `--json`
- Help text covering the new option and one usage example
- Verification that default-mode output is unchanged

### Out of Scope
- Changes to scoring, thresholds, confidence or phase recommendation - the flag only changes how the result is printed
- Changes to the `--json` schema - it is already the machine-readable path, and extending it is a separate decision
- A `-q` short alias - the request names `--quiet` only, and an unused alias adds parser surface for no caller
- Changes to `speckit-plan.yaml`, `speckit-complete.yaml` or any other caller - they pass `--json` and are unaffected

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `--quiet` parser arm, a `QUIET_OUTPUT` global, the mutual-exclusion check, an `output_quiet()` function, the dispatch branch and the help entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `recommend-level.sh --loc <N> --files <M> --quiet` prints exactly one line on stdout, `Recommended Level: <level> (<name>)`, followed by a single newline, and exits 0 |
| REQ-002 | Without `--quiet`, stdout, stderr and exit codes are unchanged for text mode, `--json`, `--no-recommend-phases`, `--help`, and every existing error path |
| REQ-003 | `--quiet` combined with `--json` exits 1 with a diagnostic on stderr and writes nothing to stdout |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` in its OPTIONS block and shows one example that uses it |
| REQ-005 | For identical inputs, the level number and level name on the quiet line match the recommendation line of the text report |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--quiet` output for a fixed input set is exactly one line, and that line is identical to the recommendation line of the text report for the same input.
- **SC-002**: A before/after comparison of default-mode stdout, stderr and exit codes is empty across the representative input matrix.
- **SC-003**: `--quiet --json` exits 1 with an empty stdout, so a caller can never receive two machine shapes at once.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2+ (macOS system bash) | The script already targets this; a construct outside it would break every caller | Use only `case`, `printf` and `[[ ]]` forms already present in the file |
| Risk | Default-mode output drifts while adding the branch | High - silently breaks every existing consumer and the manual-testing playbook's captured transcripts | Capture the pre-change matrix first and diff it after the change |
| Risk | A caller passes both machine flags and gets an unexpected exit code | Medium - a pipeline stops with a diagnostic instead of a level | REQ-003 makes the rejection explicit and tested, rather than letting one flag silently win |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds one boolean assignment and one string comparison per invocation; no measurable change against the script's existing arithmetic and `cat` output cost.

### Security
- **NFR-S01**: `--quiet` takes no value, so it introduces no new parsing of caller-supplied data and no new path, quote or injection surface.

### Reliability
- **NFR-R01**: Quiet mode cannot fail independently of text mode - both read the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` values produced by `determine_level`, and both exit 0 on a valid input set.

---

## 8. EDGE CASES

### Data Boundaries
- Zero LOC with a non-zero file count: input validation is unchanged, and quiet mode prints the same recommendation text mode would.
- Very large LOC or file count (for example 5000 LOC and 60 files): scoring saturates at its existing caps, and quiet mode still prints one line.
- Both `--loc` and `--files` at zero: the existing "At least --loc or --files must be provided" error fires before any output branch runs, in both modes.

### Error Scenarios
- `--quiet --json` in either order: exit 1, one diagnostic line on stderr, empty stdout.
- `--quiet` with no numeric input: the existing exit-1 validation error is preserved unchanged.
- `--help` anywhere on the command line, with or without `--quiet`: full help is printed and the script exits 0, because `show_help` short-circuits during parsing.
- `--quiet` repeated: the assignment is idempotent and the output is still exactly one line.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 1, LOC: about 15, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 3/20 | Read one script end to end; no external investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **15/100** | **Level 3** |

The scoring heuristic puts this change at Level 0 on size alone. The packet is authored at Level 3 because the benchmark track contract fixes that level for authoring fixtures, not because the change carries Level 3 risk; the scores above record the real size so a later reader is not misled by the declared level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default-mode output changes as a side effect of adding the branch | H | L | T002 captures the baseline; T009 diffs against it |
| R-002 | `--quiet` and `--json` both accepted, producing two machine shapes | M | M | REQ-003 plus the T011 rejection check |
| R-003 | Help text documents the flag inaccurately | L | L | REQ-004 checked against the actual `--help` output |
| R-004 | A caller depends on the blank leading line that `output_text` prints, and quiet mode inherits it | M | L | `output_quiet` prints no leading blank line; SC-001 asserts one line total |

---

## 11. USER STORIES

### US-001: One-line verdict for scripted callers (Priority: P0)

**As a** shell script or CI step that needs the recommended level, **I want** the verdict alone on stdout, **so that** I can read it with `read` or `cut` instead of matching report text that may change.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged report for interactive use (Priority: P1)

**As a** developer running the scorer by hand, **I want** today's report to stay exactly as it is, **so that** existing habits, docs and captured transcripts remain valid.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should quiet mode also suppress stderr diagnostics, making it fully silent on failure? Resolved as no: a rejection or validation error must still say why it failed, so only stdout is narrowed.
- Should `--quiet` gain a `-q` alias? Resolved as no for this packet: no caller asks for one, and adding it later is backward compatible.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001)


