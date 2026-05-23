---
executor: cli-devin
model: swe-1.6
iter: 3
started_at: 2026-05-23T08:15:00.000Z
finished_at: 2026-05-23T08:18:00.000Z
target_dimension: contract-surface
---

# Iter-003: Deep-AI-Council Contract Characterization (Proposed)

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review characterization (baseline priors)
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research characterization (baseline priors)
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
4. `.opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md` — proposed deep-council scope, phase map, cost guards
5. `.opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design/spec.md` — proposed architecture research scope
6. `.opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design/plan.md` — proposed architecture execution sequence
7. `.opencode/skills/sk-ai-council/SKILL.md` — current single-round single-topic sk-ai-council surface
8. `.opencode/specs/skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation/ai-council/council-report.md` — example council-report.md artifact shape
9. `.opencode/skills/deep-loop-runtime/SKILL.md` — shared runtime primitives deep-council would consume

## Findings

### F33 — Input shape requires 6 mandatory setup fields (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:input-shape-6-fields`
**Severity:** info
**Evidence:** Packet 129 spec.md lines 77-82 propose 6 cost-guard fields for deep-council setup: `max_rounds_per_topic` (default 3), `max_topics_per_session` (default 5), `saturation_threshold` (default 0.2), plus implicit fields from current sk-ai-council: deliberation_topic, seat configurations, executor.*. This is 1 fewer field than deep-review (7 fields) and 1 more field than deep-research (5 fields). The cost-guard defaults are explicitly proposed in the In Scope section. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77-82]

### F34 — Input shape supports multi-topic deliberation (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:multi-topic-input`
**Severity:** info
**Evidence:** Packet 129 spec.md line 78 proposes multi-topic session support: "one spec folder hosts N topics, each topic has its own rounds/seats, cross-topic findings registry persists across topics." Unlike deep-review (single review_target) and deep-research (single research_topic), deep-council would accept N deliberation_topic values in a single session. This is a structural divergence from sibling skills. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:78]

### F35 — Input shape supports seat configurations with strategy lenses (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:seat-configurations`
**Severity:** info
**Evidence:** Current sk-ai-council SKILL.md lines 308-313 document seat selection with "two or three distinct council seats with different reasoning lenses and, when real executors are available, different AI vantage targets." Packet 129 spec.md line 77 proposes retaining seat configurations in deep mode. Unlike deep-review and deep-research (which use a single executor per iteration), deep-council uses multi-seat deliberation within each round. This is a structural divergence. [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:308-313; .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77]

### F36 — Input shape supports 6 executor kinds (PROPOSED, inferred from current sk-ai-council)
**Fingerprint:** `contract-surface:deep-council:executor-kinds-6`
**Severity:** info
**Evidence:** Current sk-ai-council SKILL.md lines 18-25 document in-CLI and external-CLI dispatch modes, with external-CLI dispatch invoked via cli-* skill family (cli-claude-code, cli-codex, cli-opencode). Packet 129 spec.md line 89 proposes keeping the "one-CLI-per-round invariant" in deep mode. This implies deep-council would support the same 6 executor kinds as deep-review and deep-research (native, cli-codex, cli-gemini, cli-claude-code, cli-opencode, cli-devin) but with the constraint that all seats within one round must use the same CLI. [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:18-25; .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:89]

### F37 — Output artifacts include per-topic per-round seat artifacts (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:output-artifacts-seat-tree`
**Severity:** info
**Evidence:** Packet 129 spec.md line 78 proposes the artifact structure: "ai-council/topics/topic-NNN/rounds/round-NNN/seats/". Current sk-ai-council SKILL.md lines 396-397 document folder_layout.md with ai-council/seats/round-001/ structure. Deep-council would extend this to N topics × M rounds per topic. This is a structural divergence from deep-review (iterations/iteration-{NNN}.md) and deep-research (iterations/iteration-{NNN}.md), which have a flat iteration structure. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:78; .opencode/skills/sk-ai-council/SKILL.md:396-397]

