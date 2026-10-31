---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a boolean --quiet to a single Bash script: parse it in the existing case loop, store it in a QUIET_MODE global, and return early from output_text() after printing the level line the script already emits. Scoring, JSON output and phase logic stay untouched."
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
| **Language/Stack** | Bash 3.2-compatible shell (no external dependencies) |
| **Framework** | None — one self-contained script |
| **Storage** | None |
| **Testing** | Direct CLI invocation with byte comparison, plus the existing Node legacy suites that execute the script |

### Overview

Add a boolean flag to one shell script. `--quiet` is parsed in the existing `while`/`case` loop, stored in a `QUIET_MODE` global, and consumed by a guard at the top of `output_text()`. The guard prints the `Recommended Level: N (Name)` line and returns before the function's leading blank line. No scoring, JSON, or phase logic changes, so default output is untouched by construction.
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

Single-file CLI script with a parse → score → render pipeline. The change follows the pattern the file already uses for output selection: a global set during argument parsing, read once at render time.

### Key Components

- **Argument parser** (`recommend-level.sh:656-719`): the `while`/`case` loop that turns argv into globals. Gains a `--quiet` branch.
- **Globals block** (`recommend-level.sh:116-142`): holds `JSON_OUTPUT`, `RECOMMEND_PHASES`, and the scoring results. Gains `QUIET_MODE=false`.
- **Scoring** (`recommend-level.sh:216-500`): `calculate_*_score`, `determine_level`, `determine_phasing`, `calculate_confidence`. Unchanged.
- **`output_text()`** (`recommend-level.sh:508-558`): the human-readable report. Gains the single-line early return.
- **`output_json()`** (`recommend-level.sh:562-649`): the JSON document. Unchanged.
- **Output dispatch** (`recommend-level.sh:770-774`): chooses text or JSON. Unchanged, so JSON precedence is structural rather than a new condition.

### Data Flow

`argv` → case loop sets `QUIET_MODE` and the input globals → scores are computed → `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME` → dispatch calls `output_text()` or `output_json()` → with `QUIET_MODE=true`, `output_text()` prints one line and returns → `exit 0`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Argument parser (`recommend-level.sh:656-719`) | Owns flag acceptance; rejects `--quiet` as an unknown option today | update: add a `--quiet` case that sets `QUIET_MODE=true` | `bash -n` clean; `--quiet --loc 50 --files 2` exits 0 instead of `ERROR: Unknown option` |
| `output_text()` (`recommend-level.sh:508-558`) | Producer of the human report | update: early return printing the existing level line | `wc -l` = 1 for quiet runs; `diff` of default output empty |
| `output_json()` (`recommend-level.sh:562-649`) | Producer of the JSON document | unchanged: never reads `QUIET_MODE` | `--json` and `--json --quiet` diff empty against baseline |
| Header OPTIONS block (`recommend-level.sh:16-27`) | Documents flags at the top of the file | update: add the `--quiet` row | header lists `--quiet` next to `--json` |
| `show_help()` (`recommend-level.sh:162-211`) | Prints usage, options and examples | update: add the option row and one example | `--help` output contains `--quiet`; `--quiet --help` byte-identical |
| `tests/test-phase-validation.js`, `tests/test-phase-system.js` | Consumers that run the script with `--json` and default text | unchanged: neither passes `--quiet` | both exit 0 after the change |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|QUIET' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — one output dispatch site (`:770-774`) and one text producer.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled --glob '*.js' --glob '*.sh' --glob '*.md'` — the two legacy suites plus documentation prose; no caller passes `--quiet`, so no consumer breaks.
- Matrix axes: flag presence (2) × output mode (text, JSON) × phase section (default, `--no-recommend-phases`) × flag position (leading, trailing). The required rows are enumerated in `tasks.md` T011.
- Algorithm invariant: not a path, redaction, parser-security or resolver fix. The invariant that matters is output stability — default text and JSON must stay byte-identical, which AC-002, AC-003 and AC-009 pin.
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
| Unit | None — the script has no unit harness; `bash -n` covers syntax | `bash -n` |
| Integration | Flag × output mode × phase section × flag position matrix | direct invocation with `wc -l` and byte comparison |
| Regression | Default text and JSON output, plus the phase suites | `node tests/test-phase-validation.js`, `node tests/test-phase-system.js`, `diff` |
| Manual | Help text and option ordering | `--help` inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `output_text()` structure (`:508-558`) | Internal | Green | The guard has no clean home; the function would need restructuring first |
| Bash 3.2 (`/bin/bash` on macOS) | External | Green | A newer-syntax construct would break the script on the default macOS shell |
| Existing phase suites | Internal | Green | No regression signal for default output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any acceptance criterion fails after merge, or default output drifts.
- **Procedure**: `git revert <sha>` — the change is one file with no data or schema impact — then re-run the SC-002 and SC-003 diffs.
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **~1.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A, the change lives in git
- [x] Feature flag configured — N/A, the flag itself is the switch
- [x] Monitoring alerts set — N/A, an internal CLI with no service surface

