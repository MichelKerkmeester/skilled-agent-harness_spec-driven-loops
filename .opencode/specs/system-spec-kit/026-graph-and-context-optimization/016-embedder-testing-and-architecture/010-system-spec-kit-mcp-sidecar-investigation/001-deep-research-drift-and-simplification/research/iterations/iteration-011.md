# Iteration 011 — simplification (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 11 of 20
- Angle: simplification
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:54:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- Cumulative findings before this iter: 56

## Summary
Reviewed the sidecar surface for new simplification opportunities not covered in iteration 5. Focused on duplicate code patterns, repetitive error handling, nested control flow, and redundant defensive checks. Found 4 novel findings — 2 P1 (sidecar-client terminateChild duplicate signal/exit pattern, execution-router registerShutdownHooks repetitive signal handling) and 2 P2 (ensure-rerank-sidecar healthPayload repetitive error handling, reindex writeVectors duplicate cardinality check). Zero overlap with prior simplification findings (iter 5 covered single-call helpers, dual representation, deps injection, type guard inline).

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Sidecar-client terminateChild duplicate signal/exit pattern**
- **Fingerprint:** `simplification:sidecar-client:terminatechild-duplicate-signal-exit-pattern`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408`
- **Evidence:**
  ```typescript
  private async terminateChild(child: ChildProcess): Promise<void> {
    if (this.termination) {
      await this.termination;
      return;
    }

    this.shuttingDown = true;
    this.termination = (async () => {
      signalChildProcessGroup(child, 'SIGTERM');
      const exitedAfterTerm = await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      if (!exitedAfterTerm) {
        signalChildProcessGroup(child, 'SIGKILL');
        await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      }
      this.cleanupChild(child);
      await sleep(0);
    })();
    try {
      await this.termination;
    } finally {
      this.termination = null;
      this.shuttingDown = false;
    }
  }
  ```
- **Reasoning:** The `terminateChild` method repeats the pattern `signalChildProcessGroup(child, signal) + await waitForChildExit(child, timeout)` twice (lines 393-394 and 396-397). This is a SIGTERM-then-SIGKILL escalation pattern that could be extracted into a helper function `terminateWithEscalation(child, signals, timeout)`. The current implementation has 24 lines with duplicated logic. The pattern is: try graceful termination, wait, if not exited try forceful termination, wait again. This is a common pattern that could be abstracted to reduce duplication and make the intent clearer.
- **Suggested remediation:** Extract the escalation pattern into a helper function:
  ```typescript
  async function terminateWithEscalation(child: ChildProcess, signals: NodeJS.Signals[], timeoutMs: number): Promise<void> {
    for (const signal of signals) {
      signalChildProcessGroup(child, signal);
      const exited = await waitForChildExit(child, timeoutMs);
      if (exited) return;
    }
  }
  ```
  Then simplify `terminateChild` to:
  ```typescript
  this.termination = (async () => {
    await terminateWithEscalation(child, ['SIGTERM', 'SIGKILL'], DEFAULT_TERMINATION_GRACE_MS);
    this.cleanupChild(child);
    await sleep(0);
  })();
  ```
  This reduces the method from 24 lines to ~12 lines and eliminates the duplicate pattern.
- **Severity rationale:** P1 — The duplicate pattern makes the code harder to follow and maintain. If the escalation logic needs to change (e.g., add SIGQUIT between SIGTERM and SIGKILL), it must be updated in two places. Extracting the pattern reduces cognitive load and makes the intent clearer.

**Title: Execution-router registerShutdownHooks repetitive signal handling**
- **Fingerprint:** `simplification:execution-router:registershutdownhooks-repetitive-signal-handling`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124`
- **Evidence:**
  ```typescript
  function registerShutdownHooks(): void {
    if (shutdownHooksRegistered) {
      return;
    }

    shutdownHooksRegistered = true;
    const shutdown = (): void => {
      void shutdownAllSidecars();
    };
    process.once('beforeExit', shutdown);
    process.once('SIGINT', () => {
      shutdown();
      process.kill(process.pid, 'SIGINT');
    });
    process.once('SIGTERM', () => {
      shutdown();
      process.kill(process.pid, 'SIGTERM');
    });
  }
  ```
- **Reasoning:** The signal handling for SIGINT and SIGTERM is identical except for the signal name. Both call `shutdown()` then `process.kill(process.pid, signal)`. This repetition could be eliminated with a helper function that takes the signal as a parameter. The current implementation has 19 lines with 6 lines of duplicated logic. The pattern is: register signal handler, call shutdown, re-kill self with same signal.
- **Suggested remediation:** Extract the signal handler pattern into a helper:
  ```typescript
  function registerShutdownHooks(): void {
    if (shutdownHooksRegistered) {
      return;
    }

    shutdownHooksRegistered = true;
    const shutdown = (): void => {
      void shutdownAllSidecars();
    };
    process.once('beforeExit', shutdown);

    const registerSignal = (signal: NodeJS.Signals): void => {
      process.once(signal, () => {
        shutdown();
        process.kill(process.pid, signal);
      });
    };
    registerSignal('SIGINT');
    registerSignal('SIGTERM');
  }
  ```
  This reduces the function from 19 lines to ~16 lines and eliminates the duplicate signal handling logic. If more signals need to be added (e.g., SIGHUP), they can be added with a single line.
