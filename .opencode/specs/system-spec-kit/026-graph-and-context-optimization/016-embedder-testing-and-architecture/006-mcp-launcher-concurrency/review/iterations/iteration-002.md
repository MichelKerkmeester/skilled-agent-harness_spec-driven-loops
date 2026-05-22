I've completed the security-focused deep-review iteration for the phase-parent scope. The review found 2 P2 findings related to documentation gaps for path traversal validation and PID reuse collision as a known security limitation. No P0 or P1 security issues were identified. The arc adequately addresses core security concerns (race-window correctness, privilege boundaries, signal-handling, env-var parsing) in phases 003 and 004.

**Review verdict: PASS**
curity limitation in adversarial environments. The arc adequately addresses core security concerns (race-window correctness, privilege boundaries via EPERM handling, signal-handling for cleanup, env-var parsing) in phases 003 and 004.

## Findings

### [P2] Path traversal validation not explicit in security contract
- File: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix/spec.md:203
- Evidence: Edge case section mentions "Symlink in DB path. Launcher's standalone-storage guard already rejects external absolute paths; symlinks within workspace OK." but this protection is not explicitly documented in the lease security contract or the references/daemon-lease-contract.md security section.
- Impact: While existing protection appears to be in place via the standalone-storage guard, the security contract doesn't explicitly document path traversal validation for lease file paths. An attacker who can influence file paths could potentially use traversal sequences if the guard is bypassed or has gaps.
- Suggested fix: Add explicit documentation in references/daemon-lease-contract.md (and the new launcher-lease.md docs for code-graph/spec-memory) stating that lease file paths are validated against path traversal via the standalone-storage guard, and that only relative paths within workspace are permitted.

### [P2] PID reuse collision documented as acceptable false-negative
- File: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix/spec.md:199; 002/spec.md:204
- Evidence: Both 001 and 002 edge cases state: "PID reuse collision. OS recycles the recorded PID to an unrelated process (rare on macOS due to PID-space size). → kill -0 returns success, new launcher exits silently. Acceptable false-negative; operator can rm the lease file to recover."
- Impact: In adversarial environments where an attacker can influence PID assignment or accelerate PID recycling, this could be used to cause denial-of-service by preventing legitimate launcher starts. The spec acknowledges this as "acceptable" but doesn't document it as a security consideration.
- Suggested fix: Document this as a known security limitation in the lease contract references, with a note that in high-security environments operators should consider additional PID validation (e.g., checking process command line or start time) beyond the basic kill -0 probe.

## Notes

Dimension coverage: Security dimension reviewed at arc-level (race windows, privilege boundaries, signal-handling, path traversal, PID reuse). Did NOT review child code implementation details (per phase-parent scope). Cross-phase security consistency: The single-writer lease invariant, SQLite WAL defenses, and signal-handler parity are stated consistently across parent spec and all 4 child specs. Privilege boundary handling (EPERM → held: true) is explicitly addressed in 003 REQ-004. Race-window correctness (re-probe after write) is addressed in 003 REQ-001. Signal-handling coverage (SIGTERM, SIGINT, SIGQUIT, uncaughtException) is addressed in 003 REQ-002 and 004 REQ-002. Env-var parsing security is addressed in 003 REQ-003. No P0 or P1 security findings; the arc's security hardening (phases 003-004) appears comprehensive for the threat model in scope.

Review verdict: PASS