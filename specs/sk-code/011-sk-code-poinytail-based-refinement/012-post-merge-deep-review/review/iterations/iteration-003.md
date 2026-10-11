# Iteration 003 - Compiled routing and session-aware tie-break (correctness)

BINDING: target=Commits ba56b03412..5d9c970447 on main (focus: 5cf062b021 session-aware tie-break, 83ff844329 hub-surface-precedence, ee78fc56b9 surface-precedence docs)
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review

## Dimension

correctness - compiled routing and the session-aware tie-break. Two assigned hypotheses: (1) the skill advisor's advisor_recommend never passes --surface-hint to compiled-route.cjs; (2) the compiled-route-admission test pins LIVE_CORPUS_SIZE 80 against 86 live scenarios. Both CONFIRMED. The hint chain itself (front door, resolver, engine, hub docs) is test-covered and lockstep-clean; the two findings are about consumers and sentinels around it, not about broken routing.

## Files Reviewed

| File | Result |
| --- | --- |
| .skilled/bin/compiled-route.cjs | Front door parses --surface-hint at :36-37 and passes it to resolveRoute as { surfaceHint } at :46; any failure still resolves to the legacy sentinel (:47-55). |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs | options.surfaceHint is forwarded to compiledRoute (:107-112); serve-time identity binding to the manifest's selected policy hash and generation is unchanged (:117-122). |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | The hint is applied only when the hub router exports applySurfaceHint, only after the decision is validated, and it can only reorder targets (:99-108). A hub without surface packets serves the compiled order. |
| .skilled/bin/tests/compiled-route-surface-hint.test.cjs | Run: exit 0, tests 6, pass 6, fail 0 (tie-break lead, unknown hint ignored, workflow mode keeps first place, hub without surface packets, front door one-line stdout). |
| .skilled/bin/tests/compiled-route-admission.test.cjs | Run: exit 1; the pinned-count subtest fails 86 !== 80 at :241 against LIVE_CORPUS_SIZE = 80 at :32. The file was not touched by any of the 40 commits in range. |
| .skilled/bin/lib/compiled-route-admission.cjs | loadGoldScenarios counts playbook markdown whose frontmatter carries expected_workflow_mode (:187-209); no cap or staleness handling beyond the test's own pin. |
| .skilled/bin/skill-advisor.cjs | Pure shim: spawns the dist CLI with argv pass-through (:105-109); no routing logic, no surface handling. |
| .skilled/skills/system-skill-advisor/runtime/dist/runtime/handlers/advisor-recommend.js | compiledRouteForRecommendation spawns the front door as [frontDoor, --hub, skillId, --prompt-stdin] (:292-296) - no --surface-hint and no channel to supply one. |
| .skilled/skills/system-skill-advisor/runtime/dist/runtime/tools/advisor-recommend.js | The advisor_recommend schema exposes prompt, thresholds and includeCompiledRoute; no surface input exists (:10-20). |
| .skilled/skills/system-skill-advisor/hooks/lib/README.md | The hook path sends includeCompiledRoute:false (:20), so it skips the compiled-route subprocess entirely. |
| .skilled/skills/sk-code/SKILL.md | Caller paragraph at :63 tells the hub caller to run stack detection and pass --surface-hint; ROUTER.md:37 repeats the contract. |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/spec.md | Scope boundary (:40, :49-52) covers the flag, the resolver option, the hub caller step and tests; the advisor path is not named. REQ-005 (:131) and REQ-009 (:140) pin hub-doc and front-door behavior. |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/after-compiled-route-admission.txt | The phase's own admission run at 5cf062b021 records "not ok 1 - the live corpus holds the pinned number of gold scenarios" (:169) and "# fail 1" (:242); before and after differ only in duration_ms. |
| .skilled/bin/compiled-route-guard.cjs | Run: exit 0; all seven hubs fresh, runtime matches source. |
| Canary fixture copies (.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json vs specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json) | cmp exit 0 (byte-identical), verified this iteration. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R3-COR-001 - Admission test red at HEAD: LIVE_CORPUS_SIZE pins 80 against 86 live gold scenarios (P2)**