### F38 — Output artifacts include findings-registry with canonical fingerprint (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:output-artifacts-findings-registry`
**Severity:** info
**Evidence:** Packet 129 spec.md line 79 proposes "session-wide findings registry keyed by canonical fingerprint" with schema mirroring deep-review/deep-research (`{angle}:{topic-slug}:{claim-slug}`). Packet 129 spec.md line 31 lists an open question: "Findings registry schema — borrow deep-review's directly or specialize for opinion-shaped findings?" This matches deep-review's deep-review-findings-registry.json and deep-research's findings-registry.json structure. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:79, 31]

### F39 — Output artifacts include per-topic council-report.md (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:output-artifacts-council-report`
**Severity:** info
**Evidence:** Packet 129 spec.md line 140 lists an open question: "Should deep-council write a single council-report.md per topic OR one session-wide synthesis that references per-topic reports?" The example council-report.md from packet 117 shows 12 sections: Council Composition, Seat outputs, Task Classification, Strategy Comparison, Deliberation Notes, Winning Strategy, Recommended Plan, Implementation Steps, Prerequisites, Cross-References, Dropped Alternatives, Risks & Mitigations. This is distinct from deep-review's 9-section review-report.md and deep-research's 17-section research.md. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:140; .opencode/specs/skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation/ai-council/council-report.md:1-125]

### F40 — Output artifacts include session-report.md (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:output-artifacts-session-report`
**Severity:** info
**Evidence:** Packet 129 spec.md line 78 proposes "session-wide findings registry" and line 140 asks about "one session-wide synthesis that references per-topic reports." This implies a session-report.md artifact that aggregates findings across all topics, similar to deep-review's review-report.md and deep-research's research.md synthesis outputs. This is a structural addition not present in current sk-ai-council (which only has per-round council-report.md). [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:78, 140]

### F41 — State files include 3-level JSONL hierarchy (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:state-files-3-level-jsonl`
**Severity:** info
**Evidence:** Packet 129 spec.md line 88 proposes schemas: "council-config.json, topic-config.json, round-state.jsonl, findings-registry.json, session-state.jsonl." Packet 129 001/spec.md line 88 also lists these schemas. This is a 3-level hierarchy (session → topic → round) unlike deep-review and deep-research which have a 2-level hierarchy (session → iteration). Current sk-ai-council has ai-council-state.jsonl (single-level). [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:88; .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design/spec.md:88]

### F42 — State file ownership is split between main loop and seat agents (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:state-ownership-split`
**Severity:** info
**Evidence:** Current sk-ai-council SKILL.md lines 312-313 document that seat agents write individual seat artifacts under ai-council/seats/, while the main loop persists council-report.md and ai-council-state.jsonl. Packet 129 spec.md line 77 proposes retaining this pattern in deep mode with the addition of topic-level and session-level state owned by the main loop. This matches deep-review and deep-research's split ownership pattern (main loop owns config/registry/strategy, LEAF agent owns iteration artifacts). [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:312-313; .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77]

### F43 — Convergence semantics use per-topic adjudicator-verdict stability (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:convergence-adjudicator-stability`
**Severity:** info
**Evidence:** Packet 129 spec.md line 77 proposes "iteration semantics: multi-round deliberation within a topic, adjudicator scores Round-N→N+1 stability + saturation, convergence when stability ≥ threshold OR max-rounds reached." Current sk-ai-council SKILL.md lines 295-298 document the two-of-three convergence rule or adjudicator independent ruling for single-round councils. Deep-council would extend this to multi-round stability scoring. This is distinct from deep-review's Bayesian coverage-graph signals and deep-research's newInfoRatio calculation. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77; .opencode/skills/sk-ai-council/SKILL.md:295-298]

### F44 — Convergence semantics include session-level saturation across topics (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:convergence-session-saturation`
**Severity:** info
**Evidence:** Packet 129 spec.md line 80 proposes "saturation/novelty detection: per-topic AND session-level; reuse deep-loop-runtime primitives where shape matches." Packet 129 spec.md line 77 defines cost-guard `saturation_threshold` (default 0.2). This is a dual-level convergence mechanism (per-topic + session-level) unlike deep-review and deep-research which have single-level convergence (session-level only). [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77, 80]

