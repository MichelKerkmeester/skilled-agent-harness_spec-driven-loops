---
title: "Implementation Plan: Phase 20: dsh-direct-writer-gateway"
description: "Route the dispatch failure row, the receipt write failure row and the post-dispatch executor audit through the append gateway on a ledger-backed state log. Review carries the two failure rows whole under its existing record stem, research gets two new reducer-read stems, and the audit lands on the iteration's opening row through the existing opening-row writer. Each edit names its search text and its test."
trigger_phrases:
  - "dsh direct writer gateway plan"
  - "dispatch failure gateway plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: dsh-direct-writer-gateway

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript under `tsx`, one CommonJS gateway script, YAML workflow assets |
| **Framework** | The deep-loop runtime: append gateway, typed ledgers and legacy state-log projections |
| **Storage** | Append-only ledger frames under `deep-review-ledger/` and `deep-research-ledger/`, projected into the JSONL state log |
| **Testing** | Vitest, `npm run typecheck`, `check-ledger-stem-producers.cjs`, `check-contract-drift.cjs` |

### Overview
Three writers append straight into a state log that the append gateway rebuilds from its ledger, so their rows vanish at the next refresh. This plan hands each row to the gateway with the phase 019 helpers `ledgerModeFor` and `appendThroughGateway`, and keeps the direct write where no ledger sits beside the log. The proof is one test per writer that opens a real run, writes the row, triggers a refresh and reads the row back.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 019 is committed, so its `ledgerModeFor`, `appendThroughGateway` and `iteration_start` support are the base these search texts match. Check: `git show HEAD:.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | rg -c 'function ledgerModeFor'` prints 1. Phase 019 landed as `55d2f35341` while this plan was written
- [ ] Every search text below counts as its header says on that base (T002). At `216ba55452` the count script printed `edits=43` and exited 0
- [ ] The operator has answered the open questions in `spec.md` section 7, or accepted the recommended answer

### Definition of Done
- [ ] `cd $DL && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  85 passed (85)`
- [ ] `cd $DL && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts` prints `Tests  54 passed (54)`
- [ ] `cd $DL && npm run typecheck` exits 0
- [ ] `node $DL/scripts/check-ledger-stem-producers.cjs` prints `"ok":true` with `"registered":88` and `"reserved":65`
- [ ] `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ledger-first append. On a state log with a ledger beside it, every writer hands its row to the append gateway. Elsewhere it writes the row itself.

### Key Components
- **`$DL/lib/deep-loop/executor-audit.ts`**: the three writers. A new private `appendFailureRow` routes both failure rows, and `appendExecutorAuditToLastRecord` delegates to `writeFirstRecordExecutor` on a ledger-backed log.
- **`$DL/scripts/append-mode-event.cjs`**: the review gateway also accepts the two failure rows under `deep_review.iteration_recorded`.
- **The research schema set**: two new stems, `deep_research.dispatch_failure` and `deep_research.dispatch_receipt_write_failed`, wired through the types, the schema, the upcaster, the projection and the reducer.
- **The four review and research workflow YAMLs**: the `record_executor_audit` step names its call, and all sixteen audited runner calls pass the run's session id.

### Data Flow
A failure path in the audited runner builds its row as today. `appendFailureRow` checks for ledger frames beside the state log. With frames and a session id, it writes the row plus `sessionId` to a temp event file and runs the gateway, which records it under a ledger stem and rebuilds the state log, row included. Without frames, or when the gateway refuses, the row is appended directly as today. The post-dispatch audit reads the last row's iteration and lets `writeFirstRecordExecutor` append the iteration's opening row through the gateway, unless a row of that iteration already names its executor.

### Design per writer

**`emitDispatchFailure`.** It writes `{type: 'event', event: 'dispatch_failure', executor?, reason, iteration, detail?, executorUnavailable?, matchedMarker?, timestamp}`. Review carries it whole under `deep_review.iteration_recorded`, whose schema is `{record: 'json'}` and whose projection writes the record back as the row. No schema or projection change is needed there, only the gateway's row filter (E8). Research has no stem for it: `recordTarget` returns null and the gateway answers `Legacy deep-research record refused: unknown-legacy-record`. `deep_research.iteration_completed` cannot carry it, because its upcast keeps only status, ratio and focus and loses the reason, the detail and the marker. So research needs the new stem `deep_research.dispatch_failure`, a reducer-read row carried field for field like the idea and pivot rows (E9 to E13). The dedup check compares the executor object with `JSON.stringify`, but the ledger stores objects with sorted keys, so a row read back from the projection never matches and every repeat would add a row. E4 and E5b compare by content instead.

**`emitReceiptWriteFailure`.** It writes `{type: 'event', event: 'dispatch_receipt_write_failed', reason, phase, iteration, executor?, timestamp, detail?}`, once per receipt it cannot write. The design is the same: review under `deep_review.iteration_recorded`, research under the new stem `deep_research.dispatch_receipt_write_failed`. The receipt path gets the session id through `tryWriteReceipt` (E2, E3).

**`record_executor_audit`.** The step is declarative today: it names a target, a field and a value, and the protocol docs say `appendExecutorAuditToLastRecord` performs it. That function patches the `executor` field into the last row in place. An append-only ledger cannot carry an edit to an event it already holds, and appending the leaf's `iteration` row a second time would project two rows for one iteration. So on a ledger-backed log the executor lands where phase 019 put it: the iteration's `iteration_start` row, which review carries under `deep_review.iteration_recorded` and research upcasts to `deep_research.iteration_started`. No new stem or schema change is needed. After 019 the pre-dispatch audit has normally written that row already, so the post-dispatch audit appends nothing. It appends the row only when no row of that iteration names an executor. The step names its call and passes the session id (E14), and the function delegates to `writeFirstRecordExecutor` (E7, E7b).

**Session id.** The audited runner has no session id today, and only one of the sixteen calls passes `lineageId`. The ledger accepts a failure row with no session: review scopes it to the gateway default `run-cli` and research to its context default. Phase 019 refuses that for the opening row, so this plan threads the run's session id instead: one optional input field (E1) and one line per runner call (E15). A ledger-backed failure with no session id, or one the gateway refuses, is written directly and named on stderr, because a failure path that throws would hide the failure it records.

### Restraint check
- Review needs no new stem. Adding one fails no test that reusing `deep_review.iteration_recorded` passes, and the stem's schema and projection already carry any record whole.
- Research needs the two stems. The cheaper move, an existing stem, loses the reason, the detail and the marker, which `step_check_executor_unavailable` and the dedup check read.
- The helper `appendFailureRow` serves two callers today. `canonicalJson` serves the dedup check, which fails on the ledger path without it.
- Owner of the shared contract: the research ledger schema. One real caller of the changed function: `runAuditedExecutorCommand` in `$DL/lib/deep-loop/executor-audit.ts`, the `emitDispatchFailure` call after a non-zero exit. The contract that must not break: a state log with no ledger beside it gets the same bytes as today, which `tests/unit/executor-audit.vitest.ts` pins at 75 tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup counts every search text below on the committed phase 019 base. Implementation applies E1 to E19 to `executor-audit.ts`, the gateway, the research schema set, the four workflow YAMLs and three test files, then regenerates the compiled contracts. Verification runs the two named test files, the research schema and reducer tests, the typecheck and the check scripts. `tasks.md` holds the ordered work.

`$DL` is `.skilled/skills/system-deep-loop/runtime` and `$A` is `.skilled/commands/deep/assets`. Each search text is the exact text between its fences, and every line in it ends in a line break. The header names how many times it matches, one unless it says otherwise. Replace every match with the replacement text byte for byte. Section 5 says which edits were applied and checked on a clone of this worktree before this plan was written.

#### E1. Session id on the runner input
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
  timeoutGraceMs?: number;
  lineageId?: string;
```
Replacement:
```text
  timeoutGraceMs?: number;
  lineageId?: string;
  // The run's session id. On a ledger-backed state log it scopes the failure
  // rows the runner hands the append gateway.
  sessionId?: string;
```

