---
title: deep-ai-council
description: Planning-only council that runs multiple reasoning seats, adversarial critique and convergence checks before recommending a plan.
trigger_phrases:
  - "deep-ai-council"
  - "ai council"
  - "council deliberation"
  - "multi-seat planning"
  - "planning council"
  - "council artifacts"
  - "council convergence"
---

# deep-ai-council

> Get a structured, disagreed-upon plan with an auditable record of what each seat proposed and why one direction won.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-seat planning when a single AI answer is not enough and you need an auditable decision trail |
| **Invoke with** | `@ai-council` for a single pass, `/deep:ask-ai-council:auto` or `:confirm` for a multi-topic deep session |
| **Works on** | Any planning problem with real trade-offs: architecture decisions, refactor strategies, multi-path proposals |
| **Produces** | A council report, packet-local `ai-council/**` artifacts and an append-only state log |

---

## 2. OVERVIEW

### Why This Skill Exists

When a plan carries real trade-offs, a single AI answer is one confident guess with no record of what it ruled out. Hand-running "ask three models" gives diversity but no convergence rule, no persistence and no audit trail. You end up with a recommendation you cannot explain to your team, and no way to show why the losing options lost. A planner needs structured disagreement and a replayable state log so the team can see why a plan won, not just what won.

### What It Does

deep-ai-council runs a multi-seat AI council. Two or three distinct reasoning seats propose a plan independently, adversarially critique each other, converge on a recommendation and persist auditable packet-local artifacts. Six strategy lenses give seats distinct mandates. Three critique roles test the leading plan before convergence. The council recommends and never implements. Implementation hands off to `@code` or the caller.

---

## 3. QUICK START

**Step 1: Pick your surface.** The `@ai-council` agent handles single-topic planning passes. The `/deep:ask-ai-council` command handles multi-topic sessions with cost guards and stability checks.

**Step 2: Run a single planning pass.**

```
@ai-council Compare two migration strategies for the auth service: strangle-fig vs. big-bang cutover.
```

The council dispatches 2-3 seats with distinct reasoning lenses, runs adversarial critique and returns a recommended plan with risk analysis and packet-local `ai-council/**` artifacts.

**Step 3: Or run a deep multi-topic session.**

```
/deep:ask-ai-council:auto Plan the Q3 platform rewrite across auth, billing and notifications.
```

This iterates session then topic then round, applying cost guards and adjudicator-verdict stability. Use `:confirm` instead of `:auto` when you want to approve setup, loop, synthesis and save gates yourself.

**Step 4: Verify the artifacts.**

```bash
ls specs/<track>/<NNN-name>/ai-council/
```

You should see `ai-council-config.json`, `ai-council-strategy.md`, `ai-council-state.jsonl`, `seats/`, `deliberations/`, `critiques/` and `council-report.md`.

---

## 4. HOW IT WORKS

### The Council Lifecycle

Every council run follows three phases.

**Resolve and prepare.** The council resolves the target spec folder, loads packet context and selects 2-3 distinct seats with different reasoning lenses. When real executors are available, seats can also target different AI vantage points.

**Deliberate and converge.** Each seat proposes a plan independently. Then the three critique roles test the leading plan: Hunter attacks for missed edge cases and weak evidence, Skeptic defends by separating real flaws from intended trade-offs, and Referee adjusts scores. Convergence requires two-of-three seats agreeing on the material plan with no new high-severity blocker from critique. Hitting `max_rounds` emits `non-converged` rather than a fake consensus.

**Persist and hand off.** The council produces a report, persists packet-local artifacts through `scripts/persist-artifacts.cjs`, verifies completion with `scripts/advise-council-completion.cjs` and hands the planning result to implementation agents or the caller.

### Six Strategy Lenses

Each seat gets a distinct mandate drawn from six available lenses: Analytical, Creative, Critical, Pragmatic, Holistic and Research. A round uses 2 or 3 of these, never more. The lens assignments live in `references/patterns/seat_diversity_patterns.md` and each lens carries its own temperature setting.

### Depth 0 vs Depth 1

