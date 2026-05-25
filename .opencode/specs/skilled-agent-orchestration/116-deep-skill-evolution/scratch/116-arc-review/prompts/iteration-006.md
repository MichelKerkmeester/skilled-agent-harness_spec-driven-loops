DEEP-REVIEW

# Deep-Review Iteration 6 / 10 — Security (Round 2, Hotspot Focus)

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iter 6/10. Round 2 of security. Look at second-order security risks — beyond input validation.

## CONTEXT (RCAF)

Iter 1: 1 P0 + 1 P1 + 1 P2 (correctness — V2 enforcement drift).
Iter 2 (security round 1): 1 P2.
Iter 3 (traceability): 0.
Iter 4 (maintainability): 0.
Iter 5 (correctness deep): see latest state.

Running totals as of iter 5 reduce: check `deep-review-state.jsonl` for current.

Review Iteration: 6 of 10
Dimension: security (round 2 — second-order risks)

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). Strategy + state.jsonl for prior findings AND exhausted approaches.
2. **Second-order security surfaces** (3 tool calls):
   - **Reducer registry output** (1 call). Read `reduce-state.cjs` dashboard rendering paths. Does dashboard markdown escape user-controlled fields like finding `title`, `evidenceRefs`, `bugClass`? Can a malicious iteration write inject markdown that breaks the report?
   - **Workflow YAML interpolation** (1 call). Read `deep_start-review-loop_auto.yaml` for any `{searchLedger}`, `{candidateCoverage}`, `{findingDetails}` interpolations that might end up in shell commands.
   - **Path handling in iteration writer** (1 call). Verify iteration narrative paths (`iterations/iteration-NNN.md`) and delta paths (`deltas/iter-NNN.jsonl`) are computed safely — no symlink-following, no path traversal via `iteration` field.
3. **Permission/sandbox concerns** (1 call). The recent dispatch shape used `--permission-mode dangerous` which auto-approves all tools. Is there documentation in the playbook scenarios warning operators about dangerous mode? Or do scenarios silently encourage it?
4. **Write iteration narrative** (1 tool call) to `iterations/iteration-006.md`. Final line: `Review verdict: PASS|CONDITIONAL|FAIL`.
5. **Append state.jsonl + write delta** (2 tool calls).

**VERDICT MAPPING (strict)**: PASS only if 0 P0 AND 0 P1 in THIS iter; CONDITIONAL if any P1 (no P0); FAIL if any P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-006.md`, `deltas/iter-006.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-006.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-006.jsonl`

## OUTPUT CONTRACT

```json
{"type":"iteration","iteration":6,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"security-deep","dimensions":["security"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields with `requiredBugClasses`: `markdown_injection`, `yaml_shell_interpolation`, `path_traversal`, `permission_warning_drift`.

## FORMAT (RCAF)

3 artifacts. Final response: `ITER-6 DONE: <n> findings, verdict=<verdict>`. ≤10 min.
