---
title: "UX and Cost Lane — What the Person and the Model Read, and What It Costs"
description: "Segment-two synthesis of the ux-cost-2 lineage: the brief's words and bytes after phase 005, the ask and start wording, the external-repository install and its green zeroes, and the embedder keep-alive decision, with five ranked recommendations."
trigger_phrases: []
---
# UX and Cost Lane — What the Person and the Model Read, and What It Costs

Segment two of the command-surfacing research, lineage `ux-cost-2`, three iterations, executor `cli-opencode` with `opencode-go/deepseek-v4.1-flash#max`. The lane asks what the person and the model read and what it costs. It excludes everything phases 005, 006, 008, 010 and 011 built or plan: the recommendation contract and brief head, the Gate 2 bullet, Codex approval and DSH reachability steps, the hook-wiring check, offer recording, the attributable scorer, the argued-route lookup, typed delivery 44 of 44, the visibility guard, hook health in status, the setup leg and the brief-cost script.

## 1. Executive Summary

The offer rate, not obedience, is the bottleneck on plain chat, and this lane adds two reasons the offer never becomes usable plus one reason it never exists:

1. **The install's embed branch removes the only instruction file Claude Code reads.** `embed` folds and deletes a project `CLAUDE.md`, and the agents-md check accepts that absence. In the measured after arm Claude received the brief 24 of 24 times and the Gate 2 bullet 0 of 24 times, so the policy word on every Claude offer (`start`, `ask`) had no definition. A 12-byte `@AGENTS.md` pointer closes it, and the check already accepts `pointer` as a valid state.
2. **The install's final status is green when a runtime cannot receive the brief at all.** `/doctor:setup` runs six component legs; none reports brief delivery or hook approval. Codex delivered 0 of 24 briefs because a fresh checkout's project hooks are unapproved, and the person still reads `STATUS=OK`.
3. **A deferring hub is rendered as a bare skill.** `cmd-deep-review-plain-tune-01` gets no command because the deep-loop hub defers on the mode; the head then shows `system-deep-loop` with no signal. Pi and OpenCode improvised a multi-pass audit and wrote; Devin looped without init. A `(needs a mode)` label is the missing information, and it generalizes to `/deep:research`.
4. **The brief's cost is 73% constant and does not shrink.** The median brief is 298 bytes: an 80-byte head plus a 218-byte comment-hygiene hard block that is emitted on every prompt. The route-only plan that would cut it to 43 bytes is measurement-only; segment one read its shadow saving as delivery. Trimming the block stays ruled out because it is the only place the rule reaches a brief-only session.
5. **Do not keep the embedder warm all day.** The cold first call is 538.53 ms against a 750 ms deadline, and Ollama already holds the model for its default idle window. Extending `keep_alive` buys one saved call per idle window for about 320 MB resident. A bounded warm at session start is the cheaper shape and is ranked fifth.

## 2. Scope and Method

- **Lane:** `ux-cost-2`, label `offer-reach`'s sibling on the experience and cost side: brief wording and bytes, ask/start wording, external-repository install and setup, embedder keep-alive.
- **Rules held:** no holdout prompt text read; no model CLI session, arena, daemon or ollama control; no test suite; no write outside the lineage.
- **Evidence:** the renderer and generated command table were read and the brief was computed row by row; the after-arm run lines were read and scored with `score-command-transcripts.mjs --summary`; the install path was followed through `INSTALL-SKILLED.md`, the agents-md engine and check, and the setup legs; the embedder numbers come from the committed measurement file and the dispatch's after-build measurement, marked where they differ.

## 3. The Brief After Phase 005

| Quantity | Value | Source |
|---|---|---|
| Head, per command | 67-109 bytes, median 80 | computed from `COMMAND_ROWS` and the renderer |
| Constant block | 218 bytes (`Directives:` + comment hygiene) | `render.ts:127`, `:133` |
| Brief per prompt | 285-327 bytes, median 298 | computed |
| Constant share | 73% of the median brief | computed |
| Longest head | 107 characters of the 320-character cap | `render.ts:104` |
| Policy mix | 20 `start`, 7 `run`, 17 `ask` of 44 tracked | `command-attach.ts` |