#### E2. Receipt write failure through the gateway
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
  phase: ReceiptPhase,
  detail: string,
): void {
  // Distinct from the dispatch_failure event (and never deduped against it) so
  // a write failure is always observable separately from a 'missing' receipt
  // the validator reports later.
  appendJsonlRecordSafe(stateLogPath, {
    type: 'event',
    event: 'dispatch_receipt_write_failed',
    reason: 'dispatch_receipt_write_failed' as DispatchFailureReason,
    phase,
    iteration,
    ...(getExecutorKind(executor) === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    timestamp: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  });
}

function tryWriteReceipt(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  phase: ReceiptPhase,
  receiptPath: string,
  record: Record<string, unknown>,
): void {
  try {
    writeReceiptAtomic(receiptPath, record);
  } catch (err) {
    emitReceiptWriteFailure(stateLogPath, executor, iteration, phase, (err as Error).message ?? String(err));
  }
}
```
Replacement:
```text
  phase: ReceiptPhase,
  detail: string,
  sessionId: string | undefined,
): void {
  // Distinct from the dispatch_failure event (and never deduped against it) so
  // a write failure is always observable separately from a 'missing' receipt
  // the validator reports later.
  appendFailureRow(stateLogPath, {
    type: 'event',
    event: 'dispatch_receipt_write_failed',
    reason: 'dispatch_receipt_write_failed' as DispatchFailureReason,
    phase,
    iteration,
    ...(getExecutorKind(executor) === 'native' ? {} : { executor: buildExecutorAuditRecord(executor) }),
    timestamp: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  }, sessionId);
}

function tryWriteReceipt(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  phase: ReceiptPhase,
  receiptPath: string,
  record: Record<string, unknown>,
  sessionId: string | undefined,
): void {
  try {
    writeReceiptAtomic(receiptPath, record);
  } catch (err) {
    emitReceiptWriteFailure(stateLogPath, executor, iteration, phase, (err as Error).message ?? String(err), sessionId);
  }
}
```

#### E3a. The intent receipt passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'intent', paths.intentPath, record);
```
Replacement:
```text
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'intent', paths.intentPath, record, input.sessionId);
```

#### E3b. The completion receipt passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'completion', ctx.completionPath, record);
```
Replacement:
```text
  tryWriteReceipt(input.stateLogPath, input.executor, input.iteration, 'completion', ctx.completionPath, record, input.sessionId);
