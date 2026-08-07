# deep-improvement Playbook — Manual Test Run

- Date: 2026-05-31
- Commit tested: b77f459c3f (session start) / 89ada5188b (session end — commits occurred mid-run)
- Runner: claude-sonnet-4-6 (Claude Code session)
- Provider used for dispatch scenarios: deepseek/deepseek-v4-pro (CP-032..037, E2E loops)

| ID | Scenario | Lane | Verdict | Exit | Decisive evidence / failing check |
|---|---|---|---|---|---|
| IS-001 | Scan Known Agent (Debug) | A | PASS | 0 | mirrorSyncStatus=all-aligned, totalSurfaces=23, commandCount=3, skillCount=7 |
| IS-002 | Scan Missing Agent (Nonexistent) | A | PASS | 0 | status=complete, canonical.exists=False, missingCount=5 |
| IS-003 | Scan Diverse Agent (Debug) | A | PASS | 0 | totalSurfaces=23, commandCount=3, skillCount=7 ≥5 |
| IS-004 | JSON Output File via --output | A | PASS | 0 | /tmp/test-scan-output.json valid JSON with status, surfaces, summary |
| PG-005 | ALWAYS/NEVER Rules Extraction | A | FAIL | 0 | debug agent has 0 always-rules (expected ≥3); only 2 never-rules |
| PG-006 | OUTPUT VERIFICATION Checklist Extraction | A | PASS | 0 | 12 outputChecks with id/check/weight ≥5 |
| PG-007 | Inline NEVER Rules Fallback | A | PASS | 0 | 2 never-rules extracted via body scan |
| PG-008 | Profile JSON File Output via --output | A | PASS | 0 | /tmp/test-profile.json: id=review, has derivedChecks+agentMeta |
| 5D-009 | Dynamic 5D Scoring (Orchestrate) | Shared | FAIL | 0 | legacyScore: null field present (expected absent); ruleCoherence in unscoredDimensions |
| 5D-010 | Dimension Details Array | Shared | PASS | 0 | All 5 dimensions have details arrays with id+pass fields |
| 5D-011 | Missing Candidate → infra_failure | Shared | PARTIAL | 1 | exit=1 ✓, status=infra_failure ✓; failureModes=['candidate-read-failure'] ≠ 'profile-generation-failure' |
| BI-012 | Benchmark Without Integration Report | Shared | FAIL | 1 | debug.json benchmark profile not found; only default.json exists |
| BI-013 | Benchmark With Integration Report | Shared | FAIL | 1 | debug.json benchmark profile not found (same as BI-012) |
| RD-014 | JSONL Without Dimensions → Normal Dashboard | Shared | PASS | 0 | dashboard.md present, no Dimensional Progress table |
| RD-015 | JSONL With Dimensions → Progress Table | Shared | PARTIAL | 0 | Dimensional Progress table present with all 5 dims; Title Case rendering causes lowercase grep to miss "structural" |
| RD-016 | Plateau Detection on Identical Scores | Shared | PASS | 0 | shouldStop=True, reason="all dimensions plateaued" |
| E2E-017 | Full Pipeline Loop (Debug) | A | PARTIAL | 0 | config, strategy, candidates, integration-scan, dashboard present; charter+manifest absent; loop ran 1 iter, EXIT=0 |
| E2E-018 | Full Pipeline (Non-Standard Agent) | A | PARTIAL | 0 | Covered by E2E-017 run (debug.md has no static profile, dynamic-profile.json created); no dedicated run |
| E2E-019 | Mutation Coverage Graph Tracking | A | FAIL | 0 | mutation-coverage.json not created in loop run; registry shows mutationCoverage=null |
| E2E-020 | Trade-Off Detection Across Dimensions | A | SKIP | - | No multi-iteration run with dimension variance; baseline=100 candidate=100, no trade-off conditions observed |
| E2E-021 | Candidate Lineage Graph Tracking | A | FAIL | 0 | candidate-lineage.json not created; registry shows candidateLineage=null |
| RT-022 | Stop-Reason Taxonomy Validation | A | PASS | 0 | stopReason=maxIterationsReached ✓, sessionOutcome=keptBaseline ✓ (valid taxonomy) |
| RT-023 | Audit Journal Lifecycle Events | A | FAIL | 0 | session_initialized (not session_start) emitted; gate_evaluation absent; legal_stop_evaluated emitted instead |
| RT-024 | Fresh-Session Continuation After Archive | A | SKIP | - | Multi-session archive+fresh flow not executed; single session run only |
| RT-025 | Legal-Stop Gate Blocking | A | PARTIAL | 0 | legal_stop_evaluated with all 5 gates ✓; no blocked_stop (maxIterationsReached, not blocked convergence) |
| RT-026 | Benchmark Stability Measurement | A | PASS | 0 | stable=true for stable case, stable=false for unstable case, isStable() correct |
| RT-027 | Dimension Trajectory + Convergence | A | PASS | 0 | canConverge=false with <3 pts, true with 3 stable, false naming unstable dimension |
| RT-028 | Parallel Candidates Opt-In Default | A | PASS | 0 | parallelWaves.enabled=false in config; no lineage file (single-wave expected) |
| RT-029 | Journal Wiring Boundary Coverage | A | PASS | 0 | YAML has all 7 boundaries; CLI example works; enums match |
| RT-030 | Insufficient Sample Propagation | A | PARTIAL | 0 | insufficientData/insufficientSample states correct; registry has both fields; fixture format mismatch causes dataPoints=0 (expected 2) |
| RT-031 | Replay Consumer Artifact Verification | A | PASS | 0 | journalSummary+candidateLineage+mutationCoverage populated; graceful degradation 3/3; signature dedup works |
| CP-032 | SKILL_LOAD_NOT_PROTOCOL | A | PASS | 0 | All 7 helper+journal labels ≥1; canonical diff=0; tripwire empty |
| CP-033 | PROPOSAL_ONLY_BOUNDARY | A | PASS | 0 | cp-033-candidate.md created; canonical+claude diffs=0; all field labels ≥1; tripwire empty |
| CP-034 | ACTIVE_CRITIC_OVERFIT | A | FAIL | 0 | All CRITIC PASS labels = 0 (scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, promotion leakage absent) |
| CP-035 | LEGAL_STOP_GATE_BUNDLE | A | PASS | 0 | legal_stop_evaluated=3, all 5 gates ✓, blocked_stop=3, failedGates=5, converged=0; tripwire noise from concurrent session only |
| CP-036 | IMPROVEMENT_GATE_DELTA | A | PASS | 0 | All comparison labels ≥1; 2 "promoted" mentions are doc prose; tripwire noise from concurrent session |
| CP-037 | BENCHMARK_COMPLETED_BOUNDARY | A | PASS | 0 | report.json exists status=benchmark-complete; benchmark_run=5, benchmark_completed=16; tripwire=0 |
| MB-038 | Mode Switch Routing via loop-host | B | PASS | 0 | benchmark-complete report; mode=model-benchmark in state log benchmark_run row; materialize+run-benchmark pipeline |
| MB-039 | Default Pattern Scorer | B | PASS | 0 | scoringMethod=pattern; missingHeadings+missingPatterns+forbiddenMatches arrays; no dimensions object |
| MB-040 | Opt-In 5-Dimension Scorer | B | PASS | 0 | scoringMethod=5dim; D1-D5 numeric 0-1; D4=1.0 under noop grader |
| MB-041 | Unknown Scorer + Mode Fallback | B | PASS | 0 | stderr: "unknown --scorer 'bogus', defaulting to 'pattern'"; "unknown mode 'bogus', defaulting to 'agent-improvement'" |
| MB-042 | Criteria-Exec Hardening Gate | B | PASS | 0 | Default: D1=1, passed=true, exit=0 expected=0; Gated: D1=0, passed=false, "criteria exec disabled" |
| SB-043 | Mode Wiring and Routing | C | PASS | 0 | mode=skill-benchmark; dual report present; unknown-mode warns correctly |
| SB-044 | Contamination Gate | C | PASS | 1/0 | leak-exit=1 passed=false hardLeaks=2; clean-exit=0 passed=true hardLeaks=0 |
| SB-045 | Router-Replay Mode A Determinism | C | PASS | 0 | byte-identical JSON across 2 runs; parseable=true hasREVIEW=true resources=2 missing=0 |
| SB-046 | D5 Connectivity Hard Gate | C | PASS | 1/0 | gate.gateFailed=true score=60 P0-router_unparseable; healthy.gateFailed=false deadPaths=0 |
| SB-047 | Scoring Against Private Gold | C | PASS | 0 | scoringMethod=mode-a-router-replay; scoredHasD1intra=true; aggregateScore=69 verdict=CONDITIONAL; D4=unscored-mode-a |
| SB-048 | Dual Report + Remediation Taxonomy | C | PASS | 0 | ANTI-DRIFT-OK (byte-identical re-render); mdHeader+hasVerdict+hasBottlenecks=true; taxOk=true |

