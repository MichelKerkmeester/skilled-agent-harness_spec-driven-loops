---
title: "Research Synthesis: Deep AI Council Iterative Multi-Topic Architecture"
description: "Synthesis for packet 129/001 architecture research."
trigger_phrases:
  - "deep ai council research synthesis"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "129/001 research synthesis authored"
    next_safe_action: "dispatch F1 -- 129/002 runtime primitive extraction"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000007"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Synthesis: Deep AI Council Iterative Multi-Topic Architecture

<!-- ANCHOR:research -->

**Packet:** 129/001  
**Date:** 2026-05-23  
**Convergence:** Complete for architecture handoff  
**Primary recommendation:** Hybrid runtime reuse. Extend `deep-loop-runtime` infrastructure; keep council semantics in `deep-ai-council`.

## 1. Current State Map

Current `deep-ai-council` is a planning-only skill with packet-local `ai-council/**` persistence. The skill routes council planning, artifact persistence, recovery/audit, convergence checks, scoring, failure handling, and graph support through references and deterministic scripts. Its common case is one in-CLI round; extra CLIs are staged as dedicated additional rounds.

The current artifact tree is flat:

```text
ai-council/
|-- ai-council-config.json
|-- ai-council-strategy.md
|-- ai-council-state.jsonl
|-- seats/round-NNN/*.md
|-- deliberations/round-NNN.md
|-- critiques/round-NNN-critique.md
|-- failed/round-NNN-<timestamp>/
|-- council-report.md
```

Evidence: `.opencode/skills/deep-ai-council/SKILL.md:297`, `.opencode/skills/deep-ai-council/references/folder_layout.md:25`, `.opencode/skills/deep-ai-council/references/state_format.md:15`. <ref_file file=".opencode/skills/deep-ai-council/SKILL.md" lines="297" />

## 2. Target Architecture

Target state hierarchy is three levels: session -> topic -> round.

```text
ai-council/
|-- council-session.json
|-- council-session-state.jsonl
|-- council-findings-registry.json
|-- topics/
|   |-- topic-001-<slug>/
|   |   |-- topic-config.json
|   |   |-- topic-state.jsonl
|   |   |-- rounds/round-001/
|   |   |   |-- round-state.jsonl
|   |   |   |-- seats/*.md
|   |   |   |-- deliberation.md
|   |   |   |-- critique.md
|   |   |-- topic-report.md
|-- session-report.md
```

The session tracks topic list, max topics, registry path, and status. Each topic tracks its own max rounds and convergence state. Each round tracks one CLI boundary, seats, adjudicator verdict, and delta from the prior round.

Evidence: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:51`, `.opencode/skills/deep-ai-council/SKILL.md:34`.

## 3. Convergence Semantic

Use adjudicator-verdict stability rather than severity ratio or newInfoRatio. Each round emits structured verdict fields: recommended option, confidence, blocking disagreements, material risks, and decision axes. The delta from round N to N+1 is weighted:

```text
verdict_delta =
  0.35 * option_changed +
  0.20 * confidence_delta +
  0.20 * risk_jaccard_delta +
  0.15 * axis_flip_rate +
  0.10 * blocking_delta
