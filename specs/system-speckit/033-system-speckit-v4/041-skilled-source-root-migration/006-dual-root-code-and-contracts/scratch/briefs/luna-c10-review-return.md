## Verdict

Not contract-complete: `.skilled`-only layouts can produce missing hooks reported as clean, and the added tests do not fully distinguish the fix.

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 | `.codex/hooks.json:8`; `.opencode/bin/install-codex-hooks.mjs:173`; `.opencode/bin/install-codex-hooks.mjs:399` | In a `.skilled`-only checkout, the committed source still names `.opencode/...`. Install, then run `--check`: the missing adapter is treated as an owned match, so the target contains a non-runnable hook and `--check` reports `OK` instead of orphan/drift. | Validate canonical source adapters against the active layout and make missing files surface as orphan/drift. |
| F-002 | P2 | `.opencode/bin/install-codex-hooks.mjs:150`; `.opencode/bin/install-codex-hooks.mjs:174`; `.opencode/bin/install-codex-hooks.mjs:416` | With source `.skilled/hooks/probe-hook.js` and installed `.opencode/hooks/probe-hook.js`, `--dry-run` reports the removed label with `.opencode`, although the contract requires labels to use the source spelling. | Resolve removed owned-hook labels through the normalized source identity. |
| F-003 | P2 | `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:38`; `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:84`; `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:93` | The `skilled-only` row with both `installedName` and `sourceName` set to `.opencode` writes the adapter only under `.skilled`, yet uses identical spellings and would pass the parent exact-identity implementation. | Assert the selected adapter exists, use valid source spellings per layout, and add assertions for the report and missing-file cases. |
| F-004 | P2 | `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:45`; `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:54`; `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs:70` | When the test runs with `GIT_DIR` set to an external path, `git init` inherits that environment and can write repository metadata outside the temporary fixture. | Sanitize Git environment variables for both `git init` and installer processes. |
Codex exit 0, 2026-09-17T10:37:01Z to 2026-09-17T10:45:06Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