### F45 — Convergence semantics do NOT include severity tiers (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:convergence-no-severity-tiers`
**Severity:** info
**Evidence:** Packet 129 spec.md lines 77-82 propose cost guards (max_rounds_per_topic, max_topics_per_session, saturation_threshold) but do not mention finding severity tiers like deep-review's P0/P1/P2 classification. Packet 129 spec.md line 31 lists an open question about findings registry schema for "opinion-shaped findings" vs deep-review's evidence-shaped findings. This suggests deep-council may not use severity tiers, similar to deep-research which also lacks severity tiers. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77-82, 31]

### F46 — Convergence semantics do NOT include adversarial adjudication (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:convergence-no-adversarial`
**Severity:** info
**Evidence:** Current sk-ai-council SKILL.md lines 295-298 document two-of-three convergence or adjudicator independent ruling, but do not mention adversarial self-check mechanisms like deep-review's Hunter/Skeptic/Referee adjudication for P0 findings. Packet 129 spec.md does not propose adding adversarial adjudication in deep mode. Deep-council convergence is based on adjudicator-verdict stability across rounds, not adversarial self-checks within a round. [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:295-298; contrast with iter-001 F12]

### F47 — Command-mode suffixes are :auto, :confirm, and :deep (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:command-modes-auto-confirm-deep`
**Severity:** info
**Evidence:** Packet 129 spec.md line 82 proposes "New /deep:ask-ai-council command (or extended /spec_kit:ai-council :deep mode) wiring with auto/confirm setup parity." Packet 129 spec.md line 91 notes "Migration path: how operators on single-round sk-ai-council move to deep mode (mode suffix :deep, default still single-round)." This adds a third mode suffix (:deep) not present in deep-review or deep-research (which only have :auto and :confirm). [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:82, 91]

### F48 — Convergence-distinctive value is multi-seat opinion synthesis with cross-topic priors (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:unique-multi-seat-opinion`
**Severity:** observation
**Evidence:** Deep-council uniquely combines multi-seat deliberation (2-4 seats with different strategy lenses per round) with iterative rounds (adjudicator-verdict stability) and multi-topic sessions (cross-topic findings registry as priors). Unlike deep-review's adversarial P0 adjudication with coverage-graph signals, and deep-research's negative knowledge with newInfoRatio convergence, deep-council converges based on opinion stability across diverse AI vantages. The cross-topic priors mechanism (new topic reads prior topics' findings) is unique to deep-council. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:77-80; .opencode/skills/sk-ai-council/SKILL.md:308-313]

### F49 — Deep-council reuses deep-loop-runtime primitives for loop-lock, jsonl-repair, atomic-state (PROPOSED)
**Fingerprint:** `contract-surface:deep-council:reuses-deep-loop-runtime`
**Severity:** info
**Evidence:** Packet 129 spec.md line 83 proposes "Reuse of deep-loop-runtime primitives (loop-lock, jsonl-repair, atomic-state, executor-audit) where applicable." Deep-loop-runtime SKILL.md lines 126-135 document these primitives. Packet 129 spec.md line 30 lists an open question: "Reuse vs extend deep-loop-runtime — shared library or new council-runtime peer?" This matches deep-review and deep-research which also consume deep-loop-runtime primitives. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:83, 30; .opencode/skills/deep-loop-runtime/SKILL.md:126-135]

### F50 — Deep-council may or may not use coverage-graph signals (OPEN QUESTION)
**Fingerprint:** `contract-surface:deep-council:coverage-graph-signals-uncertain`
**Severity:** info
**Evidence:** Packet 129 spec.md line 80 proposes "reuse deep-loop-runtime primitives where shape matches" for saturation/novelty detection. Deep-loop-runtime SKILL.md lines 137-140 document coverage-graph-signals.ts for convergence signal extraction. However, packet 129 spec.md line 141 lists an open question: "Stability scoring — adjudicator self-score, structural diff of advocate positions, OR Bayesian convergence from deep-loop-runtime's existing scorer?" This uncertainty is a divergence from deep-review and deep-research which definitively use coverage-graph signals. [SOURCE: .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md:80, 141; .opencode/skills/deep-loop-runtime/SKILL.md:137-140]

