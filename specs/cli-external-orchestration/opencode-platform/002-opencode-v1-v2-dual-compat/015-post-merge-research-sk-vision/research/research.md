---
title: "Research: sk-vision OpenCode 2 runtime after the merge"
description: "One steered deep-research iteration (angle A23) into the sk-vision OpenCode 2 runtime on main after the 2026-10-19 merge: seven ranked bugs in teardown, model detection, the startup ping, the hand-maintained v2 context, command registration, the venv race and the interpreter probes."
trigger_phrases:
  - "sk-vision opencode 2 runtime bugs"
  - "sk-vision teardown leak"
  - "sk-vision grace downgrade"
importance_tier: "normal"
contextType: "research"
---

# Research: sk-vision OpenCode 2 runtime after the merge

<!-- ANCHOR:deep-research-post-merge-sk-vision -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator re-read the cited lines after the iteration and they say what the claim says (spot checks in `research/steering-log.md`).
- **[documented]**: the iteration recorded primary evidence that the orchestrator did not re-run.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

## 1. Answer

Seven paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2. Two are P1:

- **The setup teardown leaks every later disposal when one throws.** `createSetup` returns a cleanup that awaits four disposals in sequence with no isolation, so a throw from `promptRegistration.dispose()` leaves the tool registration, the command registration and the runtime client undisposed. [confirmed, `src/plugin.ts:463-468`]
- **An unreadable session model silently downgrades guaranteed analysis to the 2-second grace.** The prompt hook swallows a failed `ctx.session.get` into `model = undefined`, and `isTextOnlyModel(undefined)` is false, so a text-only model whose record cannot be read gets the grace path instead of the guaranteed wait. [confirmed code shape, `src/plugin.ts:416-421`; inferred impact: confirm with a test that makes `session.get` throw for a text-only model]

The other five are P2 and P3: a startup ping timer that holds the event loop, a v2 context interface the published types do not back, a command registration that fails closed while tools fail open, the empty venv directory left by a `close()` mid-`mkdir`, and 5-second interpreter probes that treat slow as missing. `bun test` passes 67 of 67, so none of these is covered by a failing test today. [documented, `iterations/iteration-001.md`]

## 2. Scope and Method

- **Question.** Which sk-vision OpenCode 2 runtime paths (registration, grace, close, interpreter checks, venv race) can still misbehave, and what fix does each need?
- **Run shape.** One steered iteration (angle A23) by cli-pi with `glm-5.3-flash` at thinking max through llmgateway, stop policy `max-iterations`, convergence off. It runs in parallel with phase 014 as a sibling session in its own worktree, because one research lineage cannot run iterations concurrently.
- **Sources read.** `src/plugin.ts`, `src/opencode/tools.ts`, `src/runtime/client.ts`, `src/model-modality.ts`, `src/opencode/attachments.ts` and their tests; the published `@opencode-ai/plugin` 1.17.15 v2 promise types; the phase 013 implementation summary.
- **Check.** `bun test` in `vision-runtime`: 67 pass, 0 fail, 155 expect calls. [documented]
- **Incidents.** Generation 1 never completed an iteration: llmgateway returned HTTP 500 for `deepseek-v4.1-flash`, and the first concurrent round also tripped write containment on sibling lineages' files. The session was restarted on GLM in its own worktree (`research/steering-log.md`). In generation 2 the leaf first wrote its delta under a misspelled `specs/cli-external/` track; containment preserved that stray copy, the correct delta verified, and the stray file is not part of this packet.

## 3. Findings

