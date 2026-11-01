# Red before the change

Run from `.skilled/skills/system-skill-advisor/runtime` with the new tests added and `schemas/advisor-tool-schemas.ts` unmodified.

```text
$ npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts
 FAIL  tests/schemas/advisor-tool-schemas.vitest.ts > isWiredToSourceTree admits a project linked to this source tree > refuses an unlinked directory, a link to another source and a copied tree
TypeError: isWiredToSourceTree is not a function
 Test Files  1 failed (1)
      Tests  2 failed | 16 passed (18)
```

Baselines on the same tree (source unmodified, only the test added):

```text
$ npx --no-install vitest run            # whole advisor suite
 Test Files  1 failed | 158 passed (159)
      Tests  2 failed | 1359 passed | 8 skipped (1369)

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] 7 suite(s) passed, 0 failed
```

The defect as observed from a linked project is in the Barter verification note `T001-T009-orchestrator.md`, section T009: `advisor_status --workspace-root "$PWD"` exited 64 with `workspaceRoot must resolve under the repo root, os.tmpdir(), or an explicit SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST entry`.