## Cross-Skill Divergence Map

| Dimension | Deep-Review | Deep-Research | Deep-Council (Proposed) |
|-----------|-------------|---------------|-------------------------|
| **Input field count** | 7 mandatory fields | 5 mandatory fields | 6 mandatory fields (cost guards) |
| **Target type support** | 5 typed targets (spec-folder, skill, agent, track, files) | No target types (single research_topic string) | Multi-topic support (N deliberation_topic values) |
| **Executor configuration** | 6 executor kinds, single executor per iteration | 6 executor kinds, single executor per iteration | 6 executor kinds, multi-seat per round (one-CLI-per-round invariant) |
| **Iteration artifact structure** | Flat iterations/iteration-{NNN}.md with 8 sections | Flat iterations/iteration-{NNN}.md with 10 sections | Hierarchical topics/topic-NNN/rounds/round-NNN/seats/ |
| **Synthesis output structure** | review-report.md with 9 sections | research.md with 17 sections | council-report.md per topic (12 sections) + session-report.md (proposed) |
| **State file hierarchy** | 2-level (session → iteration) | 2-level (session → iteration) | 3-level (session → topic → round) |
| **Convergence mechanism** | Bayesian coverage-graph signals + P0/P1/P2 severity tiers + adversarial adjudication | newInfoRatio calculation without severity tiers + no adversarial adjudication | Adjudicator-verdict stability + session-level saturation + no severity tiers + no adversarial adjudication |
| **Finding severity tiers** | P0/P1/P2 with weighted calculation (P0=10, P1=5, P2=1) | No severity tiers | No severity tiers (proposed) |
| **Adversarial adjudication** | Hunter/Skeptic/Referee for P0 findings | None | None (two-of-three or adjudicator independent ruling) |
| **Command-mode suffixes** | :auto, :confirm | :auto, :confirm | :auto, :confirm, :deep (proposed) |
| **Distinctive value** | Adversarial P0 adjudication with coverage-graph signals | Negative knowledge + research charter without adversarial checks | Multi-seat opinion synthesis with cross-topic priors + iterative stability |

## Where Contracts Diverge from Deep-Review/Deep-Research

1. **Multi-seat deliberation per round**: Deep-council uses 2-4 seats with different strategy lenses within each round (one-CLI-per-round invariant), whereas deep-review and deep-research use a single executor per iteration. [F35, F36]

2. **3-level state hierarchy**: Deep-council proposes session → topic → round JSONL hierarchy, whereas deep-review and deep-research have session → iteration hierarchy. [F41]

3. **Dual-level convergence**: Deep-council proposes per-topic adjudicator-verdict stability + session-level saturation, whereas deep-review and deep-research have single-level session convergence. [F43, F44]

4. **Cross-topic priors mechanism**: Deep-council proposes that each new topic reads prior topics' findings as priors via the session-wide findings registry, a mechanism absent in deep-review and deep-research. [F34, F38]

5. **:deep mode suffix**: Deep-council proposes a third command-mode suffix (:deep) for migration from single-round to deep mode, whereas deep-review and deep-research only have :auto and :confirm. [F47]

6. **Opinion-shaped vs evidence-shaped findings**: Deep-council proposes opinion-shaped findings (council verdicts) with canonical fingerprint schema, whereas deep-review uses evidence-shaped findings (code defects) and deep-research uses research findings (knowledge claims). [F38, F45]

## Open Questions for Iter-004

1. What are the exact trigger phrases that would route to deep-council vs deep-review vs deep-research? (sk-skill-advisor lexical scoring patterns)
2. Which output artifacts overlap across the three skills? (findings-registry.json, state JSONL files, synthesis reports)
3. Which state files are owned by which components in each skill? (main loop vs LEAF agent vs seat agent)
4. Do the three skills share the same findings registry schema or have specialized schemas?
5. What is the overlap in command-mode setup contracts? (PRE-BOUND SETUP ANSWERS, three-tier resolution)
6. Which deep-loop-runtime primitives are consumed by all three skills vs skill-specific?
7. What is the overlap in convergence detection logic? (coverage-graph signals vs newInfoRatio vs adjudicator stability)
