---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one boolean global, one argument-loop arm, one output function and one dispatch branch to recommend-level.sh, leaving the default text and JSON paths untouched so a captured baseline can prove no regression."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "quiet output branch recommend-level"
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
| **Language/Stack** | Bash 3.2+ (the script uses `[[ ]]`, `local` and arrays) |
| **Framework** | None - a single standalone script |
| **Storage** | None |
| **Testing** | `bash -n`, `shellcheck`, direct invocations with `wc -l`, `diff` and `jq` |

### Overview
The change adds one boolean global, one `case` arm in the argument loop, one output function and one dispatch branch in `recommend-level.sh`. The quiet function prints the same `Recommended Level:` literal `output_text` prints, so the label has one producer. The default text path and the JSON path are not edited, and a baseline captured before the edit proves it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Caller inventory completed (`speckit-plan.yaml:86`, `speckit-complete.yaml:147`)
- [x] Output contract pinned to the label the script already prints

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash -n` and `shellcheck` exit 0
- [ ] Default output diffs clean against the captured baseline
- [ ] `--help` lists `--quiet`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script with a single output-dispatch branch.

### Key Components
- **Argument parser** (`recommend-level.sh`, section 5): reads flags into globals; gains a `--quiet` arm that sets `QUIET_OUTPUT`.
- **Scoring functions** (`recommend-level.sh`, section 3): unchanged.
- **Output functions** (`recommend-level.sh`, section 4): `output_text`, `output_json`, and the new `output_quiet`, which prints the same level literal as `output_text`.
- **Dispatch** (`recommend-level.sh`, section 7): JSON first, quiet second, text last.

### Data Flow
`argv -> parser -> LOC/FILES/risk flags -> scoring -> determine_level -> dispatch (json | quiet | text) -> stdout`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature addition rather than a fix, but the change touches a stdout contract that other skills call, so the surfaces are inventoried here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Owns argument parsing and all three output modes | Update: add the flag, the quiet function and one dispatch branch | `grep -n 'quiet' recommend-level.sh`; AC-001, AC-002 |
| `.skilled/commands/speckit/assets/speckit-plan.yaml:86` | Calls the script with `--json` and reads the document | Not a consumer of `--quiet`; keeps `--json` | `grep -n 'recommend-level.sh' speckit-plan.yaml` still shows `--json`; AC-007 |
| `.skilled/commands/speckit/assets/speckit-complete.yaml:147` | Calls the script with `--json` and reads the document | Not a consumer; unchanged | `grep -n 'recommend-level.sh' speckit-complete.yaml` still shows `--json`; AC-007 |
| `.skilled/commands/speckit/assets/speckit-implement.yaml:247` | Mentions the script in guidance only | Not a consumer; unchanged | `grep -n 'recommend-level.sh' speckit-implement.yaml` shows a note, not an invocation |
| `.skilled/skills/system-spec-kit/SKILL.md`, `README.md`, `runtime/cli/spec/README.md` | Describe the script and its role | Unchanged; the flag is documented in `--help` and the script header | `grep -n 'recommend-level.sh'` still resolves in all three |
| `manual-testing-playbook/`, `feature-catalog/` docs | Describe lifecycle automation | Not a consumer | `grep -rn 'recommend-level.sh'` shows prose only |

Required inventories:
- Same-class producers: `grep -n 'Recommended Level:' recommend-level.sh` names every producer of the label, and the quiet branch reuses that literal rather than writing a second one.
- Consumers of changed symbols: `grep -rn -- '--quiet' .skilled/commands .skilled/skills` returns no invocation of this script before the change (T003).
- Matrix axes: output mode (default, quiet, json, json+quiet) crossed with input shape (valid, missing required input, non-numeric) is 12 rows; T010-T013 cover the valid, json+quiet and invalid rows that can change.
- Algorithm invariant: the quiet line is byte-identical to the first `Recommended Level:` line of the default report for the same inputs, and the default report is unchanged.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step 1: Add the flag and its global

Acceptance: `--quiet` is accepted and sets the output mode without touching scoring.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 50 --files 2` exits 0.

### Step 2: Add the quiet output function and dispatch

Acceptance: a quiet run prints one line and a default run still prints the full report.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 50 --files 2 | wc -l` prints 1.

### Step 3: Document the flag

Acceptance: `--help` and the header OPTIONS block list `--quiet` with its `--json` precedence.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help | grep -c -- '--quiet'` prints 1.

