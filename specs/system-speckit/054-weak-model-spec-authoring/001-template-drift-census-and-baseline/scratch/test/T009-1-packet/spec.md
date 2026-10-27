---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a multi-section report, so a caller that only needs the recommended level has to parse or filter its stdout. A --quiet flag that prints the single level line lets scripts and agents read the answer directly."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level quiet output"
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
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` currently has two output modes: a human report made of a
header, a score line, a per-factor breakdown and a phase section, or a full JSON
document. Callers that only need the decision — a plan step recording a level, a
shell conditional, an agent summarising a task — must either ask for JSON and
extract one field, or filter the text with `head`/`grep` against output whose
shape can change. Neither is a stable, obvious way to read one number.

### Purpose
Add a `--quiet` flag that makes the script print only the recommended level line,
so the decision is readable directly without changing the default output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--quiet` flag (with the `-q` short form used by sibling scripts) parsed by the
  existing argument loop.
- A quiet output path that prints exactly one line: `Recommended Level: <N> (<Name>)`.
- Help text and the file-header usage block documenting the new flag.
- Verification that default (no-flag) output is byte-identical to the pre-change
  output for both text and JSON modes.

### Out of Scope
- Changing the scoring algorithm, thresholds, phase scoring or confidence maths —
  the flag selects output, it does not change the decision.
- Changing the default report or the JSON schema — existing callers depend on both.
- Redefining what `--quiet` means in sibling scripts such as `check-completion.sh`
  (there it means "suppress everything, exit code only") — different intent, and
  altering those scripts is not part of this change.
- Adding a positional/one-shot invocation form — the documented interface is flags only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `--quiet`/`-q` parsing, a quiet output branch, and help/header documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` and `-q` are accepted by the argument loop and set a quiet-mode flag; every existing option keeps its current behaviour and precedence. |
| REQ-002 | In quiet mode the script writes exactly one line to stdout, `Recommended Level: <N> (<Name>)`, followed by a single newline. No blank lines, score line, breakdown or phase section are printed. |
| REQ-003 | Without `--quiet`, text and `--json` output are byte-identical to the pre-change script for the same inputs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--quiet` together with `--json` prints the single quiet line, not JSON; quiet wins because its contract is one readable line. |
| REQ-005 | Validation failures and unknown options still write their `ERROR:` lines to stderr and exit 1; quiet suppresses reporting output only, never diagnostics. |
| REQ-006 | `--help` and the file-header OPTIONS block document `--quiet, -q`. |
| REQ-007 | Exit status stays 0 on a successful run in quiet mode. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 200 --files 5 --api --quiet` prints one line, `Recommended Level: 2 (Verification)`, and nothing else.
- **SC-002**: `recommend-level.sh --loc 200 --files 5 --api` output is byte-identical to the same call from the pre-change script (verified by diff against a captured baseline).
- **SC-003**: `recommend-level.sh --loc 200 --files 5 --api --json --quiet` prints the same single line as SC-001 and still exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ and the script's existing `set -euo pipefail` contract | A new global must be initialised before use or `-u` aborts the run | Initialise `QUIET_MODE=false` beside the other output flags |
| Risk | `--quiet` means "exit code only" in `check-completion.sh` and `validate.sh` | A reader can expect the wrong semantics here | Document the difference in the help text and plan; this flag exists to print the decision, not to silence it |
| Risk | A caller already filters the default report and breaks if line order changes | Existing automation noise | Default path is untouched; quiet is additive |
| Risk | Help text drifts from the header comment | Misleading documentation | Update both in the same task and verify with `--help` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode adds no measurable runtime cost; the same scoring path runs and only the print calls are skipped.
- **NFR-P02**: Quiet mode writes a single line, so callers avoid buffering and parsing a multi-line report.

### Security
- **NFR-S01**: No credentials, environment values or filesystem paths are newly exposed; the quiet line carries only the level number and name already printed by default.
- **NFR-S02**: User-supplied arguments remain validated exactly as before; the new flag takes no value and therefore adds no injection surface.

### Reliability
- **NFR-R01**: Quiet output is deterministic for identical inputs.
- **NFR-R02**: Failure paths keep exit status 1 and stderr diagnostics under quiet mode, so a caller can distinguish "level 0" from "did not run".
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no `--loc`/`--files` still triggers the existing `At least --loc or --files` error on stderr and exit 1, with or without `--quiet`.
- Maximum length: very large `--loc`/`--files` values still cap at their weights; the quiet line reflects the capped score's level.
- Invalid format: non-numeric `--loc` or `--files` exits 1 with the existing error message; quiet mode does not hide it.

### Error Scenarios
- External service failure: not applicable; the script is self-contained with no network calls.
- Network timeout: not applicable.
- Concurrent access: not applicable; the script reads no shared state and writes no files.

### State Transitions
- Partial completion: not applicable; output happens once, after all scoring completes.
- Session expiry: not applicable; each invocation is independent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [8/25] | One shell file, roughly 8-12 changed lines, no new files |
| Risk | [5/25] | Additive output flag; the risk is accidental change to the default path, which a diff check covers |
| Research | [3/20] | The script and its sibling `--quiet` conventions are already in the repository |
| **Total** | **[16/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The request fixes the contract: one flag, one printed line, default output unchanged. Where the request is silent — the `--json` combination and the `-q` alias — this packet takes the narrow reading recorded in REQ-002, REQ-004 and REQ-006.
<!-- /ANCHOR:questions -->

---
