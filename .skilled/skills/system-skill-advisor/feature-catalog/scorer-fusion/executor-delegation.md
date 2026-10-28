---
title: "Executor Delegation and Workflow-Owner Guard"
description: "A prompt that hands work to a CLI executor lifts the CLI hub to the route, unless it also names a deep-loop or spec-kit workflow, which then stays first with the hub directly beneath it."
trigger_phrases:
  - "executor delegation and workflow-owner guard"
  - "executor delegation"
  - "workflow-owner guard"
  - "delegate this refactor to codex"
  - "split delegation phrasing"
version: 1.0.0.0
---

# Executor Delegation and Workflow-Owner Guard

## 1. OVERVIEW

A prompt that hands work to a CLI executor lifts the CLI hub to the route, unless it also names a deep-loop or spec-kit workflow, which then stays first with the hub directly beneath it.

The executor is the HOW of a workflow. "Run a deep review with cli-codex as the executor" asks for the deep-review loop and names the CLI that runs inside it, so the caller must start the loop and not a bare CLI dispatch. A prompt that names only the executor, such as "delegate this refactor to codex", routes to the `cli-external-orchestration` hub, whose compiled route names the executor mode as its target.

---

## 2. HOW IT WORKS

### Resolving The Executor

The resolver runs after fusion, once confidence and uncertainty are settled. It reads an alias table built from metadata: each live executor's intent signals, trigger phrases and name variants, the model-profile registry, and the archived metadata of retired executors. A named retired executor makes the advisor abstain, so the request never falls back to the code hub or another live executor. A direct alias such as `cli-codex` routes on its own. An executor noun such as `codex` routes when a delegation cue sits in the prompt (`use`, `ask`, `run`, `dispatch`, `delegate to`, `hand off to`) or when it is the target of a split handoff. A negative guard keeps the code hub's own opencode surface, such as "opencode standards" or a `.skilled/` path, from reading as a handoff.

### Split Delegation Phrasing

"Delegate this refactor to codex" and "hand the sweep off to opencode" never contain the contiguous cue. The split form accepts them when the executor noun is the target of the `to`, optionally after "the", "a" or "an", with at most six object words between the verb and the `to`. Sentence punctuation or another `to` ends the object. That bound keeps ordinary prose out: "delegate the decision to the team" and "hand off to QA" lift nothing, and neither does an executor named only inside the object, as in "delegate the codex migration decision to the team".

### The Lift

On a route the hub owning the executor rises to confidence 0.95 and uncertainty 0.2. When no candidate carried it, the advisor adds it. The code hub is capped at 0.88 so it cannot tie or outrank the executor.

### Workflow-Owner Guard

Before the hub takes first place, the advisor looks for a workflow owner: a passing `system-deep-loop` or `system-spec-kit` recommendation whose explicit lane scores at least 0.55 with phrase, author, explicit, loop or write evidence. That is the floor fusion applies to its own explicit workflow signal, so a side mention of "research" or "plan" does not demote an executor request that never asked for the workflow. When an owner passes, it stays first and the lifted hub sits directly below it at the owner's confidence minus 0.001, so the hub still passes and stays reachable as the runner of that workflow. A prompt with no owner takes the plain lift. The Python fallback mirrors the resolver and the split handoff, but it carries no workflow-owner guard, so a degraded answer still lists the hub first on these prompts.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Shared | Alias table, resolver, split handoff, lift and workflow-owner guard |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Shared | Calls the override once per ranking run, after every abstention gate |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Shared | Research-loop and review-loop evidence the guard reads |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Script | Python mirror of the resolver and the split handoff |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Vitest | Resolver, split handoff, prose rejection and workflow-owner ordering |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation-cache.vitest.ts` | Vitest | Alias table cache |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Fixture | Shared TypeScript and Python delegation cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Vitest | Loop vocabulary the guard depends on |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/executor-delegation.md`

Related references:

- [five-lane-fusion.md](./five-lane-fusion.md) - The fusion run whose ranking the override reorders.
- [ambiguity.md](./ambiguity.md) - Top-2 ambiguity window that reads the reordered ranking.
- [doctor-command-routing.md](./doctor-command-routing.md) - The other post-fusion ordering rule, for doctor command bridges.