The head reads `Advisor: live; use <owner> → <command> (<policy>) 0.85/0.20 pass.` It names the policy but never defines it. The definition is the 463-byte Gate 2 bullet in `AGENTS.md`, and the bullet is the only place `run`, `start` and `ask` are explained.

The constant block is appended on both return paths and is never suppressed. `renderRouteOnlyAdvisorBrief` is called only from the shadow observer to compute `savedBytes`; the emitted string never shrinks. This corrects segment one's eliminated-alternatives row, which treated the shadow saving as delivery. The block stays because it is the only carrier of a repository hard block in a session with no `AGENTS.md`.

## 4. The Ask and Start Wording

The three words are one sentence each in a 463-byte bullet. The measured inversion is that Claude starts 3 of 4 read-only `run` rows and 0 of 8 mutating `start` rows, while OpenCode and DSH start 3 of 8 mutating rows. That is consistent with `start` reading as a heavier commitment, and also with a model that never saw the definition.

Two wording changes survive the evidence:

- **A deferral label in the head.** When a hub's compiled route answers `defer`, `attachCommand` stops and the head keeps the bare skill. Adding `(needs a mode)` tells the model the hub withheld a command because it needs a mode, which is exactly the fact that was missing when pi and opencode improvised.
- **One Gate 2 clause for a brief that names a skill but no command.** Eleven of the sixteen plain tune rows got no offer at all. The bullet currently binds a named command to its document; it does not say what to do when a skill is named and no command is. A clause of about 110 bytes fits the 292 free bytes before the A6 anchor, but the bullet is operator-approved text, so a build needs approval.

## 5. The External-Repository Install

`/doctor:install` prints six steps. Step 3's instruction-file choice is the one with a runtime-specific outcome:

| Choice | `AGENTS.md` | `CLAUDE.md` | Claude Code gets the Gate 2 bullet? |
|---|---|---|---|
| `link` | symlink to checkout | symlink to checkout | yes, through `CLAUDE.md` |
| `embed` | shipped sections | folded into `AGENTS.md` and removed | only if Claude reads `AGENTS.md`; the after arm says it did not |

The check is asymmetric. It has a `claude-only` state for `CLAUDE.md` without `AGENTS.md`, but no state for the reverse shape that `embed` produces, and A10 accepts `absent` for `CLAUDE.md`, so the embed outcome passes.

The install's final check is not truthful about delivery. `/doctor:setup`'s six legs are component checks: sk-code, sk-git, trigger index, runtime mirrors, advisor freshness, embedder. The Codex approval check runs only under `/doctor:runtime-mirrors`, and the hook-wiring check only under `/doctor:symlink check`. A fresh Codex install reads `STATUS=OK` with 0 of 24 briefs.

Contradictory evidence, recorded not resolved: the agents-md manifest says "Claude reads the root document directly", while the measured arena with `AGENTS.md` and no `CLAUDE.md` produced Claude rows without the bullet. A one-line pointer is valid under both readings, which is why rank 1 recommends it.

## 6. The Embedder Cold Start

| Item | Measured | Source |
|---|---|---|
| Model on disk | 274,302,450 bytes (261.6 MiB) | `measured-2026-11-12.txt:3` |
| Loaded in `/api/ps` | 335,733,063 bytes (320.2 MiB); dispatch records about 304 MB | same file, `goal.md:131` |
| Warm query embed | 6.57 ms median, 10.99 p95, n=30 | `measured-2026-11-12.txt:12` |
| Cold first call | 538.53 ms (dispatch after-build measurement) | dispatch |
| Prompt deadline | 750 ms | `semantic-shadow.ts:27` |
| Adapter request timeout | 5,000 ms | `ollama.ts:110` |
| `keep_alive` sent | none; Ollama's default idle timer applies | `ollama.ts:343` |

The request sends `{model, input}` only. The race abandons the embedding at 750 ms while the adapter request continues to five seconds, so an over-deadline cold load still warms the server for the next prompt: one prompt per idle window loses the semantic lane, silently, and the phrase lane answers. That one prompt is worth five tune rows (14 of 45 with the real embedder against 9 of 45 on phrases).

Extending `keep_alive` is declined: about 320 MB resident for one saved 538 ms call per idle window, against a deadline the measured cold call already meets. A bounded session-start warm is the cheaper shape: it moves the load earlier at zero marginal memory for any session that prompts, and it must stay embedder-only and inside the 750 ms bound.

