---
title: "Research Iteration 001: Deep AI Council Architecture Investigation"
description: "Evidence-backed architecture investigation for packet 129/001."
trigger_phrases:
  - "deep ai council iter 001"
importance_tier: "important"
contextType: "research"
---

# Research Iteration 001: Deep AI Council Architecture Investigation

**Packet:** 129/001  
**Date:** 2026-05-23  
**Scope:** Architecture research only; no source changes outside packet 129.  
**Verdict:** Proceed with hybrid runtime extension: deep-loop infrastructure reuse plus council-owned semantics.

## Findings

### F01: The renamed skill surface is `deep-ai-council`

The current skill frontmatter names `deep-ai-council`, and its keyword block uses the new name. Packet 129 must reference this name consistently. Evidence: `.opencode/skills/deep-ai-council/SKILL.md:2`, `.opencode/skills/deep-ai-council/SKILL.md:8`.

### F02: Current council is planning-only and packet-local

The skill defines the council as planning-only and keeps artifacts under `ai-council/**`; it explicitly leaves implementation to callers. That means packet 129 should not turn council seats into implementation agents. Evidence: `.opencode/skills/deep-ai-council/SKILL.md:12`, `.opencode/skills/deep-ai-council/SKILL.md:297`, `.opencode/skills/deep-ai-council/SKILL.md:349`.

### F03: Current dispatch is single-round by default but already models round boundaries

The operational mode says the common run is a single in-CLI round, while external CLI use is staged as additional dedicated rounds. This gives packet 129 a ready boundary for round state. Evidence: `.opencode/skills/deep-ai-council/SKILL.md:34`, `.opencode/skills/deep-ai-council/SKILL.md:37`, `.opencode/skills/deep-ai-council/SKILL.md:39`.

### F04: Existing artifact tree is flat packet -> round

Current layout uses `ai-council-config.json`, `ai-council-state.jsonl`, `seats/round-NNN`, `deliberations/round-NNN.md`, optional critiques, failed round folders, and one `council-report.md`. Multi-topic support needs a topic layer between packet session and round. Evidence: `.opencode/skills/deep-ai-council/references/folder_layout.md:25`, `.opencode/skills/deep-ai-council/references/folder_layout.md:30`, `.opencode/skills/deep-ai-council/references/folder_layout.md:38`, `.opencode/skills/deep-ai-council/references/folder_layout.md:44`.

### F05: The state log is append-only and already supports resume

`ai-council-state.jsonl` is append-only, with `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, and audit events. Resume semantics inspect the last completed event. This should be preserved at session, topic, and round levels. Evidence: `.opencode/skills/deep-ai-council/references/state_format.md:15`, `.opencode/skills/deep-ai-council/references/state_format.md:21`, `.opencode/skills/deep-ai-council/references/state_format.md:170`.

### F06: Current persistence helper is parser plus writer, not a deep-session reducer

`persist-artifacts.cjs` is a thin wrapper over `scripts/lib/persist-artifacts.js`; the library parses markdown reports, renders flat artifacts, and writes scoped files. It cannot currently create `topics/topic-NNN/rounds/round-NNN` or session registries. Evidence: `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs:9`, `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:255`, `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:383`, `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:602`.

### F07: Multi-topic hierarchy should be session -> topic -> round

Packet 130 already describes the proposed council state ownership as `session -> topic -> round`, with main loop ownership over council config, topic config, round state, findings registry, and session state. This matches the gap in the current flat artifact layout. Evidence: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:51`.

### F08: Convergence must be council-specific adjudicator-verdict stability

The new skill docs explicitly define default `0.20` for adjudicator-verdict stability and say the threshold scores per-topic Round-N -> Round-N+1 verdict deltas. Deep-review and deep-research thresholds are not interchangeable. Evidence: `.opencode/skills/deep-ai-council/SKILL.md:16`, `.opencode/skills/deep-ai-council/SKILL.md:18`, `.opencode/skills/deep-review/SKILL.md:24`, `.opencode/skills/deep-research/SKILL.md:29`.

### F09: Existing two-of-three agreement stays useful as a round-level signal

