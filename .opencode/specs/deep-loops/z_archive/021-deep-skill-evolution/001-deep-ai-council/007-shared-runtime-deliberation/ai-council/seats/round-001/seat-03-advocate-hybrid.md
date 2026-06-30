---
round: 1
seat: 3
executor: cli-codex
lens: advocate-hybrid
model: gpt-5.5
reasoning: high
status: complete
timestamp: 2026-05-23T05:04:55Z
simulated: true
---

# Seat 03 - Advocate Hybrid

## Position

Use a hybrid boundary. Extract only low-level primitives that are independently reusable: append-only state events, scoped artifact writes, checksums, JSONL parsing, convergence classification, and report parser/rendering. Keep orchestration, seat selection, seat prompts, report authorship, and packet source-of-truth policy inside `sk-ai-council`.

## Argument

The extract seat is right about one thing: there are real primitives here. `audit-trail.js` normalizes metadata, computes checksums, normalizes round IDs, and appends JSONL events (`.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:64`, `.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js:96`). `persist-artifacts.js` guards writes under the council root and emits `artifact_written` events (`.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:445`, `.opencode/skills/sk-ai-council/scripts/lib/persist-artifacts.js:458`). These helpers could be reused by future council graph replay, recovery, completion advisory, or non-agent council callers.

The keep-inline seat is also right: full extraction is not earned. The `sk-ai-council` skill is deliberately planning-only and scoped to packet artifacts (`.opencode/skills/sk-ai-council/SKILL.md:334`, `.opencode/skills/sk-ai-council/SKILL.md:337`). Its graph support is derived, and artifacts win if graph rows disagree (`.opencode/skills/sk-ai-council/references/graph_support.md:31`). Moving orchestration out of the skill would split the core mental model: the council decides, writes packet artifacts, and hands off. That should stay in one place.

The useful precedent from deep-loop-runtime is not "extract everything that looks shared." It is "extract lifecycle-sensitive primitives when ownership is clearer in a runtime." The memory-leak remediation phase added deep-loop locks, JSONL repair, and atomic state because interrupted runs could lose provenance or double-dispatch (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:81`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:120`). Its implementation summary explicitly notes council CommonJS persistence was inspected but not migrated, with council-specific adoption left as a smaller follow-up if required (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/implementation-summary.md:95`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/implementation-summary.md:124`).

So the recommendation is conditional extraction, not immediate full runtime. Start with primitives only if another consumer appears or if state safety work needs a single owner. Leave `SKILL.md`, agent instructions, seat diversity, convergence policy text, and report synthesis in `sk-ai-council`.

## Risks of Opposing Positions

Full extraction creates parity-test debt across historical packets and current helpers. Keep-inline forever risks repeating state/writer utilities if the council graph, orchestrator, or another runtime needs them. Hybrid accepts the real reuse while keeping the domain-specific orchestration local.

## Recommendation

Recommendation: HYBRID
