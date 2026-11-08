# Deep research — iteration 1 of 5

Research how to improve the Pi extension `pi-cache-optimizer` further. Read the code before
proposing anything; this repository is the primary source, not general advice.

## Target

`.pi/extensions/pi-cache-optimizer/index.ts` (~9,400 lines) and `tests/`. It is a vendored fork of
upstream `pi-cache-optimizer`. It hooks Pi's provider lifecycle to improve prompt-cache hit rates,
and recently absorbed three capabilities from a retired sibling extension: cache economics, a retry
loop guard, and hash-verified edits (`edit_lines`).

## What is already known — do not re-report these

- Economics records tokens and hit rates live, but the priced path never executes: no model entry
  in `~/.pi/agent/models.json` carries a `cost` block, so pricing resolves undefined and cost,
  baseline and savings arithmetic has only ever run under test.
- `prefixChurnCount` is always 0 live and 0 is also its initial value, so it currently proves nothing.
- A duplicate upstream copy of this extension used to load alongside the fork; that is fixed.
- `validateEdits` now requires the read's line count and verifies range interiors when supplied.
- The retry guard's two counters now escalate separately with honest messages.
- Suspected and unconfirmed: batch completion keys on `toolCall.id` and completes only when
  `outcomes.size === expected.length`, so a provider emitting duplicate or empty ids could leave a
  batch pending forever and silently disable the guard.

## This iteration's angle

Establish the ground truth and find the highest-value improvements available. Specifically:

1. What does the extension actually do to improve cache hit rates, and where is that mechanism
   weakest? Name the code path.
2. Where is measurement currently unable to tell success from failure? The churn counter is one
   example; find others.
3. What is the cheapest change that would make the economics feature actually useful, given no
   pricing data exists locally?
4. Which of the extension's assumptions about provider behavior are unverified, and what would
   break if they are wrong?

## Rules

- Cite `file:line` for every claim about current behavior. An uncited claim is a hypothesis, say so.
- Rank findings by value over effort. Say what you would NOT do and why.
- Do not propose a rewrite. Prefer changes that fit the existing structure.
- Do not edit any file. This is research only; write your findings as your reply.
- Budget: at most 12 tool calls. One angle, done well, beats a survey.

Output: ranked findings, each with `file:line`, the failure or gap it addresses, the proposed
change, and its risk.
