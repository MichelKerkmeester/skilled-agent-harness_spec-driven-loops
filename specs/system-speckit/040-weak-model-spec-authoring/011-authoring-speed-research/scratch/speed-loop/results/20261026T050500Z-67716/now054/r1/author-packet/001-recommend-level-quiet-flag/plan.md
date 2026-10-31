---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "One additive branch in one bash script: a QUIET_OUTPUT global, a --quiet parser arm, a quiet output dispatch, and help text. Proof is a byte-diff against captured baselines plus a line count."
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
| **Language/Stack** | Bash 3.2+ (the macOS default), running under `set -euo pipefail` |
| **Framework** | None; one POSIX shell script |
| **Storage** | None |
| **Testing** | `bash -n`, `shellcheck`, and byte-comparison of captured stdout |

### Overview

Change one file, `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Add a `QUIET_OUTPUT` global beside `JSON_OUTPUT`, one `case` arm that sets it, and one branch in the output dispatch that prints the existing recommended-level line and returns. Prove it by diffing the default output against baselines captured before the change, and by counting the quiet output's lines.
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
- [ ] `bash -n` and `shellcheck` pass on the script
- [ ] Default, full-risk and `--json` outputs diff clean against their baselines
- [ ] `--quiet` output is exactly one line
- [ ] Docs updated (spec/plan/tasks)

### Pre-Task Checklist

Run this before the first edit in Phase 2.

- [ ] `git status` shows no unrelated modification to `recommend-level.sh`, so a baseline diff cannot pick up someone else's change
- [ ] The three baseline files exist under `scratch/` and are non-empty
- [ ] `rg -n -- '--quiet' recommend-level.sh` prints nothing, proving the flag is genuinely new

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run tasks in `tasks.md` order; the implementation tasks depend on the captured baselines |
| TASK-SCOPE | Edit only `recommend-level.sh`; no other file in this packet's file list |
| TASK-VERIFY | Do not tick a task until its `Verify:` command printed the expected output |
| TASK-ADDITIVE | Add branches and arms; never rewrite the existing `output_text()` or `output_json()` bodies |

### Status Reporting Format

Report each task as `T### <state> — <verify output>`, where state is `done`, `blocked` or `skipped`. A `blocked` report names the failing command and quotes its output.

### Blocked Task Protocol

Mark the task `[B]` in `tasks.md`, write the failing command and its output beside it, and stop. Do not edit around a blocked task: the byte-identity diff and the quiet line count both depend on the captured baselines, so a blocked baseline invalidates every later tick.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-script branch. A presentation-only change inside one POSIX shell script, placed after every computation and before every writer.

### Key Components

- **Argument parser (`while ... case`)**: gains one arm, `--quiet`, that sets `QUIET_OUTPUT=true` and shifts
- **Globals block**: gains `QUIET_OUTPUT=false` beside `JSON_OUTPUT=false`
- **Output dispatch (§7)**: gains a quiet branch ahead of the `JSON_OUTPUT` test, so precedence is explicit rather than argument-order dependent
- **`show_help()` and the file-header OPTIONS block**: gain one documented line each

### Data Flow

Arguments are parsed into globals, the four score functions compute into `SCORE_*`, `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`, `calculate_confidence` sets `CONFIDENCE`, and `determine_phasing` sets the phase fields. The dispatch at §7 then chooses one writer. `--quiet` adds a fourth writer and touches nothing before it, so the computed values cannot differ between a quiet run and a full run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

stdout is a public response surface here: one workflow reads it and several documents describe it. The inventory below records each surface and whether this change reaches it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text()` | Owns the full text report | unchanged; the quiet branch reads the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` fields | `diff` against `scratch/simple.baseline` is silent |
| `recommend-level.sh` argument parser | Owns which options are accepted | update; one new `case` arm | `bash recommend-level.sh --quiet --loc 50 --files 2` exits 0 |
| `recommend-level.sh` output dispatch | Owns which writer runs | update; the quiet branch precedes the JSON test | `--quiet --json` prints the level line, not JSON |
| `recommend-level.sh` `show_help()` and header OPTIONS block | Describe the option surface | update; list `--quiet` | `bash recommend-level.sh --help` prints one `--quiet` line |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Consumer: invokes `--json` for phase decomposition | not a consumer of `--quiet`; its `--json` path must stay byte-identical | `diff` against `scratch/json.baseline` is silent |
| `README.md` and the skill `SKILL.md` references | Name the script, never its flags | not a consumer; neither enumerates options | `rg -n -- '--quiet' README.md .skilled/skills/system-spec-kit/SKILL.md` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES|QUIET_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — the output-mode globals; `--quiet` joins them and is reset nowhere else.
- Consumers of changed symbols: `rg -n 'recommend-level.sh' . --glob '*.yaml' --glob '*.yml' --glob '*.md'` — one command consumer (`speckit-plan.yaml`) plus documentation mentions that name the script without listing flags.
- Matrix axes: input shape (`--loc` and `--files` alone; the full-risk flag set) crossed with output mode (default text, `--json`, `--quiet`, `--quiet --json`). Four modes over two shapes is the required row set; the error paths are covered separately as edge cases.
- Algorithm invariant: this is not a path, redaction, resolver or security fix. The invariant it must preserve is that the level printed by `--quiet` equals the level printed in the full report for the same arguments, which T012 asserts directly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the three baselines, Implementation adds the flag, the branch and the documentation, and Verification diffs every output mode against its baseline and counts the quiet lines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | No unit harness exists for `recommend-level.sh`; its shell functions are reachable only through the CLI, so the CLI is the unit boundary | `bash -n`, `shellcheck -S warning` |
| Integration | Four output modes (default text, `--json`, `--quiet`, `--quiet --json`) over two input shapes (simple, full-risk), each diffed against a captured baseline | `diff`, `wc -l`, process substitution |
| Manual | `--help` lists the flag, and a quiet run reads as a single line in a terminal | Terminal |

