# Iter 002 — Scoring system logic gaps

## Question

Does the deep-agent-improvement SCORING SYSTEM (dynamic profiling via generate-profile.cjs, the 5 weighted dimensions, deterministic scoring in score-candidate.cjs, the >=70 acceptable / >=85 benchmark thresholds) contain logic gaps — weight-sum errors, threshold contradictions across SKILL.md / README / config / scripts, or scorer-vs-doc divergence — that are NOT already captured in spec.md, audit-findings.jsonl, or iteration-01.md?

## Evidence (file:line citations required)

**Grep results for dimension weights (0.20|0.25|0.15|DIMENSION_WEIGHTS):**
- 50 matches across the skill, all consistent: structural=0.20, ruleCoherence=0.25, integration=0.25, outputQuality=0.15, systemFitness=0.15 (sum=1.0)
- Key sources: score-candidate.cjs lines 138-144 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="138-144" />, SKILL.md lines 229-233 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="229-233" />, score_dimensions.md lines 35/51/68/85/101 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/score_dimensions.md" lines="35-101" />, improvement_config.json lines 48-52 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/improvement_config.json" lines="48-52" />

**Grep results for threshold values (70|85|threshold|THRESHOLD):**
- 50 matches across the skill
- >=70 candidate-acceptable threshold consistent: score_dimensions.md line 25 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/score_dimensions.md" line="25" />, promotion_gate_contract.md line 35 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/promotion_gate_contract.md" line="35" />, scripts/lib/promotion-gates.cjs line 6 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs" line="6" />
- >=85 benchmark threshold documented in: README.md line 265 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/README.md" line="265" />, promotion_gate_contract.md line 60 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/promotion_gate_contract.md" line="60" />, improvement_config.json line 57 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/improvement_config.json" line="57" />, scripts/lib/promotion-gates.cjs line 16 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs" line="16" />

**Grep results for benchmark aggregate score thresholds (requiredAggregateScore|minimumAggregateScore):**
- 7 matches across the skill
- generate-profile.cjs line 270: requiredAggregateScore=75 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs" line="270" />
- benchmark-profiles/default.json line 15: requiredAggregateScore=80 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" line="15" />
- improvement_config.json line 57: minimumAggregateScore=85 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/improvement_config.json" line="57" />
- run-benchmark.cjs line 280: defaults to 80 if profile.benchmark.requiredAggregateScore is missing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" line="280" />

**Key evidence files read:**
- generate-profile.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs" lines="1-310" />
- score-candidate.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="1-651" />
- score_dimensions.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/score_dimensions.md" lines="1-228" />
- evaluator_contract.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/evaluator_contract.md" lines="1-136" />
- SKILL.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="1-492" />
- improvement_config.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/improvement_config.json" lines="1-121" />
- benchmark-profiles/default.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" lines="1-19" />

**Cross-reference against known findings:**
- spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/spec.md" lines="1-306" /> - no scoring system threshold contradictions documented
- audit-findings.jsonl (AF-0001..AF-0009, all resolved) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/audit-findings.jsonl" lines="1-9" /> - all findings are documentation structure issues, not scoring logic
- iteration-01.md (LG-0001..LG-0003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-01.md" lines="1-67" /> - LG-0001 (plateau detection), LG-0002 (stop-condition defaults), LG-0003 (promotion gate evaluation disconnect) - none address benchmark threshold values

## Findings

### LG-0004: Benchmark threshold contradiction across profile generator, default profile, and documentation (P1)

**Severity:** P1

**Description:** The benchmark aggregate score threshold has three different values across the codebase, creating ambiguity about which threshold is authoritative:
- generate-profile.cjs line 270 sets `requiredAggregateScore: 75` in the dynamic profile output <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs" line="270" />
- benchmark-profiles/default.json line 15 sets `requiredAggregateScore: 80` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" line="15" />
- Documentation and promotion gates all use 85: README.md line 265 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/README.md" line="265" />, promotion_gate_contract.md line 60 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/promotion_gate_contract.md" line="60" />, improvement_config.json line 57 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/improvement_config.json" line="57" />, scripts/lib/promotion-gates.cjs line 16 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs" line="16" />

This is a logic gap because dynamic profiles generated by generate-profile.cjs will carry a 75 threshold, but the promotion gate contract and documentation state 85 is required. run-benchmark.cjs line 280 defaults to 80 if the profile value is missing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" line="280" />, adding a fourth value to the inconsistency. A candidate could pass benchmark validation against a 75 or 80 threshold but fail promotion gates that enforce 85.

**in_scope_check:**
- already_in_spec: false
- already_in_audit_findings: false

## Gaps for next iter

- Determine the authoritative benchmark threshold value (75 vs 80 vs 85) and align generate-profile.cjs, benchmark-profiles/default.json, and documentation
- Review whether run-benchmark.cjs should use the profile's requiredAggregateScore or the improvement_config.json minimumAggregateScore as the source of truth
- Verify that dimension weight overrides via --weights=JSON (score-candidate.cjs lines 488-496) are validated to sum to 1.0 before application

## JSONL delta row

{"iter_id":"iteration-002","timestamp_utc":"2026-05-24T03:39:00Z","executor":"cli-devin","model":"swe-1.6","iter_role":"breadth","status":"complete","findings_count":1,"gaps_count":1,"primary_evidence_files":[".opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs",".opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs",".opencode/skills/deep-agent-improvement/references/score_dimensions.md",".opencode/skills/deep-agent-improvement/references/evaluator_contract.md",".opencode/skills/deep-agent-improvement/SKILL.md",".opencode/skills/deep-agent-improvement/assets/improvement_config.json",".opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json",".opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs",".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs"]}
