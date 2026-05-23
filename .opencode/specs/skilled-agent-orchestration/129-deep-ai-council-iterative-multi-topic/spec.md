---
title: "Feature Specification: Deep AI Council Iterative Multi-Topic Skill Upgrade"
description: "Upgrade deep-ai-council from single-round single-topic deliberation to iterative multi-topic deep mode with shared runtime primitives, session registry, and cost guards."
trigger_phrases:
  - "deep ai council"
  - "iterative council"
  - "multi-topic council"
  - "council deep loop"
  - "deep-ai-council upgrade"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "129 deep-ai-council iterative multi-topic arc COMPLETE"
    next_safe_action: "operator can dispatch /spec_kit:deep-council"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/001-research-and-architecture-design/decision-record.md"
      - ".opencode/skills/deep-ai-council/changelog/v4.0.0.0.md"
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime boundary: extend deep-loop-runtime, do not create council-runtime peer."
      - "Findings registry: use council-findings-registry.json with canonical fingerprint/content_hash."
      - "Cost guards: max_rounds_per_topic=3, max_topics_per_session=5, saturation_threshold=0.2."
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT - root purpose only; heavy docs live in child phase folders. -->

# Feature Specification: Deep AI Council Iterative Multi-Topic Skill Upgrade

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | n/a |
| **Predecessor** | `124-deep-ai-council-shared-runtime-deliberation` |
| **Successor** | None |
| **Handoff Criteria** | Phase children pass independently; final implementation ships `/spec_kit:deep-council` plus iterative `deep-ai-council` mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`deep-ai-council` currently has a flat packet-level council artifact model and common single-round behavior. Operators need deep mode: iterative rounds within a topic, multiple topics in a session, session-wide findings registry, and cost guards comparable in discipline to deep-review/deep-research without copying their convergence semantics.

### Purpose

Upgrade `deep-ai-council` into a deep skill with session -> topic -> round state, adjudicator-verdict stability convergence, cross-topic priors, canonical registry fingerprints, and `/spec_kit:deep-council :auto|:confirm`.

> Phase-parent note: this spec.md is the only authored document at parent level. Detailed planning, tasks, checklists, and decisions live in child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Runtime primitive reuse through `deep-loop-runtime` per 001 ADR-001.
- Per-topic multi-round deliberation with verdict-delta convergence per 001 ADR-003.
- Multi-topic sessions with session-wide registry per 001 ADR-002 and ADR-005.
- Cost guards per 001 ADR-004.
- `/spec_kit:deep-council :auto|:confirm`.
- Four-runtime mirror sync or documented alias strategy.
- Parity tests informed by packet 130 invariants.

### Out of Scope

- Replacing current single-round council mode.
- Changing packet 130 or packet 115.
- Creating a peer `council-runtime` package.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/*` | Modify/Create | 002 | Shared runtime primitive adapters. |
| `.opencode/skills/deep-loop-runtime/tests/**` | Modify/Create | 002 | Runtime primitive tests. |
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | Modify | 003-004 | Hierarchical writers/reducers. |
| `.opencode/skills/deep-ai-council/references/*.md` | Modify | 003-006 | State, folder, convergence, command docs. |
| `.opencode/commands/spec_kit/deep-council.md` | Create | 005 | Command entrypoint. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-council_auto.yaml` | Create | 005 | Auto workflow. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-council_confirm.yaml` | Create | 005 | Confirm workflow. |
| `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.codex/agents/ai-council.toml`, `.gemini/agents/ai-council.md` | Modify | 005 | Runtime mirror sync or alias docs. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` | Modify/Create | 006 | Parity fixtures from packet 130. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-and-architecture-design/` | Architecture research, ADR-001..ADR-005, downstream scaffold | Complete |
| 002 | `002-runtime-primitive-extraction/` | Extend `deep-loop-runtime` primitive surface for council-compatible state/lock/audit/prompt/validation | Pending 001 |
| 003 | `003-per-topic-multi-round-orchestration/` | Topic-local round loop, one-CLI-per-round, verdict-delta convergence | Pending 002 |
| 004 | `004-multi-topic-session-and-findings-registry/` | Session topic loop, `council-findings-registry.json`, cross-topic priors | Pending 003 |
| 005 | `005-command-and-skill-wiring/` | `/spec_kit:deep-council`, YAML workflows, skill docs, four-runtime mirrors | Pending 004 |
| 006 | `006-parity-tests-and-cost-guards-and-docs/` | Packet 130 parity tests, cost guard tests, docs, changelog, recursive validation | Pending 005 |

### Phase Transition Rules

- Each phase must pass `validate.sh --strict` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001 | 002 | ADR-001..ADR-005 recorded and scaffolds created | `validate.sh --strict` on 001 and parent recursive |
| 002 | 003 | Runtime primitives importable and tested | Runtime primitive tests pass |
| 003 | 004 | Single-topic multi-round fixture converges | Council iteration fixture pass |
| 004 | 005 | Multi-topic registry and priors work | Multi-topic fixture pass |
| 005 | 006 | Command surface and mirrors sync | Command and mirror tests pass |
| 006 | done | Cost guard tests, parity tests, docs all green | Recursive strict validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 005: should runtime agent files be renamed to `deep-ai-council`, or should `ai-council` remain an explicit alias for the renamed skill?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase 001 ADRs**: `001-research-and-architecture-design/decision-record.md`
- **Phase 001 synthesis**: `001-research-and-architecture-design/research/research.md`
- **Sibling**: `../130-deep-skills-unique-value-differentiation/`
- **Reference skill**: `.opencode/skills/deep-ai-council/SKILL.md`
- **Runtime peer**: `.opencode/skills/deep-loop-runtime/SKILL.md`