The baselines are captured in Phase 1, before any edit, because a baseline captured afterwards proves nothing about the default output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2+ | Internal, already required by the script | Green | The script cannot run at all; nothing new is needed |
| `shellcheck` | Internal, development only | Green | The style gate falls back to `bash -n`, with no behaviour impact |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Internal consumer of `--json` | Green | If the `--json` contract moved, phase decomposition would misread the recommendation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any captured shape fails its byte-identity diff, or `--quiet` prints more than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`. The change is additive, so there is no data, schema or consumer migration to unwind, and the baselines under `scratch/` are throwaway files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verification |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **~45 minutes (assumption, not a commitment)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Phase 1    │──►│   Phase 2    │──►│   Phase 3    │
│  Baselines   │   │ Flag+branch  │   │    Diffs     │
└──────────────┘   └──────┬───────┘   └──────────────┘
                          │
                 ┌────────▼────────┐
                 │  Help + OPTIONS │
                 │    (parallel)   │
                 └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Three captured stdout files | Every diff task |
| `--quiet` parser arm | Baseline capture | The flag is accepted | The output branch |
| Quiet output branch | `--quiet` parser arm | One-line stdout | The quiet line count |
| Help and OPTIONS text | `--quiet` parser arm | A documented flag | Nothing |
| Diff and line-count run | Quiet output branch, Baseline capture | Verification evidence | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 10 minutes - CRITICAL
2. **Parser arm and quiet output branch** - 20 minutes - CRITICAL
3. **Byte-identity diff and line count** - 15 minutes - CRITICAL

**Total Critical Path**: ~45 minutes (assumption)

**Parallel Opportunities**:
- The help and OPTIONS text can be written while the output branch is under test
- The `--json` diff can run as soon as its baseline is captured, before the quiet branch exists
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | `ls scratch/*.baseline` lists three non-empty files | Phase 1 |
| M2 | Flag accepted and branch live | `bash recommend-level.sh --quiet --loc 50 --files 2` exits 0 and prints one line | Phase 2 |
| M3 | Contract proven | Every baseline diff is silent and the quiet line count is 1 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the existing recommended-level line verbatim

**Status**: Accepted

**Context**: A quiet mode can invent a compact format, for example a bare number, or reuse the line the full report already writes. A new format is shorter but creates a second thing for callers to parse, and the two formats can drift apart.

**Decision**: `--quiet` prints the exact `Recommended Level: <N> (<Name>)` line that `output_text()` already writes, with no reformatting.

**Consequences**:
- Positive: a caller that already greps the full report keeps the same pattern, and the quiet and full modes cannot disagree on wording
- Negative: the line is not the most compact form; mitigated because it splits trivially with `cut` or shell parameter expansion

**Alternatives Rejected**:
- Print only the number: shortest, but adds a second output format to keep in sync and discards the level name
- Tell callers to parse `--json`: forces a JSON dependency on callers that want one value

---

### ADR-002: `--quiet` takes precedence over `--json`

**Status**: Accepted

**Context**: `--quiet` and `--json` can both be passed, and the script has no rule for two output modes at once. Leaving it undefined makes the result depend on argument order, because the parser records flags rather than resolving them.

**Decision**: The quiet branch is tested before the `JSON_OUTPUT` test in the output dispatch, so `--quiet --json` prints the single recommended-level line. `--json` on its own is unchanged.

**Consequences**:
- Positive: one deterministic rule, and the flag's stated contract holds for every combination
- Negative: a caller that passes both by mistake loses the JSON object; mitigated because no current caller passes `--quiet` at all

**Alternatives Rejected**:
- Let `--json` win: keeps the JSON shape but silently breaks the flag's contract
- Reject the combination with an error: adds a new failure mode and an exit path no caller asked for

---
