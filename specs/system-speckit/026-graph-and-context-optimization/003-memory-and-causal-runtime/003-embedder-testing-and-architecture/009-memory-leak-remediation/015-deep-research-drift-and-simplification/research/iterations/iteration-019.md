# Iteration 019 — drift (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 19 of 20
- Angle: drift
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-23T00:42:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- Cumulative findings before this iter: 100

## Summary
Reviewed the sidecar codebase for drift issues not covered in iterations 1, 7, and 13, focusing on cross-language implementation drift, error handling drift, and contract drift between JS and Python sibling implementations. Found 4 novel drift issues: 2 P1 (health payload body size limit drift between JS and Python, process liveness error handling drift) and 2 P2 (log file open mode drift, temp file naming pattern drift). Zero overlap with prior drift iteration findings.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Health payload body size limit drift between JS and Python implementations**
- **Fingerprint:** `drift:ensure-rerank-sidecar:health-payload-body-size-limit-drift`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:80-81`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:36-49 — no body size limit
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
  ```
  ```python
  # ensure_rerank_sidecar.py:80-81 — 8192 byte limit
  with urllib.request.urlopen(url, timeout=timeout_seconds) as response:
      body = response.read(8192)
  ```
- **Reasoning:** The Python implementation of `health_payload` reads only 8192 bytes from the HTTP response body, while the JavaScript implementation accumulates the entire response body without any size limit. This creates a contract drift between the two sibling implementations that are supposed to be functionally identical. If the /health endpoint returns a response larger than 8192 bytes (e.g., due to added fields, verbose logging, or future expansion), the Python implementation will truncate the response and fail to parse the JSON, while the JavaScript implementation will handle it correctly. This drift can lead to different behavior depending on which language implementation is used, with the Python version being more fragile to response size changes.
- **Suggested remediation:** Either (a) remove the 8192 byte limit from the Python implementation to match the JavaScript behavior, or (b) add a matching size limit to the JavaScript implementation and document the maximum expected response size. Given that health check responses are typically small, removing the limit from Python is the safer choice to prevent future truncation issues.
- **Severity rationale:** P1 — This is a contract violation between two sibling implementations that are supposed to be functionally identical. The body size limit creates a correctness risk where the Python version can fail to parse valid health responses that exceed 8192 bytes, while the JavaScript version succeeds. This drift can lead to different behavior depending on which language implementation is used.

**Title: Process liveness error handling drift between JS and Python implementations**
- **Fingerprint:** `drift:ensure-rerank-sidecar:process-liveness-error-handling-drift`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:150-161`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:178-187 — defaults to 'alive' on unknown errors
  function processLiveness(pid, processObj) {
    try {
      processObj.kill(pid, 0);
      return 'alive';
    } catch (error) {
      if (error.code === 'ESRCH') return 'dead';
      if (error.code === 'EPERM') return 'eperm';
      return 'alive';  // unknown errors default to 'alive'
    }
  }
  ```
  ```python
  # sidecar_ledger.py:150-161 — defaults to 'alive' on OSError
  def process_liveness(pid: int) -> Literal["alive", "dead", "eperm"]:
      if pid <= 0:
          return "dead"
      try:
          os.kill(pid, 0)
          return "alive"
      except ProcessLookupError:
          return "dead"
      except PermissionError:
          return "eperm"
      except OSError:
          return "alive"  # OSError defaults to 'alive'
  ```
- **Reasoning:** While both implementations default to 'alive' on unknown errors, the error handling drift is in the specificity of error handling. The Python implementation explicitly handles `ProcessLookupError` (ESRCH equivalent) and `PermissionError` (EPERM equivalent) as specific cases, then catches `OSError` as a catch-all. The JavaScript implementation checks `error.code === 'ESRCH'` and `error.code === 'EPERM'` explicitly, then defaults to 'alive' for any other error. The drift is that the Python implementation treats any `OSError` (which includes more than just EPERM/ESRCH) as 'alive', while the JavaScript implementation only treats non-ESRCH/non-EPERM errors as 'alive'. This creates a subtle contract drift where the two implementations may return different results for the same error condition (e.g., EINVAL, EACCES on different platforms). While both default to 'alive' for unknown errors, the boundary conditions differ.
- **Suggested remediation:** Align the error handling logic between both implementations. Either (a) document that both implementations default to 'alive' for any error that is not explicitly ESRCH/EPERM, or (b) expand the JavaScript implementation to handle additional error codes that Python's OSError catch-all would include. The current drift is subtle but can lead to different behavior on edge cases.
- **Severity rationale:** P1 — Error handling drift between sibling implementations is a correctness risk. While both default to 'alive' for unknown errors, the boundary conditions differ, which can lead to different process liveness classification depending on which language implementation is used. This drift is particularly problematic in cross-platform scenarios where different error codes may be encountered.

