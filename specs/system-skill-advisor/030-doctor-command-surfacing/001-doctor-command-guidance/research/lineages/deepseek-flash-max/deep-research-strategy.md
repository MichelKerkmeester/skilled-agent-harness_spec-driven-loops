---
title: "Deep Research Strategy: Advisor guidance to doctor commands"
trigger_phrases: []
---

# Deep Research Strategy: Advisor guidance to doctor commands

## Research Topic

How can the skill advisor guide users to the right doctor command when they ask setup or health questions in plain words ('help me set up skilled', 'is my repo set up right', 'check my git hooks', 'why is this rule not enforced')? Study how the advisor routes today, measure at least ten such prompts against the live advisor, then design how it should point to doctor commands without stealing prompts from skills, and name the ideas to reject.

## Known Context

- This is a detached fan-out research lineage bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped. All writes stay inside this lineage directory.
- The parent packet is `specs/system-skill-advisor/034-doctor-command-guidance`; spec writeback, shared telemetry, continuity/memory save, and git staging are out of scope.
- `resource-map.md` is not present at the spec folder root; this lineage emits its own `resource-map.md` from its deltas.
- The advisor is live in this environment; `node .skilled/bin/skill-advisor.cjs advisor_recommend` is the measured surface.
- Ten iterations ran to the configured cap; every strategy question was answered by measured evidence.

## Key Questions

1. How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?
2. What does the advisor return today for the required plain-word setup and health prompts, measured live?
3. How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?
4. How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?
5. Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?
6. Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?
7. How can doctor routing avoid stealing prompts that legitimately belong to skills?
8. How should routing accuracy be tested, and which existing test seams should the harness reuse?
9. Which candidate ideas should be rejected, and for which measured reason?
10. What is the ranked recommendation set and the implementation phase plan?

## Non-Goals

- Implementing any code change in this lineage; this run reports findings and a proposed design only.
- Modifying the advisor, doctor commands, `_routes.yaml`, hooks, or tests outside this lineage directory.
- Re-litigating the parent packet's spec or plan; the lineage assesses routing behavior and design options.

## Stop Conditions

- Legal convergence per the deep-research default mode, or `maxIterations` = 10, whichever comes first.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?
- [x] What does the advisor return today for the required plain-word setup and health prompts, measured live?
- [x] How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?
- [x] How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?
- [x] Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?
- [x] Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?
- [x] How can doctor routing avoid stealing prompts that legitimately belong to skills?
- [x] How should routing accuracy be tested, and which existing test seams should the harness reuse?
- [x] Which candidate ideas should be rejected, and for which measured reason?
- [x] What is the ranked recommendation set and the implementation phase plan?

<!-- /ANCHOR:key-questions -->

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?
- What does the advisor return today for the required plain-word setup and health prompts, measured live?
- How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?
- How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?
- Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?
- Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?
- How can doctor routing avoid stealing prompts that legitimately belong to skills?
- How should routing accuracy be tested, and which existing test seams should the harness reuse?
- Which candidate ideas should be rejected, and for which measured reason?
- What is the ranked recommendation set and the implementation phase plan?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the source seam by seam (shim → skill contract → hook → lane → projection) exposed the command-bridge mechanism that documentation alone understates; the projection's generated block answered the "how are commands surfaced" question directly. (iteration 1)
- invoking the documented CLI verbatim gave clean, comparable JSON envelopes; persisting raw payloads keeps every later design claim anchored to observed behavior. (iteration 2)
- the manifest header answered the exact "is it harvested?" question that the design phase needed, and the measured prompt set maps almost word-for-word onto declared phrases. (iteration 3)
- reading the generator's validation code surfaced hard design constraints (id grammar, uniqueness, runtime enablement) that documentation does not state. (iteration 4)
- scoring specifics (phrase specificity, author-signal consumption, render label) made the mechanism choice decidable on code evidence rather than preference. (iteration 5)
- measuring both directions (controls and candidate phrases) before designing guards turned "avoid stealing" into a concrete phrase-ownership rule with named safe and contested phrases. (iteration 6)
- checking existing command conventions (single-route, default action, catalog mirroring) made the entry-point design a composition of existing patterns rather than a new invention. (iteration 7)
- discovering the existing corpus and gate policy converted the testing question from design to configuration, with named files and numbers. (iteration 8)
- verifying the binding constraints (advisory-only, no MCP, interactive mode, mutation classes) turned each rejection into a rule violation rather than a preference. (iteration 9)
- ranking by measured gap and available seams produced an order where each phase is gated by the previous one's artifacts. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the only gap is deliberate — `_routes.yaml` content, doctor command shapes and measured advisor outputs remain unread. (iteration 1)
- nothing failed; the initial shell attempt to compose records inline hit a quoting error, so record generation moved into a small committed script under `prompts/`. (iteration 2)
- nothing failed. (iteration 3)
- nothing failed. (iteration 4)
- nothing failed. (iteration 5)
- nothing failed. (iteration 6)
- nothing failed. (iteration 7)
- nothing failed. (iteration 8)
- mostly synthesis; the only fresh evidence is the constraint verification. (iteration 9)
- synthesis-heavy iteration; the only new material is the phase sequencing itself. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A full routing table in the hook fallback: static prompt-injected text must stay minimal. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A full routing table in the hook fallback: static prompt-injected text must stay minimal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A full routing table in the hook fallback: static prompt-injected text must stay minimal.