```

A topic can stop when two consecutive round deltas are `<= saturation_threshold`, max rounds are reached, all seats fail, or unresolved critical disagreement remains after max rounds. The existing two-of-three rule remains a round-level ingredient, not the whole multi-round convergence contract.

Evidence: `.opencode/skills/deep-ai-council/SKILL.md:16`, `.opencode/skills/deep-ai-council/SKILL.md:18`, `.opencode/skills/deep-ai-council/references/convergence_signals.md:21`, `.opencode/skills/deep-ai-council/references/convergence_signals.md:29`.

## 4. Cost Guard Defaults

Defaults:

| Guard | Default | Justification |
|-------|---------|---------------|
| `max_rounds_per_topic` | 3 | Existing helper default and enough for independent extraction, critique, reconciliation. |
| `max_topics_per_session` | 5 | Keeps a session broad enough for an architecture packet without becoming a project tracker. |
| `saturation_threshold` | 0.2 | Council-specific stability delta, already documented in the renamed skill. |
| `seats_per_round` | 3 | Existing seat diversity maximum and default. |

The upper bound at defaults is 45 seat outputs, but stable verdict deltas should stop earlier. `/deep:ask-ai-council :auto` must surface this upper bound before dispatch.

Evidence: `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:18`, `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md:166`, `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js:30`, `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:83`.

## 5. Runtime Boundary Decision

Recommendation: extend `deep-loop-runtime`; do not create a peer `council-runtime`.

Pros of extending `deep-loop-runtime`:

- Reuses existing atomic state, JSONL repair, loop lock, executor audit, prompt-pack, validation, permissions gate, scorer, and fallback routing.
- Matches packet 130's hybrid strategy: shared primitives, distinct entrypoints.
- Avoids a third runtime package with duplicated tests and docs.

Cons:

- Requires docs to broaden `deep-loop-runtime` from two consumers to deep-* consumers.
- Requires council-specific convergence modules to avoid threshold/default leakage.

Pros of a peer `council-runtime`:

- Clear ownership boundary for council.
- No risk of affecting review/research runtime modules.

Cons:

- Premature package split.
- Duplicates low-level primitives.
- Adds another runtime surface to maintain before council has enough code to justify it.

Evidence: `.opencode/skills/deep-loop-runtime/SKILL.md:20`, `.opencode/skills/deep-loop-runtime/SKILL.md:125`, `.opencode/skills/deep-loop-runtime/SKILL.md:191`, `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:195`.

## 6. Findings Registry Shape

Use `ai-council/council-findings-registry.json`.

Canonical fingerprint:

```text
council:{topic_slug}:{claim_slug}
```

Canonical content hash:

```text
sha256(topic_id + "\u001f" + finding_type + "\u001f" + normalized_claim_120chars)
```

Registry entries include `fingerprint`, `content_hash`, `topic_id`, `round_id`, `finding_type`, `claim`, `stance`, `confidence`, `source_artifacts`, `introduced_at`, `last_seen_at`, and `superseded_by`. Later topics receive priors by fingerprint reference plus concise claim/stance/confidence/source fields.

Evidence: `.opencode/skills/deep-review/SKILL.md:512`, `.opencode/skills/deep-review/SKILL.md:524`, `.opencode/skills/deep-research/SKILL.md:265`, `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md:78`.

## 7. Workflow YAML / Command Surface Design

Add `/deep:ask-ai-council` with `:auto` and `:confirm`.

Setup fields:

- `deliberation_topics`
- `spec_folder`
- `execution_mode`
- `max_rounds_per_topic`
- `max_topics_per_session`
- `saturation_threshold`
- `seats_per_round`
- `executor`

`deep-council.md` should mirror deep-review/deep-research command-owned workflow discipline: no ad hoc loop dispatcher, YAML owns state, LEAF seats produce required artifacts, reducer refreshes registry/dashboard/session report, and command gates decide continue/stop.

Evidence: `.opencode/skills/deep-review/SKILL.md:57`, `.opencode/skills/deep-review/SKILL.md:68`, `.opencode/skills/deep-research/SKILL.md:60`, `.opencode/skills/deep-research/SKILL.md:71`.

## 8. Cross-Runtime Sync Requirements

Schema or output changes require lockstep updates across:

- `.opencode/agents/ai-council.md`
- `.claude/agents/ai-council.md`
- `.codex/agents/ai-council.toml`
- `.gemini/agents/ai-council.md`

The post-115 skill is named `deep-ai-council`, while current mirror files still identify the agent as `ai-council`. Phase 005 must decide whether the runtime mirror agent identity changes to `deep-ai-council` or remains an agent alias that routes to the renamed skill. Either path must update orchestrator references and mirror parity tests.

Evidence: `.opencode/skills/deep-ai-council/references/output_schema.md:126`, `.opencode/skills/deep-ai-council/references/output_schema.md:129`, `.opencode/agents/ai-council.md:2`, `.claude/agents/ai-council.md:2`, `.codex/agents/ai-council.toml:3`, `.gemini/agents/ai-council.md:2`.

## 9. Affected File Surface

Downstream packets 002-006 should expect at least these files:

| File | Phase | Change |
|------|-------|--------|
| `.opencode/skills/deep-loop-runtime/SKILL.md` | 002 | Document third consumer ownership. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | 002 | Ensure state helper supports council paths. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | 002 | Reuse for session/topic/round JSONL. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | 002 | Lock council session reducers. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts` | 002 | Guard council write scopes. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | 002 | Add council round audit metadata. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` | 002 | Render council round prompt packs. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | 002 | Validate seat artifacts and JSONL deltas. |
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | 003-004 | Add hierarchical writers. |
| `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs` | 003-004 | Preserve wrapper compatibility. |
| `.opencode/skills/deep-ai-council/references/folder_layout.md` | 003-004 | Document session/topic/round layout. |
| `.opencode/skills/deep-ai-council/references/state_format.md` | 003-004 | Add session/topic/round event schemas. |
| `.opencode/skills/deep-ai-council/references/convergence_signals.md` | 003 | Add verdict-delta formula. |
| `.opencode/skills/deep-ai-council/references/command_wiring.md` | 005 | Add `/deep:ask-ai-council` wiring. |
| `.opencode/skills/deep-ai-council/SKILL.md` | 005-006 | Document deep mode, defaults, and invariants. |
| `.opencode/commands/deep/ask-ai-council.md` | 005 | New command entrypoint. |
| `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` | 005 | Auto workflow. |
| `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml` | 005 | Confirm workflow. |
| `.opencode/agents/ai-council.md` | 005 | Mirror/alias update. |
| `.claude/agents/ai-council.md` | 005 | Mirror update. |
| `.codex/agents/ai-council.toml` | 005 | Mirror update. |
| `.gemini/agents/ai-council.md` | 005 | Mirror update. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` | 006 | Add parity invariants. |
| `.opencode/skills/deep-ai-council/tests/**` | 006 | Add cost and persistence tests. |

## 10. Recommendation: Phase Decomposition for 002-006

002 Runtime primitive extraction:
Extend shared runtime primitives and tests. Do not write orchestration behavior yet.

003 Per-topic multi-round orchestration:
Implement topic-local round loop, seat dispatch contracts, verdict-delta scoring, and max-round stop.

004 Multi-topic session and findings registry:
Implement session loop, topic management, `council-findings-registry.json`, cross-topic priors, and session report.

005 Command and skill wiring:
Add `/deep:ask-ai-council :auto|:confirm`, workflow YAML, skill docs, command docs, and four runtime mirror sync.

006 Parity tests, cost guards, and docs:
Add advisor parity tests from packet 130 invariants, cost guard tests, migration docs, changelog, and strict validation.

<!-- /ANCHOR:research -->
