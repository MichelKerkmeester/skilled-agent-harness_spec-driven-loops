# Synthesis brief — routing perfection research

You are a fresh reader. You did not run the research and you have no prior context on it.
Everything you need is on disk. Read it, verify it, and decide.

## What produced the material you are reading

The run was configured as two independent lineages on different models. **Only one produced
anything.** The other, GLM 5.3 Flash, wrote a config record and a header stub and nothing else
in 39 minutes, and was killed at 0 of 5 iterations. Do not go looking for a second opinion in
`research/lineages/glm/` — there is none, and its `research.md` is an empty scaffold, not a
finding.

So your material is one lineage: **`luna`, GPT-5.6-luna at max reasoning, 5 iterations**, at
`research/lineages/luna/iterations/iteration-00{1..5}.md` and merged in
`research/lineages/luna/research.md`.

Read `research/dispatch-prompt.md` first. It carries the five angles luna worked (one per
iteration), the measured facts it was told not to re-derive, and the constraints it was held to.

**One lineage changes your job.** With two models there would have been disagreement to
adjudicate. With one, there is a single chain of reasoning that could be internally consistent
and wrong end to end — five iterations by the same model compound each other's assumptions
rather than checking them. Independent verification is therefore not a spot-check here; it is
the substance of the work. Treat luna as a well-informed witness, not as a result.

## The problem, stated once

Routing decides which skill answers a request. It runs in two stages: an advisor scores each
hub's `graph-metadata.json` `intent_signals` to pick a hub, then that hub's `hub-router.json`
and `ROUTER.md` pick a mode within it. A phrase that reaches nobody is a capability the fleet
has and cannot be asked for.

A fleet scan at advisor generation 679 found, across 439 phrases the six hubs' routers
advertise: **19 reach the wrong hub, 136 reach nobody.**

## Your job

Produce one decision-ready synthesis at
`specs/system-skill-advisor/024-routing-perfection-research/research/synthesis.md`.

Not a summary of what five iterations said. A ranked answer to: **what should be built, in what
order, to make a phrase a hub advertises actually reach that hub.**

## How to treat the material

**Every load-bearing claim gets re-run before you rely on it.** luna was told to cite
`file:line` and quote real command output. Open the file, read the line, run the command
yourself. Probe with:

`node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<phrase>"}' --format json`
`node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub <id>`

Three outcomes, and label each: **confirmed** (you reproduced it), **contradicted** (you ran it
and got something else — say what), **unverified** (you could not check it cheaply — say what
would).

**Watch for the compounding failure.** If iteration 2 built on a claim from iteration 1 and you
cannot confirm that claim, everything downstream of it is unverified too, however confident the
later iterations sound. Trace those chains and say where they start.

**Note where luna went quiet.** An angle it covered in a paragraph when the others got pages is
a gap, not a settled question.

## The position you are testing

The orchestrating session recorded this before the run. Take each point and mark it
**confirmed**, **overturned**, or **unsettled**, with your own evidence. Do not defer to it, and
do not defer to luna either — where they agree, that is two opinions, not a proof.

1. The 136 no-reach and the 19 wrong-hub are different failure classes needing different fixes,
   and conflating them is why adding vocabulary keeps not working.
2. Highest leverage is a deterministic exact-phrase path in front of the scorer — which
   compiled routing already is. Five hubs are on it; `sk-design` returns
   `{"servingAuthority":"legacy"}`.
3. That table should be generated from the router's declared `INTENT_SIGNALS`, so "a phrase a
   hub advertises reaches that hub" holds by construction rather than by audit.
4. The 19 wrong-hub cases should be arbitrated on the artifact noun, not the verb
   (`review the documentation`, `audit the diff`, `review this screen`).
5. Adding vocabulary is the wrong lever. Membership in `intent_signals` is neither necessary
   nor sufficient, and it was tried twice with no movement.

Two constraints luna was held to and you are held to as well: **do not propose lowering the 0.8
confidence bar** — it trades one failure mode for a worse one and has already been considered —
and **do not propose adding vocabulary as the primary fix.**

## Output shape

Write `research/synthesis.md` with exactly these sections:

**Verdict** — three sentences at most. What is actually wrong and what fixes it.

**The position, adjudicated** — the five points above, each marked confirmed / overturned /
unsettled with the evidence you gathered yourself.

**What I verified, and what I could not** — luna's load-bearing claims as a table: claim,
confirmed / contradicted / unverified, and the command or `file:line` that settles it. Include
every claim a ranked recommendation below rests on.

**What to build, ranked** — each item with: what it is, what it fixes and how many of the 155
broken phrases, whether it is implementable against this codebase today or needs a change to the
scorer, what it costs, and what it could break.

**What one lineage could not settle** — explicit. Name what a second model would most likely
have challenged, and the single measurement that would close each gap.

Cite `file:line` or real command output throughout. Do not write an implementation plan, a spec,
or a task list. Do not edit any file outside `research/`.
