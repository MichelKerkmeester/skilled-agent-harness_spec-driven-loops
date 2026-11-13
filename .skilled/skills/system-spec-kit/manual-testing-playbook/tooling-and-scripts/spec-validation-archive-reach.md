---
title: "495 -- Spec validation of archived packets"
description: "This scenario validates archive-aware validation for `495`. It focuses on validate.sh --recursive visiting an archived packet only when --include-archive is passed, and refusing that flag without --recursive."
version: 1.0.0.0
---

# 495 -- Spec validation of archived packets

This document captures the scratch-directory manual validation contract for `validate.sh --recursive --include-archive`.

---

## 1. OVERVIEW

This scenario validates archive-aware validation for `495`. It focuses on `validate.sh --recursive` visiting an archived packet only when `--include-archive` is passed, and refusing that flag without `--recursive`. The fixture track lives in a scratch directory under the operating-system temp directory. The scenario never validates or writes this checkout's `specs/` tree.

### Why This Matters

A recursive run walks a track's live packets and stops at `z_archive/`. That keeps a normal gate fast and free of old findings, but it also means nothing checks an archived packet after a move or a restore. The flag adds the packets in the `z_archive/` of the folder given and, for a track root, of each declared sub-track.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `495` and confirm each outcome without contradictory evidence.

- Objective: Prove that a recursive validation of a track reports its live packets only, that the same run with `--include-archive` also reports the archived packet, and that `--include-archive` without `--recursive` is refused with exit `2`.
- Real user request: `Validate the demo track again, and this time include the archived packets. Show me which folders were checked.`
- Prompt: `Validate the demo track with validate.sh --recursive, first without and then with --include-archive, and list the folders each run checked. Confirm the flag is refused without --recursive. Return PASS or FAIL with the folder lists and the exit codes.`
- Expected execution process: Build a track with three live packets and one archived packet in a scratch directory, list the `Folder:` lines of a recursive run, repeat with `--include-archive`, then pass the flag alone.
- Expected signals: The recursive run prints four `Folder:` lines, the track and its three live packets. The archive run prints five, the fifth ending in `specs/demo/z_archive/002-old`. The flag alone prints `ERROR: --include-archive requires --recursive` and exits `2`.
- Desired user-visible outcome: A concise `PASS` with both folder lists, or a `FAIL` that names the first violated check.
- Pass/fail: PASS if every condition in Section 3 Pass / Fail holds, FAIL if any one does not.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate the demo track with validate.sh --recursive, first without and then with --include-archive, and list the folders each run checked. Confirm the flag is refused without --recursive. Return PASS or FAIL with the folder lists and the exit codes.
```

### Commands

1. From the repository root, create an isolated scratch directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root.

   ```bash
   export VALIDATE_ARCHIVE_DEMO="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/validate-archive-manual.XXXXXX")" && pwd -P)"
   printf 'VALIDATE_ARCHIVE_DEMO=%s\n' "$VALIDATE_ARCHIVE_DEMO"
   ```

2. Build a `demo` track with three live packets and one archived packet. Each packet holds a bare `spec.md` and its two metadata files.

   ```bash
   cd "$VALIDATE_ARCHIVE_DEMO"
   mkdir -p specs/demo/001-alpha specs/demo/004-beta specs/demo/006-gamma specs/demo/z_archive/002-old
   printf '{"level":"track","specFolder":"demo","description":"Fixture track."}\n' > specs/demo/description.json
   printf '{"schema_version":1,"packet_id":"demo","spec_folder":"demo","parent_id":null,"children_ids":["demo/001-alpha","demo/004-beta","demo/006-gamma"]}\n' > specs/demo/graph-metadata.json
   printf '# Alpha\n\nLedger reconciliation notes. Follow-up work lives in specs/demo/004-beta.\n' > specs/demo/001-alpha/spec.md
   printf '# Beta\n' > specs/demo/004-beta/spec.md
   printf '# Gamma\n' > specs/demo/006-gamma/spec.md
   printf '# Old\n\nLedger reconciliation, first attempt.\n' > specs/demo/z_archive/002-old/spec.md
   printf '{"level":"task","specFolder":"demo/001-alpha","description":"Fixture packet."}\n' > specs/demo/001-alpha/description.json
   printf '{"level":"task","specFolder":"demo/004-beta","description":"Fixture packet."}\n' > specs/demo/004-beta/description.json
   printf '{"level":"task","specFolder":"demo/006-gamma","description":"Fixture packet."}\n' > specs/demo/006-gamma/description.json
   printf '{"level":"task","specFolder":"demo/z_archive/002-old","description":"Ledger reconciliation, first attempt."}\n' > specs/demo/z_archive/002-old/description.json
   printf '{"schema_version":1,"packet_id":"demo/001-alpha","spec_folder":"demo/001-alpha","parent_id":"demo","children_ids":[]}\n' > specs/demo/001-alpha/graph-metadata.json
   printf '{"schema_version":1,"packet_id":"demo/004-beta","spec_folder":"demo/004-beta","parent_id":"demo","children_ids":[]}\n' > specs/demo/004-beta/graph-metadata.json
   printf '{"schema_version":1,"packet_id":"demo/006-gamma","spec_folder":"demo/006-gamma","parent_id":"demo","children_ids":[]}\n' > specs/demo/006-gamma/graph-metadata.json
   printf '{"schema_version":1,"packet_id":"demo/z_archive/002-old","spec_folder":"demo/z_archive/002-old","parent_id":"demo","children_ids":[]}\n' > specs/demo/z_archive/002-old/graph-metadata.json
   cd -
   ```

3. From the repository root, validate the track recursively and keep the folder lines.

   ```bash
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --recursive 2>&1 | grep "Folder:"
   ```

4. Repeat with `--include-archive`.

   ```bash
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --recursive --include-archive 2>&1 | grep "Folder:"
   ```

5. Print one result line per folder for both runs, with each run's exit status.

   ```bash
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --recursive --quiet
   echo "RECURSIVE_EXIT=$?"
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --recursive --include-archive --quiet
   echo "ARCHIVE_EXIT=$?"
   ```

6. Pass the flag without `--recursive`.

   ```bash
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --include-archive
   echo "FLAG_ALONE_EXIT=$?"
   ```

7. Remove the scratch directory.

   ```bash
   rm -rf "$VALIDATE_ARCHIVE_DEMO"
   ```

### Expected

Step 3 prints four lines. `<demo>` stands for the printed `VALIDATE_ARCHIVE_DEMO` path.

```text
  Folder: <demo>/specs/demo
  Folder: <demo>/specs/demo/001-alpha
  Folder: <demo>/specs/demo/004-beta
  Folder: <demo>/specs/demo/006-gamma
