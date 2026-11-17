# Iteration 2: What the in-process answer changes under the Q026 filter

## Focus

The answer half of rank 6. Run the in-process handler and today's Python fallback on the same ten prompts, apply the existing Q026 filter (`degradedRecommendations`) exactly as the rank describes it, then test the smallest filter change that preserves the rank's promise that typed commands stay and the mode label matches the live answer. Two synthetic hub prompts are added for the label check; they are not corpus rows.

## Actions Taken

1. Extended `scratch/timing-handler.mjs` with a `shape-live` mode that reports the handler's raw top, the literal Q026 filter output, a corrected filter output and the fallback output for the same prompt.
2. Ran it against the scratch database copy with `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`.
3. Read the hook's CLI-payload mapper to see whether the filter's output can carry `needsMode`.

## Findings

1. The literal rank 6 wiring loses the typed command on the typed readme prompt. The handler names `sk-doc` with `/create:readme`, the existing filter emits a bare `sk-doc` skill row because `commandRowFor('sk-doc')` is empty, and today's fallback keeps `/create:readme`. Feeding handler rows to `degradedRecommendations` with `skillId` as the skill is a regression on the one guarantee Q026 makes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/shape-live.jsonl]
2. The handler's raw answer is the live answer on the cases rank 6 names: the plain readme prompt tops `sk-doc` where the fallback tops `system-spec-kit`, the create-agent prompt carries `/create:agent`, the typed doctor prompt carries `/doctor:setup`, and both hub prompts report `needsMode` true where the fallback reports none. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/shape-live.jsonl]
3. A filter that trusts the handler's own command only when the prompt typed it keeps the typed readme command and adds no command to the nine untyped prompts: 1 of 1 typed command kept, 0 of 9 gained. That is the Q026 boundary, and it needs the filter to read the handler row rather than re-derive the command from the skill. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/shape-live.jsonl]
4. The mode label needs a second small change. The hook's payload mapper already reads `needsMode` from a CLI recommendation, but the Q026 filter's rows carry no such field, so the in-process call alone cannot surface the label. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:389]
5. The in-process top differs from the fallback top on five of the ten corpus prompts: plain readme, plain doctor setup, create-agent, save and repo-rule. On the typed readme prompt the two agree on the command but not on the top skill. The other five agree. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/shape-live.jsonl]

## Ruled Out

- Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495]
- Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: "the way rank 6 describes" leaves the row mapping open. Selected interpretation: measure the literal mapping first, then the smallest mapping that satisfies the rank's own promise. Deferred: a full renderer-level comparison, which belongs to a build phase's vitest.
- Contradictory evidence: none. The handler's raw answer and the fallback answer differ, but that is the point of the change, not a contradiction.
- Missing dependencies: none.
- Partial success: none.

## Commands and Output

```text
$ SYSTEM_SKILL_ADVISOR_DB_DIR=<lineage>/scratch/db SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 node <lineage>/scratch/timing-handler.mjs shape-live
{"mode":"shape-live","index":8,"id":"cmd-create-readme-typed-01","rawTop":{"top":"sk-doc","command":"/create:readme",...},"naive":{"top":"sk-doc","command":null,"commandKept":false},"corrected":{"top":"sk-doc","command":"/create:readme","commandKept":true},"fallback":{"top":"command-create-readme","command":"/create:readme","commandKept":true}}
{"mode":"shape-live","index":10,"id":"synthetic-sk-doc-hub","rawTop":{"top":"sk-doc","needsMode":true,...},"fallbackRawTop":{"top":"sk-doc","needsMode":false,...}}
{"mode":"shape-live","index":11,"id":"synthetic-deep-loop-hub","rawTop":{"top":"system-deep-loop","needsMode":true,...},"fallbackRawTop":{"top":"system-deep-loop","needsMode":false,...}}
```

## Sources Consulted

- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1481
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:389
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:311
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/shape-live.jsonl

## Assessment

- New information ratio: 1.0
- Questions addressed: the answer-change question, including the Q026 filter boundary and the mode label
- Questions answered: the answer-change question

## Reflection

- What worked and why: measuring the literal wiring before the corrected one separated a design gap from a property of the handler. The handler already produces the live answer; the filter is what drops fields.
- What did not work and why: the first shape pass reported only the naive filter, so it would have hidden the typed-command regression. Adding the corrected filter made the difference visible.
- What I would do differently: put the near-miss cases (create-agent, hub prompts) in the measured set from the start, since they are where the filter's field handling matters.

## Recommended Next Focus

Measure the two remaining budget inputs: the CLI's own cold startup and the handler's cost at the longest prompt the hook can send. Then assemble the headroom against 2,500 ms in the following iteration.
