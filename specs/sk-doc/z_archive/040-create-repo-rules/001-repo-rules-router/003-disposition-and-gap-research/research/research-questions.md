---
title: "Research Questions: Disposition and Rule-Set Gap Research"
description: "Five research questions, one per iteration, over the shipped repo-rules set, AGENTS.md, and the history of the retired Fable governor directive. Convergence is telemetry only; the loop runs the full five iterations because the operator asked for that depth, and the single durable output is a ranked recommendation list phase 4 consumes."
trigger_phrases:
  - "research strategy"
  - "rule set gap questions"
  - "governor disposition research"
  - "five iteration plan"
importance_tier: "normal"
contextType: "research"
---

# Research Questions: Disposition and Rule-Set Gap Research

## 1. RUN CONFIGURATION

| Setting | Value | Why |
|---------|-------|-----|
| Iterations | 5 | Operator-specified depth |
| Stop policy | `max-iterations` | Convergence is telemetry; an early stop would deliver less than the requested depth |
| Executor | `cli-devin` | The surface carrying the requested model family |
| Model | `deepseek-v4-flash-max` | DeepSeek V4 Flash **Max** thinking tier, confirmed present in the live roster on 2026-08-31; the tier is baked into the uid rather than set by a flag |
| Write authority | `specs/agents/007-repo-rules-router/003-disposition-and-gap-research/` | The run may propose; it may not apply |

---

## 2. CORPUS

Read in every iteration:

- `REPO RULES.md` and the seven files under `repo-rules/`, in their post-phase-2 state.
- `AGENTS.md`, sections 2, 3, 4, 7 and 8 in particular.

Read where the question calls for it:

- Commit `4477a9f1` — `refactor(hooks): retire the governor and proof-over-appearance directives`.
- `specs/hooks/007-fable-governor-pi-hook/` — the packet that built, then retired, the per-turn directive.
- `specs/agents/004-agents-md-bloat-audit/` — the existing measurement of the always-loaded surface.
- `specs/agents/006-restraint-and-routing-gates/` — the prior restraint work this packet followed.

---

## 3. RESEARCH QUESTIONS

### RQ1 — Coverage (iteration 1)

Does the rule set actually expand every thinking-and-acting row in `AGENTS.md`? Map each
compressed row in sections 2, 3, 4 and 7 to the rule file that expands it. Name the rows
with no expansion, and the rule text with no corresponding `AGENTS.md` row.

**Output:** a two-column mapping, plus an explicit list of unmapped rows in both directions.

### RQ2 — Direction of travel (iteration 2)

Which `AGENTS.md` rows should move *down* into a rule file, shrinking what loads every
turn? Which must stay because they are hard blockers, mandatory gates, or routing?

**Output:** candidate rows with a line-count delta for each, and the ones that must stay,
with the reason each is immovable.

### RQ3 — The governor disposition (iteration 3)

Commit `4477a9f1` retired a per-turn directive whose content was never disputed. Separate
the container from the content. What exactly did the directive bind? What did retiring the
per-turn injection buy? Does the content justify a rule file, a section inside an existing
rule file, or nothing?

**Constraint:** the retirement is not being relitigated. The question is whether a
triggered container is the right home for what a per-turn container was the wrong home for.

**Output:** a verdict — rule file, section, or nothing — and what the container change buys.

### RQ4 — Inventory (iteration 4)

Are further rules warranted? Just as importantly, which plausible-sounding rules are *not*?
Restraint applies to the rule set itself: a seven-file set that becomes twelve because
twelve sounds thorough has failed its own `overengineering.md`.

**Output:** warranted additions with the failure each prevents, and a refused list with the
reason each was refused. At least one subtraction candidate, or an explicit statement that
none was found.

### RQ5 — The new rule under test (iteration 5)

`repo-rules/delegation-and-orchestration.md` was written by this packet, in one pass, by one
reader — the exact single-lens condition the rule itself names as insufficient. Critique it.
What does it get wrong, overstate, or leave uncovered? Then synthesize the ranked
recommendation list.

**Output:** the critique, then the ranked list.

---

## 4. OUTPUT CONTRACT

The run's durable deliverable is a ranked table in `research.md`:

| Rank | Target file | Change | Failure it prevents | Evidence |
|------|-------------|--------|---------------------|----------|

Every row must be decidable by phase 4 without opening the iteration transcripts. A claim
with no resolvable citation is recorded as UNKNOWN rather than ranked.

---

## 5. OUT OF BOUNDS

The router's own scope statement excludes skill routing, workflow selection, spec-folder
mechanics, and dispatch *mechanics*. A recommendation landing in one of those is marked
out of bounds rather than ranked — it belongs to `AGENTS.md` and the skills it routes to.
