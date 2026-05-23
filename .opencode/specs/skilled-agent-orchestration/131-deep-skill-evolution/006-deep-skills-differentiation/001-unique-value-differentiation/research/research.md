# Research Synthesis: Deep Skills Unique-Value Differentiation

**Packet:** 131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation  
**Iteration:** 010 of 10 (FINAL)  
**Converged:** true  
**Total Fingerprints:** 100  
**Research Duration:** 2026-05-23T06:08:00Z → 2026-05-23T09:05:00Z (~3 hours)  

---

## §1 Contract Surfaces

### Deep-Review Contract

**Input Shape:** Requires 7 mandatory setup fields before loading YAML workflow: `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold` <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="15-22, 98-112" />. Supports PRE-BOUND SETUP ANSWERS schema for non-interactive :auto dispatch with marker block format <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="66-95" />. Supports 5 review target types: spec-folder, skill, agent, track, files <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="101, 174-179" />.

**Output Artifacts:** 9 canonical files under resolved artifact_dir: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md, .deep-review-pause sentinel, prompts/ directory, iterations/iteration-{NNN}.md files, deltas/iter-{NNN}.jsonl files <ref_file file=".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="82-108, 115-123" />. Per-iteration markdown requires 8 sections: Dispatcher, Files Reviewed, Findings - New (P0/P1/P2 subsections), Traceability Checks, Integration Evidence, Edge Cases, Confirmed-Clean Surfaces, Ruled Out, Next Focus <ref_file file=".opencode/agents/deep-review.md" lines="189-196" />. Synthesis outputs review-report.md with 9 sections: Summary, Scope, Methodology, Findings (P1/P2 subsections), Recommendations, Coverage, Traceability, Integration, Release-readiness <ref_file file=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/review/review-report.md" lines="1-100" />.

**State File Ownership:** Split between main loop (YAML workflow) and LEAF agent. Main loop owns deep-review-config.json, deep-review-strategy.md, deep-review-dashboard.md, deep-review-findings-registry.json. LEAF agent (@deep-review) owns iteration-{NNN}.md and appends to deep-review-state.jsonl <ref_file file=".opencode/agents/deep-review.md" lines="189-211" />. State includes 3 core persistence artifacts plus JSONL append log <ref_file file=".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="190-226" />.

**Convergence Semantics:** Uses Bayesian scoring via coverage-graph signals (dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation) <ref_file file=".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts" lines="44-50" />. Includes saturation rate and P0/P1/P2 finding tiers with weighted calculation (P0=10, P1=5, P2=1) <ref_file file=".opencode/agents/deep-review.md" lines="174-186" />. Requires adversarial adjudication for P0 findings (Hunter/Skeptic/Referee) with typed claim-adjudication fields before writing to JSONL <ref_file file=".opencode/agents/deep-review.md" lines="182-183" />.

**Command Modes:** :auto and :confirm suffixes with three-tier resolution contract (Tier 1: confident resolution, Tier 2: targeted questions, Tier 3: fail fast) <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="38, 52-64" />. :auto supports non-interactive dispatch via PRE-BOUND SETUP ANSWERS <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="52-64, 66-95" />.

**Distinctive Value:** Adversarial P0 adjudication with coverage-graph signals for Bayesian convergence scoring. No sibling skill combines adversarial self-checks with graph-based convergence signals <ref_file file=".opencode/agents/deep-review.md" lines="182-183" />.

---

### Deep-Research Contract

