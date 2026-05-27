# Iteration 005 - F5 stale vitest path + playbook doc audit

## Focus

F5: NC-004/NC-005 document stale Vitest paths under `system-spec-kit/mcp_server` and `skill-advisor/tests/...`.

## Findings

### F5.1 Correct canonical invocation

The canonical invocation is to execute Vitest from the extracted skill-advisor MCP package:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

For NC-005:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/lifecycle-derived-metadata.vitest.ts tests/compat/plugin-bridge.vitest.ts --reporter=default
```

Combined validation also works:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts tests/lifecycle-derived-metadata.vitest.ts tests/compat/plugin-bridge.vitest.ts --reporter=default
```

Runtime evidence: the combined corrected command passed 4 test files / 49 tests. The stale `system-spec-kit/mcp_server` invocation failed with "No test files found" for `skill-advisor/tests/...`.

### F5.2 Why the stale path exists

The two affected scenarios still point at the old pre-extraction location:

- NC-004 uses `npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/legacy/advisor-renderer.vitest.ts --reporter=default` at `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md:38`.
- NC-005 uses `npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/lifecycle-derived-metadata.vitest.ts skill-advisor/tests/compat/plugin-bridge.vitest.ts --reporter=default` at `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md:36`.

The scenario metadata already identifies these files as part of the system-skill-advisor playbook rather than system-spec-kit: NC-004 source metadata names `01--native-mcp-tools/004-ambiguous-brief-rendering.md` at `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md:84`, and NC-005 does the same at `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md:76`.

The actual test files now live under `.opencode/skills/system-skill-advisor/mcp_server/tests/`:

- `tests/handlers/advisor-recommend.vitest.ts`
- `tests/legacy/advisor-renderer.vitest.ts`
- `tests/lifecycle-derived-metadata.vitest.ts`
- `tests/compat/plugin-bridge.vitest.ts`

This confirms the stale pattern is residue from the system-spec-kit to system-skill-advisor extraction: the playbook files moved into `system-skill-advisor`, but their test commands retained the former `system-spec-kit/mcp_server` package prefix and `skill-advisor/tests/...` subpath.

### F5.3 Full playbook audit

Audit commands requested:

```bash
grep -rn "skill-advisor/tests" .opencode/skills/system-skill-advisor/manual_testing_playbook/
grep -rn "system-spec-kit/mcp_server exec -- vitest" .opencode/skills/system-skill-advisor/manual_testing_playbook/
ls .opencode/skills/system-skill-advisor/mcp_server/tests/
```

Both grep patterns returned exactly the same two affected scenario files:

- `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md:38`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md:36`

No other playbook scenario contains either stale `skill-advisor/tests` or `system-spec-kit/mcp_server exec -- vitest` pattern.

## Concrete Remediation

Edit `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md:38` from:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

to:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default
```

Edit `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md:36` from:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/lifecycle-derived-metadata.vitest.ts skill-advisor/tests/compat/plugin-bridge.vitest.ts --reporter=default
```

to:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/lifecycle-derived-metadata.vitest.ts tests/compat/plugin-bridge.vitest.ts --reporter=default
```

## Verification

- Stale NC-004 command shape: fails with no matching test files.
- Corrected combined command: 4 test files passed, 49 tests passed.
- Audit coverage: both stale grep patterns found only NC-004 and NC-005.

## Next Focus

converged: all 5 findings analyzed
