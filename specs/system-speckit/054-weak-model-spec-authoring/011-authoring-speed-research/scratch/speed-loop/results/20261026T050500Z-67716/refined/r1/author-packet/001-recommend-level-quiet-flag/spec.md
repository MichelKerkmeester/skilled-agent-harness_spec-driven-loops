---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "The level helper prints a sixteen-line report, so a caller that needs only the recommended level has to grep for it. A --quiet flag prints that one line, and every invocation without the flag keeps its current output and exit code."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level --quiet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the SpecKit level helper. A successful run prints a sixteen-line report: a leading blank line, the level line, the score line, a six-row breakdown, and a phase recommendation. A caller that needs only the level — a `case` statement, a prompt builder, a human skimming — has to grep for the line or index into the report, and an index moves whenever a section is added.

This packet adds a `--quiet` flag that prints exactly one line, `Recommended Level: <N> (<Name>)`, and nothing else on stdout. Every invocation that does not pass the flag keeps its current output and exit code, so no existing caller changes behaviour.

The proof is a line count. `--quiet` prints one line, the default form prints sixteen, and `--quiet --json` exits 1 with an empty stdout.

**Key Decisions**: `--quiet` and `--json` are mutually exclusive and the pair exits 1 (ADR-001 in `plan.md`); one helper prints the level line for both output paths so the label cannot drift (ADR-002 in `plan.md`).

**Critical Dependencies**: None. The change uses the bash the script already requires.

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
| **Estimated LOC** | ~40 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The level helper has one text output and it is a report, not an answer. `output_text()` at line 508 prints a leading blank line, the level line, the score line, a six-row breakdown and a phase section, which is sixteen lines for `--loc 500 --files 15`. A caller that wants only the recommendation must grep for `^Recommended Level:` or index line 2, and either approach breaks when a section is added above it.

There is no machine-readable alternative for a text-mode caller: `--json` emits a 36-line document that needs a JSON parser, which is more machinery than a shell caller wants for one integer.

### Purpose

Give the script a `--quiet` flag that prints the level line and nothing else, so a caller reads one line instead of parsing a report, while leaving the existing report byte-identical for every caller that does not opt in.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `--quiet` to the argument parser and a `QUIET` global to the script's state block.
- Print exactly `Recommended Level: <N> (<Name>)` on stdout under `--quiet`, with exit 0, and no leading or trailing blank line.
- Reject `--quiet` combined with `--json` at exit 1 with an error on stderr and an empty stdout.
- Extract one helper that prints the level line, and call it from both `output_text()` and the quiet path.
- Document the flag in the file header OPTIONS block and in `show_help()`.

### Out of Scope

- A `-q` short alias — the brief names the long flag, and a short alias can be added later without breaking it.
- Any change to the default report — byte-identical output is the compatibility promise this packet is judged on.
- `check-completion.sh` and its own `--quiet` — that script means exit-code-only and this packet does not touch it.
- A one-line JSON mode — `--json` already carries the value for callers that want `jq -r .recommended_level`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Parse `--quiet`, add `QUIET`, guard the `--json` pair, print one line, update the two help surfaces |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/spec.md` | Create | This specification |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/plan.md` | Create | Approach, ADRs and test plan |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/tasks.md` | Create | Ordered tasks and verification checklist |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/acceptance-criteria.md` | Create | Closure criteria for the packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted by the parser and prints exactly one line on stdout, matching `^Recommended Level: [0-3] \(.+\)$`, then exits 0. |
| REQ-002 | Without `--quiet`, stdout for a given input is byte-identical to the pre-change script, and the exit code is unchanged. |
| REQ-003 | `--quiet --json` exits 1, writes an error to stderr, and writes nothing to stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The file header OPTIONS block and `show_help()` both list `--quiet` and state that it prints only the level line. |
| REQ-005 | `--quiet` leaves the error paths alone: invalid input still exits 1 with the same stderr message and an empty stdout. |
| REQ-006 | The level line has one format string. `output_text()` and the quiet path call the same helper, so the two cannot disagree. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0.
- **SC-002**: `bash recommend-level.sh --loc 500 --files 15` still prints sixteen lines with the same text as the captured baseline.
- **SC-003**: `bash recommend-level.sh --quiet --json --loc 500 --files 15` exits 1 with an empty stdout.
- **SC-004**: `bash -n recommend-level.sh` exits 0, and the help text names `--quiet` in both surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2, the macOS system shell | A bash-4 feature would fail on a stock Mac | Use only `[[ ]]`, `case` and parameter expansion the script already uses |
| Dependency | The existing `set -euo pipefail` | An unset `QUIET` aborts the run | Initialise `QUIET=false` in the globals block before the parser reads it |
| Risk | The level label drifts between the two paths | A caller's regex stops matching | REQ-006 keeps one helper; the quiet check pins the exact string |
| Risk | A caller reads `--quiet` as exit-code-only, like `check-completion.sh` | Silent surprise on a false assumption | The help text states "prints only the level line", and ADR-001 records the divergence |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time: one function call replaces a report that already computes the same values, and both forms finish under 100 ms.

