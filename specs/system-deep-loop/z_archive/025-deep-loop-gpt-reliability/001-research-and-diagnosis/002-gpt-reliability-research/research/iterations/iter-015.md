## RANKING

Scoring: impact `1-5` × effort ease `S=3/M=2/L=1` × regression safety `Low=3/Med=2/High=1`.

| Pri | Score | Distinct Proposal | Merge | Justification |
|---|---:|---|---|---|
| P0 | 20 | Gate-3 autonomous precedence package: prose bridge, classifier `triggered-but-satisfied`, autonomous profile prelude, tests | F-001/F-002/F-005/F-028/F-030/F-040 | Highest direct flip count: RVB-008, RSB-008, ACB-004, IMB-004, IMB-005; core measured Gate-3 halt class. Medium risk because root policy/classifier semantics change. |
| P0 | 27 | Explicit setup rendering contract: halt-render rule plus marked render-only blocks | F-006/F-007 | Small, low-risk fix for partial presentation failures RVB-002/CXB-002; replaces convention with a copy/fill contract. |
| P0 | 18 | Vague-ask routing quick path: sub-threshold workflow offer plus targeted phrase boosters | F-023/F-024 | S-effort path to flip ACB-003, IMB-003, RSB-004 from inline answers to workflow routing/offer. Medium risk from over-routing, mitigated by noun-gated boosters. |
| P0 | 20 | Dispatch absorption receipt system: pre-dispatch receipt, workflow-owned route proof, audited CLI wrapper | F-011/F-012/F-013 | Structural fix for RVB-007, RSB-005, RSB-007; removes self-attested route proof and makes dispatch externally verifiable. |
| P0 | 24 | Council liveness protocol: persist each seat stepwise, require liveness JSONL, bound referee pass | F-015/F-016/F-018 | Directly addresses ACB-004/ACB-005 structured-mode stalls and hidden-loop deaths with observable progress. |
| P1 | 18 | Prompt-pack absorption guard: first-line abort unless workflow dispatch receipt exists | F-010 | Cheap guard for RVB-007/RSB-005/RSB-007, but weaker than receipt enforcement because it still relies on model compliance. |
| P1 | 12 | Deep-context settle-as-you-go writes with survivor merge after timeout | F-017 | Direct fix for CXB-004 barrier-join stall; medium effort/risk because it changes merge semantics. |
| P1 | 16 | Budget-edge heartbeat and pacing contract | F-031/F-034 | Makes IMB-001-high resumable and also helps ACB/CXB liveness; medium risk because artifact taxonomy/watchdog behavior changes. |
| P1 | 18 | Top-loaded executor contracts in agent files, including early Gate-3 and completion templates | F-019/F-020/F-021 | Broad salience fix for Gate-3 inversion, partial presentation, and absorption classes; impact is indirect but low-to-medium risk. |
| P1 | 12 | Compiled per-command execution contract with checksum/drift guard | F-035/F-036/F-037/F-009 | Strong cross-class simplification for gate inversion, partial rendering, absorbed steps, and setup authority split; ranked P1 due M-L implementation size. |
| P1 | 18 | Root-policy injection dedupe | F-027 | Low-risk way to reduce prompt load in every GPT cell; broad salience benefit, though no single benchmark flip is guaranteed. |
| P1 | 12 | Downweight or strip path-derived tokens during skill scoring | F-026 | Improves semantics-over-path routing and avoids ACB-003-style misroutes; medium risk because path tokens are sometimes useful context. |
| P1 | 12 | Cache repeated improvement scans/profiles/benchmark materialization | F-033 | Helps IMB-001-high fit budget without changing command meaning; medium implementation effort. |
| P2 | 8 | Deterministic setup loader emitting hydrated execution packets | F-038 | Strongest long-term structural fix for setup/gate/rendering classes, but L effort and higher integration risk. |
| P2 | 8 | Resumable improvement sub-invocations: setup / one-iteration / synthesize | F-032 | Best long-term answer for IMB-001-high budget deaths, but large workflow/API change. |
| P2 | 6 | Machine-readable rules header for agent files | F-022 | Useful generalization of F-019, but high authoring/process cost and less direct than top-loaded prose contracts. |
| P2 | 18 | Benchmark hash comparison for rewritten fixture artifacts | F-014 | Very good harness fix, but does not itself improve runtime reliability. |
| P2 | 18 | Path-free vague benchmark variants | F-025 | Important validity fix for 033 maintenance, but not a product reliability change. |

