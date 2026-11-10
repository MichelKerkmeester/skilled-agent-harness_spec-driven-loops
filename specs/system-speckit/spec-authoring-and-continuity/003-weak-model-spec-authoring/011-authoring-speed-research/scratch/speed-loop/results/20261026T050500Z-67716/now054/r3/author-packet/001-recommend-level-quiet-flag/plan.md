---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet branch to one bash script: parse the flag, keep the JSON conflict explicit, and print only the Recommended Level line at dispatch. Prove it with a line count on both modes and a byte diff against a captured baseline."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ with `set -euo pipefail` |
| **Framework** | None: a single CLI script under the spec runtime |
| **Storage** | None |
| **Testing** | Direct invocations with captured stdout, `wc -l`, `diff` and `bash -n`; this tree has no shell test harness for the script |

### Overview
The change lives in one file. `--quiet` joins the existing `case` parser as a boolean global, the parser rejects `--json --quiet` before any scoring runs, and the output dispatch gains a one-line branch that reuses the label `output_text` already prints. Verification compares line counts for the quiet and default forms and diffs the default output against a baseline captured before the edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented: `spec.md` names one file and five requirements
- [ ] Success criteria measurable: each SC names a command and the line count it prints
- [ ] Dependencies identified: `bash` 3.2+, no new package
- [ ] The current default output is captured before the first edit

### Definition of Done
- [ ] All acceptance criteria met, with the command output recorded
- [ ] `bash -n` exits 0 and both line counts print as specified
- [ ] Docs updated: `spec.md`, `plan.md` and `tasks.md` agree on the flag and the label
- [ ] Strict validation prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: single-script output branch

### Key Components
- **Argument parser** (section 5): reads `--quiet` into `QUIET` and rejects the `--json` conflict before scoring.
- **Output dispatch** (section 7): sends text mode to `output_text` or to the one-line quiet branch; JSON mode is untouched.
- **Help surface** (header OPTIONS and `show_help`): documents the flag in the two places a reader looks.

### Data Flow
Arguments become globals, the score functions read those globals, `determine_level` sets the level and `calculate_confidence` sets the confidence. `--quiet` is read once in the parser and consulted only at dispatch, so no scoring function sees it and no arithmetic changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches a shared output contract: stdout of a CLI other scripts call. The table records every surface that reads it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` section 7 | owns the text and JSON dispatch | update | `rg -n 'JSON_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` lists the dispatch at line 770 |
| `output_text` | prints the 17-line report and the level label | unchanged | the quiet branch reuses the label at line 510 and leaves the function body alone |
| Callers that read the default report | humans and any script that scrapes the report | not a consumer of `--quiet` | SC-002 diffs the default output against the captured baseline |
| Callers that pass `--json` | read one JSON document | not a consumer of `--quiet` | AC-004 pins the rejection path |
| `show_help` and the header OPTIONS block | document the option surface | update | `rg -n -- '--quiet' recommend-level.sh` finds the header, the parser, the help text and the branch |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` lists every output-mode global; `QUIET` joins that set and follows the same shape.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled/skills/system-spec-kit --glob '*.md' --glob '*.sh'` lists documentation and workflow references; none parses the report, so none needs a change.
- Matrix axes: output mode (default, `--quiet`, `--json`, `--quiet --json`) crossed with input profile (low, medium, full-risk, invalid). AC-001 through AC-006 cover the quiet rows and the JSON conflict; T012 covers the invalid-input rows.
- Algorithm invariant: not a path, redaction, parser-resolver or security fix; the only invariant is that stdout without `--quiet` is unchanged.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The three steps below are the shape of the work; `tasks.md` holds the individual actions.

### Step 1: Capture the baseline and read the dispatch

Read the globals block, the parser and the output dispatch, and capture the current default report before any edit.

Acceptance: `scratch/baseline-default.txt` holds the current report and its line count is known.

Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints `17`.

### Step 2: Add the flag and the conflict check

Add `QUIET=false` beside `JSON_OUTPUT`, accept `--quiet` in the parser, and exit 1 with a stderr message when `--json` is also set.

