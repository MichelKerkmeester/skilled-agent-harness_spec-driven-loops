# Iteration 003 — RQ3 Activation Scoring + RQ4 Fixture Authoring (MiniMax-2.7)

## Focus
RQ3: Score activation against skill-advisor (external routing) vs in-SKILL.md smart router (internal routing) — both as separate sub-scores; operational meaning of "properly utilized." RQ4: Scenario/fixture authoring — hand-authored vs generated-from-the-skill's-own-triggers, avoiding circularity.

---

## Actions Taken

1. **Read deep-agent-improvement SKILL.md** — mapped the skill's smart router (INTENT_SIGNALS, RESOURCE_MAP, RUNTIME_ASSETS), the three pluggable seams, lane-aware resource organization, and the evaluator contract.
2. **Read system-skill-advisor SKILL.md** — confirmed the advisor routes requests externally via `advisor_recommend` at ≥0.8 confidence; documented its own intent signals, resource loading levels, and the standalone MCP topology.
3. **Read sk-doc SKILL.md** — confirmed doc-shape validation scope; distinct from behavioral measurement.
4. **Reviewed prior iteration (iter-001)** — understood the measurement framework, D1-D5 dimensions, and the self-referential router challenge identified in F-minimax-i1-1.
5. **Analyzed routing layer separability** — resolved how external and internal routing relate, what "properly utilized" means operationally, and how to score each independently.
6. **Analyzed fixture authorship problem** — identified the circularity trap in trigger-derived scenarios and established mitigation strategies.

---

## Findings

### F-minimax-i3-1: External routing (skill-advisor) and internal routing (smart router) are orthogonal dimensions

skill-advisor measures **external routing**: did the AI select the correct skill from the global skill set for a given prompt? The smart router inside a skill measures **internal routing**: once the skill is invoked, does it load the correct sub-documents for the detected intent?

These are orthogonal accuracy dimensions. A skill can be externally routed correctly but internally route to the wrong references. Or a skill can be externally misrouted but when manually invoked (e.g., via explicit `/deep:start-agent-improvement-loop`), internally route correctly. Both failures are meaningful but require different remediation: external routing failures belong in the skill-advisor's scorer, internal routing failures belong in the skill's INTENT_SIGNALS/RESOURCE_MAP.

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73]
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:97-133]

### F-minimax-i3-2: D1 splits into D1a (external) and D1b (internal) with independent scoring protocols

D1a (external routing accuracy) measures: for a given prompt, did the skill-advisor correctly identify the target skill at ≥0.8 confidence? This requires a ground-truth prompt dataset with correct-skill labels, then measuring `advisor_recommend` accuracy across that corpus. D1b (internal routing accuracy) measures: for a given task text, did the skill's smart router load the correct references? This is fully deterministic — compute expected loaded set from INTENT_SIGNALS/RESOURCE_MAP, compare against observed Read() traces. No ground-truth dataset required for D1b.

| Sub-dimension | Scoring Protocol | Dataset Required? | Deterministic? |
|---|---|---|---|
| **D1a** External (skill-advisor) | Run `advisor_recommend` on labeled prompt corpus; measure accuracy at ≥0.8 threshold | Yes — labeled prompt corpus | No (depends on scorer model) |
| **D1b** Internal (smart router) | Compute expected docs from INTENT_SIGNALS; compare with Read() trace | No — derived from skill's own config | Yes |

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:41-51, 59-73]
[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:165-182]

### F-minimax-i3-3: "Properly utilized" is a conjunction — selected AND correctly routed

A skill is **properly utilized** when both conditions hold: (1) the routing system selected it (skill-advisor routed to it, or operator explicitly invoked it), AND (2) the skill's internal router loaded the correct references for the detected intent. Utilization quality = f(external_routing_accuracy, internal_routing_accuracy). If either is zero, the skill contributes nothing.

The Skill Benchmark Report should show D1a and D1b as a combined matrix rather than a single D1 score — because a skill with high D1b but low D1a is a routing system problem (the skill never gets invoked), while a skill with high D1a but low D1b is a skill-internal router problem (invoked but wrong docs loaded). These require different remediation paths.

[SOURCE: synthesized]

### F-minimax-i3-4: D1b (internal router) is fully deterministic and immediately measurable

