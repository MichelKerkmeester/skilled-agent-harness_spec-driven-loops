---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a full report even when the caller only needs the level. A --quiet flag narrows text output to the single recommended-level line and leaves default output byte-identical."
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

`recommend-level.sh` scores a task and recommends a documentation level, then wraps that decision in a report: score, confidence, per-factor breakdown and a phase section. A caller that wants only the decision has to filter the report or parse JSON. `--quiet` gives it one line, `Recommended Level: <N> (<Name>)`, and changes nothing else.

**Key Decisions**: quiet output reuses the exact line the full report prints, so the two cannot drift. `--json` output is untouched by `--quiet`.

**Critical Dependencies**: none beyond the bash 3.2 and coreutils the script already requires.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | none (scaffolded with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A text-mode run prints a leading blank line, the level line, a score line, a six-row breakdown and a phase section, about 20 lines for one decision. A caller that needs only the level has two options. It can filter stdout with `grep '^Recommended Level:'` and depend on that exact wording. Or it can switch to `--json` and carry a JSON parser for one integer. The first couples the caller to presentation. The second is disproportionate for one value.

### Purpose

One flag, `--quiet` (short form `-q`), makes a text-mode run print only the recommended-level line, so the decision is the whole output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--quiet` and `-q` in `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
- A text-mode path that prints exactly `Recommended Level: <N> (<Name>)` and nothing else
- The `--help` entry for the flag
- Proof that default output is byte-identical to the pre-change baseline

### Out of Scope
- Scoring, thresholds, confidence and phase logic. The flag changes presentation only.
- The `--json` payload. It already carries `recommended_level` and `level_name`.
- A bare-integer mode. `--quiet` keeps the labeled line, and `--json` already serves callers that need a machine value.
- Reference docs that mention the script. They describe purpose and examples, never the option list. `--help` is the canonical list.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `--quiet`/`-q` parsing, one shared level-line function and the help entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The parser accepts `--quiet` and `-q` at any position in the argument list and sets quiet mode. |
| REQ-002 | In quiet mode the script writes one stdout line, `Recommended Level: <N> (<Name>)`, newline-terminated, with no blank line before or after it. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the pre-change output for every accepted input. Exit codes and stderr are unchanged in both modes. |
| REQ-004 | Quiet mode does not suppress validation. A missing or invalid input still writes its message to stderr, exits 1 and writes nothing to stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--help` lists `--quiet, -q` beside the other options. |
| REQ-006 | `--quiet` combined with `--json` leaves the JSON document unchanged. |
| REQ-007 | The quiet line and the full report's level line render from one code path, so a later edit cannot change one without the other. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 200 --files 5 --api --quiet` prints exactly `Recommended Level: 1 (Baseline)`.
- **SC-002**: A `diff` of default output against the captured pre-change baseline is empty across the level matrix, with phase output on and off.
- **SC-003**: Every quiet run reports one line (`wc -l` = 1), at each of the four levels.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2 and coreutils | The script already requires both. No new dependency. | None needed |
| Risk | The quiet line drifts from the report line | A caller reads a different value than the report shows | REQ-007 makes both render from one function |
| Risk | Default output changes by accident | Existing consumers break | REQ-003 plus a byte diff against a captured baseline |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A quiet run does less work than a default run. It adds no measurable time and stays under 100 ms for the documented example inputs.

### Security
- **NFR-S01**: The flag takes no value and reads no environment variable, so it adds no input surface.

### Reliability
- **NFR-R01**: Flag parsing is order-independent and idempotent. `--quiet` may appear once or several times with the same result.

---

## 8. EDGE CASES

### Data Boundaries
- Level boundaries: scores 24, 25, 44, 45, 69 and 70 must render Level 0, 1, 1, 2, 2 and 3 with the matching name.
- Empty input: no `--loc` and no `--files` is rejected before rendering, so quiet mode never prints a level it did not compute.

### Error Scenarios
- `--quiet` with no numeric input: stderr reads `ERROR: At least --loc or --files must be provided`, exit code 1, stdout empty.
- `--quiet --json`: the JSON document is unchanged.
- `--help --quiet`: help text wins and the script exits 0.
- Unknown option: unchanged error and exit code 1.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: about 15, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | Read one script. No external investigation. |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **12/100** | **Level 3 declared by assignment, the scorer returns Level 0** |

The scorer agrees with the table. `recommend-level.sh --loc 15 --files 1` returns Level 0 with a score of 3/100. The packet is Level 3 because this authoring task was assigned at Level 3. The extra sections are documentation depth, not implementation risk.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Quiet line and report line diverge | M | L | One shared function (REQ-007) |
| R-002 | Default output changes | H | L | Byte diff against the captured baseline (SC-002) |
| R-003 | `-q` collides with a future flag | L | L | `-q` already means quiet in `validate.sh` and `check-completion.sh`, so the short form is the repo convention |
| R-004 | A caller reads quiet as "no output at all" | L | M | `--help` states that quiet prints the level line |

---

## 11. USER STORIES

### US-001: Level-only output (Priority: P0)

**As a** caller that needs the documentation level and nothing else, **I want** a flag that prints only the decision line, **so that** I can read the level without filtering a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Untouched default output (Priority: P1)

**As a** maintainer of anything that reads the current report, **I want** default output to stay byte-identical, **so that** adding the flag cannot break an existing reader.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The two choices that could have become questions, what `--quiet` prints and how it behaves with `--json`, are settled in ADR-001 and ADR-002 in `plan.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the L3 Architecture Decision Record in `plan.md`

---
