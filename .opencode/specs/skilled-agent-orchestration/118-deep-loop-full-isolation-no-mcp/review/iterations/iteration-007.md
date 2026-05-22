# Iteration 7 — Adversarial + Edge Cases (cli-devin swe-1.6, captured from log)

## Summary

Iter-7 focused on references accuracy, graph-metadata.json verification, and edge case analysis. Found 4 new findings (0 P0 / 2 P1 / 2 P2). Devin printed findings to stdout but did not write to this file or the delta JSONL — content captured manually from the log.

## Findings

### P0 (Blockers)
(none)

### P1 (Required)

- [F-027] state_format.md documents `PostDispatchValidateInput` incorrectly — `.opencode/skills/deep-loop-runtime/references/state_format.md`
  Evidence: docs uses field name `deltaPath` but code uses `deltaFilePath`; missing required fields `previousStateLogSize` and `requiredJsonlFields`
  Recommended fix: align field names with `lib/deep-loop/post-dispatch-validate.ts` actual zod schema

- [F-028] state_format.md documents `LoopLockData` incorrectly — `.opencode/skills/deep-loop-runtime/references/state_format.md`
  Evidence: docs uses `acquiredAtIso` but code uses `startedAtIso`; `packetId` field completely omitted
  Recommended fix: align with `lib/deep-loop/loop-lock.ts` actual `LoopLockData` type

### P2 (Suggestions)

- [F-029] Scripts lack explicit SIGTERM/SIGINT handlers for graceful DB closure — `.opencode/skills/deep-loop-runtime/scripts/*.cjs`
  Evidence: no `process.on('SIGTERM', ...)` registered
  Recommended fix: register handlers that close DB before exit

- [F-030] TODO pattern in post-dispatch-validate placeholder detection regex may be overbroad — `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`
  Evidence: regex matches legitimate TODOs in production code
  Recommended fix: narrow regex to placeholder-only patterns

## Verification (PASS notes, no findings)

- ✓ Script interface contract matches actual scripts exactly
- ✓ Coverage graph schema matches actual DB creation
- ✓ Integration points are accurate post-118
- ✓ Graph-metadata.json is accurate
- ✓ No broken imports from system-spec-kit/mcp_server/lib/ directories
- ✓ No unused imports or dead code post-move
- ✓ SQLite creation is deterministic
- ✓ No version drift between SKILL.md, changelog, and graph-metadata.json

## Convergence Signal

- newFindings: 4
- newFindingsRatio: 4/27 ≈ 0.148 (slightly above 0.10 threshold)
- Cumulative: 0 P0 / 15 P1 / 13 P2
