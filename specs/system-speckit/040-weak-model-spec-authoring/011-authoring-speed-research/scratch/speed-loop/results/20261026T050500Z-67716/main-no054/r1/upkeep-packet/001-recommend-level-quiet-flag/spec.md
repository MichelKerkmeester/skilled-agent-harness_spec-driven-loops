---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a banner, a score breakdown, and a phase block, so a caller that needs only the recommended level has to parse prose or accept a full JSON document. Add an opt-in --quiet flag that prints the single recommended-level line and leaves default output unchanged."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level.sh quiet"
  - "single line level recommendation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the deterministic level scorer for this repository. Its human-readable output is a presentation block: a leading blank line, the recommended level, score and confidence, a five-row point breakdown, and a phase-recommendation section. A caller that only wants the level cannot ask for it. It either greps the block or switches to `--json`, which is the right tool for a machine but still a multi-line document that a shell script must pipe through a parser.

This packet adds one opt-in flag, `--quiet`, that prints only the final recommended-level line. The default output path stays byte-identical, `--json` stays byte-identical, and no scoring, threshold, or phase logic moves. The change is confined to one shell script: one global, one argument-parser case, one branch in the text renderer, and the two places that document the script's own options.

**Key Decisions**: `--quiet` modifies only the text renderer; `--json` keeps precedence when both flags are passed; the quiet line is the existing recommended-level line reused verbatim rather than a new format.

**Critical Dependencies**: none outside the script. The only external consumer of the script is the node test harness, which reads `--json`, so the JSON path must remain untouched for those tests to stay green.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | Not created (`--skip-branch`) |
| **Packet shape** | Planning-only packet: spec, plan, tasks and acceptance criteria; no implementation in this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The text renderer in `output_text()` writes a fixed presentation block. The recommended level is line 2 of that block, behind a blank line and above four more sections. Any caller that needs the level alone must either `grep` for `Recommended Level:` or take `--json` and parse it. Neither is a good fit for a shell caller that just wants one token to branch on.

There is no middle mode. The script offers the full human report or the full machine document, and nothing that answers "which level did you pick?" in one line.

### Purpose

Give the script an opt-in, single-line output mode that answers exactly that question while leaving every existing caller's output unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a `--quiet` long flag to the argument parser in `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.
- Add a `QUIET_MODE` global that defaults to `false`, so an invocation without the flag behaves exactly as it does today.
- In the text renderer, emit only `Recommended Level: <N> (<Name>)` and a trailing newline when quiet mode is active.
- Keep `--json` authoritative when `--quiet` and `--json` are both passed; quiet mode never changes the JSON document.
- Document the flag in the script header's `USAGE`/`OPTIONS` block and in `show_help()`.

### Out of Scope

- A `-q` short alias - the request names `--quiet` only, and adding an alias invents interface surface nobody asked for.
- Any change to scoring weights, LOC/file thresholds, risk points, level boundaries, confidence, or phase scoring.
- Any change to the `--json` schema, field names, or conditional phase fields.
- Any change to exit codes or to the `ERROR:` lines written to stderr.
- Quiet behavior for sibling scripts (`validate.sh`, `progressive-validate.sh`, `check-completion.sh` already own theirs).
- A quiet mode that suppresses errors - errors are diagnostics, not output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `--quiet`, a `QUIET_MODE` global, the text-renderer branch, and the option documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted by the argument parser, sets quiet mode, and exits `0` for otherwise valid input. |
| REQ-002 | In quiet mode the text renderer writes exactly one stdout line, `Recommended Level: <N> (<Name>)`, with a trailing newline and no leading blank line. |
| REQ-003 | Without `--quiet`, the text output is byte-identical to the current script's output for the same arguments. |
| REQ-004 | `--json` output is byte-identical with and without `--quiet`; when both flags are passed, JSON output wins. |
| REQ-005 | Quiet mode suppresses the score/confidence line, the point breakdown, and the phase-recommendation block. |
| REQ-006 | `show_help()` lists `--quiet`, and `--quiet --help` still prints the full help text and exits `0`. |
| REQ-007 | Quiet mode does not suppress diagnostics: the existing `ERROR:` lines still go to stderr and the existing exit codes still apply. |
| REQ-008 | An unknown option still fails with exit `1` and the existing message, regardless of whether `--quiet` appeared earlier. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `--quiet` is position-independent and idempotent: before or after other options, and repeated, it produces the same one-line output. |
| REQ-010 | Quiet mode does not change any computed value: level, name, score, confidence, phase score, phase recommendation, and suggested phase count match the default run for the same inputs. |
| REQ-011 | The script header's `USAGE`/`OPTIONS` block documents `--quiet` so the file's own contract matches its behavior. |
| REQ-012 | With `--quiet`, any warning the script writes to stderr is still written to stderr: quiet mode trims stdout only and never suppresses, redirects, or buffers a stderr warning. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A quiet invocation emits exactly one line on stdout and nothing else.
- **SC-002**: The quiet line equals the default run's recommended-level line, character for character.
- **SC-003**: A byte comparison against a captured baseline shows zero diff for the default text path and the `--json` path.
- **SC-004**: The existing phase-system test harness passes unchanged, proving the JSON contract did not move.
- **SC-005**: `--help` documents the flag and `bash -n` accepts the edited script.

