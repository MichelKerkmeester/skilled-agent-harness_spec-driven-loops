# Multi-AI Council Strategy

## Purpose

Review `research/research.md`, the Opus 5.5 max synthesis of 30 Jev integration research iterations, and propose a re-synthesis and re-ranked recommendations. The operator asked, in their words: "Ask opus 5.5 max ai/council to review findings and recommendations and propose resynthsis / recommendations".

## Task Framing

- **Type:** research review.
- **Under review:** `research/research.md`. Its verdicts are 1 build-now (R1), 1 next (R2), 16 later (R3 to R18), 32 drop and 3 dead ends, with two Planned phases, `002-advisor-jev-tiebreak-arm` and `003-goal-verifier-jev-shadow`.
- **Operator intent:** find how Jev can "create innovative and useful skills, workflows, logic, etc that beautifully integrates with the existing .skilled repo", prioritizing "UX, ease of use, usefulness that's measured and reduce overengineering whilst not shying away from coding extensive logic as long as it's useful". The four starting ideas are grading AI responses, active skill-advisor recommendations, upgrading the goal hook, plugin and extension, and Jev plus a compressor for compaction.
- **Deliverable:** a council report with a verdict on the synthesis, a per-recommendation review, new recommendations, a re-ranked phase plan of at most 6 phases after 002 and 003, a re-synthesis decision with a draft (`proposed-resynthesis.md`), and confidence and dissent.

## Selected Lenses

| Seat | Lens | Mandate |
|---|---|---|
| seat-001 | Critical: evidence and verdict audit | Every verdict rests on a reopened citation. Tests the DeepSeek under-count, R1's statistical power, R2's design and D5's effect on failure paths |
| seat-002 | Pragmatic-UX: operator value and measured usefulness | What each recommendation removes from or adds to the operator's day, how much operator labor it needs, and how enablement under D5 feels |
| seat-003 | Creative-contrarian: too conservative or too timid | Where a bolder build passes the fitness checklist today, gold as a product in its own right, and seams and new material the synthesis never examined |

## Executor and Vantage Targets

All three seats are `opus-max` sub-agents (Claude Opus 5.5 at max effort), as the operator asked. **Vantage integrity: single model.** Diversity comes from lens and mandate only, and no seat is an external AI system. Agreement between seats is one model family agreeing with itself three ways and is weighed that way.

## Evidence Inputs

- `research/research.md` in full, and the 30 raw lineage iterations under `research/lineages/{deepseek,mimo,grok}/iterations/`.
- `context/repo-rules-digest.md` (section 3 fitness checklist Q1 to Q15, section 4 red flags), `context/seam-map.md`, `context/jev-material-digest.md` and `context/measurement-digest.md`.
- `../context/ideas from michel kerkmeester.md`, `spec.md` and the parent `goal.md` (decision D5).
- The Planned phases `../002-advisor-jev-tiebreak-arm/` and `../003-goal-verifier-jev-shadow/`.
- Facts the orchestrator established after the synthesis: the D5 key gate, the DeepSeek under-count in the merged registry (8 of 57), seven reopened seams, the one-file goal plugin, and the goal-core versus plugin verdict vocabularies.
- New material: `sk-create-goal`'s `check-goal.cjs`, jevcache.sh, classifier.dev and the fast-jev-compaction blog. The council host fetched jevcache.sh and classifier.dev once via WebFetch on 2026-09-26 and passed the returned summaries to every seat as vendor claims.

## Convergence Rule

`two-of-three-agree`, with one round planned (`max_rounds` 1). A recommendation's verdict converges when two seats reach the same tier and cross-critique finds no new blocking finding. Where seats split, the report carries the dissent instead of averaging it.

## Known Constraints

- The seats are leaves. They read, run read-only shell counts only, write no file and dispatch no agent.
- No live `jev` or `jevctl` call, no install, no network from a seat, no repository script run, and no `.env` file opened.
- Writes are limited to this `ai-council/` directory. `research.md`, the spec docs and all code stay untouched.
- **Persistence deviation.** The council agent is denied Bash, so it cannot call `persist-artifacts.cjs` or the append gateway (`append-mode-event.cjs --mode ai-council`) through node. Artifacts are written with the Write tool in the writer's own shapes. `ai-council-state.jsonl` is left unwritten, because only the gateway may write it. The state events are listed in `gateway-replay-events.jsonl` for the orchestrator to replay through the gateway.
- Timestamps carry date precision only, because this agent has no clock.