## CONFLICTS

| Ordering | Items | Reason |
|---|---|---|
| 1 | F-040/F-001/F-002 before F-004/F-015/F-017 diagnostics | Gate-3 autonomous precedence must land first; otherwise liveness/presentation fixes can remain masked by early Gate-3 halts. |
| 2 | F-002 classifier API before broad prose reliance | The machine contract should expose `satisfiedBy/requiresGate3Prompt` before docs depend on that state. |
| 3 | F-011 dispatch receipt before F-012 route-proof validator hardening | Validator cannot compare workflow-owned route fields until an unforgeable receipt exists. |
| 4 | F-013 audited CLI wrapper with F-011/F-012 | CLI routes need the same receipt source as native Task dispatch; otherwise absorption remains possible for non-native executors. |
| 5 | F-015 stepwise council persistence before F-016 strict liveness validation | Validation should not require records the workflow does not yet emit. |
| 6 | F-028/F-030 autonomous profile before F-029 policy deferral | Deferring root-policy sections is safer after the compact autonomous precedence rule exists. |
| 7 | F-006/F-007 before F-009/F-035/F-038 | Marked render blocks are the low-risk immediate fix; machine-readable/compiled/deterministic setup can replace them later. |
| 8 | F-023/F-024 before F-026 | Add explicit offer/boost behavior first; then tune path-token downweighting with measurable routing deltas. |
| 9 | F-031/F-034 before F-032 | Heartbeats/pacing make current long runs survivable; resumable subcommands are the larger redesign. |
| 10 | F-019 before F-022 | Top-loaded executor contracts are the practical version; machine-readable rule headers should follow only if the simpler salience fix is insufficient. |

## GAPS

| Gap | Missing Proposal |
|---|---|
| Multi-cause cells are not explicitly modeled, especially ACB-004 appearing under both Gate-3 and council liveness. | Add benchmark adjudication metadata that records primary and secondary failure causes per cell, so fixes are validated in dependency order instead of claiming duplicate flips. |
| No registry proposal defines acceptance tests for partial-presentation completeness beyond RVB-002/CXB-002. | Add snapshot tests asserting exact rendered setup block fields, omissions, and stop behavior for each command surface. |
| No end-to-end budget harness proposal verifies heartbeat/pacing actually prevents watchdog death. | Add budget-edge integration tests that enforce first-artifact deadline, progress cadence, pre-cap finalizer, and visible-progress-only budget extension. |
| No proposal covers observability for “offer but do not route” vague-ask outcomes. | Add advisor telemetry classifying `routed`, `offered`, `inline`, and `misroute` outcomes for vague prompts. |
| No explicit rollback/compatibility plan for changing root-policy injection and autonomous profiles. | Add a feature-flagged rollout proposal with per-command opt-in, benchmark gates, and fallback to current injection. |

## QUICK WINS

| This Week | Why |
|---|---|
| Land the F-040 Gate-3 package | Highest direct blocker removal: RVB-008, RSB-008, ACB-004, IMB-004, IMB-005. |
| Add marked setup render blocks and command halt-render rules | S effort, low risk, directly fixes RVB-002/CXB-002 partial presentation. |
| Add vague-ask sub-threshold offer rule and targeted phrase boosters | S effort, flips ACB-003/IMB-003/RSB-004 toward workflow routing or explicit offer. |
| Add council stepwise persistence plus bounded referee pass | Small-to-medium change with direct ACB-004/ACB-005 liveness payoff. |
| Add prompt-pack dispatch-abort line while designing receipt enforcement | S effort guard against RVB-007/RSB-005/RSB-007 while the structural receipt system is built. |
