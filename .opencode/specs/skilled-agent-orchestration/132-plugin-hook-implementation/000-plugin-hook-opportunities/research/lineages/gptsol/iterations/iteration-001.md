# Iteration 1: Skill and Runtime Inventory

## Focus

Inventory the current OpenCode plugin surface and identify skill contracts whose repeated enforcement or routing logic is a plausible hook candidate.

## Actions Taken

1. Enumerated all `.opencode/skills/**/SKILL.md` packets.
2. Enumerated current OpenCode plugin entrypoints and tests.
3. Searched the repository for supported OpenCode and Claude hook names.
4. Read the plugin entrypoint contract and representative governance, quality, git, advisor, and deep-loop skills.

## Findings

1. The plugin layer already establishes a reusable architecture: minimal default-export-only entrypoints in `.opencode/plugins/`, with bridge and schema logic owned by the source skill. New candidates should follow that ownership split rather than placing helper modules in the auto-load directory. [SOURCE: .opencode/plugins/README.md:24-38] [SOURCE: .opencode/plugins/README.md:56-67]
2. Existing plugins cover prompt-time skill advice, code-graph context, memory continuity, goal state, deep-loop dispatch guards, dist freshness, and session cleanup. The most valuable net-new candidates therefore sit at other workflow boundaries: mutation intake, destructive command execution, post-edit quality checks, and stop-time completion evidence. [SOURCE: .opencode/plugins/README.md:42-52]
3. `system-spec-kit` contains a high-frequency manual mutation gate: all file modifications require spec-folder documentation, while read-only work and explicit skip are exceptions. This is a strong candidate for prompt-time classification and pre-mutation enforcement rather than another general context injector. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:28-61]
4. `code-quality` defines deterministic post-write checks by target path, including comment hygiene, dist staleness, and OpenCode-specific authoring checklists. It already has a Claude `PostToolUse` warning hook for comment hygiene, making a broader cross-runtime post-edit quality router a natural extension. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:54-110] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:124-136]
5. `sk-git` contains safety rules that are mechanically recognizable before shell execution: no direct branch creation, no force-push to main/master, scoped staging, and deterministic commit-message structure. These rules are suitable for command interception because they do not require broad semantic judgment in their blocking core. [SOURCE: .opencode/skills/sk-git/SKILL.md:291-317] [SOURCE: .opencode/skills/sk-git/SKILL.md:459-469]
6. `system-skill-advisor` already owns prompt-time recommendation and skill graph freshness. New routing hooks should consume this service or validate its result, not duplicate scorer logic. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:39-85] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:116-159]
7. `system-deep-loop` centralizes mode resolution through `mode-registry.json` and forbids flattening mode-specific lifecycle logic into the hub. Hook candidates around deep loops should enforce route and lifecycle boundaries, not attempt to run convergence or synthesis themselves. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:35-70] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:93-110]

## Questions Answered

- Which existing skills contain repeatable enforcement, routing, recovery, or quality logic that is currently manual or prompt-dependent?

## Questions Remaining

- Which exact OpenCode surfaces best fit the candidate contracts?
- Which exact Claude surfaces best fit the candidate contracts?
- How should candidates be prioritized?
- Which ideas should be eliminated due to overlap or unsuitable runtime semantics?

## Ruled Out

- A new generic prompt-context plugin: existing skill-advisor, memory, code-graph, and goal plugins already occupy that layer; another broad injector would add token cost and precedence ambiguity. [SOURCE: .opencode/plugins/README.md:42-52]
- Embedding deep-loop convergence in a hook: the mode packets and runtime own convergence; the hub explicitly must remain routing-only. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:88-110]

## Dead Ends

- Broad repository hook-name search produced many generated and archived references; direct plugin README and skill contracts were more reliable for current-state inventory.

## Edge Cases

- Ambiguous input: "additional" was interpreted as net-new behavior not already supplied by the seven current plugin entrypoints.
- Contradictory evidence: none.
- Missing dependencies: memory context timed out; direct repository sources replaced it.
- Partial success: candidate families are identified, but exact surface mapping remains for later iterations.

## Sources Consulted

- `.opencode/plugins/README.md:24-67`
- `.opencode/skills/system-spec-kit/SKILL.md:28-61`
- `.opencode/skills/sk-code/code-quality/SKILL.md:54-136`
- `.opencode/skills/sk-git/SKILL.md:291-317,459-469`
- `.opencode/skills/system-skill-advisor/SKILL.md:39-159`
- `.opencode/skills/system-deep-loop/SKILL.md:35-110`

## Assessment

- New information ratio: 1.0
- Novelty justification: Seven distinct current-state findings established the baseline inventory, ownership boundaries, and four high-value automation families with no prior iteration evidence.
- Questions addressed: skill candidates and existing overlap.
- Questions answered: skill contracts suitable for hook automation.

## Reflection

- What worked and why: reading current plugin documentation alongside source-skill contracts separated genuine gaps from already-shipped behavior.
- What did not work and why: broad hook-term search was noisy because it included generated and archived material.
- What I would do differently: narrow the next pass to current plugin implementations and exact supported hook keys.

## Recommended Next Focus

Map concrete OpenCode plugin candidates to `tool.execute.before/after`, `session.*`, or `experimental.*`, validating feasibility and overlap against current entrypoints.
