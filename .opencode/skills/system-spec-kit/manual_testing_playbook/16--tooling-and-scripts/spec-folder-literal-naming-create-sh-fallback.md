---
title: "PHASE-006 -- Spec-folder literal naming (create.sh fallback)"
description: "Validate that create.sh emits a PROVIDE-DESCRIPTIVE-SLUG placeholder and a stderr warning for each phase child when --phase-names is omitted, per Packet 012 REQ-003 and REQ-004."
version: 3.6.0.4
---

# PHASE-006 -- Spec-folder literal naming (create.sh fallback)

## 1. OVERVIEW

This scenario validates `create.sh` fallback behavior shipped in Packet 012 REQ-003 and REQ-004. When an operator runs `create.sh` with `--phase --phase-count N` but omits `--phase-names`, each generated child folder name contains the literal token `PROVIDE-DESCRIPTIVE-SLUG` and `create.sh` emits one `[speckit] Warning:` line to stderr per child. The exit code remains 0 (warn-only, not fail-hard). This is the deterministic ground-truth check before any CLI-rotation scenario.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `create.sh` emits the placeholder slug and stderr warning for all phase children when `--phase-names` is omitted.
- Real user request: `Validate create.sh literal-naming fallback by running create.sh "literal-naming smoke" --short-name "literal-naming-smoke" --level 2 --phase --phase-count 3 --path /tmp/speckit-naming-smoke-$$ 2>/tmp/speckit-stderr-$$.log without --phase-names. Report cited pass/fail evidence.`
- Prompt: `Validate create.sh literal-naming fallback. Run: SMOKE_DIR=/tmp/speckit-naming-smoke-$$; bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "literal-naming smoke" --short-name "literal-naming-smoke" --level 2 --phase --phase-count 3 --path "$SMOKE_DIR" 2>/tmp/speckit-stderr-$$.log and report whether all 3 children contain -PROVIDE-DESCRIPTIVE-SLUG and stderr contains 3 warning lines.`
- Expected execution process: Run the four shell commands in sequence, capture stdout and the stderr log file, compare child folder names and warning line count against the expected signals, and return a pass/fail verdict with cited evidence.
- Expected signals: 3 child folders ending with `-PROVIDE-DESCRIPTIVE-SLUG`; exactly 3 `[speckit] Warning:` lines on stderr; `create.sh` exit code 0.
- Desired user-visible outcome: A concise pass/fail verdict listing the 3 child folder names and the 3 stderr warning lines.
- Pass/fail: PASS if all 3 children match `*-PROVIDE-DESCRIPTIVE-SLUG`, all 3 warnings appear on stderr, and `create.sh` exits 0. FAIL if any child reverts to a bare `phase-N` name (pre-012 regression), if exit code is non-zero, or if fewer than 3 warnings fire.

---

## 3. TEST EXECUTION

### Prompt

```
Validate create.sh literal-naming fallback. Run the following commands and report whether all 3 children contain -PROVIDE-DESCRIPTIVE-SLUG and stderr contains 3 warning lines matching the expected pattern.
```

### Commands

1. Set scratch variables and run `create.sh` without `--phase-names`, redirecting stderr to a log file:

   ```bash
   SMOKE_DIR=/tmp/speckit-naming-smoke-$$
   bash .opencode/skills/system-spec-kit/scripts/spec/create.sh \
     "literal-naming smoke" \
     --short-name "literal-naming-smoke" \
     --level 2 \
     --phase \
     --phase-count 3 \
     --path "$SMOKE_DIR" \
     2>/tmp/speckit-stderr-$$.log
   echo "exit code: $?"
   ```

2. Inspect child folder names:

   ```bash
   ls "$SMOKE_DIR"
   ```

   Expected: `001-phase-1-PROVIDE-DESCRIPTIVE-SLUG/`, `002-phase-2-PROVIDE-DESCRIPTIVE-SLUG/`, `003-phase-3-PROVIDE-DESCRIPTIVE-SLUG/`

3. Confirm 3 warning lines on stderr:

   ```bash
   cat /tmp/speckit-stderr-$$.log
   ```

   Each warning matches: `[speckit] Warning: Falling back to generic phase name 'phase-[123]-PROVIDE-DESCRIPTIVE-SLUG'`

4. Clean up scratch directories:

   ```bash
   rm -rf "$SMOKE_DIR" /tmp/speckit-stderr-$$.log
   ```

### Expected

Child folders produced by step 2:

```
001-phase-1-PROVIDE-DESCRIPTIVE-SLUG/
002-phase-2-PROVIDE-DESCRIPTIVE-SLUG/
003-phase-3-PROVIDE-DESCRIPTIVE-SLUG/
```

Stderr log from step 3:

```
[speckit] Warning: Falling back to generic phase name 'phase-1-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs.
[speckit] Warning: Falling back to generic phase name 'phase-2-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs.
[speckit] Warning: Falling back to generic phase name 'phase-3-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs.
```

Exit code from step 1: `0`

### Evidence

- Exit code captured after the `create.sh` invocation:

  ```
  exit code: 0
  ```

- Full `ls "$SMOKE_DIR"` output showing child folder names:

  ```
  001-phase-1-PROVIDE-DESCRIPTIVE-SLUG
  002-phase-2-PROVIDE-DESCRIPTIVE-SLUG
  003-phase-3-PROVIDE-DESCRIPTIVE-SLUG
  description.json
  graph-metadata.json
  spec.md
  ```

- Full content of `/tmp/speckit-stderr-$$.log`:

  ```
  [speckit] Warning: Falling back to generic phase name 'phase-1-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs describing the concrete work.
  [speckit] Warning: Falling back to generic phase name 'phase-2-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs describing the concrete work.
  [speckit] Warning: Falling back to generic phase name 'phase-3-PROVIDE-DESCRIPTIVE-SLUG'. Provide --phase-names with literal slugs describing the concrete work.
  (node:14502) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
  (node:14626) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
  (node:14788) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
  (node:14939) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
  ```

### Pass / Fail

- **PASS**: All 3 child folder names contain `-PROVIDE-DESCRIPTIVE-SLUG`, exactly 3 `[speckit] Warning:` lines appear in the stderr log, and `create.sh` exits 0. The stderr log also contains Node `ExperimentalWarning` lines after the required 3 speckit warnings.

### Failure Triage

- If child names are bare `phase-N`: confirm `create.sh` line 1084 contains `PROVIDE-DESCRIPTIVE-SLUG`. Run `grep -n 'PROVIDE-DESCRIPTIVE-SLUG' .opencode/skills/system-spec-kit/scripts/spec/create.sh` and expect at least 2 matches.
- If warning count is 0: confirm stderr is not lost. The `2>/tmp/speckit-stderr-$$.log` redirect must capture stderr; check that no surrounding wrapper script swallows it.
- If `--phase-count` is not parsed: run `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --help 2>&1 | grep phase-count` and confirm the flag is recognized.
- If exit code is non-zero: read the fallback path in `create.sh` near line 1084. The `echo ... >&2` warning must not be followed by `exit 1`.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Originating spec packet: [012-literal-spec-folder-names](../../../../specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/)

---

## 5. SOURCE METADATA

- Group: Phase System Features
- Playbook ID: PHASE-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md`
