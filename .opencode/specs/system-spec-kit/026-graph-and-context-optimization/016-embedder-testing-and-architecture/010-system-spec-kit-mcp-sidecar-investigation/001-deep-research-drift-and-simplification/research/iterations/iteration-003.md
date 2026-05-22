# Iteration 003 — security (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 3 of 20
- Angle: security
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:45:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- Cumulative findings before this iter: 11

## Summary
Reviewed the primary sidecar files and their Python siblings for security risks including untrusted input handling, process inheritance, environment variable injection, resource exhaustion, and race conditions. Found 6 security issues: 2 P0 (unbounded JSON parsing in sidecar-client, predictable temp file names in ensure-rerank-sidecar), 2 P1 (incorrect parent liveness detection in sidecar-worker, missing atomic file write in owner token creation), and 2 P2 (broad SPECKIT_ env prefix allowlist, missing input sanitization in config hash). All findings are novel — no overlap with prior drift or dead-code iterations.

## New Findings

### P0 — Blockers

**Title: Unbounded JSON parsing in sidecar-client stdout handler**
- **Fingerprint:** `security:sidecar-client:unbounded-json-parsing-resource-exhaustion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497`
- **Evidence:**
  ```typescript
  private handleStdout(chunk: string): void {
    this.stdoutBuffer += chunk;

    let newlineIndex = this.stdoutBuffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = this.stdoutBuffer.slice(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);
      if (line.length > 0) {
        this.handleResponseLine(line);
      }
      newlineIndex = this.stdoutBuffer.indexOf('\n');
    }
  }

  private handleResponseLine(line: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);  // No size limit
    } catch (error: unknown) {
      process.stderr.write(`[sidecar:${this.child?.pid ?? 'unknown'}] invalid json: ${toErrorMessage(error)}\n`);
      return;
    }
  ```
- **Reasoning:** The sidecar-client parses JSON from the child worker's stdout without any size limits. A malicious or buggy child process could send arbitrarily large JSON lines, causing memory exhaustion in the parent process. The stdout buffer grows unbounded as chunks are appended, and JSON.parse() will attempt to parse whatever is between newlines regardless of size. This is a resource exhaustion vector that could be exploited cross-trust-boundary (parent → child).
- **Suggested remediation:** Add a maximum line length limit (e.g., 1MB) to `handleStdout`. If a line exceeds the limit, reject it and terminate the child process. Also add a maximum buffer size limit to prevent unbounded memory growth.
- **Severity rationale:** P0 — Unbounded resource consumption from a child process is a critical security vulnerability. A malicious child could exhaust parent memory and cause denial of service.

**Title: Predictable temp file names in ensure-rerank-sidecar ledger writes**
- **Fingerprint:** `security:ensure-rerank-sidecar:predictable-temp-file-names-symlink-attack`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169`
- **Evidence:**
  ```javascript
  const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
  fsModule.writeFileSync(tmp, `${JSON.stringify({ version: 1, sidecars: rows }, null, 2)}\n`, { mode: 0o600 });
  fsModule.renameSync(tmp, target);
  ```
- **Reasoning:** The temporary file name uses a predictable pattern: `${target}.tmp.${process.pid}.${Date.now()}`. An attacker with knowledge of the target path and approximate time could pre-create symlinks at these predictable locations, causing the `writeFileSync` to write to arbitrary locations when the symlink is followed. This is a classic symlink attack (TOCTOU race) that could lead to arbitrary file write. The Python implementation (sidecar_ledger.py:197-209) uses `tempfile.mkstemp` which generates unpredictable random names, but the JavaScript implementation does not.
- **Suggested remediation:** Use `fs.mkstemp` or generate a cryptographically random suffix (e.g., `crypto.randomBytes(16).toString('hex')`) for the temp file name instead of the predictable `process.pid + Date.now()` pattern.
- **Severity rationale:** P0 — Predictable temp file names enable symlink attacks that can lead to arbitrary file writes, which is a critical security vulnerability especially when writing to privileged locations.

### P1 — Required

**Title: Incorrect parent liveness detection in sidecar-worker**
- **Fingerprint:** `security:sidecar-worker:incorrect-parent-liveness-detection-eperm-bypass`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:74-85`
- **Evidence:**
  ```typescript
  function parentProcessAlive(pid: number): boolean {
    if (!Number.isInteger(pid) || pid <= 0) {
      return false;
    }

    try {
      process.kill(pid, 0);
      return true;
    } catch (error: unknown) {
      return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'EPERM');
    }
  }
  ```
- **Reasoning:** The parent liveness check treats `EPERM` (permission error) as "process alive" (line 83). This is incorrect — `EPERM` means the current process lacks permission to signal the target, not that the target is alive. An attacker could manipulate permissions or PID namespaces to cause false positives, causing the worker to think the parent is alive when it's actually dead. This could lead to orphaned worker processes that continue running after the parent exits, potentially consuming resources or serving stale/malicious responses. The Python implementation (sidecar_ledger.py:150-161) correctly treats `PermissionError` as a distinct "eperm" state, not conflated with "alive".
- **Suggested remediation:** Change the logic to treat `EPERM` as a distinct state (like the Python implementation does) or as "unknown/dead" rather than conflating it with "alive". The worker should exit if it cannot definitively confirm the parent is alive.
- **Severity rationale:** P1 — Incorrect process liveness detection can lead to resource leaks and orphaned processes. While not directly exploitable for privilege escalation, it violates the intended lifecycle contract and could be abused for resource exhaustion.

