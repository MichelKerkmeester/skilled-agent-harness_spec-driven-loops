DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0/4
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: correctness
Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization
Review Scope Files: use `deep-review-config.json.reviewScopeFiles`; prioritize the parent lean trio and all ten child `spec.md`, `checklist.md`, and `implementation-summary.md` files.
Prior Findings: P0=0 P1=0 P2=0

## PIVOT LINEAGE
none yet

Swept or saturated review directions that MUST NOT be re-entered: none

## SHARED DOCTRINE
Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW ASSIGNMENT
Perform one correctness inventory pass. Reconcile parent lifecycle/status claims, child lifecycle/status claims, checked checklist evidence, and current sk-design contract reality. Seek counterevidence before recording findings. Do not broaden into implementation or style-corpus content review.

## TRACEABILITY PROTOCOLS
- Core: spec_code, checklist_evidence
- Overlay: feature_catalog_code, playbook_capability

## STATE FILES
- Config: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/iterations/iteration-001.md`
- Write per-iteration delta to: `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-a/deltas/iter-001.jsonl`

## CONSTRAINTS
- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls, soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files or implement fixes.
- ALLOWED WRITE PATHS: only the iteration narrative, append-only state log, iteration delta, and in-place strategy file listed above.
- BANNED OPERATIONS: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and writes outside the four allowed paths.
- The repository is heavily dirty from concurrent work. Treat unrelated changes as read-only evidence and never alter them.
- The code-graph seed/convergence scripts are intentionally not invoked because this detached lineage is forbidden to write outside its artifact directory. Use graphless fallback evidence through direct reads and exact searches.

## OUTPUT CONTRACT
Produce exactly three iteration artifacts and update strategy:
1. Narrative markdown ending with exactly `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL` as the absolute final line.
2. Append one canonical single-line JSON record with `"type":"iteration"` to the state log. Include route-proof fields, sessionId `fanout-sol-a-1784385520599-ecg4bg`, generation 1, review-depth-v2 graphless fallback fields, finding details with `content_hash`, and claim-adjudication packets for every P0/P1.
3. Write the same iteration record plus structured finding/ruled-out rows to the delta JSONL.
4. Update strategy coverage and next focus to security.

Do not print findings only to chat; all durable output must land in the listed files.
