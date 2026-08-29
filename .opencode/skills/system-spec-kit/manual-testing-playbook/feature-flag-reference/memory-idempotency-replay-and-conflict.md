---
title: "440 -- Memory Idempotency Replay and Conflict"
description: "Manual check that memory idempotency is inert by default, replays identical retries when enabled, fails closed on changed-payload retries, and returns to default behavior when disabled."
version: 3.6.0.2
id: feature-flag-reference-memory-idempotency-replay-and-conflict
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 440 -- Memory Idempotency Replay and Conflict

## 1. OVERVIEW

This scenario validates the default-off memory idempotency receipt path. When the flag is disabled, repeated writes follow existing write behavior. When the flag is enabled, an identical server-derived receipt must replay the stored response, while a changed-payload retry for the same derived receipt must fail closed.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm idempotency replay, changed-payload conflict, and disable rollback behavior.
- Real user request: `Validate that retried memory saves and updates are safe when idempotency is enabled and unchanged when the flag is off.`
- Prompt: `Validate SPECKIT_MEMORY_IDEMPOTENCY with default-off save behavior, receipt replay, fail-closed conflict, forged-token ignore, and disable steps.`
- Expected execution process: Run a baseline save with the flag unset, run the focused receipt suite with the flag enabled to prove verbatim replay/conflict/forged-token behavior, then disable the flag and verify the public save path no longer returns conflict metadata.
- Expected signals: Flag-off public writes do not require receipts; enabled receipt suite shows an identical server-derived receipt returns the original stored response without inserting another row or adding a replay marker, `idempotency_key_conflict` on changed payload for the same derived receipt, and forged caller idempotency tokens ignored; disabled rerun returns to the baseline path.
- Desired user-visible outcome: The operator can prove the feature is opt-in, verbatim on replay, and fail-closed on conflicting retries.
- Pass/fail: PASS only when replay and conflict behavior both occur with the flag enabled and disappear after the flag is disabled.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_MEMORY_IDEMPOTENCY with default-off save behavior, receipt replay, fail-closed conflict, forged-token ignore, and disable steps.
```

### Commands

1. Create a disposable spec-doc markdown file in a sandbox folder with title `Idempotency probe` and a unique body string.
2. Unset the flag: `unset SPECKIT_MEMORY_IDEMPOTENCY`; restart the daemon or run a fresh handler process.
3. Run `memory_save({ filePath: "<absolute sandbox file>", force: true })` and capture `BASELINE`.
4. Enable the flag for a focused receipt run: `SPECKIT_MEMORY_IDEMPOTENCY=true npx vitest run tests/memory-idempotency-and-near-duplicate.vitest.ts` from `.opencode/skills/system-spec-kit/mcp-server`.
5. In the vitest transcript, capture the cases named `replays an identical server-derived receipt without inserting another memory row`, `fails closed when the same key has a changed payload hash`, and `ignores forged client-supplied idempotency tokens in key derivation`.
6. Disable the flag: `unset SPECKIT_MEMORY_IDEMPOTENCY`; restart the daemon or handler process.
7. Run `memory_save({ filePath: "<absolute second sandbox file>", force: true })` and capture `DISABLED`.

### Expected

- `BASELINE` completes without receipt replay metadata.
- Focused receipt suite passes the replay, conflict, forged-token ignore, near-duplicate, and fallback-success cases.
- Replay evidence shows the stored response is returned verbatim and row count stays unchanged; no `replayed:true` marker is added by the public replay path.
- Conflict evidence includes `idempotency_key_conflict` or the suite's conflict assertion.
- `DISABLED` follows normal write behavior and does not return conflict metadata from the idempotency path.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Replay and conflict behavior both occur with the flag enabled and disappear after the flag is disabled.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `lib/storage/idempotency-receipts.ts`, save/update handler idempotency wiring, and `tests/memory-idempotency-and-near-duplicate.vitest.ts`. Confirm the test process is using schema v36 or newer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-flag-reference/memory-idempotency-replay-and-conflict.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp-server/lib/storage/idempotency-receipts.ts` | Receipt storage and replay helper |
| `mcp-server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Replay and conflict regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 440
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `feature-flag-reference/memory-idempotency-replay-and-conflict.md`
