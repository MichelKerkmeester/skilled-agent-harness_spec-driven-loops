Now I have the full picture. Let me think through the implementation carefully before writing code.Now let me write all three files:Now let me install dependencies and run the tests:All 12 tests pass. Let me verify the grep acceptance criterion:Both acceptance criteria pass:

- **ac-001**: 12/12 deterministic test cases pass (`npx vitest run` exits 0)
- **ac-002**: `export function deepEqual` found at `src/deep-equal.ts:55`

Files written:
- `fixtures/fix-005-acceptance-strict/seed/src/deep-equal.ts` — implementation with circular ref tracking, NaN handling, Date comparison, undefined key filtering
- `fixtures/fix-005-acceptance-strict/seed/src/deep-equal.test.ts` — 12 vitest cases
- `fixtures/fix-005-acceptance-strict/seed/package.json` — vitest config