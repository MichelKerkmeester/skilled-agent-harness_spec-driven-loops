---
title: Deep Research Strategy - sk-doc Routing Foundation
description: Session tracking for deep research into sk-doc's skill-routing foundation, benchmark failure modes, and implementable routing fixes.
trigger_phrases:
  - "sk-doc routing research"
  - "hub router alignment"
  - "skill benchmark recall"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `.opencode/specs/sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research/research/inbox.jsonl` to append external questions during an active run.

---

## 2. TOPIC

Diagnose and fix sk-doc's skill-routing foundation so the AI assistant reliably surfaces the right sk-doc reference/document at the right moment — perfect routing (right skill + right files, on demand). Grounded in the Tier-2 gpt-5.6-luna skill-benchmark: sk-doc scored 20/100 with ~19% exact-resource recall; misses correlate strongly with wrong path-root (answers beginning with create-* prefixes instead of root-relative references/… paths) and with over-bundling (e.g. one scenario routed 65 resources all wasted). Deliverable: prioritized, implementable optimizations to sk-doc's skill-routing templates, routing logic, and JSON config artifacts (hub-router.json, mode-registry.json, command-metadata.json), each tied to the benchmark failure mode it addresses. This is the FOUNDATION phase — findings must be implementable before the remaining skills are researched.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Are the ~34 mode-registry.json aliases that lack literal hub-router.json vocabularyClass counterparts under-scored or invisible to the benchmark scorer (router-replay.cjs projectHubRouter / buildRegistryIndex / buildHubRouteTelemetry), and does that alias-coverage gap explain sk-doc's ~19% exact-resource recall?
- [ ] Q2: Do the create-skill sub-skill's routing templates (skill_smart_router.md teaching and the JSON config it emits) steer models toward the wrong path-root convention (create-* prefixed paths instead of root-relative references/… paths)?
- [ ] Q3: How exactly does the skill-benchmark scorer read hub router config, gold answers, fitted-vs-holdout splits, and dimensions D1intra / D2 / D3 / D5 for a hub skill like sk-doc — and at which scoring stage does sk-doc lose the most points (path-root mismatch, over-bundling penalty, or missing alias projection)?
- [ ] Q4: Does routing-registry-drift-guard already catch the alias-coverage gap between mode-registry.json and hub-router.json vocabularyClasses; if not, what specific guard check is missing?
- [ ] Q5: What is the prioritized, implementable set of optimizations to hub-router.json, mode-registry.json, command-metadata.json, and the create-skill routing templates — each tied to the benchmark failure mode it addresses (wrong path-root, over-bundling, alias invisibility)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Researching or fixing the routing of skills other than sk-doc (that is the follow-on phase; this is the FOUNDATION phase).
- Implementing the fixes in this session — deliverable is implementable findings, not applied patches.
- Re-running or re-scoring the full Tier-2 skill-benchmark suite.
- Redesigning the benchmark scorer itself beyond identifying where it under-scores or mis-reads sk-doc's hub routing.

---

## 5. STOP CONDITIONS

- stop_policy=max-iterations: convergence is telemetry only; the loop runs until maxIterations (10) unless halted by error/pause.
- All five key questions answered with evidence AND a prioritized implementable fix list exists.
- 3+ consecutive iteration failures (error recovery halts loop into synthesis with partial findings).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- tracing the literal `~34` phrase first separated a stale documentation premise from scorer behavior; following runtime file reads then established the live-versus-snapshot boundary directly. (iteration 2)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the broad initial artifact search produced substantial unrelated benchmark data; narrow symbol and exact-phrase searches were more reliable. (iteration 2)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483]

### **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent]

### **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483] (iteration 2)
- **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent] (iteration 2)
- **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163] (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q2 through Q5 remain open, including template path-root guidance, scorer dimensions, guard behavior beyond already-demonstrated drift equality, and the prioritized fix list. (iteration 1)
- Does `router-replay.cjs` consume the current 113 aliases, a reduced projection, or a stale benchmark snapshot? (iteration 1)
- What produced the expected "~34" figure, and does it refer to a different comparison such as command aliases, gold resources, or normalized tokens rather than literal registry-vocabulary equality? (iteration 1)
- **Q3:** Partially answered. Remaining work is to trace the Mode-B live observation parser and private/public gold join across all 19 rows, then quantify which stage loses points through path mismatch versus over-bundling. (iteration 2)
- **Q2:** Whether create-skill teaching and emitted templates cause the model's wrong path-root convention. (iteration 2)
- **Q4:** Whether the drift guard detects stale canon text and/or enforces the chosen mirrored-vocabulary strategy. (iteration 2)
- **Q5:** Prioritized fixes after Q2–Q4 are evidenced. (iteration 2)
- **Q2:** Determine whether create-skill teaching/templates explicitly or implicitly cause packet-prefixed and shared-prefixed answers. (iteration 3)
- **Q4:** Determine whether the drift guard checks root-path convention and second-layer resource coverage, not only registry/router projection equality. (iteration 3)
- **Q5:** Prioritize fixes using the now-quantified failure distribution; preserve separate fixes for path canonicalization, expected-leaf discoverability, and bundle caps. (iteration 3)
- **Q4:** Determine whether `routing-registry-drift-guard` checks output namespace/root convention, second-layer leaf coverage, fixture-to-topology validity, or only registry/router projection equality. (iteration 4)
- **Q5:** Produce the prioritized fix list with separate controls for path namespace/canonicalization, leaf discoverability, bundle caps, and benchmark provenance snapshots. (iteration 4)
- **Q5:** Convert the six boundary results into a prioritized implementation sequence across `hub-router.json`, `mode-registry.json`, the absent `command-metadata.json`, create-skill teaching/templates, a second-layer leaf manifest/router, bundle caps, fixture validation, and benchmark provenance. (iteration 5)
- None for Q5. The exact JSON property names are implementation-level choices, but the four path roles, conversion boundary, ownership split, and validation order are fixed by the evidence. (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None for Q5. The exact JSON property names are implementation-level choices, but the four path roles, conversion boundary, ownership split, and validation order are fixed by the evidence.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- memory_context lookup at init timed out (MCP -32001); no prior memory context loaded. Prior related packets exist under `.opencode/specs/sk-doc/031-sk-doc-router-alignment/` (001-audit-and-fix-map … 009-packet-smart-routing-conformance) and may contain relevant prior findings — iterations should consult them directly.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers:
  - `.opencode/skills/sk-doc/SKILL.md`, `.opencode/skills/sk-doc/hub-router.json`, `.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/command-metadata.json`
  - `.opencode/skills/sk-doc/create-skill/` (skill_smart_router.md teaching + emitted JSON config templates)
  - system-deep-loop skill-benchmark scorer: `router-replay.cjs` (projectHubRouter / buildRegistryIndex / buildHubRouteTelemetry), routing-registry-drift-guard
  - Tier-2 gpt-5.6-luna skill-benchmark results for sk-doc (20/100, ~19% exact-resource recall)
- Reuse candidates: sibling packets 001–009 under `031-sk-doc-router-alignment/` (prior audits, conformance gap analyses, hub intent keyword coverage work).
- Integration points: hub-router.json, mode-registry.json, command-metadata.json, create-skill templates.
- Constraints and risks: hub skill carries NO fenced INTENT_SIGNALS/RESOURCE_MAP block itself — routing is purely config-driven; findings must be implementable.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stop_policy=max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-16T05:29:50.043Z
