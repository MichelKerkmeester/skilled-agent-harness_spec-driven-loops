---
title: "Iteration 6: Collision analysis - who owns which phrase today"
trigger_phrases: []
---
# Iteration 6: Collision analysis - who owns which phrase today

## Focus

Answer Q7: how can doctor routing avoid stealing prompts that legitimately belong to skills? Measure both directions: skill-shaped controls that must not be stolen, and the candidate doctor phrases from `_routes.yaml` to see which skill (if any) owns them today. All envelopes persisted as `events/measure-iter6-*.json`.

## Actions Taken

- Ran a 10-prompt control set of skill-shaped work requests through the live advisor.
- Ran a 14-prompt set of candidate doctor phrases drawn from `_routes.yaml` trigger_phrases.
- Classified each outcome by owner (owning skill, wrong owner, empty) and compared margins.

## Findings

1. Every one of the ten skill-shaped controls keeps its incumbent skill: `commit my changes`, `rebase my branch onto main`, `set up a new git worktree` -> sk-git; `write a readme for the parser module`, `update the changelog` -> sk-doc; `create a spec folder for the new feature` -> system-spec-kit; `improve my prompt` -> sk-prompt; `debug the failing test` -> sk-code; `save context` -> memory:save + command-memory-save + system-spec-kit. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-01.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-08.json]

2. The controls include generic verbs a careless doctor phrase set could collide with: `set up a new git worktree` contains `set up` + `git`, and `update the changelog` contains `update`. Doctor phrases must therefore be multi-token and diagnostic, never bare `setup`, `set up` or `update`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-09.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-10.json]

3. A pre-existing ambiguity already surfaces today: `run a deep review of this spec` returns system-deep-loop and sk-code tied at confidence 0.95 (scores 0.8209 vs 0.8227), which the renderer would present as an ambiguous brief. Any doctor admission must not add new pairs of this kind. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-07.json]

4. Eight candidate doctor phrases already route to the correct owning skill rather than the doctor diagnostic: `check my git hooks setup`, `is my sk-git setup working` (0.887), `which git rules are live` (0.834) and `pre-commit gate keeps blocking` (0.8854) -> sk-git; `verify my sk-code surface` and `does my sk-code surface route` -> sk-code (0.95); `skill advisor recommends the wrong skill` -> system-skill-advisor (0.8843); `trigger index drift` -> system-spec-kit (0.8862). [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-06.json]

5. Three candidate phrases are empty today and therefore carry zero theft risk as pure additions: `disable comment hygiene gate`, `runtime mirror drift`, `skill budget audit`. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-05.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-11.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-14.json]

6. One candidate phrase routes to a wrong owner today: `new skill not appearing in advisor results` -> sk-doc 0.82 (documentation vocabulary), while the manifest maps it to `/doctor:skill-advisor rebuild`; `Code Mode broken` -> mcp-code-mode 0.8785 + sk-code 0.8574, where `/doctor:mcp debug` is the diagnostic. These are adopter cases where a doctor bridge would correct a mis-route rather than steal a correct one. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-09.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-12.json]

7. Verbatim duplication is the real theft mechanism: at `phraseSpecificity` 1.0 for a three-token phrase, a doctor bridge reusing `is my sk-git setup working` would enter the fusion with the same phrase mass as the incumbent skill's evidence, producing a tie or ambiguity rather than a clean handoff. Phrase ownership, not score magnitude, is the guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:71-74] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json]

8. The measured incumbent confidences for the diagnostic phrases sit at 0.82-0.95, so a doctor bridge admitted with a 3+ token phrase can be expected to clear the 0.8 gate; the design must therefore ensure doctor phrases are chosen where the diagnostic reading is intended, and leave the control phrases above untouched. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-01.json]

9. Proposed arbitration guard set, all evidence-backed: (a) phrase ownership - no doctor phrase may duplicate a skill phrase unless the handoff is intended; (b) 3+ token diagnostic phrases only, never bare generic tokens; (c) prefer currently-empty phrases as the first admission wave; (d) re-run the control set after admission and require unchanged top skills; (e) budget zero new ambiguous pairs against the measured baseline. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json]

10. The 0.08 command demotion does not save the design here: it only applies to slashless prompts and is small relative to a full-specificity phrase, so the guards must live in phrase selection and post-admission measurement rather than relying on the demotion. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777]

## Ruled Out

- Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff.
- Relying on the command-kind demotion to prevent theft: too small and only applies without a slash.

## Dead Ends

- None; all 24 measurements returned clean, parseable envelopes.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- events/measure-iter6-control-01.json … measure-iter6-control-10.json
- events/measure-iter6-doctor-01.json … measure-iter6-doctor-14.json
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts

## Corrections

- Earlier revisions of this narrative and its delta said four (then six) contested phrases. A recount of the fourteen measured candidate phrases gives eight that route to owning skills, three empty and two mis-routed, with `skill graph freshness` borderline. The delta carries a matching correction observation.

## Assessment

- New information ratio: 0.9
- Questions addressed: prompt-theft avoidance (Q7)
- Questions answered: Q7

## Reflection

- What worked and why: measuring both directions (controls and candidate phrases) before designing guards turned "avoid stealing" into a concrete phrase-ownership rule with named safe and contested phrases.
- What did not work and why: nothing failed.
- What I would do differently: include the doctor phrase set alongside the control set in one run so the comparison is a single consistent timestamp (the daemon was live throughout, so this is a minor artifact).

## Recommended Next Focus

Design the onboarding entry point (Q6): decide where a plain-word `set up skilled` / `is my repo set up right` prompt should land, how it relates to the existing `/doctor:*` family and its input gate, and what the user-visible follow-up should be when the advisor emits it.
