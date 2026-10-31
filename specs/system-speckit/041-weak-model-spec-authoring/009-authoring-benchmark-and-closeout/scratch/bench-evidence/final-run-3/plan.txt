---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet output mode to the recommend-level.sh bash script: one flag, one validation conflict check, one output branch, help text, and diff-based verification against a captured baseline."
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
| **Language/Stack** | Bash 3.2+ (single script, `set -euo pipefail`) |
| **Framework** | None — standalone CLI script |
| **Storage** | None — stateless; verification baselines go to the packet `scratch/` folder |
| **Testing** | Direct `bash` invocations: `bash -n` syntax check, `wc -l` line counts, `diff` against a captured baseline |

### Overview
The change adds one boolean flag to `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`: a `QUIET` global, a `--quiet` case arm in the existing option parser, a mutual-exclusion check against `--json` in the validation block, a quiet branch in the output dispatch that prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`, and matching help text. Scoring is untouched — quiet changes which output runs, not what is computed. Proof is a `wc -l` count of `1` in quiet mode and an empty `diff` between the default output and a pre-change baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2-§3)
- [x] Success criteria measurable (SC-001..SC-004 each name a command and expected output)
- [x] Dependencies identified (bash only; the `--json` consumer in `speckit-plan.yaml` is unchanged)

### Definition of Done
- [ ] All acceptance criteria met (AC-001..AC-008 in `acceptance-criteria.md`)
- [ ] Tests passing (`bash -n`, quiet line count = 1, baseline `diff` empty, conflict exits 1)
- [ ] Docs updated (spec/plan/tasks consistent; `--help` documents the flag)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script output-mode branch — one flag selects between three emitters (quiet line / JSON document / text report).

### Key Components
- **Option parser (`while`/`case` loop)**: gains a `--quiet` arm that sets `QUIET=true`, beside the existing `--json|-j` arm
- **Validation block**: gains a mode-conflict check — `QUIET=true` and `JSON_OUTPUT=true` together exit 1 with `ERROR: --quiet cannot be combined with --json` on stderr
- **Output dispatch (section 7)**: `if [[ "$QUIET" = true ]]; then echo "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"; elif [[ "$JSON_OUTPUT" = true ]]; then output_json; else output_text; fi`
- **`show_help` + header USAGE comment**: document `--quiet` and its conflict

### Data Flow
`argv` → parser sets `QUIET`/`JSON_OUTPUT`/scoring inputs → numeric validation → conflict check → `calculate_*_score`, `determine_level`, `determine_phasing` run unchanged → output dispatch selects quiet line, JSON, or text report → `exit 0`. Scores and phase results are computed identically in all modes; only the final emit differs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` text path (`output_text`) | producer of the report | unchanged — quiet adds a sibling branch, it does not edit this function | `diff` of a default run against `scratch/baseline.txt` prints nothing |
| `recommend-level.sh` quiet branch | new producer of the single level line | update (added) | `... --quiet | wc -l` prints `1` |
| `recommend-level.sh` JSON path (`output_json`) | producer of machine output | unchanged | `speckit-plan.yaml`'s `--json` invocation returns the same JSON shape |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | consumer: calls the script with `--json --recommend-phases` | unchanged — never passes `--quiet`; conflict path unreachable from it | `rg -n 'recommend-level.sh' .skilled/commands` shows the same call |
| `references/workflows/spec-authoring-card.md`, skill README | documentation consumers | unchanged — they describe text/JSON modes accurately either way | manual read of the two files |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — only `output_text` emits the string; the quiet branch reuses it verbatim.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled/commands .skilled/skills --glob '*.yaml' --glob '*.sh' --glob '*.md'` — one programmatic caller (`speckit-plan.yaml`, `--json` mode) plus docs.
- Matrix axes: quiet × json × help × missing-input — the four rows are covered by AC-001, AC-004, AC-006, AC-008.
- Algorithm invariant: quiet mode must not alter the computed level — the quiet line is emitted from `RECOMMENDED_LEVEL`/`LEVEL_NAME` after the identical scoring path runs.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the baseline output; Implementation adds the flag, conflict check, output branch and help text; Verification runs the four flag-combination checks. Ordered tasks and their `Verify:` clauses live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Argument parser arms and the quiet output branch | `bash` invocations, `wc -l`, `grep` on the emitted line |
| Integration | Full flag matrix: quiet, default, `--quiet --json` conflict, `--quiet` + scoring flags | `bash`, `diff` against `scratch/baseline-*.txt`, exit-code assertions |
| Manual | `--help` lists `--quiet`; missing-input run under `--quiet` still errors cleanly | terminal run of `recommend-level.sh --help` and `recommend-level.sh --quiet` |

Expected evidence: quiet run prints 1 line; default run diffs empty against baseline; conflict run exits 1 with the named stderr message.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` ≥ 3.2 (already required by the script) | System | Green | None — no new dependency |
| `diff`, `wc`, `rg` for verification | System | Green | Verification only; core change unaffected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: default (non-quiet) output differs from baseline, or the quiet line format deviates from `output_text`'s level line
- **Procedure**: revert the single commit touching `recommend-level.sh` (`git revert` or `git checkout HEAD~1 -- <path>`), then rerun `--quiet` and default invocations to confirm restored behavior
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baseline capture) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation (baseline must exist before the diff check has meaning), Verification |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~10 minutes (read script, capture baseline) |
| Core Implementation | Low | ~20 minutes (flag arm, conflict check, output branch, help text) |
| Verification | Low | ~10 minutes (four invocations + diff) |
| **Total** | | **~40 minutes (assumption: no surprises in the parser)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A, no data changes
- [ ] Feature flag configured — N/A, `--quiet` itself is the opt-in
- [ ] Monitoring alerts set — N/A, local CLI script

