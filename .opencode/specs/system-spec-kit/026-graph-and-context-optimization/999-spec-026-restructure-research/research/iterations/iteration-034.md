I'm in read-only mode per the research iteration constraints. Here is the iteration-034.md content that should be written to the specified path:

---

# Iter 034 — Track 8: naming conventions lock-in

## Question / Evidence / Findings

### Current patterns (with examples)

**Pattern 1: Verb-first (action-oriented)**
- Examples: `hook-parity-remediation`, `copilot-hook-parity-remediation`, `codex-hook-parity-remediation`, `claude-hook-findings-remediation`, `opencode-plugin-loader-remediation`, `copilot-wrapper-schema-fix`, `copilot-writer-wiring`, `docs-remediation`, `fix-iteration-quality-meta-research`, `broader-scope-excludes-and-granular-skills`, `real-world-usefulness-test`, `doctor-apply-mode-phase-b`, `rm8-013-remediation-doc-honesty-security`, `system-code-graph-extraction`, `code-graph-upgrades`, `code-graph-self-contained-package`, `code-graph-context-and-scan-scope`, `code-graph-hook-improvements`, `code-graph-advisor-refinement`, `code-graph-doctor-command`, `code-graph-resilience-research`, `code-graph-backend-resilience`, `skill-advisor-graph`, `skill-advisor-docs-and-code-alignment`, `smart-router-remediation-and-opencode-plugin`, `skill-advisor-hook-surface`, `skill-graph-daemon-and-advisor-unification`, `skill-advisor-plugin-hardening`, `skill-advisor-standards-alignment`, `skill-advisor-hook-improvements`, `skill-advisor-setup-command`, `skill-advisor-semantic-lane`, `embed-cache-and-cosine-wiring`, `ablation-sweep-and-promote`, `weight-sweep-harness`, `corpus-seeded-sweep`, `skill-metadata-quality-audit`, `apply-metadata-fixes-and-resweep`, `harder-intent-corpus-resweep`, `populate-intent-signals-and-relationships`, `system-skill-advisor-extraction`, `advisor-routing-calibration`, `cli-devin-skill-advisor-hook`, `cross-skill-auto-propagation`
- Count: ~45 packets (40% of total)
- Characteristics: Describes the action or problem being solved; often includes "remediation", "fix", "sweep", "extraction", "upgrades", "improvements"
- Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="38-47" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="17-59" />

**Pattern 2: Noun-first (surface-oriented)**
- Examples: `code-graph`, `skill-advisor`, `hook-parity`, `template-levels`, `memory-indexer-invariants`, `causal-graph-channel-routing`, `cocoindex-daemon-resilience`, `resource-map-template`, `continuity-memory-runtime`, `runtime-executor-hardening`, `graph-impact-and-affordance-uplift`, `doctor-update-orchestrator`, `local-llama-cpp`, `global-security-sweep-and-supply-chain-audit`, `release-cleanup`, `research-and-baseline`, `end-user-scope-default`, `template-consolidation-investigation`, `template-greenfield-redesign`, `template-greenfield-impl`, `deferred-followups`, `skill-references-assets-alignment`, `command-md-yaml-alignment`, `fleet-marker-validation-sweep`, `z-archive-marker-validation-sweep`, `rm-8-prompt-hardening`, `prefix-registry-architecture`, `model-installation-and-compat`, `mcp-config-rollout`, `vec-store-rebuild`, `q4-quantization`, `bge-m3-hybrid-evaluation`, `voyage-cleanup-and-egress-monitoring`, `finalize-and-commit`, `cocoindex-ipc-fix`, `cocoindex-code-only-patterns`, `embeddinggemma-unification`, `v3-remediation`, `v4-cleanup`, `onnx-cross-platform-backend`, `node-llama-cpp-evaluation`, `llama-cpp-retrieval-quality-probe`, `llama-cpp-default-flip`, `llama-ccp-auto-migration`, `readme-resource-map`, `catalog-playbook-alignment-audit`, `local-llm-legacy-review`, `post-remediation-re-review`, `post-remediation-v2-re-review`, `llm-model-runtime-inventory`, `post-batch-11-re-review`, `post-batch-12-final-re-review`, `post-029-final-re-review`, `post-batch-15-final-re-review`, `llama-cpp-embedding-worker-deep-dive`, `llama-cpp-metal-investigation`, `cocoindex-coreml-ep-investigation`, `design-and-decision-record`, `scaffold-skill`, `physical-move-and-database`, `rewire-consumers-and-tool-registration`, `doc-and-runtime-migration`, `validation-and-cleanup`, `mcp-topology-pivot`, `orphan-code-graph-db-cleanup`, `tsconfig-references-restructure`, `mcp-tool-rename-mk-code-index`, `skill-docs-sk-doc-alignment`, `system-spec-kit-codegraph-residue-audit`, `readmes-update`, `architecture-md`, `public-readme-update`, `manual-testing-verification`, `deep-review-campaign-010-016`, `deep-review-remediation`, `deferred-fix-followup`, `mcp-namespace-operational-sweep`, `code-folder-readmes`, `cli-devin-code-graph-hook`, `system-code-graph-comprehensive-deep-review`, `system-code-graph-deep-review-remediation`, `system-code-graph-deferred-followon`, `three-way-isolation-finalize`
- Count: ~60 packets (53% of total)
- Characteristics: Describes the surface, component, or subsystem being addressed; often includes technical nouns like "code-graph", "skill-advisor", "hook-parity", "template", "memory", "cocoindex"
- Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md" lines="14-68" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="17-59" />

