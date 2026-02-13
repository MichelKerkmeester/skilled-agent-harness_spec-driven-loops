# Phase 7: Convert Test Files

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-G (MCP tests), W-H (Scripts tests)
> **Tasks:** T180–T210
> **Milestone:** M8 (All Tests Converted)
> **SYNC Gate:** SYNC-008
> **Depends On:** Phase 5 (SYNC-006) + Phase 6 (SYNC-007)
> **Session:** 4

---

## Goal

Convert all 59 test files to TypeScript for full type safety. Tests use `node:test` and `node:assert` — both have types via `@types/node`.

## Scope

**Target:** 59 test files, ~55,297 lines (56% of total codebase)

### Parallel Batches

| Batch | Area | Files | Lines |
|-------|------|------:|------:|
| 7a | `mcp_server/tests/` — cognitive/scoring | 12 | ~12,000 |
| 7b | `mcp_server/tests/` — search/storage | 10 | ~9,000 |
| 7c | `mcp_server/tests/` — handlers/integration | 10 | ~10,000 |
| 7d | `mcp_server/tests/` — remaining | 14 | ~11,000 |
| 7e | `scripts/tests/` | 13 | 12,820 |

All 5 batches can run in parallel — tests have no inter-file dependencies.

### Conversion Strategy

- Tests import from compiled source, so they work against `.js` output
- Use `node:test` and `node:assert` (already used) — types come from `@types/node`
- Type test helpers and mocks properly
- Ensure test data fixtures have proper types

### Special Considerations

- Test files are 56% of the total codebase — this is the largest single phase by LOC
- Tests are verification code, not production — accept slightly broader types where needed
- Mock objects may need type assertions (`as unknown as MockType`)

## Exit Criteria

- [ ] All 59 test files compile with `tsc --noEmit` (zero errors)
- [ ] Full test suite passes: `npm test` (both workspaces)
- [ ] No `any` in test assertions or mock types (use proper type narrowing)
- [ ] SYNC-008 gate passed
