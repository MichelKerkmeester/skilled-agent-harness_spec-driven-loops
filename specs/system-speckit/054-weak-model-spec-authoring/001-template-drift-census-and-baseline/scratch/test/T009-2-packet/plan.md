---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds one boolean flag to a bash CLI: a --quiet global, one case arm in the argument loop, one branch in output_text(), and two help surfaces. The plan keeps JSON output and the default text path untouched and proves that with a captured baseline diff."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level.sh quiet implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ (macOS default), `set -euo pipefail` |
| **Framework** | None - standalone CLI script under `runtime/cli/spec/` |
| **Storage** | None |
| **Testing** | Manual CLI invocations, regex assertion on quiet output, `diff` against a captured baseline, `python3 -c json.load` for the JSON check |

### Overview
`recommend-level.sh` already computes `RECOMMENDED_LEVEL` and `LEVEL_NAME` before it chooses an
output function, so the feature is a presentation flag rather than a scoring change. The work adds
a `QUIET` global, one `case` arm that sets it, and a branch at the top of `output_text()` that
prints the single level line and returns. The header `OPTIONS:` block and `show_help()` both gain
the same one-line entry, and the default path plus `output_json()` stay byte-identical so existing
callers and the two YAML commands that parse JSON see no change.
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
- [ ] Quiet invocation emits exactly one line for low, medium and high input sets
- [ ] Default text output and JSON output diff empty against the captured baseline
- [ ] `bash -n` passes on the modified script
- [ ] Docs updated (spec/plan/tasks, help text and header options)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI with a parse loop, a compute stage and two mutually exclusive output functions. The
change follows the script's existing shape: a global flag set during parsing, consumed during output.

### Key Components
- **Argument loop (`while [[ $# -gt 0 ]]`)**: gains a `--quiet` arm beside `--json|-j`; sets `QUIET=true` and shifts one token.
- **`QUIET` global (section 2, GLOBALS)**: initialised to `false` next to `JSON_OUTPUT`, so an unset value can never be misread as enabled.
- **`output_text()`**: gains a leading branch that prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` and returns before the blank line and breakdown.
- **`output_json()`**: unchanged, and not consulted by the quiet branch.
- **`show_help()` and the header `OPTIONS:` block**: each gains the `--quiet` line, keeping the two lists in step.

### Data Flow
Arguments enter the parse loop and set `LOC`, `FILES`, the risk booleans, `JSON_OUTPUT` and `QUIET`.
The compute stage derives `TOTAL_SCORE`, then `determine_level()` sets `RECOMMENDED_LEVEL` and
`LEVEL_NAME`, `calculate_confidence()` sets `CONFIDENCE`, and `determine_phasing()` sets the phase
fields. Output selection then checks `JSON_OUTPUT` first and `QUIET` second inside `output_text()`,
so quiet reads state that is already final and cannot print a level the score does not support.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet adds an option rather than remediating a finding, so the addendum is used as a surface
inventory. Its rows still record who produces and who observes the changed behavior.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument loop | Owns flag parsing for all inputs | update - add `--quiet` arm | `rg -n -- '--quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` |
| `output_text()` | Produces every human-readable line, including the leading blank | update - early quiet branch | Quiet run prints one line; `wc -l` equals 1 |
| `output_json()` | Produces the document two command assets parse | unchanged - quiet does not reach it | `--quiet --json` equals `--json` |
| `show_help()` / header `OPTIONS:` | Advertise the accepted option set | update - add one line each | `--help` lists `--quiet`; `rg` finds the header line |
| `.skilled/commands/speckit/assets/speckit-plan.yaml:86` | Consumer - passes `--json` and reads `recommended_level` | unchanged - JSON contract untouched | `--json` baseline diff empty |
| `.skilled/commands/speckit/assets/speckit-complete.yaml:147` | Consumer - same JSON contract | unchanged | `--json` baseline diff empty |
| `README.md` / `SKILL.md` tool tables | Describe the script in one line each, no option list | unchanged - no option inventory to drift | `rg -n 'recommend-level' README.md AGENTS.md` shows no option list |

Required inventories:
- Same-class flag producers: `rg -n -- '--(json\|quiet\|help\|recommend-phases)' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` - one parse arm and one help line per documented flag, so `--quiet` needs both.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' . --glob '!specs/**'` - two JSON callers, one README line, one SKILL.md line, plus playbook prose.
- Matrix axes: input scale (low / medium / high) x output mode (text default / text quiet / JSON / JSON quiet) x argument order (`--quiet` first / last).
- Algorithm invariant: the quiet line reports the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` the default first line reports for the same inputs; no score is recomputed on the quiet path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state.

### Phase 1: Setup
Read the script's parse loop, globals and output functions; capture default-output and JSON baselines
into `scratch/` before touching the file; inventory the callers.

### Phase 2: Implementation
Add the `QUIET` global, the `--quiet` parse arm, the quiet branch in `output_text()`, and the two
documentation surfaces. Leave `output_json()` and the default text path alone.

### Phase 3: Verification
Run the quiet matrix, assert the one-line shape, diff the default and JSON paths against the
baseline, and exercise the stderr error paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (in-process) | Quiet branch and parse arm in one script; no test harness exists for this script | `bash -n`, then three `bash .../recommend-level.sh` invocations with `--quiet` |
| Regression | Default text output and JSON output across three input scales | `diff` against `scratch/baseline-*.txt` captured before the edit |
| Contract | Error paths under `--quiet`: no input, bad `--loc`, unknown option, `--help` | Exit status plus `2>`/`1>` split into separate files to prove stdout stays empty |
| Manual | Read `--help` output once and confirm the option list reads correctly beside its neighbours | Terminal |

Matrix: inputs `--loc 50 --files 2` (low), `--loc 200 --files 5 --api` (medium), `--loc 1000 --files 20 --architectural --api --db` (high) x `{text, --quiet, --json, --quiet --json}`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ (already required by `set -euo pipefail` and arrays in the script) | Internal | Green | Nothing to build |
| `python3` (for the JSON parse assertion only) | Internal | Green | SC-003 falls back to a `diff`-only equality check |
| Two YAML command assets that call `--json` | External to the file | Green | They are the reason REQ-006 exists; they are not edited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default output or JSON output diverges from the captured baseline, or the quiet line reports a level the score contradicts.
- **Procedure**: Revert the single file to its pre-change content; nothing else in the repository was modified, so no dependent artifact needs undoing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verification)
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
| Setup | Low | 10-15 minutes |
| Core Implementation | Low | 15-25 minutes |
| Verification | Low | 20-30 minutes |
| **Total** | | **45-70 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before the change (default text and JSON, three input scales)
- [ ] Modified script checked with `bash -n`
- [ ] Quiet matrix re-run after the final edit

### Rollback Procedure
1. Revert `recommend-level.sh` to the pre-change content.
2. Re-run the baseline commands and diff against `scratch/baseline-*.txt`.
3. Confirm exit status 0 for a default run and 1 for a usage error.
4. No stakeholder notification is needed: the script is internal tooling with no user-facing surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the change writes no persistent data
<!-- /ANCHOR:enhanced-rollback -->

---
