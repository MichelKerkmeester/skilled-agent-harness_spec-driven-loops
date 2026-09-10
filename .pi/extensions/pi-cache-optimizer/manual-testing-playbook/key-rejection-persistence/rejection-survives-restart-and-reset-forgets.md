---
title: "CACHE-013 -- A learned key rejection survives a restart, and reset forgets it"
description: "This scenario validates that a `prompt_cache_key` rejection learned from a 400 is remembered across process restarts for `CACHE-013`, and that `/cache-optimizer reset` clears it for the active model."
stage: routing
version: 1.0.0.0
---

# CACHE-013 -- A learned key rejection survives a restart, and reset forgets it

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-013`.

---

## 1. OVERVIEW

This scenario validates both halves of the learned rejection: it persists across process boundaries so the same 400 is not paid for repeatedly, and `reset` clears it so a fixed proxy is retried rather than blacklisted forever.

### Why This Matters

Learning that a provider rejects `prompt_cache_key` used to live only in process memory, so every new process re-learned it by spending another failed request. Persisting it removes that cost. The unlearn path matters just as much: without it, one 400 from a transiently misconfigured proxy would disable injection for that model permanently, and the only cure would be hand-editing the state file.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-013` and confirm the expected signals without contradictory evidence.

- Objective: confirm the rejection persists across a restart and that reset removes it.
- Real user request: `This proxy rejects the cache key. Stop retrying it every session -- and let me undo that once it is fixed.`
- Prompt: trigger a matching 400 on a model, restart, then run `/cache-optimizer reset`.
- Expected execution process: learn the rejection, restart the process, confirm no second 400, then reset and confirm the key is attempted again.
- Expected signals: after the restart the next request omits the key without a second 400; after reset the key is attempted again.
- Desired user-visible outcome: a rejecting provider costs one failed request, not one per session, and the decision is reversible.
- Pass/fail: PASS if the rejection survives the restart and reset clears it; FAIL if it is re-learned each session, or if reset leaves it in place.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: remember the rejection, but allow it to be undone.
2. Drive a request against a model whose provider rejects the key with a matching 400.
3. Restart the process and send another request; confirm no second 400 and no key on the payload.
4. Run `/cache-optimizer reset` for that model.
5. Send another request and confirm the key is attempted again.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-013 | Rejection persists, reset forgets | Verify the learned rejection crosses a restart and is reversible | `Summarize this file.` | 1. request against a key-rejecting model -> 2. restart the process -> 3. request again and inspect the payload -> 4. `pi> /cache-optimizer reset` -> 5. request again | Step 3: no key on the payload and no second 400; step 5: the key is attempted again | The persisted state entry, and the payloads at steps 3 and 5 | PASS if it survives the restart and reset clears it; FAIL if re-learned per session, or if reset does not clear it | 1. Confirm the 400 text matches the recognized shape -- an unrelated 400 teaches nothing by design. 2. Confirm the entry is recorded per model rather than globally. 3. If reset appears not to clear it, confirm the deletion reached the persisted record and was not reinstated by a merge with what was already on disk. |

### Optional Supplemental Checks

Confirm a state file written before this behavior existed loads cleanly and behaves as though nothing was learned.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | Rejection detection, the persisted entry, and the reset path |
| `../../tests/review-findings.test.ts` | Regression anchor for persistence and for reset |

---

## 5. SOURCE METADATA

- Group: Key Rejection Persistence
- Playbook ID: CACHE-013
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `key-rejection-persistence/rejection-survives-restart-and-reset-forgets.md`