The smart router pseudocode in SKILL.md is executable specification. Given a task text, you can compute the expected loaded resources by running `select_intents(score_intents(task))` against the INTENT_SIGNALS table. The benchmark harness observes Read() calls during skill invocation and compares the loaded set against the expected set. No external ground-truth required — the skill's own router config serves as the reference. This is the cleanest measurement in the entire Lane C framework.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:165-213]

### F-minimax-i3-5: D1a (external routing) requires a labeled prompt corpus or skill-graph SQLite access

The skill-graph SQLite (maintained by system-skill-advisor) records historical routing decisions: which prompts were routed to which skills at what confidence. If the benchmark harness has query access via `skill_graph_query`, it can derive a ground-truth labeled corpus from production traffic without manual annotation. This is the preferred path for D1a measurement. If query access is unavailable, D1a must be deferred or approximated via operator-annotated prompt sets, which is expensive and slow.

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:281-295, 357-365]
[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:385-395]

### F-minimax-i3-6: Skill-advisor's fallback chain means external routing is observable even without MCP

When advisor MCP is unavailable, skill-advisor falls back to keyword matching against each skill's frontmatter `trigger_phrases`. This fallback is observable: the benchmark harness can invoke the fallback explicitly and measure whether the skill was correctly identified by trigger-phrase matching. However, this fallback mode is intentionally degraded — it should not be treated as the primary external routing measurement. D1a should be reported as "advisor-MCP available" (full measurement) or "advisor-MCP unavailable" (fallback approximation, noted as degraded).

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:262-263]

### F-minimax-i3-7: RQ4 — The circularity trap: trigger-derived scenarios bake in expected routing behavior

If you generate scenario prompts by asking "what text would score high on INTEGRATION_SCAN?" you are deriving prompts from the same INTENT_SIGNALS/RESOURCE_MAP you are trying to benchmark. The generated scenarios will naturally trigger the correct routing because they were constructed to do exactly that. This makes D1b (internal router accuracy) artificially high for trigger-derived scenarios — circular validation.

The circularity is detectable: compare D1b scores for hand-authored scenarios vs trigger-derived scenarios. If trigger-derived scenarios consistently score higher on D1b than hand-authored scenarios, the benchmark is measuring self-referential construction quality, not real routing accuracy.

[SOURCE: synthesized]

### F-minimax-i3-8: RQ4 — Four fixture authoring sources with different circularity risks

| Source | Description | Circularity Risk | Quality |
|---|---|---|---|
| **Production traffic** | Real prompts from skill-graph SQLite where the skill was actually invoked | None — confirmed by behavior | Highest |
| **Hand-authored canonical** | Operator writes prompts covering declared trigger phrases and major intent classes | Low — human reviews against skill claims, not router config | High |
| **Hand-authored edge cases** | Operator writes prompts for edge cases and failure modes the skill claims to handle | None — intentionally probes limits | High |
| **INTENT_SIGNALS-derived** | Scenarios generated by feeding intent keywords back into prompt templates | High — self-referential | Artificially high |
| **Neighbor-skill-derived** | Scenarios from other skills' use cases that overlap with this skill's domain | Low — external origin, tests cross-skill disambiguation | High |

[SOURCE: synthesized]

### F-minimax-i3-9: RQ4 — The keyword-injection trap within INTENT_SIGNALS-derived generation

Even if you don't directly use INTENT_SIGNALS keywords, if generated scenarios mention router-defined concepts (e.g., "integration scan", "promotion gate", "benchmark a model"), they activate the same intent signals they were designed to test. The mitigation: seed prompts describe the **task domain**, not the **router concept**. "I want to see all surfaces my agent touches" (task) vs "run an integration scan" (router concept). The first tests whether the router correctly infers INTEGRATION_SCAN from the task; the second already signals the intent explicitly.

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-122]

### F-minimax-i3-10: RQ4 — Minimum viable fixture corpus structure

A skill's minimum viable benchmark corpus consists of:
- **Smoke tests**: 1-2 scenarios per declared trigger phrase (hand-authored; confirms trigger phrase works)
- **Intent class-coverage**: 2-3 scenarios per INTENT_SIGNALS key (hand-authored; confirms router key coverage)
- **Edge cases**: 1-2 scenarios for known failure modes (hand-authored; confirms graceful degradation)
- **Cross-skill disambiguation**: 1-2 scenarios from neighboring skill domains (hand-authored or neighbor-derived; confirms correct skill wins over similar alternatives)
- **Generated variations**: N scenarios per intent class generated from seed prompts that describe task domain without router keywords (tests generalization beyond known triggers)

