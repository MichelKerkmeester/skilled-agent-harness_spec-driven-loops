---
title: "Implementation Plan: Phase 7: install-guidance-and-setup-helper"
description: "Write a four-mode setup helper that derives every path from HOME, write an install reference from the iteration-015 facts, and prove both in a throwaway home with the operator's installs snapshotted before and after."
trigger_phrases:
  - "install guidance and setup helper plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: install-guidance-and-setup-helper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash for the helper. The launcher it writes is a POSIX `sh` script. Markdown for the reference. |
| **Framework** | None. npm installs the two CLI packages into throwaway prefixes. |
| **Storage** | None. The helper writes launcher and symlink files only. |
| **Testing** | `bash -n` for syntax. Throwaway proof runs for each mode. `validate_document.py` for the reference. |

### Overview
The helper takes one of four modes. `both` installs v1 into the default prefix under HOME, installs v2 into a second prefix, and writes the launcher last. `v1` and `v2` each refuse when the other version already resolves. `check` reads the two names and classifies each by output shape. Every path comes from HOME, so a throwaway HOME isolates the whole run. The reference is written from iteration-015, and each claim in it is labelled confirmed, documented or unknown.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator snapshot is saved before any proof (step 1).
- [ ] The throwaway HOME and npm cache paths exist under `scratch/`.
- [ ] Q6 has a recorded answer, or the snapshot in step 1 is the evidence for it.

### Definition of Done
- [ ] Every acceptance criterion is Met or Waived with an ADR.
- [ ] The operator snapshot after the proof equals the snapshot before it.
- [ ] Both proof runs and the reference validation are recorded with output.
- [ ] `scratch/` holds no proof output after the phase closes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One script with four modes. Every path is derived from `$HOME`, and the script never uses a path from the real environment for a write.

### Key Components
- **Constants**: `V1_PKG=opencode-ai@1.19.3`, `V2_PKG=@opencode/cli@2.0.32`, `V1_PREFIX=$HOME/.local`, `V2_PREFIX=$HOME/.local/opencode-v2`, `BIN=$HOME/.local/bin`, `DB_DIR=$HOME/.local/share/opencode`. These match iteration-015 lines 147 to 151.
- **Launcher**: `$BIN/opencode2`, a `/bin/sh` script that defaults `OPENCODE_DB=opencode-v2.db` and execs the v2 binary.
- **Step printer**: every step prints the rollback line it would need. The script prints it and never runs it.

### Data Flow
`both` runs the v1 install into `V1_PREFIX`, then the v2 install into `V2_PREFIX`. It writes the launcher only when the content differs or the file is absent, and it verifies both names last. `check` reads the names through `BIN` and the PATH, and it prints each shape. The reference documents the same flow for a human reader.

### Required inventories
- The four modes and their exit codes: 0 for success, 1 for refusal or failure, and 2 for usage.
- The path variables: the script reads HOME only, so a throwaway HOME covers every write.

### Adversarial table

| Case class | Input | Expected |
|------------|-------|----------|
| Delimiter | `--version` output with a trailing carriage return | parsed as the same version |
| Joined input | `opencode v2.0.32` on the first line and a warning on the second | `v2`, from the first matching line |
| Outside root | `V2_PREFIX/bin` already on PATH | abort with the iteration-015 message |
| No-op | empty `--version` output | classified unknown, and `check` reports it |
| Fallback | npm missing | exit 1 with a message, and no write |
| Hostile env | a HOME containing spaces | every path quoted, and the proof passes |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds a helper and a reference, and it changes no existing behaviour. Iteration-015 F7 confirmed that the skill has no install guidance today, so no existing text is replaced.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and their state.

### 4.1 Ordered steps

1. **Operator snapshot (Orchestrator).** Record the operator's install state before any proof. Read the names and link targets in `~/.local/bin` and `~/.local/opencode-v2/bin`. Run `--version` on each name. Record the process list and the modification times of the top-level entries in `~/.config/opencode` and `~/.local/share/opencode`. Save everything under `scratch/snapshot-before.txt`. Rollback: none, because this step only reads.
2. **Helper (Luna).** Create `scripts/opencode-setup.sh` with the four modes, the constants, the step printer and the refusals. Rollback: delete the file.
3. **Syntax (Orchestrator).** Run `bash -n` on the script. Rollback: none, because this step only reads.
4. **Helper review (DeepSeek).** Review the script against the iteration-015 design and `sk-code/sk-code-opencode`, findings first. Make no edits. Rollback: none.
5. **Fixes (Luna).** Fix each finding the orchestrator confirms. Copy the script to `scratch/backup/fix-<n>/` before each fix. Rollback: restore from that copy.
6. **Proof: both (Orchestrator).** Run `both` with a throwaway HOME and the PATH below. Record the exit status, the two version lines and the launcher trace. Rollback: delete `scratch/home/`.
7. **Proof: idempotence (Orchestrator).** Run `both` a second time and compare the hashes of the launcher and the link targets. Expect no change. Rollback: none, because this step only reads.
8. **Proof: check (Orchestrator).** Run `check` on the throwaway layout. Record the output and compare the hashes again. Rollback: none.
9. **Proof: refusals (Orchestrator).** Put a fake `opencode` that prints `1.19.3` on the throwaway PATH, and run `v2`. Then put a fake that prints `opencode v2.0.32`, and run `v1`. Expect exit 1 and the hint both times. Rollback: delete `scratch/fakes/`.
10. **Reference draft (DeepSeek).** Write `references/install-and-versions.md` in the sk-doc skill mode from iteration-015 and research sections 7 and 8. Label each claim confirmed, documented or unknown. Rollback: delete the file.
11. **Reference review (Luna).** Check each claim in the reference against iteration-015 and research sections 7 and 8, and report each mismatch. Make no edits. Rollback: none.
12. **Reference validation (Orchestrator).** Run `validate_document.py` on the reference with `--type install_guide`. Record the output. Rollback: none.
13. **Final snapshot (Orchestrator).** Repeat step 1 and compare it with `scratch/snapshot-before.txt`. Expect no difference. Rollback: none.
14. **Cleanup (Orchestrator).** After the implementation summary records the proof output, delete the whole `scratch/` content except `.gitkeep`. Rollback: none.