**Pattern 3: Problem-statement (descriptive sentences)**
- Examples: `global-security-sweep-and-supply-chain-audit` (31 chars), `graph-impact-and-affordance-uplift` (32 chars), `runtime-executor-hardening` (mild mismatch but still noun-first), `broader-scope-excludes-and-granular-skills` (43 chars), `fix-iteration-quality-meta-research` (39 chars), `rm8-013-remediation-doc-honesty-security` (47 chars)
- Count: ~5 packets (4% of total)
- Characteristics: Long, descriptive names that attempt to capture the full problem statement in the folder name; often result in unwieldy names that obscure the core domain
- Evidence: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-031.md" lines="23-30" /> <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-032.md" lines="40-55" />

### Scoring

| Pattern | Brevity | Recall | Consistency-with-rest-of-026 | Stability | Score |
|---------|---------|--------|---------------------------|----------|-------|
| **Verb-first** | 7/10 | 6/10 | 6/10 | 7/10 | **26/40 (65%)** |
| **Noun-first** | 8/10 | 9/10 | 9/10 | 8/10 | **34/40 (85%)** |
| **Problem-statement** | 3/10 | 4/10 | 5/10 | 4/10 | **16/40 (40%)** |

**Scoring rationale:**
- **Brevity**: Noun-first wins (8/10) because it uses concise technical nouns (e.g., "code-graph", "skill-advisor") vs verb-first's compound phrases (e.g., "remediation", "improvements"). Problem-statement loses points for extreme verbosity (30+ chars).
- **Recall**: Noun-first wins (9/10) because it surfaces the core domain/subsystem (e.g., "code-graph", "skill-advisor") which is what operators search for. Verb-first requires knowing the action (e.g., "remediation") which is less discoverable. Problem-statement scores lowest because long names are hard to recall.
- **Consistency-with-rest-of-026**: Noun-first wins (9/10) because it's the dominant pattern across 026 (53% of packets). Verb-first is common but less consistent (40%). Problem-statement is rare (4%) and inconsistent.
- **Stability**: Noun-first wins (8/10) because technical nouns are stable over time (the "code-graph" surface persists regardless of implementation changes). Verb-first can become stale as remediations complete or problems evolve. Problem-statement is least stable as problem statements drift over time.

### Recommended convention

- **Rule:** Use noun-first naming for all new 026 packets. Surface the core domain, subsystem, or component in the name. Use verb-first only for clear action-oriented remediation packets where the action is the primary identity (e.g., "remediation" packets for security or deep-review findings). Avoid problem-statement naming entirely—capture problem details in spec.md, not folder names.

- **Rationale:** Noun-first naming scores highest across all dimensions (85% overall). It is the dominant pattern in 026 (53% of packets), ensuring consistency. It maximizes recall by surfacing the core domain (e.g., "code-graph", "skill-advisor") which is what operators search for when navigating the spec tree. It is more stable over time because technical nouns persist while actions (remediation, improvements) become stale as work completes. Verb-first naming is acceptable for remediation packets where the action is the primary identity, but should be the exception, not the rule. Problem-statement naming should be avoided entirely—it scores lowest on all dimensions and creates unwieldy names that obscure the core domain.

- **Examples (3-5): old name → new name**
  - `014-local-llama-cpp` → `014-local-embeddings-setup-a` (noun-first, surfaces "embeddings" domain instead of narrow "llama-cpp" backend)
  - `015-global-security-sweep-and-supply-chain-audit` → `015-tanstack-security-audit` (noun-first, surfaces triggering event "tanstack" instead of verbose problem statement)
  - `006-graph-impact-and-affordance-uplift` → `006-external-project-adoption` (noun-first, surfaces "external-project" domain instead of abstract "impact-and-affordance")
  - `002-resource-map-template` → `002-resource-map-and-deep-loop-fix` (noun-first, captures full scope including deep-loop fix)
  - `003-rm8-013-remediation-doc-honesty-security` → `003-rm8-013-remediation` (noun-first, removes verbosity while preserving core identity)

## Gaps / JSONL delta row

### Gaps
- Need to verify that the recommended noun-first convention doesn't conflict with any existing conventions in the broader codebase outside 026
- Should assess whether the verb-first exception for remediation packets needs guardrails (e.g., when to use "remediation" vs "fix" vs "sweep")
- Need to confirm that the recommended renames from iter 033 align with the noun-first convention before finalizing

### JSONL delta row

```json
{"track": 8, "iter_id": "034", "timestamp": "2026-05-15T23:18:00Z", "status": "complete", "patterns_analyzed": 3, "pattern_verb_first_count": 45, "pattern_noun_first_count": 60, "pattern_problem_statement_count": 5, "recommended_convention": "noun-first", "recommended_convention_score": 85, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-031.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-032.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md"]}
```