```

#### E4. The failure row helper and a key-order-free comparison
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
      throw new Error(`append gateway refused the executor row for iteration ${String(record.iteration)}: ${outcome}`);
    }
  } finally {
    rmSync(eventDir, { recursive: true, force: true });
  }
}

```
Replacement:
```text
      throw new Error(`append gateway refused the ${String(record.event ?? record.type)} row for iteration ${String(record.iteration)}: ${outcome}`);
    }
  } finally {
    rmSync(eventDir, { recursive: true, force: true });
  }
}

// The ledger stores a row's objects with sorted keys, so a row the projection
// wrote back is compared with a new one by content, not by key order.
function canonicalJson(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalJson(entry) ?? 'null').join(',')}]`;
  }
  if (isObjectRecord(value)) {
    return `{${Object.keys(value).sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

// A failure row on a ledger-backed state log goes through the append gateway,
// or the next refresh drops it. Recording a failure never throws: when the run
// names no session id or the gateway refuses, the row is written straight into
// the state log, where the steps that read it right after the dispatch still
// find it, and stderr says why it will not last.
function appendFailureRow(stateLogPath: string, row: Record<string, unknown>, sessionId: string | undefined): void {
  const ledgerMode = ledgerModeFor(stateLogPath);
  if (ledgerMode !== null) {
    if (!sessionId) {
      process.stderr.write(`no session id scopes the ${String(row.event)} row, so the next refresh of the ledger-backed state log drops it\n`);
    } else {
      try {
        appendThroughGateway(ledgerMode, stateLogPath, { ...row, sessionId });
        return;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}. The next refresh drops the row written in its place\n`);
      }
    }
  }
  appendJsonlRecordSafe(stateLogPath, row);
}

```

#### E5. The dispatch failure writer takes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
 * @param detail - Optional failure detail string.
 */
export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: DispatchFailureReason,
  iteration: number,
  detail?: string,
  matchedMarker?: string | null,
): void {
```
Replacement:
```text
 * @param detail - Optional failure detail string.
 * @param matchedMarker - The provider outage marker, when one matched.
 * @param sessionId - The run's session id, which scopes the ledger event.
 */
export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: DispatchFailureReason,
  iteration: number,
  detail?: string,
  matchedMarker?: string | null,
  sessionId?: string,
): void {
```

#### E5b. Dedup by content, and the row through the helper
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
    && JSON.stringify(lastIterationEvent.executor) === JSON.stringify(executorAudit)
  ) {
    return;
  }

  appendJsonlRecordSafe(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
```
Replacement:
```text
    && canonicalJson(lastIterationEvent.executor) === canonicalJson(executorAudit)
  ) {
    return;
  }

  appendFailureRow(stateLogPath, {
    type: 'event',
    event: 'dispatch_failure',
```

#### E5c. Close the dispatch failure row with its session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
    ...(matchedMarker ? { executorUnavailable: true, matchedMarker } : {}),
    timestamp: new Date().toISOString(),
  });
}
```
Replacement:
```text
    ...(matchedMarker ? { executorUnavailable: true, matchedMarker } : {}),
    timestamp: new Date().toISOString(),
  }, sessionId);
}
```

#### E6a. The recursion guard refusals pass the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Matches 2. Search text:
```text
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail);
```
Replacement:
```text
    emitDispatchFailure(input.stateLogPath, input.executor, dispatchAllowed.reason, input.iteration, dispatchAllowed.detail, null, input.sessionId);
```

#### E6b. The synchronous runner's exit failures pass the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Matches 3. Search text:
```text
      unavailableMarker,
    );
```
Replacement:
```text
      unavailableMarker,
      input.sessionId,
    );
```

#### E6c. The synchronous runner's completion and provenance failures pass the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Matches 2. Search text:
```text
        unavailableMarker,
      );
```
Replacement:
```text
        unavailableMarker,
        input.sessionId,
      );
```

#### E6d. The asynchronous spawn error passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
      emitDispatchFailure(input.stateLogPath, input.executor, 'crash', input.iteration, error.message);
```
Replacement:
```text
      emitDispatchFailure(input.stateLogPath, input.executor, 'crash', input.iteration, error.message, null, input.sessionId);
```

#### E6e. The asynchronous timeout passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
          `executor timed out after ${timeoutMs}ms`,
        );
```
Replacement:
```text
          `executor timed out after ${timeoutMs}ms`,
          null,
          input.sessionId,
        );
```

#### E6f. The asynchronous non-zero exit passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
          `executor exited with status ${status}`,
        );
```
Replacement:
```text
          `executor exited with status ${status}`,
          null,
          input.sessionId,
        );
```

#### E6g. The asynchronous signal passes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
          `executor terminated by signal ${signal}`,
        );
```
Replacement:
```text
          `executor terminated by signal ${signal}`,
          null,
          input.sessionId,
        );
```

#### E7. The post-dispatch audit takes the session id
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
 * Append executor audit information to the last JSONL record in the state log.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @throws If the state log is empty or the last record is not an object.
 */
