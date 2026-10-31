---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add an opt-in --quiet flag to recommend-level.sh that prints only the recommended-level line. The plan keeps the default text path and the JSON path untouched, reuses the existing level line verbatim, and verifies the change with a captured baseline, a flag matrix, and the existing phase-system harness."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level.sh quiet implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2-compatible shell script under `set -euo pipefail` |
| **Framework** | None - standalone CLI script invoked directly or from tests |
| **Storage** | None |
| **Testing** | `bash -n` syntax check, direct CLI matrix with stdout/stderr/exit capture, existing Node harness `runtime/cli/tests/test-phase-system.js` |

### Overview

The change adds a `QUIET_MODE` global, one value-less `--quiet` arm in the existing `while [[ $# -gt 0 ]]` parser, and one branch in `output_text()` that prints the recommended-level line and returns. The renderer selection at the bottom of the script keeps `--json` first so the JSON document is never modified by the flag. Two documentation surfaces in the same file - the header comment block and `show_help()` - gain the option so the script describes itself accurately.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI with a parse-validate-compute-render pipeline. The flag changes only the render step; every earlier step is untouched.

### Key Components

- **Argument parser** (`while [[ $# -gt 0 ]]` / `case`): gains a `--quiet` arm that sets `QUIET_MODE=true` and shifts one token.
- **Globals block**: gains `QUIET_MODE=false` beside `JSON_OUTPUT=false`, keeping the default path identical.
- **`output_text()`**: gains an early quiet branch that prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` and returns before the blank line, score line, breakdown, and phase block.
- **`output_json()`**: unchanged. It is a separate function and stays the sole owner of the JSON contract.
- **Renderer selection** (section 7 of the script): stays `if JSON_OUTPUT; then output_json; else output_text; fi`, so JSON precedence is structural rather than conditional.
- **`show_help()` and the header comment**: gain the `--quiet` option line.

### Data Flow

`argv -> parser (sets QUIET_MODE / JSON_OUTPUT and inputs) -> numeric validation -> score calculation -> determine_level -> calculate_confidence -> determine_phasing -> renderer choice -> one of output_json / quiet line / full report`.

The quiet branch reads only `RECOMMENDED_LEVEL` and `LEVEL_NAME`, both already final before rendering starts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature, not a bug fix, but the renderer is a public output surface, so the producer/consumer inventory is recorded here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` in `recommend-level.sh` | Producer of the human report | Update: add the quiet branch ahead of the existing echoes | Quiet output has one line; default output diffs clean against the baseline |
| `output_json()` in `recommend-level.sh` | Producer of the JSON document | Unchanged | `--json` and `--json --quiet` outputs diff clean against the baseline |
| Renderer selection in section 7 | Chooses the renderer | Unchanged: `JSON_OUTPUT` still tested first | `--json --quiet` emits JSON only |
| Argument parser `case` block | Owns the CLI surface | Update: add the value-less `--quiet` arm | Flag matrix: leading, trailing, repeated, with trailing numeric token |
| Header comment `OPTIONS` block | Self-documentation | Update: add `--quiet` | `sed -n '1,40p'` shows the option |
| `show_help()` text | User-facing help | Update: add `--quiet` | `--help` and `--quiet --help` both list it and exit `0` |
| `runtime/cli/tests/test-phase-system.js` | Consumer via `--json` | Unchanged | Harness passes |
| `runtime/cli/tests/test-phase-validation.js` | Consumer via `--json` | Unchanged | Harness passes |
| `runtime/cli/spec/README.md` | Lists the script by name only | Unchanged: it documents no per-option detail | Read the listing; nothing to update |
| `references/workflows/*.md` | Describe level selection, not the CLI flags | Unchanged | `rg -n "recommend-level" references/` shows prose references only |

Required inventories:

- Same-class producers: `rg -n 'Recommended Level:|output_text\(\)|JSON_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` - one text producer, one JSON producer, one renderer switch.
- Consumers of the changed surface: `rg -n 'recommend-level' .skilled/skills/system-spec-kit/runtime/cli/tests .skilled/skills/system-spec-kit/references` - two test harnesses and prose docs; neither parses the text report.
- Matrix axes: flag presence (`--quiet` absent, present, repeated) x output mode (text, `--json`) x input class (valid, invalid numeric, missing inputs, unknown option) x option position (leading, trailing).
- Algorithm invariant: scoring, level mapping, confidence, and phase scoring are computed before rendering and are not touched by the flag. The quiet line is derived from the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` values the default report prints.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### AI Execution Protocol

**Pre-Task Checklist**

- [ ] Read `spec.md` section 3 and confirm the change is still confined to `recommend-level.sh`.
- [ ] Read this plan's ADR-001 before choosing how `--quiet` interacts with `--json`.
- [ ] Capture the baseline outputs named in T002 before editing the script.
- [ ] Know the verification command for the task: `bash -n` for syntax, a direct invocation for behavior.

**Execution Rules**

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order; T004-T008 all touch one file, so they are sequential. |
| TASK-SCOPE | Touch only `recommend-level.sh`; any other file is a finding, not an edit. |
| TASK-VERIFY | Run the task's named check before marking it complete. |
| TASK-DOC | Update the checkbox and evidence line in `tasks.md` immediately. |

**Status Reporting Format**

`T### [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

**Blocked Task Protocol**

