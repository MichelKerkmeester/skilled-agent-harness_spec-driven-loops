# Iteration 003 — TRACEABILITY

**Dimension:** Observability + Logging + Diagnostics + State Inspectability  
**Iteration:** 3 of 20  
**Focus:** TS reindex + rescue + handlers  
**Date:** 2026-05-17

---

## P0 Findings

### TRACE-001: Missing audit trail on state-changing embedder-set operation
**Severity:** P0  
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`  
**Lines:** 49-76

**Issue:** The `handleEmbedderSet` function performs a state-changing operation (embedder swap) that initiates a full reindex of the memory index, but emits no audit trail. This is a security and operational concern — there is no log record of who initiated the embedder change, when it occurred, or the target embedder name. The operation only returns a job ID to the caller without any server-side logging.

**Reproduction:**
1. Call `handleEmbedderSet({ name: 'nomic-embed-text-v1.5' })`
2. Observe that no log entry is emitted to stdout/stderr or any logging facility
3. Check the job is queued in the database but no audit trail exists outside the DB
4. Compare with other state-changing operations in the codebase — none have audit trails

**Recommendation:** Add structured logging before and after the embedder swap initiation. Log should include: timestamp, operation type (`embedder_set`), source (if available), from-embedder, to-embedder, job ID, and user identity if authenticated. Use a centralized logger with correlation ID propagation.

---

### TRACE-002: Silent catch block in reindex.ts hides critical errors without logging
**Severity:** P0  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`  
**Lines:** 302-305

**Issue:** The `runJob` function catches errors at lines 302-305 and stores them in the database, but does not emit any log entry. This means critical reindex failures (e.g., embedder adapter crashes, database write failures, network timeouts) are silently swallowed from an observability perspective. Operators only discover failures by polling the job status, not through proactive alerting.

**Reproduction:**
1. Start a reindex job with `startReindex({ toName: 'invalid-embedder' })`
2. The job will fail when the adapter cannot be constructed or embedding fails
3. Observe that no error log is emitted to stdout/stderr
4. The error is only visible by querying `getJobStatus(jobId)` in the database
5. In production, this means failures go undetected until manual polling

**Recommendation:** Emit structured error logging before storing the error in the database. Include job ID, phase (embedding vs write), processed count, total count, and the full error stack.

---

### TRACE-003: No correlation ID propagation across handlers
**Severity:** P0  
**File:** All handler files (`embedder-list.ts`, `embedder-set.ts`, `embedder-status.ts`)  
**Lines:** Entire files

**Issue:** None of the handler functions accept or propagate correlation IDs. This makes it impossible to trace a single request end-to-end across the MCP server infrastructure. When debugging production issues, operators cannot correlate log entries from different layers (handler → reindex → adapter → database) to understand the full request lifecycle.

**Reproduction:**
1. Call `handleEmbedderSet({ name: 'nomic-embed-text-v1.5' })`
2. The handler calls `startReindex` which calls `runJob` which calls adapter operations
3. Each layer emits logs (if any) but there is no shared correlation ID
4. In a production environment with concurrent requests, logs from different requests interleave
5. There is no way to group log entries by request to trace a single operation

**Recommendation:** Implement correlation ID propagation across all handlers and downstream calls. Add a `correlationId` parameter to handler functions (or extract from request context), pass it through to reindex operations, adapter calls, and database operations. Log the correlation ID in every log entry. This is a cross-cutting concern that requires infrastructure changes.

---

## P1 Findings

### TRACE-004: No telemetry on reindex progress
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`  
**Lines:** 252-306 (runJob function)

**Issue:** The `runJob` function processes embeddings in batches and updates the database with progress, but emits no telemetry. Operators have no visibility into reindex progress rates, batch processing times, or estimated completion time beyond polling the database. This makes it difficult to detect stuck jobs, slow embeddings, or performance regressions.

**Reproduction:**
1. Start a reindex job with a large memory index (e.g., 10,000 memories)
2. Monitor logs — there are no progress updates, rate metrics, or timing information
3. The only way to check progress is to poll `getJobStatus(jobId)` which requires database access
4. If the job hangs (e.g., embedder adapter slow), there is no alerting mechanism
5. No metrics are emitted to any observability system (Prometheus, Datadog, etc.)

**Recommendation:** Add structured progress logging at regular intervals (e.g., every 10% or every N batches). Include: job ID, processed count, total count, progress percentage, batch size, batch processing time, estimated rate, and ETA.

---

### TRACE-005: No telemetry on rescue hit-rate
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts`  
**Lines:** 346-375 (applyRetrievalRescueLayer function)