export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig): void {
```
Replacement:
```text
 * Append executor audit information to the last JSONL record in the state log.
 *
 * A ledger-backed state log is rebuilt from its ledger, which cannot carry an
 * edit to a row it already holds. There the executor of the last record's
 * iteration lives on that iteration's opening row, which goes through the
 * append gateway when no row of the iteration names an executor yet.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param sessionId - The run's session id, which scopes the ledger event.
 * @throws If the state log is empty or the last record is not an object.
 */
export function appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig, sessionId?: string): void {
```

#### E7b. Delegate to the opening row on a ledger-backed log
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
    throw new Error('Last JSONL record is not an object');
  }

  const mergedRecord: Record<string, unknown> = {
```
Replacement:
```text
    throw new Error('Last JSONL record is not an object');
  }

  if (ledgerModeFor(stateLogPath) !== null) {
    if (!Number.isSafeInteger(parsedRecord.iteration) || parsedRecord.iteration < 1) {
      throw new Error('appendExecutorAuditToLastRecord needs the last record to name its iteration on a ledger-backed state log');
    }
    writeFirstRecordExecutor(stateLogPath, executor, parsedRecord.iteration, sessionId);
    return;
  }

  const mergedRecord: Record<string, unknown> = {
```

#### E8. The review gateway takes the failure rows
File: `$DL/scripts/append-mode-event.cjs`. Search text:
```text
    && (rawEvent.type === 'iteration' || rawEvent.type === 'iteration_start')
  ) {
    // The review agent, its iteration prompt and its workflow all hand the gateway the canonical
    // iteration record itself, and the pre-dispatch executor audit hands it the iteration's
    // opening row. Their optional fields vary with review depth and executor, so each travels
    // whole under one stem, and the state projection writes it back as the same row.
```
Replacement:
```text
    && (rawEvent.type === 'iteration' || rawEvent.type === 'iteration_start'
      || (rawEvent.type === 'event'
        && (rawEvent.event === 'dispatch_failure' || rawEvent.event === 'dispatch_receipt_write_failed')))
  ) {
    // The review agent, its iteration prompt and its workflow all hand the gateway the canonical
    // iteration record itself, the pre-dispatch executor audit hands it the iteration's opening
    // row, and the audited executor runner hands it a dispatch's failure rows. Their optional
    // fields vary with review depth and executor, so each travels whole under one stem, and the
    // state projection writes it back as the same row.
```

#### E9a. Register the two research stems
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  'deep_research.pivot_failed',
] as const);
```
Replacement:
```text
  'deep_research.pivot_failed',
  'deep_research.dispatch_failure',
  'deep_research.dispatch_receipt_write_failed',
] as const);
```

#### E9b. Their data shapes
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  readonly lifecycle?: JsonValue;
  readonly occurredAtIso?: string;
};
```
Replacement:
```text
  readonly lifecycle?: JsonValue;
  readonly occurredAtIso?: string;
};

// The audited runner's dispatch failure row, carried field for field. A native
// run names no executor, and the marker pair is present only when a provider
// outage marker matched.
export type DispatchFailureData = JsonObject & {
  readonly reason: string;
  readonly iteration: Uint32;
  readonly executor?: JsonObject;
  readonly detail?: string;
  readonly executorUnavailable?: boolean;
  readonly matchedMarker?: string;
  readonly sessionId?: string;
};

// The row the audited runner writes for each dispatch receipt it cannot write.
export type DispatchReceiptWriteFailedData = JsonObject & {
  readonly reason: string;
  readonly phase: string;
  readonly iteration: Uint32;
  readonly executor?: JsonObject;
  readonly detail?: string;
  readonly sessionId?: string;
};
```

#### E9c. Census entries
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
} as const satisfies Readonly<Record<DeepResearchEventStem, DeepResearchStemProducerStatus>>);
```
Replacement:
```text
  'deep_research.dispatch_failure': { status: 'reserved', reason: 'No workflow stages it: the audited executor runner hands the gateway the legacy dispatch_failure row, which the gateway upcasts to this stem. A dispatch step would speak it once it stages the stem itself.' },
  'deep_research.dispatch_receipt_write_failed': { status: 'reserved', reason: 'No workflow stages it: the audited executor runner hands the gateway the legacy dispatch_receipt_write_failed row, which the gateway upcasts to this stem. A dispatch step would speak it once it stages the stem itself.' },
} as const satisfies Readonly<Record<DeepResearchEventStem, DeepResearchStemProducerStatus>>);
```

#### E9d. Wire event types
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  'deep_research.pivot_failed': 'deep-research.ledger.pivot-failed',
```
Replacement:
```text
  'deep_research.pivot_failed': 'deep-research.ledger.pivot-failed',
  'deep_research.dispatch_failure': 'deep-research.ledger.dispatch-failure',
  'deep_research.dispatch_receipt_write_failed': 'deep-research.ledger.dispatch-receipt-write-failed',
```

#### E9e. Payload map
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  readonly 'deep_research.pivot_failed': PivotLifecycleData;
```
Replacement:
```text
  readonly 'deep_research.pivot_failed': PivotLifecycleData;
  readonly 'deep_research.dispatch_failure': DispatchFailureData;
  readonly 'deep_research.dispatch_receipt_write_failed': DispatchReceiptWriteFailedData;
```

#### E9f. Scope map
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  readonly 'deep_research.pivot_failed': DeepResearchBaseScope;
```
Replacement:
```text
  readonly 'deep_research.pivot_failed': DeepResearchBaseScope;
  readonly 'deep_research.dispatch_failure': DeepResearchBaseScope;
  readonly 'deep_research.dispatch_receipt_write_failed': DeepResearchBaseScope;
```

#### E10a. Required data fields
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`. Search text:
```text
  'deep_research.pivot_failed': { pivotId: 'identifier' },
```
Replacement:
```text
  'deep_research.pivot_failed': { pivotId: 'identifier' },
  'deep_research.dispatch_failure': { reason: 'code', iteration: 'uint32' },
  'deep_research.dispatch_receipt_write_failed': { reason: 'code', phase: 'code', iteration: 'uint32' },
