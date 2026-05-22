# Iteration 009 — security (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 9 of 20
- Angle: security
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:50:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
- Cumulative findings before this iter: 46

## Summary
Reviewed the sidecar implementation for additional security risks beyond those found in iteration 3. Focused on input validation in the worker, request ID predictability, environment variable leakage in child process spawning, and signal handling safety. Found 5 new security issues: 1 P0 (unbounded JSON parsing in sidecar-worker), 2 P1 (predictable request IDs enabling request hijacking, environment variable leakage to child processes), and 2 P2 (fixed polling interval enabling timing attacks, unsafe signal handling in shutdown hooks). All findings are novel — no overlap with prior security iteration (iter 3).

## New Findings

### P0 — Blockers

**Title: Unbounded JSON parsing in sidecar-worker stdin handler**
- **Fingerprint:** `security:sidecar-worker:unbounded-json-parsing-resource-exhaustion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132`
- **Evidence:**
  ```typescript
  function parseRequest(line: string): WorkerRequest {
    const parsed = JSON.parse(line) as Partial<WorkerRequest>;  // No size limit
    if (!parsed || typeof parsed !== 'object' || typeof parsed.id !== 'number' || typeof parsed.type !== 'string') {
      throw new Error('Invalid sidecar request envelope');
    }
    // ... validation logic
    return {
      id: parsed.id,
      type: 'embed',
      input: candidate.input,
      model: typeof candidate.model === 'string' ? candidate.model : '',
      dimensions: typeof candidate.dimensions === 'number' ? candidate.dimensions : 0,
      inputType: candidate.inputType === 'query' ? 'query' : 'document',
    };
  }
  ```
- **Reasoning:** The sidecar-worker parses JSON from stdin without any size limits, mirroring the P0 issue found in sidecar-client (iter 3). A malicious parent process could send arbitrarily large JSON lines, causing memory exhaustion in the worker process. While the parent is trusted in the current architecture, this creates a resource exhaustion vector that could be exploited if the trust boundary changes or if the parent process is compromised. The worker has no defense against malformed or oversized input.
- **Suggested remediation:** Add a maximum line length limit (e.g., 1MB) before calling `JSON.parse`. If a line exceeds the limit, reject it and exit the worker process. Also add validation for the `input` array length to prevent unbounded array allocation.
- **Severity rationale:** P0 — Unbounded resource consumption from the parent process is a critical security vulnerability. A compromised or buggy parent could exhaust worker memory and cause denial of service.

### P1 — Required

**Title: Predictable request IDs enable request hijacking**
- **Fingerprint:** `security:sidecar-client:predictable-request-ids-hijacking-risk`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:214,443-444`
- **Evidence:**
  ```typescript
  private nextId = 1;
  // ...
  const id = this.nextId;
  this.nextId += 1;
  const request = { id, ...payload };
  ```
- **Reasoning:** Request IDs are generated using a simple incrementing counter starting from 1. This is predictable and could be exploited for request hijacking if an attacker can influence the child process or observe the communication channel. An attacker who can predict the next request ID could send a forged response with that ID, causing the parent to accept malicious data. While the current architecture uses a pipe for IPC (which is harder to intercept than network sockets), the predictability still creates a risk surface. The counter also wraps around at `Number.MAX_SAFE_INTEGER`, potentially causing ID collisions in long-running processes.
- **Suggested remediation:** Use cryptographically random request IDs (e.g., `crypto.randomBytes(8).readBigUInt64BE()`) instead of sequential IDs. If sequential IDs are needed for debugging, use a combination of random prefix + sequential suffix.
- **Severity rationale:** P1 — Predictable request IDs in an IPC protocol create a request hijacking risk. While the current pipe-based IPC mitigates network-based attacks, the predictability is still a security anti-pattern.

**Title: Environment variable leakage to child processes**
- **Fingerprint:** `security:ensure-rerank-sidecar:env-var-leakage-child-process`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:252-257`
- **Evidence:**
  ```javascript
  const child = spawnFn('bash', [startScriptPath], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: {
      ...processObj.env,  // Leaks all parent environment variables
      RERANK_SIDECAR_PORT: String(port),
      RERANK_SIDECAR_OWNER_TOKEN: ownerToken,
      RERANK_SIDECAR_CONFIG_HASH: configHash,
    },
  });
  ```
