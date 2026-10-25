---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a 16-line human report, so a caller that needs only the recommended level must parse prose. This packet adds a --quiet flag that prints just the recommended-level line."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "quiet single-line level output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` always prints a 16-line human report, so a caller that needs only the recommended level has to grep through prose. The change adds a `--quiet` flag that prints exactly the recommended-level line and nothing else. A `wc -l` count of `1` on quiet stdout, plus a byte-identical default run, proves the contract.

**Key Decisions**: `--quiet` is an output-mode selector like `--json`, and the two are mutually exclusive (passing both is a usage error, exit 1) | the quiet line reuses the exact `Recommended Level: N (Name)` string the text report already prints

**Critical Dependencies**: Only `bash` and the script's existing `determine_level` / `output_text` functions; no new external dependency

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` always prints a multi-line report: a blank line, the recommended-level line, a score line, a breakdown block and a phase block (16 lines for a typical run). An orchestrator or pipeline step that only needs the level must extract it from prose with `grep`/`sed`, which couples the caller to the report's layout.

### Purpose
With `--quiet`, stdout carries exactly one line — `Recommended Level: N (Name)` — so a caller can capture the answer directly as `$(recommend-level.sh ... --quiet)` without parsing the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `QUIET` global and a `--quiet` case arm to the option parser in `recommend-level.sh`
- Reject the `--quiet` + `--json` combination during input validation with a stderr message and exit 1
- Add a quiet output branch that prints only the `Recommended Level: N (Name)` line
- Document `--quiet` in `show_help` and in the header USAGE comment

### Out of Scope
- A `-q` short alias — the request names `--quiet` only; no short form is added
- Any change to the default text report, the JSON shape, scoring or exit codes — unchanged by definition
- Editing any file other than `recommend-level.sh`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `--quiet` flag, its validation conflict check, the quiet output branch and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The option parser accepts `--quiet` in any argv position and sets a `QUIET` flag |
| REQ-002 | With `--quiet`, stdout contains exactly one line: `Recommended Level: <N> (<Name>)` — the same text `output_text` prints |
| REQ-003 | Without `--quiet`, stdout is byte-identical to current behavior for every existing flag combination |
| REQ-004 | Passing `--quiet` together with `--json` (in either order) exits 1 with a stderr message naming the conflict and no stdout output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--help` documents `--quiet` and its `--json` conflict |
| REQ-006 | Existing error paths (missing `--loc`/`--files`, non-numeric values) behave identically under `--quiet`: stderr message, exit 1, empty stdout |
| REQ-007 | `--quiet` composes with the scoring and phase flags (`--auth --api --db --architectural --no-recommend-phases --phase-threshold`); the quiet line reflects the same computed level |
| REQ-008 | `bash -n` syntax check passes and the script keeps `set -euo pipefail`, its shebang and its exit-code contract |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15 --api --quiet` prints exactly `Recommended Level: 2 (Verification)`, `wc -l` on stdout is `1`, exit code `0`
- **SC-002**: The same invocation without `--quiet` produces output byte-identical to a baseline captured before the change (`diff` prints nothing)
- **SC-003**: `recommend-level.sh --quiet --json --loc 100 --files 3` exits `1`, prints nothing to stdout, and stderr names the flag conflict
- **SC-004**: `recommend-level.sh --help` prints a `--quiet` line in its OPTIONS list
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` (already required by the script) | None — no new dependency | N/A |
| Risk | A caller could already parse the report text; a quiet-mode edit might drift the shared level line | Low | REQ-002 pins the quiet line to the same `Recommended Level: N (Name)` string `output_text` prints; AC-002 diffs the default output against a captured baseline |
| Risk | `--quiet --json` has an ambiguous winner | Med | REQ-004 makes the combination an explicit usage error rather than silent precedence; recorded in plan.md ADR-001 |
| Dependency | `.skilled/commands/speckit/assets/speckit-plan.yaml` invokes the script with `--json` | Quiet must not alter JSON output | The JSON branch is untouched; the conflict error keeps the two output modes disjoint |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode adds one flag comparison and one `echo`; runtime is identical to the text path within noise (single-digit ms, same process)

### Security
- **NFR-S01**: No new input source, file read, credential or network access is introduced; `--quiet` is a boolean flag with no value

### Reliability
- **NFR-R01**: Exit-code contract is unchanged: `0` on success, `1` on usage error; errors still go to stderr only

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` still hits the existing "At least --loc or --files must be provided" error — stderr, exit 1, empty stdout
- Maximum input: `--loc`/`--files` accept any non-negative integer; quiet output length is constant regardless of score magnitude

