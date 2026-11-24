# Iteration 006: Correctness of the compiled-routing slice for the browser hub

## Dimension

correctness (D1) with a traceability re-check (D3), on the scope group no earlier pass had read: the compiled routing artefacts that put the hub's three-mode contract in front of the front door. Operator review focus continued: this is the surface a browser request actually crosses after the advisor names the hub, so it is part of "shipped work against goal criteria".

## Sources

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/{manifest.json,fence-state.json}`
- `.skilled/skills/mcp-browser-use/{hub-router.json,mode-registry.json}`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md`

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 8 read or grepped
- New findings: P0=0 P1=0 P2=0
- Refined findings: none
- New findings ratio: 0.0 (no new weighted units against a running total of 6 findings)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The active set is unchanged: `PI2-I2-P1-001` (P1), and `PI2-I1-P2-001`, `PI2-I1-P2-002`, `PI2-I3-P2-001`, `PI2-I4-P2-001` (P2).

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:98-109 | The compiled vocabulary is built from `hub-router.json` and fails closed on an unknown vocabulary class, so the hub's three-mode contract has one authored source. |
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:84 | Unchanged: AC-002 is the one row whose stated verification does not hold. |
| playbook_capability | pass | advisory | .skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md:1 | Stage two passes every row of the replay, including the one row stage one fails. |

Evidence gathered this iteration and holding:

- Canary coverage: the fixture holds 15 cases that reach every one of the hub's three modes (three Chrome DevTools, three Aside, two Bladebro), a two-mode ordered bundle, two defer cases (generic browser automation, hub identity), a caller-constraint reject, and two out-of-domain-shaped Chrome rows. `route`, `orderedBundle`, `defer` and `reject` are all exercised, so the compiled contract is not only tested on the happy path.
- Reject semantics: `router.cjs:107-110` takes a reject only from caller constraints and states that prompt text merely mentioning a word, such as a 403 Forbidden debugging task, stays routable. The `forbidden-reject` and `chrome-devtools-http-403-forbidden` cases test against each other, so the distinction is covered rather than assumed.
- Vocabulary resolution: `registry-compiler.cjs:98-109` resolves each `routerSignals[*].classes` entry through `vocabularyClasses` and calls `fail('VOCABULARY_CLASS_MISSING', ...)` when a class is unknown, and `fail('ROUTER_SIGNAL_MISSING', ...)` when a mode has no signal. A mistyped class therefore breaks the build instead of silently emptying a mode's vocabulary.
- Activation consistency: `013-live-activation/activation/mcp-browser-use/manifest.json` names `effectivePolicyHash` `be9b1fe7...` at generation 1, which is the same serving policy the 2026-11-24 replay records, so the activation artefact and the recorded replay agree.
- Policy card: `policy-card.cjs:31-37` marks every document-only route `PREPARED_DRAFT` with terminal `DOCUMENT_ONLY_UNATTESTED`, so a replayed card cannot claim a live browser effect.

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` and `.skilled/skills/mcp-browser-use/hub-router.json` are the two halves of stage two. The doc that describes them, `ROUTER.md`, is where iteration 4 found drift; the compiled path itself reads the authored JSON, so the drift is documentation-only, which is why it stayed at P2.

## Edge Cases

- The compiled slice cannot be executed here: the harness writes artefacts, and this lineage is write-bound to its own directory. The slice was therefore read as source plus fixtures, and the replay report supplied the one execution record.
- `chrome-devtools-har-export` still routes through the compiled vocabulary even though the advisor no longer keys on a bare `har`; that is by design, because the removal was a stage-one change and the vocabulary classes keep the HAR phrases for stage two. Read and confirmed rather than reported as a contradiction.

## Ruled Out

- Missing canary coverage for a mode or a decision kind: all three modes, a bundle, two defers and a reject are present.
- Silent vocabulary drift inside the compiled path: the class lookup fails closed.
- Stale activation manifest: its policy hash matches the serving policy the replay records.
- Prompt-text reject on a word match: deliberately scoped to caller constraints and covered by a paired case.

## Recommended Next Focus

Hold the active findings steady and settle the stop decision: re-read the P1 evidence one last time so synthesis reports the same severity the iteration that raised it recorded, and treat the compiled slice and the acceptance table as exhausted.

Review verdict: CONDITIONAL