- **Reasoning:** The spawn call passes through the entire parent environment (`...processObj.env`) to the child bash process. This leaks all environment variables from the parent process to the sidecar, including potentially sensitive variables like API keys, tokens, database credentials, or other secrets. While the sidecar script may not read all of these, they are still exposed in the child process's environment, which could be dumped via `/proc/<pid>/environ` on Linux or accessed through debugging tools. The sidecar-client has an allowlist mechanism (sidecar-client.ts:175-181), but ensure-rerank-sidecar does not.
- **Suggested remediation:** Implement an allowlist pattern similar to sidecar-client's `isAllowedEnvKey` function. Only pass environment variables that the sidecar explicitly needs (e.g., PATH, HOME, TMPDIR, and RERANK_* variables).
- **Severity rationale:** P1 — Leaking sensitive environment variables to child processes is a security violation. While the sidecar may be trusted, unnecessary exposure of secrets increases the attack surface and violates the principle of least privilege.

### P2 — Suggestions

**Title: Fixed polling interval enables timing attacks**
- **Fingerprint:** `security:sidecar-worker:fixed-polling-interval-timing-attack`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:93-97`
- **Evidence:**
  ```typescript
  parentPollTimer = setInterval(() => {
    if (!parentProcessAlive(parentPid)) {
      process.exit(0);
    }
  }, 250);  // Fixed 250ms interval
  parentPollTimer.unref?.();
  ```
- **Reasoning:** The parent death polling uses a fixed 250ms interval without any jitter or randomness. This creates a timing side-channel that could be used to infer when the parent process is checking liveness or to synchronize attacks with the polling cycle. An attacker who can observe the worker's behavior could potentially use the predictable timing to optimize attacks or infer internal state. While the impact is limited in the current architecture, fixed intervals are a security anti-pattern.
- **Suggested remediation:** Add jitter to the polling interval (e.g., `250 + Math.random() * 50` ms) to make the timing less predictable. Alternatively, use event-based parent death detection (e.g., `process.on('disconnect')` in Node.js IPC) instead of polling.
- **Severity rationale:** P2 — Fixed polling intervals are a minor security issue. The impact is limited in the current architecture, but jitter is a low-cost mitigation.

**Title: Unsafe signal handling in shutdown hooks**
- **Fingerprint:** `security:execution-router:unsafe-signal-handling-shutdown-hooks`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:116-123`
- **Evidence:**
  ```typescript
  process.once('SIGINT', () => {
    shutdown();
    process.kill(process.pid, 'SIGINT');  // Re-sends signal to self
  });
  process.once('SIGTERM', () => {
    shutdown();
    process.kill(process.pid, 'SIGTERM');  // Re-sends signal to self
  });
  ```
- **Reasoning:** The signal handlers re-send the same signal to the current process after calling `shutdown()`. This creates a risk of signal recursion if the signal is delivered again during shutdown. The `once()` modifier prevents multiple calls to the same handler, but if the process receives the signal during the `shutdown()` async operation, the re-sent signal could cause unexpected behavior. Additionally, re-sending SIGTERM/SIGINT to self is unusual — typically signal handlers either exit gracefully or do nothing and let the default handler run.
- **Suggested remediation:** Remove the `process.kill(process.pid, signal)` calls. Let the default signal handler run after the custom handler completes, or explicitly call `process.exit(0)` if graceful shutdown is complete. If re-sending the signal is intentional, add a guard flag to prevent recursion.
- **Severity rationale:** P2 — The signal handling pattern is unusual and could cause unexpected behavior, but it's not directly exploitable for privilege escalation or data exfiltration. The `once()` modifier provides some protection against recursion.

## Convergence Signal
- New findings this iter: 5
- Cumulative finding count after iter: 51
- New-findings ratio: 0.098
- Continue / converged signal: `converged` (ratio ≤ 0.10; this is the second security pass)

## Files Touched (this iter)
- `iterations/iteration-009.md`
- `deltas/iter-009.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