**Issue:** The `applyRetrievalRescueLayer` function applies rescue logic to boost candidate scores, but emits no telemetry. There is no visibility into how often rescue activates, how many candidates are rescued, what signals triggered rescue, or the effectiveness of rescue operations. This makes it impossible to measure whether the rescue layer is providing value or causing noise.

**Reproduction:**
1. Execute a search query that triggers retrieval rescue (e.g., "checklist for implementation")
2. Observe that no log entry indicates rescue was activated
3. No metrics are emitted on: rescue activation count, number of rescued candidates, rescue boost distribution, signal breakdown (token coverage vs trigger coverage vs document hints)
4. In production, there is no way to know if rescue is working as intended or causing ranking degradation

**Recommendation:** Add structured telemetry when rescue activates. Include: query (hashed or sampled), number of input candidates, number of rescued candidates, rescue score distribution, signal breakdown, and boost magnitude.

---

### TRACE-006: Missing structured logging fields in error messages
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`  
**Lines:** 97, 122, 126, 181, 186, 189

**Issue:** Error messages in `registry.ts` are thrown as plain strings without structured context. For example, line 97 throws `Embedder backend is not implemented yet: ${backend}` but does not include the embedder name, the operation being performed, or any correlation context. This makes debugging difficult in production where error logs lack context.

**Reproduction:**
1. Call `getAdapter('jina-embeddings-v3')` which uses the 'ollama' backend
2. If the backend construction fails, the error message is "Embedder backend is not implemented yet: ollama"
3. The error does not include: which embedder was requested, what operation triggered this, or any request context
4. In production logs, this error is ambiguous — was it a manual API call or an internal reindex operation?

**Recommendation:** Use structured error types with context fields. Either: (a) use a custom error class with structured fields (e.g., `class EmbedderError extends Error { embedderName: string; operation: string; }`), or (b) include structured context in the error message as JSON, or (c) log the context separately before throwing.

---

### TRACE-007: No version/commit fingerprint in logs
**Severity:** P1  
**File:** All in-scope files  
**Lines:** Entire files

**Issue:** None of the log entries (where they exist) include a version or commit fingerprint. In production, when debugging issues, operators cannot determine which version of the code generated a given log entry. This is critical for diagnosing whether a bug was introduced in a specific deployment or for correlating logs with git commits.

**Reproduction:**
1. Deploy the MCP server to production
2. Trigger an embedder swap operation
3. Observe any log entries — they do not include git commit hash, version tag, or build timestamp
4. If a bug is reported, operators cannot correlate the log entry to the specific code version
5. Rollback scenarios are difficult because logs cannot be mapped to deployments

**Recommendation:** Add a global log context field that includes the git commit hash, version tag, and build timestamp. This should be injected at build time (e.g., via `git rev-parse HEAD` during the build process) and included in all log entries.

---

### TRACE-008: Silent catch blocks in retrieval-rescue.ts hide errors without logging
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts`  
**Lines:** 107-109, 300-302, 312-314

**Issue:** The `retrieval-rescue.ts` file has multiple catch blocks that silently swallow errors without logging. Lines 107-109 catch JSON parse errors and fall through without logging. Lines 300-302 catch database query errors and return an empty array without logging. Lines 312-314 catch row hydration errors and return the original row without logging. This means rescue failures are invisible to operators.

**Reproduction:**
1. Trigger a retrieval rescue operation with a malformed trigger_phrases value (e.g., invalid JSON)
2. The JSON parse fails at line 103 but the catch block at 107-109 silently falls through
3. No log entry indicates the parse failure
4. The rescue operation continues with degraded behavior (missing trigger phrases)
5. Operators cannot detect this degradation in production

**Recommendation:** Add structured logging in all catch blocks before falling through or returning fallback values. Include the error context and what fallback behavior is being applied.

---

