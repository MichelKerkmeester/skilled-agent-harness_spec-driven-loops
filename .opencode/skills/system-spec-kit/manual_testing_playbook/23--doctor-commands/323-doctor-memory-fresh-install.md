---
title: "DOC-323 -- Doctor memory fresh install"
description: "Manual scenario validating /doctor:memory bootstrap behavior when the memory continuity-index database does not exist yet."
---

# DOC-323 -- Doctor memory fresh install

## 1. OVERVIEW

This scenario validates `/doctor:memory` on a disposable workspace that has never created the memory continuity-index. It proves the command can bootstrap `mcp_server/database/context-index.sqlite`, create the required schema, run the initial scan, and finish the post-apply gold battery without relying on a prior `memory_index_scan` run.

The behavior is user-observable: a real operator starts with no `context-index.sqlite`, asks for memory bootstrap, and receives an applied report instead of a missing-index failure.

---

## 2. SCENARIO CONTRACT

- Objective: Fresh memory-index bootstrap from an absent `context-index.sqlite`.
- Real user request: `Bootstrap the memory continuity-index from scratch. The workspace has no context-index.sqlite yet.`
- Prompt: `Bootstrap the memory continuity-index from scratch. The workspace has no context-index.sqlite yet.`
- Prompt voice: Natural-human.
- Exact command sequence: create disposable workspace -> confirm `mcp_server/database/context-index.sqlite` is absent -> run `/doctor:memory --incremental=true` -> verify DB file and gold-battery output.
- Expected signals: schema creation or missing-index bootstrap path, initial `memory_index_scan`, nonzero or empty-corpus-safe scan summary, gold-battery exit 0, final status `APPLIED`.
- Desired user-visible outcome: A concise applied verdict naming the new database path and the gold-battery result.
- Pass/fail: PASS if the database exists after the run and post-verify succeeds; FAIL if the command treats the missing DB as an unrecoverable error.

---

## 3. TEST EXECUTION

### Prompt

```
Bootstrap the memory continuity-index from scratch. The workspace has no `context-index.sqlite` yet.
```

### Commands

1. Create a disposable copy of the repository or fresh checkout.
2. In that sandbox, remove only `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` and any matching `context-index.sqlite.pre-doctor-memory.*.bak` files.
3. Confirm the precondition:
   - `test ! -e .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`
4. Run `/doctor:memory --incremental=true` through the real runtime.
5. Capture the complete command transcript, including the setup values resolved by `.opencode/commands/doctor/memory.md`.
6. Confirm the postcondition:
   - `test -s .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`
7. Capture the Phase 4 gold-battery summary and final state-log path.

### Expected

The command resolves `intent=APPLY`, loads `.opencode/commands/doctor/assets/doctor_memory.yaml`, creates the missing schema through `memory_index_scan`, and reports an applied result. The gold battery succeeds against either the empty corpus floor or the initial indexed seed, with no rollback.

### Evidence

- Pre-run `test ! -e` output or shell transcript proving the DB was absent.
- `/doctor:memory --incremental=true` transcript.
- Post-run `test -s` output proving `context-index.sqlite` exists.
- State log showing `command: "/doctor:memory"`, `intent: APPLY`, `incremental: true`, and `status: APPLIED`.
- Gold-battery summary with exit 0 or equivalent pass indicator.

### Pass / Fail

- **PASS**: `context-index.sqlite` exists and is nonempty after the run, `memory_index_scan` reports bootstrap or scan completion, and gold-battery verification exits 0.
- **FAIL**: The missing DB causes a hard error, the schema is not created, the DB remains absent or zero bytes, or the gold battery fails without rollback evidence.
- **SKIP**: Runtime cannot invoke the real `/doctor:memory` command or the memory MCP tools are unavailable in the sandbox.
- **UNAUTOMATABLE**: Not expected for this scenario; the behavior is directly runnable in a disposable workspace.

### Failure Triage

Check whether `doctor_memory.yaml` reached Phase 3 and called `memory_index_scan({incremental: true, force: false})`. If Phase 0 fails before apply, inspect `.opencode/commands/doctor/memory.md` setup handling for missing database discovery. If Phase 4 fails after a successful scan, rerun the gold-battery memory searches and compare against the baseline counts in the state log.

---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: `.opencode/commands/doctor/memory.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor_memory.yaml`
- Command spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md`
- Decision record: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/decision-record.md`

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-323
- Command under test: `/doctor:memory`
- Mode: single interactive mutation flow
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `23--doctor-commands/323-doctor-memory-fresh-install.md`
- Runtime policy: Real execution only; no mocked database creation.
- Destructive: Yes, but sandbox-only; never remove the live workspace index.