- **Severity rationale:** P1 — The duplicate signal handling logic makes the code harder to maintain. If the shutdown behavior needs to change (e.g., add logging before re-killing), it must be updated in two places. Extracting the pattern reduces duplication and makes it easier to add new signal handlers.

### P2 — Suggestions

**Title: Ensure-rerank-sidecar healthPayload repetitive error handling**
- **Fingerprint:** `simplification:ensure-rerank-sidecar:healthpayload-repetitive-error-handling`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:30-58`
- **Evidence:**
  ```javascript
  async function healthPayload(port, timeoutMs, deps = {}) {
    const httpModule = deps.http ?? http;
    return new Promise((resolve) => {
      const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          try {
            const parsed = JSON.parse(body);
            resolve(parsed && typeof parsed === 'object' ? parsed : null);
          } catch {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
    });
  }
  ```
- **Reasoning:** The function has three error paths that all resolve with `null`: `req.on('error')`, `req.on('timeout')`, and the JSON parse catch block. This repetitive `resolve(null)` pattern could be consolidated. The current implementation has 29 lines with 3 separate error handlers doing the same thing. The pattern is: on any error, resolve null.
- **Suggested remediation:** Consolidate the error handling into a single helper:
  ```javascript
  async function healthPayload(port, timeoutMs, deps = {}) {
    const httpModule = deps.http ?? http;
    return new Promise((resolve) => {
      const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return resolve(null);
          }
          try {
            const parsed = JSON.parse(body);
            resolve(parsed && typeof parsed === 'object' ? parsed : null);
          } catch {
            resolve(null);
          }
        });
      });
      const onError = () => resolve(null);
      req.on('error', onError);
      req.on('timeout', () => {
        req.destroy();
        onError();
      });
    });
  }
  ```
  This reduces the function from 29 lines to ~26 lines and consolidates the error handling logic. The `onError` helper makes it clear that all error paths resolve to null.
- **Severity rationale:** P2 — The error handling is correct but repetitive. Consolidating it reduces code duplication and makes the intent clearer. The simplification is minor but improves maintainability.

**Title: Reindex writeVectors duplicate cardinality check**
- **Fingerprint:** `simplification:reindex:writevectors-duplicate-cardinality-check`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:215-238,249-269`
- **Evidence:**
  ```typescript
  // Lines 215-238: writeVectors
  function writeVectors(
    db: Database.Database,
    tableName: string,
    rows: MemoryRow[],
    embeddings: Float32Array[],
  ): void {
    const writeBatch = db.transaction(() => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO ${tableName} (id, vec)
        VALUES (?, ?)
      `);

      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const embedding = embeddings[i];
        if (!row || !embedding) {
          throw new Error('Embedding batch cardinality mismatch');
        }
        stmt.run(row.id, to_embedding_buffer(embedding));
      }
    });

    writeBatch();
  }

  // Lines 249-269: writeVectorsToKnn
  function writeVectorsToKnn(
    db: Database.Database,
    rows: MemoryRow[],
    embeddings: Float32Array[],
  ): void {
    const writeBatch = db.transaction(() => {
      const del = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      const ins = db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)');
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const embedding = embeddings[i];
        if (!row || !embedding) {
          throw new Error('Embedding batch cardinality mismatch');
        }
        del.run(BigInt(row.id));
        ins.run(BigInt(row.id), to_embedding_buffer(embedding));
      }
    });

    writeBatch();
  }
  ```
- **Reasoning:** Both `writeVectors` and `writeVectorsToKnn` have identical cardinality checks (`if (!row || !embedding) { throw new Error('Embedding batch cardinality mismatch'); }`). This check is duplicated in two functions that are called sequentially from `writeVectorsToShard`. The check could be moved to a helper function or eliminated entirely if the caller guarantees cardinality. The current implementation has the check duplicated in two places, adding 4 lines of redundant defensive code.
- **Suggested remediation:** Extract the cardinality check into a helper or move it to the caller:
  ```typescript
  function validateCardinality(rows: MemoryRow[], embeddings: Float32Array[]): void {
    for (let i = 0; i < rows.length; i += 1) {
      if (!rows[i] || !embeddings[i]) {
        throw new Error('Embedding batch cardinality mismatch');
      }
    }
  }

  function writeVectorsToShard(...) {
    // ...
    validateCardinality(rows, embeddings);
    writeVectors(shard, tableName, rows, embeddings);
    if (vecAvailable) {
      writeVectorsToKnn(shard, rows, embeddings);
    }
  }
  ```
  Then remove the check from both `writeVectors` and `writeVectorsToKnn`. This eliminates the duplicate check and centralizes the validation logic.
- **Severity rationale:** P2 — The duplicate check is defensive and correct, but adds maintenance burden. If the error message needs to change, it must be updated in two places. Centralizing the check reduces duplication and makes the code easier to maintain. The simplification is minor but improves code quality.

## Convergence Signal
- New findings this iter: 4
- Cumulative finding count after iter: 60
- New-findings ratio: 0.067
- Continue / converged signal: `continue` (ratio ≤ 0.10 but only first simplification iteration with low ratio; need 2 consecutive low-ratio iters to signal convergence)

## Files Touched (this iter)
- `iterations/iteration-011.md`
- `deltas/iter-011.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