At Depth 0, the council dispatches seats in parallel through the Task tool. At Depth 1, the council is already inside another agent and runs seats inline through `sequential_thinking`. Depth controls whether parallel dispatch is legal, protecting the one-CLI-per-round invariant.

### Deep Mode

Deep mode is the iterative, multi-topic workflow. It adds a three-level state hierarchy (session, topic, round), a session-wide findings registry with fingerprint dedup and conservative cost guards: 3 rounds per topic, 5 topics per session, 3 seats per round. Stable verdict deltas stop topics early. The state files live under the session's `ai-council/` tree.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for deep-ai-council when a planning decision has real trade-offs and a single AI answer will not do. Use it when you need to compare strategies, when your team needs to see why a direction was chosen, or when you want an auditable record of what was considered and rejected. Skip it for straightforward tasks where one pass is enough.

### Boundaries With Sibling Deep Loops

| Skill | What it owns |
|---|---|
| `deep-research` | Evidence-first investigation and external source gathering |
| `deep-review` | Code audit with P0/P1/P2 findings |
| `deep-context` | Codebase context mapping and pattern discovery |
| `deep-ai-council` | Multi-seat planning, convergence checks and recommendation artifacts |

All four ride the shared `deep-loop-runtime`. The council does not investigate, audit code or map codebases. It takes context from those loops (or from the caller) and turns it into a planning recommendation.

### Handoff

The council is planning-only. It recommends and never implements. When the council finishes, implementation goes to `@code` or the top-level caller. The spec folder the artifacts live in is owned by `system-spec-kit`.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Council emits `non-converged` | It hit `max_rounds` without two-of-three agreement | Read the failed-round forensics in `critiques/` rather than forcing a pick |
| Seats look too similar | Lenses were not distinct enough or only one round ran | Assign distinct lenses from the six options, or add a second round |
| Artifacts missing from `ai-council/` | No spec folder was resolved before dispatch | Confirm the packet path exists before invoking the council |
| External CLI seat labeled "simulated" | The external AI system did not actually run | Run the CLI executor for real, or accept the simulated label |
| `council_complete` event missing from state | Persistence did not run or the completion check failed | Run `scripts/advise-council-completion.cjs <packet>` to verify |

---

## 7. FAQ

**Q: When should I use a council instead of a single plan?**

A: When the decision has real trade-offs, when your team needs to see the rejected options, or when the cost of picking wrong is high enough to justify running 2-3 seats. For a straightforward task with one clear path, a single pass is faster.

**Q: What does the two-of-three rule mean?**

A: Two of the three seats must agree on the material plan, and no new high-severity blocker from critique can remain. If neither threshold is met after `max_rounds`, the council emits `non-converged` instead of forcing a false consensus.

**Q: Does the council write code?**

A: No. It is planning-only. It recommends a plan, persists the decision trail and hands off to `@code` or the caller for implementation.

**Q: Where does the audit trail live?**

A: Under `specs/<track>/<NNN-name>/ai-council/` in the packet's spec folder. The `ai-council-state.jsonl` file is append-only and records every seat proposal, critique and convergence event.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | Convergence and escape-hatch rules |
| [`references/convergence/depth_dispatch.md`](./references/convergence/depth_dispatch.md) | Depth 0 parallel and Depth 1 inline dispatch rules |
| [`references/patterns/seat_diversity_patterns.md`](./references/patterns/seat_diversity_patterns.md) | The six strategy lenses and seat assignment rules |
| [`references/scoring/scoring_rubric.md`](./references/scoring/scoring_rubric.md) | Five-dimension scoring, adversarial critique and conflict resolution |
| [`references/structure/folder_layout.md`](./references/structure/folder_layout.md) | Packet-local artifact tree and writer ownership |
| [`references/structure/state_format.md`](./references/structure/state_format.md) | Append-only JSONL event semantics |
| [`references/integration/loop_protocol.md`](./references/integration/loop_protocol.md) | End-to-end workflow from packet resolution to persistence |
| [`scripts/persist-artifacts.cjs`](./scripts/persist-artifacts.cjs) | Artifact writer CLI |
| [`scripts/advise-council-completion.cjs`](./scripts/advise-council-completion.cjs) | Completion verification helper |
