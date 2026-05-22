DEEP-REVIEW

# Deep-Review Iteration 1 / 10 — Correctness

## ROLE (RCAF for SWE-1.6)

You are a deep-review LEAF agent performing the FIRST iteration of a 10-iteration audit on the `116-deep-review-complexity` arc. Focus this iteration on **correctness**.

## CONTEXT (RCAF)

The arc just shipped (10 commits ending `e2cc6d238f`) a v2 review-depth contract: `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, `searchLedger`, new STOP gates (`candidateCoverageGate`, `graphlessFallbackGate`), graph vocabulary extension (`BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`), and a manual testing playbook category 08--. This deep-review session is dogfooding the new logic on the very arc that shipped it.

Review Iteration: 1 of 10
Mode: review
Dimension: correctness
Review Target: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity
Prior Findings: P0=0 P1=0 P2=0 (first iteration; no prior state)

## ACTION (RCAF — 7 ordered steps with acceptance criteria)

1. **Read state files first** (target: 2 tool calls). Read `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md` for context. Acceptance: you know the dimension rotation plan and the file targets.
2. **Read the validator surface** (1 tool call). Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`. Acceptance: you understand the v2 enforcement branches, the 5 v2 failure codes, and the warn/strict/off rollout flag handling.
3. **Read the reducer surface** (1 tool call). Read `.opencode/skills/deep-review/scripts/reduce-state.cjs` from around the registry-return shape (lines 900-1100 area) and the dashboard-verdict logic. Acceptance: you know how `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage` are computed and rendered.
4. **Spot-check correctness issues** (2-3 tool calls). For each of these specific risks, grep/read to confirm or rule out:
   - `DEEP_REVIEW_V2_ENFORCEMENT` env var: is the value-set `warn|strict|off` enforced anywhere, or accepted naively?
   - v2 strict validation: does the `linkedFindingId` check use deep equality against `findingDetails[].id`, or just truthy check?
   - Reducer's `searchDebt` aggregation: does it accumulate across iterations, or only show the latest iter?
   - State/delta identity check: does `state_delta_iteration_mismatch` actually compare iteration numbers, or only file presence?
5. **Write iteration narrative** (1 tool call) to `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-001.md`. Required structure:
   - `## Dimension` → `correctness`
   - `## Files Reviewed` → list of paths with line ranges
   - `## Findings by Severity` → ### P0 / ### P1 / ### P2 sections, each finding includes claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger
   - `## Traceability Checks` → spec_code, checklist_evidence outcomes
   - `## Verdict` → PASS | CONDITIONAL | FAIL
   - `## Next Dimension` → security (iter 2)
   - Final line MUST be exactly: `Review verdict: PASS` or `Review verdict: CONDITIONAL` or `Review verdict: FAIL`
6. **Append JSONL iteration record** to `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`. Required single-line JSON, type=`iteration`, full required schema per OUTPUT CONTRACT below. Use shell: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`.
7. **Write per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-001.jsonl`. Same iteration record on line 1, plus one structured record per finding (`{"type":"finding",...}`) on subsequent lines.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` only if needed for severity calibration on edge cases.

## REVIEW DIMENSIONS (4 total; this iter = correctness)

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence (every finding has file:line), scope (within 116 arc), coverage (correctness fully reviewed in this iter)

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.
- FAIL: any P0 confirmed after adversarial recheck.
- CONDITIONAL: any P1, no P0.
- PASS: no P0 or P1 (P2 = advisory only).

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/findings-registry.json` (will be auto-generated by reducer)
- Strategy: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/iterations/iteration-001.md`
  - `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`
  - `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deltas/iter-001.jsonl`
  - `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-strategy.md` (in-place updates only)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate against any file not in the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative under a `## SCOPE VIOLATIONS` heading.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at the iteration path above (non-empty, well-formed sections, ends with the verdict line).

2. **Canonical JSONL iteration record** APPENDED to the state log. Required single-line JSON schema:

```json
{"type":"iteration","iteration":1,"mode":"review","run":"116-deep-review-dogfood-2026-05-22","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path:line",...],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"116-deep-review-dogfood-2026-05-22","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via shell: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-state.jsonl`

3. **Per-iteration delta file** at the delta path above. Same iteration record on line 1, then one `{"type":"finding",...}` line per finding (with id, severity, cluster, file, title, iteration).

### v2 Search Depth Output (OPTIONAL but encouraged for dogfooding)

If this iteration's scope is non-trivial (it is — the 116 arc is multi-file), set `"reviewDepthSchemaVersion":2` on the same iteration JSONL record and include these v2 fields in addition to v1 fields above:

- `reviewDepthApplicability`: `{scopeClass:"standard"|"complex",enforcement:"warn"|"strict",reason,evidenceRefs}`
- `targetSelection`: `{selectedTargets,selectionReason,discoveryMethods,omittedHighRiskTargets,graphStatus,semanticSearchStatus,evidenceRefs}`
- `searchCoverage`: `{requiredBugClasses,covered,ruledOut,deferred,blocked,graphCoverageMode}` with `graphCoverageMode:"graphless_fallback"` (mk_code_index MCP is disconnected this session)
- `searchLedger[]`: rows with `{id,dimension,targetRefs,bugClass,hypothesis|invariant,searchActions:[{method,queryOrPath,result,evidenceRefs}],disposition,rationale,linkage}` — at least one row per requiredBugClass
- Disposition values: `finding | ruled_out | deferred | blocked | not_applicable`
- Disposition linkage: exactly one of `linkedFindingId`, `ruledOutReason`, `deferredReason`, `blockedReason`, `notApplicableReason`

Dogfooding goal: emit v2 fields so the reducer can exercise its new search-debt aggregation.

## FORMAT (RCAF)

Output: only the 3 artifacts. No prose summary in your final response (your file writes are the answer). After Step 7, print one line: `ITER-1 DONE: <n> findings, verdict=<verdict>` and exit.

Time budget: ≤10 minutes wall-clock.
