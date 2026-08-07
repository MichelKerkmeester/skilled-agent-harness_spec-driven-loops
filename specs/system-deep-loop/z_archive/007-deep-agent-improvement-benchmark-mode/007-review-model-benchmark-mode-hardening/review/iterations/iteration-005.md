# Iteration 005 - Traceability

## Dimension
D3 Traceability. Checked whether the shipped 121/003 build matches the 001 decision record, the 002 research build-delta, and 003 REQ-001..REQ-005 acceptance claims.

## Files Reviewed
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/001-design-model-benchmark-mode-selector/decision-record.md:67
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/research.md:7
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/research.md:48
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:123
- .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:133
- .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58
- .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73
- .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114
- .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:274
- .opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:423
- .opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:153
- .opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:168
- .opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:54
- .opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:161
- .opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:202
- .opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:142
- .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44
- .opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:50
- .opencode/skills/cli-opencode/assets/prompt_quality_card.md:54
- .opencode/skills/cli-opencode/assets/prompt_templates.md:451
- .opencode/skills/sk-prompt/assets/model-profiles.json:187
- .opencode/skills/sk-prompt-models/SKILL.md:131
- .opencode/skills/sk-prompt-models/references/pattern-index.md:49

## Findings by Severity

### P0
None.

### P1

#### DR-005-P1-001 - model-benchmark runner bypasses the decoupled 5-dim scorer required by REQ-004
- File: .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114
- Claim: REQ-004 and the 002 build-delta require the model-benchmark scorer seam to use primitive criteria arrays and the ported 5-dim scorer, but the active benchmark runner still scores fixture headings/patterns directly and never imports score-model-variant.cjs.
- Evidence: spec.md:94 and spec.md:133 put the decoupled scorer in scope and acceptance. research.md:48-51 defines the scorer seam; research.md:78 says the scorer should operate on primitive criteria arrays. The shipped runner reads fixture.requiredHeadings / requiredPatterns / forbiddenPatterns directly at run-benchmark.cjs:114-155 and writes benchmark_run records from that result at run-benchmark.cjs:323-338. score-model-variant.cjs exposes the ported scorer at score-model-variant.cjs:161, but exact search found no call from loop-host/run-benchmark.
- Counterevidence sought: Searched for score-model-variant/buildGraderFn imports and calls across scripts; hits are the scorer itself plus tests/CLI, not the active benchmark route.
- Alternative explanation: spec.md:166 says activating the 5-dim scorer by default may be a follow-on, but that contradicts REQ-004 and the in-scope deliverables unless it is an approved deferral.
- Final severity: P1. Confidence: 0.91.
- Downgrade trigger: Document an approved deferral that removes active 5-dim scorer use from REQ-004, or wire run-benchmark through score-model-variant.cjs behind an explicit scorer seam.

#### DR-005-P1-002 - promotion still has only the scored path despite the spec claiming model-benchmark promotion is resolved
- File: .opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:168
- Claim: REQ-002 and the 003 open-question note say model-benchmark promotion returns a decision and routes by scored vs benchmark-complete status, but promote-candidate.cjs rejects any score whose status is not scored before it checks the benchmark report.
- Evidence: spec.md:126 requires loop-host --mode=model-benchmark to produce a benchmark_run and promotion decision. spec.md:165 says promotion routes by score file status, scored vs benchmark-complete. research.md:87 calls for mode-aware status checks. The shipped command still requires the full agent-promotion args at promote-candidate.cjs:153-155, rejects score.status !== 'scored' at promote-candidate.cjs:168-171, and only then checks benchmarkReport.status at promote-candidate.cjs:193-205. loop-host.cjs:73-75 does not invoke promotion.
- Counterevidence sought: Checked parseArgs for --mode, the early score.status gate, benchmarkReport.status checks, and loop-host steps; no model-benchmark promotion branch or loop-host promotion invocation exists.
- Alternative explanation: The code may intend benchmark reports to be an ancillary gate for agent-candidate promotion, but then REQ-002/spec.md:165 overclaim model-benchmark promotion behavior.
- Final severity: P1. Confidence: 0.87.
- Downgrade trigger: Clarify the spec that promotion remains agent-candidate only, or add a model-benchmark branch that accepts benchmark-complete input and returns the documented decision.

#### DR-005-P1-003 - deterministic checks still depend on fixture JSON instead of the explicit --cwd contract
- File: .opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:142
- Claim: REQ-004 and research CP2 require deterministic check scripts to accept explicit --cwd, but the shipped det-check CLIs still accept fixturePath/outputPath and recover cwd from fixture.scope.cwd.
- Evidence: spec.md:133 requires det-checks to accept explicit --cwd. research.md:75-78 identifies fixture-path coupling and says to parameterize det-check scripts with explicit --cwd. The shipped wrapper calls runDetCheck(scriptName, fixturePath, outputFile) at score-model-variant.cjs:54-56. bundle-gate.cjs derives cwd from fixture.scope.cwd at bundle-gate.cjs:138-139 and its CLI accepts only fixturePath/outputPath at bundle-gate.cjs:202. cwd-check.cjs does the same at cwd-check.cjs:103-104 and cwd-check.cjs:142.
- Counterevidence sought: Searched deterministic scripts for --cwd parsing; no --cwd support exists, and score-model-variant.cjs writes a temporary virtual fixture to preserve the old fixturePath API.
- Alternative explanation: The temporary virtual fixture with an absolute cwd reduces coupling at the wrapper boundary, but it does not meet the stated det-check CLI acceptance criterion.
- Final severity: P1. Confidence: 0.84.
- Downgrade trigger: Change REQ-004 to accept the virtual-fixture adapter as the intended contract, or add explicit --cwd support to the deterministic check scripts.

### P2
None.

## Traceability Checks
- spec_code: FAIL. REQ-002 and REQ-004 overclaim active scorer and promotion behavior.
- checklist_evidence: FAIL. TST-1 tests plan equality, not byte-identical state JSONL; scorer tests call the ported scorer directly but do not prove run-benchmark uses it.
- skill_agent: PASS for the MiniMax docs slice reviewed. cli-opencode cards/templates, model-profiles, and sk-prompt-models index all expose MiniMax M2.7, minimax-api quota pool, TIDD-EC + dense pre-plan, and the --variant caveat.
- feature_catalog_code: PASS for MiniMax registry coverage in model-profiles.json and sk-prompt-models dispatch matrix.
- playbook_capability: PASS for cli-opencode reference coverage of the minimax provider/model and variant caveat.
- no loop.cjs discovery: PASS. The shipped loop-host.cjs honors the 002 discovery that there is no loop.cjs to modify.
- mode field persistence: PASS. score-candidate and run-benchmark include mode on success and infra_failure records.

## SCOPE VIOLATIONS
None.

## Verdict
CONDITIONAL. Traceability finds three new P1 acceptance mismatches. The code has useful pieces, but the 003 completion claim is not fully supported by the active execution path or tests.

## Next Dimension
D3 Traceability second-executor pass should reproduce or contest DR-005-P1-001 through DR-005-P1-003, then widen to the omitted cli-opencode graph-metadata and changelog consistency checks.