**Input Shape:** Requires 5 mandatory setup fields before loading YAML workflow: `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold` <ref_file file=".opencode/commands/deep/start-research-loop.md" lines="14-20, 89-103" />. Supports PRE-BOUND SETUP ANSWERS schema for non-interactive :auto dispatch (matches deep-review schema structure) <ref_file file=".opencode/commands/deep/start-research-loop.md" lines="68-85" />. Does NOT support target types (unlike deep-review's 5 types) — operates on single research_topic string <ref_file file=".opencode/commands/deep/start-research-loop.md" lines="89-103" />.

**Output Artifacts:** 11 canonical files under resolved artifact_dir: deep-research-config.json, deep-research-state.jsonl, findings-registry.json, deep-research-strategy.md, deep-research-dashboard.md, .deep-research-pause sentinel, .deep-research.lock lock file, prompts/ directory, iterations/iteration-{NNN}.md files, deltas/iter-{NNN}.jsonl files, research.md <ref_file file=".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml" lines="94-119" />. Per-iteration markdown requires 10 sections: Focus, Findings, Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus <ref_file file=".opencode/agents/deep-research.md" lines="181-222" />. Synthesis outputs research.md with 17 sections: Executive Summary, Methodology, Findings by Angle, Findings by Surface, Cross-Angle Themes, P0/P1/P2 Summary, Remediation Roadmap, Coverage Analysis, Source Diversity, Convergence Analysis, Executor Performance, Negative Knowledge, Open Questions, Resolved Questions, Key Findings, Ruled Out Directions, Next Steps <ref_file file=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/001-deep-research-drift-and-simplification/research/research.md" lines="1-139" />.

**State File Ownership:** Split between main loop (YAML workflow) and LEAF agent. Main loop owns deep-research-config.json, deep-research-strategy.md, deep-research-dashboard.md, findings-registry.json. LEAF agent (@deep-research) owns iteration-{NNN}.md and appends to deep-research-state.jsonl <ref_file file=".opencode/agents/deep-research.md" lines="226-232" />. State includes 3 core persistence artifacts plus JSONL append log (matches deep-review structure) <ref_file file=".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml" lines="197-236" />.

**Convergence Semantics:** Uses Bayesian scoring via coverage-graph signals (matches deep-review) <ref_file file=".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts" lines="44-50" />. Uses newInfoRatio calculation without severity tiers (fully new=1.0, partially new=0.5, +0.10 simplicity bonus capped at 1.0) <ref_file file=".opencode/agents/deep-research.md" lines="264-269" />. Does NOT include adversarial adjudication for any findings <ref_file file=".opencode/agents/deep-research.md" lines="133-150" />.

**Command Modes:** :auto and :confirm suffixes with three-tier resolution contract (matches deep-review) <ref_file file=".opencode/commands/deep/start-research-loop.md" lines="52-66" />. :auto supports non-interactive dispatch via PRE-BOUND SETUP ANSWERS <ref_file file=".opencode/commands/deep/start-research-loop.md" lines="52-66, 68-85" />.

**Distinctive Value:** Negative knowledge (ruled-out directions) as first-class research output through "Ruled Out" and "Dead Ends" sections. Research charter (non-goals, stop conditions) validated at init. Converges based purely on newInfoRatio without severity tiers or adversarial self-checks <ref_file file=".opencode/agents/deep-research.md" lines="181-222, 264-269" />.

---

### Deep-AI-Council Contract (Proposed)

**Input Shape:** Requires 6 mandatory setup fields (cost guards): `max_rounds_per_topic` (default 3), `max_topics_per_session` (default 5), `saturation_threshold` (default 0.2), plus implicit fields from current sk-ai-council: deliberation_topic, seat configurations, executor.* <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="77-82" />. Supports multi-topic deliberation (N deliberation_topic values in single session) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="78" />. Supports seat configurations with strategy lenses (2-4 seats with different reasoning lenses per round) <ref_file file=".opencode/skills/sk-ai-council/SKILL.md" lines="308-313" />.

**Output Artifacts:** Per-topic per-round seat artifacts under ai-council/topics/topic-NNN/rounds/round-NNN/seats/ <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="78" />. Session-wide findings-registry.json with canonical fingerprint schema (mirroring deep-review/deep-research) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="79" />. Per-topic council-report.md with 12 sections: Council Composition, Seat outputs, Task Classification, Strategy Comparison, Deliberation Notes, Winning Strategy, Recommended Plan, Implementation Steps, Prerequisites, Cross-References, Dropped Alternatives, Risks & Mitigations <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/ai-council/council-report.md" lines="1-125" />. Session-report.md (proposed) for cross-topic synthesis <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="78, 140" />.

**State File Ownership:** Split between main loop and seat agents. Main loop owns council-config.json, topic-config.json, round-state.jsonl, findings-registry.json, session-state.jsonl (3-level hierarchy: session → topic → round) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="88" />. Seat agents write individual seat artifacts under ai-council/seats/ <ref_file file=".opencode/skills/sk-ai-council/SKILL.md" lines="312-313" />.

**Convergence Semantics:** Uses per-topic adjudicator-verdict stability (multi-round deliberation within topic, adjudicator scores Round-N→N+1 stability) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="77" />. Includes session-level saturation across topics <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="80" />. Does NOT include severity tiers (proposed) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="77-82, 31" />. Does NOT include adversarial adjudication (two-of-three convergence or adjudicator independent ruling) <ref_file file=".opencode/skills/sk-ai-council/SKILL.md" lines="295-298" />.

**Command Modes:** :auto, :confirm, and :deep (proposed for migration from single-round to deep mode) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="82, 91" />.

**Distinctive Value:** Multi-seat opinion synthesis with cross-topic priors. Combines multi-seat deliberation (2-4 seats with different strategy lenses per round) with iterative rounds (adjudicator-verdict stability) and multi-topic sessions (cross-topic findings registry as priors). Converges based on opinion stability across diverse AI vantages <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="77-80" />.

---

## §2 Overlap Inventory

### Overlap Point 1: Trigger-Phrase Overlap on "Convergence" Keyword (CONFUSING)
**Fingerprint:** `use-case-overlap:trigger-phrase:convergence-keyword`  
**Severity:** CONFUSING  
**Evidence:** Deep-review triggers include "convergence detection" <ref_file file=".opencode/skills/deep-review/SKILL.md" line="112" />. Deep-research triggers include "convergence" in CONVERGENCE phase intent signals <ref_file file=".opencode/skills/deep-research/SKILL.md" line="154" />. Sk-ai-council triggers include "council convergence" <ref_file file=".opencode/skills/sk-ai-council/SKILL.md" line="80" />. Operator request "check convergence on the deep-research packet" could route to any skill, but convergence semantics differ significantly (Bayesian coverage-graph signals for deep-review, newInfoRatio for deep-research, adjudicator-verdict stability for deep-council).

### Overlap Point 2: Trigger-Phrase Overlap on "Loop" Keyword (CONFUSING)
**Fingerprint:** `use-case-overlap:trigger-phrase:loop-keyword`  
**Severity:** CONFUSING  
**Evidence:** Deep-review triggers include "review loop" and "iterative review" <ref_file file=".opencode/skills/deep-review/SKILL.md" line="112" />. Deep-research triggers include "research loop" and "iterative research" <ref_file file=".opencode/skills/deep-research/SKILL.md" line="107" />. Operator request "run a loop on the spec folder" could route to either skill, but loop semantics differ (review dimensions vs research angles) and output artifacts differ (review-report.md vs research.md).

### Overlap Point 3: Trigger-Phrase Overlap on "Deep" Keyword (HELPFUL)
**Fingerprint:** `use-case-overlap:trigger-phrase:deep-keyword`  
**Severity:** HELPFUL  
**Evidence:** All three skills use "deep" as prefix: deep-review <ref_file file=".opencode/skills/deep-review/SKILL.md" line="112" />, deep-research <ref_file file=".opencode/skills/deep-research/SKILL.md" line="107" />, deep-ai-council <ref_file file=".opencode/skills/sk-ai-council/SKILL.md" line="92" />. This overlap is HELPFUL because it signals deep-* family membership and shared deep-loop runtime infrastructure. Second word disambiguates (review vs research vs council).

### Overlap Point 4: Output-Artifact Overlap on Findings-Registry.json Naming Pattern (CONFUSING)
**Fingerprint:** `use-case-overlap:output-artifact:findings-registry-naming`  
**Severity:** CONFUSING  
**Evidence:** Deep-review uses `deep-review-findings-registry.json` (prefixed) <ref_file file=".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="82-108" />. Deep-research uses `findings-registry.json` (no prefix) <ref_file file=".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml" lines="94-119" />. Deep-council proposes `findings-registry.json` with canonical fingerprint schema <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="79" />. Naming pattern overlap is confusing because deep-research and deep-council would both write files named `findings-registry.json` but schema/semantics differ (evidence-shaped vs opinion-shaped findings).

### Overlap Point 5: Convergence-Threshold Default Divergence (DANGEROUS)
**Fingerprint:** `use-case-overlap:convergence:threshold-default-divergence`  
**Severity:** DANGEROUS  
**Evidence:** Deep-review default convergenceThreshold is 0.10 <ref_file file=".opencode/commands/deep/start-review-loop.md" line="106" />. Deep-research default convergenceThreshold is 0.05 <ref_file file=".opencode/commands/deep/start-research-loop.md" line="97" />. Deep-council proposes saturation_threshold default of 0.20 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-003.md" lines="77-82" />. This divergence is DANGEROUS because operators familiar with one skill's default may incorrectly assume same default applies to other skills. Semantics also differ (weighted P0/P1/P2 ratio for deep-review, newInfoRatio for deep-research, adjudicator-verdict stability for deep-council). Operator requesting "run with default convergence" could get significantly different iteration counts and stop conditions.

### Overlap Point 6: Operator-Intent Overlap on "Audit the Deep-Research Packet Drift" (CONFUSING)
**Fingerprint:** `use-case-overlap:operator-intent:audit-research-packet`  
**Severity:** CONFUSING  
**Evidence:** Operator request "audit the deep-research packet drift" could route to deep-review (audit code quality of research packet implementation) or deep-research (audit research findings for drift from original topic). Deep-review supports spec-folder review target type <ref_file file=".opencode/commands/deep/start-review-loop.md" lines="101, 174-179" />. Deep-research can be invoked on same topic to re-investigate. Right skill is ambiguous without additional context about whether operator wants code-quality audit (deep-review) or findings-consistency audit (deep-research).

### Overlap Point 7: Operator-Intent Overlap on "Evaluate Options for Architecture Decision" (CONFUSING)
**Fingerprint:** `use-case-overlap:operator-intent:evaluate-architecture-options`  
**Severity:** CONFUSING  
**Evidence:** Operator request "evaluate options for architecture decision" could route to deep-research (discover architecture patterns), deep-review (review existing architecture code for quality), or deep-council (multi-seat deliberation on architecture strategy). Deep-research is appropriate for discovering options via investigation. Deep-review is appropriate if architecture code exists and needs quality audit. Deep-council is appropriate for comparing 2-3 proposed architecture strategies via multi-seat deliberation. Right skill is ambiguous without context about whether options exist (deep-council), need discovery (deep-research), or need code audit (deep-review).

### Overlap Point 8: Operator-Intent Overlap on "Iterate Findings Until Convergence" (DANGEROUS)
**Fingerprint:** `use-case-overlap:operator-intent:iterate-findings-convergence`  
**Severity:** DANGEROUS  
**Evidence:** Operator request "iterate findings until convergence" could route to any skill, as all three use iterative loops with convergence detection. However, convergence semantics and finding types differ significantly: deep-review uses P0/P1/P2 severity tiers with weighted ratio <ref_file file=".opencode/agents/deep-review.md" lines="174-186" />, deep-research uses newInfoRatio without severity tiers <ref_file file=".opencode/agents/deep-research.md" lines="264-269" />, deep-council uses adjudicator-verdict stability without severity tiers <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" line="77" />. Operator expecting P0/P1/P2 severity classification (deep-review style) would get different experience if routed to deep-research or deep-council.

---

## §3 Fixture Routing

### Fixture 1: "deeply audit the embedder sidecar lifecycle hardening for drift"
**Expected Winner:** deep-review  
**Confidence Band:** HIGH  
**Rationale:** Target is code subsystem (embedder sidecar), intent is audit (adversarial framing), dimensions are correctness+security+maintainability. Operator wants to find code defects and drift from hardening requirements, which matches deep-review's adversarial P0 adjudication and coverage-graph signals. Wrong-plausible sibling is deep-research (operator might think "investigate drift" maps to research, but deep-research is for discovering new knowledge, not auditing existing code against requirements).  
**Ambiguity Source:** iter-004 F58 (trigger-phrase overlap "audit" + "drift") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="63-66" />.

### Fixture 2: "investigate whether the spec kit memory schema supports cross-packet negative knowledge"
**Expected Winner:** deep-research  
**Confidence Band:** HIGH  
**Rationale:** Intent is investigation to discover whether a capability exists (knowledge discovery), target is research question about schema capabilities. Matches deep-research's emphasis on negative knowledge (ruled-out directions) and research charter validation. Operator wants to know "does this exist or not," which is research question, not code audit. Wrong-plausible sibling is deep-review (operator might think "review the schema" maps to deep-review, but deep-review requires review_target and focuses on code quality defects, not capability discovery).  
**Ambiguity Source:** iter-004 F59 (operator-intent overlap on "investigate" vs "review") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="67-71" />.

### Fixture 3: "evaluate three proposed strategies for deep-council convergence detection and recommend the best one"
**Expected Winner:** deep-ai-council (proposed)  
**Confidence Band:** HIGH  
**Rationale:** Intent is strategy comparison and recommendation, operator explicitly states "three proposed strategies" exist. Matches deep-council's multi-seat deliberation with different strategy lenses per round. Operator wants opinion synthesis on existing options, not discovery of new options or code audit. Wrong-plausible siblings: deep-research (operator might think "evaluate strategies" maps to research, but deep-research is for discovering options via investigation, not comparing existing options), deep-review (operator might think "review the strategies" maps to deep-review, but deep-review requires code artifacts to audit; strategy comparison is opinion-based, not evidence-based code defect finding).  
**Ambiguity Source:** iter-004 F59 (operator-intent overlap on "evaluate options") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="67-71" />.

### Fixture 4: "run a loop on the deep-research packet until findings stabilize"
**Expected Winner:** deep-review  
**Confidence Band:** MED  
**Rationale:** Operator uses "loop" terminology (iter-004 F52 overlap) but specifies "findings stabilize" which maps to deep-review's Bayesian coverage-graph signals (findingStability, dimensionCoverage). Operator wants adversarial P0 adjudication with severity tiers, which deep-review provides. Deep-research lacks severity tiers and adversarial adjudication. Wrong-plausible sibling is deep-research (operator says "deep-research packet" which could imply deep-research skill, but "findings stabilize" with severity expectations maps to deep-review's convergence semantics).  
**Ambiguity Source:** iter-004 F52 (trigger-phrase overlap "loop") + iter-004 F60 (operator-intent overlap on "iterate findings until convergence") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="32-35, 72-76" />.

