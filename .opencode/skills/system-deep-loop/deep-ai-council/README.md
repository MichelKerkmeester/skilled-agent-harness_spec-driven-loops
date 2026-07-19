---
title: "deep-ai-council"
description: "Planning-only council skill that runs 2-3 distinct AI seats through independent proposals, cross-critique and convergence, then persists auditable packet-local artifacts."
trigger_phrases:
  - "deep ai council"
  - "ai council"
  - "council deliberation"
  - "multi-seat planning"
  - "planning council"
  - "council convergence"
version: 2.4.0.0
---

# deep-ai-council

> Put multiple reasoning lenses on a plan, let them disagree honestly and converge only when the disagreement is resolved.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Comparing two or more plans when the trade-offs matter and a single answer hides what got ruled out |
| **Invoke with** | "ai council", "multi-seat planning", "compare strategies", or the `@ai-council` agent |
| **Works on** | Your packet folder and its context, dispatching 2-3 seats with distinct reasoning lenses inside one CLI per round |
| **Produces** | A recommended plan, an append-only state log, per-seat proposals, critiques, failed-round forensics and a final report under `ai-council/` |

---

## 2. OVERVIEW

### Why This Skill Exists

When a plan carries real trade-offs, one AI answer is one confident guess with no record of what it ruled out. You can hand-run "ask three models" but you get diversity without a convergence rule, no persistence and no audit trail. You need structured disagreement: seats that propose independently, critique each other and only agree when the evidence supports it, not when politeness demands it. You also need a replayable record of every round so your team can see why a plan won, not just what won.

### What It Does

`deep-ai-council` runs a planning-only multi-seat council. Two or three seats, each with a distinct reasoning lens from six available (Analytical, Creative, Critical, Pragmatic, Holistic, Research), propose independently. Then three critique roles (Hunter, Skeptic and Referee) attack the leading plan before anything is declared settled. Convergence follows a two-of-three rule: two seats must agree on the material plan and critique must find no new high-severity blocker. The council never implements. It hands the recommended plan plus the full artifact trail to you or your implementation agent.

---

## 3. QUICK START

**Step 1: Invoke it.** The council offers two surfaces. Pick the one that fits your workload.

For a single planning pass, dispatch the `@ai-council` LEAF agent. It returns one report and one artifact tree to your packet folder.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "run an ai council for the login refactor" --threshold 0.8

# Or dispatch the agent directly from an orchestrator
@ai-council: Compare the streaming ingest plan against the batch ingest plan for specs/042-pipeline/ and persist the artifacts.
```

Expected output: a council report with scored proposals, cross-critique notes and convergence status.

For an iterative multi-topic session, use the deep mode commands.

```bash
# Non-interactive bounded run
/deep:ai-council:auto

