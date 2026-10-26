---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one flag to the existing bash parser, one global and one output-dispatch branch in recommend-level.sh. The default report and the JSON payload stay untouched, and a line count plus a baseline diff prove both halves."
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
| **Language/Stack** | Bash 3.2+ (macOS `/bin/bash`), coreutils |
| **Framework** | None - single procedural shell script |
| **Storage** | None |
| **Testing** | Direct invocation with `bash -n`, `wc -l`, `diff` and `grep` |

### Overview

Change one file: add a `QUIET_OUTPUT` global, a `--quiet` case in the argument parser, and an output-dispatch branch that prints `Recommended Level: <N> (<Name>)`. `output_text()` and `output_json()` stay untouched, so the default report and the JSON payload cannot drift; verification compares line counts and a baseline diff.
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
Single-script CLI branch (procedural bash).

### Key Components
- **Argument parser** (`while [[ $# -gt 0 ]]` + `case`): recognizes `--quiet` and sets `QUIET_OUTPUT`.
- **Globals block**: holds `QUIET_OUTPUT=false` beside `JSON_OUTPUT=false`.
- **Output dispatch**: chooses `output_json`, the quiet one-liner, or `output_text`.
- **`output_text()`**: owns the full report and is not modified.

### Data Flow

Arguments enter the parser, which sets `LOC`, `FILES`, the risk flags, `JSON_OUTPUT` and `QUIET_OUTPUT`. The scoring helpers and `determine_level` / `determine_phasing` compute the same values in every mode. The dispatch then renders JSON, the single quiet line, or the full report, and the script exits 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/recommend-level.sh` | Producer: owns the report, JSON payload and exit codes | update | `bash -n` exits 0; `--quiet` prints 1 line; default output diffs clean against the baseline. |
| `show_help` heredoc and header OPTIONS block | Describe the flag surface | update | `--help \| grep -- '--quiet'` prints one row; header and heredoc agree. |
| `runtime/cli/tests/test-phase-system.js` | Consumer: invokes the script with `--json` and parses the payload | not a consumer | Tests pass unchanged; no assertion reads text output. |
| `README.md` and `references/workflows/*.md` | Describe invocation, never parse output | not a consumer | Invocation examples stay valid; no edit needed. |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' runtime/cli/spec/recommend-level.sh` lists the existing output-mode flags.
- Consumers of changed symbols: `rg -n 'QUIET_OUTPUT|--quiet' .skilled/skills/system-spec-kit` after the change finds only the script and this packet.
- Matrix axes: output mode (text / JSON) x quiet (on / off) x phase section (on / off), plus flag order for `--quiet --json`.
- Algorithm invariant: quiet never changes a computed value; it only selects the renderer. Adversarial cases are repeated flags, both flag orders, and `--quiet --help`.
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
| Unit | Parser case and dispatch branch, exercised through the script | `bash -n`, direct invocation |
| Integration | Full output matrix: text/JSON x quiet on/off x phase on/off | `wc -l`, `diff`, `grep` |
| Manual | `--help` review and a piped `awk` read of the quiet line | Terminal |

The load-bearing checks are `--quiet ... | wc -l` printing `1` and a `diff` of the default invocation against a pre-change capture printing nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2+ | Internal | Green | The script already requires it; no new runtime. |
| coreutils (`wc`, `diff`, `grep`) | Internal | Green | Used for verification only, not by the feature. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the default report or the JSON payload changes, or `--quiet` prints more than one line.
- **Procedure**: `git revert` the single commit; the change is additive and touches one file, so there is no data or configuration to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Implementation) ──► Phase 3 (Verification)
Phase 1.5 (Baseline) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Baseline, Implementation |
| Baseline | Setup | Implementation |
| Implementation | Setup, Baseline | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 minutes |
| Core Implementation | Low | 15 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **~30 minutes (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - N/A, no data
- [ ] Feature flag configured - N/A, the flag is the feature
- [ ] Monitoring alerts set - N/A, local CLI script

### Rollback Procedure
1. Revert the single commit with `git revert`.
2. Re-run `--quiet` and the default form, then compare against the saved baseline.
3. No stakeholder notification is needed; the script ships in-repo.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
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
                    │  Baseline │
                    │  Capture  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Saved default output for the fixture arguments | Implementation comparison |
| Parser case | Baseline capture | `QUIET_OUTPUT` set from `--quiet` | Dispatch branch |
| Dispatch branch | Parser case | One-line quiet output | Verification |
| Verification | Dispatch branch | Line-count and diff evidence | Packet close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 5 minutes - CRITICAL
2. **Parser case and dispatch branch** - 15 minutes - CRITICAL
3. **Line-count and diff verification** - 10 minutes - CRITICAL

**Total Critical Path**: ~30 minutes

**Parallel Opportunities**:
- Help-text edits and the dispatch branch can be written in one pass, then verified together.
- Packet documentation updates run in parallel with implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Default output for `--loc 500 --files 15` saved under `scratch/` | Phase 1 |
| M2 | Flag implemented | `--quiet` prints exactly one line and exits 0 | Phase 2 |
| M3 | Verified | AC rows carry evidence and `validate.sh --strict` passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet is a dispatch branch, not a guard inside `output_text()`

**Status**: Accepted

**Context**: The flag must produce one line without risking the 16-line default report that callers and docs already rely on.

**Decision**: Add `elif [[ "$QUIET_OUTPUT" = true ]]` to the output dispatch and leave `output_text()` untouched.

**Consequences**:
- The default path is structurally unchanged, so a diff can prove it.
- The label format is duplicated in one more place; AC-002 pins it, and a shared `printf` becomes worthwhile if a third renderer appears.

**Alternatives Rejected**:
- Guard at the top of `output_text()`: touches the default function and splits its contract between two branches.
- `--json | jq`: adds a `jq` dependency for callers and a second process.
- Environment variable: callers already pass flags, and env state is implicit and harder to test.

---

### ADR-002: `--json` wins over `--quiet`

**Status**: Accepted

**Context**: Both flags select an output format, and a caller can pass both.

**Decision**: Evaluate `JSON_OUTPUT` first; quiet applies to the text report only.

**Consequences**:
- Passing both stays harmless and JSON parsing keeps working.
- Quiet is not a universal one-line mode; help and spec say so.

**Alternatives Rejected**:
- Error on conflict: rejects a harmless combination and adds an exit path.
- Fold JSON into one line: changes the payload shape and breaks existing parsers.

---
