---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "One shell script, three edits: a quiet global, a parser branch and an output function. Two pinned commands prove the flag prints one line and the default report keeps its 16 lines and 301 bytes."
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
| **Language/Stack** | Bash 3.2+ - one POSIX-style shell script |
| **Framework** | None - the script uses builtins and `cat` |
| **Storage** | None |
| **Testing** | Shell command checks, plus the existing Node tests under `runtime/cli/tests/` |

### Overview
The change touches one file in three places: the globals block, the argument parser and the output section. A dedicated `output_quiet()` prints the level line, and section 7 chooses JSON, quiet or text so the default branch keeps its bytes. Two pinned commands prove both halves: one line under quiet, 16 lines and 301 bytes without it.
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
Single-script branch - no application framework

### Key Components
- **`recommend-level.sh` argument parser**: recognizes `--quiet` and sets `QUIET_OUTPUT`.
- **`output_quiet()`**: prints the `Recommended Level:` line and returns.
- **Section 7 output dispatch**: picks JSON, then quiet, then text.

### Data Flow
Arguments enter the parser, feed the unchanged scoring helpers, and produce `RECOMMENDED_LEVEL` and `LEVEL_NAME`. One of three output paths leaves with the result. Quiet reads the same two globals the text report reads, so the score path is untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet ships a feature rather than a fix, so the addendum records the producer and consumer inventory that the change has to respect.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/recommend-level.sh` | owns the flag parser, the scoring and all three output paths | update | `rg -n 'QUIET_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints the global, the parser case and the dispatch branch |
| `runtime/cli/tests/test-phase-system.js`, `runtime/cli/tests/test-phase-validation.js` | call the script with `--json` and parse the document | unchanged | both callers pass `--json`, so the JSON path they read is untouched |
| `references/workflows/execution-methods.md`, `references/workflows/spec-authoring-card.md` | document how a caller invokes the script | unchanged | neither shows a `--quiet` example, and the default invocation they show keeps its output |
| `create.sh` and the other spec CLIs | do not call the script; `create.sh` requires an explicit `--level` | not a consumer | `rg -n 'recommend-level' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints no line |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` lists the flags that already shape output, and `--quiet` joins them.
- Consumers of changed symbols: the two Node test files above are the only programmatic callers, and both pass `--json`.
- Matrix axes: the output mode (text, quiet, JSON) and the input validity (valid, invalid) give the four rows that AC-001 to AC-006 cover.
- Algorithm invariant: scoring is untouched, so the level for a given argument set stays the same under every output mode.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step 1: Add the flag and the quiet output path

Acceptance: `--quiet` is accepted, `QUIET_OUTPUT` is set, and section 7 prints the level line alone.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 200 --files 2 | wc -l` prints `1`.

### Step 2: Document the flag in the help text

Acceptance: `--help` lists `--quiet` once in its OPTIONS block, and the header comment names it.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help | grep -c -- '--quiet'` prints `1`.

### Step 3: Prove both halves against the baseline

Acceptance: quiet prints one line, the default prints 16 lines and 301 bytes, and `bash -n` exits 0.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 2 | wc -l` prints `16`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `output_quiet()` and the `--quiet` parser branch | `bash -n` and direct invocations |
| Integration | The five-invocation matrix: default, quiet, quiet with phase flags, quiet with JSON, invalid input | Shell command checks |
| Manual | None - every check is a command | Not applicable |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The flag is a branch in an existing script, so a missing shell is the only blocker |
| The scoring helpers already in the file | Internal | Green | Quiet reads their results unchanged, so they need no edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes by any byte, or `--quiet` prints more than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`. The flag adds no data, config or migration to undo.
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
| Setup | Low | 10 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **45 minutes, an assumption** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created: not applicable, no data changes
- [ ] Feature flag configured: the `--quiet` flag itself defaults off, so no separate switch exists
- [ ] Monitoring alerts set: not applicable, a local one-shot CLI

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`.
2. Rerun the two pinned commands: quiet prints 1 line, the default prints 16.
3. Confirm `bash -n` exits 0.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, the script writes no data
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Parser    │────►│   Dispatch   │────►│ output_quiet │
│  (--quiet)   │     │  (section 7) │     └──────────────┘
└──────────────┘     │              │     ┌──────────────┐
                     │              │────►│ output_text  │
                     │              │     └──────────────┘
                     │              │     ┌──────────────┐
                     │              │────►│ output_json  │
                     └──────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Parser (`--quiet`) | None | `QUIET_OUTPUT=true` | Dispatch |
| Dispatch (section 7) | Parser, scoring | The chosen output call | Quiet, text, JSON |
| `output_quiet()` | Level globals | One line on stdout | None |
| `output_text()` | Level globals | The unchanged report | None |
| `output_json()` | Level globals | The unchanged JSON document | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Step 1, flag and quiet path** - 20 minutes - CRITICAL
2. **Step 3, baseline proof** - 15 minutes - CRITICAL
3. **Strict packet validation** - 5 minutes - CRITICAL

**Total Critical Path**: 40 minutes, an assumption

**Parallel Opportunities**:
- Step 2 (help text) can run beside Step 1 once the flag name is fixed
- The packet documentation runs beside all three steps
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline recorded | `wc -l` prints 16 and `wc -c` prints 301 | Phase 1 |
| M2 | Flag works | `--quiet` prints one line | Phase 2 |
| M3 | Proof complete | `bash -n` exits 0 and strict validation prints RESULT: PASSED | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet is a text modifier, and JSON keeps precedence

**Status**: Accepted

**Context**: Both flags shape stdout, and the script can see both. The JSON document is one machine-readable object that a caller parses whole; a bare level line under quiet would break that parse.

**Decision**: When both flags are passed, JSON wins. `--quiet` applies to the text report only.

**Consequences**:
- JSON consumers keep their contract, and a caller that passes both gets the richer document, which still carries `recommended_level`.
- A caller cannot ask for a bare line out of the JSON path; it reads `recommended_level` from the document instead.

**Alternatives Rejected**:
- Make quiet win over JSON: breaks the JSON contract for a combination no caller needs.
- Reject the combination with an error: adds a failure mode to refuse a harmless request.

### ADR-002: A dedicated `output_quiet()` rather than an early return

**Status**: Accepted

**Context**: The default report must stay byte-identical, and an early return inside `output_text()` would put the new branch in the middle of the path every existing reader uses.

**Decision**: Add `output_quiet()` and choose it in section 7 before calling `output_text()`.

**Consequences**:
- The default function is untouched, so its bytes cannot drift, at the cost of one more small function to read.
- The level line is printed in two places, so a label edit must touch both. AC-001 pins the label and the review checks both call sites.

**Alternatives Rejected**:
- An early return inside `output_text()`: cheaper to write, but it edits the default path the packet promises not to change.

---