## 7. Ranked Recommendations

Ranked by expected gain in started-when-useful per unit of risk. Each row names the files, the gain, the committed check and the floor risk. The floors are typed recall 24 of 44, false offers 0 of 35 and the scorer `[159,50,20,5]`.

| # | Recommendation | Files | Measurable gain | Verify | Risk to floors |
|---|---|---|---|---|---|
| 1 | Leave a Claude instruction pointer on the embed install | `agents-md-embed.cjs`, `agents-md-check.cjs`, `INSTALL-SKILLED.md` | The Gate 2 policy definition reaches Claude on the embed branch, where the after arm delivered the brief 24/24 and the bullet 0/24; every Claude offer's `start`/`ask` becomes actionable | Fixture with `AGENTS.md` and no `CLAUDE.md` prints the new missing-pointer row; after `embed`, `CLAUDE.md` reads `@AGENTS.md` and the check passes; targeted `node --test` on both scripts | None: doctor/install only, A10 already accepts `pointer`, A6 untouched |
| 2 | Report brief delivery in `/doctor:setup` | `doctor-setup.yaml`, `doctor-setup-presentation.txt`, the two existing read-only checks | A fresh Codex install stops printing `STATUS=OK` with 0/24 briefs; the one repair (`/hooks`) is visible at the end of the printed install | Unapproved arena prints `DEGRADED` naming `codex-hooks-unapproved`; approved checkout prints PASS; read-only invariant holds | None: read-only, one local probe |
| 3 | Label a deferring hub `(needs a mode)` | `command-attach.ts`, `render.ts`, `command-brief-golden.vitest.ts` | The deep-review plain row loses its command because the hub defers; pi and opencode improvised and wrote, devin looped without init. The label supplies the fact the deferral withheld | Attach returns a deferral signal for that prompt; golden head reads `system-deep-loop (needs a mode)`; the six-row deep-review set on pi/opencode/devin shows `unsafe 0` and no loop without init | None to the floors; +16 bytes on defer rows, golden re-pin, behaviour is a hypothesis until that set reruns |
| 4 | Add one Gate 2 clause for a skill-only brief | `AGENTS.md`, `agents-md-manifest.json`, generated `.cursor/rules/skill-routing.md` | Covers the 11 of 16 plain tune rows with no offer and any deferring hub, independent of rank 3 | A6 at or under 16384 bytes after the pin refresh; `rg -c "names a skill but no command" AGENTS.md` is 1; the deep-review row asks instead of auditing | None to the floors; needs operator approval because the bullet is frozen, and the clause must fit 292 bytes |
| 5 | Warm the embedder once at session start | SessionStart entries, `semantic-shadow.ts` (bounded warm), `measure-embedder-cost.mjs` | The first prompt after idle keeps the semantic lane (14/45 against 9/45), at zero marginal memory for a session that prompts | `measure-embedder-cost.mjs` prints the cold call; a six-minute-idle fixture shows a null `disabledReason` on the first recommendation; the degrade matrix stays green | None to the floors; reuses the SessionStart mechanism the daemon warm-up declined, so it must stay embedder-only and 750 ms-bounded |

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| Trim the comment-hygiene directive | Repository hard block and the only carrier in a brief-only session | `render.ts:127` | 1 |
| Emit the route-only brief after first delivery | Drops the hard block exactly where `AGENTS.md` is absent (the measured Claude case) | `render.ts:406` | 1 |
| Replace the confidence/uncertainty pair with prose | 14 bytes saved, no measurable path; the ambiguous head compares two candidates with it | `render.ts:575` | 1 |
| Write the operator's global `~/.claude/CLAUDE.md` | Outside the repository, declared report-only, changes every session on the machine | `agents-md-manifest.json:777` | 2 |
| Keep a full `CLAUDE.md` copy from `embed` | Double-loads and drifts; a pointer avoids both | `agents-md-manifest.json:744` | 2 |
| Leave the Codex signal to `/doctor:runtime-mirrors` | A person who ran the six printed steps has no reason to run a seventh command | `doctor-setup.yaml:54` | 2 |
| Hold the embedder warm with `keep_alive` | About 320 MB resident for one saved 538 ms call per idle window; deadline already met | `measured-2026-11-12.txt:3` | 3 |
| Add a policy gloss to every brief head | Duplicates the definition once rank 1 delivers it, at 40 bytes per prompt | `render.ts:588` | 3 |
| Treat the cold daemon measurement as the embedder decision | It measured brief fail-open (0 of 5), not a semantic-lane degrade; different deadlines | `010/implementation-summary.md:159` | 3 |

