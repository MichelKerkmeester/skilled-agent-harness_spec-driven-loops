# STEER: deepseek-v4-1-flash-max (4 iterations), LOADING DESIGN
Scope is fixed here. Do not re-derive it.
Question: what should AGENTS.md always carry, what should Gate 5 load, and what role, if any, should a hook have?
Hook constraint: deliver a given rule at most once per compaction window, reset only on a compaction boundary.
Read: AGENTS.md (§2 Gate 5, §8), REPO RULES.md, .skilled/hooks/injection-contract.md,
.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts,
.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (gate3DeliveryMarker, line 364),
specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md.
Options: (1) status quo, (2) short rule cards resident in AGENTS.md with full text on demand, (3) Gate 5 loads cards not full files, (4) a hook injecting cards once per window, (5) load everything.
Per option report: resident tokens, tokens per compaction window, silence condition, dedup mechanism and reset event, runtimes it reaches.
Iteration 1: current load paths and costs. Output: one row per path with trigger, bytes, tokens, citation.
Iteration 2: the five options. Output: five entries, each with the five fields above, every field cited or UNKNOWN.
Iteration 3: hook dedup design. Output: marker name, where it is stored, reset event, runtimes covered and not covered, each cited to the files above.
Iteration 4: Output: one answer per part of the Question line, the evidence for it, and the finding that would change it.

## STEERING for iteration 4 (orchestrator, changed since your last read)
Before answering the Question line, add a section "Runtime caps": for Claude Code, Codex, Devin, Cursor, OpenCode and Pi, the byte cap on the instruction file and its source (config key, doc, or observed). UNKNOWN where unsourced. Known: Devin truncated AGENTS.md at 16,384 bytes in your session, which ends at line 174 and drops §5-§10, including §8.
Use this measured fire count for option 4 (orchestrator, local transcripts, post-2026-09-15): 93 of 265 compaction windows load any rule; those load 3.5 distinct rules on average, median 3, 90th percentile 7.
In your answer for AGENTS.md, say which clauses must sit inside the smallest cap, and give their line numbers today.
