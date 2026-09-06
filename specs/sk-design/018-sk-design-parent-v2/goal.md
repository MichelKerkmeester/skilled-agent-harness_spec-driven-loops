---
title: "Goal: reinstate sk-design as a parent hub, and prove every request still arrives"
description: "The binding goal for the whole packet. Every child goal.md inherits these rules; where a child disagrees with this file, this file wins."
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal

Reinstate `sk-design` as a parent hub carrying four modes, and finish with every request that
reached a skill before still reaching one, proven by replay rather than by configuration.

## Read first, do not re-derive

- `roadmap.md` beside this file: order, what each step breaks, what proves it fixed.
- `spec.md`: why this reverses `016-deprecate-sk-design-interface` and what stays retired.
- `scratch/routing-baseline.txt`: the sixteen-phrase measurement taken before anything moved. It is
  the only record of the prior state and cannot be recaptured.
- `scratch/routing-regressions.md`: the one regression this packet owns and the one weakness it
  inherits.

## The rule that governs every step

**A registry row, a vocabulary entry and a green gate prove nothing about whether a request
arrives.** The baseline already demonstrates this: `sk-doc` carries 27 chart and diagram vocabulary
strings, including `ascii flowchart` verbatim, and the phrase `ascii flowchart of the approval loop`
reaches nobody. Every step ends by replaying the sixteen phrases and comparing against the baseline.

## Binding constraints

1. **One commit per step.** Work happens on the shared branch and other sessions write here. No
   commit may leave a skill root without its `SKILL.md`, or a router signal pointing at a packet not
   on disk. A move and its path rewrites land together.
2. **Moves must be renames.** Verify with `git diff --cached --name-status -M` before committing and
   require `R` status. A move that records as delete-plus-add loses the history and is not
   acceptable.
3. **Scope every git command.** Other sessions have dirty files here; never `git add -A`.
4. **The class contract is not negotiable.** `description.json`, `mode-registry.json` and
   `hub-router.json` are required on a hub and forbidden on a standalone;
   `leaf-manifest.config.json` is the mirror. An active root `ROUTER.md` needs `router_state`,
   `version` and `skill_pointer` in frontmatter, `## OVERVIEW` and `## INTENT MODEL` sections, and
   `INTENT_SIGNALS` and `RESOURCE_MAP` as dictionaries whose paths resolve to declared leaves.
5. **Comment hygiene is a hard block.** Never a task id, requirement id, phase number or spec path
   in a code comment.
6. **Do not restore what `016` retired**: the interface mode, the `commands/interface/` surface, or
   the design-taste layer.

## Definition of done

Four modes under one hub. Both hubs green on their own checks and the fleet metadata gate. The
sixteen-phrase replay showing no phrase below its baseline, chart and diagram phrases naming
`sk-design`, and `sk-doc` no longer claiming them. The regression this packet owns closed, or
escalated with evidence if it did not close where expected. `validate.sh --strict` clean across the
packet. The advisor daemon rebuilt and its generation observed to move.

## Keeping this file true, and telling the operator when it changes

This goal is not written once. It is the working contract, and it goes stale the moment the work
teaches something the plan did not know. Update it whenever any of these happen:

- A step's real order changes, or a step turns out to be unnecessary.
- A constraint here proves wrong, too strict, or too loose against what the canon or the gates
  actually enforce.
- A new open item appears that a later phase must carry, or a carried item closes.
- A measurement contradicts something this file asserts. The file loses; the measurement stands.

**Then say so.** Print the revised goal back to the operator in chat, under 4,000 characters, with a
one-line note naming what changed and why, so the operator can update the goal they are holding.
A goal file that has drifted from the work is worse than none, because it still reads as authority.
Do not wait until closure to report a change that alters what the next step does.

## Escalate rather than continue

A gate failing twice on one cause after a real repair. A spec contradicting the code. A change that
would touch a file outside the phase's declared scope. Anything that would delete tracked content.
A routing regression that does not close where this packet said it would.
