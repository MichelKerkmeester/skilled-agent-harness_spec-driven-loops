DEEP-REVIEW

# Deep-Review Iteration 5 — Maintainability Pass

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 20
Dimension: maintainability
Prior Findings: P0=0 P1=4 P2=4
  DR-002-P1-001 PROMOTE default doesn't reach runtime
  DR-002-P1-002 cocoindex MCP doesn't auto-spawn sidecar
  DR-003-P1-001 localhost sidecar lacks identity/auth
  DR-003-P1-002 /rerank lacks payload bounds
  DR-002-P2-001 REQ-006 wording vs D-004
  DR-003-P2-001 sidecar child inherits full env
  DR-004-P2-001 task ledger drift
  DR-004-P2-002 system-rerank-sidecar SKILL.md stale CocoIndex text
Dimension Coverage: [inventory, correctness, security, traceability] (3/4)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Last 2 ratios: iter-003=1.0 -> iter-004=compute (2 new P2 only)
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 5 of 20
Mode: review
Dimension: maintainability
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=4 P2=4

## PRIOR CONTEXT

Read these first:

- Iteration 4 narrative: review/iterations/iteration-004.md (traceability — 5 protocol fails, 2 new P2)
- Iteration 3 narrative: review/iterations/iteration-003.md (security — 2 new P1, 1 new P2)
- Iteration 2 narrative: review/iterations/iteration-002.md (correctness — 2 new P1, 1 new P2)
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

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every NEW P0/P1 finding must include the 7-field claim adjudication packet.

## ASSIGNED FOCUS — MAINTAINABILITY PASS

Audit code/doc maintainability. Open files and quote file:line evidence.

1. **Patterns + clarity** — `reranker.py:221-351` HttpSidecarRerankerAdapter:
   - Class structure: how does it compose with the existing `RerankerAdapter` interface? Is the fallback chain readable or buried in nested try/except?
   - `httpx.Client` lifecycle — cached correctly? Any leak risk if the adapter is garbage collected while a request is in flight?
   - Lazy `import httpx` — clarity vs cost tradeoff. Single canonical entry point?

2. **Dependency posture** — `pyproject.toml` / `requirements*.txt`:
   - Is `httpx` declared as a direct dep, or transitive (via FastAPI)?
   - If transitive: P2 ("hidden dependency")

3. **Documentation quality** — for each updated doc:
   - `INSTALL_GUIDE.md` (lines 352-367; 1086-1089): clear dispatch semantics? Cross-link to system-rerank-sidecar?
   - `SKILL.md` (lines 20-30, 261-277): default dispatch claim already P1-001
   - `feature_catalog.md` (294 lines, 11 sections): sk-doc template followed? Section ordering? Missing parts?
   - `manual_testing_playbook.md` (231 lines, 15 sections, 23 RS-NNN): scenario preconditions/expected/actual filled? Pass criteria clear?

4. **Fallback complexity** — `reranker.py:259-319`:
   - 5-mode fallback chain (sidecar_unavailable / sidecar_5xx / sidecar_<status> / sidecar_malformed / missing-index) — flat or nested?
   - Diagnostic field cardinality — each failure mode distinct?

5. **Test maintainability** — `test_http_sidecar_adapter.py`:
   - Mock helpers at lines 48-83 — reusable or duplicated across tests?
   - Test names — descriptive? Consistent with rest of suite?
   - Tests depending on private module attributes that could break on refactor?

6. **Follow-up clarity** — `implementation-summary.md:137-143` Known Limitations:
   - 5 limitations clearly actionable? Each names a follow-on packet?
   - "n=1 smoke benchmark" caveat — clear path to n=3 confirmation?
   - Baseline drift (30/73 → 15/73) — tracked to packet 007?

7. **Spec doc drift cost** — given P1-001/P1-002/P2-001/P2-002 findings, the spec/plan/tasks/implementation-summary are misaligned. How costly is reconciliation?

8. **Naming / consistency** — adapter naming, constructor signatures, dispatch routing readable?

9. **Plan.md staleness** — plan.md:54-124 adapter sketch; plan.md:195-205 PROMOTE/HOLD branch. Is plan still useful for future packets or stale?

For findings:
- P2 for doc drift, naming inconsistency, hidden dep, complex fallback that's still functional
- P1 only if maintainability actively hurts future change cost
- Skip P0 unless also a correctness/security bug

## OUTPUT CONTRACT

Same as prior iterations. Three artifacts:

1. `<review-packet>/iterations/iteration-005.md` with final line `Review verdict: PASS|CONDITIONAL|FAIL|PENDING`.
2. Append `"type":"iteration"` record to `<review-packet>/deep-review-state.jsonl`.
3. `<review-packet>/deltas/iter-005.jsonl` with at least one iteration record + one finding record per new finding.

After completing:
- Update strategy.md (§6 mark maintainability complete if confident; §7 findings totals; §12 NEXT FOCUS = adversarial-recheck or synthesis depending on convergence; §14/15 status)
- Update findings-registry.json (`dimensionCoverage.maintainability:true`)

## CONSTRAINTS

- LEAF agent. Target 12 tool calls, soft max 18, hard max 24.
- Read-only against reviewed source/tests/docs/specs.
- BANNED: rm, mv, sed -i, git, modifications to reviewed paths.
- ALLOWED writes: only inside `<review-packet>/`.
- newFindingsRatio: severity-weighted P0=10, P1=5, P2=1. If any new P0 → ratio = max(calc, 0.50). If 0 findings → 0.0.

## CONVERGENCE NOTE

After iter-005, all 4 dimensions will be covered. Convergence threshold = 0.10. If iter-004 ratio dropped low (only 2 P2 = ~0.4 weight ÷ all-finding weight) and iter-005 finds mostly P2-level maintainability items or fewer, weighted_stop_score should pass 0.60, and the loop will STOP at iter-006 (one stabilization pass). If you find significant new P1, the loop will continue.
