---
title: "DR-004: STACK_FOLDERS validator"
description: "Verify verify_stack_folders.py confirms every declared surface resolves to on-disk references and assets folders, flags an orphan surface folder in either tree, and exits non-zero on a mismatch."
version: 3.5.0.1
---

# DR-004: STACK_FOLDERS validator

## 1. OVERVIEW

This scenario verifies the structural guard `assets/scripts/verify_stack_folders.py`. The smart router declares each surface in a `STACK_FOLDERS` map in SKILL.md and then loads that surface's patterns from `references/<surface>/` and `assets/<surface>/`. If a declared surface had no folders, or a surface-shaped folder existed with no declaration, the router would silently load nothing or drift from its documented contract.

The validator parses the `STACK_FOLDERS` literal out of SKILL.md and asserts that every declared surface resolves to both an on-disk references folder and an assets folder, and that no orphan surface folder exists undeclared in either the `references/` or the `assets/` tree. The shared `universal/` material and the `scripts/` tooling directory are exempt by design. It exits non-zero with a per-problem report when the declaration and the folders disagree.

This is a deterministic command scenario: the contract is exit-code behavior, not surface routing.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to confirm the STACK_FOLDERS declaration still matches the folders on disk, and that a stray surface folder is caught.

**Exact command intent**:
```
Run the STACK_FOLDERS validator, confirm a clean pass, then add an orphan assets/<fake-surface> folder and confirm it fails.
```

**Expected detection**: not applicable — this is a deterministic script run, not a routing decision (no advisor probe, no surface/reference loading).

**Expected behavior**:
- The clean run exits 0 and reports that every declared surface resolves (e.g. `motion_dev, opencode, webflow`).
- An orphan folder under `references/` or `assets/` that matches no declared surface (and is neither `universal` nor `scripts`) produces exit 1 with an `orphan ... folder not declared in STACK_FOLDERS` problem line.
- Removing the orphan restores exit 0.

**Desired user-visible outcome**: A structural guard that passes when the declaration and the folders agree and fails loudly, naming the orphan, when they drift.

## 3. TEST EXECUTION

### Preconditions

1. The validator resolves: `bash: test -f .opencode/skills/sk-code/assets/scripts/verify_stack_folders.py`.
2. `.opencode/skills/sk-code/SKILL.md` contains the `STACK_FOLDERS` map.

### Exact Command Sequence

1. **Clean run**:
   ```
   bash: python3 .opencode/skills/sk-code/assets/scripts/verify_stack_folders.py > /tmp/skc-DR004-clean.txt; echo "exit=$?"
   ```
2. **Verify**: exit 0 and the report lists every declared surface.
3. **Introduce an orphan**:
   ```
   bash: mkdir -p .opencode/skills/sk-code/assets/zzz-fake-surface
   ```
4. **Re-run and expect failure**:
   ```
   bash: python3 .opencode/skills/sk-code/assets/scripts/verify_stack_folders.py > /tmp/skc-DR004-orphan.txt; echo "exit=$?"
   ```
5. **Verify**: exit 1 and the report names the orphan assets folder.
6. **Restore**:
   ```
   bash: rmdir .opencode/skills/sk-code/assets/zzz-fake-surface
   ```
7. **Re-run** and confirm exit 0 again.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | Clean run exits 0 with `OK: ... declared surface(s) all resolve`. |
| 5 | Orphan run exits 1 with `orphan assets folder not declared in STACK_FOLDERS`. |
| 7 | After cleanup, the run exits 0 again. |

### Pass/Fail Criteria

- **PASS** iff: the clean run exits 0 AND an orphan folder in `references/` or `assets/` produces exit 1 naming the orphan, per `assets/scripts/verify_stack_folders.py`.
- **PARTIAL** iff: the clean run exits 0 but the orphan run reports the problem without a non-zero exit.
- **FAIL** iff: an orphan is not caught, or a declared surface is wrongly flagged, or the clean run errors.

### Failure Triage

1. If the orphan is not caught: verify both the `references/` and `assets/` trees are scanned in `verify_stack_folders.py`.
2. If a declared surface is wrongly flagged: confirm `universal` and `scripts` are in the exempt set.
3. If parsing fails: verify the `STACK_FOLDERS` literal in SKILL.md is a parseable dict.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/assets/scripts/verify_stack_folders.py` — STACK_FOLDERS-to-disk surface validator.
- `.opencode/skills/sk-code/SKILL.md` — `STACK_FOLDERS` declaration the validator parses.

## 5. SOURCE METADATA

- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (creates and removes a temporary `assets/zzz-fake-surface/` folder; recovery is the `rmdir` in step 6).
- **Sandbox**: the only mutation is the temporary orphan folder, removed in step 6; verify cleanup before finishing.
- **Concurrent-safe**: No (the temporary orphan folder mutates the live assets tree; run this scenario serially).
- **Last validated**: pending first manual run
