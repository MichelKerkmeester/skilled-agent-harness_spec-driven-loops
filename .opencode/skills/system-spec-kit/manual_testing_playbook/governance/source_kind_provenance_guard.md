---
title: "447 -- Source Kind Provenance Guard"
description: "Manual check that write provenance is server-derived, forged source_kind inputs are rejected, and automated writes cannot overwrite protected manual or constitutional fields."
version: 3.6.0.1
id: governance-source-kind-provenance-guard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 447 -- Source Kind Provenance Guard

## 1. OVERVIEW

This scenario validates the always-on write-ingress provenance guard. New records carry server-derived `source_kind`; callers cannot forge `source_kind` or internal provenance context; automated writes that would overwrite protected manual or constitutional fields must be blocked before mutation.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm server-derived provenance and protected-field overwrite refusal.
- Real user request: `Validate that callers cannot forge memory source_kind and automated writes cannot overwrite manual protected fields.`
- Prompt: `Validate source_kind provenance guarding with normal writes, forged inputs, and automated protected-field overwrite attempts.`
- Expected execution process: Save a manual sandbox record, inspect derived `source_kind`, attempt a forged `source_kind` update, attempt a forged `__provenanceContext`, then simulate an automated update against protected manual fields and verify pre-mutation refusal.
- Expected signals: Normal writes persist server-derived source kind; forged fields are rejected by strict dispatch schema or pre-mutation validation; protected manual/constitutional fields are not changed by automated callers; mutation-ledger audit dedupes repeated automated mutation attempts.
- Desired user-visible outcome: The operator can prove provenance is derived server-side and protected fields are guarded before writes occur.
- Pass/fail: PASS only when forged caller input is rejected and protected fields remain unchanged after automated overwrite attempts.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate source_kind provenance guarding with normal writes, forged inputs, and automated protected-field overwrite attempts.
```

### Commands

1. Create a sandbox manual spec-doc file with distinctive title, trigger phrases, and importance tier.
2. Run `memory_save({ filePath: "<absolute sandbox file>", force: true })` and capture the returned ID.
3. Inspect the stored row through `memory_list({ limit: 100, specFolder: "<sandbox-spec>", includeChunks: false })` or direct sandbox DB inspection and record `source_kind`.
4. Attempt `memory_update({ id: <ID>, title: "forged", triggerPhrases: ["forged"], importanceWeight: 0.5, importanceTier: "normal", source_kind: "human" })` and capture the refusal.
5. Attempt an update or save with caller-supplied `__provenanceContext` and capture the refusal.
6. Simulate an automated writer context using the supported test harness and attempt to overwrite protected manual or constitutional fields on the sandbox record.
7. Re-read the stored row and audit ledger to verify protected fields are unchanged and repeated automated attempts dedupe by deterministic event key.

### Expected

- Stored `source_kind` is derived by the server, not accepted from caller input.
- Forged `source_kind` and forged `__provenanceContext` are rejected before mutation.
- Automated overwrite of protected manual or constitutional fields is blocked.
- Repeated automated attempts do not spam duplicate audit events.

### Evidence

BLOCKED before scenario command execution.

Observed scenario command requiring an out-of-scope write:

```text
1. Create a sandbox manual spec-doc file with distinctive title, trigger phrases, and importance tier.
```

Active execution constraint for this run:

```text
ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/governance/source_kind_provenance_guard.md (this file only)
```

No `memory_save`, `memory_list`, `memory_update`, automated writer harness, stored-row re-read, or audit-ledger commands were run because the required sandbox file creation would violate the run's allowed write path.

### Pass / Fail

- **BLOCKED**: scenario command 1 requires creating a sandbox manual spec-doc file, but this run permits writes only to `.opencode/skills/system-spec-kit/manual_testing_playbook/governance/source_kind_provenance_guard.md`.

### Failure Triage

Inspect `handlers/save/create-record.ts`, `handlers/memory-crud-update.ts`, strict dispatch schemas, and provenance derivation helpers. Confirm the automated writer simulation uses the supported internal context rather than caller-forged input.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `governance/source_kind_provenance_guard.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/handlers/save/create-record.ts` | Create-path source kind persistence |
| `mcp_server/handlers/memory-crud-update.ts` | Update-path provenance derivation and forged-input refusal |
| `mcp_server/lib/search/vector-index-schema.ts` | `source_kind` schema field |

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 447
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `governance/source_kind_provenance_guard.md`
