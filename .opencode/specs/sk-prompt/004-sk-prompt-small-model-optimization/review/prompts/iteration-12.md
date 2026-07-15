DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 12 of 20

## STATE

state_summary: 11 iters done. Running: P0=0, P1=2 (sec-F2 deny-precedence, sec-F3 abs-path), P2=13. Iter 12: STRESS-TEST the 2 confirmed P1s by reading the existing test suite for permissions-gate. Determine whether the bugs (a) are actually reproducible, (b) have test coverage that would catch them, (c) are real exploit paths or theoretical-only.

Review Iteration: 12 of 20
Mode: review
Dimension: **P1 stress-test / reproducibility**

## ITERATION 12 FOCUS — P1 REPRODUCIBILITY

### F2: deny-precedence runtime gap

**Claim**: `permissions-gate.ts:findBestRule` at lines 326-352 uses specificity + array-order tiebreak. Two rules with identical specificity (e.g., `**` allow vs `**` deny) resolve by first-match-wins → a misconfigured matrix with allow placed before deny silently grants access.

**Stress-test method**:
1. Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts:326-352` (the `findBestRule` function).
2. Read `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/permissions-gate.vitest.ts` end-to-end.
3. Check whether any test case constructs a matrix with `[{glob:"**", effect:"allow"}, {glob:"**", effect:"deny"}]` or similar identical-specificity allow-before-deny scenario.
4. If yes → bug is testable; check what verdict the test asserts.
5. If no → bug is hidden; report as CONFIRMED P1 with reproduction sketch.

**Output**:
- Confirmed P1 (test coverage missing) — keep as P1
- Test exists and asserts deny-wins → DOWNGRADE to P2 (defensive code missing but covered)
- Test exists and asserts allow-wins → ESCALATE to P0 (intentional broken behavior)

### F3: absolute-path scope-escape

**Claim**: `permissions-gate.ts:resolvePathTarget` at lines 200-221 calls `path.resolve(expandHome(rawPath))` and accepts absolute paths verbatim. No constraint to `repoRoot`.

**Stress-test method**:
1. Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts:200-243` (the path resolution + candidate generation).
2. Look for any check that rejects or normalizes paths outside repoRoot in the path-handling code.
3. Read the permissions-gate test file for absolute-path test cases. Search for test cases using `/etc/`, `/tmp/`, or other absolute paths.
4. Check if test cases assert allow/deny on absolute paths outside repo scope.

**Output**:
- No abs-path test + no runtime check → CONFIRMED P1 (real escape risk)
- Runtime check exists (e.g., `if (!resolved.startsWith(repoRoot)) deny`) → adjust to DOWNGRADE to P2
- Tests assert deny on `/etc/...` paths → DOWNGRADE to P2 (defense-in-depth gap covered by test)

### Bonus: Test coverage for permissions-gate edge cases

While reading the test file, note any other security-relevant scenarios that ARE tested:
- Malformed matrix (missing rules, invalid effect string)
- Symlink loops (depth cap)
- Empty path / undefined path
- Glob patterns with special chars

This gives confidence in what IS covered, contextualizing what isn't.

## STATE FILES

- Write iter to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/iterations/iteration-012.md`
- Write delta to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deltas/iter-012.jsonl`
- State log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-state.jsonl`

## CONSTRAINTS

- LEAF. Soft 12 / hard 13 tool calls. Read-only review target.
- Allowed writes: 3 paths above.
- Use absolute paths.

## OUTPUT CONTRACT

1. **iteration-012.md** — Structure: `## F2 Reproducibility`, `## F3 Reproducibility`, `## Test Coverage Overview`, `## Findings (adjusted severities)`, `## Verdict`, `## Next Focus`.

2. **state.jsonl APPEND** — single line, include `findingsAdjusted` field.

3. **deltas/iter-012.jsonl** — multi-line with finalSeverity adjustments per F2 and F3.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read permissions-gate.ts lines 200-243 + 326-352.
3. Read permissions-gate.vitest.ts end-to-end.
4. Document reproducibility per F2 + F3.
5. Compose iter + delta + state. Stop.
