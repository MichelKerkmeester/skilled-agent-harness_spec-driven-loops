I've completed the security-focused deep review iteration for the concurrent daemon corruption fix phase. 

**Summary of findings:**
- **1 P1 issue:** DB-dir override false-negative security vulnerability is documented in daemon-lease-contract.md §6 but lacks technical mitigation beyond operator guidance
- **2 P2 issues:** Database directory override allows arbitrary filesystem access without validation, and a TOCTOU race condition exists in isLeaseHeld() PID liveness check (documented as acceptable risk)

**Key security observations:**
- The env file parser, spawn/spawnSync calls, WAL mode fallback, and signal handlers are implemented safely from a security perspective
- Security checklist items CHK-015 and CHK-016 are incomplete in checklist.md
- The prior iteration's P1 finding (missing integration test) was a correctness issue, not security, so not duplicated

**Review verdict: CONDITIONAL** (due to the P1 finding)
rent workspaces pointing at the same shared DB directory use different lease keys. Both can pass the lease check and then write the same SQLite database. This is a false negative and can corrupt the shared DB." The implementation in launcher.cjs:118-124 and skill-graph-db.ts:207-220 uses workspaceKey() for lease enforcement but allows arbitrary DB directory override via environment variables, creating a gap where lease enforcement does not protect the actual database file being written.
- Impact: Operators who use MK_SKILL_ADVISOR_DB_DIR or SYSTEM_SKILL_ADVISOR_DB_DIR to point multiple workspaces at a shared database can corrupt that database because the lease check is keyed by workspace root, not by the resolved database directory. This violates the single-writer invariant the fix intends to enforce.
- Suggested fix: Either (1) key the lease by the resolved database directory instead of workspace root, or (2) reject DB-dir override when MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER=1, or (3) add a warning in daemon-lease-contract.md that strict mode is incompatible with DB-dir overrides and require operator acknowledgment.

### [P2] Database directory override allows arbitrary filesystem access without validation
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:118-124` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:207-220`
- Evidence: advisorDbPath() and leasePath() in launcher.cjs use `path.resolve(process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR)` without validation. resolveSkillGraphDbDir() in skill-graph-db.ts uses the same pattern. An attacker who can set these environment variables can redirect the SQLite database and lease files to arbitrary filesystem locations.
- Impact: If an attacker can control the environment (e.g., via a compromised CI script, malicious subprocess, or social engineering), they can cause the launcher to read/write database files in unexpected locations, potentially overwriting sensitive files or exfiltrating data. However, in practice this is low-risk because the operator typically controls their environment.
- Suggested fix: Add path validation to restrict DB-dir overrides to subdirectories of the workspace root, or add a warning log when an override is used pointing outside the workspace. CHK-015 in checklist.md is incomplete and should verify this constraint.

### [P2] TOCTOU race condition in isLeaseHeld() PID liveness check
- File: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:139-173`
- Evidence: isLeaseHeld() reads the lease snapshot (line 148) then checks PID liveness via process.kill(snapshot.pid, 0) (line 161). Between these operations, the PID could die and be reused by an unrelated process. The spec acknowledges this in §9 EDGE CASES as "PID reuse collision" with mitigation "operator can rm the lease file to recover."
- Impact: If a PID is recycled between the lease read and the liveness check, the launcher could incorrectly identify an unrelated process as the lease holder and exit, causing a false-positive denial of service. Conversely, if the PID dies after the liveness check, a new launcher could acquire the lease while the old process is still shutting down, potentially causing brief concurrent access. The spec deems this acceptable given macOS PID space size.
- Suggested fix: No technical fix needed per spec's risk acceptance, but consider adding a timestamp check (compare snapshot.startedAt with current time) to reduce the window, or document the race window duration in daemon-lease-contract.md. CHK-016 in checklist.md is incomplete and should verify no PID-spoofing attack surface beyond the documented race.

## Notes

Dimension coverage: security reviewed across lease file handling, PID liveness checking, database directory override, WAL mode error handling, environment variable parsing, signal handling, and command execution safety. The env file parser (launcher.cjs:19-40) correctly validates key names and prevents command injection. The spawn/spawnSync calls (launcher.cjs:161, 297) use hardcoded commands with no user input, safe from injection. The WAL mode fallback (skill-graph-db.ts:288-304) correctly handles specific filesystem error codes. Signal handlers (launcher.cjs:317-344) properly clean up lease files on exit. Security checklist items CHK-015 (lease file workspace-local) and CHK-016 (no PID-spoofing attack surface) are marked incomplete in checklist.md; these should be completed before claiming full security verification. The prior iteration-001 found a P1 traceability gap (missing integration test for REQ-001); this is a correctness issue, not a security issue, so not duplicated here.

Review verdict: CONDITIONAL