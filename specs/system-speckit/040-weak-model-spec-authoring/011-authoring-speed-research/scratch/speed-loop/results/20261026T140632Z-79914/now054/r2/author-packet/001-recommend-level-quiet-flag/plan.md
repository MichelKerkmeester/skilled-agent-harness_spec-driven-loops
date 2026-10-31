---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Four small edits to one bash script: a global, a parser case, a branch inside output_text, and two help blocks. Verification counts lines and diffs the default report."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "quiet flag implementation plan"
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
| **Language/Stack** | Bash 3.2 or newer, POSIX shell builtins only |
| **Framework** | None, a single script under the system-spec-kit CLI |
| **Storage** | None |
| **Testing** | `bash -n`, direct invocation, `wc -l`, `diff` |

### Overview

One script changes: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. The quiet branch goes inside `output_text()` so the level label keeps one source of truth. You prove it by counting lines in both modes and diffing the default report against a captured baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Baseline output captured from the unmodified script
- [x] Precedence rule for `--json` decided in ADR-001

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash -n recommend-level.sh` exits 0
- [ ] `--quiet` prints one line and the default report matches the baseline byte for byte
- [ ] Help text and header comment list the flag
- [ ] `spec.md`, `plan.md` and `tasks.md` agree on the flag name and the line format
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single script branch. The script parses arguments into globals, computes scores, then hands off to one of two renderers: `output_text()` or `output_json()`.

### Key Components

- **Argument parser** (`recommend-level.sh`, section 5): a `case` loop over `$1` that turns flags into globals.
- **`QUIET` global** (section 2): a boolean beside `JSON_OUTPUT`, read by the renderer.
- **`output_text()`** (section 4): the text renderer. It owns the `Recommended Level: <N> (<Name>)` string today.
- **`output_json()`** (section 4): the JSON renderer, unchanged by this work.
- **Header comment and `show_help()`**: the two places a user reads the option list.

### Data Flow

```
argv ──► parser ──► LOC, FILES, HAS_*, QUIET, JSON_OUTPUT
                        │
                        ▼
              scores ──► RECOMMENDED_LEVEL, LEVEL_NAME
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
      output_text()        output_json()
      QUIET=true?          one JSON document
      one line : report
```

### Surfaces Touched

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` | Renders the report and the level line | update | `rg -n 'Recommended Level' recommend-level.sh` shows the string in one place |
| `output_json()` | Renders the JSON document | unchanged | `--json` output diffs empty against the baseline |
| `show_help()` | Prints the option list | update | `--help` lists `--quiet, -q` |
| Header comment block | Documents options for a reader of the file | update | `sed -n '1,40p' recommend-level.sh` shows the flag |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Calls the script with `--json` | not a consumer of the text path | `rg -n 'recommend-level.sh' .skilled/commands/speckit/assets/` shows `--json` in both calls |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Calls the script with `--json` | not a consumer of the text path | same grep |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The four steps below are the shape of the change.

### Step 1: Initialize the quiet state

Add `QUIET=false` beside `JSON_OUTPUT=false` in the GLOBALS block. The script runs under `set -euo pipefail`, so a renderer that reads an unset `QUIET` aborts the run instead of printing anything.

Acceptance: `QUIET` is declared before the parser and `bash -n` still exits 0.
Verify: `rg -n '^QUIET=' recommend-level.sh` prints one line above the parser.

### Step 2: Parse the flag

Add a `--quiet|-q)` case to the argument loop, setting `QUIET=true` and calling `shift`. Place it beside `--json|-j)` so the two output switches sit together.

Acceptance: both spellings are accepted and neither reaches the unknown-option branch.
Verify: `bash recommend-level.sh --quiet --loc 50 --files 2` exits 0, and `bash recommend-level.sh -q --loc 50 --files 2` exits 0.

### Step 3: Branch the text renderer

Open `output_text()` with a quiet guard. When `QUIET` is true, print the level line and return before the blank line, the score row, the breakdown and the phase block.

Acceptance: `--quiet` prints one line, and that line is the one the default report prints.
Verify: `bash recommend-level.sh --quiet --loc 50 --files 2 | wc -l` prints 1.

