You are one of six Opus 5.5 high leaves that bring the Planned build phases in line with research round 3. You own exactly one phase folder, named in your assignment, and you write only inside it. You are a leaf: never dispatch another agent.

## Pre-resolved gates (do not ask about these)

- Gate 3 is answered: your phase folder is the spec folder. Nobody is at your prompt, so a question stops the work. Decide, and record the decision in the phase's `goal.md` log.
- Skill routing is resolved. These are spec-folder documents, owned by `system-spec-kit`: keep each file's template markers, anchors and section order. Goal files follow `sk-create-goal`: read `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md` before you edit a `goal.md`. Prose follows `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`: no em dashes, no semicolons, plain sentences.
- Write scope is your phase folder only. Never edit the parent's `spec.md` or `goal.md`, another phase, `research.md`, any skill, script or hook, or anything outside the packet. No git writes, no installs, no live `jev` call of either package and no call to the Deem server or `deem-ctl`. Never open a `.env` file.
- Nothing gets implemented. Every phase stays `Planned`. You write plans, not code.

## Where the decisions come from

- **The operator's parent goal** is `specs/cli-jev/003-cli-jev-workflow-integration/goal.md`. Its D1 is binding on every phase: each feature runs on Jev or Deem and stays dormant unless one is available. Jev is available when `jev auth status --provider <p>` exits 0. Deem is available when the local server passes a health check that refuses the stub backend. With neither, behavior is exactly today's. Jev gets no secret. Its D5 and its fourth completion criterion direct these amendments, so the operator has already approved them. Section 14 of the synthesis says each amendment waits for operator approval: the parent goal settles that, so record it in the log and proceed.
- **The synthesis** is `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md`. Section 14 holds your phase's line-by-line amendment table or its new-phase record. Section 12 holds the recommendations it names (R1, R2, R19, R20, R21 and R23), including each one's two-backend gate, keep rule and smallest slice. Section 12 also holds the shared gate contract and the conditions C1 to C15 the tables cite. Read your subsection of section 14 in full, then every recommendation and condition it names.
- **The Deem facts** are in `007-classifier-deep-research/context/deem-local.md`: the served model, its measured latency, the one-request-at-a-time lock, determinism, `DEEM_N_ORDERS`, and `deem-ctl` with its update and rollback paths.

## What to do

1. Read your phase's current `spec.md`, `plan.md`, `tasks.md`, `goal.md` and `implementation-summary.md` before you change anything.
2. Apply section 14 for your phase. The line numbers in its tables point at the current `spec.md`. Reopen each one, because a line may have moved, and apply the change where the content sits. Carry each change through to `plan.md`, `tasks.md` and `goal.md` wherever they state the same thing, so no document in the folder still claims a Jev-only gate that section 14 amends. Keep every requirement id, and add new ones after the last.
3. Keep what section 14 does not change. Do not rewrite settled text for style, and do not add scope the synthesis did not propose.
4. Name things honestly. Anything that does not exist yet (`cli-deem`, `--deem`, a new env value) is marked "proposed" the first time it appears in each document.
5. In `goal.md`, amend the directive and criteria only as far as section 14 requires, and record every change in the log with its source, for example "Amended for two backends per 007 `research.md` section 14 and parent goal D1 and D5". Keep the goal within the `sk-create-goal` budget.
6. Comment hygiene does not apply, because you write no code. Documents may cite `research.md` sections, R ids and file paths.

## Verify before you report

Run these from the worktree root and read both the output and the exit status:

```
node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <your phase folder> --apply
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <your phase folder> --strict
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <your phase folder>
```

`validate.sh` must print `RESULT: PASSED`, and `check-goal.cjs` must print `RESULT: PASSED`. Fix what they report inside your folder and rerun them. If a failure needs a change outside your folder, stop and report it instead.

## Report back

In under 200 words: the files you changed, the section 14 rows you applied and any you could not apply (with why), each new requirement id, the three command results as printed, and anything the orchestrator must decide.
