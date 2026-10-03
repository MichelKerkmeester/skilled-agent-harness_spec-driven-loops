# Iteration 3: Reuse and Default-On Integration

## Focus
Map completion-evidence judgment reuse points in .skilled, then define a default-on integration boundary with measurable operating cost and explicit privacy, latency, and authority limits.

## Actions Taken
1. Mapped the existing completion-evidence core and six runtime adapters.
2. Located explicit workflow closure surfaces that already require evidence.
3. Compared the feature 026 live-use condition with the supplied stop-margin result.
4. Derived practical consent, latency, cost and reliability conditions from the current hook and scorer contracts.

## Findings
1. **There is already a default-on, advisory completion-evidence hook.** The hook core is runtime-neutral and used by Claude, Codex, Devin, Cursor, Pi and OpenCode adapters. It reads local checklist or implementation-summary evidence and logs warnings; adapters do not block completion. Its configuration says the concern is enabled by default. This is the existing regex sentinel, not a default-on Jev/model judge. [SOURCE: .skilled/hooks/completion/README.md:18-22] [SOURCE: .skilled/hooks/completion/README.md:60-72] [SOURCE: .skilled/hooks/completion/README.md:109-120]
2. **The best reuse points are explicit closure decisions.** The system-spec-kit execution guide requires check-completion.sh before saying “done”; the validator registry says unmet acceptance criteria block closure; the manual-testing workflow says not to claim completion until validation output is included. These are narrow, objective surfaces with evidence already available, unlike broad natural-language classification on every turn. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/execution-methods.md:54-66] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:88-97] [SOURCE: .skilled/commands/create/assets/create-manual-testing-playbook-auto.yaml:412-415]
3. **Do not default-on the model arm now.** The observed result is stop (margin). Feature 026 says online judgment requires a later phase, a keep, a named reader, and the operator’s decision; even a keep does not itself serve a detector. The current regex being enabled by default is not evidence that the Jev arm should be. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:91-96] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:157-161] [SOURCE: .skilled/hooks/completion/README.md:111-120]
4. **A future model integration needs consent, bounded fail-open behavior, and a reader.** The inputs are operator session text, and the feature contract requires redaction plus explicit --accept-payload. The hook design is advisory-only; the injection contract says it puts nothing into model context. Preserve a kill switch and dedup, minimize the text, avoid a blocking model call, and name who reads the resulting advice. The current regex cannot be the sole filter because it reportedly missed all ten labeled claims. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:87-96] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:128-140] [SOURCE: .skilled/hooks/completion/README.md:20, 43-46] [SOURCE: .skilled/hooks/injection-contract.md:237-241] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60]
5. **The existing offline call volume is known; live serving cost is not.** At K=110, the current Jev protocol plans 331 calls (one auth test plus 3 per row) and resends each row’s last 400 characters on every rerun. The scorer estimates tokens, not dollars. The current bounded sentinel check timeout is 1200 ms, while the offline Jev call bound is 90 seconds; a future live path therefore needs its own short nonblocking latency budget and telemetry for call count, token volume, p50/p95 latency, timeouts and whether a named reader found the advisory useful. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:77-81] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:712-729] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:90-98] [SOURCE: .skilled/hooks/completion/README.md:119-122]

## Citation Correction
Iteration 1 finding 2 contains one shortened path in its inline citation. The complete source path is specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60; the synthesis uses this canonical path.

## Questions Answered
- Q4: prioritize evidence gates before explicit closure: check-completion.sh, acceptance-criteria closure, and manual-testing success status. Reuse the shared advisory core across adapters.
- Q5: keep the model arm offline until a later phase meets the keep rule and names a reader. Then use consented, minimized payloads; bounded asynchronous fail-open work; kill switch/dedup; and measured per-runtime calls/tokens/latency/timeouts/usefulness. Current live cost and workload are unknown; no currency estimate is supported.

## Questions Remaining
- Which exact words or tail positions caused the ten live misses? Requires the external rows, labels and report.
- What are actual per-runtime prevalence, model cost, p95 latency and false-warning burden? Requires an approved online or replay measurement.

## Ruled Out
- Default-on Jev judgment now: the measured outcome is stop (margin) and no named live reader is specified.
- Applying the existing regex as a model-call gate when recovering its reported false negatives is a goal.

## Dead Ends
- Converting the offline 331-call count into a dollar estimate or live monthly cost without prices and invocation rates.

## Assessment
- newInfoRatio: 0.80 (3 fully new findings, 2 partially new findings; (3 + 0.5*2)/5).
- Confidence: high on existing integration and feature constraints; low on online traffic, per-turn cost, latency, and the usefulness of warnings.

## Sources Consulted
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/steer.md — checked immediately before iteration 3; absent.
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/lineages/luna/deep-research-strategy.md
- .skilled/hooks/completion/README.md:18-22, 43-46, 60-72, 109-122
- .skilled/hooks/injection-contract.md:237-241
- .skilled/skills/system-spec-kit/references/workflows/execution-methods.md:54-66
- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:88-97
- .skilled/commands/create/assets/create-manual-testing-playbook-auto.yaml:412-415
- .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:77-81, 712-729
- .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:90-98
- specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:91-96, 128-140, 157-161

## Reflection
- Worked: mapping already-operative evidence gates separates useful deterministic checks from a proposed classifier.
- Failed: without an online reader or traffic observations, no production call rate, cost or warning usefulness can be estimated.
- All three iterations are complete; early convergence ratios remained above the 0.05 threshold, and max-iterations governs the stop.

## Recommended Next Focus
- Synthesize the five answers, rank the evidence integrity and detector proposals, and record the required max-iteration stop.
