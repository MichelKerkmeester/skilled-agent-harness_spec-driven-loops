---
title: "Feature Specification: Deep AI Council — Iterative Multi-Topic Skill Upgrade"
description: "Upgrade sk-ai-council from single-round single-topic deliberation to deep-loop iterative + multi-topic with shared findings DB, mirroring deep-review/deep-research convergence semantics."
trigger_phrases:
  - "deep ai council"
  - "iterative council"
  - "multi-topic council"
  - "council deep loop"
  - "sk-ai-council upgrade"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent + 001 research-and-architecture child"
    next_safe_action: "Run /spec_kit:deep-research or sk-ai-council on 001 research phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-ai-council/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Reuse vs extend deep-loop-runtime — shared library or new council-runtime peer?"
      - "Findings registry schema — borrow deep-review's directly or specialize for opinion-shaped findings?"
      - "Cost-guard defaults — max_rounds_per_topic, max_topics_per_session, saturation threshold."
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose only; heavy docs live in child phase folders. -->

# Feature Specification: Deep AI Council — Iterative Multi-Topic Skill Upgrade

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet) |
| **Predecessor** | `124-sk-ai-council-shared-runtime-deliberation` (verdict HYBRID — re-deliberation trigger now met) |
| **Successor** | None |
| **Handoff Criteria** | Phase children pass independently; final implementation ships /spec_kit:deep-council + iterative sk-ai-council |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-ai-council today is single-round + single-topic: one council deliberation = 4 seats × 1 round → one council-report.md. Operators repeatedly trigger fresh councils for related strategic questions across a session, but findings never accumulate, follow-up rounds aren't supported, and each session loses the priors from prior topics. Compared to deep-review and deep-research, which both have iteration + finding-accumulation + saturation-based convergence, AI Council lacks the "deep" infrastructure even though its core deliberation loop is structurally identical.

### Purpose
Upgrade sk-ai-council into a deep skill with: (a) iterative rounds within a single topic until adjudicator-verdict stability, (b) multi-topic sessions where each new topic reads prior topics' findings as priors, (c) session-wide findings registry keyed by canonical fingerprint, (d) cost-guards (max rounds per topic, max topics per session, saturation threshold).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Iteration semantics: multi-round deliberation within a topic, adjudicator scores Round-N→N+1 stability + saturation, convergence when stability ≥ threshold OR max-rounds reached.
- Multi-topic session support: one spec folder hosts N topics, each topic has its own rounds/seats, cross-topic findings registry persists across topics.
- Findings registry: canonical fingerprint schema mirroring deep-review/deep-research (`{angle}:{topic-slug}:{claim-slug}`), de-dup, cross-topic linking.
- Saturation/novelty detection: per-topic AND session-level; reuse deep-loop-runtime primitives where shape matches.
- Cost guards: `max_rounds_per_topic` (default 3), `max_topics_per_session` (default 5), `saturation_threshold` (default 0.2).
- New `/spec_kit:deep-council` command (or extended `/spec_kit:ai-council :deep` mode) wiring with auto/confirm setup parity.
- Reuse of `deep-loop-runtime` primitives (loop-lock, jsonl-repair, atomic-state, executor-audit) where applicable.
- Refresh of sk-ai-council SKILL.md to document deep-mode invariants.

### Out of Scope
- Replacing the single-round single-topic council mode (kept for short deliberations).
- Refactoring deep-loop-runtime itself — only consume its primitives. Extensions to runtime live in a separate packet.
- Live cross-runtime council orchestration (e.g. running seats simultaneously across Claude Code + Codex) — keeps existing one-CLI-per-round invariant.

### Files to Change (high-level, per-phase detail in children)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-ai-council/SKILL.md` | Modify | 002-006 | Add deep-mode section + iterative invariants |
| `.opencode/skills/sk-ai-council/assets/*.yaml` | Modify | 002, 003 | Add deep workflow YAML alongside existing single-round YAML |
| `.opencode/commands/spec_kit/deep_council.md` (or extended ai_council) | Create | 005 | New entrypoint or extended mode suffix |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/*` | Modify | 004 | Extend schema for council-findings rows if shared |
| `.opencode/skills/deep-loop-runtime/tests/...` | Create | 006 | Parity tests covering council-specific saturation |
| `.opencode/specs/skilled-agent-orchestration/129-*/00N-*/` | Create | All | Phase child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-and-architecture-design/` | Deep-research the deep-council architecture: schemas, convergence, reuse boundary with deep-loop-runtime, cost-guard defaults, migration path from single-round | Planned |
| 002 | `002-extract-or-extend-runtime-primitives/` | Decide: extend deep-loop-runtime in place vs ship council-runtime peer skill. Implement shared loop-lock/jsonl-repair consumption. | Pending 001 |
| 003 | `003-implement-iteration-orchestration/` | Per-topic multi-round orchestration: seat dispatch, stability scoring, convergence detection. | Pending 002 |
| 004 | `004-implement-multi-topic-session-and-findings-registry/` | Session-wide topic loop, cross-topic findings registry, fingerprint canonicalization, priors injection into Round-1 seats. | Pending 003 |
| 005 | `005-command-and-skill-wiring/` | `/spec_kit:deep-council` (or extended `:deep` mode) + sk-ai-council SKILL.md deep-mode invariants + auto/confirm setup parity. | Pending 004 |
| 006 | `006-parity-tests-and-cost-guards-and-docs/` | Vitest parity, cost-guard enforcement tests, sk-ai-council changelog, runbook. | Pending 005 |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume .opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Architecture decision recorded (extract vs extend), schemas drafted | `decision-record.md` ADRs ≥ 4; deep-research convergence ≥ 0.80 |
| 002 | 003 | Runtime primitives consumable from council asset code path | Compile + import test green |
| 003 | 004 | Single-topic multi-round loop reaches convergence on fixture | Vitest fixture `council-iteration.vitest.ts` PASS |
| 004 | 005 | Multi-topic session with priors-injection works end-to-end | Vitest `council-multi-topic.vitest.ts` PASS |
| 005 | 006 | New command surface accepts `:deep` mode; setup contract honored | E2E dispatch test PASS |
| 006 | done | Cost-guard tests + parity tests + docs all green; strict validate exit 0 | Package validate + skill validate green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should deep-council write a single `council-report.md` per topic OR one session-wide synthesis that references per-topic reports?
- Stability scoring — adjudicator self-score, structural diff of advocate positions, OR Bayesian convergence from deep-loop-runtime's existing scorer?
- Findings-registry sharing across deep-review/deep-research/deep-council — one shared schema or three specialized?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Predecessor**: `../124-sk-ai-council-shared-runtime-deliberation/` (HYBRID verdict; deep-council is the 3rd consumer that triggers re-deliberation).
- **Sibling**: `../130-deep-skills-unique-value-differentiation/` (analysis of overlap between deep-review, deep-research, deep-council).
- **Reference skill**: `.opencode/skills/sk-ai-council/SKILL.md`
- **Runtime peer**: `.opencode/skills/deep-loop-runtime/SKILL.md`
