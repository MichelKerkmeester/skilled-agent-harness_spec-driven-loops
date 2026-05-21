DEEP-REVIEW

# Deep-Review Iteration 6 — Adversarial Recheck + Convergence

## STATE

STATE SUMMARY (auto-generated):
Iteration: 6 of 20
Dimension: adversarial_recheck (cross-dimensional stabilization)
Prior Findings: P0=0 P1=4 P2=6
  DR-002-P1-001 PROMOTE default doesn't reach runtime
  DR-002-P1-002 cocoindex MCP doesn't auto-spawn sidecar
  DR-003-P1-001 localhost sidecar lacks identity/auth
  DR-003-P1-002 /rerank lacks payload bounds
  DR-002-P2-001 REQ-006 wording vs D-004
  DR-003-P2-001 sidecar child inherits full env
  DR-004-P2-001 task ledger drift
  DR-004-P2-002 system-rerank-sidecar SKILL.md stale CocoIndex text
  DR-005-P2-001 httpx is hidden mcp-coco-index dependency
  DR-005-P2-002 sidecar catalog/playbook diverge from sk-doc split
Dimension Coverage: [inventory, correctness, security, traceability, maintainability] (4/4 done)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last 2 ratios: iter-004=0.X (2 new P2) -> iter-005=0.08 (2 new P2)
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 6 of 20
Mode: review
Dimension: adversarial_recheck
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=4 P2=6

## CONVERGENCE CONTEXT

All four dimensions are covered. The convergence ratio in iter-005 was 0.08 (below the 0.10 threshold). This iteration is the stabilization pass: replay each active P1/P2 through an adversarial lens, confirm or downgrade, and look once more for missed P0/P1 across the entire scope before declaring convergence.

If this iteration produces ZERO new P0/P1 and ZERO new high-confidence P2, weighted_stop_score should pass 0.60, all binary gates pass (evidence: every active P0/P1 has file:line — they do; scope: all findings within target — they are; coverage: all 4 dimensions reviewed — they are), and the loop will terminate at the synthesis phase.

## PRIOR CONTEXT

Read these first:

- Iteration 5 narrative: review/iterations/iteration-005.md (maintainability — 2 new P2)
- Iteration 4 narrative: review/iterations/iteration-004.md (traceability — 2 new P2)
- Iteration 3 narrative: review/iterations/iteration-003.md (security — 2 new P1 + 1 P2)
- Iteration 2 narrative: review/iterations/iteration-002.md (correctness — 2 new P1 + 1 P2)
- Iteration 1 narrative: review/iterations/iteration-001.md (inventory)
- Strategy: review/deep-review-strategy.md
- Findings registry: review/deep-review-findings-registry.json
- State log: review/deep-review-state.jsonl

## SCOPE REMINDER

Two commits shipped:
1. `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
2. `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook

Files under review: see config.reviewScopeFiles or strategy §15.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS + GATES

Dimensions: correctness, security, traceability, maintainability.
Quality gates: evidence (file:line), scope (within review_scope_files), coverage (all dimensions touched before STOP).
Verdicts: FAIL (any P0) | CONDITIONAL (any P1, no P0) | PASS (no P0/P1; hasAdvisories=true if active P2 exist).

## ASSIGNED FOCUS — ADVERSARIAL RECHECK

Adopt a hostile/skeptical posture and challenge every active finding. For each, verify:

1. **DR-002-P1-001** PROMOTE default doesn't reach runtime
   - Re-open `reranker.py:24-30` and `config.py:770` and trace the env-var path
   - Is the finding correct? Could a launcher/daemon export the env from Config before dispatch?
   - Verify the test `test_dispatch_off_by_default` actually codifies the bug

2. **DR-002-P1-002** cocoindex MCP doesn't auto-spawn sidecar
   - Re-open `cli.py:139-158` and `ensure_rerank_sidecar.py:80-128`
   - Is `skip_if_disabled=True` actually the runtime default? Any other code path that bypasses?

3. **DR-003-P1-001** localhost sidecar lacks identity/auth
   - Re-confirm bind interface in `start.sh:14-25`
   - Is the multi-user attack vector real on this codebase's deployment target? Per the prompt, this codebase is solo-Mac per memory rule. If solo-Mac is the only supported deployment, downgrade to P2 with `downgradeTrigger=true`.

4. **DR-003-P1-002** /rerank lacks payload bounds
   - Same question — solo-Mac deployment context. If solo-Mac, the attack vector requires the user attacking themselves. Downgrade to P2?

5. **DR-002-P2-001 / DR-003-P2-001 / DR-004-P2-001 / DR-004-P2-002 / DR-005-P2-001 / DR-005-P2-002** — confirm each P2 is real and not a duplicate of another finding.

6. **Look once more for any missed P0/P1** across the full scope. Specifically:
   - Any uncaught exception, edge case, or contract violation in `reranker.py` not covered by the 9 tests?
   - Any secret leak in `cli.py` or `config.py` that wasn't flagged in iter-003?
   - Any spec requirement (REQ-001..REQ-010) that has no test coverage at all?
   - Any benchmark/decision-rule edge case that could invalidate the PROMOTE verdict if revisited?

For findings:
- If a new P0/P1 surfaces, add it with full 7-field claim adjudication
- If an existing P1 should be downgraded to P2 given the solo-Mac deployment context, document the downgrade in the finding registry update (status: "downgraded")
- If a finding is a duplicate, mark it duplicate

## OUTPUT CONTRACT

Same as prior iterations. Three artifacts:

1. `<review-packet>/iterations/iteration-006.md` with final line `Review verdict: PASS|CONDITIONAL|FAIL|PENDING`.
2. Append `"type":"iteration"` record to `<review-packet>/deep-review-state.jsonl`.
3. `<review-packet>/deltas/iter-006.jsonl` with at least one iteration record + finding records.

After completing:
- Update strategy.md (§6 mark adversarial_recheck or all-4-confirmed; §7 final findings; §12 NEXT FOCUS = synthesis if converged, or next dimension if more work needed)
- Update findings-registry.json (downgrade flags applied if any; convergenceScore approximated)

## CONSTRAINTS

- LEAF agent. Target 12 tool calls, soft max 18, hard max 24.
- Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, modifications to reviewed paths.
- ALLOWED writes: only inside `<review-packet>/`.
- newFindingsRatio: severity-weighted P0=10, P1=5, P2=1. If any new P0 → ratio = max(calc, 0.50). If 0 NEW findings → 0.0.

## SOLO-MAC DEPLOYMENT NOTE

This codebase is operated by a single user on a Mac (per the memory_match_triggers context). Cross-user attacks on localhost are not a realistic threat model for this deployment. Apply the same posture-downgrade rule used in 015 security sweep: solo-Mac deployment context means cross-user spoofing/DoS findings may be P2 (advisory) rather than P1 (required). Make the call explicitly in your recheck.
