---
title: Deep Research Strategy — packet 080 multi-ai-council improvements
description: Runtime strategy file for the deep-research loop investigating how to further improve the multi-ai-council convention without promoting it to a dedicated skill folder.
---

# Deep Research Strategy — packet 080

## 1. OVERVIEW

### Purpose
Persistent brain for the iterative deep-research session investigating multi-ai-council improvements. Records research focus, what worked / failed, answered questions, and next-focus per iteration.

### Usage
- Init: populated below from research_topic and packet 080 context.
- Per iteration: cli-codex agent reads Next Focus, writes iteration findings; reducer refreshes machine-owned sections.

---

## 2. TOPIC

How to further improve the multi-ai-council agent (`.opencode/agents/multi-ai-council.md`) and the `ai-council/` output protocol convention introduced in packet 080. Reference deep-research and deep-review skill patterns as inspiration for iteration mechanics, convergence detection, state schema, resume semantics, and quality gates — BUT do NOT promote multi-ai-council into a dedicated skill folder unless the lightweight bound (ADR-001) provably fails.

Investigate three threads:
- (1) Concrete improvements landable in follow-on packet 081 / 082+ (helper script shape, §17 caller protocol, §8 shared schema artifact, validator hints, advisor wiring, state.jsonl forward-compat, mirror-sync automation).
- (2) Whether existing spec-kit integration is solid: agent body §12-§15, 4-runtime mirrors, validator regression test, references/multi-ai-council/, packet-080 ai-council/ smoke-test artifacts. Or whether gaps exist (validator awareness, advisor scoring, /speckit:* wiring, hook integration, council-aware /memory:save anchoring).
- (3) Risks the round-2 amendments (ADD-1..ADD-6) introduce and mitigations.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: What concrete shape should the `persist-artifacts.sh` helper take (path, args, exit codes, parser strategy, fixture-test scaffold)?
- [x] Q2: Should §17 be added to the agent body or live in a reference file? Trade-offs of each placement?
- [x] Q3: How should the §8 OUTPUT FORMAT shared schema artifact be expressed (markdown contract, JSON schema, vitest fixture) and where should it live?
- [x] Q4: Does the validator need explicit `ai-council/` awareness (hint, recommended-files check, anchor enforcement) or is the current free-form policy sufficient?
- [x] Q5: Should the skill advisor scoring include `multi-ai-council` triggers (token boosts, phrase boosts) or is direct dispatch sufficient?
- [x] Q6: Is there a way to automate 4-runtime mirror-sync for `multi-ai-council` (or any agent) so future drift is caught at commit time?
- [x] Q7: What state.jsonl forward-compat strategy (versioned events, optional fields, schema evolution policy) should v1.1 adopt for the council protocol?
- [x] Q8: Should `/memory:save` learn to anchor council-completion events (e.g., new ANCHOR:council-report-{packet} ID) as part of the canonical save?
- [x] Q9: Are there specific risks in ADD-1..ADD-6 (caller enumeration, graceful degradation, schema artifact, depth-1 invocation, forward-only scope, sequencing) that need mitigation strategies?
- [x] Q10: Under what conditions should the lightweight bound (ADR-001) be revisited? What signals would justify promoting multi-ai-council into a dedicated skill?

---

## 4. NON-GOALS

- Building a dedicated `.opencode/skills/multi-ai-council/` skill folder unless ADR-001 provably fails (per user constraint).
- Adding a `/speckit:council` slash command (per non-goal N2 in spec.md).
- Auto-dispatch policies (council remains user-invoked).
- Cross-packet council aggregation.
- Replacing scratch/ for ad-hoc council notes.
- Implementing convergence math more sophisticated than 2/3 agreement (per non-goal N1).

---

## 5. STOP CONDITIONS

- Convergence reached (newInfoRatio rolling average < 0.05 OR weighted 3-signal vote > 0.60 + graph STOP_ALLOWED).
- All 10 key questions answered.
- maxIterations=10 reached.
- 3 consecutive stuck iterations.
- Concrete go/no-go on lightweight-bound preservation reached with evidence.

---

