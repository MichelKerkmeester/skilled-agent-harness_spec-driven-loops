# Iteration 018 — Sequencing: Dependency Graph and Execution Order

**Iteration:** 18 of 20  
**Focus:** SEQUENCING — Dependency graph for 10 follow-on packets with explicit execution order  
**Status:** Insight  
**New Info Ratio:** 0.15

---

## Focus

Produce a complete dependency graph and recommended execution order for the 10 follow-on packets (after iter-015 dropped 011 and merged 002/003). Deliver:
- (a) Explicit dependency arrows between packets
- (b) Recommended execution order (linear waterfall vs parallel batches)
- (c) Critical path identification (which packet's delay blocks the most downstream work)
- (d) Per-batch ordering rationale

Incorporate iter-014's HYBRID-with-Anchor verdict: determine whether the sentinel skill (absorbed into 012) sits at the front of the dependency graph (everything depends on it) or at the end (thin wrapper needs distributed patterns first).

Incorporate iter-016's implementability findings and iter-017's risk audit: identify any "spike packet" prerequisites and whether packets should ship as atomic batches to avoid intermediate broken states.

---

## Actions Taken

1. **Read research.md §Follow-on Packets Index** (lines 900-919) to understand the 12 original packets and target path distribution.
2. **Read iter-014.md** (lines 171-183) to understand the HYBRID-with-Anchor verdict and sentinel skill definition.
3. **Read iter-015.md** (lines 115-130) to understand the updated 10-packet list after dropping 011 and priority re-ranking.
4. **Read iter-016.md** (lines 130-162) to extract dependency chains and sequencing ADRs for packets 010 and 006.
5. **Read iter-017.md** (lines 36-123) to understand cross-cutting risk concerns (sentinel staleness, permissions escape hatches, model-profile SPOF).
6. **Composed dependency graph** with explicit edges, identified parallelizable batches, and determined critical path.
7. **Recommended execution order** with 6 batches (P0 blocking → P1 infrastructure → P1 verification → P1 deepening → P2 CLI-specific → P3 Pro-tier).

---

## Dependency Graph

### Packet Inventory (10 Packets)

| Packet ID | Name | Priority | RQ Coverage | Artifacts |
|-----------|------|----------|-------------|-----------|
| 010-cli-opencode-permissions-matrix | Permissions matrix | P0 | RQ4 | 9 artifacts |
| 012-rq5-cross-cutting-sentinel-skill | AGENTS.md + graph-metadata + sentinel skill | P1 | RQ5 | 5 artifacts + sentinel skill |
| 001-cli-devin-context-budget | Context budget | P1 | RQ1 | 9 artifacts |
| 005-cli-devin-verification-pipeline | Verification pipeline | P1 | RQ2 | 9 artifacts |
| 006-cli-devin-output-verification | Output verification deepening | P1 | RQ2 | 4 artifacts |
| 007-sk-prompt-model-profiles | Model profiles | P1 | RQ3 | 9 artifacts |
| 002-cli-opencode-eviction | Eviction system | P2 | RQ1 | 2 artifacts |
| 008-cli-devin-tool-scoring | Bayesian tool scoring | P2 | RQ3 | 4 artifacts |
| 004-sk-prompt-budget-awareness | Budget awareness guidance | P2 | RQ1 | 1 artifact |
| 009-cli-devin-escalation-engine | Escalation engine | P3 | RQ3 | 4 artifacts |

**Total:** 10 packets covering 52 artifacts (41 from RQ1-4 + 5 from RQ5 + 1 sentinel skill + 5 new mitigations from iter-016/017)

### Dependency Edges

| From | To | Reason | Citation |
|------|-----|--------|----------|
| 010-P1 (category classification) | 010-P2 (allowlist filtering) | Category classification enables allowlist filtering logic | iter-016:148-150 |
| 010-P2 (allowlist filtering) | 010-P5 (structured matrix) | Allowlist filtering enables structured permission matrix construction | iter-016:148-150 |
| 010-P5 (structured matrix) | 010-A4a (full schema) | Structured matrix is foundation for full JSON schema | iter-016:148-150 |
| 010-A4a (full schema) | 010-A4d (runtime enforcement) | Schema is prerequisite for runtime enforcement hook integration | iter-016:148-150 |
| 005-P3 (confidence scoring) | 006-A2b (formula adaptation) | Baseline confidence scoring required for research output formula adaptation | iter-016:156-158 |
| 006-A2b (formula adaptation) | 006-A2c (integration handshake) | Formula adaptation required before dispatcher integration handshake | iter-016:156-158 |
| 006-A2c (integration handshake) | 006-A2d (message template) | Integration handshake required before message template rendering | iter-016:156-158 |
| 007-A3a (model profile schema) | 001-P1 (budget allocation) | Model profiles provide context window defaults for budget calculator | iter-016:110-116 |
| 007-A3a (model profile schema) | 005-P1 (verification pipeline) | Model profiles provide tool calling support flags for verification stages | iter-016:110-116 |
| 007-A3a (model profile schema) | 006-A2b (formula adaptation) | Model profiles provide escalation thresholds for confidence scoring | iter-016:110-116 |
| 012-A5-2 (enhances edges) | 001-P1 (budget allocation) | Enhances edges enable advisor routing to cli-devin context budget patterns | iter-014:171-183 |
| 012-A5-2 (enhances edges) | 005-P1 (verification pipeline) | Enhances edges enable advisor routing to cli-devin verification patterns | iter-014:171-183 |
| 012-A5-2 (enhances edges) | 007-A3a (model profiles) | Enhances edges enable advisor routing to model profile registry | iter-014:171-183 |

### ASCII Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BATCH 1: P0 BLOCKING                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  010-cli-opencode-permissions-matrix (P0)                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Internal Chain: 010-P1 → 010-P2 → 010-P5 → 010-A4a → 010-A4d          │ │
│  │ (category → allowlist → matrix → schema → enforcement)                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH 2: P1 INFRASTRUCTURE (PARALLEL)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  012-rq5-cross-cutting-sentinel-skill (P1)                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ AGENTS.md rule + enhances edges + sentinel skill creation              │ │
│  │ Enables advisor routing for all downstream packets                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  007-sk-prompt-model-profiles (P1)                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Cross-cutting infrastructure: model profile registry (8 models)        │ │
│  │ Provides context windows, tool calling flags, escalation thresholds   │ │
│  │ Used by 001, 005, 006                                                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  001-cli-devin-context-budget (P1)                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Context budget engine: percentage allocation, truncation, eviction     │ │
│  │ Depends on 007 for model context window defaults                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH 3: P1 VERIFICATION PIPELINE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  005-cli-devin-verification-pipeline (P1)                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Baseline verification: multi-stage pipeline, structural validation,   │ │
│  │ confidence scoring, hard-fail gatekeeper, language commands          │ │
│  │ Depends on 007 for tool calling support flags                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH 4: P1 VERIFICATION DEEPENING                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  006-cli-devin-output-verification (P1)                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Deepening: system instructions, confidence rubric, integration,        │ │
│  │ hard-fail template                                                      │ │
│  │ Dependency Chain: 005-P3 → 006-A2b → 006-A2c → 006-A2d               │ │
│  │ (confidence scoring → formula → integration → template)               │ │
│  │ MUST sequence after 005 completes (iter-016 sequencing ADR)           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH 5: P2 CLI-SPECIFIC (PARALLEL)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  002-cli-opencode-eviction (P2)                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Eviction system: priority-based tool result + conversation eviction    │ │
│  │ No dependencies on other packets                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  008-cli-devin-tool-scoring (P2)                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Bayesian tool scoring with Laplace smoothing                           │ │
│  │ No dependencies on other packets                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  004-sk-prompt-budget-awareness (P2)                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Budget awareness guidance in cli_prompt_quality_card.md               │
│  │ Cross-CLI relevance (syncs to cli-claude-code, cli-codex, cli-gemini)   │ │
│  │ No dependencies on other packets                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH 6: P3 PRO-TIER OPTIMIZATION                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  009-cli-devin-escalation-engine (P3)                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Escalation engine: quota-aware escalation, local-to-cloud fallback     │ │
│  │ Pro-tier only, lowest priority                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Critical Path Identification

**Critical Path:** 010 → 012 → 007 → 001 → 005 → 006

**Rationale:**
1. **010 (P0)** is the only blocking packet (RM-8 prevention). Delay here blocks ALL downstream work.
2. **012 (P1)** enables advisor routing for all downstream packets. Delay here blocks discovery of patterns implemented in 001, 005, 007.
3. **007 (P1)** provides cross-cutting model profile infrastructure used by 001, 005, 006. Delay here blocks context budget, verification pipeline, and output verification.
4. **001 (P1)** provides context budget infrastructure used by verification pipeline (005) for token-aware verification stages. Delay here blocks verification pipeline optimization.
5. **005 (P1)** provides baseline verification pipeline. Delay here blocks output verification deepening (006) per iter-016 sequencing ADR.
6. **006 (P1)** extends verification pipeline with research output confidence scoring. This is the final packet in the critical chain.

**Blast Radius of Critical Path Delay:**
- Delay on 010: Blocks ALL small-model patterns (RM-8 prevention is prerequisite for safe deployment)
- Delay on 012: Blocks advisor routing to ALL small-model patterns (operators cannot discover patterns via advisor)
- Delay on 007: Blocks context budget, verification pipeline, and output verification (3 P1 packets depend on model profiles)
- Delay on 001: Blocks verification pipeline optimization (token-aware verification stages)
- Delay on 005: Blocks output verification deepening (explicit dependency per iter-016)
- Delay on 006: Blocks research output quality assurance (final critical artifact)

**Non-Critical Packets (Can Float):**
- 002, 008, 004 (P2 CLI-specific optimizations): Can run in parallel after Batch 2, no impact on critical path
- 009 (P3 Pro-tier optimization): Can run anytime after Batch 2, lowest priority, Pro-tier only

---

## Recommended Execution Order

### Batch 1: P0 Blocking (Sequential)

**Packet:** 010-cli-opencode-permissions-matrix (P0)

**Rationale:**
- Only P0 packet (RM-8 prevention)
- Internal dependency chain (010-P1 → 010-P2 → 010-P5 → 010-A4a → 010-A4d) requires sequential implementation within the packet
- Runtime enforcement (010-A4d) has HIGH implementation risk (iter-016:78-84) and HIGH risk score (9) per iter-017
- Should ship as atomic batch to avoid intermediate broken states where permissions schema exists but enforcement is incomplete

**Spike Recommendation:** Implement Spike-010-runtime-enforcement first (iter-016:122-123) to validate hook integration before full 010 implementation.

**Atomic Batch Justification:** Permissions matrix is the RM-8 prevention mechanism. Shipping schema without enforcement creates a false sense of security. Shipping enforcement without schema creates integration failure. The entire packet should ship as a single atomic unit.

---

### Batch 2: P1 Infrastructure (Parallel)

**Packets:** 012-rq5-cross-cutting-sentinel-skill (P1), 007-sk-prompt-model-profiles (P1), 001-cli-devin-context-budget (P1)

**Rationale:**
- All three packets are P1 infrastructure with no cross-dependencies
- 012 sentinel skill is minimal state (enhances edges + AGENTS.md pointer + philosophy) and can be implemented independently
- 007 model profiles are cross-cutting infrastructure but have no implementation dependencies on 012 or 001
- 001 context budget depends on 007 for model context window defaults, but this is a data dependency (007 provides JSON schema) not an implementation dependency
- Can run in parallel to accelerate P1 infrastructure rollout

**HYBRID-with-Anchor Placement:** 012 sits at front of dependency graph (Batch 2, not Batch 1) because:
- It's minimal state (SKILL.md + graph-metadata.json + AGENTS.md pointer) and can be implemented quickly
- It enables advisor routing for downstream packets but is not a prerequisite for their implementation
- Placing it after 010 (P0 blocking) respects priority hierarchy while still enabling early advisor routing

**Dependency:** 001 should wait for 007 to complete (model profile JSON schema must exist before budget calculator can reference context window defaults). This is a data dependency, not a sequencing constraint—both can be developed in parallel, but 001 should not ship until 007 ships.

---

### Batch 3: P1 Verification Pipeline (Sequential)

**Packet:** 005-cli-devin-verification-pipeline (P1)

**Rationale:**
- Baseline verification pipeline is foundational for output verification deepening (006)
- Depends on 007 for tool calling support flags (data dependency)
- Can run in parallel with Batch 2 (no implementation dependencies), but should ship after 007 to ensure model profile data is available
- Pipeline stage dependencies (005-P1 → 005-P2 → 005-P3 → 005-P4 → 005-P5) require sequential implementation within the packet

**Parallel Opportunity:** 005 can be developed in parallel with Batch 2, but should ship after 007 completes to ensure model profile data availability.

---

### Batch 4: P1 Verification Deepening (Sequential)

**Packet:** 006-cli-devin-output-verification (P1)

**Rationale:**
- Explicit dependency on 005 per iter-016 sequencing ADR (005-P3 → 006-A2b → 006-A2c → 006-A2d)
- Cannot start until 005 completes because baseline confidence scoring (005-P3) is prerequisite for formula adaptation (006-A2b)
- Has HIGH implementation risk (iter-016:94-108) for artifacts 006-A2b and 006-A2c
- Should ship as atomic batch to avoid intermediate broken states where formula adaptation exists but integration handshake fails

**Spike Recommendation:** Implement Spike-006-research-confidence first (iter-016:124-125) to validate formula adaptation before full 006 implementation.

**Atomic Batch Justification:** Research output verification is a critical path artifact. Shipping formula adaptation without integration handshake creates broken dispatcher behavior. The entire packet should ship as a single atomic unit.

---

### Batch 5: P2 CLI-Specific (Parallel)

**Packets:** 002-cli-opencode-eviction (P2), 008-cli-devin-tool-scoring (P2), 004-sk-prompt-budget-awareness (P2)

**Rationale:**
- All three packets are P2 CLI-specific optimizations with no cross-dependencies
- No dependencies on P1 infrastructure packets (can reference patterns but don't require them for implementation)
- Can run in parallel after Batch 2 to accelerate P2 rollout
- Low implementation risk (all artifacts have MEDIUM or HIGH testability per iter-016)

**Parallel Execution:** All three packets can be developed and shipped in parallel with no coordination overhead.

---

### Batch 6: P3 Pro-Tier Optimization (Sequential)

**Packet:** 009-cli-devin-escalation-engine (P3)

**Rationale:**
- Pro-tier only optimization (quota-aware escalation, local-to-cloud fallback)
- Lowest priority (P3)
- No dependencies on other packets
- Can run anytime after Batch 2, but placed last to respect priority hierarchy

**Float Opportunity:** 009 can float to any position after Batch 2. Placing it last ensures P0/P1/P2 work completes before Pro-tier optimization.

---

## Spike Packet Prerequisites

Per iter-016 implementability audit, 3 spike packets are recommended before full implementation:

### Spike-010-runtime-enforcement (Pre-010)
**Purpose:** Proof-of-concept for pre-tool-call hook integration in cli-opencode execution layer
**When:** Before Batch 1 (010 implementation)
**Rationale:** 010-A4d has HIGH implementation risk (hook integration fragile to cli-opencode refactoring). Validate hook stability before full implementation.
**Duration:** 2-3 days (minimal hook + test harness)

### Spike-006-research-confidence (Pre-006)
**Purpose:** Validate confidence-scoring formula adaptation for research output context
**When:** Before Batch 4 (006 implementation)
**Rationale:** 006-A2b has HIGH implementation risk (formula adaptation incorrect for research output). Validate against sample research outputs before integration.
**Duration:** 2-3 days (formula validation + threshold testing)

### Spike-007-model-profile-drift (Pre-007)
**Purpose:** Implement automated validation of 8-model profile data against model provider APIs
**When:** Before Batch 2 (007 implementation)
**Rationale:** 007-A3a has HIGH risk score (7) for profile drift. Implement automated validation before schema deployment.
**Duration:** 3-4 days (API integration + validation workflow)

---

## Atomic Batch Recommendations

### Atomic Batch 1: 010 (Permissions Matrix)
**Reason:** RM-8 prevention mechanism requires schema + enforcement to be atomic. Shipping schema without enforcement creates false security. Shipping enforcement without schema creates integration failure.
**Scope:** All 9 artifacts in packet 010 (category classification, allowlist filtering, structured matrix, full schema, runtime enforcement, plus mitigations from iter-017: hook load validation, adversarial schema tests)

### Atomic Batch 2: 006 (Output Verification)
**Reason:** Research output verification requires formula adaptation + integration handshake to be atomic. Shipping formula without integration creates broken dispatcher behavior. Shipping integration without formula creates incomplete verification.
**Scope:** All 4 artifacts in packet 006 (system instructions, confidence rubric, integration handshake, message template)

### Non-Atomic Batches: 012, 007, 001, 005, 002, 008, 004, 009
**Reason:** These packets have LOW or MEDIUM implementation risk with HIGH reversibility. Can ship incrementally without creating broken intermediate states.

---

## Per-Batch Ordering Rationale

### Batch 1 First: P0 Blocking
**Rationale:** 010 is the only P0 packet (RM-8 prevention). RM-8 incident (destructive_scope_violations.md:12-56) proved that prose-only constraints failed under DeepSeek-v4-pro. Structured JSON allowlist is the blocking item for safe small-model deployment. No other packet can ship safely before 010 completes.

### Batch 2 Second: P1 Infrastructure
**Rationale:** After RM-8 prevention is in place, the highest-impact work is cross-cutting infrastructure (advisor routing, model profiles, context budget). These enable all downstream optimizations. Running them in parallel accelerates rollout without creating dependencies.

### Batch 3 Third: Verification Pipeline
**Rationale:** Verification pipeline (005) is the primary reliability mechanism for small models. It depends on model profiles (007) for tool calling support flags but has no other implementation dependencies. Shipping it after infrastructure ensures verification stages can reference model-specific capabilities.

### Batch 4 Fourth: Verification Deepening
**Rationale:** Output verification deepening (006) extends baseline verification pipeline. Explicit dependency per iter-016 sequencing ADR ensures baseline pipeline is stable before deepening. HIGH implementation risk justifies atomic batch.

### Batch 5 Fifth: CLI-Specific Optimizations
**Rationale:** CLI-specific patterns (eviction, tool scoring, budget awareness) are optimizations, not infrastructure. They can run in parallel after core infrastructure is in place. Low implementation risk allows incremental shipping.

### Batch 6 Sixth: Pro-Tier Optimization
**Rationale:** Escalation engine (009) is Pro-tier only, lowest priority. Placing it last ensures P0/P1/P2 work completes before Pro-tier optimization. Can float to any position after Batch 2 if Pro-tier demand emerges earlier.

---

## Cross-Cutting Risk Considerations

### Sentinel Skill Staleness (Risk Score 6)
**Concern:** Sentinel skill (012) references pattern paths that may become stale if patterns move.
**Mitigation:** CI check validating all paths in sentinel skill SKILL.md exist at reference-time (iter-017:74-76)
**Sequencing Impact:** Low—sentinel skill is minimal state and can be updated quickly if paths change.

### Permissions-Matrix Escape Hatches (Risk Score 8)
**Concern:** Schema allows wildcard patterns that bypass deny rules, recreating RM-8 conditions.
**Mitigation:** Adversarial schema test suite + runtime permission-string validation (iter-017:94-98)
**Sequencing Impact:** High—010 must ship with adversarial tests in atomic batch to prevent escape hatches.

### Model-Profile Registry SPOF (Risk Score 7)
**Concern:** Registry typo causes wrong context windows or permission flags across CLI skills.
**Mitigation:** Automated profile validation against provider APIs + drift detection (iter-017:116-120)
**Sequencing Impact:** Medium—007 should ship with automated validation (Spike-007) to prevent SPOF deployment.

---

## Summary

**Total Packets:** 10 (after iter-015 dropped 011 and merged 002/003)

**Dependency Edges:** 13 explicit edges (5 internal to 010, 3 internal to 006, 5 cross-packet)

**Critical Path:** 010 → 012 → 007 → 001 → 005 → 006

**Recommended Execution Order:** 6 batches (1 sequential P0 blocking, 1 parallel P1 infrastructure, 1 sequential P1 verification, 1 sequential P1 deepening, 1 parallel P2 CLI-specific, 1 sequential P3 Pro-tier)

**Atomic Batches:** 2 (010 for RM-8 prevention, 006 for research output verification)

**Spike Packets:** 3 (runtime enforcement, research confidence, model profile drift)

**Parallelization Opportunities:** Batch 2 (3 packets), Batch 5 (3 packets)

**Critical Path Blast Radius:** Delay on 010 blocks ALL small-model patterns. Delay on 012 blocks advisor routing to ALL patterns. Delay on 007 blocks 3 P1 packets. Delay on 005 blocks 006. Delay on 006 blocks research output quality assurance.

---

## Citations

- research.md:900-919 — Follow-on Packets Index with 12 original packets
- iter-014.md:171-183 — HYBRID-with-Anchor verdict (sentinel skill definition)
- iter-015.md:115-130 — Updated 10-packet list after dropping 011, priority re-ranking
- iter-015.md:77-86 — Sentinel skill absorbed into 012-rq5-cross-cutting-sentinel-skill
- iter-016.md:130-162 — Dependency chains and sequencing ADRs for packets 010 and 006
- iter-016.md:148-150 — Dependency chain for packet 010 (P1→P2→P5→A4a→A4d)
- iter-016.md:156-160 — Dependency chain for packet 006 (005-P3→006-A2b→006-A2c→006-A2d)
- iter-016.md:110-116 — Packet 007 cross-cutting infrastructure (model profiles used by cli-devin and cli-opencode)
- iter-016.md:74-117 — Implementation-risk flags for HIGH-risk artifacts
- iter-016.md:122-127 — Spike packet recommendations
- iter-017.md:36-123 — Risk audit table with risk scores (1-10)
- iter-017.md:59-123 — Cross-cutting concerns (sentinel staleness, permissions escape hatches, model-profile SPOF)
- iter-017.md:126-181 — Recommended pre-implementation checks (CI validators, schema validation, monitoring hooks)