### Acceptance Scenarios

- **Given** a valid invocation such as `--loc 50 --files 2`, **When** `--quiet` is added, **Then** stdout is exactly `Recommended Level: 0 (Quick)` plus a newline.
- **Given** the same invocation without `--quiet`, **When** the script runs, **Then** stdout matches the pre-change baseline byte for byte.
- **Given** `--loc 700 --files 16 --architectural --api --db --quiet`, **When** the script runs, **Then** the phase-recommendation block is absent even though the default run recommends phases.
- **Given** `--loc 700 --files 16 --architectural --api --db --json --quiet`, **When** the script runs, **Then** the output is the unchanged JSON document and no plain-text level line is appended.
- **Given** `--quiet` with no `--loc` and no `--files`, **When** the script runs, **Then** stderr carries the existing `ERROR:` lines, stdout stays empty, and the exit code is `1`.
- **Given** `--quiet --unknown-flag`, **When** the script runs, **Then** the unknown-option error still exits `1`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash argument-parser loop | A mis-ordered `case` arm can swallow a following option. | Add `--quiet` as a value-less arm that only shifts one argument; verify adjacent options still parse. |
| Dependency | Node test harness `runtime/cli/tests/test-phase-system.js` | It parses `--json` output; an accidental JSON change breaks it. | Treat the JSON renderer as untouchable and run the harness as a verification task. |
| Risk | Quiet line drifts from the default line | Two formats for one fact invite divergence. | Build the quiet line from the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` values, and compare both outputs in verification. |
| Risk | Flag accidentally affects default output | Silent breakage for every existing caller. | Keep `QUIET_MODE=false` by default and diff the default path against a captured baseline. |
| Risk | `--quiet` treated as an option that takes a value | `--quiet 2` would consume the next token and change parsing. | Parse it as a bare flag and add a regression case with a trailing numeric argument. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Quiet mode adds no measurable work: it skips the breakdown and phase echoes, so it can only be faster than the default path on the same inputs.

### Security

- **NFR-S01**: `--quiet` takes no argument and introduces no new input surface; all existing numeric validation still runs before any output.

### Reliability

- **NFR-R01**: The default text path and the JSON path keep their current behavior, so no caller needs to change.
- **NFR-R02**: Quiet mode is a pure renderer choice made after scoring completes; it cannot alter a computed level.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: `--quiet` with neither `--loc` nor `--files` keeps the existing `At least --loc or --files must be provided` error and exits `1`.
- Zero values: `--loc 0 --files 1 --quiet` scores normally and prints one line; quiet does not special-case zero.
- Very large input: `--loc 5000 --files 100 --quiet` still prints one line and does not print the phase block.

### Error Scenarios

- External service failure: not applicable - the script reads no network or external state.
- Invalid numeric input: `--loc abc --quiet` writes the existing `--loc must be a positive integer` error to stderr and exits `1`, with nothing on stdout.
- Unknown option: `--quiet --bogus` exits `1` with the existing unknown-option message.
- Flag combinations: `--quiet --json` yields JSON only; `--quiet --no-recommend-phases` yields the same single line as `--quiet` alone.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | One file, roughly 10-20 changed lines, one script in one skill. |
| Risk | 3/25 | Opt-in flag; no auth, API, database, or breaking default change. |
| Research | 3/20 | Read one script and its two test consumers; no unknowns. |
| Multi-Agent | 0/15 | One workstream. |
| Coordination | 2/15 | One file plus a regression run of an existing harness. |
| **Total** | **12/100** | **Level 3 by packet policy, not by complexity score: the authoring task requires the full Level 3 contract for this packet even though the change itself scores as a trivial task.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default text output changes by accident | High | Low | Capture a baseline before editing and diff it after. |
| R-002 | JSON contract drifts | High | Low | Do not touch `output_json`; run the phase-system harness. |
| R-003 | Quiet line and default line diverge over time | Medium | Medium | Reuse the same variables and compare the two outputs in one verification step. |
| R-004 | Parser treats the flag as value-taking | Medium | Low | Value-less `case` arm plus a regression case with a trailing token. |

---

## 11. USER STORIES

### US-001: One-line level for a caller (Priority: P0)

**As a** shell caller that needs the level to branch on, **I want** `--quiet` to print only the recommended-level line, **so that** I can capture one line without parsing a report or a JSON document.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged output for existing callers (Priority: P1)

**As a** maintainer of the scripts and tests that already run `recommend-level.sh`, **I want** the default and JSON outputs to stay byte-identical, **so that** the new flag costs me no migration work.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Self-describing script (Priority: P1)

**As a** reader of the script, **I want** the header and `--help` to list `--quiet`, **so that** the documented contract matches the behavior.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None open. Three were resolved during authoring:

- `--quiet` combined with `--json`: JSON keeps precedence, because `--json` already means "machine document" and two competing machine formats would be worse than one. Recorded as ADR-001 in `plan.md`.
- Short alias `-q`: not added, because the request names `--quiet` only and sibling scripts' aliases are not a mandate here.
- Errors under `--quiet`: not suppressed, because they are diagnostics on stderr and suppressing them would hide failures without the caller asking.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Architecture Decisions**: See ADR-001 and ADR-002 in `plan.md`

---
