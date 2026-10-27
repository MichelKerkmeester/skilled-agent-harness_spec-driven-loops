---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a quiet-mode global and one output branch to recommend-level.sh, reusing the existing parse loop and the default level line. Nothing in scoring changes; the default and JSON paths stay byte-identical and are proved by a captured baseline diff."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level quiet implementation"
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
| **Language/Stack** | Bash (compatible with the macOS 3.2 baseline the script already targets) |
| **Framework** | None — a standalone CLI script under the system-spec-kit runtime |
| **Storage** | None |
| **Testing** | Direct CLI invocations with `bash`, output captured to files and compared with `diff` |

### Overview
Treat quiet as a third output mode beside text and JSON: one global `QUIET_MODE`,
one `--quiet|-q` arm in the existing `while`/`case` loop, and one branch in the
output section that prints the level line the text report already prints. Scoring,
validation and exit codes are untouched, so the only behavioural change is the
presence of a flag and what it prints.
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
- [ ] `bash -n` clean and baseline diff empty for the default path
- [ ] Docs updated (spec/plan/tasks plus the script's own help text)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file shell CLI with four stages already in place: option parsing, scoring,
level determination, output dispatch. The change lands in stages one and four only.

### Key Components
- **Argument loop** (`§5 MAIN SCRIPT`): the `case` over `$1`. A new arm sets
  `QUIET_MODE=true` and shifts one argument, matching the existing `JSON_OUTPUT` arm.
- **`output_text`**: the existing first line, `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`, is the exact string quiet mode needs. It is reused rather than re-typed so the two lines cannot drift.
- **Output dispatch** (`§7 OUTPUT RESULTS`): currently `if JSON_OUTPUT ... else output_text`. It becomes a three-way choice where quiet is checked first.
- **`show_help` and the header OPTIONS block**: both list the flag.

### Data Flow
Arguments are parsed into globals, scoring produces `TOTAL_SCORE`, `determine_level`
sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`, and the dispatch prints. Quiet mode only
changes the last step. It reads the same two globals and prints one line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change adds a public flag and touches a shared CLI surface, so the producer and
every caller are inventoried before editing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/recommend-level.sh` | Produces the report, the JSON document and the exit status | update — add the flag, the global and the quiet branch | `bash -n`; `--quiet` prints one line; default output diffed against a pre-change baseline |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Consumer: calls the script with `--json --recommend-phases` | unchanged — JSON path is untouched | `rg -n 'recommend-level.sh' .skilled/commands` shows the call composition; rerun that exact command and diff it against baseline |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Consumer: calls the script with `--json --recommend-phases` | unchanged | Same command-level diff |
| `references/workflows/execution-methods.md`, `references/structure/phase-system.md`, `manual-testing-playbook/tooling-and-scripts/phase-command-workflow.md` | Documentation of the script's flags and example invocations | unchanged — they do not enumerate every flag, and the new flag is additive | `rg -n 'recommend-level' .skilled/skills/system-spec-kit` reviewed; no line needs to change |
| `runtime/cli/spec/validate.sh`, `check-completion.sh`, `progressive-validate.sh` | Sibling scripts that also parse `--quiet`, meaning "results suppressed" | not a consumer — separate programs with their own flags | `rg -n 'recommend-level' <those files>` returns nothing |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level:' .skilled/skills/system-spec-kit` — the string exists in `recommend-level.sh`; no other producer formats a level line.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled --glob '*.yaml' --glob '*.md' --glob '*.sh'`.
- Matrix axes: mode (default text, `--json`, `--quiet`, `--quiet --json`) × input class (simple, risky, boundary score, invalid argument).
- Algorithm invariant: unchanged. Scoring is not touched, so a quiet run and a text run with the same inputs must agree on `RECOMMENDED_LEVEL`.
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
| Baseline capture | Run the pre-change script across representative inputs and store stdout, stderr and exit codes in `scratch/` | `bash`, `diff` |
| Unit (CLI) | `--quiet`, `-q`, `--quiet --json`, `--quiet --no-recommend-phases`, `--help` | Direct invocations, line and exit-code assertions |
| Regression | Default text and `--json` output for the same inputs, diffed against the captured baseline | `diff -u` |
| Negative | Missing `--loc`/`--files`, non-numeric value, unknown option under `--quiet` | stderr content and exit status 1 |

Representative inputs: `--loc 50 --files 2` (Level 0), `--loc 200 --files 5 --api`
(Level 2), `--loc 500 --files 15 --auth --api --db --architectural` (Level 3), and a
boundary case that sits within five points of a threshold.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal (runtime) | Green | Script cannot run at all; the existing script already requires it |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` and `validate.sh` | Internal | Green | Packet scaffolding and closure checks would be unavailable |
| No network, package or credential dependency | — | Green | Nothing to block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default or JSON output changes for any previously working input, or quiet mode prints more than one line.
- **Procedure**: Revert the single file. Because the change adds a flag and a branch, reverting the commit (or restoring the file from the pre-change revision) restores the old behaviour with no data migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |

The baseline capture must precede the edit; otherwise there is no honest
"unchanged output" comparison to make.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (read script, capture baseline) | Low | 15-20 minutes |
| Core Implementation (flag, branch, help text) | Low | 15-30 minutes |
| Verification (matrix runs, baseline diff, help check) | Low | 20-30 minutes |
| **Total** | | **1-1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output captured for every representative input
- [ ] No feature flag needed — the new behaviour is opt-in by argument
- [ ] No monitoring change needed; the script is invoked locally, not deployed

### Rollback Procedure
1. Restore `recommend-level.sh` from the pre-change revision.
2. Confirm `--help` no longer lists `--quiet` and the default report is unchanged.
3. Rerun the representative invocations and diff them against the captured baseline.
4. No stakeholder notification is required; the flag has no external consumers until it ships.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
