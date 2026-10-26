---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds a boolean quiet mode to the SpecKit level scorer: one parser arm, one global, one mutual-exclusion check, one output function and one dispatch branch, with the default report left untouched."
trigger_phrases:
  - "recommend level quiet flag plan"
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
| **Language/Stack** | Bash 3.2+ (the macOS system bash the script already targets) |
| **Framework** | None - single-file CLI script with no imports |
| **Storage** | None |
| **Testing** | Manual flag matrix capturing stdout, stderr and exit codes, plus a `bash -n` syntax gate |

### Overview
The change threads one new boolean through the existing shape of the script. A `QUIET_OUTPUT` global joins the other output globals, a `--quiet` case arm sets it, a post-parse check rejects it alongside `--json`, and the output dispatcher at the end of the script gains a third branch that calls a new `output_quiet()` function. Scoring, validation and exit codes stay exactly where they are, so the only new behaviour is what reaches stdout when the flag is present.
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
- [ ] Default-mode output verified unchanged against the captured baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file bash CLI: a flat `while`/`case` argument loop, pure scoring helpers that echo their result, and one output dispatcher at the end of the file.

### Key Components
- **Argument parser** (`§5` of the script): a `case` block that maps each flag to a global. It gains a `--quiet` arm that sets `QUIET_OUTPUT=true` and consumes no value.
- **`output_quiet()`** (`§4` of the script): a new function that prints one line and returns, mirroring how `output_text()` and `output_json()` each own their whole shape.
- **Output dispatcher** (`§7` of the script): the trailing `if` that currently chooses between `output_json` and `output_text`. It gains the quiet branch, which is checked first so the flag wins over the default text path.
- **`show_help()`**: the heredoc that documents every option; it gains one OPTIONS row and one EXAMPLE.

### Data Flow
Command-line arguments populate globals, the scoring helpers turn those globals into `SCORE_*` values, `determine_level` maps the total to `RECOMMENDED_LEVEL` and `LEVEL_NAME`, and the dispatcher projects that state into stdout. Quiet mode changes only the projection step: it reads the same two variables the text report reads and prints nothing else.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet adds a flag rather than repairing a reported finding, so the fix-specific inventories reduce to a producer and consumer sweep of the script's output paths and its callers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` | Prints the full human report | unchanged | T009 diff against the T002 baseline |
| `output_json()` | Prints the JSON document | unchanged | T009 diff against the T002 baseline |
| `output_quiet()` | Does not exist; becomes the single-line producer | add | T010 asserts one line and exit 0 |
| `show_help()` | Documents every option | update | T008 plus a grep of the `--help` output |
| `speckit-plan.yaml`, `speckit-complete.yaml` | Invoke the script with `--json` | unchanged | `rg -n 'recommend-level\.sh' .skilled/commands/speckit/assets` |