### 4.2 Dispatch plan

- **Luna, GPT-6 Luna max fast through cli-codex.** Steps 2, 5 and 11. Code, and the review of the reference.
- **DeepSeek, DeepSeek V4.1 Flash max through cli-devin.** Steps 4 and 10. Review of the script, and the reference draft.
- **Orchestrator.** Steps 1, 3, 6 to 9, 12, 13 and 14. Every npm install and every proof run.
- **Cross-family rule.** DeepSeek reviews Luna's script. Luna reviews DeepSeek's reference.

### 4.3 Proof environment

Every proof run uses this environment. The scratch folder is `$PWD/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/007-install-guidance-and-setup-helper/scratch`, and it must be absolute before the run starts:

```
export HOME="$SCRATCH/home"
export PATH="$SCRATCH/home/.local/bin:/opt/homebrew/bin:/usr/bin:/bin"
export npm_config_cache="$SCRATCH/npm-cache"
```

- The PATH omits the operator's `~/.local/bin`, so no operator binary can answer for a throwaway name.
- The orchestrator checks that `command -v opencode` resolves only inside `$SCRATCH/home` before each run. If it resolves elsewhere, the run stops.
- No proof step runs `uninstall`, `upgrade` or `service`. The process list is read with `ps`, and nothing is stopped.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | The helper script | `bash -n` |
| Proof | `both`, idempotence, `check`, refusals | The throwaway environment in section 4.3 |
| Snapshot | Operator installs and config folders | `ps`, `ls`, `stat` before and after |
| Document | The reference | `validate_document.py --type install_guide` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm registry | External | Unknown until step 6 | The proof reports BLOCKED |
| Iteration-015 install design | Internal | Green. Read. | Wrong constants or launcher text |
| Research sections 7 and 8 | Internal | Green. Read. | Wrong gap list |
| `validate_document.py` | Internal | Green. The file exists. | The reference cannot pass its check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the operator snapshot differs after the proof, or the proof writes outside `scratch/`.
- **Procedure**: stop the proof. Report the differing paths, with their before and after values, to the operator. Do not restore operator files. Delete the new helper and the reference only if the operator asks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (Snapshot) ──► Step 2 (Helper) ──► Step 3 (Syntax) ──► Step 4 (Review) ──► Step 5 (Fixes)
                                                                                      │
                                   Step 6 (Proof both) ──► Step 7 (Idempotence) ──► Step 8 (Check) ──► Step 9 (Refusals)
                                                                                      │
Step 10 (Reference) ──► Step 11 (Review) ──► Step 12 (Validation) ───────────────────┘
                                                                                      │
                                                        Step 13 (Final snapshot) ──► Step 14 (Cleanup)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Snapshot | None | Every proof |
| Helper and fixes | Snapshot | Proof |
| Reference | Helper, because the reference cites the helper's behaviour | Validation |
| Final snapshot | Every proof and the validation | Cleanup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Snapshot and helper (steps 1 to 5) | Medium | Two Luna dispatches, one DeepSeek review, one orchestrator pass |
| Proof (steps 6 to 9) | Medium | One orchestrator pass with the throwaway environment |
| Reference (steps 10 to 12) | Low | One DeepSeek draft, one Luna review, one validation |
| Close (steps 13 and 14) | Low | One orchestrator pass |
| **Total** | | **About five dispatches and three orchestrator passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The operator snapshot is saved (step 1).
- [ ] The proof environment in section 4.3 is set, and `command -v opencode` resolves inside the scratch home only.
- [ ] No feature flag exists. The helper is new, so the rollback is deletion.

### Rollback Procedure
1. Stop any proof that writes outside `scratch/`.
2. Compare the final snapshot with the first one, and report every difference.
3. Delete `scratch/` after the operator has the proof record.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The proof runs in a throwaway home.
<!-- /ANCHOR:enhanced-rollback -->
