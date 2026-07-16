# Iteration 2 — security

## Summary

Reviewed Phase 007 skill-advisor zombie launcher fix focusing on security dimension: race windows, error-surface mishandling, adversarial input handling, secret handling, injection surfaces, privilege boundaries, file-path traversal, and signal-handling cleanup. Read anchor materials (spec.md, plan.md, implementation-summary.md, checklist.md) and traced security-sensitive code paths in mk-skill-advisor-launcher.cjs, launcher-lease.vitest.ts, and lease.ts. The fix follows good security practices with restrictive file permissions (0o600 for lease files, 0o700 for directories), symlink resolution via canonicalizePath(), allowlisted child process environment variables, atomic file operations for PID guard writes, and proper signal handling with lease cleanup. No P0 or P1 security issues found; minor P2 information disclosure in debug logging is acceptable for operational debugging.

## Findings

### [P2] Debug logging may leak sensitive file paths and error details
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:207,384,431,478`
- Evidence: `log(`lease check failed: ${error.message}`)` at line 207; `log(error.stack || error.message)` at lines 384 and 478; `log(`DB: ${advisorDbPath()}`)` at line 431. These log error messages, stack traces, and database paths to stderr.
- Impact: Error messages and stack traces could potentially leak implementation details or system layout information to stderr consumers. Database path logging reveals the canonicalized filesystem location.
- Suggested fix: Consider adding an environment variable gated debug mode (e.g., `MK_SKILL_ADVISOR_DEBUG`) to suppress detailed error logging in production deployments, or redact sensitive paths from error output. However, this is low severity as stderr is typically operator-visible only and the information is useful for debugging launcher failures.

## Notes

- REQs in scope: 007-REQ-001 (spawn-three rejection), 007-REQ-002 (launcher-boundary guard), 007-REQ-003 (daemon lease intact), 007-REQ-004 (cleanup ordering).
- Files opened: spec.md, plan.md, implementation-summary.md, checklist.md, mk-skill-advisor-launcher.cjs, launcher-lease.vitest.ts, lease.ts.
- Security-positive observations:
  - File permissions are restrictive: 0o600 for lease files (line 217) and SQLite databases (lease.ts:148), 0o700 for directories (line 129).
  - Symlink attacks are mitigated by canonicalizePath() using fs.realpathSync.native() at lines 118-126 and lease.ts:66-76.
  - Child process environment is filtered through CHILD_ENV_ALLOWLIST (lines 67-92) preventing arbitrary environment variable injection.
  - PID guard writes use atomic temp-file pattern with process.pid suffix (lines 216-218) preventing partial writes.
  - Signal handlers properly clean up lease files before exit (lines 389-419) preventing zombie lease files.
  - Lease verification uses process.kill(pid, 0) for liveness checks (lines 163-175) which is the standard secure pattern.
  - Re-probe after PID guard write (lines 456-462) provides TOCTOU protection for the critical acquisition window.
- The previous iteration-001 found a P2 race window between bootstrap lock release and PID guard write; this is a correctness issue more than a security issue and is already documented.
- No secrets are hardcoded or added in this change (checklist CHK-030 confirms).
- The test file's countLauncherProcesses() function uses spawnSync with array arguments which is safe from command injection.

Review verdict: PASS