# Security Review — Directive-Lifecycle Delivery (deepseek-v4-flash)

## Scope and files audited

All five files read in full (read tool), with targeted greps for path derivation, modes, JSON parsing, and fail-open handling:

- `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` — decision logic, in-memory store, store handle.
- `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts` — env var names, schema version, record/state interfaces.
- `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` — TS side of the durable store: path derivation, helper spawn, response parsing.
- `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py` — authoritative filesystem work: directory anchoring, permissions, locking, JSON I/O, validation.
- `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` — host boundary hook CLI entry.

No shell commands were run. Every claim below cites a line number or symbol read in the files above; anything not confirmable is marked UNCONFIRMED.

## 1. Local-filesystem attacker

**Path derivation.** The base directory is resolved in the TS constructor from an env var, an explicit option, or a `tmpdir()` default: `directive-lifecycle-file-store.ts:46-48` (`SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, else `join(tmpdir(), 'speckit-advisor')`); a second failsafe dir defaults to `join(tmpdir(), 'speckit-advisor-failsafe')` (`directive-lifecycle-file-store.ts:51`). The helper then namespaces per project under `directive-lifecycle/<sha256(cwd)[:12]>/` (`directive-lifecycle-store.py:76`).

**Directory permissions and identity checks.** Directories are created `0o700` (`directive-lifecycle-store.py:47`, `:61`). Every open path is fd-anchored and symlink-resistant:

- `secure_stat` requires: expected file type, `st_uid == uid`, `st_nlink == 1` for regular files, and no group/other permission bits (`st_mode & 0o077 == 0`) — `directive-lifecycle-store.py:38-41`.
- Base dir: `lstat` → symlink rejection → `realpath` → dev/ino identity comparison between lstat and canonical stat → `O_NOFOLLOW` open → `fstat` re-verified with `secure_stat` — `directive-lifecycle-store.py:62-69` (and the fstat re-check immediately after, symbol `open_state_directory`).
- All child opens use `os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW` (`:50`) or `os.O_RDONLY | os.O_NOFOLLOW` for file reads (`:90`); every operation descends via `dir_fd=`, so intermediate components cannot be swapped for symlinks after anchoring.
- File writes: temp file created `os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW`, mode `0o600` (`:130-131`), `fsync` of file and directory, `rename` within the same `dir_fd`, and a post-install stat verifying owner/mode/nlink plus `st_size == len(payload)` (`:139-145`). Pre-created temp names cannot be hijacked because of `O_EXCL` and the mode/owner check.
- Unlink always stats with `follow_symlinks=False` and requires `secure_stat` before removing (`unlink_regular`, `:110-118`; also `:208`, `:220` in cleanup/evict).
- Lock file: `os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600` (`:353`) with a `secure_stat` check on the fd; a pre-planted symlink or attacker-owned lock file fails the check and aborts fail-open.

**Net effect.** A local attacker cannot pre-create, tamper with, symlink, or world-write any state file and have it accepted: owner, mode, nlink, and type are re-verified on every read/write/unlink through anchored fds, and any violation raises `SecurityError` → helper exits 1 → TS returns null (fail-open). No escalation or corruption path found.

**Residual.** Pre-creation denial-of-service: because the default base lives in the shared `tmpdir()` namespace, any local user can `mkdir` the base/project path ahead of the victim's first run; the uid check then fails and the store fails open permanently for that user (dedup disabled, full delivery every turn). Fail-open makes this a P3 availability note, not a corruption vector. There is a small TOCTOU between the base `lstat` (`:62`) and the `O_NOFOLLOW` open (`:69`), but the post-open `fstat`/`secure_stat` check rejects any swapped-in attacker-owned directory, so the only exploitable variant is the pre-creation case already covered.

## 2. Malformed state

**Fail-open is confirmed on every parse path.** No malformed-state condition in the reviewed files can throw an unhandled error into the host turn:

- **Truncated / non-JSON / wrong-typed state file:** `read_json` caps size at `MAX_RECORD_BYTES` (64 KiB, `:14`, enforced `:95`), reads under `O_NOFOLLOW`, and `json.loads` (`:105`) raises inside the helper on bad content. The helper's top-level `except` (`:374-376`) prints only `{"ok": false, "error": <ClassName>}` and exits 1. On the TS side, `spawnSync` failure, non-zero status, empty stdout, parse failure, or any exception all collapse to `return null` (`directive-lifecycle-file-store.ts:138`, `:139-143`); `get` then returns null (`:54-55`) and `decideDirectiveLifecycleDelivery` treats a missing record as `mustDeliverFull` (symbols `nextRecord`/`decideDirectiveLifecycleDelivery` in `directive-lifecycle.ts`) — full delivery, no crash.
- **Wrong-typed / unexpected schema:** the helper validates before use: `record()` requires a dict with `schemaVersion == 2` and all six fields type-checked (`directive-lifecycle-store.py:169-183`), including non-empty `transcriptPath` and non-negative `transcriptHighWaterBytes`; `token()` requires a non-empty string ≤ 128 chars (`:157-163`). Violations raise `SecurityError` → fail-open.
- **Oversized write:** `write_json` returns False when the payload exceeds 64 KiB (`:123`), so `set` returns false and the caller falls back to full delivery (`directive-lifecycle.ts`, `decideDirectiveLifecycleDelivery`).
- **Malformed helper request stdin:** `json.loads(sys.stdin.read() or "{}")` (`:343`); a non-dict request raises `AttributeError` on `.get`, caught by the same top-level handler → fail-open.
- **Boundary hook input:** stdin is capped at `MAX_INPUT_BYTES` (64 KiB, `directive-lifecycle-boundary.ts:16`, `:41`) and the whole read+parse is in try/catch (`:35-50`); any failure returns null, and the CLI entry has a `.catch(() => process.exit(1))` (`:62`) — it cannot throw past the process boundary. Exit 1 on a hook boundary is host-tolerable by design (UNCONFIRMED how the host hook runner treats non-zero exits; no evidence in the reviewed files of an unhandled exception path).

**One side-effect note:** a malformed/oversized boundary payload returns null and `handleDirectiveLifecycleBoundary(null, …)` then runs `advanceDirectiveLifecycleBoundary` with no session id, which calls `state.advanceGeneration()` (`directive-lifecycle.ts`, symbol `advanceDirectiveLifecycleBoundary`) — silently invalidating every session record (fleet-wide dedup reset). Fail-open, no crash, no leak, but a malformed boundary event degrades availability of the optimization. This is the only "fail-open with side effect" found.

**Unhandled-throw honesty:** `decideDirectiveLifecycleDelivery` itself is not try/wrapped, but its only external data source (the file store) normalizes every failure to null/empty results before it is consulted, and the in-memory store never throws; no throw path was observed in the reviewed files under malformed persisted state. UNCONFIRMED whether the hook caller outside these files wraps the decision call.

## 3. Evidence / data leakage

- **Directive text:** the full `Directives:` block is persisted verbatim in `DirectiveLifecycleRecord.directives` (contract, symbol `directive-lifecycle-contract.ts`; written by the helper at `directive-lifecycle-store.py:233-246`) into `<base>/directive-lifecycle/<project-hash>/<session-hash>.json` with 0o700 directories and 0o600 files — readable only by the owning uid, not world-readable. Same-user processes can read it; that is inherent to a user-scoped store.
- **Session ids:** never appear in filenames — filename keys are `sha256(sessionId)[:16]` (`directive-lifecycle-store.py:189-190`, used `:195`, `:233`, `:249`, `:288-299`). The raw id travels only over the helper's stdin pipe (owned by the same process).
- **Absolute paths:** `transcriptPath` is stored in the 0o600 record and echoed back through the helper's stdout JSON to the parent (`directive-lifecycle-store.py:363`, `:288`). That pipe is `spawnSync`-captured (`directive-lifecycle-file-store.ts:120-137`), not a terminal or log. No logging of these responses was found in any reviewed file.
- **Error messages:** the helper's failure output is only `type(error).__name__` (`directive-lifecycle-store.py:375`) — no exception message, no path, no content. The TS side never prints; it returns null silently (`directive-lifecycle-file-store.ts:138-144`). The boundary CLI emits no stdout at all — only exit codes 0/1 (`directive-lifecycle-boundary.ts:61-62`); grep found no `console.*`/stdout/stderr writes in that file.
- **Filesystem metadata:** the top-level names `speckit-advisor` / `speckit-advisor-failsafe` and the project hash of the CWD (`:76`) are visible in `tmpdir()` listings; children are hidden by 0o700. The project hash is not secret (sha256 of CWD) but reveals nothing beyond "this tool ran" to other users. Minor, accepted.

## Findings

- **P3 — `directive-lifecycle-file-store.ts:47-48` / `directive-lifecycle-store.py:61-67` — default state base is in the shared `tmpdir()` namespace; any local user can pre-create the base/project path ahead of first run, failing the uid check and permanently disabling dedup for the victim (fail-open full delivery every turn). No corruption, no escalation; availability-only DoS of the optimization. — Disposition: accept as fail-open; optionally default to a per-user runtime dir (e.g. XDG_RUNTIME_DIR) or document the DoS.
- **P3 — `directive-lifecycle-store.py:62-69` — small TOCTOU between base `lstat` and the `O_NOFOLLOW` open; the post-open `fstat`/`secure_stat` check (symbol `open_state_directory`) rejects any swapped-in attacker-owned directory, so the residual is only the pre-creation case already covered by the finding above. — Disposition: accept; no fix required beyond the pre-creation mitigation.
- **P3 — `directive-lifecycle-boundary.ts:35-50` + `directive-lifecycle.ts` symbol `advanceDirectiveLifecycleBoundary` — a malformed or oversized boundary payload returns null and then triggers `advanceGeneration()`, silently invalidating every session record fleet-wide (dedup reset). Fail-open and crash-free, but availability of the optimization degrades on hostile/malformed boundary input. — Disposition: accept (fail-open), or no-op on parse failure instead of advancing the generation.
- **P3 — `directive-lifecycle-store.py:233-246`, `:288`, `:363` — directive text and the absolute `transcriptPath` are persisted at rest and echoed over the helper's stdout pipe; both are 0o600/0o700-protected and same-user-only, and the pipe is captured, not logged. Inherent to a user-scoped durable store. — Disposition: accept; no world-readable or logged leak found.
- **P3 (informational) — `directive-lifecycle-store.py:76` — the sha256-of-CWD project hash is visible in `tmpdir()` listing metadata; children are 0o700. No content leaks; only tool-existence metadata. — Disposition: accept.

Confirmed absent (no findings): world-writable state files (mode checks `:41`, `:145`), symlink attacks (O_NOFOLLOW + fd-anchored + lstat/realpath identity `:50,:62-69,:90,:130,:353`), pre-created file hijack (O_EXCL + post-install stat `:130-131,:144-145`), unhandled JSON parse errors (helper top-level except `:374-376` + TS catch `:139-143` + boundary catch `:35-50,:62`), content/path leakage in error messages (`:375`), and session-id leakage into filenames (`:189-190`).

## Verdict

PASS-WITH-NOTES — the store is uid-anchored, symlink-resistant, mode-checked (0o700/0o600) on every access, and every parse/validation path fails open to full directive delivery; the only residual items are P3 fail-open availability notes (pre-creation DoS of the optimization and a generation-advance side effect on malformed boundary input), none of which corrupt state, escalate, crash the hook, or leak directive content.