### Fixture 5: "check convergence on the embedder testing architecture investigation"
**Expected Winner:** deep-research  
**Confidence Band:** MED  
**Rationale:** Operator uses "convergence" keyword (iter-004 F51 overlap) but specifies "investigation" which maps to deep-research's research charter and negative knowledge emphasis. Operator wants to know when investigation has exhausted new information (newInfoRatio), not when code defects are saturated (deep-review's weighted P0/P1/P2 ratio). Wrong-plausible sibling is deep-review (operator says "convergence" which is deep-review trigger, but "investigation" implies knowledge discovery, not code audit).  
**Ambiguity Source:** iter-004 F51 (trigger-phrase overlap "convergence") + iter-004 F56 (convergence-threshold default divergence) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="27-31, 52-56" />.

### Fixture 6: "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability"
**Expected Winner:** deep-ai-council (proposed)  
**Confidence Band:** HIGH  
**Rationale:** Intent is deliberation on design decision with two existing options (coverage-graph signals vs adjudicator self-scoring). Matches deep-council's multi-seat opinion synthesis. Operator wants diverse AI vantages to weigh trade-offs, not code audit or knowledge discovery. Wrong-plausible siblings: deep-research (operator might think "research the options" maps to deep-research, but options already exist), deep-review (operator might think "review the options" maps to deep-review, but this is design decision, not code audit).  
**Ambiguity Source:** iter-004 F59 (operator-intent overlap on "evaluate options") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="67-71" />.