### Rollback Procedure
1. Revert the one commit that touches `recommend-level.sh`
2. Rerun `recommend-level.sh --loc 500 --files 15` and diff against `scratch/baseline.txt` — must print nothing
3. Rerun `recommend-level.sh --loc 500 --files 15 --quiet` — must now fail as an unknown option, confirming the revert
4. N/A user-facing — no stakeholder notification needed for a CLI flag

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Parser arm +     │────►│ Conflict check + │────►│ Output dispatch  │
│ QUIET global     │     │ help text        │     │ quiet branch     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `QUIET` global + `--quiet` parser arm | None | `QUIET` flag readable downstream | Conflict check, output dispatch |
| Conflict check + help text | Parser arm | Exit-1 mode-conflict path; documented flag | Output dispatch (validation must exist before the branch is trusted) |
| Quiet output branch | Parser arm, conflict check | The single `Recommended Level:` line | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Parser + global (T004)** - ~5 min - CRITICAL
2. **Conflict check + quiet output branch (T005, T006)** - ~10 min - CRITICAL
3. **Verification runs (T009-T011)** - ~10 min - CRITICAL

**Total Critical Path**: ~25 minutes

**Parallel Opportunities**:
- Baseline capture (T002) and caller inventory (T003) can run simultaneously during Setup
- Help text (T007) and syntax check (T008) can run in parallel with the output branch work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Flag accepted by the parser | `rg -n '\-\-quiet' recommend-level.sh` prints the new case arm | Phase 2 start |
| M2 | Quiet mode emits one line | `recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints `1` | Phase 2 end |
| M3 | Contract verified | Default `diff` empty; `--quiet --json` exits 1; `bash -n` exits 0 | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--quiet` and `--json` are mutually exclusive output modes

**Status**: Proposed

**Context**: The script ends with an output dispatch that selects `output_json` or `output_text`. Adding `--quiet` introduces a third output mode. A caller can legally pass both `--quiet` and `--json`, and a silent precedence rule (last flag wins, or one mode dominating) would let an orchestrator believe it received JSON when it received one line of text — or vice versa.

**Decision**: Treat `--quiet` and `--json` as conflicting output-mode selectors. When both are set, the validation block exits 1 with `ERROR: --quiet cannot be combined with --json` on stderr, in either argument order.

**Consequences**:
- Each output mode keeps an exact contract: quiet is always one line, JSON is always the full document
- Callers that genuinely want one machine-readable field discover the conflict immediately instead of silently parsing the wrong shape
- One extra validation branch; the conflict is a usage error that costs the caller one rerun — mitigated by documenting the conflict in `--help`

**Alternatives Rejected**:
- Quiet overrides `--json` (quiet wins silently): breaks the literal JSON contract for `speckit-plan.yaml`-style callers if `--quiet` is ever added upstream, and violates "the JSON document is the output" expectation
- Last-flag-wins ordering: makes identical logical invocations produce different output depending on argv order — a footgun with no benefit
- Emit `{"recommended_level": N}` under `--quiet --json`: invents a third output shape the feature never asked for; `--json` already serves machine consumers

---
