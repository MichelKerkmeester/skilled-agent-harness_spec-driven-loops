# Iteration 1: What the brief says, what defines it, and what it costs

## Focus

KQ1 and KQ2: which words in the delivered brief reach the model and which reach only `AGENTS.md`, and what the brief costs per prompt after phase 005. The iteration renders the head byte-for-byte from `runtime/lib/render.ts` and the generated `COMMAND_ROWS`, measures the constant block against the per-command head, and checks whether the brief's policy word has a definition on each delivery path. Chosen over KQ3 because every later install and wording recommendation needs the delivered-bytes baseline first.

## Actions Taken

1. Read `render.ts` end to end and computed the exact head and directive strings it returns.
2. Parsed the generated `COMMAND_ROWS` block in `command-attach.ts` and computed head, total and character length for every row.
3. Read the Gate 2 bullet in `AGENTS.md` and checked where the `run`/`start`/`ask` definitions live.
4. Checked the instruction-file state of this worktree and of the Claude user config (`CLAUDE.md`, `~/.claude/CLAUDE.md`).
5. Read the agents-md manifest's Claude copy rule and the shadow route-only measurement path in `render.ts` / `policy-plan.ts`.

## Findings

1. The delivered brief is 285-327 bytes per prompt, median 298: a per-command head of 67-109 bytes (median 80) plus a 218-byte constant block (`Directives:` + the comment-hygiene hard block). The constant is 73% of the median brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:133] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:60]

2. The constant block is emitted on every brief, not once per session. `renderAdvisorBrief` appends `DIRECTIVES_LABEL + HYGIENE_DIRECTIVE` unconditionally on both the normal and the ambiguous return path, and `renderRouteOnlyAdvisorBrief` is called only from the shadow observer to compute `savedBytes`; nothing strips the block from the emitted bytes. The shadow plan therefore measures a 43-byte route-only brief that is never produced. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:314]

3. Contradictory evidence on the directive's repeat cost: segment one's eliminated-alternatives table says the directive is "suppressed after the first message; at most 54 tokens per session", while the renderer appends it to every brief. The renderer is the emitted-byte source of truth, so the segment-one line describes the shadow measurement, not delivery. Recorded, not resolved in segment one's favour. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:127] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:594]

4. The head carries the policy word but never its definition. The only definition of `run`, `start` and `ask` is the 463-byte Gate 2 bullet, and `render.ts` emits none of it. A runtime that receives the brief without `AGENTS.md` therefore receives a policy word it cannot resolve. [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:234]

5. On Claude Code in this worktree the definition does not arrive at all: there is no project `CLAUDE.md`, and `~/.claude/CLAUDE.md` is a symlink to the main checkout's `AGENTS.md` at `/Users/michelkerkmeester/MEGA/Development/Skilled/AGENTS.md`. The after-arm Claude rows carried the brief and not the bullet, which is why their `(start)`/`(ask)` words were undefined. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:130]

6. Contradiction inside the install design: the agents-md manifest says "Claude reads the root document directly", while the measured after arm shows a project with `AGENTS.md` and no `CLAUDE.md` produced Claude rows without the bullet. Both claims are recorded; the recommendation in iteration 2 has to work under either one, which a one-line pointer does. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:130]

7. Head room is real but small: the longest head is 107 characters against the renderer's 320-character single-head cap, and a 40-byte addition costs 13% of the median brief while a 110-byte clause costs 37%. The policy mix is 20 `start`, 7 `run` and 17 `ask` of 44 tracked commands, so any policy gloss applies to the majority of offers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:104] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:124]

8. The two numbers in the head (`0.85/0.20 pass.`) cost about 14 bytes on every prompt and have no reader inside the brief; they are the scorer's confidence and uncertainty, and the ambiguous head repeats them for the second candidate. Removing them is a byte saving with no measurable behaviour path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]

## Ruled Out

- Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]
- Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406]
- Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]

## Dead Ends

- Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453]
- Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82]

## Edge Cases

- Ambiguous input: "what the model reads" has two readings, the brief bytes and the instruction file. Both were measured; the instruction file is the load-bearing one for the policy words.
- Contradictory evidence: the segment-one suppression claim and the renderer's unconditional append (finding 3); the manifest's Claude claim and the after-arm measurement (finding 6). Neither is resolved by preference; both are carried into iteration 2.
- Missing dependencies: none. The brief is computed from source, not from a live hook, so no daemon or model was started.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `AGENTS.md`
- `.skilled/commands/doctor/assets/agents-md-manifest.json`
- `~/.claude/CLAUDE.md` (symlink target read only)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md`

## Assessment

- New information ratio: 0.62
- Questions addressed: KQ1, KQ2
- Questions answered: KQ1, KQ2

## Reflection

- What worked and why: computing the brief from the renderer and the generated table, rather than trusting the reported 242-298 bytes, exposed that the head is only 27% of the brief and that the constant block never shrinks. Parsing the table also made the "room for a gloss" question numeric instead of rhetorical.
- What did not work and why: looking for an emitter-side suppression failed because the state machine is a measurement surface; segment one read its own shadow metric as delivery.
- What I would do differently: read the returned string before the shadow log next time; the emitted bytes are the only cost that reaches the model.

## SCOPE VIOLATIONS

Two workflow steps that would write outside this lineage were skipped, not executed, under the dispatch's write limit:

- `phase_init.step_preinit_spec_branch` classifies `spec-present` and would append the research topic to `{spec_folder}/spec.md` under Open Questions and Research Context. The file was read for classification and left unchanged.
- `phase_synthesis.step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` would replace a generated findings fence in `spec.md` and run `validate.sh` on the parent packet. Both are parent-packet writes; the lineage records the conflict here and stops at its own synthesis.
- `phase_save` (`generate-context.js`) was not run: the dispatch bans it, and the lineage's completion is its own artifacts.

No file outside the lineage was created, modified or deleted.

## Recommended Next Focus

KQ3: the external-repository install path. The embed branch removes the project `CLAUDE.md` that the Claude Code path needs, and the install's final `/doctor:setup` does not report whether any brief was delivered, so a fresh install can finish green with a runtime at zero.