### A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion.

### Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection.

### Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment.

### Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics.

### Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist.

### Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff.

### Deferring the harness to the end: it is the gate for every other phase. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Deferring the harness to the end: it is the gate for every other phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferring the harness to the end: it is the gate for every other phase.

### Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate.

### Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary.

### Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation.

### None this iteration; all targeted reads resolved. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None this iteration; all targeted reads resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration; all targeted reads resolved.

### None; all 24 measurements returned clean, parseable envelopes. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None; all 24 measurements returned clean, parseable envelopes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; all 24 measurements returned clean, parseable envelopes.

### None; each mechanism has a concrete verdict. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None; each mechanism has a concrete verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; each mechanism has a concrete verdict.

### None; every seam resolved to concrete code or data. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None; every seam resolved to concrete code or data.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; every seam resolved to concrete code or data.

### None; the design options have concrete verdicts. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None; the design options have concrete verdicts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the design options have concrete verdicts.

### None; the infrastructure answered the design question directly. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None; the infrastructure answered the design question directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the infrastructure answered the design question directly.

### None; the manifest answered the consumption question directly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None; the manifest answered the consumption question directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the manifest answered the consumption question directly.

### None; the measurement surface delivered exactly what the topic asked for. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None; the measurement surface delivered exactly what the topic asked for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None; the measurement surface delivered exactly what the topic asked for.

### None. -- BLOCKED (iteration 10, 2 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction.

### One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate.

### Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases.

### Relying on the command-kind demotion to prevent theft: too small and only applies without a slash. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Relying on the command-kind demotion to prevent theft: too small and only applies without a slash.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the command-kind demotion to prevent theft: too small and only applies without a slash.

### Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie.

### Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands.

### This iteration's rule-set is itself the reject list; no additional dead ends. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: This iteration's rule-set is itself the reject list; no additional dead ends.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This iteration's rule-set is itself the reject list; no additional dead ends.

### Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it.

### Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing.

### Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment. (iteration 1)
- None this iteration; all targeted reads resolved. (iteration 1)
- Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing. (iteration 1)
- Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics. (iteration 2)
- None; the measurement surface delivered exactly what the topic asked for. (iteration 2)
- Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0. (iteration 2)
- Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection. (iteration 3)
- None; the manifest answered the consumption question directly. (iteration 3)
- Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it. (iteration 3)
- A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion. (iteration 4)
- Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate. (iteration 4)
- None; every seam resolved to concrete code or data. (iteration 4)
- Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary. (iteration 5)
- Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation. (iteration 5)
- None; each mechanism has a concrete verdict. (iteration 5)
- One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate. (iteration 5)
- Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff. (iteration 6)
- None; all 24 measurements returned clean, parseable envelopes. (iteration 6)
- Relying on the command-kind demotion to prevent theft: too small and only applies without a slash. (iteration 6)
- A full routing table in the hook fallback: static prompt-injected text must stay minimal. (iteration 7)
- None; the design options have concrete verdicts. (iteration 7)
- Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction. (iteration 7)
- Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases. (iteration 7)
- Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist. (iteration 8)
- None; the infrastructure answered the design question directly. (iteration 8)
- Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands. (iteration 8)
- None. (iteration 9)
- This iteration's rule-set is itself the reject list; no additional dead ends. (iteration 9)
- Deferring the harness to the end: it is the gate for every other phase. (iteration 10)
- Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie. (iteration 10)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT (detail)

- Source pointers: `.skilled/bin/skill-advisor.cjs`; `.skilled/skills/system-skill-advisor/`; `.skilled/commands/doctor/_routes.yaml`; `.skilled/commands/doctor/*.md`; `.skilled/commands/doctor/assets/`; `runtime/scripts/routing-accuracy/`; `runtime/scripts/command-bridges/`.
- Measured evidence: `events/measure-iter2-*.json` (12 onboarding/health prompts), `events/measure-iter6-*.json` (10 controls + 14 candidate phrases), `events/measure-iter6-index.json`.
- Constraints: every claim carries path:line citations; measured prompts were real advisor invocations against a live graph (generation 1033).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (reached)
- Convergence threshold: 0.05 (newInfoRatio, default mode, min 3 iterations) - loop stopped at the cap, so convergence is telemetry only
- Iterations completed: 10
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage's `research.md`)
- Lifecycle branch: `new` (detached fan-out lineage), generation 1
- Stop reason: maxIterationsReached
- Started: 2026-10-15T13:51:08Z
