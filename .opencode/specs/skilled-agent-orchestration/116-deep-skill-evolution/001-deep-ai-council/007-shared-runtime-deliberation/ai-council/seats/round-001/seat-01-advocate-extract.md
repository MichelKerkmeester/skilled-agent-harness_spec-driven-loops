---
round: 1
seat: 1
executor: cli-codex
lens: advocate-extract
model: gpt-5.5
reasoning: xhigh
status: complete
timestamp: 2026-05-23T05:04:55Z
simulated: true
---

# Seat 01 - Advocate Extract

## Position

Extract `sk-ai-council` into a shared runtime because the skill has already grown beyond a prose-only planning helper. It now owns packet artifact persistence, append-only state semantics, convergence checks, graph replay, scoped writer code, and caller-facing persistence contracts. The right boundary is a new `.opencode/skills/ai-council-runtime/` that keeps reusable mechanics separate from council strategy and seat persona guidance.

## Argument

The current skill description is already runtime-shaped: "multi-seat planning, artifact persistence, convergence checks, packet-local ai-council outputs" (`.opencode/skills/sk-ai-council/SKILL.md:3`). Its workflow covers persistence, state, seats, deliberations, rollback evidence, and recovery/audit checks (`.opencode/skills/sk-ai-council/SKILL.md:39`, `.opencode/skills/sk-ai-council/SKILL.md:40`). That is more than a prompt guide. It is a small runtime contract embedded in a skill.

The strongest extraction surface is concrete code, not docs. `persist-artifacts.js` parses council reports, renders configs, seats, deliberations, state logs, and reports from one model (`.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:383`, `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:432`). It scopes writes under `ai-council/` and emits audit events for each artifact (`.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:458`, `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:465`). `audit-trail.js` already has reusable JSONL primitives: schema metadata, checksum generation, round normalization, and append helpers (`.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:21`, `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:96`). Those are not council prose; they are runtime utilities.

Deep-loop-runtime shows the payoff of making shared runtime boundaries explicit. It owns deep-loop modules, script entry points, storage, and tests in a peer skill (`.opencode/skills/deep-loop-runtime/SKILL.md:74`, `.opencode/skills/deep-loop-runtime/SKILL.md:155`). Its README says the 118 arc moved state safety primitives, coverage-graph logic, script entry points, storage, and tests out of MCP into the peer skill (`.opencode/skills/deep-loop-runtime/README.md:37`). `sk-ai-council` should follow the same path before its helpers become harder to reason about.

Specific surfaces to extract: council config rendering, state JSONL appenders, scoped artifact write guards, checksum/audit helpers, report parser/renderer, convergence detection, graph replay payload generation, and completion advisory logic. Keep `SKILL.md`, seat diversity guidance, and prompt strategy in `sk-ai-council`; move the mechanics that callers can use without adopting the whole council persona.

## Risks of Opposing Positions

Keep-inline underestimates drift. The agent requires the canonical artifact set before completion (`.opencode/agents/ai-council.md:380`), while non-council callers may still invoke the helper fallback (`.opencode/agents/ai-council.md:708`). That split is already cross-surface enough to justify a shared runtime. Hybrid helps, but delaying orchestration extraction risks multiple call paths recreating parser and convergence rules.

## Recommendation

Recommendation: EXTRACT