### Step 4: Document the flag

Add `--quiet, -q` to the header OPTIONS block and to `show_help`, with one example that uses it.

Acceptance: both option lists name the flag and at least one example passes it.
Verify: `bash recommend-level.sh --help | rg -n 'quiet'` prints two lines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated suite covers `recommend-level.sh` today. The verification is a set of commands a reader can rerun, captured in `tasks.md`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | The edited script parses | `bash -n` |
| Output parity | Quiet line equals line 2 of the default report | `diff` of the quiet run against line 2 of the report |
| Regression | Default report matches the pre-change baseline | `diff` against `scratch/baseline-default.txt` |
| Exit codes and stderr | Invalid input in both modes | `bash recommend-level.sh --loc abc` with `$?` |
| Help | Option list names the flag | `--help` piped to `rg` |

The baseline files live in `scratch/` and are captured from the unmodified script before the first edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | Internal | Green | The script cannot run |
| `diff`, `wc`, `rg` for verification | Internal | Green | Verify by reading the output instead |
| The unmodified script for a baseline | Internal | Green | Capture the baseline from `git stash` or a copy before editing |

No new package, library or service is required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes for any argument set, or a caller that passes `--json` sees different output.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`, then rerun the two baseline diffs.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Implementation | Low | 30 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **1 hour (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline output captured (no data to back up)
- [ ] Feature flag configured (not applicable, the flag is the switch)
- [ ] Monitoring alerts set (not applicable, a local CLI script)

### Rollback Procedure
1. Revert the commit that edits `recommend-level.sh`.
2. Run `bash -n` on the restored file.
3. Rerun the default and `--json` diffs against `scratch/baseline-default.txt` and `scratch/baseline-json.json`.
4. Tell the callers who adopted `--quiet` that the flag is gone.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the script keeps no state
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Phase 1     │────►│  Phase 2         │────►│  Phase 3       │
│  Setup       │     │  Implementation  │     │  Verification  │
└──────────────┘     └──────────────────┘     └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline-*.txt` | Verification |
| `QUIET` global | None | A readable boolean | Parser case, quiet branch |
| Parser case | `QUIET` global | `QUIET=true` on demand | Quiet branch |
| Quiet branch in `output_text()` | Parser case | The one-line output | Verification |
| Help blocks | Flag name | Option list and examples | Documentation checks |
| Verification | All of the above | Command evidence | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline** - 10 minutes - CRITICAL
2. **Add the global and the parser case** - 15 minutes - CRITICAL
3. **Add the quiet branch** - 15 minutes - CRITICAL
4. **Verify both modes** - 20 minutes - CRITICAL

**Total Critical Path**: 1 hour

**Parallel Opportunities**:
- The two help blocks can be edited while the verification baseline runs.
- `spec.md` wording and the help text can be reviewed in the same pass, since both name the flag.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/baseline-default.txt` holds 16 lines | Phase 1 |
| M2 | Flag parsed | `--quiet` and `-q` both exit 0 | Phase 2 |
| M3 | One-line output | `wc -l` on the quiet run prints 1 | Phase 2 |
| M4 | Release ready | Both diffs empty and `bash -n` exits 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--json` takes precedence over `--quiet`

**Status**: Proposed

**Context**: The script has one output switch today, `--json`. A quiet mode adds a second one that also decides what stdout holds. Passing both asks for a text line and a JSON document at once, and the script has to pick one.

**Decision**: `--json` wins. When both flags are present the script prints the JSON document and adds no text line. The quiet branch sits inside `output_text()`, which `--json` never reaches, so the precedence falls out of the existing structure and needs no new code.

**Consequences**:
- A caller that wants a single text line never passes `--json`, and a caller that passes `--json` gets a single machine-readable document either way.
- `--quiet --json` silently drops the quiet request. Mitigation: the help text and REQ-009 state the precedence, and a caller who needs both reads one JSON field instead.

**Alternatives Rejected**:
- Error out when both flags are passed: adds an error path and a new exit code for a combination that already has a sensible answer.
- Let `--quiet` win and print the text line: a caller that asked for JSON would get text, which is the more surprising of the two outcomes.
