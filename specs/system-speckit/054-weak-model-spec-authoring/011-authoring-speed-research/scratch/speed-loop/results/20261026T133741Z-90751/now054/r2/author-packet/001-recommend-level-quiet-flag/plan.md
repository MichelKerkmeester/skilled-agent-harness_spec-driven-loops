---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "One bash script gains a --quiet boolean, one output branch and one shared level-line emitter, with the default report proven byte-identical against a captured baseline."
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
| **Language/Stack** | Bash 3.2+ |
| **Framework** | None - a single shell script |
| **Storage** | None |
| **Testing** | Scratch bash harness (`scratch/test-quiet-flag.sh`) using `wc -l`, `diff` and exit-status checks |

### Overview
The change adds a `QUIET` global, one `--quiet` case in the existing option loop, one shared `print_level_line()` emitter that both output paths call, and one branch in the output dispatch that runs after the JSON check. The default report is proven unchanged by diffing it against a baseline captured before the first edit, and the quiet form is proven by a line count and a byte comparison against the report's own level line.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script branch

### Key Components
- **`recommend-level.sh` option parser**: the existing `while [[ $# -gt 0 ]]` loop; gains one `--quiet` case that sets `QUIET=true`.
- **`print_level_line()`**: new one-line emitter, the only place that formats `Recommended Level: <N> (<Name>)`.
- **`output_text()`**: the default 16-line report; calls `print_level_line()` for its first content line.
- **Output dispatch**: the `if [[ "$JSON_OUTPUT" = true ]]` block; gains a `QUIET` branch between the JSON and text branches.
- **`show_help()`**: the OPTIONS block that documents every flag.

### Data Flow
Arguments are parsed into globals (`LOC`, `FILES`, risk flags, `JSON_OUTPUT`, `QUIET`), scoring runs unchanged, and the dispatch chooses one of three paths: `--json` renders the JSON object, `--quiet` renders the single level line, and the default renders the full report. Both human paths obtain the level line from the same emitter, so the two cannot disagree.

<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures baselines, Implementation adds the flag and the emitter, and Verification proves the line counts, byte equality and unchanged exit codes.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `print_level_line()` output for fixed inputs, exercised through the CLI | `diff`, `wc -l` inside the scratch harness |
| Integration | Default, quiet, JSON, quiet+JSON and the three error paths | `bash scratch/test-quiet-flag.sh` |
| Manual | `--help` OPTIONS block and a side-by-side read of both output forms | Terminal |

The harness prints one `PASS n/m` line and exits non-zero on the first failed assertion, so a partial run is never reported as a pass.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The script cannot run; the change ships only where the script already runs |
| `diff`, `wc`, `jq` | Internal | Green | Baseline and JSON assertions cannot run; `jq` is used only by the harness |
| No new package | - | Green | - |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report differs from the captured baseline on any invocation, or `--quiet` prints more than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`, then rerun the baseline diff and `bash -n` to confirm the pre-change state.

<!-- /ANCHOR:rollback -->

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
| **Total** | | **45 minutes (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`.
2. Rerun `bash -n` on the script and the baseline diff.
3. Confirm the default report matches the captured baseline.
4. Notify callers only if the reverted commit had already been published.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the script stores nothing.
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
                    ┌──────▼──────┐
                    │   Harness   │
                    │ (parallel)  │
                    └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline-default.txt`, `scratch/baseline-json.txt` | Emitter edit, verification |
| Option parser change | Baseline capture | `QUIET` global | Output dispatch |
| Emitter + dispatch | Option parser change | One-line quiet output | Harness run |
| Scratch harness | Baseline capture | Pass/fail evidence | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline** - 10 minutes - CRITICAL
2. **Add the flag, emitter and dispatch branch** - 20 minutes - CRITICAL
3. **Run the harness and the baseline diff** - 15 minutes - CRITICAL

**Total Critical Path**: 45 minutes

**Parallel Opportunities**:
- The `--help` line and the scratch harness can be written while the dispatch branch is being tested.
- The JSON precedence assertion and the error-path assertion run independently once the branch exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `wc -l < scratch/baseline-default.txt` prints `16` | Setup |
| M2 | Flag implemented | `bash recommend-level.sh --loc 500 --files 15 --quiet \| wc -l` prints `1` | Core |
| M3 | Verified | `bash scratch/test-quiet-flag.sh` prints `PASS 6/6` and the baseline diff is empty | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One shared emitter for the level line

**Status**: Proposed

**Context**: The quiet form and the default report both print the same `Recommended Level: <N> (<Name>)` line. Two format strings would drift the moment either is edited, and the drift would be silent because both forms stay syntactically valid.

**Decision**: Add `print_level_line()` as the only place that formats the line. `output_text()` calls it for its first content line, and the quiet branch calls it directly.

**Consequences**:
- The quiet line and the report line cannot diverge; one test compares them byte for byte.
- The script gains one function and one call site, about eight lines in total.

**Alternatives Rejected**:
- Duplicating the `echo` in the quiet branch: rejected because two format strings are exactly the drift this packet exists to remove.
- Filtering the full report with `sed`/`grep` inside the script: rejected because it would parse output the script already has in variables and would break if the report changes.

### ADR-002: `--json` takes precedence over `--quiet`

**Status**: Proposed

**Context**: A caller can pass both flags. `--json` already emits one machine-readable payload; `--quiet` asks for one human line. Silently choosing either without documenting it leaves the caller guessing.

**Decision**: When both flags are present, the JSON object is printed unchanged and `--quiet` has no effect. The precedence is stated in the `--help` OPTIONS block.

**Consequences**:
- Existing JSON consumers keep their exact output even if a wrapper adds `--quiet`.
- A caller who wants the text line must not pass `--json`; the help text says so.

**Alternatives Rejected**:
- Erroring on the combination: rejected because it turns a harmless wrapper into a failure and adds a new error path to test.
- Emitting a bare JSON scalar under `--quiet --json`: rejected because it would be a third output format that no caller asked for.

---
