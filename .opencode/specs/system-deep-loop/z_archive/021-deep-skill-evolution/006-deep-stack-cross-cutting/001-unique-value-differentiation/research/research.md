# Research Synthesis: Deep Skills Unique-Value Differentiation

**Packet:** 116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation  
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
