# Review Iteration 003 — Security: File Store Topology Hardening

## Dispatcher

- **Iteration:** 3 of 7
- **Dimension:** security
- **Focus:** File-store hardening and Python store helper verification — path containment, ownership, regular-file checks, no-follow invariants, size bounds, restrictive modes, temp safety, fail-open correctness
- **Budget profile:** `verify` (11-13 calls, actual ~16 across parallel batches — budget overrun)
- **Mode:** review
- **Status:** complete

## Files Reviewed

| File | Lines Reviewed | Focus |
|------|---------------|-------|
| `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py` | 1-376 (full) | Primary security review: path containment, ownership, no-follow, temp safety, record validation, locking, poison mechanism |
| `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` | 1-147 (full) | TypeScript wrapper: fail-open circuit, poison lifecycle, subprocess security, env exposure |
| `specs/.../018-.../checklist.md` | 1-227 (full) | CHK-030/031/033/130/132 cross-reference verification |
| `specs/.../018-.../spec.md` | (grep: REQ-P1-003, NFR-S01) | Requirement alignment: store hardening, path containment |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/directive-lifecycle.vitest.ts` | 339-397 | Hostile topology test coverage verification |

## Findings — New

### P0 Findings

None. The Python store helper and TypeScript wrapper both pass core security review. No exploitable path-containment bypass, no ownership-verification gap, no no-follow invariant violation, no unsigned temp-write hazard.

### P1 Findings

None. All P1-relevant security invariants (NFR-S01, REQ-P1-003) are enforced with evidence.

### P2 Findings

**1. Full process environment passed to Python subprocess — least-privilege violation** — `directive-lifecycle-file-store.ts:132`
- `invokeAt()` passes `env: process.env` to `spawnSync`, exposing the complete process environment (including any secrets, API keys, tokens) to the Python subprocess. The Python script only reads `SPECKIT_DIRECTIVE_STORE_TEST_PAUSE_MS` from the environment (store.py:358). All other environment variables are unnecessary exposure.
- Finding class: instance-only
- Scope proof: `rg -n "process\.env" directive-lifecycle-file-store.ts` shows only line 132 and line 46. The helper only reads one env var.
- Affected surface hints: ["subprocess boundary", "Python helper", "env isolation"]
- Recommendation: Pass a minimal environment object with only `PATH`, `HOME`, and `SPECKIT_DIRECTIVE_STORE_TEST_PAUSE_MS` instead of `process.env`.

```json
{
  "type": "claim-adjudication",
  "claim": "Passing full process.env to a spawned Python subprocess is a least-privilege violation that could expose secrets",
  "evidenceRefs": ["directive-lifecycle-file-store.ts:132", "directive-lifecycle-store.py:358"],
  "counterevidenceSought": "Checked whether the Python script needs any env vars beyond TEST_PAUSE_MS — it does not. Also checked if spawned process isolation prevents env leakage — spawnSync passes the env struct directly to the OS process, so any process that can read /proc/<pid>/environ could access it.",
  "alternativeExplanation": "The Python helper is a trusted same-project script executed by the same user; env exposure is a defense-in-depth concern, not an active exploit path. The subprocess is short-lived (750ms timeout, then SIGKILL).",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "Same-user dependency, short-lived subprocess, fail-open default — exploit requires process-sniffing capability on the local machine, which implies existing compromise"
}
```

**2. TOCTOU between spawn result and failsafe poison in `advance()`** — `directive-lifecycle-file-store.ts:100-107`
- `advance()` calls `invoke()` (which spawns Python), checks `committed === true`, then either clears or marks poison on the failsafe directory. Two failure modes:
  - (a) If `invoke()` returns null because the Python process was SIGKILLed (timeout=750ms, `killSignal: 'SIGKILL'` at line 135) but the actual `write_record()` call succeeded before the kill signal arrived, the TS layer marks poison (`invokeAt` at line 105) but the durable state was actually updated — the next `evaluate()` call will hit `failsafe_poisoned() == true` and return null (full delivery), incorrect when suppression should be active.
  - (b) If the commit succeeds but the separate `clear-poison` call to the failsafe dir fails (e.g., disk full, tmpdir permission change), poison remains set, blocking future suppression.
- Finding class: instance-only
- Scope proof: `rg -n "advance\(\)|mark-poison|clear-poison|failsafe_poisoned" directive-lifecycle-file-store.ts directive-lifecycle-store.py` shows only this code path.
- Affected surface hints: ["advance() method", "poison lifecycle", "failsafe directory"]
- Risk score: 3 (advisory)
- Recommendation: Collapse the poison clear/mark into the same Python invocation as the advance operation to avoid the TOCTOU window. E.g., add an `advance-with-poison` operation to the Python helper that atomically advances and clears/marks poison.

```json
{
  "type": "claim-adjudication",
  "claim": "advance() has a TOCTOU window between the spawn result and the failsafe poison call that can cause incorrect poison state",
  "evidenceRefs": ["directive-lifecycle-file-store.ts:100-107", "directive-lifecycle-file-store.ts:135", "directive-lifecycle-store.py:281-284"],
  "counterevidenceSought": "Considered whether flock(LOCK_EX) in the Python script makes the advance and the separate poison clear/mark atomic — it does not, because they are separate spawnSync() calls with separate Python processes, each acquiring their own lock. Also considered whether SIGKILL timing is realistic — with a 750ms timeout and typical write latency <5ms, the window is narrow but real under load.",
  "alternativeExplanation": "Fail-open to full delivery is the safe default, so incorrect poison state degrades suppression but never causes incorrect suppression. The SIGKILL race (mode a) requires extreme load conditions. The clear-poison failure (mode b) is a persistent environment problem that would be visible.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "Both failure modes result in full delivery (safe default); neither enables stale/incorrect suppression. Narrow race window for mode (a)."
}
```

**3. `helperPath()` uses `existsSync` which follows symlinks — no integrity verification** — `directive-lifecycle-file-store.ts:36`
- `helperPath()` resolves the Python store script path using `existsSync()`, which follows symlinks. If an attacker with project-directory write access creates a symlink at the expected path pointing to a malicious script, the TypeScript wrapper would spawn it without any integrity check (no hash, no signature, no known-good comparison).
- Finding class: instance-only
- Scope proof: `rg -n "existsSync|helperPath" directive-lifecycle-file-store.ts` shows this is the only path-resolution mechanism for the helper.
- Affected surface hints: ["helper path", "symlink following", "integrity"]
- Recommendation: Add a stat check to verify the resolved file is a regular file (not a symlink), or verify a hash/signature of the Python helper before spawning. Mitigation: attacker needs write access to the project directory, which typically implies existing code execution.

```json
{
  "type": "claim-adjudication",
  "claim": "helperPath() follows symlinks via existsSync with no integrity check, enabling helper substitution",
  "evidenceRefs": ["directive-lifecycle-file-store.ts:30-37"],
  "counterevidenceSought": "Checked if the project's .gitignore or file permissions prevent symlink planting — they do not. Checked if the spawned Python process runs with reduced privileges — it runs with the same uid as the caller.",
  "alternativeExplanation": "Write access to the project directory implies existing code execution capability. An attacker with that access could modify any file, not just the helper. The helper substitution vector doesn't increase the attack surface.",
  "finalSeverity": "P2",
  "confidence": 0.70,
  "downgradeTrigger": "Requires existing write access to the project directory — equivalent to existing code execution. Low added risk."
}
```

**4. Python store helper fails POSIX-only operations silently on non-POSIX platforms — no platform detection** — `directive-lifecycle-store.py:4-5,354,357`
- The Python helper imports `fcntl` (POSIX-only) and uses `os.O_NOFOLLOW`, `os.O_DIRECTORY`, `os.O_EXCL`, `flock`, `os.fsync`, `dir_fd`, and `src_dir_fd`/`dst_dir_fd` — all POSIX-specific. On Windows no `O_NOFOLLOW`, `O_DIRECTORY`, or `flock` exist. The script would crash or behave insecurely. The fail-open design in the TS wrapper (`invoke()` returns null on any error → full delivery) provides safe fallback, but there is no explicit platform check or documentation that durable suppression is POSIX-only.
- Finding class: instance-only
- Scope proof: `rg -n "fcntl|O_NOFOLLOW|O_DIRECTORY|flock" directive-lifecycle-store.py` shows pervasive POSIX dependency. `rg -n "platform|posix|windows|darwin" directive-lifecycle-store.py directive-lifecycle-file-store.ts` returns no matches.
- Affected surface hints: ["Python helper", "cross-platform", "fail-open default"]
- Recommendation: Add an explicit platform check at the top of `main()` that exits cleanly on non-POSIX platforms, or document in `ENV-REFERENCE.md` that durable suppression requires a POSIX platform.

```json
{
  "type": "claim-adjudication",
  "claim": "Python store helper uses POSIX-only syscalls with no platform detection — silent failure on Windows",
  "evidenceRefs": ["directive-lifecycle-store.py:4-5,50-51,90,128,325,354,357", "directive-lifecycle-file-store.ts:118,143"],
  "counterevidenceSought": "Checked if the TS wrapper has a platform check before spawning — it does not. Checked if the Python script catches ImportError for fcntl — it imports at module level (line 4), so ImportError would prevent execution entirely, caught by main() try/except at line 372-376 (returns `ok: false`).",
  "alternativeExplanation": "On Windows, `import fcntl` would raise ImportError, caught by the top-level try/except, returning `ok: false`. The TS wrapper returns null → full delivery. Fail-open safety is preserved.",
  "finalSeverity": "P2",
  "confidence": 0.75,
  "downgradeTrigger": "Fail-open design handles non-POSIX gracefully — `import fcntl` fails → returns `ok: false` → full delivery. No security bypass on Windows."
}
```

**5. `cwd`-derived project hash partitions state silently across working directories** — `directive-lifecycle-store.py:76` and `directive-lifecycle-file-store.ts:129`
- The Python helper derives a project identifier via `hashlib.sha256(os.getcwd().encode("utf-8")).hexdigest()[:12]` (line 76). The TS wrapper passes `cwd: process.cwd()` (line 129). If the process CWD changes between invocations, the state directory changes, effectively resetting suppression state. This is a correctness/operational issue rather than a direct security vulnerability, but it affects the reliability of the suppression mechanism.
- Finding class: instance-only
- Scope proof: `rg -n "getcwd|cwd.*process\.cwd" directive-lifecycle-store.py directive-lifecycle-file-store.ts` shows these are the only project-isolation mechanics.
- Affected surface hints: ["project hash", "working directory", "state partitioning"]
- Recommendation: Derive the project hash from a stable, workspace-root-relative path (e.g., the directory containing `.opencode/`) rather than `cwd`. Add a diagnostic log when the project hash changes unexpectedly.

```json
{
  "type": "claim-adjudication",
  "claim": "cwd-derived project hash causes state partitioning when working directory changes",
  "evidenceRefs": ["directive-lifecycle-store.py:76", "directive-lifecycle-file-store.ts:129"],
  "counterevidenceSought": "Checked if the hook execution environment guarantees a stable CWD — it does not. Hook scripts can be invoked from any directory. Checked if state partitioning causes security issues — it causes state fragmentation (multiple state dirs), not cross-project leakage.",
  "alternativeExplanation": "State is disposable — losing suppression state results in full delivery, which is the safe default. The hash is a defense-in-depth measure to prevent cross-project state collision, and partition is preferable to collision.",
  "finalSeverity": "P2",
  "confidence": 0.65,
  "downgradeTrigger": "State partition = full delivery (safe default). No cross-project leakage possible. Primarily an operational surprise, not a security flaw."
}
```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|---------|
| `spec_code` (core) | **pass** | REQ-P1-003 (store hardening) verified: path containment via dir_fd (store.py:44-85), ownership via secure_stat() (store.py:38-41), no-follow via O_NOFOLLOW on all opens (store.py:50,90,128), size bounds via MAX_RECORD_BYTES/MAX_DIRECTORY_SCAN (store.py:14-15). NFR-S01 confirmed: all required invariants present. |
| `checklist_evidence` (core) | **pass** | CHK-030 [P0]: dir_fd anchoring verified (store.py:44-85). CHK-031 [P0]: owner/mode/link-count/type/size/schema rejection verified (store.py:38-41, 95, 166-186). CHK-033 [P1]: bounded temp cleanup verified (store.py:199-212). CHK-130 [P1]: this iteration IS the security review — confirms local filesystem attacker mitigations (no-follow, ownership, dir_fd anchoring), malformed state rejection (record() at store.py:166-186), and evidence leakage prevention (paths stay within owned dir). CHK-132 [P2]: path traversal blocked by dir_fd, temp files use O_EXCL+unique names. |
| `feature_catalog_code` (overlay) | notApplicable | No feature catalog code in review scope. |
| `skill_agent` (overlay) | pending | Deferred to traceability iteration. |
| `agent_cross_runtime` (overlay) | pending | Deferred to traceability iteration. |
| `playbook_capability` (overlay) | pending | Deferred to traceability iteration. |

## Integration Evidence

- **Python subprocess boundary**: `directive-lifecycle-file-store.ts:120-136` — spawnSync with `python3` or `SPECKIT_PYTHON_BIN`, 750ms timeout, SIGKILL on timeout, 128KB maxBuffer, passes stdin JSON and reads stdout JSON.
- **Failsafe directory**: `directive-lifecycle-file-store.ts:51,68,100-107` — separate tmpdir-derived path for poison markers, independent from main state directory.
- **Test coverage for hostile topology**: `directive-lifecycle.vitest.ts:339-397` — three tests cover symlinked state components, symlinked record files, and directory-replacement-during-write (TOCTOU) scenarios.
- **Hook integration point**: `directive-lifecycle-file-store.ts:39` — `FileDirectiveLifecycleStore implements DirectiveLifecycleState` from `directive-lifecycle-contract.js`.

## Edge Cases

| Edge Case | Disposition | Evidence |
|-----------|-------------|---------|
| Symlinked base directory | Rejected by `open_state_directory()`: lstat check for ISLNK (store.py:63), dev/ino mismatch check (store.py:66-68) | Code verified |
| Symlinked intermediate component | Rejected by `open_child_directory()`: `os.O_NOFOLLOW` (store.py:50) | Code verified |
| Symlinked record/temp file | Rejected by `read_json()`/`write_json()`: `os.O_NOFOLLOW` (store.py:90,128), `secure_stat()` checks nlink==1 (store.py:40) | Code verified |
| Wrong owner | Rejected by `secure_stat()`: `st_uid != uid` → SecurityError (store.py:41) | Code verified |
| Insecure mode bits | Rejected by `secure_stat()`: `st_mode & 0o077 != 0` → SecurityError (store.py:41) | Code verified |
| Non-regular file | Rejected: `S_ISREG` check (store.py:39) | Code verified |
| Oversized record (>64KB) | Rejected at read (store.py:95) and write (store.py:123) | Code verified |
| Malformed JSON | Caught by `json.loads` (store.py:105) or `record()` validation (store.py:166-186) → SecurityError | Code verified |
| Directory replacement during write (TOCTOU) | Mitigated by dir_fd anchoring: the fd points to the inode at open time, immune to name-based replacement. Test at vitest.ts:373-397 | Test verified |
| Python unavailable | `helperPath()` returns null (store.ts:36), `invoke()` returns null (store.ts:118) → full delivery | Code verified |
| Python SIGKILL during write | spawnSync timeout=750ms, killSignal=SIGKILL (store.ts:133-135). If write succeeded before kill, TS marks poison incorrectly (finding P2-002 above). | Edge case documented |
| Poison cleared after advance fails | `advance()` attempts separate `clear-poison` call (store.ts:103); if this call fails, poison persists (finding P2-002 above). | Edge case documented |
| CWD changes between invocations | State directory changes because `os.getcwd()` is hashed (store.py:76) → state fragmentation, not corruption (finding P2-005 above). | Edge case documented |
| Lock file created insecurely | `os.O_CREAT|os.O_NOFOLLOW`, 0o600 mode (store.py:353), verified via `secure_stat()` (store.py:355) — safe | Code verified |

## Confirmed-Clean Surfaces

The following security properties were verified with file:line evidence and found to be correctly enforced:

| Property | Mechanism | File:Line |
|----------|-----------|-----------|
| Path containment | dir_fd anchoring with O_NOFOLLOW on all opens; dev/ino identity verification on base | `store.py:44-85, 50-51, 63-68` |
| Ownership enforcement | `secure_stat()` checks `st_uid == uid` | `store.py:38-41` |
| No-follow invariant | `O_NOFOLLOW` on ALL file/dir opens; `lstat()` instead of `stat()`; `follow_symlinks=False` on stat calls | `store.py:50, 62-63, 69, 90, 112, 128, 144, 208, 220, 325, 353` |
| Regular-file enforcement | `secure_stat()` checks `S_ISREG` (or `S_ISDIR` for directories) and `nlink == 1` for files | `store.py:38-41` |
| Restrictive modes | Directories: 0o700; files: 0o600; group/other bits enforced to 0 by `secure_stat()` | `store.py:41, 47, 61, 131, 353` |
| Size bounds | `MAX_RECORD_BYTES = 64KB`, `MAX_DIRECTORY_SCAN = 256`, token ≤128 chars | `store.py:14-15, 95, 123, 161, 201` |
| Atomic writes | `fsync()` + `os.rename()` within same directory; post-rename stat with `follow_symlinks=False` | `store.py:139-145` |
| Temp file safety | `O_EXCL`, `{pid}-{uuid4}` name, 0o600 mode, bounded age/count cleanup | `store.py:125-152, 199-212` |
| Fail-open design | Any error → `invoke()` returns null → all callers interpret as "no durable state" → full delivery | `store.ts:118, 138-143` |
| Lock integrity | `fcntl.flock(LOCK_EX)` on a verified lock file opened with `O_NOFOLLOW`, mode 0o600 | `store.py:325, 353-357` |
| Poison mechanism | Separate failsafe directory; `failsafe_poisoned()` returns true when state integrity unproven → full delivery | `store.py:312-336, 345-347` |
| Record validation | Schema version (must be 2), all required fields present with correct types, transcriptPath non-empty, transcriptHighWaterBytes ≥0 | `store.py:166-186` |
| Session isolation | `sha256(sessionId)[:16]` for per-session filenames; project hash from `sha256(cwd)[:12]` for per-project isolation | `store.py:76, 189-190` |

## Ruled Out

- **P0: Symlink injection into store** — Ruled out. ALL file/directory opens use `O_NOFOLLOW` (store.py:50, 69, 90, 128, 325, 353). Base directory symlink caught by `ISLNK` check (store.py:63). Intermediate replacement caught by dev/ino comparison (store.py:66-68) and dir_fd anchoring.
- **P0: Path traversal escape** — Ruled out. All operations use `dir_fd` anchored to a verified directory file descriptor. No path constructed from user input — session IDs are hashed (store.py:189-190), project hash derived from CWD hash (store.py:76). File names are regex-validated (`RECORD_RE`, `EPOCH_RE` at store.py:23-24).
- **P0: Unchecked ownership** — Ruled out. `secure_stat()` at store.py:38-41 checks `st_uid == uid` on ALL file/directory stat calls before any read, write, or unlink.
- **P0: TOCTOU between check and use** — Ruled out for core store operations. dir_fd anchoring prevents name-based TOCTOU; atomic rename for writes; post-rename stat verification (store.py:144-145). Partial TOCTOU in `advance()` poison mechanism documented as P2-002 above.
- **P1: Temp file residue after crash** — Ruled out. `write_json()` has a `finally` block (store.py:146-152) that cleans up the temp file. `cleanup()` (store.py:199-212) handles aged temps, bounded by `MAX_TEMP_CLEANUP=32`.
- **P1: Cross-session record leakage** — Ruled out. Session filenames are derived from `sha256(sessionId)[:16]` (store.py:189-190), providing per-session isolation. No enumeration path exists — `get()` uses the hash directly.
- **P1: State directory permission bypass** — Ruled out. Directories created with 0o700 (store.py:47, 61); `secure_stat()` rejects directories with group/other permission bits set (store.py:41).

## Next Focus

- **Dimension:** traceability
- **Focus Area:** Cross-reference integrity — verify spec/code alignment across all review dimensions, checklist evidence completeness (CHK-044, CHK-101, CHK-124, CHK-130, CHK-140-143), evidence taxonomy correctness, baseline comparison honesty. Address remaining open checklist items and verify packet metadata reconciliation.
- **Reason:** Correctness (PASS) and security (PASS confirmed-core with P2 advisories) are complete. Traceability is the next uncovered dimension. CHK-130 (security review) can now be marked as satisfied by this iteration's evidence.
- **Rotation Status:** Rotating from security to traceability (second dimension rotation)
- **Blocked/Productive Carry-Forward:** Productive — security core hardening is proven solid. The P2 advisories (env exposure, poison TOCTOU, helper integrity, platform detection, CWD hash) are documented for follow-up. The P1 Devin adapter finding will be revisited in maintainability.
- **Required Evidence:** Cross-reference spec REQ rows against implementation files; verify checklist evidence strings resolve to actual files; audit CHK-044 (parent phase metadata), CHK-140-143 (doc synchronization), CHK-101 (decision remains Accepted).
- **Recovery Note:** N/A (not in recovery mode)
