---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "One script changes: a parser branch stores QUIET_OUTPUT, an output guard prints the single level line, and the help text names the flag. Shell commands prove the default report and the JSON document did not move."
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
| **Language/Stack** | Bash 3.2 or newer |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `bash -n`, `wc -l`, `diff` and exit-code assertions |

### Overview
Change one script in three places: the globals block, the argument parser and the top of `output_text`. A `QUIET_OUTPUT` global records the flag, and the text output function returns after printing the level line when it is set. The default report and the JSON document keep their current bytes, which a captured baseline and a `diff` prove.
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
- [ ] `bash -n` passes on the changed script
- [ ] Default text output and JSON output are byte-identical to the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script output branch

### Key Components
- **Argument parser**: Recognizes `--quiet` and sets `QUIET_OUTPUT`, the same way `--json` sets `JSON_OUTPUT`.
- **`output_text()`**: Owns the human report. It gains one guard that prints the level line and returns.
- **`output_json()`**: Unchanged. JSON mode keeps precedence over the quiet text branch.

### Data Flow
Arguments enter the `while` loop and set `QUIET_OUTPUT`. Scoring runs on the same path as today and fills `RECOMMENDED_LEVEL` and `LEVEL_NAME`. The output dispatch checks `JSON_OUTPUT` first, then `QUIET_OUTPUT`, then falls through to the full report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet adds a feature rather than fixing a bug, and it touches no security, path, environment, schema or persistence surface. The inventory below still names the producer and its consumers, because the output contract is public to callers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` | Producer. Owns the parser, the text report and the JSON document. | update | `rg -n 'QUIET_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` names the global, the parser branch and the guard |
| Callers and skill docs | Consumers. Invoke the script and read stdout. | unchanged | The default-output diff is empty and `--help` lists the flag |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime` names only `recommend-level.sh`, so no second emitter needs the flag.
- Consumers of changed symbols: `rg -n 'recommend-level.sh' .skilled/skills --glob '*.md' --glob '*.sh'` lists every caller and doc that names the script.
- Matrix axes: flag combination (none, `--quiet`, `--json`, `--quiet --json`) against input validity (valid, invalid), eight rows.
- Algorithm invariant: the level line stays `Recommended Level: <0-3> (<name>)` for every input. Adversarial cases are a repeated flag, a flag before and after `--loc`, empty input and non-numeric input.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the baseline, Implementation edits the script and Verification diffs both output modes against that baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The quiet guard in `output_text`, exercised through the CLI | Bash assertions on `wc -l` and the first line |
| Integration | Four flag combinations across valid and invalid input | `bash -n`, `diff`, exit-code checks |
| Manual | `--help` output and the header comment | Terminal read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | Internal | Green | The script cannot run |
| `diff` and `wc` from the base system | Internal | Green | Verification falls back to a manual comparison of captured files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes, or `--quiet` breaks an existing invocation.
- **Procedure**: Revert the single commit that changes `recommend-level.sh`, then rerun the default and JSON diffs. No data, config or generated file needs to be undone.
<!-- /ANCHOR:rollback -->

---


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
| Setup | None | Core |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

The Config phase is a no-op here: the script reads no configuration file and the flag adds no setting. It stays in the table because the packet template lists it, and T002 records that it has nothing to change.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **45 minutes (assumption, not a commitment)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

No deployable service ships with this packet, so the three checks above are N/A. The script is versioned in git and reverted as a file.

### Rollback Procedure
1. Revert the commit that changes `recommend-level.sh`.
2. Rerun `bash recommend-level.sh --loc 500 --files 15` and `bash recommend-level.sh --json --loc 100 --files 3`.
3. Diff both outputs against the captures in `scratch/`.
4. Notify no stakeholders. The change has no user-facing rollout.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the script persists nothing.
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
| Baseline capture | None | `scratch/before.txt` and `scratch/before.json` | Flag parser |
| Flag parser | Baseline capture | `QUIET_OUTPUT` set from argv | Quiet guard |
| Quiet guard | Flag parser | One-line stdout | Verification |
| Help text | Flag parser | `--help` entry | Verification |
| Verification | Quiet guard, Help text | Recorded PASS or FAIL | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read both output paths** - 10 minutes - CRITICAL
2. **Add the parser branch and the quiet guard** - 20 minutes - CRITICAL
3. **Run the diffs and the matrix** - 15 minutes - CRITICAL

**Total Critical Path**: 45 minutes

**Parallel Opportunities**:
- The header comment and the `show_help` entry can be written in the same edit as the guard.
- The JSON baseline capture runs alongside the text baseline capture before any edit.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `bash recommend-level.sh --loc 500 --files 15 > scratch/before.txt` exits 0 and `wc -l` prints 16 | Phase 1 |
| M2 | Flag implemented | `bash -n recommend-level.sh` exits 0 and `rg -n 'QUIET_OUTPUT'` prints three lines | Phase 2 |
| M3 | Verified | `bash recommend-level.sh --quiet --loc 500 --files 15 \| wc -l` prints 1 and both diffs are empty | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Add a flag to the existing script

**Status**: Accepted

**Context**: Callers need one value from a report that carries 16 lines. A wrapper script would add a second entry point and a second copy of the argument parser.

**Decision**: Add `--quiet` to `recommend-level.sh` and keep one entry point.

**Consequences**:
- One parser branch and one output guard cover the feature.
- The option surface grows by one flag, so every flag combination needs a row in the test matrix. T010 to T013 supply those rows.

**Alternatives Rejected**:
- A `--level-only` mode that prints a bare number: it drops the label callers already parse and splits the output contract in two.
- A `recommend-level-quiet.sh` wrapper: it duplicates argument parsing and drifts from the original.

---

### ADR-002: JSON mode keeps precedence over the quiet text branch

**Status**: Accepted

**Context**: `--json` already emits one structured document that scripts can parse. Making `--quiet` rewrite that document would break every existing JSON consumer.

**Decision**: The output dispatch checks `JSON_OUTPUT` first. With both flags, the JSON document is unchanged and `--quiet` has no effect.

**Consequences**:
- No JSON consumer sees a change, which AC-005 proves.
- A caller cannot combine the two flags to get a bare text line. That is acceptable because JSON is already machine-readable.

**Alternatives Rejected**:
- Let `--quiet` print the text line even when `--json` is set: it mixes two formats on one stdout.
- Reject the combination with an error: it adds a failure path for a request that has an obvious answer.
