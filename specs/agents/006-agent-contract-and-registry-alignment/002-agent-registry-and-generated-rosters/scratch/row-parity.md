# Row parity: every current roster row, before conversion

Taken at commit 0a72104ead. Forty-four cells: eleven agents by four rosters. `absent` marks a roster that leaves the agent out today.

## Routing table (orchestrate.md, Agent Selection)

| Priority | Task Type | Agent | Tier | Skills | subagent_type |
|---|---|---|---|---|---|
| 1 | ALL codebase exploration, file search, pattern discovery, context loading | `@context` | LEAF | Trigger index lookup, Glob, Grep, Read | `"context"` |
| 2 | Evidence / iterative investigation | `@deep-research` | LEAF | `system-spec-kit`, `deep-research` | `"deep-research"` |
| 3 | Multi-strategy planning and architecture synthesis | `@ai-council` | LEAF | Multi-lens planning rubric (planning-only) | `"ai-council"` |
| 4 | `/create:*` documentation and component creation command execution | `@markdown` | LEAF | `sk-doc`, `system-spec-kit` when spec tracking applies | `"markdown"` |
| 5 | Code review / security | `@review` | LEAF | `sk-code` code-review mode (findings-first baseline + router-selected surface evidence) | `"review"` |
| 6 | Deep-loop iterative code-audit pass (`/deep:review` only — explicit deep-loop convergence request, not a one-shot review) | `@deep-review` | LEAF | `system-spec-kit`, `deep-review` | `"deep-review"` |
| 7 | Implementation / testing | `@code` | LEAF | `sk-code` (stack-agnostic; sk-code performs detection at dispatch time); orchestrator dispatches `@review` separately for formal review | `"code"` |
| 8 | Debugging when `failure_count >= 3` — workflow surfaces a prompted offer; user opts in via the runtime's delegation tool. Never auto-dispatched. | `@debug` | LEAF | Code analysis tools | `"debug"` |
| 9 | External CLI execution — ONLY when the user names an executor; never auto-selected | `cli-<mode>` via the `cli-external-orchestration` hub | LEAF | `cli-external-orchestration` → the named `cli-X` packet | n/a (external process) |

## Leaf list (orchestrate.md, Agent Tier Classification)

| Tier | Dispatch Authority | Who |
|---|---|---|
| **LEAF**         | MUST NOT dispatch any sub-agents | @context, @code, @markdown, @ai-council, @review, @debug, @deep-research, @deep-review |

## Agent files table (orchestrate.md)

| Agent | Notes |
|---|---|
| @context | Sub-agent with direct retrieval only. Routes ALL exploration tasks |
| @markdown | Template-first documentation executor for `/create:*`, scoped markdown, and spec-doc authoring |
| @deep-research | LEAF agent; iterative autonomous research loop with externalized state |
| @deep-review | LEAF agent; iterative code-audit dimension pass, P0/P1/P2 findings, JSONL state |
| @ai-council | Planning-only multi-strategy architect (max 3 strategies). Post-dispatch responsibility: when @orchestrate dispatches at Depth 1, run `node .skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs <packet>` after the LEAF returns to persist `ai-council/` artifacts (see ai-council persistence protocol). If the LEAF's returned report shows `max_rounds` reached without a converged plan (check `current_round >= max_rounds` in `ai-council-config.json`), add `--not-converged` to that invocation — the helper cannot detect max-round exhaustion on its own and defaults to `convergence:true` otherwise. |
| @review | Codebase-agnostic code review; verdict follows severity, score is advisory |
| @debug | Isolated by design (no conversation context) |
| @code | Application-code LEAF; sk-code stack delegation; D3 convention-floor caller-restriction (`Depth: 1` marker required); fail-closed verify |

## README.txt roster

| Agent | Line |
|---|---|
| ai-council | multi-strategy AI Council planning, writes only ai-council artifacts |
| code | application-code implementation via sk-code, write-capable LEAF dispatched only by orchestrate |
| context | retrieval-first context agent with canonical continuity recovery, read-only |
| debug | user-invoked fresh-perspective debugger, 5-phase root-cause method, never auto-dispatched |
| deep-research | autonomous deep-research iterations with externalized state |
| deep-review | deep-review iteration agent, one dimension per pass with P0/P1/P2 findings |
| design | design specialist across two skills: decides UI values from sk-code-frontend's visual references, measures a live surface into a Style Reference via sk-design-md-generator, LEAF |
| markdown | template-first markdown and documentation executor for /create:* commands and spec docs |
| orchestrate | senior multi-agent orchestration, decomposition, delegation and synthesis |
| prompt-improver | prompt-engineering specialist, framework selection and CLEAR validation |
| review | read-only code-review specialist, pattern validation and quality scoring |

## Presence matrix

| Agent | Routing | Leaf list | Agent files | README |
|---|---|---|---|---|
| ai-council | present | present | present | present |
| code | present | present | present | present |
| context | present | present | present | present |
| debug | present | present | present | present |
| deep-research | present | present | present | present |
| deep-review | present | present | present | present |
| design | absent | absent | absent | present |
| markdown | present | present | present | present |
| orchestrate | absent | absent | absent | present |
| prompt-improver | absent | absent | absent | present |
| review | present | present | present | present |

The registry copies each present cell byte for byte: task type, tier, skills, the agent files note and the README line. Rows for `design` and `prompt-improver` are new, and `orchestrate` gets a record but no routing row, since it does not route to itself.
