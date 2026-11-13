---
title: "Command surfacing research, segment two: merged ranking and dispositions"
description: "Merged synthesis of the offer-reach, cross-cli-2 and ux-cost-2 lineages, run against the built phases 005, 006, 008 and 010 and the after arm of phase 007."
trigger_phrases:
  - "command surfacing research segment two"
  - "plain offer reach research"
---
# Command Surfacing Research, Segment Two

Merged synthesis of three lineages run on 2026-11-13 against the built state: `lineages/offer-reach/research.md`, `lineages/cross-cli-2/research.md` and `lineages/ux-cost-2/research.md`. Executor: DeepSeek v4.1 flash at max effort through OpenCode Go, four iterations per lineage at most, convergence threshold 0.05. Merge and ranking: Fable 5.2. Segment one stays in `research.md`.

## 1. What the after arm showed

The after arm of phase 007 ran 144 turns at commit `ae06ccb118`. Start rate before to after: claude 3 of 12 to 4 of 12, codex 0 of 12 to 0 of 12, pi 0 of 11 to 2 of 10, devin 1 of 8 to 3 of 9, opencode 2 of 7 to 1 of 5, dsh 6 of 12 to 6 of 12. Unsafe runs fell from 9 to 4.

Three findings carry the segment:

1. **The offer rate is the limit, not obedience.** The expected command was offered on 3 of the 16 plain rows of the chat set, `/doctor:helper` on 2 more and nothing on 11. When a command was offered the model usually took it.
2. **Delivery works on five runtimes and is proven on one.** The brief reached Claude, Devin, Pi and DSH in every stored session, and OpenCode loaded the plugin on all 24 runs. The run log proves it only for Claude, because the shared session readers drop injected context. Codex received no brief in any run, because a fresh checkout's project hooks are unapproved.
3. **Claude Code reads only its own instruction file.** A project without a `CLAUDE.md` never sees `AGENTS.md`, and the default `embed` install removes that file. In the after arm Claude received the brief 24 of 24 times and the Gate 2 bullet 0 of 24 times, until a rerun delivered the bullet through an arena-local pointer.

## 2. Checks made on the lineage claims

These claims were rerun by the orchestrator before the ranking, because a lineage's finding is a hypothesis until something confirms it.

| Claim | Check | Result |
|---|---|---|
| The doctor matcher already knows the exact command on three chat rows | `doctor-helper-match.cjs --json --top=2 -- "<prompt>"` on the four doctor tune rows | Confirmed: rank 1 is `/doctor:agents-md check`, `/doctor:ci report` and `/doctor:deep-loop`. The helper row returns `no_match` |
| `embed` removes a project `CLAUDE.md` | `agents-md-embed.cjs` lines 101 and 746 | Confirmed: `CLAUDE.md` is a folded copy and is removed unless `--keep-claude-md` is given |
| The deep-review row gets no command because the hub defers | `compiled-route.cjs --hub system-deep-loop --prompt "<prompt>"` | Confirmed: `action` is `defer` |
| The brief reached Claude, Devin and DSH | Raw transcript attachments, `sessions.db` system nodes and the raw DSH store | Confirmed: 24 of 24, 24 of 24 and 23 of 23 |
| Every unsafe after-arm run had no offer | `offeredCommand` on the two rows behind all four unsafe runs | Confirmed: null on every runtime |

Not rerun: the per-row gains the lineages predict. Each is an inference from route results, matcher scores and code paths, and the implementing phase measures it.

## 3. Merged ranking and disposition

Ranked by expected gain in started-when-useful, or silent failures removed, per unit of risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer `[159,50,20,5]`).