Corpus size scales with skill complexity: small skills (3-5 intent keys) need ~10-15 scenarios; complex skills (10+ intent keys) need 30-50 scenarios.

[SOURCE: synthesized]

### F-minimax-i3-11: RQ4 — Production traffic is the gold standard for D1a but requires MCP access

Production traffic from skill-graph SQLite where the skill was selected (not just invoked) provides confirmed ground-truth for external routing accuracy. This is superior to hand-authored prompts because it reflects actual usage patterns, not assumed usage. The benchmark harness should prioritize accessing production traffic for D1a measurement. If MCP access is unavailable, this becomes a Phase 003 infrastructure prerequisite rather than a Phase 001 research question.

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:385-395]

### F-minimax-i3-12: Iteration 1's OQ1 (D1a/D1b split) is resolved

Iteration 1's OQ1 asked whether D1 should measure external routing, internal routing, or both as separate sub-scores. The answer is: **both as separate sub-dimensions (D1a, D1b) with independent scoring protocols**. D1a measures skill-advisor's external selection accuracy at ≥0.8 confidence using a labeled prompt corpus (or skill-graph SQLite). D1b measures the skill's internal smart router accuracy using deterministic comparison of expected vs observed loaded resources. Combined D1 = weighted combination of D1a and D1b, where the weights reflect how the skill is typically invoked (if most invocations are explicit commands rather than advisor-routed, D1b weight is higher).

[SOURCE: synthesized]

---

## Recommendations

1. **Score D1 as D1a + D1b in the benchmark report** — show them as a 2×2 matrix (high/low external × high/low internal) so operators immediately see which remediation path is needed: skill-advisor scorer update (D1a), skill router update (D1b), or both.

2. **D1b (internal router) should be the primary scored dimension** — it is fully deterministic, requires no labeled corpus, and directly measures the skill's own router behavior against its own documented config. D1a becomes a secondary dimension reported separately.

3. **Derive ground-truth expected resources from the skill's RESOURCE_MAP for D1b** — this maintains auditability: the ground truth is the skill's own human-readable router configuration, not an external annotation. Any operator can verify what the expected route should be.

4. **For fixture corpus, use production traffic as the primary source where available** — access skill-graph SQLite for confirmed skill invocations, extract the actual prompts, and use those as the benchmark scenarios. This eliminates circularity and reflects real usage.

5. **Separate trigger-phrase scenarios (circular risk) from task-domain scenarios (clean)** — the corpus should contain both types but score them separately, so the circularity trap is observable in the benchmark report (trigger-derived scenarios will show D1b >> hand-authored scenarios if circularity is present).

6. **Report D1a as conditional on advisor MCP availability** — if the benchmark harness cannot query skill-graph SQLite, D1a is reported as "deferred pending infrastructure" rather than as a false score.

---

## Open Questions

- **OQ-i3-1**: What is the correct weighting between D1a and D1b in the combined D1 score? Should it reflect the fraction of invocations that come from skill-advisor vs explicit command? Or should they be equally weighted because both are necessary conditions for proper utilization?

- **OQ-i3-2**: How does the benchmark harness capture Read() traces in a way that doesn't alter the AI's behavior? A logging wrapper around skill invocation that records tool calls is the cleanest approach — but does this alter the AI's token budget or timing in ways that affect routing behavior?

- **OQ-i3-3**: For D1a scoring, should the benchmark use a fixed historical skill-graph corpus (replay mode) or a live sampling approach (live mode)? Replay mode is more reproducible; live mode reflects current routing quality. This is a design choice for Phase 003.

- **OQ-i3-4**: How many production-traffic scenarios are needed for statistically significant D1a measurement? Is 30 sufficient for a skill with 8 intent keys, or does each intent class need minimum N to be meaningful?

---

## Next Focus
Iteration 4: RQ5 (Skill Benchmark Report ranking/expression) + RQ6 (rename surface map for deep-agent-improvement → deep-improvement).