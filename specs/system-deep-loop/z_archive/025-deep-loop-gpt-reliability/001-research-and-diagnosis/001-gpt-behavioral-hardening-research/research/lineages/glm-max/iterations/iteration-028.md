# Iteration 28: Cross-Runtime Mirror Parity Impact (KQ8 deepening)

**Focus track:** synthesis | **Status:** thought

## Focus
Assess how cross-runtime mirror parity (Claude/Codex) affects the recommendations and which mirrors are mandatory vs deferred (analytical, builds on ../001 §8).

## Findings
- **Claude mirrors (.claude/agents/{orchestrate,deep,ai-council}.md) MUST receive the KQ4/KQ7/KQ8 edits — otherwise Claude parity breaks and the hardening only helps GPT in one runtime (../001 §8). Each in-scope path from iter 20 has a .claude mirror counterpart.** [SOURCE: ../001/research.md §8; .claude/agents/*.md; iter 20]
- **Codex parity (.codex/agents or .opencode/agents/*.toml) remains BLOCKED by the TOML-location contradiction (../001 §8) and is explicitly out of scope for this work — no recommendation depends on Codex parity to be correct.** [SOURCE: ../001/research.md §8; iter 20 (ruled out)]
- **The KQ5 plugin lives in system-skill-advisor which is runtime-shared metadata, so it covers all runtimes that consume the advisor hook — a single implementation serves OpenCode + Claude (both consume the hook per AGENTS.md Gate 2).** [SOURCE: AGENTS.md GATE 2; mode-registry.json:10-16; iter 14]
- **Mirror work is mechanical (copy the same header/rule to the .claude counterpart) and should be bundled into each prompt-layer phase, not a separate phase. The risk is drift, mitigated by the registry drift-guard pattern (mode-registry.json:16).** [SOURCE: mode-registry.json:16; ../001/research.md §8]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md §8
- .claude/agents/*.md
- AGENTS.md GATE 2
- mode-registry.json:10-16
- iter 14,20

## Assessment
- **newInfoRatio:** 0.22
- **Novelty justification:** Confirms Claude mirrors are mandatory-and-bundled, Codex deferred, and the plugin is runtime-shared — no separate mirror phase needed.
- **Confidence:** 0.80
- **Key questions considered:** KQ8
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Bundling mirrors into each phase avoids drift and a separate phase.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Residual risk consolidation and explicit deferrals before the phase breakdown.
