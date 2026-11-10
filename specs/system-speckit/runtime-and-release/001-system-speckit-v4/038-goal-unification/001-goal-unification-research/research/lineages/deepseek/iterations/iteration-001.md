# Iteration 1 - A1: Session-to-packet binding mechanisms

- **Lineage:** deepseek (cli-pi, deepseek-v4.1-flash) - Angle 1 of 10 (charter allocation table)
- **Question:** How does a session learn which packet's `goal.md` is active, and what fails for each candidate binding mechanism when two sessions share one packet or one session switches packets?
- **Method:** 1 hook README read (delivery + state model), 1 core read (`resolveRepoRoot`/`resolveStateDir`/`resolveGoalScope`), 1 speckit-plan YAML read (`goal_prompting`), 2 greps (`goal.md` consumers across `.opencode`; goal prompting in implement/complete YAMLs), 1 command-frontmatter grep. 6 evidence calls.

## Findings (6)

| ID | Claim | Evidence | Status |
|----|-------|----------|--------|
| A1-1 | The goal scope has **no packet component**. The canonical scope key is `sha256(JSON.stringify([workspace, runtime, sessionId]))`; the packet lives nowhere in the identity. A packet's `goal.md` is not an input to any read or mutation. | `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:191-193]` | confirmed |
| A1-2 | Identity is mandatory and fail-closed: `resolveGoalScope` throws `MISSING_SESSION_ID` on empty session and `MISSING_RUNTIME`/`INVALID_RUNTIME` on bad runtime; an adapter with no native session identity cannot bind at all. | `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:174-182]` | confirmed |
| A1-3 | Workspace resolution walks up to `.git` or `.opencode/skills` only - never to `specs/`. cwd is used for repo root, never for packet inference; there is no nearest-packet mechanism today. | `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:129-138]`, `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:150-155]` | confirmed |
| A1-4 | speckit plan offers the goal by default and calls **no goal tool**: `default_choice: offer`, `offer: "Render the optional session-goal offer only; call no goal tool in any runtime."` A goal is set only when the operator chose `set` AND supplied `goal_objective`. | `[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:141-152]` | confirmed |
| A1-5 | The set path is runtime-dispatched, not packet-dispatched: opencode calls the `opencode_goal` tool, pi shells `bin/goal.cjs set <objective>` with "scope flags carry the native session identity", cursor is injection-only with an operator handoff, and `default` requires a native session-goal command. The packet path never enters the invocation. | `[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:157-170]` | confirmed |
| A1-6 | The objective shape is deliberately non-dereferencing: "Pointer plus copied completion criteria; never a file body", because "Nothing dereferences a path in an objective". A grep of `.opencode` shows no runtime hook/plugin consumer of `goal.md` - only spec-kit validation, templates, docs, and tests mention it. | `[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:171-173]`; grep over `.opencode/**` (`goal.md` hits: template, validator, template guides, tests, playbook) | confirmed |

## Binding mechanisms (candidate census)

| # | Mechanism | What it costs today | Failure mode (two sessions / one packet) | Failure mode (one session / switching packets) |
|---|-----------|---------------------|-------------------------------------------|-----------------------------------------------|
| M1 | Gate-3 answer only (session-local, no persistence) | Zero - the answer already exists in-conversation | Each session re-answers; no shared authority; a resumed session re-asks | Old packet's goal survives in the store because nothing rewrites the scope |
| M2 | speckit set step (`goal_prompting.set`) | Operator must pass `goal_objective`; default path calls no tool | Two sessions create two scope keys, two goals, zero packet linkage; neither is "the packet goal" | Setting a new objective overwrites the same scope key; no record that the packet changed |
| M3 | Thin per-session pointer (new store field: session -> packet path) | New write path plus a new staleness class; the store today has no packet field at all | Both sessions can point at one packet, but concurrent writes need the existing lock discipline (`withFileLocks`) | Pointer must be rewritten on every packet switch; a stale pointer silently targets the previous packet |
| M4 | Nearest-packet inference from cwd | Cheapest read, no writes | cwd is repo root for the hook (not the packet); inference is ambiguous whenever two packets are open | cwd changes mid-session (bash `cd`, worktrees) so the resolved packet can flip |

## Ruled out

- **Reading the packet from the objective string** (e.g. "goal of specs/..."): the plan YAML states nothing dereferences a path in an objective, and every surface caps what it holds - making a path load-bearing would add a dereference step to every consumer. `[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:171-173]`
- **Treating the legacy singleton `active-goal.json` as the binding**: the hook README calls it "diagnostic input only" and "never an injection fallback". `[SOURCE: .opencode/hooks/goal/README.md section 1]`

## Open questions carried

1. Does any speckit command already pass the spec folder into the goal set path (implement/complete YAML have the same `goal_prompting` block - the invocation text there is still `opencode_goal({action:"set", objective})`, i.e. no folder)? First read says no `[SOURCE: .opencode/commands/speckit/assets/speckit-implement.yaml:124-125]`; iteration 9 re-checks the whole set.
2. For pi, do "scope flags" include a workspace that is stable across the session when the operator runs from a subdirectory? `resolveRepoRoot` normalizes it to the repo root, so the packet cannot be derived from it. `[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:187]`
3. Which runtime owns the write when two sessions bind one packet (D7 isolation surface, iteration 6/9).

## What Worked / What Failed / Next Focus

- **Worked:** one README read settled the delivery table; `resolveGoalScope` was the single decisive read for the absence of packet identity; the grep proved the "no consumer dereferences goal.md" claim rather than inferring it.
- **Failed:** nothing analytical; 0 harness rejections this iteration.
- **Next Focus (Iteration 2):** A2 frontmatter-strip contract - enumerate every surface that renders goal text today (`renderGoalBrief`, `buildGoalPrompt`, plugin injection, cursor/per-pi adapters, CLI `show`) and locate where a strip function would sit.