| Rank | Recommendation | Source | Disposition |
|---|---|---|---|
| 1 | Name the matched doctor command in the handoff instead of the helper, teach the strong cue the gerund form and insert the helper when the matcher finds nothing | offer-reach 1 | Build in phase 012 |
| 2 | Leave a Claude pointer (`@AGENTS.md`) on the default `embed` install, and make the check report a missing pointer | cross-cli-2 3, ux-cost-2 1 | Build in phase 013 |
| 3 | Make delivery a stored fact: the readers return injected context, `briefDelivered` reads it, Codex answers `false` when its hooks are unapproved and an offer counts only when delivery is not `false` | cross-cli-2 1 | Build in phase 013 |
| 4 | Add task-shaped paraphrase aliases to the `sk-doc` hub's mode vocabulary | offer-reach 2 | Build in phase 012 |
| 5 | Report brief delivery and hook approval in `/doctor:setup`, so a Codex install with no brief stops reading as green | ux-cost-2 2 | Build in phase 013 |
| 6 | Label a deferring hub `(needs a mode)` in the brief head | ux-cost-2 3 | Build in phase 012 |
| 7 | Pair a deep scorer anchor with a deep hub alias, one pair per mode | offer-reach 3 | Build in phase 012, as its own wave with its own floor check |
| 8 | Count offers independently of policy and cap, and split the two unknowns (`offerFieldAbsent`, `deliveryUnknown`) | cross-cli-2 2 | Build in phase 013 |
| 9 | Stop an unapproved Codex arm from producing behaviour-shaped zeros: preflight the approval and mark the runtime not measurable | cross-cli-2 4 | Build in phase 013 |
| 10 | Fold loop-without-init into the safety floor | cross-cli-2 5 | Build in phase 013 |
| 11 | Parse the three states of the `COMMAND:` line into `offerSeen` | cross-cli-2 6 | Build in phase 013 |
| 12 | Add one narrow explicit anchor per wrong-top create row | offer-reach 4 | Build in phase 012 last, and only when rank 7's capture leaves the floors where they are |
| 13 | Relabel the capture's `offered` flag, which means a command is in the top three and not that the brief offered it | offer-reach note | Build in phase 013 as a documentation and field-name fix |
| 14 | Add one Gate 2 clause for a brief that names a skill and no command | ux-cost-2 4 | Waiting on the operator. The Gate 2 bullet is frozen at the text the operator approved and 292 bytes stay free |
| 15 | Enrich command intent signals and re-embed the skill graph | offer-reach 5 | Declined for this round. It moves no row of the chat set today, needs its own real-embedding capture and carries the highest floor risk. Carried into segment three |
| 16 | Warm the embedder once at session start | ux-cost-2 5 | Declined. The cold first call measured 538.53 ms against the 750 ms deadline, so the first prompt after idle already keeps the lane on the measured machine. Reopen when hook health shows `prompt_embedding_timeout` on a slower one |
| 17 | Raise the `COMMAND:` line rate | cross-cli-2, declined there | Declined. The line tracks neither offers nor starts, and more wording costs brief bytes on every prompt |
| 18 | Hold the embed model warm with `keep_alive` | ux-cost-2, eliminated there | Declined. About 320 MB resident for one saved 538 ms call per idle window. This answers segment one's open question 6 with the recommended option, cold by design |

## 4. Eliminated alternatives

- Lower the meaning threshold or raise the semantic lane weight: four of the five wrong-top rows have no command evidence at all, so no threshold reaches them.
- A default command for a hub that defers: it fires on the deep-loop near-miss row, which must stay silent.
- Re-add generic aliases such as "persona file": phase 003 measured a wrong offer and removed it.
- Write a second copy of the brief from the hook to prove delivery: it proves the advisor ran, not that the host delivered.
- Pre-seed the Codex approval: it defeats the product's trust control and writes the operator's own config.
- Trim the comment-hygiene directive from the brief: it is the only carrier of that rule in a brief-only session.

## 5. Convergence

| Lineage | Iterations | Stop reason | Novelty per iteration |
|---|---|---|---|
| `offer-reach` | 4 | Iteration cap | 0.90, 0.85, 0.88, 0.70 |
| `cross-cli-2` | 4 | Iteration cap | 0.80, 0.85, 0.90, 0.75 |
| `ux-cost-2` | 3 | Converged | 0.62, 0.72, 0.60 |

Segment two has not converged as a whole. Two lineages stopped at their cap with novelty still high. Segment three continues those two lanes after phases 012 and 013 are built, so it reads measured row gains and not predicted ones.

## 6. Open questions carried forward

1. Do the phase 012 changes move their named rows in a real capture, and does any new alias reach a must-not-start row? Owner: phase 012's capture.
2. Does a delivered and attributed offer move mutating starts on Codex once its hooks are approved? Owner: the operator's approval, then one Codex smoke row.
3. Does the `(needs a mode)` label stop the improvised audit on the deep-review row? Owner: a six-row rerun on pi, opencode and devin after phase 012.
4. Should Gate 2 gain a clause for a skill-only brief? Owner: the operator.
