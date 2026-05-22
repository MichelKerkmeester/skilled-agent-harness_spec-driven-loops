I have completed iteration 6 of the deep review, focusing on the security dimension. The iteration file has been written to:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/review/iterations/iteration-006.md`

**Key findings:**

- **P1**: SIGKILL backup path in spec-memory launcher (lines 287-291) does not clear the lease file when the child process hangs on SIGTERM, violating REQ-003's cleanup guarantee and creating a resource leak
- **P2**: Env parser control-character gap in spec-memory launcher (lines 19-40) lacks the defense that code-graph launcher has, creating a minor injection risk

**Verdict: CONDITIONAL** (due to the P1 finding)

The core security posture is sound with workspace-local PID files, no signal escalation, atomic writes, and proper cleanup for normal signal paths. The findings represent a real cleanup gap in an edge case and a hygiene improvement rather than fundamental vulnerabilities.
e setTimeout SIGKILL backup (lines 287-291) executes `childProcess.kill('SIGKILL')` if the child doesn't exit within 5 seconds. This SIGKILL path does NOT call `clearLeaseFile()`. If the child context-server.js process hangs on SIGTERM and the SIGKILL backup fires, the lease file lingers indefinitely.
- Impact: Violates REQ-003 ("Each launcher writes + cleans its PID file... Cleans it on SIGTERM/SIGINT/normal exit") in the edge case where the child process hangs on SIGTERM. The lease file remains, causing subsequent launcher starts to incorrectly detect a stale lease that they must reclaim manually. This creates a resource leak and violates the security invariant that lease files are always cleaned on process termination.
- Suggested fix: Move `clearLeaseFile()` outside the `childProcess.once('exit')` callback so it executes regardless of whether the child exits cleanly or is force-killed. Alternatively, add `clearLeaseFile()` in the setTimeout SIGKILL backup path before the SIGKILL, or use a finally block pattern to ensure cleanup happens in all termination scenarios.

### [P2] Env parser control-character gap in spec-memory launcher (confirmed from iteration-002)
- File: .opencode/bin/mk-spec-memory-launcher.cjs:19-40
- Evidence: The loadEnvFile() function in spec-memory launcher (lines 19-40) lacks the control-character defense that code-graph launcher has at lines 40-43. Code-graph explicitly checks for `\n` and `\0` in env values and skips them: `if (val.includes('\n') || val.includes('\0')) { process.stderr.write(\`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n\`); continue; }`. Spec-memory has no such check.
- Impact: Minor injection risk if a malicious .env file is present in the workspace. An attacker with write access could inject control characters into environment variables, potentially affecting child process behavior or log parsing. However, the impact is limited since the launcher does not pass these env values to command shells or sensitive operations.
- Suggested fix: Add the same control-character check from code-graph launcher to spec-memory launcher's loadEnvFile() function at line 34, before setting process.env[key] = val.

## Notes

Dimension coverage: Focused on security aspects including secret handling (none in PID files), injection surfaces (JSON.parse with try-catch is safe, but env parser lacks control-character filtering), privilege boundaries (kill(pid, 0) is safe, no escalation), file-path traversal (workspace-local paths, no user input), signal handling (proper cleanup hooks for normal paths, but SIGKILL backup has gap), and test coverage for security scenarios. The core security posture is sound - the findings are a real P1 cleanup gap and a P2 hygiene improvement rather than fundamental vulnerabilities.

Cross-phase observation: This phase correctly mirrors the 006 launcher-boundary lease pattern for the most part. The security posture is consistent across all three launchers for the normal signal paths. The SIGKILL backup issue is specific to spec-memory's child process handling and is not present in the code-graph launcher or the skill-advisor launcher from 006.

Test coverage for security scenarios is adequate for happy paths but lacks adversarial testing: tests cover held-owner exit, stale-PID reclaim, PID-file cleanup on SIGTERM/SIGQUIT, and env-var override. The tests do not explicitly test adversarial .env files with control characters, malformed PID files beyond basic JSON parsing, or the "child hangs on signal" edge case that triggers the SIGKILL backup path.

REQ coverage from spec.md: REQ-001 (code-graph launcher refuses duplicate-start), REQ-002 (spec-memory launcher refuses duplicate-start), REQ-003 (PID file write+cleanup), REQ-004 (stale PID reclaim), REQ-005 (env-var override), REQ-006 (tests added), REQ-007 (reference docs), REQ-008 (changelog). The P1 finding affects REQ-003 for spec-memory in a specific edge case (child process hangs on SIGTERM).

Review verdict: CONDITIONAL