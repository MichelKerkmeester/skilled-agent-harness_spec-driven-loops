# Iteration 6: Countertest of the optional sk-code pointer

## Focus

Test the iteration-5 recommendation against the strongest cases for no integration and for a larger integration. The strategy names Q6 as the next focus, and prior iterations 1–5 provide the evidence base.

## Actions Taken

- Read the required config, state projection, strategy, and Q6 registry entry before selecting the focus. The supplied iteration-006 and iter-006 paths were absent and resolve inside this packet.
- Rechecked the current code-search decision tree, sk-code routing, external Skilled install surface, and restraint rule against the findings from iterations 1–5.
- Compared the no-integration case and the larger Code Mode/doctor alternatives using the existing research. No tool was installed, no benchmark was run, and no upstream source was changed.

## Findings

1. **No integration is the strongest current decision if the bar is demonstrated user need.** The existing code-search tree already covers exact identifiers, known paths, and unfamiliar code through search, path mapping, and confirmation. Prior evidence says Sweet Search adds hybrid ranked code navigation, but the benefit for markdown, skills, and spec folders is unmeasured, while exact phrase lookups already have a literal-search path. The checked-in evaluation does not establish that Skilled users need this extra discovery route, and iteration 5 did not install or measure it. This supports deferring a Skilled change until an adopter reports a concrete retrieval gap. That decision is an inference from the stated scope and available measurements; an observed Skilled task where the existing route failed and Sweet Search succeeded would change it. [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:228] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:40]

2. **The optional pointer has low implementation cost, but it does not lower adoption cost and may spend attention on every code query.** The sk-code advisor receives every code query, and external installs always link the shared .skilled tree, so this is a real distribution point. However, the user still has to install the CLI, initialize each project, build its first index, and meet the Node and platform requirements. A note in the shared query path can therefore advertise a tool without removing the main friction. The attention cost is an inference from the shared routing location, not a measured distraction. [SOURCE: .skilled/skills/sk-code/SKILL.md:72] [SOURCE: INSTALL-SKILLED.md:132] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:19]

3. **A slightly larger integration has no present failure to fix.** A Code Mode manual would require separate UTCP configuration in addition to Sweet Search's native MCP setup; a doctor flow would duplicate upstream initialization, health, and removal behavior. Neither option has evidence of a current user failure that the passive pointer or existing search path cannot handle. Under the repository restraint rule, there is no climbing sentence for that added setup and maintenance today. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-003.md:19] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:18] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:22] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45]

## Questions Answered

- Q6: What is the strongest case against the iteration-5 recommendation (one optional sk-code pointer), and does any evidence from iterations 1-5 contradict it? Consider whether the right answer is no integration at all, or a slightly bigger one.

## Questions Remaining

- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.
- Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?
- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

## Next Focus

Q7: Seek independent evidence for Sweet Search's claimed gains and compare it with built-in agent search and comparable tools.

## SCOPE VIOLATIONS

The config enables progressive synthesis, but this dispatch allowlists only the iteration narrative and delta plus append-gateway writes. The research.md file was absent and was not created or changed.

## Sources Consulted

- AGENTS.md
- .skilled/skills/sk-code/SKILL.md
- .skilled/repo-rules/prevent-overengineering.md
- INSTALL-SKILLED.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-003.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/findings-registry.json

## Assessment

- New information ratio: 0.60. Three findings partially extend prior evidence by testing the recommendation against a no-integration threshold; the 0.10 simplicity bonus reflects resolving that decision without adding new external research.
- Questions addressed: Q6.
- Questions answered: Q6.

## Reflection

- What worked and why: comparing the suggested pointer with the already-supported search path and actual setup costs showed that discoverability is its only immediate benefit.
- What did not work and why: no usage data or independent tool comparison from iterations 1–5 measures whether a Skilled user would adopt the pointer or whether it improves a real task.
- What I would do differently: use Q7 to test the value claim independently before treating either adoption or further integration as warranted.

**Status: insight.** No integration currently survives the skeptical test for a demonstrated user need; the one-line pointer remains the lowest-cost option if a concrete discoverability need is later shown.