```

Step 4 prints the same four lines and a fifth for the archived packet.

```text
  Folder: <demo>/specs/demo
  Folder: <demo>/specs/demo/001-alpha
  Folder: <demo>/specs/demo/004-beta
  Folder: <demo>/specs/demo/006-gamma
  Folder: <demo>/specs/demo/z_archive/002-old
```

Step 5 prints four result lines and `RECURSIVE_EXIT=2`, then five result lines and `ARCHIVE_EXIT=2`. The track root passes. Every packet fails, because a bare `spec.md` is not a complete packet, and that failure is what makes both runs exit `2`.

```text
RESULT: PASSED (errors=0 warnings=0)
RESULT: FAILED (errors=7 warnings=1)
RESULT: FAILED (errors=7 warnings=1)
RESULT: FAILED (errors=7 warnings=1)
RECURSIVE_EXIT=2
RESULT: PASSED (errors=0 warnings=0)
RESULT: FAILED (errors=7 warnings=1)
RESULT: FAILED (errors=7 warnings=1)
RESULT: FAILED (errors=7 warnings=1)
RESULT: FAILED (errors=8 warnings=1)
ARCHIVE_EXIT=2
```

Step 6 prints the refusal and `FLAG_ALONE_EXIT=2`.

```text
ERROR: --include-archive requires --recursive
Usage: ./validate.sh <folder-path> --recursive --include-archive
```

### Evidence

Capture the printed `VALIDATE_ARCHIVE_DEMO` path, the folder lines of steps 3 and 4, the result lines and `_EXIT` lines of step 5 and the full output of step 6. The error and warning counts in step 5 belong to the rule set of the checkout under test, so record them as printed and grade the number of result lines.

### Pass / Fail

- **Pass**: step 3 prints four `Folder:` lines and none holds `z_archive`, step 4 prints five and the fifth ends in `specs/demo/z_archive/002-old`, step 5 prints four result lines for the first run and five for the second, and step 6 prints `ERROR: --include-archive requires --recursive` with `FLAG_ALONE_EXIT=2`.
- **Fail**: the run without the flag reports a `z_archive` folder, the run with the flag does not report `002-old`, the two runs print the same number of result lines, or the flag alone is accepted.

### Failure Triage

1. If step 4 prints four lines only, confirm the archived packet from step 2 holds its spec document in the scratch directory and that `z_archive` is a real folder. A `z_archive` that is a symbolic link is not followed.
2. If step 3 already lists the archived packet, read the recursive folder discovery in `runtime/cli/spec/validate.sh` and compare it with the `--include-archive` text in `validate.sh --help`.
3. If no `Folder:` line appears at all, rerun step 3 without the `grep` and read the first error line.
4. Run `npx vitest run runtime/cli/tests/validate-archive-recursive.vitest.ts` from `.skilled/skills/system-spec-kit` and read its first failing assertion before changing this scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario registration |
| [spec-validation-rule-engine.md](../../feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md) | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Recursive folder discovery, the `--include-archive` flag and its refusal without `--recursive` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-archive-recursive.vitest.ts` | Archived track packet, archived sub-track packet, archived phase, flag refusal and linked archive cases |

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$VALIDATE_ARCHIVE_DEMO/specs/demo" --recursive --include-archive

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 495
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/spec-validation-archive-reach.md`
- Destructive: No. The runs pass no `--strict`, so no repair is triggered. The scenario writes its fixture into the scratch directory step 1 created, and step 7 removes that directory.
