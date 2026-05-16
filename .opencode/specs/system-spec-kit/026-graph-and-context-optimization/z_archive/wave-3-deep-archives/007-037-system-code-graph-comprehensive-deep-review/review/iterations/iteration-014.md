# Iteration 014 — system-code-graph: Launcher (.opencode/bin/mk-code-index-launcher.cjs) standalone-storage guard + maintainer-mode toggle + env loading

## Summary

The launcher implements env loading and maintainer-mode toggle correctly, but lacks the advertised standalone-storage guard — database is embedded within the skill directory rather than isolated to a standalone location. Verdict: P1 finding for missing standalone-storage guard.

## Files Reviewed

- `.opencode/bin/mk-code-index-launcher.cjs` (lines read: 325)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 014-001 | .opencode/bin/mk-code-index-launcher.cjs:82 | Database path is embedded within skill directory (`path.join(kitDir, 'mcp_server', 'database')`) contradicting the advertised "standalone-storage guard" in header comment (line 4) | Header promises standalone-storage guard but implementation uses skill-local storage; this conflicts with the design intent and could cause issues if skill directory is moved/deleted | Move database to a standalone location (e.g., `.opencode/.spec-kit/code-graph/database`) and add migration logic from legacy path |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 014-002 | .opencode/bin/mk-code-index-launcher.cjs:37-40 | Control character defense in env parser is good but only checks for `\n` and `\0`; other control characters like `\r`, `\t` could slip through | Minor robustness gap; unlikely to cause issues in practice | Expand control character check to full ASCII control range (0x00-0x1F) or use a regex for `\p{C}` |
| 014-003 | .opencode/bin/mk-code-index-launcher.cjs:63 | Maintainer-mode check uses strict string comparison `=== 'true'` which is correct, but could also accept truthy values like `1`, `yes` for better UX | Minor usability friction; users might try `1` or `yes` and be confused when it doesn't work | Accept common truthy values or document strict `true` requirement prominently |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations (first review of launcher surface; env loading and maintainer-mode are well-implemented, but standalone-storage guard is missing)