### Rollback Procedure
1. Revert the single commit.
2. Re-run the default-output diff against the captured baseline.
3. Confirm `--quiet` is rejected again, which proves the revert took effect.
4. Notify nobody — the script has no user-facing deployment.

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
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline captures (T002, T003) | None | Byte-exact pre-change output | Verification diffs |
| Parser branch (T006) | Baseline captures | `QUIET_MODE` set from argv | Guard and verification |
| `output_text()` guard (T007) | Parser branch | One-line quiet output | Matrix runs |
| Help and header text (T008, T009) | None | Discoverable flag | Help checks |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture baselines** — 15 minutes — CRITICAL
2. **Add parser branch and guard** — 30 minutes — CRITICAL
3. **Run the matrix and the suites** — 30 minutes — CRITICAL

**Total Critical Path**: ~75 minutes

**Parallel Opportunities**:
- None worth scheduling. The implementation is one file and one author; splitting the help text from the guard would cost more in merge friction than it saves.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Baselines captured in `scratch/`; `--quiet` confirmed rejected today | Phase 1 |
| M2 | Core done | `--quiet` prints one line; default output still matches baseline | Phase 2 |
| M3 | Verified | SC-001 to SC-004 evidenced; acceptance rows flipped to Met | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--quiet` is a text-mode modifier; `--json` keeps precedence

**Status**: Proposed

**Context**: A caller can pass both `--quiet` and `--json`. The script has to define what that means before the flag ships, or the combination becomes accidental behavior.

**Decision**: `--quiet` affects human-readable output only. When `--json` is set, the JSON document is emitted unchanged and `--quiet` has no effect. The output dispatch already prefers JSON, so this needs no new condition.

**Consequences**:
- No new error path and no new exit code, so existing callers cannot break.
- A caller combining both gets JSON, which is documented in the help text and the header block.
- `--quiet` cannot be used to ask for a bare scalar; `--json` plus `jq .recommended_level` is the machine path.

**Alternatives Rejected**:
- **Error on `--json --quiet`**: rejected because the repository already composes the pair — `runtime/cli/spec/quality-audit.sh:126` calls `validate.sh --json --quiet` — so a hard error here would contradict the sibling convention.
- **Quiet overrides JSON and prints the level line**: rejected because it would make `--json` unreliable and give one flag two output formats.

### ADR-002: Print the existing level line verbatim rather than a bare value

**Status**: Proposed

**Context**: "Only its final recommended-level line" can mean the existing `Recommended Level: 0 (Quick)` line or a bare `0`.

**Decision**: Reuse the exact line `output_text()` prints today (`recommend-level.sh:510`). Quiet output is a strict subset of default output.

**Consequences**:
- A caller can compare quiet output to the corresponding line of the full report, and the level name stays available.
- No new format to document, version, or keep in sync with the level vocabulary.
- A caller that wants only the integer uses `--json` and reads `recommended_level`.

**Alternatives Rejected**:
- **Bare integer**: rejected because it introduces a second output format for one value, drops the level name, and reads ambiguously next to the score.
- **JSON scalar**: rejected because it duplicates `--json` with a shape no other spec script emits.

---

> Decisions live inline here because this packet's Level 3 file contract does not require `decision-record.md`; the validator's `FILE_EXISTS` rule reports all required files present without it.

---