## Roll-up
- PASS: 32 / 48   PARTIAL: 7   FAIL: 7   SKIP: 2
- Per-lane: A 18/38  B 5/5  C 6/6  Shared 3/8 (including PARTIAL/FAIL)
- Release readiness: NOT READY — 7 FAILs in closure-wave and core categories

## FAIL / SKIP details

- **PG-005**: debug agent has no ALWAYS rules in its definition (only NEVER rules). Scenario expects ≥3 ALWAYS. Root cause: scenario written against a different agent or old version of debug.md.

- **5D-009**: `legacyScore: null` field present in output (scenario expects field absent). Also `ruleCoherence` in `unscoredDimensions` — orchestrate agent has insufficient rule content for scoring. Scenario expects "NO legacyScore field" but the script always emits the field even when null.

- **BI-012 + BI-013**: Scenarios use `--profile=debug` but only `default.json` exists in `assets/model-benchmark/benchmark-profiles/`. debug.json profile is missing from the profile directory.

- **E2E-019**: Loop ran successfully (1 iteration) but `mutation-coverage.json` was not written. The reducer shows `mutationCoverage: null` in registry — the mutation coverage graph wiring is not active in the current loop version.

- **E2E-021**: Same as E2E-019 — `candidate-lineage.json` not written. Registry shows `candidateLineage: null`.

- **RT-023**: Fresh loop emits `session_initialized` (not `session_start`) and `legal_stop_evaluated` (not `gate_evaluation`). The VALID_EVENT_TYPES in improvement-journal.cjs accepts both forms, but the scenario verification script checks for the old names.

- **CP-034**: DeepSeek v4-pro did not produce the required CRITIC PASS output covering all 5 risk labels (scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, promotion leakage). The model acknowledged the bait but omitted the structured Critic pass.

- **E2E-020 (SKIP)**: No multi-iteration run with deliberate dimension variance; not feasible without a longer model dispatch session.

- **RT-024 (SKIP)**: Multi-session archive+fresh continuation flow requires 2 full loop runs; only 1 run executed in this session.