### Fixture 7: "audit the deep-research packet for drift from the original embedder investigation topic"
**Expected Winner:** deep-research  
**Confidence Band:** MED  
**Rationale:** Intent is findings-consistency audit (drift from original topic), not code-quality audit. Operator wants to verify that research findings remain aligned with original investigation charter, which matches deep-research's research charter validation and negative knowledge emphasis. Deep-research can re-investigate topic to check for drift. Wrong-plausible sibling is deep-review (operator says "audit" which is deep-review trigger, but audit target is findings consistency, not code quality).  
**Ambiguity Source:** iter-004 F58 (operator-intent overlap on "audit the deep-research packet drift") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="63-66" />.

### Fixture 8: "iterate on the spec folder until the architecture decision converges"
**Expected Winner:** deep-ai-council (proposed) — TIE-BREAKER  
**Confidence Band:** LOW (genuinely contested)  
**Rationale:** Operator uses "iterate" and "converge" (iter-004 F60 overlap) but specifies "architecture decision" which implies design decision with existing options. Deep-council is best fit because architecture decisions typically involve comparing 2-3 proposed strategies via multi-seat deliberation. Deep-review is wrong because architecture decisions are opinion-based, not code defect finding. Deep-research is wrong because options likely already exist (operator says "the architecture decision" singular, implying specific decision under deliberation). Tie-breaker rationale: Deep-council wins because (1) "architecture decision" strongly implies multi-seat deliberation on existing options, (2) deep-review's adversarial P0 adjudication is poor fit for opinion-based decisions, (3) deep-research's newInfoRatio convergence assumes knowledge discovery, not option comparison. However, this fixture is intentionally ambiguous to test routing robustness — clarifying question would be ideal in production.  
**Ambiguity Source:** iter-004 F60 (operator-intent overlap on "iterate findings until convergence") + iter-004 F59 (operator-intent overlap on "evaluate architecture options") <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="72-76, 67-71" />.