Acceptance: `--quiet` is accepted, `--json --quiet` exits 1, and no scoring function reads `QUIET`.

Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --json --loc 50 --files 2 >/dev/null 2>&1; echo $?` prints `1`.

### Step 3: Branch the output and document the flag

Print only the level line when `QUIET` is true, then add the option to the header block and `show_help`.

Acceptance: quiet prints exactly one line, the default report is unchanged, and both help surfaces list the flag.

Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints `1`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Argument parsing and the quiet branch: accepted flag, rejected `--json` pair, single output line | `bash -n`, direct invocation, `wc -l` |
| Integration | Default, quiet and JSON modes across low, medium and full-risk inputs, plus the error paths | Captured stdout and stderr, `diff`, exit codes |
| Manual | Read `--help` and confirm the flag is listed with its behavior | Terminal |

The regression guard is the baseline diff: the default report must match `scratch/baseline-default.txt` byte for byte, so any accidental change to the existing output fails the run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or later | Internal | Green | The script already requires it; nothing to install |
| `wc` and `diff` | Internal | Green | Verification only; both ship with the platform |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes, or `--quiet` alters an exit code or a stderr message.
- **Procedure**: Revert the one commit that carries the change, or restore the file with `git checkout <sha> -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, then rerun the default invocation and confirm `wc -l` prints `17`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 25 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **55 minutes (assumption: one author, one pass)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                     ┌─────▼─────┐
                     │  Docs     │
                     │  Parallel │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline-default.txt` | Default-output diff |
| Parser change | Baseline capture | Accepted `--quiet`, rejected `--json` pair | Quiet branch |
| Quiet branch | Parser change | The single output line | Verification |
| Docs update | Parser change | Header and help entries | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline** - 10 minutes - CRITICAL
2. **Add the parser and the quiet branch** - 25 minutes - CRITICAL
3. **Run the line counts, the diff and the validator** - 20 minutes - CRITICAL

**Total Critical Path**: 55 minutes

**Parallel Opportunities**:
- The header and `show_help` documentation runs alongside the quiet branch, since both edit the same file but different regions.
- The acceptance-criteria evidence can be collected while the verification commands run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `wc -l < scratch/baseline-default.txt` prints `17` | Phase 1 |
| M2 | Flag works | `--quiet` prints one line and `--json --quiet` exits `1` | Phase 2 |
| M3 | Verified | The baseline diff is empty and the validator prints `RESULT: PASSED` | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Add a flag instead of an environment variable

**Status**: Accepted

**Context**: Callers need a one-line output. The script already exposes its behavior through flags, and the operator who runs it reads `--help` to discover options.

**Decision**: Add `--quiet` to the existing argument parser and store it in a `QUIET` global beside `JSON_OUTPUT`.

**Consequences**:
- The option is discoverable in `--help`, testable with one invocation, and scoped to the process that sets it.
- One more global joins the globals block; it is read once and never mutated after parsing.

**Alternatives Rejected**:
- `SPEC_RECOMMEND_QUIET` environment variable: invisible in `--help`, inherited by child processes, and easy to leave set by accident.
- A second script that calls this one and filters its output: duplicates the scoring path and creates a second place for the level logic to drift.

### ADR-002: Reject `--quiet --json` instead of picking a winner

**Status**: Accepted

**Context**: `--quiet` asks for one text line and `--json` asks for a JSON document. A caller that passes both has made a mistake, and either silent resolution hides it.

**Decision**: Exit 1 with a stderr message that names the conflict, before any scoring runs.

**Consequences**:
- No ambiguous output shape reaches a caller.
- A caller that wants the level from JSON keeps using `--json` and reads `recommended_level`; a caller that wants one line uses `--quiet`.

**Alternatives Rejected**:
- Let `--quiet` win: silently drops the JSON contract the caller asked for.
- Let `--json` win: silently ignores the flag, so the caller believes the output is quiet.
- Emit both: two shapes on one stream, which is the problem the flag exists to solve.

### ADR-003: Reuse the existing level label

**Status**: Accepted

**Context**: `output_text` already prints `Recommended Level: N (Name)`. A quiet mode that invents a new format gives callers a second contract to track.

**Decision**: Print the existing label verbatim, with no leading blank line and no trailing sections.

**Consequences**:
- One label to maintain, and it is greppable with the same pattern the report already uses.
- Callers still parse a label rather than a bare integer; the label is the stable anchor, and AC-001 pins it.

**Alternatives Rejected**:
- Print only the integer: loses the level name and the anchor a caller greps for.
- Print a new format such as `level=3`: a second contract for the same value, and a second place to break.

---
