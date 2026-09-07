GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-skill-advisor/024-routing-perfection-research

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

---

# TASK

Determine how to make skill routing in this repository reliable, so that a phrase a hub's
router advertises actually reaches that hub.

This is a research iteration. Produce evidence-cited findings, not an implementation.

# INSTRUCTIONS

Work one angle per iteration, in the order given below, and go deep rather than wide. Read the
real files and run the real commands. Every claim cites a `file:line`, a command with its
output, or a measured score.

## Angle 1 — the scorer's shape

Two and three-word phrases fail to clear the bar whether or not they are in the vocabulary:
`font size`, `corner radius`, `critique this`, `plot this`, `stack trace`, `web vitals`. Longer
forms of the same request succeed: `plot this data` scores 0.82 where `plot this` scores
nothing.

Find the scoring function. Establish what length actually does to a score, whether the effect is
a deliberate specificity gate or an artifact of normalisation, and whether a principled fix
exists that does not simply lower the bar for everything.

## Angle 2 — cross-hub collision arbitration

`sk-code` takes any phrase containing a review verb, whatever artifact is being reviewed:
`review bar`, `pass review`, `review the documentation` from `sk-doc`; `audit the diff` from
`system-deep-loop`; `design review of this slide deck` and `review this screen` from `sk-design`.
`decision branch` goes to `sk-git` on the word "branch".

Determine whether a principled arbitration exists: an artifact-type discriminator, hub-owned
verb classes, negative signals, or something else. Say what it would cost and what it would
break.

## Angle 3 — the two-vocabulary contract

Routing has two stages. The advisor scores a hub's `graph-metadata.json` `intent_signals` to
pick a hub; that hub's `hub-router.json` and `ROUTER.md` then pick a mode. A router's own
`INTENT_SIGNALS` block therefore serves stage two and is not meant to match the stage-one
vocabulary.

Establish what invariant, if any, should hold between them. It must catch a phrase a router
advertises that reaches nobody, without flagging the bare common words that legitimately belong
to stage two only.

## Angle 4 — compiled routing

Five hubs resolve through a compiled router contract before any prose path. `sk-design` does
not: `node .opencode/bin/compiled-route.cjs --hub sk-design --prompt "..."` returns
`{"servingAuthority":"legacy"}`.

Determine whether compiled routing addresses any of angles 1 to 3 or is orthogonal to them.
State what joining costs and what it actually buys.

## Angle 5 — measurement as a gate

`ci-router-vocabulary-reach.cjs` probes what a router advertises and reports `wrong-hub` as a
failure and `no-reach` as information. 136 no-reach rows across six hubs are mostly unfixable
length cases.

Design the routing check that should gate a build: what it asserts, what it must never fail on,
and how it avoids the trap that a baseline proves only what it samples.

# DO

- Read `.opencode/skills/<hub>/graph-metadata.json`, `hub-router.json`, `ROUTER.md` and
  `mode-registry.json` for the six hubs: `sk-design`, `sk-doc`, `sk-code`, `mcp-tooling`,
  `system-deep-loop`, `cli-external-orchestration`.
- Read the scorer under `.opencode/skills/system-skill-advisor/mcp-server/`.
- Probe live with
  `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<phrase>"}' --format json`
  and quote the confidence you got.
- Re-run `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub <id>`
  when you need the per-hub picture.
- Write findings to `specs/system-skill-advisor/024-routing-perfection-research/research/research.md`,
  appending your iteration under its own heading. Never overwrite another iteration.
- Rank every recommendation, and mark each one as either implementable against this codebase
  today or requiring a change to the scorer itself.
- Stop early and say so if an angle is fully answered before the iteration budget is spent.

# DO NOT

- Do not re-derive the measured facts in the section below. They were measured against the live
  daemon and are inputs, not questions.
- Do not propose lowering the confidence threshold as a fix. It has been considered and it
  trades one failure mode for a worse one.
- Do not edit any file outside your bound spec folder. Reading the whole repository is expected;
  writing anywhere else is not.
- Do not add vocabulary to any hub. This is research; a later packet implements.
- Do not write an implementation plan, a spec, or a task list. Findings only.
- Do not summarise the repository back. Assume the reader knows it.

# MEASURED FACTS, DO NOT RE-DERIVE

Taken at advisor daemon generation 679 with an explicit rebuild.

| Hub | phrases its router declares | reach the wrong hub | reach nobody |
|-----|---:|---:|---:|
| `sk-design` | 77 | 1 | 10 |
| `system-deep-loop` | 25 | 3 | 8 |
| `mcp-tooling` | 76 | 2 | 11 |
| `cli-external-orchestration` | 51 | 4 | 10 |
| `sk-code` | 41 | 2 | 25 |
| `sk-doc` | 169 | 7 | 72 |
| total | 439 | 19 | 136 |

- Keywords in `description.json` do not reliably move a score. Adding them was tried twice and
  moved nothing; separately, 9 of 14 sampled phrases absent from `intent_signals` routed
  correctly anyway. Membership is therefore neither necessary nor sufficient on its own.
- The confidence bar is 0.8. Many passing scores sit at exactly 0.82.
- `sk-design` carries 159 `intent_signals`; `cli-external-orchestration` carries 29 while its
  router declares 51 phrases.
- A phrase can be present in `description.json` and in a router's `INTENT_SIGNALS` and still
  reach nobody. `what should this look like` did, until it was added to `intent_signals`.

# CONTEXT

The fleet is 13 skill roots, 6 of them hubs. Routing decides which skill answers a request, so a
phrase that reaches nobody is a capability the fleet has and cannot be asked for.

Prior work in `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/`
holds the raw per-hub scans and a note on the compiled-routing gap. Read them; do not repeat
them.

# OUTPUT SHAPE

Append to `research/research.md`:

```
## Iteration <n> — <angle name> — <model id>

### What was read
<files, with line references>

### What was measured
<commands run, and their actual output>

### Findings
<numbered, each with its evidence>

### Recommendations
<ranked; each marked [implementable today] or [needs a scorer change]>

### What this iteration could not settle
<explicit, or "nothing">
```
