# Iteration 003 — DeepSeek-v4-pro: RQ3 Activation Sub-Scores + RQ4 Fixture Authoring + Rename Surface Map

**Model:** deepseek-v4-pro | **Iteration:** 3 of 5 | **Date:** 2026-05-30

---

## Focus

**RQ3** — Resolve whether D1 routing accuracy should score against the skill-advisor (external routing), the in-SKILL.md smart router (internal routing), or both as independent sub-scores; define the operational meaning of "properly utilized." **RQ4** — Design a fixture-authoring strategy (hand-authored vs generated-from-the-skill's-own-triggers) that avoids the circularity trap. **Rename surface map** — Complete the exhaustive file-level surface listing for the `deep-agent-improvement` → `deep-improvement` rename (Phase 002 input).

---

## Actions Taken

1. **Re-read** the skill-advisor's routing model — `advisor_recommend` emits lane-attributed confidence scores for the global skill set; the 0.8 confidence threshold defines "recommended"; the scoring lanes (explicit match, family affinity, semantic overlap, keyword, description) fuse into one confidence value. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73, 93-270]

2. **Re-read** the target skill's smart router — `INTENT_SIGNALS` (8 keys with weighted keyword matching), `RESOURCE_MAP` (8 intent-to-path entries), `RUNTIME_ASSETS` (ALWAYS + conditional), `score_intents()` + `select_intents()` deterministic scoring protocol. This IS the internal routing fabric that D1b measures. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-182]

3. **Deep analysis** of routing-layer separability — the skill-advisor operates at the GLOBAL skill set level (which skill to load?), while the in-SKILL.md smart router operates at the LOCAL skill-internal level (which reference to load once the skill is active?). These are two independent decision points with different ground truths, different failure modes, and different remediation owners.

4. **Re-read** the iteration-002 contamination taxonomy — the 5-category contamination dictionary (skill name, trigger phrases, resource paths, intent keywords, command names) provides the gate for RQ4 fixture validation. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/deepseek/iterations/iteration-002.md:168-177]

5. **Compared** the minimax iteration-003 findings (F-minimax-i3-1 through F-minimax-i3-4) — confirmed independent analysis converges on the same orthogonal split of D1a/D1b. The minimax iteration correctly positions D1b as deterministic and D1a as dependent on a labeled prompt corpus. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/minimax/iterations/iteration-003.md:19-50]

6. **Read** the Phase 002 rename spec surface list and cross-referenced with Phase 121 surfaces — the 121 sibling's 19-phase arc provides the proven template for rename ordering. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37-45]

7. **Grep-mapped** the concrete rename surface — live grep across `.opencode/`, `.codex/`, `.claude/`, `.gemini/` for `deep-agent-improvement` — producing the file-level surface inventory below (§Findings F12-F13). Recent grep results confirmed 80+ files across the repo. [SOURCE: git grep results, this iteration]

8. **Read** the skill-advisor's scorer internals — `aliases.ts`, `explicit.ts`, `fusion.ts` carry hardcoded skill-name references that must change during rename. The advisor's `skill-graph.json` and regression fixtures also carry the old name. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts, fusion.ts, explicit.ts]