# Operator gates for setup, loop, synthesis and save
/deep:ai-council:confirm
```

Deep mode iterates over multiple topics, each with its own rounds, and converges per topic before moving on. Default guards cap at 3 rounds per topic and 5 topics per session.

**Step 2: Persist the report.** The `@ai-council` agent is scoped-write and persists the canonical packet-local `ai-council/**` artifact set directly. The CLI helper remains available as a fallback for non-council callers that already have a captured report.

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs specs/042-pipeline \
  --input-file /tmp/council-report.md
```

Expected result: a packet-local `ai-council/` tree with `ai-council-state.jsonl`, per-seat outputs under `seats/round-NNN/`, deliberation and critique notes and `council-report.md`. A dispatching parent does not need to invoke the helper for normal `@ai-council` persistence.

**Step 3: Verify completion before you hand off.**

```bash
node .opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs specs/042-pipeline
```

Expected result: confirmation that `ai-council-state.jsonl` ends with a `council_complete` event.

---

## 4. HOW IT WORKS

### The Council Round

A council run moves through three steps. First, resolve the target packet folder and select 2-3 seats, each assigned a distinct reasoning lens. When real external executors are available you can add a different AI vantage in a second round, but all seats inside one round always use the same CLI. Simulated vantages stay labeled as simulated. The default and most common run is a single in-CLI round. Add external rounds only when a fresh vantage adds value.

Second, deliberate. Each seat proposes independently. Then the adversarial critique pass tries to break the leading proposal before agreement is allowed. If the council hits its round cap without convergence, the run completes as non-converged rather than fabricating consensus. Non-converged is an honest answer: it means the evidence did not settle toward one plan.

Third, persist and hand off. The council produces a report with sections mandated by the output schema and writes the canonical packet-local `ai-council/` artifacts when running as the scoped-write agent. The CLI helper is a fallback for non-council callers with a captured report. Failed rounds move under `failed/` so the forensic trail survives. Implementation passes to an implementation agent or the caller.

### Six Strategy Lenses

Each seat draws from one of six lenses so no two seats repeat the same reasoning path. Analytical decomposes the problem into components and dependencies. Creative explores unconventional shapes. Critical pressure-tests failure modes and edge cases. Pragmatic scores for implementation cost and incremental value. Holistic checks system fit and long-range consequences. Research gathers external evidence and tests source quality.

A round uses 2 or 3 seats and never more. The task type drives the lens recommendation: a bug fix benefits from analytical, critical and pragmatic. A feature call benefits from creative, analytical and holistic.

### Three Critique Roles

Before convergence is allowed, three roles test the leading plan. The Hunter attacks for missed edge cases and weak evidence. The Skeptic defends, separating real flaws from intended trade-offs. The Referee adjusts scores based on both arguments and records the adjustments so the reasoning stays auditable. No plan passes without surviving this pass.

### The Two-of-Three Convergence Rule

Convergence is not a popularity vote. A plan converges when two of three seats agree on the material direction and the critique pass finds no new high-severity blocker. The shipped config also declares the shared anti-convergence floor for council mode: `antiConvergence.minRounds = 2`, `convergenceMode = "default"` and `stopPolicy = "fail-closed"`. If the council hits `max_rounds` without hitting that bar, the run emits `non-converged`. Preserved failed-round forensics let you inspect what blocked convergence and decide whether to add a round, change lenses or accept the partial result.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the council when a plan has real trade-offs and you want structured disagreement rather than one person's (or one model's) best guess. It fits architecture decisions, multi-path refactors, high-risk changes and any situation where knowing what got ruled out matters as much as what won.

Skip it when the question has one clear answer, when you need a quick implementation path without comparison or when the extra cost of 2-3 seat runs is not justified.

The council is planning only. It recommends a plan and persists the reasoning. It never writes application code, never edits spec docs outside `ai-council/` and never commits or deploys. Once it hands off, implementation belongs to `@code`, the caller or your own workflow.

### Sibling Deep Loops

The council shares the `runtime/` with the other active deep-loop families. The current active roster is research, review, ai-council and improvement; each owns a different phase of the planning-to-implementation pipeline and none crosses into another's territory. Use `@context` or `/speckit:plan` for codebase context before council work.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates evidence and answers research questions. The council uses research seats to gather evidence but does not run deep-research loops itself. |
| `deep-review` | Audits code for bugs, security gaps and quality issues. The council recommends a plan, and a review checks the result after implementation. |
| `deep-improvement` | Runs evaluator-first improvement across the `agent-improvement`, `model-benchmark`, and `skill-benchmark` command lanes. |

### Behavior Benchmark

`behavior-benchmark/` (ACB scenarios) measures what an executor model actually does at the `/deep:ai-council` command surface under realistic vague/concise prompts: whether it convenes diverse seats (scored on **persisted seat artifacts**, since the common council is in-CLI with no task dispatch), how it presents, whether it stalls, and its latency versus a Claude baseline. Contracts + baselines live here; run evidence and the cross-mode scorecard live in the `033-deep-loop-behavior-benchmarks` packet.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the packet folder where `ai-council/` artifacts live. Validation, resume and continuity all run through it. |
| `runtime/` | Shared runtime for the active deep-loop families. Council graph support is a derived projection rebuilt from artifacts through the runtime's CLI scripts. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Council emits `non-converged` | The council hit `max_rounds` without two-of-three agreement and refused to fake consensus | Read the failed-round forensics under `failed/round-NNN-<timestamp>/`. Add a round with different lenses or accept the partial result as the honest answer. |
| `persist-artifacts.cjs` exits 1 during capture | The report is missing a required section from the output schema | Compare the report against `references/structure/output-schema.md` and add the missing section. Run with `--strict-output` to enforce the full contract. |
| Per-seat files are absent from a persisted run | The report used a composition-table fallback instead of per-seat headings | Confirm the report uses valid per-seat headings or a composition table the parser accepts. |
| Seats produce nearly identical proposals | Seat diversity was too low and the council repeated the same reasoning path | Assign distinct lenses per seat. Check the task-type-to-lens mapping in `references/patterns/seat-diversity-patterns.md` and re-run with more divergent seats. |
| `advise-council-completion.cjs` reports no `council_complete` event | The final event was never appended to the state log | Re-open the council context and append the completion event, or re-persist from a completed report. |
| Advisor does not route "ai council" prompts | Stale or missing skill graph | Rebuild the skill-advisor graph, then retry the routing query. |

---

## 7. FAQ

**Q: Does the council implement the plan it recommends?**

A: No. It produces planning artifacts and hands off. Implementation belongs to `@code`, the caller or your own workflow. The council never writes application code, never edits spec docs outside `ai-council/` and never commits.

**Q: When should I use a council instead of asking one model for a plan?**

A: Use a single model when the direction is clear. Use the council when the trade-offs are real, when you need to know what was ruled out and why or when the decision will be hard to reverse later. The council costs more compute but produces a disagreement record a single model cannot give you.

**Q: What does the two-of-three rule actually mean?**

A: Two of three seats must agree on the material plan direction, and the critique pass must find no new high-severity blocker. If critique surfaces a blocker, the leading plan is not converged regardless of seat agreement. The rule prevents both false consensus and popularity contests.

**Q: Where does the audit trail live?**

A: Inside your packet folder under `ai-council/`. The append-only `ai-council-state.jsonl` records every event. Per-seat proposals live under `seats/round-NNN/`. Deliberations and critiques live in their own folders. Failed rounds move under `failed/`. Nothing is deleted, and nothing is rewritten.

**Q: Can I run a council with seats from different AI providers in the same round?**

A: No. All seats inside one round must use the same CLI executor. Seat diversity within a round comes from different models or reasoning lenses on that CLI, not from mixing providers. If you want a different provider's vantage, add a second dedicated round. This keeps each round's sandbox, tool surface and output schema consistent.

**Q: What happens when the council does not converge?**

A: The run completes as `non-converged`. This is an honest answer: the evidence did not settle toward one plan. The failed-round forensics show you what blocked convergence. You can inspect them, adjust lenses or the scope and re-run, or accept the partial result and decide yourself.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-ai-council/README.md --type readme` reports zero issues |
| Skill package structure | `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/system-deep-loop/deep-ai-council` exits 0 |
| Playbook scenarios | Run the scenarios under `manual-testing-playbook/` across its nine categories: runtime routing, council deliberation, artifact persistence, convergence and rollback, scope boundaries, depth and failure handling, the writer-library contract, council-graph integration and council-graph value comparison |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full operating contract |
| [`references/integration/quick-reference.md`](./references/integration/quick-reference.md) | Operator cheat sheet for commands, artifacts and validation |
| [`references/integration/loop-protocol.md`](./references/integration/loop-protocol.md) | End-to-end council workflow from packet resolution through recovery |
| [`references/structure/output-schema.md`](./references/structure/output-schema.md) | Required report sections the persistence parser enforces |
| [`references/scoring/scoring-rubric.md`](./references/scoring/scoring-rubric.md) | Five-dimension scoring and the Hunter, Skeptic and Referee critique roles |
| [`references/convergence/convergence-signals.md`](./references/convergence/convergence-signals.md) | Convergence rules, the two-of-three signal and escape hatches |
| [`references/convergence/depth-dispatch.md`](./references/convergence/depth-dispatch.md) | Depth 0 parallel dispatch, Depth 1 sequential dispatch and deep-mode session hierarchy |
| [`references/patterns/seat-diversity-patterns.md`](./references/patterns/seat-diversity-patterns.md) | The six strategy lenses and task-type-to-lens recommendations |
| [`references/structure/folder-layout.md`](./references/structure/folder-layout.md) | Packet-local artifact tree shape and writer ownership |
| [`references/structure/state-format.md`](./references/structure/state-format.md) | Append-only JSONL event semantics |
| [`assets/deep-ai-council-strategy.md`](./assets/deep-ai-council-strategy.md) | Round strategy template for seat setup and disagreement tracking |
| [`assets/deep-ai-council-config.json`](./assets/deep-ai-council-config.json) | Config template with max rounds, anti-convergence floor and fail-closed stop policy |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Full feature inventory across the nine categories |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation package with per-feature scenarios |
