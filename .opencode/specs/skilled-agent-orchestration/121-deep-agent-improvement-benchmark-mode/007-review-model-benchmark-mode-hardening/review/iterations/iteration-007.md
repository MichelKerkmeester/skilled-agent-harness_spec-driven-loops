# Iteration 007

## Dimension

D4 Maintainability - clarity, duplication, dead code, naming, error messages, test quality, and doc quality across the 120 MiniMax integration and 121/003 model-benchmark build.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58` - mode planner
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118` - executor spawn spec
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:189` - rate-limit backoff loop
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114` - active benchmark fixture scorer
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:161` - decoupled scorer entry point
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:197` - deterministic D2/D3/D5 subprocess calls
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:128` - D2 smoke-run selection
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:80` - D3 path classification
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:63` - D4 parser
- `.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44` - TST-1 plan identity test
- `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:55` - scorer shape/range test
- `.opencode/skills/cli-opencode/SKILL.md:200` - MiniMax provider pre-flight
- `.opencode/skills/cli-opencode/assets/prompt_templates.md:451` - MiniMax prompt template
- `.opencode/skills/sk-prompt-small-model/references/pattern-index.md:49` - MiniMax pattern index
- `.opencode/skills/sk-prompt/assets/model-profiles.json:197` - MiniMax model profile
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:125` - TST-1 acceptance claim
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:166` - scorer-seam follow-on note

## Findings by Severity

### P0

None.

### P1

None new in this maintainability pass. The active P1s from prior iterations still stand, especially DR-005-P1-001 through DR-005-P1-003.

### P2

#### DR-007-P2-001 - scorer tests assert shape, but not the deterministic scorer behavior most likely to regress

- File: `.opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:55`
- Evidence: The main 5-dimension scorer test only checks that `weightedScore` is a number in range, each dimension is a number, D4 equals the noop grader, and `hard_gate_failed` is false (`scorer.vitest.ts:55-65`). The remaining tests cover D1 grep pass/fail and D4 factory behavior (`scorer.vitest.ts:68-115`), but the production scorer runs D2, D3, D5, and hallucination deterministic subprocesses at `score-model-variant.cjs:197-200`, then weights their scores at `score-model-variant.cjs:212-221`.
- Scope proof: Exact search found no direct tests for `bundle-gate.cjs`, `cwd-check.cjs`, `preplanning-regex.cjs`, or scorer hard-gate failure cases under `scripts/tests`. Prior findings landed in exactly those unprotected areas: D3 path containment and D2/D4 scoring integrity.
- Finding class: test-isolation
- Recommendation: Add behavior tests that pin D2 hard-gate failure, D3 sibling-prefix traversal, D5 preplanning pass/fail, and out-of-range D4 grader handling through the public scorer entry point.

#### DR-007-P2-002 - rate-limit backoff is a synchronous busy wait, making dispatch hard to test and expensive to operate

- File: `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:189`
- Evidence: On a rate-limit response, the dispatcher selects waits from `BACKOFF_MS` and then spins in `while (Date.now() < sleepEnd) {}` (`dispatch-model.cjs:189-194`). With the configured defaults, that can block the Node process for minutes while consuming CPU, and there is no injectable sleep function or clock for a focused unit test.
- Scope proof: Exact search found no dispatch-model tests in `scripts/tests`; existing tests exercise `loop-host` planning and `score-model-variant`, not retry/backoff behavior.
- Finding class: test-isolation
- Recommendation: Move the sleep into an injectable helper, use an async timer or child-process handoff instead of a CPU spin, and add a unit test with zero-duration fake backoff.

## Traceability Checks

- `spec_code`: FAIL. Existing P1s remain: `run-benchmark.cjs` still bypasses the decoupled scorer (`spec.md:133`, `run-benchmark.cjs:114`), promotion still overclaims model-benchmark support, and det-check CLIs still use fixture JSON rather than explicit `--cwd`.
- `checklist_evidence`: FAIL. TST-1 is still a plan equality test (`loop-host.vitest.ts:44-63`), not a byte-identical state JSONL run as claimed in `spec.md:125`. Scorer tests do not cover D2/D3/D5 behavior.
- `skill_agent`: PASS for the 120 MiniMax docs slice. MiniMax slug, direct provider, TIDD-EC + dense pre-plan, and variant caveat agree across `cli-opencode`, `sk-prompt`, and `sk-prompt-small-model`.
- `feature_catalog_code`: PASS for MiniMax catalog consistency in `model-profiles.json` and the small-model pattern index.
- `maintainability_test_quality`: FAIL due DR-007-P2-001 and the existing TST-1 evidence gap.
- `backoff_testability`: ADVISORY due DR-007-P2-002.

## Verdict

CONDITIONAL. No new P1 maintainability findings were found, and the 120 MiniMax documentation remains clear and internally consistent. Two new P2 maintainability issues remain: scorer behavior is under-tested where the ported tree is riskiest, and dispatcher backoff is implemented as an untestable blocking spin. The unresolved prior P1s still prevent a pass.

## Next Dimension

Iteration 8 should continue maintainability from a second executor perspective, with emphasis on confirming or downgrading DR-007-P2-001 and DR-007-P2-002 and checking whether any "dead port" concern is fully subsumed by DR-005-P1-001.