---

## §4 Strategy Options

### Strategy A: Keep-Distinct (Status Quo + Sharpening)

**Description:** Each skill stays separate; advisor rules disambiguate via lexical/structural/prior-art signals. SKILL.md files updated to clarify trigger phrases and convergence semantics. Advisor routing rules encode disambiguation logic from iter-005 fixture analysis.

**Cost:** Low. Changes limited to SKILL.md keyword trigger sections and advisor rule configuration. No breaking changes to command surfaces, state file schemas, or runtime infrastructure. Primary work is documentation sharpening (e.g., renaming `findings-registry.json` to `deep-research-findings-registry.json` for consistency with deep-review's prefixed naming pattern) and advisor rule implementation.

**Risk:** Medium. Overlap continues to confuse operators without perfect advisor disambiguation. The 2 DANGEROUS overlap findings (F56: convergence-threshold default divergence, F60: iterate findings until convergence) remain operator-facing risks. If advisor rules fail to disambiguate (e.g., LOW-confidence fixture F-fixture-008), operators may still be routed to wrong skill. Risk is bounded because no runtime changes required — bad routing decision is recoverable via operator correction.

**When to Choose:** If iter-004 overlap surfaces are all <severity:DANGEROUS (NOT the case — F56 and F60 are DANGEROUS) OR if iter-005 fixtures show advisor rules can achieve ≥ 90% routing accuracy with clarifying questions for contested cases. Strategy A is default fallback if no clear merge case emerges, as it preserves distinct value propositions (adversarial P0 adjudication for deep-review, negative knowledge for deep-research, multi-seat opinion synthesis for deep-council).

---

### Strategy B: Merge Two-of-Three

**Description:** Pick two most overlapping skills and unify into single skill with mode flags. Based on iter-004 overlap analysis, strongest merge candidates are deep-review + deep-research → unified `deep-investigate` skill, since both share 6 executor kinds, PRE-BOUND SETUP ANSWERS schema, and JSONL append-only state pattern. Deep-council remains distinct due to multi-seat deliberation and 3-level state hierarchy.

**Cost:** High. Breaking changes to command surface: `/deep:start-review-loop` and `/deep:start-research-loop` commands deprecated in favor of `/spec_kit:deep-investigate :review` and `/spec_kit:deep-investigate :research`. Packet renames required. Runtime refactor: YAML workflows need conditional logic for review vs research mode (different input fields: 7 vs 5 mandatory fields, different convergence semantics: P0/P1/P2 weighted ratio vs newInfoRatio). Migration path for existing sessions (deep-review-state.jsonl → deep-investigate-state.jsonl) required.

**Risk:** High. Loses adversarial-vs-evidence distinction core to deep-review's unique value. Merging requires mode-specific convergence logic in single runtime, increasing complexity and bug surface. Operators familiar with deep-review's P0/P1/P2 severity tiers confused if routed to deep-investigate without mode context. Merge risks losing deep-research's negative knowledge emphasis if unified skill defaults to review-style severity tiers.

**When to Choose:** Only if iter-004 shows ≥ 3 DANGEROUS overlap points (currently only 2: F56, F60) AND iter-005 fixtures demonstrate advisor rules cannot achieve ≥ 80% routing accuracy even with clarifying questions. Currently, overlap severity distribution (2 DANGEROUS, 4 CONFUSING, 4 HELPFUL) does not justify high cost/risk of merge. Distinct value propositions (adversarial P0 adjudication, negative knowledge, multi-seat opinion synthesis) are strong arguments against merging.

---

### Strategy C: Unify-With-Mode-Suffix (`/spec_kit:deep :review|:research|:council`)

**Description:** Single deep command surface with mode suffixes selecting skill internally. `/spec_kit:deep :review` dispatches to deep-review, `/spec_kit:deep :research` dispatches to deep-research, `/spec_kit:deep :council` dispatches to deep-council. Advisor rules simplify to mode recommendation rather than skill selection. Existing commands (`/deep:start-review-loop`, `/deep:start-research-loop`) become aliases or deprecation warnings.

**Cost:** Medium. Rename existing commands to mode suffixes (e.g., `deep-review.md` → `deep.md` with `:review` mode logic). Advisor rule simplification: instead of 3-way skill disambiguation, advisor recommends mode suffix. Migration path: operators on `/deep:start-review-loop` see deprecation warning pointing to `/spec_kit:deep :review`. No runtime refactor required — each mode still dispatches to existing YAML workflow and LEAF agent. Primary cost is command entrypoint unification and documentation updates.

**Risk:** Medium. Mode suffix is operator-facing and requires migration. Operators familiar with `/deep:start-review-loop` confused by new `/spec_kit:deep :review` syntax. Unification could obscure distinct value propositions if documentation does not clearly explain when to use each mode. Risk lower than Strategy B because no runtime changes required — underlying skills remain intact, only command surface changes.

**When to Choose:** If iter-004 shows shared substrate but distinct intents (true: all three share deep-loop-runtime primitives, executor config, JSONL state pattern, but have distinct convergence semantics and value propositions). Strategy C is middle ground between Strategy A (keep distinct) and Strategy B (merge) — unifies command surface for discoverability while preserving underlying skill distinctions. Particularly appropriate if advisor's confidence bands (HIGH/MED/LOW from iter-005 fixtures) map cleanly to mode recommendations.

---

### Strategy D: Hybrid (Extract Shared Primitives, Keep Distinct Entrypoints)

**Description:** Current direction with deep-loop-runtime already extracting shared primitives (loop-lock, jsonl-repair, atomic-state, executor-audit). Sharpen further by extracting more shared primitives if iter-001-003 show additional shared schema (e.g., unify findings-registry schema across all three skills, standardize convergence-threshold defaults). Keep distinct command entrypoints (`/deep:start-review-loop`, `/deep:start-research-loop`, `/deep:ask-ai-council`) but reduce runtime duplication via shared libraries.

**Cost:** Low-Medium. Extract additional primitives from deep-loop-runtime or create new shared modules (e.g., `convergence-threshold-validator.ts` to surface appropriate defaults per skill). No breaking changes to command surfaces. Primary cost is library refactoring to identify and extract shared logic. Iter-004 F54 (findings-registry naming overlap) suggests low-cost fix: rename deep-research's `findings-registry.json` to `deep-research-findings-registry.json` for consistency.

**Risk:** Low. No breaking changes to command surfaces or state file schemas. Operators see no disruption. Risk primarily technical: over-extraction could create tight coupling between skills, making future divergence harder. Risk manageable by keeping shared primitives focused on infrastructure (loop management, state persistence) rather than domain logic (convergence semantics, finding types).

**When to Choose:** Default if no clear merge case (Strategy B) or mode-unification case (Strategy C) emerges. Strategy D is current trajectory (deep-loop-runtime already exists) and aligns with distinct value propositions identified in iter-001-003. The 2 DANGEROUS overlap findings (F56, F60) can be addressed via low-cost hybrid fixes (standardize threshold defaults, improve advisor disambiguation) without requiring full merge or command-surface unification.

---

## §5 Recommendation

### Strategy Chosen: Strategy D (Hybrid)

**Rationale:** 

1. **Distinct value propositions are strong:** Iter-001-003 identified clear unique value for each skill (adversarial P0 adjudication for deep-review <ref_file file=".opencode/agents/deep-review.md" lines="182-183" />, negative knowledge for deep-research <ref_file file=".opencode/agents/deep-research.md" lines="181-222, 264-269" />, multi-seat opinion synthesis for deep-council <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md" lines="77-80" />). Merging (Strategy B) would lose these distinctions.

2. **Overlap severity does not justify merge:** Only 2 DANGEROUS overlap findings (F56: convergence-threshold default divergence, F60: iterate findings until convergence) vs 4 CONFUSING and 4 HELPFUL <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="52-56, 72-76" />. The DANGEROUS findings can be addressed via low-cost hybrid fixes (threshold default standardization, advisor disambiguation).

3. **Current trajectory is hybrid:** Deep-loop-runtime already extracts shared primitives <ref_file file=".opencode/skills/deep-loop-runtime/SKILL.md" lines="126-135" />. Strategy D extends this direction rather than reversing it.

4. **Operator disruption is minimal:** Strategy D requires no command-surface changes, unlike Strategy C (mode suffix migration) or Strategy B (breaking changes).

5. **Fixture routing accuracy is achievable:** Iter-005 fixtures show that lexical/structural/prior-art signals can disambiguate most cases (7/8 fixtures have HIGH or MED confidence) <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-005.md" lines="23-168" />. Only F-fixture-008 is genuinely contested (LOW confidence), which can be handled via clarifying questions in advisor rules.

6. **Cost-latency analysis supports hybrid:** Iter-007 showed that cost drivers are executor-specific (swe-1.6 free vs paid executors) and convergence-threshold defaults, not skill-specific <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-007.md" lines="30-99" />. Hybrid fixes (standardize defaults, surface cost implications) address root causes without requiring merge.

### Routing Rule

**Winning Candidate:** Candidate 3 (Lexical + Structural + Prior-Art) from iter-008 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-008.md" lines="186-340" />.

**Formula:** Lexical baseline (weight=1.0 per trigger phrase) + structural signals (weight=2.0 per intent classification, target type detection, convergence expectation) + prior-art signals (weight=3.0 per session state, artifact context, operator history).

**Fixture Accuracy:** 7/8 (87.5%) with prior-art context, 5/8 (62.5%) without prior-art context. Zero wrong-with-high-confidence failures.

**Implementation:** Implement Candidate 3 with fallback to Candidate 2 (Lexical + Structural) when prior-art context unavailable. Add clarifying question protocol for LOW-confidence fixtures (e.g., fixture 008) and contested semantic disambiguation (e.g., fixture 005: "convergence on investigation" vs "convergence on review").

### Confidence Band

**MED-HIGH (0.75-0.85)**

Confidence is not HIGH because iter-007 (cost-latency dimension) surfaced additional DANGEROUS findings (F77: wrong-skill dispatch cost waste, F78: convergence-threshold cost expectation mismatch) that could shift calculus if future analysis shows deeper cost asymmetries. However, Strategy D's low-risk profile and alignment with current trajectory make it the robust choice.

### Re-Deliberation Triggers

Re-open this packet's differentiation verdict if:
1. A 4th deep-* skill ships (e.g., deep-planning, deep-optimization) — new skill may introduce overlap patterns that invalidate current routing rules.
2. Deep-council implementation reveals that multi-seat cost amplification (F73) makes it impractical for common use cases, forcing a merge with deep-research or deep-review.
3. Advisor routing accuracy falls below 80% on expanded fixture suite (e.g., mixed-spec-folder-and-research-topic requests, cross-skill handoff scenarios).
4. Convergence-threshold standardization (addressing F56) proves infeasible due to skill-specific convergence semantics that cannot be unified without losing distinct value.

---

## §6 Parity Invariants

### Invariant 1: "Convergence keyword disambiguation by secondary context"

**Skill-Pair:** deep-review vs deep-research  
**Overlap Point:** iter-004 F51 (trigger-phrase overlap on "convergence" keyword) + iter-008 fixture 005 failure mode <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="27-31" />.

**Fixture Prompt:** "check convergence on the embedder testing architecture investigation"

**Expected Advisor Output:**
- Winner skill: `deep-research`
- Confidence band: ≥ 0.75 (HIGH)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.40

**Rationale:** Prompt contains "convergence" (deep-review trigger) but "investigation" is secondary context. Per iter-008 Candidate 3, structural signals should weight "investigation" (weight=2.0) higher than "convergence" (weight=1.0 lexical). Invariant ensures convergence keyword alone does not override investigation context.

**Drift Signal:** If deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60, boundary has drifted. This indicates "convergence" keyword is overpowering "investigation" structural signal, breaking disambiguation rule from iter-008.

**Test File Path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-009.md" lines="171-408" />.

---

### Invariant 2: "Audit intent disambiguation by target type"

**Skill-Pair:** deep-review vs deep-research  
**Overlap Point:** iter-004 F58 (operator-intent overlap on "audit the deep-research packet drift") + iter-005 fixture 007 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="63-66" />.

**Fixture Prompt:** "audit the deep-research packet for drift from the original embedder investigation topic"

**Expected Advisor Output:**
- Winner skill: `deep-research`
- Confidence band: ≥ 0.70 (HIGH-MED)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.50

**Rationale:** Prompt contains "audit" (deep-review trigger) but "deep-research packet" + "investigation topic" are structural signals for deep-research. Per iter-008 Candidate 3, prior-art signals (weight=3.0) should boost deep-research if deep-research session exists. Invariant ensures audit keyword alone does not override packet-context structural signals.

**Drift Signal:** If deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60, boundary has drifted. This indicates "audit" keyword is overpowering "deep-research packet" structural signal, breaking findings-consistency audit vs code-quality audit distinction.

**Test File Path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-009.md" lines="171-408" />.

---

### Invariant 3: "Multi-seat deliberation vs single-executor loop"

**Skill-Pair:** deep-review vs deep-council  
**Overlap Point:** iter-004 F60 (operator-intent overlap on "iterate findings until convergence") + iter-005 fixture 008 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="72-76" />.

**Fixture Prompt:** "iterate on the spec folder until the architecture decision converges"

**Expected Advisor Output:**
- Winner skill: `deep-ai-council` (proposed)
- Confidence band: ≥ 0.65 (MED-HIGH)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.45

**Rationale:** Prompt contains "iterate" and "converge" (ambiguous between skills) but "architecture decision" implies option comparison via multi-seat deliberation. Per iter-008 Candidate 3, structural signals should weight "architecture decision" (weight=2.0) for deep-council. Invariant ensures loop terminology alone does not override multi-seat deliberation intent.

**Drift Signal:** If deep-review confidence ≥ 0.55 OR deep-council confidence < 0.55, boundary has drifted. This indicates "iterate" + "converge" keywords are overpowering "architecture decision" structural signal, breaking multi-seat vs single-executor distinction.

**Test File Path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-009.md" lines="171-408" />.

---

### Invariant 4: "Research charter vs adversarial adjudication"

**Skill-Pair:** deep-research vs deep-council  
**Overlap Point:** iter-004 F59 (operator-intent overlap on "evaluate architecture options") + iter-005 fixture 006 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="67-71" />.

**Fixture Prompt:** "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability"

**Expected Advisor Output:**
- Winner skill: `deep-ai-council` (proposed)
- Confidence band: ≥ 0.80 (HIGH)
- Runner-up skill: `deep-research`
- Runner-up confidence: < 0.30

**Rationale:** Prompt contains "whether" (deep-research trigger for existence checks) but "deliberate" + "coverage-graph signals vs adjudicator self-scoring" implies option comparison via multi-seat deliberation. Per iter-008 Candidate 3, structural signals should weight "deliberate" (weight=2.0) for deep-council. Invariant ensures "whether" keyword alone does not override deliberation intent.

**Drift Signal:** If deep-research confidence ≥ 0.40 OR deep-council confidence < 0.70, boundary has drifted. This indicates "whether" keyword is overpowering "deliberate" structural signal, breaking research charter vs multi-seat opinion synthesis distinction.

**Test File Path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-009.md" lines="171-408" />.

---

### Invariant 5: "Loop keyword disambiguation by intent framing"

**Skill-Pair:** deep-review vs deep-research  
**Overlap Point:** iter-004 F52 (trigger-phrase overlap on "loop" keyword) + iter-005 fixture 004 <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-004.md" lines="32-35" />.

**Fixture Prompt:** "run a loop on the deep-research packet until findings stabilize"

**Expected Advisor Output:**
- Winner skill: `deep-review`
- Confidence band: ≥ 0.70 (HIGH-MED)
- Runner-up skill: `deep-research`
- Runner-up confidence: < 0.50

**Rationale:** Prompt contains "loop" (ambiguous trigger) but "findings stabilize" maps to deep-review's Bayesian coverage-graph signals (findingStability dimension). Per iter-008 Candidate 3, structural signals should weight "findings stabilize" (weight=2.0) for deep-review. Invariant ensures loop keyword alone does not override convergence expectation structural signal.

**Drift Signal:** If deep-research confidence ≥ 0.55 OR deep-review confidence < 0.60, boundary has drifted. This indicates "loop" keyword is overpowering "findings stabilize" structural signal, breaking review-loop vs research-loop distinction.

**Test File Path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` <ref_file file=".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/iterations/iter-009.md" lines="171-408" />.

---

## Appendix: Research Metadata

**Total Iterations:** 10  
**Total Findings:** 100 fingerprints  
**Total Invariants:** 5 parity-test invariants  
**Research Duration:** ~3 hours (2026-05-23T06:08:00Z → 2026-05-23T09:05:00Z)  
**Convergence Threshold:** 0.2 novelty rate  
**Actual Convergence:** Iter-004 novelty rate 0.24 (above threshold), iter-005 novelty rate 0.129 (below threshold), iter-006 novelty rate 0.40 (combined iter-004/005), iter-007-009 novelty rates < 0.2. Converged at iter-010 synthesis per protocol.

**Key Sources:**
- `.opencode/commands/deep/start-review-loop.md` — deep-review command entrypoint
- `.opencode/commands/deep/start-research-loop.md` — deep-research command entrypoint
- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md` — deep-council proposal
- `.opencode/agents/deep-review.md` — deep-review LEAF agent
- `.opencode/agents/deep-research.md` — deep-research LEAF agent
- `.opencode/skills/sk-ai-council/SKILL.md` — current sk-ai-council surface
- `.opencode/skills/deep-loop-runtime/SKILL.md` — shared runtime infrastructure
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` — advisor routing logic
