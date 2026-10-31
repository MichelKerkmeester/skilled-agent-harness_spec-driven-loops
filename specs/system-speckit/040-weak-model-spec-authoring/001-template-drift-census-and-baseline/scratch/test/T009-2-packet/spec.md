---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a blank line, the recommended-level sentence, a score line, a six-line breakdown and a phase block, so a caller that only wants the level has to grep its stdout. A --quiet switch reduces stdout to the single recommended-level line and leaves every other invocation byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level.sh --quiet"
  - "suppress recommend-level breakdown output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | n/a - scaffolded with `--skip-branch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` prints a blank line, the `Recommended Level: N (Name)` sentence, a
score/confidence line, a six-line breakdown and a phase-recommendation block on every text
invocation. A caller that only wants the level — a shell `$(...)` capture in a Makefile, a CI
step, a human deciding whether to write a spec — has to `grep` or `head -2` the output, which
copies the output wording into that caller and breaks silently whenever the wording changes.
There is no switch today that asks the script for its answer without the explanation.

### Purpose
Give the script a `--quiet` switch that leaves stdout holding exactly the final
recommended-level line, while every invocation without the switch keeps the output it
produces now.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--quiet` in the MAIN SCRIPT argument loop, setting a single `QUIET` global.
- A quiet branch inside `output_text()` that prints only `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`.
- The OPTIONS list in the file header comment and in `show_help()`.
- Verification evidence for the quiet path, the unchanged default path, and the error path.

### Out of Scope
- JSON output changes - `--json` already emits one machine-readable document, and two commands (`speckit-plan.yaml`, `speckit-complete.yaml`) parse it, so trimming it would break consumers.
- Phase scoring, level thresholds and confidence math - untouched by this feature.
- Other spec scripts (`create.sh`, `validate.sh`, `upgrade-level.sh`) - separate option surfaces with no shared flag contract today.
- A `-q` short alias - not requested, and every added alias is another spelling for help and tests to cover; `--quiet` alone settles the requirement.
- Callers' own use of `grep`/`head` - they may keep it; this feature only removes the need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `--quiet` option, its global, the quiet output branch, and the two help surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### User Story 1: Script caller wants the answer only
As a maintainer wiring level selection into a shell pipeline, I want one line on stdout so I
can capture the recommendation without parsing a report.

### User Story 2: Human wants the explanation
As a reviewer running the script by hand, I want the score, breakdown and phase detail exactly
as they are today, so a documentation level stays defensible.

### User Story 3: JSON consumer
As a command asset that reads `recommended_level` from `--json`, I want `--quiet` to change
nothing, so adding the flag to a shared wrapper cannot corrupt my parse.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument loop accepts `--quiet` and records it in a `QUIET` global; no other flag changes meaning. |
| REQ-002 | With `--quiet` and text output, stdout is exactly one line: `Recommended Level: N (Name)`. No leading blank line, no score line, no breakdown, no phase block. |
| REQ-003 | Without `--quiet`, text output and JSON output are unchanged, including the leading blank line. |
| REQ-004 | Usage errors still print to stderr and exit 1 when `--quiet` is present, with nothing on stdout: missing/invalid `--loc`, missing/invalid `--files`, invalid `--phase-threshold`, unknown option, and the no-input error. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `show_help()` and the header `OPTIONS:` block both list `--quiet` with its one-line meaning. |
| REQ-006 | `--quiet` combined with `--json` leaves the JSON document unchanged; the flag applies to text output only. |
| REQ-007 | `--quiet --help` still prints the full help text and exits 0, because `--help` short-circuits before output selection. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 50 --files 2 --quiet` emits exactly one line, matching `^Recommended Level: [0-3] \([A-Za-z]+\)$`.
- **SC-002**: The same invocation without `--quiet` diffs empty against a baseline captured before the change, for a low, a medium and a high-scoring input set.
- **SC-003**: `--quiet --json` output is byte-identical to `--json` output and parses with a JSON reader.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ as shipped on macOS, no external JSON tool | Missing reader blocks only SC-003's parse check | Use `python3 -c 'import json,sys; json.load(sys.stdin)'`, which the repository already assumes |
| Risk | The quiet branch drifts from the normal branch when one is edited later | Med - one branch could print a stale level | Both branches read the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` globals, and SC-001/SC-002 run together |
| Risk | A caller depends on the leading blank line of default output | Low - only a caller that strips it first | Default path is untouched (REQ-003), proven by the SC-002 diff |
| Risk | An older copy of the script rejects `--quiet` as an unknown option | Low - fails loudly with exit 1, never silently | Help and header document the flag; the unknown-option error already names the offending token |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable runtime change - the quiet path adds one string comparison in `output_text()` and one `case` arm in the parser.
- **NFR-P02**: No additional process spawns; the quiet line is built from shell variables already in memory.

### Security
- **NFR-S01**: `--quiet` takes no argument, so it adds no value to validate and no new injection surface.
- **NFR-S02**: Error text stays on stderr, so a quiet capture never mixes a message into the value a caller parses.

### Reliability
- **NFR-R01**: Exit code contract unchanged: 0 on a successful recommendation, 1 on any usage error.
- **NFR-R02**: Quiet output is deterministic for a given input set - same three globals, same formatting, no timestamps.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero input (`--quiet` alone): the existing no-input error fires on stderr, exit 1, stdout empty.
- Maximum score (LOC > 1000, files > 30): still one line, level 3, unchanged formatting.
- Threshold boundary scores (24/25, 44/45, 69/70): the quiet line reports the same level the normal line reports.

### Error Scenarios
- Unknown option next to `--quiet`: unknown-option error on stderr, exit 1, stdout empty.
- Non-numeric `--loc` value with `--quiet`: numeric validation error on stderr, exit 1, stdout empty.
- JSON consumer passing `--quiet` through a wrapper: JSON body unchanged (REQ-006), so parsing still succeeds.

### State Transitions
- Repeated `--quiet`: idempotent, one line.
- `--quiet` before or after other flags: order-independent, because the parser scans the whole argument list.
- `--quiet --help`: help wins and exits 0, because `show_help()` runs inside the parse loop.
- `--quiet --no-recommend-phases`: the phase block was already suppressed; the single line is unaffected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One script, one flag, roughly 10 changed lines across four regions |
| Risk | 4/25 | No auth, API or schema surface; the risk is a regression in default output |
| Research | 3/20 | One read of the argument loop and the two output functions; no external research |
| **Total** | **15/70** | **Level 2** - carried by the unchanged-output regression gate, not by code size |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a later change add a `-q` alias? Deferred: not requested, and the long form satisfies every requirement here.
- Should `--quiet` ever emit the bare digit instead of the full sentence? Deferred: an invented second format would split the parser contract, and the sentence is already a stable, greppable shape.
<!-- /ANCHOR:questions -->

---