1. Mark the task `[B]` in `tasks.md` with the blocking fact.
2. Do not edit around the blocker; a failing `bash -n` or a moved baseline is a stop condition.
3. Escalate after two blocked tasks rather than guessing at the cause.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | The edited script parses | `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` |
| Unit (CLI) | Quiet output is one exact line for level 0, 1, 2 and 3 fixtures | Direct invocation with `--loc`/`--files`/risk flags, captured stdout |
| Regression | Default text output unchanged | `diff` against the T002 baseline |
| Contract | JSON unchanged with and without `--quiet` | `diff` against the T002 JSON baseline |
| Negative | Errors still go to stderr with the existing exit codes | Invocations with no inputs, bad `--loc`, unknown option |
| Harness | Existing phase-system expectations still hold | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `recommend-level.sh` current behavior | Internal | Green | Baseline cannot be captured, so the "unchanged default" claim cannot be proven |
| Node runtime for the existing harness | Internal | Green | JSON regression evidence is reduced to a diff-only check |
| Bash 3.2-compatible syntax | Internal | Green | A bash-4-only construct would break the script on macOS's default bash |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default text output or the JSON document changes for any existing invocation, or `bash -n` fails after the edit.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`; the change is one file with no data or config migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10-15 minutes |
| Core Implementation | Low | 20-30 minutes |
| Verification | Low | 20-30 minutes |
| **Total** | | **50-75 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline outputs captured (T002)
- [ ] No feature flag needed; the flag itself is opt-in
- [ ] Monitoring alerts set: not applicable to a local CLI script

### Rollback Procedure

1. Revert the commit that modifies `recommend-level.sh`.
2. Run `bash -n` on the restored file.
3. Re-run the default invocation and compare with the captured baseline.
4. Notify the packet owner if the revert followed a reported output change.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A - the script holds no state
<!-- /ANCHOR:enhanced-rollback -->

---


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
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture (T001-T002) | None | Recorded default and JSON outputs | Core edits, regression diff |
| Parser arm (T005) | Baseline capture | `QUIET_MODE` set from argv | Quiet renderer branch |
| Quiet renderer branch (T006) | Parser arm | One-line output | Verification matrix |
| Option documentation (T008) | Parser arm | Updated header and help | Help verification |
| Verification matrix (T010-T015) | All implementation tasks | Evidence for every acceptance row | Packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001-T002 baseline capture** - 10 minutes - CRITICAL
2. **T004-T007 parser, renderer, and precedence** - 25 minutes - CRITICAL
3. **T010-T014 syntax and output matrix** - 20 minutes - CRITICAL

**Total Critical Path**: roughly 55 minutes

**Parallel Opportunities**:

- T003 (read the existing harness expectations) can run alongside T001-T002.
- T008 (documentation) can run once T005 lands, in parallel with T006.
- T015 (harness run) is independent of the manual matrix and can run alongside it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Default text and JSON outputs stored for four fixtures | Phase 1 |
| M2 | Flag works | `--quiet` prints one line; default and JSON paths diff clean | Phase 2 |
| M3 | Evidence complete | Syntax, matrix, and harness checks recorded in `tasks.md` | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--json` takes precedence over `--quiet`

**Status**: Accepted

**Context**: The script already has one machine format, `--json`. A quiet flag that also suppresses the JSON document would either force callers to choose between two machine formats or produce a plain-text line where a caller asked for JSON. Either outcome makes the flag destructive to an existing contract.

**Decision**: `--quiet` affects only `output_text()`. The renderer selection keeps `JSON_OUTPUT` as the first test, so `--json --quiet` emits the unchanged JSON document and quiet mode is a no-op on that path.

**Consequences**:

- Positive: the JSON contract cannot be broken by the new flag, and existing `--json` callers need no change.
- Negative: `--json --quiet` is accepted rather than rejected, so a caller can pass a flag that does nothing. Mitigated by documenting the precedence in `--help` and in the option list.

**Alternatives Rejected**:

- `--json --quiet` exits with a usage error: adds a failure mode for callers who pass both flags generically, and turns a harmless combination into a script break.
- `--quiet` wins and prints the plain line even with `--json`: silently changes the meaning of an existing flag.
- A separate `--format=text|json|line` option: a larger interface change than the request, and it would deprecate two working flags.

### ADR-002: Reuse the existing recommended-level line instead of inventing a quiet format

**Status**: Accepted

**Context**: The default report already prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`. A quiet mode could print a bare number, a key-value pair, or a new sentence. Any of those creates a second format for the same fact and a second thing to keep in sync.

**Decision**: Quiet mode prints the existing line verbatim, with no leading blank line and a trailing newline. The only difference from the default report is what is omitted around it.

**Consequences**:

- Positive: one format for one fact; a caller that already greps `Recommended Level:` can switch to `--quiet` with no parser change.
- Negative: the line carries the level name as well as the number, so a caller that wants the bare number still needs a cut. Accepted: the request asks for the recommended-level line, not a token stream.

**Alternatives Rejected**:

- Bare integer output: cheaper to parse, but it invents a format and loses the name that makes the line readable in logs.
- JSON-lines (`{"recommended_level": 2}`): duplicates `--json` for one field and invites a third contract to maintain.
- Suppressing the name to save bytes: no measurable benefit and it changes the line callers already recognize.

---
