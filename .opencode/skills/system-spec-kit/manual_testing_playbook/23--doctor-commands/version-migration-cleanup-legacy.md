---
title: "DOC-346 -- Version migration cleanup legacy"
description: "Manual scenario validating /doctor:update --cleanup-legacy per-file prompts and confirmed-only legacy deletion after migration."
---

# DOC-346 -- Version migration cleanup legacy

## 1. OVERVIEW

This scenario validates opt-in cleanup for legacy migration artifacts. Starting from the post-DOC-345 state where legacy files are present and flagged, it runs `/doctor:update --cleanup-legacy` and verifies the command prompts before each deletion, deletes only confirmed files, and preserves skipped files.

The scenario protects ADR-008. Detection can be automatic, but deletion must be per-file and user-confirmed.

---

## 2. SCENARIO CONTRACT

- Objective: Per-file legacy cleanup prompts with confirmed-only deletion.
- Playbook ID: DOC-346.
- Real user request: `Run /doctor:update --cleanup-legacy. Per-file prompt before each deletion.`
- Prompt: `Run /doctor:update --cleanup-legacy. Per-file prompt before each deletion.`
- Preconditions: Post-DOC-345 or equivalent disposable workspace with manifest-listed legacy files present and previously flagged.
- Expected execution process: Run cleanup, answer a mix of confirm and skip choices, then verify deletions match exactly the user choices.
- Expected signals: each known legacy file gets a prompt; confirmed files are deleted; skipped or refused files remain; state log records cleanup choices.
- Desired user-visible outcome: A cleanup verdict proving no legacy file is deleted without an explicit per-file confirmation.
- Pass/fail: PASS if prompt sequence covers every known legacy file and filesystem results match choices.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update --cleanup-legacy. Per-file prompt before each deletion.
```

### Commands

1. Start from the post-DOC-345 disposable workspace or create an equivalent workspace with manifest-listed legacy files.
2. Record the pre-cleanup list of legacy files, including `memory/*.md` and `mcp_server/database/memory.db` when present.
3. Run `/doctor:update --cleanup-legacy` through the real runtime.
4. For at least one legacy file, confirm deletion.
5. For at least one legacy file, refuse or skip deletion when more than one file is present.
6. Capture every per-file prompt and user choice.
7. Record the post-cleanup legacy file list.
8. Capture `.doctor-update.last-run.json`.

### Expected

The command reads `migration-manifest.json`, detects only manifest-listed legacy files, and prompts before deleting each one. Files confirmed by the operator are deleted. Files skipped or refused by the operator remain. No unknown file is deleted, and no batch silent deletion occurs.

### Evidence

- Pre-cleanup legacy file listing.
- `/doctor:update --cleanup-legacy` prompt transcript showing one prompt per known legacy file.
- User choices for confirm and skip/refuse paths.
- Post-cleanup file listing proving confirmed files were deleted and refused files were preserved.
- State log cleanup section or equivalent record of choices.

### Pass / Fail

- **PASS**: every manifest-listed legacy file is prompted individually, confirmed deletions occur, skipped files remain, and no unknown file is touched.
- **FAIL**: any file is deleted without a prompt, prompts are batched without per-file choice, skipped files are removed, or unknown files are targeted.
- **SKIP**: the disposable workspace has no manifest-listed legacy files to clean up.
- **UNAUTOMATABLE**: the runtime cannot invoke `/doctor:update --cleanup-legacy` interactively.

### Failure Triage

If deletion occurs without a prompt, inspect `doctor_update.yaml` Phase 9 and ADR-008 cleanup policy. If unknown files are targeted, inspect manifest matching and reject heuristic cleanup. If skipped files disappear, treat it as a cleanup safety failure.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-346
- Feature name: Version migration cleanup legacy
- Command mode: `/doctor:update --cleanup-legacy`
- YAML asset: `doctor_update.yaml`
- Manifest asset: `migration-manifest.json`
- Cleanup policy: per-file prompt; never silent deletion.
- Runtime policy: Real interactive cleanup only.
- Destructive: Yes; disposable post-migration workspace only.
- Feature file path: `23--doctor-commands/version-migration-cleanup-legacy.md`
