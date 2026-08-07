# Iteration 001 — Correctness: cli-opencode SKILL agent taxonomy

## Focus

Checked whether `cli-opencode/SKILL.md` still describes the pre-phase-010 direct `ai-council` route.

## Findings

### F001 — P1 — `cli-opencode/SKILL.md` still lists `ai-council` as directly invokable

`cli-opencode/SKILL.md` says primary agents directly invokable via `--agent` include `ai-council` at line 31 and repeats that `ai-council` is a primary at line 285. Current runtime truth is `.opencode/agents/ai-council.md:4` with `mode: subagent`; phase 010 explicitly says direct `opencode run --agent ai-council` is now rejected and Task-dispatch remains the supported path. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:31] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:285] [SOURCE: .opencode/agents/ai-council.md:4] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]

## Verdict Rationale

This is a P1 because it teaches a command path that the current runtime rejects.

Review verdict: CONDITIONAL
