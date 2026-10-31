---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a full report, so a caller that needs only the level has to grep or awk it out of the output. A --quiet flag that prints just the recommended-level line lets the script compose in shell pipelines, while the default report stays byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level quiet mode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the scoring entry point for documentation level, and every run prints a full report: a leading blank line, the level line, score and confidence, a six-line breakdown, and an optional phase section. A caller that needs only the level — a shell prompt, a CI step, an intake wrapper — has to parse that report. This packet adds a `--quiet` flag that prints the existing `Recommended Level: N (Name)` line and nothing else, leaving the default report byte-identical.

**Key Decisions**: `--quiet` reuses the human-readable level line the script already prints rather than inventing a bare-value format; `--json` keeps precedence when both flags are present.

**Critical Dependencies**: the existing `output_text()` function and argument parser in `recommend-level.sh`, and Bash 3.2 compatibility (the macOS default `/bin/bash`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`recommend-level.sh` has no way to emit a single value. Run with `--loc 50 --files 2` it prints 16 lines, of which exactly one — `Recommended Level: 0 (Quick)` — answers the caller's question. Passing `--quiet` today fails with `ERROR: Unknown option: --quiet` and exit 1, so a caller either parses the report with `grep` or `awk`, or switches to `--json` and parses a document. Both approaches couple the caller to output details the flag should hide.

### Purpose

Let a caller read the recommended level with one line of shell and no parsing, without changing any existing output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `--quiet` in `recommend-level.sh`: the parser branch, a `QUIET_MODE` global, and an early return in `output_text()`.
- The script's own documentation of the flag: the header OPTIONS block and `show_help()`.
- These planning documents.

### Out of Scope

- `-q` short alias — the request names `--quiet` only; sibling scripts use `--quiet|-q`, recorded as open question Q1.
- `SPECKIT_QUIET` environment override — `validate.sh` has one, but `recommend-level.sh` exposes no environment surface at all today.
- JSON shape changes — `--json` output stays byte-identical.
- External reference docs (`feature-catalog/`, `references/`) — they describe the scoring lifecycle rather than a per-flag inventory, and the in-script help is the flag's reference.
- New test files — the behavior is pinned by the command checks in `tasks.md` and by the existing legacy suites that already execute this script.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `--quiet` parsing, a `QUIET_MODE` global, a single-line early return in `output_text()`, and the header/help entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` prints exactly one line, `Recommended Level: <N> (<Name>)`, with no leading or trailing blank line. |
| REQ-002 | Without `--quiet`, stdout is byte-identical to the current output for every existing flag combination. |
| REQ-003 | `--quiet` composes with existing flags in any order, including `--no-recommend-phases`, `--phase-threshold`, and the risk flags. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The flag is listed in the header OPTIONS block and in `show_help()`; `--help` still prints the full help text when `--quiet` is also passed. |
| REQ-005 | `--quiet` suppresses success output only: every existing error still goes to stderr with its current message and exit code 1. |
| REQ-006 | With `--json`, the JSON document is emitted unchanged and `--quiet` has no effect. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 50 --files 2 --quiet` emits one line matching `Recommended Level: 0 (Quick)`; `wc -l` reports 1.
- **SC-002**: `recommend-level.sh --loc 50 --files 2` emits the same 16 lines as the pre-change baseline, with an empty `diff`.
- **SC-003**: `--help` lists `--quiet`, and `--quiet --help` prints the same full help.
- **SC-004**: the existing phase suites still pass: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` and `test-phase-system.js`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `output_text()` (`recommend-level.sh:508-558`) | The guard has no clean insertion point if the function is restructured first | Place the guard as the first statement and keep the function's single-exit shape |
| Dependency | Bash 3.2 | Newer syntax would fail on macOS `/bin/bash` | Use only constructs the file already contains |
| Risk | Quiet output leaks a blank line or the score line | Med | The guard returns before the first `echo ""`; AC-001 asserts one line |
| Risk | Default output drifts while the flag is added | Med | AC-002 and AC-003 diff the captured baseline against post-change output |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: One extra string comparison per run; no measurable change to a script that finishes in well under 100 ms.

### Security

- **NFR-S01**: No new input surface beyond a boolean flag; no secret, credential, or network access is introduced.

### Reliability

- **NFR-R01**: Exit codes unchanged — 0 on success, 1 on usage error.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: `--quiet` with neither `--loc` nor `--files` keeps the existing `At least --loc or --files must be provided` error and exit 1.
- Repeated flag: `--quiet --quiet` is idempotent.

### Error Scenarios

- Invalid numeric input (`--quiet --loc abc`): the existing error goes to stderr with exit 1; quiet does not swallow it.
- Unknown option alongside `--quiet`: the existing `ERROR: Unknown option` message, exit 1.
- Flag ordering: `--quiet` before, between, or after other flags produces the same single line.
- JSON combination: `--json --quiet` emits the unchanged JSON document.
- Help combination: `--help --quiet` prints the full help and exits 0.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: ~12, Systems: 1 |
| Risk | 2/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | Read one script; no external investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **10/100** | **Level 3** |

The scoring model puts this change at Level 0: `--loc 10 --files 1` scores 2/100, because one shell file with no risk flags is the cheapest shape the model knows. The packet is filed at Level 3 because the packet author chose that depth for authoring-benchmark coverage, not because the change is complex. The documents stay short where the work is small.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The guard is placed after the leading blank line, so quiet output starts with a newline | M | M | Guard is the first statement in `output_text()`; AC-001 asserts one line |
| R-002 | A later refactor of `output_text()` drops the guard silently | M | L | AC-010 runs the suites; the flag is documented in help |
| R-003 | `--json --quiet` surprises a caller expecting the bare line | L | M | Help states the JSON precedence; ADR-001 records it |

---

## 11. USER STORIES

### US-001: Read the level in a pipeline (Priority: P0)

**As a** shell user composing a spec workflow, **I want** `--quiet` to print only the level line, **so that** I can capture it with `$(...)` without `grep` or `awk`.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001 through AC-005).

---

### US-002: Discover the flag from help (Priority: P1)

**As a** maintainer reading `--help`, **I want** the flag listed with the others, **so that** I do not have to read the script to learn it exists.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-006).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Q1: Should `--quiet` also accept `-q`, matching `validate.sh`, `check-completion.sh` and `progressive-validate.sh`? Deferred: the request names `--quiet` only, and an alias is a separate behavior change.
- Q2: Should `recommend-level.sh` gain a `SPECKIT_QUIET` environment override like `validate.sh`? Deferred: the script has no environment surface today.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section of `plan.md` (this packet keeps decisions inline; the Level 3 file contract does not require `decision-record.md`)

---
