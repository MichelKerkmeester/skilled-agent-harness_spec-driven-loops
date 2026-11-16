---
title: "Tasks: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude user hook sync tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

The task lines use two shell variables. Export them once from the worktree root before any `Verify:` line:

```bash
export S=.skilled/bin/sync-claude-user-hooks.mjs
export K=.skilled/skills/system-spec-kit
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the stale paths in the hand-made user copy (`~/.claude/settings.json`). Verify: the path check in `spec.md` Measured Behavior prints four `MISSING` lines. Evidence: recorded in `spec.md`.
- [x] T002 Measure whether Claude Code runs an identical hook once across the user and project files (`.claude/settings.json`). Verify: a `claude -p ... --debug-file` run shows one `finished with status` line per Skilled hook. Evidence: six hooks at 1 each, Orca hook also ran, recorded in `spec.md`.
- [x] T003 Record the Codex baseline before moving its helpers (`.skilled/bin/tests/install-codex-hooks-source-root.test.cjs`). Verify: `node --test .skilled/bin/tests/install-codex-hooks-source-root.test.cjs` prints `pass 20` and `fail 0`. Evidence: 20/0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move hook identity, ownership, primary-checkout and atomic-write helpers into a shared module (`.skilled/bin/lib/user-hook-file.mjs`). Verify: `rg -c 'export function (hookIdentity|validateHooksDocument|sourceRootRelative|ownershipKey|isRepoOrphan|checkoutKind|assertSafeRepoAnchor|atomicWrite|readHooksFile)' .skilled/bin/lib/user-hook-file.mjs` prints 9. Evidence: file created.
- [x] T005 Import the moved helpers with no behavior change (`.skilled/bin/install-codex-hooks.mjs`). Verify: `node .skilled/bin/install-codex-hooks.mjs --check` prints OK. Evidence: OK on main and worktree; T003 suite 20/0 after.
- [x] T006 Add the sync script with `--session-start`, `--check`, `--dry-run`, `--target`, `--repo` and `--allow-worktree` (`$S`). Verify: `node $S --dry-run --target <copy>` reports removed, added and kept counts. Evidence: 20 removed, 36 added, 16 kept on a copy of the real user file.
- [x] T007 Keep session mode silent and inert unless the switch is on and the checkout is primary; refuse a manual write from a linked worktree without `--allow-worktree` (`$S`). Verify: the switch-unset and linked-worktree cases in `.skilled/bin/tests/sync-claude-user-hooks.test.cjs` pass. Evidence: both pass.
- [x] T008 Back up the user file once and write through a temp file and a rename, skipping a write when nothing differs (`$S`). Verify: the second-run and backup-kept cases pass. Evidence: both pass.
- [x] T009 Add the default-off concern (`.skilled/hooks/shared/hook-flags.cjs`). Verify: `rg -n 'claude-user-hook-sync' .skilled/hooks/shared/hook-flags.cjs` prints the `DEFAULT_OFF` line with `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED`. Evidence: line 107.
- [x] T010 Register the SessionStart binding and the Claude `requireTree` (`$K/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `rg -n '"requireTree"|"id": "claude-user-hook-sync"' $K/runtime/cli/runtime-mirrors/hook-registry.json` prints two lines. Evidence: lines 8 and 1799; group 0, slot 8, timeout 5.
- [x] T011 Render the presence guard after the `cd` for a runtime that names `requireTree`, and re-render the project file (`$K/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`, `.claude/settings.json`). Verify: `node $K/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS. Evidence: PASS on the 36-hook registry; only `.claude/settings.json` of the four settings files changed.
- [x] T012 [P] Add the hook mirror (`.claude/hooks/sync-claude-user-hooks.mjs`). Verify: `node $K/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0. Evidence: exit 0; the symlink points at `$S`.
- [x] T013 [P] Document the switch and the script (`$K/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml`, `.env.example`, `.skilled/hooks/hook-flags.env.example`, `.skilled/bin/README.md`, `.claude/hooks/README.md`). Verify: `rg -l 'SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED' $K/runtime/ENV-REFERENCE.md .skilled/commands/doctor/assets/doctor-env.yaml .env.example .skilled/hooks/hook-flags.env.example | wc -l` prints 4. Evidence: env-reference-drift 5/5; `.claude/hooks/README.md` mirror count fixed to 31.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the sync suite (`.skilled/bin/tests/sync-claude-user-hooks.test.cjs`). Verify: `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs` prints `pass 8` and `fail 0`. Evidence: 8/0. Three mutants (switch check, worktree check, backup-once removed) each fail one named case.
- [x] T015 Run the Codex suite after the move (`.skilled/bin/tests/install-codex-hooks-source-root.test.cjs`). Verify: prints `pass 20` and `fail 0`. Evidence: 20/0.
- [x] T016 Run the registry rendering suite (`$K/runtime/cli/tests/hook-registration-sync.vitest.ts`). Verify: `cd $K && npx vitest run runtime/cli/tests/hook-registration-sync.vitest.ts --config vitest.config.ts` prints 9 passed. Evidence: 9/9, binding count 119 and the guard case.
- [x] T017 [P] Run the parity suites (`$K/runtime/tests/hook-adapter-path-parity.vitest.ts`, advisor `settings-driven-invocation-parity.vitest.ts`). Verify: both print 0 failed. Evidence: 153/153, settings parity 41/41, stress parity 2/2.
- [x] T018 [P] Run the env catalogue suite (`$K/runtime/tests/env-reference-drift.vitest.ts`). Verify: prints 5 passed. Evidence: 5/5.
- [x] T019 [P] Run the node tests that load `hook-flags.cjs` and the doctor batteries. Verify: each prints `fail 0`. Evidence: 35 files 1087/0; doctor hook-wiring 3/0, git-setup-check 83/0, overlay-engine strict 17/0, follow-up 42/0, repin 26/0, quality-gate-layers 10/0, source-root-consumers 9/0.
- [x] T020 Run every rendered Claude command in an empty folder (`.claude/settings.json`). Verify: each exits 0 with no output. Evidence: 36 of 36; PreToolUse Bash hooks still run in the repo; env-secret-guard denies a dotenv read the same on main and worktree.
- [x] T021 Sync a copy of the real user file (`~/.claude/settings.json` copy). Verify: `node $S --target <copy>` then `node $S --check --target <copy>` prints OK. Evidence: 20 owned removed, 36 added, 16 non-owned kept; non-hook keys and Orca hooks equal; Skilled hooks equal the project file.
- [x] T022 Validate this packet (`specs/hooks-plugins-extensions/hook-platform/009-claude-user-hook-sync`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/hook-platform/009-claude-user-hook-sync --strict` prints `RESULT: PASSED`.
- [x] T023 Enable the switch in the primary checkout and run one sync after the push (operator-approved step) (`hook-flags.env`, `~/.claude/settings.json`). Verify: `node $S --check` in the primary checkout prints OK.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node $S --check` prints OK in the primary checkout after T023
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task stays `[B]` with its reason on the line. A P0 item blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3\. ARCHITECTURE' plan.md` prints 1.
- [x] CHK-003 [P1] The Claude dedupe dependency is measured: T002 evidence is in `spec.md` Measured Behavior.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The new scripts parse: `node --check .skilled/bin/sync-claude-user-hooks.mjs` and `node --check .skilled/bin/lib/user-hook-file.mjs` exit 0.
- [x] CHK-011 [P0] Session mode prints nothing: the switch-unset case in T014 asserts empty output.
- [x] CHK-012 [P1] A malformed user file is left unchanged with exit 1: the not-a-JSON-object case in T014 passes.
- [x] CHK-013 [P1] The Codex installer reuses the shared helpers: `rg -c 'user-hook-file' .skilled/bin/install-codex-hooks.mjs` prints at least 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` is `Met`, the live enable included.
- [x] CHK-021 [P0] Manual testing complete: T020 and T021 evidence recorded.
- [x] CHK-022 [P1] Edge cases tested: missing user file, mixed owned and non-owned group, linked worktree; T014 passes.
- [x] CHK-023 [P1] Error scenarios validated: `--check` drift exits 1 and a malformed file exits 1; T014 passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the script reads only two settings files and writes the target, its backup and a temp file beside it.
- [x] CHK-031 [P0] Input validation implemented: `readHooksFile` runs `validateHooksDocument` on both files before any merge, and the not-an-object case passes.
- [x] CHK-032 [P1] The dotenv guard is unchanged by the rendered guard: env-secret-guard denies a dotenv read the same on main and worktree.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same switch: `rg -l 'SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED' spec.md plan.md tasks.md | wc -l` prints 3.
- [x] CHK-041 [P1] The env catalogue lists the switch: env-reference-drift 5/5.
- [x] CHK-042 [P2] README updated: `.skilled/bin/README.md` names the script and `.claude/hooks/README.md` counts 31 mirrors.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the sync tests write under the OS temp folder and remove it.
- [x] CHK-051 [P1] scratch/ cleaned before completion: `ls -A scratch` prints `.gitkeep` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
