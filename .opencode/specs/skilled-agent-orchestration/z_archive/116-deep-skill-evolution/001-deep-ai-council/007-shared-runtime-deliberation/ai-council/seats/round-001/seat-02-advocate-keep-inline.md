---
round: 1
seat: 2
executor: cli-codex
lens: advocate-keep-inline
model: gpt-5.5
reasoning: xhigh
status: complete
timestamp: 2026-05-23T05:04:55Z
simulated: true
---

# Seat 02 - Advocate Keep-Inline

## Position

Keep `sk-ai-council` inline. The current footprint is intentionally a planning LEAF with packet-local artifacts, not a general runtime with multiple production consumers. Extracting now would manufacture a shared-runtime package before the repository has proved the need.

## Argument

The core rule is scoped-write planning. The skill says it keeps council artifacts under `ai-council/**` and leaves implementation to callers (`.opencode/skills/sk-ai-council/SKILL.md:285`). Its NEVER rule forbids application code, authored spec docs, or files outside `ai-council/**` as part of a council run (`.opencode/skills/sk-ai-council/SKILL.md:356`). The agent says the same thing more strongly: it writes and edits only packet-local `ai-council/**`, never shelling out or patching broader files (`.opencode/agents/ai-council.md:27`). That is a tight skill contract, not evidence that orchestration belongs elsewhere.

The active consumer story is thin. Grep shows the main runtime-facing consumers are the `@ai-council` agent itself, the orchestrator route that dispatches `@ai-council` for multi-strategy planning (`.opencode/agents/orchestrate.md:97`), and documentation/examples such as cli-gemini's `@ai-council` delegation (`.opencode/skills/cli-gemini/SKILL.md:251`). The orchestrator explicitly describes post-dispatch helper persistence after the LEAF returns (`.opencode/agents/orchestrate.md:181`). That is one workflow family plus docs, not the cross-workflow pressure that justified deep-loop-runtime.

The runtime boundary is awkward because packet artifacts are the point. The folder layout reference says `ai-council/` is the packet-local home for config, strategy, append-only state, seats, deliberations, failed rounds, and report (`.opencode/skills/sk-ai-council/references/folder_layout.md:19`, `.opencode/skills/sk-ai-council/references/folder_layout.md:37`). Extracting artifact writing into a sibling runtime adds indirection without moving the source-of-truth. Future readers would need to understand the skill, the agent, the runtime, and system-spec-kit graph projection to follow a single council run.

The deep-loop comparison cuts against extraction. Deep-loop-runtime has direct workflow YAML invocations, TypeScript libraries, storage, scripts, and tests (`.opencode/skills/deep-loop-runtime/SKILL.md:111`, `.opencode/skills/deep-loop-runtime/SKILL.md:123`, `.opencode/skills/deep-loop-runtime/SKILL.md:155`). `sk-ai-council` has helper scripts and docs, but its authoritative state is markdown and JSONL inside each packet. A 3-5 week extraction and parity-test effort would be plausible if the same helpers had several live consumers; with only one primary council workflow, ROI is weak.

## Risks of Opposing Positions

Full extraction risks breaking historical packet compatibility and making the council harder to operate. Hybrid is less risky, but it still creates a package that must preserve old parser behavior, output schema, state rows, rollback semantics, and graph replay. The current skill already contains those references in one place (`.opencode/skills/sk-ai-council/SKILL.md:391`, `.opencode/skills/sk-ai-council/SKILL.md:397`, `.opencode/skills/sk-ai-council/SKILL.md:400`). Keep that cohesion until there is real consumer pressure.

## Recommendation

Recommendation: KEEP-INLINE