9. **Web-fetched** the RLAIF & Constitutional AI paper (Bai et al. 2022) — the concept of training an evaluator model on a constitution of rules (principles → critiques → revisions) provides a prior-art shape for RQ4: generate prompts from a *domain constitution* (what the skill covers) rather than from *trigger phrases* (how the skill is named). [SOURCE: https://arxiv.org/abs/2212.08073]

---

## Findings

### RQ3-A: External (D1a) and Internal (D1b) Routing are Orthogonal Dimensions

The two routing layers operate at different scopes with different ground truths:

| Layer | Scope | Decision | Ground Truth Source | Deterministic? |
|-------|-------|----------|---------------------|----------------|
| **D1a — External** (skill-advisor) | Global skill set (all installed skills) | Which skill should handle this prompt? | Labeled prompt corpus with correct-skill annotations | No — depends on advisor scorer model |
| **D1b — Internal** (smart router) | Single skill (references/assets within one skill) | Which resources should load for this intent? | `INTENT_SIGNALS` + `RESOURCE_MAP` (skill author's declared mapping) | **Yes** — fully computable from skill config |

A skill can fail externally but succeed internally (skill never invoked but its router is well-designed — a D1a problem for the skill-advisor team). Or succeed externally but fail internally (skill is invoked correctly but loads wrong resources — a D1b problem for the skill author). Both failures are meaningful but require different remediation.

[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73 — advisor routes externally via `advisor_recommend` at global scope; .opencode/skills/deep-agent-improvement/SKILL.md:113-182 — smart router routes internally via keyword-to-intent matching at local scope]

### RQ3-B: D1 MUST Split into D1a + D1b with Independent Scoring

A single blended D1 score would obscure the root cause: a low blended D1 could mean the advisor never finds the skill (fix: tune trigger phrases in the skill's frontmatter), or that the skill's internal router loads wrong references for most intents (fix: rewrite `RESOURCE_MAP` entries), or both. The remediations are entirely different — the Skill Benchmark Report must distinguish them.

**Proposed sub-dimension structure:**

| Sub-dimension | Weight (of D1) | Metric | Dataset |
|---------------|----------------|--------|---------|
| **D1a — External Activation** | 0.15 | Precision/recall of `advisor_recommend` at ≥0.8 threshold across labeled prompt corpus | Labeled prompt corpus (N positive + N negative + N near-neighbor) |
| **D1b — Internal Router** | 0.15 | Expected-resource hit rate = (correctly loaded resources) / (total expected resources for detected intent) | Skill's own `RESOURCE_MAP` (no external dataset needed) |

D1 composite = D1a + D1b (total 0.30, matching iteration-001's recommended weight for D1). Each sub-score is reported independently; the composite is a convenience rollup.

[SOURCE: synthesized from analysis of routing architecture; converges with minimax findings F-minimax-i3-2 and F-minimax-i3-3]

### RQ3-C: "Properly Utilized" = External Selection AND Internal Resource Loading

A skill is **properly utilized** when both conditions hold:

1. **Selection gate passed (D1a):** The routing system (skill-advisor, or explicit operator invocation) selected the correct skill for the scenario.
2. **Resource-load gate passed (D1b):** Once the skill is active, the AI loaded the correct subset of references/assets for the detected intent — measured against the `RESOURCE_MAP` the skill author declared.

If either gate fails, the skill contributed zero value for that scenario. The lane's `properlyUtilized` (boolean) field in each scenario result is the AND of these two gates. Over a batch of N scenarios, the utilization rate = (scenarios with properlyUtilized=true) / N.

This is the Lane C equivalent of Lane B's `benchmark_completed` event — the definitive signal that the benchmark scenario "worked" end-to-end.

**Corollary — the 2×2 utilization matrix is the right report shape:**

| | D1b PASS (internal router loads right resources) | D1b FAIL (internal router loads wrong resources) |
|---|---|---|
| **D1a PASS (advisor routes to skill)** | **PROPERLY UTILIZED** — skill is healthy for this scenario class | **INTERNAL ROUTER REGRESSION** — advisor correct but in-skill router broken; fix `RESOURCE_MAP` / `INTENT_SIGNALS` |
| **D1a FAIL (advisor does not route)** | **ADVISOR GAP** — skill is well-structured internally but never reached; fix triggers/frontmatter/keywords for advisor discovery | **DOUBLE FAIL** — skill is undiscoverable AND internally broken; needs foundational restructuring |

[SOURCE: synthesized from analysis of routing-layer separation]

### RQ3-D: D1b is Deterministic — Computes from Skill Config Without AI Dispatch

D1b scoring can be computed **entirely from the skill's static configuration** before any AI dispatch. The algorithm:

```
For a scenario with domain_description D and expected_intent E:
  1. Simulate score_intents(task_text_from(D))  → returns scores dict
  2. Simulate select_intents(scores)             → returns detected intents
  3. Look up RESOURCE_MAP[detected_intent]       → returns expected resource set
  4. Compare expected resource set against captured Read() trace
```

However, the intent selected by `score_intents()` depends on the AI's task text — which depends on how the AI interprets the domain description. There is NO guarantee the AI will arrive at the exact same task text as the simulator. For D1b to be deterministic, the scored trace must include the AI's ACTUAL task text (its own framing of the problem) — then the simulator can verify whether the AI's observed resource loads match what the router WOULD produce for that task text.

**Revised D1b protocol:**
1. Capture the AI's initial task framing from the run (the first tool-call prompt or its `_task_text` equivalent)
2. Run `score_intents()` on THAT text to get expected intents
3. Compare expected resources for those intents against observed Read() traces

This eliminates the circularity of trying to predict what the AI will "think" before it runs. The simulator becomes a post-hoc verifier rather than a pre-hoookup predictor.

[SOURCE: synthesized from router pseudocode analysis; .opencode/skills/deep-agent-improvement/SKILL.md:142-182]

### RQ3-E: Advisor Ambiguity (Near-Neighbor Confusion) is a Real Failure Mode

The skill-advisor routinely produces tie collisions between related skills. Live evidence: this session's own advisor brief reported `ambiguous: sk-code 0.93/0.16 vs deep-research 0.93/0.16` — two skills with identical top-level scores. If `deep-agent-improvement` (soon `deep-improvement`) collides with the broader `deep-research` skill, the advisor may route a research prompt to the improvement skill, or vice versa.

**Recommendation for Lane C:** Include "near-neighbor confusion" scenarios in every benchmark batch — prompts that could plausibly belong to either the target skill or a known sibling. Measure confusion rate = (sibling skill recommended instead of target skill) / (total near-neighbor scenarios). This is a specialized sub-metric of D1a precision.

Near-neighbor pairs for `deep-improvement` identified from the skill catalog:
- `deep-research` (both are "deep" investigation skills)
- `sk-code-review` (both have evaluative, improvement-oriented workflows)
- `deep-review` (both have iterative review/evaluation loops)

[SOURCE: advisor hook context, this session; .opencode/skills/system-skill-advisor/SKILL.md:72 — "ambiguous top scores → surface top candidates"]

---

### RQ4-A: The Circularity Trap — Trigger-Derived Prompts Test Mirror Recognition, Not Real Discovery

If prompts are generated directly from a skill's `trigger_phrases` and `INTENT_SIGNALS` keywords, the benchmark measures whether the AI:
1. Sees the trigger phrase
2. Matches it to the skill's frontmatter keyword
3. Loads the skill

This is NOT measuring real-world discovery. It is measuring keyword-string matching — trivially gameable and not diagnostic of whether the skill helps for tasks where the user does NOT use the skill's chosen vocabulary.

The benchmark's core question is: *"Given a task described in domain-generic language, does the AI discover this skill and use it correctly?"* — not *"Given the skill's exact name, does the AI find it?"*

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:71 — precisely frames the distinction between doc shape and real-world utilization]

### RQ4-B: Three Fixture-Authoring Strategies

#### Strategy 1 — Hand-Authored Golden Scenarios (calibration baseline)

Manually written domain descriptions in domain-generic language, with expected intent/lane/resource sets manually labeled. These are the gold standard — highest quality, lowest contamination risk, slowest to author.

**Protocol:**
1. Read the skill's `INTENT_SIGNALS` and "When to Use" / "When NOT to Use" sections
2. Write a domain description of a realistic user task, phrased in domain-generic terms
3. Label the expected intent, expected resources, expected outcome rubric
4. Run the contamination gate (iteration-002's `contamination-check.cjs`) — reject if any skill-specific term leaks
5. Peer-review for realism

**Recommended count per skill:** 3–5 golden scenarios (covers high-value intent paths) + 3–5 negative scenarios + 2–3 near-neighbor confusion scenarios.

#### Strategy 2 — Trigger-Paraphrase Synthesis (high coverage, moderate risk)

Generate candidate prompts from trigger phrases via LLM paraphrasing, then filter through contamination gate.

**Pipeline:**
```
skill.triggers[] + skill.INTENT_SIGNALS[].keywords[]
  ↓
  LLM paraphraser: "Rewrite this task description in domain-generic language,
                     avoiding the exact words: [contaminated terms list]"
  ↓
  Candidate prompts[]
  ↓
  contamination-check.cjs (hard gate) → reject contaminated candidates
  ↓
  Manual review: discard unrealistic/contrived candidates
  ↓
  Final prompt set
```

The LLM paraphraser acts as a "relevance-preserving translation" from trigger-space to domain-space. The contamination gate catches any skill-term leakage. The manual review filters generative noise.

**Risk:** An LLM paraphraser may still produce prompts that implicitly encode the intent structure (e.g., it learns the pattern "benchmark-related tasks → these keywords"). Mitigation: use a DIFFERENT model for paraphrasing than for benchmark execution, and run the contamination gate with `--strict` (flagging not only exact matches but also near-matches).

#### Strategy 3 — LLM-Assisted Generation from Domain Constitution

Generate prompts from a *domain constitution* — a skill-agnostic description of the problem space — rather than from trigger phrases. This mirrors Constitutional AI (Bai et al. 2022): define a set of domain principles ("the benchmarker is about…"), then generate task descriptions that test those principles.

**Protocol:**
1. Define a domain constitution for the skill (3-5 sentences describing the problem space in skill-agnostic terms)
2. LLM generates: "Given this domain, list 15 realistic tasks a user might need to accomplish"
3. For each task, LLM generates a prompt (domain-generic language) + expected intent/resources
4. Contamination gate + manual review
5. Human annotator validates expected intent/resources against the skill's actual structure

**Advantage over Strategy 2:** The constitution is one degree of separation from the triggers — prompts are generated from the DOMAIN, not from the trigger phrases. This reduces (but does not eliminate) circularity risk.

[SOURCE: https://arxiv.org/abs/2212.08073 — Constitutional AI as the prior-art analog for domain-constitution prompt generation]

### RQ4-C: Recommended Fixture Authoring Strategy (Hybrid with Contamination Gate)

**Authoring pipeline (production flow):**

| Stage | Source | Role | Count per Skill | Gate |
|-------|--------|------|-----------------|------|
| 1. Golden scenarios | Manual (domain expert) | Calibration baseline, high-confidence diagnostics | 5–8 (3 positive + 3 negative + 2 near-neighbor) | Contamination gate + peer review |
| 2. Synthesized scenarios | Trigger-paraphrase pipeline (Strategy 2) | Breadth coverage, edge-case detection | 10–20 | Contamination gate (strict) + manual review |
| 3. Constitution-derived scenarios | LLM from domain constitution (Strategy 3) | Generative coverage, low-contamination | 5–10 | Contamination gate + human annotation of expected intent/resources |

Total: ~20–38 scenarios per skill. Golden scenarios are always run. Synthesized and constitution-derived scenarios are run when the skill's intent surface is broad enough to warrant coverage.

**Key invariant across all strategies:** The contamination gate MUST pass for every prompt. Any prompt containing a skill name, trigger phrase, resource path, intent keyword, or command name is rejected before it ever reaches the AI. This gate is machine-enforceable and reproducible.

[SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/deepseek/iterations/iteration-002.md:208-241]

### RQ4-D: Negative Scenarios from "When NOT to Use"

Every skill ships a "When NOT to Use" section. For `deep-agent-improvement`, this lists four exclusion classes:
- Open-ended prompt rewrites across multiple agent families at once
- Direct canonical edits without a packet-local candidate and evaluator evidence
- Broad runtime-mirror synchronization work presented as benchmark truth
- General packet planning / implementation that does not need an improvement loop

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:66-72]

Each exclusion class produces 1–2 negative scenarios — prompts in the skill's general domain that should NOT trigger it. The benchmark measures whether the AI correctly abstains from invoking the skill. This is the Lane C equivalent of BFCL v4's "Irrelevance Detection" category.

Similar "When NOT to Use" sections in `sk-doc` (line 164-169) and `system-skill-advisor` (line 51) provide the same negative-scenario source for their respective target skills.

### RQ4-E: Near-Neighbor Scenarios for Confusion Detection

Near-neighbor scenarios test whether the routing system distinguishes the target skill from siblings with overlapping scope. Protocol:

1. Identify sibling skills with overlapping trigger phrases or domain keywords
2. Craft a prompt that is closer to the SIBLING's domain than the target's domain
3. Expected behavior: the advisor should NOT route to the target skill
4. Measure: sibling-routing rate vs target-routing rate

This tests D1a precision specifically against the most common failure mode — a skill that cannibalizes prompts meant for a neighbor.

---

### F-deepseek-i3-12: Rename Surface Map — Exhaustive File-Level Inventory

The full `deep-agent-improvement` → `deep-improvement` rename surface (Phase 002 input), organized by rename bucket:

#### Bucket A — Canonical Skill Package (directory rename + all internal refs)
- `.opencode/skills/deep-agent-improvement/` → `.opencode/skills/deep-improvement/` (git mv)
- `.opencode/skills/deep-agent-improvement/SKILL.md` — `name:`, all frontmatter fields, all trigger phrases, all keywords, all inline self-references
- `.opencode/skills/deep-agent-improvement/scripts/` — all .cjs, .ts, .mjs, .md files referencing the skill name
- `.opencode/skills/deep-agent-improvement/assets/` — benchmark-profiles/default.json, improvement_config.json, improvement_charter.md, improvement_config_reference.md, improvement_strategy.md, target_manifest.jsonc
- `.opencode/skills/deep-agent-improvement/references/` — all markdown referencing the skill name
- `.opencode/skills/deep-agent-improvement/scripts/tests/` — vitest files + fixtures

#### Bucket B — Commands + YAML Assets
- `.opencode/commands/deep/start-agent-improvement-loop.md` — skill-path references
- `.opencode/commands/deep/start-model-benchmark-loop.md` — skill-path references
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`
- `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml`
- Any new Lane C command assets (created in Phase 003)

#### Bucket C — Agent + Runtime Mirrors
- `.opencode/agents/deep-agent-improvement.md` → `.opencode/agents/deep-improvement.md`
- `.opencode/agents/README.txt` — agent-list entry
- `.claude/agents/deep-agent-improvement.md` → `.claude/agents/deep-improvement.md`
- `.claude/agents/README.txt`
- `.codex/agents/deep-agent-improvement.toml` → `.codex/agents/deep-improvement.toml`
- `.codex/config.toml` — agent routing config
- `.gemini/agents/deep-agent-improvement.md` → `.gemini/agents/deep-improvement.md`
- `.gemini/agents/README.txt`

#### Bucket D — Skill-Advisor Graph + Metadata
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` — graph nodes/edges
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` — shim references
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` — hardcoded name aliases
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` — explicit-match lane
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` — fusion scoring
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts`
- `.opencode/skills/system-skill-advisor/graph-metadata.json`
- `.opencode/skills/deep-agent-improvement/description.json` → auto-refreshed by `generate-context.js` post-rename

**Post-rename gate:** `advisor_rebuild` + `advisor_validate` must be green; `advisor_recommend` must resolve `deep-improvement` correctly.

#### Bucket E — Cross-Skill References
- `.opencode/skills/deep-loop-runtime/references/integration_points.md` — lists deep-agent-improvement as a consumer
- `.opencode/skills/cli-opencode/SKILL.md` + references/agent_delegation.md + references/cli_reference.md + manual_testing_playbook/04--agent-routing/008-orchestrate-agent-multi-agent.md + assets/prompt_templates.md + README.md — all name deep-agent-improvement as an agent/command target
- `.opencode/skills/sk-doc/assets/agent_template.md` — example references deep-agent-improvement
- `.opencode/skills/sk-prompt/graph-metadata.json`
- `.opencode/skills/README.md`

#### Bucket F — Install Guides + Root Docs
- `.opencode/install_guides/SET-UP - AGENTS.md`
- `.opencode/install_guides/README.md`
- Root-level `CLAUDE.md` and `AGENTS.md` (checked — no direct references to deep-agent-improvement in the read files, but verify at rename time)

#### Bucket G — Historical Specs / Changelogs (archive policy)
- `.opencode/specs/skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/` — references in spec/plan/tasks/checklist/description/implementation-summary and changelog.md (10 files total)
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/` — the sibling packet's own changelog (this references the skill name in historical context; Phase 002 policy: allow as archive, do not update retroactively)

#### Rename Ordering (Safe Sequence)
1. `git mv` the skill directory (bucket A root)
2. Update SKILL.md name/frontmatter/triggers/keywords (bucket A internal)
3. Fix all internal scripts/assets/references/tests (bucket A remainder)
4. Fix commands + YAML (bucket B)
5. Fix agent + mirrors (bucket C) — agent dir renames must match skill rename
6. Rebuild advisor graph + validate (bucket D) — `advisor_rebuild --force`, then `advisor_validate`
7. Fix cross-skill refs (bucket E)
8. Fix install guides (bucket F)
9. Verify grep-clean pass: zero operational references to `deep-agent-improvement` remain (allow historical spec archives)

[SOURCE: Phase 002 spec scope list; grep results from this iteration; .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37-45]

---

## Recommendations

1. **Split D1 into D1a (external) and D1b (internal) as independent sub-scores** each weighted 0.15 within the 0.30 D1 composite. Report them as a 2×2 utilization matrix in the Skill Benchmark Report so operators can immediately see whether the failure is advisor-side or skill-router-side.

2. **Make D1b deterministic post-hoc** — compute expected resources from the AI's ACTUAL task text (captured from the run), not from a pre-run prediction. This eliminates the need to guess what the AI will "think" before dispatch.

3. **Include near-neighbor confusion scenarios in every batch** — measure D1a precision against known sibling skills (deep-research, sk-code-review, deep-review for deep-improvement). These are the most diagnostic scenarios for advisor routing gaps.

4. **Adopt the three-strategy hybrid fixture authoring pipeline** (golden manual + trigger-paraphrase synthesis + domain-constitution generation), gated by the iteration-002 contamination checker. Golden scenarios provide calibration; synthesized scenarios provide breadth; constitution scenarios provide generative coverage.

5. **Generate negative scenarios from the skill's "When NOT to Use" section** — each exclusion class yields 1–2 prompts that should NOT trigger the skill. This provides a built-in irrelevance-detection suite for every skill benchmarked.

6. **Run the Phase 002 rename in the ordered bucket sequence above** (A through G). The advisor rebuild after bucket A/B/C but before bucket D is the critical check — if `advisor_validate` fails at that point, the remaining buckets can be adjusted without needing to revert directory renames.

7. **Store all scenario definitions (including expected-resource keys) under `benchmark-scenarios/<skill-slug>/`** — a path the AI has no reason to read. Ensure the scenario directory is NOT auto-discoverable by the skill's own router (e.g., place it outside the skill tree, under the spec packet).

---

## Open Questions

- **RQ3-F: How to capture the AI's task text for D1b post-hoc computation?** The iteration-002 harness captures Read()/Glob() calls but not the AI's internal framing. Does the first prompt auto-summary in the tool-output stream contain enough for `score_intents()` simulation? Or does the harness need to inject a "before you proceed, restate what you think the task is" instruction (which would itself contaminate the prompt)?

- **RQ3-G: Should near-neighbor scenarios be skill-specific or generic?** Per-target-skill is more diagnostic but less reusable. A shared "deep-family confusion" suite (covering deep-research, deep-review, deep-improvement, deep-agent-improvement) could be run against any deep-* skill.

- **RQ4-F: LLM paraphraser quality — which model?** The iteration-002 cross-CLI note (sk-doc line 189) warns that claude-opus-4.7 hallucinates plausible-sounding paths. If the same model used for paraphrase generation also hallucinates skill terms into "generic" prompts, the contamination gate will catch them — but a high false-positive rate slows fixture production.

- **RQ4-G: Constitution authorship — who writes the domain constitution?** If the skill author writes it, circularity risk returns (they encode their own mental model of what triggers the skill). Recommendation: have a DIFFERENT operator than the skill author write the domain constitution, or use a generic model with the skill's README as the only input.

- **RQ4-H: Fixture maintenance on skill update.** When a skill's `RESOURCE_MAP` or `INTENT_SIGNALS` changes, the golden scenarios' expected-resource keys go stale. The benchmark should detect this (pre-run liveness check — does the expected resource path still exist?) and flag stale scenarios before running. This is a subset of the D5 pre-run check from iteration-002.