```

#### E10b. Optional data fields
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`. Search text:
```text
  'deep_research.pivot_failed': PIVOT_LIFECYCLE_FIELD_RULES,
});
```
Replacement:
```text
  'deep_research.pivot_failed': PIVOT_LIFECYCLE_FIELD_RULES,
  'deep_research.dispatch_failure': Object.freeze({
    executor: 'json',
    detail: 'prose',
    executorUnavailable: 'boolean',
    matchedMarker: 'prose',
    sessionId: 'prose',
  }),
  'deep_research.dispatch_receipt_write_failed': Object.freeze({
    executor: 'json',
    detail: 'prose',
    sessionId: 'prose',
  }),
});
```

#### E10c. Scope fields
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`. Search text:
```text
  'deep_research.pivot_failed': ['runId', 'lineageId'],
```
Replacement:
```text
  'deep_research.pivot_failed': ['runId', 'lineageId'],
  'deep_research.dispatch_failure': ['runId', 'lineageId'],
  'deep_research.dispatch_receipt_write_failed': ['runId', 'lineageId'],
```

#### E11a. The legacy event names select the stems
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
  pivot_failed: 'deep_research.pivot_failed',
```
Replacement:
```text
  pivot_failed: 'deep_research.pivot_failed',
  dispatch_failure: 'deep_research.dispatch_failure',
  dispatch_receipt_write_failed: 'deep_research.dispatch_receipt_write_failed',
```

#### E11b. Their row shapes
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
  'deep_research.pivot_failed': pivotLifecycleShape('pivot_failed'),
});
```
Replacement:
```text
  'deep_research.pivot_failed': pivotLifecycleShape('pivot_failed'),
  // The audited runner's failure rows. The step that halts on an unavailable
  // executor reads the marker, and the runner's dedup reads the rest.
  'deep_research.dispatch_failure': Object.freeze({
    event: 'dispatch_failure',
    required: ['reason', 'iteration'],
    anyOf: [],
    optional: ['executor', 'detail', 'executorUnavailable', 'matchedMarker', 'sessionId'],
  }),
  'deep_research.dispatch_receipt_write_failed': Object.freeze({
    event: 'dispatch_receipt_write_failed',
    required: ['reason', 'phase', 'iteration'],
    anyOf: [],
    optional: ['executor', 'detail', 'sessionId'],
  }),
});
```

#### E11c. The upcaster carries them field for field
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
    case 'deep_research.pivot_failed': {
```
Replacement:
```text
    case 'deep_research.pivot_failed':
    case 'deep_research.dispatch_failure':
    case 'deep_research.dispatch_receipt_write_failed': {
```

#### E12. The projection writes them back in the runner's key order
File: `$DL/lib/legacy-projections/deep-research-contract.ts`. Search text:
```text
  'deep_research.pivot_failed': pivotRowFields(['reason', 'quorum', 'agreement', 'recoverableByOverride']),
```
Replacement:
```text
  'deep_research.pivot_failed': pivotRowFields(['reason', 'quorum', 'agreement', 'recoverableByOverride']),
  'deep_research.dispatch_failure': Object.freeze([
    'executor', 'reason', 'iteration', 'detail', 'executorUnavailable', 'matchedMarker', 'timestamp', 'sessionId',
  ]),
  'deep_research.dispatch_receipt_write_failed': Object.freeze([
    'reason', 'phase', 'iteration', 'executor', 'timestamp', 'detail', 'sessionId',
  ]),
```

#### E13a. The reducer routes them to no plane
File: `$DL/lib/deep-research-reducers/deep-research-reducer.ts`. Search text:
```text
  'deep_research.pivot_failed': Object.freeze([]),
```
Replacement:
```text
  'deep_research.pivot_failed': Object.freeze([]),
  // Dispatch failure rows: the workflow reads them back from the state log, and
  // none carries research evidence.
  'deep_research.dispatch_failure': Object.freeze([]),
  'deep_research.dispatch_receipt_write_failed': Object.freeze([]),
```

#### E13b. The reducer's three exhaustive switches
File: `$DL/lib/deep-research-reducers/deep-research-reducer.ts`. Matches 3. Search text:
```text
    case 'deep_research.pivot_failed':
```
Replacement:
```text
    case 'deep_research.pivot_failed':
    case 'deep_research.dispatch_failure':
    case 'deep_research.dispatch_receipt_write_failed':
```

#### E14a. The review audit step names its call, auto
File: `$A/deep-review-auto.yaml`. Search text:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          target: "{state_paths.state_log}"
          field: "executor"
          value:
            kind: "{config.executor.kind}"
            model: "{config.executor.model}"
            reasoningEffort: "{config.executor.reasoningEffort}"
            serviceTier: "{config.executor.serviceTier}"
```
Replacement:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          call: ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts#appendExecutorAuditToLastRecord"
          args:
            stateLogPath: "{state_paths.state_log}"
            executor: "{config.executor}"
            sessionId: "{session_id}"
```

#### E14b. The review audit step names its call, confirm
File: `$A/deep-review-confirm.yaml`. Search text:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          target: "{state_paths.state_log}"
          field: "executor"
          value:
            kind: "{config.executor.kind}"
            model: "{config.executor.model}"
            reasoningEffort: "{config.executor.reasoningEffort}"
            serviceTier: "{config.executor.serviceTier}"
```
Replacement:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          call: ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts#appendExecutorAuditToLastRecord"
          args:
            stateLogPath: "{state_paths.state_log}"
            executor: "{config.executor}"
            sessionId: "{session_id}"
```

#### E14c. The research audit step names its call, auto
File: `$A/deep-research-auto.yaml`. Search text:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          target: "{state_paths.state_log}"
          field: "executor"
          value:
            kind: "{config.executor.kind}"
            model: "{config.executor.model}"
            reasoningEffort: "{config.executor.reasoningEffort}"
            serviceTier: "{config.executor.serviceTier}"
