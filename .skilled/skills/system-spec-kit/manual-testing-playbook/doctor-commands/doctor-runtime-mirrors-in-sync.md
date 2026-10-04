---
title: "DOC-352 -- Doctor runtime mirrors in sync"
description: "Manual scenario validating that /doctor:runtime-mirrors reports every mirror checker in sync with status OK and writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-runtime-mirrors-in-sync
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-352 -- Doctor runtime mirrors in sync

## 1. OVERVIEW

This scenario validates `/doctor:runtime-mirrors` on a checkout whose mirrors all match their canonical sources. The workflow runs every checker in its check-only form plus the hook-adapter fallback health reads, and reports one verdict per surface.

On this path every surface is in sync, the summary is OK, no repair is suggested, and nothing on disk changes. The command is read-only with no allowed write target.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a healthy checkout reports every surface in sync with `STATUS=OK` and no writes.
- Playbook ID: DOC-352.
- Real user request: `Check whether the runtime mirrors are in sync with the skill sources.`
- Prompt: `Check whether the runtime mirrors are in sync with the skill sources.`
- Preconditions: A disposable copy of the repository whose mirrors were last generated from the current `.skilled` sources, and a user-global Codex hooks configuration that matches the repository's `.codex/hooks.json`.
- Expected execution process: Record the working tree state, run `/doctor:runtime-mirrors`, capture the per-checker table and the summary, and compare the working tree state.
- Expected signals: Each of the eight checker commands exits 0, and the Codex hooks installer prints its explicit OK output. The per-checker table shows one row per surface in the workflow's order, each marked in sync with no repair. The hook-adapter block reports no `host:event:path` rows and a degraded count of zero. The summary shows `Target: runtime-mirrors`, `Status: OK`, `Mutation class: read-only`, and ends `STATUS=OK` with no recommendation. The `git status --porcelain` output is unchanged.
- Desired user-visible outcome: A per-surface table that shows every mirror in sync and an OK result that suggests no repair.
- Pass/fail: PASS if every checker reports in sync, the summary is OK with no recommendation, and the working tree is unchanged.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check whether the runtime mirrors are in sync with the skill sources.
```

### Commands

1. Create a disposable copy of the repository.
2. In the copy, record `git status --porcelain`.
3. Run `/doctor:runtime-mirrors` through the real runtime.
4. Capture one row per checker, in the workflow's order:
   - `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`
   - `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check`
   - `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check`
   - `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs`
   - `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`
   - `node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree`
   - `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check`
   - `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check`
5. Capture the hook-adapter fallback health result and confirm it lists no `host:event:path` rows and a degraded count of zero.
6. Capture the summary block and confirm `Status: OK` and `STATUS=OK`.
7. Record `git status --porcelain` again and compare it with step 2.

### Expected

Every checker runs in its check-only form and reports in sync, and the Codex hooks installer prints its explicit OK. The hook-adapter rows resolve, so no adapter is reported as degraded.

The per-checker table marks every surface in sync with no repair, and the summary reports OK with no recommendation. The check-only flags mean nothing is regenerated, repaired, or installed, so the working tree is byte-identical after the run.

### Evidence

- The baseline and final `git status --porcelain` outputs.
- The per-checker table with one in-sync row per surface.
- The hook-adapter block with zero degraded adapters.
- The summary block showing `Status: OK` and `STATUS=OK`.
- The Codex hooks installer's explicit OK output.

### Pass / Fail

- **Pass**: Every checker reports in sync, the summary is OK with no recommendation, and the working tree is unchanged.
- **Fail**: A checker reports drift or an error, an adapter is reported degraded, the summary is not OK, or any file changes.

### Failure Triage

If a surface reports drift, start a disposable copy, run the repair command its row names, and rerun the doctor. If a checker returns exit 2, read its error, because a missing build or dependency is reported and never repaired. If the working tree changes, inspect the read-only invariant in `doctor-runtime-mirrors.yaml`, because every checker must run in its check-only form.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/runtime-mirrors.md](../../../../commands/doctor/runtime-mirrors.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml](../../../../commands/doctor/assets/doctor-runtime-mirrors.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt](../../../../commands/doctor/assets/doctor-runtime-mirrors-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:runtime-mirrors

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-352
- Feature name: Doctor runtime mirrors in sync
- Command mode: `/doctor:runtime-mirrors`
- YAML asset: `doctor-runtime-mirrors.yaml`
- Mutation boundary: read-only. Every checker runs in its check-only form and the route has no allowed write target.
- Feature file path: `doctor-commands/doctor-runtime-mirrors-in-sync.md`
