---
title: "451 -- Constitutional Self-Edit and Compare-and-Swap Guard"
description: "Manual check that memory_update rejects edits removing a constitutional row's own protection and rejects stale-read overwrites via expectedHash, while non-constitutional updates stay unchanged."
---

# 451 -- Constitutional Self-Edit and Compare-and-Swap Guard

## 1. OVERVIEW

This scenario validates the constitutional edit guard on the `memory_update` path. An edit that would downgrade a constitutional row out of constitutional tier must be rejected with `E_CONSTITUTIONAL_SELF_EDIT`. When the caller supplies `expectedHash`, it must match the row's current `content_hash` or the update is rejected with `E_STALE_CONSTITUTIONAL_UPDATE`. The non-constitutional update path must remain byte-identical.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm constitutional protection-removal and stale-read overwrites are rejected, and normal updates are unaffected.
- Real user request: `Don't let a constitutional rule strip its own protection or get overwritten from a stale copy.`
- Prompt: `Validate the constitutional self-edit and expectedHash compare-and-swap guard on memory_update.`
- Expected execution process: On a sandbox constitutional row, attempt a tier downgrade, attempt an update with a stale `expectedHash`, perform a safe update with the matching `expectedHash`, then confirm a non-constitutional row updates normally.
- Expected signals: A tier downgrade on a constitutional row is rejected with `E_CONSTITUTIONAL_SELF_EDIT`; a stale `expectedHash` is rejected with `E_STALE_CONSTITUTIONAL_UPDATE`; a matching `expectedHash` allows the update; a non-constitutional update path is unchanged and does not require `expectedHash`.
- Desired user-visible outcome: The operator can prove constitutional rows cannot self-downgrade or be clobbered from a stale read, while ordinary updates still work.
- Pass/fail: PASS only when both refusals fire on the constitutional row, the matching-hash update succeeds, and non-constitutional updates are unaffected.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate the constitutional self-edit and expectedHash compare-and-swap guard on memory_update.
```

### Commands

1. In a sandbox, create or identify a constitutional row (by constitutional tier or constitutional path) and capture its `content_hash`.
2. Attempt `memory_update({ id: <constitutional ID>, importanceTier: "normal" })` and capture the refusal.
3. Attempt `memory_update({ id: <constitutional ID>, title: "edit", expectedHash: "<stale or wrong hash>" })` and capture the refusal.
4. Perform `memory_update({ id: <constitutional ID>, title: "edit", expectedHash: "<current content_hash>" })` and confirm it succeeds.
5. Update a non-constitutional sandbox row without `expectedHash` and confirm the update behaves exactly as before.

### Expected

- The tier downgrade is rejected with `E_CONSTITUTIONAL_SELF_EDIT`.
- The stale `expectedHash` update is rejected with `E_STALE_CONSTITUTIONAL_UPDATE`.
- The matching `expectedHash` update succeeds.
- The non-constitutional update path is byte-identical and does not require `expectedHash`.

### Evidence

Constitutional row hash before/after, both refusal payloads with their error codes, the successful matching-hash update response, and the non-constitutional update response.

### Pass / Fail

- **Pass**: both refusals fire with the documented error codes, the matching-hash update succeeds, and non-constitutional updates are unchanged.
- **Fail**: a downgrade or stale overwrite is accepted, the matching-hash update is wrongly rejected, or the non-constitutional path changes.

### Failure Triage

Inspect `mcp_server/handlers/memory-crud-update.ts` (`validateConstitutionalEditPreconditions` and its call site), `mcp_server/handlers/memory-crud-types.ts`, and `mcp_server/schemas/tool-input-schemas.ts`. Confirm the self-edit assertion is unconditional and the `expectedHash` compare-and-swap is an additive optional precondition.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `17--governance/constitutional-self-edit-and-cas-guard.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/handlers/memory-crud-update.ts` | Self-edit assertion and `expectedHash` compare-and-swap precondition |
| `mcp_server/handlers/memory-crud-types.ts` | Update args type carrying `expectedHash` |
| `mcp_server/schemas/tool-input-schemas.ts` | Additive optional `expectedHash` field |
| `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Self-edit, stale-hash, and matching-hash safe-update cases |

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 451
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/constitutional-self-edit-and-cas-guard.md`
