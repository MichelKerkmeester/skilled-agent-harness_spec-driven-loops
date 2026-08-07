DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — Iteration 1 (INVENTORY PASS)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 50
Dimension: inventory (artifact map + cross-reference baseline)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0.0)
Traceability: core=pending overlay=pending
resource-map.md not present; skipping coverage gate
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 50
Mode: review
Dimension: inventory (artifact map + cross-reference baseline)
Review Target: .opencode/specs/deep-loops/030-agent-loops-improved (phase-parent spec-folder)
Review Scope Files: see deep-review-strategy.md §15 FILES UNDER REVIEW (owned surfaces: deep-loop-runtime lib+scripts, deep-loop-workflows mode scripts, commands/deep + commands/speckit, .opencode/agents/*, mk-goal.js, goal.md)
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-config.json
- State Log: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-state.jsonl
- Findings Registry: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-findings-registry.json
- Strategy: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deltas/iter-001.jsonl

## ITERATION 1 MISSION (INVENTORY PASS)

This is the iteration-0 inventory pass. Do NOT attempt exhaustive deep findings. Your goals this iteration:
1. Build an artifact map of the owned implementation surfaces (list the key files per surface from strategy §15, classify by type: cjs/ts/js code, md contract, yaml/txt asset).
2. Establish the cross-reference baseline: map how commands ↔ YAML assets ↔ agents ↔ skills/scripts are wired (e.g. deep_review_auto.yaml references @deep-review agent and reduce-state.cjs). Record concrete wiring observations with file:line.
3. Identify HOTSPOTS and high-complexity files likely to yield correctness/security findings in later iterations (e.g. executor dispatch/CLI shelling, path/artifact resolution, atomic-state/JSONL writers, fanout-pool concurrency, loop-lock, mk-goal.js plugin). Note them for the dimension queue.
4. Record structural observations and any obvious P0/P1 you happen to confirm with file:line, but the emphasis is inventory + baseline, not depth.
5. Set Next Focus = D1 Correctness over the deep-loop-runtime core (lib/deep-loop + lib/council + lib/coverage-graph).

Dimension coverage this iteration: NONE marked complete (inventory is not a dimension). Record status="insight" or "complete" with newFindingsRatio reflecting any findings emitted.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents. If asked to spawn, emit: `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`
- Emit setup BINDING lines first (grep-checkable):
  BINDING: target=.opencode/specs/deep-loops/030-agent-loops-improved
  BINDING: maxIterations=50
  BINDING: convergence=0.01
  BINDING: mode=review
  BINDING: dimensions=correctness,security,traceability,maintainability
  BINDING: specFolder=.opencode/specs/deep-loops/030-agent-loops-improved
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files (skills, commands, agents, source, mk-goal.js).
- Do not implement fixes during review.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/iterations/iteration-001.md`
  - `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deltas/iter-001.jsonl`
  - `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-strategy.md` (in-place section updates only)
  - `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell truncate `>` against any file not in the allowed-write list. Reading is unrestricted; writing/renaming/deleting are scoped to the allowed list above.
- **SCOPE VIOLATION PROTOCOL**: if a planned action would modify any path NOT in the allowed-write list, STOP and emit a finding under a `## SCOPE VIOLATIONS` heading instead. NEVER execute the out-of-scope mutation.

## OUTPUT CONTRACT

Produce THREE artifacts (missing/malformed → schema_mismatch conflict event):

1. **Iteration narrative** at the iteration-001.md path. Sections: Dimension, Files Reviewed, Findings - New (P0/P1/P2 subsections), Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus. Each finding: `N. **Title** -- file:line -- Description` plus `Finding class:`, `Scope proof:`, `Affected surface hints:`. P0/P1 include a claim-adjudication JSON block. **Final line MUST be exactly**: `Review verdict: PASS` (or CONDITIONAL / FAIL).

2. **Canonical JSONL record** APPENDED to the state log. MUST use `"type":"iteration"` exactly. Include: iteration, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary{P0,P1,P2}, findingsNew, findingDetails[], traceabilityChecks, newFindingsRatio, noveltyJustification, sessionId="2026-06-30T08:01:03Z", generation=1, lineageMode="new", timestamp, durationMs, ruledOut, budgetProfile, edgeCases, optional graphEvents. Single-line JSON + newline. If newFindingsRatio is 0.0 set ratio 0.0; any new P0 → ratio >= 0.50.

3. **Delta file** at deltas/iter-001.jsonl: the same `{"type":"iteration",...}` record on line 1, plus one structured record per finding/graphEvent/ruled_out, each on its own line.

All three are REQUIRED. Return a concise completion report: focus, findings counts, newFindingsRatio, dimension status, recommended next focus, files written, status.