## Divergence Map

No divergent pivots. Saturated directions: directive trimming, score-number removal, route-only emission, global instruction-file writing, full-copy instruction files, and a `keep_alive` TTL. Remaining frontier: whether a `(needs a mode)` label actually changes the deep-review behaviour (needs the g2 set rerun), whether the Claude pointer alone moves the mutating `start` rows (needs the next after arm), and the cold first call on a machine slower than this one.

## 12. Open Questions

1. Does the Claude pointer move the 0-of-8 mutating `start` rows, or is the remaining gap the model's judgment? Only an after arm with the pointer present can say.
2. Does `(needs a mode)` produce an ask, or a single-pass skill route, on pi, opencode and devin? The six-row deep-review set answers it.
3. On a machine whose cold embed exceeds 750 ms, how often does the first prompt degrade? The committed cold number is from this machine.
4. Should the `embed` branch create the pointer only when `claude` is among the chosen runtimes? The install already knows the runtime list; the check does not yet use it.

## 13. References

- Parent packet: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`; `009-ux-performance-cross-cli-research/research/research.md` and `spec.md`; implementation summaries of 005, 006, 008 and 010; `011-typed-command-delivery-and-guards/spec.md`.
- Runtime surfaces: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `runtime/lib/command-attach.ts`, `runtime/lib/scorer/lanes/semantic-shadow.ts`, `runtime/lib/policy-plan.ts`, `runtime/scripts/measure-embedder-cost.mjs`, `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts`, `AGENTS.md`.
- Install and doctor: `INSTALL-SKILLED.md`, `.skilled/commands/doctor/assets/{doctor-agents-md-embed.yaml,agents-md-manifest.json,symlink-manifest.json,doctor-setup.yaml,doctor-runtime-mirrors.yaml,doctor-symlink-check.yaml,doctor-skill-advisor-embedder.yaml}`, `.skilled/commands/doctor/scripts/{agents-md-check.cjs,agents-md-embed.cjs,codex-hook-approval-check.cjs,hook-wiring-check.cjs}`.
- Measurements: `008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt`; `007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`, scored with `score-command-transcripts.mjs --summary`.
- Iterations: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`; deltas under `deltas/`.

## 14. Answered Questions

- Which words reach the model and which reach only `AGENTS.md`: answered. The head names the policy; the definition lives only in the bullet, and on Claude's embed branch neither reaches it.
- What the brief costs: answered. 285-327 bytes per prompt, 73% of it a constant hard block that is never suppressed.
- What an external install must do: answered. Leave a Claude instruction pointer, and make the final diagnostic report brief delivery instead of a component-only green.
- Whether to keep the embedder warm: answered. No all-day `keep_alive`; a bounded session-start warm is the only shape with a positive ratio.
- The ranking: answered. Five items, in the order above.

## 15. Limitations and Confidence

- The executor is a flash model; the load-bearing numbers were re-checked against source (the brief bytes, the 218-byte block, the 750 ms deadline, the absent `keep_alive`, the 262/320 MB sizes, the install shapes). The 538.53 ms cold call is dispatch-provided and has no committed scratch file in the planning folder; it is cited as such.
- The warm figure appears as 6.57 ms in the committed file and 4.8 ms in the dispatch; the committed file is used for the warm number.
- The after-arm Claude rows are a worktree measurement: no project `CLAUDE.md`, global file pointing at the main checkout. They measure the absence, not the size of the gain once the pointer exists.
- Rank 3 and rank 5 are hypotheses with a named verification; they are not yet measured.

## 17. Convergence Report

- Stop reason: `converged` (all five key questions answered at the three-iteration floor)
- Total iterations: 3
- Questions answered: 5 of 5
- Convergence threshold: 0.05; ratios 0.62, 0.72, 0.60
- Divergence summary: no divergent pivots recorded
- Floor check: no scorer weight, corpus label or policy table was changed by this lineage; every recommendation names its own committed check and its floor risk
