DEEP-REVIEW

# Deep-Review Iteration 4 / 10 — Maintainability

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iteration 4 of 10 on the `116-deep-review-complexity` arc. Focus: **maintainability** (documentation drift, dead code, TODO debt, naming consistency, comments, scope discipline).

## CONTEXT (RCAF)

Prior iterations:
- Iter 1 (correctness): 1 P0 + 1 P1 + 1 P2 (V2EnforcementMode drift, dead code, silent default)
- Iter 2 (security): 1 P2
- Iter 3 (traceability): 0 findings, PASS

Running totals: P0=1 P1=1 P2=2

Review Iteration: 4 of 10
Dimension: maintainability
Review Target: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity
Prior Findings: P0=1 P1=1 P2=2

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). `deep-review-strategy.md` for exhausted approaches.
2. **Read top changed code surfaces for maintainability concerns** (2-3 tool calls):
   - `post-dispatch-validate.ts` (validator v2 branch): look for dead code, magic numbers without constants, comments that contradict code, unused imports, type definitions out of sync with implementation (already found by iter 1 — verify no other instances).
   - `reduce-state.cjs` (reducer registry): look for TODO/FIXME, copy-pasted blocks, inconsistent naming between v1 and v2 fields, dashboard rendering with shell-injection-style string concat.
   - `deep_start-review-loop_auto.yaml` (workflow): look for orphaned step names, unused outputs, inconsistent indentation, prose that contradicts logic.
3. **Check new manual_testing_playbook scenarios** (1 tool call). Read 1-2 of `08--review-depth-v2-rollout/*.md`. Look for:
   - Consistent SOURCE_METADATA structure
   - References that point to real files/anchors
   - Naming conventions matching surrounding files
4. **Check spec docs maintainability** (1 tool call). Read parent `116-deep-review-complexity/spec.md`. Look for:
   - Status field accurate (says "Complete; 8/8 children shipped" — verify)
   - Open questions cleared
   - Stale blocker lines
5. **Write iteration narrative** (1 tool call) to `iterations/iteration-004.md`. Standard sections. **MUST end with `Review verdict: PASS|CONDITIONAL|FAIL` as the absolute final line** (no trailing whitespace, no following blank lines).
6. **Append state.jsonl + write delta** (2 tool calls).

**VERDICT MAPPING (strict)**: PASS only if 0 P0 AND 0 P1; CONDITIONAL if any P1 but no P0; FAIL if any P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-004.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-004.jsonl`

## OUTPUT CONTRACT

JSONL iteration record (single line):

```json
{"type":"iteration","iteration":4,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields encouraged. `requiredBugClasses` for maintainability: `dead_code`, `naming_drift`, `comment_truth`, `todo_debt`, `scope_creep`.

## FORMAT (RCAF)

3 artifacts only. Final response: `ITER-4 DONE: <n> findings, verdict=<verdict>`. ≤10 min.