Required inventories:
- Same-class producers: `rg -n 'output_' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` lists the two existing output functions and the dispatcher that calls them.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled/commands/speckit/assets` finds the two command assets that pass `--json`; neither reads text stdout, so neither is affected.
- Matrix axes: output mode (text, quiet, json) × phase recommendation (default, `--no-recommend-phases`) × input validity (valid, missing input, mutually exclusive flags), plus `--help` and a repeated `--quiet`.
- Algorithm invariant: quiet mode is a projection of the same computed state, so for identical inputs `RECOMMENDED_LEVEL` and `LEVEL_NAME` must be equal in quiet and text mode; the flag may not change any score.
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
| Unit | `output_quiet()` prints exactly one line and reads the same globals as the text report | Direct invocation through the script's public flags |
| Integration | The full flag matrix: text, quiet, json, no-phases, help, missing input, quiet with json, repeated quiet | Captured stdout, stderr and exit codes compared against the T002 baseline |
| Manual | An interactive run of each mode to confirm the report still reads correctly | Terminal |

The script has no dedicated automated test file today, so verification is a captured matrix in `scratch/` plus a `bash -n` syntax gate. If a regression suite for the script lands later, the T010 and T011 assertions move into it unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2+ | Internal (platform) | Green | None - the script already requires it and the change uses no newer construct |
| `rg` for the inventory greps | Internal (developer tooling) | Green | The inventory can be re-run with `grep -rn` if `rg` is unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default-mode output differs from the captured baseline, or quiet mode cannot be shown to print exactly one line.
- **Procedure**: Restore the single modified file from version control (`git checkout -- <path>` or `git revert <commit>`). No data, configuration or generated artifact is involved, so the revert is complete once the file is restored.
<!-- /ANCHOR:rollback -->


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
| Setup | Low | 15 minutes to read the script and capture the baseline |
| Core Implementation | Low | 30 to 45 minutes for the parser arm, function and dispatch branch |
| Verification | Low | 30 minutes for the matrix and the diff |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output captured and stored in `scratch/` before the edit
- [ ] Working tree clean apart from the script so the revert is unambiguous
- [ ] No monitoring applies: the script is invoked on demand, not as a service

### Rollback Procedure
1. Restore the script from version control.
2. Re-run the T002 baseline commands and confirm they match the captures.
3. Confirm `--quiet` is rejected as an unknown option again, which proves the old parser is back.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable - the change touches no stored data.
<!-- /ANCHOR:enhanced-rollback -->


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
| Baseline capture (T002) | None | Captured stdout, stderr and exit codes | T009 |
| `QUIET_OUTPUT` global (T003) | None | A boolean the parser and dispatcher share | T004, T007 |
| Parser arm (T004) | The global | `QUIET_OUTPUT=true` on flag presence | T005, T007 |
| Mutual-exclusion check (T005) | The parser arm | Exit 1 for quiet plus json | T011 |
| `output_quiet()` (T006) | The computed level globals | The single output line | T007 |
| Dispatch branch (T007) | The global, the function | Correct output shape per mode | T010 |
| Help entry (T008) | None | Documented option | T012 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T002 baseline capture** - 15 minutes - CRITICAL
2. **T003 through T007 implementation** - 45 minutes - CRITICAL
3. **T009 and T010 verification** - 30 minutes - CRITICAL

**Total Critical Path**: About 1.5 hours

**Parallel Opportunities**:
- T008 (help text) can run alongside T003 through T007 because it touches only the heredoc.
- T012 (`bash -n`) can run as soon as the parser arm exists, before the output branch is finished.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | T002 captures exist for every mode in the matrix | End of Setup |
| M2 | Flag implemented | `--quiet` prints one line; default output unchanged | End of Core |
| M3 | Verified | T009 through T012 pass and every acceptance criterion is met | End of Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the report's wording and reject the flag combination

**Status**: Accepted

**Context**: The script already has two output shapes, and a third could either invent a new machine format or reuse the wording the human report already prints. Separately, callers could pass `--quiet` together with `--json`, which would otherwise need a precedence rule that no caller has asked for.

**Decision**: Quiet mode prints exactly the text report's recommendation line, `Recommended Level: <level> (<name>)`, with no leading blank line and no other output. `--quiet` and `--json` are mutually exclusive: the combination exits 1 with a diagnostic on stderr and an empty stdout.

**Consequences**:
- Callers get a stable line that already matches the wording they read in the report, so there is one vocabulary for the verdict rather than two.
- The line is prose-shaped, so a caller that wants a bare number still slices it or uses `--json`. A machine-native quiet format would be a separate decision.
- A mixed invocation fails loudly instead of silently choosing a winner, which keeps one machine shape per run.

**Alternatives Rejected**:
- A new bare-number format (`--quiet` printing only `2`): rejected because it adds a second vocabulary for the same value and no caller asked for it.
- Letting `--json` win when both flags are present: rejected because a silent precedence rule hides a caller mistake.
- A `-q` alias: rejected as scope growth with no current consumer.

---

