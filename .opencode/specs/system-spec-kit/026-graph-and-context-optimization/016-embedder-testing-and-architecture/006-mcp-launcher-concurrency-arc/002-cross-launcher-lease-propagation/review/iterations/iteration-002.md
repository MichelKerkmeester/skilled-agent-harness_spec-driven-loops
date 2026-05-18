I'm in a non-interactive mode that prevents file writes. Since this is a read-only review iteration, I'll output the iter file content directly:

```markdown
# Iteration 2 — security

## Summary

Reviewed the cross-launcher lease propagation phase (002) focusing on the security dimension. Read spec.md, plan.md, implementation-summary.md, checklist.md, changelog, prior iteration-001.md, and traced both launcher implementations plus the code-graph test suite. Found two P2 hygiene issues: spec-memory launcher's env parser lacks control-character filtering that code-graph launcher has, and both launchers could add PID validation before lease file writes. Core security posture is sound with workspace-local PID files, no signal escalation, atomic writes, and proper cleanup.

## Findings

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

## Notes

Dimension coverage: Focused on security aspects including secret handling (none in PID files), injection surfaces (JSON.parse with try-catch is safe), privilege boundaries (kill(pid, 0) is safe), file-path traversal (workspace-local paths, no user input), and signal handling (proper cleanup hooks). The core security posture is sound - the findings are hygiene improvements rather than actual vulnerabilities.

Cross-phase observation: This phase correctly mirrors the 006 launcher-boundary lease pattern. The security posture is consistent across all three launchers. The env parser gap is an inconsistency that should be aligned for defensive hygiene.

Test coverage for security scenarios is adequate: tests cover held-owner exit, stale-PID reclaim, PID-file cleanup on signals, and env-var override. The tests do not explicitly test adversarial .env files or malformed PID files, but the code's try-catch blocks handle malformed JSON gracefully.

Review verdict: PASS
```
