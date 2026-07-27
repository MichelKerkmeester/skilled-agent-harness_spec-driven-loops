DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 of 5 — Correctness

This is a non-interactive LEAF review iteration. Gate 3 is pre-resolved. Do not ask questions and do not dispatch sub-agents.

Review target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
Dimension: `correctness`
Stop policy: `max-iterations`; convergence is telemetry until iteration 5.

Read before reviewing:

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-config.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-findings-registry.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-strategy.md`

Focus on the executable truth of the four-mode registry, three-command surface, `VISUAL_SYSTEM`/`visual-system` reachability, router/default behavior, and claims that retired audit/foundations identities have no live consumer. Verify findings with cited `file:line` evidence. Graph data is unavailable; use direct reads, exact searches, producer/consumer tracing, and test inspection as the v2 graphless fallback.

The reviewed target is read-only. The only allowed writes are:

- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/iterations/iteration-001.md`
- append one canonical iteration record to `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deltas/iter-001.jsonl`
- in-place update of `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-strategy.md`

Produce all three iteration artifacts. The canonical record must use `"type":"iteration"`, `"iteration":1`, `"run":1`, `"mode":"review"`, `"target_agent":"deep-review"`, `"agent_definition_loaded":true`, `"resolved_route":"Resolved route: mode=review target_agent=deep-review"`, sessionId `fanout-sol-1785128932566-ou7z2l`, generation `1`, lineageMode `"new"`, plus all required v1 fields and v2 search-depth fields for a non-trivial scope. Every P0/P1 needs the typed claim-adjudication packet. Every finding needs severity, category, file:line evidence, finding_class, and content_hash. The delta file must contain the same iteration record and structured per-event rows.

The narrative must end with exactly one absolute final line:

`Review verdict: PASS`

or `Review verdict: CONDITIONAL` or `Review verdict: FAIL`, following the severity mapping.
