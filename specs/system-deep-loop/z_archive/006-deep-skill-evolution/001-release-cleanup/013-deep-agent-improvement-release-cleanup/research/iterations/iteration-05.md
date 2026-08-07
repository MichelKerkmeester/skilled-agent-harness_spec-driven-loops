# Iter 005 — Mutation/trade-off/lineage logic gaps

## Question

Does the deep-agent-improvement MUTATION COVERAGE (signature dedup), TRADE-OFF DETECTION (Pareto thresholds), and CANDIDATE LINEAGE (parallel waves) surface contain logic gaps — signature-formula or threshold mismatches between SKILL.md and the .cjs scripts, or parallel-waves activation conditions documented differently than coded — NOT already captured in spec.md, audit-findings.jsonl, or iterations 01-04?

## Evidence (file:line citations required)

**Grep results for signature formula (sha256.*dimension.*mutationType.*targetSection.*normalizedBody):**
- 2 matches across the skill: SKILL.md line 336 and mutation-coverage.cjs line 72 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="335-337" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs" lines="72-102" />

**Grep results for Pareto thresholds (-3.*-5):**
- 2 matches across the skill: SKILL.md line 364 and trade-off-detector.cjs line 51 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="364-365" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs" lines="54-57" />

**Grep results for parallelWaves:**
- 14 matches across the skill, with key documentation at SKILL.md line 370 and candidate_proposal_format.md line 330 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="370-371" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/candidate_proposal_format.md" lines="330-333" />

**Key evidence files read:**
- mutation-coverage.cjs (signature formula implementation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs" lines="71-103" />
- trade-off-detector.cjs (Pareto thresholds implementation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs" lines="54-57" />
- candidate-lineage.cjs (lineage graph data structure) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/candidate-lineage.cjs" lines="1-245" />
- candidate_proposal_format.md (parallelWaves activation documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/candidate_proposal_format.md" lines="328-334" />
- SKILL.md section 6 (Mutation Coverage, Trade-Off Detection, Parallel Candidate Waves) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="325-371" />

**Cross-reference against known findings:**
- spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/spec.md" lines="1-306" /> - no logic gaps documented for mutation coverage, trade-off detection, or candidate lineage
- audit-findings.jsonl (AF-0001..AF-0009, all resolved) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/audit-findings.jsonl" lines="1-9" /> - all findings are documentation structure issues, not logic gaps in the three target surfaces
- iteration-01.md (LG-0001..LG-0003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-01.md" lines="1-67" /> - LG-0001 (plateau detection), LG-0002 (stop-condition defaults), LG-0003 (promotion gate evaluation disconnect) - none address mutation/trade-off/lineage
- iteration-02.md (LG-0004) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-02.md" lines="1-64" /> - LG-0004 (benchmark threshold contradiction) - does not address the three target surfaces
- iteration-03.md (LG-0005) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-03.md" lines="1-57" /> - LG-0005 (integration scanning mirror path mismatch) - does not address the three target surfaces
- iteration-04.md (zero findings) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-04.md" lines="1-63" /> - does not address the three target surfaces

## Findings

**No novel logic gaps found in the MUTATION COVERAGE, TRADE-OFF DETECTION, and CANDIDATE LINEAGE surfaces.**

The analysis confirms:

1. **Signature formula consistency:** SKILL.md line 336 documents the signature formula as `sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="335-337" />. mutation-coverage.cjs line 72 implements the exact same formula in the comment and lines 86-103 implement it in code <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs" lines="71-103" />. candidate_proposal_format.md lines 241-246 documents the same formula <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/candidate_proposal_format.md" lines="241-246" />. There is no mismatch between documentation and implementation.

2. **Pareto threshold consistency:** SKILL.md line 364 states "improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality)" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="364-365" />. trade-off-detector.cjs implements these exact thresholds: DEFAULT_IMPROVEMENT_THRESHOLD = 3 at line 41 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs" lines="41-42" />, and DEFAULT_REGRESSION_THRESHOLDS = { hard: -3, soft: -5 } at lines 54-57 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs" lines="54-57" />. The hard dimensions (structural, integration, systemFitness) are defined at lines 21-25 and soft dimensions (ruleCoherence, outputQuality) at lines 32-35 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs" lines="21-35" />. There is no threshold contradiction between documentation and implementation.

3. **ParallelWaves activation condition consistency:** SKILL.md line 370 states "Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="370-371" />. candidate_proposal_format.md lines 330-333 documents the exact same three activation conditions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/candidate_proposal_format.md" lines="330-333" />. candidate-lineage.cjs does not contain activation condition logic because it is a data structure script that implements the lineage graph (nodes, duplicates, parent references) at lines 71-131 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/candidate-lineage.cjs" lines="71-131" />, not the orchestrator-level activation logic. The activation logic correctly belongs in the orchestrator layer (documented in SKILL.md and candidate_proposal_format.md) rather than in the lineage script. This is the expected architectural separation.

**Conclusion:** The MUTATION COVERAGE, TRADE-OFF DETECTION, and CANDIDATE LINEAGE surfaces have no signature-formula mismatches, no threshold contradictions, and no parallel-waves activation-condition divergence between documentation and implementation. All three surfaces are internally consistent across SKILL.md, candidate_proposal_format.md, and their respective .cjs scripts.

## Gaps for next iter

No gaps identified in this iteration. The mutation coverage, trade-off detection, and candidate lineage surfaces are internally consistent across documentation and implementation.

## JSONL delta row

{"iter_id":"iteration-05","timestamp_utc":"2026-05-24T03:44:00Z","executor":"cli-devin","model":"swe-1.6","iter_role":"breadth","status":"complete","findings_count":0,"gaps_count":0,"primary_evidence_files":[".opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs",".opencode/skills/deep-agent-improvement/scripts/trade-off-detector.cjs",".opencode/skills/deep-agent-improvement/scripts/candidate-lineage.cjs",".opencode/skills/deep-agent-improvement/references/candidate_proposal_format.md",".opencode/skills/deep-agent-improvement/SKILL.md"]}
