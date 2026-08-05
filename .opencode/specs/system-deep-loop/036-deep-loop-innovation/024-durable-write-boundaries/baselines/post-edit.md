# Post-edit verification baseline

- Candidate SHA: `9229cb8f3e281c9291e6d631237528bc755e6f4b` (worktree remains uncommitted).
- Runtime package gate: `npm run typecheck` / `npm test` remain unavailable because `runtime/package.json` is absent.
- Fallback typecheck: `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` — rc `0` after the final test edits.
- Whole runtime command: `./node_modules/.bin/vitest run --no-coverage` — started, emitted the known graph/SQLite ABI and contract-family failures, then remained live without an aggregate summary and was interrupted with rc `130`.
- Unit-tree command: `./node_modules/.bin/vitest run --no-coverage tests/unit` — started, emitted the known legacy/render/graph/SQLite failures, then remained live without an aggregate summary and was interrupted with rc `130`.
- Aggregate post counts: `UNKNOWN` because both required broad runners were interrupted before Vitest emitted `Test Files` / `Tests` totals. This is not substituted with the 021 RED anchor.
- Targeted post receipts: authorized-ledger + locks-and-fencing `2 files / 55 passed / 0 failed / rc 0`; replay-fingerprint + effect-recovery + loop-lock + atomic-state + leaf-artifact-writer `5 files / 145 passed / 0 failed / rc 0`; identity/public-surface filter `1 file / 7 passed / 20 skipped / rc 0`.
- Strict child validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries --strict` — errors `0`, warnings `0`, rc `0`.
- Delta against 021: `UNKNOWN` for the broad runner because no terminating post aggregate exists; targeted suites introduced by this child are green.
