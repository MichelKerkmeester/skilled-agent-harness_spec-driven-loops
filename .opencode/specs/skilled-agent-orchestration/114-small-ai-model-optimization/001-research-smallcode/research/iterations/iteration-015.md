# Iteration 015 — Adversarial: Priority Challenge for Follow-on Packets

**Iteration:** 15 of 20  
**Focus:** ADVERSARIAL — Challenge each P0/P1/P2/P3/P4 priority assignment in research.md §Follow-on Packets Index (12 packets)  
**Status:** Insight  
**New Info Ratio:** 0.18

---

## Focus

Adversarially challenge the §Follow-on Packets Index priority assignments. For each packet, argue from the OPPOSITE direction (P0 down to P1, P1 up to P0, etc.) and decide if the current priority holds. Look specifically at:
- Is 010-cli-opencode-permissions-matrix really P0 (RM-8 prevention is critical), or could it be P1 because the four-layer prose mitigation is already shipped?
- Is 012-rq5-cross-cutting really P0 (advisor routing prerequisite), or could it be P1 because pure-HYBRID works without it (now revisited as HYBRID-with-Anchor)?
- Are the 3 P1 packets (001, 005, 006) really equal-priority, or should one come first?
- Is 011-cli-opencode-two-stage-routing genuinely P4 (lowest), or does its overlap with mcp-code-mode justify dropping entirely?
- Do any P2/P3 packets actually deserve P1 status (high-impact-but-undervalued)?

Also: with HYBRID-with-Anchor verdict from iter 14, do we need a NEW packet (say 013-sk-small-model-sentinel) for creating the thin sentinel skill? Or is that part of 012-rq5-cross-cutting?

---

## Actions Taken

1. **Read research.md §Follow-on Packets Index** (lines 900-919) to understand current 12 packets and priority assignments.
2. **Read research.md §Priority Rationale** (lines 913-918) to understand the logic behind P0/P1/P2/P3/P4 assignments.
3. **Read iter-014.md** (lines 171-183) to understand the HYBRID-with-Anchor verdict and its implications for packet 012.
4. **Read spec.md §6 RISKS & DEPENDENCIES** (lines 196-208) to understand risk context and dependencies.
5. **Read spec.md §11 USER STORIES** (lines 298-305) to understand priority guidance from user stories.
6. **Composed adversarial analysis** for each of the 12 packets, arguing counter-priority and rendering verdicts.
7. **Evaluated NEW packet requirement** for HYBRID-with-Anchor sentinel skill (013-sk-small-model-sentinel vs absorb into 012).

---

## Findings

### Per-Packet Priority Audit Table