## 6. ANSWERED QUESTIONS
- Iteration 1 answered Q1: implement a Node CJS helper at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`, with parser exports, fixture-driven tests, strict-required §8 sections, optional-section graceful degradation, and exit codes 0/1/2.
- Iteration 2 answered Q2: add §17 to the agent body as the normative caller persistence protocol, but keep it short; delegate long caller examples and schema details to references when they would push the body toward the ADR-001 spill threshold.
- Iteration 3 answered Q3: express §8 as `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`, a markdown contract and requiredness matrix that the agent body and helper parser both reference; use vitest fixtures only as executable parser examples.
- Iteration 4 answered Q4: keep `validate.sh --strict` free-form for `ai-council/`; avoid ordinary validator warnings because strict mode turns them into failures; add only an explicit council-aware advisory/completion check after helper persistence exists.
- Iteration 5 answered Q5: do not add Skill Advisor token/phrase boosts for `multi-ai-council` while it remains an agent rather than a skill; rely on direct user/orchestrator dispatch and add only a regression guard if advisor routing is touched.
- Iteration 6 answered Q6: add normalized four-runtime mirror parity as a test-time contract, preferably through a small general agent mirror checker parameterized by agent name; fall back to a narrow `multi-ai-council` parity test if generalization is too large for packet 081.
- Iteration 7 answered Q7: keep council state forward-compatible through additive optional fields and optional per-line metadata (`schema_version`, `protocol`, `producer`); missing `schema_version` means v1, bare `event` rows remain valid, unknown keys are ignored, and packet 080 state logs are not rewritten.
- Iteration 8 answered Q8: do not add a new `ANCHOR:council-report-{packet}` save destination; treat `council_complete` as evidence for an optional helper-emitted `generate-context` payload that routes through existing `/memory:save` categories.
- Iteration 9 answered Q9: ADD-1 through ADD-6 are valid refinements, but mitigations should keep Section 17 short and normative, examples in references, helper invocation caller-owned, schema requiredness centralized, legacy outputs forward-only, packet 081 sequenced helper-first, and memory save optional/downstream.
- Iteration 10 answered Q10: revisit ADR-001 only when the council needs command-owned lifecycle/state machinery, reducer-owned writes, advisor/router dispatch, or enforcement surfaces comparable to deep-research/deep-review; ordinary helper, schema, reference, and mirror-parity growth should stay inside the lightweight bound.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Iteration 1: sibling reducer comparison worked for deriving a concrete helper shape without importing deep-research/deep-review's full state machinery.
- Iteration 2: comparing the agent body, ADR-001, round-2 ADDs, and orchestrate Depth-1 rules resolved §17 placement cleanly.

---

## 8. WHAT FAILED
[First iteration — populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]

---

## 11. NEXT FOCUS
Synthesis-ready: all 10 key questions are answered. Next pass should synthesize packet 081 / 082 recommendations rather than open another discovery question.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### From packet 080 (just shipped, 2 commits ago: 422000f7a + 3802b2d9b)

- Agent body `.opencode/agents/multi-ai-council.md` (683 LOC, 16 sections) carries §12 Output Protocol, §13 Invocation Contract, §14 State Schema, §15 Convergence Signal. §16 SUMMARY (ASCII box) closes.
- 4-runtime mirrors all in lockstep: .opencode/.md, .claude/.md, .gemini/.md, .codex/.toml.
- 4 reference files under `.opencode/skills/system-spec-kit/references/multi-ai-council/`: folder-layout.md (38 LOC), seat-diversity-patterns.md (35 LOC), convergence-signals.md (27 LOC), state-format.md (68 LOC).
- Vitest regression test at `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` (2 cases, codex-dispatch confirmed pass).
- Live smoke test produced 13 ai-council/ artifacts on packet 080 itself: config + strategy + state.jsonl (14 events, 2 rounds) + 6 seats + 2 deliberations + 1 critique + council-report.md with round-2 amendment.
- Round-2 verdict: "round-1 amended with addendum" — 6 ADDs (caller enumeration, graceful degradation, shared schema, depth-1 invocation, forward-only scope, packet 081 sequencing).
- ADR-001 (lightweight bound) preserved: no `.opencode/skills/multi-ai-council/` folder created.
- ADR-004: validator unchanged; treats `ai-council/` as free-form (alongside scratch/, research/, review/).

### Sibling deep-skill patterns (for inspiration only)

- deep-research lives at `.opencode/skills/deep-research/` with full SKILL.md (~500 LOC), assets (config template, strategy template, dashboard template, prompt pack), references, scripts (reduce-state.cjs, runtime-capabilities.cjs).
- deep-research has a reducer that maintains findings-registry.json + dashboard + strategy machine-owned sections per iteration.
- deep-research has graph-convergence MCP tool, 3-signal vote, quality guards, executor abstraction (native/cli-codex/cli-gemini/cli-claude-code), bounded spec.md mutations with seed markers.
- deep-review parallels deep-research with severity-rated findings (P0/P1/P2) instead of progressive synthesis.

### Caller enumeration (from round-2 ADD-1)

4 dispatch patterns observed via grep evidence:
- (a) Top-level Task dispatch (Claude Code direct)
- (b) `@orchestrate` LEAF target at Depth 1 (codified in orchestrate.md line 97, 192, 749)
- (c) `/speckit:*` command YAMLs (zero current dispatchers)
- (d) CLI-skill manual playbooks (cli-claude-code/cli-codex/cli-opencode/cli-gemini docs reference direct dispatch)

### Resource map status
resource-map.md not present at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/resource-map.md`; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Lifecycle branches: resume, restart
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex / gpt-5.5 / reasoning=high / service_tier=standard / sandbox=workspace-write
- Current generation: 1
- Started: 2026-05-06T15:11:00.000Z
