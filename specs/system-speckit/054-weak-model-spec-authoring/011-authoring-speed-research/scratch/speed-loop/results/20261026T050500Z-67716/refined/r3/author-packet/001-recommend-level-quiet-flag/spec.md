---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a multi-line report whose first line carries the recommended level, so a caller that needs only that value must filter the report or parse JSON. This packet specifies a --quiet flag that prints the level line alone and leaves every existing invocation unchanged."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level one line output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` answers one question, the recommended SpecKit level, but it prints a multi-line report to do it: a score and confidence line, a five-row breakdown and a phase-recommendation block. A caller that wants only the answer either filters that report or runs `--json` and parses a document, and the filter route makes the label and line order an undocumented contract that each caller re-implements. This packet adds a `--quiet` flag that prints the single `Recommended Level: <N> (<Name>)` line, with the default text output and the `--json` document left byte-identical.

**Key Decisions**: A boolean `--quiet` flag selects the one-line text output (ADR-001); `--json` keeps precedence when both flags are passed.

**Critical Dependencies**: bash 3.2+ and coreutils, both already required by the script. No new package.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` prints a multi-line report when a caller needs only the recommended level. That caller pipes the report through `grep` or `head`, or runs `--json` and parses a document; the `grep` route repeats the label in every caller and turns line order into a contract nobody wrote down.

### Purpose
A caller can read the recommended level as one line with no parsing, while every existing invocation keeps exactly the output it prints today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` flag that prints only `Recommended Level: <N> (<Name>)` and exits 0.
- Keep the default text output and the `--json` document byte-identical.
- Document the flag in `--help` and in the script header's OPTIONS block.
- Define and test the precedence when `--quiet` and `--json` are both passed.
- Record the pre-change output as a baseline so the default path can be diffed.

### Out of Scope
- Scoring, thresholds, phase logic and confidence math - the flag changes output selection only.
- A `-q` short form, an environment variable or a config file - one caller needs the long form today, and each extra switch is another permanent branch.
- Migrating `speckit-plan.yaml` or `speckit-complete.yaml` to `--quiet` - both callers want the JSON document.
- A new automated test harness for the script - the repository has none for this file, and shell assertions prove the contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, one output function, one dispatch branch and the help text |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/*.md` | Modify | This specification, the plan, the tasks and the acceptance criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted on any valid invocation and stdout is exactly one line, `Recommended Level: <N> (<Name>)`, with exit status 0. |
| REQ-002 | Without `--quiet`, stdout and stderr are byte-identical to the pre-change script for the same arguments, including the `--json` and `--no-recommend-phases` paths. |
| REQ-003 | `--quiet` changes no error path: invalid input still writes its existing message to stderr and exits 1, and a successful quiet run writes nothing to stderr. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` in its OPTIONS block and the script header documents it beside the other flags. |
| REQ-005 | When `--quiet` and `--json` are both passed, the JSON document is printed unchanged and no text line is added. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet | wc -l` prints `1`.
- **SC-002**: The quiet line equals the `Recommended Level:` line of the default report for the same arguments; `diff` prints nothing.
- **SC-003**: The default output for three representative invocations diffs clean against the baseline captured before the edit.
- **SC-004**: `bash -n` and `shellcheck` exit 0, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2+ and coreutils (`wc`, `diff`) | The script cannot run | Already required today; the change adds no dependency |
| Dependency | `shellcheck` for the lint gate | The lint check is skipped | `bash -n` still gates syntax; record the skip if `shellcheck` is absent |
| Risk | A caller parses the quiet line and a later label change breaks it | Med | SC-002 pins the line to the label the default report already prints; the label is not new |
| Risk | Adding a branch drifts the default output | High | Capture the baseline before the edit (T001) and diff after (T011) |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The change adds one branch and one line of output; it has no timing or throughput target and makes no performance claim.

### Security
- **NFR-S01**: N/A. The script reads no credential, writes no file and reaches no network; input validation is unchanged.

### Reliability
- **NFR-R01**: No new failure mode. Every error path keeps its current exit code and message, and `set -euo pipefail` stays in force.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` and no `--files` still exits 1 with `ERROR: At least --loc or --files must be provided`, with or without `--quiet`.
- Maximum values: `--loc 1000` and `--files 30` still print one line, with the Level 3 label.
- Zero on one axis: `--loc 0 --files 2` is valid today and prints one quiet line.
- Boundary score: a total within 5 points of a level boundary still prints one line; only confidence changes, and confidence is not printed.

### Error Scenarios
- Unknown option: `ERROR: Unknown option: <flag>` on stderr, exit 1; `--quiet` does not suppress it.
- Missing value: `--loc` followed by another flag keeps `ERROR: --loc requires a numeric value`, exit 1.
- Non-numeric value: `ERROR: --loc must be a positive integer`, exit 1.

### State Transitions
- Repeated `--quiet`: the flag is idempotent.
- Flag order: `--quiet` before, between or after other flags produces the same one-line output.
- JSON precedence: `--json --quiet` and `--quiet --json` both print the JSON document.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 1 script, LOC: ~20 net, Systems: 1 |
| Risk | 10/25 | Auth: N, API: N, Breaking: N (stdout is a shared caller contract) |
| Research | 8/20 | Caller inventory across `.skilled/commands` and `.skilled/skills` |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 6/15 | Script, help text and four packet docs must agree on one flag name and one label |
| **Total** | **34/100** | **Content scores Level 1; authored at Level 3 so a shared output contract gets the full specification and regression proof** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the quiet line and a later label change breaks it | M | L | SC-002 ties the quiet line to the label the default report already prints |
| R-002 | A later edit reorders the dispatch and `--json` loses precedence | M | L | AC-007 tests both flag orders; ADR-001 records the precedence |
| R-003 | The default output drifts while the branch is added | H | L | Baseline captured before the edit (T001) and diffed after (T011) |

---

## 11. USER STORIES

### US-001: Read the level as one line (Priority: P0)

**As a** build or release script, **I want** the recommended level on one line, **so that** I can read it with `$(...)` without parsing the full report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep the full report by default (Priority: P1)

**As an** operator running the script by hand, **I want** the full report when I pass no flag, **so that** I keep the score, breakdown and phase recommendation I read today.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `--quiet` suppress the phase recommendation fields? RESOLVED: Yes. Quiet mode prints only the level line, and phase scoring still runs for `--json`.
- Should `--quiet` and `--json` be mutually exclusive? RESOLVED: No. `--json` wins, so an existing JSON caller that adds `--quiet` still gets its document (ADR-001).
- Should `--quiet` have a `-q` short form? RESOLVED: No. The request names the long form, and a second spelling is a second branch to document and test.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001)

---
