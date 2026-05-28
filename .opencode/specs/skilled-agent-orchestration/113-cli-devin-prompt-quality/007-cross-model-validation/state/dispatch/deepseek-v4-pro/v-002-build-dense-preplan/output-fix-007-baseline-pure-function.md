The code appears to already exist in both files. Let me verify the tests pass and check the package.json for the test command.Code already matches the spec exactly. Let me run the tests to confirm they pass.All 3 acceptance criteria pass:

- **[ac-001]** 3 vitest cases pass (verified: `npx vitest run` → 3 passed)
- **[ac-002]** `formatBytes` exported (`src/utils/format.ts:1`)
- **[ac-003]** 3 test cases present (`src/utils/format.test.ts:5,9,13`)

The implementation was already present in the seed fixture — no changes needed.