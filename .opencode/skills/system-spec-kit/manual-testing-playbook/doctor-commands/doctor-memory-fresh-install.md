---
title: "DOC-323 -- Doctor memory fresh install"
description: "Manual scenario validating /doctor memory bootstrap behavior when the memory continuity-index database does not exist yet."
version: 3.6.0.11
id: doctor-commands-doctor-memory-fresh-install
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-323 -- Doctor memory fresh install

## 1. OVERVIEW

This scenario validates `/doctor memory` on a disposable workspace that has never created the memory continuity-index. It proves the command can bootstrap the active resolved profile database (ollama profile when GGUF runtime is installed, hf-local profile otherwise), create the required schema, run the initial scan, and finish the post-apply gold battery without relying on a prior `memory_index_scan` run.

The behavior is user-observable: a real operator starts with no active resolved profile Memory MCP database, asks for memory bootstrap, and receives an applied report instead of a missing-index failure.

---

## 2. SCENARIO CONTRACT

- Objective: Fresh memory-index bootstrap from an absent active resolved profile database.
- Real user request: `Bootstrap the memory continuity-index from scratch. The workspace has no active Memory MCP database yet.`
- Prompt: `Bootstrap the memory continuity-index from scratch. The workspace has no active Memory MCP database yet.`
- Prompt voice: Natural-human.
- Exact command sequence: create disposable workspace -> confirm the active profile DB is absent (e.g., `context-index__ollama__unsloth-bge-base-en-v1.5-gguf__768__q8.sqlite` when GGUF runtime installed, else `context-index__hf-local__onnx-community_bge-base-en-v1.5-onnx__768__q8.sqlite`) -> run `/doctor memory --incremental=true` -> verify DB file and gold-battery output.
- Expected signals: schema creation or missing-index bootstrap path, initial `memory_index_scan`, nonzero or empty-corpus-safe scan summary, gold-battery exit 0, final status `APPLIED`.
- Desired user-visible outcome: A concise applied verdict naming the new database path and the gold-battery result.
- Pass/fail: PASS if the database exists after the run and post-verify succeeds; FAIL if the command treats the missing DB as an unrecoverable error.

---

## 3. TEST EXECUTION

### Prompt

```
Bootstrap the memory continuity-index from scratch. The workspace has no active Memory MCP database yet.
```

### Commands

1. Create a disposable copy of the repository or fresh checkout.
2. In that sandbox, ensure the active resolved profile DB and matching profile-specific `*.pre-doctor-memory.*.bak` files are absent.
3. Confirm the precondition:
   - `test -z "$(ls .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite 2>/dev/null)"`
4. Run `/doctor memory --incremental=true` through the real runtime.
5. Capture the complete command transcript, including the setup values resolved by `.opencode/commands/doctor/speckit.md`.
6. Confirm the postcondition:
   - `ls .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite >/dev/null`
7. Capture the Phase 4 gold-battery summary and final state-log path.

### Expected

The command resolves `intent=APPLY`, loads `.opencode/commands/doctor/assets/doctor-memory.yaml`, creates the missing schema through `memory_index_scan`, and reports an applied result. The gold battery succeeds against either the empty corpus floor or the initial indexed seed, with no rollback.

### Evidence

- BLOCKED before running the scenario command sequence.
- Real observed scenario command 1: `Create a disposable copy of the repository or fresh checkout.`
- Real active execution constraint from the operator request: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- Real active allowed write path from the operator request: `.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-memory-fresh-install.md (this file only)`
- Because command 1 requires creating a disposable repository copy and the active execution constraint forbids creating any file other than this scenario file, the sandbox precondition could not be established without violating the allowed write paths.
- `/doctor memory --incremental=true` was not run.
- Post-run database existence check was not run.
- State log was not produced.
- Gold-battery summary was not produced.

### Pass / Fail

- **BLOCKED**: The scenario requires creating a disposable repository copy or fresh checkout, but the active operator constraints allow writes only to this scenario file, so the required sandbox precondition could not be created and the real `/doctor memory --incremental=true` run could not be performed.

### Failure Triage

Check whether `doctor-memory.yaml` reached Phase 3 and called `memory_index_scan({incremental: true, force: false})`. If Phase 0 fails before apply, inspect `.opencode/commands/doctor/speckit.md` setup handling for missing database discovery. If Phase 4 fails after a successful scan, rerun the gold-battery memory searches and compare against the baseline counts in the state log.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: `.opencode/commands/doctor/speckit.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor-memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-323
- Command under test: `/doctor memory`
- Mode: single interactive mutation flow
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `doctor-commands/doctor-memory-fresh-install.md`
- Runtime policy: Real execution only; no mocked database creation.
- Destructive: Yes, but sandbox-only; never remove the live workspace index.