### Step 4: Prove the default path is unchanged

Acceptance: three representative invocations diff clean against the baseline.
Verify: `diff -r specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/after` prints nothing.
<!-- /ANCHOR:phases -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the argument loop, `output_text`, `output_json` and the output dispatch in `recommend-level.sh` before editing.
- [ ] Confirm `scratch/baseline/` holds the three pre-change outputs (T001).
- [ ] Confirm no caller passes `--quiet` today (T003).

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run tasks in T### order; T001-T004 finish before any edit to the script. |
| TASK-SCOPE | Touch `recommend-level.sh` and this packet only. Do not change scoring, thresholds, phase logic or the `--json` payload. |
| TASK-EVIDENCE | Mark a task `[x]` only after its `Verify:` command printed the stated output. |

### Status Reporting Format
After each task: `Task T### complete. Files modified: <list>. Verify: <command> printed <output>.`

### Blocked Task Protocol
If a task cannot complete, stop, mark it `[B]`, write the blocker and the failing command in the task line, and report it to the operator. Do not edit around the blocker.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shell assertion | Flag parsing and the three output modes | `bash`, `wc -l` |
| Regression diff | Default text output against the pre-change baseline | `diff -r` |
| Contract check | The `--json` document still parses when `--quiet` is present | `jq -e` |
| Static check | Syntax and lint | `bash -n`, `shellcheck` |
| Packet validation | This spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2+ | Internal | Green | The script cannot run |
| coreutils (`wc`, `diff`) | Internal | Green | Verification cannot run |
| `shellcheck` | External (developer tool) | Green | Fall back to `bash -n` and record the skip |
| `jq` | External (developer tool) | Green | Use `node -e 'JSON.parse(...)'` instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default text output or the JSON document changes for any existing invocation.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`, then rerun T010 and T011; both diffs must be empty again.
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
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **~45 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (N/A: the change writes no data)
- [x] Feature flag configured (N/A: `--quiet` is opt-in per invocation)
- [x] Monitoring alerts set (N/A: no service is deployed)

### Rollback Procedure
1. Stop: capture the failing invocation and its output.
2. Revert the single commit that touches `recommend-level.sh`.
3. Verify: rerun T010 and T011; both diffs are empty.
4. Notify: record the revert in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - the change writes no data.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline/*` | Implementation |
| `QUIET_OUTPUT` global | Baseline capture | Flag state | Parser |
| Parser arm | Global | `QUIET_OUTPUT=true` | Dispatch |
| `output_quiet` | `determine_level` | One-line output | Dispatch |
| Dispatch | All three output functions | stdout | Verification |
| Verification | Dispatch, baseline | AC evidence | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 5 minutes - CRITICAL
2. **Parser arm and output function** - 20 minutes - CRITICAL
3. **Verification diffs** - 15 minutes - CRITICAL

**Total Critical Path**: ~40 minutes

**Parallel Opportunities**:
- Help-text edits and packet doc updates can run alongside the implementation
- `bash -n` and `shellcheck` can run before the regression diff
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Three baseline files exist under `scratch/baseline/` | Phase 1 |
| M2 | Flag works | `--quiet` prints one line and `--json` still parses | Phase 2 |
| M3 | Verified | Baseline diff is empty and `bash -n` plus `shellcheck` exit 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: A boolean `--quiet` flag instead of a `--format` option

**Status**: Accepted

**Context**: The script has two output modes, a text report and a JSON document. A caller needs the level alone. A format option would generalize both modes into one axis and rewrite two working paths; a boolean flag adds one branch beside them.

**Decision**: Add `--quiet`, a boolean that selects a one-line text output printing the same `Recommended Level:` literal `output_text` prints. When `--quiet` and `--json` are both passed, `--json` wins, so a JSON caller that adds the flag still receives its document.

**Consequences**:
- One new global, one case arm, one output function and one dispatch branch.
- The default text and JSON paths are not edited, so a baseline diff can prove no regression.
- `--quiet --json` prints JSON, which is documented in `--help` rather than rejected with a new error path.

**Alternatives Rejected**:
- `--format=level|text|json`: one caller needs the level alone today, and collapsing three output paths into an enum rewrites the two that already work.
- Telling callers to pipe `| grep '^Recommended Level:'`: works today, but repeats the label in every caller and leaves it undocumented; the flag makes the label one contract in one file.

---
