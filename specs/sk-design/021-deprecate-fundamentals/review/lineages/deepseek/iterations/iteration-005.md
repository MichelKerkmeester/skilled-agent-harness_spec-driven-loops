# Deep Review Iteration 5: Cross-Cutting Close-Out

## Dimension

Maintainability and traceability close-out. Scope: re-check the active P1, confirm each earlier
finding still stands, and audit the last two reach surfaces the operator named: the visual-review
load set and the hub canary that is supposed to protect the new vocabulary.

## Review Focus Addressed

Operator focus, final pass over all five named concerns: correctness, lost guidance, dangling
references to fundamentals, routing reach and doc accuracy. This iteration replays the failing
route, maps the visual-review load set against the checks it contains, and confirms that the new
vocabulary has regression coverage in the hub canary.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:105-130`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md:474-590`
- `.skilled/skills/sk-code/hub-router.json:90`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:180-210`
- `specs/sk-design/021-deprecate-fundamentals/review/lineages/deepseek/deep-review-findings-registry.json`
- `specs/sk-design/021-deprecate-fundamentals/review/lineages/deepseek/steer.md` (absent)

Command evidence used:

- `compiled-route --hub sk-code` for "design review", "review this design", "make this ui look
  designed", "visual hierarchy is flat" and "the page looks amateur"
- `grep -n 'WEB_VISUAL_HIERARCHY' -A6 ROUTER.md` (three-file load set)
- `grep -n 'web-accessibility-patterns.md#a' web-visual-hierarchy.md` (seven A-anchor links)
- `python3` count of the sk-code canary cases and their expected modes (9 cases; the frontend case
  is `surface-bundle-frontend` with the pre-existing CASCADE prompt)
- a read of the reducer registry after iteration 4 (7 open findings, 0 resolved)

## Findings by Severity

### P0 Findings

None. The adversarial replay re-ran the failing route for R1-P1-001; it fails the same way, and
it is a routing-reach defect, not a blocker with destructive or security impact.

### P1 Findings

None new. R1-P1-001 remains active: "design review" and "review this design" still resolve to
`sk-code-review` alone, while "make this ui look designed" and "visual hierarchy is flat" reach
`sk-code-frontend`. The boundary is the review-class keyword, not the visual vocabulary as a whole.

### P2 Findings

8. **The visual-review intent does not load the accessibility reference it cites** -- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:112` -- `WEB_VISUAL_HIERARCHY` resolves `frontend-practice.md`, `web-visual-hierarchy.md` and `web-visual-values.md`. The loaded review pass at `web-visual-hierarchy.md:474-590` sends the reviewer to `web-accessibility-patterns.md` for A2 (accessible name), A3 (roving tabindex), A5 (focus-visible), A8 (forced colors), A13 (menu button), A14 (tooltip) and A17 (error summary), and the ROUTER's own rule says a row loads what it resolves and nothing more.
   Case: an agent follows the documented load set for a visual-review request and reports a focus
   finding without A8's forced-colors rule, or an icon-button finding without A2's name order.
   The checks are named in the table, but the criterion each finding must cite lives in a file the
   intent did not load.
   Finding class: class-of-bug
   Scope proof: the three-file map is the only stage-two row for this intent; the seven A-anchors
   are the only external references in the review pass, and `web-accessibility-patterns.md` is not
   in the map. The A11Y intent loads the file, so the split is intentional there, not accidental.
   Affected surface hints: ["sk-code-frontend ROUTER", "web-visual-hierarchy review pass", "web-accessibility-patterns"]
   Recommendation: add `references/web-accessibility-patterns.md` to the `WEB_VISUAL_HIERARCHY`
   load set, or state in the review pass that the A-anchors are follow-on reads outside the intent.

9. **The hub canary never exercises the new visual vocabulary** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:190` -- The sk-code canary has nine cases. Its only frontend bundle case is `surface-bundle-frontend` with the pre-existing prompt "review my css cascade layers change". None of the 75 new `code-frontend-visual` phrases appears in the fixture, so the regression harness cannot catch the failure in finding 1 or a future tie-break that drops the new class.
   Case: a later edit removes "what padding should this have" from `code-frontend-visual` or
   reorders the tie-break. The canary suite still passes, and the only failing check is the
   operator-facing playbook scenario, which covers one intent and is not the hub's route gold.
   Finding class: class-of-bug
   Scope proof: parsed all nine canary cases; none of their prompts contains a `code-frontend-visual`
   keyword, and the new class has no case id. The surface-hint unit test covers a different phrase
   family ("css cascade layers").
   Affected surface hints: ["sk-code canary", "compiled-route regression", "code-frontend-visual"]
   Recommendation: add one canary per new intent (values, hierarchy, motion), including the
   "design review" phrase that currently fails.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | All structural claims hold except the routing handoff; R1-P1-001 is active. |
| `checklist_evidence` | core | partial | All rows are `Met`; two recording defects remain (R2-P2-003, R2-P2-004). |
| `skill_agent` | overlay | pass | The five agent mirrors name the new references; no capability grant changed. |
| `agent_cross_runtime` | overlay | pass | Canonical and mirrors agree on the decide path. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry changed. |
| `playbook_capability` | overlay | pass | The visual-values scenario replays; its 5/5 suite result stands. |

## Adversarial P0/P1 Replay

- R1-P1-001: re-ran `compiled-route --hub sk-code --prompt "design review"` and
  `--prompt "review this design"`. Both return `route single [sk-code-review]`. Confirmed active.
  The alternative explanation (the review workflow loads the frontend guidance itself) is still
  unsupported: `sk-code-review`'s packet is a review-cache workflow, and the surface is only
  bundled when the hub decision names it.
- No P0 candidate exists, so no Hunter/Skeptic/Referee promotion is needed this iteration.
- No finding was downgraded or marked false positive.

## Edge Cases

- The `WEB_VISUAL_HIERARCHY` accessibility gap is not a lost rule: the checks are inline and the
  linked file exists. It is a load-set mismatch, so the finding stays P2.
- The canary gap is a coverage finding, not a production failure. It becomes material only when
  combined with a routing regression, which is exactly what finding 1 shows.
- One prompt, "review this screen", still bundles the frontend surface correctly. The failure is
  specific to phrases that contain the review-class signal and no other bundle key.

## Confirmed-Clean Surfaces

- The registry after iteration 4 holds 7 open findings, 0 resolved, with the expected severity
  split P0=0, P1=1, P2=6.
- Every iteration file 1-4 is present and its final line is one of the three legal verdicts.
- The new references' item ranges are complete; the moved token file has no external dependency.
- `steer.md` was absent at every read, so no lead ruling changed this lineage's direction.

## Ruled Out

- **A second active P1 hiding in the load-set or canary findings.** Ruled out: both are coverage
  mismatches with no prompt that produces a wrong route beyond R1-P1-001.
- **A stale chart citation.** Ruled out in iterations 2 and 3; the remaining "research" hits are
  records.
- **A fundamentals path in any live doc.** Ruled out in iteration 1; the only hits are records and
  generated retrieval data.

## Next Focus

None. The stop policy is `max-iterations` and iteration 5 of 5 is complete. Synthesis compiles the
report with the active registry: P0=0, P1=1, P2=8, verdict CONDITIONAL, stopReason
`maxIterationsReached`.

Review verdict: CONDITIONAL
