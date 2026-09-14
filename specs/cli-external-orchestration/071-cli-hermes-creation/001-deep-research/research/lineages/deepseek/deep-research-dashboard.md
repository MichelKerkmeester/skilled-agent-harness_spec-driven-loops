# Deep Research Dashboard — lineage deepseek

Lineage: `deepseek` (cli-devin / deepseek-v4-flash-max) · Spec: 071-cli-hermes-creation/001-deep-research
Session: `fanout-deepseek-1789402663119-cvvtf8` · Stop policy: max-iterations (10)

## Iteration Table

| run | focus | newInfoRatio | status |
|-----|-------|--------------|--------|
| 1 | Angle 1: headless dispatch contract | 0.85 | complete |
| 2 | Angle 2: providers, models and reasoning | 0.8 | complete |
| 3 | Angle 3: repo-root .hermes folder and instructio | 0.78 | complete |
| 4 | Angle 4: skill format compatibility | 0.72 | complete |
| 5 | Angle 5: agents, commands and persona | 0.68 | complete |
| 6 | Angle 6: hooks and plugins | 0.75 | complete |
| 7 | Angle 7: MCP | 0.7 | complete |
| 8 | Angle 8: deep-loop fan-out fitness | 0.8 | complete |
| 9 | Angle 9: constraints and differences versus the  | 0.66 | complete |
| 10 | Angle 10: recommendation | 0.55 | complete |

## Question Status

10/10 answered.

Answered: q1, q2, q3, q4, q5, q6, q7, q8, q9, q10.
Remaining: none.

## Convergence Trend

Last 3 newInfoRatio values: 0.8 -> 0.66 -> 0.55.
Threshold: 0.05 (telemetry only under max-iterations policy).

## Dead Ends

- hermes -z as the fan-out dispatch shape (iteration 1)
- Exit-code-only success detection (iteration 1)
- hermes -z as the fan-out dispatch shape (iteration 1)
- Exit-code-only success detection (iteration 1)
- hermes -z as fan-out dispatch shape (iteration 1)
- exit-code-only success detection (iteration 1)
- Porting OAuth credentials from pi/opencode/codex auth stores into Hermes (iteration 2)
- Assuming any provider reachable before credential config (iteration 2)
- porting OAuth credentials between runtime auth stores (iteration 2)
- dispatching before credential configuration (iteration 2)
- hermes skills check as the project-skill load-result reporter (iteration 3)
- Per-file symlinks into .opencode/skills from .hermes (iteration 3)
- Carrying the trust grant inside the repo .hermes folder (iteration 3)
- hermes skills check as project-skill load reporter (iteration 3)
- per-file symlinks into .opencode/skills (iteration 3)
- repo-carried trust grant (iteration 3)
- Adding Hermes-standard frontmatter (60-char desc, metadata.hermes.*) to all 174 repo skills as a load precondition (iteration 4)
- mass frontmatter retrofit as load precondition (iteration 4)
- hermes import-agent claude-code in the integration plan (iteration 5)
- 13 profiles for the repo's 13 agents (iteration 5)
- Direct slash-command registration for .opencode/commands (iteration 5)
- hermes import-agent in the integration plan (iteration 5)
- profiles as personas (iteration 5)
- direct slash-command registration (iteration 5)
- Shell hooks as the repo carrier for guard cores (iteration 6)
- Agent Plugins v1 as the first bridge (iteration 6)
- Re-implementing guard cores inside a Hermes plugin (iteration 6)
- shell hooks as repo carrier (iteration 6)
- Agent Plugins v1 first (iteration 6)
- re-implementing guards in plugin (iteration 6)
- hermes mcp serve as an integration goal (iteration 7)
- Repo-carried MCP config like the six runtimes (iteration 7)
- hermes mcp serve as integration goal (iteration 7)
- repo-carried MCP config (iteration 7)
- Env-inheritance-based nesting detection (iteration 8)
- Treating --yolo as a preventive sandbox (iteration 8)
- Treating ~/.hermes writes as containment-relevant (iteration 8)
- env-inheritance nesting detection (iteration 8)
- --yolo as sandbox (iteration 8)
- ~/.hermes writes as containment-relevant (iteration 8)
- hermes pause as a fan-out containment control (iteration 9)
- Assuming background subsystems need killing per dispatch (iteration 9)
- Terminal-backend confinement (docker/ssh) in phase 1 (iteration 9)
- hermes pause as containment control (iteration 9)
- killing background subsystems per dispatch (iteration 9)
- terminal-backend confinement in phase 1 (iteration 9)
- Standalone 006 and 008 phases (iteration 10)
- Splitting any candidate phase (iteration 10)
- Phase 009 before the operator credential step (iteration 10)
- standalone 006 and 008 phases (iteration 10)
- splitting candidate phases (iteration 10)
- 009 before operator credential step (iteration 10)

## Blocked Stops

None.

## Graph Convergence

No graph events persisted (iteration records carried no graphEvents).

## Next Focus

None — all ten angles answered. Proceed to synthesis.
