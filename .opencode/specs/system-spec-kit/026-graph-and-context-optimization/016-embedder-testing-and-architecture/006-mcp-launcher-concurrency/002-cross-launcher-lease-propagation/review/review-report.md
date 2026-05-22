# Deep-Review Report — 002

- Scope: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation`
- Session: rvw-002-20260518-100857
- Iterations: 8 of 8 allocated
- Stop reason: converged (2 consecutive zero-finding iters)
- Completed: 2026-05-18T10:18:50Z

## Per-Iter Verdicts

| Iter | Dimension | P0 | P1 | P2 | Verdict |
|---|---|--:|--:|--:|---|
| 001 | correctness | 0 | 1 | 1 | CONDITIONAL |
| 002 | security | 0 | 0 | 2 | PASS |
| 003 | traceability | 0 | 0 | 1 | CONDITIONAL |
| 004 | maintainability | 0 | 0 | 3 | PASS |
| 005 | correctness | 0 | 0 | 0 | CONDITIONAL |
| 006 | security | 0 | 0 | 1 | CONDITIONAL |
| 007 | traceability | 0 | 0 | 0 | PASS |
| 008 | maintainability | 0 | 0 | 0 | PASS |

## Findings Aggregate

(Concatenated findings from all iters; review individual iter files for full evidence.)


### From iteration-001.md


### [P1] Spec risk mitigation description contradicts implementation order
- File: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/spec.md:171
- Evidence: Spec states "Lease check happens after the bootstrap lock so only one launcher writes the PID file at a time" in the Risks table. However, the actual implementation in both launchers performs lease check BEFORE bootstrap lock: mk-code-index-launcher.cjs lines 391-404 (lease check) vs line 406 (acquireBootstrapLock); mk-spec-memory-launcher.cjs lines 320-333 (lease check) vs line 335 (acquireBootstrapLock).
- Impact: The documented risk mitigation strategy is inaccurate. The bootstrap lock does not absorb the lease-check race window as claimed. The actual race protection comes from the atomic rename in writeLeaseFile() (lines 153-158 in code-graph, 120-125 in spec-memory), not from the bootstrap lock ordering.
- Suggested fix: Update spec.md line 171 to accurately reflect the implementation: "Lease check happens before the bootstrap lock. Race protection is provided by atomic PID-file write (temp file + rename), not by the bootstrap lock."

### [P2] Lease check timing creates broader race window than spec implies
- File: .opencode/bin/mk-code-index-launcher.cjs:391-412 and .opencode/bin/mk-spec-memory-launcher.cjs:320-348
- Evidence: Both launchers check isLeaseHeld() before acquiring the bootstrap lock. If two launchers start simultaneously when no PID file exists, both can pass the lease check, then race to write the PID file. The atomic rename (writeLeaseFile() uses .tmp.<pid> + renameSync) ensures only one wins, but the race window extends through the entire lease-check-to-write period.
- Impact: The spec's risk mitigation at line 171 overstates the bootstrap lock's role. In practice, the atomic rename provides adequate protection, but the documentation should accurately describe the actual race-protection mechanism.
- Suggested fix: Same as P1 — correct the spec to reflect that atomic rename, not bootstrap lock ordering, is the primary race protection.


### From iteration-002.md


### [P2] Env parser control-character gap in spec-memory launcher
- File: .opencode/bin/mk-spec-memory-launcher.cjs:19-40
- Evidence: The loadEnvFile() function in spec-memory launcher (lines 19-40) lacks the control-character defense that code-graph launcher has at lines 40-43. Code-graph explicitly checks for `\n` and `\0` in env values and skips them: `if (val.includes('\n') || val.includes('\0')) { process.stderr.write(\`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n\`); continue; }`. Spec-memory has no such check.
- Impact: Minor injection risk if a malicious .env file is present in the workspace. An attacker with write access could inject control characters into environment variables, potentially affecting child process behavior or log parsing.
- Suggested fix: Add the same control-character check from code-graph launcher to spec-memory launcher's loadEnvFile() function at line 34, before setting process.env[key] = val.

### [P2] PID validation before lease file write could be strengthened
- File: .opencode/bin/mk-code-index-launcher.cjs:153-158 and .opencode/bin/mk-spec-memory-launcher.cjs:120-125
- Evidence: Both launchers' writeLeaseFile() functions write the PID file using atomic rename (temp file + renameSync), but they don't validate that process.pid is actually a valid number before the write operation. The code assumes process.pid is always valid: `fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2));`
- Impact: Low impact in practice since Node.js guarantees process.pid is a valid number. However, adding an explicit validation check would make the code more defensive and align with security best practices for untrusted inputs (though process.pid is trusted here).
- Suggested fix: Add a validation check before writing: `if (typeof process.pid !== 'number' || process.pid <= 0) throw new Error('Invalid process.pid');` at the start of writeLeaseFile() in both launchers.


### From iteration-003.md


### From iteration-004.md


### From iteration-005.md


### From iteration-006.md


### From iteration-007.md


### From iteration-008.md


## Notes

This report was generated by the minimal-viable driver `run-deep-review-arc.sh`. It does NOT run the canonical YAML reducer / dashboard / composite-convergence math. Per-iter findings are equally valid as a canonical dispatch would produce; the simplified concatenation here is the only deviation from canonical synthesis.
