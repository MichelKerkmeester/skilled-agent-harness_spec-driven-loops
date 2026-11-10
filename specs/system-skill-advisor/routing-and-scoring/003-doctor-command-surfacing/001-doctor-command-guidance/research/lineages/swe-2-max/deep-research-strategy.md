# Deep Research Strategy - Session Tracking

Lineage `swe-2-max` of the fan-out run for `specs/system-skill-advisor/034-doctor-command-guidance`. Session id `fanout-swe-2-max-1792072037811-has9cy`. Artifact dir is this lineage directory.

## 1. OVERVIEW

Persistent plan for this lineage's research loop. Read by the lineage executor at every iteration.

---

## 2. TOPIC

How can the skill advisor guide users to the right doctor command when they ask setup or health questions in plain words, such as 'help me set up skilled', 'is my repo set up right', 'check my git hooks' or 'why is this rule not enforced'? Study how the advisor routes today (`.skilled/bin/skill-advisor.cjs`, `.skilled/skills/system-skill-advisor/` scorer, `hooks/skill-advisor-hook.md`, graph and trigger data), how commands are surfaced to the advisor versus skills, and the doctor family (`.skilled/commands/doctor/*.md`, `.skilled/commands/doctor/_routes.yaml` trigger_phrases, `/doctor:sk-code setup`, `/doctor:git setup`, `/doctor:speckit`, `/doctor:env`, `/doctor:update`, `/doctor:mcp`, `/doctor:skill-advisor`). Measure what the advisor returns today for at least ten such prompts via `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json`. Then design how it should point to doctor commands: whether `_routes.yaml` trigger phrases should feed the advisor, a dedicated onboarding or 'set up skilled' entry point, how to avoid stealing prompts from skills, and how to test routing accuracy. Name ideas to reject with the reason. Cite path:line for every claim. End with ranked recommendations and proposed implementation phases.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does skill-advisor.cjs score and surface candidates today: scorer inputs, hook wiring, graph and trigger data sources?
- [x] How are commands surfaced to the advisor versus skills, and do doctor commands appear in advisor output at all today?
- [x] What does the advisor return today for at least ten plain-language setup/health prompts (measured baseline)?
- [x] What does the doctor command family cover: .skilled/commands/doctor/*.md routes and _routes.yaml trigger_phrases per route?
- [x] What design should point users at doctor commands (feed _routes.yaml triggers into the advisor, dedicated onboarding entry, anti-steal rules versus skills, routing-accuracy tests), and which ideas should be rejected and why?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing the advisor change (research only; implementation is a follow-up).
- Modifying advisor scoring code, doctor commands, or any file outside this lineage directory.
- Evaluating non-doctor command families beyond what is needed to explain command surfacing.
- Editing spec.md or other packet docs (bounded spec anchoring is not part of this fan-out lineage).

---

## 5. STOP CONDITIONS

- All five key questions carry evidence-backed answers with path:line citations.
- A measured baseline of at least ten advisor_recommend runs exists in the iteration record.
- Ranked recommendations, rejected alternatives with reasons, and proposed implementation phases are written into research.md.
- Convergence per composite signals with legal-stop gates passing, or maxIterations (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does skill-advisor.cjs score and surface candidates today: scorer inputs, hook wiring, graph and trigger data sources?
- How are commands surfaced to the advisor versus skills, and do doctor commands appear in advisor output at all today?
- What does the advisor return today for at least ten plain-language setup/health prompts (measured baseline)?
- What does the doctor command family cover: .skilled/commands/doctor/*.md routes and _routes.yaml trigger_phrases per route?
- What design should point users at doctor commands (feed _routes.yaml triggers into the advisor, dedicated onboarding entry, anti-steal rules versus skills, routing-accuracy tests), and which ideas should be rejected and why?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined.

### "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path.

### Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8.

### Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope.

### Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers.

### Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes.

### Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there.

### None yet; every probe produced evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet; every probe produced evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet; every probe produced evidence.

### None. -- BLOCKED (iteration 5, 4 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there. (iteration 1)
- None yet; every probe produced evidence. (iteration 1)
- Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes. (iteration 2)
- None. (iteration 2)
- Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope. (iteration 3)
- Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers. (iteration 3)
- "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined. (iteration 4)
- "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path. (iteration 4)
- Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8. (iteration 5)

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
- How does the Python compat scorer (`skill_advisor.py`) treat bridges, for parity? (iteration 1)
- What trigger_phrases does `_routes.yaml` carry per doctor route, and is that file machine-readable enough to feed `derive-command-bridges.cjs`? (iteration 1)
- Does `advisor_recommend` ever emit a doctor suggestion today on setup/health prompts? (measured baseline) (iteration 1)
- How does the Python compat scorer treat bridges (parity)? (iteration 2)
- What does `_routes.yaml` declare per doctor route, and is the phrase vocabulary compatible with the advisor's lexical lanes? (iteration 2)
- Design: where should doctor guidance live (bridge entries vs phrase boosts vs a new surface), and how to test routing accuracy. (iteration 2)
- Parity check on the Python scorer is folded into the design question (both scorers consume the same generated table). (iteration 3)
- Design: how should doctor guidance be surfaced (bridge entries from _routes.yaml? phrase boosts? new surface?), dedicated onboarding entry, anti-steal rules, test approach. Which ideas to reject and why. (iteration 3)
- Q5 design synthesis: which mechanism to recommend, onboarding entry shape, anti-steal calibration, test approach, rejected ideas — one consolidation iteration remains. (iteration 4)
- None material. Minor implementation detail deferred: whether the bridge `id`/`name` should render as `doctor:git` (bare, matching `create:agent` convention) versus `command-doctor-git` — a labeling choice for implementation, not a design blocker. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.skilled/bin/skill-advisor.cjs` (advisor CLI entry); `.skilled/skills/system-skill-advisor/` (scorer, `hooks/skill-advisor-hook.md`, graph/trigger data); `.skilled/commands/doctor/*.md` and `.skilled/commands/doctor/_routes.yaml` (doctor routes + trigger_phrases); `.skilled/commands/` generally (command surface vs skill surface).
- Reuse candidates: the advisor's existing trigger/keyword scoring, `_routes.yaml` trigger_phrases as a routing data source, the `command-spec-kit` advisor bridge for `/speckit:*` and `/deep:*` commands.
- Integration points: `advisor_recommend` JSON output shape; hook injection path; any command-catalog or route-registry loader.
- Constraints and risks: must not steal prompts that belong to skills (false-positive doctor routing); trigger overlap between doctor phrases and skill descriptions; measurement requires running the advisor CLI which may have daemon/daemon-free modes.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (newInfoRatio semantics; composite STOP score > 0.60 with legal-stop gates)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output (in this lineage dir)
- Lifecycle branches: `new` (this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `{lineage_dir}/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-15T13:50:20Z
