# Iteration 013 — drift (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 13 of 20
- Angle: drift
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-23T00:03:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
- Cumulative findings before this iter: 68

## Summary
Reviewed the sidecar codebase for drift issues not covered in iterations 1 and 7, focusing on spec-vs-implementation drift, cross-language implementation drift, and contract drift between sibling implementations. Found 4 novel drift issues: 2 P1 (missing file locking in JS ledger write vs Python atomic locking, types.ts comment drift from actual implementation) and 2 P2 (sidecar-worker getProviderName undocumented default, ensure-rerank-sidecar missing directory fsync vs Python). Zero overlap with prior drift iteration findings.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Missing file locking in JS ledger write vs Python atomic locking**
- **Fingerprint:** `drift:ensure-rerank-sidecar:missing-file-locking-vs-python`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:94-104,187-189`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:164-170 — no file locking
  function writeLedger(dir, rows, fsModule) {
    fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
    const target = ledgerPath(dir);
    const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
    fsModule.writeFileSync(tmp, `${JSON.stringify({ version: 1, sidecars: rows }, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
    fsModule.renameSync(tmp, target);
  }
  ```
  ```python
  # sidecar_ledger.py:94-104,187-189 — uses fcntl file locking
  @contextmanager
  def _locked_ledger(state_dir: str | Path):
      target_dir = Path(state_dir).expanduser().resolve()
      target_dir.mkdir(parents=True, exist_ok=True)
      lock_path = ledger_lock_path(target_dir)
      with lock_path.open("a+", encoding="utf-8") as handle:
          fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
          try:
              yield
          finally:
              fcntl.flock(handle.fileno(), fcntl.LOCK_UN)

  def write_ledger_atomic(state_dir: str | Path, rows: list[SidecarLedgerRow]) -> Path:
      with _locked_ledger(state_dir):
          return _write_ledger_atomic_unlocked(state_dir, rows)
  ```
- **Reasoning:** The Python implementation of the ledger write uses fcntl file locking via the `_locked_ledger` context manager to ensure atomic writes across concurrent processes. The JavaScript implementation has no file locking mechanism at all. This creates a contract drift between the two sibling implementations that are supposed to be functionally identical. In concurrent scenarios where multiple processes attempt to write to the ledger (e.g., multiple MCP servers starting simultaneously), the JS version can experience race conditions leading to lost updates or corrupted ledger state, while the Python version is protected by file locking. The comment in types.ts line 4 states "Canonical BackendKind + EmbedderManifest live in `@spec-kit/shared`" but the actual implementation is duplicated locally, suggesting a pattern where canonical implementations are supposed to be shared but the ledger locking logic is not.
- **Suggested remediation:** Add file locking to the JavaScript ledger write implementation. Either (a) implement a fcntl-style lock file using `fs.openSync` with exclusive flag, or (b) use a library like `proper-lockfile` to provide cross-platform file locking. Match the Python implementation's lock file pattern (`{LEDGER_FILE_NAME}.lock`) and ensure all ledger read/write operations acquire the lock.
- **Severity rationale:** P1 — This is a contract violation between two sibling implementations that are supposed to be functionally identical. The missing file locking creates a correctness risk in concurrent scenarios where the JS version can corrupt the ledger state while the Python version remains safe. This drift can lead to different behavior depending on which language implementation is used.

**Title: types.ts comment drift from actual implementation**
- **Fingerprint:** `drift:types.ts:canonical-location-comment-drift`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts:4`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:46-55`
- **Evidence:**
  ```typescript
  // types.ts:4 — comment claims canonical location
  // Canonical BackendKind + EmbedderManifest live in `@spec-kit/shared`.
  // Phase 003/006 of the 016 umbrella.

  // sidecar-client.ts:106-117 — duplicate implementation
  function toBackendKind(provider: string, fallback?: BackendKind): BackendKind {
    if (fallback) {
      return fallback;
    }
    if (provider === 'ollama') {
      return 'ollama';
    }
    if (provider === 'openai' || provider === 'voyage' || provider === 'api') {
      return 'api';
    }
    return 'sentence-transformers';
  }

  // execution-router.ts:46-55 — duplicate implementation
  function toBackendKind(provider: string): BackendKind {
    const normalized = normalizeProvider(provider);
    if (normalized === 'ollama') {
      return 'ollama';
    }
    if (normalized === 'openai' || normalized === 'voyage' || normalized === 'api') {
      return 'api';
    }
    return 'sentence-transformers';
  }
  ```
- **Reasoning:** The comment in types.ts line 4 explicitly states "Canonical BackendKind + EmbedderManifest live in `@spec-kit/shared`" and references "Phase 003/006 of the 016 umbrella," suggesting that the canonical implementation of backend kind resolution should be in the shared module. However, the actual implementation is duplicated in two local files (sidecar-client.ts and execution-router.ts) with inconsistent signatures and logic. This creates drift between the documented architecture (canonical location in shared) and the actual implementation (duplicate local copies). A developer reading the comment would expect to find the canonical implementation in `@spec-kit/shared/embeddings/types.js`, but it doesn't exist there. The comment also references a specific phase (003/006 of umbrella 016) which may be completed work, but the implementation hasn't been migrated to match the stated architecture.
- **Suggested remediation:** Either (a) migrate the canonical `toBackendKind` implementation to `@spec-kit/shared/embeddings/types.js` and update both local files to import it, or (b) update the comment in types.ts to reflect the actual architecture (that the implementation is currently duplicated locally). If the phase 003/006 work is complete, the comment should be updated to reflect the current state rather than the planned state.
- **Severity rationale:** P1 — Documentation drift from actual implementation is a maintenance hazard. The comment misleads developers about the architecture and can lead to wasted time looking for code in the wrong location. The referenced phase work suggests this was supposed to be completed but wasn't, indicating a spec-vs-implementation drift that should be resolved.

### P2 — Suggestions

**Title: sidecar-worker getProviderName undocumented default value**
- **Fingerprint:** `drift:sidecar-worker:getprovidername-undocumented-default`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-52`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:50-52 — undocumented default
  function getProviderName(): string {
    return process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER || 'hf-local';
  }
  ```
- **Reasoning:** The `getProviderName` function returns a default value of `'hf-local'` when the environment variable `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` is not set. However, there is no documentation of this default behavior in the code comments, in the sidecar-client.ts environment variable documentation, or in any external documentation. This creates drift between the actual behavior (defaults to 'hf-local') and what a developer or user would expect (might expect an error or a different default). The default is critical because it determines which embedding provider is used when the environment variable is not configured, but this contract is not documented anywhere.
- **Suggested remediation:** Add a comment documenting the default value and its rationale. Update any environment variable documentation to include this default. Consider whether 'hf-local' is the correct default or if an error should be raised when the environment variable is not set.
- **Severity rationale:** P2 — This is a documentation drift issue with no functional impact. The code works correctly, but the undocumented default creates confusion about the contract when the environment variable is not set. Developers may not realize that 'hf-local' is the fallback provider.

**Title: ensure-rerank-sidecar missing directory fsync vs Python implementation**
- **Fingerprint:** `drift:ensure-rerank-sidecar:missing-directory-fsync-vs-python`
- **File(s):**
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:210-217`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:164-170 — no directory fsync
  function writeLedger(dir, rows, fsModule) {
    fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
    const target = ledgerPath(dir);
    const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
    fsModule.writeFileSync(tmp, `${JSON.stringify({ version: 1, sidecars: rows }, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
    fsModule.renameSync(tmp, target);
  }
  ```
  ```python
  # sidecar_ledger.py:210-217 — includes directory fsync
  os.replace(temp_path, path)
  try:
      dir_fd = os.open(target_dir, os.O_RDONLY)
      try:
          os.fsync(dir_fd)
      finally:
          os.close(dir_fd)
  except OSError:
      pass
  ```
- **Reasoning:** The Python implementation of the ledger write includes a directory fsync operation after the atomic rename to ensure the directory entry is flushed to disk. This provides stronger durability guarantees in case of system crashes. The JavaScript implementation performs the atomic rename but does not fsync the directory. This creates a contract drift between the two implementations in terms of durability guarantees. While both implementations use the temp-file + atomic rename pattern for atomicity, the Python version goes further to ensure the directory metadata is flushed to disk, reducing the risk of ledger corruption after a system crash.
- **Suggested remediation:** Add directory fsync to the JavaScript implementation after the rename operation. Use `fs.fsyncSync` on the directory file descriptor to match the Python implementation's durability guarantees. Alternatively, document that the JS implementation has weaker durability guarantees if the fsync is intentionally omitted for performance reasons.
- **Severity rationale:** P2 — This is a durability guarantee drift between implementations. The JS version has a slightly higher risk of ledger corruption after system crashes compared to the Python version. However, both implementations use atomic rename for crash safety, so the practical impact is limited. This is a quality/durability difference rather than a functional defect.

## Convergence Signal
- New findings this iter: 4
- Cumulative finding count after iter: 72
- New-findings ratio: 0.056
- Continue / converged signal: `converged` (ratio ≤ 0.10 for second consecutive drift iteration)

## Files Touched (this iter)
- `iterations/iteration-013.md`
- `deltas/iter-013.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
