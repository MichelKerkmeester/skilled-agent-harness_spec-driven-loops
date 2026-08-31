---
title: "Deep Research Strategy: Repo-Rules Gap and Governor Disposition"
description: "Session tracking for the five-iteration research run over the shipped repo-rules set, AGENTS.md, and the retired per-turn governor directive. Convergence is telemetry only; the minimum-iteration floor equals the cap so nothing but the terminal cap can stop the loop."
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy: Repo-Rules Gap and Governor Disposition

Session tracking for this run. Analyst-owned sections are stable; machine-owned sections are rewritten by the reducer after each iteration.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Repo-rules set gap analysis and the retired Fable governor disposition: RQ1 coverage of AGENTS.md thinking-and-acting rows by the shipped repo-rules set; RQ2 which AGENTS.md rows should move down into a rule file and which must stay; RQ3 container-versus-content verdict for the per-turn governor directive retired in commit 4477a9f1; RQ4 which further repo rules are warranted, which plausible ones are not, and at least one subtraction candidate; RQ5 critique of repo-rules/delegation-and-orchestration.md as shipped, then a ranked recommendation list

The full question set, corpus, and output contract live in `research-questions.md` beside this file.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] RQ1: Does the shipped repo-rules set expand every thinking-and-acting row in `AGENTS.md` sections 2, 3, 4 and 7, and which rows are still compressed with nowhere to expand?
- [ ] RQ2: Which `AGENTS.md` rows should move down into a rule file, and which must stay because they are hard blockers, gates, or routing?
- [ ] RQ3: Separating container from content, does the disposition carried by the per-turn governor directive retired in commit `4477a9f1` earn a rule file, a section in an existing file, or nothing?
- [ ] RQ4: Which further repo rules are warranted, which plausible-sounding ones are not, and what is the subtraction candidate?
- [ ] RQ5: What does `repo-rules/delegation-and-orchestration.md` get wrong, overstate, or leave uncovered?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Relitigating the governor retirement itself. Commit `4477a9f1` stands; the question is the container, not whether removal was right.
- Editing `repo-rules/`, `REPO RULES.md`, or `AGENTS.md`. This run proposes; phase 4 disposes.
- Skill routing, workflow selection, spec-folder mechanics, agent dispatch mechanics, and MCP routing - excluded from `repo-rules/` by the router's own scope statement.
- Re-measuring the always-loaded surface. `specs/agents/004-agents-md-bloat-audit/` already did; cite it.
- Designing enforcement tooling.

---

## 5. STOP CONDITIONS
- Terminal cap at iteration 5. `minIterations` equals `maxIterations`, so the convergence floor overrides every convergence stop candidate and only `maxIterationsReached` can end the loop. This implements the operator's `--stop-policy=max-iterations`: convergence is recorded as telemetry and never shortens the run.
- A write outside the bound artifact directory is a failed run regardless of finding quality; write containment reverts it and the dispatch fails.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

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
- RQ3: container-versus-content verdict for the retired governor directive (iteration 1)
- RQ5: critique of `delegation-and-orchestration.md` as shipped (F4's largest (iteration 1)
- RQ4: warranted vs not-warranted further rules + the subtraction candidate (iteration 1)
- RQ2: which rows should move down into a rule file, which must stay (hard (iteration 1)
- RQ5: critique of `delegation-and-orchestration.md` — thin anchor note (O4). (iteration 2)
- RQ4: host assignment for the 8 gaps (section-additions to 3–4 existing files vs (iteration 2)
- RQ4: host assignment for the 8 gaps (section-additions to 3–4 existing files (iteration 3)
- RQ5: critique of `delegation-and-orchestration.md` as shipped (thin single anchor (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
RQ5: critique of `delegation-and-orchestration.md` as shipped (thin single anchor

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior context: **None retrieved.** The `system-spec-memory` MCP server failed to connect this session (CONNECT_TIMEOUT after 30s), so `memory_context` could not run. This is a connection failure, not an absence of stored context - anything the memory layer holds about this packet is unavailable to the run and its absence must not be read as "no prior work exists".

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under the max-iterations stop policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-08-31T06:02:07Z