### Security
- **NFR-S01**: The flag parses no new input beyond a boolean switch, reads no credential and writes no file.

### Reliability
- **NFR-R01**: Exit codes are unchanged for every existing invocation: 0 on success, 1 on a user error, and `--quiet` introduces one new exit-1 case that cannot occur without the flag.

---

## 8. EDGE CASES

### Data Boundaries
- **Empty input**: `--loc 0 --files 0` still exits 1 with `ERROR: At least --loc or --files must be provided`; `--quiet` does not suppress it and stdout stays empty.
- **Maximum input**: `--loc 100000 --files 100000` clamps to the existing maxima and quiet prints the same single line as any other successful run.
- **Repeated flag**: `--quiet --quiet` is idempotent and prints one line, because the parser sets a boolean.
- **Flag position**: `--quiet` before or after `--loc`/`--files` gives the same result; the parser is order-independent.

### Error Scenarios
- **`--quiet --json`**: exit 1, stderr `ERROR: --quiet and --json cannot be combined`, stdout empty.
- **Unknown `-q`**: exit 1 with the existing `ERROR: Unknown option: -q`; `-q` is out of scope.
- **`--quiet --help`**: `--help` exits inside the parser and prints the full help text, so help wins over quiet.
- **`--quiet --loc abc`**: exit 1 with `ERROR: --loc must be a positive integer` on stderr, stdout empty.

### State Transitions
- **N/A**: the script is a single invocation with no state that outlives it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~40, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N (default output pinned) |
| Research | 0/20 | One script read end to end; no investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 0/15 | Dependencies: 0 |
| **Total** | **7/100** | **Level 3 (fixed by the authoring brief)** |

`recommend-level.sh --loc 40 --files 1` prints `Recommended Level: 0 (Quick)` at `Score: 7/100`, and the table agrees with it. The packet is filed at Level 3 because the brief that commissioned it fixes `--level 3`; the declared level governs which documents the packet must carry, not how large the change is.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller greps `Recommended Level:` and the quiet path prints a different label | M | L | One helper (REQ-006) and an exact-string check in T010 |
| R-002 | A future edit reorders the parser and `--quiet` swallows the next argument | M | L | The flag takes no value and the parser case calls `shift` once |
| R-003 | A caller depended on the leading blank line and now loses it | L | L | That caller is opting in; the default path keeps the blank line |
| R-004 | The `--json` guard is added after the dispatch and never runs | L | L | T006 tests the pair directly and asserts exit 1 |

---

## 11. USER STORIES

### US-001: Read the level without parsing a report (Priority: P0)

**As a** shell caller that needs the recommended level, **I want** one line of stdout, **so that** I can assign it to a variable without grep or `sed`.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001 and AC-002).

---

### US-002: Keep the existing report unchanged (Priority: P1)

**As a** maintainer of the create-script path, **I want** the default output to stay byte-identical, **so that** no existing reader breaks when I adopt nothing new.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-003).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does `--quiet` also suppress warnings on stderr? **RESOLVED: no. The flag governs the success-path report only, so an input error still reaches the caller.**
- Should `--quiet` accept a `-q` alias? **RESOLVED: no. The brief names the long flag, and `-q` can be added later without breaking it.**
- Should `--quiet` win when combined with `--json`? **RESOLVED: no. The pair exits 1 instead of silently dropping one request; see ADR-001 in `plan.md`.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the architecture decision record section in `plan.md`