| Packet ID | Current Priority | Adversarial Argument | Verdict | New Priority |
|-----------|------------------|---------------------|---------|--------------|
| 010-cli-opencode-permissions-matrix | P0 | **P1 argument:** The four-layer prose mitigation (cli-opencode v1.3.3.0 ALWAYS #13) is already shipped in packet 113. RM-8 incident occurred under `--dangerously-skip-permissions` flag, which bypasses ALL constraints regardless of prose vs structured. Structured permissions improve enforcement but don't prevent bypass. P0 overstates urgency when prose mitigation already exists. | **STAY P0** — RM-8 incident analysis (spec.md:81) proves prose-only constraints failed under DeepSeek-v4-pro. Structured JSON allowlist provides machine-enforceable boundaries that prose cannot. The four-layer mitigation is a stopgap, not a fix. P0 is justified for RM-8 prevention. | P0 |
| 012-rq5-cross-cutting | P0 | **P1 argument:** Pure HYBRID (distributed refs + enhances edges) works without AGENTS.md rule addition. Advisor routing already clears 0.8 threshold per iter-010 simulation. HYBRID-with-Anchor sentinel skill is minimal (enhances edges + AGENTS.md pointer + philosophy). P0 overstates dependency when advisor routing works via enhances edges alone. | **DOWNGRADE TO P1** — HYBRID-with-Anchor verdict (iter-014:171-183) shows the sentinel skill is minimal state. Advisor routing works via enhances edges (iter-010:153-204 simulation confirms 0.8 threshold clearance). P0 is overkill for AGENTS.md rule + enhances edges. P1 is appropriate: important but not blocking. | P1 |
| 001-cli-devin-context-budget | P1 | **P0 argument:** Context budget is foundational for ALL small-model patterns. Without budget allocation, verification pipeline (005) and escalation engine (009) cannot operate reliably. SWE-1.6's smaller context window makes this critical infrastructure. | **STAY P1** — Context budget is foundational but not blocking. P0 packets (010, 012) address RM-8 prevention and advisor routing, which are system-level concerns. Context budget is optimization, not infrastructure. P1 is correct. | P1 |
| 005-cli-devin-verification-pipeline | P1 | **P0 argument:** Verification pipeline is the primary reliability mechanism for small models. Without it, small models ship broken code. This is higher impact than context budget (001). Should be P0. | **STAY P1** — Verification pipeline is high-impact but not blocking. P0 packets address RM-8 prevention (010) and advisor routing (012). Verification can be layered incrementally; it doesn't block other patterns. P1 is correct. | P1 |
| 006-cli-devin-output-verification | P1 | **P0 argument:** Output verification deepening (4 artifacts) extends verification pipeline with confidence scoring, hard-fail gatekeeper, and language-specific commands. This is critical for reliability. Should be P0. | **STAY P1** — Output verification is an extension of 005, not foundational. The baseline verification pipeline (005) provides the core mechanism. Deepening is important but not blocking. P1 is correct. | P1 |
| 002-cli-opencode-eviction | P2 | **P1 argument:** Eviction system (priority-based tool result + conversation eviction) is critical for context management under budget constraints. This is as important as context budget (001) for small models. Should be P1. | **STAY P2** — Eviction is important but cli-opencode-specific. Context budget (001) applies to all small models. P1 packets are highest-impact cross-cutting optimizations. Eviction is CLI-specific integration. P2 is correct. | P2 |
| 003-cli-opencode-eviction | P2 | **P1 argument:** Same as 002. Eviction priority ladder mapping to agent-config-iter JSON files is critical for SWE-1.6 and DeepSeek dispatches. Should be P1. | **STAY P2** — Duplicate entry in table (should be merged with 002). Eviction is CLI-specific. P2 is correct. | P2 |
| 007-sk-prompt-model-profiles | P2 | **P1 argument:** Model profile registry (8 models with context windows, tool calling support, escalation thresholds) is foundational for all small-model dispatches. This is cross-cutting infrastructure. Should be P1. | **UPGRADE TO P1** — Model profiles are cross-cutting infrastructure used by both cli-devin and cli-opencode. Per-model defaults (context windows, tool calling support) are prerequisites for budget allocation, verification, and escalation. This is higher impact than CLI-specific patterns. P1 is justified. | P1 |
| 008-cli-devin-tool-scoring | P2 | **P1 argument:** Bayesian tool scoring with Laplace smoothing is a sophisticated algorithm that improves small-model reliability significantly. This is high-impact optimization. Should be P1. | **STAY P2** — Bayesian tool scoring is sophisticated but CLI-specific to cli-devin's agent-config recipe. It's an optimization, not infrastructure. P2 is correct. | P2 |
| 004-sk-prompt-budget-awareness | P3 | **P2 argument:** Budget awareness guidance in cli_prompt_quality_card.md is cross-CLI relevance. This affects all CLI skills, not just cli-devin. Should be P2. | **UPGRADE TO P2** — Budget awareness guidance is cross-CLI relevance (syncs to cli-claude-code, cli-codex, cli-gemini per mirror sync contract). This affects all CLI skills, making it higher impact than CLI-specific patterns. P2 is justified. | P2 |
| 009-cli-devin-escalation-engine | P3 | **P2 argument:** Escalation engine (quota-aware escalation, local-to-cloud fallback) is critical for Pro-quota management. This is high-impact for cost control. Should be P2. | **STAY P3** — Escalation engine is important but Pro-quota-specific. Free-tier SWE-1.6 dispatches don't need it. P3 is correct for Pro-tier optimization. | P3 |
| 011-cli-opencode-two-stage-routing | P4 | **DROP argument:** 2-stage routing overlaps with mcp-code-mode's tool orchestration layer. Small-model output-quality contribution is LOW for this pattern. Should be dropped entirely (excluded per ADR-002 precedent). | **DROP** — 2-stage routing overlaps with mcp-code-mode (research.md:924-931). The small-model output-quality contribution ratio is LOW. This pattern was correctly excluded per ADR-002 from tool-routing RQ. Drop from follow-on packets entirely. | DROPPED |

---

### NEW Packet Recommendation: HYBRID-with-Anchor Sentinel Skill

**Question:** With HYBRID-with-Anchor verdict from iter-14, do we need a NEW packet (013-sk-small-model-sentinel) for creating the thin sentinel skill? Or is that part of 012-rq5-cross-cutting?

**Analysis:**

The HYBRID-with-Anchor verdict (iter-014:171-183) defines a sentinel `sk-small-model` skill that holds ONLY:
- Enhances edges to cli-devin and cli-opencode
- AGENTS.md rule pointer
- 1-2 paragraph philosophy

All actual patterns (context budget, verification pipeline, model profiles, permissions matrix) stay distributed across cli-devin and cli-opencode per the HYBRID approach.

**Option 1: NEW packet 013-sk-small-model-sentinel**
- Pros: Clean separation between cross-cutting wiring (sentinel skill creation) and distributed pattern implementation (packets 001-011). Sentinel skill creation is lightweight (SKILL.md + graph-metadata.json + AGENTS.md rule) and can be done independently.
- Cons: Adds a 13th packet, increasing coordination overhead. Sentinel skill is minimal state — arguably too small for a dedicated packet.

**Option 2: Absorb into 012-rq5-cross-cutting**
- Pros: Reduces packet count. 012-rq5-cross-cutting already covers AGENTS.md rule + graph-metadata enhances edges. Sentinel skill creation is a natural extension of this packet.
- Cons: 012's scope expands from "AGENTS.md + graph-metadata" to "AGENTS.md + graph-metadata + sentinel skill creation". This may make 012 larger than other packets.

**Verdict: ABSORB into 012-rq5-cross-cutting**

The sentinel skill creation is minimal state (SKILL.md + graph-metadata.json + AGENTS.md pointer). It naturally extends 012's existing scope (AGENTS.md + graph-metadata enhances edges). Creating a dedicated packet for ~3 file changes is overkill. 012-rq5-cross-cutting should be renamed to "012-rq5-cross-cutting-sentinel-skill" and absorb the sentinel skill creation.

**Updated 012 scope:**
- AGENTS.md rule addition (sibling to CLI dispatch rule)
- graph-metadata.json enhances edges (cli-devin↔cli-opencode bidirectional at 0.5, cli-devin→sk-prompt at 0.4, sk-code→cli-devin at 0.4, cli-devin→mcp-code-mode at 0.3)
- NEW: sk-small-model sentinel skill creation (SKILL.md with philosophy, graph-metadata.json with enhances edges, description.json)

---

### Priority Re-ranking Analysis

**P0 Packets (after changes):**
- 010-cli-opencode-permissions-matrix (P0) — RM-8 prevention, structured JSON allowlist replaces prose mitigation
- 012-rq5-cross-cutting-sentinel-skill (P1, downgraded from P0) — AGENTS.md + enhances edges + sentinel skill, advisor routing works via enhances alone

**P1 Packets (after changes):**
- 001-cli-devin-context-budget (P1) — Foundational context budget for SWE-1.6
- 005-cli-devin-verification-pipeline (P1) — Baseline verification pipeline
- 006-cli-devin-output-verification (P1) — Verification deepening
- 007-sk-prompt-model-profiles (P1, upgraded from P2) — Cross-cutting model profile registry

**P2 Packets (after changes):**
- 002-cli-opencode-eviction (P2) — CLI-specific eviction system
- 008-cli-devin-tool-scoring (P2) — CLI-specific Bayesian tool scoring
- 004-sk-prompt-budget-awareness (P2, upgraded from P3) — Cross-CLI budget awareness guidance

**P3 Packets (after changes):**
- 009-cli-devin-escalation-engine (P3) — Pro-tier escalation optimization

**Dropped Packets:**
- 011-cli-opencode-two-stage-routing (DROPPED) — Overlaps with mcp-code-mode, low small-model contribution

**Total Packets:** 11 (down from 12, after dropping 011)

---

### Updated §Follow-on Packets Index

| Packet ID | Name | RQ Coverage | Priority | Risk |
|-----------|------|-------------|----------|------|
| 010-cli-opencode-permissions-matrix | Permissions matrix (RQ4) | RQ4 (9 artifacts) | P0 | High |
| 012-rq5-cross-cutting-sentinel-skill | AGENTS.md + graph-metadata + sentinel skill (RQ5) | RQ5 (5 artifacts + sentinel skill) | P1 | Low |
| 001-cli-devin-context-budget | Context budget (RQ1) | RQ1 (9 artifacts) | P1 | Medium |
| 005-cli-devin-verification-pipeline | Verification pipeline (RQ2) | RQ2 (9 artifacts) | P1 | Medium |
| 006-cli-devin-output-verification | Output verification deepening (RQ2) | RQ2 (4 artifacts) | P1 | Medium |
| 007-sk-prompt-model-profiles | Model profiles (RQ3) | RQ3 (9 artifacts) | P1 | Medium |
| 002-cli-opencode-eviction | Eviction system (RQ1) | RQ1 (2 artifacts) | P2 | Low |
| 008-cli-devin-tool-scoring | Bayesian tool scoring (RQ3) | RQ3 (4 artifacts) | P2 | Medium |
| 004-sk-prompt-budget-awareness | Budget awareness guidance (RQ1) | RQ1 (1 artifact) | P2 | Low |
| 009-cli-devin-escalation-engine | Escalation engine (RQ3) | RQ3 (4 artifacts) | P3 | High |

**Total Packets:** 10 estimated follow-on packets covering 41 artifacts + sentinel skill creation across 5 RQs.

**Updated Priority Rationale:**
- P0: Permissions-matrix (RM-8 prevention) — only blocking item
- P1: Cross-cutting infrastructure (model profiles, context budget, verification pipeline, advisor routing + sentinel skill) — highest-impact small-model optimization
- P2: CLI-specific patterns (eviction, tool scoring) + cross-CLI guidance (budget awareness)
- P3: Pro-tier optimization (escalation engine)
- DROPPED: 2-stage routing (overlaps with mcp-code-mode)

---

## Citations

- research.md:900-919 — Follow-on Packets Index table with 12 packets
- research.md:913-918 — Priority Rationale (P0/P1/P2/P3/P4 logic)
- research.md:924-931 — Excluded Patterns: 2-stage routing overlap with mcp-code-mode
- iter-014.md:171-183 — HYBRID-with-Anchor verdict (sentinel skill definition)
- spec.md:81-82 — RM-8 incident analysis (prose-only constraints failed)
- spec.md:196-208 — RISKS & DEPENDENCIES (risk context)
- spec.md:298-305 — USER STORIES (priority guidance)
