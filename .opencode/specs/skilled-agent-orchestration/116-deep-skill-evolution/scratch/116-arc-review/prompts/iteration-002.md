DEEP-REVIEW

# Deep-Review Iteration 2 / 10 — Security

## ROLE (RCAF for SWE-1.6)

You are a deep-review LEAF agent performing the 2nd iteration of a 10-iteration audit on the `116-deep-review-complexity` arc. Focus this iteration on **security**.

## CONTEXT (RCAF)

The arc shipped a v2 review-depth contract. Iter 1 (correctness) found 3 issues:
- P0 finding-001: `V2EnforcementMode` type uses `'off'` while `V2_ENFORCEMENT_MODES` set includes `'skip'` — drift between type/set in `post-dispatch-validate.ts:153,156`
- P1 finding-002: dead failure code `state_delta_iteration_mismatch` declared but never emitted (uses `delta_iteration_id_mismatch`)
- P2 finding-003: `skip` env value silently defaults to `warn` without warning

Review Iteration: 2 of 10
Mode: review
Dimension: security
Review Target: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity
Prior Findings: P0=1 P1=1 P2=1

## ACTION (RCAF — 7 ordered steps with acceptance criteria)

1. **Read state** (2 tool calls). Read `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md` AND `.../deep-review-state.jsonl` to see prior iteration's findings. Acceptance: you know the security-relevant context and what NOT to retry.
2. **Read validator security surface** (1 tool call). Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` focusing on input validation: JSON parsing, evidenceRefs handling, env var validation, error message construction. Acceptance: you know where untrusted input enters and how it's validated.
3. **Read reducer security surface** (1 tool call). Read `.opencode/skills/deep-review/scripts/reduce-state.cjs` focusing on JSONL parsing, registry serialization, dashboard rendering. Acceptance: you know if untrusted iteration content can break registry output or inject markdown.
4. **Spot-check security risks** (2-3 tool calls):
   - **Path traversal**: do `evidenceRefs` strings accept `../`? Are they used as filesystem paths anywhere?
   - **JSONL injection**: can a malformed `findingDetails[]` entry crash the reducer or inject markdown into dashboard?
   - **Env var injection**: is `DEEP_REVIEW_V2_ENFORCEMENT` parsed safely (no shell exec on its value)?
   - **YAML workflow**: does `deep_start-review-loop_auto.yaml` interpolate any field as shell-safe? Search for `{evidenceRefs}` / `{searchLedger}` interpolations.
   - **Graph upsert**: does the new BUG_CLASS/INVARIANT/etc node-kind validation also sanitize `label` content?
5. **Write iteration narrative** (1 tool call) to `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-002.md`. Same structure as iter 1 (Dimension / Files Reviewed / Findings by Severity / Traceability Checks / Verdict / Next Dimension). Final line: `Review verdict: PASS|CONDITIONAL|FAIL`.

   **VERDICT MAPPING (correct version)**: PASS if 0 P0 AND 0 P1; CONDITIONAL if any P1 but no P0; **FAIL if any P0**. Apply correctly — iter 1's CONDITIONAL with a P0 was a meta-finding for the prompt template.

6. **Append JSONL iteration record** to `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`. Use shell `echo '<single-line-json>' >> ...`. Required fields per OUTPUT CONTRACT.
7. **Write per-iteration delta** at `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-002.jsonl`. Iteration record + one `{"type":"finding",...}` per finding.

## CONSTRAINTS (same as iter 1)

- LEAF only — no sub-dispatch
- Target 9 tool calls; hard max 13
- READ-ONLY on review target; allowed writes ONLY to iteration-002.md, iter-002.jsonl, deep-review-state.jsonl, strategy.md
- Sandbox scope violation protocol if any other write requested

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-002.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-002.jsonl`

## OUTPUT CONTRACT

Same as iter 1. v2 fields encouraged (`reviewDepthSchemaVersion:2`, applicability, targetSelection, searchCoverage, searchLedger). `graphCoverageMode:"graphless_fallback"`. `requiredBugClasses` per security domain (e.g. `path_traversal`, `injection`, `redaction`, `auth`).

JSONL iteration record schema (single line):

```json
{"type":"iteration","iteration":2,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

## FORMAT (RCAF)

Output: only the 3 artifacts. Final response prints one line: `ITER-2 DONE: <n> findings, verdict=<verdict>` and exits. Time budget ≤10 min.
