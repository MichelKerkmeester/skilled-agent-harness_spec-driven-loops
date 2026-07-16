DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 1

STATE SUMMARY:
Iteration: 1 of 10
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0/4
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Provisional Verdict: PENDING

Review Target: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report`
Review Scope: the 45 files in `deep-review-config.json.reviewScopeFiles`

State files:
- Config: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-config.json`
- State: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-strategy.md`
- Narrative output: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/iterations/iteration-001.md`
- Delta output: `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deltas/iter-001.jsonl`

Focus on renderer correctness, fluid CSS behavior assumptions, fallback behavior, and whether the regression test proves the packet's stated behavior. Read `.opencode/skills/sk-code/code-review/references/review_core.md` before severity calls. Every finding needs file:line evidence, findingClass, scopeProof, affectedSurfaceHints, and content_hash. Every new P0/P1 needs a typed claim-adjudication packet.

You are a LEAF agent. Do not dispatch sub-agents. Target files are read-only. Do not implement fixes.

ALLOWED WRITE PATHS:
- `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/iterations/iteration-001.md`
- `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-state.jsonl` (append only)
- `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deltas/iter-001.jsonl`
- `.opencode/specs/sk-doc/033-create-diff-mode/010-fluid-responsive-report/review/lineages/sol/deep-review-strategy.md` (targeted edits only)

BANNED OPERATIONS: Any write outside the four paths above; `rm`, `mv`, `git rm`, destructive Git, target-file edits, config/registry/dashboard/report edits, and nested dispatch.

The narrative must end with exactly one final line: `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL`. The state and delta iteration record must use `type:"iteration"`, iteration 1, mode `review`, target_agent `deep-review`, agent_definition_loaded true, resolved_route `Resolved route: mode=review target_agent=deep-review`, sessionId `fanout-sol-1784207165086-152crx`, generation 1, lineageMode `new`, and all required fields from the prompt-pack contract.
