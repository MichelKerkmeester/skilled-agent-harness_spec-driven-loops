DEEP-RESEARCH
Resolved route: mode=research target_agent=deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## State

Session: fanout-luna-advocate-1791120151016-ksetij
Research topic: how should this repository's repo rules (.skilled/repo-rules/, 13 files, about 27k tokens) be written and loaded to change model behaviour, and at what context cost?
Iteration: 1 of 2
Focus area: Is loading every repository rule affordable, given per-session and per-compaction token load, caching, compression, and information loss?
Remaining key questions:
- What does a full load of the repository rules cost per session and per compaction window?
- How does prompt caching affect input cost versus context occupancy?
- What compression range is plausible, and what behavior does compression risk losing?
- Which cross-lineage claims survive adversarial review?

## State files

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/deep-research-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/iterations/iteration-001.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/deltas/iter-001.jsonl

## Steering

Answer only: is loading every rule affordable? Give both the case for and the case against. Include full-load token math per session and per compaction window, prompt caching (cost versus context occupancy), a sourced compression range, and the information compression loses. Cite every factual claim to file:line or label calculations ASSUMPTION with a basis. Mark unmeasured figures UNKNOWN.

## Read-only boundary

Repository source files are read-only. All writes, including this prompt, stay under the lineage directory above. Do not invoke a nested executor, reducer, validator, Git write, or memory generator. Record findings only.