The current convergence reference says two of three seats endorsing materially the same plan is enough for v1 when cross-critique adds no high-severity findings. In deep mode, that should feed the adjudicator verdict for a round; it should not be the only multi-round stop condition. Evidence: `.opencode/skills/deep-ai-council/references/convergence_signals.md:21`, `.opencode/skills/deep-ai-council/references/convergence_signals.md:23`.

### F10: Cost guards are necessary because round count and CLI count multiply seat outputs

Seat diversity guidance caps each round at three seats and says additional CLIs become additional rounds. Existing persistence already defaults max rounds to 3. Packet 129 should default to `max_rounds_per_topic=3`, `max_topics_per_session=5`, and `saturation_threshold=0.2`. Evidence: `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:18`, `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:166`, `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:30`.

### F11: `deep-loop-runtime` is the right infrastructure substrate, with ownership ADR

`deep-loop-runtime` owns executor config, prompt pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, Bayesian scoring, fallback routing, and coverage graph helpers. It warns that a new consumer beyond deep-review/deep-research requires a new ownership ADR, which ADR-001 provides. Evidence: `.opencode/skills/deep-loop-runtime/SKILL.md:20`, `.opencode/skills/deep-loop-runtime/SKILL.md:125`, `.opencode/skills/deep-loop-runtime/SKILL.md:191`.

### F12: A peer `council-runtime` would duplicate primitives prematurely

Current runtime architecture exposes reusable libraries through direct script invocation and TypeScript imports. Creating another runtime would duplicate the already shipped `lib/deep-loop` modules before there is enough council-specific runtime code to justify a package. Evidence: `.opencode/skills/deep-loop-runtime/SKILL.md:111`, `.opencode/skills/deep-loop-runtime/SKILL.md:123`, `.opencode/skills/deep-loop-runtime/SKILL.md:228`.

### F13: Findings-registry parity should use canonical fingerprint plus content hash

Deep-review uses a primary `content_hash` for dedup and collapses duplicate findings across dimensions. Deep-research now names `deep-research-findings-registry.json` as canonical. Council should use `council-findings-registry.json` to avoid the naming ambiguity packet 130 flags. Evidence: `.opencode/skills/deep-review/SKILL.md:512`, `.opencode/skills/deep-review/SKILL.md:524`, `.opencode/skills/deep-research/SKILL.md:265`, `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:78`.

### F14: Cross-topic priors must be compact registry references

Later topics should read session-wide prior findings by fingerprint, not by re-injecting whole seat artifacts. The graph support reference also models provenance with artifact paths and content hashes, which fits compact prior injection. Evidence: `.opencode/skills/deep-ai-council/references/graph_support.md:74`, `.opencode/skills/deep-ai-council/references/graph_support.md:82`.

### F15: Workflow command should mirror deep-review/deep-research `:auto` and `:confirm`

Deep-review and deep-research are command-owned loops with YAML workflow ownership, setup answers, state files, and reducer refresh. Deep-council should get `/deep:ask-ai-council :auto|:confirm` rather than ad hoc shell loops. Evidence: `.opencode/skills/deep-review/SKILL.md:57`, `.opencode/skills/deep-review/SKILL.md:68`, `.opencode/skills/deep-research/SKILL.md:60`, `.opencode/skills/deep-research/SKILL.md:71`.

### F16: Four runtime mirrors need lockstep updates

The output schema lockstep rule requires updates to the agent body in all runtime mirrors, the parser, fixtures, and parity tests whenever the schema changes. Current runtime agent files still present `ai-council` agent identities, so phase 005 needs a deliberate mirror sync. Evidence: `.opencode/skills/deep-ai-council/references/output_schema.md:126`, `.opencode/skills/deep-ai-council/references/output_schema.md:129`, `.opencode/agents/ai-council.md:2`, `.claude/agents/ai-council.md:2`, `.codex/agents/ai-council.toml:3`, `.gemini/agents/ai-council.md:2`.

## Recommendation

Proceed with phases 002-006:

1. 002 extracts/adapts runtime primitives from `deep-loop-runtime`.
2. 003 implements per-topic multi-round orchestration.
3. 004 implements multi-topic sessions and `council-findings-registry.json`.
4. 005 wires `/deep:ask-ai-council` and four runtime mirrors.
5. 006 adds parity tests, cost guard tests, and docs.