- claim: the compiled-serving admission suite's count sentinel no longer matches the live corpus, so the suite fails and the baseline-rerun signal it exists to raise has been observed (in the phase's own evidence) and left unrepaired.
- evidence: node --test .skilled/bin/tests/compiled-route-admission.test.cjs -> exit 1, AssertionError 86 !== 80 at [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:241]; the pinned constant is at [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:32]. Live counts via loadGoldScenarios over DEFAULT_ON_HUBS: cli-classifier 4, cli-external-orchestration 10, mcp-tooling 16, sk-code 1, sk-design 4, sk-doc 26, system-deep-loop 25 = 86 (loader rule [SOURCE: .skilled/bin/lib/compiled-route-admission.cjs:187]). The test and its lib were not touched by any of the 40 commits in ba56b03412..HEAD (git log count = 0), while in-range commits edited sk-code playbook gold and canary content (ceb8ff216c, eda0cb91e4, ee78fc56b9). The pin's last change is 7148389d98 (2026-09-22, before the range). The phase's own scratch at 5cf062b021 already shows the same failure [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/after-compiled-route-admission.txt:169] and [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/after-compiled-route-admission.txt:242].
- reproducing command: node --test .skilled/bin/tests/compiled-route-admission.test.cjs
- counterevidence sought: a covering gate or deferral. .github/workflows/routing-registry-drift.yml runs only the admission CLI with --all --warn-only, which is non-blocking by design ("Warn-only until the first baseline is triaged"); no workflow or hook executes the unit test file; .skilled/bin/README.md:217 lists it only as a manual example. No packet note explains or defers the failure.
- alternative explanation: the sentinel is meant to go red when the corpus changes so the baseline report is re-run, so the red state is "expected until triage". That explains the design but not shipping the tree red across the whole range while the phase's own captured failure stays unexplained.
- finalSeverity: P2. confidence: high (command-verified; corpus counts reproduced independently of the constant).
- downgradeTrigger: a documented deferral naming this suite plus warn-only wiring; upgrade trigger: this test file joining a blocking CI gate.

**R3-COR-002 - advisor_recommend's compiled-route probe cannot carry the session surface, so the tie-break is unreachable on the advisor path (P2)**

- claim: CONFIRMED that advisor_recommend never passes --surface-hint to compiled-route.cjs; the advisor exposes no surface input, so every compiled route it reports is computed without the session hint.
- evidence: spawn argv at [SOURCE: .skilled/skills/system-skill-advisor/runtime/dist/runtime/handlers/advisor-recommend.js:292] is [frontDoor, --hub, skillId, --prompt-stdin] (:292-296); grep -rn "surface-hint|surfaceHint" .skilled/skills/system-skill-advisor returns no hits; the tool schema has no surface key [SOURCE: .skilled/skills/system-skill-advisor/runtime/dist/runtime/tools/advisor-recommend.js:20]; the front door does support the flag [SOURCE: .skilled/bin/compiled-route.cjs:36]; the hub docs require the model to pass it [SOURCE: .skilled/skills/sk-code/SKILL.md:63]; the hook consumer avoids the subject by sending includeCompiledRoute:false [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/README.md:20].
- reproducing command: sed -n '292,296p' .skilled/skills/system-skill-advisor/runtime/dist/runtime/handlers/advisor-recommend.js ; grep -rn "surface-hint\\|surfaceHint" .skilled/skills/system-skill-advisor
- counterevidence sought: another advisor signal carrying session state. The advisor classifies prompt text containing "surface" as a surface_signal (advisor-recommend.js:168-169) but that is keyword text, not the session's detected stack; no cwd or stack probe exists in the advisor tree. The 008 spec's scope boundary names only the hub-doc caller step [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/spec.md:40], so the advisor was arguably never in the feature's charter.
- alternative explanation: intentional - the advisor is prompt-only and the feature's contract designates the hub caller as the hint's carrier; the advisor compiledRoute is metadata for callers that opt in. Nothing in the 008 packet or the advisor docs records that decision, so intent is unproven.
- finalSeverity: P2. confidence: high on the mechanics; medium on user impact.
- downgradeTrigger: a recorded decision that the advisor path is intentionally hint-blind; upgrade trigger: any consumer observed using advisor compiledRoute metadata to preselect a surface.

## Not Proven / Observations

- system-deep-loop is the one hub with drift:1 (unsafe-route) in the warn-only admission report at HEAD: scenario doctor-commands-doctor-deep-loop-lazy-init routes to research while its gold is a negative [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md:6]. The gold file is unchanged in ba56b03412..HEAD (git log empty), the gate is warn-only by design, and the new hint branch only fires when a string hint arrives, which no admission or advisor path sends. No attribution to the reviewed commits is provable from a read-only pass; baseline triage owns it. Not registered as a finding.

## Traceability Checks

- spec_code: REQ-005 (hub caller step present in SKILL.md:63 and ROUTER.md:37) and REQ-009 (hint suite 6/6 pass; guard exit 0, all hubs fresh) verified. The front door -> resolve -> engine chain is closed and test-covered. The 008 spec does not cover the advisor's compiled-route probe (R3-COR-002).
- checklist_evidence: the admission suite's pinned count is the checklist artifact for corpus edits; it fails at HEAD and the phase's own before/after scratch shows the failure was observed and not repaired (R3-COR-001).
- overlay: not exercised this iteration; skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability remain for later iterations.

## Next Dimension

security - the next uncovered dimension; the advisor probe surface and the carried hook-registration findings are candidate targets.

## Verdict

PASS - no P0 or P1 this iteration; two P2 findings registered (R3-COR-001, R3-COR-002) alongside the two carried P2s.

Review verdict: PASS