### Error Scenarios
- Conflicting modes: `--quiet --json` or `--json --quiet` exits 1 with `ERROR: --quiet cannot be combined with --json` on stderr
- Unknown flag: `--quiet --bogus` still hits the existing `ERROR: Unknown option` path, exit 1

### State Transitions
- Partial completion: N/A — the script is stateless; a failed validation exits before any output
- Session expiry: N/A — no session state exists

### Acceptance Scenarios
- **Given** the script is invoked, **When** `--quiet --help` are combined, **Then** the help text prints and the script exits 0 (the existing `--help` arm wins)
- **Given** `--quiet` is passed twice (`--quiet --quiet`), **When** the script runs, **Then** stdout still holds exactly one line (the flag is idempotent)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 3/25 | Files: 1, LOC: ~15, Systems: 1 |
| Risk | 0/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | Reading one script's parser and output functions |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 1 (the script itself) |
| **Total** | **6/100** | **Level 3** |

The feature's intrinsic score sits in Level 0-1 territory (the script's own recommender prints Level 0 for `--loc 15 --files 1`). This packet runs the Level 3 document contract because the dispatch instruction fixed `--level 3`; the score is reported honestly rather than inflated to match the level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default report output drifts while adding the flag | M | L | AC-002 diffs a full-flag-combination run against a captured baseline; nothing outside the new branch may change |
| R-002 | `--quiet --json` ambiguity resolved inconsistently by argument order | M | L | REQ-004 rejects the combination at parse time; order-independent; ADR-001 records the decision |
| R-003 | A caller depends on the quiet line's exact text | L | M | The line reuses `output_text`'s string verbatim; AC-003 pins the anchored `Recommended Level: N (Name)` format |

---

## 11. USER STORIES

### US-001: Pipeline caller reads the level (Priority: P0)

**As a** pipeline step that gates on the recommended level, **I want** a one-line output mode, **so that** I can capture the level without parsing the prose report.

**Given** a caller runs `recommend-level.sh --loc 500 --files 15 --api --quiet`, **When** the script exits 0, **Then** stdout holds exactly `Recommended Level: 2 (Verification)`.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: CI step asserts on a single line (Priority: P0)

**As a** CI check, **I want** `--quiet` to guarantee one line of stdout, **so that** `wc -l` and a regex are a complete contract test.

**Given** any valid scoring input, **When** `--quiet` is passed, **Then** `wc -l` on stdout prints `1` and the line matches the pinned format.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Existing report reader sees no change (Priority: P0)

**As a** user of the existing report, **I want** unchanged output when I omit the flag, **so that** my current parsing keeps working.

**Given** a run with no `--quiet`, **When** output is compared to the pre-change baseline, **Then** `diff` prints nothing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-004: Operator gets a clear mode conflict error (Priority: P1)

**As an** operator who passed both output-mode flags, **I want** an explicit error, **so that** I am not silently given the wrong format.

**Given** `--quiet --json` on the command line, **When** validation runs, **Then** the script exits 1 and stderr names the conflict.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should a `-q` short alias exist alongside `--quiet` (the script already pairs `--json|-j`)? Deferred — out of scope unless requested; adding it later is a one-line parser change.
- Does any in-repo caller parse the default text report? `rg -n 'recommend-level.sh'` finds one programmatic caller (`speckit-plan.yaml`, which uses `--json`) and documentation references only; no text parser depends on the layout.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section `L3: ARCHITECTURE DECISION RECORD` (ADR-001)

---

