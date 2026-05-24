# Iter 001 — Evaluation loop logic gaps

## Question

Does the deep-agent-improvement EVALUATION LOOP (initialization, candidate generation, scoring dispatch, promotion gates, rollback, plateau detection) contain logic gaps — contradictions between the SKILL.md / loop_protocol.md prose and the actual `scripts/*.cjs` behavior, or undocumented stop and promotion conditions — that are NOT already captured in this packet's spec.md or audit-findings.jsonl (AF-0001..AF-0009, all resolved)?

## Evidence (file:line citations required)

**Grep results for targeted patterns:**
- `stop|Stop|STOP`: 148 matches across scripts/*.cjs
- `promotion|Promotion|PROMOTION`: 40 matches across scripts/*.cjs  
- `plateau|Plateau|PLATEAU`: 13 matches across scripts/*.cjs
- `gate|Gate|GATE`: 155 matches across scripts/*.cjs

**Key evidence files read:**
- SKILL.md sections 3 (HOW IT WORKS) and 6 (RUNTIME TRUTH CONTRACTS) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="193-423" />
- loop_protocol.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/loop_protocol.md" lines="1-94" />
- evaluator_contract.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/evaluator_contract.md" lines="1-136" />
- score-candidate.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="1-651" />
- reduce-state.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs" lines="715-789" />
- promotion-gates.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs" lines="1-85" />

**Cross-reference against known findings:**
- spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/spec.md" lines="1-306" />
- audit-findings.jsonl (AF-0001..AF-0009, all resolved) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/audit-findings.jsonl" lines="1-9" />

## Findings

### LG-0001: Plateau detection algorithm contradiction (P0)

**Severity:** P0

**Description:** SKILL.md §6 "Dimension Trajectory" states convergence requires "minimum 3 data points (ADR-003) with all dimension deltas within +/-2 across the last 3 points" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="356-358" />. However, reduce-state.cjs line 769 implements plateau detection using exact equality: `lastN.every((s) => s === lastN[0])` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs" lines="767-770" />. This is a fundamental logic gap — the prose describes a tolerance-based algorithm (+/-2 delta) but the code implements a zero-tolerance algorithm (exact match). The stop condition `stopOnDimensionPlateau` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs" lines="761-762" /> will not behave as documented.

**in_scope_check:** 
- already_in_spec: false
- already_in_audit_findings: false

### LG-0002: Stop-condition defaults effectively disable stops (P1)

**Severity:** P1

**Description:** reduce-state.cjs uses `Infinity` as the default value for three stop-rule thresholds: `maxConsecutiveTies` (line 732), `maxInfraFailuresPerProfile` (line 737), and `maxWeakBenchmarkRunsPerProfile` (line 742) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs" lines="732-745" />. This means these stop conditions are effectively disabled unless explicitly configured in the runtime config. SKILL.md §6 "Stop-Reason Taxonomy" lists `blockedStop` as a trigger condition when "one or more legal-stop gate bundles fail" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="268-282" />, but does not document that the underlying stop-rule counters default to Infinity (disabled). This is an undocumented behavior gap that could lead to unexpected loop continuation.

**in_scope_check:**
- already_in_spec: false
- already_in_audit_findings: false

### LG-0003: Promotion gate evaluation disconnect (P2)

**Severity:** P2

**Description:** score-candidate.cjs calls `evaluatePromotionGates(dynamicResult.dimensions)` at line 604 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="604-608" /> and includes the result in the output JSON under `promotionGates` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="627-628" />, but does not use the gate result to influence the `recommendation` field (lines 597-603). The actual promotion blocking happens only in promote-candidate.cjs lines 243-247 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs" lines="243-247" />. SKILL.md §3 "Mode 3: Promotion and Recovery" states "Promote only when prompt scoring, benchmark status, repeatability, boundary, and approval gates all pass" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="237-242" />, but the scoring stage does not enforce the promotion gates — it only reports them. This is a logical inconsistency where gate evaluation is decoupled from the enforcement point.

**in_scope_check:**
- already_in_spec: false
- already_in_audit_findings: false

## Gaps for next iter

- Investigate whether the plateau detection tolerance discrepancy (+/-2 vs exact match) is intentional (ADR-003 reference in SKILL.md) or a documentation bug
- Review runtime config templates to see if stop-rule defaults are documented there (compensating for the SKILL.md omission)
- Examine the orchestrator YAML workflows to understand the intended separation between scoring-stage gate reporting and promotion-stage gate enforcement

## JSONL delta row

{"iter_id":"iteration-01","timestamp_utc":"2026-05-24T03:35:00Z","executor":"cli-devin","model":"swe-1.6","iter_role":"breadth","status":"complete","findings_count":3,"gaps_count":3,"primary_evidence_files":[".opencode/skills/deep-agent-improvement/SKILL.md",".opencode/skills/deep-agent-improvement/references/loop_protocol.md",".opencode/skills/deep-agent-improvement/references/evaluator_contract.md",".opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs",".opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs",".opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs",".opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs"]}
