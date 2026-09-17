# Layout rehearsal results

Checkout commit: `dadf2d19dd5b8728e4ba1b980d5cce3a275e26ea`. Clones: APFS copy-on-write where available, each with its `.git` pointer removed first.

| Layout | Check | Expected | Observed | Verdict |
|--------|-------|----------|----------|---------|
| today | clone has no .git pointer | absent | absent | PASS |
| today | ignored entries (git ls-files -o -i --directory) | the count the other layouts must keep | 31 | RECORDED |
| today | drift checker through .opencode | [CONTRACT DRIFT] OK commands=3 | [CONTRACT DRIFT] OK commands=3 | PASS |
| today | guard default scan through .opencode beside a seeded import | exit 1 naming the import | exit 1, named 1 time(s) | PASS |
| today | guard default scan through .opencode, clean | exit 0 over more than zero files | exit 0: ok: no spec-tree imports in 26 runtime file(s) across 1 dir(s) | PASS |
| today | findRepoRoot from .opencode/skills/system-spec-kit/runtime/cli | <clone> | <clone> | PASS |
| today | findRepoRoot through .opencode, capped at 2 levels | <clone> | <clone> | PASS |
| today | workspace identity from .opencode/skills (built module) | <clone> | <clone> | PASS |
| today | advisor workspace root through .opencode (built module) | <clone> | <clone> | PASS |
| today | registration opencode.json | answered | answered: initialize answered | PASS |
| today | registration .claude/mcp.json | answered | answered: initialize answered | PASS |
| today | registration .codex/config.toml | answered | answered: initialize answered | PASS |
| today | registration .cursor/mcp.json | answered | answered: initialize answered | PASS |
| today | registration .devin/mcp_config.json | answered | answered: initialize answered | PASS |
| today | registration .pi/mcp.json | answered | answered: initialize answered | PASS |
| skilled-only | clone has no .git pointer | absent | absent | PASS |
| skilled-only | ignored entries (git ls-files -o -i --directory) | 31, the same entries as today | 31 | PASS |
| skilled-only | drift checker through .skilled | [CONTRACT DRIFT] OK commands=3 | [CONTRACT DRIFT] OK commands=3 | PASS |
| skilled-only | guard default scan through .skilled beside a seeded import | exit 1 naming the import | exit 1, named 1 time(s) | PASS |
| skilled-only | guard default scan through .skilled, clean | exit 0 over more than zero files | exit 0: ok: no spec-tree imports in 26 runtime file(s) across 1 dir(s) | PASS |
| skilled-only | findRepoRoot from .skilled/skills/system-spec-kit/runtime/cli | <clone> | <clone> | PASS |
| skilled-only | findRepoRoot through .skilled, capped at 2 levels | <clone> | <clone> | PASS |
| skilled-only | workspace identity from .skilled/skills (built module) | <clone> | <clone> | PASS |
| skilled-only | advisor workspace root through .skilled (built module) | <clone> | <clone> | PASS |
| skilled-only | registration opencode.json | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | registration .claude/mcp.json | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | registration .codex/config.toml | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | registration .cursor/mcp.json | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | registration .devin/mcp_config.json | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | registration .pi/mcp.json | recorded against the single-link shape | no-answer: Cannot find module '<clone>/.opencode/bin/mcp-code-mode-launcher.cjs' | RECORDED |
| skilled-only | no .opencode path after the checks | absent | absent | PASS |
| whole-link | clone has no .git pointer | absent | absent | PASS |
| whole-link | ignored entries (git ls-files -o -i --directory) | 31, the same entries as today | 31 | PASS |
| whole-link | drift checker through .opencode | [CONTRACT DRIFT] OK commands=3 | [CONTRACT DRIFT] OK commands=3 | PASS |
| whole-link | guard default scan through .opencode beside a seeded import | exit 1 naming the import | exit 1, named 1 time(s) | PASS |
| whole-link | guard default scan through .opencode, clean | exit 0 over more than zero files | exit 0: ok: no spec-tree imports in 26 runtime file(s) across 1 dir(s) | PASS |
| whole-link | drift checker through .skilled | [CONTRACT DRIFT] OK commands=3 | [CONTRACT DRIFT] OK commands=3 | PASS |
| whole-link | guard default scan through .skilled beside a seeded import | exit 1 naming the import | exit 1, named 1 time(s) | PASS |
| whole-link | guard default scan through .skilled, clean | exit 0 over more than zero files | exit 0: ok: no spec-tree imports in 26 runtime file(s) across 1 dir(s) | PASS |
| whole-link | findRepoRoot from .opencode/skills/system-spec-kit/runtime/cli | <clone> | <clone> | PASS |
| whole-link | findRepoRoot through .opencode, capped at 2 levels | <clone> | <clone> | PASS |
| whole-link | workspace identity from .opencode/skills (built module) | <clone> | <clone> | PASS |
| whole-link | advisor workspace root through .opencode (built module) | <clone> | <clone> | PASS |
| whole-link | findRepoRoot from .skilled/skills/system-spec-kit/runtime/cli | <clone> | <clone> | PASS |
| whole-link | findRepoRoot through .skilled, capped at 2 levels | <clone> | <clone> | PASS |
| whole-link | workspace identity from .skilled/skills (built module) | <clone> | <clone> | PASS |
| whole-link | advisor workspace root through .skilled (built module) | <clone> | <clone> | PASS |
| whole-link | registration opencode.json | answered | answered: initialize answered | PASS |
| whole-link | registration .claude/mcp.json | answered | answered: initialize answered | PASS |
| whole-link | registration .codex/config.toml | answered | answered: initialize answered | PASS |
| whole-link | registration .cursor/mcp.json | answered | answered: initialize answered | PASS |
| whole-link | registration .devin/mcp_config.json | answered | answered: initialize answered | PASS |
| whole-link | registration .pi/mcp.json | answered | answered: initialize answered | PASS |

Failures: 0
