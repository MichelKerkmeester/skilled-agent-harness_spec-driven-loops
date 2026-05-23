DEEP-REVIEW

# Deep-Review Iteration 8 / 10 — Maintainability (Round 2, Sustainability)

## ROLE (RCAF for SWE-1.6)

Deep-review LEAF agent, iter 8/10. Round 2 of maintainability. Focus on long-term sustainability concerns the first pass might miss.

## CONTEXT (RCAF)

Prior totals: see state.jsonl. Iter 4 (maintainability round 1) was 0 findings — Round 2 must look elsewhere.

Review Iteration: 8 of 10
Dimension: maintainability (sustainability lens)

## ACTION (RCAF — ordered steps)

1. **Read state** (1 tool call). Strategy + state.jsonl.
2. **Sustainability concerns** (3 tool calls):
   - **Documentation drift indicators** (1 call). Grep for "TODO", "FIXME", "XXX", "HACK" across the changed surfaces (`.opencode/skills/deep-review/`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_*.yaml`). Note any newly-added markers from the 116 arc that aren't tracked in a follow-on packet.
   - **Future maintainer ergonomics** (1 call). Read `deep-review/references/state_format.md` v2 section. Does it have a "When to upgrade legacy records" runbook? A migration path for v1 → v2 records that already exist? Or is upgrade left to operators to figure out?
   - **Test coverage debt** (1 call). The 5 `it.todo` markers in the Phase B fixtures — does any of them have an issue or follow-on packet reference? Or is the debt orphaned?
3. **Naming + invariant durability** (1 call). Read the new playbook scenarios (`08--review-depth-v2-rollout/`). Do they cite specific symbol names that, if renamed, would break the scenario? Are renames foreseeable?
4. **Write iteration narrative** to `iterations/iteration-008.md`. Final line: `Review verdict: ...`.
5. **Append state.jsonl + write delta** (2 tool calls).

**VERDICT MAPPING**: PASS if 0 P0 AND 0 P1; CONDITIONAL if any P1; FAIL if any P0.

## CONSTRAINTS

LEAF only. Target 9 tool calls, hard max 13. READ-ONLY target.

Allowed writes: `iterations/iteration-008.md`, `deltas/iter-008.jsonl`, `deep-review-state.jsonl`, `deep-review-strategy.md`.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-008.md`
- Delta file: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-008.jsonl`

## OUTPUT CONTRACT

```json
{"type":"iteration","iteration":8,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"maintainability-sustainability","dimensions":["maintainability"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

v2 fields with `requiredBugClasses`: `todo_debt`, `migration_runbook_gap`, `test_debt_orphaned`, `playbook_symbol_brittleness`.

## FORMAT (RCAF)

3 artifacts. Final response: `ITER-8 DONE: <n> findings, verdict=<verdict>`. ≤10 min.