| Id | Severity | Finding | Evidence | Label |
|---|---|---|---|---|
| f-001 | P1 | Teardown awaits four disposals sequentially; one throw skips the rest | `src/plugin.ts:463-468` | confirmed |
| f-002 | P1 | A failed `ctx.session.get` becomes `model = undefined`, which routes a text-only model to the 2 s grace | `src/plugin.ts:416-421`, `src/model-modality.ts` | confirmed code, inferred impact |
| f-003 | P2 | The 15 s startup ping timer is never cleared or unref'd, so it holds the host event loop after a fast ping | `src/runtime/client.ts:351-356` | confirmed |
| f-004 | P2 | `V2PluginContext` is hand-maintained; the published v2 context type declares no `session` domain and no `tool` domain | `src/plugin.ts:109`, `node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts` | inferred: confirm against `@opencode/plugin` 2.0.32, the package OpenCode 2 ships |
| f-005 | P3 | `ctx.command.transform` is awaited unguarded first, so its failure aborts the prompt hook and all 13 tools, while tool registration is deliberately fail-open | `src/plugin.ts:353`, `src/plugin.ts:455-460` | inferred |
| f-006 | P3 | A `close()` during `mkdir(venv)` still leaves an empty venv directory | `src/runtime/client.ts:144` | documented (phase 013 limitation) |
| f-007 | P3 | `hasMoondream` and `hasUv` treat any failure of a 5 s probe as not installed, so a cold import triggers a reinstall | `src/runtime/client.ts:213`, `src/runtime/client.ts:227` | inferred |

## 4. Fix Backlog

1. f-001: dispose through `Promise.allSettled` and rethrow the first error, mirroring the setup-time cleanup.
2. f-002: treat an unreadable model as the safe side (`guaranteed = true`), or at least log the difference under `SK_VISION_DEBUG=1`.
3. f-003: keep the timer handle, clear it when the race settles, and `unref()` it.
4. f-005: wrap the command transform in the same fail-open guard as tool registration.
5. f-004: feature-detect the v2 domains at setup and re-verify the interface against `@opencode/plugin` on each OpenCode 2 bump.
6. f-007: raise or make configurable the probe timeout, and tell module-not-found apart from a slow import by exit status.
7. f-006: remove the empty venv directory on the closed path (optional).

f-001 and f-002 come first: both are P1 and both take a small test-first change.

## 5. Verification by the Orchestrator

- `src/plugin.ts:463-468` holds four sequential `await …dispose()` calls with no try or `allSettled`. f-001 confirmed.
- `src/runtime/client.ts:351-356` races the ping against a bare `new Promise((resolve) => setTimeout(resolve, 15_000))` whose handle is never kept. f-003 confirmed.
- `src/plugin.ts:416-421` catches a `ctx.session.get` failure into `model = undefined` before `isTextOnlyModel(...)`. f-002's code path confirmed; its effect on a text-only model stays inferred.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treating the venv residue as a new bug | Phase 013 recorded it as a known limitation; nothing installs or starts after `close()` | `../013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md` | 1 |
| Reading the 67/67 `bun test` pass as proof the v2 paths are safe | No test throws from a disposal, makes `session.get` fail, or delays the ping | `iterations/iteration-001.md` | 1 |

## Divergence Map

- Saturated directions: none. Convergence mode was off and the stop policy was `max-iterations` with one iteration.
- Pivots taken: none. Pivot failures and audited overrides: none.
- Remaining frontier: a live OpenCode 2 run of the grace path, and a live rerun of the phase 013 round-4 fixes; neither fits a read-only research iteration.

## 12. Open Questions

- Does OpenCode 2.0.32's own `@opencode/plugin` context declare `session` and `tool` domains, which would retire f-004? (`iterations/iteration-001.md`)
- How often does a real `ctx.session.get` fail on OpenCode 2, which sets f-002's practical weight?

## 13. References

- Iteration: `research/iterations/iteration-001.md`; record: `research/deltas/iter-001.jsonl`.
- Steering and incidents: `research/steering-log.md`; the generation 1 attempt is archived under `research_archive/`.
- Resource map: `research/resource-map.md`.
- Sources: `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts`, `src/runtime/client.ts`, `src/opencode/tools.ts`, `src/model-modality.ts`, `src/opencode/attachments.ts`.
- Sibling phases: `../014-post-merge-deep-research/` (closing synthesis A30), `../016-post-merge-research-cli-opencode-ci/`, `../017-post-merge-research-provisioning/`, `../018-post-merge-research-conformance/`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 1 / 1
- Remaining questions: 0 key questions; the open questions are in section 12
- Last 3 iteration summaries: run 1: A23 sk-vision OpenCode 2 runtime bugs (0.71)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-post-merge-sk-vision -->
