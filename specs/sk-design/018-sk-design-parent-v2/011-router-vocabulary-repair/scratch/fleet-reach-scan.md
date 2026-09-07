# What every hub's router advertises, and what actually arrives

`ci-router-vocabulary-reach.cjs` probes every multi-word phrase a hub's router
declares and asks whether it reaches the hub declaring it. Measured at daemon
generation 679.

| Hub | declared | wrong-hub | no-reach |
|-----|---------:|----------:|---------:|
| `sk-design` | 77 | 1 | 10 |
| `system-deep-loop` | 25 | 3 | 8 |
| `mcp-tooling` | 76 | 2 | 11 |
| `cli-external-orchestration` | 51 | 4 | 10 |
| `sk-code` | 41 | 2 | 25 |
| `sk-doc` | 169 | 7 | 72 |
| **total** | **439** | **19** | **136** |

## The wrong-hub findings

These are the ones that fail the check: something else owns a phrase the hub
advertises.

- `system-deep-loop`: `iterative review` and `review convergence` reach `sk-design`;
  `audit the diff` reaches `sk-code`.
- `mcp-tooling`: `create note` reaches `system-spec-kit`; `browser agent` reaches
  `sk-code` at 0.8639.
- `cli-external-orchestration`: `full plugin and memory stack` reaches
  `system-spec-kit`; `codex diff review` reaches `sk-code` at 0.9461; `pi print mode`
  and `pi multi-provider` reach `sk-design` and `sk-git`.
- `sk-code`: `motion principles` reaches `sk-design`; `plugin data layer` reaches
  `mcp-tooling`.
- `sk-design`: `decision branch` reaches `sk-git` at 0.9452, on the word "branch".
- `sk-doc`, seven and the largest set: `review the documentation`, `review bar`, `pass review` and
  `quality bar` all lose to `sk-code`, which carries strong review vocabulary; `nested packet` reaches
  `system-spec-kit`; and `model benchmark` and `skill benchmark` reach the deep-loop family, which is
  where the benchmark modes actually live.

Nineteen phrases across six hubs reach a hub other than the one advertising them. The pattern in four
of the seven `sk-doc` cases is the same one this packet met twice already: `sk-code` wins any phrase
containing a review verb, whatever the artifact being reviewed.

## One of these is ours, and it is not what it looks like

`pi print mode` reaches `sk-design` at 0.8200. The print vocabulary added when
fundamentals was broadened past screen UI is what matches it, so the collision is
this packet's.

Removing the shortest of those signals, `print layout`, was tried and changed
nothing: the match survives on the remaining print signals through stemming. Gutting
the rest would undo work that was asked for and that three target phrases depend on.

The more useful reading is the other side. `cli-external-orchestration` declares 51
multi-word phrases and carries 29 `intent_signals`, and none of `pi print mode`,
`print mode`, `pi headless`, `extended thinking` or `anthropic cli` is among them.
A weak 0.8200 match wins only because the hub that should own the phrase has nothing
at all. The fix belongs there.

## What no-reach means

Almost always length. `stack trace`, `console error`, `web vitals`, `focus trap`,
`pi headless`: two and three-word fragments that do not clear the bar however they
are declared. `sk-code` has 25 of them, which says its router advertises in a
register its scoring vocabulary was never given.

The check reports these and does not fail on them, because a gate that fails on
sixty-four unfixable rows across five hubs stops being run.

## A defect in the checker itself, found by running it

The first run against `cli-external-orchestration` reported `:          {`, `: 4, `
and `: [` as unreachable phrases. The extractor matched quote-delimited text inside
the router block, and where a router formats that block across lines, the text
between two quoted keywords is punctuation rather than a phrase. Filtered to
candidates that begin with a letter or digit and carry no brace or bracket;
declared count for that hub fell from 54 to 51.
