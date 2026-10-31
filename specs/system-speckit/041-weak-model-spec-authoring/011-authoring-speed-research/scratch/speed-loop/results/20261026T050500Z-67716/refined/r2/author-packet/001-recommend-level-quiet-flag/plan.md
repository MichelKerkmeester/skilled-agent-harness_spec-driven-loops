---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one output branch, one parser case and one conflict check to a single bash script; prove it with a line count and a byte comparison."
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
| **Language/Stack** | Bash 3.2-compatible shell; the script already sets `set -euo pipefail` |
| **Framework** | None — a single CLI script |
| **Storage** | None — the script is stateless |
| **Testing** | `bash -n` for syntax plus shell assertions with `wc -l`, `diff` and `grep` |

### Overview
Change one file, `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Add a `QUIET` global, a `--quiet` case in the existing parser, a conflict check against `--json`, and an early branch in `output_text()` that prints the level line and returns. Prove it by counting lines in both modes and by diffing the quiet line against the default report's level line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `sed -n '656,719p' recommend-level.sh` shows the parser block this change extends
- [ ] `recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints 17
- [ ] `bash -n recommend-level.sh` exits 0 before the first edit

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `bash -n recommend-level.sh` exits 0 after the last edit
- [ ] The quiet run prints 1 line and the default run prints 17
- [ ] `diff` of the default report against the pre-change baseline prints nothing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script output branch.

### Key Components
- **Argument parser** (`while [[ $# -gt 0 ]]` with `case "$1"`): turns argv into globals, one case per flag.
- **`output_text()`**: writes the human report and owns the `Recommended Level:` line.
- **`output_json()`**: writes the machine document; unchanged by this feature.
- **`show_help()`**: renders the option list the flag must join.

### Data Flow
argv reaches the parser, which sets `LOC`, `FILES`, the four risk booleans, `JSON_OUTPUT` and the new `QUIET`. The score helpers turn those into `TOTAL_SCORE`, then `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`. The output dispatch at the end of the script chooses `output_json` when `JSON_OUTPUT` is true, otherwise `output_text`, which prints the level line alone when `QUIET` is true and the full report otherwise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` | Producer: owns the level line and the whole report | update | `grep -n 'Recommended Level' recommend-level.sh` prints one line |
| Callers in skill workflows and docs | Consumers of stdout text; none parses the report programmatically | unchanged | `grep -rn 'recommend-level' .skilled/skills --include='*.sh'` returns the script itself only |
| `--json` consumers | Read the JSON document, which `--quiet` never touches | not a consumer | `--json` output diffed before and after the change |
| Script tests | No test file covers this script today | not a consumer | `ls runtime/cli/tests` lists no filename containing `recommend` |

Required inventories:
- Same-class producers: `grep -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints one line, so the label has a single producer.
- Consumers of changed symbols: `grep -rn 'recommend-level' .skilled/skills --include='*.sh'` finds no second script that calls it.
- Matrix axes: output mode (text, quiet, json) × input validity (valid, missing required inputs, unknown option, conflicting mode).
- Algorithm invariant: not applicable — this change adds no path, parser, redaction or resolver logic.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parser acceptance for `--quiet`, the `--json` conflict and the unknown-option path | bash invocations, `$?`, stderr capture |
| Integration | The text-output branch through `output_text()` | `wc -l` and `diff` against the pre-change baseline |
| Regression | Default report and JSON document for the reference invocation | `diff` of pre-change and post-change output |
| Manual | `--help` renders the new option in the same column format | `grep -c -- '--quiet'` on the help output |

The two assertions that decide the feature are a line count and a byte comparison: `--quiet` must print `1` line, and that line must equal the default report's `Recommended Level:` line byte for byte.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2+ | Internal | Green | The script cannot run; every verification step stops |
| coreutils (`wc`, `diff`, `grep`) | Internal | Green | Verification assertions cannot be expressed; implementation still possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes, the level line moves, or the quiet run prints anything other than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`. The flag is additive and the script holds no state, so no data or configuration needs unwinding.
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
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **45 minutes (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — no data changes, so none needed
- [ ] Feature flag configured — not applicable; the new flag is opt-in by invocation
- [ ] Monitoring alerts set — not applicable; no service is deployed

### Rollback Procedure
1. Revert the commit that modifies `recommend-level.sh`.
2. Run `bash -n` on the restored file.
3. Re-run the reference invocation and confirm 17 lines and exit 0.
4. Notify callers only if the flag had already been announced.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the script writes no file and holds no state.
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
| Baseline capture | None | Pre-change report and JSON fixtures | Implementation, Verification |
| Parser and output branch | Baseline capture | One-line quiet mode | Verification |
| Verification | Parser and output branch | Line-count and byte-equality evidence | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the pre-change baseline** - 10 minutes - CRITICAL
2. **Add the parser case, conflict check and output branch** - 20 minutes - CRITICAL
3. **Run the line-count and byte-equality checks** - 15 minutes - CRITICAL

**Total Critical Path**: 45 minutes

**Parallel Opportunities**:
- Header and help text edits can land alongside the parser case once the wording is fixed.
- The JSON regression check can run while the text-mode checks run, because neither writes a file.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | The reference invocation prints 17 lines and exits 0 | Phase 1 |
| M2 | Quiet mode works | The quiet run prints 1 line and `diff` of the level lines is empty | Phase 2 |
| M3 | Nothing else moved | Default report and JSON document diff clean against the baseline, `bash -n` exits 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Gate the level line inside `output_text` instead of adding a second output function

**Status**: Proposed

**Context**: The script has one text renderer, `output_text()`, which writes 17 lines including the level line. Quiet mode needs one of those lines and none of the others.

**Decision**: Add a `QUIET` global set by the parser, then branch inside `output_text()` so it prints the level line and returns before the score, breakdown and phase blocks. Both modes read the same `echo`, so the line has one definition.

**Consequences**:
- The quiet line cannot drift from the report's level line, because both come from the same statement.
- The function gains one early branch, and the phase block still computes in quiet mode; that arithmetic is wasted and is accepted so output and computation stay separate concerns.

**Alternatives Rejected**:
- A separate `output_quiet()` function: duplicates the label string, so the two copies can drift.
- Having callers pipe the report through `grep`: costs a second process, hides the script's own answer, and breaks on a label change just the same.

### ADR-002: Reject `--quiet --json` with exit 1 instead of letting one flag win

**Status**: Proposed

**Context**: `--json` already emits a single machine document, and `--quiet` emits a single text line. A caller that passes both has asked for two different outputs.

**Decision**: The parser records both booleans, and a check immediately after the parse loop writes an error naming both flags to stderr and exits 1.

**Consequences**:
- A contradictory invocation fails loudly instead of returning a shape the caller did not ask for.
- Callers must choose one mode, and the help text states the exclusion so the failure is predictable.

**Alternatives Rejected**:
- JSON wins silently: the caller receives a document while believing it asked for a line, so the mistake surfaces far from its cause.
- Quiet wins: a JSON consumer that adds the flag loses its document without a diagnostic.

---
