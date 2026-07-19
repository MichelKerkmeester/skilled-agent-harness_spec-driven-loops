---
title: "DR-004: Language reference folder validator"
description: "Verify verify_stack_folders.py confirms every known code-opencode language has an on-disk references folder, allows shared material, flags unknown reference folders, and exits non-zero on a mismatch."
version: 4.1.0.4
---

# DR-004: Language reference folder validator

## 1. OVERVIEW

This scenario verifies the structural guard `assets/scripts/verify_stack_folders.py`. The code-opencode skill documents stack evidence by language, and each known language must resolve to a real `references/<language>/` folder. The `references/shared/` folder is expected cross-language material, not a language folder.

The validator asserts that every known language resolves to an on-disk references folder and that every directory under `references/` is either a known language or `shared/`. It exits non-zero with a per-problem report when the documented language set and the folders disagree.

This is a deterministic command scenario: the contract is exit-code behavior, not runtime routing.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to confirm the documented code-opencode languages still match the folders on disk, and that a stray language folder is caught.

**Exact command intent**:
```
Run the language reference folder validator, confirm a clean pass, then add an orphan references/<fake-language> folder and confirm it fails.
```

**Expected detection**: not applicable — this is a deterministic script run, not a routing decision (no advisor probe, no runtime reference loading).

**Expected behavior**:
- The clean run exits 0 and reports the known languages: `config, javascript, python, shell, typescript`.
- An orphan folder under `references/` that is neither a known language nor `shared` produces exit 1 with an `orphan references folder not a known language` problem line.
- Removing the orphan restores exit 0.

**Desired user-visible outcome**: A structural guard that passes when the documented language set and the folders agree and fails loudly, naming the orphan, when they drift.

## 3. TEST EXECUTION

### Preconditions

1. The validator resolves: `bash: test -f .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py`.
2. The references tree contains the expected language folders plus `shared/`.

### Exact Command Sequence

1. **Clean run**:
   ```
   bash: python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py; printf 'exit=%s\n' "$?"
   ```
2. **Verify**: exit 0 and the report lists `config, javascript, python, shell, typescript`.
3. **Introduce an orphan**:
   ```
   bash: mkdir -p .opencode/skills/sk-code/code-opencode/references/zzz_fake_language
   ```
4. **Re-run and expect failure**:
   ```
   bash: python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py; printf 'exit=%s\n' "$?"
   ```
5. **Verify**: exit 1 and the report names the orphan references folder.
6. **Restore**:
   ```
   bash: rmdir .opencode/skills/sk-code/code-opencode/references/zzz_fake_language
   ```
7. **Re-run** and confirm exit 0 again.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | Clean run exits 0 with `OK: 5 language folder(s) all resolve — config, javascript, python, shell, typescript`. |
| 5 | Orphan run exits 1 with `orphan references folder not a known language`. |
| 7 | After cleanup, the run exits 0 again. |

### Pass/Fail Criteria

- **PASS** iff: the clean run exits 0 AND an orphan folder in `references/` produces exit 1 naming the orphan, per `assets/scripts/verify_stack_folders.py`.
- **PARTIAL** iff: the clean run exits 0 but the orphan run reports the problem without a non-zero exit.
- **FAIL** iff: an orphan is not caught, a known language is wrongly flagged, `shared/` is wrongly flagged, or the clean run errors.

### Failure Triage

1. If the orphan is not caught: verify `verify_stack_folders.py` scans every directory directly under `references/`.
2. If a known language is wrongly flagged: confirm the folder name matches the known language set exactly.
3. If `shared/` is wrongly flagged: confirm it remains in the exempt non-language set.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py` — code-opencode language reference folder validator.
- `.opencode/skills/sk-code/code-opencode/references/` — language reference folders and shared cross-language material checked by the validator.

## 5. SOURCE METADATA

- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (creates and removes a temporary `references/zzz_fake_language/` folder; recovery is the `rmdir` in step 6).
- **Sandbox**: the only mutation is the temporary orphan folder, removed in step 6; verify cleanup before finishing.
- **Concurrent-safe**: No (the temporary orphan folder mutates the live references tree; run this scenario serially).
- **Last validated**: pending first manual run