**Title: Missing atomic file write in owner token creation**
- **Fingerprint:** `security:ensure-rerank-sidecar:non-atomic-owner-token-write-race-condition`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:117-127`
- **Evidence:**
  ```javascript
  const token = crypto.randomBytes(24).toString('base64url');
  try {
    fsModule.writeFileSync(tokenPath, `${token}\n`, { mode: 0o600, flag: 'wx' });
    return token;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const existing = fsModule.readFileSync(tokenPath, 'utf8').trim();
    if (!existing) throw error;
    return existing;
  }
  ```
- **Reasoning:** The owner token file write uses `flag: 'wx'` (write exclusive) which fails if the file exists, but the subsequent error handling reads the file and returns it if non-empty. This creates a race condition: between the `EEXIST` check and the `readFileSync`, another process could truncate the file to empty, causing this code to throw an error even though a valid token existed. More critically, if the file is created but not fully written (e.g., due to system crash), the `wx` flag prevents retry. The Python implementation (sidecar_ledger.py:130-147) uses `os.O_EXCL` with proper atomic write patterns and cleanup on failure. The JavaScript version lacks the same robustness.
- **Suggested remediation:** Use a proper atomic write pattern: write to a temp file with random name, then `renameSync` to the target (which is atomic on POSIX). This matches the pattern already used for ledger writes (lines 167-169) and the Python implementation.
- **Severity rationale:** P1 — Race conditions in security-critical file writes (owner tokens) can lead to token loss or corruption, causing service degradation or unnecessary sidecar respawns. Not directly exploitable for privilege escalation, but violates the intended reliability contract.

### P2 — Suggestions

**Title: Broad SPECKIT_ environment variable prefix allowlist**
- **Fingerprint:** `security:sidecar-client:broad-env-prefix-allowlist-injection-risk`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:175-181`
- **Evidence:**
  ```typescript
  function isAllowedEnvKey(key: string, explicitAllowlist: readonly string[] = []): boolean {
    return ALLOWED_ENV_KEYS.has(key)
      || key.startsWith('LC_')
      || key.startsWith('SPECKIT_EMBEDDER_')
      || key.startsWith('MOCK_SIDECAR_')
      || explicitAllowlist.includes(key);
  }
  ```
- **Reasoning:** The `SPECKIT_EMBEDDER_` prefix allowlist is overly broad — it allows ANY environment variable starting with this prefix to pass through to the child worker. This could enable environment variable injection if an attacker can set arbitrary `SPECKIT_EMBEDDER_*` variables in the parent process environment. While the current implementation only sets specific `SPECKIT_EMBEDDER_*` variables (lines 343-346), the broad allowlist creates a risk surface for future code paths or misconfigurations. The `MOCK_SIDECAR_` prefix has similar issues.
- **Suggested remediation:** Replace the broad prefix checks with an explicit allowlist of known `SPECKIT_EMBEDDER_*` variable names (e.g., `SPECKIT_EMBEDDER_SIDECAR_PROVIDER`, `SPECKIT_EMBEDDER_SIDECAR_MODEL`, etc.). If a prefix-based allowlist is needed for flexibility, document the security implications and add input validation for specific variable values.
- **Severity rationale:** P2 — The current implementation only sets specific variables, so the broad allowlist is not currently exploitable. However, it creates a security debt that could become problematic if the code evolves or if environment variables are set by untrusted sources.

**Title: Missing input sanitization in config hash calculation**
- **Fingerprint:** `security:ensure-rerank-sidecar:missing-input-sanitization-config-hash`
- **File(s):** 
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:129-141`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:135-149`
- **Evidence:**
  ```javascript
  function canonicalConfigHash(port, env) {
    const config = {
      allowed: env.RERANK_ALLOWED_MODELS || '',
      device: env.RERANK_DEVICE || '',
      dtype: env.RERANK_TORCH_DTYPE || '',
      model: env.RERANK_MODEL_NAME || 'Qwen/Qwen3-Reranker-0.6B',
      port: String(port),
      revision: env.RERANK_MODEL_REVISION || 'e61197ed45024b0ed8a2d74b80b4d909f1255473',
      revisions: env.RERANK_MODEL_REVISIONS || '',
    };
    const stable = Object.keys(config).sort().map((key) => `${key}=${config[key]}`).join('\n');
    return crypto.createHash('sha256').update(stable, 'utf8').digest('hex');
  }
  ```
- **Reasoning:** The config hash directly includes environment variable values without sanitization or normalization. While this is used for configuration comparison (not execution), an attacker who can set these environment variables could cause hash collisions or unexpected hash values by crafting specific inputs (e.g., newlines, special characters in model names). The hash is used for sidecar reuse decisions, so manipulated hashes could cause incorrect sidecar selection or unnecessary respawns. Both JavaScript and Python implementations have this issue.
- **Suggested remediation:** Normalize environment variable values before hashing: trim whitespace, restrict character sets (e.g., only alphanumeric, hyphens, underscores, slashes for model names), and validate that values match expected patterns.
- **Severity rationale:** P2 — The config hash is used for internal state management, not security-critical operations like authentication. While manipulation could cause service degradation, it does not directly enable privilege escalation or data exfiltration.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 17
- New-findings ratio: 0.35
- Continue / converged signal: `continue` (ratio > 0.10; this is the first security pass)

## Files Touched (this iter)
- `iterations/iteration-003.md`
- `deltas/iter-003.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