### P2 — Suggestions

**Title: Log file open mode drift between JS and Python implementations**
- **Fingerprint:** `drift:ensure-rerank-sidecar:log-file-open-mode-drift`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:89`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:171`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:89 — opens in text mode 'a'
  return fsModule.openSync(path.join(cacheDir, 'sidecar.log'), 'a');
  ```
  ```python
  # ensure_rerank_sidecar.py:171 — opens in binary mode 'ab'
  return (cache_dir / "sidecar.log").open("ab")
  ```
- **Reasoning:** The JavaScript implementation opens the sidecar log file in text mode ('a'), while the Python implementation opens it in binary append mode ('ab'). This creates a drift in how log data is written to the file. Text mode may perform newline translation depending on the platform, while binary mode writes data as-is. This drift can lead to inconsistent log file formatting between the two implementations, particularly on Windows where newline translation differs. While both implementations write text data to the log, the mode difference creates a subtle contract drift that could affect log parsing tools or cross-platform log analysis.
- **Suggested remediation:** Align the file open mode between both implementations. Since the log data is text, both should use text mode ('a' in JS, 'a' in Python) or both should use binary mode with explicit encoding. The current drift is a quality issue that can lead to inconsistent log file behavior across platforms.
- **Severity rationale:** P2 — This is a quality drift issue with no functional impact on the sidecar operation itself. The log files will be written in both cases, but the mode difference can lead to inconsistent formatting and potential issues with log parsing tools. This is a maintainability issue rather than a functional defect.

**Title: Temp file naming pattern drift between JS and Python implementations**
- **Fingerprint:** `drift:ensure-rerank-sidecar:temp-file-naming-pattern-drift`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:197-199`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:167 — manual temp file naming
  const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
  ```
  ```python
  # sidecar_ledger.py:197-199 — uses tempfile.mkstemp with pattern
  fd, temp_name = tempfile.mkstemp(
      prefix=f"{LEDGER_FILE_NAME}.tmp.{os.getpid()}.",
      dir=str(target_dir),
      text=True,
  )
  ```
- **Reasoning:** The JavaScript implementation uses a manual temp file naming pattern with `${target}.tmp.${process.pid}.${Date.now()}`, while the Python implementation uses `tempfile.mkstemp` with a prefix pattern. The JavaScript pattern includes the full target filename plus `.tmp`, while the Python pattern uses only the LEDGER_FILE_NAME plus `.tmp.` as a prefix. This creates a drift in temp file naming conventions. While both patterns are functionally correct for atomic rename operations, the drift makes it harder to correlate temp files between the two implementations and creates maintenance burden when debugging ledger write issues. The Python approach using `tempfile.mkstemp` is more robust (handles race conditions, unique naming), while the JavaScript manual approach is simpler but less robust.
- **Suggested remediation:** Align the temp file naming pattern between both implementations. Either (a) adopt the Python `tempfile.mkstemp` pattern in JavaScript (using a similar library or manual implementation), or (b) document the different naming conventions and their rationale. The current drift is a maintainability issue that makes cross-language debugging harder.
- **Severity rationale:** P2 — This is a naming convention drift with no functional impact on the ledger write operation. Both patterns produce unique temp file names that work correctly for atomic rename. The drift is a maintainability issue that makes it harder to correlate temp files between implementations and increases cognitive load during debugging.

## Convergence Signal
- New findings this iter: 4
- Cumulative finding count after iter: 104
- New-findings ratio: 0.038
- Continue / converged signal: `converged` (ratio ≤ 0.10 for third consecutive drift iteration)

## Files Touched (this iter)
- `iterations/iteration-019.md`
- `deltas/iter-019.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
