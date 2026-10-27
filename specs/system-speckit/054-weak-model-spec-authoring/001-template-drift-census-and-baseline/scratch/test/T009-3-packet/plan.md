---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a boolean flag to the existing argument loop and one branch in output_text, so --quiet prints only the recommended-level line while the default text and JSON paths stay byte-identical."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "implementation"
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
| **Language/Stack** | Bash, macOS `/bin/bash` 3.2 floor |
| **Framework** | None; the script is a standalone CLI |
| **Storage** | None |
| **Testing** | Node harness `runtime/cli/tests/test-phase-system.js`, run by `npm run test:legacy`, plus shell probes |

### Overview
The script already separates rendering from calculation: `determine_level` sets the level, and `output_text` or `output_json` renders it. `--quiet` belongs at that seam. One more boolean in the argument loop, one branch at the top of `output_text`, and the JSON renderer keeps its current behaviour because it is never reached by the quiet branch. The change is additive, so the default report and the JSON document stay byte-identical.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met with observed evidence
- [ ] `bash -n` on the script exits 0 and `node tests/test-phase-system.js` exits 0
- [ ] The captured pre-change default output still matches byte for byte after the change
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Smallest change at the existing output seam. Parsing, scoring and rendering stay where they are; the new flag only selects a narrower renderer branch.

### Key Components
- **Globals** (`recommend-level.sh:116-127`): `JSON_OUTPUT` already carries a format choice, so `QUIET_OUTPUT=false` sits beside it with the same shape and the same reset-free lifetime.
- **Argument loop** (`recommend-level.sh:655-719`): every boolean flag is a `name) NAME=true; shift ;;` arm. `--quiet` follows that shape exactly, takes no value, and is placed with the other booleans rather than among the value-taking arms.
- **`output_text()`** (`recommend-level.sh:506-558`): the renderer that owns the level line. The quiet branch prints the same `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` string and returns before the score, breakdown and phase sections.
- **`output_json()`** (`recommend-level.sh:560-649`): unchanged. The dispatcher at `recommend-level.sh:770-774` still prefers JSON, so `--quiet` cannot reach this renderer.
- **Documentation surfaces**: the file-header `OPTIONS` block (`recommend-level.sh:16-27`) and the `show_help` heredoc (`recommend-level.sh:171-182`) both list flags, so both need the new row, plus the flag table in `references/workflows/execution-methods.md`.

### Data Flow
The argument loop sets `QUIET_OUTPUT`. Validation of `--loc`, `--files` and `--phase-threshold` runs unchanged, then the score, level, confidence and phase recommendation are calculated. The dispatcher picks `output_json` when `JSON_OUTPUT` is true, otherwise `output_text`; `output_text` prints one line and returns when `QUIET_OUTPUT` is true, and prints the full report otherwise. Exit remains 0 on success.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` | Sole producer of the human report and of the level line | update | quiet probe prints one line; default probe diffs clean against the captured baseline |
| `output_json()` | Sole producer of the JSON document | unchanged | `diff` of `--json` against `--json --quiet` is empty and both parse with `node -e` |
| Argument loop | Parses every flag | update, one boolean arm | `--quietly` still hits `*)` and exits 1 |
| `show_help` and header `OPTIONS` | Describe the flag surface to operators and readers | update | `--help` output and the header both list `--quiet` |
| `test-phase-system.js` | The node harness that already invokes this script and asserts its output | update | `node tests/test-phase-system.js` exits 0 with the new cases counted |
| `speckit-plan.yaml`, `speckit-complete.yaml`, `speckit-implement.yaml` | Invoke the script with `--json` and read JSON fields | unchanged, not a consumer of text output | JSON diff and a read of each invocation line |
| `references/workflows/execution-methods.md` | Documents the script's feature flags | update | the `--quiet` row exists and matches the help text |

Required inventories:
- Same-class producers: `rg -n "Recommended Level:" .skilled/skills/system-spec-kit/runtime` - expect `output_text` only; any other producer of the string must be classified before the quiet branch is written.
- Consumers of the script: `rg -n "recommend-level\.sh" .skilled .opencode --glob '!**/dist/**'`, each classified as a JSON consumer, a help/doc reference, or a text consumer that would need the flag.
- Matrix axes: flag (absent, `--quiet`), format (text, `--json`), phases (default, `--no-recommend-phases`), input (Level 0 case, Level 3 case that recommends phases, invalid input), flag order (`--quiet` first and last).
- Algorithm invariant: for identical inputs, the quiet output is exactly the level line the default report already carries, and every output produced without `--quiet` stays byte-identical.
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
| Unit | Quiet output for three input shapes, the unchanged default output, and JSON precedence | `node runtime/cli/tests/test-phase-system.js` |
| Integration | Byte diff of the default report before and after the change, and of `--json` with and without `--quiet` | `diff` against files captured in `scratch/before/` |
| Manual | `--help` lists the flag; a one-liner reads the level without parsing | `bash recommend-level.sh ... --quiet` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | External | Green | The script itself is the floor; no new construct is added |
| Node 22.12 or newer for the test harness | External | Green | The quiet behaviour can still be probed by hand, but the pinned cases would not run |
| Existing `test-phase-system.js` | Internal | Green | A standalone test file would need a `package.json` registration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A caller that reads text output breaks, or the default report changes for any input.
- **Procedure**: Revert the commit. The change touches no state, writes no file and adds no dependency, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: capture baseline) ──► Phase 2 (Flag, branch, docs) ──► Phase 3 (Verify)
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
| Core Implementation | Low | 30 to 45 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **1.25 to 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Default output captured for the Level 0, Level 1 and Level 3 shapes before any edit
- [ ] No feature flag needed; the new flag is inert unless passed
- [ ] JSON diff confirmed empty after the change

### Rollback Procedure
1. Revert the commit that touched the script, the test harness and the reference doc
2. Rerun `node tests/test-phase-system.js` and confirm the pre-change result
3. Rerun the three baseline probes and diff them against `scratch/before/`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