```
Replacement:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          call: ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts#appendExecutorAuditToLastRecord"
          args:
            stateLogPath: "{state_paths.state_log}"
            executor: "{config.executor}"
            sessionId: "{config.lineage.sessionId}"
```

#### E14d. The research audit step names its call, confirm
File: `$A/deep-research-confirm.yaml`. Search text:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          target: "{state_paths.state_log}"
          field: "executor"
          value:
            kind: "{config.executor.kind}"
            model: "{config.executor.model}"
            reasoningEffort: "{config.executor.reasoningEffort}"
            serviceTier: "{config.executor.serviceTier}"
```
Replacement:
```text
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          call: ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts#appendExecutorAuditToLastRecord"
          args:
            stateLogPath: "{state_paths.state_log}"
            executor: "{config.executor}"
            sessionId: "{config.lineage.sessionId}"
```

#### E15. Every audited runner call passes the session id
The sixteen calls differ in indentation, so a script makes this edit. In each workflow it finds every `receiptDir: '{state_paths.packet_dir}/dispatch-receipts',` line followed at the same indentation by `dispatchId,`, and inserts a `sessionId` line after them at that indentation. The counts are 7, 1, 7 and 1, and the script exits 1 on any other count. Save it outside the repository and run `node add-runner-session.cjs .` from the worktree root.
```js
// Usage: node add-runner-session.cjs <worktree root>
const fs = require('node:fs');
const path = require('node:path');

const files = [
  ['deep-review-auto.yaml', 7, "'{session_id}'"],
  ['deep-review-confirm.yaml', 1, "'{session_id}'"],
  ['deep-research-auto.yaml', 7, "'{config.lineage.sessionId}'"],
  ['deep-research-confirm.yaml', 1, "'{config.lineage.sessionId}'"],
];
const pattern = /^( +)receiptDir: '\{state_paths\.packet_dir\}\/dispatch-receipts',\n\1dispatchId,\n/gm;
let bad = 0;
for (const [name, expected, template] of files) {
  const target = path.join(process.argv[2], '.skilled/commands/deep/assets', name);
  const text = fs.readFileSync(target, 'utf8');
  const count = [...text.matchAll(pattern)].length;
  console.log(`${name} count=${count}`);
  if (count !== expected) { bad += 1; continue; }
  fs.writeFileSync(target, text.replace(pattern, (match, indent) => `${match}${indent}sessionId: ${template},\n`), 'utf8');
}
process.exit(bad === 0 ? 0 : 1);
```

#### E16. Regenerate the compiled contracts
The review and research contracts pin the digest of each workflow file. Run `node $DL/scripts/compile-command-contracts.cjs --command deep/review --write`, then `--command deep/research --write` and `--command deep/ai-council --write`. Then `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.

#### E17a. The survival test imports the three writers
File: `$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`. Search text:
```text
import { writeFirstRecordExecutor } from '../../lib/deep-loop/executor-audit.js';
```
Replacement:
```text
import {
  appendExecutorAuditToLastRecord,
  emitDispatchFailure,
  runAuditedExecutorCommand,
  writeFirstRecordExecutor,
} from '../../lib/deep-loop/executor-audit.js';
```

#### E17b. One survival test per writer
File: `$DL/tests/unit/executor-audit-ledger-projection.vitest.ts`. Search text:
```text
      expect(() => writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1)).toThrow('needs the run session id');
      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
```
Replacement:
```text
      expect(() => writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1)).toThrow('needs the run session id');
      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('the failure rows and the post-dispatch audit on a ledger-backed state log', () => {
  function openRun(mode: Mode): { root: string; runDirectory: string; stateLogPath: string; sessionId: string } {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    const runDirectory = join(root, mode);
    mkdirSync(runDirectory);
    const sessionId = `session-writers-${mode}`;
    appendThroughGateway(mode, runDirectory, runOpenEvent(mode, sessionId));
    return { root, runDirectory, stateLogPath: join(runDirectory, `deep-${mode}-state.jsonl`), sessionId };
  }

  it.each(['review', 'research'] as const)('keeps one %s dispatch_failure row through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'crash', 1, 'executor exited with status 3', 'rate limit', run.sessionId);
      // The same failure again matches the row the projection wrote back, so it adds nothing.
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'crash', 1, 'executor exited with status 3', 'rate limit', run.sessionId);
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));

      const failures = stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_failure');
      expect(failures).toHaveLength(1);
      expect(failures[0]).toMatchObject({
        type: 'event',
        reason: 'crash',
        iteration: 1,
        executorUnavailable: true,
        matchedMarker: 'rate limit',
        executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6' },
      });
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('keeps the %s receipt write failure rows through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      const notADirectory = join(run.root, 'not-a-directory');
      writeFileSync(notADirectory, 'x', 'utf8');
      runAuditedExecutorCommand({
        command: process.execPath,
        args: ['-e', 'process.exit(0)'],
        cwd: run.root,
        timeoutSeconds: 10,
        stateLogPath: run.stateLogPath,
        executor: EXECUTOR,
        iteration: 1,
        guardContext: { env: { PATH: process.env.PATH, HOME: process.env.HOME }, ancestryCmdlines: [], statePaths: [] },
        receiptDir: join(notADirectory, 'receipts'),
        dispatchId: `${mode}-i1-g1`,
        sessionId: run.sessionId,
      });
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));

      const failures = stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_receipt_write_failed');
      expect(failures.map((row) => row.phase)).toEqual(['intent', 'completion']);
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it.each(['review', 'research'] as const)('keeps the %s post-dispatch executor audit through a projection refresh', (mode) => {
    const run = openRun(mode);
    try {
      appendThroughGateway(mode, run.runDirectory, leafIterationRecord(mode, run.sessionId));
      appendExecutorAuditToLastRecord(run.stateLogPath, EXECUTOR, run.sessionId);
      // A second audit finds the opening row and appends nothing.
      const afterAudit = readFileSync(run.stateLogPath, 'utf8');
      appendExecutorAuditToLastRecord(run.stateLogPath, EXECUTOR, run.sessionId);
      expect(readFileSync(run.stateLogPath, 'utf8')).toBe(afterAudit);
      appendThroughGateway(mode, run.runDirectory, { ...leafIterationRecord(mode, run.sessionId), iteration: 2, run: 2 });

      const opening = stateRows(run.stateLogPath).filter((row) => row.type === 'iteration_start' && row.iteration === 1);
      expect(opening).toHaveLength(1);
      expect(opening[0].executor).toMatchObject({ kind: 'cli-claude-code', model: 'claude-opus-4-6' });
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });

  it('writes a failure row straight into a ledger-backed log when the run names no session id', () => {
    const run = openRun('review');
    try {
      emitDispatchFailure(run.stateLogPath, EXECUTOR, 'timeout', 1, 'deadline exceeded');
      expect(stateRows(run.stateLogPath).filter((row) => row.event === 'dispatch_failure')).toHaveLength(1);
    } finally {
      rmSync(run.root, { recursive: true, force: true });
    }
  });
});
```