### TRACE-009: Silent catch blocks in embedder-list.ts hide readiness probe failures
**Severity:** P1  
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`  
**Lines:** 57-58, 73-74

**Issue:** The `embedder-list.ts` handler has catch blocks that silently swallow errors without logging. Lines 57-58 catch timeout errors and return `false` without logging. Lines 73-74 catch adapter readiness probe errors and return `false` without logging. This means embedder readiness failures are invisible to operators.

**Reproduction:**
1. Call `handleEmbedderList()` with an embedder that has a slow or failing adapter
2. The `probeReady` function at line 66 calls `adapter.ready()` which may timeout or throw
3. The catch blocks at 57-58 and 73-74 return `false` without logging
4. The embedder is marked as not ready in the response but no log entry indicates why
5. In production, operators cannot distinguish between a timeout, a thrown error, or a genuine `false` return

**Recommendation:** Add structured logging in catch blocks before returning fallback values. Include the embedder name, error context, and the probe result.

---

## P2 Findings

### TRACE-010: Unstructured console.warn in stage2-fusion.ts instead of structured logging
**Severity:** P2  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`  
**Lines:** 178-180, 223, 237

**Issue:** The `stage2-fusion.ts` file uses `console.warn` for logging model load issues and configuration warnings. These are unstructured plain text messages that are difficult to parse, query, or analyze in production log aggregators. They also lack correlation IDs, timestamps, and structured context fields.

**Reproduction:**
1. Set `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` to a value exceeding the guard (e.g., 0.5)
2. The code at line 178-180 emits `console.warn('[stage2-fusion] SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT=0.5 exceeds the 0.05 guard; clamping...')`
3. This is a plain text string that cannot be easily queried in log aggregators
4. The message includes a prefix but lacks structured fields like the actual value, the guard value, or the clamped result
5. In production, operators cannot aggregate or alert on these warnings programmatically

**Recommendation:** Replace `console.warn` with a structured logger. Include all relevant context as structured fields.

---

### TRACE-011: No centralized logging utility infrastructure across the stack
**Severity:** P2  
**File:** All in-scope files  
**Lines:** Entire files

**Issue:** None of the in-scope files import or use a centralized logging utility. There is no shared logger module with consistent log levels, structured field schemas, or correlation ID propagation. Each file would need to implement its own logging strategy, leading to inconsistency and missing observability.

**Reproduction:**
1. Search for logger imports across all in-scope files — none exist
2. Search for `console.log`, `console.warn`, `console.error` usage — only found in stage2-fusion.ts
3. There is no shared logging module in the codebase that provides structured logging
4. Each file would need to implement logging independently, leading to inconsistent schemas
5. No correlation ID propagation mechanism exists across the stack

**Recommendation:** Create a centralized logging utility module (e.g., `lib/logger.ts`) that provides:
- Structured logging with consistent field schemas
- Log level filtering (debug, info, warn, error)
- Correlation ID propagation
- Automatic context injection (version, commit hash, timestamp)
- Output to stdout/stderr in JSON format for log aggregators
- Integration with observability platforms (optional)

This is an infrastructure task that should be completed before adding individual log entries across the stack.

---

## Summary

**Total Findings:** 11  
- P0: 3 (audit trail, silent errors, correlation IDs)  
- P1: 6 (telemetry, structured fields, version fingerprint, silent failures)  
- P2: 2 (unstructured logging, missing infrastructure)

**Key Patterns:**
- Silent catch blocks across multiple files (reindex.ts, retrieval-rescue.ts, embedder-list.ts)
- Missing telemetry on critical paths (reindex progress, rescue hit-rate)
- No correlation ID propagation infrastructure
- No centralized logging utility
- Missing version/commit fingerprint in logs

**Cross-Cutting Concerns:**
- Need centralized logging utility before adding individual log entries
- Need correlation ID propagation mechanism across handlers
- Need audit trail infrastructure for state-changing operations

---

## Bundle Gate Results (loop manager)
- All cited file:line ranges verified to exist (Check 1+2 PASS).
- TRACE-001 verified: embedder-set.ts:49-76 contains no logger calls; no `import` for any logger module.
- TRACE-002 verified: reindex.ts:302-305 catch block stores error via setJobStatus but no log emitted; no logger import in file.
- TRACE-003 verified: no correlation ID propagation across the 3 handlers (no shared logger/tracer infrastructure).
- TRACE-004..011: all observability gaps, verified by absence of `logger.` / `console.` calls at cited locations.
- **Adjudication note**: "P0" for observability gaps is aggressive — these are debug-ability deficiencies, not production breakage. Synthesis will likely re-tier most TRACE-00x to P1 or P2 alongside the more severe correctness P0 from iter 1 (schema.ts DEFAULT_ACTIVE_EMBEDDER).