#### E18a. Research schema fixtures for the two rows
File: `$DL/tests/unit/deep-research-ledger-schema.vitest.ts`. Search text:
```text
    recoverableByOverride: false, timestamp: LEGACY_ROW_TIMESTAMP,
  },
} as const;
```
Replacement:
```text
    recoverableByOverride: false, timestamp: LEGACY_ROW_TIMESTAMP,
  },
  dispatchFailure: {
    type: 'event', event: 'dispatch_failure',
    executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6', reasoningEffort: 'high', serviceTier: null },
    reason: 'crash', iteration: 3, detail: 'executor exited with status 1', executorUnavailable: true,
    matchedMarker: 'rate limit', timestamp: LEGACY_ROW_TIMESTAMP, sessionId: 'session-1',
  },
  dispatchReceiptWriteFailed: {
    type: 'event', event: 'dispatch_receipt_write_failed', reason: 'dispatch_receipt_write_failed',
    phase: 'intent', iteration: 3,
    executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6', reasoningEffort: 'high', serviceTier: null },
    timestamp: LEGACY_ROW_TIMESTAMP, detail: 'ENOTDIR: not a directory', sessionId: 'session-1',
  },
} as const;
```

#### E18b. The per-stem payload table
File: `$DL/tests/unit/deep-research-ledger-schema.vitest.ts`. Search text:
```text
    'deep_research.pivot_failed': legacyRowData(LEGACY_LIFECYCLE_ROWS.pivotFailed),
```
Replacement:
```text
    'deep_research.pivot_failed': legacyRowData(LEGACY_LIFECYCLE_ROWS.pivotFailed),
    'deep_research.dispatch_failure': legacyRowData(LEGACY_LIFECYCLE_ROWS.dispatchFailure),
    'deep_research.dispatch_receipt_write_failed': legacyRowData(LEGACY_LIFECYCLE_ROWS.dispatchReceiptWriteFailed),
```

#### E18c. The round-trip cases
File: `$DL/tests/unit/deep-research-ledger-schema.vitest.ts`. Search text:
```text
    { stem: 'deep_research.pivot_failed', record: LEGACY_LIFECYCLE_ROWS.pivotFailed },
```
Replacement:
```text
    { stem: 'deep_research.pivot_failed', record: LEGACY_LIFECYCLE_ROWS.pivotFailed },
    { stem: 'deep_research.dispatch_failure', record: LEGACY_LIFECYCLE_ROWS.dispatchFailure },
    { stem: 'deep_research.dispatch_receipt_write_failed', record: LEGACY_LIFECYCLE_ROWS.dispatchReceiptWriteFailed },
```

#### E19. The stem census test counts the two new stems
File: `$DL/tests/unit/check-ledger-stem-producers.vitest.ts`. Search text:
```text
    // The measured vocabulary: 33 review + 53 research registrations. Twenty-three
    // are spoken: sixteen written as whole dotted literals, and seven more built
    // as a prefix plus an interpolated event name, which an earlier literal-only
    // scan reported as spoken by nobody while passing clean.
    expect(r.payload.registered).toBe(86);
    expect(r.payload.spoken).toBe(23);
    expect(r.payload.reserved).toBe(63);
```
Replacement:
```text
    // The measured vocabulary: 33 review + 55 research registrations. Twenty-three
    // are spoken: sixteen written as whole dotted literals, and seven more built
    // as a prefix plus an interpolated event name, which an earlier literal-only
    // scan reported as spoken by nobody while passing clean.
    expect(r.payload.registered).toBe(88);
    expect(r.payload.spoken).toBe(23);
    expect(r.payload.reserved).toBe(65);
```

#### Count and apply script
Save this outside the repository, for example as `$TMPDIR/writer-edits.cjs`. `node $TMPDIR/writer-edits.cjs <path to this plan.md> .` from the worktree root counts every search text from E1 to E19, skipping E15 and E16, and exits 0 only when each count equals its header and there are 43 edits. Adding `--apply` also makes each replacement. Applying the edits by hand from the fences above gives the same files.
```js
// Usage: node writer-edits.cjs <plan.md> <worktree root> [--apply]
const fs = require('node:fs');
const path = require('node:path');

const [planPath, root] = process.argv.slice(2);
const apply = process.argv.includes('--apply');
const prefixes = [
  ['$DL/', '.skilled/skills/system-deep-loop/runtime/'],
  ['$A/', '.skilled/commands/deep/assets/'],
];
const fence = '`'.repeat(3);
const plan = fs.readFileSync(planPath, 'utf8');
const section = plan.slice(plan.indexOf('#### E1. '), plan.indexOf('#### Count and apply script'));
const pattern = new RegExp(
  '#### (E\\d+[a-g]?)\\. [^\\n]*\\nFile: `([^`]+)`\\. (?:Matches (\\d+)\\. )?Search text:\\n'
  + `${fence}text\\n([\\s\\S]*?)${fence}\\nReplacement:\\n${fence}text\\n([\\s\\S]*?)${fence}\\n`,
  'g',
);
let edits = 0;
let bad = 0;
for (const [, id, file, matches, search, replacement] of section.matchAll(pattern)) {
  edits += 1;
  const expected = Number(matches ?? 1);
  const relative = prefixes.reduce((value, [from, to]) => value.replace(from, to), file);
  const target = path.join(root, relative);
  const text = fs.readFileSync(target, 'utf8');
  const count = text.split(search).length - 1;
  console.log(`${id} count=${count} expected=${expected}`);
  if (count !== expected) {
    bad += 1;
    continue;
  }
  if (apply) fs.writeFileSync(target, text.split(search).join(replacement), 'utf8');
}
console.log(`edits=${edits}`);
process.exit(bad === 0 && edits === 43 ? 0 : 1);
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baselines, run from the worktree root on 2026-11-14. The first ones ran at `6fb0f2c502` with phase 019's edits uncommitted in the tree, and the runtime that phase 019 then committed as `55d2f35341` is byte-identical to it. The two named files and the drift check were run again at `216ba55452`. The After column was measured on an APFS clone of `216ba55452` with E1 to E19 applied, the E15 script run and the contracts regenerated. The clone had its own copy of the worktree's git metadata, so nothing in it touched this checkout.

| Command | Before | After |
|---------|--------|-------|
| `cd $DL && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` | `Tests  78 passed (78)` (75 and 3) | `Tests  85 passed (85)` (75 and 10) |
| `cd $DL && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` with only E17a and E17b applied | the file holds 3 tests | `6 failed \| 4 passed (10)`. Both dispatch cases find no row, both receipt cases find none, and both audit cases see the second audit rewrite the log |
| `cd $DL && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts` | `Tests  52 passed (52)` | `Tests  54 passed (54)` |
| `cd $DL && npx vitest run` on `tests/executor-audit-receipts.test.ts`, `tests/unit/dispatch-failure.vitest.ts`, `tests/unit/deep-research-reducers.vitest.ts` and `tests/unit/check-ledger-stem-producers.vitest.ts` | `6`, `2`, `47` and `8 passed` | the same |
| `cd $DL && npm run typecheck` | exit 0 | exit 0 |
| `node $DL/scripts/check-ledger-stem-producers.cjs` | `"ok":true`, `"registered":86`, `"spoken":23`, `"reserved":63` | `"ok":true`, `"registered":88`, `"spoken":23`, `"reserved":65` |
| `cd $DL && npx vitest run`, the full suite, each on its own clone of `216ba55452` | `Test Files  174 passed (174)`, `Tests  2907 passed \| 8 skipped (2915)`, exit 0 | `Test Files  174 passed (174)`, `Tests  2916 passed \| 8 skipped (2924)`, exit 0 |
| `node $DL/scripts/check-projection-coverage.cjs` and `check-protocol-append-sites.cjs` | `"ok":true` and `"violations":[]` each | the same |
| `node $DL/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` at `216ba55452`. At `6fb0f2c502` it exited 2 with six `STALE_SOURCE_DIGEST` lines, which phase 019's commit cleared | `[CONTRACT DRIFT] OK commands=3` after E16, exit 0 |

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three writers on a real ledger-backed run, opened and refreshed through the gateway, for review and research | Vitest |
| Unit | The two research stems: upcast, schema check and projection back to the same row and key order | Vitest |
| Integration | The four workflow assets and their compiled contracts | `check-contract-drift.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 019 committed | Internal | Green, committed as `55d2f35341` | E4, E7b, E8, E17a and E17b match 019's text, so they count 0 without it |
| The operator's answers in `spec.md` section 7 | Internal | Yellow | Each question has a recommended answer this plan already follows |
| A git checkout for the gateway's cutover binding | Internal | Green | The survival tests open real runs, which the gateway refuses outside a checkout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a ledger-backed run loses a failure row it kept before, or a run with no ledger gets different bytes, which `tests/unit/executor-audit.vitest.ts` would show. Revert the one commit. Ledgers that already hold a `deep_research.dispatch_failure` or `deep_research.dispatch_receipt_write_failed` event no longer replay after the revert, because the older schema does not know the stem. Before reverting, list them with `rg -l 'deep-research.ledger.dispatch-' specs -g '*.frame'`.
<!-- /ANCHOR:rollback -->

---
